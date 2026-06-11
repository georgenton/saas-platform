import {
  AccountingAdvancedNeedType,
  AccountingAdvancedMvpLaneKey,
  AccountingAdvancedMvpLaneStatus,
  AccountingAdvancedMvpOperatingMode,
  AccountingAdvancedGraduationDecision,
  AccountingAdvancedFormalReadinessDecision,
  AccountingAdvancedFormalProductDesignDecision,
  AccountingAdvancedFormalArtifactDraftingDecision,
  AccountingAdvancedProfessionalReviewExecutionDecision,
  AccountingAdvancedFormalApprovalWorkflowDecision,
  AccountingAdvancedSignatureCertificationBoundaryDecision,
  AccountingAdvancedExternalExecutionHandoffDecision,
  AccountingAdvancedExternalExecutionTrackingDecision,
  AccountingAdvancedExternalResultIntakeDecision,
  AccountingAdvancedFormalModuleKey,
  AccountingAdvancedProfessionalOwner,
  AccountingAdvancedPilotEnrollmentStatus,
  AccountingAdvancedPilotOutcome,
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
  TenantAccountingAdvancedPilotAccountantReviewRoomView,
  TenantAccountingAdvancedPilotCloseoutView,
  TenantAccountingAdvancedPilotEnrollmentView,
  TenantAccountingAdvancedPilotEvidenceSnapshotView,
  TenantAccountingAdvancedPilotOutcomePacketView,
  TenantAccountingAdvancedPilotRunbookView,
  TenantAccountingAdvancedCertifiedBankFeedBoundaryBlueprintView,
  TenantAccountingAdvancedExternalAccountantAcceptanceCriteriaView,
  TenantAccountingAdvancedFormalBooksBoundaryBlueprintView,
  TenantAccountingAdvancedGraduationCloseoutView,
  TenantAccountingAdvancedPilotLearningRegistryView,
  TenantAccountingAdvancedProductGraduationMatrixView,
  TenantAccountingAdvancedAdjustmentAutomationWorkbenchView,
  TenantAccountingAdvancedCertifiedBankReconciliationReadinessCloseoutView,
  TenantAccountingAdvancedExternalAccountantPortalShellView,
  TenantAccountingAdvancedFormalBooksDraftSigningBoundaryPacketView,
  TenantAccountingAdvancedMultiPeriodFinancialStatementWorkspaceView,
  TenantAccountingAdvancedPoliciesClosingTemplateRegistryView,
  TenantAccountingAdvancedFormalArtifactDraftRegistryView,
  TenantAccountingAdvancedFormalProductDesignCloseoutView,
  TenantAccountingAdvancedFormalProductRiskGuardrailPackView,
  TenantAccountingAdvancedFormalProductScopeContractView,
  TenantAccountingAdvancedAdjustmentDraftPackView,
  TenantAccountingAdvancedCertifiedReconciliationDraftPackView,
  TenantAccountingAdvancedFinancialStatementsDraftPackView,
  TenantAccountingAdvancedFormalArtifactDraftingAnchorView,
  TenantAccountingAdvancedFormalArtifactDraftingCloseoutView,
  TenantAccountingAdvancedFormalBooksDraftWorkspaceView,
  TenantAccountingAdvancedAccountantDraftReviewRoomView,
  TenantAccountingAdvancedProfessionalApprovalRecommendationPackView,
  TenantAccountingAdvancedProfessionalReviewExecutionAnchorView,
  TenantAccountingAdvancedProfessionalReviewExecutionCloseoutView,
  TenantAccountingAdvancedReviewChangeRequestPackView,
  TenantAccountingAdvancedReviewExecutionCommandCenterView,
  TenantAccountingAdvancedApprovalAuthorityMatrixView,
  TenantAccountingAdvancedApprovalDecisionWorkspaceView,
  TenantAccountingAdvancedFormalApprovalCommandCenterView,
  TenantAccountingAdvancedFormalApprovalEvidencePackView,
  TenantAccountingAdvancedFormalApprovalWorkflowAnchorView,
  TenantAccountingAdvancedFormalApprovalWorkflowCloseoutView,
  TenantAccountingAdvancedAcceptanceDecisionWorkspaceView,
  TenantAccountingAdvancedCertificationRequirementWorkspaceView,
  TenantAccountingAdvancedFormalSignatoryRegistryView,
  TenantAccountingAdvancedLegalizationBoundaryPacketView,
  TenantAccountingAdvancedSignatureCertificationBoundaryAnchorView,
  TenantAccountingAdvancedSignatureCertificationBoundaryCloseoutView,
  TenantAccountingAdvancedSignatureEvidenceReadinessPackView,
  TenantAccountingAdvancedExecutionHandoffEvidenceBundleView,
  TenantAccountingAdvancedExecutionReturnEvidenceIntakeView,
  TenantAccountingAdvancedExternalExecutionHandoffAnchorView,
  TenantAccountingAdvancedExternalExecutionHandoffCloseoutView,
  TenantAccountingAdvancedExternalExecutionInstructionPackView,
  TenantAccountingAdvancedExternalExecutionStatusLedgerView,
  TenantAccountingAdvancedExternalExecutionTrackingAnchorView,
  TenantAccountingAdvancedExternalExecutionTrackingCloseoutView,
  TenantAccountingAdvancedExternalExecutionTrackingCommandCenterView,
  TenantAccountingAdvancedExternalExecutorAssignmentMatrixView,
  TenantAccountingAdvancedExternalObservationResolutionQueueView,
  TenantAccountingAdvancedExternalResultIntakeAnchorView,
  TenantAccountingAdvancedExternalResultIntakeCloseoutView,
  TenantAccountingAdvancedInternalAcceptanceCommandCenterView,
  TenantAccountingAdvancedInternalAcceptanceCriteriaWorkspaceView,
  TenantAccountingAdvancedProfessionalResponsibilityAssignmentMatrixView,
  TenantAccountingAdvancedProfessionalReviewWorkflowDesignView,
  TenantAccountingAdvancedReturnedEvidenceValidationWorkspaceView,
  TenantAccountingAdvancedReturnedArtifactRegistryView,
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

export class GetTenantAccountingAdvancedPilotEnrollmentUseCase {
  constructor(
    private readonly requestTenantAccountingAdvancedMvpOperatingCloseoutUseCase: RequestTenantAccountingAdvancedMvpOperatingCloseoutUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantAccountingAdvancedPilotEnrollmentView> {
    const operatingCloseout =
      await this.requestTenantAccountingAdvancedMvpOperatingCloseoutUseCase.execute(
        input,
      );
    const enrollmentStatus =
      pilotEnrollmentStatusFromOperatingCloseout(operatingCloseout);
    const criteria: TenantAccountingAdvancedPilotEnrollmentView['criteria'] = [
      {
        key: 'operating_closeout',
        label: 'Operating closeout complete',
        status: operatingCloseout.closeoutStatus,
        evidenceRefs: ['advanced_mvp_operating_closeout'],
        guardrail: 'El piloto solo nace desde un cierre operativo trazable.',
      },
      {
        key: 'tenant_period',
        label: 'Tenant period identified',
        status: 'ready',
        evidenceRefs: ['tenant_period_context'],
        guardrail: 'El piloto queda amarrado a un periodo y tenant explicitos.',
      },
      {
        key: 'accountant_gate',
        label: 'Accountant gate',
        status:
          enrollmentStatus === 'needs_accountant_review'
            ? 'needs_review'
            : enrollmentStatus === 'eligible'
              ? 'ready'
              : 'blocked',
        evidenceRefs: ['advanced_mvp_accountant_review_packet'],
        guardrail: 'Un contador externo conserva veto antes de uso formal.',
      },
      {
        key: 'lane_operable',
        label: 'Operable lane available',
        status:
          operatingCloseout.commandCenter.executionAnchor.summary
            .operableLaneCount > 0
            ? 'ready'
            : enrollmentStatus === 'needs_accountant_review'
              ? 'needs_review'
              : 'blocked',
        evidenceRefs: ['advanced_mvp_execution_anchor'],
        guardrail: 'Debe existir al menos una lane MVP operable y limitada.',
      },
    ];
    const blockers =
      enrollmentStatus === 'blocked' || enrollmentStatus === 'not_recommended'
        ? unique([
            ...operatingCloseout.blockers,
            `Pilot enrollment is ${enrollmentStatus}.`,
          ])
        : [...operatingCloseout.blockers];
    const readinessStatus = resolveStatus(
      criteria.map((criterion) => criterion.status),
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      enrollmentStatus,
      readinessStatus,
      operatingCloseout,
      criteria,
      summary: {
        criteriaCount: criteria.length,
        readyCriteriaCount: criteria.filter(
          (criterion) => criterion.status === 'ready',
        ).length,
        blockedCriteriaCount: criteria.filter(
          (criterion) => criterion.status === 'blocked',
        ).length,
        accountantPendingItemCount:
          operatingCloseout.summary.accountantPendingItemCount,
      },
      blockers,
      nextStep:
        enrollmentStatus === 'eligible'
          ? 'Congelar evidencia de piloto y abrir sala de revision controlada.'
          : enrollmentStatus === 'needs_accountant_review'
            ? 'Resolver gate del contador antes de habilitar piloto.'
            : enrollmentStatus === 'blocked'
              ? 'Volver a hardening antes de inscribir piloto.'
              : 'Cerrar como piloto no recomendado por ahora.',
      guardrails: [
        'Pilot enrollment no habilita contabilidad formal ni declaraciones.',
        'Todo piloto queda limitado por tenant, periodo, evidencia y contador-in-the-loop.',
      ],
    };
  }
}

export class GetTenantAccountingAdvancedPilotEvidenceSnapshotUseCase {
  constructor(
    private readonly getTenantAccountingAdvancedPilotEnrollmentUseCase: GetTenantAccountingAdvancedPilotEnrollmentUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantAccountingAdvancedPilotEvidenceSnapshotView> {
    const enrollment =
      await this.getTenantAccountingAdvancedPilotEnrollmentUseCase.execute(
        input,
      );
    const { operatingCloseout } = enrollment;
    const { commandCenter } = operatingCloseout;
    const evidenceSections: TenantAccountingAdvancedPilotEvidenceSnapshotView['evidenceSections'] =
      [
        pilotEvidenceSection(
          'tax_decision_lineage',
          'Tax decision lineage',
          commandCenter.executionAnchor.readinessCloseout.scopeRegistry
            .discoveryCloseout.closeoutStatus,
          ['tax_pilot_decision_closeout_v73'],
          'Riesgo de separar el piloto contable de la obligacion tributaria que lo originó.',
        ),
        pilotEvidenceSection(
          'mvp_readiness_lineage',
          'MVP readiness lineage',
          commandCenter.executionAnchor.readinessCloseout.closeoutStatus,
          ['accounting_advanced_mvp_readiness_closeout'],
          'Riesgo de operar una lane no aprobada para MVP.',
        ),
        pilotEvidenceSection(
          'mvp_operations_lineage',
          'MVP operations lineage',
          operatingCloseout.closeoutStatus,
          ['advanced_mvp_operating_closeout'],
          'Riesgo de iniciar piloto sin cierre operativo previo.',
        ),
        pilotEvidenceSection(
          'bank_ledger_workbench',
          'Bank and ledger workbench evidence',
          resolveStatus(
            [
              commandCenter.bankWorkbench.workbenchStatus,
              commandCenter.ledgerWorkbench.workbenchStatus,
            ],
            [],
          ),
          [
            'advanced_bank_reconciliation_mvp_workbench',
            'advanced_ledger_closeout_mvp_workbench',
          ],
          'Riesgo de confundir evidencia operativa con certificacion externa.',
        ),
        pilotEvidenceSection(
          'accountant_review',
          'Accountant review evidence',
          commandCenter.accountantReviewPacket.packetStatus,
          ['advanced_mvp_accountant_review_packet'],
          'Riesgo de avanzar sin criterio profesional documentado.',
        ),
      ];
    const blockers = [...enrollment.blockers];
    const snapshotStatus = resolveStatus(
      evidenceSections.map((section) => section.status),
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      snapshotStatus,
      enrollment,
      evidenceSections,
      summary: {
        sectionCount: evidenceSections.length,
        readySectionCount: evidenceSections.filter(
          (section) => section.status === 'ready',
        ).length,
        blockedSectionCount: evidenceSections.filter(
          (section) => section.status === 'blocked',
        ).length,
        evidenceRefCount: evidenceSections.flatMap(
          (section) => section.evidenceRefs,
        ).length,
      },
      blockers,
      nextStep:
        snapshotStatus === 'ready'
          ? 'Enviar snapshot congelado a sala de revision del contador.'
          : 'Completar o aclarar evidencia antes de abrir piloto.',
      guardrails: [
        'Evidence snapshot congela referencias; no modifica libros ni asientos.',
        'La evidencia bancaria sigue marcada como operativa salvo certificacion externa.',
      ],
    };
  }
}

export class GetTenantAccountingAdvancedPilotAccountantReviewRoomUseCase {
  constructor(
    private readonly getTenantAccountingAdvancedPilotEvidenceSnapshotUseCase: GetTenantAccountingAdvancedPilotEvidenceSnapshotUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantAccountingAdvancedPilotAccountantReviewRoomView> {
    const evidenceSnapshot =
      await this.getTenantAccountingAdvancedPilotEvidenceSnapshotUseCase.execute(
        input,
      );
    const { enrollment } = evidenceSnapshot;
    const { commandCenter } = enrollment.operatingCloseout;
    const reviewRows: TenantAccountingAdvancedPilotAccountantReviewRoomView['reviewRows'] =
      [
        pilotReviewRow(
          'pilot_scope_review',
          'Pilot scope review',
          enrollment.readinessStatus,
          enrollment.enrollmentStatus === 'eligible'
            ? 'approve_pilot_run'
            : enrollment.enrollmentStatus === 'needs_accountant_review'
              ? 'request_more_evidence'
              : 'reject_pilot_scope',
          enrollment.criteria
            .filter((criterion) => criterion.status !== 'ready')
            .map((criterion) => criterion.key),
          'Riesgo de operar fuera del scope aprobado.',
          enrollment.nextStep,
        ),
        pilotReviewRow(
          'bank_evidence_review',
          'Bank evidence review',
          commandCenter.bankWorkbench.workbenchStatus,
          commandCenter.bankWorkbench.summary.externalProofRequiredCount > 0
            ? 'request_more_evidence'
            : 'approve_pilot_run',
          commandCenter.bankWorkbench.unresolvedDifferences.map(
            (difference) => difference.key,
          ),
          'Riesgo de considerar match interno como prueba bancaria certificada.',
          commandCenter.bankWorkbench.nextStep,
        ),
        pilotReviewRow(
          'ledger_evidence_review',
          'Ledger evidence review',
          commandCenter.ledgerWorkbench.workbenchStatus,
          commandCenter.ledgerWorkbench.summary.needsEvidenceCheckCount > 0
            ? 'request_more_evidence'
            : 'approve_pilot_run',
          commandCenter.ledgerWorkbench.closeoutChecks
            .filter((check) => check.status !== 'ready')
            .map((check) => check.key),
          'Riesgo de tratar cierre operativo como cierre estatutario.',
          commandCenter.ledgerWorkbench.nextStep,
        ),
      ];
    const blockers = [...evidenceSnapshot.blockers];
    const roomStatus = resolveStatus(
      reviewRows.map((row) => row.status),
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      roomStatus,
      evidenceSnapshot,
      reviewRows,
      summary: {
        rowCount: reviewRows.length,
        approvedRowCount: reviewRows.filter(
          (row) => row.decision === 'approve_pilot_run',
        ).length,
        needsEvidenceRowCount: reviewRows.filter(
          (row) => row.decision === 'request_more_evidence',
        ).length,
        rejectedRowCount: reviewRows.filter(
          (row) => row.decision === 'reject_pilot_scope',
        ).length,
      },
      blockers,
      nextStep:
        reviewRows.some((row) => row.decision === 'reject_pilot_scope')
          ? 'Cerrar piloto como no recomendado y devolver a hardening.'
          : reviewRows.some((row) => row.decision === 'request_more_evidence')
            ? 'Recolectar evidencia pendiente para contador antes de ejecutar piloto.'
            : 'Convertir aprobacion de sala en runbook operativo controlado.',
      guardrails: [
        'Review room captura decision; no delega responsabilidad profesional a IA.',
        'Aprobacion de piloto no equivale a firma de libros ni estados financieros.',
      ],
    };
  }
}

export class GetTenantAccountingAdvancedPilotRunbookUseCase {
  constructor(
    private readonly getTenantAccountingAdvancedPilotAccountantReviewRoomUseCase: GetTenantAccountingAdvancedPilotAccountantReviewRoomUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantAccountingAdvancedPilotRunbookView> {
    const reviewRoom =
      await this.getTenantAccountingAdvancedPilotAccountantReviewRoomUseCase.execute(
        input,
      );
    const hasRejected =
      reviewRoom.summary.rejectedRowCount > 0 ||
      reviewRoom.evidenceSnapshot.enrollment.enrollmentStatus ===
        'not_recommended';
    const hasPendingEvidence = reviewRoom.summary.needsEvidenceRowCount > 0;
    const steps: TenantAccountingAdvancedPilotRunbookView['steps'] = [
      pilotRunbookStep(
        'validate_enrollment',
        'Validate pilot enrollment',
        reviewRoom.evidenceSnapshot.enrollment.readinessStatus,
        'platform',
        'advanced_pilot_enrollment',
      ),
      pilotRunbookStep(
        'freeze_evidence_snapshot',
        'Freeze pilot evidence snapshot',
        reviewRoom.evidenceSnapshot.snapshotStatus,
        'platform',
        'advanced_pilot_evidence_snapshot',
      ),
      pilotRunbookStep(
        'run_assisted_bank_ledger_review',
        'Run assisted bank and ledger review',
        hasRejected ? 'blocked' : hasPendingEvidence ? 'needs_review' : 'ready',
        'operator',
        'advanced_mvp_command_center',
      ),
      pilotRunbookStep(
        'request_accountant_decision',
        'Request accountant pilot decision',
        reviewRoom.roomStatus,
        'external_accountant',
        'advanced_pilot_accountant_review_room',
      ),
      pilotRunbookStep(
        'produce_pilot_outcome',
        'Produce pilot outcome packet',
        hasRejected ? 'blocked' : hasPendingEvidence ? 'needs_review' : 'ready',
        'platform',
        'advanced_pilot_outcome_packet',
      ),
    ];
    const blockers = [...reviewRoom.blockers];
    const runbookStatus = resolveStatus(
      steps.map((step) => step.status),
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      runbookStatus,
      reviewRoom,
      steps,
      summary: {
        stepCount: steps.length,
        readyStepCount: steps.filter((step) => step.status === 'ready').length,
        needsReviewStepCount: steps.filter(
          (step) => step.status === 'needs_review',
        ).length,
        blockedStepCount: steps.filter((step) => step.status === 'blocked')
          .length,
      },
      blockers,
      nextStep:
        runbookStatus === 'ready'
          ? 'Ejecutar piloto controlado y producir outcome packet.'
          : runbookStatus === 'needs_review'
            ? 'Resolver evidencia pendiente antes de ejecutar piloto.'
            : 'Cerrar piloto o devolver a hardening antes de operar.',
      guardrails: [
        'Runbook coordina pasos; no automatiza filing, firmas ni libros oficiales.',
        'Cada paso conserva evidencia esperada y owner explicito.',
      ],
    };
  }
}

export class RequestTenantAccountingAdvancedPilotOutcomePacketUseCase {
  constructor(
    private readonly getTenantAccountingAdvancedPilotRunbookUseCase: GetTenantAccountingAdvancedPilotRunbookUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantAccountingAdvancedPilotOutcomePacketView> {
    const runbook =
      await this.getTenantAccountingAdvancedPilotRunbookUseCase.execute(input);
    const outcome = pilotOutcomeFromRunbook(runbook);
    const findings: TenantAccountingAdvancedPilotOutcomePacketView['findings'] =
      [
        pilotFinding(
          'enrollment',
          'Enrollment finding',
          runbook.reviewRoom.evidenceSnapshot.enrollment.readinessStatus,
          `Enrollment ${runbook.reviewRoom.evidenceSnapshot.enrollment.enrollmentStatus}.`,
          runbook.reviewRoom.evidenceSnapshot.enrollment.nextStep,
        ),
        pilotFinding(
          'evidence_snapshot',
          'Evidence snapshot finding',
          runbook.reviewRoom.evidenceSnapshot.snapshotStatus,
          `${runbook.reviewRoom.evidenceSnapshot.summary.readySectionCount}/${runbook.reviewRoom.evidenceSnapshot.summary.sectionCount} sections ready.`,
          runbook.reviewRoom.evidenceSnapshot.nextStep,
        ),
        pilotFinding(
          'accountant_review',
          'Accountant review finding',
          runbook.reviewRoom.roomStatus,
          `${runbook.reviewRoom.summary.needsEvidenceRowCount} rows need evidence.`,
          runbook.reviewRoom.nextStep,
        ),
        pilotFinding(
          'runbook',
          'Runbook finding',
          runbook.runbookStatus,
          `${runbook.summary.readyStepCount}/${runbook.summary.stepCount} steps ready.`,
          runbook.nextStep,
        ),
      ];
    const blockers = [...runbook.blockers];
    const packetStatus = resolveStatus(
      findings.map((finding) => finding.status),
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      packetStatus,
      runbook,
      outcome,
      findings,
      summary: {
        findingCount: findings.length,
        readyFindingCount: findings.filter(
          (finding) => finding.status === 'ready',
        ).length,
        needsHardeningFindingCount: findings.filter(
          (finding) => finding.status === 'needs_review',
        ).length,
        blockedFindingCount: findings.filter(
          (finding) => finding.status === 'blocked',
        ).length,
      },
      blockers,
      nextStep:
        outcome === 'pilot_passed'
          ? 'Cerrar piloto como pasado y preparar decision de producto.'
          : outcome === 'pilot_needs_hardening'
            ? 'Mantener piloto en hardening antes de ampliar alcance.'
            : outcome === 'pilot_blocked'
              ? 'Bloquear piloto y devolver a Foundation/Tax hardening.'
              : 'Cerrar piloto como no recomendado.',
      guardrails: [
        'Outcome packet resume resultado; no emite certificacion contable.',
        'Un piloto pasado habilita decision de producto, no uso formal automatico.',
      ],
    };
  }
}

export class RequestTenantAccountingAdvancedPilotCloseoutUseCase {
  constructor(
    private readonly requestTenantAccountingAdvancedPilotOutcomePacketUseCase: RequestTenantAccountingAdvancedPilotOutcomePacketUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantAccountingAdvancedPilotCloseoutView> {
    const outcomePacket =
      await this.requestTenantAccountingAdvancedPilotOutcomePacketUseCase.execute(
        input,
      );
    const { runbook } = outcomePacket;
    const { reviewRoom } = runbook;
    const { evidenceSnapshot } = reviewRoom;
    const { enrollment } = evidenceSnapshot;
    const closeoutChecklist: TenantAccountingAdvancedPilotCloseoutView['closeoutChecklist'] =
      [
        pilotCloseoutCheck('enrollment', 'Pilot enrollment', enrollment.readinessStatus, [
          'advanced_pilot_enrollment',
        ]),
        pilotCloseoutCheck(
          'evidence_snapshot',
          'Pilot evidence snapshot',
          evidenceSnapshot.snapshotStatus,
          ['advanced_pilot_evidence_snapshot'],
        ),
        pilotCloseoutCheck(
          'review_room',
          'Accountant review room',
          reviewRoom.roomStatus,
          ['advanced_pilot_accountant_review_room'],
        ),
        pilotCloseoutCheck('runbook', 'Pilot runbook', runbook.runbookStatus, [
          'advanced_pilot_runbook',
        ]),
        pilotCloseoutCheck(
          'outcome_packet',
          'Pilot outcome packet',
          outcomePacket.packetStatus,
          ['advanced_pilot_outcome_packet'],
        ),
      ];
    const blockers = unique([
      ...enrollment.blockers,
      ...evidenceSnapshot.blockers,
      ...reviewRoom.blockers,
      ...runbook.blockers,
      ...outcomePacket.blockers,
    ]);
    const closeoutStatus = resolveStatus(
      closeoutChecklist.map((item) => item.status),
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      closeoutStatus,
      enrollment,
      evidenceSnapshot,
      reviewRoom,
      runbook,
      outcomePacket,
      closeoutChecklist,
      finalOutcome: outcomePacket.outcome,
      summary: {
        checklistCount: closeoutChecklist.length,
        readyChecklistCount: closeoutChecklist.filter(
          (item) => item.status === 'ready',
        ).length,
        blockedChecklistCount: closeoutChecklist.filter(
          (item) => item.status === 'blocked',
        ).length,
        evidenceRefCount: closeoutChecklist.flatMap(
          (item) => item.evidenceRefs,
        ).length,
        accountantPendingItemCount: reviewRoom.summary.needsEvidenceRowCount,
      },
      blockers,
      nextStep:
        outcomePacket.outcome === 'pilot_passed'
          ? 'Evaluar siguiente slice de producto Accounting Advanced con piloto probado.'
          : outcomePacket.nextStep,
      guardrails: [
        'Pilot closeout cierra aprendizaje de producto; no cierra periodo legal.',
        'La decision de escalar requiere contador externo, evidencia completa y responsabilidad definida.',
      ],
    };
  }
}

export class GetTenantAccountingAdvancedPilotLearningRegistryUseCase {
  constructor(
    private readonly requestTenantAccountingAdvancedPilotCloseoutUseCase: RequestTenantAccountingAdvancedPilotCloseoutUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantAccountingAdvancedPilotLearningRegistryView> {
    const pilotCloseout =
      await this.requestTenantAccountingAdvancedPilotCloseoutUseCase.execute(
        input,
      );
    const learnings: TenantAccountingAdvancedPilotLearningRegistryView['learnings'] =
      [
        graduationLearning(
          'pilot_outcome',
          'Pilot outcome',
          pilotCloseout.closeoutStatus,
          ['advanced_pilot_closeout'],
          `Pilot closed as ${pilotCloseout.finalOutcome}.`,
          'Determina si la graduacion puede evaluarse o debe volver a hardening.',
        ),
        graduationLearning(
          'accountant_pending',
          'Accountant pending evidence',
          pilotCloseout.summary.accountantPendingItemCount > 0
            ? 'needs_review'
            : 'ready',
          ['advanced_pilot_accountant_review_room'],
          `${pilotCloseout.summary.accountantPendingItemCount} accountant pending items.`,
          'Pendientes del contador bloquean graduacion formal.',
        ),
        graduationLearning(
          'evidence_snapshot',
          'Evidence snapshot quality',
          pilotCloseout.evidenceSnapshot.snapshotStatus,
          ['advanced_pilot_evidence_snapshot'],
          `${pilotCloseout.evidenceSnapshot.summary.readySectionCount}/${pilotCloseout.evidenceSnapshot.summary.sectionCount} evidence sections ready.`,
          'La evidencia congelada define el alcance aceptable del producto.',
        ),
        graduationLearning(
          'runbook_readiness',
          'Runbook readiness',
          pilotCloseout.runbook.runbookStatus,
          ['advanced_pilot_runbook'],
          `${pilotCloseout.runbook.summary.readyStepCount}/${pilotCloseout.runbook.summary.stepCount} runbook steps ready.`,
          'Un runbook incompleto indica piloto extendido, no graduacion.',
        ),
      ];
    const blockers = [...pilotCloseout.blockers];
    const registryStatus = resolveStatus(
      learnings.map((learning) => learning.status),
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      registryStatus,
      pilotCloseout,
      learnings,
      summary: {
        learningCount: learnings.length,
        readyLearningCount: learnings.filter(
          (learning) => learning.status === 'ready',
        ).length,
        hardeningLearningCount: learnings.filter(
          (learning) => learning.status === 'needs_review',
        ).length,
        blockedLearningCount: learnings.filter(
          (learning) => learning.status === 'blocked',
        ).length,
        evidenceRefCount: learnings.flatMap((learning) => learning.evidenceRefs)
          .length,
      },
      blockers,
      nextStep:
        registryStatus === 'ready'
          ? 'Evaluar criterios de aceptacion del contador para graduacion.'
          : 'Resolver aprendizajes pendientes antes de decidir producto formal.',
      guardrails: [
        'Learning registry observa el piloto; no gradúa producto por si solo.',
        'Las senales se usan para decidir producto, no para certificar periodo.',
      ],
    };
  }
}

export class GetTenantAccountingAdvancedExternalAccountantAcceptanceCriteriaUseCase {
  constructor(
    private readonly getTenantAccountingAdvancedPilotLearningRegistryUseCase: GetTenantAccountingAdvancedPilotLearningRegistryUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantAccountingAdvancedExternalAccountantAcceptanceCriteriaView> {
    const learningRegistry =
      await this.getTenantAccountingAdvancedPilotLearningRegistryUseCase.execute(
        input,
      );
    const pilotCloseout = learningRegistry.pilotCloseout;
    const criteria: TenantAccountingAdvancedExternalAccountantAcceptanceCriteriaView['criteria'] =
      [
        accountantAcceptanceCriterion(
          'formal_scope',
          'Formal scope acceptance',
          pilotCloseout.finalOutcome === 'pilot_passed' ? 'ready' : 'needs_review',
          'advanced_pilot_outcome_packet',
          'El contador acepta que el scope puede convertirse en producto formal?',
          'Riesgo de graduar un piloto que aun requiere hardening.',
        ),
        accountantAcceptanceCriterion(
          'bank_evidence',
          'Bank evidence acceptance',
          pilotCloseout.reviewRoom.reviewRows.some(
            (row) =>
              row.key === 'bank_evidence_review' &&
              row.decision === 'approve_pilot_run',
          )
            ? 'ready'
            : 'needs_review',
          'advanced_pilot_accountant_review_room',
          'La evidencia bancaria permite avanzar a boundary certificado?',
          'Riesgo de confundir evidencia operativa con certificacion bancaria.',
        ),
        accountantAcceptanceCriterion(
          'ledger_evidence',
          'Ledger evidence acceptance',
          pilotCloseout.reviewRoom.reviewRows.some(
            (row) =>
              row.key === 'ledger_evidence_review' &&
              row.decision === 'approve_pilot_run',
          )
            ? 'ready'
            : 'needs_review',
          'advanced_pilot_accountant_review_room',
          'El ledger operativo es suficiente para disenar producto formal?',
          'Riesgo de convertir cierre operativo en cierre estatutario.',
        ),
        accountantAcceptanceCriterion(
          'professional_responsibility',
          'Professional responsibility boundary',
          'needs_review',
          'external_accountant_acceptance_criteria',
          'Que actos quedan reservados a contador, auditor o firma externa?',
          'Riesgo de prometer firma, certificacion o libros oficiales desde plataforma.',
        ),
      ];
    const blockers = [...learningRegistry.blockers];
    const criteriaStatus = resolveStatus(
      criteria.map((criterion) => criterion.status),
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      criteriaStatus,
      learningRegistry,
      criteria,
      summary: {
        criteriaCount: criteria.length,
        acceptedCriteriaCount: criteria.filter(
          (criterion) => criterion.status === 'ready',
        ).length,
        needsReviewCriteriaCount: criteria.filter(
          (criterion) => criterion.status === 'needs_review',
        ).length,
        blockedCriteriaCount: criteria.filter(
          (criterion) => criterion.status === 'blocked',
        ).length,
      },
      blockers,
      nextStep:
        criteriaStatus === 'ready'
          ? 'Construir matriz de graduacion de producto.'
          : 'Solicitar aceptacion profesional antes de graduar Accounting Advanced.',
      guardrails: [
        'Los criterios organizan aceptacion; no sustituyen al contador.',
        'Responsabilidad profesional debe quedar fuera de automatizacion del producto.',
      ],
    };
  }
}

export class GetTenantAccountingAdvancedProductGraduationMatrixUseCase {
  constructor(
    private readonly getTenantAccountingAdvancedExternalAccountantAcceptanceCriteriaUseCase: GetTenantAccountingAdvancedExternalAccountantAcceptanceCriteriaUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantAccountingAdvancedProductGraduationMatrixView> {
    const acceptanceCriteria =
      await this.getTenantAccountingAdvancedExternalAccountantAcceptanceCriteriaUseCase.execute(
        input,
      );
    const rows: TenantAccountingAdvancedProductGraduationMatrixView['rows'] = [
      graduationMatrixRow(
        'pilot_result',
        'Pilot result',
        acceptanceCriteria.learningRegistry.pilotCloseout.closeoutStatus,
        acceptanceCriteria.learningRegistry.pilotCloseout.finalOutcome ===
          'pilot_passed'
          ? 3
          : 1,
        acceptanceCriteria.learningRegistry.pilotCloseout.finalOutcome ===
          'pilot_passed'
          ? 'extend_pilot'
          : 'return_to_foundation_hardening',
        'El piloto debe pasar antes de considerar producto formal.',
      ),
      graduationMatrixRow(
        'accountant_acceptance',
        'Accountant acceptance',
        acceptanceCriteria.criteriaStatus,
        acceptanceCriteria.summary.needsReviewCriteriaCount === 0 ? 3 : 1,
        acceptanceCriteria.summary.needsReviewCriteriaCount === 0
          ? 'graduate_to_advanced_product'
          : 'extend_pilot',
        'La graduacion necesita aceptacion profesional explicita.',
      ),
      graduationMatrixRow(
        'formal_books_boundary',
        'Formal books boundary pressure',
        'needs_review',
        1,
        'extend_pilot',
        'Libros oficiales requieren boundary separado antes de implementacion.',
      ),
      graduationMatrixRow(
        'certified_bank_boundary',
        'Certified bank boundary pressure',
        'needs_review',
        1,
        'extend_pilot',
        'Conciliacion certificada requiere prueba externa y responsabilidad definida.',
      ),
    ];
    const blockers = [...acceptanceCriteria.blockers];
    const matrixStatus = resolveStatus(
      rows.map((row) => row.status),
      blockers,
    );
    const finalDecision = graduationDecisionFromRows(rows, blockers);

    return {
      ...input,
      generatedAt: this.nowProvider(),
      matrixStatus,
      acceptanceCriteria,
      rows,
      finalDecision,
      summary: {
        rowCount: rows.length,
        graduateRowCount: rows.filter(
          (row) => row.recommendation === 'graduate_to_advanced_product',
        ).length,
        extendPilotRowCount: rows.filter(
          (row) => row.recommendation === 'extend_pilot',
        ).length,
        hardeningRowCount: rows.filter(
          (row) => row.recommendation === 'return_to_foundation_hardening',
        ).length,
        doNotGraduateRowCount: rows.filter(
          (row) => row.recommendation === 'do_not_graduate',
        ).length,
      },
      blockers,
      nextStep:
        finalDecision === 'graduate_to_advanced_product'
          ? 'Preparar discovery de producto formal Accounting Advanced.'
          : finalDecision === 'extend_pilot'
            ? 'Extender piloto y cerrar boundaries formales antes de graduar.'
            : finalDecision === 'return_to_foundation_hardening'
              ? 'Volver a Foundation hardening antes de otro piloto.'
              : 'No graduar Accounting Advanced por ahora.',
      guardrails: [
        'La matriz decide direccion de producto; no implementa producto formal.',
        'Graduar requiere boundaries de libros y banco antes de uso estatutario.',
      ],
    };
  }
}

export class GetTenantAccountingAdvancedFormalBooksBoundaryBlueprintUseCase {
  constructor(
    private readonly getTenantAccountingAdvancedProductGraduationMatrixUseCase: GetTenantAccountingAdvancedProductGraduationMatrixUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantAccountingAdvancedFormalBooksBoundaryBlueprintView> {
    const graduationMatrix =
      await this.getTenantAccountingAdvancedProductGraduationMatrixUseCase.execute(
        input,
      );
    const boundaryRows: TenantAccountingAdvancedFormalBooksBoundaryBlueprintView['boundaryRows'] =
      [
        formalBooksBoundaryRow(
          'draft_ledger_exports',
          'Draft ledger exports',
          'ready',
          'Preparar exportables y evidencia de soporte.',
          'Validar formato, responsabilidad y aceptacion profesional.',
        ),
        formalBooksBoundaryRow(
          'official_book_generation',
          'Official book generation',
          'needs_review',
          'Preparar datos y checklist.',
          'Generar, firmar o presentar libros oficiales.',
        ),
        formalBooksBoundaryRow(
          'signed_financial_statements',
          'Signed financial statements',
          'needs_review',
          'Preparar preview y evidencia comparativa.',
          'Firmar estados financieros o asumir opinion profesional.',
        ),
      ];
    const blockers = [...graduationMatrix.blockers];
    const blueprintStatus = resolveStatus(
      boundaryRows.map((row) => row.status),
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      blueprintStatus,
      graduationMatrix,
      boundaryType: 'formal_books',
      boundaryRows,
      summary: boundaryRowSummary(boundaryRows),
      blockers,
      nextStep:
        'Usar blueprint de libros formales para estimar producto sin cruzar firma profesional.',
      guardrails: [
        'Formal books blueprint no genera libros oficiales.',
        'Firma, certificacion y presentacion quedan reservadas a profesionales habilitados.',
      ],
    };
  }
}

export class GetTenantAccountingAdvancedCertifiedBankFeedBoundaryBlueprintUseCase {
  constructor(
    private readonly getTenantAccountingAdvancedFormalBooksBoundaryBlueprintUseCase: GetTenantAccountingAdvancedFormalBooksBoundaryBlueprintUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantAccountingAdvancedCertifiedBankFeedBoundaryBlueprintView> {
    const formalBooksBoundary =
      await this.getTenantAccountingAdvancedFormalBooksBoundaryBlueprintUseCase.execute(
        input,
      );
    const boundaryRows: TenantAccountingAdvancedCertifiedBankFeedBoundaryBlueprintView['boundaryRows'] =
      [
        certifiedBankBoundaryRow(
          'uploaded_statement_evidence',
          'Uploaded statement evidence',
          'ready',
          'Organizar extractos cargados y diferencias operativas.',
          'Confirmacion externa de fuente bancaria.',
        ),
        certifiedBankBoundaryRow(
          'bank_feed_certification',
          'Bank feed certification',
          'needs_review',
          'Preparar reconciliacion asistida y trazabilidad.',
          'Certificar feed, origen, integridad y fecha de corte.',
        ),
        certifiedBankBoundaryRow(
          'reconciliation_signoff',
          'Reconciliation signoff',
          'needs_review',
          'Preparar exception packet y resumen comparativo.',
          'Firmar o certificar conciliacion legal.',
        ),
      ];
    const blockers = [...formalBooksBoundary.blockers];
    const blueprintStatus = resolveStatus(
      boundaryRows.map((row) => row.status),
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      blueprintStatus,
      formalBooksBoundary,
      boundaryType: 'certified_bank_feed',
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
        'Usar blueprint bancario para separar evidencia operativa de certificacion externa.',
      guardrails: [
        'Certified bank feed blueprint no certifica bancos ni conciliaciones.',
        'Toda certificacion bancaria requiere prueba externa y responsabilidad definida.',
      ],
    };
  }
}

export class RequestTenantAccountingAdvancedGraduationCloseoutUseCase {
  constructor(
    private readonly getTenantAccountingAdvancedCertifiedBankFeedBoundaryBlueprintUseCase: GetTenantAccountingAdvancedCertifiedBankFeedBoundaryBlueprintUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantAccountingAdvancedGraduationCloseoutView> {
    const certifiedBankFeedBoundary =
      await this.getTenantAccountingAdvancedCertifiedBankFeedBoundaryBlueprintUseCase.execute(
        input,
      );
    const { formalBooksBoundary } = certifiedBankFeedBoundary;
    const { graduationMatrix } = formalBooksBoundary;
    const { acceptanceCriteria } = graduationMatrix;
    const { learningRegistry } = acceptanceCriteria;
    const closeoutChecklist: TenantAccountingAdvancedGraduationCloseoutView['closeoutChecklist'] =
      [
        graduationCloseoutCheck(
          'learning_registry',
          'Pilot learning registry',
          learningRegistry.registryStatus,
          ['advanced_pilot_learning_registry'],
        ),
        graduationCloseoutCheck(
          'acceptance_criteria',
          'External accountant acceptance criteria',
          acceptanceCriteria.criteriaStatus,
          ['advanced_external_accountant_acceptance_criteria'],
        ),
        graduationCloseoutCheck(
          'graduation_matrix',
          'Product graduation matrix',
          graduationMatrix.matrixStatus,
          ['advanced_product_graduation_matrix'],
        ),
        graduationCloseoutCheck(
          'formal_books_boundary',
          'Formal books boundary blueprint',
          formalBooksBoundary.blueprintStatus,
          ['advanced_formal_books_boundary_blueprint'],
        ),
        graduationCloseoutCheck(
          'certified_bank_feed_boundary',
          'Certified bank feed boundary blueprint',
          certifiedBankFeedBoundary.blueprintStatus,
          ['advanced_certified_bank_feed_boundary_blueprint'],
        ),
      ];
    const blockers = unique([
      ...learningRegistry.blockers,
      ...acceptanceCriteria.blockers,
      ...graduationMatrix.blockers,
      ...formalBooksBoundary.blockers,
      ...certifiedBankFeedBoundary.blockers,
    ]);
    const closeoutStatus = resolveStatus(
      closeoutChecklist.map((item) => item.status),
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      closeoutStatus,
      learningRegistry,
      acceptanceCriteria,
      graduationMatrix,
      formalBooksBoundary,
      certifiedBankFeedBoundary,
      closeoutChecklist,
      finalDecision: graduationMatrix.finalDecision,
      summary: {
        checklistCount: closeoutChecklist.length,
        readyChecklistCount: closeoutChecklist.filter(
          (item) => item.status === 'ready',
        ).length,
        blockedChecklistCount: closeoutChecklist.filter(
          (item) => item.status === 'blocked',
        ).length,
        acceptanceCriteriaCount: acceptanceCriteria.summary.criteriaCount,
        boundaryRowCount:
          formalBooksBoundary.summary.rowCount +
          certifiedBankFeedBoundary.summary.rowCount,
      },
      blockers,
      nextStep:
        graduationMatrix.finalDecision === 'graduate_to_advanced_product'
          ? 'Abrir producto formal Accounting Advanced con boundaries explicitos.'
          : graduationMatrix.nextStep,
      guardrails: [
        'Graduation closeout decide roadmap; no implementa libros oficiales ni certificacion bancaria.',
        'Todo paso formal posterior requiere responsabilidad profesional explicita.',
      ],
    };
  }
}

export class GetTenantAccountingAdvancedPoliciesClosingTemplateRegistryUseCase {
  constructor(
    private readonly requestTenantAccountingAdvancedGraduationCloseoutUseCase: RequestTenantAccountingAdvancedGraduationCloseoutUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantAccountingAdvancedPoliciesClosingTemplateRegistryView> {
    const graduationCloseout =
      await this.requestTenantAccountingAdvancedGraduationCloseoutUseCase.execute(
        input,
      );
    const canDesign =
      graduationCloseout.finalDecision === 'graduate_to_advanced_product' ||
      graduationCloseout.finalDecision === 'extend_pilot';
    const policies: TenantAccountingAdvancedPoliciesClosingTemplateRegistryView['policies'] =
      [
        formalPolicy(
          'closing_basis',
          'Closing basis template',
          canDesign ? 'ready' : 'needs_review',
          'platform',
          'advanced_closing_basis_template',
        ),
        formalPolicy(
          'adjustment_policy',
          'Adjustment review policy',
          'needs_review',
          'external_accountant',
          'advanced_adjustment_policy_template',
        ),
        formalPolicy(
          'formal_books_policy',
          'Formal books boundary policy',
          graduationCloseout.formalBooksBoundary.blueprintStatus,
          'external_accountant',
          'advanced_formal_books_boundary_blueprint',
        ),
        formalPolicy(
          'certified_bank_policy',
          'Certified bank evidence policy',
          graduationCloseout.certifiedBankFeedBoundary.blueprintStatus,
          'external_accountant',
          'advanced_certified_bank_feed_boundary_blueprint',
        ),
      ];
    const blockers = [...graduationCloseout.blockers];
    const registryStatus = resolveStatus(
      policies.map((policy) => policy.status),
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      registryStatus,
      graduationCloseout,
      policies,
      summary: {
        policyCount: policies.length,
        readyPolicyCount: policies.filter((policy) => policy.status === 'ready')
          .length,
        accountantOwnedPolicyCount: policies.filter(
          (policy) => policy.owner === 'external_accountant',
        ).length,
        blockedPolicyCount: policies.filter(
          (policy) => policy.status === 'blocked',
        ).length,
      },
      blockers,
      nextStep:
        registryStatus === 'ready'
          ? 'Abrir portal externo con politicas de cierre listas.'
          : 'Solicitar revision de politicas y templates antes de formal readiness.',
      guardrails: [
        'Policy registry define reglas de revision; no firma ni certifica cierres.',
        'Templates formales quedan sujetos a aceptacion del contador externo.',
      ],
    };
  }
}

export class GetTenantAccountingAdvancedExternalAccountantPortalShellUseCase {
  constructor(
    private readonly getTenantAccountingAdvancedPoliciesClosingTemplateRegistryUseCase: GetTenantAccountingAdvancedPoliciesClosingTemplateRegistryUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantAccountingAdvancedExternalAccountantPortalShellView> {
    const policyRegistry =
      await this.getTenantAccountingAdvancedPoliciesClosingTemplateRegistryUseCase.execute(
        input,
      );
    const reviewPanels: TenantAccountingAdvancedExternalAccountantPortalShellView['reviewPanels'] =
      [
        accountantPortalPanel(
          'graduation_decision',
          'Graduation decision',
          policyRegistry.graduationCloseout.closeoutStatus,
          ['advanced_graduation_closeout'],
          'Revisar si la decision habilita formal readiness o requiere hardening.',
        ),
        accountantPortalPanel(
          'policy_templates',
          'Policies and templates',
          policyRegistry.registryStatus,
          ['advanced_policies_closing_template_registry'],
          'Aceptar, comentar o bloquear politicas de cierre.',
        ),
        accountantPortalPanel(
          'formal_books_boundary',
          'Formal books boundary',
          policyRegistry.graduationCloseout.formalBooksBoundary.blueprintStatus,
          ['advanced_formal_books_boundary_blueprint'],
          'Confirmar actos reservados a firma profesional.',
        ),
        accountantPortalPanel(
          'bank_certification_boundary',
          'Bank certification boundary',
          policyRegistry.graduationCloseout.certifiedBankFeedBoundary
            .blueprintStatus,
          ['advanced_certified_bank_feed_boundary_blueprint'],
          'Confirmar prueba externa y signoff requerido.',
        ),
      ];
    const blockers = [...policyRegistry.blockers];
    const portalStatus = resolveStatus(
      reviewPanels.map((panel) => panel.status),
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      portalStatus,
      policyRegistry,
      reviewPanels,
      summary: {
        panelCount: reviewPanels.length,
        readyPanelCount: reviewPanels.filter((panel) => panel.status === 'ready')
          .length,
        needsReviewPanelCount: reviewPanels.filter(
          (panel) => panel.status === 'needs_review',
        ).length,
        blockedPanelCount: reviewPanels.filter(
          (panel) => panel.status === 'blocked',
        ).length,
      },
      blockers,
      nextStep:
        portalStatus === 'ready'
          ? 'Usar portal externo para revisar ajustes sugeridos.'
          : 'Completar paneles del contador antes de automatizar recomendaciones.',
      guardrails: [
        'Portal shell organiza revision; no delega juicio profesional a la plataforma.',
        'El contador puede bloquear cualquier avance formal.',
      ],
    };
  }
}

export class GetTenantAccountingAdvancedAdjustmentAutomationWorkbenchUseCase {
  constructor(
    private readonly getTenantAccountingAdvancedExternalAccountantPortalShellUseCase: GetTenantAccountingAdvancedExternalAccountantPortalShellUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantAccountingAdvancedAdjustmentAutomationWorkbenchView> {
    const accountantPortal =
      await this.getTenantAccountingAdvancedExternalAccountantPortalShellUseCase.execute(
        input,
      );
    const recommendations: TenantAccountingAdvancedAdjustmentAutomationWorkbenchView['recommendations'] =
      [
        adjustmentRecommendation(
          'period_accrual_review',
          'Period accrual review',
          'needs_review',
          'accrual',
          ['advanced_adjustment_policy_template'],
        ),
        adjustmentRecommendation(
          'ledger_reclassification_review',
          'Ledger reclassification review',
          accountantPortal.portalStatus,
          'reclassification',
          ['advanced_pilot_accountant_review_room'],
        ),
        adjustmentRecommendation(
          'bank_difference_review',
          'Bank difference review',
          accountantPortal.policyRegistry.graduationCloseout
            .certifiedBankFeedBoundary.blueprintStatus,
          'difference',
          ['advanced_certified_bank_feed_boundary_blueprint'],
        ),
        adjustmentRecommendation(
          'closing_reversal_review',
          'Closing reversal review',
          'needs_review',
          'reversal',
          ['advanced_closing_basis_template'],
        ),
      ];
    const blockers = [...accountantPortal.blockers];
    const workbenchStatus = resolveStatus(
      recommendations.map((recommendation) => recommendation.status),
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      workbenchStatus,
      accountantPortal,
      recommendations,
      summary: {
        recommendationCount: recommendations.length,
        readyRecommendationCount: recommendations.filter(
          (recommendation) => recommendation.status === 'ready',
        ).length,
        needsApprovalRecommendationCount: recommendations.filter(
          (recommendation) => recommendation.status === 'needs_review',
        ).length,
        blockedRecommendationCount: recommendations.filter(
          (recommendation) => recommendation.status === 'blocked',
        ).length,
      },
      blockers,
      nextStep:
        'Preparar workspace multi-periodo con ajustes como recomendaciones revisables.',
      guardrails: [
        'Adjustment automation sugiere; no postea asientos oficiales automaticamente.',
        'Todo ajuste formal requiere aprobacion profesional y evidencia.',
      ],
    };
  }
}

export class GetTenantAccountingAdvancedMultiPeriodFinancialStatementWorkspaceUseCase {
  constructor(
    private readonly getTenantAccountingAdvancedAdjustmentAutomationWorkbenchUseCase: GetTenantAccountingAdvancedAdjustmentAutomationWorkbenchUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantAccountingAdvancedMultiPeriodFinancialStatementWorkspaceView> {
    const adjustmentWorkbench =
      await this.getTenantAccountingAdvancedAdjustmentAutomationWorkbenchUseCase.execute(
        input,
      );
    const statementSections: TenantAccountingAdvancedMultiPeriodFinancialStatementWorkspaceView['statementSections'] =
      [
        statementSection(
          'balance_sheet_preview',
          'Balance sheet preview',
          adjustmentWorkbench.workbenchStatus,
          `${input.year - 1}-${input.year}`,
          ['accounting_financial_statement_preview'],
          'Variaciones de balance requieren explicacion y soporte.',
        ),
        statementSection(
          'income_statement_preview',
          'Income statement preview',
          'needs_review',
          `${input.year - 1}-${input.year}`,
          ['accounting_period_closeout_report'],
          'Variaciones de ingresos/gastos requieren revision externa.',
        ),
        statementSection(
          'cash_and_bank_variation',
          'Cash and bank variation',
          adjustmentWorkbench.accountantPortal.policyRegistry.graduationCloseout
            .certifiedBankFeedBoundary.blueprintStatus,
          `${input.period}`,
          ['advanced_certified_bank_feed_boundary_blueprint'],
          'Variacion bancaria no es certificada sin prueba externa.',
        ),
      ];
    const blockers = [...adjustmentWorkbench.blockers];
    const workspaceStatus = resolveStatus(
      statementSections.map((section) => section.status),
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      workspaceStatus,
      adjustmentWorkbench,
      statementSections,
      summary: {
        sectionCount: statementSections.length,
        readySectionCount: statementSections.filter(
          (section) => section.status === 'ready',
        ).length,
        needsReviewSectionCount: statementSections.filter(
          (section) => section.status === 'needs_review',
        ).length,
        blockedSectionCount: statementSections.filter(
          (section) => section.status === 'blocked',
        ).length,
      },
      blockers,
      nextStep:
        'Usar estados multi-periodo como preview revisable antes de libros formales.',
      guardrails: [
        'Multi-period statements son preview; no estados financieros firmados.',
        'Variaciones materiales requieren soporte y contador externo.',
      ],
    };
  }
}

export class RequestTenantAccountingAdvancedFormalBooksDraftSigningBoundaryPacketUseCase {
  constructor(
    private readonly getTenantAccountingAdvancedMultiPeriodFinancialStatementWorkspaceUseCase: GetTenantAccountingAdvancedMultiPeriodFinancialStatementWorkspaceUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantAccountingAdvancedFormalBooksDraftSigningBoundaryPacketView> {
    const financialStatementWorkspace =
      await this.getTenantAccountingAdvancedMultiPeriodFinancialStatementWorkspaceUseCase.execute(
        input,
      );
    const boundaryRows: TenantAccountingAdvancedFormalBooksDraftSigningBoundaryPacketView['boundaryRows'] =
      [
        formalBookBoundaryPacketRow(
          'draft_journal_book',
          'Draft journal book',
          financialStatementWorkspace.workspaceStatus,
          'Borrador de libro diario con referencias a evidencia.',
          'Firma y legalizacion quedan fuera de plataforma.',
        ),
        formalBookBoundaryPacketRow(
          'draft_ledger_book',
          'Draft ledger book',
          'needs_review',
          'Borrador de mayor y saldos comparativos.',
          'Emision oficial requiere contador o representante autorizado.',
        ),
        formalBookBoundaryPacketRow(
          'financial_statement_signing',
          'Financial statement signing',
          'needs_review',
          'Preview multi-periodo y variaciones explicadas.',
          'Firma de estados financieros es acto profesional externo.',
        ),
      ];
    const blockers = [...financialStatementWorkspace.blockers];
    const packetStatus = resolveStatus(
      boundaryRows.map((row) => row.status),
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      packetStatus,
      financialStatementWorkspace,
      boundaryRows,
      summary: {
        rowCount: boundaryRows.length,
        readyRowCount: boundaryRows.filter((row) => row.status === 'ready')
          .length,
        needsSigningRowCount: boundaryRows.filter(
          (row) => row.status === 'needs_review',
        ).length,
        blockedRowCount: boundaryRows.filter((row) => row.status === 'blocked')
          .length,
      },
      blockers,
      nextStep:
        'Preparar readiness bancario certificado antes de considerar producto formal.',
      guardrails: [
        'Formal books packet prepara carpeta de firma; no firma ni legaliza libros.',
        'Los borradores requieren aceptacion profesional antes de uso oficial.',
      ],
    };
  }
}

export class RequestTenantAccountingAdvancedCertifiedBankReconciliationReadinessCloseoutUseCase {
  constructor(
    private readonly requestTenantAccountingAdvancedFormalBooksDraftSigningBoundaryPacketUseCase: RequestTenantAccountingAdvancedFormalBooksDraftSigningBoundaryPacketUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantAccountingAdvancedCertifiedBankReconciliationReadinessCloseoutView> {
    const formalBooksPacket =
      await this.requestTenantAccountingAdvancedFormalBooksDraftSigningBoundaryPacketUseCase.execute(
        input,
      );
    const reconciliationChecks: TenantAccountingAdvancedCertifiedBankReconciliationReadinessCloseoutView['reconciliationChecks'] =
      [
        bankReconciliationReadinessCheck(
          'source_bank_evidence',
          'Source bank evidence',
          formalBooksPacket.financialStatementWorkspace.adjustmentWorkbench
            .accountantPortal.policyRegistry.graduationCloseout
            .certifiedBankFeedBoundary.blueprintStatus,
          'Extractos cargados, diferencias y trazabilidad operativa.',
          'Confirmacion externa del banco o proveedor certificado.',
        ),
        bankReconciliationReadinessCheck(
          'exception_resolution',
          'Exception resolution',
          formalBooksPacket.packetStatus,
          'Packets de excepcion y soporte de diferencias.',
          'Signoff profesional sobre diferencias materiales.',
        ),
        bankReconciliationReadinessCheck(
          'certified_signoff',
          'Certified signoff',
          'needs_review',
          'Resumen de conciliacion asistida y evidencia.',
          'Certificacion bancaria/legal externa requerida.',
        ),
      ];
    const blockers = [...formalBooksPacket.blockers];
    const closeoutStatus = resolveStatus(
      reconciliationChecks.map((check) => check.status),
      blockers,
    );
    const finalDecision = formalReadinessDecisionFromStatus(
      closeoutStatus,
      reconciliationChecks,
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      closeoutStatus,
      formalBooksPacket,
      reconciliationChecks,
      finalDecision,
      summary: {
        checkCount: reconciliationChecks.length,
        readyCheckCount: reconciliationChecks.filter(
          (check) => check.status === 'ready',
        ).length,
        needsExternalProofCount: reconciliationChecks.filter(
          (check) => check.status === 'needs_review',
        ).length,
        blockedCheckCount: reconciliationChecks.filter(
          (check) => check.status === 'blocked',
        ).length,
        formalBookBoundaryCount: formalBooksPacket.summary.rowCount,
      },
      blockers,
      nextStep:
        finalDecision === 'ready_for_formal_product_design'
          ? 'Preparar producto formal Accounting Advanced con firma y certificacion externas.'
          : finalDecision === 'needs_professional_boundary_review'
            ? 'Resolver boundaries profesionales antes de disenar producto formal.'
            : finalDecision === 'return_to_advanced_hardening'
              ? 'Volver a hardening avanzado antes de formal readiness.'
              : 'No abrir producto formal Accounting Advanced por ahora.',
      guardrails: [
        'Certified reconciliation closeout no certifica bancos ni conciliaciones.',
        'Producto formal posterior requiere integraciones, signoff y responsabilidad externa.',
      ],
    };
  }
}

export class GetTenantAccountingAdvancedFormalProductScopeContractUseCase {
  constructor(
    private readonly requestTenantAccountingAdvancedCertifiedBankReconciliationReadinessCloseoutUseCase: RequestTenantAccountingAdvancedCertifiedBankReconciliationReadinessCloseoutUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantAccountingAdvancedFormalProductScopeContractView> {
    const formalReadinessCloseout =
      await this.requestTenantAccountingAdvancedCertifiedBankReconciliationReadinessCloseoutUseCase.execute(
        input,
      );
    const canDesign =
      formalReadinessCloseout.finalDecision ===
        'ready_for_formal_product_design' ||
      formalReadinessCloseout.finalDecision ===
        'needs_professional_boundary_review';
    const modules: TenantAccountingAdvancedFormalProductScopeContractView['modules'] =
      [
        formalScopeModule(
          'formal_books',
          'Formal books',
          formalReadinessCloseout.formalBooksPacket.packetStatus,
          canDesign,
          'Borradores de libros, no legalizacion ni firma automatica.',
          ['advanced_formal_books_boundary_packet'],
        ),
        formalScopeModule(
          'certified_bank_reconciliation',
          'Certified bank reconciliation',
          formalReadinessCloseout.closeoutStatus,
          canDesign,
          'Readiness de certificacion, no certificacion bancaria por plataforma.',
          ['advanced_certified_bank_reconciliation_readiness_closeout'],
        ),
        formalScopeModule(
          'advanced_adjustments',
          'Advanced adjustments',
          formalReadinessCloseout.formalBooksPacket.financialStatementWorkspace
            .adjustmentWorkbench.workbenchStatus,
          canDesign,
          'Recomendaciones de ajuste, no posteo oficial automatico.',
          ['advanced_adjustment_automation_workbench'],
        ),
        formalScopeModule(
          'multi_period_statements',
          'Multi-period statements',
          formalReadinessCloseout.formalBooksPacket.financialStatementWorkspace
            .workspaceStatus,
          canDesign,
          'Previews multi-periodo, no estados financieros firmados.',
          ['advanced_multi_period_financial_statement_workspace'],
        ),
        formalScopeModule(
          'professional_portal',
          'Professional portal',
          formalReadinessCloseout.formalBooksPacket.financialStatementWorkspace
            .adjustmentWorkbench.accountantPortal.portalStatus,
          true,
          'Portal de revision, no sustituto del juicio profesional.',
          ['advanced_external_accountant_portal_shell'],
        ),
      ];
    const blockers = [...formalReadinessCloseout.blockers];
    const contractStatus = resolveStatus(
      modules.map((module) => module.status),
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      contractStatus,
      formalReadinessCloseout,
      modules,
      summary: {
        moduleCount: modules.length,
        includedModuleCount: modules.filter((module) => module.included).length,
        needsReviewModuleCount: modules.filter(
          (module) => module.status === 'needs_review',
        ).length,
        blockedModuleCount: modules.filter((module) => module.status === 'blocked')
          .length,
      },
      blockers,
      nextStep:
        'Asignar responsabilidades profesionales por modulo formal antes de disenar artefactos.',
      guardrails: [
        'Scope contract define producto formal; no ejecuta acciones formales.',
        'Todo modulo conserva boundary explicito de firma, certificacion o aprobacion externa.',
      ],
    };
  }
}

export class GetTenantAccountingAdvancedProfessionalResponsibilityAssignmentMatrixUseCase {
  constructor(
    private readonly getTenantAccountingAdvancedFormalProductScopeContractUseCase: GetTenantAccountingAdvancedFormalProductScopeContractUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantAccountingAdvancedProfessionalResponsibilityAssignmentMatrixView> {
    const scopeContract =
      await this.getTenantAccountingAdvancedFormalProductScopeContractUseCase.execute(
        input,
      );
    const assignments: TenantAccountingAdvancedProfessionalResponsibilityAssignmentMatrixView['assignments'] =
      scopeContract.modules.flatMap((module) => [
        responsibilityAssignment(
          `${module.key}_platform_preparation`,
          `${module.label} platform preparation`,
          module.key,
          module.status,
          'platform',
          'Preparar evidencia, borradores y trazabilidad.',
        ),
        responsibilityAssignment(
          `${module.key}_professional_review`,
          `${module.label} professional review`,
          module.key,
          module.status === 'blocked' ? 'blocked' : 'needs_review',
          module.key === 'certified_bank_reconciliation'
            ? 'auditor'
            : 'external_accountant',
          'Revisar, aprobar o bloquear uso formal.',
        ),
      ]);
    const blockers = [...scopeContract.blockers];
    const matrixStatus = resolveStatus(
      assignments.map((assignment) => assignment.status),
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      matrixStatus,
      scopeContract,
      assignments,
      summary: {
        assignmentCount: assignments.length,
        externalOwnerCount: assignments.filter(
          (assignment) =>
            assignment.owner === 'external_accountant' ||
            assignment.owner === 'auditor' ||
            assignment.owner === 'legal_representative',
        ).length,
        platformOwnerCount: assignments.filter(
          (assignment) => assignment.owner === 'platform',
        ).length,
        needsReviewAssignmentCount: assignments.filter(
          (assignment) => assignment.status === 'needs_review',
        ).length,
        blockedAssignmentCount: assignments.filter(
          (assignment) => assignment.status === 'blocked',
        ).length,
      },
      blockers,
      nextStep:
        'Registrar artefactos formales en borrador con owners requeridos.',
      guardrails: [
        'Responsibility matrix impide responsabilidad implicita de plataforma.',
        'Acciones de firma, certificacion y aprobacion formal tienen owner externo.',
      ],
    };
  }
}

export class GetTenantAccountingAdvancedFormalArtifactDraftRegistryUseCase {
  constructor(
    private readonly getTenantAccountingAdvancedProfessionalResponsibilityAssignmentMatrixUseCase: GetTenantAccountingAdvancedProfessionalResponsibilityAssignmentMatrixUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantAccountingAdvancedFormalArtifactDraftRegistryView> {
    const responsibilityMatrix =
      await this.getTenantAccountingAdvancedProfessionalResponsibilityAssignmentMatrixUseCase.execute(
        input,
      );
    const artifacts: TenantAccountingAdvancedFormalArtifactDraftRegistryView['artifacts'] =
      [
        formalArtifact(
          'draft_journal_book',
          'Draft journal book',
          'formal_books',
          responsibilityMatrix.scopeContract.formalReadinessCloseout
            .formalBooksPacket.packetStatus,
          'journal_book',
          'Borrador trazable, pendiente de revision profesional.',
          'external_accountant',
        ),
        formalArtifact(
          'draft_ledger_book',
          'Draft ledger book',
          'formal_books',
          'needs_review',
          'ledger_book',
          'Mayor preliminar sujeto a politicas de cierre.',
          'external_accountant',
        ),
        formalArtifact(
          'multi_period_financial_statements',
          'Multi-period financial statements',
          'multi_period_statements',
          responsibilityMatrix.scopeContract.formalReadinessCloseout
            .formalBooksPacket.financialStatementWorkspace.workspaceStatus,
          'financial_statement',
          'Preview comparativo sin firma.',
          'legal_representative',
        ),
        formalArtifact(
          'certified_bank_reconciliation_pack',
          'Certified bank reconciliation pack',
          'certified_bank_reconciliation',
          responsibilityMatrix.scopeContract.formalReadinessCloseout
            .closeoutStatus,
          'certified_reconciliation',
          'Readiness de conciliacion, requiere prueba externa.',
          'auditor',
        ),
        formalArtifact(
          'advanced_adjustment_pack',
          'Advanced adjustment pack',
          'advanced_adjustments',
          responsibilityMatrix.scopeContract.formalReadinessCloseout
            .formalBooksPacket.financialStatementWorkspace.adjustmentWorkbench
            .workbenchStatus,
          'adjustment_pack',
          'Recomendaciones sin posteo oficial automatico.',
          'external_accountant',
        ),
      ];
    const blockers = [...responsibilityMatrix.blockers];
    const registryStatus = resolveStatus(
      artifacts.map((artifact) => artifact.status),
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      registryStatus,
      responsibilityMatrix,
      artifacts,
      summary: {
        artifactCount: artifacts.length,
        readyArtifactCount: artifacts.filter(
          (artifact) => artifact.status === 'ready',
        ).length,
        needsReviewArtifactCount: artifacts.filter(
          (artifact) => artifact.status === 'needs_review',
        ).length,
        blockedArtifactCount: artifacts.filter(
          (artifact) => artifact.status === 'blocked',
        ).length,
      },
      blockers,
      nextStep:
        'Disenar workflow profesional de submit, review, cambios y signoff.',
      guardrails: [
        'Artifact registry cataloga borradores; no emite documentos oficiales.',
        'Cada artefacto formal conserva owner profesional requerido.',
      ],
    };
  }
}

export class GetTenantAccountingAdvancedProfessionalReviewWorkflowDesignUseCase {
  constructor(
    private readonly getTenantAccountingAdvancedFormalArtifactDraftRegistryUseCase: GetTenantAccountingAdvancedFormalArtifactDraftRegistryUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantAccountingAdvancedProfessionalReviewWorkflowDesignView> {
    const artifactRegistry =
      await this.getTenantAccountingAdvancedFormalArtifactDraftRegistryUseCase.execute(
        input,
      );
    const workflowSteps: TenantAccountingAdvancedProfessionalReviewWorkflowDesignView['workflowSteps'] =
      [
        workflowStep(
          'submit_draft',
          'Submit draft artifacts',
          artifactRegistry.registryStatus,
          'operator',
          'submit',
        ),
        workflowStep(
          'professional_review',
          'Professional review',
          'needs_review',
          'external_accountant',
          'review',
        ),
        workflowStep(
          'request_changes',
          'Request changes',
          'needs_review',
          'external_accountant',
          'request_changes',
        ),
        workflowStep(
          'approve_draft',
          'Approve draft',
          'needs_review',
          'external_accountant',
          'approve_draft',
        ),
        workflowStep(
          'external_signoff_required',
          'External signoff required',
          'needs_review',
          'auditor',
          'external_signoff_required',
        ),
      ];
    const blockers = [...artifactRegistry.blockers];
    const workflowStatus = resolveStatus(
      workflowSteps.map((step) => step.status),
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      workflowStatus,
      artifactRegistry,
      workflowSteps,
      summary: {
        stepCount: workflowSteps.length,
        readyStepCount: workflowSteps.filter((step) => step.status === 'ready')
          .length,
        needsReviewStepCount: workflowSteps.filter(
          (step) => step.status === 'needs_review',
        ).length,
        blockedStepCount: workflowSteps.filter((step) => step.status === 'blocked')
          .length,
      },
      blockers,
      nextStep:
        'Agregar pack de riesgos y guardrails antes del closeout de diseno formal.',
      guardrails: [
        'Workflow design modela transiciones; no aprueba ni firma artefactos.',
        'External signoff es requisito de control, no automatizacion interna.',
      ],
    };
  }
}

export class RequestTenantAccountingAdvancedFormalProductRiskGuardrailPackUseCase {
  constructor(
    private readonly getTenantAccountingAdvancedProfessionalReviewWorkflowDesignUseCase: GetTenantAccountingAdvancedProfessionalReviewWorkflowDesignUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantAccountingAdvancedFormalProductRiskGuardrailPackView> {
    const workflowDesign =
      await this.getTenantAccountingAdvancedProfessionalReviewWorkflowDesignUseCase.execute(
        input,
      );
    const guardrailRows: TenantAccountingAdvancedFormalProductRiskGuardrailPackView['guardrailRows'] =
      [
        riskGuardrail(
          'no_accountant_replacement',
          'No accountant replacement',
          'ready',
          'professional_portal',
          'Confundir asistencia con juicio profesional.',
          'Mostrar owner externo y aprobacion requerida.',
        ),
        riskGuardrail(
          'no_auto_book_legalization',
          'No automatic book legalization',
          'ready',
          'formal_books',
          'Emitir o legalizar libros sin acto autorizado.',
          'Mantener borrador y boundary de firma.',
        ),
        riskGuardrail(
          'no_bank_certification_without_external_proof',
          'No bank certification without external proof',
          'needs_review',
          'certified_bank_reconciliation',
          'Presentar conciliacion operativa como certificada.',
          'Exigir prueba externa y signoff.',
        ),
        riskGuardrail(
          'no_auto_adjustment_posting',
          'No automatic adjustment posting',
          'ready',
          'advanced_adjustments',
          'Postear ajustes oficiales sin aprobacion.',
          'Mantener recomendaciones hasta aprobacion profesional.',
        ),
        riskGuardrail(
          'no_signed_statement_generation',
          'No signed statement generation',
          'needs_review',
          'multi_period_statements',
          'Confundir preview con estados financieros firmados.',
          'Separar preview, aprobacion y firma externa.',
        ),
      ];
    const blockers = [...workflowDesign.blockers];
    const packStatus = resolveStatus(
      guardrailRows.map((row) => row.status),
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      packStatus,
      workflowDesign,
      guardrailRows,
      summary: {
        guardrailCount: guardrailRows.length,
        readyGuardrailCount: guardrailRows.filter(
          (row) => row.status === 'ready',
        ).length,
        needsReviewGuardrailCount: guardrailRows.filter(
          (row) => row.status === 'needs_review',
        ).length,
        blockedGuardrailCount: guardrailRows.filter(
          (row) => row.status === 'blocked',
        ).length,
      },
      blockers,
      nextStep:
        'Cerrar diseno formal y decidir si 0.8 puede iniciar drafting de artefactos.',
      guardrails: [
        'Guardrail pack acompana el diseno; no desbloquea uso formal por si solo.',
        'Todo riesgo formal debe tener control visible antes de drafting.',
      ],
    };
  }
}

export class RequestTenantAccountingAdvancedFormalProductDesignCloseoutUseCase {
  constructor(
    private readonly requestTenantAccountingAdvancedFormalProductRiskGuardrailPackUseCase: RequestTenantAccountingAdvancedFormalProductRiskGuardrailPackUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantAccountingAdvancedFormalProductDesignCloseoutView> {
    const guardrailPack =
      await this.requestTenantAccountingAdvancedFormalProductRiskGuardrailPackUseCase.execute(
        input,
      );
    const { workflowDesign } = guardrailPack;
    const { artifactRegistry } = workflowDesign;
    const { responsibilityMatrix } = artifactRegistry;
    const { scopeContract } = responsibilityMatrix;
    const closeoutChecklist: TenantAccountingAdvancedFormalProductDesignCloseoutView['closeoutChecklist'] =
      [
        designCloseoutCheck('scope_contract', 'Formal product scope contract', scopeContract.contractStatus, [
          'advanced_formal_product_scope_contract',
        ]),
        designCloseoutCheck(
          'responsibility_matrix',
          'Professional responsibility assignment matrix',
          responsibilityMatrix.matrixStatus,
          ['advanced_professional_responsibility_assignment_matrix'],
        ),
        designCloseoutCheck(
          'artifact_registry',
          'Formal artifact draft registry',
          artifactRegistry.registryStatus,
          ['advanced_formal_artifact_draft_registry'],
        ),
        designCloseoutCheck(
          'workflow_design',
          'Professional review workflow design',
          workflowDesign.workflowStatus,
          ['advanced_professional_review_workflow_design'],
        ),
        designCloseoutCheck(
          'guardrail_pack',
          'Formal product risk guardrail pack',
          guardrailPack.packStatus,
          ['advanced_formal_product_risk_guardrail_pack'],
        ),
      ];
    const blockers = unique([
      ...scopeContract.blockers,
      ...responsibilityMatrix.blockers,
      ...artifactRegistry.blockers,
      ...workflowDesign.blockers,
      ...guardrailPack.blockers,
    ]);
    const closeoutStatus = resolveStatus(
      closeoutChecklist.map((item) => item.status),
      blockers,
    );
    const finalDecision = formalProductDesignDecisionFromStatus(
      closeoutStatus,
      scopeContract,
      guardrailPack,
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      closeoutStatus,
      scopeContract,
      responsibilityMatrix,
      artifactRegistry,
      workflowDesign,
      guardrailPack,
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
        includedModuleCount: scopeContract.summary.includedModuleCount,
        artifactCount: artifactRegistry.summary.artifactCount,
        externalOwnerCount: responsibilityMatrix.summary.externalOwnerCount,
      },
      blockers,
      nextStep:
        finalDecision === 'ready_for_formal_artifact_drafting'
          ? 'Iniciar 0.8 Formal Artifact Drafting con workflow profesional.'
          : finalDecision === 'needs_scope_review'
            ? 'Resolver scope, owners o guardrails antes de drafting formal.'
            : finalDecision === 'return_to_formal_readiness_hardening'
              ? 'Volver a hardening 0.6 antes de disenar producto formal.'
              : 'No disenar producto formal Accounting Advanced por ahora.',
      guardrails: [
        'Formal product design closeout decide diseno; no emite artefactos oficiales.',
        '0.8 solo puede iniciar drafts, no firmas, certificaciones ni legalizaciones automaticas.',
      ],
    };
  }
}

export class GetTenantAccountingAdvancedFormalArtifactDraftingAnchorUseCase {
  constructor(
    private readonly requestTenantAccountingAdvancedFormalProductDesignCloseoutUseCase: RequestTenantAccountingAdvancedFormalProductDesignCloseoutUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantAccountingAdvancedFormalArtifactDraftingAnchorView> {
    const productDesignCloseout =
      await this.requestTenantAccountingAdvancedFormalProductDesignCloseoutUseCase.execute(
        input,
      );
    const draftingGates: TenantAccountingAdvancedFormalArtifactDraftingAnchorView['draftingGates'] =
      [
        draftingGate(
          'formal_design_closeout',
          'Formal design closeout',
          productDesignCloseout.closeoutStatus,
          ['advanced_formal_product_design_closeout'],
          '0.8 only starts from the explicit 0.7 design decision.',
        ),
        draftingGate(
          'artifact_registry',
          'Artifact registry available',
          productDesignCloseout.artifactRegistry.registryStatus,
          ['advanced_formal_artifact_draft_registry'],
          'Drafting follows the registry; it does not invent new official artifacts.',
        ),
        draftingGate(
          'professional_owners',
          'Professional owners assigned',
          productDesignCloseout.responsibilityMatrix.matrixStatus,
          ['advanced_professional_responsibility_assignment_matrix'],
          'Every draft keeps a visible professional owner before review.',
        ),
        draftingGate(
          'guardrails',
          'Formal guardrails active',
          productDesignCloseout.guardrailPack.packStatus,
          ['advanced_formal_product_risk_guardrail_pack'],
          'Drafts remain previews until external review, signoff or certification.',
        ),
      ];
    const blockers =
      productDesignCloseout.finalDecision ===
      'ready_for_formal_artifact_drafting'
        ? [...productDesignCloseout.blockers]
        : unique([
            ...productDesignCloseout.blockers,
            `Formal design decision is ${productDesignCloseout.finalDecision}.`,
          ]);
    const anchorStatus = resolveStatus(
      draftingGates.map((gate) => gate.status),
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      anchorStatus,
      productDesignCloseout,
      draftingGates,
      summary: {
        gateCount: draftingGates.length,
        readyGateCount: draftingGates.filter((gate) => gate.status === 'ready')
          .length,
        needsReviewGateCount: draftingGates.filter(
          (gate) => gate.status === 'needs_review',
        ).length,
        blockedGateCount: draftingGates.filter(
          (gate) => gate.status === 'blocked',
        ).length,
        designArtifactCount:
          productDesignCloseout.artifactRegistry.summary.artifactCount,
      },
      blockers,
      nextStep:
        anchorStatus === 'blocked'
          ? 'Volver a diseno formal antes de preparar borradores.'
          : 'Preparar draft pack de ajustes avanzados para revision profesional.',
      guardrails: [
        'Formal Artifact Drafting 0.8 prepara borradores, no artefactos oficiales.',
        'Ningun draft se firma, certifica, legaliza ni postea automaticamente.',
      ],
    };
  }
}

export class GetTenantAccountingAdvancedAdjustmentDraftPackUseCase {
  constructor(
    private readonly getTenantAccountingAdvancedFormalArtifactDraftingAnchorUseCase: GetTenantAccountingAdvancedFormalArtifactDraftingAnchorUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantAccountingAdvancedAdjustmentDraftPackView> {
    const draftingAnchor =
      await this.getTenantAccountingAdvancedFormalArtifactDraftingAnchorUseCase.execute(
        input,
      );
    const adjustmentWorkbench =
      draftingAnchor.productDesignCloseout.scopeContract.formalReadinessCloseout
        .formalBooksPacket.financialStatementWorkspace.adjustmentWorkbench;
    const draftAdjustments: TenantAccountingAdvancedAdjustmentDraftPackView['draftAdjustments'] =
      [
        adjustmentDraft(
          'accrual_cutoff',
          'Accrual cutoff draft',
          adjustmentWorkbench.workbenchStatus,
          'accrual',
          ['advanced_adjustment_automation_workbench'],
          'Confirmar devengos de cierre antes de convertirlos en asiento formal.',
        ),
        adjustmentDraft(
          'tax_account_reclassification',
          'Tax account reclassification draft',
          'needs_review',
          'reclassification',
          ['tax_compliance_accounting_bridge', 'chart_mapping_management'],
          'Validar si la reclasificacion fiscal debe afectar libros formales.',
        ),
        adjustmentDraft(
          'estimation_review',
          'Estimation review draft',
          'needs_review',
          'estimation',
          ['financial_statement_preview'],
          'Confirmar estimaciones antes de exponer estados financieros.',
        ),
        adjustmentDraft(
          'cleanup_candidates',
          'Cleanup candidates draft',
          'ready',
          'cleanup',
          ['corrections_queue', 'audit_trail_workspace'],
          'Separar limpieza operativa de ajuste profesional.',
        ),
      ];
    const blockers = [...draftingAnchor.blockers];
    const packStatus = resolveStatus(
      draftAdjustments.map((draft) => draft.status),
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      packStatus,
      draftingAnchor,
      draftAdjustments,
      summary: draftSummary(draftAdjustments),
      blockers,
      nextStep:
        'Usar ajustes en borrador para construir libro diario y mayor preliminares.',
      guardrails: [
        'Los ajustes son recomendaciones revisables; no se materializan como asiento oficial.',
        'Cada ajuste conserva pregunta profesional y evidencia antes de aprobar.',
      ],
    };
  }
}

export class GetTenantAccountingAdvancedFormalBooksDraftWorkspaceUseCase {
  constructor(
    private readonly getTenantAccountingAdvancedAdjustmentDraftPackUseCase: GetTenantAccountingAdvancedAdjustmentDraftPackUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantAccountingAdvancedFormalBooksDraftWorkspaceView> {
    const adjustmentDraftPack =
      await this.getTenantAccountingAdvancedAdjustmentDraftPackUseCase.execute(
        input,
      );
    const formalBooksPacket =
      adjustmentDraftPack.draftingAnchor.productDesignCloseout.scopeContract
        .formalReadinessCloseout.formalBooksPacket;
    const bookDrafts: TenantAccountingAdvancedFormalBooksDraftWorkspaceView['bookDrafts'] =
      [
        bookDraft(
          'draft_journal_book',
          'Draft journal book',
          formalBooksPacket.packetStatus,
          'journal',
          ['journal_registry', 'advanced_adjustment_draft_pack'],
          'Diario en borrador pendiente de revision y firma profesional.',
        ),
        bookDraft(
          'draft_ledger_book',
          'Draft ledger book',
          'needs_review',
          'ledger',
          ['ledger_registry_workspace', 'trial_balance_workspace'],
          'Mayor preliminar sujeto a politicas de cierre y evidencia.',
        ),
      ];
    const blockers = [...adjustmentDraftPack.blockers];
    const workspaceStatus = resolveStatus(
      bookDrafts.map((draft) => draft.status),
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      workspaceStatus,
      adjustmentDraftPack,
      bookDrafts,
      summary: {
        bookDraftCount: bookDrafts.length,
        readyBookDraftCount: bookDrafts.filter(
          (draft) => draft.status === 'ready',
        ).length,
        needsReviewBookDraftCount: bookDrafts.filter(
          (draft) => draft.status === 'needs_review',
        ).length,
        blockedBookDraftCount: bookDrafts.filter(
          (draft) => draft.status === 'blocked',
        ).length,
        adjustmentDraftCount: adjustmentDraftPack.summary.draftCount,
      },
      blockers,
      nextStep:
        'Preparar estados financieros en borrador desde libros preliminares.',
      guardrails: [
        'El workspace arma libros preliminares; no legaliza libros.',
        'El mayor y diario quedan marcados como draft hasta review profesional.',
      ],
    };
  }
}

export class GetTenantAccountingAdvancedFinancialStatementsDraftPackUseCase {
  constructor(
    private readonly getTenantAccountingAdvancedFormalBooksDraftWorkspaceUseCase: GetTenantAccountingAdvancedFormalBooksDraftWorkspaceUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantAccountingAdvancedFinancialStatementsDraftPackView> {
    const formalBooksWorkspace =
      await this.getTenantAccountingAdvancedFormalBooksDraftWorkspaceUseCase.execute(
        input,
      );
    const multiPeriodWorkspace =
      formalBooksWorkspace.adjustmentDraftPack.draftingAnchor.productDesignCloseout
        .scopeContract.formalReadinessCloseout.formalBooksPacket
        .financialStatementWorkspace;
    const statementDrafts: TenantAccountingAdvancedFinancialStatementsDraftPackView['statementDrafts'] =
      [
        statementDraft(
          'statement_of_financial_position',
          'Statement of financial position draft',
          multiPeriodWorkspace.workspaceStatus,
          'financial_position',
          `${input.year}-01..${input.period}`,
          ['financial_statement_preview', 'trial_balance_workspace'],
        ),
        statementDraft(
          'income_statement',
          'Income statement draft',
          'needs_review',
          'income_statement',
          input.period,
          ['ledger_preview_workspace', 'advanced_adjustment_draft_pack'],
        ),
        statementDraft(
          'cash_movement',
          'Cash movement draft',
          'needs_review',
          'cash_movement',
          input.period,
          ['bank_reconciliation_workspace', 'cash_closeout_readiness'],
        ),
        statementDraft(
          'period_comparison',
          'Period comparison draft',
          'ready',
          'period_comparison',
          `${input.year - 1}..${input.year}`,
          ['multi_period_financial_statement_workspace'],
        ),
      ];
    const blockers = [...formalBooksWorkspace.blockers];
    const packStatus = resolveStatus(
      statementDrafts.map((draft) => draft.status),
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      packStatus,
      formalBooksWorkspace,
      statementDrafts,
      summary: {
        statementDraftCount: statementDrafts.length,
        readyStatementDraftCount: statementDrafts.filter(
          (draft) => draft.status === 'ready',
        ).length,
        needsReviewStatementDraftCount: statementDrafts.filter(
          (draft) => draft.status === 'needs_review',
        ).length,
        blockedStatementDraftCount: statementDrafts.filter(
          (draft) => draft.status === 'blocked',
        ).length,
      },
      blockers,
      nextStep:
        'Armar conciliacion bancaria formal en borrador con prueba externa requerida.',
      guardrails: [
        'Los estados financieros son borradores; no son estados firmados.',
        'Las variaciones y comparativos requieren criterio profesional antes de emision.',
      ],
    };
  }
}

export class GetTenantAccountingAdvancedCertifiedReconciliationDraftPackUseCase {
  constructor(
    private readonly getTenantAccountingAdvancedFinancialStatementsDraftPackUseCase: GetTenantAccountingAdvancedFinancialStatementsDraftPackUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantAccountingAdvancedCertifiedReconciliationDraftPackView> {
    const financialStatementsDraftPack =
      await this.getTenantAccountingAdvancedFinancialStatementsDraftPackUseCase.execute(
        input,
      );
    const certifiedCloseout =
      financialStatementsDraftPack.formalBooksWorkspace.adjustmentDraftPack
        .draftingAnchor.productDesignCloseout.scopeContract
        .formalReadinessCloseout;
    const reconciliationDrafts: TenantAccountingAdvancedCertifiedReconciliationDraftPackView['reconciliationDrafts'] =
      certifiedCloseout.reconciliationChecks.map((check) => ({
        key: `certified_${check.key}`,
        label: check.label,
        status: check.status,
        evidenceRefs: ['certified_bank_reconciliation_readiness_closeout'],
        externalProofRequired: check.externalProofRequired,
        certificationBoundary:
          'La plataforma prepara conciliacion; certificacion requiere prueba y signoff externo.',
      }));
    const blockers = [...financialStatementsDraftPack.blockers];
    const packStatus = resolveStatus(
      reconciliationDrafts.map((draft) => draft.status),
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      packStatus,
      financialStatementsDraftPack,
      reconciliationDrafts,
      summary: {
        reconciliationDraftCount: reconciliationDrafts.length,
        readyReconciliationDraftCount: reconciliationDrafts.filter(
          (draft) => draft.status === 'ready',
        ).length,
        needsExternalProofDraftCount: reconciliationDrafts.filter(
          (draft) => draft.status === 'needs_review',
        ).length,
        blockedReconciliationDraftCount: reconciliationDrafts.filter(
          (draft) => draft.status === 'blocked',
        ).length,
      },
      blockers,
      nextStep:
        'Cerrar drafting formal y decidir si pasa a ejecucion de review profesional.',
      guardrails: [
        'Certified reconciliation draft no certifica saldos bancarios.',
        'La prueba externa y el signoff siguen fuera de automatizacion.',
      ],
    };
  }
}

export class RequestTenantAccountingAdvancedFormalArtifactDraftingCloseoutUseCase {
  constructor(
    private readonly getTenantAccountingAdvancedCertifiedReconciliationDraftPackUseCase: GetTenantAccountingAdvancedCertifiedReconciliationDraftPackUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantAccountingAdvancedFormalArtifactDraftingCloseoutView> {
    const certifiedReconciliationDraftPack =
      await this.getTenantAccountingAdvancedCertifiedReconciliationDraftPackUseCase.execute(
        input,
      );
    const { financialStatementsDraftPack } = certifiedReconciliationDraftPack;
    const { formalBooksWorkspace } = financialStatementsDraftPack;
    const { adjustmentDraftPack } = formalBooksWorkspace;
    const { draftingAnchor } = adjustmentDraftPack;
    const closeoutChecklist: TenantAccountingAdvancedFormalArtifactDraftingCloseoutView['closeoutChecklist'] =
      [
        draftingCloseoutCheck('drafting_anchor', 'Formal drafting anchor', draftingAnchor.anchorStatus, [
          'advanced_formal_artifact_drafting_anchor',
        ]),
        draftingCloseoutCheck('adjustment_drafts', 'Advanced adjustment drafts', adjustmentDraftPack.packStatus, [
          'advanced_adjustment_draft_pack',
        ]),
        draftingCloseoutCheck('formal_books', 'Journal and ledger book drafts', formalBooksWorkspace.workspaceStatus, [
          'advanced_formal_books_draft_workspace',
        ]),
        draftingCloseoutCheck('financial_statements', 'Financial statement drafts', financialStatementsDraftPack.packStatus, [
          'advanced_financial_statements_draft_pack',
        ]),
        draftingCloseoutCheck('certified_reconciliation', 'Certified reconciliation draft pack', certifiedReconciliationDraftPack.packStatus, [
          'advanced_certified_reconciliation_draft_pack',
        ]),
      ];
    const blockers = unique([
      ...draftingAnchor.blockers,
      ...adjustmentDraftPack.blockers,
      ...formalBooksWorkspace.blockers,
      ...financialStatementsDraftPack.blockers,
      ...certifiedReconciliationDraftPack.blockers,
    ]);
    const closeoutStatus = resolveStatus(
      closeoutChecklist.map((item) => item.status),
      blockers,
    );
    const finalDecision = formalArtifactDraftingDecisionFromStatus(
      closeoutStatus,
      draftingAnchor,
      certifiedReconciliationDraftPack,
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      closeoutStatus,
      draftingAnchor,
      adjustmentDraftPack,
      formalBooksWorkspace,
      financialStatementsDraftPack,
      certifiedReconciliationDraftPack,
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
        adjustmentDraftCount: adjustmentDraftPack.summary.draftCount,
        bookDraftCount: formalBooksWorkspace.summary.bookDraftCount,
        statementDraftCount:
          financialStatementsDraftPack.summary.statementDraftCount,
        reconciliationDraftCount:
          certifiedReconciliationDraftPack.summary.reconciliationDraftCount,
      },
      blockers,
      nextStep:
        finalDecision === 'ready_for_professional_review_execution'
          ? 'Iniciar 0.9 Professional Review Execution con drafts trazables.'
          : finalDecision === 'needs_draft_evidence'
            ? 'Completar evidencia de borradores antes de review profesional.'
            : finalDecision === 'return_to_formal_product_design'
              ? 'Volver a 0.7 para corregir scope, owners o guardrails.'
              : 'No preparar artefactos formales para este periodo.',
      guardrails: [
        'Closeout 0.8 valida drafts; no produce documentos oficiales.',
        'La siguiente capa debe ejecutar review profesional antes de emitir, firmar, certificar o legalizar.',
      ],
    };
  }
}

export class GetTenantAccountingAdvancedProfessionalReviewExecutionAnchorUseCase {
  constructor(
    private readonly requestTenantAccountingAdvancedFormalArtifactDraftingCloseoutUseCase: RequestTenantAccountingAdvancedFormalArtifactDraftingCloseoutUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantAccountingAdvancedProfessionalReviewExecutionAnchorView> {
    const draftingCloseout =
      await this.requestTenantAccountingAdvancedFormalArtifactDraftingCloseoutUseCase.execute(
        input,
      );
    const reviewGates: TenantAccountingAdvancedProfessionalReviewExecutionAnchorView['reviewGates'] =
      [
        professionalReviewGate(
          'drafting_closeout',
          'Formal drafting closeout complete',
          draftingCloseout.closeoutStatus,
          ['advanced_formal_artifact_drafting_closeout'],
          'external_accountant',
          'Professional review starts only from traceable drafts.',
        ),
        professionalReviewGate(
          'changeable_drafts',
          'Drafts remain changeable',
          'ready',
          ['advanced_adjustment_draft_pack', 'advanced_formal_books_draft_workspace'],
          'operator',
          'Review can request changes before approval workflow.',
        ),
        professionalReviewGate(
          'external_reviewers',
          'External reviewers visible',
          draftingCloseout.draftingAnchor.productDesignCloseout
            .responsibilityMatrix.matrixStatus,
          ['advanced_professional_responsibility_assignment_matrix'],
          'external_accountant',
          'The platform never becomes the professional reviewer.',
        ),
        professionalReviewGate(
          'certification_boundary',
          'Certification boundary preserved',
          draftingCloseout.certifiedReconciliationDraftPack.packStatus,
          ['advanced_certified_reconciliation_draft_pack'],
          'auditor',
          'Certified reconciliation still requires external proof and signoff.',
        ),
      ];
    const blockers =
      draftingCloseout.finalDecision ===
      'ready_for_professional_review_execution'
        ? [...draftingCloseout.blockers]
        : unique([
            ...draftingCloseout.blockers,
            `Formal drafting decision is ${draftingCloseout.finalDecision}.`,
          ]);
    const anchorStatus = resolveStatus(
      reviewGates.map((gate) => gate.status),
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      anchorStatus,
      draftingCloseout,
      reviewGates,
      summary: {
        gateCount: reviewGates.length,
        readyGateCount: reviewGates.filter((gate) => gate.status === 'ready')
          .length,
        needsReviewGateCount: reviewGates.filter(
          (gate) => gate.status === 'needs_review',
        ).length,
        blockedGateCount: reviewGates.filter(
          (gate) => gate.status === 'blocked',
        ).length,
        draftArtifactCount:
          draftingCloseout.summary.adjustmentDraftCount +
          draftingCloseout.summary.bookDraftCount +
          draftingCloseout.summary.statementDraftCount +
          draftingCloseout.summary.reconciliationDraftCount,
      },
      blockers,
      nextStep:
        anchorStatus === 'blocked'
          ? 'Volver a drafting 0.8 antes de ejecutar review profesional.'
          : 'Abrir sala de review para contador y revisores externos.',
      guardrails: [
        'Review Execution 0.9 revisa drafts; no firma, certifica ni legaliza.',
        'Toda decision profesional queda trazada como recomendacion o cambio solicitado.',
      ],
    };
  }
}

export class GetTenantAccountingAdvancedAccountantDraftReviewRoomUseCase {
  constructor(
    private readonly getTenantAccountingAdvancedProfessionalReviewExecutionAnchorUseCase: GetTenantAccountingAdvancedProfessionalReviewExecutionAnchorUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantAccountingAdvancedAccountantDraftReviewRoomView> {
    const reviewAnchor =
      await this.getTenantAccountingAdvancedProfessionalReviewExecutionAnchorUseCase.execute(
        input,
      );
    const reviewRows: TenantAccountingAdvancedAccountantDraftReviewRoomView['reviewRows'] =
      [
        draftReviewRow(
          'adjustment_pack_review',
          'Advanced adjustment draft review',
          reviewAnchor.draftingCloseout.adjustmentDraftPack.packStatus,
          'adjustment_pack',
          'external_accountant',
          'Ajustes requieren confirmacion antes de afectar borradores formales.',
          'request_changes',
        ),
        draftReviewRow(
          'journal_book_review',
          'Journal book draft review',
          reviewAnchor.draftingCloseout.formalBooksWorkspace.workspaceStatus,
          'journal_book',
          'external_accountant',
          'Diario preliminar listo para revision de secuencia y soporte.',
          'approve_for_recommendation',
        ),
        draftReviewRow(
          'ledger_book_review',
          'Ledger book draft review',
          'needs_review',
          'ledger_book',
          'external_accountant',
          'Mayor necesita validar saldos y politicas de cierre.',
          'request_changes',
        ),
        draftReviewRow(
          'financial_statement_review',
          'Financial statement draft review',
          reviewAnchor.draftingCloseout.financialStatementsDraftPack.packStatus,
          'financial_statement',
          'legal_representative',
          'Estados financieros necesitan validacion profesional antes de aprobacion.',
          'needs_external_signoff',
        ),
        draftReviewRow(
          'certified_reconciliation_review',
          'Certified reconciliation draft review',
          reviewAnchor.draftingCloseout.certifiedReconciliationDraftPack
            .packStatus,
          'certified_reconciliation',
          'auditor',
          'Conciliacion certificable requiere prueba externa antes de avanzar.',
          'needs_external_signoff',
        ),
      ];
    const blockers = [...reviewAnchor.blockers];
    const roomStatus = resolveStatus(
      reviewRows.map((row) => row.status),
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      roomStatus,
      reviewAnchor,
      reviewRows,
      summary: {
        reviewRowCount: reviewRows.length,
        approveForRecommendationCount: reviewRows.filter(
          (row) => row.preliminaryDecision === 'approve_for_recommendation',
        ).length,
        changeRequestCount: reviewRows.filter(
          (row) => row.preliminaryDecision === 'request_changes',
        ).length,
        externalSignoffCount: reviewRows.filter(
          (row) => row.preliminaryDecision === 'needs_external_signoff',
        ).length,
        rejectedDraftCount: reviewRows.filter(
          (row) => row.preliminaryDecision === 'reject_draft',
        ).length,
      },
      blockers,
      nextStep:
        'Convertir observaciones profesionales en change requests trazables.',
      guardrails: [
        'La sala de review organiza hallazgos; no aprueba formalmente.',
        'Los revisores externos conservan criterio y veto sobre cada draft.',
      ],
    };
  }
}

export class GetTenantAccountingAdvancedReviewChangeRequestPackUseCase {
  constructor(
    private readonly getTenantAccountingAdvancedAccountantDraftReviewRoomUseCase: GetTenantAccountingAdvancedAccountantDraftReviewRoomUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantAccountingAdvancedReviewChangeRequestPackView> {
    const reviewRoom =
      await this.getTenantAccountingAdvancedAccountantDraftReviewRoomUseCase.execute(
        input,
      );
    const changeRequests: TenantAccountingAdvancedReviewChangeRequestPackView['changeRequests'] =
      reviewRoom.reviewRows
        .filter((row) => row.preliminaryDecision !== 'approve_for_recommendation')
        .map((row) =>
          reviewChangeRequest(
            `change_${row.key}`,
            `${row.label} change request`,
            row.status,
            row.key,
            row.reviewer,
            changeActionFromReviewRow(row),
            ['advanced_accountant_draft_review_room'],
          ),
        );
    const blockers = [...reviewRoom.blockers];
    const packStatus = resolveStatus(
      changeRequests.map((request) => request.status),
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      packStatus,
      reviewRoom,
      changeRequests,
      summary: {
        changeRequestCount: changeRequests.length,
        readyChangeRequestCount: changeRequests.filter(
          (request) => request.status === 'ready',
        ).length,
        needsReviewChangeRequestCount: changeRequests.filter(
          (request) => request.status === 'needs_review',
        ).length,
        blockedChangeRequestCount: changeRequests.filter(
          (request) => request.status === 'blocked',
        ).length,
      },
      blockers,
      nextStep:
        'Preparar recomendaciones de aprobacion para drafts sin cambios criticos.',
      guardrails: [
        'Change requests son backlog de revision, no modificaciones automaticas.',
        'Cada solicitud conserva reviewer, accion requerida y evidencia fuente.',
      ],
    };
  }
}

export class RequestTenantAccountingAdvancedProfessionalApprovalRecommendationPackUseCase {
  constructor(
    private readonly getTenantAccountingAdvancedReviewChangeRequestPackUseCase: GetTenantAccountingAdvancedReviewChangeRequestPackUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantAccountingAdvancedProfessionalApprovalRecommendationPackView> {
    const changeRequestPack =
      await this.getTenantAccountingAdvancedReviewChangeRequestPackUseCase.execute(
        input,
      );
    const recommendations: TenantAccountingAdvancedProfessionalApprovalRecommendationPackView['recommendations'] =
      changeRequestPack.reviewRoom.reviewRows.map((row) =>
        approvalRecommendation(
          `recommendation_${row.key}`,
          `${row.label} recommendation`,
          row.status,
          row.artifactType,
          recommendationFromReviewRow(row),
          row.reviewer,
          recommendationRationaleFromReviewRow(row),
        ),
      );
    const blockers = [...changeRequestPack.blockers];
    const packStatus = resolveStatus(
      recommendations.map((recommendation) => recommendation.status),
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      packStatus,
      changeRequestPack,
      recommendations,
      summary: {
        recommendationCount: recommendations.length,
        recommendApprovalCount: recommendations.filter(
          (item) => item.recommendation === 'recommend_approval',
        ).length,
        requireChangesCount: recommendations.filter(
          (item) => item.recommendation === 'require_changes_first',
        ).length,
        requireAuditorReviewCount: recommendations.filter(
          (item) => item.recommendation === 'require_auditor_review',
        ).length,
        doNotApproveCount: recommendations.filter(
          (item) => item.recommendation === 'do_not_approve',
        ).length,
      },
      blockers,
      nextStep:
        'Consolidar command center de review profesional antes del closeout 0.9.',
      guardrails: [
        'Approval recommendation no firma ni aprueba formalmente.',
        'Recomendaciones solo habilitan el siguiente workflow controlado.',
      ],
    };
  }
}

export class GetTenantAccountingAdvancedReviewExecutionCommandCenterUseCase {
  constructor(
    private readonly requestTenantAccountingAdvancedProfessionalApprovalRecommendationPackUseCase: RequestTenantAccountingAdvancedProfessionalApprovalRecommendationPackUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantAccountingAdvancedReviewExecutionCommandCenterView> {
    const approvalRecommendationPack =
      await this.requestTenantAccountingAdvancedProfessionalApprovalRecommendationPackUseCase.execute(
        input,
      );
    const { changeRequestPack } = approvalRecommendationPack;
    const { reviewRoom } = changeRequestPack;
    const { reviewAnchor } = reviewRoom;
    const lanes: TenantAccountingAdvancedReviewExecutionCommandCenterView['lanes'] =
      [
        reviewCommandLane(
          'review_anchor',
          'Review execution anchor',
          reviewAnchor.anchorStatus,
          'external_accountant',
          `${reviewAnchor.summary.readyGateCount}/${reviewAnchor.summary.gateCount} gates`,
          reviewAnchor.nextStep,
        ),
        reviewCommandLane(
          'review_room',
          'Accountant draft review room',
          reviewRoom.roomStatus,
          'external_accountant',
          `${reviewRoom.summary.reviewRowCount} reviews`,
          reviewRoom.nextStep,
        ),
        reviewCommandLane(
          'change_requests',
          'Review change requests',
          changeRequestPack.packStatus,
          'operator',
          `${changeRequestPack.summary.changeRequestCount} requests`,
          changeRequestPack.nextStep,
        ),
        reviewCommandLane(
          'approval_recommendations',
          'Approval recommendations',
          approvalRecommendationPack.packStatus,
          'external_accountant',
          `${approvalRecommendationPack.summary.recommendApprovalCount} recommended`,
          approvalRecommendationPack.nextStep,
        ),
      ];
    const blockers = unique([
      ...reviewAnchor.blockers,
      ...reviewRoom.blockers,
      ...changeRequestPack.blockers,
      ...approvalRecommendationPack.blockers,
    ]);
    const commandStatus = resolveStatus(
      lanes.map((lane) => lane.status),
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      commandStatus,
      approvalRecommendationPack,
      lanes,
      summary: {
        laneCount: lanes.length,
        readyLaneCount: lanes.filter((lane) => lane.status === 'ready').length,
        needsReviewLaneCount: lanes.filter(
          (lane) => lane.status === 'needs_review',
        ).length,
        blockedLaneCount: lanes.filter((lane) => lane.status === 'blocked')
          .length,
        recommendationCount:
          approvalRecommendationPack.summary.recommendationCount,
        changeRequestCount: changeRequestPack.summary.changeRequestCount,
      },
      blockers,
      nextStep:
        'Cerrar ejecucion de review profesional y decidir si avanza a approval workflow.',
      guardrails: [
        'Command center consolida estado; no ejecuta signoff formal.',
        'Aprobacion, firma, certificacion y legalizacion siguen en capas posteriores.',
      ],
    };
  }
}

export class RequestTenantAccountingAdvancedProfessionalReviewExecutionCloseoutUseCase {
  constructor(
    private readonly getTenantAccountingAdvancedReviewExecutionCommandCenterUseCase: GetTenantAccountingAdvancedReviewExecutionCommandCenterUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantAccountingAdvancedProfessionalReviewExecutionCloseoutView> {
    const commandCenter =
      await this.getTenantAccountingAdvancedReviewExecutionCommandCenterUseCase.execute(
        input,
      );
    const { approvalRecommendationPack } = commandCenter;
    const { changeRequestPack } = approvalRecommendationPack;
    const { reviewRoom } = changeRequestPack;
    const { reviewAnchor } = reviewRoom;
    const closeoutChecklist: TenantAccountingAdvancedProfessionalReviewExecutionCloseoutView['closeoutChecklist'] =
      [
        professionalReviewCloseoutCheck('review_anchor', 'Professional review anchor', reviewAnchor.anchorStatus, [
          'advanced_professional_review_execution_anchor',
        ]),
        professionalReviewCloseoutCheck('review_room', 'Accountant draft review room', reviewRoom.roomStatus, [
          'advanced_accountant_draft_review_room',
        ]),
        professionalReviewCloseoutCheck('change_requests', 'Review change request pack', changeRequestPack.packStatus, [
          'advanced_review_change_request_pack',
        ]),
        professionalReviewCloseoutCheck('approval_recommendations', 'Professional approval recommendation pack', approvalRecommendationPack.packStatus, [
          'advanced_professional_approval_recommendation_pack',
        ]),
        professionalReviewCloseoutCheck('command_center', 'Review execution command center', commandCenter.commandStatus, [
          'advanced_review_execution_command_center',
        ]),
      ];
    const blockers = unique([
      ...reviewAnchor.blockers,
      ...reviewRoom.blockers,
      ...changeRequestPack.blockers,
      ...approvalRecommendationPack.blockers,
      ...commandCenter.blockers,
    ]);
    const closeoutStatus = resolveStatus(
      closeoutChecklist.map((item) => item.status),
      blockers,
    );
    const finalDecision = professionalReviewExecutionDecisionFromStatus(
      closeoutStatus,
      approvalRecommendationPack,
      commandCenter,
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      closeoutStatus,
      reviewAnchor,
      reviewRoom,
      changeRequestPack,
      approvalRecommendationPack,
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
        reviewRowCount: reviewRoom.summary.reviewRowCount,
        changeRequestCount: changeRequestPack.summary.changeRequestCount,
        recommendationCount:
          approvalRecommendationPack.summary.recommendationCount,
        readyLaneCount: commandCenter.summary.readyLaneCount,
      },
      blockers,
      nextStep:
        finalDecision === 'ready_for_formal_approval_workflow'
          ? 'Iniciar 1.0 Formal Approval Workflow con recomendaciones trazables.'
          : finalDecision === 'needs_more_changes'
            ? 'Resolver cambios solicitados antes del approval workflow.'
            : finalDecision === 'return_to_artifact_drafting'
              ? 'Volver a drafting 0.8 para corregir borradores.'
              : 'No avanzar artefactos formales para este periodo.',
      guardrails: [
        'Professional review execution closeout no firma ni legaliza artefactos.',
        'La siguiente capa debe modelar aprobaciones formales con owners externos explicitos.',
      ],
    };
  }
}

export class GetTenantAccountingAdvancedFormalApprovalWorkflowAnchorUseCase {
  constructor(
    private readonly requestTenantAccountingAdvancedProfessionalReviewExecutionCloseoutUseCase: RequestTenantAccountingAdvancedProfessionalReviewExecutionCloseoutUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantAccountingAdvancedFormalApprovalWorkflowAnchorView> {
    const professionalReviewCloseout =
      await this.requestTenantAccountingAdvancedProfessionalReviewExecutionCloseoutUseCase.execute(
        input,
      );
    const approvalGates: TenantAccountingAdvancedFormalApprovalWorkflowAnchorView['approvalGates'] =
      [
        formalApprovalGate('professional_review_closeout', 'Professional review closeout complete', professionalReviewCloseout.closeoutStatus, ['advanced_professional_review_execution_closeout'], 'external_accountant', 'Formal approval can only start from reviewed drafts.'),
        formalApprovalGate('approval_recommendations', 'Approval recommendations available', professionalReviewCloseout.approvalRecommendationPack.packStatus, ['advanced_professional_approval_recommendation_pack'], 'external_accountant', 'Recommendations are input evidence, not approvals.'),
        formalApprovalGate('change_requests', 'Change requests understood', professionalReviewCloseout.changeRequestPack.packStatus, ['advanced_review_change_request_pack'], 'operator', 'Open changes must be visible before approval decisions.'),
        formalApprovalGate('external_signoff_boundary', 'External signoff boundary preserved', professionalReviewCloseout.commandCenter.commandStatus, ['advanced_review_execution_command_center'], 'auditor', 'Signature and certification remain outside this workflow.'),
      ];
    const blockers =
      professionalReviewCloseout.finalDecision ===
      'ready_for_formal_approval_workflow'
        ? [...professionalReviewCloseout.blockers]
        : unique([
            ...professionalReviewCloseout.blockers,
            `Professional review decision is ${professionalReviewCloseout.finalDecision}.`,
          ]);
    const anchorStatus = resolveStatus(
      approvalGates.map((gate) => gate.status),
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      anchorStatus,
      professionalReviewCloseout,
      approvalGates,
      summary: {
        gateCount: approvalGates.length,
        readyGateCount: approvalGates.filter((gate) => gate.status === 'ready')
          .length,
        needsReviewGateCount: approvalGates.filter(
          (gate) => gate.status === 'needs_review',
        ).length,
        blockedGateCount: approvalGates.filter(
          (gate) => gate.status === 'blocked',
        ).length,
        recommendationCount:
          professionalReviewCloseout.summary.recommendationCount,
      },
      blockers,
      nextStep:
        anchorStatus === 'blocked'
          ? 'Volver a review profesional antes de approval workflow.'
          : 'Construir matriz de autoridad para aprobaciones formales.',
      guardrails: [
        'Formal Approval Workflow 1.0 decide aprobaciones internas de workflow; no firma ni certifica.',
        'Cada aprobacion mantiene owner externo y boundary visible.',
      ],
    };
  }
}

export class GetTenantAccountingAdvancedApprovalAuthorityMatrixUseCase {
  constructor(
    private readonly getTenantAccountingAdvancedFormalApprovalWorkflowAnchorUseCase: GetTenantAccountingAdvancedFormalApprovalWorkflowAnchorUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantAccountingAdvancedApprovalAuthorityMatrixView> {
    const approvalAnchor =
      await this.getTenantAccountingAdvancedFormalApprovalWorkflowAnchorUseCase.execute(
        input,
      );
    const authorities: TenantAccountingAdvancedApprovalAuthorityMatrixView['authorities'] =
      [
        approvalAuthority('adjustment_pack_authority', 'Adjustment pack approval authority', 'adjustment_pack', 'needs_review', 'external_accountant', 'Contador externo aprueba el paquete antes de cualquier posteo formal.'),
        approvalAuthority('journal_book_authority', 'Journal book approval authority', 'journal_book', 'ready', 'external_accountant', 'Contador externo aprueba el diario antes de firma/legalizacion.'),
        approvalAuthority('ledger_book_authority', 'Ledger book approval authority', 'ledger_book', 'needs_review', 'external_accountant', 'Contador externo valida mayor y saldos antes de firma/legalizacion.'),
        approvalAuthority('financial_statement_authority', 'Financial statement approval authority', 'financial_statement', 'needs_review', 'legal_representative', 'Representante legal conserva aprobacion antes de firma.'),
        approvalAuthority('certified_reconciliation_authority', 'Certified reconciliation approval authority', 'certified_reconciliation', 'needs_review', 'auditor', 'Auditor o tercero autorizado conserva certificacion bancaria.'),
      ];
    const blockers = [...approvalAnchor.blockers];
    const matrixStatus = resolveStatus(
      authorities.map((authority) => authority.status),
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      matrixStatus,
      approvalAnchor,
      authorities,
      summary: {
        authorityCount: authorities.length,
        accountantAuthorityCount: authorities.filter(
          (authority) => authority.requiredOwner === 'external_accountant',
        ).length,
        auditorAuthorityCount: authorities.filter(
          (authority) => authority.requiredOwner === 'auditor',
        ).length,
        legalRepresentativeAuthorityCount: authorities.filter(
          (authority) => authority.requiredOwner === 'legal_representative',
        ).length,
        needsReviewAuthorityCount: authorities.filter(
          (authority) => authority.status === 'needs_review',
        ).length,
      },
      blockers,
      nextStep:
        'Armar evidencia requerida por autoridad antes de decision workspace.',
      guardrails: [
        'Authority matrix asigna llaves; no ejecuta aprobaciones.',
        'La plataforma no aparece como aprobador profesional.',
      ],
    };
  }
}

export class GetTenantAccountingAdvancedFormalApprovalEvidencePackUseCase {
  constructor(
    private readonly getTenantAccountingAdvancedApprovalAuthorityMatrixUseCase: GetTenantAccountingAdvancedApprovalAuthorityMatrixUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantAccountingAdvancedFormalApprovalEvidencePackView> {
    const authorityMatrix =
      await this.getTenantAccountingAdvancedApprovalAuthorityMatrixUseCase.execute(
        input,
      );
    const evidenceItems = authorityMatrix.authorities.map((authority) =>
      approvalEvidence(
        `evidence_${authority.key}`,
        `${authority.label} evidence`,
        authority.status,
        authority.artifactType,
        ['advanced_professional_review_execution_closeout', authority.key],
        `Confirmar si ${authority.requiredOwner} puede aprobar ${authority.artifactType} sin cruzar firma/certificacion.`,
      ),
    );
    const blockers = [...authorityMatrix.blockers];
    const packStatus = resolveStatus(
      evidenceItems.map((item) => item.status),
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      packStatus,
      authorityMatrix,
      evidenceItems,
      summary: {
        evidenceItemCount: evidenceItems.length,
        readyEvidenceItemCount: evidenceItems.filter(
          (item) => item.status === 'ready',
        ).length,
        needsReviewEvidenceItemCount: evidenceItems.filter(
          (item) => item.status === 'needs_review',
        ).length,
        blockedEvidenceItemCount: evidenceItems.filter(
          (item) => item.status === 'blocked',
        ).length,
      },
      blockers,
      nextStep: 'Abrir decision workspace con evidencia y autoridad visible.',
      guardrails: [
        'Evidence pack es expediente de aprobacion; no documento oficial.',
        'Toda evidencia conserva boundary de firma/certificacion posterior.',
      ],
    };
  }
}

export class GetTenantAccountingAdvancedApprovalDecisionWorkspaceUseCase {
  constructor(
    private readonly getTenantAccountingAdvancedFormalApprovalEvidencePackUseCase: GetTenantAccountingAdvancedFormalApprovalEvidencePackUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantAccountingAdvancedApprovalDecisionWorkspaceView> {
    const evidencePack =
      await this.getTenantAccountingAdvancedFormalApprovalEvidencePackUseCase.execute(
        input,
      );
    const decisions = evidencePack.evidenceItems.map((item) =>
      approvalDecision(
        `decision_${item.key}`,
        `${item.label} decision`,
        item.status,
        item.artifactType,
        approvalDecisionFromEvidence(item),
        ownerFromArtifactType(item.artifactType),
        approvalDecisionRationale(item),
      ),
    );
    const blockers = [...evidencePack.blockers];
    const workspaceStatus = resolveStatus(
      decisions.map((decision) => decision.status),
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      workspaceStatus,
      evidencePack,
      decisions,
      summary: {
        decisionCount: decisions.length,
        approvedPendingSignatureCount: decisions.filter(
          (decision) => decision.decision === 'approved_pending_signature',
        ).length,
        requiresChangesCount: decisions.filter(
          (decision) => decision.decision === 'requires_changes',
        ).length,
        rejectedCount: decisions.filter((decision) => decision.decision === 'rejected')
          .length,
        requiresExternalSignoffCount: decisions.filter(
          (decision) => decision.decision === 'requires_external_signoff',
        ).length,
      },
      blockers,
      nextStep: 'Consolidar command center de approval workflow.',
      guardrails: [
        'Approved pending signature no equivale a firma ni legalizacion.',
        'Decisiones de workflow pueden devolver artefactos a review profesional.',
      ],
    };
  }
}

export class GetTenantAccountingAdvancedFormalApprovalCommandCenterUseCase {
  constructor(
    private readonly getTenantAccountingAdvancedApprovalDecisionWorkspaceUseCase: GetTenantAccountingAdvancedApprovalDecisionWorkspaceUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantAccountingAdvancedFormalApprovalCommandCenterView> {
    const decisionWorkspace =
      await this.getTenantAccountingAdvancedApprovalDecisionWorkspaceUseCase.execute(
        input,
      );
    const { evidencePack } = decisionWorkspace;
    const { authorityMatrix } = evidencePack;
    const { approvalAnchor } = authorityMatrix;
    const lanes: TenantAccountingAdvancedFormalApprovalCommandCenterView['lanes'] =
      [
        formalApprovalLane('approval_anchor', 'Approval workflow anchor', approvalAnchor.anchorStatus, 'external_accountant', `${approvalAnchor.summary.readyGateCount}/${approvalAnchor.summary.gateCount} gates`, approvalAnchor.nextStep),
        formalApprovalLane('authority_matrix', 'Approval authority matrix', authorityMatrix.matrixStatus, 'external_accountant', `${authorityMatrix.summary.authorityCount} authorities`, authorityMatrix.nextStep),
        formalApprovalLane('evidence_pack', 'Formal approval evidence pack', evidencePack.packStatus, 'operator', `${evidencePack.summary.evidenceItemCount} evidence`, evidencePack.nextStep),
        formalApprovalLane('decision_workspace', 'Approval decision workspace', decisionWorkspace.workspaceStatus, 'legal_representative', `${decisionWorkspace.summary.approvedPendingSignatureCount} approved`, decisionWorkspace.nextStep),
      ];
    const blockers = unique([
      ...approvalAnchor.blockers,
      ...authorityMatrix.blockers,
      ...evidencePack.blockers,
      ...decisionWorkspace.blockers,
    ]);
    const commandStatus = resolveStatus(
      lanes.map((lane) => lane.status),
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      commandStatus,
      decisionWorkspace,
      lanes,
      summary: {
        laneCount: lanes.length,
        readyLaneCount: lanes.filter((lane) => lane.status === 'ready').length,
        needsReviewLaneCount: lanes.filter(
          (lane) => lane.status === 'needs_review',
        ).length,
        blockedLaneCount: lanes.filter((lane) => lane.status === 'blocked')
          .length,
        approvedPendingSignatureCount:
          decisionWorkspace.summary.approvedPendingSignatureCount,
        externalSignoffCount:
          decisionWorkspace.summary.requiresExternalSignoffCount,
      },
      blockers,
      nextStep: 'Cerrar approval workflow y decidir siguiente frontera.',
      guardrails: [
        'Command center no firma ni certifica; solo coordina aprobaciones internas.',
        'La salida lista para firma debe pasar a una capa explicita de signature/certification.',
      ],
    };
  }
}

export class RequestTenantAccountingAdvancedFormalApprovalWorkflowCloseoutUseCase {
  constructor(
    private readonly getTenantAccountingAdvancedFormalApprovalCommandCenterUseCase: GetTenantAccountingAdvancedFormalApprovalCommandCenterUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantAccountingAdvancedFormalApprovalWorkflowCloseoutView> {
    const commandCenter =
      await this.getTenantAccountingAdvancedFormalApprovalCommandCenterUseCase.execute(
        input,
      );
    const { decisionWorkspace } = commandCenter;
    const { evidencePack } = decisionWorkspace;
    const { authorityMatrix } = evidencePack;
    const { approvalAnchor } = authorityMatrix;
    const closeoutChecklist: TenantAccountingAdvancedFormalApprovalWorkflowCloseoutView['closeoutChecklist'] =
      [
        formalApprovalCloseoutCheck('approval_anchor', 'Formal approval workflow anchor', approvalAnchor.anchorStatus, ['advanced_formal_approval_workflow_anchor']),
        formalApprovalCloseoutCheck('authority_matrix', 'Approval authority matrix', authorityMatrix.matrixStatus, ['advanced_approval_authority_matrix']),
        formalApprovalCloseoutCheck('evidence_pack', 'Formal approval evidence pack', evidencePack.packStatus, ['advanced_formal_approval_evidence_pack']),
        formalApprovalCloseoutCheck('decision_workspace', 'Approval decision workspace', decisionWorkspace.workspaceStatus, ['advanced_approval_decision_workspace']),
        formalApprovalCloseoutCheck('command_center', 'Formal approval command center', commandCenter.commandStatus, ['advanced_formal_approval_command_center']),
      ];
    const blockers = unique([
      ...approvalAnchor.blockers,
      ...authorityMatrix.blockers,
      ...evidencePack.blockers,
      ...decisionWorkspace.blockers,
      ...commandCenter.blockers,
    ]);
    const closeoutStatus = resolveStatus(
      closeoutChecklist.map((item) => item.status),
      blockers,
    );
    const finalDecision = formalApprovalWorkflowDecisionFromStatus(
      closeoutStatus,
      decisionWorkspace,
      commandCenter,
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      closeoutStatus,
      approvalAnchor,
      authorityMatrix,
      evidencePack,
      decisionWorkspace,
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
        authorityCount: authorityMatrix.summary.authorityCount,
        evidenceItemCount: evidencePack.summary.evidenceItemCount,
        decisionCount: decisionWorkspace.summary.decisionCount,
        approvedPendingSignatureCount:
          decisionWorkspace.summary.approvedPendingSignatureCount,
      },
      blockers,
      nextStep:
        finalDecision === 'ready_for_signature_and_certification'
          ? 'Iniciar 1.1 Signature, Certification & Legalization Boundaries.'
          : finalDecision === 'needs_external_approval'
            ? 'Completar aprobaciones externas antes de firma/certificacion.'
            : finalDecision === 'return_to_professional_review'
              ? 'Volver a 0.9 para resolver hallazgos profesionales.'
              : 'No aprobar artefactos formales para este periodo.',
      guardrails: [
        'Formal approval workflow closeout no firma, certifica, legaliza ni emite.',
        'La siguiente capa debe separar firmas, certificaciones y legalizaciones como actos externos.',
      ],
    };
  }
}

export class GetTenantAccountingAdvancedSignatureCertificationBoundaryAnchorUseCase {
  constructor(
    private readonly requestTenantAccountingAdvancedFormalApprovalWorkflowCloseoutUseCase: RequestTenantAccountingAdvancedFormalApprovalWorkflowCloseoutUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantAccountingAdvancedSignatureCertificationBoundaryAnchorView> {
    const formalApprovalCloseout =
      await this.requestTenantAccountingAdvancedFormalApprovalWorkflowCloseoutUseCase.execute(
        input,
      );
    const boundaryGates: TenantAccountingAdvancedSignatureCertificationBoundaryAnchorView['boundaryGates'] =
      [
        signatureBoundaryGate('approved_artifacts', 'Approved pending signature artifacts', formalApprovalCloseout.closeoutStatus, ['advanced_formal_approval_workflow_closeout'], 'signature', 'Only internally approved artifacts can approach signature.'),
        signatureBoundaryGate('financial_statement_signature', 'Financial statement signature boundary', 'needs_review', ['advanced_approval_decision_workspace'], 'signature', 'Representative signature is external and not automated.'),
        signatureBoundaryGate('bank_certification', 'Bank certification boundary', 'needs_review', ['advanced_formal_approval_command_center'], 'certification', 'Certified reconciliation requires external proof and certifier.'),
        signatureBoundaryGate('legal_book_legalization', 'Legal book legalization boundary', 'needs_review', ['advanced_approval_authority_matrix'], 'legalization', 'Journal and ledger legalization is an external professional/legal act.'),
      ];
    const blockers =
      formalApprovalCloseout.finalDecision ===
      'ready_for_signature_and_certification'
        ? [...formalApprovalCloseout.blockers]
        : unique([
            ...formalApprovalCloseout.blockers,
            `Formal approval decision is ${formalApprovalCloseout.finalDecision}.`,
          ]);
    const anchorStatus = resolveStatus(
      boundaryGates.map((gate) => gate.status),
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      anchorStatus,
      formalApprovalCloseout,
      boundaryGates,
      summary: {
        gateCount: boundaryGates.length,
        readyGateCount: boundaryGates.filter((gate) => gate.status === 'ready')
          .length,
        needsReviewGateCount: boundaryGates.filter(
          (gate) => gate.status === 'needs_review',
        ).length,
        blockedGateCount: boundaryGates.filter(
          (gate) => gate.status === 'blocked',
        ).length,
        approvedPendingSignatureCount:
          formalApprovalCloseout.summary.approvedPendingSignatureCount,
      },
      blockers,
      nextStep:
        anchorStatus === 'blocked'
          ? 'Volver a approval workflow antes de preparar fronteras formales.'
          : 'Registrar firmantes y autoridades externas requeridas.',
      guardrails: [
        'Signature/certification boundary no ejecuta firmas ni certificaciones.',
        'Cada acto formal queda clasificado antes de cualquier handoff externo.',
      ],
    };
  }
}

export class GetTenantAccountingAdvancedFormalSignatoryRegistryUseCase {
  constructor(
    private readonly getTenantAccountingAdvancedSignatureCertificationBoundaryAnchorUseCase: GetTenantAccountingAdvancedSignatureCertificationBoundaryAnchorUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantAccountingAdvancedFormalSignatoryRegistryView> {
    const boundaryAnchor =
      await this.getTenantAccountingAdvancedSignatureCertificationBoundaryAnchorUseCase.execute(
        input,
      );
    const signatories: TenantAccountingAdvancedFormalSignatoryRegistryView['signatories'] =
      [
        formalSignatory('journal_book_signatory', 'Journal book signatory', 'journal_book', 'needs_review', 'legalization', 'external_accountant', 'External accountant or authorized registry'),
        formalSignatory('ledger_book_signatory', 'Ledger book signatory', 'ledger_book', 'needs_review', 'legalization', 'external_accountant', 'External accountant or authorized registry'),
        formalSignatory('financial_statement_signatory', 'Financial statement signatory', 'financial_statement', 'needs_review', 'signature', 'legal_representative', 'Legal representative'),
        formalSignatory('certified_reconciliation_certifier', 'Certified reconciliation certifier', 'certified_reconciliation', 'needs_review', 'certification', 'auditor', 'Auditor or bank-certification authority'),
        formalSignatory('adjustment_pack_approver', 'Adjustment pack professional approver', 'adjustment_pack', 'ready', 'signature', 'external_accountant', 'External accountant approval record'),
      ];
    const blockers = [...boundaryAnchor.blockers];
    const registryStatus = resolveStatus(
      signatories.map((signatory) => signatory.status),
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      registryStatus,
      boundaryAnchor,
      signatories,
      summary: {
        signatoryCount: signatories.length,
        signatureCount: signatories.filter(
          (signatory) => signatory.requiredAct === 'signature',
        ).length,
        certificationCount: signatories.filter(
          (signatory) => signatory.requiredAct === 'certification',
        ).length,
        legalizationCount: signatories.filter(
          (signatory) => signatory.requiredAct === 'legalization',
        ).length,
        needsReviewSignatoryCount: signatories.filter(
          (signatory) => signatory.status === 'needs_review',
        ).length,
      },
      blockers,
      nextStep: 'Preparar evidence readiness para cada firmante o certifier.',
      guardrails: [
        'Signatory registry define owners; no produce firmas.',
        'Autoridades externas conservan control sobre cada acto formal.',
      ],
    };
  }
}

export class GetTenantAccountingAdvancedSignatureEvidenceReadinessPackUseCase {
  constructor(
    private readonly getTenantAccountingAdvancedFormalSignatoryRegistryUseCase: GetTenantAccountingAdvancedFormalSignatoryRegistryUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantAccountingAdvancedSignatureEvidenceReadinessPackView> {
    const signatoryRegistry =
      await this.getTenantAccountingAdvancedFormalSignatoryRegistryUseCase.execute(
        input,
      );
    const evidenceItems =
      signatoryRegistry.signatories.map((signatory) =>
        signatureEvidenceItem(
          `evidence_${signatory.key}`,
          `${signatory.label} evidence`,
          signatory.status,
          signatory.key,
          ['advanced_formal_approval_workflow_closeout', signatory.key],
          missingEvidenceFromSignatory(signatory),
        ),
      );
    const blockers = [...signatoryRegistry.blockers];
    const packStatus = resolveStatus(
      evidenceItems.map((item) => item.status),
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      packStatus,
      signatoryRegistry,
      evidenceItems,
      summary: {
        evidenceItemCount: evidenceItems.length,
        readyEvidenceItemCount: evidenceItems.filter(
          (item) => item.status === 'ready',
        ).length,
        needsReviewEvidenceItemCount: evidenceItems.filter(
          (item) => item.status === 'needs_review',
        ).length,
        blockedEvidenceItemCount: evidenceItems.filter(
          (item) => item.status === 'blocked',
        ).length,
        missingEvidenceCount: evidenceItems.flatMap(
          (item) => item.missingEvidence,
        ).length,
      },
      blockers,
      nextStep:
        'Separar requisitos de certificacion antes de cualquier ejecucion externa.',
      guardrails: [
        'Evidence readiness prepara carpeta de firma; no firma ni envia.',
        'Missing evidence debe resolverse fuera de automatizacion formal.',
      ],
    };
  }
}

export class GetTenantAccountingAdvancedCertificationRequirementWorkspaceUseCase {
  constructor(
    private readonly getTenantAccountingAdvancedSignatureEvidenceReadinessPackUseCase: GetTenantAccountingAdvancedSignatureEvidenceReadinessPackUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantAccountingAdvancedCertificationRequirementWorkspaceView> {
    const signatureEvidencePack =
      await this.getTenantAccountingAdvancedSignatureEvidenceReadinessPackUseCase.execute(
        input,
      );
    const requirements: TenantAccountingAdvancedCertificationRequirementWorkspaceView['requirements'] =
      [
        certificationRequirement('financial_statement_certification', 'Financial statement certification requirement', 'financial_statement', 'needs_review', 'Signed statement approval and legal representative signoff.', 'legal_representative'),
        certificationRequirement('bank_reconciliation_certification', 'Bank reconciliation certification requirement', 'certified_reconciliation', 'needs_review', 'External bank/auditor proof of reconciled balances.', 'auditor'),
      ];
    const blockers = [...signatureEvidencePack.blockers];
    const workspaceStatus = resolveStatus(
      requirements.map((requirement) => requirement.status),
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      workspaceStatus,
      signatureEvidencePack,
      requirements,
      summary: {
        requirementCount: requirements.length,
        readyRequirementCount: requirements.filter(
          (requirement) => requirement.status === 'ready',
        ).length,
        needsReviewRequirementCount: requirements.filter(
          (requirement) => requirement.status === 'needs_review',
        ).length,
        blockedRequirementCount: requirements.filter(
          (requirement) => requirement.status === 'blocked',
        ).length,
      },
      blockers,
      nextStep: 'Preparar legalization boundary para libros y estados.',
      guardrails: [
        'Certification workspace describe requisitos; no certifica saldos ni estados.',
        'Certificacion requiere prueba externa y autoridad asignada.',
      ],
    };
  }
}

export class GetTenantAccountingAdvancedLegalizationBoundaryPacketUseCase {
  constructor(
    private readonly getTenantAccountingAdvancedCertificationRequirementWorkspaceUseCase: GetTenantAccountingAdvancedCertificationRequirementWorkspaceUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantAccountingAdvancedLegalizationBoundaryPacketView> {
    const certificationWorkspace =
      await this.getTenantAccountingAdvancedCertificationRequirementWorkspaceUseCase.execute(
        input,
      );
    const legalizationItems: TenantAccountingAdvancedLegalizationBoundaryPacketView['legalizationItems'] =
      [
        legalizationItem('journal_book_legalization', 'Journal book legalization boundary', 'journal_book', 'needs_review', 'Libro diario requiere acto externo de legalizacion antes de oficializar.', 'external_accountant'),
        legalizationItem('ledger_book_legalization', 'Ledger book legalization boundary', 'ledger_book', 'needs_review', 'Libro mayor requiere acto externo de legalizacion antes de oficializar.', 'external_accountant'),
        legalizationItem('financial_statement_formalization', 'Financial statement formalization boundary', 'financial_statement', 'needs_review', 'Estados requieren firma/representacion antes de considerarse oficiales.', 'legal_representative'),
      ];
    const blockers = [...certificationWorkspace.blockers];
    const packetStatus = resolveStatus(
      legalizationItems.map((item) => item.status),
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      packetStatus,
      certificationWorkspace,
      legalizationItems,
      summary: {
        legalizationItemCount: legalizationItems.length,
        readyLegalizationItemCount: legalizationItems.filter(
          (item) => item.status === 'ready',
        ).length,
        needsReviewLegalizationItemCount: legalizationItems.filter(
          (item) => item.status === 'needs_review',
        ).length,
        blockedLegalizationItemCount: legalizationItems.filter(
          (item) => item.status === 'blocked',
        ).length,
      },
      blockers,
      nextStep:
        'Cerrar boundaries y decidir si se prepara handoff de ejecucion externa.',
      guardrails: [
        'Legalization packet modela la frontera; no legaliza libros.',
        'Solo un acto externo posterior puede convertir drafts en oficiales.',
      ],
    };
  }
}

export class RequestTenantAccountingAdvancedSignatureCertificationBoundaryCloseoutUseCase {
  constructor(
    private readonly getTenantAccountingAdvancedLegalizationBoundaryPacketUseCase: GetTenantAccountingAdvancedLegalizationBoundaryPacketUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantAccountingAdvancedSignatureCertificationBoundaryCloseoutView> {
    const legalizationPacket =
      await this.getTenantAccountingAdvancedLegalizationBoundaryPacketUseCase.execute(
        input,
      );
    const { certificationWorkspace } = legalizationPacket;
    const { signatureEvidencePack } = certificationWorkspace;
    const { signatoryRegistry } = signatureEvidencePack;
    const { boundaryAnchor } = signatoryRegistry;
    const closeoutChecklist: TenantAccountingAdvancedSignatureCertificationBoundaryCloseoutView['closeoutChecklist'] =
      [
        signatureBoundaryCloseoutCheck('boundary_anchor', 'Signature certification boundary anchor', boundaryAnchor.anchorStatus, ['advanced_signature_certification_boundary_anchor']),
        signatureBoundaryCloseoutCheck('signatory_registry', 'Formal signatory registry', signatoryRegistry.registryStatus, ['advanced_formal_signatory_registry']),
        signatureBoundaryCloseoutCheck('signature_evidence', 'Signature evidence readiness pack', signatureEvidencePack.packStatus, ['advanced_signature_evidence_readiness_pack']),
        signatureBoundaryCloseoutCheck('certification_requirements', 'Certification requirement workspace', certificationWorkspace.workspaceStatus, ['advanced_certification_requirement_workspace']),
        signatureBoundaryCloseoutCheck('legalization_boundary', 'Legalization boundary packet', legalizationPacket.packetStatus, ['advanced_legalization_boundary_packet']),
      ];
    const blockers = unique([
      ...boundaryAnchor.blockers,
      ...signatoryRegistry.blockers,
      ...signatureEvidencePack.blockers,
      ...certificationWorkspace.blockers,
      ...legalizationPacket.blockers,
    ]);
    const closeoutStatus = resolveStatus(
      closeoutChecklist.map((item) => item.status),
      blockers,
    );
    const finalDecision = signatureCertificationBoundaryDecisionFromStatus(
      closeoutStatus,
      signatureEvidencePack,
      certificationWorkspace,
      legalizationPacket,
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      closeoutStatus,
      boundaryAnchor,
      signatoryRegistry,
      signatureEvidencePack,
      certificationWorkspace,
      legalizationPacket,
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
        signatoryCount: signatoryRegistry.summary.signatoryCount,
        missingEvidenceCount: signatureEvidencePack.summary.missingEvidenceCount,
        certificationRequirementCount:
          certificationWorkspace.summary.requirementCount,
        legalizationItemCount: legalizationPacket.summary.legalizationItemCount,
      },
      blockers,
      nextStep:
        finalDecision === 'ready_for_external_execution'
          ? 'Preparar 1.2 External Execution Handoff para actos formales externos.'
          : finalDecision === 'needs_signatory_evidence'
            ? 'Completar evidencia de firmantes/certificadores antes del handoff.'
            : finalDecision === 'return_to_formal_approval'
              ? 'Volver a approval workflow 1.0 antes de boundaries formales.'
              : 'No ejecutar actos formales para este periodo.',
      guardrails: [
        'Closeout 1.1 decide readiness de frontera; no ejecuta firma/certificacion/legalizacion.',
        'External execution debe ocurrir en una capa posterior con owners externos.',
      ],
    };
  }
}

export class GetTenantAccountingAdvancedExternalExecutionHandoffAnchorUseCase {
  constructor(
    private readonly requestTenantAccountingAdvancedSignatureCertificationBoundaryCloseoutUseCase: RequestTenantAccountingAdvancedSignatureCertificationBoundaryCloseoutUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantAccountingAdvancedExternalExecutionHandoffAnchorView> {
    const signatureCertificationCloseout =
      await this.requestTenantAccountingAdvancedSignatureCertificationBoundaryCloseoutUseCase.execute(
        input,
      );
    const handoffGates: TenantAccountingAdvancedExternalExecutionHandoffAnchorView['handoffGates'] =
      [
        externalHandoffGate('signature_handoff', 'Signature handoff gate', signatureCertificationCloseout.closeoutStatus, ['advanced_signature_certification_boundary_closeout'], 'signature', 'Signature execution belongs to external signatory.'),
        externalHandoffGate('certification_handoff', 'Certification handoff gate', signatureCertificationCloseout.certificationWorkspace.workspaceStatus, ['advanced_certification_requirement_workspace'], 'certification', 'Certification execution belongs to certifier or auditor.'),
        externalHandoffGate('legalization_handoff', 'Legalization handoff gate', signatureCertificationCloseout.legalizationPacket.packetStatus, ['advanced_legalization_boundary_packet'], 'legalization', 'Legalization execution belongs to external authority.'),
      ];
    const blockers =
      signatureCertificationCloseout.finalDecision ===
      'ready_for_external_execution'
        ? [...signatureCertificationCloseout.blockers]
        : unique([
            ...signatureCertificationCloseout.blockers,
            `Signature boundary decision is ${signatureCertificationCloseout.finalDecision}.`,
          ]);
    const anchorStatus = resolveStatus(
      handoffGates.map((gate) => gate.status),
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      anchorStatus,
      signatureCertificationCloseout,
      handoffGates,
      summary: {
        gateCount: handoffGates.length,
        readyGateCount: handoffGates.filter((gate) => gate.status === 'ready')
          .length,
        needsReviewGateCount: handoffGates.filter(
          (gate) => gate.status === 'needs_review',
        ).length,
        blockedGateCount: handoffGates.filter(
          (gate) => gate.status === 'blocked',
        ).length,
        signatoryCount: signatureCertificationCloseout.summary.signatoryCount,
      },
      blockers,
      nextStep:
        anchorStatus === 'blocked'
          ? 'Volver a boundary 1.1 antes de handoff externo.'
          : 'Asignar ejecutores externos por acto formal.',
      guardrails: [
        'External Execution Handoff 1.2 prepara entrega; no ejecuta actos externos.',
        'Firma, certificacion y legalizacion siguen fuera de la plataforma.',
      ],
    };
  }
}

export class GetTenantAccountingAdvancedExternalExecutorAssignmentMatrixUseCase {
  constructor(
    private readonly getTenantAccountingAdvancedExternalExecutionHandoffAnchorUseCase: GetTenantAccountingAdvancedExternalExecutionHandoffAnchorUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantAccountingAdvancedExternalExecutorAssignmentMatrixView> {
    const handoffAnchor =
      await this.getTenantAccountingAdvancedExternalExecutionHandoffAnchorUseCase.execute(
        input,
      );
    const assignments: TenantAccountingAdvancedExternalExecutorAssignmentMatrixView['assignments'] =
      [
        externalExecutorAssignment('accountant_signature_execution', 'Accountant signature execution', 'needs_review', 'signature', 'external_accountant', 'Review and sign accountant-owned formal packs externally.'),
        externalExecutorAssignment('legal_representative_signature', 'Legal representative signature', 'needs_review', 'signature', 'legal_representative', 'Sign financial statement artifacts externally.'),
        externalExecutorAssignment('auditor_certification', 'Auditor certification execution', 'needs_review', 'certification', 'auditor', 'Certify reconciliation or financial proof externally.'),
        externalExecutorAssignment('bank_certifier_execution', 'Bank certifier execution', 'needs_review', 'certification', 'bank_certifier', 'Return external bank certification proof.'),
        externalExecutorAssignment('legalization_authority_execution', 'Legalization authority execution', 'needs_review', 'legalization', 'legalization_authority', 'Legalize books or return observations externally.'),
      ];
    const blockers = [...handoffAnchor.blockers];
    const matrixStatus = resolveStatus(
      assignments.map((assignment) => assignment.status),
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      matrixStatus,
      handoffAnchor,
      assignments,
      summary: {
        assignmentCount: assignments.length,
        readyAssignmentCount: assignments.filter(
          (assignment) => assignment.status === 'ready',
        ).length,
        needsReviewAssignmentCount: assignments.filter(
          (assignment) => assignment.status === 'needs_review',
        ).length,
        blockedAssignmentCount: assignments.filter(
          (assignment) => assignment.status === 'blocked',
        ).length,
        externalExecutorCount: new Set(
          assignments.map((assignment) => assignment.executorRole),
        ).size,
      },
      blockers,
      nextStep: 'Preparar bundles de evidencia para cada ejecutor externo.',
      guardrails: [
        'Assignment matrix reparte responsabilidad; no envia ni ejecuta.',
        'Cada ejecutor externo conserva responsabilidad sobre el acto formal.',
      ],
    };
  }
}

export class GetTenantAccountingAdvancedExecutionHandoffEvidenceBundleUseCase {
  constructor(
    private readonly getTenantAccountingAdvancedExternalExecutorAssignmentMatrixUseCase: GetTenantAccountingAdvancedExternalExecutorAssignmentMatrixUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantAccountingAdvancedExecutionHandoffEvidenceBundleView> {
    const executorMatrix =
      await this.getTenantAccountingAdvancedExternalExecutorAssignmentMatrixUseCase.execute(
        input,
      );
    const bundles = executorMatrix.assignments.map((assignment) =>
      executionBundle(
        `bundle_${assignment.key}`,
        `${assignment.label} bundle`,
        assignment.status,
        assignment.key,
        ['approved_formal_artifact', assignment.externalAct],
        ['signature_certification_boundary_closeout', assignment.key],
        assignment.status === 'ready' ? [] : [`${assignment.key}_pending_evidence`],
      ),
    );
    const blockers = [...executorMatrix.blockers];
    const bundleStatus = resolveStatus(
      bundles.map((bundle) => bundle.status),
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      bundleStatus,
      executorMatrix,
      bundles,
      summary: {
        bundleCount: bundles.length,
        readyBundleCount: bundles.filter((bundle) => bundle.status === 'ready')
          .length,
        needsReviewBundleCount: bundles.filter(
          (bundle) => bundle.status === 'needs_review',
        ).length,
        blockedBundleCount: bundles.filter(
          (bundle) => bundle.status === 'blocked',
        ).length,
        blockerRefCount: bundles.flatMap((bundle) => bundle.blockerRefs).length,
      },
      blockers,
      nextStep: 'Generar instrucciones de ejecucion externa por bundle.',
      guardrails: [
        'Evidence bundle empaqueta entrega; no transmite oficialmente.',
        'Los blockers viajan visibles para evitar ejecucion incompleta.',
      ],
    };
  }
}

export class GetTenantAccountingAdvancedExternalExecutionInstructionPackUseCase {
  constructor(
    private readonly getTenantAccountingAdvancedExecutionHandoffEvidenceBundleUseCase: GetTenantAccountingAdvancedExecutionHandoffEvidenceBundleUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantAccountingAdvancedExternalExecutionInstructionPackView> {
    const evidenceBundle =
      await this.getTenantAccountingAdvancedExecutionHandoffEvidenceBundleUseCase.execute(
        input,
      );
    const instructions = evidenceBundle.bundles.map((bundle) =>
      externalInstruction(
        `instruction_${bundle.assignmentKey}`,
        `${bundle.label} instructions`,
        bundle.status,
        bundle.assignmentKey,
        'Ejecutar solo el acto externo asignado, devolver evidencia y no modificar artifacts aprobados sin observacion.',
        ['execution_status', 'executor_note', 'returned_artifact_reference'],
      ),
    );
    const blockers = [...evidenceBundle.blockers];
    const packStatus = resolveStatus(
      instructions.map((instruction) => instruction.status),
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      packStatus,
      evidenceBundle,
      instructions,
      summary: {
        instructionCount: instructions.length,
        readyInstructionCount: instructions.filter(
          (instruction) => instruction.status === 'ready',
        ).length,
        needsReviewInstructionCount: instructions.filter(
          (instruction) => instruction.status === 'needs_review',
        ).length,
        blockedInstructionCount: instructions.filter(
          (instruction) => instruction.status === 'blocked',
        ).length,
        expectedReturnEvidenceCount: instructions.flatMap(
          (instruction) => instruction.expectedReturnEvidence,
        ).length,
      },
      blockers,
      nextStep: 'Preparar intake de retorno para resultados externos.',
      guardrails: [
        'Instruction pack orienta al tercero; no dispara ejecucion externa.',
        'La evidencia de retorno esperada queda definida antes del tracking.',
      ],
    };
  }
}

export class GetTenantAccountingAdvancedExecutionReturnEvidenceIntakeUseCase {
  constructor(
    private readonly getTenantAccountingAdvancedExternalExecutionInstructionPackUseCase: GetTenantAccountingAdvancedExternalExecutionInstructionPackUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantAccountingAdvancedExecutionReturnEvidenceIntakeView> {
    const instructionPack =
      await this.getTenantAccountingAdvancedExternalExecutionInstructionPackUseCase.execute(
        input,
      );
    const returnChannels: TenantAccountingAdvancedExecutionReturnEvidenceIntakeView['returnChannels'] =
      [
        returnEvidenceChannel('signed_return', 'Signed artifact return', 'needs_review', 'signed', ['signed_artifact_reference', 'signatory_identity']),
        returnEvidenceChannel('certified_return', 'Certified artifact return', 'needs_review', 'certified', ['certification_reference', 'certifier_identity']),
        returnEvidenceChannel('legalized_return', 'Legalized book return', 'needs_review', 'legalized', ['legalization_reference', 'legalization_authority']),
        returnEvidenceChannel('observed_return', 'Observed execution return', 'ready', 'observed', ['observation_note', 'required_fix']),
        returnEvidenceChannel('rejected_return', 'Rejected execution return', 'ready', 'rejected', ['rejection_reason', 'executor_note']),
      ];
    const blockers = [...instructionPack.blockers];
    const intakeStatus = resolveStatus(
      returnChannels.map((channel) => channel.status),
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      intakeStatus,
      instructionPack,
      returnChannels,
      summary: {
        channelCount: returnChannels.length,
        readyChannelCount: returnChannels.filter(
          (channel) => channel.status === 'ready',
        ).length,
        needsReviewChannelCount: returnChannels.filter(
          (channel) => channel.status === 'needs_review',
        ).length,
        blockedChannelCount: returnChannels.filter(
          (channel) => channel.status === 'blocked',
        ).length,
        requiredEvidenceCount: returnChannels.flatMap(
          (channel) => channel.requiredEvidence,
        ).length,
      },
      blockers,
      nextStep: 'Cerrar handoff y decidir si tracking externo puede iniciar.',
      guardrails: [
        'Return intake define entradas esperadas; no acepta documentos oficiales como source of truth todavia.',
        'Tracking externo posterior debe validar resultados antes de oficializar.',
      ],
    };
  }
}

export class RequestTenantAccountingAdvancedExternalExecutionHandoffCloseoutUseCase {
  constructor(
    private readonly getTenantAccountingAdvancedExecutionReturnEvidenceIntakeUseCase: GetTenantAccountingAdvancedExecutionReturnEvidenceIntakeUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantAccountingAdvancedExternalExecutionHandoffCloseoutView> {
    const returnEvidenceIntake =
      await this.getTenantAccountingAdvancedExecutionReturnEvidenceIntakeUseCase.execute(
        input,
      );
    const { instructionPack } = returnEvidenceIntake;
    const { evidenceBundle } = instructionPack;
    const { executorMatrix } = evidenceBundle;
    const { handoffAnchor } = executorMatrix;
    const closeoutChecklist: TenantAccountingAdvancedExternalExecutionHandoffCloseoutView['closeoutChecklist'] =
      [
        externalHandoffCloseoutCheck('handoff_anchor', 'External execution handoff anchor', handoffAnchor.anchorStatus, ['advanced_external_execution_handoff_anchor']),
        externalHandoffCloseoutCheck('executor_matrix', 'External executor assignment matrix', executorMatrix.matrixStatus, ['advanced_external_executor_assignment_matrix']),
        externalHandoffCloseoutCheck('evidence_bundle', 'Execution handoff evidence bundle', evidenceBundle.bundleStatus, ['advanced_execution_handoff_evidence_bundle']),
        externalHandoffCloseoutCheck('instruction_pack', 'External execution instruction pack', instructionPack.packStatus, ['advanced_external_execution_instruction_pack']),
        externalHandoffCloseoutCheck('return_intake', 'Execution return evidence intake', returnEvidenceIntake.intakeStatus, ['advanced_execution_return_evidence_intake']),
      ];
    const blockers = unique([
      ...handoffAnchor.blockers,
      ...executorMatrix.blockers,
      ...evidenceBundle.blockers,
      ...instructionPack.blockers,
      ...returnEvidenceIntake.blockers,
    ]);
    const closeoutStatus = resolveStatus(
      closeoutChecklist.map((item) => item.status),
      blockers,
    );
    const finalDecision = externalExecutionHandoffDecisionFromStatus(
      closeoutStatus,
      executorMatrix,
      evidenceBundle,
      returnEvidenceIntake,
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      closeoutStatus,
      handoffAnchor,
      executorMatrix,
      evidenceBundle,
      instructionPack,
      returnEvidenceIntake,
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
        assignmentCount: executorMatrix.summary.assignmentCount,
        bundleCount: evidenceBundle.summary.bundleCount,
        instructionCount: instructionPack.summary.instructionCount,
        returnChannelCount: returnEvidenceIntake.summary.channelCount,
      },
      blockers,
      nextStep:
        finalDecision === 'ready_for_external_execution_tracking'
          ? 'Iniciar 1.3 External Execution Tracking con handoff trazable.'
          : finalDecision === 'needs_executor_assignment'
            ? 'Completar asignaciones y bundles antes del tracking externo.'
            : finalDecision === 'return_to_signature_boundary'
              ? 'Volver a boundary 1.1 para corregir frontera o evidencia.'
              : 'No entregar actos formales externos para este periodo.',
      guardrails: [
        'Handoff closeout no ejecuta actos externos ni oficializa resultados.',
        'External execution tracking debe validar retornos antes de cualquier estado oficial.',
      ],
    };
  }
}

export class GetTenantAccountingAdvancedExternalExecutionTrackingAnchorUseCase {
  constructor(
    private readonly requestTenantAccountingAdvancedExternalExecutionHandoffCloseoutUseCase: RequestTenantAccountingAdvancedExternalExecutionHandoffCloseoutUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantAccountingAdvancedExternalExecutionTrackingAnchorView> {
    const handoffCloseout =
      await this.requestTenantAccountingAdvancedExternalExecutionHandoffCloseoutUseCase.execute(
        input,
      );
    const trackingLanes: TenantAccountingAdvancedExternalExecutionTrackingAnchorView['trackingLanes'] =
      [
        externalTrackingLane(
          'signature_tracking',
          'Signature execution tracking',
          handoffCloseout.handoffAnchor.anchorStatus,
          'signature',
          'in_external_review',
          ['advanced_signature_handoff_gate'],
        ),
        externalTrackingLane(
          'certification_tracking',
          'Certification execution tracking',
          handoffCloseout.evidenceBundle.bundleStatus,
          'certification',
          'sent_outside_platform',
          ['advanced_certification_handoff_bundle'],
        ),
        externalTrackingLane(
          'legalization_tracking',
          'Legalization execution tracking',
          handoffCloseout.instructionPack.packStatus,
          'legalization',
          'not_started',
          ['advanced_legalization_instruction_pack'],
        ),
      ];
    const blockers =
      handoffCloseout.finalDecision ===
      'ready_for_external_execution_tracking'
        ? [...handoffCloseout.blockers]
        : unique([
            ...handoffCloseout.blockers,
            `External handoff decision is ${handoffCloseout.finalDecision}.`,
          ]);
    const trackingStatus = resolveStatus(
      trackingLanes.map((lane) => lane.status),
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      trackingStatus,
      handoffCloseout,
      trackingLanes,
      summary: {
        laneCount: trackingLanes.length,
        readyLaneCount: trackingLanes.filter((lane) => lane.status === 'ready')
          .length,
        needsReviewLaneCount: trackingLanes.filter(
          (lane) => lane.status === 'needs_review',
        ).length,
        blockedLaneCount: trackingLanes.filter(
          (lane) => lane.status === 'blocked',
        ).length,
        handoffChecklistCount: handoffCloseout.summary.checklistCount,
      },
      blockers,
      nextStep:
        trackingStatus === 'blocked'
          ? 'Volver a handoff 1.2 antes de iniciar tracking externo.'
          : 'Registrar ledger de estados por acto externo.',
      guardrails: [
        'External Execution Tracking 1.3 observa estados; no ejecuta actos externos.',
        'Los estados externos no oficializan resultados sin intake y validacion.',
      ],
    };
  }
}

export class GetTenantAccountingAdvancedExternalExecutionStatusLedgerUseCase {
  constructor(
    private readonly getTenantAccountingAdvancedExternalExecutionTrackingAnchorUseCase: GetTenantAccountingAdvancedExternalExecutionTrackingAnchorUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantAccountingAdvancedExternalExecutionStatusLedgerView> {
    const trackingAnchor =
      await this.getTenantAccountingAdvancedExternalExecutionTrackingAnchorUseCase.execute(
        input,
      );
    const events = trackingAnchor.trackingLanes.map((lane) =>
      externalTrackingEvent(
        `event_${lane.key}`,
        `${lane.label} ledger event`,
        lane.status,
        lane.key,
        lane.externalAct,
        externalActorForAct(lane.externalAct),
        lane.trackingState === 'in_external_review'
          ? 'external_actor_reviewing'
          : lane.trackingState === 'returned_with_observation'
            ? 'external_observation_returned'
            : lane.trackingState === 'rejected'
              ? 'external_rejection_returned'
              : lane.trackingState === 'returned_with_evidence'
                ? 'external_result_returned'
                : 'queued_for_external_actor',
        expectedEvidenceForAct(lane.externalAct),
        lane.trackingState === 'returned_with_evidence'
          ? expectedEvidenceForAct(lane.externalAct)
          : [],
        lane.status === 'ready' ? [] : [`${lane.key}_pending_external_update`],
      ),
    );
    const blockers = [...trackingAnchor.blockers];
    const ledgerStatus = resolveStatus(
      events.map((event) => event.status),
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      ledgerStatus,
      trackingAnchor,
      events,
      summary: {
        eventCount: events.length,
        readyEventCount: events.filter((event) => event.status === 'ready')
          .length,
        needsReviewEventCount: events.filter(
          (event) => event.status === 'needs_review',
        ).length,
        blockedEventCount: events.filter((event) => event.status === 'blocked')
          .length,
        evidenceRequiredCount: events.flatMap(
          (event) => event.evidenceRequired,
        ).length,
        evidenceReceivedCount: events.flatMap(
          (event) => event.evidenceReceived,
        ).length,
      },
      blockers,
      nextStep: 'Validar evidencia retornada por ejecutores externos.',
      guardrails: [
        'El ledger registra estado conceptual; no sustituye evidencia externa.',
        'Los eventos no cambian artifacts aprobados ni estados oficiales.',
      ],
    };
  }
}

export class GetTenantAccountingAdvancedReturnedEvidenceValidationWorkspaceUseCase {
  constructor(
    private readonly getTenantAccountingAdvancedExternalExecutionStatusLedgerUseCase: GetTenantAccountingAdvancedExternalExecutionStatusLedgerUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantAccountingAdvancedReturnedEvidenceValidationWorkspaceView> {
    const statusLedger =
      await this.getTenantAccountingAdvancedExternalExecutionStatusLedgerUseCase.execute(
        input,
      );
    const validations = statusLedger.events.map((event) =>
      returnedEvidenceValidation(
        `validation_${event.key}`,
        `${event.label} validation`,
        event.evidenceReceived.length >= event.evidenceRequired.length
          ? 'ready'
          : 'needs_review',
        event.key,
        event.evidenceReceived.length >= event.evidenceRequired.length
          ? 'valid_return'
          : event.eventState === 'external_observation_returned'
            ? 'observed_return'
            : event.eventState === 'external_rejection_returned'
              ? 'rejected_return'
              : 'insufficient_evidence',
        event.evidenceRequired,
        event.evidenceReceived,
        event.evidenceReceived.length >= event.evidenceRequired.length
          ? []
          : [`${event.key}_missing_return_evidence`],
      ),
    );
    const blockers = [...statusLedger.blockers];
    const validationStatus = resolveStatus(
      validations.map((validation) => validation.status),
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      validationStatus,
      statusLedger,
      validations,
      summary: {
        validationCount: validations.length,
        validReturnCount: validations.filter(
          (validation) => validation.validationResult === 'valid_return',
        ).length,
        observedReturnCount: validations.filter(
          (validation) => validation.validationResult === 'observed_return',
        ).length,
        rejectedReturnCount: validations.filter(
          (validation) => validation.validationResult === 'rejected_return',
        ).length,
        insufficientEvidenceCount: validations.filter(
          (validation) =>
            validation.validationResult === 'insufficient_evidence',
        ).length,
      },
      blockers,
      nextStep: 'Clasificar observaciones externas y rutas de resolucion.',
      guardrails: [
        'Validation workspace revisa retornos; no acepta resultados como oficiales.',
        'La evidencia insuficiente debe resolverse antes de intake interno.',
      ],
    };
  }
}

export class GetTenantAccountingAdvancedExternalObservationResolutionQueueUseCase {
  constructor(
    private readonly getTenantAccountingAdvancedReturnedEvidenceValidationWorkspaceUseCase: GetTenantAccountingAdvancedReturnedEvidenceValidationWorkspaceUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantAccountingAdvancedExternalObservationResolutionQueueView> {
    const validationWorkspace =
      await this.getTenantAccountingAdvancedReturnedEvidenceValidationWorkspaceUseCase.execute(
        input,
      );
    const observations = validationWorkspace.validations.map((validation) =>
      externalObservation(
        `observation_${validation.key}`,
        `${validation.label} observation route`,
        validation.status,
        validation.key,
        resolutionRouteForValidation(validation.validationResult),
        validation.validationResult === 'valid_return'
          ? 'No external observation requires routing.'
          : `${validation.validationResult} requires reviewed resolution before intake.`,
      ),
    );
    const blockers = [...validationWorkspace.blockers];
    const queueStatus = resolveStatus(
      observations.map((observation) => observation.status),
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      queueStatus,
      validationWorkspace,
      observations,
      summary: {
        observationCount: observations.length,
        readyObservationCount: observations.filter(
          (observation) => observation.status === 'ready',
        ).length,
        needsReviewObservationCount: observations.filter(
          (observation) => observation.status === 'needs_review',
        ).length,
        blockedObservationCount: observations.filter(
          (observation) => observation.status === 'blocked',
        ).length,
        routedObservationCount: observations.filter(
          (observation) =>
            observation.resolutionRoute !== 'no_resolution_required',
        ).length,
      },
      blockers,
      nextStep: 'Consolidar tracking externo en command center operativo.',
      guardrails: [
        'Observation queue enruta correcciones; no corrige artifacts automaticamente.',
        'Todo rechazo u observacion conserva revision humana antes de avanzar.',
      ],
    };
  }
}

export class GetTenantAccountingAdvancedExternalExecutionTrackingCommandCenterUseCase {
  constructor(
    private readonly getTenantAccountingAdvancedExternalObservationResolutionQueueUseCase: GetTenantAccountingAdvancedExternalObservationResolutionQueueUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantAccountingAdvancedExternalExecutionTrackingCommandCenterView> {
    const observationQueue =
      await this.getTenantAccountingAdvancedExternalObservationResolutionQueueUseCase.execute(
        input,
      );
    const { validationWorkspace } = observationQueue;
    const { statusLedger } = validationWorkspace;
    const commandLanes: TenantAccountingAdvancedExternalExecutionTrackingCommandCenterView['commandLanes'] =
      [
        trackingCommandLane(
          'external_events',
          'External events',
          statusLedger.ledgerStatus,
          'ledger_events',
          statusLedger.summary.eventCount,
        ),
        trackingCommandLane(
          'returned_results',
          'Returned results',
          validationWorkspace.validationStatus,
          'valid_returns',
          validationWorkspace.summary.validReturnCount,
        ),
        trackingCommandLane(
          'external_observations',
          'External observations',
          observationQueue.queueStatus,
          'routed_observations',
          observationQueue.summary.routedObservationCount,
        ),
      ];
    const blockers = unique([
      ...statusLedger.blockers,
      ...validationWorkspace.blockers,
      ...observationQueue.blockers,
    ]);
    const commandStatus = resolveStatus(
      commandLanes.map((lane) => lane.status),
      blockers,
    );
    const suggestedDecision = externalExecutionTrackingDecisionFromStatus(
      commandStatus,
      validationWorkspace,
      observationQueue,
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      commandStatus,
      observationQueue,
      commandLanes,
      suggestedDecision,
      summary: {
        laneCount: commandLanes.length,
        readyLaneCount: commandLanes.filter((lane) => lane.status === 'ready')
          .length,
        needsReviewLaneCount: commandLanes.filter(
          (lane) => lane.status === 'needs_review',
        ).length,
        blockedLaneCount: commandLanes.filter(
          (lane) => lane.status === 'blocked',
        ).length,
        returnedCount: validationWorkspace.summary.validReturnCount,
        observedCount: validationWorkspace.summary.observedReturnCount,
        rejectedCount: validationWorkspace.summary.rejectedReturnCount,
      },
      blockers,
      nextStep:
        suggestedDecision === 'ready_for_external_result_intake'
          ? 'Preparar 1.4 External Result Intake & Internal Acceptance.'
          : suggestedDecision === 'resolve_external_observations'
            ? 'Resolver observaciones externas antes del intake interno.'
            : suggestedDecision === 'return_to_external_handoff'
              ? 'Volver a 1.2 para corregir handoff externo.'
              : 'Continuar seguimiento hasta recibir evidencia externa suficiente.',
      guardrails: [
        'Command center prioriza tracking; no oficializa evidencia retornada.',
        'La decision sugerida no reemplaza aceptacion interna formal.',
      ],
    };
  }
}

export class RequestTenantAccountingAdvancedExternalExecutionTrackingCloseoutUseCase {
  constructor(
    private readonly getTenantAccountingAdvancedExternalExecutionTrackingCommandCenterUseCase: GetTenantAccountingAdvancedExternalExecutionTrackingCommandCenterUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantAccountingAdvancedExternalExecutionTrackingCloseoutView> {
    const commandCenter =
      await this.getTenantAccountingAdvancedExternalExecutionTrackingCommandCenterUseCase.execute(
        input,
      );
    const { observationQueue } = commandCenter;
    const { validationWorkspace } = observationQueue;
    const { statusLedger } = validationWorkspace;
    const { trackingAnchor } = statusLedger;
    const closeoutChecklist: TenantAccountingAdvancedExternalExecutionTrackingCloseoutView['closeoutChecklist'] =
      [
        externalTrackingCloseoutCheck('tracking_anchor', 'External execution tracking anchor', trackingAnchor.trackingStatus, ['advanced_external_execution_tracking_anchor']),
        externalTrackingCloseoutCheck('status_ledger', 'External execution status ledger', statusLedger.ledgerStatus, ['advanced_external_execution_status_ledger']),
        externalTrackingCloseoutCheck('returned_evidence_validation', 'Returned evidence validation workspace', validationWorkspace.validationStatus, ['advanced_returned_evidence_validation_workspace']),
        externalTrackingCloseoutCheck('observation_queue', 'External observation resolution queue', observationQueue.queueStatus, ['advanced_external_observation_resolution_queue']),
        externalTrackingCloseoutCheck('tracking_command_center', 'External execution tracking command center', commandCenter.commandStatus, ['advanced_external_execution_tracking_command_center']),
      ];
    const blockers = unique([
      ...trackingAnchor.blockers,
      ...statusLedger.blockers,
      ...validationWorkspace.blockers,
      ...observationQueue.blockers,
      ...commandCenter.blockers,
    ]);
    const closeoutStatus = resolveStatus(
      closeoutChecklist.map((item) => item.status),
      blockers,
    );
    const finalDecision = externalExecutionTrackingDecisionFromStatus(
      closeoutStatus,
      validationWorkspace,
      observationQueue,
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      closeoutStatus,
      trackingAnchor,
      statusLedger,
      validationWorkspace,
      observationQueue,
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
        trackingLaneCount: trackingAnchor.summary.laneCount,
        ledgerEventCount: statusLedger.summary.eventCount,
        validationCount: validationWorkspace.summary.validationCount,
        observationCount: observationQueue.summary.observationCount,
      },
      blockers,
      nextStep:
        finalDecision === 'ready_for_external_result_intake'
          ? 'Iniciar 1.4 External Result Intake & Internal Acceptance.'
          : finalDecision === 'resolve_external_observations'
            ? 'Resolver observaciones externas antes de aceptar resultados.'
            : finalDecision === 'return_to_external_handoff'
              ? 'Volver a handoff 1.2 para corregir paquetes o instrucciones.'
              : finalDecision === 'waiting_for_external_execution'
                ? 'Continuar tracking hasta recibir resultados externos.'
                : 'No aceptar resultados externos para este periodo.',
      guardrails: [
        'Tracking closeout no acepta resultados externos como oficiales.',
        'La aceptacion interna debe ocurrir en una capa posterior con evidencia validada.',
      ],
    };
  }
}

export class GetTenantAccountingAdvancedExternalResultIntakeAnchorUseCase {
  constructor(
    private readonly requestTenantAccountingAdvancedExternalExecutionTrackingCloseoutUseCase: RequestTenantAccountingAdvancedExternalExecutionTrackingCloseoutUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantAccountingAdvancedExternalResultIntakeAnchorView> {
    const trackingCloseout =
      await this.requestTenantAccountingAdvancedExternalExecutionTrackingCloseoutUseCase.execute(
        input,
      );
    const resultIntakeGates: TenantAccountingAdvancedExternalResultIntakeAnchorView['resultIntakeGates'] =
      trackingCloseout.validationWorkspace.validations.map((validation) =>
        externalResultIntakeGate(
          `intake_${validation.key}`,
          `${validation.label} intake gate`,
          validation.status,
          externalActFromValidationKey(validation.eventKey),
          validation.validationResult === 'valid_return'
            ? 'ready_for_internal_review'
            : validation.validationResult === 'observed_return'
              ? 'observed_external_result'
              : validation.validationResult === 'rejected_return'
                ? 'rejected_external_result'
                : 'insufficient_evidence',
          validation.receivedEvidence,
        ),
      );
    const blockers =
      trackingCloseout.finalDecision === 'ready_for_external_result_intake'
        ? [...trackingCloseout.blockers]
        : unique([
            ...trackingCloseout.blockers,
            `External tracking decision is ${trackingCloseout.finalDecision}.`,
          ]);
    const intakeStatus = resolveStatus(
      resultIntakeGates.map((gate) => gate.status),
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      intakeStatus,
      trackingCloseout,
      resultIntakeGates,
      summary: {
        gateCount: resultIntakeGates.length,
        readyGateCount: resultIntakeGates.filter(
          (gate) => gate.status === 'ready',
        ).length,
        needsReviewGateCount: resultIntakeGates.filter(
          (gate) => gate.status === 'needs_review',
        ).length,
        blockedGateCount: resultIntakeGates.filter(
          (gate) => gate.status === 'blocked',
        ).length,
        trackingChecklistCount: trackingCloseout.summary.checklistCount,
      },
      blockers,
      nextStep:
        intakeStatus === 'blocked'
          ? 'Volver a tracking 1.3 antes de abrir intake interno.'
          : 'Registrar artifacts retornados para criterios de aceptacion.',
      guardrails: [
        'External Result Intake 1.4 abre revision interna; no oficializa resultados.',
        'Los resultados externos deben pasar criterios internos antes de expediente formal.',
      ],
    };
  }
}

export class GetTenantAccountingAdvancedReturnedArtifactRegistryUseCase {
  constructor(
    private readonly getTenantAccountingAdvancedExternalResultIntakeAnchorUseCase: GetTenantAccountingAdvancedExternalResultIntakeAnchorUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantAccountingAdvancedReturnedArtifactRegistryView> {
    const intakeAnchor =
      await this.getTenantAccountingAdvancedExternalResultIntakeAnchorUseCase.execute(
        input,
      );
    const returnedArtifacts = intakeAnchor.resultIntakeGates.map((gate) =>
      returnedArtifact(
        `artifact_${gate.key}`,
        `${gate.label} artifact`,
        gate.status,
        gate.key,
        artifactKindFromIntakeGate(gate),
        externalActorForAct(gate.externalAct),
        gate.evidenceRefs,
        gate.status === 'ready' ? [] : [`${gate.key}_artifact_not_accepted`],
      ),
    );
    const blockers = [...intakeAnchor.blockers];
    const registryStatus = resolveStatus(
      returnedArtifacts.map((artifact) => artifact.status),
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      registryStatus,
      intakeAnchor,
      returnedArtifacts,
      summary: {
        artifactCount: returnedArtifacts.length,
        signedArtifactCount: returnedArtifacts.filter(
          (artifact) => artifact.artifactKind === 'signed',
        ).length,
        certifiedArtifactCount: returnedArtifacts.filter(
          (artifact) => artifact.artifactKind === 'certified',
        ).length,
        legalizedArtifactCount: returnedArtifacts.filter(
          (artifact) => artifact.artifactKind === 'legalized',
        ).length,
        observedArtifactCount: returnedArtifacts.filter(
          (artifact) => artifact.artifactKind === 'observed',
        ).length,
        rejectedArtifactCount: returnedArtifacts.filter(
          (artifact) => artifact.artifactKind === 'rejected',
        ).length,
      },
      blockers,
      nextStep: 'Evaluar criterios internos de aceptacion por artifact.',
      guardrails: [
        'Returned Artifact Registry registra referencias; no almacena evidencia oficial.',
        'Cada artifact retornado conserva blockers visibles hasta aceptacion interna.',
      ],
    };
  }
}

export class GetTenantAccountingAdvancedInternalAcceptanceCriteriaWorkspaceUseCase {
  constructor(
    private readonly getTenantAccountingAdvancedReturnedArtifactRegistryUseCase: GetTenantAccountingAdvancedReturnedArtifactRegistryUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantAccountingAdvancedInternalAcceptanceCriteriaWorkspaceView> {
    const artifactRegistry =
      await this.getTenantAccountingAdvancedReturnedArtifactRegistryUseCase.execute(
        input,
      );
    const criteria =
      artifactRegistry.returnedArtifacts.flatMap((artifact) => [
        internalAcceptanceCriterion(
          `actor_${artifact.key}`,
          `${artifact.label} actor identity`,
          artifact.status,
          artifact.key,
          'actor_identity',
          [artifact.actorRef],
          artifact.status === 'ready' ? [] : [`${artifact.key}_actor_pending`],
        ),
        internalAcceptanceCriterion(
          `evidence_${artifact.key}`,
          `${artifact.label} evidence completeness`,
          artifact.status,
          artifact.key,
          'evidence_completeness',
          artifact.evidenceRefs,
          artifact.blockerRefs,
        ),
        internalAcceptanceCriterion(
          `trace_${artifact.key}`,
          `${artifact.label} traceability match`,
          artifact.status,
          artifact.key,
          'traceability_match',
          [artifact.intakeGateKey],
          artifact.status === 'ready' ? [] : [`${artifact.key}_trace_pending`],
        ),
      ]);
    const blockers = [...artifactRegistry.blockers];
    const criteriaStatus = resolveStatus(
      criteria.map((item) => item.status),
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      criteriaStatus,
      artifactRegistry,
      criteria,
      summary: {
        criteriaCount: criteria.length,
        readyCriteriaCount: criteria.filter((item) => item.status === 'ready')
          .length,
        needsReviewCriteriaCount: criteria.filter(
          (item) => item.status === 'needs_review',
        ).length,
        blockedCriteriaCount: criteria.filter(
          (item) => item.status === 'blocked',
        ).length,
        blockerRefCount: criteria.flatMap((item) => item.blockerRefs).length,
      },
      blockers,
      nextStep: 'Decidir aceptacion interna por resultado externo.',
      guardrails: [
        'Los criterios internos no sustituyen aprobacion profesional formal.',
        'Un artifact sin trazabilidad completa no entra al expediente formal.',
      ],
    };
  }
}

export class GetTenantAccountingAdvancedAcceptanceDecisionWorkspaceUseCase {
  constructor(
    private readonly getTenantAccountingAdvancedInternalAcceptanceCriteriaWorkspaceUseCase: GetTenantAccountingAdvancedInternalAcceptanceCriteriaWorkspaceUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantAccountingAdvancedAcceptanceDecisionWorkspaceView> {
    const criteriaWorkspace =
      await this.getTenantAccountingAdvancedInternalAcceptanceCriteriaWorkspaceUseCase.execute(
        input,
      );
    const decisions =
      criteriaWorkspace.artifactRegistry.returnedArtifacts.map((artifact) =>
        acceptanceDecision(
          `decision_${artifact.key}`,
          `${artifact.label} acceptance decision`,
          artifact.status,
          artifact.key,
          artifact.status === 'ready'
            ? 'accepted_for_internal_record'
            : artifact.artifactKind === 'rejected'
              ? 'return_to_handoff'
              : artifact.artifactKind === 'observed'
                ? 'return_to_external_tracking'
                : 'needs_internal_review',
          artifact.status === 'ready'
            ? 'Returned artifact meets internal intake criteria.'
            : 'Returned artifact needs internal review before record assembly.',
        ),
      );
    const blockers = [...criteriaWorkspace.blockers];
    const decisionStatus = resolveStatus(
      decisions.map((decision) => decision.status),
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      decisionStatus,
      criteriaWorkspace,
      decisions,
      summary: {
        decisionCount: decisions.length,
        acceptedDecisionCount: decisions.filter(
          (decision) => decision.decision === 'accepted_for_internal_record',
        ).length,
        needsReviewDecisionCount: decisions.filter(
          (decision) => decision.decision === 'needs_internal_review',
        ).length,
        returnToTrackingDecisionCount: decisions.filter(
          (decision) => decision.decision === 'return_to_external_tracking',
        ).length,
        returnToHandoffDecisionCount: decisions.filter(
          (decision) => decision.decision === 'return_to_handoff',
        ).length,
        rejectedDecisionCount: decisions.filter(
          (decision) => decision.decision === 'rejected_for_period',
        ).length,
      },
      blockers,
      nextStep: 'Consolidar aceptacion interna en command center.',
      guardrails: [
        'Acceptance decision workspace decide intake interno; no arma expediente formal.',
        'La aceptacion interna no emite libros ni estados financieros oficiales.',
      ],
    };
  }
}

export class GetTenantAccountingAdvancedInternalAcceptanceCommandCenterUseCase {
  constructor(
    private readonly getTenantAccountingAdvancedAcceptanceDecisionWorkspaceUseCase: GetTenantAccountingAdvancedAcceptanceDecisionWorkspaceUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantAccountingAdvancedInternalAcceptanceCommandCenterView> {
    const decisionWorkspace =
      await this.getTenantAccountingAdvancedAcceptanceDecisionWorkspaceUseCase.execute(
        input,
      );
    const { criteriaWorkspace } = decisionWorkspace;
    const { artifactRegistry } = criteriaWorkspace;
    const commandLanes: TenantAccountingAdvancedInternalAcceptanceCommandCenterView['commandLanes'] =
      [
        internalAcceptanceCommandLane('returned_artifacts', 'Returned artifacts', artifactRegistry.registryStatus, 'artifacts', artifactRegistry.summary.artifactCount),
        internalAcceptanceCommandLane('acceptance_criteria', 'Acceptance criteria', criteriaWorkspace.criteriaStatus, 'criteria', criteriaWorkspace.summary.criteriaCount),
        internalAcceptanceCommandLane('acceptance_decisions', 'Acceptance decisions', decisionWorkspace.decisionStatus, 'decisions', decisionWorkspace.summary.decisionCount),
      ];
    const blockers = unique([
      ...artifactRegistry.blockers,
      ...criteriaWorkspace.blockers,
      ...decisionWorkspace.blockers,
    ]);
    const commandStatus = resolveStatus(
      commandLanes.map((lane) => lane.status),
      blockers,
    );
    const suggestedDecision = externalResultIntakeDecisionFromStatus(
      commandStatus,
      decisionWorkspace,
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      commandStatus,
      decisionWorkspace,
      commandLanes,
      suggestedDecision,
      summary: {
        laneCount: commandLanes.length,
        readyLaneCount: commandLanes.filter((lane) => lane.status === 'ready')
          .length,
        needsReviewLaneCount: commandLanes.filter(
          (lane) => lane.status === 'needs_review',
        ).length,
        blockedLaneCount: commandLanes.filter(
          (lane) => lane.status === 'blocked',
        ).length,
        receivedArtifactCount: artifactRegistry.summary.artifactCount,
        acceptedArtifactCount: decisionWorkspace.summary.acceptedDecisionCount,
        observedArtifactCount: artifactRegistry.summary.observedArtifactCount,
        rejectedArtifactCount: artifactRegistry.summary.rejectedArtifactCount,
      },
      blockers,
      nextStep:
        suggestedDecision === 'ready_for_formal_record_assembly'
          ? 'Preparar 1.5 Formal Record Assembly con resultados aceptados.'
          : suggestedDecision === 'needs_internal_acceptance_review'
            ? 'Completar revision interna antes de armar expediente formal.'
            : suggestedDecision === 'return_to_external_tracking'
              ? 'Volver a tracking 1.3 para resolver resultados externos.'
              : 'Volver a handoff 1.2 si los resultados no pueden aceptarse.',
      guardrails: [
        'Command center consolida aceptacion interna; no oficializa records.',
        'Formal record assembly debe ocurrir en un bloque posterior.',
      ],
    };
  }
}

export class RequestTenantAccountingAdvancedExternalResultIntakeCloseoutUseCase {
  constructor(
    private readonly getTenantAccountingAdvancedInternalAcceptanceCommandCenterUseCase: GetTenantAccountingAdvancedInternalAcceptanceCommandCenterUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantAccountingAdvancedExternalResultIntakeCloseoutView> {
    const commandCenter =
      await this.getTenantAccountingAdvancedInternalAcceptanceCommandCenterUseCase.execute(
        input,
      );
    const { decisionWorkspace } = commandCenter;
    const { criteriaWorkspace } = decisionWorkspace;
    const { artifactRegistry } = criteriaWorkspace;
    const { intakeAnchor } = artifactRegistry;
    const closeoutChecklist: TenantAccountingAdvancedExternalResultIntakeCloseoutView['closeoutChecklist'] =
      [
        externalResultIntakeCloseoutCheck('intake_anchor', 'External result intake anchor', intakeAnchor.intakeStatus, ['advanced_external_result_intake_anchor']),
        externalResultIntakeCloseoutCheck('artifact_registry', 'Returned artifact registry', artifactRegistry.registryStatus, ['advanced_returned_artifact_registry']),
        externalResultIntakeCloseoutCheck('acceptance_criteria', 'Internal acceptance criteria workspace', criteriaWorkspace.criteriaStatus, ['advanced_internal_acceptance_criteria_workspace']),
        externalResultIntakeCloseoutCheck('acceptance_decisions', 'Acceptance decision workspace', decisionWorkspace.decisionStatus, ['advanced_acceptance_decision_workspace']),
        externalResultIntakeCloseoutCheck('acceptance_command_center', 'Internal acceptance command center', commandCenter.commandStatus, ['advanced_internal_acceptance_command_center']),
      ];
    const blockers = unique([
      ...intakeAnchor.blockers,
      ...artifactRegistry.blockers,
      ...criteriaWorkspace.blockers,
      ...decisionWorkspace.blockers,
      ...commandCenter.blockers,
    ]);
    const closeoutStatus = resolveStatus(
      closeoutChecklist.map((item) => item.status),
      blockers,
    );
    const finalDecision = externalResultIntakeDecisionFromStatus(
      closeoutStatus,
      decisionWorkspace,
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      closeoutStatus,
      intakeAnchor,
      artifactRegistry,
      criteriaWorkspace,
      decisionWorkspace,
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
        intakeGateCount: intakeAnchor.summary.gateCount,
        returnedArtifactCount: artifactRegistry.summary.artifactCount,
        criteriaCount: criteriaWorkspace.summary.criteriaCount,
        decisionCount: decisionWorkspace.summary.decisionCount,
      },
      blockers,
      nextStep:
        finalDecision === 'ready_for_formal_record_assembly'
          ? 'Iniciar 1.5 Formal Record Assembly con resultados externos aceptados.'
          : finalDecision === 'needs_internal_acceptance_review'
            ? 'Completar revision interna antes de armar expediente formal.'
            : finalDecision === 'return_to_external_tracking'
              ? 'Volver a tracking 1.3 para resolver retornos externos.'
              : finalDecision === 'return_to_external_handoff'
                ? 'Volver a handoff 1.2 para corregir paquetes o ejecutores.'
                : 'No aceptar resultados externos para este periodo.',
      guardrails: [
        'External result intake closeout no arma records oficiales.',
        'Solo resultados aceptados internamente pueden pasar a formal record assembly.',
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

function pilotCloseoutCheck(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  evidenceRefs: string[],
): TenantAccountingAdvancedPilotCloseoutView['closeoutChecklist'][number] {
  return { key, label, status, evidenceRefs };
}

function pilotEvidenceSection(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  evidenceRefs: string[],
  risk: string,
): TenantAccountingAdvancedPilotEvidenceSnapshotView['evidenceSections'][number] {
  return {
    key,
    label,
    status,
    evidenceRefs,
    risk,
    guardrail: 'Se usa como evidencia de piloto, no como certificacion formal.',
  };
}

function pilotReviewRow(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  decision: TenantAccountingAdvancedPilotAccountantReviewRoomView['reviewRows'][number]['decision'],
  pendingEvidence: string[],
  risk: string,
  nextAction: string,
): TenantAccountingAdvancedPilotAccountantReviewRoomView['reviewRows'][number] {
  return { key, label, status, decision, pendingEvidence, risk, nextAction };
}

function pilotRunbookStep(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  owner: TenantAccountingAdvancedPilotRunbookView['steps'][number]['owner'],
  expectedEvidence: string,
): TenantAccountingAdvancedPilotRunbookView['steps'][number] {
  return {
    key,
    label,
    status,
    owner,
    expectedEvidence,
    guardrail: 'No ejecutar como accion formal sin aprobacion profesional.',
  };
}

function pilotFinding(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  finding: string,
  recommendation: string,
): TenantAccountingAdvancedPilotOutcomePacketView['findings'][number] {
  return { key, label, status, finding, recommendation };
}

function graduationLearning(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  evidenceRefs: string[],
  signal: string,
  graduationImpact: string,
): TenantAccountingAdvancedPilotLearningRegistryView['learnings'][number] {
  return { key, label, status, evidenceRefs, signal, graduationImpact };
}

function accountantAcceptanceCriterion(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  requiredEvidence: string,
  accountantQuestion: string,
  risk: string,
): TenantAccountingAdvancedExternalAccountantAcceptanceCriteriaView['criteria'][number] {
  return {
    key,
    label,
    status,
    requiredEvidence,
    accountantQuestion,
    risk,
  };
}

function graduationMatrixRow(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  score: number,
  recommendation: AccountingAdvancedGraduationDecision,
  rationale: string,
): TenantAccountingAdvancedProductGraduationMatrixView['rows'][number] {
  return { key, label, status, score, recommendation, rationale };
}

function formalBooksBoundaryRow(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  platformCanPrepare: string,
  requiresProfessionalAct: string,
): TenantAccountingAdvancedFormalBooksBoundaryBlueprintView['boundaryRows'][number] {
  return {
    key,
    label,
    status,
    platformCanPrepare,
    requiresProfessionalAct,
    guardrail: 'La plataforma prepara evidencia; el acto profesional queda fuera.',
  };
}

function certifiedBankBoundaryRow(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  platformCanPrepare: string,
  requiresExternalProof: string,
): TenantAccountingAdvancedCertifiedBankFeedBoundaryBlueprintView['boundaryRows'][number] {
  return {
    key,
    label,
    status,
    platformCanPrepare,
    requiresExternalProof,
    certificationRisk:
      'Riesgo de vender conciliacion operativa como certificacion bancaria.',
  };
}

function graduationCloseoutCheck(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  evidenceRefs: string[],
): TenantAccountingAdvancedGraduationCloseoutView['closeoutChecklist'][number] {
  return { key, label, status, evidenceRefs };
}

function boundaryRowSummary(
  boundaryRows: TenantAccountingAdvancedFormalBooksBoundaryBlueprintView['boundaryRows'],
): TenantAccountingAdvancedFormalBooksBoundaryBlueprintView['summary'] {
  return {
    rowCount: boundaryRows.length,
    readyRowCount: boundaryRows.filter((row) => row.status === 'ready').length,
    needsReviewRowCount: boundaryRows.filter(
      (row) => row.status === 'needs_review',
    ).length,
    blockedRowCount: boundaryRows.filter((row) => row.status === 'blocked')
      .length,
  };
}

function formalPolicy(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  owner: TenantAccountingAdvancedPoliciesClosingTemplateRegistryView['policies'][number]['owner'],
  templateRef: string,
): TenantAccountingAdvancedPoliciesClosingTemplateRegistryView['policies'][number] {
  return {
    key,
    label,
    status,
    owner,
    templateRef,
    guardrail: 'La politica guia revision; no ejecuta actos contables formales.',
  };
}

function accountantPortalPanel(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  evidenceRefs: string[],
  accountantAction: string,
): TenantAccountingAdvancedExternalAccountantPortalShellView['reviewPanels'][number] {
  return { key, label, status, evidenceRefs, accountantAction };
}

function adjustmentRecommendation(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  adjustmentType: TenantAccountingAdvancedAdjustmentAutomationWorkbenchView['recommendations'][number]['adjustmentType'],
  evidenceRefs: string[],
): TenantAccountingAdvancedAdjustmentAutomationWorkbenchView['recommendations'][number] {
  return {
    key,
    label,
    status,
    adjustmentType,
    evidenceRefs,
    requiredApproval: 'Aprobacion del contador externo antes de materializar.',
  };
}

function statementSection(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  periodRange: string,
  evidenceRefs: string[],
  variationSignal: string,
): TenantAccountingAdvancedMultiPeriodFinancialStatementWorkspaceView['statementSections'][number] {
  return {
    key,
    label,
    status,
    periodRange,
    evidenceRefs,
    variationSignal,
  };
}

function formalBookBoundaryPacketRow(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  draftArtifact: string,
  signingBoundary: string,
): TenantAccountingAdvancedFormalBooksDraftSigningBoundaryPacketView['boundaryRows'][number] {
  return {
    key,
    label,
    status,
    draftArtifact,
    signingBoundary,
    professionalActRequired:
      'Requiere contador, auditor o representante autorizado segun aplique.',
  };
}

function bankReconciliationReadinessCheck(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  platformEvidence: string,
  externalProofRequired: string,
): TenantAccountingAdvancedCertifiedBankReconciliationReadinessCloseoutView['reconciliationChecks'][number] {
  return {
    key,
    label,
    status,
    platformEvidence,
    externalProofRequired,
    signoffBoundary: 'Signoff externo requerido antes de certificacion.',
  };
}

function formalReadinessDecisionFromStatus(
  closeoutStatus: AccountingReadinessStatus,
  reconciliationChecks: TenantAccountingAdvancedCertifiedBankReconciliationReadinessCloseoutView['reconciliationChecks'],
  blockers: string[],
): AccountingAdvancedFormalReadinessDecision {
  if (blockers.length > 0 || closeoutStatus === 'blocked') {
    return 'return_to_advanced_hardening';
  }
  if (reconciliationChecks.every((check) => check.status === 'ready')) {
    return 'ready_for_formal_product_design';
  }
  if (reconciliationChecks.some((check) => check.status === 'needs_review')) {
    return 'needs_professional_boundary_review';
  }
  return 'do_not_open_formal_product';
}

function formalScopeModule(
  key: AccountingAdvancedFormalModuleKey,
  label: string,
  status: AccountingReadinessStatus,
  included: boolean,
  boundary: string,
  evidenceRefs: string[],
): TenantAccountingAdvancedFormalProductScopeContractView['modules'][number] {
  return { key, label, status, included, boundary, evidenceRefs };
}

function responsibilityAssignment(
  key: string,
  label: string,
  moduleKey: AccountingAdvancedFormalModuleKey,
  status: AccountingReadinessStatus,
  owner: AccountingAdvancedProfessionalOwner,
  responsibility: string,
): TenantAccountingAdvancedProfessionalResponsibilityAssignmentMatrixView['assignments'][number] {
  return {
    key,
    label,
    moduleKey,
    status,
    owner,
    responsibility,
    guardrail: 'Owner explicito requerido antes de cualquier acto formal.',
  };
}

function formalArtifact(
  key: string,
  label: string,
  moduleKey: AccountingAdvancedFormalModuleKey,
  status: AccountingReadinessStatus,
  artifactType: TenantAccountingAdvancedFormalArtifactDraftRegistryView['artifacts'][number]['artifactType'],
  draftReadiness: string,
  requiredOwner: AccountingAdvancedProfessionalOwner,
): TenantAccountingAdvancedFormalArtifactDraftRegistryView['artifacts'][number] {
  return {
    key,
    label,
    moduleKey,
    status,
    artifactType,
    draftReadiness,
    requiredOwner,
  };
}

function workflowStep(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  actor: AccountingAdvancedProfessionalOwner,
  transition: TenantAccountingAdvancedProfessionalReviewWorkflowDesignView['workflowSteps'][number]['transition'],
): TenantAccountingAdvancedProfessionalReviewWorkflowDesignView['workflowSteps'][number] {
  return {
    key,
    label,
    status,
    actor,
    transition,
    guardrail: 'La transicion disena revision; no ejecuta aprobacion formal.',
  };
}

function riskGuardrail(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  appliesTo: AccountingAdvancedFormalModuleKey,
  risk: string,
  requiredControl: string,
): TenantAccountingAdvancedFormalProductRiskGuardrailPackView['guardrailRows'][number] {
  return { key, label, status, appliesTo, risk, requiredControl };
}

function designCloseoutCheck(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  evidenceRefs: string[],
): TenantAccountingAdvancedFormalProductDesignCloseoutView['closeoutChecklist'][number] {
  return { key, label, status, evidenceRefs };
}

function draftingGate(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  evidenceRefs: string[],
  gate: string,
): TenantAccountingAdvancedFormalArtifactDraftingAnchorView['draftingGates'][number] {
  return { key, label, status, evidenceRefs, gate };
}

function adjustmentDraft(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  adjustmentType: TenantAccountingAdvancedAdjustmentDraftPackView['draftAdjustments'][number]['adjustmentType'],
  evidenceRefs: string[],
  professionalQuestion: string,
): TenantAccountingAdvancedAdjustmentDraftPackView['draftAdjustments'][number] {
  return {
    key,
    label,
    status,
    adjustmentType,
    evidenceRefs,
    professionalQuestion,
  };
}

function draftSummary(
  draftAdjustments: TenantAccountingAdvancedAdjustmentDraftPackView['draftAdjustments'],
): TenantAccountingAdvancedAdjustmentDraftPackView['summary'] {
  return {
    draftCount: draftAdjustments.length,
    readyDraftCount: draftAdjustments.filter((draft) => draft.status === 'ready')
      .length,
    needsReviewDraftCount: draftAdjustments.filter(
      (draft) => draft.status === 'needs_review',
    ).length,
    blockedDraftCount: draftAdjustments.filter(
      (draft) => draft.status === 'blocked',
    ).length,
  };
}

function bookDraft(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  bookType: TenantAccountingAdvancedFormalBooksDraftWorkspaceView['bookDrafts'][number]['bookType'],
  sourceRefs: string[],
  reviewBoundary: string,
): TenantAccountingAdvancedFormalBooksDraftWorkspaceView['bookDrafts'][number] {
  return { key, label, status, bookType, sourceRefs, reviewBoundary };
}

function statementDraft(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  statementType: TenantAccountingAdvancedFinancialStatementsDraftPackView['statementDrafts'][number]['statementType'],
  periodRange: string,
  evidenceRefs: string[],
): TenantAccountingAdvancedFinancialStatementsDraftPackView['statementDrafts'][number] {
  return { key, label, status, statementType, periodRange, evidenceRefs };
}

function draftingCloseoutCheck(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  evidenceRefs: string[],
): TenantAccountingAdvancedFormalArtifactDraftingCloseoutView['closeoutChecklist'][number] {
  return { key, label, status, evidenceRefs };
}

function formalArtifactDraftingDecisionFromStatus(
  closeoutStatus: AccountingReadinessStatus,
  draftingAnchor: TenantAccountingAdvancedFormalArtifactDraftingAnchorView,
  certifiedReconciliationDraftPack: TenantAccountingAdvancedCertifiedReconciliationDraftPackView,
  blockers: string[],
): AccountingAdvancedFormalArtifactDraftingDecision {
  if (blockers.length > 0 || closeoutStatus === 'blocked') {
    return 'return_to_formal_product_design';
  }
  if (
    draftingAnchor.productDesignCloseout.finalDecision !==
    'ready_for_formal_artifact_drafting'
  ) {
    return 'do_not_draft_formal_artifacts';
  }
  if (
    closeoutStatus === 'ready' &&
    certifiedReconciliationDraftPack.summary.needsExternalProofDraftCount === 0
  ) {
    return 'ready_for_professional_review_execution';
  }
  return 'needs_draft_evidence';
}

function professionalReviewGate(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  evidenceRefs: string[],
  professionalOwner: AccountingAdvancedProfessionalOwner,
  gate: string,
): TenantAccountingAdvancedProfessionalReviewExecutionAnchorView['reviewGates'][number] {
  return { key, label, status, evidenceRefs, professionalOwner, gate };
}

function draftReviewRow(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  artifactType: TenantAccountingAdvancedAccountantDraftReviewRoomView['reviewRows'][number]['artifactType'],
  reviewer: AccountingAdvancedProfessionalOwner,
  finding: string,
  preliminaryDecision: TenantAccountingAdvancedAccountantDraftReviewRoomView['reviewRows'][number]['preliminaryDecision'],
): TenantAccountingAdvancedAccountantDraftReviewRoomView['reviewRows'][number] {
  return {
    key,
    label,
    status,
    artifactType,
    reviewer,
    finding,
    preliminaryDecision,
  };
}

function reviewChangeRequest(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  sourceReviewKey: string,
  requestedBy: AccountingAdvancedProfessionalOwner,
  requiredAction: string,
  evidenceRefs: string[],
): TenantAccountingAdvancedReviewChangeRequestPackView['changeRequests'][number] {
  return {
    key,
    label,
    status,
    sourceReviewKey,
    requestedBy,
    requiredAction,
    evidenceRefs,
  };
}

function changeActionFromReviewRow(
  row: TenantAccountingAdvancedAccountantDraftReviewRoomView['reviewRows'][number],
): string {
  if (row.preliminaryDecision === 'needs_external_signoff') {
    return 'Adjuntar evidencia externa y registrar signoff requerido antes de aprobacion.';
  }
  if (row.preliminaryDecision === 'reject_draft') {
    return 'Rehacer el draft antes de cualquier recomendacion profesional.';
  }
  return 'Resolver observaciones profesionales y actualizar evidencia del draft.';
}

function approvalRecommendation(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  artifactType: TenantAccountingAdvancedProfessionalApprovalRecommendationPackView['recommendations'][number]['artifactType'],
  recommendation: TenantAccountingAdvancedProfessionalApprovalRecommendationPackView['recommendations'][number]['recommendation'],
  requiredOwner: AccountingAdvancedProfessionalOwner,
  rationale: string,
): TenantAccountingAdvancedProfessionalApprovalRecommendationPackView['recommendations'][number] {
  return {
    key,
    label,
    status,
    artifactType,
    recommendation,
    requiredOwner,
    rationale,
  };
}

function recommendationFromReviewRow(
  row: TenantAccountingAdvancedAccountantDraftReviewRoomView['reviewRows'][number],
): TenantAccountingAdvancedProfessionalApprovalRecommendationPackView['recommendations'][number]['recommendation'] {
  if (row.preliminaryDecision === 'approve_for_recommendation') {
    return 'recommend_approval';
  }
  if (row.preliminaryDecision === 'needs_external_signoff') {
    return 'require_auditor_review';
  }
  if (row.preliminaryDecision === 'reject_draft') {
    return 'do_not_approve';
  }
  return 'require_changes_first';
}

function recommendationRationaleFromReviewRow(
  row: TenantAccountingAdvancedAccountantDraftReviewRoomView['reviewRows'][number],
): string {
  if (row.preliminaryDecision === 'approve_for_recommendation') {
    return 'Draft revisado sin cambios criticos antes del approval workflow.';
  }
  if (row.preliminaryDecision === 'needs_external_signoff') {
    return 'Requiere signoff externo antes de cualquier aprobacion formal.';
  }
  if (row.preliminaryDecision === 'reject_draft') {
    return 'Draft no debe avanzar sin re-trabajo profesional.';
  }
  return 'Debe resolver cambios solicitados antes de recomendar aprobacion.';
}

function reviewCommandLane(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  owner: AccountingAdvancedProfessionalOwner,
  primaryMetric: string,
  nextAction: string,
): TenantAccountingAdvancedReviewExecutionCommandCenterView['lanes'][number] {
  return { key, label, status, owner, primaryMetric, nextAction };
}

function professionalReviewCloseoutCheck(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  evidenceRefs: string[],
): TenantAccountingAdvancedProfessionalReviewExecutionCloseoutView['closeoutChecklist'][number] {
  return { key, label, status, evidenceRefs };
}

function professionalReviewExecutionDecisionFromStatus(
  closeoutStatus: AccountingReadinessStatus,
  approvalRecommendationPack: TenantAccountingAdvancedProfessionalApprovalRecommendationPackView,
  commandCenter: TenantAccountingAdvancedReviewExecutionCommandCenterView,
  blockers: string[],
): AccountingAdvancedProfessionalReviewExecutionDecision {
  if (blockers.length > 0 || closeoutStatus === 'blocked') {
    return 'return_to_artifact_drafting';
  }
  if (approvalRecommendationPack.summary.doNotApproveCount > 0) {
    return 'do_not_advance_formal_artifacts';
  }
  if (
    approvalRecommendationPack.summary.requireChangesCount > 0 ||
    approvalRecommendationPack.summary.requireAuditorReviewCount > 0 ||
    commandCenter.summary.needsReviewLaneCount > 0
  ) {
    return 'needs_more_changes';
  }
  return 'ready_for_formal_approval_workflow';
}

function formalApprovalGate(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  evidenceRefs: string[],
  requiredOwner: AccountingAdvancedProfessionalOwner,
  gate: string,
): TenantAccountingAdvancedFormalApprovalWorkflowAnchorView['approvalGates'][number] {
  return { key, label, status, evidenceRefs, requiredOwner, gate };
}

function approvalAuthority(
  key: string,
  label: string,
  artifactType: TenantAccountingAdvancedApprovalAuthorityMatrixView['authorities'][number]['artifactType'],
  status: AccountingReadinessStatus,
  requiredOwner: AccountingAdvancedProfessionalOwner,
  authorityBoundary: string,
): TenantAccountingAdvancedApprovalAuthorityMatrixView['authorities'][number] {
  return {
    key,
    label,
    artifactType,
    status,
    requiredOwner,
    authorityBoundary,
  };
}

function approvalEvidence(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  artifactType: TenantAccountingAdvancedFormalApprovalEvidencePackView['evidenceItems'][number]['artifactType'],
  evidenceRefs: string[],
  approvalQuestion: string,
): TenantAccountingAdvancedFormalApprovalEvidencePackView['evidenceItems'][number] {
  return { key, label, status, artifactType, evidenceRefs, approvalQuestion };
}

function approvalDecision(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  artifactType: TenantAccountingAdvancedApprovalDecisionWorkspaceView['decisions'][number]['artifactType'],
  decision: TenantAccountingAdvancedApprovalDecisionWorkspaceView['decisions'][number]['decision'],
  decidedBy: AccountingAdvancedProfessionalOwner,
  rationale: string,
): TenantAccountingAdvancedApprovalDecisionWorkspaceView['decisions'][number] {
  return { key, label, status, artifactType, decision, decidedBy, rationale };
}

function approvalDecisionFromEvidence(
  item: TenantAccountingAdvancedFormalApprovalEvidencePackView['evidenceItems'][number],
): TenantAccountingAdvancedApprovalDecisionWorkspaceView['decisions'][number]['decision'] {
  if (item.status === 'ready') {
    return 'approved_pending_signature';
  }
  if (
    item.artifactType === 'financial_statement' ||
    item.artifactType === 'certified_reconciliation'
  ) {
    return 'requires_external_signoff';
  }
  if (item.status === 'blocked') {
    return 'rejected';
  }
  return 'requires_changes';
}

function ownerFromArtifactType(
  artifactType: TenantAccountingAdvancedApprovalDecisionWorkspaceView['decisions'][number]['artifactType'],
): AccountingAdvancedProfessionalOwner {
  if (artifactType === 'financial_statement') {
    return 'legal_representative';
  }
  if (artifactType === 'certified_reconciliation') {
    return 'auditor';
  }
  return 'external_accountant';
}

function approvalDecisionRationale(
  item: TenantAccountingAdvancedFormalApprovalEvidencePackView['evidenceItems'][number],
): string {
  if (item.status === 'ready') {
    return 'Evidencia lista para aprobacion interna pendiente de firma/certificacion.';
  }
  if (
    item.artifactType === 'financial_statement' ||
    item.artifactType === 'certified_reconciliation'
  ) {
    return 'Requiere signoff externo antes de avanzar a firma/certificacion.';
  }
  if (item.status === 'blocked') {
    return 'No debe aprobarse hasta resolver blockers de evidencia.';
  }
  return 'Debe resolver cambios profesionales antes de aprobacion.';
}

function formalApprovalLane(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  owner: AccountingAdvancedProfessionalOwner,
  primaryMetric: string,
  nextAction: string,
): TenantAccountingAdvancedFormalApprovalCommandCenterView['lanes'][number] {
  return { key, label, status, owner, primaryMetric, nextAction };
}

function formalApprovalCloseoutCheck(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  evidenceRefs: string[],
): TenantAccountingAdvancedFormalApprovalWorkflowCloseoutView['closeoutChecklist'][number] {
  return { key, label, status, evidenceRefs };
}

function formalApprovalWorkflowDecisionFromStatus(
  closeoutStatus: AccountingReadinessStatus,
  decisionWorkspace: TenantAccountingAdvancedApprovalDecisionWorkspaceView,
  commandCenter: TenantAccountingAdvancedFormalApprovalCommandCenterView,
  blockers: string[],
): AccountingAdvancedFormalApprovalWorkflowDecision {
  if (blockers.length > 0 || closeoutStatus === 'blocked') {
    return 'return_to_professional_review';
  }
  if (decisionWorkspace.summary.rejectedCount > 0) {
    return 'do_not_approve_formal_artifacts';
  }
  if (
    decisionWorkspace.summary.requiresChangesCount > 0 ||
    decisionWorkspace.summary.requiresExternalSignoffCount > 0 ||
    commandCenter.summary.needsReviewLaneCount > 0
  ) {
    return 'needs_external_approval';
  }
  return 'ready_for_signature_and_certification';
}

function signatureBoundaryGate(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  evidenceRefs: string[],
  requiredAct: TenantAccountingAdvancedSignatureCertificationBoundaryAnchorView['boundaryGates'][number]['requiredAct'],
  boundary: string,
): TenantAccountingAdvancedSignatureCertificationBoundaryAnchorView['boundaryGates'][number] {
  return { key, label, status, evidenceRefs, requiredAct, boundary };
}

function formalSignatory(
  key: string,
  label: string,
  artifactType: TenantAccountingAdvancedFormalSignatoryRegistryView['signatories'][number]['artifactType'],
  status: AccountingReadinessStatus,
  requiredAct: TenantAccountingAdvancedFormalSignatoryRegistryView['signatories'][number]['requiredAct'],
  requiredOwner: AccountingAdvancedProfessionalOwner,
  externalAuthority: string,
): TenantAccountingAdvancedFormalSignatoryRegistryView['signatories'][number] {
  return {
    key,
    label,
    artifactType,
    status,
    requiredAct,
    requiredOwner,
    externalAuthority,
  };
}

function signatureEvidenceItem(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  signatoryKey: string,
  evidenceRefs: string[],
  missingEvidence: string[],
): TenantAccountingAdvancedSignatureEvidenceReadinessPackView['evidenceItems'][number] {
  return { key, label, status, signatoryKey, evidenceRefs, missingEvidence };
}

function missingEvidenceFromSignatory(
  signatory: TenantAccountingAdvancedFormalSignatoryRegistryView['signatories'][number],
): string[] {
  if (signatory.status === 'ready') {
    return [];
  }
  if (signatory.requiredAct === 'certification') {
    return ['external certification proof', 'certifier acceptance'];
  }
  if (signatory.requiredAct === 'legalization') {
    return ['legalization venue confirmation', 'book format acceptance'];
  }
  return ['signatory identity confirmation', 'signature method confirmation'];
}

function certificationRequirement(
  key: string,
  label: string,
  artifactType: TenantAccountingAdvancedCertificationRequirementWorkspaceView['requirements'][number]['artifactType'],
  status: AccountingReadinessStatus,
  requiredProof: string,
  requiredOwner: AccountingAdvancedProfessionalOwner,
): TenantAccountingAdvancedCertificationRequirementWorkspaceView['requirements'][number] {
  return { key, label, status, artifactType, requiredProof, requiredOwner };
}

function legalizationItem(
  key: string,
  label: string,
  artifactType: TenantAccountingAdvancedLegalizationBoundaryPacketView['legalizationItems'][number]['artifactType'],
  status: AccountingReadinessStatus,
  legalizationBoundary: string,
  requiredOwner: AccountingAdvancedProfessionalOwner,
): TenantAccountingAdvancedLegalizationBoundaryPacketView['legalizationItems'][number] {
  return {
    key,
    label,
    status,
    artifactType,
    legalizationBoundary,
    requiredOwner,
  };
}

function signatureBoundaryCloseoutCheck(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  evidenceRefs: string[],
): TenantAccountingAdvancedSignatureCertificationBoundaryCloseoutView['closeoutChecklist'][number] {
  return { key, label, status, evidenceRefs };
}

function signatureCertificationBoundaryDecisionFromStatus(
  closeoutStatus: AccountingReadinessStatus,
  signatureEvidencePack: TenantAccountingAdvancedSignatureEvidenceReadinessPackView,
  certificationWorkspace: TenantAccountingAdvancedCertificationRequirementWorkspaceView,
  legalizationPacket: TenantAccountingAdvancedLegalizationBoundaryPacketView,
  blockers: string[],
): AccountingAdvancedSignatureCertificationBoundaryDecision {
  if (blockers.length > 0 || closeoutStatus === 'blocked') {
    return 'return_to_formal_approval';
  }
  if (
    signatureEvidencePack.summary.missingEvidenceCount > 0 ||
    certificationWorkspace.summary.needsReviewRequirementCount > 0 ||
    legalizationPacket.summary.needsReviewLegalizationItemCount > 0
  ) {
    return 'needs_signatory_evidence';
  }
  return 'ready_for_external_execution';
}

function externalHandoffGate(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  evidenceRefs: string[],
  externalAct: TenantAccountingAdvancedExternalExecutionHandoffAnchorView['handoffGates'][number]['externalAct'],
  handoffBoundary: string,
): TenantAccountingAdvancedExternalExecutionHandoffAnchorView['handoffGates'][number] {
  return { key, label, status, evidenceRefs, externalAct, handoffBoundary };
}

function externalExecutorAssignment(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  externalAct: TenantAccountingAdvancedExternalExecutorAssignmentMatrixView['assignments'][number]['externalAct'],
  executorRole: TenantAccountingAdvancedExternalExecutorAssignmentMatrixView['assignments'][number]['executorRole'],
  responsibility: string,
): TenantAccountingAdvancedExternalExecutorAssignmentMatrixView['assignments'][number] {
  return { key, label, status, externalAct, executorRole, responsibility };
}

function executionBundle(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  assignmentKey: string,
  artifactRefs: string[],
  evidenceRefs: string[],
  blockerRefs: string[],
): TenantAccountingAdvancedExecutionHandoffEvidenceBundleView['bundles'][number] {
  return {
    key,
    label,
    status,
    assignmentKey,
    artifactRefs,
    evidenceRefs,
    blockerRefs,
  };
}

function externalInstruction(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  assignmentKey: string,
  instruction: string,
  expectedReturnEvidence: string[],
): TenantAccountingAdvancedExternalExecutionInstructionPackView['instructions'][number] {
  return {
    key,
    label,
    status,
    assignmentKey,
    instruction,
    expectedReturnEvidence,
  };
}

function returnEvidenceChannel(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  expectedStatus: TenantAccountingAdvancedExecutionReturnEvidenceIntakeView['returnChannels'][number]['expectedStatus'],
  requiredEvidence: string[],
): TenantAccountingAdvancedExecutionReturnEvidenceIntakeView['returnChannels'][number] {
  return { key, label, status, expectedStatus, requiredEvidence };
}

function externalHandoffCloseoutCheck(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  evidenceRefs: string[],
): TenantAccountingAdvancedExternalExecutionHandoffCloseoutView['closeoutChecklist'][number] {
  return { key, label, status, evidenceRefs };
}

function externalExecutionHandoffDecisionFromStatus(
  closeoutStatus: AccountingReadinessStatus,
  executorMatrix: TenantAccountingAdvancedExternalExecutorAssignmentMatrixView,
  evidenceBundle: TenantAccountingAdvancedExecutionHandoffEvidenceBundleView,
  returnEvidenceIntake: TenantAccountingAdvancedExecutionReturnEvidenceIntakeView,
  blockers: string[],
): AccountingAdvancedExternalExecutionHandoffDecision {
  if (blockers.length > 0 || closeoutStatus === 'blocked') {
    return 'return_to_signature_boundary';
  }
  if (
    executorMatrix.summary.needsReviewAssignmentCount > 0 ||
    evidenceBundle.summary.needsReviewBundleCount > 0 ||
    returnEvidenceIntake.summary.needsReviewChannelCount > 0
  ) {
    return 'needs_executor_assignment';
  }
  return 'ready_for_external_execution_tracking';
}

function externalTrackingLane(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  externalAct: TenantAccountingAdvancedExternalExecutionTrackingAnchorView['trackingLanes'][number]['externalAct'],
  trackingState: TenantAccountingAdvancedExternalExecutionTrackingAnchorView['trackingLanes'][number]['trackingState'],
  evidenceRefs: string[],
): TenantAccountingAdvancedExternalExecutionTrackingAnchorView['trackingLanes'][number] {
  return { key, label, status, externalAct, trackingState, evidenceRefs };
}

function externalTrackingEvent(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  laneKey: string,
  externalAct: TenantAccountingAdvancedExternalExecutionStatusLedgerView['events'][number]['externalAct'],
  expectedActor: string,
  eventState: TenantAccountingAdvancedExternalExecutionStatusLedgerView['events'][number]['eventState'],
  evidenceRequired: string[],
  evidenceReceived: string[],
  blockerRefs: string[],
): TenantAccountingAdvancedExternalExecutionStatusLedgerView['events'][number] {
  return {
    key,
    label,
    status,
    laneKey,
    externalAct,
    expectedActor,
    eventState,
    evidenceRequired,
    evidenceReceived,
    blockerRefs,
  };
}

function returnedEvidenceValidation(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  eventKey: string,
  validationResult: TenantAccountingAdvancedReturnedEvidenceValidationWorkspaceView['validations'][number]['validationResult'],
  requiredEvidence: string[],
  receivedEvidence: string[],
  blockerRefs: string[],
): TenantAccountingAdvancedReturnedEvidenceValidationWorkspaceView['validations'][number] {
  return {
    key,
    label,
    status,
    eventKey,
    validationResult,
    requiredEvidence,
    receivedEvidence,
    blockerRefs,
  };
}

function externalObservation(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  validationKey: string,
  resolutionRoute: TenantAccountingAdvancedExternalObservationResolutionQueueView['observations'][number]['resolutionRoute'],
  reason: string,
): TenantAccountingAdvancedExternalObservationResolutionQueueView['observations'][number] {
  return { key, label, status, validationKey, resolutionRoute, reason };
}

function trackingCommandLane(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  metric: string,
  count: number,
): TenantAccountingAdvancedExternalExecutionTrackingCommandCenterView['commandLanes'][number] {
  return { key, label, status, metric, count };
}

function externalTrackingCloseoutCheck(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  evidenceRefs: string[],
): TenantAccountingAdvancedExternalExecutionTrackingCloseoutView['closeoutChecklist'][number] {
  return { key, label, status, evidenceRefs };
}

function externalActorForAct(
  externalAct: TenantAccountingAdvancedExternalExecutionTrackingAnchorView['trackingLanes'][number]['externalAct'],
): string {
  if (externalAct === 'signature') {
    return 'external_signatory';
  }
  if (externalAct === 'certification') {
    return 'external_certifier';
  }
  return 'legalization_authority';
}

function expectedEvidenceForAct(
  externalAct: TenantAccountingAdvancedExternalExecutionTrackingAnchorView['trackingLanes'][number]['externalAct'],
): string[] {
  if (externalAct === 'signature') {
    return ['signed_artifact_reference', 'signatory_identity'];
  }
  if (externalAct === 'certification') {
    return ['certification_reference', 'certifier_identity'];
  }
  return ['legalization_reference', 'legalization_authority'];
}

function resolutionRouteForValidation(
  validationResult: TenantAccountingAdvancedReturnedEvidenceValidationWorkspaceView['validations'][number]['validationResult'],
): TenantAccountingAdvancedExternalObservationResolutionQueueView['observations'][number]['resolutionRoute'] {
  if (validationResult === 'valid_return') {
    return 'no_resolution_required';
  }
  if (validationResult === 'observed_return') {
    return 'return_to_professional_review';
  }
  if (validationResult === 'rejected_return') {
    return 'return_to_external_handoff';
  }
  return 'return_to_signature_boundary';
}

function externalExecutionTrackingDecisionFromStatus(
  status: AccountingReadinessStatus,
  validationWorkspace: TenantAccountingAdvancedReturnedEvidenceValidationWorkspaceView,
  observationQueue: TenantAccountingAdvancedExternalObservationResolutionQueueView,
  blockers: string[],
): AccountingAdvancedExternalExecutionTrackingDecision {
  if (blockers.length > 0 || status === 'blocked') {
    return 'return_to_external_handoff';
  }
  if (
    validationWorkspace.summary.rejectedReturnCount > 0 ||
    observationQueue.summary.routedObservationCount > 0
  ) {
    return 'resolve_external_observations';
  }
  if (validationWorkspace.summary.validReturnCount > 0) {
    return 'ready_for_external_result_intake';
  }
  if (validationWorkspace.summary.insufficientEvidenceCount > 0) {
    return 'waiting_for_external_execution';
  }
  return 'do_not_accept_external_results';
}

function externalResultIntakeGate(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  externalAct: TenantAccountingAdvancedExternalResultIntakeAnchorView['resultIntakeGates'][number]['externalAct'],
  intakeState: TenantAccountingAdvancedExternalResultIntakeAnchorView['resultIntakeGates'][number]['intakeState'],
  evidenceRefs: string[],
): TenantAccountingAdvancedExternalResultIntakeAnchorView['resultIntakeGates'][number] {
  return { key, label, status, externalAct, intakeState, evidenceRefs };
}

function returnedArtifact(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  intakeGateKey: string,
  artifactKind: TenantAccountingAdvancedReturnedArtifactRegistryView['returnedArtifacts'][number]['artifactKind'],
  actorRef: string,
  evidenceRefs: string[],
  blockerRefs: string[],
): TenantAccountingAdvancedReturnedArtifactRegistryView['returnedArtifacts'][number] {
  return {
    key,
    label,
    status,
    intakeGateKey,
    artifactKind,
    actorRef,
    evidenceRefs,
    blockerRefs,
  };
}

function internalAcceptanceCriterion(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  artifactKey: string,
  criteriaType: TenantAccountingAdvancedInternalAcceptanceCriteriaWorkspaceView['criteria'][number]['criteriaType'],
  evidenceRefs: string[],
  blockerRefs: string[],
): TenantAccountingAdvancedInternalAcceptanceCriteriaWorkspaceView['criteria'][number] {
  return {
    key,
    label,
    status,
    artifactKey,
    criteriaType,
    evidenceRefs,
    blockerRefs,
  };
}

function acceptanceDecision(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  artifactKey: string,
  decision: TenantAccountingAdvancedAcceptanceDecisionWorkspaceView['decisions'][number]['decision'],
  reason: string,
): TenantAccountingAdvancedAcceptanceDecisionWorkspaceView['decisions'][number] {
  return { key, label, status, artifactKey, decision, reason };
}

function internalAcceptanceCommandLane(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  metric: string,
  count: number,
): TenantAccountingAdvancedInternalAcceptanceCommandCenterView['commandLanes'][number] {
  return { key, label, status, metric, count };
}

function externalResultIntakeCloseoutCheck(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  evidenceRefs: string[],
): TenantAccountingAdvancedExternalResultIntakeCloseoutView['closeoutChecklist'][number] {
  return { key, label, status, evidenceRefs };
}

function externalActFromValidationKey(
  eventKey: string,
): TenantAccountingAdvancedExternalResultIntakeAnchorView['resultIntakeGates'][number]['externalAct'] {
  if (eventKey.includes('certification')) {
    return 'certification';
  }
  if (eventKey.includes('legalization')) {
    return 'legalization';
  }
  return 'signature';
}

function artifactKindFromIntakeGate(
  gate: TenantAccountingAdvancedExternalResultIntakeAnchorView['resultIntakeGates'][number],
): TenantAccountingAdvancedReturnedArtifactRegistryView['returnedArtifacts'][number]['artifactKind'] {
  if (gate.intakeState === 'observed_external_result') {
    return 'observed';
  }
  if (gate.intakeState === 'rejected_external_result') {
    return 'rejected';
  }
  if (gate.externalAct === 'certification') {
    return 'certified';
  }
  if (gate.externalAct === 'legalization') {
    return 'legalized';
  }
  return 'signed';
}

function externalResultIntakeDecisionFromStatus(
  status: AccountingReadinessStatus,
  decisionWorkspace: TenantAccountingAdvancedAcceptanceDecisionWorkspaceView,
  blockers: string[],
): AccountingAdvancedExternalResultIntakeDecision {
  if (blockers.length > 0 || status === 'blocked') {
    return 'return_to_external_handoff';
  }
  if (decisionWorkspace.summary.returnToHandoffDecisionCount > 0) {
    return 'return_to_external_handoff';
  }
  if (decisionWorkspace.summary.returnToTrackingDecisionCount > 0) {
    return 'return_to_external_tracking';
  }
  if (decisionWorkspace.summary.needsReviewDecisionCount > 0) {
    return 'needs_internal_acceptance_review';
  }
  if (decisionWorkspace.summary.acceptedDecisionCount > 0) {
    return 'ready_for_formal_record_assembly';
  }
  return 'do_not_accept_external_results';
}

function formalProductDesignDecisionFromStatus(
  closeoutStatus: AccountingReadinessStatus,
  scopeContract: TenantAccountingAdvancedFormalProductScopeContractView,
  guardrailPack: TenantAccountingAdvancedFormalProductRiskGuardrailPackView,
  blockers: string[],
): AccountingAdvancedFormalProductDesignDecision {
  if (blockers.length > 0 || closeoutStatus === 'blocked') {
    return 'return_to_formal_readiness_hardening';
  }
  if (scopeContract.summary.includedModuleCount === 0) {
    return 'do_not_design_formal_product';
  }
  if (
    closeoutStatus === 'ready' &&
    guardrailPack.summary.needsReviewGuardrailCount === 0
  ) {
    return 'ready_for_formal_artifact_drafting';
  }
  return 'needs_scope_review';
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

function pilotEnrollmentStatusFromOperatingCloseout(
  operatingCloseout: TenantAccountingAdvancedMvpOperatingCloseoutView,
): AccountingAdvancedPilotEnrollmentStatus {
  if (
    operatingCloseout.closeoutStatus === 'blocked' ||
    operatingCloseout.finalDecision === 'return_to_foundation_hardening'
  ) {
    return 'blocked';
  }
  if (operatingCloseout.finalDecision === 'mvp_ready_for_pilot') {
    return 'eligible';
  }
  if (operatingCloseout.finalDecision === 'needs_accountant_review') {
    return 'needs_accountant_review';
  }
  return 'not_recommended';
}

function pilotOutcomeFromRunbook(
  runbook: TenantAccountingAdvancedPilotRunbookView,
): AccountingAdvancedPilotOutcome {
  if (
    runbook.runbookStatus === 'blocked' ||
    runbook.summary.blockedStepCount > 0
  ) {
    return 'pilot_blocked';
  }
  if (runbook.reviewRoom.summary.rejectedRowCount > 0) {
    return 'pilot_not_recommended';
  }
  if (
    runbook.runbookStatus === 'needs_review' ||
    runbook.reviewRoom.summary.needsEvidenceRowCount > 0
  ) {
    return 'pilot_needs_hardening';
  }
  return runbook.reviewRoom.evidenceSnapshot.enrollment.enrollmentStatus ===
    'eligible'
    ? 'pilot_passed'
    : 'pilot_not_recommended';
}

function graduationDecisionFromRows(
  rows: TenantAccountingAdvancedProductGraduationMatrixView['rows'],
  blockers: string[],
): AccountingAdvancedGraduationDecision {
  if (blockers.length > 0 || rows.some((row) => row.status === 'blocked')) {
    return 'return_to_foundation_hardening';
  }
  if (
    rows.every((row) => row.recommendation === 'graduate_to_advanced_product')
  ) {
    return 'graduate_to_advanced_product';
  }
  if (
    rows.some((row) => row.recommendation === 'return_to_foundation_hardening')
  ) {
    return 'return_to_foundation_hardening';
  }
  if (rows.some((row) => row.recommendation === 'extend_pilot')) {
    return 'extend_pilot';
  }
  return 'do_not_graduate';
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
