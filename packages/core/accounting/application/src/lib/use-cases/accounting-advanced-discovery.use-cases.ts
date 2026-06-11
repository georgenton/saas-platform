import {
  AccountingAdvancedNeedType,
  AccountingAdvancedMvpLaneKey,
  AccountingAdvancedMvpLaneStatus,
  AccountingAdvancedMvpOperatingMode,
  AccountingReadinessStatus,
  TenantAccountingAccountantDiscoveryWorkspaceView,
  TenantAccountingAdvancedBankReconciliationMvpWorkbenchView,
  TenantAccountingAdvancedAuditTrailReadinessPacketView,
  TenantAccountingAdvancedDiscoveryAnchorView,
  TenantAccountingAdvancedDiscoveryCloseoutView,
  TenantAccountingAdvancedDiscoveryIntakeView,
  TenantAccountingAdvancedDiscoveryReadinessPacketView,
  TenantAccountingAdvancedLedgerCloseoutMvpWorkbenchView,
  TenantAccountingAdvancedMvpAccountantReviewPacketView,
  TenantAccountingAdvancedMvpCommandCenterView,
  TenantAccountingAdvancedMvpExecutionAnchorView,
  TenantAccountingAdvancedMvpOperatingCloseoutView,
  TenantAccountingAdvancedMvpReadinessCloseoutView,
  TenantAccountingAdvancedMvpScopeDecisionRecordView,
  TenantAccountingAdvancedMvpScopeRegistryView,
  TenantAccountingCertifiedBankEvidenceBoundaryView,
  TenantAccountingFormalNeedsClassifierView,
  TenantAccountingMinimumLedgerCloseoutDesignWorkspaceView,
} from '@saas-platform/accounting-domain';
import { EcuadorTaxPilotDecisionCloseoutV73View } from '@saas-platform/tax-compliance-domain';
import { RequestTenantEcuadorTaxPilotDecisionCloseoutV73UseCase } from '@saas-platform/tax-compliance-application';

type AccountingAdvancedDiscoveryInput = {
  tenantSlug: string;
  period: string;
  year: number;
};

