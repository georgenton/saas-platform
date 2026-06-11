import {
  AccountingAdvancedNeedType,
  AccountingReadinessStatus,
  TenantAccountingAccountantDiscoveryWorkspaceView,
  TenantAccountingAdvancedDiscoveryAnchorView,
  TenantAccountingAdvancedDiscoveryCloseoutView,
  TenantAccountingAdvancedDiscoveryIntakeView,
  TenantAccountingAdvancedDiscoveryReadinessPacketView,
  TenantAccountingFormalNeedsClassifierView,
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

function check(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  evidenceRefs: string[],
): TenantAccountingAdvancedDiscoveryCloseoutView['closeoutChecklist'][number] {
  return { key, label, status, evidenceRefs };
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