export class GetTenantAccountingAdvancedDiscoveryAnchorUseCase {
  constructor(
    private readonly requestTenantEcuadorTaxPilotDecisionCloseoutV73UseCase: RequestTenantEcuadorTaxPilotDecisionCloseoutV73UseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantAccountingAdvancedDiscoveryAnchorView> {
    const taxCloseout = await this.loadTaxCloseout(input);
    const triggers: TenantAccountingAdvancedDiscoveryAnchorView['triggers'] =
      taxCloseout.discoveryDossier.dossierSections.map((section) => ({
        key: section.key,
        label: section.label,
        status: statusFrom(section.status),
        evidenceRefs: section.evidenceRefs,
        rationale: section.risk,
      }));
    const blockers = [...taxCloseout.blockers];
    const anchorStatus = resolveStatus(
      triggers.map((trigger) => trigger.status),
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      anchorStatus,
      source: 'tax_pilot_decision_v73',
      boundaries: [
        {
          key: 'no_statutory_books',
          label: 'No statutory books',
          status: 'ready',
          guardrail:
            'Discovery 0.1 no genera libros oficiales ni certifica contabilidad.',
        },
        {
          key: 'no_auto_filing',
          label: 'No automatic filing',
          status: 'ready',
          guardrail:
            'El flujo no presenta declaraciones ni reemplaza revision profesional.',
        },
        {
          key: 'accountant_in_loop',
          label: 'Accountant-in-loop',
          status:
            taxCloseout.accountantDecisionRecord.summary.decisionCount > 0
              ? 'ready'
              : 'needs_review',
          guardrail:
            'Toda apertura de Accounting Advanced requiere criterio de contador.',
        },
      ],
      triggers,
      summary: {
        boundaryCount: 3,
        triggerCount: triggers.length,
        blockedTriggerCount: triggers.filter(
          (trigger) => trigger.status === 'blocked',
        ).length,
      },
      blockers: unique(blockers),
      nextStep:
        taxCloseout.finalDecision === 'prepare_accounting_advanced_discovery'
          ? 'Convertir senales Tax 7.3 en intake formal de Accounting Advanced discovery.'
          : 'Mantener discovery como evidencia de no apertura y continuar Tax Compliance.',
      guardrails: [
        'Accounting Advanced Discovery 0.1 observa senales; no abre producto ni ejecuta cierres formales.',
        'La fuente primaria de este slice es Tax Pilot Decision 7.3.',
      ],
    };
  }

  private loadTaxCloseout(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<EcuadorTaxPilotDecisionCloseoutV73View> {
    return this.requestTenantEcuadorTaxPilotDecisionCloseoutV73UseCase.execute({
      ...input,
      recordEvent: false,
    });
  }
}

export class GetTenantAccountingAdvancedDiscoveryIntakeUseCase {
  constructor(
    private readonly getTenantAccountingAdvancedDiscoveryAnchorUseCase: GetTenantAccountingAdvancedDiscoveryAnchorUseCase,
    private readonly requestTenantEcuadorTaxPilotDecisionCloseoutV73UseCase: RequestTenantEcuadorTaxPilotDecisionCloseoutV73UseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantAccountingAdvancedDiscoveryIntakeView> {
    const [anchor, taxCloseout] = await Promise.all([
      this.getTenantAccountingAdvancedDiscoveryAnchorUseCase.execute(input),
      this.requestTenantEcuadorTaxPilotDecisionCloseoutV73UseCase.execute({
        ...input,
        recordEvent: false,
      }),
    ]);
    const dossierItems: TenantAccountingAdvancedDiscoveryIntakeView['intakeItems'] =
      taxCloseout.discoveryDossier.dossierSections.map((section) => ({
        key: `dossier_${section.key}`,
        label: section.label,
        status: statusFrom(section.status),
        source: 'discovery_dossier',
        evidenceRefs: section.evidenceRefs,
        question: section.accountantQuestion,
        owner: 'accountant',
      }));
    const decisionItems: TenantAccountingAdvancedDiscoveryIntakeView['intakeItems'] =
      taxCloseout.accountantDecisionRecord.decisions.map((decision) => ({
        key: `decision_${decision.key}`,
        label: decision.label,
        status: statusFrom(decision.status),
        source: 'accountant_decision_record',
        evidenceRefs: decision.evidenceRefs,
        question: decision.rationale,
        owner:
          decision.decision === 'resolve_in_tax' ? 'tax_operator' : 'accountant',
      }));
    const intakeItems = [
      {
        key: 'tax_closeout_final_decision',
        label: 'Tax closeout final decision',
        status: statusFrom(taxCloseout.closeoutStatus),
        source: 'tax_decision_closeout' as const,
        evidenceRefs: ['tax_pilot_decision_closeout_v73'],
        question: `Confirmar si ${taxCloseout.finalDecision} justifica discovery contable.`,
        owner: 'platform' as const,
      },
      ...dossierItems,
      ...decisionItems,
    ];
    const blockers = unique([...anchor.blockers, ...taxCloseout.blockers]);

    return {
      ...input,
      generatedAt: this.nowProvider(),
      intakeStatus: resolveStatus(
        intakeItems.map((item) => item.status),
        blockers,
      ),
      anchor,
      intakeItems,
      summary: {
        itemCount: intakeItems.length,
        accountantOwnedCount: intakeItems.filter(
          (item) => item.owner === 'accountant',
        ).length,
        taxBacklogCount: intakeItems.filter(
          (item) => item.owner === 'tax_operator',
        ).length,
        blockedItemCount: intakeItems.filter(
          (item) => item.status === 'blocked',
        ).length,
      },
      blockers,
      nextStep:
        intakeItems.some((item) => item.owner === 'accountant')
          ? 'Enviar intake minimo al contador para separar Tax-only de contabilidad formal.'
          : 'Mantener senales en Tax Compliance hasta que exista presion contable formal.',
      guardrails: [
        'El intake organiza preguntas; no crea obligaciones contables ni asientos.',
        'Las decisiones Tax-only siguen perteneciendo a Tax Compliance EC.',
      ],
    };
  }
}

export class GetTenantAccountingFormalNeedsClassifierUseCase {
  constructor(
    private readonly getTenantAccountingAdvancedDiscoveryIntakeUseCase: GetTenantAccountingAdvancedDiscoveryIntakeUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantAccountingFormalNeedsClassifierView> {
    const intake =
      await this.getTenantAccountingAdvancedDiscoveryIntakeUseCase.execute(
        input,
      );
    const classifications: TenantAccountingFormalNeedsClassifierView['classifications'] =
      intake.intakeItems.map((item) => {
        const needType = classifyNeed(item.label, item.question, item.owner);

        return {
          key: `need_${item.key}`,
          label: item.label,
          needType,
          status: item.status,
          evidenceRefs: item.evidenceRefs,
          recommendation: recommendationForNeed(needType),
        };
      });
    const blockers = [...intake.blockers];

    return {
      ...input,
      generatedAt: this.nowProvider(),
      classifierStatus: resolveStatus(
        classifications.map((classification) => classification.status),
        blockers,
      ),
      intake,
      classifications,
      summary: {
        classificationCount: classifications.length,
        formalAccountingCount: classifications.filter(
          (classification) => classification.needType !== 'tax_only',
        ).length,
        taxOnlyCount: classifications.filter(
          (classification) => classification.needType === 'tax_only',
        ).length,
        blockedCount: classifications.filter(
          (classification) => classification.status === 'blocked',
        ).length,
      },
      blockers,
      nextStep:
        classifications.some(
          (classification) => classification.needType !== 'tax_only',
        )
          ? 'Preparar workspace de discovery para preguntas profesionales y scope minimo.'
          : 'Cerrar discovery como Tax-only por ahora.',
      guardrails: [
        'El classifier propone necesidad; la decision final queda en closeout y contador.',
        'Tax-only significa resolver en Tax Compliance, no esconder un riesgo contable.',
      ],
    };
  }
}

export class GetTenantAccountingAccountantDiscoveryWorkspaceUseCase {
  constructor(
    private readonly getTenantAccountingFormalNeedsClassifierUseCase: GetTenantAccountingFormalNeedsClassifierUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantAccountingAccountantDiscoveryWorkspaceView> {
    const classifier =
      await this.getTenantAccountingFormalNeedsClassifierUseCase.execute(input);
    const questions: TenantAccountingAccountantDiscoveryWorkspaceView['questions'] =
      classifier.classifications
        .filter((classification) => classification.needType !== 'tax_only')
        .map((classification) => ({
          key: `question_${classification.key}`,
          label: classification.label,
          status: classification.status,
          priority:
            classification.status === 'blocked'
              ? 'critical'
              : classification.needType === 'formal_books' ||
                  classification.needType === 'period_closeout'
                ? 'high'
                : 'normal',
          question: questionForNeed(classification.needType),
          expectedEvidence: evidenceForNeed(classification.needType),
          owner: 'external_accountant',
          evidenceRefs: classification.evidenceRefs,
        }));
    const blockers = [...classifier.blockers];

    return {
      ...input,
      generatedAt: this.nowProvider(),
      workspaceStatus: resolveStatus(
        questions.map((question) => question.status),
        blockers,
      ),
      classifier,
      questions,
      summary: {
        questionCount: questions.length,
        accountantQuestionCount: questions.filter(
          (question) => question.owner === 'external_accountant',
        ).length,
        criticalQuestionCount: questions.filter(
          (question) => question.priority === 'critical',
        ).length,
        blockedQuestionCount: questions.filter(
          (question) => question.status === 'blocked',
        ).length,
      },
      blockers,
      nextStep:
        questions.length > 0
          ? 'Resolver preguntas criticas con contador antes de preparar MVP Accounting Advanced.'
          : 'No hay preguntas profesionales suficientes para abrir Accounting Advanced.',
      guardrails: [
        'Workspace de discovery: pregunta y evidencia, no ejecucion contable.',
        'El contador externo conserva ownership profesional de criterios formales.',
      ],
    };
  }
}

export class RequestTenantAccountingAdvancedDiscoveryReadinessPacketUseCase {
  constructor(
    private readonly getTenantAccountingAccountantDiscoveryWorkspaceUseCase: GetTenantAccountingAccountantDiscoveryWorkspaceUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantAccountingAdvancedDiscoveryReadinessPacketView> {
    const workspace =
      await this.getTenantAccountingAccountantDiscoveryWorkspaceUseCase.execute(
        input,
      );
    const formalNeedCount =
      workspace.classifier.summary.formalAccountingCount;
    const readinessChecks: TenantAccountingAdvancedDiscoveryReadinessPacketView['readinessChecks'] =
      [
        {
          key: 'tax_decision_anchor',
          label: 'Tax decision anchor',
          status: workspace.classifier.intake.anchor.anchorStatus,
          evidenceRefs: ['tax_pilot_decision_closeout_v73'],
          recommendation: 'Usar Tax 7.3 como evidencia de entrada.',
        },
        {
          key: 'formal_need_signal',
          label: 'Formal need signal',
          status: formalNeedCount > 0 ? 'needs_review' : 'ready',
          evidenceRefs: ['formal_needs_classifier'],
          recommendation:
            formalNeedCount > 0
              ? 'Preparar MVP solo con scope minimo confirmado.'
              : 'No abrir Accounting Advanced sin necesidad formal.',
        },
        {
          key: 'accountant_questions',
          label: 'Accountant questions',
          status:
            workspace.summary.blockedQuestionCount > 0
              ? 'blocked'
              : workspace.summary.accountantQuestionCount > 0
                ? 'needs_review'
                : 'ready',
          evidenceRefs: ['accountant_discovery_workspace'],
          recommendation:
            'Cerrar preguntas profesionales antes de cualquier backlog MVP.',
        },
      ];
    const blockers = [...workspace.blockers];
    const packetStatus = resolveStatus(
      readinessChecks.map((check) => check.status),
      blockers,
    );
    const scopeRecommendation = {
      recommendedAction:
        packetStatus === 'blocked'
          ? ('return_to_tax_hardening' as const)
          : formalNeedCount > 0
            ? ('prepare_mvp' as const)
            : ('do_not_open' as const),
      minimumScope:
        formalNeedCount === 0
          ? ('none' as const)
          : workspace.classifier.classifications.some(
                (classification) =>
                  classification.needType === 'bank_reconciliation',
              )
            ? ('bank_reconciliation' as const)
            : workspace.classifier.classifications.some(
                  (classification) =>
                    classification.needType === 'audit_trail',
                )
              ? ('audit_trail' as const)
              : ('ledger_closeout' as const),
      reason:
        formalNeedCount > 0
          ? 'Existen senales formales que justifican discovery MVP acotado.'
          : 'La evidencia actual se puede resolver dentro de Tax Compliance EC.',
    };

    return {
      ...input,
      generatedAt: this.nowProvider(),
      packetStatus,
      workspace,
      scopeRecommendation,
      readinessChecks,
      summary: {
        checkCount: readinessChecks.length,
        readyCheckCount: readinessChecks.filter(
          (check) => check.status === 'ready',
        ).length,
        blockedCheckCount: readinessChecks.filter(
          (check) => check.status === 'blocked',
        ).length,
        formalNeedCount,
      },
      blockers,
      nextStep:
        scopeRecommendation.recommendedAction === 'prepare_mvp'
          ? 'Traducir scope minimo en backlog MVP Accounting Advanced.'
          : scopeRecommendation.recommendedAction === 'return_to_tax_hardening'
            ? 'Resolver blockers en Tax Compliance antes de reabrir discovery.'
            : 'Documentar no-apertura y continuar Tax Compliance.',
      guardrails: [
        'Readiness packet no crea roadmap automaticamente; solo recomienda scope.',
        'MVP minimo debe mantener accountant-in-loop y no reemplazar certificacion externa.',
      ],
    };
  }
}

export class RequestTenantAccountingAdvancedDiscoveryCloseoutUseCase {
  constructor(
    private readonly getTenantAccountingAdvancedDiscoveryAnchorUseCase: GetTenantAccountingAdvancedDiscoveryAnchorUseCase,
    private readonly getTenantAccountingAdvancedDiscoveryIntakeUseCase: GetTenantAccountingAdvancedDiscoveryIntakeUseCase,
    private readonly getTenantAccountingFormalNeedsClassifierUseCase: GetTenantAccountingFormalNeedsClassifierUseCase,
    private readonly getTenantAccountingAccountantDiscoveryWorkspaceUseCase: GetTenantAccountingAccountantDiscoveryWorkspaceUseCase,
    private readonly requestTenantAccountingAdvancedDiscoveryReadinessPacketUseCase: RequestTenantAccountingAdvancedDiscoveryReadinessPacketUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantAccountingAdvancedDiscoveryCloseoutView> {
    const readinessPacket =
      await this.requestTenantAccountingAdvancedDiscoveryReadinessPacketUseCase.execute(
        input,
      );
    const { workspace } = readinessPacket;
    const { classifier } = workspace;
    const { intake } = classifier;
    const { anchor } = intake;
    const closeoutChecklist: TenantAccountingAdvancedDiscoveryCloseoutView['closeoutChecklist'] =
      [
        check('anchor', 'Discovery anchor', anchor.anchorStatus, [
          'accounting_advanced_discovery_anchor',
        ]),
        check('intake', 'Tax 7.3 intake', intake.intakeStatus, [
          'accounting_advanced_discovery_intake',
        ]),
        check('classifier', 'Formal needs classifier', classifier.classifierStatus, [
          'accounting_formal_needs_classifier',
        ]),
        check('workspace', 'Accountant discovery workspace', workspace.workspaceStatus, [
          'accounting_accountant_discovery_workspace',
        ]),
        check('readiness_packet', 'Discovery readiness packet', readinessPacket.packetStatus, [
          'accounting_advanced_discovery_readiness_packet',
        ]),
      ];
    const blockers = unique([
      ...anchor.blockers,
      ...intake.blockers,
      ...classifier.blockers,
      ...workspace.blockers,
      ...readinessPacket.blockers,
    ]);
    const closeoutStatus = resolveStatus(
      closeoutChecklist.map((item) => item.status),
      blockers,
    );
    const finalDecision =
      readinessPacket.scopeRecommendation.recommendedAction === 'prepare_mvp'
        ? 'prepare_accounting_advanced_mvp'
        : readinessPacket.scopeRecommendation.recommendedAction ===
            'return_to_tax_hardening'
          ? 'return_to_tax_hardening'
          : 'stay_in_tax_compliance';

    return {
      ...input,
      generatedAt: this.nowProvider(),
      closeoutStatus,
      anchor,
      intake,
      classifier,
      workspace,
      readinessPacket,
      closeoutChecklist,
      finalDecision,
      summary: {
        checklistCount: closeoutChecklist.length,
        readyChecklistCount: closeoutChecklist.filter(
          (item) => item.status === 'ready',
        ).length,
        blockedChecklistCount: closeoutChecklist.filter(
          (item) => item.status === 'blocked',
        ).length,
        formalNeedCount: readinessPacket.summary.formalNeedCount,
        accountantQuestionCount: workspace.summary.accountantQuestionCount,
      },
      blockers,
      nextStep:
        finalDecision === 'prepare_accounting_advanced_mvp'
          ? 'Definir backlog MVP de Accounting Advanced desde el scope minimo recomendado.'
          : finalDecision === 'return_to_tax_hardening'
            ? 'Volver a Tax Compliance hardening y repetir discovery cuando bajen blockers.'
            : 'Cerrar decision como no-apertura y continuar Tax Compliance EC.',
      guardrails: [
        'Closeout de discovery decide direccion; no abre producto ni ejecuta contabilidad formal.',
        'Cualquier MVP futuro debe nacer con contador externo como control profesional.',
      ],
    };
  }
}

export class GetTenantAccountingAdvancedMvpScopeRegistryUseCase {
  constructor(
    private readonly requestTenantAccountingAdvancedDiscoveryCloseoutUseCase: RequestTenantAccountingAdvancedDiscoveryCloseoutUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantAccountingAdvancedMvpScopeRegistryView> {
    const discoveryCloseout =
      await this.requestTenantAccountingAdvancedDiscoveryCloseoutUseCase.execute(
        input,
      );
    const lanes = mvpLaneKeys().map((key) =>
      mvpLaneFromDiscovery(key, discoveryCloseout),
    );
    const blockers = [...discoveryCloseout.blockers];

    return {
      ...input,
      generatedAt: this.nowProvider(),
      registryStatus: resolveStatus(
        lanes.map((lane) => lane.readinessStatus),
        blockers,
      ),
      discoveryCloseout,
      lanes,
      summary: {
        laneCount: lanes.length,
        candidateLaneCount: lanes.filter(
          (lane) => lane.status === 'candidate',
        ).length,
        readyForDesignLaneCount: lanes.filter(
          (lane) => lane.status === 'ready_for_design',
        ).length,
        blockedLaneCount: lanes.filter((lane) => lane.status === 'blocked')
          .length,
        outOfScopeLaneCount: lanes.filter(
          (lane) => lane.status === 'out_of_scope',
        ).length,
      },
      blockers,
      nextStep:
        discoveryCloseout.finalDecision === 'prepare_accounting_advanced_mvp'
          ? 'Enviar lanes candidatas al contador para decidir scope MVP.'
          : 'Mantener registry como no-apertura hasta que discovery justifique MVP.',
      guardrails: [
        'Scope registry no abre Accounting Advanced; solo convierte discovery en lanes candidatas.',
        'Cada lane requiere decision profesional antes de pasar a diseno MVP.',
      ],
    };
  }
}

export class GetTenantAccountingAdvancedMvpScopeDecisionRecordUseCase {
  constructor(
    private readonly getTenantAccountingAdvancedMvpScopeRegistryUseCase: GetTenantAccountingAdvancedMvpScopeRegistryUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantAccountingAdvancedMvpScopeDecisionRecordView> {
    const scopeRegistry =
      await this.getTenantAccountingAdvancedMvpScopeRegistryUseCase.execute(
        input,
      );
    const decisions: TenantAccountingAdvancedMvpScopeDecisionRecordView['decisions'] =
      scopeRegistry.lanes.map((lane) => {
        const decision =
          lane.status === 'ready_for_design'
            ? 'approve_for_mvp'
            : lane.status === 'candidate' || lane.status === 'blocked'
              ? 'needs_more_evidence'
              : 'reject_for_now';

        return {
          laneKey: lane.key,
          label: lane.label,
          decision,
          status:
            decision === 'approve_for_mvp'
              ? 'ready'
              : decision === 'needs_more_evidence'
                ? lane.readinessStatus === 'blocked'
                  ? 'blocked'
                  : 'needs_review'
                : 'ready',
          rationale: decisionRationale(lane.key, decision),
          expectedEvidence: mvpLaneEvidence(lane.key),
          risk: mvpLaneRisk(lane.key),
        };
      });
    const blockers = [...scopeRegistry.blockers];

    return {
      ...input,
      generatedAt: this.nowProvider(),
      recordStatus: resolveStatus(
        decisions.map((decision) => decision.status),
        blockers,
      ),
      scopeRegistry,
      decisions,
      summary: {
        decisionCount: decisions.length,
        approvedLaneCount: decisions.filter(
          (decision) => decision.decision === 'approve_for_mvp',
        ).length,
        needsEvidenceLaneCount: decisions.filter(
          (decision) => decision.decision === 'needs_more_evidence',
        ).length,
        rejectedLaneCount: decisions.filter(
          (decision) => decision.decision === 'reject_for_now',
        ).length,
      },
      blockers,
      nextStep:
        decisions.some((decision) => decision.decision === 'approve_for_mvp')
          ? 'Pasar lanes aprobadas a diseno minimo ledger-grade.'
          : 'Recolectar evidencia o cerrar MVP como no-apertura.',
      guardrails: [
        'Decision record simula decision accountant-owned; no certifica ni firma.',
        'Un lane rechazado por ahora puede reabrirse con evidencia nueva.',
      ],
    };
  }
}

export class GetTenantAccountingMinimumLedgerCloseoutDesignWorkspaceUseCase {
  constructor(
    private readonly getTenantAccountingAdvancedMvpScopeDecisionRecordUseCase: GetTenantAccountingAdvancedMvpScopeDecisionRecordUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantAccountingMinimumLedgerCloseoutDesignWorkspaceView> {
    const scopeDecisionRecord =
      await this.getTenantAccountingAdvancedMvpScopeDecisionRecordUseCase.execute(
        input,
      );
    const approvedLanes = scopeDecisionRecord.decisions.filter(
      (decision) => decision.decision === 'approve_for_mvp',
    );
    const designChecks: TenantAccountingMinimumLedgerCloseoutDesignWorkspaceView['designChecks'] =
      [
        {
          key: 'period_boundary',
          label: 'Period boundary',
          status: approvedLanes.length > 0 ? 'ready' : 'needs_review',
          source: 'accounting_advanced_mvp_scope_decision_record',
          requirement: 'Periodo, year y cierre esperado deben quedar fijos.',
        },
        {
          key: 'foundation_evidence',
          label: 'Foundation evidence',
          status: 'ready',
          source: 'accounting_foundation_closeout',
          requirement:
            'Usar journal registry, trial balance, evidence vault y closeout summary como insumos comparativos.',
        },
        {
          key: 'journal_adjustment_boundary',
          label: 'Journal adjustment boundary',
          status: hasApprovedLane(approvedLanes, 'journal_adjustments')
            ? 'needs_review'
            : 'ready',
          source: 'accounting_foundation_journal_registry',
          requirement:
            'Separar recomendaciones internas de asientos oficiales revisados por contador.',
        },
        {
          key: 'professional_review_gate',
          label: 'Professional review gate',
          status:
            scopeDecisionRecord.summary.approvedLaneCount > 0
              ? 'needs_review'
              : 'ready',
          source: 'accountant_scope_decision_record',
          requirement:
            'No cerrar ledger-grade sin contador externo como gate explicito.',
        },
      ];
    const blockers = [...scopeDecisionRecord.blockers];

    return {
      ...input,
      generatedAt: this.nowProvider(),
      workspaceStatus: resolveStatus(
        designChecks.map((check) => check.status),
        blockers,
      ),
      scopeDecisionRecord,
      designChecks,
      summary: {
        checkCount: designChecks.length,
        readyCheckCount: designChecks.filter(
          (check) => check.status === 'ready',
        ).length,
        needsReviewCheckCount: designChecks.filter(
          (check) => check.status === 'needs_review',
        ).length,
        blockedCheckCount: designChecks.filter(
          (check) => check.status === 'blocked',
        ).length,
      },
      blockers,
      nextStep:
        approvedLanes.length > 0
          ? 'Preparar boundary bancario y audit trail antes de implementar MVP.'
          : 'No disenar ledger closeout MVP sin lane aprobado.',
      guardrails: [
        'Design workspace define requisitos; no ejecuta cierre contable formal.',
        'Los outputs de Foundation son evidencia operativa, no libros oficiales.',
      ],
    };
  }
}

export class GetTenantAccountingCertifiedBankEvidenceBoundaryUseCase {
  constructor(
    private readonly getTenantAccountingMinimumLedgerCloseoutDesignWorkspaceUseCase: GetTenantAccountingMinimumLedgerCloseoutDesignWorkspaceUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantAccountingCertifiedBankEvidenceBoundaryView> {
    const ledgerDesignWorkspace =
      await this.getTenantAccountingMinimumLedgerCloseoutDesignWorkspaceUseCase.execute(
        input,
      );
    const bankApproved = ledgerDesignWorkspace.scopeDecisionRecord.decisions.some(
      (decision) =>
        decision.laneKey === 'bank_reconciliation' &&
        decision.decision === 'approve_for_mvp',
    );
    const boundaryRows: TenantAccountingCertifiedBankEvidenceBoundaryView['boundaryRows'] =
      [
        {
          key: 'uploaded_statements',
          label: 'Uploaded statements',
          status: 'ready',
          platformCanDo:
            'Registrar extractos cargados, lineas, cuentas y evidencia operativa.',
          requiresExternalProof:
            'Confirmacion de origen bancario o feed certificado cuando aplique.',
          guardrail:
            'Un archivo cargado no equivale a feed bancario certificado.',
        },
        {
          key: 'internal_matches',
          label: 'Internal matches',
          status: bankApproved ? 'needs_review' : 'ready',
          platformCanDo:
            'Proponer matches internos y excepciones revisables por operador.',
          requiresExternalProof:
            'Criterio profesional para tratar diferencias materiales.',
          guardrail:
            'El match interno no certifica conciliacion bancaria legal.',
        },
        {
          key: 'certified_feed_gap',
          label: 'Certified feed gap',
          status: bankApproved ? 'needs_review' : 'ready',
          platformCanDo:
            'Identificar si el MVP necesita feed certificado o solo evidencia cargada.',
          requiresExternalProof:
            'Contrato, autorizacion o respaldo del banco/proveedor externo.',
          guardrail:
            'No prometer certified bank-feed reconciliation en MVP 0.2.',
        },
      ];
    const blockers = [...ledgerDesignWorkspace.blockers];

    return {
      ...input,
      generatedAt: this.nowProvider(),
      boundaryStatus: resolveStatus(
        boundaryRows.map((row) => row.status),
        blockers,
      ),
      ledgerDesignWorkspace,
      boundaryRows,
      summary: {
        rowCount: boundaryRows.length,
        readyRowCount: boundaryRows.filter((row) => row.status === 'ready')
          .length,
        needsExternalProofCount: boundaryRows.filter(
          (row) => row.status === 'needs_review',
        ).length,
        blockedRowCount: boundaryRows.filter((row) => row.status === 'blocked')
          .length,
      },
      blockers,
      nextStep:
        bankApproved
          ? 'Resolver prueba externa requerida antes de scope bancario MVP.'
          : 'Mantener conciliacion bancaria certificada fuera del MVP inicial.',
      guardrails: [
        'Boundary bancario separa evidencia operativa de certificacion bancaria.',
        'Accounting Advanced MVP no debe vender conciliacion certificada sin prueba externa.',
      ],
    };
  }
}

export class RequestTenantAccountingAdvancedAuditTrailReadinessPacketUseCase {
  constructor(
    private readonly getTenantAccountingCertifiedBankEvidenceBoundaryUseCase: GetTenantAccountingCertifiedBankEvidenceBoundaryUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantAccountingAdvancedAuditTrailReadinessPacketView> {
    const bankEvidenceBoundary =
      await this.getTenantAccountingCertifiedBankEvidenceBoundaryUseCase.execute(
        input,
      );
    const evidenceRefs = unique([
      'tax_pilot_decision_closeout_v73',
      'accounting_advanced_discovery_closeout',
      'accounting_advanced_mvp_scope_registry',
      'accountant_scope_decision_record',
      'minimum_ledger_closeout_design_workspace',
      'certified_bank_evidence_boundary',
      ...bankEvidenceBoundary.ledgerDesignWorkspace.scopeDecisionRecord.scopeRegistry.discoveryCloseout.closeoutChecklist.flatMap(
        (item) => item.evidenceRefs,
      ),
    ]);
    const auditSections: TenantAccountingAdvancedAuditTrailReadinessPacketView['auditSections'] =
      [
        {
          key: 'decision_lineage',
          label: 'Decision lineage',
          status: 'ready',
          evidenceRefs: [
            'tax_pilot_decision_closeout_v73',
            'accounting_advanced_discovery_closeout',
          ],
          auditUse: 'Explicar por que se considero o descarto MVP.',
        },
        {
          key: 'scope_decision',
          label: 'Scope decision',
          status:
            bankEvidenceBoundary.ledgerDesignWorkspace.scopeDecisionRecord
              .recordStatus,
          evidenceRefs: [
            'accounting_advanced_mvp_scope_registry',
            'accountant_scope_decision_record',
          ],
          auditUse: 'Trazar lanes aprobadas, rechazadas o pendientes.',
        },
        {
          key: 'bank_boundary',
          label: 'Bank boundary',
          status: bankEvidenceBoundary.boundaryStatus,
          evidenceRefs: ['certified_bank_evidence_boundary'],
          auditUse:
            'Separar evidencia bancaria operativa de certificacion externa.',
        },
        {
          key: 'ledger_design',
          label: 'Ledger design',
          status:
            bankEvidenceBoundary.ledgerDesignWorkspace.workspaceStatus,
          evidenceRefs: ['minimum_ledger_closeout_design_workspace'],
          auditUse: 'Definir requisitos antes de ejecutar un MVP ledger-grade.',
        },
      ];
    const blockers = [...bankEvidenceBoundary.blockers];

    return {
      ...input,
      generatedAt: this.nowProvider(),
      packetStatus: resolveStatus(
        auditSections.map((section) => section.status),
        blockers,
      ),
      bankEvidenceBoundary,
      auditSections,
      summary: {
        sectionCount: auditSections.length,
        readySectionCount: auditSections.filter(
          (section) => section.status === 'ready',
        ).length,
        blockedSectionCount: auditSections.filter(
          (section) => section.status === 'blocked',
        ).length,
        evidenceRefCount: evidenceRefs.length,
      },
      blockers,
      nextStep: 'Usar audit trail readiness para cerrar decision MVP 0.2.',
      guardrails: [
        'Audit trail readiness organiza trazabilidad; no reemplaza auditoria externa.',
        'Toda evidencia debe conservar referencia a Tax, Accounting Foundation o contador.',
      ],
    };
  }
}

export class RequestTenantAccountingAdvancedMvpReadinessCloseoutUseCase {
  constructor(
    private readonly getTenantAccountingAdvancedMvpScopeRegistryUseCase: GetTenantAccountingAdvancedMvpScopeRegistryUseCase,
    private readonly getTenantAccountingAdvancedMvpScopeDecisionRecordUseCase: GetTenantAccountingAdvancedMvpScopeDecisionRecordUseCase,
    private readonly getTenantAccountingMinimumLedgerCloseoutDesignWorkspaceUseCase: GetTenantAccountingMinimumLedgerCloseoutDesignWorkspaceUseCase,
    private readonly getTenantAccountingCertifiedBankEvidenceBoundaryUseCase: GetTenantAccountingCertifiedBankEvidenceBoundaryUseCase,
    private readonly requestTenantAccountingAdvancedAuditTrailReadinessPacketUseCase: RequestTenantAccountingAdvancedAuditTrailReadinessPacketUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantAccountingAdvancedMvpReadinessCloseoutView> {
    const auditTrailReadinessPacket =
      await this.requestTenantAccountingAdvancedAuditTrailReadinessPacketUseCase.execute(
        input,
      );
    const { bankEvidenceBoundary } = auditTrailReadinessPacket;
    const { ledgerDesignWorkspace } = bankEvidenceBoundary;
    const { scopeDecisionRecord } = ledgerDesignWorkspace;
    const { scopeRegistry } = scopeDecisionRecord;
    const closeoutChecklist: TenantAccountingAdvancedMvpReadinessCloseoutView['closeoutChecklist'] =
      [
        mvpCheck('scope_registry', 'MVP scope registry', scopeRegistry.registryStatus, [
          'accounting_advanced_mvp_scope_registry',
        ]),
        mvpCheck(
          'scope_decision_record',
          'Accountant scope decision record',
          scopeDecisionRecord.recordStatus,
          ['accountant_scope_decision_record'],
        ),
        mvpCheck(
          'ledger_design',
          'Minimum ledger closeout design',
          ledgerDesignWorkspace.workspaceStatus,
          ['minimum_ledger_closeout_design_workspace'],
        ),
        mvpCheck(
          'bank_boundary',
          'Certified bank evidence boundary',
          bankEvidenceBoundary.boundaryStatus,
          ['certified_bank_evidence_boundary'],
        ),
        mvpCheck(
          'audit_trail',
          'Advanced audit trail readiness',
          auditTrailReadinessPacket.packetStatus,
          ['advanced_audit_trail_readiness_packet'],
        ),
      ];
    const blockers = unique([
      ...scopeRegistry.blockers,
      ...scopeDecisionRecord.blockers,
      ...ledgerDesignWorkspace.blockers,
      ...bankEvidenceBoundary.blockers,
      ...auditTrailReadinessPacket.blockers,
    ]);
    const closeoutStatus = resolveStatus(
      closeoutChecklist.map((item) => item.status),
      blockers,
    );
    const approvedLaneKeys = scopeDecisionRecord.decisions
      .filter((decision) => decision.decision === 'approve_for_mvp')
      .map((decision) => decision.laneKey);
    const finalDecision =
      closeoutStatus === 'blocked'
        ? 'return_to_tax_or_foundation_hardening'
        : approvedLaneKeys.includes('bank_reconciliation')
          ? 'prepare_bank_reconciliation_mvp'
          : approvedLaneKeys.some((key) =>
                ['ledger_closeout', 'journal_adjustments', 'audit_trail'].includes(
                  key,
                ),
            )
            ? 'prepare_ledger_closeout_mvp'
            : 'do_not_open_mvp';

    return {
      ...input,
      generatedAt: this.nowProvider(),
      closeoutStatus,
      scopeRegistry,
      scopeDecisionRecord,
      ledgerDesignWorkspace,
      bankEvidenceBoundary,
      auditTrailReadinessPacket,
      closeoutChecklist,
      finalDecision,
      summary: {
        checklistCount: closeoutChecklist.length,
        readyChecklistCount: closeoutChecklist.filter(
          (item) => item.status === 'ready',
        ).length,
        blockedChecklistCount: closeoutChecklist.filter(
          (item) => item.status === 'blocked',
        ).length,
        approvedLaneCount: scopeDecisionRecord.summary.approvedLaneCount,
        auditEvidenceRefCount:
          auditTrailReadinessPacket.summary.evidenceRefCount,
      },
      blockers,
      nextStep:
        finalDecision === 'prepare_bank_reconciliation_mvp'
          ? 'Preparar MVP bancario minimo con boundary de certificacion explicito.'
          : finalDecision === 'prepare_ledger_closeout_mvp'
            ? 'Preparar MVP ledger closeout minimo con contador-in-the-loop.'
            : finalDecision === 'return_to_tax_or_foundation_hardening'
              ? 'Volver a Tax/Foundation hardening antes de implementar Accounting Advanced.'
              : 'Cerrar como no-apertura MVP por ahora.',
      guardrails: [
        'MVP readiness closeout decide backlog; no implementa producto avanzado automaticamente.',
        'No hay libros oficiales, feed bancario certificado ni estados firmados sin contador externo.',
      ],
    };
  }
}

export class GetTenantAccountingAdvancedMvpExecutionAnchorUseCase {
  constructor(
    private readonly requestTenantAccountingAdvancedMvpReadinessCloseoutUseCase: RequestTenantAccountingAdvancedMvpReadinessCloseoutUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantAccountingAdvancedMvpExecutionAnchorView> {
    const readinessCloseout =
      await this.requestTenantAccountingAdvancedMvpReadinessCloseoutUseCase.execute(
        input,
      );
    const operatingMode = operatingModeFromReadiness(readinessCloseout);
    const firstLane = firstLaneFromMode(operatingMode);
    const executionLanes =
      readinessCloseout.scopeDecisionRecord.decisions.map((decision) => ({
        key: decision.laneKey,
        label: decision.label,
        status:
          decision.decision === 'approve_for_mvp'
            ? ('ready' as const)
            : decision.status,
        canOperate:
          decision.decision === 'approve_for_mvp' &&
          operatingMode !== 'hardening_required',
        guardrail: mvpLaneGuardrail(decision.laneKey),
      }));
    const blockers = [...readinessCloseout.blockers];

    return {
      ...input,
      generatedAt: this.nowProvider(),
      anchorStatus: resolveStatus(
        executionLanes.map((lane) => lane.status),
        blockers,
      ),
      readinessCloseout,
      operatingMode,
      firstLane,
      executionLanes,
      summary: {
        laneCount: executionLanes.length,
        operableLaneCount: executionLanes.filter((lane) => lane.canOperate)
          .length,
        blockedLaneCount: executionLanes.filter(
          (lane) => lane.status === 'blocked',
        ).length,
      },
      blockers,
      nextStep:
        operatingMode === 'bank_reconciliation_mvp'
          ? 'Operar primero el workbench bancario MVP con boundary de certificacion.'
          : operatingMode === 'ledger_closeout_mvp'
            ? 'Operar primero el workbench ledger closeout MVP con contador-in-the-loop.'
            : operatingMode === 'hardening_required'
              ? 'Volver a hardening antes de operar Accounting Advanced.'
              : 'No operar MVP hasta que readiness recomiende una lane concreta.',
      guardrails: [
        'Execution anchor habilita operacion minima; no postea asientos oficiales.',
        'Toda lane operable conserva contador-in-the-loop y boundary explicito.',
      ],
    };
  }
}

export class GetTenantAccountingAdvancedBankReconciliationMvpWorkbenchUseCase {
  constructor(
    private readonly getTenantAccountingAdvancedMvpExecutionAnchorUseCase: GetTenantAccountingAdvancedMvpExecutionAnchorUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantAccountingAdvancedBankReconciliationMvpWorkbenchView> {
    const executionAnchor =
      await this.getTenantAccountingAdvancedMvpExecutionAnchorUseCase.execute(
        input,
      );
    const bankMode =
      executionAnchor.operatingMode === 'bank_reconciliation_mvp';
    const statementRows = [
      {
        key: 'statement_uploaded_evidence',
        label: 'Uploaded bank statement evidence',
        status: 'ready' as const,
        amountInCents: 0,
        evidenceRef: 'accounting_bank_statement_registry',
      },
      {
        key: 'statement_external_proof',
        label: 'External bank proof',
        status: bankMode ? ('needs_review' as const) : ('ready' as const),
        amountInCents: 0,
        evidenceRef: 'certified_bank_evidence_boundary',
      },
    ];
    const internalMatches = [
      {
        key: 'internal_match_candidates',
        label: 'Internal match candidates',
        status: bankMode ? ('needs_review' as const) : ('ready' as const),
        matchConfidence: bankMode ? ('medium' as const) : ('low' as const),
        guardrail: 'Match interno no certifica conciliacion bancaria legal.',
      },
    ];
    const unresolvedDifferences = bankMode
      ? [
          {
            key: 'external_proof_required',
            label: 'External proof required',
            status: 'needs_review' as const,
            requiredAction:
              'Adjuntar soporte externo o criterio del contador antes de piloto bancario.',
          },
        ]
      : [];
    const blockers = [...executionAnchor.blockers];

    return {
      ...input,
      generatedAt: this.nowProvider(),
      workbenchStatus: resolveStatus(
        [
          ...statementRows.map((row) => row.status),
          ...internalMatches.map((match) => match.status),
          ...unresolvedDifferences.map((difference) => difference.status),
        ],
        blockers,
      ),
      executionAnchor,
      statementRows,
      internalMatches,
      unresolvedDifferences,
      summary: {
        statementRowCount: statementRows.length,
        internalMatchCount: internalMatches.length,
        unresolvedDifferenceCount: unresolvedDifferences.length,
        externalProofRequiredCount: unresolvedDifferences.filter(
          (difference) => difference.key.includes('external'),
        ).length,
      },
      blockers,
      nextStep: bankMode
        ? 'Enviar diferencias y prueba externa al contador antes de piloto.'
        : 'Mantener workbench bancario como evidencia no operativa por ahora.',
      guardrails: [
        'Workbench bancario MVP solo asiste evidencia; no certifica conciliacion.',
        'Toda diferencia material requiere criterio profesional o prueba externa.',
      ],
    };
  }
}

export class GetTenantAccountingAdvancedLedgerCloseoutMvpWorkbenchUseCase {
  constructor(
    private readonly getTenantAccountingAdvancedMvpExecutionAnchorUseCase: GetTenantAccountingAdvancedMvpExecutionAnchorUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantAccountingAdvancedLedgerCloseoutMvpWorkbenchView> {
    const executionAnchor =
      await this.getTenantAccountingAdvancedMvpExecutionAnchorUseCase.execute(
        input,
      );
    const ledgerMode =
      executionAnchor.operatingMode === 'ledger_closeout_mvp' ||
      executionAnchor.operatingMode === 'bank_reconciliation_mvp';
    const closeoutChecks = [
      {
        key: 'period_defined',
        label: 'Period defined',
        status: 'ready' as const,
        source: 'minimum_ledger_closeout_design_workspace',
        action: 'Usar periodo y year del closeout readiness.',
      },
      {
        key: 'foundation_evidence_available',
        label: 'Foundation evidence available',
        status: 'ready' as const,
        source: 'accounting_foundation',
        action: 'Consumir journal registry, trial balance y evidence vault.',
      },
      {
        key: 'journal_adjustments_boundary',
        label: 'Journal adjustments boundary',
        status: ledgerMode ? ('needs_review' as const) : ('ready' as const),
        source: 'accounting_advanced_mvp_scope_decision_record',
        action:
          'Separar ajustes sugeridos de asientos oficiales revisados por contador.',
      },
      {
        key: 'accountant_required',
        label: 'Accountant required',
        status: ledgerMode ? ('needs_review' as const) : ('ready' as const),
        source: 'accountant_scope_decision_record',
        action: 'Solicitar review profesional antes de piloto ledger-grade.',
      },
    ];
    const blockers = [...executionAnchor.blockers];

    return {
      ...input,
      generatedAt: this.nowProvider(),
      workbenchStatus: resolveStatus(
        closeoutChecks.map((check) => check.status),
        blockers,
      ),
      executionAnchor,
      closeoutChecks,
      summary: {
        checkCount: closeoutChecks.length,
        readyCheckCount: closeoutChecks.filter(
          (check) => check.status === 'ready',
        ).length,
        needsEvidenceCheckCount: closeoutChecks.filter(
          (check) => check.status === 'needs_review',
        ).length,
        blockedCheckCount: 0,
      },
      blockers,
      nextStep: ledgerMode
        ? 'Preparar packet de review del contador para validar cierre MVP.'
        : 'Mantener ledger closeout como diseno no operativo por ahora.',
      guardrails: [
        'Ledger closeout MVP no cierra periodo estatutario.',
        'Foundation evidence es comparativa y operativa, no libro oficial.',
      ],
    };
  }
}

export class RequestTenantAccountingAdvancedMvpAccountantReviewPacketUseCase {
  constructor(
    private readonly getTenantAccountingAdvancedBankReconciliationMvpWorkbenchUseCase: GetTenantAccountingAdvancedBankReconciliationMvpWorkbenchUseCase,
    private readonly getTenantAccountingAdvancedLedgerCloseoutMvpWorkbenchUseCase: GetTenantAccountingAdvancedLedgerCloseoutMvpWorkbenchUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantAccountingAdvancedMvpAccountantReviewPacketView> {
    const [bankWorkbench, ledgerWorkbench] = await Promise.all([
      this.getTenantAccountingAdvancedBankReconciliationMvpWorkbenchUseCase.execute(
        input,
      ),
      this.getTenantAccountingAdvancedLedgerCloseoutMvpWorkbenchUseCase.execute(
        input,
      ),
    ]);
    const reviewItems = [
      {
        key: 'bank_workbench_review',
        label: 'Bank workbench review',
        status: bankWorkbench.workbenchStatus,
        decision:
          bankWorkbench.summary.externalProofRequiredCount > 0
            ? ('request_more_evidence' as const)
            : ('approve_operational_mvp' as const),
        rationale: bankWorkbench.nextStep,
        evidenceRefs: ['advanced_bank_reconciliation_mvp_workbench'],
        risk: 'No confundir match interno con certificacion bancaria.',
      },
      {
        key: 'ledger_workbench_review',
        label: 'Ledger workbench review',
        status: ledgerWorkbench.workbenchStatus,
        decision:
          ledgerWorkbench.summary.needsEvidenceCheckCount > 0
            ? ('request_more_evidence' as const)
            : ('approve_operational_mvp' as const),
        rationale: ledgerWorkbench.nextStep,
        evidenceRefs: ['advanced_ledger_closeout_mvp_workbench'],
        risk: 'No convertir cierre operativo en cierre estatutario.',
      },
    ];
    const blockers = unique([
      ...bankWorkbench.blockers,
      ...ledgerWorkbench.blockers,
    ]);

    return {
      ...input,
      generatedAt: this.nowProvider(),
      packetStatus: resolveStatus(
        reviewItems.map((item) => item.status),
        blockers,
      ),
      bankWorkbench,
      ledgerWorkbench,
      reviewItems,
      summary: {
        itemCount: reviewItems.length,
        approvedItemCount: reviewItems.filter(
          (item) => item.decision === 'approve_operational_mvp',
        ).length,
        needsEvidenceItemCount: reviewItems.filter(
          (item) => item.decision === 'request_more_evidence',
        ).length,
        rejectedItemCount: 0,
      },
      blockers,
      nextStep:
        reviewItems.some((item) => item.decision === 'request_more_evidence')
          ? 'Recolectar evidencia pendiente antes de operar piloto MVP.'
          : 'MVP operativo puede pasar a command center para piloto controlado.',
      guardrails: [
        'Review packet no certifica; prepara decision profesional.',
        'El contador puede aprobar operacion MVP sin aprobar uso formal/legal.',
      ],
    };
  }
}

export class GetTenantAccountingAdvancedMvpCommandCenterUseCase {
  constructor(
    private readonly getTenantAccountingAdvancedMvpExecutionAnchorUseCase: GetTenantAccountingAdvancedMvpExecutionAnchorUseCase,
    private readonly getTenantAccountingAdvancedBankReconciliationMvpWorkbenchUseCase: GetTenantAccountingAdvancedBankReconciliationMvpWorkbenchUseCase,
    private readonly getTenantAccountingAdvancedLedgerCloseoutMvpWorkbenchUseCase: GetTenantAccountingAdvancedLedgerCloseoutMvpWorkbenchUseCase,
    private readonly requestTenantAccountingAdvancedMvpAccountantReviewPacketUseCase: RequestTenantAccountingAdvancedMvpAccountantReviewPacketUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantAccountingAdvancedMvpCommandCenterView> {
    const accountantReviewPacket =
      await this.requestTenantAccountingAdvancedMvpAccountantReviewPacketUseCase.execute(
        input,
      );
    const { bankWorkbench, ledgerWorkbench } = accountantReviewPacket;
    const { executionAnchor } = bankWorkbench;
    const lanes = [
      commandLane(
        'execution_anchor',
        'Execution anchor',
        executionAnchor.anchorStatus,
        `${executionAnchor.summary.operableLaneCount} operable`,
        executionAnchor.nextStep,
      ),
      commandLane(
        'bank_workbench',
        'Bank reconciliation MVP',
        bankWorkbench.workbenchStatus,
        `${bankWorkbench.summary.unresolvedDifferenceCount} differences`,
        bankWorkbench.nextStep,
      ),
      commandLane(
        'ledger_workbench',
        'Ledger closeout MVP',
        ledgerWorkbench.workbenchStatus,
        `${ledgerWorkbench.summary.needsEvidenceCheckCount} pending`,
        ledgerWorkbench.nextStep,
      ),
      commandLane(
        'accountant_review',
        'Accountant review',
        accountantReviewPacket.packetStatus,
        `${accountantReviewPacket.summary.needsEvidenceItemCount} pending`,
        accountantReviewPacket.nextStep,
      ),
    ];
    const blockers = unique([
      ...executionAnchor.blockers,
      ...bankWorkbench.blockers,
      ...ledgerWorkbench.blockers,
      ...accountantReviewPacket.blockers,
    ]);

    return {
      ...input,
      generatedAt: this.nowProvider(),
      commandStatus: resolveStatus(
        lanes.map((lane) => lane.status),
        blockers,
      ),
      executionAnchor,
      bankWorkbench,
      ledgerWorkbench,
      accountantReviewPacket,
      lanes,
      summary: {
        laneCount: lanes.length,
        readyLaneCount: lanes.filter((lane) => lane.status === 'ready').length,
        blockedLaneCount: lanes.filter((lane) => lane.status === 'blocked')
          .length,
        evidenceRefCount:
          accountantReviewPacket.reviewItems.flatMap((item) => item.evidenceRefs)
            .length,
        accountantPendingItemCount:
          accountantReviewPacket.summary.needsEvidenceItemCount,
      },
      blockers,
      nextStep:
        accountantReviewPacket.summary.needsEvidenceItemCount > 0
          ? 'Resolver pendientes del contador antes de piloto MVP.'
          : 'Cerrar operacion MVP como ready-for-pilot controlado.',
      guardrails: [
        'Command center opera estado; no ejecuta acciones contables formales.',
        'MVP piloto conserva boundaries de banco, ledger y contador.',
      ],
    };
  }
}

export class RequestTenantAccountingAdvancedMvpOperatingCloseoutUseCase {
  constructor(
    private readonly getTenantAccountingAdvancedMvpCommandCenterUseCase: GetTenantAccountingAdvancedMvpCommandCenterUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantAccountingAdvancedMvpOperatingCloseoutView> {
    const commandCenter =
      await this.getTenantAccountingAdvancedMvpCommandCenterUseCase.execute(
        input,
      );
    const closeoutChecklist = [
      mvpOperatingCheck(
        'execution_anchor',
        'Execution anchor',
        commandCenter.executionAnchor.anchorStatus,
        ['accounting_advanced_mvp_execution_anchor'],
      ),
      mvpOperatingCheck(
        'bank_workbench',
        'Bank reconciliation MVP workbench',
        commandCenter.bankWorkbench.workbenchStatus,
        ['advanced_bank_reconciliation_mvp_workbench'],
      ),
      mvpOperatingCheck(
        'ledger_workbench',
        'Ledger closeout MVP workbench',
        commandCenter.ledgerWorkbench.workbenchStatus,
        ['advanced_ledger_closeout_mvp_workbench'],
      ),
      mvpOperatingCheck(
        'accountant_review',
        'Accountant MVP review packet',
        commandCenter.accountantReviewPacket.packetStatus,
        ['advanced_mvp_accountant_review_packet'],
      ),
      mvpOperatingCheck('command_center', 'MVP command center', commandCenter.commandStatus, [
        'advanced_mvp_command_center',
      ]),
    ];
    const blockers = [...commandCenter.blockers];
    const closeoutStatus = resolveStatus(
      closeoutChecklist.map((item) => item.status),
      blockers,
    );
    const finalDecision =
      closeoutStatus === 'blocked'
        ? 'return_to_foundation_hardening'
        : commandCenter.executionAnchor.operatingMode === 'no_mvp'
          ? 'do_not_operate'
          : commandCenter.summary.accountantPendingItemCount > 0
            ? 'needs_accountant_review'
            : 'mvp_ready_for_pilot';

    return {
      ...input,
      generatedAt: this.nowProvider(),
      closeoutStatus,
      commandCenter,
      closeoutChecklist,
      finalDecision,
      summary: {
        checklistCount: closeoutChecklist.length,
        readyChecklistCount: closeoutChecklist.filter(
          (item) => item.status === 'ready',
        ).length,
        blockedChecklistCount: closeoutChecklist.filter(
          (item) => item.status === 'blocked',
        ).length,
        readyLaneCount: commandCenter.summary.readyLaneCount,
        accountantPendingItemCount:
          commandCenter.summary.accountantPendingItemCount,
      },
      blockers,
      nextStep:
        finalDecision === 'mvp_ready_for_pilot'
          ? 'Preparar piloto real de Accounting Advanced con scope limitado.'
          : finalDecision === 'needs_accountant_review'
            ? 'Resolver pendientes del contador antes de piloto.'
            : finalDecision === 'return_to_foundation_hardening'
              ? 'Volver a Foundation hardening antes de operar.'
              : 'Mantener Accounting Advanced sin operacion MVP por ahora.',
      guardrails: [
        'Operating closeout decide piloto; no certifica contabilidad formal.',
        'No hay libros oficiales, conciliacion certificada ni estados firmados.',
      ],
    };
  }
}

function check(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  evidenceRefs: string[],
): TenantAccountingAdvancedDiscoveryCloseoutView['closeoutChecklist'][number] {
  return { key, label, status, evidenceRefs };
}

function mvpCheck(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  evidenceRefs: string[],
): TenantAccountingAdvancedMvpReadinessCloseoutView['closeoutChecklist'][number] {
  return { key, label, status, evidenceRefs };
}

function mvpOperatingCheck(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  evidenceRefs: string[],
): TenantAccountingAdvancedMvpOperatingCloseoutView['closeoutChecklist'][number] {
  return { key, label, status, evidenceRefs };
}

function commandLane(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  primaryMetric: string,
  nextAction: string,
): TenantAccountingAdvancedMvpCommandCenterView['lanes'][number] {
  return { key, label, status, primaryMetric, nextAction };
}

function operatingModeFromReadiness(
  closeout: TenantAccountingAdvancedMvpReadinessCloseoutView,
): AccountingAdvancedMvpOperatingMode {
  if (closeout.finalDecision === 'prepare_bank_reconciliation_mvp') {
    return 'bank_reconciliation_mvp';
  }
  if (closeout.finalDecision === 'prepare_ledger_closeout_mvp') {
    return 'ledger_closeout_mvp';
  }
  if (closeout.finalDecision === 'return_to_tax_or_foundation_hardening') {
    return 'hardening_required';
  }
  return 'no_mvp';
}

function firstLaneFromMode(
  mode: AccountingAdvancedMvpOperatingMode,
): AccountingAdvancedMvpLaneKey | null {
  if (mode === 'bank_reconciliation_mvp') {
    return 'bank_reconciliation';
  }
  if (mode === 'ledger_closeout_mvp') {
    return 'ledger_closeout';
  }
  return null;
}

function mvpLaneKeys(): AccountingAdvancedMvpLaneKey[] {
  return [
    'bank_reconciliation',
    'ledger_closeout',
    'audit_trail',
    'journal_adjustments',
    'formal_books_boundary',
  ];
}

function mvpLaneFromDiscovery(
  key: AccountingAdvancedMvpLaneKey,
  discoveryCloseout: TenantAccountingAdvancedDiscoveryCloseoutView,
): TenantAccountingAdvancedMvpScopeRegistryView['lanes'][number] {
  const matchingClassifications =
    discoveryCloseout.classifier.classifications.filter((classification) =>
      classificationMatchesLane(classification.needType, key),
    );
  const hasMatch = matchingClassifications.length > 0;
  const hasBlocked = matchingClassifications.some(
    (classification) => classification.status === 'blocked',
  );
  const shouldPrepareMvp =
    discoveryCloseout.finalDecision === 'prepare_accounting_advanced_mvp';
  const status: AccountingAdvancedMvpLaneStatus = hasBlocked
    ? 'blocked'
    : shouldPrepareMvp && hasMatch
      ? key === discoveryCloseout.readinessPacket.scopeRecommendation.minimumScope
        ? 'ready_for_design'
        : 'candidate'
      : 'out_of_scope';
  const readinessStatus: AccountingReadinessStatus =
    status === 'blocked'
      ? 'blocked'
      : status === 'candidate'
        ? 'needs_review'
        : 'ready';

  return {
    key,
    label: mvpLaneLabel(key),
    status,
    readinessStatus,
    evidenceRefs:
      matchingClassifications.length > 0
        ? unique(matchingClassifications.flatMap((item) => item.evidenceRefs))
        : ['accounting_advanced_discovery_closeout'],
    rationale: mvpLaneRationale(key, status),
    guardrail: mvpLaneGuardrail(key),
  };
}

function classificationMatchesLane(
  needType: AccountingAdvancedNeedType,
  laneKey: AccountingAdvancedMvpLaneKey,
): boolean {
  const map: Record<AccountingAdvancedMvpLaneKey, AccountingAdvancedNeedType[]> =
    {
      audit_trail: ['audit_trail'],
      bank_reconciliation: ['bank_reconciliation'],
      formal_books_boundary: ['formal_books'],
      journal_adjustments: ['journal_adjustments'],
      ledger_closeout: ['period_closeout', 'formal_books'],
    };

  return map[laneKey].includes(needType);
}

function mvpLaneLabel(key: AccountingAdvancedMvpLaneKey): string {
  const labels: Record<AccountingAdvancedMvpLaneKey, string> = {
    audit_trail: 'Advanced audit trail',
    bank_reconciliation: 'Bank reconciliation MVP',
    formal_books_boundary: 'Formal books boundary',
    journal_adjustments: 'Journal adjustments boundary',
    ledger_closeout: 'Minimum ledger closeout',
  };

  return labels[key];
}

function mvpLaneRationale(
  key: AccountingAdvancedMvpLaneKey,
  status: AccountingAdvancedMvpLaneStatus,
): string {
  if (status === 'out_of_scope') {
    return `${mvpLaneLabel(key)} no tiene suficiente senal en discovery 0.1.`;
  }
  if (status === 'blocked') {
    return `${mvpLaneLabel(key)} requiere resolver blockers antes de diseno.`;
  }
  if (status === 'ready_for_design') {
    return `${mvpLaneLabel(key)} coincide con el scope minimo recomendado.`;
  }
  return `${mvpLaneLabel(key)} tiene senal, pero necesita decision profesional.`;
}

function mvpLaneGuardrail(key: AccountingAdvancedMvpLaneKey): string {
  const guardrails: Record<AccountingAdvancedMvpLaneKey, string> = {
    audit_trail: 'Audit trail MVP no reemplaza auditoria externa.',
    bank_reconciliation:
      'Bank reconciliation MVP no certifica feed bancario ni conciliacion legal.',
    formal_books_boundary:
      'Formal books boundary no genera libros oficiales ni firmas.',
    journal_adjustments:
      'Journal adjustments boundary no postea asientos oficiales sin aprobacion.',
    ledger_closeout:
      'Ledger closeout MVP no cierra periodo estatutario sin contador.',
  };

  return guardrails[key];
}

function mvpLaneEvidence(key: AccountingAdvancedMvpLaneKey): string {
  const evidence: Record<AccountingAdvancedMvpLaneKey, string> = {
    audit_trail: 'Decision lineage, timeline, evidence refs y owner profesional.',
    bank_reconciliation:
      'Extractos, matches internos, excepciones y prueba externa requerida.',
    formal_books_boundary:
      'Criterio del contador sobre libros requeridos y alcance excluido.',
    journal_adjustments:
      'Borradores, soporte, aprobaciones humanas y separacion oficial/no oficial.',
    ledger_closeout:
      'Trial balance, journal registry, checklist de cierre y review profesional.',
  };

  return evidence[key];
}

function mvpLaneRisk(key: AccountingAdvancedMvpLaneKey): string {
  const risks: Record<AccountingAdvancedMvpLaneKey, string> = {
    audit_trail: 'Riesgo de vender trazabilidad como auditoria certificada.',
    bank_reconciliation:
      'Riesgo de confundir match interno con conciliacion bancaria certificada.',
    formal_books_boundary:
      'Riesgo de prometer libros oficiales antes de tener responsabilidad profesional.',
    journal_adjustments:
      'Riesgo de materializar ajustes sin aprobacion o soporte suficiente.',
    ledger_closeout:
      'Riesgo de tratar cierre operativo como cierre contable estatutario.',
  };

  return risks[key];
}

function decisionRationale(
  key: AccountingAdvancedMvpLaneKey,
  decision: 'approve_for_mvp' | 'needs_more_evidence' | 'reject_for_now',
): string {
  if (decision === 'approve_for_mvp') {
    return `${mvpLaneLabel(key)} puede pasar a diseno MVP minimo.`;
  }
  if (decision === 'needs_more_evidence') {
    return `${mvpLaneLabel(key)} necesita evidencia adicional o criterio del contador.`;
  }
  return `${mvpLaneLabel(key)} queda fuera del MVP inicial.`;
}

function hasApprovedLane(
  decisions: TenantAccountingAdvancedMvpScopeDecisionRecordView['decisions'],
  laneKey: AccountingAdvancedMvpLaneKey,
): boolean {
  return decisions.some(
    (decision) =>
      decision.laneKey === laneKey && decision.decision === 'approve_for_mvp',
  );
}

function classifyNeed(
  label: string,
  question: string,
  owner: 'accountant' | 'tax_operator' | 'platform',
): AccountingAdvancedNeedType {
  const text = `${label} ${question}`.toLowerCase();
  if (owner === 'tax_operator') {
    return 'tax_only';
  }
  if (text.includes('banc') || text.includes('bank')) {
    return 'bank_reconciliation';
  }
  if (text.includes('auditor') || text.includes('audit')) {
    return 'audit_trail';
  }
  if (text.includes('cierre') || text.includes('closeout')) {
    return 'period_closeout';
  }
  if (text.includes('journal') || text.includes('asiento')) {
    return 'journal_adjustments';
  }
  return owner === 'accountant' ? 'formal_books' : 'tax_only';
}

function recommendationForNeed(needType: AccountingAdvancedNeedType): string {
  const recommendations: Record<AccountingAdvancedNeedType, string> = {
    audit_trail: 'Preparar evidencia audit-grade y owner profesional.',
    bank_reconciliation: 'Evaluar conciliacion bancaria certificable como scope minimo.',
    formal_books: 'Confirmar si se requieren libros formales fuera de Tax Compliance.',
    journal_adjustments: 'Separar ajustes sugeridos de asientos oficiales.',
    period_closeout: 'Definir cierre contable con contador antes de MVP.',
    tax_only: 'Resolver dentro de Tax Compliance EC.',
  };

  return recommendations[needType];
}

function questionForNeed(needType: AccountingAdvancedNeedType): string {
  const questions: Record<AccountingAdvancedNeedType, string> = {
    audit_trail:
      'Que evidencia audit trail necesita el contador para aceptar el periodo?',
    bank_reconciliation:
      'La diferencia exige conciliacion bancaria formal o basta evidencia tributaria?',
    formal_books:
      'Esta senal exige libros contables formales o puede seguir como soporte fiscal?',
    journal_adjustments:
      'El ajuste debe convertirse en asiento contable oficial o quedar como recomendacion?',
    period_closeout:
      'Que condiciones minimas hacen que el periodo pueda cerrarse contablemente?',
    tax_only: 'Puede resolverse totalmente en Tax Compliance EC?',
  };

  return questions[needType];
}

function evidenceForNeed(needType: AccountingAdvancedNeedType): string {
  const evidence: Record<AccountingAdvancedNeedType, string> = {
    audit_trail: 'Timeline, evidence vault y confirmacion profesional.',
    bank_reconciliation: 'Extractos, matches, excepciones y resoluciones.',
    formal_books: 'Criterio profesional, libros requeridos y periodo aplicable.',
    journal_adjustments: 'Borradores, aprobaciones humanas y soporte del ajuste.',
    period_closeout: 'Checklist de cierre, saldos y blockers.',
    tax_only: 'Evidencia fiscal suficiente dentro de Tax Compliance.',
  };

  return evidence[needType];
}

function statusFrom(value: string): AccountingReadinessStatus {
  if (value.includes('blocked')) {
    return 'blocked';
  }
  if (value.includes('review') || value.includes('needs')) {
    return 'needs_review';
  }
  return 'ready';
}

function resolveStatus(
  statuses: AccountingReadinessStatus[],
  blockers: string[],
): AccountingReadinessStatus {
  if (blockers.length > 0 || statuses.includes('blocked')) {
    return 'blocked';
  }
  return statuses.includes('needs_review') ? 'needs_review' : 'ready';
}

function unique(values: string[]): string[] {
  return [...new Set(values)];
}
