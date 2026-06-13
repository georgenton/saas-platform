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
  AccountingAdvancedFormalRecordAssemblyDecision,
  AccountingAdvancedFormalRecordCloseoutDecision,
  AccountingAdvancedGraduationArchiveHandoffDecision,
  FullAccountingCandidateDecision,
  FullAccountingControlledPilotDecision,
  FullAccountingGraduationDecision,
  FullAccountingFormalReadinessDecision,
  FullAccountingFormalArtifactDraftingDecision,
  FullAccountingProfessionalReviewExecutionDecision,
  FullAccountingFormalApprovalWorkflowDecision,
  FullAccountingSignatureCertificationBoundaryDecision,
  FullAccountingExternalExecutionHandoffDecision,
  FullAccountingExternalExecutionTrackingDecision,
  FullAccountingExternalResultIntakeDecision,
  FullAccountingProductDesignDecision,
  FullAccountingMvpReadinessDecision,
  FullAccountingMvpOperationsDecision,
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
  TenantAccountingAdvancedAcceptedArtifactBinderView,
  TenantAccountingAdvancedArchiveReadinessWorkspaceView,
  TenantAccountingAdvancedArchiveHandoffPackageView,
  TenantAccountingAdvancedFormalCloseoutEvidencePacketView,
  TenantAccountingAdvancedFormalRecordAssemblyAnchorView,
  TenantAccountingAdvancedFormalRecordAssemblyCloseoutView,
  TenantAccountingAdvancedFormalRecordAssemblyCommandCenterView,
  TenantAccountingAdvancedFormalRecordCloseoutAnchorView,
  TenantAccountingAdvancedFormalRecordCloseoutCloseoutView,
  TenantAccountingAdvancedFormalRecordCloseoutCommandCenterView,
  TenantAccountingAdvancedGraduationArchiveHandoffAnchorView,
  TenantAccountingAdvancedGraduationArchiveHandoffCloseoutView,
  TenantAccountingAdvancedGraduationArchiveHandoffCommandCenterView,
  TenantAccountingAdvancedGraduationSignalMatrixView,
  TenantAccountingAdvancedFormalRecordIndexWorkspaceView,
  TenantAccountingAdvancedInternalAcceptanceCommandCenterView,
  TenantAccountingAdvancedInternalAcceptanceCriteriaWorkspaceView,
  TenantAccountingAdvancedProfessionalResponsibilityAssignmentMatrixView,
  TenantAccountingAdvancedProfessionalReviewWorkflowDesignView,
  TenantAccountingAdvancedProfessionalCloseoutAttestationBoundaryView,
  TenantAccountingAdvancedProductScopeDecisionWorkspaceView,
  TenantFullAccountingBankReconciliationBoundaryView,
  TenantFullAccountingCandidateAnchorView,
  TenantFullAccountingCandidateCloseoutView,
  TenantFullAccountingCoreLedgerScopeBlueprintView,
  TenantFullAccountingFinancialStatementsBlueprintView,
  TenantFullAccountingBankFeedReconciliationMvpReadinessView,
  TenantFullAccountingLedgerPersistenceDesignWorkspaceView,
  TenantFullAccountingLegalBooksStatutoryBoundaryView,
  TenantFullAccountingMvpReadinessAnchorView,
  TenantFullAccountingMvpReadinessCloseoutView,
  TenantFullAccountingMvpOperationsAnchorView,
  TenantFullAccountingMvpOperationsCloseoutView,
  TenantFullAccountingControlledPilotAnchorView,
  TenantFullAccountingControlledPilotCloseoutView,
  TenantFullAccountingGraduationAnchorView,
  TenantFullAccountingGraduationCloseoutView,
  TenantFullAccountingGraduationEvidenceDossierView,
  TenantFullAccountingGraduationRiskControlPackView,
  TenantFullAccountingFormalLedgerPostingReadinessPackView,
  TenantFullAccountingFormalArtifactDraftingAnchorView,
  TenantFullAccountingFormalArtifactDraftingCloseoutView,
  TenantFullAccountingFormalLedgerDraftPackView,
  TenantFullAccountingProfessionalReviewExecutionAnchorView,
  TenantFullAccountingProfessionalReviewExecutionCloseoutView,
  TenantFullAccountingFormalApprovalWorkflowAnchorView,
  TenantFullAccountingFormalApprovalWorkflowCloseoutView,
  TenantFullAccountingCertificationRequirementWorkspaceView,
  TenantFullAccountingExecutionHandoffEvidenceBundleView,
  TenantFullAccountingExecutionReturnEvidenceIntakeView,
  TenantFullAccountingExternalExecutionHandoffAnchorView,
  TenantFullAccountingExternalExecutionHandoffCloseoutView,
  TenantFullAccountingExternalExecutionInstructionPackView,
  TenantFullAccountingExternalExecutionStatusLedgerView,
  TenantFullAccountingExternalExecutionTrackingAnchorView,
  TenantFullAccountingExternalExecutionTrackingCloseoutView,
  TenantFullAccountingExternalExecutionTrackingCommandCenterView,
  TenantFullAccountingExternalObservationResolutionQueueView,
  TenantFullAccountingExternalExecutorAssignmentMatrixView,
  TenantFullAccountingExternalResultIntakeAnchorView,
  TenantFullAccountingExternalResultIntakeCloseoutView,
  TenantFullAccountingFormalSignatoryRegistryView,
  TenantFullAccountingFormalReadinessAnchorView,
  TenantFullAccountingFormalReadinessCloseoutView,
  TenantFullAccountingLegalizationBoundaryPacketView,
  TenantFullAccountingOfficialArtifactBoundaryRegistryView,
  TenantFullAccountingLedgerWorkbenchMvpView,
  TenantFullAccountingPilotAccountantReviewRoomView,
  TenantFullAccountingPilotEnrollmentPeriodFreezeView,
  TenantFullAccountingPilotOutcomePacketView,
  TenantFullAccountingPilotRunbookWorkspaceView,
  TenantFullAccountingProductScopeGraduationMatrixView,
  TenantFullAccountingProductDesignAnchorView,
  TenantFullAccountingProductDesignCloseoutView,
  TenantFullAccountingProductProfessionalResponsibilityMatrixView,
  TenantFullAccountingProductScopeContractView,
  TenantFullAccountingProfessionalOperatingModelView,
  TenantFullAccountingProfessionalPortalReadinessShellView,
  TenantFullAccountingPolicyTemplateRegistryView,
  TenantFullAccountingAccountantDraftReviewRoomView,
  TenantFullAccountingProfessionalApprovalRecommendationPackView,
  TenantFullAccountingApprovalAuthorityMatrixView,
  TenantFullAccountingApprovalDecisionWorkspaceView,
  TenantFullAccountingFormalApprovalCommandCenterView,
  TenantFullAccountingFormalApprovalEvidencePackView,
  TenantFullAccountingAcceptanceDecisionWorkspaceView,
  TenantFullAccountingInternalAcceptanceCommandCenterView,
  TenantFullAccountingInternalAcceptanceCriteriaWorkspaceView,
  TenantFullAccountingSignatureCertificationBoundaryAnchorView,
  TenantFullAccountingSignatureCertificationBoundaryCloseoutView,
  TenantFullAccountingSignatureEvidenceReadinessPackView,
  TenantFullAccountingReturnedArtifactRegistryView,
  TenantFullAccountingReturnedEvidenceValidationWorkspaceView,
  TenantFullAccountingPostingApprovalDraftPackView,
  TenantFullAccountingBankReconciliationEvidenceDraftPackView,
  TenantFullAccountingReviewChangeRequestPackView,
  TenantFullAccountingReviewExecutionCommandCenterView,
  TenantFullAccountingStatementBankFormalBoundaryPackView,
  TenantFullAccountingTrialBalanceFinancialStatementDraftPackView,
  TenantFullAccountingWorkflowControlBlueprintView,
  TenantFullAccountingPostingDraftLaneView,
  TenantFullAccountingBankReconciliationWorkbenchMvpView,
  TenantFullAccountingTrialBalancePreviewWorkbenchView,
  TenantFullAccountingPostingPolicyApprovalBoundaryView,
  TenantFullAccountingTrialBalanceStatementReadinessView,
  TenantAccountingAdvancedReturnedEvidenceValidationWorkspaceView,
  TenantAccountingAdvancedReturnedArtifactRegistryView,
  TenantAccountingAdvancedRecordConsistencyReviewWorkspaceView,
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

export class GetTenantAccountingAdvancedFormalRecordAssemblyAnchorUseCase {
  constructor(
    private readonly requestTenantAccountingAdvancedExternalResultIntakeCloseoutUseCase: RequestTenantAccountingAdvancedExternalResultIntakeCloseoutUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantAccountingAdvancedFormalRecordAssemblyAnchorView> {
    const resultIntakeCloseout =
      await this.requestTenantAccountingAdvancedExternalResultIntakeCloseoutUseCase.execute(
        input,
      );
    const recordGates: TenantAccountingAdvancedFormalRecordAssemblyAnchorView['recordGates'] =
      resultIntakeCloseout.decisionWorkspace.decisions.map((decision) =>
        formalRecordGate(
          `record_${decision.key}`,
          `${decision.label} formal record gate`,
          decision.status,
          recordTypeFromArtifactKey(decision.artifactKey),
          decision.decision === 'accepted_for_internal_record'
            ? 'ready_for_binder'
            : decision.decision === 'return_to_external_tracking'
              ? 'observed_result'
              : decision.decision === 'return_to_handoff'
                ? 'rejected_result'
                : 'pending_acceptance',
          [decision.artifactKey],
        ),
      );
    const blockers =
      resultIntakeCloseout.finalDecision === 'ready_for_formal_record_assembly'
        ? [...resultIntakeCloseout.blockers]
        : unique([
            ...resultIntakeCloseout.blockers,
            `External result intake decision is ${resultIntakeCloseout.finalDecision}.`,
          ]);
    const assemblyStatus = resolveStatus(
      recordGates.map((gate) => gate.status),
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      assemblyStatus,
      resultIntakeCloseout,
      recordGates,
      summary: {
        gateCount: recordGates.length,
        readyGateCount: recordGates.filter((gate) => gate.status === 'ready')
          .length,
        needsReviewGateCount: recordGates.filter(
          (gate) => gate.status === 'needs_review',
        ).length,
        blockedGateCount: recordGates.filter(
          (gate) => gate.status === 'blocked',
        ).length,
        acceptedDecisionCount:
          resultIntakeCloseout.decisionWorkspace.summary.acceptedDecisionCount,
      },
      blockers,
      nextStep:
        assemblyStatus === 'blocked'
          ? 'Volver a intake 1.4 antes de ensamblar record formal.'
          : 'Agrupar artifacts aceptados en binders internos.',
      guardrails: [
        'Formal Record Assembly 1.5 ensambla expediente interno; no emite libros oficiales.',
        'Solo artifacts aceptados internamente pueden entrar al binder formal.',
      ],
    };
  }
}

export class GetTenantAccountingAdvancedAcceptedArtifactBinderUseCase {
  constructor(
    private readonly getTenantAccountingAdvancedFormalRecordAssemblyAnchorUseCase: GetTenantAccountingAdvancedFormalRecordAssemblyAnchorUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantAccountingAdvancedAcceptedArtifactBinderView> {
    const assemblyAnchor =
      await this.getTenantAccountingAdvancedFormalRecordAssemblyAnchorUseCase.execute(
        input,
      );
    const binders = assemblyAnchor.recordGates.map((gate) =>
      acceptedArtifactBinder(
        `binder_${gate.key}`,
        `${gate.label} binder`,
        gate.status,
        gate.key,
        gate.recordType,
        gate.assemblyState === 'ready_for_binder' ? gate.evidenceRefs : [],
        gate.evidenceRefs,
        gate.status === 'ready' ? [] : [`${gate.key}_binder_pending`],
      ),
    );
    const blockers = [...assemblyAnchor.blockers];
    const binderStatus = resolveStatus(
      binders.map((binder) => binder.status),
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      binderStatus,
      assemblyAnchor,
      binders,
      summary: {
        binderCount: binders.length,
        readyBinderCount: binders.filter((binder) => binder.status === 'ready')
          .length,
        needsReviewBinderCount: binders.filter(
          (binder) => binder.status === 'needs_review',
        ).length,
        blockedBinderCount: binders.filter(
          (binder) => binder.status === 'blocked',
        ).length,
        acceptedArtifactRefCount: binders.flatMap(
          (binder) => binder.acceptedArtifactRefs,
        ).length,
      },
      blockers,
      nextStep: 'Construir indice formal del expediente ensamblado.',
      guardrails: [
        'Accepted Artifact Binder agrupa referencias; no transforma artifacts en oficiales.',
        'Los blockers viajan al indice formal para revision posterior.',
      ],
    };
  }
}

export class GetTenantAccountingAdvancedFormalRecordIndexWorkspaceUseCase {
  constructor(
    private readonly getTenantAccountingAdvancedAcceptedArtifactBinderUseCase: GetTenantAccountingAdvancedAcceptedArtifactBinderUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantAccountingAdvancedFormalRecordIndexWorkspaceView> {
    const artifactBinder =
      await this.getTenantAccountingAdvancedAcceptedArtifactBinderUseCase.execute(
        input,
      );
    const indexSections =
      artifactBinder.binders.flatMap((binder) => [
        formalRecordIndexSection(`draft_${binder.key}`, `${binder.label} approved draft`, binder.status, binder.key, 'approved_draft', binder.evidenceRefs),
        formalRecordIndexSection(`external_${binder.key}`, `${binder.label} external result`, binder.status, binder.key, 'external_result', binder.acceptedArtifactRefs),
        formalRecordIndexSection(`acceptance_${binder.key}`, `${binder.label} internal acceptance`, binder.status, binder.key, 'internal_acceptance', binder.evidenceRefs),
        formalRecordIndexSection(`trace_${binder.key}`, `${binder.label} evidence trace`, binder.status, binder.key, 'evidence_trace', binder.evidenceRefs),
      ]);
    const blockers = [...artifactBinder.blockers];
    const indexStatus = resolveStatus(
      indexSections.map((section) => section.status),
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      indexStatus,
      artifactBinder,
      indexSections,
      summary: {
        sectionCount: indexSections.length,
        readySectionCount: indexSections.filter(
          (section) => section.status === 'ready',
        ).length,
        needsReviewSectionCount: indexSections.filter(
          (section) => section.status === 'needs_review',
        ).length,
        blockedSectionCount: indexSections.filter(
          (section) => section.status === 'blocked',
        ).length,
        binderCount: artifactBinder.summary.binderCount,
      },
      blockers,
      nextStep: 'Revisar consistencia del record formal ensamblado.',
      guardrails: [
        'Formal Record Index organiza secciones; no publica ni archiva oficialmente.',
        'El indice conserva evidencia y blockers para auditoria posterior.',
      ],
    };
  }
}

export class GetTenantAccountingAdvancedRecordConsistencyReviewWorkspaceUseCase {
  constructor(
    private readonly getTenantAccountingAdvancedFormalRecordIndexWorkspaceUseCase: GetTenantAccountingAdvancedFormalRecordIndexWorkspaceUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantAccountingAdvancedRecordConsistencyReviewWorkspaceView> {
    const recordIndex =
      await this.getTenantAccountingAdvancedFormalRecordIndexWorkspaceUseCase.execute(
        input,
      );
    const consistencyChecks =
      recordIndex.artifactBinder.binders.flatMap((binder) => [
        recordConsistencyCheck(`artifact_${binder.key}`, `${binder.label} artifact match`, binder.status, binder.key, 'artifact_match', binder.status === 'ready' ? 'no_resolution_required' : 'return_to_internal_acceptance', binder.blockerRefs),
        recordConsistencyCheck(`actor_${binder.key}`, `${binder.label} actor match`, binder.status, binder.key, 'actor_match', binder.status === 'ready' ? 'no_resolution_required' : 'return_to_external_tracking', binder.blockerRefs),
        recordConsistencyCheck(`evidence_${binder.key}`, `${binder.label} evidence completeness`, binder.status, binder.key, 'evidence_completeness', binder.status === 'ready' ? 'no_resolution_required' : 'return_to_internal_acceptance', binder.blockerRefs),
        recordConsistencyCheck(`decision_${binder.key}`, `${binder.label} decision trace`, binder.status, binder.key, 'decision_trace', binder.status === 'ready' ? 'no_resolution_required' : 'return_to_internal_acceptance', binder.blockerRefs),
        recordConsistencyCheck(`period_${binder.key}`, `${binder.label} period tenant alignment`, binder.status, binder.key, 'period_tenant_alignment', binder.status === 'ready' ? 'no_resolution_required' : 'return_to_external_handoff', binder.blockerRefs),
      ]);
    const blockers = [...recordIndex.blockers];
    const reviewStatus = resolveStatus(
      consistencyChecks.map((checkItem) => checkItem.status),
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      reviewStatus,
      recordIndex,
      consistencyChecks,
      summary: {
        checkCount: consistencyChecks.length,
        readyCheckCount: consistencyChecks.filter(
          (checkItem) => checkItem.status === 'ready',
        ).length,
        needsReviewCheckCount: consistencyChecks.filter(
          (checkItem) => checkItem.status === 'needs_review',
        ).length,
        blockedCheckCount: consistencyChecks.filter(
          (checkItem) => checkItem.status === 'blocked',
        ).length,
        routedCheckCount: consistencyChecks.filter(
          (checkItem) =>
            checkItem.resolutionRoute !== 'no_resolution_required',
        ).length,
      },
      blockers,
      nextStep: 'Consolidar record assembly en command center.',
      guardrails: [
        'Consistency review valida coherencia; no certifica balances.',
        'Cualquier inconsistencia debe volver a la capa de origen.',
      ],
    };
  }
}

export class GetTenantAccountingAdvancedFormalRecordAssemblyCommandCenterUseCase {
  constructor(
    private readonly getTenantAccountingAdvancedRecordConsistencyReviewWorkspaceUseCase: GetTenantAccountingAdvancedRecordConsistencyReviewWorkspaceUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantAccountingAdvancedFormalRecordAssemblyCommandCenterView> {
    const consistencyReview =
      await this.getTenantAccountingAdvancedRecordConsistencyReviewWorkspaceUseCase.execute(
        input,
      );
    const { recordIndex } = consistencyReview;
    const { artifactBinder } = recordIndex;
    const commandLanes: TenantAccountingAdvancedFormalRecordAssemblyCommandCenterView['commandLanes'] =
      [
        formalRecordCommandLane('binders', 'Accepted artifact binders', artifactBinder.binderStatus, 'binders', artifactBinder.summary.binderCount),
        formalRecordCommandLane('index_sections', 'Formal record index', recordIndex.indexStatus, 'sections', recordIndex.summary.sectionCount),
        formalRecordCommandLane('consistency_checks', 'Consistency checks', consistencyReview.reviewStatus, 'checks', consistencyReview.summary.checkCount),
      ];
    const blockers = unique([
      ...artifactBinder.blockers,
      ...recordIndex.blockers,
      ...consistencyReview.blockers,
    ]);
    const commandStatus = resolveStatus(
      commandLanes.map((lane) => lane.status),
      blockers,
    );
    const suggestedDecision = formalRecordAssemblyDecisionFromStatus(
      commandStatus,
      consistencyReview,
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      commandStatus,
      consistencyReview,
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
        assembledRecordCount: artifactBinder.summary.readyBinderCount,
        inconsistentRecordCount: consistencyReview.summary.routedCheckCount,
        readyForCloseoutCount: consistencyReview.summary.readyCheckCount,
      },
      blockers,
      nextStep:
        suggestedDecision === 'ready_for_formal_record_closeout'
          ? 'Preparar 1.6 Formal Record Closeout & Archive Readiness.'
          : suggestedDecision === 'needs_record_consistency_review'
            ? 'Resolver consistencia antes de cerrar record formal.'
            : suggestedDecision === 'return_to_internal_acceptance'
              ? 'Volver a 1.4 para corregir aceptacion interna.'
              : 'Volver a tracking externo si el resultado no sostiene el record.',
      guardrails: [
        'Command center organiza ensamblaje; no archiva oficialmente.',
        'El closeout formal debe ocurrir en una capa posterior.',
      ],
    };
  }
}

export class RequestTenantAccountingAdvancedFormalRecordAssemblyCloseoutUseCase {
  constructor(
    private readonly getTenantAccountingAdvancedFormalRecordAssemblyCommandCenterUseCase: GetTenantAccountingAdvancedFormalRecordAssemblyCommandCenterUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantAccountingAdvancedFormalRecordAssemblyCloseoutView> {
    const commandCenter =
      await this.getTenantAccountingAdvancedFormalRecordAssemblyCommandCenterUseCase.execute(
        input,
      );
    const { consistencyReview } = commandCenter;
    const { recordIndex } = consistencyReview;
    const { artifactBinder } = recordIndex;
    const { assemblyAnchor } = artifactBinder;
    const closeoutChecklist: TenantAccountingAdvancedFormalRecordAssemblyCloseoutView['closeoutChecklist'] =
      [
        formalRecordAssemblyCloseoutCheck('assembly_anchor', 'Formal record assembly anchor', assemblyAnchor.assemblyStatus, ['advanced_formal_record_assembly_anchor']),
        formalRecordAssemblyCloseoutCheck('artifact_binder', 'Accepted artifact binder', artifactBinder.binderStatus, ['advanced_accepted_artifact_binder']),
        formalRecordAssemblyCloseoutCheck('record_index', 'Formal record index workspace', recordIndex.indexStatus, ['advanced_formal_record_index_workspace']),
        formalRecordAssemblyCloseoutCheck('consistency_review', 'Record consistency review workspace', consistencyReview.reviewStatus, ['advanced_record_consistency_review_workspace']),
        formalRecordAssemblyCloseoutCheck('assembly_command_center', 'Formal record assembly command center', commandCenter.commandStatus, ['advanced_formal_record_assembly_command_center']),
      ];
    const blockers = unique([
      ...assemblyAnchor.blockers,
      ...artifactBinder.blockers,
      ...recordIndex.blockers,
      ...consistencyReview.blockers,
      ...commandCenter.blockers,
    ]);
    const closeoutStatus = resolveStatus(
      closeoutChecklist.map((item) => item.status),
      blockers,
    );
    const finalDecision = formalRecordAssemblyDecisionFromStatus(
      closeoutStatus,
      consistencyReview,
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      closeoutStatus,
      assemblyAnchor,
      artifactBinder,
      recordIndex,
      consistencyReview,
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
        recordGateCount: assemblyAnchor.summary.gateCount,
        binderCount: artifactBinder.summary.binderCount,
        indexSectionCount: recordIndex.summary.sectionCount,
        consistencyCheckCount: consistencyReview.summary.checkCount,
      },
      blockers,
      nextStep:
        finalDecision === 'ready_for_formal_record_closeout'
          ? 'Iniciar 1.6 Formal Record Closeout & Archive Readiness.'
          : finalDecision === 'needs_record_consistency_review'
            ? 'Resolver consistencia antes del closeout formal.'
            : finalDecision === 'return_to_internal_acceptance'
              ? 'Volver a 1.4 para corregir aceptacion interna.'
              : finalDecision === 'return_to_external_tracking'
                ? 'Volver a 1.3 para corregir tracking externo.'
                : 'No ensamblar record formal para este periodo.',
      guardrails: [
        'Formal record assembly closeout no emite libros ni estados financieros oficiales.',
        'Archive readiness debe validar cierre antes de cualquier custodia formal.',
      ],
    };
  }
}

export class GetTenantAccountingAdvancedFormalRecordCloseoutAnchorUseCase {
  constructor(
    private readonly requestTenantAccountingAdvancedFormalRecordAssemblyCloseoutUseCase: RequestTenantAccountingAdvancedFormalRecordAssemblyCloseoutUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantAccountingAdvancedFormalRecordCloseoutAnchorView> {
    const assemblyCloseout =
      await this.requestTenantAccountingAdvancedFormalRecordAssemblyCloseoutUseCase.execute(
        input,
      );
    const closeoutGates: TenantAccountingAdvancedFormalRecordCloseoutAnchorView['closeoutGates'] =
      [
        formalRecordCloseoutGate(
          'assembly_package',
          'Formal record assembly package',
          assemblyCloseout.closeoutStatus,
          'assembly_package',
          assemblyCloseout.finalDecision === 'ready_for_formal_record_closeout'
            ? 'ready_for_archive_readiness'
            : 'returned_to_assembly',
          ['advanced_formal_record_assembly_closeout'],
        ),
        formalRecordCloseoutGate(
          'record_index',
          'Formal record index accepted for closeout',
          assemblyCloseout.recordIndex.indexStatus,
          'record_index',
          assemblyCloseout.recordIndex.indexStatus === 'ready'
            ? 'ready_for_archive_readiness'
            : 'needs_review',
          ['advanced_formal_record_index_workspace'],
        ),
        formalRecordCloseoutGate(
          'consistency_review',
          'Record consistency accepted for closeout',
          assemblyCloseout.consistencyReview.reviewStatus,
          'consistency_review',
          assemblyCloseout.consistencyReview.reviewStatus === 'ready'
            ? 'ready_for_archive_readiness'
            : 'needs_review',
          ['advanced_record_consistency_review_workspace'],
        ),
        formalRecordCloseoutGate(
          'command_decision',
          'Formal assembly command decision',
          assemblyCloseout.commandCenter.commandStatus,
          'command_decision',
          assemblyCloseout.finalDecision === 'ready_for_formal_record_closeout'
            ? 'ready_for_archive_readiness'
            : 'returned_to_assembly',
          ['advanced_formal_record_assembly_command_center'],
        ),
      ];
    const blockers =
      assemblyCloseout.finalDecision === 'ready_for_formal_record_closeout'
        ? [...assemblyCloseout.blockers]
        : unique([
            ...assemblyCloseout.blockers,
            `Formal record assembly decision is ${assemblyCloseout.finalDecision}.`,
          ]);
    const anchorStatus = resolveStatus(
      closeoutGates.map((gate) => gate.status),
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      anchorStatus,
      assemblyCloseout,
      closeoutGates,
      summary: {
        gateCount: closeoutGates.length,
        readyGateCount: closeoutGates.filter((gate) => gate.status === 'ready')
          .length,
        needsReviewGateCount: closeoutGates.filter(
          (gate) => gate.status === 'needs_review',
        ).length,
        blockedGateCount: closeoutGates.filter(
          (gate) => gate.status === 'blocked',
        ).length,
        assemblyChecklistCount: assemblyCloseout.summary.checklistCount,
      },
      blockers,
      nextStep:
        anchorStatus === 'blocked'
          ? 'Volver a Formal Record Assembly 1.5 antes del closeout.'
          : 'Preparar archive readiness del record formal.',
      guardrails: [
        'Formal Record Closeout 1.6 valida cierre interno; no archiva oficialmente.',
        'Solo records ensamblados y consistentes pueden avanzar a readiness de archivo.',
      ],
    };
  }
}

export class GetTenantAccountingAdvancedArchiveReadinessWorkspaceUseCase {
  constructor(
    private readonly getTenantAccountingAdvancedFormalRecordCloseoutAnchorUseCase: GetTenantAccountingAdvancedFormalRecordCloseoutAnchorUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantAccountingAdvancedArchiveReadinessWorkspaceView> {
    const closeoutAnchor =
      await this.getTenantAccountingAdvancedFormalRecordCloseoutAnchorUseCase.execute(
        input,
      );
    const archiveFolders: TenantAccountingAdvancedArchiveReadinessWorkspaceView['archiveFolders'] =
      [
        archiveReadinessFolder(
          'formal_record_package',
          'Formal record package folder',
          closeoutAnchor.anchorStatus,
          'formal_record_package',
          closeoutAnchor.anchorStatus === 'ready'
            ? 'retain_for_period_closeout'
            : 'do_not_archive_yet',
          ['advanced_formal_record_closeout_anchor'],
          closeoutAnchor.blockers,
        ),
        archiveReadinessFolder(
          'evidence_chain',
          'Evidence chain folder',
          closeoutAnchor.assemblyCloseout.recordIndex.indexStatus,
          'evidence_chain',
          'retain_for_period_closeout',
          closeoutAnchor.closeoutGates.flatMap((gate) => gate.evidenceRefs),
          [],
        ),
        archiveReadinessFolder(
          'decision_log',
          'Decision log folder',
          closeoutAnchor.assemblyCloseout.commandCenter.commandStatus,
          'decision_log',
          'retain_for_professional_review',
          ['advanced_formal_record_assembly_command_center'],
          [],
        ),
        archiveReadinessFolder(
          'professional_review',
          'Professional review boundary folder',
          closeoutAnchor.anchorStatus,
          'professional_review',
          'retain_for_professional_review',
          ['advanced_professional_closeout_boundary'],
          [],
        ),
      ];
    const blockers = [...closeoutAnchor.blockers];
    const archiveStatus = resolveStatus(
      archiveFolders.map((folder) => folder.status),
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      archiveStatus,
      closeoutAnchor,
      archiveFolders,
      summary: {
        folderCount: archiveFolders.length,
        readyFolderCount: archiveFolders.filter(
          (folder) => folder.status === 'ready',
        ).length,
        needsReviewFolderCount: archiveFolders.filter(
          (folder) => folder.status === 'needs_review',
        ).length,
        blockedFolderCount: archiveFolders.filter(
          (folder) => folder.status === 'blocked',
        ).length,
        retainedEvidenceRefCount: archiveFolders.flatMap(
          (folder) => folder.evidenceRefs,
        ).length,
      },
      blockers,
      nextStep: 'Preparar evidence packets del closeout formal.',
      guardrails: [
        'Archive readiness prepara carpetas; no mueve documentos a custodia oficial.',
        'Cualquier blocker mantiene el record fuera de archivo.',
      ],
    };
  }
}

export class GetTenantAccountingAdvancedFormalCloseoutEvidencePacketUseCase {
  constructor(
    private readonly getTenantAccountingAdvancedArchiveReadinessWorkspaceUseCase: GetTenantAccountingAdvancedArchiveReadinessWorkspaceUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantAccountingAdvancedFormalCloseoutEvidencePacketView> {
    const archiveReadiness =
      await this.getTenantAccountingAdvancedArchiveReadinessWorkspaceUseCase.execute(
        input,
      );
    const evidencePackets =
      archiveReadiness.archiveFolders.map((folder) =>
        formalCloseoutEvidencePacket(
          `packet_${folder.key}`,
          `${folder.label} evidence packet`,
          folder.status,
          folder.key,
          evidencePacketTypeFromArchiveFolder(folder.folderType),
          folder.evidenceRefs,
          folder.status === 'ready' ? [] : folder.blockerRefs,
        ),
      );
    const blockers = [...archiveReadiness.blockers];
    const packetStatus = resolveStatus(
      evidencePackets.map((packet) => packet.status),
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      packetStatus,
      archiveReadiness,
      evidencePackets,
      summary: {
        packetCount: evidencePackets.length,
        readyPacketCount: evidencePackets.filter(
          (packet) => packet.status === 'ready',
        ).length,
        needsReviewPacketCount: evidencePackets.filter(
          (packet) => packet.status === 'needs_review',
        ).length,
        blockedPacketCount: evidencePackets.filter(
          (packet) => packet.status === 'blocked',
        ).length,
        missingRefCount: evidencePackets.flatMap((packet) => packet.missingRefs)
          .length,
      },
      blockers,
      nextStep: 'Validar frontera de atestacion profesional.',
      guardrails: [
        'Evidence packet resume referencias; no crea documentos oficiales nuevos.',
        'La evidencia profesional se conserva como boundary, no como certificacion de plataforma.',
      ],
    };
  }
}

export class GetTenantAccountingAdvancedProfessionalCloseoutAttestationBoundaryUseCase {
  constructor(
    private readonly getTenantAccountingAdvancedFormalCloseoutEvidencePacketUseCase: GetTenantAccountingAdvancedFormalCloseoutEvidencePacketUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantAccountingAdvancedProfessionalCloseoutAttestationBoundaryView> {
    const evidencePacket =
      await this.getTenantAccountingAdvancedFormalCloseoutEvidencePacketUseCase.execute(
        input,
      );
    const attestationItems: TenantAccountingAdvancedProfessionalCloseoutAttestationBoundaryView['attestationItems'] =
      [
        professionalCloseoutAttestationItem(
          'platform_preparation',
          'Platform prepared formal closeout packet',
          evidencePacket.packetStatus,
          'platform',
          'platform_preparation',
          ['advanced_formal_closeout_evidence_packet'],
          'La plataforma prepara y traza; no certifica balances.',
        ),
        professionalCloseoutAttestationItem(
          'operator_review',
          'Operator reviewed archive readiness',
          evidencePacket.archiveReadiness.archiveStatus,
          'operator',
          'operator_review',
          ['advanced_archive_readiness_workspace'],
          'El operador revisa completitud operativa antes de handoff.',
        ),
        professionalCloseoutAttestationItem(
          'external_accountant_review',
          'External accountant review boundary',
          evidencePacket.packetStatus,
          'external_accountant',
          'external_accountant_review',
          ['advanced_professional_closeout_boundary'],
          'El contador externo mantiene criterio profesional independiente.',
        ),
        professionalCloseoutAttestationItem(
          'not_certified_by_platform',
          'Platform non-certification guardrail',
          'ready',
          'platform',
          'not_certified_by_platform',
          ['advanced_accounting_guardrails'],
          'El sistema no emite certificacion profesional ni legal.',
        ),
      ];
    const blockers = [...evidencePacket.blockers];
    const boundaryStatus = resolveStatus(
      attestationItems.map((item) => item.status),
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      boundaryStatus,
      evidencePacket,
      attestationItems,
      summary: {
        itemCount: attestationItems.length,
        readyItemCount: attestationItems.filter(
          (item) => item.status === 'ready',
        ).length,
        professionalOwnedItemCount: attestationItems.filter(
          (item) =>
            item.owner === 'external_accountant' ||
            item.owner === 'legal_representative',
        ).length,
        platformBoundaryItemCount: attestationItems.filter(
          (item) => item.attestationType === 'not_certified_by_platform',
        ).length,
      },
      blockers,
      nextStep: 'Consolidar command center del closeout formal.',
      guardrails: [
        'Professional attestation boundary explicita quien revisa y quien no certifica.',
        'La plataforma no reemplaza contador, auditor ni representante legal.',
      ],
    };
  }
}

export class GetTenantAccountingAdvancedFormalRecordCloseoutCommandCenterUseCase {
  constructor(
    private readonly getTenantAccountingAdvancedProfessionalCloseoutAttestationBoundaryUseCase: GetTenantAccountingAdvancedProfessionalCloseoutAttestationBoundaryUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantAccountingAdvancedFormalRecordCloseoutCommandCenterView> {
    const attestationBoundary =
      await this.getTenantAccountingAdvancedProfessionalCloseoutAttestationBoundaryUseCase.execute(
        input,
      );
    const { evidencePacket } = attestationBoundary;
    const { archiveReadiness } = evidencePacket;
    const { closeoutAnchor } = archiveReadiness;
    const commandLanes: TenantAccountingAdvancedFormalRecordCloseoutCommandCenterView['commandLanes'] =
      [
        formalRecordCloseoutCommandLane(
          'closeout_anchor',
          'Formal record closeout anchor',
          closeoutAnchor.anchorStatus,
          'gates',
          closeoutAnchor.summary.gateCount,
        ),
        formalRecordCloseoutCommandLane(
          'archive_readiness',
          'Archive readiness workspace',
          archiveReadiness.archiveStatus,
          'folders',
          archiveReadiness.summary.folderCount,
        ),
        formalRecordCloseoutCommandLane(
          'evidence_packets',
          'Formal closeout evidence packets',
          evidencePacket.packetStatus,
          'packets',
          evidencePacket.summary.packetCount,
        ),
        formalRecordCloseoutCommandLane(
          'professional_boundary',
          'Professional attestation boundary',
          attestationBoundary.boundaryStatus,
          'items',
          attestationBoundary.summary.itemCount,
        ),
      ];
    const blockers = unique([
      ...closeoutAnchor.blockers,
      ...archiveReadiness.blockers,
      ...evidencePacket.blockers,
      ...attestationBoundary.blockers,
    ]);
    const commandStatus = resolveStatus(
      commandLanes.map((lane) => lane.status),
      blockers,
    );
    const suggestedDecision = formalRecordCloseoutDecisionFromStatus(
      commandStatus,
      attestationBoundary,
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      commandStatus,
      attestationBoundary,
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
        archiveReadyCount: archiveReadiness.summary.readyFolderCount,
        professionalBoundaryCount:
          attestationBoundary.summary.professionalOwnedItemCount,
      },
      blockers,
      nextStep:
        suggestedDecision === 'ready_for_archive_handoff'
          ? 'Preparar handoff de archivo o decidir graduacion del producto.'
          : suggestedDecision === 'needs_professional_attestation'
            ? 'Completar revision profesional antes de archive handoff.'
            : suggestedDecision === 'needs_archive_readiness_review'
              ? 'Resolver readiness de archivo antes del closeout.'
              : 'Volver a Formal Record Assembly 1.5.',
      guardrails: [
        'Command center decide readiness; no archiva ni certifica formalmente.',
        'Archive handoff posterior debe conservar frontera profesional.',
      ],
    };
  }
}

export class RequestTenantAccountingAdvancedFormalRecordCloseoutCloseoutUseCase {
  constructor(
    private readonly getTenantAccountingAdvancedFormalRecordCloseoutCommandCenterUseCase: GetTenantAccountingAdvancedFormalRecordCloseoutCommandCenterUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantAccountingAdvancedFormalRecordCloseoutCloseoutView> {
    const commandCenter =
      await this.getTenantAccountingAdvancedFormalRecordCloseoutCommandCenterUseCase.execute(
        input,
      );
    const { attestationBoundary } = commandCenter;
    const { evidencePacket } = attestationBoundary;
    const { archiveReadiness } = evidencePacket;
    const { closeoutAnchor } = archiveReadiness;
    const closeoutChecklist: TenantAccountingAdvancedFormalRecordCloseoutCloseoutView['closeoutChecklist'] =
      [
        formalRecordCloseoutCheck(
          'closeout_anchor',
          'Formal record closeout anchor',
          closeoutAnchor.anchorStatus,
          ['advanced_formal_record_closeout_anchor'],
        ),
        formalRecordCloseoutCheck(
          'archive_readiness',
          'Archive readiness workspace',
          archiveReadiness.archiveStatus,
          ['advanced_archive_readiness_workspace'],
        ),
        formalRecordCloseoutCheck(
          'evidence_packet',
          'Formal closeout evidence packet',
          evidencePacket.packetStatus,
          ['advanced_formal_closeout_evidence_packet'],
        ),
        formalRecordCloseoutCheck(
          'professional_boundary',
          'Professional closeout attestation boundary',
          attestationBoundary.boundaryStatus,
          ['advanced_professional_closeout_boundary'],
        ),
        formalRecordCloseoutCheck(
          'command_center',
          'Formal record closeout command center',
          commandCenter.commandStatus,
          ['advanced_formal_record_closeout_command_center'],
        ),
      ];
    const blockers = unique([
      ...closeoutAnchor.blockers,
      ...archiveReadiness.blockers,
      ...evidencePacket.blockers,
      ...attestationBoundary.blockers,
      ...commandCenter.blockers,
    ]);
    const closeoutStatus = resolveStatus(
      closeoutChecklist.map((item) => item.status),
      blockers,
    );
    const finalDecision = formalRecordCloseoutDecisionFromStatus(
      closeoutStatus,
      attestationBoundary,
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      closeoutStatus,
      closeoutAnchor,
      archiveReadiness,
      evidencePacket,
      attestationBoundary,
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
        archiveFolderCount: archiveReadiness.summary.folderCount,
        evidencePacketCount: evidencePacket.summary.packetCount,
        attestationItemCount: attestationBoundary.summary.itemCount,
      },
      blockers,
      nextStep:
        finalDecision === 'ready_for_archive_handoff'
          ? 'Evaluar archive handoff y graduation check posterior.'
          : finalDecision === 'needs_professional_attestation'
            ? 'Completar atestacion profesional externa antes del handoff.'
            : finalDecision === 'needs_archive_readiness_review'
              ? 'Resolver readiness de archivo antes de cerrar.'
              : finalDecision === 'return_to_formal_record_assembly'
                ? 'Volver a 1.5 para corregir expediente formal.'
                : 'No cerrar record formal para este periodo.',
      guardrails: [
        'Formal record closeout 1.6 cierra internamente; no archiva oficialmente.',
        'La plataforma no emite libros, estados financieros ni certificaciones profesionales.',
      ],
    };
  }
}

export class GetTenantAccountingAdvancedGraduationArchiveHandoffAnchorUseCase {
  constructor(
    private readonly requestTenantAccountingAdvancedFormalRecordCloseoutCloseoutUseCase: RequestTenantAccountingAdvancedFormalRecordCloseoutCloseoutUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantAccountingAdvancedGraduationArchiveHandoffAnchorView> {
    const formalRecordCloseout =
      await this.requestTenantAccountingAdvancedFormalRecordCloseoutCloseoutUseCase.execute(
        input,
      );
    const handoffGates: TenantAccountingAdvancedGraduationArchiveHandoffAnchorView['handoffGates'] =
      [
        graduationArchiveHandoffGate(
          'formal_closeout',
          'Formal record closeout accepted',
          formalRecordCloseout.closeoutStatus,
          'formal_closeout',
          formalRecordCloseout.finalDecision === 'ready_for_archive_handoff'
            ? 'ready_for_archive_handoff'
            : 'returned_to_closeout',
          ['advanced_formal_record_closeout_closeout'],
        ),
        graduationArchiveHandoffGate(
          'archive_readiness',
          'Archive readiness accepted',
          formalRecordCloseout.archiveReadiness.archiveStatus,
          'archive_readiness',
          formalRecordCloseout.archiveReadiness.archiveStatus === 'ready'
            ? 'ready_for_archive_handoff'
            : 'needs_hardening',
          ['advanced_archive_readiness_workspace'],
        ),
        graduationArchiveHandoffGate(
          'evidence_packet',
          'Evidence packet accepted',
          formalRecordCloseout.evidencePacket.packetStatus,
          'evidence_packet',
          formalRecordCloseout.evidencePacket.packetStatus === 'ready'
            ? 'ready_for_archive_handoff'
            : 'needs_hardening',
          ['advanced_formal_closeout_evidence_packet'],
        ),
        graduationArchiveHandoffGate(
          'professional_boundary',
          'Professional boundary preserved',
          formalRecordCloseout.attestationBoundary.boundaryStatus,
          'professional_boundary',
          formalRecordCloseout.attestationBoundary.boundaryStatus === 'ready'
            ? 'ready_for_graduation_assessment'
            : 'needs_hardening',
          ['advanced_professional_closeout_boundary'],
        ),
      ];
    const blockers =
      formalRecordCloseout.finalDecision === 'ready_for_archive_handoff'
        ? [...formalRecordCloseout.blockers]
        : unique([
            ...formalRecordCloseout.blockers,
            `Formal record closeout decision is ${formalRecordCloseout.finalDecision}.`,
          ]);
    const anchorStatus = resolveStatus(
      handoffGates.map((gate) => gate.status),
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      anchorStatus,
      formalRecordCloseout,
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
        formalCloseoutChecklistCount:
          formalRecordCloseout.summary.checklistCount,
      },
      blockers,
      nextStep:
        anchorStatus === 'blocked'
          ? 'Volver a Formal Record Closeout 1.6 antes del handoff.'
          : 'Preparar paquete de archive handoff y graduation check.',
      guardrails: [
        'Graduation/archive handoff check decide siguiente producto; no archiva ni abre full Accounting automaticamente.',
        'La frontera profesional de 1.6 sigue siendo obligatoria.',
      ],
    };
  }
}

export class GetTenantAccountingAdvancedArchiveHandoffPackageUseCase {
  constructor(
    private readonly getTenantAccountingAdvancedGraduationArchiveHandoffAnchorUseCase: GetTenantAccountingAdvancedGraduationArchiveHandoffAnchorUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantAccountingAdvancedArchiveHandoffPackageView> {
    const handoffAnchor =
      await this.getTenantAccountingAdvancedGraduationArchiveHandoffAnchorUseCase.execute(
        input,
      );
    const handoffItems: TenantAccountingAdvancedArchiveHandoffPackageView['handoffItems'] =
      [
        archiveHandoffItem(
          'archive_manifest',
          'Archive manifest',
          handoffAnchor.anchorStatus,
          'archive_manifest',
          handoffAnchor.anchorStatus === 'ready'
            ? 'external_handoff_ready'
            : 'hold_for_hardening',
          ['advanced_graduation_archive_handoff_anchor'],
          handoffAnchor.blockers,
        ),
        archiveHandoffItem(
          'evidence_bundle',
          'Closeout evidence bundle',
          handoffAnchor.formalRecordCloseout.evidencePacket.packetStatus,
          'evidence_bundle',
          'external_handoff_ready',
          ['advanced_formal_closeout_evidence_packet'],
          [],
        ),
        archiveHandoffItem(
          'professional_boundary',
          'Professional boundary note',
          handoffAnchor.formalRecordCloseout.attestationBoundary.boundaryStatus,
          'professional_boundary',
          'needs_professional_review',
          ['advanced_professional_closeout_boundary'],
          [],
        ),
        archiveHandoffItem(
          'operator_decision',
          'Operator graduation decision record',
          handoffAnchor.anchorStatus,
          'operator_decision',
          'internal_ready',
          ['advanced_formal_record_closeout_command_center'],
          [],
        ),
      ];
    const blockers = [...handoffAnchor.blockers];
    const packageStatus = resolveStatus(
      handoffItems.map((item) => item.status),
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      packageStatus,
      handoffAnchor,
      handoffItems,
      summary: {
        itemCount: handoffItems.length,
        readyItemCount: handoffItems.filter((item) => item.status === 'ready')
          .length,
        needsReviewItemCount: handoffItems.filter(
          (item) => item.status === 'needs_review',
        ).length,
        blockedItemCount: handoffItems.filter(
          (item) => item.status === 'blocked',
        ).length,
        externalReadyItemCount: handoffItems.filter(
          (item) => item.custodyMode === 'external_handoff_ready',
        ).length,
      },
      blockers,
      nextStep: 'Evaluar senales de graduacion a full Accounting.',
      guardrails: [
        'Archive handoff package prepara custodia; no ejecuta archivo oficial.',
        'La decision de full Accounting se evalua por senales, no por una sola carpeta lista.',
      ],
    };
  }
}

export class GetTenantAccountingAdvancedGraduationSignalMatrixUseCase {
  constructor(
    private readonly getTenantAccountingAdvancedArchiveHandoffPackageUseCase: GetTenantAccountingAdvancedArchiveHandoffPackageUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantAccountingAdvancedGraduationSignalMatrixView> {
    const archiveHandoffPackage =
      await this.getTenantAccountingAdvancedArchiveHandoffPackageUseCase.execute(
        input,
      );
    const { formalRecordCloseout } = archiveHandoffPackage.handoffAnchor;
    const graduationSignals: TenantAccountingAdvancedGraduationSignalMatrixView['graduationSignals'] =
      [
        graduationSignal(
          'ledger_need',
          'Formal ledger need',
          formalRecordCloseout.closeoutStatus,
          'ledger_need',
          'candidate_for_full_accounting',
          ['advanced_formal_record_closeout_closeout'],
        ),
        graduationSignal(
          'bank_reconciliation_need',
          'Certified bank reconciliation need',
          formalRecordCloseout.archiveReadiness.archiveStatus,
          'bank_reconciliation_need',
          'candidate_for_full_accounting',
          ['advanced_archive_readiness_workspace'],
        ),
        graduationSignal(
          'formal_books_need',
          'Formal books need',
          formalRecordCloseout.commandCenter.commandStatus,
          'formal_books_need',
          'candidate_for_full_accounting',
          ['advanced_formal_record_closeout_command_center'],
        ),
        graduationSignal(
          'archive_only_need',
          'Archive handoff can stand alone',
          archiveHandoffPackage.packageStatus,
          'tenant_operating_need',
          'handoff_archive_only',
          ['advanced_archive_handoff_package'],
        ),
      ];
    const blockers = [...archiveHandoffPackage.blockers];
    const matrixStatus = resolveStatus(
      graduationSignals.map((signal) => signal.status),
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      matrixStatus,
      archiveHandoffPackage,
      graduationSignals,
      summary: {
        signalCount: graduationSignals.length,
        readySignalCount: graduationSignals.filter(
          (signal) => signal.status === 'ready',
        ).length,
        candidateSignalCount: graduationSignals.filter(
          (signal) =>
            signal.recommendation === 'candidate_for_full_accounting',
        ).length,
        hardeningSignalCount: graduationSignals.filter(
          (signal) => signal.recommendation === 'keep_in_accounting_advanced',
        ).length,
        archiveOnlySignalCount: graduationSignals.filter(
          (signal) => signal.recommendation === 'handoff_archive_only',
        ).length,
      },
      blockers,
      nextStep: 'Convertir senales en decision de scope de producto.',
      guardrails: [
        'Graduation signal matrix no abre full Accounting; solo documenta presion real.',
        'Archive-only sigue siendo una salida valida si no hay suficiente senal contable.',
      ],
    };
  }
}

export class GetTenantAccountingAdvancedProductScopeDecisionWorkspaceUseCase {
  constructor(
    private readonly getTenantAccountingAdvancedGraduationSignalMatrixUseCase: GetTenantAccountingAdvancedGraduationSignalMatrixUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantAccountingAdvancedProductScopeDecisionWorkspaceView> {
    const graduationSignalMatrix =
      await this.getTenantAccountingAdvancedGraduationSignalMatrixUseCase.execute(
        input,
      );
    const scopeDecisions: TenantAccountingAdvancedProductScopeDecisionWorkspaceView['scopeDecisions'] =
      [
        productScopeDecision(
          'full_accounting_candidate',
          'Open full Accounting candidate',
          graduationSignalMatrix.matrixStatus,
          'full_accounting',
          graduationSignalMatrix.summary.candidateSignalCount >= 3
            ? 'open_full_accounting_candidate'
            : 'continue_advanced_hardening',
          ['advanced_graduation_signal_matrix'],
        ),
        productScopeDecision(
          'archive_handoff_only',
          'Archive handoff only path',
          graduationSignalMatrix.archiveHandoffPackage.packageStatus,
          'archive_handoff',
          'handoff_archive_only',
          ['advanced_archive_handoff_package'],
        ),
        productScopeDecision(
          'advanced_hardening',
          'Continue Accounting Advanced hardening',
          graduationSignalMatrix.matrixStatus,
          'advanced_hardening',
          graduationSignalMatrix.summary.candidateSignalCount >= 3
            ? 'open_full_accounting_candidate'
            : 'continue_advanced_hardening',
          ['advanced_formal_record_closeout_closeout'],
        ),
        productScopeDecision(
          'professional_boundary',
          'Keep professional services boundary',
          'ready',
          'professional_services_boundary',
          'keep_professional_boundary',
          ['advanced_professional_closeout_boundary'],
        ),
      ];
    const blockers = [...graduationSignalMatrix.blockers];
    const decisionStatus = resolveStatus(
      scopeDecisions.map((decision) => decision.status),
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      decisionStatus,
      graduationSignalMatrix,
      scopeDecisions,
      summary: {
        decisionCount: scopeDecisions.length,
        readyDecisionCount: scopeDecisions.filter(
          (decision) => decision.status === 'ready',
        ).length,
        fullAccountingCandidateCount: scopeDecisions.filter(
          (decision) =>
            decision.decision === 'open_full_accounting_candidate',
        ).length,
        archiveOnlyDecisionCount: scopeDecisions.filter(
          (decision) => decision.decision === 'handoff_archive_only',
        ).length,
        hardeningDecisionCount: scopeDecisions.filter(
          (decision) => decision.decision === 'continue_advanced_hardening',
        ).length,
      },
      blockers,
      nextStep: 'Consolidar command center de graduation/archive handoff.',
      guardrails: [
        'Product scope decision propone camino; no crea un nuevo producto por si sola.',
        'Full Accounting requiere decision posterior y alcance propio.',
      ],
    };
  }
}

export class GetTenantAccountingAdvancedGraduationArchiveHandoffCommandCenterUseCase {
  constructor(
    private readonly getTenantAccountingAdvancedProductScopeDecisionWorkspaceUseCase: GetTenantAccountingAdvancedProductScopeDecisionWorkspaceUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantAccountingAdvancedGraduationArchiveHandoffCommandCenterView> {
    const productScopeDecision =
      await this.getTenantAccountingAdvancedProductScopeDecisionWorkspaceUseCase.execute(
        input,
      );
    const { graduationSignalMatrix } = productScopeDecision;
    const { archiveHandoffPackage } = graduationSignalMatrix;
    const { handoffAnchor } = archiveHandoffPackage;
    const commandLanes: TenantAccountingAdvancedGraduationArchiveHandoffCommandCenterView['commandLanes'] =
      [
        graduationArchiveHandoffCommandLane(
          'handoff_anchor',
          'Graduation archive handoff anchor',
          handoffAnchor.anchorStatus,
          'gates',
          handoffAnchor.summary.gateCount,
        ),
        graduationArchiveHandoffCommandLane(
          'archive_handoff_package',
          'Archive handoff package',
          archiveHandoffPackage.packageStatus,
          'items',
          archiveHandoffPackage.summary.itemCount,
        ),
        graduationArchiveHandoffCommandLane(
          'graduation_signals',
          'Graduation signal matrix',
          graduationSignalMatrix.matrixStatus,
          'signals',
          graduationSignalMatrix.summary.signalCount,
        ),
        graduationArchiveHandoffCommandLane(
          'scope_decisions',
          'Product scope decisions',
          productScopeDecision.decisionStatus,
          'decisions',
          productScopeDecision.summary.decisionCount,
        ),
      ];
    const blockers = unique([
      ...handoffAnchor.blockers,
      ...archiveHandoffPackage.blockers,
      ...graduationSignalMatrix.blockers,
      ...productScopeDecision.blockers,
    ]);
    const commandStatus = resolveStatus(
      commandLanes.map((lane) => lane.status),
      blockers,
    );
    const suggestedDecision = graduationArchiveHandoffDecisionFromStatus(
      commandStatus,
      productScopeDecision,
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      commandStatus,
      productScopeDecision,
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
        fullAccountingCandidateCount:
          productScopeDecision.summary.fullAccountingCandidateCount,
        archiveHandoffReadyCount:
          archiveHandoffPackage.summary.externalReadyItemCount,
      },
      blockers,
      nextStep:
        suggestedDecision === 'graduate_to_full_accounting_candidate'
          ? 'Preparar roadmap de full Accounting como producto candidato.'
          : suggestedDecision === 'ready_for_archive_handoff_only'
            ? 'Cerrar Accounting Advanced con archive handoff como salida.'
            : suggestedDecision === 'continue_accounting_advanced_hardening'
              ? 'Continuar hardening de Accounting Advanced antes de graduar.'
              : 'Volver a Formal Record Closeout 1.6.',
      guardrails: [
        'Command center decide camino de roadmap; no crea full Accounting automaticamente.',
        'Archive handoff y graduacion son salidas separadas.',
      ],
    };
  }
}

export class RequestTenantAccountingAdvancedGraduationArchiveHandoffCloseoutUseCase {
  constructor(
    private readonly getTenantAccountingAdvancedGraduationArchiveHandoffCommandCenterUseCase: GetTenantAccountingAdvancedGraduationArchiveHandoffCommandCenterUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantAccountingAdvancedGraduationArchiveHandoffCloseoutView> {
    const commandCenter =
      await this.getTenantAccountingAdvancedGraduationArchiveHandoffCommandCenterUseCase.execute(
        input,
      );
    const { productScopeDecision } = commandCenter;
    const { graduationSignalMatrix } = productScopeDecision;
    const { archiveHandoffPackage } = graduationSignalMatrix;
    const { handoffAnchor } = archiveHandoffPackage;
    const closeoutChecklist: TenantAccountingAdvancedGraduationArchiveHandoffCloseoutView['closeoutChecklist'] =
      [
        graduationArchiveHandoffCloseoutCheck(
          'handoff_anchor',
          'Graduation archive handoff anchor',
          handoffAnchor.anchorStatus,
          ['advanced_graduation_archive_handoff_anchor'],
        ),
        graduationArchiveHandoffCloseoutCheck(
          'archive_handoff_package',
          'Archive handoff package',
          archiveHandoffPackage.packageStatus,
          ['advanced_archive_handoff_package'],
        ),
        graduationArchiveHandoffCloseoutCheck(
          'graduation_signal_matrix',
          'Graduation signal matrix',
          graduationSignalMatrix.matrixStatus,
          ['advanced_graduation_signal_matrix'],
        ),
        graduationArchiveHandoffCloseoutCheck(
          'product_scope_decision',
          'Product scope decision workspace',
          productScopeDecision.decisionStatus,
          ['advanced_product_scope_decision_workspace'],
        ),
        graduationArchiveHandoffCloseoutCheck(
          'command_center',
          'Graduation archive handoff command center',
          commandCenter.commandStatus,
          ['advanced_graduation_archive_handoff_command_center'],
        ),
      ];
    const blockers = unique([
      ...handoffAnchor.blockers,
      ...archiveHandoffPackage.blockers,
      ...graduationSignalMatrix.blockers,
      ...productScopeDecision.blockers,
      ...commandCenter.blockers,
    ]);
    const closeoutStatus = resolveStatus(
      closeoutChecklist.map((item) => item.status),
      blockers,
    );
    const finalDecision = graduationArchiveHandoffDecisionFromStatus(
      closeoutStatus,
      productScopeDecision,
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      closeoutStatus,
      handoffAnchor,
      archiveHandoffPackage,
      graduationSignalMatrix,
      productScopeDecision,
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
        handoffItemCount: archiveHandoffPackage.summary.itemCount,
        graduationSignalCount: graduationSignalMatrix.summary.signalCount,
        scopeDecisionCount: productScopeDecision.summary.decisionCount,
      },
      blockers,
      nextStep:
        finalDecision === 'graduate_to_full_accounting_candidate'
          ? 'Definir primer roadmap de full Accounting candidato.'
          : finalDecision === 'ready_for_archive_handoff_only'
            ? 'Ejecutar salida de archive handoff sin abrir full Accounting.'
            : finalDecision === 'continue_accounting_advanced_hardening'
              ? 'Planificar siguiente hardening de Accounting Advanced.'
              : finalDecision === 'return_to_formal_record_closeout'
                ? 'Volver a 1.6 para cerrar readiness faltante.'
                : 'No graduar ni handoff para este periodo.',
      guardrails: [
        'Graduation/archive handoff closeout es decision de roadmap, no operacion legal.',
        'Full Accounting debe abrirse como producto candidato separado con alcance propio.',
      ],
    };
  }
}

export class GetTenantFullAccountingCandidateAnchorUseCase {
  constructor(
    private readonly requestTenantAccountingAdvancedGraduationArchiveHandoffCloseoutUseCase: RequestTenantAccountingAdvancedGraduationArchiveHandoffCloseoutUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantFullAccountingCandidateAnchorView> {
    const graduationCloseout =
      await this.requestTenantAccountingAdvancedGraduationArchiveHandoffCloseoutUseCase.execute(
        input,
      );
    const candidateSignals: TenantFullAccountingCandidateAnchorView['candidateSignals'] =
      [
        fullAccountingCandidateSignal(
          'ledger',
          'Core ledger candidate signal',
          graduationCloseout.closeoutStatus,
          'ledger',
          graduationCloseout.finalDecision ===
            'graduate_to_full_accounting_candidate'
            ? 'candidate_ready'
            : 'needs_discovery',
          ['advanced_graduation_archive_handoff_closeout'],
        ),
        fullAccountingCandidateSignal(
          'bank_reconciliation',
          'Bank reconciliation candidate signal',
          graduationCloseout.graduationSignalMatrix.matrixStatus,
          'bank_reconciliation',
          'candidate_ready',
          ['advanced_graduation_signal_matrix'],
        ),
        fullAccountingCandidateSignal(
          'financial_statements',
          'Financial statements candidate signal',
          graduationCloseout.productScopeDecision.decisionStatus,
          'financial_statements',
          'candidate_ready',
          ['advanced_product_scope_decision_workspace'],
        ),
        fullAccountingCandidateSignal(
          'legal_books',
          'Legal books statutory boundary signal',
          'ready',
          'legal_books',
          'needs_discovery',
          ['advanced_professional_closeout_boundary'],
        ),
        fullAccountingCandidateSignal(
          'professional_operations',
          'Professional operations signal',
          graduationCloseout.commandCenter.commandStatus,
          'professional_operations',
          'candidate_ready',
          ['advanced_graduation_archive_handoff_command_center'],
        ),
      ];
    const blockers =
      graduationCloseout.finalDecision === 'graduate_to_full_accounting_candidate'
        ? [...graduationCloseout.blockers]
        : unique([
            ...graduationCloseout.blockers,
            `Graduation decision is ${graduationCloseout.finalDecision}.`,
          ]);
    const anchorStatus = resolveStatus(
      candidateSignals.map((signal) => signal.status),
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      anchorStatus,
      graduationCloseout,
      candidateSignals,
      summary: {
        signalCount: candidateSignals.length,
        readySignalCount: candidateSignals.filter(
          (signal) => signal.status === 'ready',
        ).length,
        needsDiscoverySignalCount: candidateSignals.filter(
          (signal) => signal.candidateState === 'needs_discovery',
        ).length,
        blockedSignalCount: candidateSignals.filter(
          (signal) => signal.status === 'blocked',
        ).length,
        graduationCandidateCount:
          graduationCloseout.productScopeDecision.summary
            .fullAccountingCandidateCount,
      },
      blockers,
      nextStep:
        anchorStatus === 'blocked'
          ? 'Volver al graduation/archive handoff check antes de abrir candidato.'
          : 'Definir core ledger scope blueprint.',
      guardrails: [
        'Full Accounting Candidate 0.1 evalua producto; no implementa ledger real.',
        'La decision de abrir full Accounting MVP queda para el closeout del candidato.',
      ],
    };
  }
}

export class GetTenantFullAccountingCoreLedgerScopeBlueprintUseCase {
  constructor(
    private readonly getTenantFullAccountingCandidateAnchorUseCase: GetTenantFullAccountingCandidateAnchorUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantFullAccountingCoreLedgerScopeBlueprintView> {
    const candidateAnchor =
      await this.getTenantFullAccountingCandidateAnchorUseCase.execute(input);
    const ledgerScopeItems: TenantFullAccountingCoreLedgerScopeBlueprintView['ledgerScopeItems'] =
      [
        fullAccountingLedgerScopeItem('chart_of_accounts', 'Chart of accounts scope', candidateAnchor.anchorStatus, 'chart_of_accounts', 'candidate_scope_only', ['accounting_chart_workspace']),
        fullAccountingLedgerScopeItem('journal_entries', 'Journal entries scope', candidateAnchor.anchorStatus, 'journal_entries', 'requires_persistence_design', ['accounting_journal_registry']),
        fullAccountingLedgerScopeItem('posting_rules', 'Posting rules scope', candidateAnchor.anchorStatus, 'posting_rules', 'requires_professional_policy', ['advanced_product_scope_decision_workspace']),
        fullAccountingLedgerScopeItem('period_locks', 'Period locks scope', candidateAnchor.anchorStatus, 'period_locks', 'requires_persistence_design', ['accounting_period_lock_readiness']),
        fullAccountingLedgerScopeItem('opening_balances', 'Opening balances scope', candidateAnchor.anchorStatus, 'opening_balances', 'candidate_scope_only', ['accounting_opening_balance_workspace']),
        fullAccountingLedgerScopeItem('adjustments', 'Adjustment entries scope', candidateAnchor.anchorStatus, 'adjustments', 'requires_professional_policy', ['advanced_formal_artifact_drafting_closeout']),
      ];
    const blockers = [...candidateAnchor.blockers];
    const blueprintStatus = resolveStatus(
      ledgerScopeItems.map((item) => item.status),
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      blueprintStatus,
      candidateAnchor,
      ledgerScopeItems,
      summary: {
        itemCount: ledgerScopeItems.length,
        readyItemCount: ledgerScopeItems.filter(
          (item) => item.status === 'ready',
        ).length,
        persistenceDesignCount: ledgerScopeItems.filter(
          (item) => item.implementationMode === 'requires_persistence_design',
        ).length,
        professionalPolicyCount: ledgerScopeItems.filter(
          (item) => item.implementationMode === 'requires_professional_policy',
        ).length,
      },
      blockers,
      nextStep: 'Definir boundary de bank reconciliation formal.',
      guardrails: [
        'Core ledger scope blueprint no postea asientos ni modifica libros.',
        'Posting rules requieren politica profesional antes de implementacion.',
      ],
    };
  }
}

export class GetTenantFullAccountingBankReconciliationBoundaryUseCase {
  constructor(
    private readonly getTenantFullAccountingCoreLedgerScopeBlueprintUseCase: GetTenantFullAccountingCoreLedgerScopeBlueprintUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantFullAccountingBankReconciliationBoundaryView> {
    const ledgerScopeBlueprint =
      await this.getTenantFullAccountingCoreLedgerScopeBlueprintUseCase.execute(
        input,
      );
    const bankBoundaryItems: TenantFullAccountingBankReconciliationBoundaryView['bankBoundaryItems'] =
      [
        fullAccountingBankBoundaryItem('bank_statement_import', 'Bank statement import boundary', ledgerScopeBlueprint.blueprintStatus, 'bank_statement_import', 'platform_candidate', ['accounting_bank_statement_import_workspace']),
        fullAccountingBankBoundaryItem('matching_rules', 'Matching rules boundary', ledgerScopeBlueprint.blueprintStatus, 'matching_rules', 'platform_candidate', ['accounting_bank_reconciliation_workspace']),
        fullAccountingBankBoundaryItem('exception_resolution', 'Bank exception resolution boundary', ledgerScopeBlueprint.blueprintStatus, 'exception_resolution', 'operator_review', ['accounting_corrections_queue']),
        fullAccountingBankBoundaryItem('cash_closeout', 'Cash closeout boundary', ledgerScopeBlueprint.blueprintStatus, 'cash_closeout', 'operator_review', ['accounting_period_cash_closeout_readiness']),
        fullAccountingBankBoundaryItem('certification_boundary', 'Bank certification boundary', 'ready', 'certification_boundary', 'external_accountant', ['accounting_certified_bank_evidence_boundary']),
      ];
    const blockers = [...ledgerScopeBlueprint.blockers];
    const boundaryStatus = resolveStatus(
      bankBoundaryItems.map((item) => item.status),
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      boundaryStatus,
      ledgerScopeBlueprint,
      bankBoundaryItems,
      summary: {
        itemCount: bankBoundaryItems.length,
        readyItemCount: bankBoundaryItems.filter(
          (item) => item.status === 'ready',
        ).length,
        accountantOwnedItemCount: bankBoundaryItems.filter(
          (item) => item.ownership === 'external_accountant',
        ).length,
        notImplementedItemCount: bankBoundaryItems.filter(
          (item) => item.ownership === 'not_implemented_yet',
        ).length,
      },
      blockers,
      nextStep: 'Definir blueprint de financial statements.',
      guardrails: [
        'Bank reconciliation boundary no certifica bancos ni saldos.',
        'La certificacion bancaria queda en frontera profesional externa.',
      ],
    };
  }
}

export class GetTenantFullAccountingFinancialStatementsBlueprintUseCase {
  constructor(
    private readonly getTenantFullAccountingBankReconciliationBoundaryUseCase: GetTenantFullAccountingBankReconciliationBoundaryUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantFullAccountingFinancialStatementsBlueprintView> {
    const bankReconciliationBoundary =
      await this.getTenantFullAccountingBankReconciliationBoundaryUseCase.execute(
        input,
      );
    const statementItems: TenantFullAccountingFinancialStatementsBlueprintView['statementItems'] =
      [
        fullAccountingStatementItem('trial_balance', 'Trial balance blueprint', bankReconciliationBoundary.boundaryStatus, 'trial_balance', 'blueprint_ready', ['accounting_trial_balance_workspace']),
        fullAccountingStatementItem('balance_sheet', 'Balance sheet blueprint', bankReconciliationBoundary.boundaryStatus, 'balance_sheet', 'needs_ledger', ['accounting_financial_statement_preview']),
        fullAccountingStatementItem('income_statement', 'Income statement blueprint', bankReconciliationBoundary.boundaryStatus, 'income_statement', 'needs_ledger', ['accounting_financial_statement_preview']),
        fullAccountingStatementItem('comparatives', 'Comparative statements blueprint', bankReconciliationBoundary.boundaryStatus, 'comparatives', 'needs_ledger', ['advanced_multi_period_financial_statement_workspace']),
        fullAccountingStatementItem('adjustment_disclosures', 'Adjustment disclosures blueprint', bankReconciliationBoundary.boundaryStatus, 'adjustment_disclosures', 'needs_professional_review', ['advanced_adjustment_draft_pack']),
        fullAccountingStatementItem('professional_review', 'Financial statement professional review boundary', 'ready', 'professional_review', 'needs_professional_review', ['accounting_financial_statement_final_review_packet']),
      ];
    const blockers = [...bankReconciliationBoundary.blockers];
    const blueprintStatus = resolveStatus(
      statementItems.map((item) => item.status),
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      blueprintStatus,
      bankReconciliationBoundary,
      statementItems,
      summary: {
        itemCount: statementItems.length,
        readyItemCount: statementItems.filter(
          (item) => item.status === 'ready',
        ).length,
        ledgerDependentItemCount: statementItems.filter(
          (item) => item.readiness === 'needs_ledger',
        ).length,
        professionalReviewItemCount: statementItems.filter(
          (item) => item.readiness === 'needs_professional_review',
        ).length,
      },
      blockers,
      nextStep: 'Definir legal books and statutory boundary blueprint.',
      guardrails: [
        'Financial statements blueprint no emite estados financieros oficiales.',
        'Todo estado final requiere revision profesional externa.',
      ],
    };
  }
}

export class GetTenantFullAccountingLegalBooksStatutoryBoundaryUseCase {
  constructor(
    private readonly getTenantFullAccountingFinancialStatementsBlueprintUseCase: GetTenantFullAccountingFinancialStatementsBlueprintUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantFullAccountingLegalBooksStatutoryBoundaryView> {
    const financialStatementsBlueprint =
      await this.getTenantFullAccountingFinancialStatementsBlueprintUseCase.execute(
        input,
      );
    const statutoryBoundaryItems: TenantFullAccountingLegalBooksStatutoryBoundaryView['statutoryBoundaryItems'] =
      [
        fullAccountingStatutoryBoundaryItem('legal_books', 'Legal books boundary', financialStatementsBlueprint.blueprintStatus, 'legal_books', 'external_accountant', ['accounting_legal_books_readiness_packet'], 'Libros oficiales requieren responsabilidad profesional.'),
        fullAccountingStatutoryBoundaryItem('statutory_custody', 'Statutory custody boundary', financialStatementsBlueprint.blueprintStatus, 'statutory_custody', 'operator', ['advanced_archive_handoff_package'], 'Custodia estatutaria no se ejecuta automaticamente.'),
        fullAccountingStatutoryBoundaryItem('legalization', 'Legalization boundary', 'ready', 'legalization', 'legal_representative', ['advanced_legalization_boundary_packet'], 'Legalizacion ocurre fuera de la plataforma.'),
        fullAccountingStatutoryBoundaryItem('professional_signature', 'Professional signature boundary', 'ready', 'professional_signature', 'external_accountant', ['advanced_formal_signatory_registry'], 'Firma profesional requiere acto externo verificable.'),
        fullAccountingStatutoryBoundaryItem('platform_non_certification', 'Platform non-certification guardrail', 'ready', 'platform_non_certification', 'platform', ['advanced_accounting_guardrails'], 'La plataforma no certifica libros ni estados financieros.'),
      ];
    const blockers = [...financialStatementsBlueprint.blockers];
    const boundaryStatus = resolveStatus(
      statutoryBoundaryItems.map((item) => item.status),
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      boundaryStatus,
      financialStatementsBlueprint,
      statutoryBoundaryItems,
      summary: {
        itemCount: statutoryBoundaryItems.length,
        readyItemCount: statutoryBoundaryItems.filter(
          (item) => item.status === 'ready',
        ).length,
        professionalOwnedItemCount: statutoryBoundaryItems.filter(
          (item) =>
            item.owner === 'external_accountant' ||
            item.owner === 'legal_representative',
        ).length,
        platformGuardrailItemCount: statutoryBoundaryItems.filter(
          (item) => item.boundaryType === 'platform_non_certification',
        ).length,
      },
      blockers,
      nextStep: 'Cerrar Full Accounting Candidate 0.1.',
      guardrails: [
        'Legal books boundary no legaliza ni custodia libros oficiales.',
        'La plataforma conserva preparacion y trazabilidad, no certificacion.',
      ],
    };
  }
}

export class RequestTenantFullAccountingCandidateCloseoutUseCase {
  constructor(
    private readonly getTenantFullAccountingLegalBooksStatutoryBoundaryUseCase: GetTenantFullAccountingLegalBooksStatutoryBoundaryUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantFullAccountingCandidateCloseoutView> {
    const legalBooksStatutoryBoundary =
      await this.getTenantFullAccountingLegalBooksStatutoryBoundaryUseCase.execute(
        input,
      );
    const { financialStatementsBlueprint } = legalBooksStatutoryBoundary;
    const { bankReconciliationBoundary } = financialStatementsBlueprint;
    const { ledgerScopeBlueprint } = bankReconciliationBoundary;
    const { candidateAnchor } = ledgerScopeBlueprint;
    const closeoutChecklist: TenantFullAccountingCandidateCloseoutView['closeoutChecklist'] =
      [
        fullAccountingCandidateCloseoutCheck('candidate_anchor', 'Full Accounting candidate anchor', candidateAnchor.anchorStatus, ['full_accounting_candidate_anchor']),
        fullAccountingCandidateCloseoutCheck('ledger_scope', 'Core ledger scope blueprint', ledgerScopeBlueprint.blueprintStatus, ['full_accounting_core_ledger_scope_blueprint']),
        fullAccountingCandidateCloseoutCheck('bank_boundary', 'Bank reconciliation product boundary', bankReconciliationBoundary.boundaryStatus, ['full_accounting_bank_reconciliation_boundary']),
        fullAccountingCandidateCloseoutCheck('financial_statements', 'Financial statements candidate blueprint', financialStatementsBlueprint.blueprintStatus, ['full_accounting_financial_statements_blueprint']),
        fullAccountingCandidateCloseoutCheck('legal_books_boundary', 'Legal books statutory boundary blueprint', legalBooksStatutoryBoundary.boundaryStatus, ['full_accounting_legal_books_statutory_boundary']),
      ];
    const blockers = unique([
      ...candidateAnchor.blockers,
      ...ledgerScopeBlueprint.blockers,
      ...bankReconciliationBoundary.blockers,
      ...financialStatementsBlueprint.blockers,
      ...legalBooksStatutoryBoundary.blockers,
    ]);
    const closeoutStatus = resolveStatus(
      closeoutChecklist.map((item) => item.status),
      blockers,
    );
    const finalDecision = fullAccountingCandidateDecisionFromStatus(
      closeoutStatus,
      candidateAnchor,
      ledgerScopeBlueprint,
      legalBooksStatutoryBoundary,
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      closeoutStatus,
      candidateAnchor,
      ledgerScopeBlueprint,
      bankReconciliationBoundary,
      financialStatementsBlueprint,
      legalBooksStatutoryBoundary,
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
        ledgerScopeItemCount: ledgerScopeBlueprint.summary.itemCount,
        bankBoundaryItemCount: bankReconciliationBoundary.summary.itemCount,
        financialStatementItemCount: financialStatementsBlueprint.summary.itemCount,
        statutoryBoundaryItemCount: legalBooksStatutoryBoundary.summary.itemCount,
      },
      blockers,
      nextStep:
        finalDecision === 'open_full_accounting_mvp'
          ? 'Definir Full Accounting MVP 0.2 con ledger persistente.'
          : finalDecision === 'continue_candidate_discovery'
            ? 'Completar discovery antes de abrir MVP.'
            : finalDecision === 'return_to_accounting_advanced_hardening'
              ? 'Volver a Accounting Advanced hardening.'
              : finalDecision === 'archive_handoff_only'
                ? 'Cerrar con archive handoff sin full Accounting.'
                : 'No abrir full Accounting para este periodo.',
      guardrails: [
        'Full Accounting Candidate 0.1 no implementa postings ni ledger persistente.',
        'No emite estados financieros, libros legales ni certificaciones profesionales.',
      ],
    };
  }
}

export class GetTenantFullAccountingMvpReadinessAnchorUseCase {
  constructor(
    private readonly requestTenantFullAccountingCandidateCloseoutUseCase: RequestTenantFullAccountingCandidateCloseoutUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantFullAccountingMvpReadinessAnchorView> {
    const candidateCloseout =
      await this.requestTenantFullAccountingCandidateCloseoutUseCase.execute(
        input,
      );
    const readinessGates: TenantFullAccountingMvpReadinessAnchorView['readinessGates'] =
      [
        fullAccountingMvpReadinessGate('candidate_closeout', 'Candidate closeout accepted', candidateCloseout.closeoutStatus, 'candidate_closeout', candidateCloseout.finalDecision === 'open_full_accounting_mvp' ? 'ready_for_mvp_design' : 'return_to_candidate', ['full_accounting_candidate_closeout']),
        fullAccountingMvpReadinessGate('ledger_persistence', 'Ledger persistence needs scoped', candidateCloseout.ledgerScopeBlueprint.blueprintStatus, 'ledger_persistence', 'ready_for_mvp_design', ['full_accounting_core_ledger_scope_blueprint']),
        fullAccountingMvpReadinessGate('posting_policy', 'Posting policy needs scoped', candidateCloseout.ledgerScopeBlueprint.blueprintStatus, 'posting_policy', 'needs_readiness', ['full_accounting_core_ledger_scope_blueprint']),
        fullAccountingMvpReadinessGate('bank_readiness', 'Bank readiness needs scoped', candidateCloseout.bankReconciliationBoundary.boundaryStatus, 'bank_readiness', 'ready_for_mvp_design', ['full_accounting_bank_reconciliation_boundary']),
        fullAccountingMvpReadinessGate('statement_readiness', 'Statement readiness needs scoped', candidateCloseout.financialStatementsBlueprint.blueprintStatus, 'statement_readiness', 'ready_for_mvp_design', ['full_accounting_financial_statements_blueprint']),
      ];
    const blockers =
      candidateCloseout.finalDecision === 'open_full_accounting_mvp'
        ? [...candidateCloseout.blockers]
        : unique([
            ...candidateCloseout.blockers,
            `Full Accounting Candidate decision is ${candidateCloseout.finalDecision}.`,
          ]);
    const anchorStatus = resolveStatus(
      readinessGates.map((gate) => gate.status),
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      anchorStatus,
      candidateCloseout,
      readinessGates,
      summary: {
        gateCount: readinessGates.length,
        readyGateCount: readinessGates.filter((gate) => gate.status === 'ready')
          .length,
        needsReadinessGateCount: readinessGates.filter(
          (gate) => gate.readinessState === 'needs_readiness',
        ).length,
        blockedGateCount: readinessGates.filter(
          (gate) => gate.status === 'blocked',
        ).length,
        candidateChecklistCount: candidateCloseout.summary.checklistCount,
      },
      blockers,
      nextStep: 'Disenar persistencia minima de ledger para MVP.',
      guardrails: [
        'MVP readiness prepara diseno; no persiste ledger real.',
        'Ningun posting oficial ocurre en esta capa.',
      ],
    };
  }
}

export class GetTenantFullAccountingLedgerPersistenceDesignWorkspaceUseCase {
  constructor(
    private readonly getTenantFullAccountingMvpReadinessAnchorUseCase: GetTenantFullAccountingMvpReadinessAnchorUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantFullAccountingLedgerPersistenceDesignWorkspaceView> {
    const readinessAnchor =
      await this.getTenantFullAccountingMvpReadinessAnchorUseCase.execute(input);
    const persistenceItems: TenantFullAccountingLedgerPersistenceDesignWorkspaceView['persistenceItems'] =
      [
        fullAccountingLedgerPersistenceItem('journal_header', 'Journal header persistence', readinessAnchor.anchorStatus, 'journal_header', 'approval_required', ['full_accounting_candidate_anchor']),
        fullAccountingLedgerPersistenceItem('journal_line', 'Journal line persistence', readinessAnchor.anchorStatus, 'journal_line', 'balanced_debits_credits', ['full_accounting_core_ledger_scope_blueprint']),
        fullAccountingLedgerPersistenceItem('posting_batch', 'Posting batch persistence', readinessAnchor.anchorStatus, 'posting_batch', 'approval_required', ['full_accounting_core_ledger_scope_blueprint']),
        fullAccountingLedgerPersistenceItem('balance_snapshot', 'Balance snapshot persistence', readinessAnchor.anchorStatus, 'balance_snapshot', 'recalculable_snapshot', ['accounting_trial_balance_workspace']),
        fullAccountingLedgerPersistenceItem('period_lock', 'Period lock persistence', readinessAnchor.anchorStatus, 'period_lock', 'period_locked_after_close', ['accounting_period_lock_readiness']),
        fullAccountingLedgerPersistenceItem('reversal_link', 'Reversal link persistence', readinessAnchor.anchorStatus, 'reversal_link', 'reversal_trace_required', ['accounting_corrections_queue']),
      ];
    const blockers = [...readinessAnchor.blockers];
    const designStatus = resolveStatus(
      persistenceItems.map((item) => item.status),
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      designStatus,
      readinessAnchor,
      persistenceItems,
      summary: {
        itemCount: persistenceItems.length,
        readyItemCount: persistenceItems.filter((item) => item.status === 'ready').length,
        approvalInvariantCount: persistenceItems.filter((item) => item.invariant === 'approval_required').length,
        balanceInvariantCount: persistenceItems.filter((item) => item.invariant === 'balanced_debits_credits').length,
      },
      blockers,
      nextStep: 'Definir politica de posting y aprobaciones.',
      guardrails: [
        'Persistence design no crea tablas ni escribe journal entries.',
        'Todo batch posteable requiere aprobacion antes de MVP operations.',
      ],
    };
  }
}

export class GetTenantFullAccountingPostingPolicyApprovalBoundaryUseCase {
  constructor(
    private readonly getTenantFullAccountingLedgerPersistenceDesignWorkspaceUseCase: GetTenantFullAccountingLedgerPersistenceDesignWorkspaceUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantFullAccountingPostingPolicyApprovalBoundaryView> {
    const ledgerPersistenceDesign =
      await this.getTenantFullAccountingLedgerPersistenceDesignWorkspaceUseCase.execute(
        input,
      );
    const policyItems: TenantFullAccountingPostingPolicyApprovalBoundaryView['policyItems'] =
      [
        fullAccountingPostingPolicyItem('draft_policy', 'Draft journal policy', ledgerPersistenceDesign.designStatus, 'draft_policy', 'operator', ['full_accounting_ledger_persistence_design'], 'Drafts do not affect official books.'),
        fullAccountingPostingPolicyItem('approval_policy', 'Posting approval policy', ledgerPersistenceDesign.designStatus, 'approval_policy', 'external_accountant', ['full_accounting_ledger_persistence_design'], 'Posting requires explicit approval boundary.'),
        fullAccountingPostingPolicyItem('posting_policy', 'Posting execution policy', ledgerPersistenceDesign.designStatus, 'posting_policy', 'platform', ['full_accounting_ledger_persistence_design'], 'Platform can orchestrate only after approval.'),
        fullAccountingPostingPolicyItem('reversal_policy', 'Reversal policy', ledgerPersistenceDesign.designStatus, 'reversal_policy', 'operator', ['full_accounting_ledger_persistence_design'], 'Reversals must preserve traceability.'),
        fullAccountingPostingPolicyItem('accountant_escalation', 'Accountant escalation policy', 'ready', 'accountant_escalation', 'external_accountant', ['advanced_professional_closeout_boundary'], 'Professional judgement remains external.'),
      ];
    const blockers = [...ledgerPersistenceDesign.blockers];
    const boundaryStatus = resolveStatus(
      policyItems.map((item) => item.status),
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      boundaryStatus,
      ledgerPersistenceDesign,
      policyItems,
      summary: {
        itemCount: policyItems.length,
        readyItemCount: policyItems.filter((item) => item.status === 'ready').length,
        accountantOwnedItemCount: policyItems.filter((item) => item.owner === 'external_accountant').length,
        platformGuardrailItemCount: policyItems.filter((item) => item.owner === 'platform').length,
      },
      blockers,
      nextStep: 'Preparar bank feed y reconciliation readiness MVP.',
      guardrails: [
        'Posting policy boundary no postea ni revierte asientos.',
        'Aprobacion profesional se mantiene explicita.',
      ],
    };
  }
}

export class GetTenantFullAccountingBankFeedReconciliationMvpReadinessUseCase {
  constructor(
    private readonly getTenantFullAccountingPostingPolicyApprovalBoundaryUseCase: GetTenantFullAccountingPostingPolicyApprovalBoundaryUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantFullAccountingBankFeedReconciliationMvpReadinessView> {
    const postingPolicyBoundary =
      await this.getTenantFullAccountingPostingPolicyApprovalBoundaryUseCase.execute(
        input,
      );
    const bankReadinessItems: TenantFullAccountingBankFeedReconciliationMvpReadinessView['bankReadinessItems'] =
      [
        fullAccountingBankMvpReadinessItem('bank_feed_source', 'Bank feed source readiness', postingPolicyBoundary.boundaryStatus, 'bank_feed_source', 'needs_provider', ['accounting_bank_statement_registry']),
        fullAccountingBankMvpReadinessItem('import_profile', 'Import profile readiness', postingPolicyBoundary.boundaryStatus, 'import_profile', 'mvp_ready', ['accounting_bank_statement_import_profile_workspace']),
        fullAccountingBankMvpReadinessItem('matching_rules', 'Matching rules readiness', postingPolicyBoundary.boundaryStatus, 'matching_rules', 'mvp_ready', ['accounting_bank_reconciliation_workspace']),
        fullAccountingBankMvpReadinessItem('exception_queue', 'Exception queue readiness', postingPolicyBoundary.boundaryStatus, 'exception_queue', 'needs_operator_review', ['accounting_corrections_queue']),
        fullAccountingBankMvpReadinessItem('cutoff_controls', 'Cutoff controls readiness', postingPolicyBoundary.boundaryStatus, 'cutoff_controls', 'needs_operator_review', ['accounting_period_cash_closeout_readiness']),
        fullAccountingBankMvpReadinessItem('evidence_packet', 'Bank evidence packet readiness', 'ready', 'evidence_packet', 'professional_boundary', ['accounting_certified_bank_evidence_boundary']),
      ];
    const blockers = [...postingPolicyBoundary.blockers];
    const readinessStatus = resolveStatus(
      bankReadinessItems.map((item) => item.status),
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      readinessStatus,
      postingPolicyBoundary,
      bankReadinessItems,
      summary: {
        itemCount: bankReadinessItems.length,
        readyItemCount: bankReadinessItems.filter((item) => item.status === 'ready').length,
        providerDependencyCount: bankReadinessItems.filter((item) => item.implementationMode === 'needs_provider').length,
        operatorReviewCount: bankReadinessItems.filter((item) => item.implementationMode === 'needs_operator_review').length,
      },
      blockers,
      nextStep: 'Preparar trial balance y statement readiness.',
      guardrails: [
        'Bank MVP readiness no certifica saldos bancarios.',
        'Feeds bancarios pueden requerir proveedor externo posterior.',
      ],
    };
  }
}

export class GetTenantFullAccountingTrialBalanceStatementReadinessUseCase {
  constructor(
    private readonly getTenantFullAccountingBankFeedReconciliationMvpReadinessUseCase: GetTenantFullAccountingBankFeedReconciliationMvpReadinessUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantFullAccountingTrialBalanceStatementReadinessView> {
    const bankFeedReadiness =
      await this.getTenantFullAccountingBankFeedReconciliationMvpReadinessUseCase.execute(
        input,
      );
    const statementReadinessItems: TenantFullAccountingTrialBalanceStatementReadinessView['statementReadinessItems'] =
      [
        fullAccountingStatementReadinessItem('trial_balance', 'Trial balance readiness', bankFeedReadiness.readinessStatus, 'trial_balance', 'ledger_snapshot', ['accounting_trial_balance_workspace']),
        fullAccountingStatementReadinessItem('balance_sheet', 'Balance sheet readiness', bankFeedReadiness.readinessStatus, 'balance_sheet', 'ledger_snapshot', ['accounting_financial_statement_preview']),
        fullAccountingStatementReadinessItem('income_statement', 'Income statement readiness', bankFeedReadiness.readinessStatus, 'income_statement', 'ledger_snapshot', ['accounting_financial_statement_preview']),
        fullAccountingStatementReadinessItem('comparatives', 'Comparatives readiness', bankFeedReadiness.readinessStatus, 'comparatives', 'ledger_snapshot', ['advanced_multi_period_financial_statement_workspace']),
        fullAccountingStatementReadinessItem('adjustment_trace', 'Adjustment trace readiness', bankFeedReadiness.readinessStatus, 'adjustment_trace', 'adjustment_policy', ['advanced_adjustment_draft_pack']),
        fullAccountingStatementReadinessItem('professional_review', 'Professional review readiness', 'ready', 'professional_review', 'professional_review', ['accounting_financial_statement_final_review_packet']),
      ];
    const blockers = [...bankFeedReadiness.blockers];
    const readinessStatus = resolveStatus(
      statementReadinessItems.map((item) => item.status),
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      readinessStatus,
      bankFeedReadiness,
      statementReadinessItems,
      summary: {
        itemCount: statementReadinessItems.length,
        readyItemCount: statementReadinessItems.filter((item) => item.status === 'ready').length,
        ledgerDependencyCount: statementReadinessItems.filter((item) => item.dependency === 'ledger_snapshot').length,
        professionalReviewCount: statementReadinessItems.filter((item) => item.dependency === 'professional_review').length,
      },
      blockers,
      nextStep: 'Cerrar Full Accounting MVP Readiness 0.2.',
      guardrails: [
        'Statement readiness no emite estados financieros oficiales.',
        'Trial balance MVP requiere ledger snapshot aprobado posteriormente.',
      ],
    };
  }
}

export class RequestTenantFullAccountingMvpReadinessCloseoutUseCase {
  constructor(
    private readonly getTenantFullAccountingTrialBalanceStatementReadinessUseCase: GetTenantFullAccountingTrialBalanceStatementReadinessUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AccountingAdvancedDiscoveryInput,
  ): Promise<TenantFullAccountingMvpReadinessCloseoutView> {
    const trialBalanceStatementReadiness =
      await this.getTenantFullAccountingTrialBalanceStatementReadinessUseCase.execute(
        input,
      );
    const { bankFeedReadiness } = trialBalanceStatementReadiness;
    const { postingPolicyBoundary } = bankFeedReadiness;
    const { ledgerPersistenceDesign } = postingPolicyBoundary;
    const { readinessAnchor } = ledgerPersistenceDesign;
    const closeoutChecklist: TenantFullAccountingMvpReadinessCloseoutView['closeoutChecklist'] =
      [
        fullAccountingMvpReadinessCloseoutCheck('readiness_anchor', 'Full Accounting MVP readiness anchor', readinessAnchor.anchorStatus, ['full_accounting_mvp_readiness_anchor']),
        fullAccountingMvpReadinessCloseoutCheck('ledger_persistence_design', 'Ledger persistence design workspace', ledgerPersistenceDesign.designStatus, ['full_accounting_ledger_persistence_design']),
        fullAccountingMvpReadinessCloseoutCheck('posting_policy_boundary', 'Posting policy approval boundary', postingPolicyBoundary.boundaryStatus, ['full_accounting_posting_policy_boundary']),
        fullAccountingMvpReadinessCloseoutCheck('bank_feed_readiness', 'Bank feed reconciliation MVP readiness', bankFeedReadiness.readinessStatus, ['full_accounting_bank_feed_reconciliation_mvp_readiness']),
        fullAccountingMvpReadinessCloseoutCheck('statement_readiness', 'Trial balance statement readiness', trialBalanceStatementReadiness.readinessStatus, ['full_accounting_trial_balance_statement_readiness']),
      ];
    const blockers = unique([
      ...readinessAnchor.blockers,
      ...ledgerPersistenceDesign.blockers,
      ...postingPolicyBoundary.blockers,
      ...bankFeedReadiness.blockers,
      ...trialBalanceStatementReadiness.blockers,
    ]);
    const closeoutStatus = resolveStatus(
      closeoutChecklist.map((item) => item.status),
      blockers,
    );
    const finalDecision = fullAccountingMvpReadinessDecisionFromStatus(
      closeoutStatus,
      readinessAnchor,
      ledgerPersistenceDesign,
      postingPolicyBoundary,
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      closeoutStatus,
      readinessAnchor,
      ledgerPersistenceDesign,
      postingPolicyBoundary,
      bankFeedReadiness,
      trialBalanceStatementReadiness,
      closeoutChecklist,
      finalDecision,
      summary: {
        checklistCount: closeoutChecklist.length,
        readyChecklistCount: closeoutChecklist.filter((item) => item.status === 'ready').length,
        blockedChecklistCount: closeoutChecklist.filter((item) => item.status === 'blocked').length,
        ledgerPersistenceItemCount: ledgerPersistenceDesign.summary.itemCount,
        postingPolicyItemCount: postingPolicyBoundary.summary.itemCount,
        bankReadinessItemCount: bankFeedReadiness.summary.itemCount,
        statementReadinessItemCount: trialBalanceStatementReadiness.summary.itemCount,
      },
      blockers,
      nextStep:
        finalDecision === 'open_full_accounting_mvp_operations'
          ? 'Abrir Full Accounting MVP operations 0.3.'
          : finalDecision === 'continue_mvp_readiness'
            ? 'Completar readiness antes de operaciones MVP.'
            : finalDecision === 'return_to_candidate_discovery'
              ? 'Volver a Full Accounting Candidate 0.1.'
              : 'Volver a Accounting Advanced hardening.',
      guardrails: [
        'MVP readiness closeout no crea ledger persistente ni postings.',
        'Operaciones MVP deben abrirse en un slice posterior separado.',
      ],
    };
  }
}

export class GetTenantFullAccountingMvpOperationsAnchorUseCase {
  constructor(
    private readonly requestTenantFullAccountingMvpReadinessCloseoutUseCase: RequestTenantFullAccountingMvpReadinessCloseoutUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: AccountingAdvancedDiscoveryInput): Promise<TenantFullAccountingMvpOperationsAnchorView> {
    const readinessCloseout =
      await this.requestTenantFullAccountingMvpReadinessCloseoutUseCase.execute(input);
    const operationLanes: TenantFullAccountingMvpOperationsAnchorView['operationLanes'] = [
      fullAccountingMvpOperationLane('ledger_workbench', 'Ledger workbench MVP', readinessCloseout.closeoutStatus, 'ledger_workbench', 'draft_only', ['full_accounting_mvp_readiness_closeout']),
      fullAccountingMvpOperationLane('posting_draft', 'Posting draft lane', readinessCloseout.postingPolicyBoundary.boundaryStatus, 'posting_draft', 'simulation_only', ['full_accounting_posting_policy_boundary']),
      fullAccountingMvpOperationLane('bank_reconciliation', 'Bank reconciliation workbench MVP', readinessCloseout.bankFeedReadiness.readinessStatus, 'bank_reconciliation', 'simulation_only', ['full_accounting_bank_feed_reconciliation_mvp_readiness']),
      fullAccountingMvpOperationLane('trial_balance_preview', 'Trial balance preview workbench', readinessCloseout.trialBalanceStatementReadiness.readinessStatus, 'trial_balance_preview', 'preview_only', ['full_accounting_trial_balance_statement_readiness']),
    ];
    const blockers =
      readinessCloseout.finalDecision === 'open_full_accounting_mvp_operations'
        ? [...readinessCloseout.blockers]
        : unique([
            ...readinessCloseout.blockers,
            `Full Accounting MVP readiness decision is ${readinessCloseout.finalDecision}.`,
          ]);
    const anchorStatus = resolveStatus(operationLanes.map((lane) => lane.status), blockers);

    return {
      ...input,
      generatedAt: this.nowProvider(),
      anchorStatus,
      readinessCloseout,
      operationLanes,
      summary: {
        laneCount: operationLanes.length,
        readyLaneCount: operationLanes.filter((lane) => lane.status === 'ready').length,
        simulationLaneCount: operationLanes.filter((lane) => lane.operationMode === 'simulation_only').length,
        previewLaneCount: operationLanes.filter((lane) => lane.operationMode === 'preview_only').length,
        blockedLaneCount: operationLanes.filter((lane) => lane.status === 'blocked').length,
      },
      blockers,
      nextStep: 'Abrir ledger workbench MVP en modo draft.',
      guardrails: [
        'MVP operations 0.3 opera drafts, simulations y previews; no postings oficiales.',
        'Ningun workbench emite libros legales ni estados financieros.',
      ],
    };
  }
}

export class GetTenantFullAccountingLedgerWorkbenchMvpUseCase {
  constructor(
    private readonly getTenantFullAccountingMvpOperationsAnchorUseCase: GetTenantFullAccountingMvpOperationsAnchorUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: AccountingAdvancedDiscoveryInput): Promise<TenantFullAccountingLedgerWorkbenchMvpView> {
    const operationsAnchor =
      await this.getTenantFullAccountingMvpOperationsAnchorUseCase.execute(input);
    const ledgerWorkItems: TenantFullAccountingLedgerWorkbenchMvpView['ledgerWorkItems'] = [
      fullAccountingLedgerWorkItem('journal_batch_draft', 'Journal batch draft', operationsAnchor.anchorStatus, 'journal_batch_draft', 'draft', ['full_accounting_ledger_persistence_design']),
      fullAccountingLedgerWorkItem('journal_line_review', 'Journal line review', operationsAnchor.anchorStatus, 'journal_line_review', 'draft', ['full_accounting_ledger_persistence_design']),
      fullAccountingLedgerWorkItem('balance_snapshot_preview', 'Balance snapshot preview', operationsAnchor.anchorStatus, 'balance_snapshot_preview', 'preview', ['accounting_trial_balance_workspace']),
      fullAccountingLedgerWorkItem('invariant_check', 'Ledger invariant check', operationsAnchor.anchorStatus, 'invariant_check', 'simulation', ['full_accounting_ledger_persistence_design']),
      fullAccountingLedgerWorkItem('period_lock_preview', 'Period lock preview', operationsAnchor.anchorStatus, 'period_lock_preview', 'preview', ['accounting_period_lock_readiness']),
    ];
    const blockers = [...operationsAnchor.blockers];
    const workbenchStatus = resolveStatus(ledgerWorkItems.map((item) => item.status), blockers);

    return {
      ...input,
      generatedAt: this.nowProvider(),
      workbenchStatus,
      operationsAnchor,
      ledgerWorkItems,
      summary: {
        itemCount: ledgerWorkItems.length,
        readyItemCount: ledgerWorkItems.filter((item) => item.status === 'ready').length,
        draftItemCount: ledgerWorkItems.filter((item) => item.workMode === 'draft').length,
        simulationItemCount: ledgerWorkItems.filter((item) => item.workMode === 'simulation').length,
        previewItemCount: ledgerWorkItems.filter((item) => item.workMode === 'preview').length,
      },
      blockers,
      nextStep: 'Preparar posting draft lane.',
      guardrails: [
        'Ledger workbench MVP no persiste ledger oficial.',
        'Balance snapshots son previews derivados, no saldos certificados.',
      ],
    };
  }
}

export class GetTenantFullAccountingPostingDraftLaneUseCase {
  constructor(
    private readonly getTenantFullAccountingLedgerWorkbenchMvpUseCase: GetTenantFullAccountingLedgerWorkbenchMvpUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: AccountingAdvancedDiscoveryInput): Promise<TenantFullAccountingPostingDraftLaneView> {
    const ledgerWorkbench =
      await this.getTenantFullAccountingLedgerWorkbenchMvpUseCase.execute(input);
    const draftItems: TenantFullAccountingPostingDraftLaneView['draftItems'] = [
      fullAccountingPostingDraftItem('draft_batch', 'Draft posting batch', ledgerWorkbench.workbenchStatus, 'draft', 'operator', ['full_accounting_ledger_workbench_mvp']),
      fullAccountingPostingDraftItem('pending_approval', 'Pending posting approval', ledgerWorkbench.workbenchStatus, 'pending_approval', 'external_accountant', ['full_accounting_posting_policy_boundary']),
      fullAccountingPostingDraftItem('approved_for_simulation', 'Approved for simulation', ledgerWorkbench.workbenchStatus, 'approved_for_simulation', 'external_accountant', ['full_accounting_posting_policy_boundary']),
      fullAccountingPostingDraftItem('returned_review', 'Returned posting draft', 'ready', 'returned', 'operator', ['accounting_corrections_queue']),
    ];
    const blockers = [...ledgerWorkbench.blockers];
    const laneStatus = resolveStatus(draftItems.map((item) => item.status), blockers);

    return {
      ...input,
      generatedAt: this.nowProvider(),
      laneStatus,
      ledgerWorkbench,
      draftItems,
      summary: {
        draftCount: draftItems.length,
        readyDraftCount: draftItems.filter((item) => item.status === 'ready').length,
        pendingApprovalCount: draftItems.filter((item) => item.draftState === 'pending_approval').length,
        simulationApprovedCount: draftItems.filter((item) => item.draftState === 'approved_for_simulation').length,
        blockedDraftCount: draftItems.filter((item) => item.status === 'blocked').length,
      },
      blockers,
      nextStep: 'Preparar bank reconciliation workbench MVP.',
      guardrails: [
        'Approved for simulation no significa posted.',
        'Posting drafts no afectan libros ni saldos oficiales.',
      ],
    };
  }
}

export class GetTenantFullAccountingBankReconciliationWorkbenchMvpUseCase {
  constructor(
    private readonly getTenantFullAccountingPostingDraftLaneUseCase: GetTenantFullAccountingPostingDraftLaneUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: AccountingAdvancedDiscoveryInput): Promise<TenantFullAccountingBankReconciliationWorkbenchMvpView> {
    const postingDraftLane =
      await this.getTenantFullAccountingPostingDraftLaneUseCase.execute(input);
    const reconciliationItems: TenantFullAccountingBankReconciliationWorkbenchMvpView['reconciliationItems'] = [
      fullAccountingReconciliationWorkItem('statement_batch', 'Statement batch preparation', postingDraftLane.laneStatus, 'statement_batch', 'prepared', ['accounting_bank_statement_registry']),
      fullAccountingReconciliationWorkItem('candidate_match', 'Candidate match review', postingDraftLane.laneStatus, 'candidate_match', 'candidate', ['accounting_bank_reconciliation_workspace']),
      fullAccountingReconciliationWorkItem('exception_review', 'Exception review', postingDraftLane.laneStatus, 'exception_review', 'operator_review', ['accounting_corrections_queue']),
      fullAccountingReconciliationWorkItem('cutoff_review', 'Cutoff review', postingDraftLane.laneStatus, 'cutoff_review', 'operator_review', ['accounting_period_cash_closeout_readiness']),
      fullAccountingReconciliationWorkItem('reconciliation_packet', 'Reconciliation packet boundary', 'ready', 'reconciliation_packet', 'professional_boundary', ['accounting_certified_bank_evidence_boundary']),
    ];
    const blockers = [...postingDraftLane.blockers];
    const workbenchStatus = resolveStatus(reconciliationItems.map((item) => item.status), blockers);

    return {
      ...input,
      generatedAt: this.nowProvider(),
      workbenchStatus,
      postingDraftLane,
      reconciliationItems,
      summary: {
        itemCount: reconciliationItems.length,
        readyItemCount: reconciliationItems.filter((item) => item.status === 'ready').length,
        candidateMatchCount: reconciliationItems.filter((item) => item.reconciliationType === 'candidate_match').length,
        exceptionReviewCount: reconciliationItems.filter((item) => item.reconciliationType === 'exception_review').length,
        professionalBoundaryCount: reconciliationItems.filter((item) => item.workMode === 'professional_boundary').length,
      },
      blockers,
      nextStep: 'Preparar trial balance preview workbench.',
      guardrails: [
        'Bank reconciliation workbench no certifica conciliaciones.',
        'Candidate matches requieren revision antes de cualquier cierre bancario.',
      ],
    };
  }
}

export class GetTenantFullAccountingTrialBalancePreviewWorkbenchUseCase {
  constructor(
    private readonly getTenantFullAccountingBankReconciliationWorkbenchMvpUseCase: GetTenantFullAccountingBankReconciliationWorkbenchMvpUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: AccountingAdvancedDiscoveryInput): Promise<TenantFullAccountingTrialBalancePreviewWorkbenchView> {
    const bankReconciliationWorkbench =
      await this.getTenantFullAccountingBankReconciliationWorkbenchMvpUseCase.execute(input);
    const previewItems: TenantFullAccountingTrialBalancePreviewWorkbenchView['previewItems'] = [
      fullAccountingTrialBalancePreviewItem('trial_balance', 'Trial balance preview', bankReconciliationWorkbench.workbenchStatus, 'trial_balance', 'ledger_workbench', ['full_accounting_ledger_workbench_mvp']),
      fullAccountingTrialBalancePreviewItem('balance_variance', 'Balance variance preview', bankReconciliationWorkbench.workbenchStatus, 'balance_variance', 'posting_simulation', ['full_accounting_posting_draft_lane']),
      fullAccountingTrialBalancePreviewItem('approval_warning', 'Approval warning preview', bankReconciliationWorkbench.workbenchStatus, 'approval_warning', 'professional_review', ['full_accounting_posting_policy_boundary']),
      fullAccountingTrialBalancePreviewItem('bank_dependency', 'Bank dependency preview', bankReconciliationWorkbench.workbenchStatus, 'bank_dependency', 'bank_workbench', ['full_accounting_bank_reconciliation_workbench_mvp']),
      fullAccountingTrialBalancePreviewItem('adjustment_trace', 'Adjustment trace preview', 'ready', 'adjustment_trace', 'professional_review', ['advanced_adjustment_draft_pack']),
    ];
    const blockers = [...bankReconciliationWorkbench.blockers];
    const previewStatus = resolveStatus(previewItems.map((item) => item.status), blockers);

    return {
      ...input,
      generatedAt: this.nowProvider(),
      previewStatus,
      bankReconciliationWorkbench,
      previewItems,
      summary: {
        itemCount: previewItems.length,
        readyItemCount: previewItems.filter((item) => item.status === 'ready').length,
        warningCount: previewItems.filter((item) => item.previewType === 'approval_warning').length,
        bankDependencyCount: previewItems.filter((item) => item.dependency === 'bank_workbench').length,
        professionalReviewCount: previewItems.filter((item) => item.dependency === 'professional_review').length,
      },
      blockers,
      nextStep: 'Cerrar Full Accounting MVP Operations 0.3.',
      guardrails: [
        'Trial balance preview no emite estados financieros.',
        'Las variaciones son diagnostico operativo, no cierre oficial.',
      ],
    };
  }
}

export class RequestTenantFullAccountingMvpOperationsCloseoutUseCase {
  constructor(
    private readonly getTenantFullAccountingTrialBalancePreviewWorkbenchUseCase: GetTenantFullAccountingTrialBalancePreviewWorkbenchUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: AccountingAdvancedDiscoveryInput): Promise<TenantFullAccountingMvpOperationsCloseoutView> {
    const trialBalancePreviewWorkbench =
      await this.getTenantFullAccountingTrialBalancePreviewWorkbenchUseCase.execute(input);
    const { bankReconciliationWorkbench } = trialBalancePreviewWorkbench;
    const { postingDraftLane } = bankReconciliationWorkbench;
    const { ledgerWorkbench } = postingDraftLane;
    const { operationsAnchor } = ledgerWorkbench;
    const closeoutChecklist: TenantFullAccountingMvpOperationsCloseoutView['closeoutChecklist'] = [
      fullAccountingMvpOperationsCloseoutCheck('operations_anchor', 'Full Accounting MVP operations anchor', operationsAnchor.anchorStatus, ['full_accounting_mvp_operations_anchor']),
      fullAccountingMvpOperationsCloseoutCheck('ledger_workbench', 'Ledger workbench MVP', ledgerWorkbench.workbenchStatus, ['full_accounting_ledger_workbench_mvp']),
      fullAccountingMvpOperationsCloseoutCheck('posting_draft_lane', 'Posting draft lane', postingDraftLane.laneStatus, ['full_accounting_posting_draft_lane']),
      fullAccountingMvpOperationsCloseoutCheck('bank_workbench', 'Bank reconciliation workbench MVP', bankReconciliationWorkbench.workbenchStatus, ['full_accounting_bank_reconciliation_workbench_mvp']),
      fullAccountingMvpOperationsCloseoutCheck('trial_balance_preview', 'Trial balance preview workbench', trialBalancePreviewWorkbench.previewStatus, ['full_accounting_trial_balance_preview_workbench']),
    ];
    const blockers = unique([
      ...operationsAnchor.blockers,
      ...ledgerWorkbench.blockers,
      ...postingDraftLane.blockers,
      ...bankReconciliationWorkbench.blockers,
      ...trialBalancePreviewWorkbench.blockers,
    ]);
    const closeoutStatus = resolveStatus(closeoutChecklist.map((item) => item.status), blockers);
    const finalDecision = fullAccountingMvpOperationsDecisionFromStatus(
      closeoutStatus,
      operationsAnchor,
      ledgerWorkbench,
      postingDraftLane,
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      closeoutStatus,
      operationsAnchor,
      ledgerWorkbench,
      postingDraftLane,
      bankReconciliationWorkbench,
      trialBalancePreviewWorkbench,
      closeoutChecklist,
      finalDecision,
      summary: {
        checklistCount: closeoutChecklist.length,
        readyChecklistCount: closeoutChecklist.filter((item) => item.status === 'ready').length,
        blockedChecklistCount: closeoutChecklist.filter((item) => item.status === 'blocked').length,
        ledgerWorkItemCount: ledgerWorkbench.summary.itemCount,
        postingDraftCount: postingDraftLane.summary.draftCount,
        reconciliationItemCount: bankReconciliationWorkbench.summary.itemCount,
        previewItemCount: trialBalancePreviewWorkbench.summary.itemCount,
      },
      blockers,
      nextStep:
        finalDecision === 'advance_to_controlled_pilot'
          ? 'Preparar Full Accounting controlled pilot 0.4.'
          : finalDecision === 'continue_operations_hardening'
            ? 'Continuar hardening de operations antes de pilot.'
            : finalDecision === 'return_to_mvp_readiness'
              ? 'Volver a Full Accounting MVP Readiness 0.2.'
              : 'Frenar full Accounting MVP por ahora.',
      guardrails: [
        'Operations closeout no confirma postings oficiales.',
        'Controlled pilot debe abrirse separado antes de cualquier contabilidad real.',
      ],
    };
  }
}

export class GetTenantFullAccountingControlledPilotAnchorUseCase {
  constructor(
    private readonly requestTenantFullAccountingMvpOperationsCloseoutUseCase: RequestTenantFullAccountingMvpOperationsCloseoutUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: AccountingAdvancedDiscoveryInput): Promise<TenantFullAccountingControlledPilotAnchorView> {
    const operationsCloseout =
      await this.requestTenantFullAccountingMvpOperationsCloseoutUseCase.execute(input);
    const pilotLanes: TenantFullAccountingControlledPilotAnchorView['pilotLanes'] = [
      fullAccountingControlledPilotLane('ledger', 'Ledger controlled draft lane', operationsCloseout.ledgerWorkbench.workbenchStatus, 'ledger', 'controlled_draft', ['full_accounting_ledger_workbench_mvp']),
      fullAccountingControlledPilotLane('posting', 'Posting controlled simulation lane', operationsCloseout.postingDraftLane.laneStatus, 'posting', 'controlled_simulation', ['full_accounting_posting_draft_lane']),
      fullAccountingControlledPilotLane('bank_reconciliation', 'Bank reconciliation pilot lane', operationsCloseout.bankReconciliationWorkbench.workbenchStatus, 'bank_reconciliation', 'operator_review', ['full_accounting_bank_reconciliation_workbench_mvp']),
      fullAccountingControlledPilotLane('trial_balance', 'Trial balance pilot preview lane', operationsCloseout.trialBalancePreviewWorkbench.previewStatus, 'trial_balance', 'operator_review', ['full_accounting_trial_balance_preview_workbench']),
      fullAccountingControlledPilotLane('accountant_review', 'Accountant review pilot lane', operationsCloseout.closeoutStatus, 'accountant_review', 'professional_review', ['full_accounting_mvp_operations_closeout']),
    ];
    const blockers =
      operationsCloseout.finalDecision === 'advance_to_controlled_pilot'
        ? [...operationsCloseout.blockers]
        : unique([
            ...operationsCloseout.blockers,
            `Full Accounting MVP operations decision is ${operationsCloseout.finalDecision}.`,
          ]);
    const anchorStatus = resolveStatus(pilotLanes.map((lane) => lane.status), blockers);

    return {
      ...input,
      generatedAt: this.nowProvider(),
      anchorStatus,
      operationsCloseout,
      pilotLanes,
      summary: {
        laneCount: pilotLanes.length,
        readyLaneCount: pilotLanes.filter((lane) => lane.status === 'ready').length,
        controlledLaneCount: pilotLanes.filter((lane) => lane.pilotMode.startsWith('controlled')).length,
        professionalReviewLaneCount: pilotLanes.filter((lane) => lane.pilotMode === 'professional_review').length,
        blockedLaneCount: pilotLanes.filter((lane) => lane.status === 'blocked').length,
      },
      blockers,
      nextStep: 'Enrollar tenant-period y congelar evidencia del piloto.',
      guardrails: [
        'Controlled pilot 0.4 prueba evidencia operativa; no abre contabilidad oficial.',
        'La elegibilidad del piloto depende del closeout de Operations 0.3.',
      ],
    };
  }
}

export class GetTenantFullAccountingPilotEnrollmentPeriodFreezeUseCase {
  constructor(
    private readonly getTenantFullAccountingControlledPilotAnchorUseCase: GetTenantFullAccountingControlledPilotAnchorUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: AccountingAdvancedDiscoveryInput): Promise<TenantFullAccountingPilotEnrollmentPeriodFreezeView> {
    const pilotAnchor =
      await this.getTenantFullAccountingControlledPilotAnchorUseCase.execute(input);
    const frozenEvidence: TenantFullAccountingPilotEnrollmentPeriodFreezeView['frozenEvidence'] = [
      fullAccountingPilotFrozenEvidence('operations_closeout', 'Operations closeout snapshot', pilotAnchor.operationsCloseout.closeoutStatus, 'operations_closeout', 'snapshot', ['full_accounting_mvp_operations_closeout']),
      fullAccountingPilotFrozenEvidence('ledger_workbench', 'Ledger workbench snapshot', pilotAnchor.operationsCloseout.ledgerWorkbench.workbenchStatus, 'ledger_workbench', 'snapshot', ['full_accounting_ledger_workbench_mvp']),
      fullAccountingPilotFrozenEvidence('posting_draft_lane', 'Posting draft review packet', pilotAnchor.operationsCloseout.postingDraftLane.laneStatus, 'posting_draft_lane', 'review_packet', ['full_accounting_posting_draft_lane']),
      fullAccountingPilotFrozenEvidence('bank_workbench', 'Bank candidate reference set', pilotAnchor.operationsCloseout.bankReconciliationWorkbench.workbenchStatus, 'bank_workbench', 'reference', ['full_accounting_bank_reconciliation_workbench_mvp']),
      fullAccountingPilotFrozenEvidence('trial_balance_preview', 'Trial balance preview reference', pilotAnchor.operationsCloseout.trialBalancePreviewWorkbench.previewStatus, 'trial_balance_preview', 'reference', ['full_accounting_trial_balance_preview_workbench']),
    ];
    const blockers = [...pilotAnchor.blockers];
    const enrollmentStatus = resolveStatus(frozenEvidence.map((item) => item.status), blockers);

    return {
      ...input,
      generatedAt: this.nowProvider(),
      enrollmentStatus,
      pilotAnchor,
      frozenEvidence,
      summary: {
        evidenceCount: frozenEvidence.length,
        readyEvidenceCount: frozenEvidence.filter((item) => item.status === 'ready').length,
        snapshotCount: frozenEvidence.filter((item) => item.freezeMode === 'snapshot').length,
        reviewPacketCount: frozenEvidence.filter((item) => item.freezeMode === 'review_packet').length,
        blockedEvidenceCount: frozenEvidence.filter((item) => item.status === 'blocked').length,
      },
      blockers,
      nextStep: 'Construir runbook del piloto controlado.',
      guardrails: [
        'Congelar evidencia no equivale a cerrar periodo ni libros.',
        'El snapshot del piloto es reproducible y separado de postings oficiales.',
      ],
    };
  }
}

export class GetTenantFullAccountingPilotRunbookWorkspaceUseCase {
  constructor(
    private readonly getTenantFullAccountingPilotEnrollmentPeriodFreezeUseCase: GetTenantFullAccountingPilotEnrollmentPeriodFreezeUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: AccountingAdvancedDiscoveryInput): Promise<TenantFullAccountingPilotRunbookWorkspaceView> {
    const enrollmentFreeze =
      await this.getTenantFullAccountingPilotEnrollmentPeriodFreezeUseCase.execute(input);
    const runbookSteps: TenantFullAccountingPilotRunbookWorkspaceView['runbookSteps'] = [
      fullAccountingPilotRunbookStep('ledger_draft_review', 'Review ledger draft packet', enrollmentFreeze.enrollmentStatus, 'ledger_draft_review', 'operator', 'Ledger draft packet reviewed', ['full_accounting_ledger_workbench_mvp']),
      fullAccountingPilotRunbookStep('posting_simulation', 'Execute posting simulation review', enrollmentFreeze.enrollmentStatus, 'posting_simulation', 'external_accountant', 'Posting simulation approved or returned', ['full_accounting_posting_draft_lane']),
      fullAccountingPilotRunbookStep('bank_candidate_review', 'Review bank candidate matches', enrollmentFreeze.enrollmentStatus, 'bank_candidate_review', 'operator', 'Bank candidates classified', ['full_accounting_bank_reconciliation_workbench_mvp']),
      fullAccountingPilotRunbookStep('trial_balance_preview', 'Review trial balance warnings', enrollmentFreeze.enrollmentStatus, 'trial_balance_preview', 'external_accountant', 'Trial balance warnings explained', ['full_accounting_trial_balance_preview_workbench']),
      fullAccountingPilotRunbookStep('rollback_gate', 'Evaluate rollback gate', 'ready', 'rollback_gate', 'platform', 'Rollback criteria are explicit', ['full_accounting_controlled_pilot_anchor']),
    ];
    const blockers = [...enrollmentFreeze.blockers];
    const runbookStatus = resolveStatus(runbookSteps.map((step) => step.status), blockers);

    return {
      ...input,
      generatedAt: this.nowProvider(),
      runbookStatus,
      enrollmentFreeze,
      runbookSteps,
      summary: {
        stepCount: runbookSteps.length,
        readyStepCount: runbookSteps.filter((step) => step.status === 'ready').length,
        accountantOwnedStepCount: runbookSteps.filter((step) => step.owner === 'external_accountant').length,
        rollbackGateCount: runbookSteps.filter((step) => step.stepType === 'rollback_gate').length,
        blockedStepCount: runbookSteps.filter((step) => step.status === 'blocked').length,
      },
      blockers,
      nextStep: 'Abrir pilot accountant review room.',
      guardrails: [
        'El runbook ordena la prueba; no autoriza postings.',
        'Rollback gate debe existir antes de cualquier graduacion.',
      ],
    };
  }
}

export class GetTenantFullAccountingPilotAccountantReviewRoomUseCase {
  constructor(
    private readonly getTenantFullAccountingPilotRunbookWorkspaceUseCase: GetTenantFullAccountingPilotRunbookWorkspaceUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: AccountingAdvancedDiscoveryInput): Promise<TenantFullAccountingPilotAccountantReviewRoomView> {
    const runbookWorkspace =
      await this.getTenantFullAccountingPilotRunbookWorkspaceUseCase.execute(input);
    const reviewItems: TenantFullAccountingPilotAccountantReviewRoomView['reviewItems'] = [
      fullAccountingPilotReviewItem('evidence_question', 'Accountant evidence question', runbookWorkspace.runbookStatus, 'evidence_question', 'external_accountant', ['full_accounting_pilot_runbook_workspace']),
      fullAccountingPilotReviewItem('approval_recommendation', 'Pilot approval recommendation', runbookWorkspace.runbookStatus, 'approval_recommendation', 'external_accountant', ['full_accounting_posting_draft_lane']),
      fullAccountingPilotReviewItem('professional_concern', 'Professional concern register', runbookWorkspace.runbookStatus, 'professional_concern', 'external_accountant', ['accounting_accountant_handoff_workspace']),
      fullAccountingPilotReviewItem('resolution_note', 'Operator resolution note', 'ready', 'resolution_note', 'operator', ['accounting_review_resolution_packet']),
      fullAccountingPilotReviewItem('boundary_attestation', 'Professional boundary attestation', 'ready', 'boundary_attestation', 'platform', ['full_accounting_mvp_operations_closeout']),
    ];
    const blockers = [...runbookWorkspace.blockers];
    const reviewStatus = resolveStatus(reviewItems.map((item) => item.status), blockers);

    return {
      ...input,
      generatedAt: this.nowProvider(),
      reviewStatus,
      runbookWorkspace,
      reviewItems,
      summary: {
        itemCount: reviewItems.length,
        readyItemCount: reviewItems.filter((item) => item.status === 'ready').length,
        accountantOwnedItemCount: reviewItems.filter((item) => item.owner === 'external_accountant').length,
        unresolvedConcernCount: reviewItems.filter((item) => item.reviewType === 'professional_concern' && item.status !== 'ready').length,
        approvalRecommendationCount: reviewItems.filter((item) => item.reviewType === 'approval_recommendation').length,
      },
      blockers,
      nextStep: 'Preparar pilot outcome packet.',
      guardrails: [
        'Review room captura criterio profesional, no reemplaza firma ni certificacion.',
        'Las recomendaciones del piloto no emiten estados financieros oficiales.',
      ],
    };
  }
}

export class GetTenantFullAccountingPilotOutcomePacketUseCase {
  constructor(
    private readonly getTenantFullAccountingPilotAccountantReviewRoomUseCase: GetTenantFullAccountingPilotAccountantReviewRoomUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: AccountingAdvancedDiscoveryInput): Promise<TenantFullAccountingPilotOutcomePacketView> {
    const accountantReviewRoom =
      await this.getTenantFullAccountingPilotAccountantReviewRoomUseCase.execute(input);
    const outcomeSignals: TenantFullAccountingPilotOutcomePacketView['outcomeSignals'] = [
      fullAccountingPilotOutcomeSignal('lane_completed', 'Pilot lanes completed signal', accountantReviewRoom.reviewStatus, 'lane_completed', 'high', ['full_accounting_controlled_pilot_anchor']),
      fullAccountingPilotOutcomeSignal('accountant_acceptance', 'Accountant acceptance signal', accountantReviewRoom.reviewStatus, 'accountant_acceptance', 'high', ['full_accounting_pilot_accountant_review_room']),
      fullAccountingPilotOutcomeSignal('graduation_signal', 'Graduation readiness signal', accountantReviewRoom.reviewStatus, 'graduation_signal', 'medium', ['full_accounting_pilot_runbook_workspace']),
      fullAccountingPilotOutcomeSignal('hardening_signal', 'Hardening signal', 'ready', 'hardening_signal', 'medium', ['full_accounting_pilot_outcome_packet']),
      fullAccountingPilotOutcomeSignal('blocker_repeated', 'Repeated blocker scan', accountantReviewRoom.reviewStatus, 'blocker_repeated', accountantReviewRoom.blockers.length > 0 ? 'blocked' : 'low', ['full_accounting_pilot_accountant_review_room']),
    ];
    const blockers = [...accountantReviewRoom.blockers];
    const outcomeStatus = resolveStatus(outcomeSignals.map((signal) => signal.status), blockers);

    return {
      ...input,
      generatedAt: this.nowProvider(),
      outcomeStatus,
      accountantReviewRoom,
      outcomeSignals,
      summary: {
        signalCount: outcomeSignals.length,
        readySignalCount: outcomeSignals.filter((signal) => signal.status === 'ready').length,
        highSignalCount: outcomeSignals.filter((signal) => signal.signalStrength === 'high').length,
        accountantAcceptanceCount: outcomeSignals.filter((signal) => signal.signalType === 'accountant_acceptance').length,
        graduationSignalCount: outcomeSignals.filter((signal) => signal.signalType === 'graduation_signal').length,
        hardeningSignalCount: outcomeSignals.filter((signal) => signal.signalType === 'hardening_signal').length,
      },
      blockers,
      nextStep: 'Cerrar Full Accounting controlled pilot 0.4.',
      guardrails: [
        'Outcome packet resume resultados del piloto; no gradua automaticamente.',
        'Los blockers repetidos deben volver a operations o readiness.',
      ],
    };
  }
}

export class RequestTenantFullAccountingControlledPilotCloseoutUseCase {
  constructor(
    private readonly getTenantFullAccountingPilotOutcomePacketUseCase: GetTenantFullAccountingPilotOutcomePacketUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: AccountingAdvancedDiscoveryInput): Promise<TenantFullAccountingControlledPilotCloseoutView> {
    const outcomePacket =
      await this.getTenantFullAccountingPilotOutcomePacketUseCase.execute(input);
    const { accountantReviewRoom } = outcomePacket;
    const { runbookWorkspace } = accountantReviewRoom;
    const { enrollmentFreeze } = runbookWorkspace;
    const { pilotAnchor } = enrollmentFreeze;
    const closeoutChecklist: TenantFullAccountingControlledPilotCloseoutView['closeoutChecklist'] = [
      fullAccountingControlledPilotCloseoutCheck('pilot_anchor', 'Full Accounting controlled pilot anchor', pilotAnchor.anchorStatus, ['full_accounting_controlled_pilot_anchor']),
      fullAccountingControlledPilotCloseoutCheck('enrollment_freeze', 'Pilot enrollment and period freeze', enrollmentFreeze.enrollmentStatus, ['full_accounting_pilot_enrollment_period_freeze']),
      fullAccountingControlledPilotCloseoutCheck('runbook_workspace', 'Pilot runbook workspace', runbookWorkspace.runbookStatus, ['full_accounting_pilot_runbook_workspace']),
      fullAccountingControlledPilotCloseoutCheck('accountant_review_room', 'Pilot accountant review room', accountantReviewRoom.reviewStatus, ['full_accounting_pilot_accountant_review_room']),
      fullAccountingControlledPilotCloseoutCheck('outcome_packet', 'Pilot outcome packet', outcomePacket.outcomeStatus, ['full_accounting_pilot_outcome_packet']),
    ];
    const blockers = unique([
      ...pilotAnchor.blockers,
      ...enrollmentFreeze.blockers,
      ...runbookWorkspace.blockers,
      ...accountantReviewRoom.blockers,
      ...outcomePacket.blockers,
    ]);
    const closeoutStatus = resolveStatus(closeoutChecklist.map((item) => item.status), blockers);
    const finalDecision = fullAccountingControlledPilotDecisionFromStatus(
      closeoutStatus,
      pilotAnchor,
      accountantReviewRoom,
      outcomePacket,
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      closeoutStatus,
      pilotAnchor,
      enrollmentFreeze,
      runbookWorkspace,
      accountantReviewRoom,
      outcomePacket,
      closeoutChecklist,
      finalDecision,
      summary: {
        checklistCount: closeoutChecklist.length,
        readyChecklistCount: closeoutChecklist.filter((item) => item.status === 'ready').length,
        blockedChecklistCount: closeoutChecklist.filter((item) => item.status === 'blocked').length,
        pilotLaneCount: pilotAnchor.summary.laneCount,
        frozenEvidenceCount: enrollmentFreeze.summary.evidenceCount,
        runbookStepCount: runbookWorkspace.summary.stepCount,
        reviewItemCount: accountantReviewRoom.summary.itemCount,
        outcomeSignalCount: outcomePacket.summary.signalCount,
      },
      blockers,
      nextStep:
        finalDecision === 'prepare_full_accounting_graduation'
          ? 'Preparar Full Accounting graduation 0.5.'
          : finalDecision === 'continue_controlled_pilot'
            ? 'Continuar piloto controlado con mas tenant-periods.'
            : finalDecision === 'return_to_mvp_operations'
              ? 'Volver a Full Accounting MVP Operations 0.3.'
              : finalDecision === 'return_to_mvp_readiness'
                ? 'Volver a Full Accounting MVP Readiness 0.2.'
                : 'Detener Full Accounting MVP por ahora.',
      guardrails: [
        'Controlled pilot closeout no abre contabilidad oficial por si solo.',
        'Graduation 0.5 debe decidir formalmente antes de emitir libros, conciliaciones certificadas o estados financieros.',
      ],
    };
  }
}

export class GetTenantFullAccountingGraduationAnchorUseCase {
  constructor(
    private readonly requestTenantFullAccountingControlledPilotCloseoutUseCase: RequestTenantFullAccountingControlledPilotCloseoutUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: AccountingAdvancedDiscoveryInput): Promise<TenantFullAccountingGraduationAnchorView> {
    const controlledPilotCloseout =
      await this.requestTenantFullAccountingControlledPilotCloseoutUseCase.execute(input);
    const graduationLanes: TenantFullAccountingGraduationAnchorView['graduationLanes'] = [
      fullAccountingGraduationLane('ledger', 'Ledger graduation lane', controlledPilotCloseout.pilotAnchor.anchorStatus, 'ledger', 'graduable', ['full_accounting_controlled_pilot_anchor']),
      fullAccountingGraduationLane('posting', 'Posting workflow graduation lane', controlledPilotCloseout.runbookWorkspace.runbookStatus, 'posting', 'graduable', ['full_accounting_pilot_runbook_workspace']),
      fullAccountingGraduationLane('bank_reconciliation', 'Bank reconciliation graduation lane', controlledPilotCloseout.outcomePacket.outcomeStatus, 'bank_reconciliation', 'needs_more_pilot', ['full_accounting_pilot_outcome_packet']),
      fullAccountingGraduationLane('financial_statements', 'Financial statements graduation lane', controlledPilotCloseout.accountantReviewRoom.reviewStatus, 'financial_statements', 'needs_hardening', ['full_accounting_pilot_accountant_review_room']),
      fullAccountingGraduationLane('statutory_boundary', 'Statutory boundary lane', 'ready', 'statutory_boundary', 'excluded', ['full_accounting_mvp_operations_closeout']),
      fullAccountingGraduationLane('professional_operations', 'Professional operations lane', controlledPilotCloseout.closeoutStatus, 'professional_operations', 'graduable', ['full_accounting_controlled_pilot_closeout']),
    ];
    const blockers =
      controlledPilotCloseout.finalDecision === 'prepare_full_accounting_graduation'
        ? [...controlledPilotCloseout.blockers]
        : unique([
            ...controlledPilotCloseout.blockers,
            `Full Accounting controlled pilot decision is ${controlledPilotCloseout.finalDecision}.`,
          ]);
    const anchorStatus = resolveStatus(graduationLanes.map((lane) => lane.status), blockers);

    return {
      ...input,
      generatedAt: this.nowProvider(),
      anchorStatus,
      controlledPilotCloseout,
      graduationLanes,
      summary: {
        laneCount: graduationLanes.length,
        readyLaneCount: graduationLanes.filter((lane) => lane.status === 'ready').length,
        graduableLaneCount: graduationLanes.filter((lane) => lane.graduationSignal === 'graduable').length,
        needsMorePilotLaneCount: graduationLanes.filter((lane) => lane.graduationSignal === 'needs_more_pilot').length,
        statutoryBoundaryLaneCount: graduationLanes.filter((lane) => lane.laneType === 'statutory_boundary').length,
        blockedLaneCount: graduationLanes.filter((lane) => lane.status === 'blocked').length,
      },
      blockers,
      nextStep: 'Armar graduation evidence dossier.',
      guardrails: [
        'Graduation anchor no abre producto oficial.',
        'La graduacion requiere alcance, modelo profesional y controles de riesgo separados.',
      ],
    };
  }
}

export class GetTenantFullAccountingGraduationEvidenceDossierUseCase {
  constructor(
    private readonly getTenantFullAccountingGraduationAnchorUseCase: GetTenantFullAccountingGraduationAnchorUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: AccountingAdvancedDiscoveryInput): Promise<TenantFullAccountingGraduationEvidenceDossierView> {
    const graduationAnchor =
      await this.getTenantFullAccountingGraduationAnchorUseCase.execute(input);
    const evidenceSections: TenantFullAccountingGraduationEvidenceDossierView['evidenceSections'] = [
      fullAccountingGraduationEvidenceSection('pilot_snapshot', 'Controlled pilot snapshot', graduationAnchor.anchorStatus, 'pilot_snapshot', ['full_accounting_controlled_pilot_closeout']),
      fullAccountingGraduationEvidenceSection('runbook_result', 'Pilot runbook results', graduationAnchor.controlledPilotCloseout.runbookWorkspace.runbookStatus, 'runbook_result', ['full_accounting_pilot_runbook_workspace']),
      fullAccountingGraduationEvidenceSection('accountant_recommendation', 'Accountant recommendation evidence', graduationAnchor.controlledPilotCloseout.accountantReviewRoom.reviewStatus, 'accountant_recommendation', ['full_accounting_pilot_accountant_review_room']),
      fullAccountingGraduationEvidenceSection('acceptance_signal', 'Accountant acceptance signal evidence', graduationAnchor.controlledPilotCloseout.outcomePacket.outcomeStatus, 'acceptance_signal', ['full_accounting_pilot_outcome_packet']),
      fullAccountingGraduationEvidenceSection('repeated_blocker', 'Repeated blocker evidence', graduationAnchor.blockers.length > 0 ? 'blocked' : 'ready', 'repeated_blocker', ['full_accounting_controlled_pilot_closeout']),
      fullAccountingGraduationEvidenceSection('guardrail_evidence', 'Graduation guardrail evidence', 'ready', 'guardrail_evidence', ['full_accounting_mvp_operations_closeout']),
    ];
    const blockers = [...graduationAnchor.blockers];
    const dossierStatus = resolveStatus(evidenceSections.map((section) => section.status), blockers);

    return {
      ...input,
      generatedAt: this.nowProvider(),
      dossierStatus,
      graduationAnchor,
      evidenceSections,
      summary: {
        sectionCount: evidenceSections.length,
        readySectionCount: evidenceSections.filter((section) => section.status === 'ready').length,
        snapshotSectionCount: evidenceSections.filter((section) => section.sectionType === 'pilot_snapshot').length,
        accountantRecommendationCount: evidenceSections.filter((section) => section.sectionType === 'accountant_recommendation').length,
        acceptanceSignalCount: evidenceSections.filter((section) => section.sectionType === 'acceptance_signal').length,
        blockerSectionCount: evidenceSections.filter((section) => section.sectionType === 'repeated_blocker' && section.status === 'blocked').length,
      },
      blockers,
      nextStep: 'Definir product scope graduation matrix.',
      guardrails: [
        'El dossier documenta evidencia; no certifica saldos.',
        'Las recomendaciones del contador son insumo de graduacion, no aprobacion estatutaria.',
      ],
    };
  }
}

export class GetTenantFullAccountingProductScopeGraduationMatrixUseCase {
  constructor(
    private readonly getTenantFullAccountingGraduationEvidenceDossierUseCase: GetTenantFullAccountingGraduationEvidenceDossierUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: AccountingAdvancedDiscoveryInput): Promise<TenantFullAccountingProductScopeGraduationMatrixView> {
    const graduationEvidenceDossier =
      await this.getTenantFullAccountingGraduationEvidenceDossierUseCase.execute(input);
    const moduleDecisions: TenantFullAccountingProductScopeGraduationMatrixView['moduleDecisions'] = [
      fullAccountingGraduationModuleDecision('ledger', 'Ledger module scope', graduationEvidenceDossier.dossierStatus, 'ledger', 'graduate', ['full_accounting_graduation_anchor']),
      fullAccountingGraduationModuleDecision('posting_workflow', 'Posting workflow module scope', graduationEvidenceDossier.dossierStatus, 'posting_workflow', 'graduate', ['full_accounting_pilot_runbook_workspace']),
      fullAccountingGraduationModuleDecision('bank_reconciliation', 'Bank reconciliation module scope', graduationEvidenceDossier.dossierStatus, 'bank_reconciliation', 'pilot_more', ['full_accounting_pilot_outcome_packet']),
      fullAccountingGraduationModuleDecision('trial_balance_statements', 'Trial balance and statements module scope', graduationEvidenceDossier.dossierStatus, 'trial_balance_statements', 'harden', ['full_accounting_pilot_accountant_review_room']),
      fullAccountingGraduationModuleDecision('legal_books', 'Legal books module scope', 'ready', 'legal_books', 'exclude', ['full_accounting_legal_books_boundary']),
      fullAccountingGraduationModuleDecision('professional_review', 'Professional review module scope', graduationEvidenceDossier.dossierStatus, 'professional_review', 'graduate', ['full_accounting_pilot_accountant_review_room']),
    ];
    const blockers = [...graduationEvidenceDossier.blockers];
    const matrixStatus = resolveStatus(moduleDecisions.map((decision) => decision.status), blockers);

    return {
      ...input,
      generatedAt: this.nowProvider(),
      matrixStatus,
      graduationEvidenceDossier,
      moduleDecisions,
      summary: {
        moduleCount: moduleDecisions.length,
        readyModuleCount: moduleDecisions.filter((decision) => decision.status === 'ready').length,
        graduateModuleCount: moduleDecisions.filter((decision) => decision.scopeDecision === 'graduate').length,
        pilotMoreModuleCount: moduleDecisions.filter((decision) => decision.scopeDecision === 'pilot_more').length,
        hardenModuleCount: moduleDecisions.filter((decision) => decision.scopeDecision === 'harden').length,
        excludedModuleCount: moduleDecisions.filter((decision) => decision.scopeDecision === 'exclude').length,
      },
      blockers,
      nextStep: 'Definir professional operating model.',
      guardrails: [
        'La matriz puede excluir legal books aunque otros modulos graduen.',
        'Scope graduate no significa emitir artefactos oficiales en este slice.',
      ],
    };
  }
}

export class GetTenantFullAccountingProfessionalOperatingModelUseCase {
  constructor(
    private readonly getTenantFullAccountingProductScopeGraduationMatrixUseCase: GetTenantFullAccountingProductScopeGraduationMatrixUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: AccountingAdvancedDiscoveryInput): Promise<TenantFullAccountingProfessionalOperatingModelView> {
    const productScopeMatrix =
      await this.getTenantFullAccountingProductScopeGraduationMatrixUseCase.execute(input);
    const responsibilityAssignments: TenantFullAccountingProfessionalOperatingModelView['responsibilityAssignments'] = [
      fullAccountingProfessionalResponsibility('ledger_operation', 'Ledger operation responsibility', productScopeMatrix.matrixStatus, 'ledger_operation', 'operator', 'platform_assisted', ['full_accounting_product_scope_graduation_matrix']),
      fullAccountingProfessionalResponsibility('posting_approval', 'Posting approval responsibility', productScopeMatrix.matrixStatus, 'posting_approval', 'external_accountant', 'human_approval', ['full_accounting_pilot_accountant_review_room']),
      fullAccountingProfessionalResponsibility('bank_review', 'Bank review responsibility', productScopeMatrix.matrixStatus, 'bank_review', 'external_accountant', 'human_approval', ['full_accounting_pilot_outcome_packet']),
      fullAccountingProfessionalResponsibility('statement_review', 'Statement review responsibility', productScopeMatrix.matrixStatus, 'statement_review', 'external_accountant', 'external_professional', ['full_accounting_financial_statements_blueprint']),
      fullAccountingProfessionalResponsibility('statutory_boundary', 'Statutory boundary responsibility', 'ready', 'statutory_boundary', 'legal_representative', 'excluded', ['full_accounting_legal_books_boundary']),
      fullAccountingProfessionalResponsibility('exception_resolution', 'Exception resolution responsibility', productScopeMatrix.matrixStatus, 'exception_resolution', 'operator', 'platform_assisted', ['accounting_corrections_queue']),
    ];
    const blockers = [...productScopeMatrix.blockers];
    const modelStatus = resolveStatus(responsibilityAssignments.map((assignment) => assignment.status), blockers);

    return {
      ...input,
      generatedAt: this.nowProvider(),
      modelStatus,
      productScopeMatrix,
      responsibilityAssignments,
      summary: {
        assignmentCount: responsibilityAssignments.length,
        readyAssignmentCount: responsibilityAssignments.filter((assignment) => assignment.status === 'ready').length,
        platformAssistedCount: responsibilityAssignments.filter((assignment) => assignment.automationBoundary === 'platform_assisted').length,
        humanApprovalCount: responsibilityAssignments.filter((assignment) => assignment.automationBoundary === 'human_approval').length,
        externalProfessionalCount: responsibilityAssignments.filter((assignment) => assignment.automationBoundary === 'external_professional').length,
        excludedAssignmentCount: responsibilityAssignments.filter((assignment) => assignment.automationBoundary === 'excluded').length,
      },
      blockers,
      nextStep: 'Preparar graduation risk and control pack.',
      guardrails: [
        'El modelo profesional conserva aprobaciones humanas donde hay riesgo contable.',
        'La plataforma asiste operaciones; no reemplaza contador, auditor ni representante legal.',
      ],
    };
  }
}

export class GetTenantFullAccountingGraduationRiskControlPackUseCase {
  constructor(
    private readonly getTenantFullAccountingProfessionalOperatingModelUseCase: GetTenantFullAccountingProfessionalOperatingModelUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: AccountingAdvancedDiscoveryInput): Promise<TenantFullAccountingGraduationRiskControlPackView> {
    const professionalOperatingModel =
      await this.getTenantFullAccountingProfessionalOperatingModelUseCase.execute(input);
    const riskControls: TenantFullAccountingGraduationRiskControlPackView['riskControls'] = [
      fullAccountingGraduationRiskControl('posting_error', 'Posting error control', professionalOperatingModel.modelStatus, 'posting_error', 'preventive', ['full_accounting_professional_operating_model']),
      fullAccountingGraduationRiskControl('bank_reconciliation_error', 'Bank reconciliation error control', professionalOperatingModel.modelStatus, 'bank_reconciliation_error', 'detective', ['full_accounting_product_scope_graduation_matrix']),
      fullAccountingGraduationRiskControl('statement_misstatement', 'Statement misstatement control', professionalOperatingModel.modelStatus, 'statement_misstatement', 'professional_review', ['full_accounting_financial_statements_blueprint']),
      fullAccountingGraduationRiskControl('statutory_non_compliance', 'Statutory non-compliance boundary', 'ready', 'statutory_non_compliance', 'excluded', ['full_accounting_legal_books_boundary']),
      fullAccountingGraduationRiskControl('professional_boundary', 'Professional boundary control', professionalOperatingModel.modelStatus, 'professional_boundary', 'professional_review', ['full_accounting_pilot_accountant_review_room']),
      fullAccountingGraduationRiskControl('rollback_condition', 'Graduation rollback condition', 'ready', 'rollback_condition', 'rollback', ['full_accounting_controlled_pilot_closeout']),
    ];
    const blockers = [...professionalOperatingModel.blockers];
    const packStatus = resolveStatus(riskControls.map((control) => control.status), blockers);

    return {
      ...input,
      generatedAt: this.nowProvider(),
      packStatus,
      professionalOperatingModel,
      riskControls,
      summary: {
        controlCount: riskControls.length,
        readyControlCount: riskControls.filter((control) => control.status === 'ready').length,
        preventiveControlCount: riskControls.filter((control) => control.controlMode === 'preventive').length,
        detectiveControlCount: riskControls.filter((control) => control.controlMode === 'detective').length,
        professionalReviewControlCount: riskControls.filter((control) => control.controlMode === 'professional_review').length,
        rollbackControlCount: riskControls.filter((control) => control.controlMode === 'rollback').length,
      },
      blockers,
      nextStep: 'Cerrar Full Accounting graduation 0.5.',
      guardrails: [
        'Risk controls son precondiciones de graduacion, no controles regulatorios certificados.',
        'Rollback sigue disponible si el producto no debe graduar.',
      ],
    };
  }
}

export class RequestTenantFullAccountingGraduationCloseoutUseCase {
  constructor(
    private readonly getTenantFullAccountingGraduationRiskControlPackUseCase: GetTenantFullAccountingGraduationRiskControlPackUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: AccountingAdvancedDiscoveryInput): Promise<TenantFullAccountingGraduationCloseoutView> {
    const riskControlPack =
      await this.getTenantFullAccountingGraduationRiskControlPackUseCase.execute(input);
    const { professionalOperatingModel } = riskControlPack;
    const { productScopeMatrix } = professionalOperatingModel;
    const { graduationEvidenceDossier } = productScopeMatrix;
    const { graduationAnchor } = graduationEvidenceDossier;
    const closeoutChecklist: TenantFullAccountingGraduationCloseoutView['closeoutChecklist'] = [
      fullAccountingGraduationCloseoutCheck('graduation_anchor', 'Full Accounting graduation anchor', graduationAnchor.anchorStatus, ['full_accounting_graduation_anchor']),
      fullAccountingGraduationCloseoutCheck('evidence_dossier', 'Graduation evidence dossier', graduationEvidenceDossier.dossierStatus, ['full_accounting_graduation_evidence_dossier']),
      fullAccountingGraduationCloseoutCheck('scope_matrix', 'Product scope graduation matrix', productScopeMatrix.matrixStatus, ['full_accounting_product_scope_graduation_matrix']),
      fullAccountingGraduationCloseoutCheck('professional_model', 'Professional operating model', professionalOperatingModel.modelStatus, ['full_accounting_professional_operating_model']),
      fullAccountingGraduationCloseoutCheck('risk_control_pack', 'Graduation risk and control pack', riskControlPack.packStatus, ['full_accounting_graduation_risk_control_pack']),
    ];
    const blockers = unique([
      ...graduationAnchor.blockers,
      ...graduationEvidenceDossier.blockers,
      ...productScopeMatrix.blockers,
      ...professionalOperatingModel.blockers,
      ...riskControlPack.blockers,
    ]);
    const closeoutStatus = resolveStatus(closeoutChecklist.map((item) => item.status), blockers);
    const finalDecision = fullAccountingGraduationDecisionFromStatus(
      closeoutStatus,
      graduationAnchor,
      productScopeMatrix,
      professionalOperatingModel,
      riskControlPack,
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      closeoutStatus,
      graduationAnchor,
      graduationEvidenceDossier,
      productScopeMatrix,
      professionalOperatingModel,
      riskControlPack,
      closeoutChecklist,
      finalDecision,
      summary: {
        checklistCount: closeoutChecklist.length,
        readyChecklistCount: closeoutChecklist.filter((item) => item.status === 'ready').length,
        blockedChecklistCount: closeoutChecklist.filter((item) => item.status === 'blocked').length,
        graduationLaneCount: graduationAnchor.summary.laneCount,
        evidenceSectionCount: graduationEvidenceDossier.summary.sectionCount,
        scopeModuleCount: productScopeMatrix.summary.moduleCount,
        responsibilityAssignmentCount: professionalOperatingModel.summary.assignmentCount,
        riskControlCount: riskControlPack.summary.controlCount,
      },
      blockers,
      nextStep:
        finalDecision === 'graduate_to_full_accounting_product_design'
          ? 'Preparar Full Accounting product design 0.6.'
          : finalDecision === 'continue_controlled_pilot'
            ? 'Continuar piloto controlado antes de graduar.'
            : finalDecision === 'return_to_mvp_operations'
              ? 'Volver a Full Accounting MVP Operations 0.3.'
              : finalDecision === 'return_to_mvp_readiness'
                ? 'Volver a Full Accounting MVP Readiness 0.2.'
                : 'No graduar Full Accounting por ahora.',
      guardrails: [
        'Graduation 0.5 decide si disenar producto; no emite contabilidad oficial.',
        'Legal books, estados financieros oficiales y certificaciones quedan fuera hasta product design formal.',
      ],
    };
  }
}

export class GetTenantFullAccountingProductDesignAnchorUseCase {
  constructor(
    private readonly requestTenantFullAccountingGraduationCloseoutUseCase: RequestTenantFullAccountingGraduationCloseoutUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: AccountingAdvancedDiscoveryInput): Promise<TenantFullAccountingProductDesignAnchorView> {
    const graduationCloseout =
      await this.requestTenantFullAccountingGraduationCloseoutUseCase.execute(input);
    const designLanes: TenantFullAccountingProductDesignAnchorView['designLanes'] = [
      fullAccountingProductDesignLane('ledger_operations', 'Ledger operations design lane', graduationCloseout.productScopeMatrix.matrixStatus, 'graduated_module', 'include', ['full_accounting_product_scope_graduation_matrix']),
      fullAccountingProductDesignLane('posting_workflow', 'Posting workflow design lane', graduationCloseout.professionalOperatingModel.modelStatus, 'graduated_module', 'include', ['full_accounting_professional_operating_model']),
      fullAccountingProductDesignLane('professional_review', 'Professional review design lane', graduationCloseout.professionalOperatingModel.modelStatus, 'professional_boundary', 'professional_review', ['full_accounting_professional_operating_model']),
      fullAccountingProductDesignLane('bank_reconciliation', 'Bank reconciliation limited design lane', graduationCloseout.productScopeMatrix.matrixStatus, 'pilot_module', 'limit', ['full_accounting_graduation_evidence_dossier']),
      fullAccountingProductDesignLane('trial_balance_statements', 'Trial balance statements hardening lane', graduationCloseout.riskControlPack.packStatus, 'hardening_module', 'harden', ['full_accounting_graduation_risk_control_pack']),
      fullAccountingProductDesignLane('legal_books', 'Legal books excluded design lane', 'ready', 'excluded_module', 'exclude', ['full_accounting_legal_books_boundary']),
    ];
    const blockers =
      graduationCloseout.finalDecision === 'graduate_to_full_accounting_product_design'
        ? [...graduationCloseout.blockers]
        : unique([
            ...graduationCloseout.blockers,
            `Full Accounting graduation decision is ${graduationCloseout.finalDecision}.`,
          ]);
    const anchorStatus = resolveStatus(designLanes.map((lane) => lane.status), blockers);

    return {
      ...input,
      generatedAt: this.nowProvider(),
      anchorStatus,
      graduationCloseout,
      designLanes,
      summary: {
        laneCount: designLanes.length,
        readyLaneCount: designLanes.filter((lane) => lane.status === 'ready').length,
        includedLaneCount: designLanes.filter((lane) => lane.designMode === 'include').length,
        limitedLaneCount: designLanes.filter((lane) => lane.designMode === 'limit').length,
        excludedLaneCount: designLanes.filter((lane) => lane.designMode === 'exclude').length,
        blockedLaneCount: designLanes.filter((lane) => lane.status === 'blocked').length,
      },
      blockers,
      nextStep: 'Definir product scope contract.',
      guardrails: [
        'Product design 0.6 disena el producto; no ejecuta contabilidad oficial.',
        'Los modulos excluidos no deben aparecer como artefactos oficiales.',
      ],
    };
  }
}

export class GetTenantFullAccountingProductScopeContractUseCase {
  constructor(
    private readonly getTenantFullAccountingProductDesignAnchorUseCase: GetTenantFullAccountingProductDesignAnchorUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: AccountingAdvancedDiscoveryInput): Promise<TenantFullAccountingProductScopeContractView> {
    const productDesignAnchor =
      await this.getTenantFullAccountingProductDesignAnchorUseCase.execute(input);
    const scopeItems: TenantFullAccountingProductScopeContractView['scopeItems'] = [
      fullAccountingProductScopeItem('ledger_operations', 'Ledger operations scope', productDesignAnchor.anchorStatus, 'ledger_operations', 'included', 'Graduation includes ledger operations.', 'Ledger operations design contract approved.', ['full_accounting_product_design_anchor']),
      fullAccountingProductScopeItem('posting_workflow', 'Posting workflow scope', productDesignAnchor.anchorStatus, 'posting_workflow', 'included', 'Posting workflow has human approval boundary.', 'Posting workflow controls approved.', ['full_accounting_professional_operating_model']),
      fullAccountingProductScopeItem('professional_review', 'Professional review scope', productDesignAnchor.anchorStatus, 'professional_review', 'included', 'External accountant review remains required.', 'Professional review workflow approved.', ['full_accounting_professional_operating_model']),
      fullAccountingProductScopeItem('bank_reconciliation', 'Bank reconciliation limited scope', productDesignAnchor.anchorStatus, 'bank_reconciliation', 'limited_pilot', 'Bank evidence remains pilot-limited.', 'Certified bank reconciliation excluded.', ['full_accounting_graduation_risk_control_pack']),
      fullAccountingProductScopeItem('trial_balance_statements', 'Trial balance statements limited scope', productDesignAnchor.anchorStatus, 'trial_balance_statements', 'limited_pilot', 'Statements remain previews.', 'Preview statement boundary approved.', ['full_accounting_graduation_evidence_dossier']),
      fullAccountingProductScopeItem('legal_books', 'Legal books excluded scope', 'ready', 'legal_books', 'excluded', 'Legal books require statutory product.', 'Legal books remain excluded.', ['full_accounting_legal_books_boundary']),
      fullAccountingProductScopeItem('statutory_certification', 'Statutory certification excluded scope', 'ready', 'statutory_certification', 'excluded', 'Certification requires external professional authority.', 'Certification remains external-only.', ['full_accounting_graduation_risk_control_pack']),
    ];
    const blockers = [...productDesignAnchor.blockers];
    const contractStatus = resolveStatus(scopeItems.map((item) => item.status), blockers);

    return {
      ...input,
      generatedAt: this.nowProvider(),
      contractStatus,
      productDesignAnchor,
      scopeItems,
      summary: {
        itemCount: scopeItems.length,
        readyItemCount: scopeItems.filter((item) => item.status === 'ready').length,
        includedItemCount: scopeItems.filter((item) => item.scopeMode === 'included').length,
        limitedItemCount: scopeItems.filter((item) => item.scopeMode === 'limited_pilot').length,
        excludedItemCount: scopeItems.filter((item) => item.scopeMode === 'excluded').length,
      },
      blockers,
      nextStep: 'Definir professional responsibility matrix.',
      guardrails: [
        'Scope contract no habilita libros legales ni certificaciones.',
        'Los modulos limited_pilot siguen sujetos a controles y revision profesional.',
      ],
    };
  }
}

export class GetTenantFullAccountingProductProfessionalResponsibilityMatrixUseCase {
  constructor(
    private readonly getTenantFullAccountingProductScopeContractUseCase: GetTenantFullAccountingProductScopeContractUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: AccountingAdvancedDiscoveryInput): Promise<TenantFullAccountingProductProfessionalResponsibilityMatrixView> {
    const scopeContract =
      await this.getTenantFullAccountingProductScopeContractUseCase.execute(input);
    const responsibilities: TenantFullAccountingProductProfessionalResponsibilityMatrixView['responsibilities'] = [
      fullAccountingProductResponsibility('platform_assisted_ledger', 'Platform assisted ledger design', scopeContract.contractStatus, 'platform_assisted', 'platform', ['full_accounting_product_scope_contract']),
      fullAccountingProductResponsibility('operator_ledger_review', 'Operator ledger review', scopeContract.contractStatus, 'operator_owned', 'operator', ['full_accounting_product_scope_contract']),
      fullAccountingProductResponsibility('accountant_posting_approval', 'External accountant posting approval', scopeContract.contractStatus, 'external_accountant_approval', 'external_accountant', ['full_accounting_professional_operating_model']),
      fullAccountingProductResponsibility('auditor_boundary', 'Auditor boundary', 'ready', 'auditor_boundary', 'auditor', ['full_accounting_graduation_risk_control_pack']),
      fullAccountingProductResponsibility('legal_representative_boundary', 'Legal representative boundary', 'ready', 'legal_representative_boundary', 'legal_representative', ['full_accounting_legal_books_boundary']),
      fullAccountingProductResponsibility('system_never_alone', 'System must never post or certify alone', 'ready', 'never_alone', 'platform', ['full_accounting_graduation_closeout']),
    ];
    const blockers = [...scopeContract.blockers];
    const matrixStatus = resolveStatus(responsibilities.map((item) => item.status), blockers);

    return {
      ...input,
      generatedAt: this.nowProvider(),
      matrixStatus,
      scopeContract,
      responsibilities,
      summary: {
        responsibilityCount: responsibilities.length,
        readyResponsibilityCount: responsibilities.filter((item) => item.status === 'ready').length,
        platformAssistedCount: responsibilities.filter((item) => item.responsibilityType === 'platform_assisted').length,
        operatorOwnedCount: responsibilities.filter((item) => item.responsibilityType === 'operator_owned').length,
        accountantApprovalCount: responsibilities.filter((item) => item.responsibilityType === 'external_accountant_approval').length,
        neverAloneCount: responsibilities.filter((item) => item.responsibilityType === 'never_alone').length,
      },
      blockers,
      nextStep: 'Definir official artifact boundary registry.',
      guardrails: [
        'La matriz exige humano para aprobaciones contables sensibles.',
        'El sistema nunca debe postear, certificar o legalizar solo.',
      ],
    };
  }
}

export class GetTenantFullAccountingOfficialArtifactBoundaryRegistryUseCase {
  constructor(
    private readonly getTenantFullAccountingProductProfessionalResponsibilityMatrixUseCase: GetTenantFullAccountingProductProfessionalResponsibilityMatrixUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: AccountingAdvancedDiscoveryInput): Promise<TenantFullAccountingOfficialArtifactBoundaryRegistryView> {
    const responsibilityMatrix =
      await this.getTenantFullAccountingProductProfessionalResponsibilityMatrixUseCase.execute(input);
    const artifacts: TenantFullAccountingOfficialArtifactBoundaryRegistryView['artifacts'] = [
      fullAccountingProductArtifact('ledger_draft_packet', 'Ledger draft packet', responsibilityMatrix.matrixStatus, 'ledger_draft_packet', 'internal', ['full_accounting_product_scope_contract']),
      fullAccountingProductArtifact('posting_approval_packet', 'Posting approval packet', responsibilityMatrix.matrixStatus, 'posting_approval_packet', 'professional_review', ['full_accounting_product_professional_responsibility_matrix']),
      fullAccountingProductArtifact('reconciliation_evidence_packet', 'Reconciliation evidence packet', responsibilityMatrix.matrixStatus, 'reconciliation_evidence_packet', 'draft', ['full_accounting_product_scope_contract']),
      fullAccountingProductArtifact('trial_balance_preview', 'Trial balance preview', responsibilityMatrix.matrixStatus, 'trial_balance_preview', 'draft', ['full_accounting_product_scope_contract']),
      fullAccountingProductArtifact('certified_reconciliation', 'Certified reconciliation', 'ready', 'certified_reconciliation', 'external_only', ['full_accounting_graduation_risk_control_pack']),
      fullAccountingProductArtifact('signed_financial_statements', 'Signed financial statements', 'ready', 'signed_financial_statements', 'external_only', ['full_accounting_graduation_risk_control_pack']),
      fullAccountingProductArtifact('legal_books', 'Legal books', 'ready', 'legal_books', 'excluded', ['full_accounting_legal_books_boundary']),
      fullAccountingProductArtifact('statutory_filings', 'Statutory filings', 'ready', 'statutory_filings', 'excluded', ['full_accounting_graduation_closeout']),
    ];
    const blockers = [...responsibilityMatrix.blockers];
    const registryStatus = resolveStatus(artifacts.map((artifact) => artifact.status), blockers);

    return {
      ...input,
      generatedAt: this.nowProvider(),
      registryStatus,
      responsibilityMatrix,
      artifacts,
      summary: {
        artifactCount: artifacts.length,
        readyArtifactCount: artifacts.filter((artifact) => artifact.status === 'ready').length,
        internalArtifactCount: artifacts.filter((artifact) => artifact.artifactStatus === 'internal').length,
        draftArtifactCount: artifacts.filter((artifact) => artifact.artifactStatus === 'draft').length,
        professionalReviewArtifactCount: artifacts.filter((artifact) => artifact.artifactStatus === 'professional_review').length,
        externalOnlyArtifactCount: artifacts.filter((artifact) => artifact.artifactStatus === 'external_only').length,
        excludedArtifactCount: artifacts.filter((artifact) => artifact.artifactStatus === 'excluded').length,
      },
      blockers,
      nextStep: 'Definir workflow and control blueprint.',
      guardrails: [
        'Artefactos external_only no son generados ni certificados por la plataforma.',
        'Los previews no son estados financieros oficiales.',
      ],
    };
  }
}

export class GetTenantFullAccountingWorkflowControlBlueprintUseCase {
  constructor(
    private readonly getTenantFullAccountingOfficialArtifactBoundaryRegistryUseCase: GetTenantFullAccountingOfficialArtifactBoundaryRegistryUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: AccountingAdvancedDiscoveryInput): Promise<TenantFullAccountingWorkflowControlBlueprintView> {
    const artifactBoundaryRegistry =
      await this.getTenantFullAccountingOfficialArtifactBoundaryRegistryUseCase.execute(input);
    const workflowStages: TenantFullAccountingWorkflowControlBlueprintView['workflowStages'] = [
      fullAccountingWorkflowStage('intake', 'Accounting intake stage', artifactBoundaryRegistry.registryStatus, 'intake', 'evidence_completeness', ['accounting_intake_workspace']),
      fullAccountingWorkflowStage('ledger_preparation', 'Ledger preparation stage', artifactBoundaryRegistry.registryStatus, 'ledger_preparation', 'evidence_completeness', ['full_accounting_product_scope_contract']),
      fullAccountingWorkflowStage('posting_approval', 'Posting approval stage', artifactBoundaryRegistry.registryStatus, 'posting_approval', 'approval_required', ['full_accounting_product_professional_responsibility_matrix']),
      fullAccountingWorkflowStage('bank_evidence_review', 'Bank evidence review stage', artifactBoundaryRegistry.registryStatus, 'bank_evidence_review', 'professional_review_gate', ['full_accounting_official_artifact_boundary_registry']),
      fullAccountingWorkflowStage('trial_balance_preview', 'Trial balance preview stage', artifactBoundaryRegistry.registryStatus, 'trial_balance_preview', 'professional_review_gate', ['full_accounting_official_artifact_boundary_registry']),
      fullAccountingWorkflowStage('accountant_review', 'Accountant review stage', artifactBoundaryRegistry.registryStatus, 'accountant_review', 'approval_required', ['full_accounting_product_professional_responsibility_matrix']),
      fullAccountingWorkflowStage('closeout_recommendation', 'Closeout recommendation stage', 'ready', 'closeout_recommendation', 'rollback_condition', ['full_accounting_graduation_risk_control_pack']),
    ];
    const blockers = [...artifactBoundaryRegistry.blockers];
    const blueprintStatus = resolveStatus(workflowStages.map((stage) => stage.status), blockers);

    return {
      ...input,
      generatedAt: this.nowProvider(),
      blueprintStatus,
      artifactBoundaryRegistry,
      workflowStages,
      summary: {
        stageCount: workflowStages.length,
        readyStageCount: workflowStages.filter((stage) => stage.status === 'ready').length,
        approvalRequiredCount: workflowStages.filter((stage) => stage.controlType === 'approval_required').length,
        rollbackConditionCount: workflowStages.filter((stage) => stage.controlType === 'rollback_condition').length,
        evidenceCompletenessCount: workflowStages.filter((stage) => stage.controlType === 'evidence_completeness').length,
        professionalReviewGateCount: workflowStages.filter((stage) => stage.controlType === 'professional_review_gate').length,
      },
      blockers,
      nextStep: 'Cerrar Full Accounting product design 0.6.',
      guardrails: [
        'Workflow blueprint disena controles; no ejecuta cierres oficiales.',
        'Professional review gate permanece antes de cualquier artefacto formal.',
      ],
    };
  }
}

export class RequestTenantFullAccountingProductDesignCloseoutUseCase {
  constructor(
    private readonly getTenantFullAccountingWorkflowControlBlueprintUseCase: GetTenantFullAccountingWorkflowControlBlueprintUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: AccountingAdvancedDiscoveryInput): Promise<TenantFullAccountingProductDesignCloseoutView> {
    const workflowControlBlueprint =
      await this.getTenantFullAccountingWorkflowControlBlueprintUseCase.execute(input);
    const { artifactBoundaryRegistry } = workflowControlBlueprint;
    const { responsibilityMatrix } = artifactBoundaryRegistry;
    const { scopeContract } = responsibilityMatrix;
    const { productDesignAnchor } = scopeContract;
    const closeoutChecklist: TenantFullAccountingProductDesignCloseoutView['closeoutChecklist'] = [
      fullAccountingProductDesignCloseoutCheck('product_design_anchor', 'Full Accounting product design anchor', productDesignAnchor.anchorStatus, ['full_accounting_product_design_anchor']),
      fullAccountingProductDesignCloseoutCheck('scope_contract', 'Product scope contract', scopeContract.contractStatus, ['full_accounting_product_scope_contract']),
      fullAccountingProductDesignCloseoutCheck('responsibility_matrix', 'Professional responsibility matrix', responsibilityMatrix.matrixStatus, ['full_accounting_product_professional_responsibility_matrix']),
      fullAccountingProductDesignCloseoutCheck('artifact_boundary_registry', 'Official artifact boundary registry', artifactBoundaryRegistry.registryStatus, ['full_accounting_official_artifact_boundary_registry']),
      fullAccountingProductDesignCloseoutCheck('workflow_control_blueprint', 'Workflow and control blueprint', workflowControlBlueprint.blueprintStatus, ['full_accounting_workflow_control_blueprint']),
    ];
    const blockers = unique([
      ...productDesignAnchor.blockers,
      ...scopeContract.blockers,
      ...responsibilityMatrix.blockers,
      ...artifactBoundaryRegistry.blockers,
      ...workflowControlBlueprint.blockers,
    ]);
    const closeoutStatus = resolveStatus(closeoutChecklist.map((item) => item.status), blockers);
    const finalDecision = fullAccountingProductDesignDecisionFromStatus(
      closeoutStatus,
      productDesignAnchor,
      scopeContract,
      responsibilityMatrix,
      artifactBoundaryRegistry,
      workflowControlBlueprint,
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      closeoutStatus,
      productDesignAnchor,
      scopeContract,
      responsibilityMatrix,
      artifactBoundaryRegistry,
      workflowControlBlueprint,
      closeoutChecklist,
      finalDecision,
      summary: {
        checklistCount: closeoutChecklist.length,
        readyChecklistCount: closeoutChecklist.filter((item) => item.status === 'ready').length,
        blockedChecklistCount: closeoutChecklist.filter((item) => item.status === 'blocked').length,
        designLaneCount: productDesignAnchor.summary.laneCount,
        scopeItemCount: scopeContract.summary.itemCount,
        responsibilityCount: responsibilityMatrix.summary.responsibilityCount,
        artifactCount: artifactBoundaryRegistry.summary.artifactCount,
        workflowStageCount: workflowControlBlueprint.summary.stageCount,
      },
      blockers,
      nextStep:
        finalDecision === 'open_formal_readiness'
          ? 'Preparar Full Accounting formal readiness 0.7.'
          : finalDecision === 'continue_product_design'
            ? 'Continuar product design antes de readiness formal.'
            : finalDecision === 'return_to_graduation'
              ? 'Volver a Full Accounting graduation 0.5.'
              : finalDecision === 'return_to_controlled_pilot'
                ? 'Volver a Full Accounting controlled pilot 0.4.'
                : 'No disenar Full Accounting product por ahora.',
      guardrails: [
        'Product design closeout no crea postings, libros legales ni estados financieros oficiales.',
        'Formal readiness debe abrirse separado antes de cualquier ejecucion formal.',
      ],
    };
  }
}

export class GetTenantFullAccountingFormalReadinessAnchorUseCase {
  constructor(
    private readonly requestTenantFullAccountingProductDesignCloseoutUseCase: RequestTenantFullAccountingProductDesignCloseoutUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: AccountingAdvancedDiscoveryInput): Promise<TenantFullAccountingFormalReadinessAnchorView> {
    const productDesignCloseout =
      await this.requestTenantFullAccountingProductDesignCloseoutUseCase.execute(input);
    const readinessLanes: TenantFullAccountingFormalReadinessAnchorView['readinessLanes'] = [
      fullAccountingFormalReadinessLane('ledger', 'Formal ledger readiness lane', productDesignCloseout.scopeContract.contractStatus, 'ledger', 'formal_ready', ['full_accounting_product_scope_contract']),
      fullAccountingFormalReadinessLane('posting_approval', 'Posting approval readiness lane', productDesignCloseout.responsibilityMatrix.matrixStatus, 'posting_approval', 'policy_required', ['full_accounting_product_professional_responsibility_matrix']),
      fullAccountingFormalReadinessLane('bank_evidence', 'Bank evidence readiness lane', productDesignCloseout.artifactBoundaryRegistry.registryStatus, 'bank_evidence', 'professional_required', ['full_accounting_official_artifact_boundary_registry']),
      fullAccountingFormalReadinessLane('statement_preview', 'Statement preview readiness lane', productDesignCloseout.workflowControlBlueprint.blueprintStatus, 'statement_preview', 'professional_required', ['full_accounting_workflow_control_blueprint']),
      fullAccountingFormalReadinessLane('professional_review', 'Professional review readiness lane', productDesignCloseout.closeoutStatus, 'professional_review', 'professional_required', ['full_accounting_product_design_closeout']),
      fullAccountingFormalReadinessLane('statutory_exclusion', 'Statutory exclusion readiness lane', 'ready', 'statutory_exclusion', 'excluded', ['full_accounting_official_artifact_boundary_registry']),
    ];
    const blockers =
      productDesignCloseout.finalDecision === 'open_formal_readiness'
        ? [...productDesignCloseout.blockers]
        : unique([
            ...productDesignCloseout.blockers,
            `Full Accounting product design decision is ${productDesignCloseout.finalDecision}.`,
          ]);
    const anchorStatus = resolveStatus(readinessLanes.map((lane) => lane.status), blockers);

    return {
      ...input,
      generatedAt: this.nowProvider(),
      anchorStatus,
      productDesignCloseout,
      readinessLanes,
      summary: {
        laneCount: readinessLanes.length,
        readyLaneCount: readinessLanes.filter((lane) => lane.status === 'ready').length,
        formalReadyLaneCount: readinessLanes.filter((lane) => lane.readinessMode === 'formal_ready').length,
        professionalRequiredLaneCount: readinessLanes.filter((lane) => lane.readinessMode === 'professional_required').length,
        excludedLaneCount: readinessLanes.filter((lane) => lane.readinessMode === 'excluded').length,
        blockedLaneCount: readinessLanes.filter((lane) => lane.status === 'blocked').length,
      },
      blockers,
      nextStep: 'Preparar policy and template registry.',
      guardrails: [
        'Formal readiness 0.7 prepara condiciones; no ejecuta actos oficiales.',
        'Statutory exclusions permanecen fuera del producto.',
      ],
    };
  }
}

export class GetTenantFullAccountingPolicyTemplateRegistryUseCase {
  constructor(
    private readonly getTenantFullAccountingFormalReadinessAnchorUseCase: GetTenantFullAccountingFormalReadinessAnchorUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: AccountingAdvancedDiscoveryInput): Promise<TenantFullAccountingPolicyTemplateRegistryView> {
    const formalReadinessAnchor =
      await this.getTenantFullAccountingFormalReadinessAnchorUseCase.execute(input);
    const templates: TenantFullAccountingPolicyTemplateRegistryView['templates'] = [
      fullAccountingPolicyTemplate('accounting_policy', 'Accounting policy template', formalReadinessAnchor.anchorStatus, 'accounting_policy', 'ready', ['full_accounting_product_scope_contract']),
      fullAccountingPolicyTemplate('posting_approval_policy', 'Posting approval policy template', formalReadinessAnchor.anchorStatus, 'posting_approval_policy', 'requires_review', ['full_accounting_product_professional_responsibility_matrix']),
      fullAccountingPolicyTemplate('evidence_completeness_policy', 'Evidence completeness policy template', formalReadinessAnchor.anchorStatus, 'evidence_completeness_policy', 'ready', ['full_accounting_workflow_control_blueprint']),
      fullAccountingPolicyTemplate('professional_review_template', 'Professional review template', formalReadinessAnchor.anchorStatus, 'professional_review_template', 'requires_review', ['full_accounting_product_design_closeout']),
      fullAccountingPolicyTemplate('closeout_recommendation_template', 'Closeout recommendation template', 'ready', 'closeout_recommendation_template', 'ready', ['full_accounting_workflow_control_blueprint']),
      fullAccountingPolicyTemplate('excluded_statutory_template', 'Excluded statutory template', 'ready', 'excluded_statutory_template', 'excluded', ['full_accounting_official_artifact_boundary_registry']),
    ];
    const blockers = [...formalReadinessAnchor.blockers];
    const registryStatus = resolveStatus(templates.map((template) => template.status), blockers);

    return {
      ...input,
      generatedAt: this.nowProvider(),
      registryStatus,
      formalReadinessAnchor,
      templates,
      summary: {
        templateCount: templates.length,
        readyTemplateCount: templates.filter((template) => template.status === 'ready').length,
        reviewTemplateCount: templates.filter((template) => template.templateMode === 'requires_review').length,
        excludedTemplateCount: templates.filter((template) => template.templateMode === 'excluded').length,
      },
      blockers,
      nextStep: 'Preparar professional portal readiness shell.',
      guardrails: [
        'Policy templates no constituyen asesoria contable oficial.',
        'Templates estatutarios excluidos no deben usarse para filing o legal books.',
      ],
    };
  }
}

export class GetTenantFullAccountingProfessionalPortalReadinessShellUseCase {
  constructor(
    private readonly getTenantFullAccountingPolicyTemplateRegistryUseCase: GetTenantFullAccountingPolicyTemplateRegistryUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: AccountingAdvancedDiscoveryInput): Promise<TenantFullAccountingProfessionalPortalReadinessShellView> {
    const policyTemplateRegistry =
      await this.getTenantFullAccountingPolicyTemplateRegistryUseCase.execute(input);
    const shellItems: TenantFullAccountingProfessionalPortalReadinessShellView['shellItems'] = [
      fullAccountingProfessionalPortalShellItem('external_accountant_workspace', 'External accountant workspace shell', policyTemplateRegistry.registryStatus, 'external_accountant_workspace', 'external_accountant', ['full_accounting_policy_template_registry']),
      fullAccountingProfessionalPortalShellItem('review_queue', 'Professional review queue shell', policyTemplateRegistry.registryStatus, 'review_queue', 'external_accountant', ['full_accounting_policy_template_registry']),
      fullAccountingProfessionalPortalShellItem('evidence_packet_intake', 'Evidence packet intake shell', policyTemplateRegistry.registryStatus, 'evidence_packet_intake', 'operator', ['full_accounting_official_artifact_boundary_registry']),
      fullAccountingProfessionalPortalShellItem('approval_rejection', 'Approval rejection shell', policyTemplateRegistry.registryStatus, 'approval_rejection', 'external_accountant', ['full_accounting_product_professional_responsibility_matrix']),
      fullAccountingProfessionalPortalShellItem('professional_notes', 'Professional notes shell', 'ready', 'professional_notes', 'external_accountant', ['full_accounting_product_design_closeout']),
      fullAccountingProfessionalPortalShellItem('signature_certification_exclusion', 'Signature and certification exclusion shell', 'ready', 'signature_certification_exclusion', 'platform', ['full_accounting_official_artifact_boundary_registry']),
    ];
    const blockers = [...policyTemplateRegistry.blockers];
    const shellStatus = resolveStatus(shellItems.map((item) => item.status), blockers);

    return {
      ...input,
      generatedAt: this.nowProvider(),
      shellStatus,
      policyTemplateRegistry,
      shellItems,
      summary: {
        shellItemCount: shellItems.length,
        readyShellItemCount: shellItems.filter((item) => item.status === 'ready').length,
        accountantOwnedCount: shellItems.filter((item) => item.owner === 'external_accountant').length,
        excludedShellItemCount: shellItems.filter((item) => item.shellType === 'signature_certification_exclusion').length,
      },
      blockers,
      nextStep: 'Preparar formal ledger and posting readiness pack.',
      guardrails: [
        'Portal shell no firma, certifica ni legaliza.',
        'Professional notes son evidencia de revision, no dictamen oficial.',
      ],
    };
  }
}

export class GetTenantFullAccountingFormalLedgerPostingReadinessPackUseCase {
  constructor(
    private readonly getTenantFullAccountingProfessionalPortalReadinessShellUseCase: GetTenantFullAccountingProfessionalPortalReadinessShellUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: AccountingAdvancedDiscoveryInput): Promise<TenantFullAccountingFormalLedgerPostingReadinessPackView> {
    const professionalPortalShell =
      await this.getTenantFullAccountingProfessionalPortalReadinessShellUseCase.execute(input);
    const readinessItems: TenantFullAccountingFormalLedgerPostingReadinessPackView['readinessItems'] = [
      fullAccountingLedgerPostingReadinessItem('ledger_structure', 'Ledger structure readiness', professionalPortalShell.shellStatus, 'ledger_structure', 'structure', ['full_accounting_product_scope_contract']),
      fullAccountingLedgerPostingReadinessItem('journal_batch', 'Journal batch readiness', professionalPortalShell.shellStatus, 'journal_batch', 'structure', ['full_accounting_product_scope_contract']),
      fullAccountingLedgerPostingReadinessItem('posting_approval_gate', 'Posting approval gate readiness', professionalPortalShell.shellStatus, 'posting_approval_gate', 'approval_gate', ['full_accounting_product_professional_responsibility_matrix']),
      fullAccountingLedgerPostingReadinessItem('reversal_readiness', 'Reversal readiness', professionalPortalShell.shellStatus, 'reversal_readiness', 'rollback', ['full_accounting_graduation_risk_control_pack']),
      fullAccountingLedgerPostingReadinessItem('period_lock_readiness', 'Period lock readiness', professionalPortalShell.shellStatus, 'period_lock_readiness', 'lock_preview', ['accounting_period_lock_readiness']),
      fullAccountingLedgerPostingReadinessItem('invariant_check', 'Ledger invariant check readiness', 'ready', 'invariant_check', 'invariant', ['full_accounting_workflow_control_blueprint']),
    ];
    const blockers = [...professionalPortalShell.blockers];
    const packStatus = resolveStatus(readinessItems.map((item) => item.status), blockers);

    return {
      ...input,
      generatedAt: this.nowProvider(),
      packStatus,
      professionalPortalShell,
      readinessItems,
      summary: {
        itemCount: readinessItems.length,
        readyItemCount: readinessItems.filter((item) => item.status === 'ready').length,
        approvalGateCount: readinessItems.filter((item) => item.controlMode === 'approval_gate').length,
        rollbackCount: readinessItems.filter((item) => item.controlMode === 'rollback').length,
        invariantCount: readinessItems.filter((item) => item.controlMode === 'invariant').length,
      },
      blockers,
      nextStep: 'Preparar statement and bank formal boundary pack.',
      guardrails: [
        'Ledger/posting readiness no postea asientos.',
        'Period locks son readiness/previews hasta que exista ejecucion formal.',
      ],
    };
  }
}

export class GetTenantFullAccountingStatementBankFormalBoundaryPackUseCase {
  constructor(
    private readonly getTenantFullAccountingFormalLedgerPostingReadinessPackUseCase: GetTenantFullAccountingFormalLedgerPostingReadinessPackUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: AccountingAdvancedDiscoveryInput): Promise<TenantFullAccountingStatementBankFormalBoundaryPackView> {
    const ledgerPostingReadinessPack =
      await this.getTenantFullAccountingFormalLedgerPostingReadinessPackUseCase.execute(input);
    const boundaryItems: TenantFullAccountingStatementBankFormalBoundaryPackView['boundaryItems'] = [
      fullAccountingStatementBankBoundaryItem('bank_evidence_readiness', 'Bank evidence readiness', ledgerPostingReadinessPack.packStatus, 'bank_evidence_readiness', 'ready', ['full_accounting_official_artifact_boundary_registry']),
      fullAccountingStatementBankBoundaryItem('certified_reconciliation_boundary', 'Certified reconciliation boundary', 'ready', 'certified_reconciliation_boundary', 'external_only', ['full_accounting_official_artifact_boundary_registry']),
      fullAccountingStatementBankBoundaryItem('trial_balance_preview_readiness', 'Trial balance preview readiness', ledgerPostingReadinessPack.packStatus, 'trial_balance_preview_readiness', 'ready', ['full_accounting_workflow_control_blueprint']),
      fullAccountingStatementBankBoundaryItem('financial_statement_draft_readiness', 'Financial statement draft readiness', ledgerPostingReadinessPack.packStatus, 'financial_statement_draft_readiness', 'professional_review', ['full_accounting_product_scope_contract']),
      fullAccountingStatementBankBoundaryItem('professional_review_requirement', 'Professional review requirement', ledgerPostingReadinessPack.packStatus, 'professional_review_requirement', 'professional_review', ['full_accounting_professional_portal_readiness_shell']),
      fullAccountingStatementBankBoundaryItem('external_certification_boundary', 'External certification boundary', 'ready', 'external_certification_boundary', 'external_only', ['full_accounting_official_artifact_boundary_registry']),
    ];
    const blockers = [...ledgerPostingReadinessPack.blockers];
    const packStatus = resolveStatus(boundaryItems.map((item) => item.status), blockers);

    return {
      ...input,
      generatedAt: this.nowProvider(),
      packStatus,
      ledgerPostingReadinessPack,
      boundaryItems,
      summary: {
        boundaryCount: boundaryItems.length,
        readyBoundaryCount: boundaryItems.filter((item) => item.status === 'ready').length,
        professionalReviewCount: boundaryItems.filter((item) => item.boundaryMode === 'professional_review').length,
        externalOnlyCount: boundaryItems.filter((item) => item.boundaryMode === 'external_only').length,
        excludedBoundaryCount: boundaryItems.filter((item) => item.boundaryMode === 'excluded').length,
      },
      blockers,
      nextStep: 'Cerrar Full Accounting formal readiness 0.7.',
      guardrails: [
        'Boundary pack no certifica conciliaciones.',
        'Draft statements requieren revision profesional antes de cualquier uso formal.',
      ],
    };
  }
}

export class RequestTenantFullAccountingFormalReadinessCloseoutUseCase {
  constructor(
    private readonly getTenantFullAccountingStatementBankFormalBoundaryPackUseCase: GetTenantFullAccountingStatementBankFormalBoundaryPackUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: AccountingAdvancedDiscoveryInput): Promise<TenantFullAccountingFormalReadinessCloseoutView> {
    const statementBankBoundaryPack =
      await this.getTenantFullAccountingStatementBankFormalBoundaryPackUseCase.execute(input);
    const { ledgerPostingReadinessPack } = statementBankBoundaryPack;
    const { professionalPortalShell } = ledgerPostingReadinessPack;
    const { policyTemplateRegistry } = professionalPortalShell;
    const { formalReadinessAnchor } = policyTemplateRegistry;
    const closeoutChecklist: TenantFullAccountingFormalReadinessCloseoutView['closeoutChecklist'] = [
      fullAccountingFormalReadinessCloseoutCheck('formal_readiness_anchor', 'Full Accounting formal readiness anchor', formalReadinessAnchor.anchorStatus, ['full_accounting_formal_readiness_anchor']),
      fullAccountingFormalReadinessCloseoutCheck('policy_template_registry', 'Policy and template registry', policyTemplateRegistry.registryStatus, ['full_accounting_policy_template_registry']),
      fullAccountingFormalReadinessCloseoutCheck('professional_portal_shell', 'Professional portal readiness shell', professionalPortalShell.shellStatus, ['full_accounting_professional_portal_readiness_shell']),
      fullAccountingFormalReadinessCloseoutCheck('ledger_posting_pack', 'Formal ledger and posting readiness pack', ledgerPostingReadinessPack.packStatus, ['full_accounting_formal_ledger_posting_readiness_pack']),
      fullAccountingFormalReadinessCloseoutCheck('statement_bank_boundary_pack', 'Statement and bank formal boundary pack', statementBankBoundaryPack.packStatus, ['full_accounting_statement_bank_formal_boundary_pack']),
    ];
    const blockers = unique([
      ...formalReadinessAnchor.blockers,
      ...policyTemplateRegistry.blockers,
      ...professionalPortalShell.blockers,
      ...ledgerPostingReadinessPack.blockers,
      ...statementBankBoundaryPack.blockers,
    ]);
    const closeoutStatus = resolveStatus(closeoutChecklist.map((item) => item.status), blockers);
    const finalDecision = fullAccountingFormalReadinessDecisionFromStatus(
      closeoutStatus,
      formalReadinessAnchor,
      policyTemplateRegistry,
      professionalPortalShell,
      ledgerPostingReadinessPack,
      statementBankBoundaryPack,
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      closeoutStatus,
      formalReadinessAnchor,
      policyTemplateRegistry,
      professionalPortalShell,
      ledgerPostingReadinessPack,
      statementBankBoundaryPack,
      closeoutChecklist,
      finalDecision,
      summary: {
        checklistCount: closeoutChecklist.length,
        readyChecklistCount: closeoutChecklist.filter((item) => item.status === 'ready').length,
        blockedChecklistCount: closeoutChecklist.filter((item) => item.status === 'blocked').length,
        readinessLaneCount: formalReadinessAnchor.summary.laneCount,
        templateCount: policyTemplateRegistry.summary.templateCount,
        portalShellItemCount: professionalPortalShell.summary.shellItemCount,
        ledgerPostingItemCount: ledgerPostingReadinessPack.summary.itemCount,
        statementBankBoundaryCount: statementBankBoundaryPack.summary.boundaryCount,
      },
      blockers,
      nextStep:
        finalDecision === 'open_formal_artifact_drafting'
          ? 'Preparar Full Accounting formal artifact drafting 0.8.'
          : finalDecision === 'continue_formal_readiness'
            ? 'Continuar formal readiness antes de drafting.'
            : finalDecision === 'return_to_product_design'
              ? 'Volver a Full Accounting product design 0.6.'
              : finalDecision === 'return_to_graduation'
                ? 'Volver a Full Accounting graduation 0.5.'
                : 'No abrir formal readiness por ahora.',
      guardrails: [
        'Formal readiness closeout no redacta artefactos formales.',
        'Artifact drafting debe abrirse en un slice separado antes de cualquier ejecucion formal.',
      ],
    };
  }
}

export class GetTenantFullAccountingFormalArtifactDraftingAnchorUseCase {
  constructor(
    private readonly requestTenantFullAccountingFormalReadinessCloseoutUseCase: RequestTenantFullAccountingFormalReadinessCloseoutUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: AccountingAdvancedDiscoveryInput): Promise<TenantFullAccountingFormalArtifactDraftingAnchorView> {
    const formalReadinessCloseout =
      await this.requestTenantFullAccountingFormalReadinessCloseoutUseCase.execute(input);
    const draftingLanes: TenantFullAccountingFormalArtifactDraftingAnchorView['draftingLanes'] = [
      fullAccountingFormalArtifactDraftingLane('ledger_draft', 'Ledger draft lane', formalReadinessCloseout.ledgerPostingReadinessPack.packStatus, 'ledger_draft', 'draft', ['full_accounting_formal_ledger_posting_readiness_pack']),
      fullAccountingFormalArtifactDraftingLane('posting_packet_draft', 'Posting packet draft lane', formalReadinessCloseout.ledgerPostingReadinessPack.packStatus, 'posting_packet_draft', 'professional_review', ['full_accounting_policy_template_registry']),
      fullAccountingFormalArtifactDraftingLane('bank_evidence_draft', 'Bank evidence draft lane', formalReadinessCloseout.statementBankBoundaryPack.packStatus, 'bank_evidence_draft', 'evidence_draft', ['full_accounting_statement_bank_formal_boundary_pack']),
      fullAccountingFormalArtifactDraftingLane('trial_balance_draft', 'Trial balance draft lane', formalReadinessCloseout.statementBankBoundaryPack.packStatus, 'trial_balance_draft', 'preview_draft', ['full_accounting_statement_bank_formal_boundary_pack']),
      fullAccountingFormalArtifactDraftingLane('financial_statement_draft', 'Financial statement draft lane', formalReadinessCloseout.statementBankBoundaryPack.packStatus, 'financial_statement_draft', 'professional_review', ['full_accounting_statement_bank_formal_boundary_pack']),
      fullAccountingFormalArtifactDraftingLane('professional_review_boundary', 'Professional review boundary lane', 'ready', 'professional_review_boundary', 'professional_review', ['full_accounting_professional_portal_readiness_shell']),
    ];
    const blockers =
      formalReadinessCloseout.finalDecision === 'open_formal_artifact_drafting'
        ? [...formalReadinessCloseout.blockers]
        : unique([
            ...formalReadinessCloseout.blockers,
            `Full Accounting formal readiness decision is ${formalReadinessCloseout.finalDecision}.`,
          ]);
    const anchorStatus = resolveStatus(draftingLanes.map((lane) => lane.status), blockers);

    return {
      ...input,
      generatedAt: this.nowProvider(),
      anchorStatus,
      formalReadinessCloseout,
      draftingLanes,
      summary: {
        laneCount: draftingLanes.length,
        readyLaneCount: draftingLanes.filter((lane) => lane.status === 'ready').length,
        draftLaneCount: draftingLanes.filter((lane) => lane.draftMode === 'draft' || lane.draftMode === 'evidence_draft' || lane.draftMode === 'preview_draft').length,
        professionalReviewLaneCount: draftingLanes.filter((lane) => lane.draftMode === 'professional_review').length,
        blockedLaneCount: draftingLanes.filter((lane) => lane.status === 'blocked').length,
      },
      blockers,
      nextStep: 'Preparar formal ledger draft pack.',
      guardrails: [
        'Artifact drafting 0.8 prepara borradores; no emite artefactos oficiales.',
        'Los drafts requieren revision profesional antes de cualquier aprobacion.',
      ],
    };
  }
}

export class GetTenantFullAccountingFormalLedgerDraftPackUseCase {
  constructor(
    private readonly getTenantFullAccountingFormalArtifactDraftingAnchorUseCase: GetTenantFullAccountingFormalArtifactDraftingAnchorUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: AccountingAdvancedDiscoveryInput): Promise<TenantFullAccountingFormalLedgerDraftPackView> {
    const draftingAnchor =
      await this.getTenantFullAccountingFormalArtifactDraftingAnchorUseCase.execute(input);
    const ledgerDrafts: TenantFullAccountingFormalLedgerDraftPackView['ledgerDrafts'] = [
      fullAccountingFormalLedgerDraft('ledger_structure', 'Ledger structure draft', draftingAnchor.anchorStatus, 'ledger_structure', 'draft', ['full_accounting_product_scope_contract']),
      fullAccountingFormalLedgerDraft('journal_batch', 'Journal batch draft', draftingAnchor.anchorStatus, 'journal_batch', 'draft', ['full_accounting_formal_ledger_posting_readiness_pack']),
      fullAccountingFormalLedgerDraft('journal_line', 'Journal line draft', draftingAnchor.anchorStatus, 'journal_line', 'draft', ['full_accounting_formal_ledger_posting_readiness_pack']),
      fullAccountingFormalLedgerDraft('reversal', 'Reversal draft', draftingAnchor.anchorStatus, 'reversal', 'draft', ['full_accounting_formal_ledger_posting_readiness_pack']),
      fullAccountingFormalLedgerDraft('invariant_evidence', 'Invariant evidence draft', 'ready', 'invariant_evidence', 'evidence', ['full_accounting_workflow_control_blueprint']),
      fullAccountingFormalLedgerDraft('period_lock_preview_reference', 'Period lock preview reference', 'ready', 'period_lock_preview_reference', 'preview_reference', ['accounting_period_lock_readiness']),
    ];
    const blockers = [...draftingAnchor.blockers];
    const packStatus = resolveStatus(ledgerDrafts.map((draft) => draft.status), blockers);

    return {
      ...input,
      generatedAt: this.nowProvider(),
      packStatus,
      draftingAnchor,
      ledgerDrafts,
      summary: {
        draftCount: ledgerDrafts.length,
        readyDraftCount: ledgerDrafts.filter((draft) => draft.status === 'ready').length,
        evidenceDraftCount: ledgerDrafts.filter((draft) => draft.draftState === 'evidence').length,
        previewReferenceCount: ledgerDrafts.filter((draft) => draft.draftState === 'preview_reference').length,
        blockedDraftCount: ledgerDrafts.filter((draft) => draft.status === 'blocked').length,
      },
      blockers,
      nextStep: 'Preparar posting approval draft pack.',
      guardrails: [
        'Ledger draft pack no escribe asientos oficiales.',
        'Journal drafts son borradores revisables, no libro mayor.',
      ],
    };
  }
}

export class GetTenantFullAccountingPostingApprovalDraftPackUseCase {
  constructor(
    private readonly getTenantFullAccountingFormalLedgerDraftPackUseCase: GetTenantFullAccountingFormalLedgerDraftPackUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: AccountingAdvancedDiscoveryInput): Promise<TenantFullAccountingPostingApprovalDraftPackView> {
    const ledgerDraftPack =
      await this.getTenantFullAccountingFormalLedgerDraftPackUseCase.execute(input);
    const approvalDrafts: TenantFullAccountingPostingApprovalDraftPackView['approvalDrafts'] = [
      fullAccountingPostingApprovalDraft('posting_approval_summary', 'Posting approval summary draft', ledgerDraftPack.packStatus, 'posting_approval_summary', 'operator', ['full_accounting_formal_ledger_draft_pack']),
      fullAccountingPostingApprovalDraft('pending_approval_item', 'Pending approval item draft', ledgerDraftPack.packStatus, 'pending_approval_item', 'external_accountant', ['full_accounting_policy_template_registry']),
      fullAccountingPostingApprovalDraft('risk_flag', 'Posting risk flag draft', ledgerDraftPack.packStatus, 'risk_flag', 'external_accountant', ['full_accounting_graduation_risk_control_pack']),
      fullAccountingPostingApprovalDraft('rollback_reference', 'Rollback reference draft', 'ready', 'rollback_reference', 'operator', ['full_accounting_formal_ledger_posting_readiness_pack']),
      fullAccountingPostingApprovalDraft('accountant_decision_placeholder', 'Accountant decision placeholder', 'ready', 'accountant_decision_placeholder', 'external_accountant', ['full_accounting_professional_portal_readiness_shell']),
      fullAccountingPostingApprovalDraft('posting_execution_exclusion', 'Posting execution exclusion', 'ready', 'posting_execution_exclusion', 'platform', ['full_accounting_official_artifact_boundary_registry']),
    ];
    const blockers = [...ledgerDraftPack.blockers];
    const packStatus = resolveStatus(approvalDrafts.map((draft) => draft.status), blockers);

    return {
      ...input,
      generatedAt: this.nowProvider(),
      packStatus,
      ledgerDraftPack,
      approvalDrafts,
      summary: {
        draftCount: approvalDrafts.length,
        readyDraftCount: approvalDrafts.filter((draft) => draft.status === 'ready').length,
        accountantOwnedDraftCount: approvalDrafts.filter((draft) => draft.owner === 'external_accountant').length,
        riskFlagCount: approvalDrafts.filter((draft) => draft.approvalType === 'risk_flag').length,
        executionExclusionCount: approvalDrafts.filter((draft) => draft.approvalType === 'posting_execution_exclusion').length,
      },
      blockers,
      nextStep: 'Preparar bank and reconciliation evidence draft pack.',
      guardrails: [
        'Posting approval draft pack no ejecuta postings.',
        'Accountant decision placeholders no equivalen a aprobacion profesional.',
      ],
    };
  }
}

export class GetTenantFullAccountingBankReconciliationEvidenceDraftPackUseCase {
  constructor(
    private readonly getTenantFullAccountingPostingApprovalDraftPackUseCase: GetTenantFullAccountingPostingApprovalDraftPackUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: AccountingAdvancedDiscoveryInput): Promise<TenantFullAccountingBankReconciliationEvidenceDraftPackView> {
    const postingApprovalDraftPack =
      await this.getTenantFullAccountingPostingApprovalDraftPackUseCase.execute(input);
    const bankDrafts: TenantFullAccountingBankReconciliationEvidenceDraftPackView['bankDrafts'] = [
      fullAccountingBankEvidenceDraft('bank_evidence', 'Bank evidence draft', postingApprovalDraftPack.packStatus, 'bank_evidence', 'draft', ['full_accounting_statement_bank_formal_boundary_pack']),
      fullAccountingBankEvidenceDraft('candidate_match_summary', 'Candidate match summary draft', postingApprovalDraftPack.packStatus, 'candidate_match_summary', 'summary', ['full_accounting_statement_bank_formal_boundary_pack']),
      fullAccountingBankEvidenceDraft('unresolved_exception', 'Unresolved exception draft', postingApprovalDraftPack.packStatus, 'unresolved_exception', 'summary', ['accounting_corrections_queue']),
      fullAccountingBankEvidenceDraft('cutoff_evidence', 'Cutoff evidence draft', postingApprovalDraftPack.packStatus, 'cutoff_evidence', 'draft', ['full_accounting_statement_bank_formal_boundary_pack']),
      fullAccountingBankEvidenceDraft('certified_reconciliation_boundary', 'Certified reconciliation boundary draft', 'ready', 'certified_reconciliation_boundary', 'boundary', ['full_accounting_official_artifact_boundary_registry']),
      fullAccountingBankEvidenceDraft('external_certification_marker', 'External certification marker', 'ready', 'external_certification_marker', 'external_only', ['full_accounting_statement_bank_formal_boundary_pack']),
    ];
    const blockers = [...postingApprovalDraftPack.blockers];
    const packStatus = resolveStatus(bankDrafts.map((draft) => draft.status), blockers);

    return {
      ...input,
      generatedAt: this.nowProvider(),
      packStatus,
      postingApprovalDraftPack,
      bankDrafts,
      summary: {
        draftCount: bankDrafts.length,
        readyDraftCount: bankDrafts.filter((draft) => draft.status === 'ready').length,
        summaryCount: bankDrafts.filter((draft) => draft.evidenceMode === 'summary').length,
        boundaryCount: bankDrafts.filter((draft) => draft.evidenceMode === 'boundary').length,
        externalOnlyCount: bankDrafts.filter((draft) => draft.evidenceMode === 'external_only').length,
      },
      blockers,
      nextStep: 'Preparar trial balance and financial statement draft pack.',
      guardrails: [
        'Bank evidence draft pack no certifica conciliaciones.',
        'External certification marker mantiene certificacion fuera de plataforma.',
      ],
    };
  }
}

export class GetTenantFullAccountingTrialBalanceFinancialStatementDraftPackUseCase {
  constructor(
    private readonly getTenantFullAccountingBankReconciliationEvidenceDraftPackUseCase: GetTenantFullAccountingBankReconciliationEvidenceDraftPackUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: AccountingAdvancedDiscoveryInput): Promise<TenantFullAccountingTrialBalanceFinancialStatementDraftPackView> {
    const bankEvidenceDraftPack =
      await this.getTenantFullAccountingBankReconciliationEvidenceDraftPackUseCase.execute(input);
    const statementDrafts: TenantFullAccountingTrialBalanceFinancialStatementDraftPackView['statementDrafts'] = [
      fullAccountingStatementDraft('trial_balance', 'Trial balance draft', bankEvidenceDraftPack.packStatus, 'trial_balance', 'draft', ['full_accounting_statement_bank_formal_boundary_pack']),
      fullAccountingStatementDraft('balance_sheet', 'Balance sheet draft', bankEvidenceDraftPack.packStatus, 'balance_sheet', 'draft', ['full_accounting_statement_bank_formal_boundary_pack']),
      fullAccountingStatementDraft('income_statement', 'Income statement draft', bankEvidenceDraftPack.packStatus, 'income_statement', 'draft', ['full_accounting_statement_bank_formal_boundary_pack']),
      fullAccountingStatementDraft('variance_note', 'Variance note draft', bankEvidenceDraftPack.packStatus, 'variance_note', 'note', ['full_accounting_statement_bank_formal_boundary_pack']),
      fullAccountingStatementDraft('accountant_review_requirement', 'Accountant review requirement draft', 'ready', 'accountant_review_requirement', 'professional_review', ['full_accounting_professional_portal_readiness_shell']),
      fullAccountingStatementDraft('signed_statement_boundary', 'Signed statement boundary draft', 'ready', 'signed_statement_boundary', 'boundary', ['full_accounting_official_artifact_boundary_registry']),
    ];
    const blockers = [...bankEvidenceDraftPack.blockers];
    const packStatus = resolveStatus(statementDrafts.map((draft) => draft.status), blockers);

    return {
      ...input,
      generatedAt: this.nowProvider(),
      packStatus,
      bankEvidenceDraftPack,
      statementDrafts,
      summary: {
        draftCount: statementDrafts.length,
        readyDraftCount: statementDrafts.filter((draft) => draft.status === 'ready').length,
        statementDraftCount: statementDrafts.filter((draft) => draft.draftMode === 'draft').length,
        professionalReviewCount: statementDrafts.filter((draft) => draft.draftMode === 'professional_review').length,
        boundaryCount: statementDrafts.filter((draft) => draft.draftMode === 'boundary').length,
      },
      blockers,
      nextStep: 'Cerrar Full Accounting formal artifact drafting 0.8.',
      guardrails: [
        'Financial statement drafts no son estados financieros oficiales.',
        'Signed statement boundary conserva firma fuera de plataforma.',
      ],
    };
  }
}

export class RequestTenantFullAccountingFormalArtifactDraftingCloseoutUseCase {
  constructor(
    private readonly getTenantFullAccountingTrialBalanceFinancialStatementDraftPackUseCase: GetTenantFullAccountingTrialBalanceFinancialStatementDraftPackUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: AccountingAdvancedDiscoveryInput): Promise<TenantFullAccountingFormalArtifactDraftingCloseoutView> {
    const statementDraftPack =
      await this.getTenantFullAccountingTrialBalanceFinancialStatementDraftPackUseCase.execute(input);
    const { bankEvidenceDraftPack } = statementDraftPack;
    const { postingApprovalDraftPack } = bankEvidenceDraftPack;
    const { ledgerDraftPack } = postingApprovalDraftPack;
    const { draftingAnchor } = ledgerDraftPack;
    const closeoutChecklist: TenantFullAccountingFormalArtifactDraftingCloseoutView['closeoutChecklist'] = [
      fullAccountingFormalArtifactDraftingCloseoutCheck('drafting_anchor', 'Full Accounting formal artifact drafting anchor', draftingAnchor.anchorStatus, ['full_accounting_formal_artifact_drafting_anchor']),
      fullAccountingFormalArtifactDraftingCloseoutCheck('ledger_draft_pack', 'Formal ledger draft pack', ledgerDraftPack.packStatus, ['full_accounting_formal_ledger_draft_pack']),
      fullAccountingFormalArtifactDraftingCloseoutCheck('posting_approval_draft_pack', 'Posting approval draft pack', postingApprovalDraftPack.packStatus, ['full_accounting_posting_approval_draft_pack']),
      fullAccountingFormalArtifactDraftingCloseoutCheck('bank_evidence_draft_pack', 'Bank reconciliation evidence draft pack', bankEvidenceDraftPack.packStatus, ['full_accounting_bank_reconciliation_evidence_draft_pack']),
      fullAccountingFormalArtifactDraftingCloseoutCheck('statement_draft_pack', 'Trial balance and financial statement draft pack', statementDraftPack.packStatus, ['full_accounting_trial_balance_financial_statement_draft_pack']),
    ];
    const blockers = unique([
      ...draftingAnchor.blockers,
      ...ledgerDraftPack.blockers,
      ...postingApprovalDraftPack.blockers,
      ...bankEvidenceDraftPack.blockers,
      ...statementDraftPack.blockers,
    ]);
    const closeoutStatus = resolveStatus(closeoutChecklist.map((item) => item.status), blockers);
    const finalDecision = fullAccountingFormalArtifactDraftingDecisionFromStatus(
      closeoutStatus,
      draftingAnchor,
      ledgerDraftPack,
      postingApprovalDraftPack,
      bankEvidenceDraftPack,
      statementDraftPack,
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      closeoutStatus,
      draftingAnchor,
      ledgerDraftPack,
      postingApprovalDraftPack,
      bankEvidenceDraftPack,
      statementDraftPack,
      closeoutChecklist,
      finalDecision,
      summary: {
        checklistCount: closeoutChecklist.length,
        readyChecklistCount: closeoutChecklist.filter((item) => item.status === 'ready').length,
        blockedChecklistCount: closeoutChecklist.filter((item) => item.status === 'blocked').length,
        draftingLaneCount: draftingAnchor.summary.laneCount,
        ledgerDraftCount: ledgerDraftPack.summary.draftCount,
        postingDraftCount: postingApprovalDraftPack.summary.draftCount,
        bankDraftCount: bankEvidenceDraftPack.summary.draftCount,
        statementDraftCount: statementDraftPack.summary.draftCount,
      },
      blockers,
      nextStep:
        finalDecision === 'open_professional_review_execution'
          ? 'Preparar Full Accounting professional review execution 0.9.'
          : finalDecision === 'continue_artifact_drafting'
            ? 'Continuar artifact drafting antes de review profesional.'
            : finalDecision === 'return_to_formal_readiness'
              ? 'Volver a Full Accounting formal readiness 0.7.'
              : finalDecision === 'return_to_product_design'
                ? 'Volver a Full Accounting product design 0.6.'
                : 'No redactar artefactos formales por ahora.',
      guardrails: [
        'Formal artifact drafting closeout no aprueba, firma, certifica, legaliza ni postea.',
        'Professional review execution debe abrirse separado antes de cualquier aprobacion formal.',
      ],
    };
  }
}

export class GetTenantFullAccountingProfessionalReviewExecutionAnchorUseCase {
  constructor(
    private readonly requestTenantFullAccountingFormalArtifactDraftingCloseoutUseCase: RequestTenantFullAccountingFormalArtifactDraftingCloseoutUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: AccountingAdvancedDiscoveryInput): Promise<TenantFullAccountingProfessionalReviewExecutionAnchorView> {
    const draftingCloseout =
      await this.requestTenantFullAccountingFormalArtifactDraftingCloseoutUseCase.execute(input);
    const reviewGates: TenantFullAccountingProfessionalReviewExecutionAnchorView['reviewGates'] = [
      fullAccountingProfessionalReviewGate('drafting_closeout', 'Formal artifact drafting closeout complete', draftingCloseout.closeoutStatus, ['full_accounting_formal_artifact_drafting_closeout'], 'external_accountant', 'Professional review starts only from traceable Full Accounting drafts.'),
      fullAccountingProfessionalReviewGate('ledger_and_posting_drafts', 'Ledger and posting drafts visible', draftingCloseout.ledgerDraftPack.packStatus, ['full_accounting_formal_ledger_draft_pack', 'full_accounting_posting_approval_draft_pack'], 'external_accountant', 'The accountant reviews drafts before any posting approval workflow opens.'),
      fullAccountingProfessionalReviewGate('bank_statement_evidence', 'Bank and statement evidence visible', draftingCloseout.bankEvidenceDraftPack.packStatus, ['full_accounting_bank_reconciliation_evidence_draft_pack'], 'external_accountant', 'Bank evidence remains draft evidence and does not certify reconciliation.'),
      fullAccountingProfessionalReviewGate('financial_statement_boundary', 'Financial statement boundary preserved', draftingCloseout.statementDraftPack.packStatus, ['full_accounting_trial_balance_financial_statement_draft_pack'], 'legal_representative', 'Statements remain drafts until professional approval, signature and certification.'),
      fullAccountingProfessionalReviewGate('external_review_boundary', 'External review boundary preserved', 'ready', ['full_accounting_professional_portal_readiness_shell'], 'auditor', 'The platform never replaces the accountant, auditor or legal representative.'),
    ];
    const blockers =
      draftingCloseout.finalDecision === 'open_professional_review_execution'
        ? [...draftingCloseout.blockers]
        : unique([
            ...draftingCloseout.blockers,
            `Full Accounting formal artifact drafting decision is ${draftingCloseout.finalDecision}.`,
          ]);
    const anchorStatus = resolveStatus(reviewGates.map((gate) => gate.status), blockers);

    return {
      ...input,
      generatedAt: this.nowProvider(),
      anchorStatus,
      draftingCloseout,
      reviewGates,
      summary: {
        gateCount: reviewGates.length,
        readyGateCount: reviewGates.filter((gate) => gate.status === 'ready').length,
        needsReviewGateCount: reviewGates.filter((gate) => gate.status === 'needs_review').length,
        blockedGateCount: reviewGates.filter((gate) => gate.status === 'blocked').length,
        draftArtifactCount:
          draftingCloseout.summary.ledgerDraftCount +
          draftingCloseout.summary.postingDraftCount +
          draftingCloseout.summary.bankDraftCount +
          draftingCloseout.summary.statementDraftCount,
      },
      blockers,
      nextStep:
        anchorStatus === 'blocked'
          ? 'Volver a artifact drafting 0.8 antes de ejecutar review profesional.'
          : 'Abrir Full Accounting accountant draft review room.',
      guardrails: [
        'Professional review execution 0.9 revisa drafts; no aprueba formalmente.',
        'Toda decision profesional se expresa como finding, change request o recomendacion.',
      ],
    };
  }
}

export class GetTenantFullAccountingAccountantDraftReviewRoomUseCase {
  constructor(
    private readonly getTenantFullAccountingProfessionalReviewExecutionAnchorUseCase: GetTenantFullAccountingProfessionalReviewExecutionAnchorUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: AccountingAdvancedDiscoveryInput): Promise<TenantFullAccountingAccountantDraftReviewRoomView> {
    const reviewAnchor =
      await this.getTenantFullAccountingProfessionalReviewExecutionAnchorUseCase.execute(input);
    const { draftingCloseout } = reviewAnchor;
    const reviewRows: TenantFullAccountingAccountantDraftReviewRoomView['reviewRows'] = [
      fullAccountingDraftReviewRow('ledger_draft_review', 'Formal ledger draft review', draftingCloseout.ledgerDraftPack.packStatus, 'ledger_draft', 'external_accountant', 'Ledger draft requiere validar estructura, journal batch, reversos e invariantes.', 'request_changes'),
      fullAccountingDraftReviewRow('posting_approval_review', 'Posting approval draft review', draftingCloseout.postingApprovalDraftPack.packStatus, 'posting_approval', 'external_accountant', 'Posting approvals deben quedar recomendados antes de cualquier approval workflow.', 'request_changes'),
      fullAccountingDraftReviewRow('bank_evidence_review', 'Bank evidence draft review', draftingCloseout.bankEvidenceDraftPack.packStatus, 'bank_evidence', 'auditor', 'Bank evidence requiere boundary explicito antes de certificacion externa.', 'needs_external_signoff'),
      fullAccountingDraftReviewRow('trial_balance_review', 'Trial balance draft review', draftingCloseout.statementDraftPack.packStatus, 'trial_balance', 'external_accountant', 'Trial balance draft listo para revision de variaciones y consistencia.', 'approve_for_recommendation'),
      fullAccountingDraftReviewRow('financial_statement_review', 'Financial statement draft review', draftingCloseout.statementDraftPack.packStatus, 'financial_statement', 'legal_representative', 'Financial statements necesitan validacion profesional antes de aprobacion formal.', 'needs_external_signoff'),
      fullAccountingDraftReviewRow('professional_boundary_review', 'Professional boundary review', reviewAnchor.anchorStatus, 'professional_boundary', 'external_accountant', 'Boundary confirma que la plataforma no firma, certifica ni legaliza.', 'approve_for_recommendation'),
    ];
    const blockers = [...reviewAnchor.blockers];
    const roomStatus = resolveStatus(reviewRows.map((row) => row.status), blockers);

    return {
      ...input,
      generatedAt: this.nowProvider(),
      roomStatus,
      reviewAnchor,
      reviewRows,
      summary: {
        reviewRowCount: reviewRows.length,
        approveForRecommendationCount: reviewRows.filter((row) => row.preliminaryDecision === 'approve_for_recommendation').length,
        changeRequestCount: reviewRows.filter((row) => row.preliminaryDecision === 'request_changes').length,
        externalSignoffCount: reviewRows.filter((row) => row.preliminaryDecision === 'needs_external_signoff').length,
        rejectedDraftCount: reviewRows.filter((row) => row.preliminaryDecision === 'reject_draft').length,
      },
      blockers,
      nextStep: 'Convertir findings de review en change requests trazables.',
      guardrails: [
        'Accountant draft review room organiza hallazgos; no corrige ni aprueba automaticamente.',
        'Cada reviewer conserva propiedad profesional sobre su finding.',
      ],
    };
  }
}

export class GetTenantFullAccountingReviewChangeRequestPackUseCase {
  constructor(
    private readonly getTenantFullAccountingAccountantDraftReviewRoomUseCase: GetTenantFullAccountingAccountantDraftReviewRoomUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: AccountingAdvancedDiscoveryInput): Promise<TenantFullAccountingReviewChangeRequestPackView> {
    const reviewRoom =
      await this.getTenantFullAccountingAccountantDraftReviewRoomUseCase.execute(input);
    const changeRequests: TenantFullAccountingReviewChangeRequestPackView['changeRequests'] =
      reviewRoom.reviewRows
        .filter((row) => row.preliminaryDecision !== 'approve_for_recommendation')
        .map((row) =>
          fullAccountingReviewChangeRequest(
            `change_${row.key}`,
            `${row.label} change request`,
            row.status,
            row.key,
            row.reviewer,
            fullAccountingChangeActionFromReviewRow(row),
            ['full_accounting_accountant_draft_review_room'],
          ),
        );
    const blockers = [...reviewRoom.blockers];
    const packStatus = resolveStatus(changeRequests.map((request) => request.status), blockers);

    return {
      ...input,
      generatedAt: this.nowProvider(),
      packStatus,
      reviewRoom,
      changeRequests,
      summary: {
        changeRequestCount: changeRequests.length,
        readyChangeRequestCount: changeRequests.filter((request) => request.status === 'ready').length,
        needsReviewChangeRequestCount: changeRequests.filter((request) => request.status === 'needs_review').length,
        blockedChangeRequestCount: changeRequests.filter((request) => request.status === 'blocked').length,
      },
      blockers,
      nextStep: 'Preparar professional approval recommendation pack.',
      guardrails: [
        'Change requests son instrucciones revisables; no modifican libros ni estados financieros.',
        'Las acciones requeridas mantienen evidencia fuente y reviewer responsable.',
      ],
    };
  }
}

export class RequestTenantFullAccountingProfessionalApprovalRecommendationPackUseCase {
  constructor(
    private readonly getTenantFullAccountingReviewChangeRequestPackUseCase: GetTenantFullAccountingReviewChangeRequestPackUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: AccountingAdvancedDiscoveryInput): Promise<TenantFullAccountingProfessionalApprovalRecommendationPackView> {
    const changeRequestPack =
      await this.getTenantFullAccountingReviewChangeRequestPackUseCase.execute(input);
    const recommendations: TenantFullAccountingProfessionalApprovalRecommendationPackView['recommendations'] =
      changeRequestPack.reviewRoom.reviewRows.map((row) =>
        fullAccountingApprovalRecommendation(
          `recommendation_${row.key}`,
          `${row.label} recommendation`,
          row.status,
          row.artifactType,
          fullAccountingRecommendationFromReviewRow(row),
          row.reviewer,
          fullAccountingRecommendationRationaleFromReviewRow(row),
        ),
      );
    const blockers = [...changeRequestPack.blockers];
    const packStatus = resolveStatus(recommendations.map((recommendation) => recommendation.status), blockers);

    return {
      ...input,
      generatedAt: this.nowProvider(),
      packStatus,
      changeRequestPack,
      recommendations,
      summary: {
        recommendationCount: recommendations.length,
        recommendApprovalCount: recommendations.filter((item) => item.recommendation === 'recommend_approval').length,
        requireChangesCount: recommendations.filter((item) => item.recommendation === 'require_changes_first').length,
        requireAuditorReviewCount: recommendations.filter((item) => item.recommendation === 'require_auditor_review').length,
        doNotApproveCount: recommendations.filter((item) => item.recommendation === 'do_not_approve').length,
      },
      blockers,
      nextStep: 'Consolidar Full Accounting review execution command center.',
      guardrails: [
        'Professional approval recommendation pack recomienda; no aprueba formalmente.',
        'Formal approval workflow debe abrirse separado y con autoridad explicita.',
      ],
    };
  }
}

export class GetTenantFullAccountingReviewExecutionCommandCenterUseCase {
  constructor(
    private readonly requestTenantFullAccountingProfessionalApprovalRecommendationPackUseCase: RequestTenantFullAccountingProfessionalApprovalRecommendationPackUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: AccountingAdvancedDiscoveryInput): Promise<TenantFullAccountingReviewExecutionCommandCenterView> {
    const approvalRecommendationPack =
      await this.requestTenantFullAccountingProfessionalApprovalRecommendationPackUseCase.execute(input);
    const { changeRequestPack } = approvalRecommendationPack;
    const { reviewRoom } = changeRequestPack;
    const { reviewAnchor } = reviewRoom;
    const lanes: TenantFullAccountingReviewExecutionCommandCenterView['lanes'] = [
      fullAccountingReviewCommandLane('review_anchor', 'Professional review execution anchor', reviewAnchor.anchorStatus, 'external_accountant', `${reviewAnchor.summary.readyGateCount}/${reviewAnchor.summary.gateCount} gates`, reviewAnchor.nextStep),
      fullAccountingReviewCommandLane('review_room', 'Accountant draft review room', reviewRoom.roomStatus, 'external_accountant', `${reviewRoom.summary.reviewRowCount} reviews`, reviewRoom.nextStep),
      fullAccountingReviewCommandLane('change_requests', 'Review change request pack', changeRequestPack.packStatus, 'operator', `${changeRequestPack.summary.changeRequestCount} requests`, changeRequestPack.nextStep),
      fullAccountingReviewCommandLane('approval_recommendations', 'Professional approval recommendations', approvalRecommendationPack.packStatus, 'external_accountant', `${approvalRecommendationPack.summary.recommendApprovalCount} recommended`, approvalRecommendationPack.nextStep),
    ];
    const blockers = unique([
      ...reviewAnchor.blockers,
      ...reviewRoom.blockers,
      ...changeRequestPack.blockers,
      ...approvalRecommendationPack.blockers,
    ]);
    const commandStatus = resolveStatus(lanes.map((lane) => lane.status), blockers);

    return {
      ...input,
      generatedAt: this.nowProvider(),
      commandStatus,
      approvalRecommendationPack,
      lanes,
      summary: {
        laneCount: lanes.length,
        readyLaneCount: lanes.filter((lane) => lane.status === 'ready').length,
        needsReviewLaneCount: lanes.filter((lane) => lane.status === 'needs_review').length,
        blockedLaneCount: lanes.filter((lane) => lane.status === 'blocked').length,
        recommendationCount: approvalRecommendationPack.summary.recommendationCount,
        changeRequestCount: changeRequestPack.summary.changeRequestCount,
      },
      blockers,
      nextStep: 'Cerrar Full Accounting professional review execution 0.9.',
      guardrails: [
        'Review execution command center no ejecuta aprobaciones ni signoff formal.',
        'Aprobacion, firma, certificacion y legalizacion siguen fuera de este slice.',
      ],
    };
  }
}

export class RequestTenantFullAccountingProfessionalReviewExecutionCloseoutUseCase {
  constructor(
    private readonly getTenantFullAccountingReviewExecutionCommandCenterUseCase: GetTenantFullAccountingReviewExecutionCommandCenterUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: AccountingAdvancedDiscoveryInput): Promise<TenantFullAccountingProfessionalReviewExecutionCloseoutView> {
    const commandCenter =
      await this.getTenantFullAccountingReviewExecutionCommandCenterUseCase.execute(input);
    const { approvalRecommendationPack } = commandCenter;
    const { changeRequestPack } = approvalRecommendationPack;
    const { reviewRoom } = changeRequestPack;
    const { reviewAnchor } = reviewRoom;
    const closeoutChecklist: TenantFullAccountingProfessionalReviewExecutionCloseoutView['closeoutChecklist'] = [
      fullAccountingProfessionalReviewCloseoutCheck('review_anchor', 'Full Accounting professional review anchor', reviewAnchor.anchorStatus, ['full_accounting_professional_review_execution_anchor']),
      fullAccountingProfessionalReviewCloseoutCheck('review_room', 'Full Accounting accountant draft review room', reviewRoom.roomStatus, ['full_accounting_accountant_draft_review_room']),
      fullAccountingProfessionalReviewCloseoutCheck('change_requests', 'Full Accounting review change request pack', changeRequestPack.packStatus, ['full_accounting_review_change_request_pack']),
      fullAccountingProfessionalReviewCloseoutCheck('approval_recommendations', 'Full Accounting professional approval recommendation pack', approvalRecommendationPack.packStatus, ['full_accounting_professional_approval_recommendation_pack']),
      fullAccountingProfessionalReviewCloseoutCheck('command_center', 'Full Accounting review execution command center', commandCenter.commandStatus, ['full_accounting_review_execution_command_center']),
    ];
    const blockers = unique([
      ...reviewAnchor.blockers,
      ...reviewRoom.blockers,
      ...changeRequestPack.blockers,
      ...approvalRecommendationPack.blockers,
      ...commandCenter.blockers,
    ]);
    const closeoutStatus = resolveStatus(closeoutChecklist.map((item) => item.status), blockers);
    const finalDecision = fullAccountingProfessionalReviewExecutionDecisionFromStatus(
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
        readyChecklistCount: closeoutChecklist.filter((item) => item.status === 'ready').length,
        blockedChecklistCount: closeoutChecklist.filter((item) => item.status === 'blocked').length,
        reviewRowCount: reviewRoom.summary.reviewRowCount,
        changeRequestCount: changeRequestPack.summary.changeRequestCount,
        recommendationCount: approvalRecommendationPack.summary.recommendationCount,
        readyLaneCount: commandCenter.summary.readyLaneCount,
      },
      blockers,
      nextStep:
        finalDecision === 'open_formal_approval_workflow'
          ? 'Preparar Full Accounting formal approval workflow 1.0.'
          : finalDecision === 'continue_professional_review'
            ? 'Continuar review profesional y resolver recomendaciones pendientes.'
            : finalDecision === 'return_to_artifact_drafting'
              ? 'Volver a Full Accounting formal artifact drafting 0.8.'
              : finalDecision === 'return_to_formal_readiness'
                ? 'Volver a Full Accounting formal readiness 0.7.'
                : 'No avanzar artefactos formales por ahora.',
      guardrails: [
        'Professional review execution closeout no aprueba, firma, certifica ni legaliza.',
        'Formal approval workflow debe modelarse como capa separada antes de cualquier aprobacion.',
      ],
    };
  }
}

export class GetTenantFullAccountingFormalApprovalWorkflowAnchorUseCase {
  constructor(
    private readonly requestTenantFullAccountingProfessionalReviewExecutionCloseoutUseCase: RequestTenantFullAccountingProfessionalReviewExecutionCloseoutUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: AccountingAdvancedDiscoveryInput): Promise<TenantFullAccountingFormalApprovalWorkflowAnchorView> {
    const professionalReviewCloseout =
      await this.requestTenantFullAccountingProfessionalReviewExecutionCloseoutUseCase.execute(input);
    const approvalGates: TenantFullAccountingFormalApprovalWorkflowAnchorView['approvalGates'] = [
      fullAccountingFormalApprovalGate('professional_review_closeout', 'Professional review closeout complete', professionalReviewCloseout.closeoutStatus, ['full_accounting_professional_review_execution_closeout'], 'external_accountant', 'Formal approval starts only from reviewed Full Accounting drafts.'),
      fullAccountingFormalApprovalGate('approval_recommendations', 'Professional recommendations available', professionalReviewCloseout.approvalRecommendationPack.packStatus, ['full_accounting_professional_approval_recommendation_pack'], 'external_accountant', 'Recommendations are inputs, not formal approvals.'),
      fullAccountingFormalApprovalGate('change_requests', 'Change requests visible', professionalReviewCloseout.changeRequestPack.packStatus, ['full_accounting_review_change_request_pack'], 'operator', 'Open changes must stay visible before approval decisions.'),
      fullAccountingFormalApprovalGate('signature_boundary', 'Signature and certification boundary preserved', professionalReviewCloseout.commandCenter.commandStatus, ['full_accounting_review_execution_command_center'], 'legal_representative', 'Approval workflow cannot sign, certify, legalize or file.'),
    ];
    const blockers =
      professionalReviewCloseout.finalDecision === 'open_formal_approval_workflow'
        ? [...professionalReviewCloseout.blockers]
        : unique([
            ...professionalReviewCloseout.blockers,
            `Full Accounting professional review decision is ${professionalReviewCloseout.finalDecision}.`,
          ]);
    const anchorStatus = resolveStatus(approvalGates.map((gate) => gate.status), blockers);

    return {
      ...input,
      generatedAt: this.nowProvider(),
      anchorStatus,
      professionalReviewCloseout,
      approvalGates,
      summary: {
        gateCount: approvalGates.length,
        readyGateCount: approvalGates.filter((gate) => gate.status === 'ready').length,
        needsReviewGateCount: approvalGates.filter((gate) => gate.status === 'needs_review').length,
        blockedGateCount: approvalGates.filter((gate) => gate.status === 'blocked').length,
        recommendationCount: professionalReviewCloseout.summary.recommendationCount,
      },
      blockers,
      nextStep:
        anchorStatus === 'blocked'
          ? 'Volver a professional review 0.9 antes de approval workflow.'
          : 'Construir Full Accounting approval authority matrix.',
      guardrails: [
        'Formal approval workflow 1.0 registra aprobaciones internas de workflow; no firma ni certifica.',
        'Cada gate conserva owner profesional y frontera de firma/certificacion posterior.',
      ],
    };
  }
}

export class GetTenantFullAccountingApprovalAuthorityMatrixUseCase {
  constructor(
    private readonly getTenantFullAccountingFormalApprovalWorkflowAnchorUseCase: GetTenantFullAccountingFormalApprovalWorkflowAnchorUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: AccountingAdvancedDiscoveryInput): Promise<TenantFullAccountingApprovalAuthorityMatrixView> {
    const approvalAnchor =
      await this.getTenantFullAccountingFormalApprovalWorkflowAnchorUseCase.execute(input);
    const authorities: TenantFullAccountingApprovalAuthorityMatrixView['authorities'] = [
      fullAccountingApprovalAuthority('ledger_draft_authority', 'Ledger draft approval authority', 'ledger_draft', 'needs_review', 'external_accountant', 'Contador externo aprueba workflow de ledger antes de firma/certificacion.'),
      fullAccountingApprovalAuthority('posting_approval_authority', 'Posting approval authority', 'posting_approval', 'needs_review', 'external_accountant', 'Contador externo conserva autoridad sobre aprobacion de posting.'),
      fullAccountingApprovalAuthority('bank_evidence_authority', 'Bank evidence approval authority', 'bank_evidence', 'needs_review', 'auditor', 'Auditor o tercero autorizado conserva frontera de certificacion bancaria.'),
      fullAccountingApprovalAuthority('trial_balance_authority', 'Trial balance approval authority', 'trial_balance', 'ready', 'external_accountant', 'Contador externo valida trial balance antes de estados formales.'),
      fullAccountingApprovalAuthority('financial_statement_authority', 'Financial statement approval authority', 'financial_statement', 'needs_review', 'legal_representative', 'Representante legal conserva aprobacion antes de firma.'),
      fullAccountingApprovalAuthority('professional_boundary_authority', 'Professional boundary approval authority', 'professional_boundary', 'ready', 'external_accountant', 'Boundary confirma que plataforma no reemplaza juicio profesional.'),
    ];
    const blockers = [...approvalAnchor.blockers];
    const matrixStatus = resolveStatus(authorities.map((authority) => authority.status), blockers);

    return {
      ...input,
      generatedAt: this.nowProvider(),
      matrixStatus,
      approvalAnchor,
      authorities,
      summary: {
        authorityCount: authorities.length,
        accountantAuthorityCount: authorities.filter((authority) => authority.requiredOwner === 'external_accountant').length,
        auditorAuthorityCount: authorities.filter((authority) => authority.requiredOwner === 'auditor').length,
        legalRepresentativeAuthorityCount: authorities.filter((authority) => authority.requiredOwner === 'legal_representative').length,
        needsReviewAuthorityCount: authorities.filter((authority) => authority.status === 'needs_review').length,
      },
      blockers,
      nextStep: 'Armar Full Accounting formal approval evidence pack.',
      guardrails: [
        'Authority matrix define responsabilidades; no ejecuta aprobaciones.',
        'La plataforma no aparece como aprobador profesional ni representante legal.',
      ],
    };
  }
}

export class GetTenantFullAccountingFormalApprovalEvidencePackUseCase {
  constructor(
    private readonly getTenantFullAccountingApprovalAuthorityMatrixUseCase: GetTenantFullAccountingApprovalAuthorityMatrixUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: AccountingAdvancedDiscoveryInput): Promise<TenantFullAccountingFormalApprovalEvidencePackView> {
    const authorityMatrix =
      await this.getTenantFullAccountingApprovalAuthorityMatrixUseCase.execute(input);
    const evidenceItems: TenantFullAccountingFormalApprovalEvidencePackView['evidenceItems'] =
      authorityMatrix.authorities.map((authority) =>
        fullAccountingApprovalEvidence(
          `evidence_${authority.key}`,
          `${authority.label} evidence`,
          authority.status,
          authority.artifactType,
          ['full_accounting_professional_review_execution_closeout', authority.key],
          `Confirmar si ${authority.requiredOwner} puede aprobar ${authority.artifactType} sin cruzar firma/certificacion.`,
        ),
      );
    const blockers = [...authorityMatrix.blockers];
    const packStatus = resolveStatus(evidenceItems.map((item) => item.status), blockers);

    return {
      ...input,
      generatedAt: this.nowProvider(),
      packStatus,
      authorityMatrix,
      evidenceItems,
      summary: {
        evidenceItemCount: evidenceItems.length,
        readyEvidenceItemCount: evidenceItems.filter((item) => item.status === 'ready').length,
        needsReviewEvidenceItemCount: evidenceItems.filter((item) => item.status === 'needs_review').length,
        blockedEvidenceItemCount: evidenceItems.filter((item) => item.status === 'blocked').length,
      },
      blockers,
      nextStep: 'Abrir Full Accounting approval decision workspace.',
      guardrails: [
        'Formal approval evidence pack es expediente interno; no artefacto oficial.',
        'Evidencia lista no implica firma, certificacion, legalizacion ni filing.',
      ],
    };
  }
}

export class GetTenantFullAccountingApprovalDecisionWorkspaceUseCase {
  constructor(
    private readonly getTenantFullAccountingFormalApprovalEvidencePackUseCase: GetTenantFullAccountingFormalApprovalEvidencePackUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: AccountingAdvancedDiscoveryInput): Promise<TenantFullAccountingApprovalDecisionWorkspaceView> {
    const evidencePack =
      await this.getTenantFullAccountingFormalApprovalEvidencePackUseCase.execute(input);
    const decisions: TenantFullAccountingApprovalDecisionWorkspaceView['decisions'] =
      evidencePack.evidenceItems.map((item) =>
        fullAccountingApprovalDecision(
          `decision_${item.key}`,
          `${item.label} decision`,
          item.status,
          item.artifactType,
          fullAccountingApprovalDecisionFromEvidence(item),
          fullAccountingOwnerFromApprovalArtifactType(item.artifactType),
          fullAccountingApprovalDecisionRationale(item),
        ),
      );
    const blockers = [...evidencePack.blockers];
    const workspaceStatus = resolveStatus(decisions.map((decision) => decision.status), blockers);

    return {
      ...input,
      generatedAt: this.nowProvider(),
      workspaceStatus,
      evidencePack,
      decisions,
      summary: {
        decisionCount: decisions.length,
        approvedForSignatureFlowCount: decisions.filter((decision) => decision.decision === 'approved_for_signature_flow').length,
        requiresChangesCount: decisions.filter((decision) => decision.decision === 'requires_changes').length,
        requiresExternalReviewCount: decisions.filter((decision) => decision.decision === 'requires_external_review').length,
        rejectedCount: decisions.filter((decision) => decision.decision === 'rejected').length,
      },
      blockers,
      nextStep: 'Consolidar Full Accounting formal approval command center.',
      guardrails: [
        'Approval decision workspace registra decision de workflow; no firma ni certifica.',
        'Approved for signature flow solo habilita una frontera posterior explicita.',
      ],
    };
  }
}

export class GetTenantFullAccountingFormalApprovalCommandCenterUseCase {
  constructor(
    private readonly getTenantFullAccountingApprovalDecisionWorkspaceUseCase: GetTenantFullAccountingApprovalDecisionWorkspaceUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: AccountingAdvancedDiscoveryInput): Promise<TenantFullAccountingFormalApprovalCommandCenterView> {
    const decisionWorkspace =
      await this.getTenantFullAccountingApprovalDecisionWorkspaceUseCase.execute(input);
    const { evidencePack } = decisionWorkspace;
    const { authorityMatrix } = evidencePack;
    const { approvalAnchor } = authorityMatrix;
    const lanes: TenantFullAccountingFormalApprovalCommandCenterView['lanes'] = [
      fullAccountingFormalApprovalLane('approval_anchor', 'Formal approval workflow anchor', approvalAnchor.anchorStatus, 'external_accountant', `${approvalAnchor.summary.readyGateCount}/${approvalAnchor.summary.gateCount} gates`, approvalAnchor.nextStep),
      fullAccountingFormalApprovalLane('authority_matrix', 'Approval authority matrix', authorityMatrix.matrixStatus, 'external_accountant', `${authorityMatrix.summary.authorityCount} authorities`, authorityMatrix.nextStep),
      fullAccountingFormalApprovalLane('evidence_pack', 'Formal approval evidence pack', evidencePack.packStatus, 'operator', `${evidencePack.summary.evidenceItemCount} evidence`, evidencePack.nextStep),
      fullAccountingFormalApprovalLane('decision_workspace', 'Approval decision workspace', decisionWorkspace.workspaceStatus, 'legal_representative', `${decisionWorkspace.summary.approvedForSignatureFlowCount} approved`, decisionWorkspace.nextStep),
    ];
    const blockers = unique([
      ...approvalAnchor.blockers,
      ...authorityMatrix.blockers,
      ...evidencePack.blockers,
      ...decisionWorkspace.blockers,
    ]);
    const commandStatus = resolveStatus(lanes.map((lane) => lane.status), blockers);

    return {
      ...input,
      generatedAt: this.nowProvider(),
      commandStatus,
      decisionWorkspace,
      lanes,
      summary: {
        laneCount: lanes.length,
        readyLaneCount: lanes.filter((lane) => lane.status === 'ready').length,
        needsReviewLaneCount: lanes.filter((lane) => lane.status === 'needs_review').length,
        blockedLaneCount: lanes.filter((lane) => lane.status === 'blocked').length,
        approvedForSignatureFlowCount: decisionWorkspace.summary.approvedForSignatureFlowCount,
        externalReviewCount: decisionWorkspace.summary.requiresExternalReviewCount,
      },
      blockers,
      nextStep: 'Cerrar Full Accounting formal approval workflow 1.0.',
      guardrails: [
        'Formal approval command center no firma, certifica, legaliza ni presenta artefactos.',
        'La salida hacia signature/certification debe abrirse como etapa separada.',
      ],
    };
  }
}

export class RequestTenantFullAccountingFormalApprovalWorkflowCloseoutUseCase {
  constructor(
    private readonly getTenantFullAccountingFormalApprovalCommandCenterUseCase: GetTenantFullAccountingFormalApprovalCommandCenterUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: AccountingAdvancedDiscoveryInput): Promise<TenantFullAccountingFormalApprovalWorkflowCloseoutView> {
    const commandCenter =
      await this.getTenantFullAccountingFormalApprovalCommandCenterUseCase.execute(input);
    const { decisionWorkspace } = commandCenter;
    const { evidencePack } = decisionWorkspace;
    const { authorityMatrix } = evidencePack;
    const { approvalAnchor } = authorityMatrix;
    const closeoutChecklist: TenantFullAccountingFormalApprovalWorkflowCloseoutView['closeoutChecklist'] = [
      fullAccountingFormalApprovalCloseoutCheck('approval_anchor', 'Full Accounting formal approval workflow anchor', approvalAnchor.anchorStatus, ['full_accounting_formal_approval_workflow_anchor']),
      fullAccountingFormalApprovalCloseoutCheck('authority_matrix', 'Full Accounting approval authority matrix', authorityMatrix.matrixStatus, ['full_accounting_approval_authority_matrix']),
      fullAccountingFormalApprovalCloseoutCheck('evidence_pack', 'Full Accounting formal approval evidence pack', evidencePack.packStatus, ['full_accounting_formal_approval_evidence_pack']),
      fullAccountingFormalApprovalCloseoutCheck('decision_workspace', 'Full Accounting approval decision workspace', decisionWorkspace.workspaceStatus, ['full_accounting_approval_decision_workspace']),
      fullAccountingFormalApprovalCloseoutCheck('command_center', 'Full Accounting formal approval command center', commandCenter.commandStatus, ['full_accounting_formal_approval_command_center']),
    ];
    const blockers = unique([
      ...approvalAnchor.blockers,
      ...authorityMatrix.blockers,
      ...evidencePack.blockers,
      ...decisionWorkspace.blockers,
      ...commandCenter.blockers,
    ]);
    const closeoutStatus = resolveStatus(closeoutChecklist.map((item) => item.status), blockers);
    const finalDecision = fullAccountingFormalApprovalWorkflowDecisionFromStatus(
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
        readyChecklistCount: closeoutChecklist.filter((item) => item.status === 'ready').length,
        blockedChecklistCount: closeoutChecklist.filter((item) => item.status === 'blocked').length,
        authorityCount: authorityMatrix.summary.authorityCount,
        evidenceItemCount: evidencePack.summary.evidenceItemCount,
        decisionCount: decisionWorkspace.summary.decisionCount,
        approvedForSignatureFlowCount: decisionWorkspace.summary.approvedForSignatureFlowCount,
      },
      blockers,
      nextStep:
        finalDecision === 'open_signature_certification_boundary'
          ? 'Preparar Full Accounting signature and certification boundary 1.1.'
          : finalDecision === 'continue_formal_approval'
            ? 'Continuar formal approval y resolver aprobaciones pendientes.'
            : finalDecision === 'return_to_professional_review'
              ? 'Volver a Full Accounting professional review execution 0.9.'
              : finalDecision === 'return_to_artifact_drafting'
                ? 'Volver a Full Accounting formal artifact drafting 0.8.'
                : 'No aprobar artefactos formales por ahora.',
      guardrails: [
        'Formal approval workflow closeout no firma, certifica, legaliza, postea ni presenta.',
        'Signature and certification boundary debe abrirse como capa separada antes de cualquier acto oficial.',
      ],
    };
  }
}

export class GetTenantFullAccountingSignatureCertificationBoundaryAnchorUseCase {
  constructor(
    private readonly requestTenantFullAccountingFormalApprovalWorkflowCloseoutUseCase: RequestTenantFullAccountingFormalApprovalWorkflowCloseoutUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: AccountingAdvancedDiscoveryInput): Promise<TenantFullAccountingSignatureCertificationBoundaryAnchorView> {
    const formalApprovalCloseout =
      await this.requestTenantFullAccountingFormalApprovalWorkflowCloseoutUseCase.execute(input);
    const boundaryGates: TenantFullAccountingSignatureCertificationBoundaryAnchorView['boundaryGates'] = [
      fullAccountingSignatureBoundaryGate('approved_artifacts', 'Approved pending signature artifacts', formalApprovalCloseout.closeoutStatus, ['full_accounting_formal_approval_workflow_closeout'], 'signature', 'Only formally approved Full Accounting artifacts can approach signature.'),
      fullAccountingSignatureBoundaryGate('financial_statement_signature', 'Financial statement signature boundary', 'needs_review', ['full_accounting_approval_decision_workspace'], 'signature', 'Representative signature is external and not automated.'),
      fullAccountingSignatureBoundaryGate('bank_certification', 'Bank certification boundary', 'needs_review', ['full_accounting_formal_approval_command_center'], 'certification', 'Certified bank evidence requires external proof and certifier.'),
      fullAccountingSignatureBoundaryGate('legal_book_legalization', 'Legal book legalization boundary', 'needs_review', ['full_accounting_approval_authority_matrix'], 'legalization', 'Ledger books and formal packets keep legalization outside the platform.'),
    ];
    const blockers =
      formalApprovalCloseout.finalDecision === 'open_signature_certification_boundary'
        ? [...formalApprovalCloseout.blockers]
        : unique([
            ...formalApprovalCloseout.blockers,
            `Full Accounting formal approval decision is ${formalApprovalCloseout.finalDecision}.`,
          ]);
    const anchorStatus = resolveStatus(boundaryGates.map((gate) => gate.status), blockers);

    return {
      ...input,
      generatedAt: this.nowProvider(),
      anchorStatus,
      formalApprovalCloseout,
      boundaryGates,
      summary: {
        gateCount: boundaryGates.length,
        readyGateCount: boundaryGates.filter((gate) => gate.status === 'ready').length,
        needsReviewGateCount: boundaryGates.filter((gate) => gate.status === 'needs_review').length,
        blockedGateCount: boundaryGates.filter((gate) => gate.status === 'blocked').length,
        approvedForSignatureFlowCount:
          formalApprovalCloseout.summary.approvedForSignatureFlowCount,
      },
      blockers,
      nextStep:
        anchorStatus === 'blocked'
          ? 'Volver a Full Accounting formal approval workflow 1.0.'
          : 'Construir Full Accounting formal signatory registry.',
      guardrails: [
        'Signature certification boundary 1.1 no firma, certifica, legaliza ni presenta.',
        'Esta capa solo separa actos externos requeridos y evidencia minima para ejecutarlos fuera del sistema.',
      ],
    };
  }
}

export class GetTenantFullAccountingFormalSignatoryRegistryUseCase {
  constructor(
    private readonly getTenantFullAccountingSignatureCertificationBoundaryAnchorUseCase: GetTenantFullAccountingSignatureCertificationBoundaryAnchorUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: AccountingAdvancedDiscoveryInput): Promise<TenantFullAccountingFormalSignatoryRegistryView> {
    const boundaryAnchor =
      await this.getTenantFullAccountingSignatureCertificationBoundaryAnchorUseCase.execute(input);
    const signatories: TenantFullAccountingFormalSignatoryRegistryView['signatories'] = [
      fullAccountingFormalSignatory('ledger_draft_signatory', 'Ledger draft legalization signatory', 'ledger_draft', 'needs_review', 'legalization', 'external_accountant', ['identity confirmation', 'legalization venue confirmation']),
      fullAccountingFormalSignatory('posting_approval_signatory', 'Posting approval signatory', 'posting_approval', 'ready', 'signature', 'external_accountant', ['identity confirmation', 'approval method confirmation']),
      fullAccountingFormalSignatory('bank_evidence_certifier', 'Bank evidence certifier', 'bank_evidence', 'needs_review', 'certification', 'auditor', ['certifier acceptance', 'certified bank proof']),
      fullAccountingFormalSignatory('trial_balance_signatory', 'Trial balance signatory', 'trial_balance', 'ready', 'signature', 'external_accountant', ['identity confirmation', 'trial balance approval reference']),
      fullAccountingFormalSignatory('financial_statement_signatory', 'Financial statement signatory', 'financial_statement', 'needs_review', 'signature', 'legal_representative', ['legal representative confirmation', 'signature method confirmation']),
      fullAccountingFormalSignatory('professional_boundary_signatory', 'Professional boundary signatory', 'professional_boundary', 'ready', 'signature', 'external_accountant', ['professional responsibility attestation']),
    ];
    const blockers = [...boundaryAnchor.blockers];
    const registryStatus = resolveStatus(signatories.map((signatory) => signatory.status), blockers);

    return {
      ...input,
      generatedAt: this.nowProvider(),
      registryStatus,
      boundaryAnchor,
      signatories,
      summary: {
        signatoryCount: signatories.length,
        signatureCount: signatories.filter((signatory) => signatory.requiredAct === 'signature').length,
        certificationCount: signatories.filter((signatory) => signatory.requiredAct === 'certification').length,
        legalizationCount: signatories.filter((signatory) => signatory.requiredAct === 'legalization').length,
        needsReviewSignatoryCount: signatories.filter((signatory) => signatory.status === 'needs_review').length,
      },
      blockers,
      nextStep: 'Armar Full Accounting signature evidence readiness pack.',
      guardrails: [
        'Formal signatory registry identifica responsables externos; no suplanta su autorizacion.',
        'Cada signatory requiere evidencia verificable antes de cualquier handoff de ejecucion.',
      ],
    };
  }
}

export class GetTenantFullAccountingSignatureEvidenceReadinessPackUseCase {
  constructor(
    private readonly getTenantFullAccountingFormalSignatoryRegistryUseCase: GetTenantFullAccountingFormalSignatoryRegistryUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: AccountingAdvancedDiscoveryInput): Promise<TenantFullAccountingSignatureEvidenceReadinessPackView> {
    const signatoryRegistry =
      await this.getTenantFullAccountingFormalSignatoryRegistryUseCase.execute(input);
    const evidenceItems: TenantFullAccountingSignatureEvidenceReadinessPackView['evidenceItems'] =
      signatoryRegistry.signatories.map((signatory) =>
        fullAccountingSignatureEvidenceItem(
          `evidence_${signatory.key}`,
          `${signatory.label} evidence`,
          signatory.status,
          signatory.key,
          signatory.requiredAct,
          ['full_accounting_formal_signatory_registry', signatory.key],
          fullAccountingSignatureEvidenceRequirements(signatory),
        ),
      );
    const blockers = [...signatoryRegistry.blockers];
    const packStatus = resolveStatus(evidenceItems.map((item) => item.status), blockers);

    return {
      ...input,
      generatedAt: this.nowProvider(),
      packStatus,
      signatoryRegistry,
      evidenceItems,
      summary: {
        evidenceItemCount: evidenceItems.length,
        readyEvidenceItemCount: evidenceItems.filter((item) => item.status === 'ready').length,
        missingEvidenceCount: evidenceItems.reduce((total, item) => total + item.missingEvidence.length, 0),
        blockedEvidenceItemCount: evidenceItems.filter((item) => item.status === 'blocked').length,
      },
      blockers,
      nextStep: 'Abrir Full Accounting certification requirement workspace.',
      guardrails: [
        'Signature evidence pack es preparatorio y no ejecuta firmas.',
        'Missing evidence mantiene el flujo dentro de preparacion, no de ejecucion externa.',
      ],
    };
  }
}

export class GetTenantFullAccountingCertificationRequirementWorkspaceUseCase {
  constructor(
    private readonly getTenantFullAccountingSignatureEvidenceReadinessPackUseCase: GetTenantFullAccountingSignatureEvidenceReadinessPackUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: AccountingAdvancedDiscoveryInput): Promise<TenantFullAccountingCertificationRequirementWorkspaceView> {
    const signatureEvidencePack =
      await this.getTenantFullAccountingSignatureEvidenceReadinessPackUseCase.execute(input);
    const requirements: TenantFullAccountingCertificationRequirementWorkspaceView['requirements'] = [
      fullAccountingCertificationRequirement('bank_evidence_certification', 'Bank evidence certification requirement', 'bank_evidence', 'needs_review', 'auditor', 'Requires external certification proof before use as official evidence.', ['full_accounting_signature_evidence_readiness_pack', 'bank_evidence_certifier']),
      fullAccountingCertificationRequirement('financial_statement_certification', 'Financial statement certification review', 'financial_statement', 'needs_review', 'legal_representative', 'Representative confirms certification/signature boundary before external execution.', ['full_accounting_signature_evidence_readiness_pack', 'financial_statement_signatory']),
      fullAccountingCertificationRequirement('trial_balance_certification', 'Trial balance professional certification readiness', 'trial_balance', 'ready', 'external_accountant', 'Accountant attestation can be packaged but not issued by platform.', ['full_accounting_signature_evidence_readiness_pack', 'trial_balance_signatory']),
      fullAccountingCertificationRequirement('professional_boundary_certification', 'Professional boundary certification readiness', 'professional_boundary', 'ready', 'external_accountant', 'Professional responsibility boundary remains explicit in the packet.', ['full_accounting_signature_evidence_readiness_pack', 'professional_boundary_signatory']),
    ];
    const blockers = [...signatureEvidencePack.blockers];
    const workspaceStatus = resolveStatus(requirements.map((requirement) => requirement.status), blockers);

    return {
      ...input,
      generatedAt: this.nowProvider(),
      workspaceStatus,
      signatureEvidencePack,
      requirements,
      summary: {
        requirementCount: requirements.length,
        readyRequirementCount: requirements.filter((requirement) => requirement.status === 'ready').length,
        needsReviewRequirementCount: requirements.filter((requirement) => requirement.status === 'needs_review').length,
        blockedRequirementCount: requirements.filter((requirement) => requirement.status === 'blocked').length,
      },
      blockers,
      nextStep: 'Preparar Full Accounting legalization boundary packet.',
      guardrails: [
        'Certification requirement workspace define requisitos; no emite certificaciones.',
        'Certifier siempre es un rol externo o profesional autorizado, no la plataforma.',
      ],
    };
  }
}

export class GetTenantFullAccountingLegalizationBoundaryPacketUseCase {
  constructor(
    private readonly getTenantFullAccountingCertificationRequirementWorkspaceUseCase: GetTenantFullAccountingCertificationRequirementWorkspaceUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: AccountingAdvancedDiscoveryInput): Promise<TenantFullAccountingLegalizationBoundaryPacketView> {
    const certificationWorkspace =
      await this.getTenantFullAccountingCertificationRequirementWorkspaceUseCase.execute(input);
    const legalizationItems: TenantFullAccountingLegalizationBoundaryPacketView['legalizationItems'] = [
      fullAccountingLegalizationItem('ledger_book_legalization', 'Ledger book legalization boundary', 'ledger_draft', 'needs_review', 'external_accountant', 'Legal book legalization must happen through external professional/legal venue.', ['full_accounting_certification_requirement_workspace', 'ledger_draft_signatory']),
      fullAccountingLegalizationItem('posting_approval_legalization', 'Posting approval legalization boundary', 'posting_approval', 'ready', 'external_accountant', 'Posting approval packet can be handed off but not legalized by platform.', ['full_accounting_certification_requirement_workspace', 'posting_approval_signatory']),
      fullAccountingLegalizationItem('financial_statement_legalization', 'Financial statement legalization boundary', 'financial_statement', 'needs_review', 'legal_representative', 'Financial statement legalization/signature requires legal representative act.', ['full_accounting_certification_requirement_workspace', 'financial_statement_signatory']),
      fullAccountingLegalizationItem('professional_boundary_legalization', 'Professional boundary legalization boundary', 'professional_boundary', 'ready', 'external_accountant', 'Professional boundary packet preserves external accountant responsibility.', ['full_accounting_certification_requirement_workspace', 'professional_boundary_signatory']),
    ];
    const blockers = [...certificationWorkspace.blockers];
    const packetStatus = resolveStatus(legalizationItems.map((item) => item.status), blockers);

    return {
      ...input,
      generatedAt: this.nowProvider(),
      packetStatus,
      certificationWorkspace,
      legalizationItems,
      summary: {
        legalizationItemCount: legalizationItems.length,
        readyLegalizationItemCount: legalizationItems.filter((item) => item.status === 'ready').length,
        needsReviewLegalizationItemCount: legalizationItems.filter((item) => item.status === 'needs_review').length,
        blockedLegalizationItemCount: legalizationItems.filter((item) => item.status === 'blocked').length,
      },
      blockers,
      nextStep: 'Cerrar Full Accounting signature certification boundary 1.1.',
      guardrails: [
        'Legalization boundary packet no legaliza libros ni estados financieros.',
        'Toda legalizacion queda como acto externo antes del external execution handoff.',
      ],
    };
  }
}

export class RequestTenantFullAccountingSignatureCertificationBoundaryCloseoutUseCase {
  constructor(
    private readonly getTenantFullAccountingLegalizationBoundaryPacketUseCase: GetTenantFullAccountingLegalizationBoundaryPacketUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: AccountingAdvancedDiscoveryInput): Promise<TenantFullAccountingSignatureCertificationBoundaryCloseoutView> {
    const legalizationPacket =
      await this.getTenantFullAccountingLegalizationBoundaryPacketUseCase.execute(input);
    const { certificationWorkspace } = legalizationPacket;
    const { signatureEvidencePack } = certificationWorkspace;
    const { signatoryRegistry } = signatureEvidencePack;
    const { boundaryAnchor } = signatoryRegistry;
    const closeoutChecklist: TenantFullAccountingSignatureCertificationBoundaryCloseoutView['closeoutChecklist'] = [
      fullAccountingSignatureBoundaryCloseoutCheck('boundary_anchor', 'Full Accounting signature certification boundary anchor', boundaryAnchor.anchorStatus, ['full_accounting_signature_certification_boundary_anchor']),
      fullAccountingSignatureBoundaryCloseoutCheck('signatory_registry', 'Full Accounting formal signatory registry', signatoryRegistry.registryStatus, ['full_accounting_formal_signatory_registry']),
      fullAccountingSignatureBoundaryCloseoutCheck('signature_evidence_pack', 'Full Accounting signature evidence readiness pack', signatureEvidencePack.packStatus, ['full_accounting_signature_evidence_readiness_pack']),
      fullAccountingSignatureBoundaryCloseoutCheck('certification_workspace', 'Full Accounting certification requirement workspace', certificationWorkspace.workspaceStatus, ['full_accounting_certification_requirement_workspace']),
      fullAccountingSignatureBoundaryCloseoutCheck('legalization_packet', 'Full Accounting legalization boundary packet', legalizationPacket.packetStatus, ['full_accounting_legalization_boundary_packet']),
    ];
    const blockers = unique([
      ...boundaryAnchor.blockers,
      ...signatoryRegistry.blockers,
      ...signatureEvidencePack.blockers,
      ...certificationWorkspace.blockers,
      ...legalizationPacket.blockers,
    ]);
    const closeoutStatus = resolveStatus(closeoutChecklist.map((item) => item.status), blockers);
    const finalDecision = fullAccountingSignatureCertificationBoundaryDecisionFromStatus(
      closeoutStatus,
      signatoryRegistry,
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
        readyChecklistCount: closeoutChecklist.filter((item) => item.status === 'ready').length,
        blockedChecklistCount: closeoutChecklist.filter((item) => item.status === 'blocked').length,
        boundaryGateCount: boundaryAnchor.summary.gateCount,
        signatoryCount: signatoryRegistry.summary.signatoryCount,
        signatureEvidenceItemCount: signatureEvidencePack.summary.evidenceItemCount,
        certificationRequirementCount: certificationWorkspace.summary.requirementCount,
        legalizationItemCount: legalizationPacket.summary.legalizationItemCount,
      },
      blockers,
      nextStep:
        finalDecision === 'open_external_execution_handoff'
          ? 'Preparar Full Accounting external execution handoff 1.2.'
          : finalDecision === 'continue_signature_certification_boundary'
            ? 'Completar evidencia de firma, certificacion y legalizacion.'
            : finalDecision === 'return_to_formal_approval'
              ? 'Volver a Full Accounting formal approval workflow 1.0.'
              : finalDecision === 'return_to_professional_review'
                ? 'Volver a Full Accounting professional review execution 0.9.'
                : 'No preparar external execution handoff por ahora.',
      guardrails: [
        'Signature certification boundary closeout no firma, certifica, legaliza, postea ni presenta.',
        'La siguiente etapa solo puede ser handoff externo controlado, con responsables humanos/profesionales.',
      ],
    };
  }
}

export class GetTenantFullAccountingExternalExecutionHandoffAnchorUseCase {
  constructor(
    private readonly requestTenantFullAccountingSignatureCertificationBoundaryCloseoutUseCase: RequestTenantFullAccountingSignatureCertificationBoundaryCloseoutUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: AccountingAdvancedDiscoveryInput): Promise<TenantFullAccountingExternalExecutionHandoffAnchorView> {
    const signatureCertificationCloseout =
      await this.requestTenantFullAccountingSignatureCertificationBoundaryCloseoutUseCase.execute(input);
    const handoffGates: TenantFullAccountingExternalExecutionHandoffAnchorView['handoffGates'] = [
      fullAccountingExternalHandoffGate('signature_handoff', 'Full Accounting signature handoff gate', signatureCertificationCloseout.closeoutStatus, ['full_accounting_signature_certification_boundary_closeout'], 'signature', 'Signature execution belongs to external signatory.'),
      fullAccountingExternalHandoffGate('certification_handoff', 'Full Accounting certification handoff gate', signatureCertificationCloseout.certificationWorkspace.workspaceStatus, ['full_accounting_certification_requirement_workspace'], 'certification', 'Certification execution belongs to auditor/certifier.'),
      fullAccountingExternalHandoffGate('legalization_handoff', 'Full Accounting legalization handoff gate', signatureCertificationCloseout.legalizationPacket.packetStatus, ['full_accounting_legalization_boundary_packet'], 'legalization', 'Legalization execution belongs to external authority or professional venue.'),
    ];
    const blockers =
      signatureCertificationCloseout.finalDecision === 'open_external_execution_handoff'
        ? [...signatureCertificationCloseout.blockers]
        : unique([
            ...signatureCertificationCloseout.blockers,
            `Full Accounting signature boundary decision is ${signatureCertificationCloseout.finalDecision}.`,
          ]);
    const anchorStatus = resolveStatus(handoffGates.map((gate) => gate.status), blockers);

    return {
      ...input,
      generatedAt: this.nowProvider(),
      anchorStatus,
      signatureCertificationCloseout,
      handoffGates,
      summary: {
        gateCount: handoffGates.length,
        readyGateCount: handoffGates.filter((gate) => gate.status === 'ready').length,
        needsReviewGateCount: handoffGates.filter((gate) => gate.status === 'needs_review').length,
        blockedGateCount: handoffGates.filter((gate) => gate.status === 'blocked').length,
        signatoryCount: signatureCertificationCloseout.summary.signatoryCount,
      },
      blockers,
      nextStep:
        anchorStatus === 'blocked'
          ? 'Volver a Full Accounting signature/certification boundary 1.1.'
          : 'Asignar ejecutores externos por acto formal Full Accounting.',
      guardrails: [
        'Full Accounting external execution handoff 1.2 prepara entrega; no ejecuta actos externos.',
        'Firma, certificacion y legalizacion siguen fuera de la plataforma.',
      ],
    };
  }
}

export class GetTenantFullAccountingExternalExecutorAssignmentMatrixUseCase {
  constructor(
    private readonly getTenantFullAccountingExternalExecutionHandoffAnchorUseCase: GetTenantFullAccountingExternalExecutionHandoffAnchorUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: AccountingAdvancedDiscoveryInput): Promise<TenantFullAccountingExternalExecutorAssignmentMatrixView> {
    const handoffAnchor =
      await this.getTenantFullAccountingExternalExecutionHandoffAnchorUseCase.execute(input);
    const assignments: TenantFullAccountingExternalExecutorAssignmentMatrixView['assignments'] = [
      fullAccountingExternalExecutorAssignment('accountant_signature_execution', 'Accountant signature execution', 'needs_review', 'signature', 'external_accountant', 'Review and sign accountant-owned Full Accounting packs externally.'),
      fullAccountingExternalExecutorAssignment('legal_representative_signature', 'Legal representative signature', 'needs_review', 'signature', 'legal_representative', 'Sign financial statement artifacts externally.'),
      fullAccountingExternalExecutorAssignment('auditor_certification', 'Auditor certification execution', 'needs_review', 'certification', 'auditor', 'Certify financial or reconciliation evidence externally.'),
      fullAccountingExternalExecutorAssignment('bank_certifier_execution', 'Bank certifier execution', 'needs_review', 'certification', 'bank_certifier', 'Return external bank certification proof for Full Accounting evidence.'),
      fullAccountingExternalExecutorAssignment('legalization_authority_execution', 'Legalization authority execution', 'needs_review', 'legalization', 'legalization_authority', 'Legalize books/statements or return observations externally.'),
    ];
    const blockers = [...handoffAnchor.blockers];
    const matrixStatus = resolveStatus(assignments.map((assignment) => assignment.status), blockers);

    return {
      ...input,
      generatedAt: this.nowProvider(),
      matrixStatus,
      handoffAnchor,
      assignments,
      summary: {
        assignmentCount: assignments.length,
        readyAssignmentCount: assignments.filter((assignment) => assignment.status === 'ready').length,
        needsReviewAssignmentCount: assignments.filter((assignment) => assignment.status === 'needs_review').length,
        blockedAssignmentCount: assignments.filter((assignment) => assignment.status === 'blocked').length,
        externalExecutorCount: new Set(assignments.map((assignment) => assignment.executorRole)).size,
      },
      blockers,
      nextStep: 'Preparar bundles de evidencia Full Accounting para cada ejecutor externo.',
      guardrails: [
        'External executor assignment matrix reparte responsabilidad; no envia ni ejecuta.',
        'Cada ejecutor externo conserva responsabilidad sobre el acto formal.',
      ],
    };
  }
}

export class GetTenantFullAccountingExecutionHandoffEvidenceBundleUseCase {
  constructor(
    private readonly getTenantFullAccountingExternalExecutorAssignmentMatrixUseCase: GetTenantFullAccountingExternalExecutorAssignmentMatrixUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: AccountingAdvancedDiscoveryInput): Promise<TenantFullAccountingExecutionHandoffEvidenceBundleView> {
    const executorMatrix =
      await this.getTenantFullAccountingExternalExecutorAssignmentMatrixUseCase.execute(input);
    const bundles: TenantFullAccountingExecutionHandoffEvidenceBundleView['bundles'] =
      executorMatrix.assignments.map((assignment) =>
        fullAccountingExecutionBundle(
          `bundle_${assignment.key}`,
          `${assignment.label} bundle`,
          assignment.status,
          assignment.key,
          ['full_accounting_approved_formal_artifact', assignment.externalAct],
          ['full_accounting_signature_certification_boundary_closeout', assignment.key],
          assignment.status === 'ready' ? [] : [`${assignment.key}_pending_evidence`],
        ),
      );
    const blockers = [...executorMatrix.blockers];
    const bundleStatus = resolveStatus(bundles.map((bundle) => bundle.status), blockers);

    return {
      ...input,
      generatedAt: this.nowProvider(),
      bundleStatus,
      executorMatrix,
      bundles,
      summary: {
        bundleCount: bundles.length,
        readyBundleCount: bundles.filter((bundle) => bundle.status === 'ready').length,
        needsReviewBundleCount: bundles.filter((bundle) => bundle.status === 'needs_review').length,
        blockedBundleCount: bundles.filter((bundle) => bundle.status === 'blocked').length,
        blockerRefCount: bundles.flatMap((bundle) => bundle.blockerRefs).length,
      },
      blockers,
      nextStep: 'Generar instrucciones de ejecucion externa Full Accounting por bundle.',
      guardrails: [
        'Execution handoff evidence bundle empaqueta entrega; no transmite oficialmente.',
        'Los blockers viajan visibles para evitar ejecucion externa incompleta.',
      ],
    };
  }
}

export class GetTenantFullAccountingExternalExecutionInstructionPackUseCase {
  constructor(
    private readonly getTenantFullAccountingExecutionHandoffEvidenceBundleUseCase: GetTenantFullAccountingExecutionHandoffEvidenceBundleUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: AccountingAdvancedDiscoveryInput): Promise<TenantFullAccountingExternalExecutionInstructionPackView> {
    const evidenceBundle =
      await this.getTenantFullAccountingExecutionHandoffEvidenceBundleUseCase.execute(input);
    const instructions: TenantFullAccountingExternalExecutionInstructionPackView['instructions'] =
      evidenceBundle.bundles.map((bundle) =>
        fullAccountingExternalInstruction(
          `instruction_${bundle.assignmentKey}`,
          `${bundle.label} instructions`,
          bundle.status,
          bundle.assignmentKey,
          'Ejecutar solo el acto externo asignado, devolver evidencia y no modificar artefactos Full Accounting aprobados sin observacion.',
          ['execution_status', 'executor_note', 'returned_artifact_reference'],
        ),
      );
    const blockers = [...evidenceBundle.blockers];
    const packStatus = resolveStatus(instructions.map((instruction) => instruction.status), blockers);

    return {
      ...input,
      generatedAt: this.nowProvider(),
      packStatus,
      evidenceBundle,
      instructions,
      summary: {
        instructionCount: instructions.length,
        readyInstructionCount: instructions.filter((instruction) => instruction.status === 'ready').length,
        needsReviewInstructionCount: instructions.filter((instruction) => instruction.status === 'needs_review').length,
        blockedInstructionCount: instructions.filter((instruction) => instruction.status === 'blocked').length,
        expectedReturnEvidenceCount: instructions.flatMap((instruction) => instruction.expectedReturnEvidence).length,
      },
      blockers,
      nextStep: 'Preparar intake de retorno para resultados externos Full Accounting.',
      guardrails: [
        'External execution instruction pack orienta al tercero; no dispara ejecucion externa.',
        'La evidencia de retorno esperada queda definida antes del tracking.',
      ],
    };
  }
}

export class GetTenantFullAccountingExecutionReturnEvidenceIntakeUseCase {
  constructor(
    private readonly getTenantFullAccountingExternalExecutionInstructionPackUseCase: GetTenantFullAccountingExternalExecutionInstructionPackUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: AccountingAdvancedDiscoveryInput): Promise<TenantFullAccountingExecutionReturnEvidenceIntakeView> {
    const instructionPack =
      await this.getTenantFullAccountingExternalExecutionInstructionPackUseCase.execute(input);
    const returnChannels: TenantFullAccountingExecutionReturnEvidenceIntakeView['returnChannels'] = [
      fullAccountingReturnEvidenceChannel('signed_return', 'Signed Full Accounting artifact return', 'needs_review', 'signed', ['signed_artifact_reference', 'signatory_identity']),
      fullAccountingReturnEvidenceChannel('certified_return', 'Certified Full Accounting artifact return', 'needs_review', 'certified', ['certification_reference', 'certifier_identity']),
      fullAccountingReturnEvidenceChannel('legalized_return', 'Legalized Full Accounting record return', 'needs_review', 'legalized', ['legalization_reference', 'legalization_authority']),
      fullAccountingReturnEvidenceChannel('observed_return', 'Observed execution return', 'ready', 'observed', ['observation_note', 'required_fix']),
      fullAccountingReturnEvidenceChannel('rejected_return', 'Rejected execution return', 'ready', 'rejected', ['rejection_reason', 'executor_note']),
    ];
    const blockers = [...instructionPack.blockers];
    const intakeStatus = resolveStatus(returnChannels.map((channel) => channel.status), blockers);

    return {
      ...input,
      generatedAt: this.nowProvider(),
      intakeStatus,
      instructionPack,
      returnChannels,
      summary: {
        channelCount: returnChannels.length,
        readyChannelCount: returnChannels.filter((channel) => channel.status === 'ready').length,
        needsReviewChannelCount: returnChannels.filter((channel) => channel.status === 'needs_review').length,
        blockedChannelCount: returnChannels.filter((channel) => channel.status === 'blocked').length,
        requiredEvidenceCount: returnChannels.flatMap((channel) => channel.requiredEvidence).length,
      },
      blockers,
      nextStep: 'Cerrar handoff Full Accounting y decidir si tracking externo puede iniciar.',
      guardrails: [
        'Execution return evidence intake define entradas esperadas; no acepta documentos oficiales como source of truth todavia.',
        'External execution tracking posterior debe validar retornos antes de cualquier estado oficial.',
      ],
    };
  }
}

export class RequestTenantFullAccountingExternalExecutionHandoffCloseoutUseCase {
  constructor(
    private readonly getTenantFullAccountingExecutionReturnEvidenceIntakeUseCase: GetTenantFullAccountingExecutionReturnEvidenceIntakeUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: AccountingAdvancedDiscoveryInput): Promise<TenantFullAccountingExternalExecutionHandoffCloseoutView> {
    const returnEvidenceIntake =
      await this.getTenantFullAccountingExecutionReturnEvidenceIntakeUseCase.execute(input);
    const { instructionPack } = returnEvidenceIntake;
    const { evidenceBundle } = instructionPack;
    const { executorMatrix } = evidenceBundle;
    const { handoffAnchor } = executorMatrix;
    const closeoutChecklist: TenantFullAccountingExternalExecutionHandoffCloseoutView['closeoutChecklist'] = [
      fullAccountingExternalHandoffCloseoutCheck('handoff_anchor', 'Full Accounting external execution handoff anchor', handoffAnchor.anchorStatus, ['full_accounting_external_execution_handoff_anchor']),
      fullAccountingExternalHandoffCloseoutCheck('executor_matrix', 'Full Accounting external executor assignment matrix', executorMatrix.matrixStatus, ['full_accounting_external_executor_assignment_matrix']),
      fullAccountingExternalHandoffCloseoutCheck('evidence_bundle', 'Full Accounting execution handoff evidence bundle', evidenceBundle.bundleStatus, ['full_accounting_execution_handoff_evidence_bundle']),
      fullAccountingExternalHandoffCloseoutCheck('instruction_pack', 'Full Accounting external execution instruction pack', instructionPack.packStatus, ['full_accounting_external_execution_instruction_pack']),
      fullAccountingExternalHandoffCloseoutCheck('return_intake', 'Full Accounting execution return evidence intake', returnEvidenceIntake.intakeStatus, ['full_accounting_execution_return_evidence_intake']),
    ];
    const blockers = unique([
      ...handoffAnchor.blockers,
      ...executorMatrix.blockers,
      ...evidenceBundle.blockers,
      ...instructionPack.blockers,
      ...returnEvidenceIntake.blockers,
    ]);
    const closeoutStatus = resolveStatus(closeoutChecklist.map((item) => item.status), blockers);
    const finalDecision = fullAccountingExternalExecutionHandoffDecisionFromStatus(
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
        readyChecklistCount: closeoutChecklist.filter((item) => item.status === 'ready').length,
        blockedChecklistCount: closeoutChecklist.filter((item) => item.status === 'blocked').length,
        assignmentCount: executorMatrix.summary.assignmentCount,
        bundleCount: evidenceBundle.summary.bundleCount,
        instructionCount: instructionPack.summary.instructionCount,
        returnChannelCount: returnEvidenceIntake.summary.channelCount,
      },
      blockers,
      nextStep:
        finalDecision === 'open_external_execution_tracking'
          ? 'Iniciar Full Accounting external execution tracking 1.3 con handoff trazable.'
          : finalDecision === 'continue_external_execution_handoff'
            ? 'Completar asignaciones, bundles e intake antes del tracking externo.'
            : finalDecision === 'return_to_signature_certification_boundary'
              ? 'Volver a Full Accounting signature/certification boundary 1.1.'
              : finalDecision === 'return_to_formal_approval'
                ? 'Volver a Full Accounting formal approval workflow 1.0.'
                : 'No entregar actos formales externos para este periodo.',
      guardrails: [
        'Full Accounting external execution handoff closeout no ejecuta actos externos ni oficializa resultados.',
        'External execution tracking debe validar retornos antes de cualquier estado oficial.',
      ],
    };
  }
}

export class GetTenantFullAccountingExternalExecutionTrackingAnchorUseCase {
  constructor(
    private readonly requestTenantFullAccountingExternalExecutionHandoffCloseoutUseCase: RequestTenantFullAccountingExternalExecutionHandoffCloseoutUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: AccountingAdvancedDiscoveryInput): Promise<TenantFullAccountingExternalExecutionTrackingAnchorView> {
    const handoffCloseout =
      await this.requestTenantFullAccountingExternalExecutionHandoffCloseoutUseCase.execute(input);
    const trackingLanes: TenantFullAccountingExternalExecutionTrackingAnchorView['trackingLanes'] = [
      fullAccountingExternalTrackingLane('signature_tracking', 'Full Accounting signature execution tracking', handoffCloseout.handoffAnchor.anchorStatus, 'signature', 'in_external_review', ['full_accounting_signature_handoff_gate']),
      fullAccountingExternalTrackingLane('certification_tracking', 'Full Accounting certification execution tracking', handoffCloseout.evidenceBundle.bundleStatus, 'certification', 'sent_outside_platform', ['full_accounting_certification_handoff_bundle']),
      fullAccountingExternalTrackingLane('legalization_tracking', 'Full Accounting legalization execution tracking', handoffCloseout.instructionPack.packStatus, 'legalization', 'not_started', ['full_accounting_legalization_instruction_pack']),
    ];
    const blockers =
      handoffCloseout.finalDecision === 'open_external_execution_tracking'
        ? [...handoffCloseout.blockers]
        : unique([
            ...handoffCloseout.blockers,
            `Full Accounting external handoff decision is ${handoffCloseout.finalDecision}.`,
          ]);
    const trackingStatus = resolveStatus(trackingLanes.map((lane) => lane.status), blockers);

    return {
      ...input,
      generatedAt: this.nowProvider(),
      trackingStatus,
      handoffCloseout,
      trackingLanes,
      summary: {
        laneCount: trackingLanes.length,
        readyLaneCount: trackingLanes.filter((lane) => lane.status === 'ready').length,
        needsReviewLaneCount: trackingLanes.filter((lane) => lane.status === 'needs_review').length,
        blockedLaneCount: trackingLanes.filter((lane) => lane.status === 'blocked').length,
        handoffChecklistCount: handoffCloseout.summary.checklistCount,
      },
      blockers,
      nextStep:
        trackingStatus === 'blocked'
          ? 'Volver a Full Accounting external execution handoff 1.2.'
          : 'Registrar ledger de estados Full Accounting por acto externo.',
      guardrails: [
        'Full Accounting external execution tracking 1.3 observa estados; no ejecuta actos externos.',
        'Los estados externos no oficializan resultados sin intake y validacion interna posterior.',
      ],
    };
  }
}

export class GetTenantFullAccountingExternalExecutionStatusLedgerUseCase {
  constructor(
    private readonly getTenantFullAccountingExternalExecutionTrackingAnchorUseCase: GetTenantFullAccountingExternalExecutionTrackingAnchorUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: AccountingAdvancedDiscoveryInput): Promise<TenantFullAccountingExternalExecutionStatusLedgerView> {
    const trackingAnchor =
      await this.getTenantFullAccountingExternalExecutionTrackingAnchorUseCase.execute(input);
    const events: TenantFullAccountingExternalExecutionStatusLedgerView['events'] =
      trackingAnchor.trackingLanes.map((lane) =>
        fullAccountingExternalTrackingEvent(
          `event_${lane.key}`,
          `${lane.label} ledger event`,
          lane.status,
          lane.key,
          lane.externalAct,
          fullAccountingExternalActorForAct(lane.externalAct),
          lane.trackingState === 'in_external_review'
            ? 'external_actor_reviewing'
            : lane.trackingState === 'returned_with_observation'
              ? 'external_observation_returned'
              : lane.trackingState === 'rejected'
                ? 'external_rejection_returned'
                : lane.trackingState === 'returned_with_evidence'
                  ? 'external_result_returned'
                  : 'queued_for_external_actor',
          fullAccountingExpectedEvidenceForAct(lane.externalAct),
          lane.trackingState === 'returned_with_evidence'
            ? fullAccountingExpectedEvidenceForAct(lane.externalAct)
            : [],
          lane.status === 'ready' ? [] : [`${lane.key}_pending_external_update`],
        ),
      );
    const blockers = [...trackingAnchor.blockers];
    const ledgerStatus = resolveStatus(events.map((event) => event.status), blockers);

    return {
      ...input,
      generatedAt: this.nowProvider(),
      ledgerStatus,
      trackingAnchor,
      events,
      summary: {
        eventCount: events.length,
        readyEventCount: events.filter((event) => event.status === 'ready').length,
        needsReviewEventCount: events.filter((event) => event.status === 'needs_review').length,
        blockedEventCount: events.filter((event) => event.status === 'blocked').length,
        evidenceRequiredCount: events.flatMap((event) => event.evidenceRequired).length,
        evidenceReceivedCount: events.flatMap((event) => event.evidenceReceived).length,
      },
      blockers,
      nextStep: 'Validar evidencia Full Accounting retornada por ejecutores externos.',
      guardrails: [
        'External execution status ledger registra estado conceptual; no sustituye evidencia externa.',
        'Los eventos no cambian artefactos aprobados ni estados oficiales.',
      ],
    };
  }
}

export class GetTenantFullAccountingReturnedEvidenceValidationWorkspaceUseCase {
  constructor(
    private readonly getTenantFullAccountingExternalExecutionStatusLedgerUseCase: GetTenantFullAccountingExternalExecutionStatusLedgerUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: AccountingAdvancedDiscoveryInput): Promise<TenantFullAccountingReturnedEvidenceValidationWorkspaceView> {
    const statusLedger =
      await this.getTenantFullAccountingExternalExecutionStatusLedgerUseCase.execute(input);
    const validations: TenantFullAccountingReturnedEvidenceValidationWorkspaceView['validations'] =
      statusLedger.events.map((event) =>
        fullAccountingReturnedEvidenceValidation(
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
    const validationStatus = resolveStatus(validations.map((validation) => validation.status), blockers);

    return {
      ...input,
      generatedAt: this.nowProvider(),
      validationStatus,
      statusLedger,
      validations,
      summary: {
        validationCount: validations.length,
        validReturnCount: validations.filter((validation) => validation.validationResult === 'valid_return').length,
        observedReturnCount: validations.filter((validation) => validation.validationResult === 'observed_return').length,
        rejectedReturnCount: validations.filter((validation) => validation.validationResult === 'rejected_return').length,
        insufficientEvidenceCount: validations.filter((validation) => validation.validationResult === 'insufficient_evidence').length,
      },
      blockers,
      nextStep: 'Clasificar observaciones externas Full Accounting y rutas de resolucion.',
      guardrails: [
        'Returned evidence validation workspace revisa retornos; no acepta resultados como oficiales.',
        'La evidencia insuficiente debe resolverse antes de intake interno.',
      ],
    };
  }
}

export class GetTenantFullAccountingExternalObservationResolutionQueueUseCase {
  constructor(
    private readonly getTenantFullAccountingReturnedEvidenceValidationWorkspaceUseCase: GetTenantFullAccountingReturnedEvidenceValidationWorkspaceUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: AccountingAdvancedDiscoveryInput): Promise<TenantFullAccountingExternalObservationResolutionQueueView> {
    const validationWorkspace =
      await this.getTenantFullAccountingReturnedEvidenceValidationWorkspaceUseCase.execute(input);
    const observations: TenantFullAccountingExternalObservationResolutionQueueView['observations'] =
      validationWorkspace.validations.map((validation) =>
        fullAccountingExternalObservation(
          `observation_${validation.key}`,
          `${validation.label} observation route`,
          validation.status,
          validation.key,
          fullAccountingResolutionRouteForValidation(validation.validationResult),
          validation.validationResult === 'valid_return'
            ? 'No external observation requires routing.'
            : `${validation.validationResult} requires reviewed resolution before intake.`,
        ),
      );
    const blockers = [...validationWorkspace.blockers];
    const queueStatus = resolveStatus(observations.map((observation) => observation.status), blockers);

    return {
      ...input,
      generatedAt: this.nowProvider(),
      queueStatus,
      validationWorkspace,
      observations,
      summary: {
        observationCount: observations.length,
        readyObservationCount: observations.filter((observation) => observation.status === 'ready').length,
        needsReviewObservationCount: observations.filter((observation) => observation.status === 'needs_review').length,
        blockedObservationCount: observations.filter((observation) => observation.status === 'blocked').length,
        routedObservationCount: observations.filter((observation) => observation.resolutionRoute !== 'no_resolution_required').length,
      },
      blockers,
      nextStep: 'Consolidar Full Accounting external execution tracking command center.',
      guardrails: [
        'External observation queue enruta correcciones; no corrige artefactos automaticamente.',
        'Todo rechazo u observacion conserva revision humana antes de avanzar.',
      ],
    };
  }
}

export class GetTenantFullAccountingExternalExecutionTrackingCommandCenterUseCase {
  constructor(
    private readonly getTenantFullAccountingExternalObservationResolutionQueueUseCase: GetTenantFullAccountingExternalObservationResolutionQueueUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: AccountingAdvancedDiscoveryInput): Promise<TenantFullAccountingExternalExecutionTrackingCommandCenterView> {
    const observationQueue =
      await this.getTenantFullAccountingExternalObservationResolutionQueueUseCase.execute(input);
    const { validationWorkspace } = observationQueue;
    const { statusLedger } = validationWorkspace;
    const commandLanes: TenantFullAccountingExternalExecutionTrackingCommandCenterView['commandLanes'] = [
      fullAccountingTrackingCommandLane('external_events', 'Full Accounting external events', statusLedger.ledgerStatus, 'ledger_events', statusLedger.summary.eventCount),
      fullAccountingTrackingCommandLane('returned_results', 'Full Accounting returned results', validationWorkspace.validationStatus, 'valid_returns', validationWorkspace.summary.validReturnCount),
      fullAccountingTrackingCommandLane('external_observations', 'Full Accounting external observations', observationQueue.queueStatus, 'routed_observations', observationQueue.summary.routedObservationCount),
    ];
    const blockers = unique([
      ...statusLedger.blockers,
      ...validationWorkspace.blockers,
      ...observationQueue.blockers,
    ]);
    const commandStatus = resolveStatus(commandLanes.map((lane) => lane.status), blockers);
    const suggestedDecision = fullAccountingExternalExecutionTrackingDecisionFromStatus(
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
        readyLaneCount: commandLanes.filter((lane) => lane.status === 'ready').length,
        needsReviewLaneCount: commandLanes.filter((lane) => lane.status === 'needs_review').length,
        blockedLaneCount: commandLanes.filter((lane) => lane.status === 'blocked').length,
        returnedCount: validationWorkspace.summary.validReturnCount,
        observedCount: validationWorkspace.summary.observedReturnCount,
        rejectedCount: validationWorkspace.summary.rejectedReturnCount,
      },
      blockers,
      nextStep:
        suggestedDecision === 'open_external_result_intake'
          ? 'Preparar Full Accounting external result intake and internal acceptance 1.4.'
          : suggestedDecision === 'resolve_external_observations'
            ? 'Resolver observaciones externas antes del intake interno.'
            : suggestedDecision === 'return_to_external_execution_handoff'
              ? 'Volver a Full Accounting external execution handoff 1.2.'
              : 'Continuar tracking hasta recibir evidencia externa suficiente.',
      guardrails: [
        'Tracking command center prioriza seguimiento; no oficializa evidencia retornada.',
        'La decision sugerida no reemplaza aceptacion interna formal.',
      ],
    };
  }
}

export class RequestTenantFullAccountingExternalExecutionTrackingCloseoutUseCase {
  constructor(
    private readonly getTenantFullAccountingExternalExecutionTrackingCommandCenterUseCase: GetTenantFullAccountingExternalExecutionTrackingCommandCenterUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: AccountingAdvancedDiscoveryInput): Promise<TenantFullAccountingExternalExecutionTrackingCloseoutView> {
    const commandCenter =
      await this.getTenantFullAccountingExternalExecutionTrackingCommandCenterUseCase.execute(input);
    const { observationQueue } = commandCenter;
    const { validationWorkspace } = observationQueue;
    const { statusLedger } = validationWorkspace;
    const { trackingAnchor } = statusLedger;
    const closeoutChecklist: TenantFullAccountingExternalExecutionTrackingCloseoutView['closeoutChecklist'] = [
      fullAccountingExternalTrackingCloseoutCheck('tracking_anchor', 'Full Accounting external execution tracking anchor', trackingAnchor.trackingStatus, ['full_accounting_external_execution_tracking_anchor']),
      fullAccountingExternalTrackingCloseoutCheck('status_ledger', 'Full Accounting external execution status ledger', statusLedger.ledgerStatus, ['full_accounting_external_execution_status_ledger']),
      fullAccountingExternalTrackingCloseoutCheck('returned_evidence_validation', 'Full Accounting returned evidence validation workspace', validationWorkspace.validationStatus, ['full_accounting_returned_evidence_validation_workspace']),
      fullAccountingExternalTrackingCloseoutCheck('observation_queue', 'Full Accounting external observation resolution queue', observationQueue.queueStatus, ['full_accounting_external_observation_resolution_queue']),
      fullAccountingExternalTrackingCloseoutCheck('tracking_command_center', 'Full Accounting external execution tracking command center', commandCenter.commandStatus, ['full_accounting_external_execution_tracking_command_center']),
    ];
    const blockers = unique([
      ...trackingAnchor.blockers,
      ...statusLedger.blockers,
      ...validationWorkspace.blockers,
      ...observationQueue.blockers,
      ...commandCenter.blockers,
    ]);
    const closeoutStatus = resolveStatus(closeoutChecklist.map((item) => item.status), blockers);
    const finalDecision = fullAccountingExternalExecutionTrackingDecisionFromStatus(
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
        readyChecklistCount: closeoutChecklist.filter((item) => item.status === 'ready').length,
        blockedChecklistCount: closeoutChecklist.filter((item) => item.status === 'blocked').length,
        trackingLaneCount: trackingAnchor.summary.laneCount,
        ledgerEventCount: statusLedger.summary.eventCount,
        validationCount: validationWorkspace.summary.validationCount,
        observationCount: observationQueue.summary.observationCount,
      },
      blockers,
      nextStep:
        finalDecision === 'open_external_result_intake'
          ? 'Iniciar Full Accounting external result intake and internal acceptance 1.4.'
          : finalDecision === 'resolve_external_observations'
            ? 'Resolver observaciones externas antes de aceptar resultados.'
            : finalDecision === 'return_to_external_execution_handoff'
              ? 'Volver a Full Accounting external execution handoff 1.2.'
              : finalDecision === 'continue_external_execution_tracking'
                ? 'Continuar tracking hasta recibir resultados externos.'
                : 'No aceptar resultados externos para este periodo.',
      guardrails: [
        'Full Accounting external execution tracking closeout no acepta resultados externos como oficiales.',
        'La aceptacion interna debe ocurrir en una capa posterior con evidencia validada.',
      ],
    };
  }
}

export class GetTenantFullAccountingExternalResultIntakeAnchorUseCase {
  constructor(
    private readonly requestTenantFullAccountingExternalExecutionTrackingCloseoutUseCase: RequestTenantFullAccountingExternalExecutionTrackingCloseoutUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: AccountingAdvancedDiscoveryInput): Promise<TenantFullAccountingExternalResultIntakeAnchorView> {
    const trackingCloseout =
      await this.requestTenantFullAccountingExternalExecutionTrackingCloseoutUseCase.execute(input);
    const resultIntakeGates: TenantFullAccountingExternalResultIntakeAnchorView['resultIntakeGates'] =
      trackingCloseout.validationWorkspace.validations.map((validation) =>
        fullAccountingExternalResultIntakeGate(
          `intake_${validation.key}`,
          `${validation.label} intake gate`,
          validation.status,
          fullAccountingExternalActFromValidationKey(validation.eventKey),
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
      trackingCloseout.finalDecision === 'open_external_result_intake'
        ? [...trackingCloseout.blockers]
        : unique([
            ...trackingCloseout.blockers,
            `Full Accounting external tracking decision is ${trackingCloseout.finalDecision}.`,
          ]);
    const intakeStatus = resolveStatus(resultIntakeGates.map((gate) => gate.status), blockers);

    return {
      ...input,
      generatedAt: this.nowProvider(),
      intakeStatus,
      trackingCloseout,
      resultIntakeGates,
      summary: {
        gateCount: resultIntakeGates.length,
        readyGateCount: resultIntakeGates.filter((gate) => gate.status === 'ready').length,
        needsReviewGateCount: resultIntakeGates.filter((gate) => gate.status === 'needs_review').length,
        blockedGateCount: resultIntakeGates.filter((gate) => gate.status === 'blocked').length,
        trackingChecklistCount: trackingCloseout.summary.checklistCount,
      },
      blockers,
      nextStep:
        intakeStatus === 'blocked'
          ? 'Volver a Full Accounting external execution tracking 1.3.'
          : 'Registrar artefactos Full Accounting retornados para criterios de aceptacion.',
      guardrails: [
        'Full Accounting external result intake 1.4 abre revision interna; no oficializa resultados.',
        'Los resultados externos deben pasar criterios internos antes de expediente formal.',
      ],
    };
  }
}

export class GetTenantFullAccountingReturnedArtifactRegistryUseCase {
  constructor(
    private readonly getTenantFullAccountingExternalResultIntakeAnchorUseCase: GetTenantFullAccountingExternalResultIntakeAnchorUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: AccountingAdvancedDiscoveryInput): Promise<TenantFullAccountingReturnedArtifactRegistryView> {
    const intakeAnchor =
      await this.getTenantFullAccountingExternalResultIntakeAnchorUseCase.execute(input);
    const returnedArtifacts: TenantFullAccountingReturnedArtifactRegistryView['returnedArtifacts'] =
      intakeAnchor.resultIntakeGates.map((gate) =>
        fullAccountingReturnedArtifact(
          `artifact_${gate.key}`,
          `${gate.label} artifact`,
          gate.status,
          gate.key,
          fullAccountingArtifactKindFromIntakeGate(gate),
          fullAccountingExternalActorForAct(gate.externalAct),
          gate.evidenceRefs,
          gate.status === 'ready' ? [] : [`${gate.key}_artifact_not_accepted`],
        ),
      );
    const blockers = [...intakeAnchor.blockers];
    const registryStatus = resolveStatus(returnedArtifacts.map((artifact) => artifact.status), blockers);

    return {
      ...input,
      generatedAt: this.nowProvider(),
      registryStatus,
      intakeAnchor,
      returnedArtifacts,
      summary: {
        artifactCount: returnedArtifacts.length,
        signedArtifactCount: returnedArtifacts.filter((artifact) => artifact.artifactKind === 'signed').length,
        certifiedArtifactCount: returnedArtifacts.filter((artifact) => artifact.artifactKind === 'certified').length,
        legalizedArtifactCount: returnedArtifacts.filter((artifact) => artifact.artifactKind === 'legalized').length,
        observedArtifactCount: returnedArtifacts.filter((artifact) => artifact.artifactKind === 'observed').length,
        rejectedArtifactCount: returnedArtifacts.filter((artifact) => artifact.artifactKind === 'rejected').length,
      },
      blockers,
      nextStep: 'Evaluar criterios internos de aceptacion por artefacto Full Accounting.',
      guardrails: [
        'Returned artifact registry registra referencias; no almacena evidencia oficial.',
        'Cada artefacto retornado conserva blockers visibles hasta aceptacion interna.',
      ],
    };
  }
}

export class GetTenantFullAccountingInternalAcceptanceCriteriaWorkspaceUseCase {
  constructor(
    private readonly getTenantFullAccountingReturnedArtifactRegistryUseCase: GetTenantFullAccountingReturnedArtifactRegistryUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: AccountingAdvancedDiscoveryInput): Promise<TenantFullAccountingInternalAcceptanceCriteriaWorkspaceView> {
    const artifactRegistry =
      await this.getTenantFullAccountingReturnedArtifactRegistryUseCase.execute(input);
    const criteria: TenantFullAccountingInternalAcceptanceCriteriaWorkspaceView['criteria'] =
      artifactRegistry.returnedArtifacts.flatMap((artifact) => [
        fullAccountingInternalAcceptanceCriterion(`actor_${artifact.key}`, `${artifact.label} actor identity`, artifact.status, artifact.key, 'actor_identity', [artifact.actorRef], artifact.status === 'ready' ? [] : [`${artifact.key}_actor_pending`]),
        fullAccountingInternalAcceptanceCriterion(`evidence_${artifact.key}`, `${artifact.label} evidence completeness`, artifact.status, artifact.key, 'evidence_completeness', artifact.evidenceRefs, artifact.blockerRefs),
        fullAccountingInternalAcceptanceCriterion(`trace_${artifact.key}`, `${artifact.label} traceability match`, artifact.status, artifact.key, 'traceability_match', [artifact.intakeGateKey], artifact.status === 'ready' ? [] : [`${artifact.key}_trace_pending`]),
      ]);
    const blockers = [...artifactRegistry.blockers];
    const criteriaStatus = resolveStatus(criteria.map((item) => item.status), blockers);

    return {
      ...input,
      generatedAt: this.nowProvider(),
      criteriaStatus,
      artifactRegistry,
      criteria,
      summary: {
        criteriaCount: criteria.length,
        readyCriteriaCount: criteria.filter((item) => item.status === 'ready').length,
        needsReviewCriteriaCount: criteria.filter((item) => item.status === 'needs_review').length,
        blockedCriteriaCount: criteria.filter((item) => item.status === 'blocked').length,
        blockerRefCount: criteria.flatMap((item) => item.blockerRefs).length,
      },
      blockers,
      nextStep: 'Decidir aceptacion interna por resultado externo Full Accounting.',
      guardrails: [
        'Los criterios internos no sustituyen aprobacion profesional formal.',
        'Un artefacto sin trazabilidad completa no entra al expediente formal.',
      ],
    };
  }
}

export class GetTenantFullAccountingAcceptanceDecisionWorkspaceUseCase {
  constructor(
    private readonly getTenantFullAccountingInternalAcceptanceCriteriaWorkspaceUseCase: GetTenantFullAccountingInternalAcceptanceCriteriaWorkspaceUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: AccountingAdvancedDiscoveryInput): Promise<TenantFullAccountingAcceptanceDecisionWorkspaceView> {
    const criteriaWorkspace =
      await this.getTenantFullAccountingInternalAcceptanceCriteriaWorkspaceUseCase.execute(input);
    const decisions: TenantFullAccountingAcceptanceDecisionWorkspaceView['decisions'] =
      criteriaWorkspace.artifactRegistry.returnedArtifacts.map((artifact) =>
        fullAccountingAcceptanceDecision(
          `decision_${artifact.key}`,
          `${artifact.label} acceptance decision`,
          artifact.status,
          artifact.key,
          artifact.status === 'ready'
            ? 'accepted_for_record_assembly'
            : artifact.artifactKind === 'rejected'
              ? 'return_to_handoff'
              : artifact.artifactKind === 'observed'
                ? 'return_to_external_tracking'
                : 'needs_internal_review',
          artifact.status === 'ready'
            ? 'Returned artifact meets Full Accounting internal intake criteria.'
            : 'Returned artifact needs internal review before formal record assembly.',
        ),
      );
    const blockers = [...criteriaWorkspace.blockers];
    const decisionStatus = resolveStatus(decisions.map((decision) => decision.status), blockers);

    return {
      ...input,
      generatedAt: this.nowProvider(),
      decisionStatus,
      criteriaWorkspace,
      decisions,
      summary: {
        decisionCount: decisions.length,
        acceptedDecisionCount: decisions.filter((decision) => decision.decision === 'accepted_for_record_assembly').length,
        needsReviewDecisionCount: decisions.filter((decision) => decision.decision === 'needs_internal_review').length,
        returnToTrackingDecisionCount: decisions.filter((decision) => decision.decision === 'return_to_external_tracking').length,
        returnToHandoffDecisionCount: decisions.filter((decision) => decision.decision === 'return_to_handoff').length,
        rejectedDecisionCount: decisions.filter((decision) => decision.decision === 'rejected_for_period').length,
      },
      blockers,
      nextStep: 'Consolidar aceptacion interna Full Accounting en command center.',
      guardrails: [
        'Acceptance decision workspace decide intake interno; no arma expediente formal.',
        'La aceptacion interna no emite libros ni estados financieros oficiales.',
      ],
    };
  }
}

export class GetTenantFullAccountingInternalAcceptanceCommandCenterUseCase {
  constructor(
    private readonly getTenantFullAccountingAcceptanceDecisionWorkspaceUseCase: GetTenantFullAccountingAcceptanceDecisionWorkspaceUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: AccountingAdvancedDiscoveryInput): Promise<TenantFullAccountingInternalAcceptanceCommandCenterView> {
    const decisionWorkspace =
      await this.getTenantFullAccountingAcceptanceDecisionWorkspaceUseCase.execute(input);
    const { criteriaWorkspace } = decisionWorkspace;
    const { artifactRegistry } = criteriaWorkspace;
    const commandLanes: TenantFullAccountingInternalAcceptanceCommandCenterView['commandLanes'] = [
      fullAccountingInternalAcceptanceCommandLane('returned_artifacts', 'Full Accounting returned artifacts', artifactRegistry.registryStatus, 'artifacts', artifactRegistry.summary.artifactCount),
      fullAccountingInternalAcceptanceCommandLane('acceptance_criteria', 'Full Accounting acceptance criteria', criteriaWorkspace.criteriaStatus, 'criteria', criteriaWorkspace.summary.criteriaCount),
      fullAccountingInternalAcceptanceCommandLane('acceptance_decisions', 'Full Accounting acceptance decisions', decisionWorkspace.decisionStatus, 'decisions', decisionWorkspace.summary.decisionCount),
    ];
    const blockers = unique([
      ...artifactRegistry.blockers,
      ...criteriaWorkspace.blockers,
      ...decisionWorkspace.blockers,
    ]);
    const commandStatus = resolveStatus(commandLanes.map((lane) => lane.status), blockers);
    const suggestedDecision = fullAccountingExternalResultIntakeDecisionFromStatus(
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
        readyLaneCount: commandLanes.filter((lane) => lane.status === 'ready').length,
        needsReviewLaneCount: commandLanes.filter((lane) => lane.status === 'needs_review').length,
        blockedLaneCount: commandLanes.filter((lane) => lane.status === 'blocked').length,
        receivedArtifactCount: artifactRegistry.summary.artifactCount,
        acceptedArtifactCount: decisionWorkspace.summary.acceptedDecisionCount,
        observedArtifactCount: artifactRegistry.summary.observedArtifactCount,
        rejectedArtifactCount: artifactRegistry.summary.rejectedArtifactCount,
      },
      blockers,
      nextStep:
        suggestedDecision === 'open_formal_record_assembly'
          ? 'Preparar Full Accounting formal record assembly 1.5 con resultados aceptados.'
          : suggestedDecision === 'continue_internal_acceptance_review'
            ? 'Completar revision interna antes de armar expediente formal.'
            : suggestedDecision === 'return_to_external_execution_tracking'
              ? 'Volver a Full Accounting external execution tracking 1.3.'
              : 'Volver a Full Accounting external execution handoff 1.2.',
      guardrails: [
        'Internal acceptance command center consolida aceptacion interna; no oficializa records.',
        'Formal record assembly debe ocurrir en un bloque posterior.',
      ],
    };
  }
}

export class RequestTenantFullAccountingExternalResultIntakeCloseoutUseCase {
  constructor(
    private readonly getTenantFullAccountingInternalAcceptanceCommandCenterUseCase: GetTenantFullAccountingInternalAcceptanceCommandCenterUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: AccountingAdvancedDiscoveryInput): Promise<TenantFullAccountingExternalResultIntakeCloseoutView> {
    const commandCenter =
      await this.getTenantFullAccountingInternalAcceptanceCommandCenterUseCase.execute(input);
    const { decisionWorkspace } = commandCenter;
    const { criteriaWorkspace } = decisionWorkspace;
    const { artifactRegistry } = criteriaWorkspace;
    const { intakeAnchor } = artifactRegistry;
    const closeoutChecklist: TenantFullAccountingExternalResultIntakeCloseoutView['closeoutChecklist'] = [
      fullAccountingExternalResultIntakeCloseoutCheck('intake_anchor', 'Full Accounting external result intake anchor', intakeAnchor.intakeStatus, ['full_accounting_external_result_intake_anchor']),
      fullAccountingExternalResultIntakeCloseoutCheck('artifact_registry', 'Full Accounting returned artifact registry', artifactRegistry.registryStatus, ['full_accounting_returned_artifact_registry']),
      fullAccountingExternalResultIntakeCloseoutCheck('acceptance_criteria', 'Full Accounting internal acceptance criteria workspace', criteriaWorkspace.criteriaStatus, ['full_accounting_internal_acceptance_criteria_workspace']),
      fullAccountingExternalResultIntakeCloseoutCheck('acceptance_decisions', 'Full Accounting acceptance decision workspace', decisionWorkspace.decisionStatus, ['full_accounting_acceptance_decision_workspace']),
      fullAccountingExternalResultIntakeCloseoutCheck('acceptance_command_center', 'Full Accounting internal acceptance command center', commandCenter.commandStatus, ['full_accounting_internal_acceptance_command_center']),
    ];
    const blockers = unique([
      ...intakeAnchor.blockers,
      ...artifactRegistry.blockers,
      ...criteriaWorkspace.blockers,
      ...decisionWorkspace.blockers,
      ...commandCenter.blockers,
    ]);
    const closeoutStatus = resolveStatus(closeoutChecklist.map((item) => item.status), blockers);
    const finalDecision = fullAccountingExternalResultIntakeDecisionFromStatus(
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
        readyChecklistCount: closeoutChecklist.filter((item) => item.status === 'ready').length,
        blockedChecklistCount: closeoutChecklist.filter((item) => item.status === 'blocked').length,
        intakeGateCount: intakeAnchor.summary.gateCount,
        returnedArtifactCount: artifactRegistry.summary.artifactCount,
        criteriaCount: criteriaWorkspace.summary.criteriaCount,
        decisionCount: decisionWorkspace.summary.decisionCount,
      },
      blockers,
      nextStep:
        finalDecision === 'open_formal_record_assembly'
          ? 'Iniciar Full Accounting formal record assembly 1.5 con resultados externos aceptados.'
          : finalDecision === 'continue_internal_acceptance_review'
            ? 'Completar revision interna antes de armar expediente formal.'
            : finalDecision === 'return_to_external_execution_tracking'
              ? 'Volver a Full Accounting external execution tracking 1.3.'
              : finalDecision === 'return_to_external_execution_handoff'
                ? 'Volver a Full Accounting external execution handoff 1.2.'
                : 'No aceptar resultados externos para este periodo.',
      guardrails: [
        'Full Accounting external result intake closeout no arma ni emite registros oficiales.',
        'Formal record assembly debe abrirse como etapa separada con evidencia aceptada.',
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

function formalRecordGate(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  recordType: TenantAccountingAdvancedFormalRecordAssemblyAnchorView['recordGates'][number]['recordType'],
  assemblyState: TenantAccountingAdvancedFormalRecordAssemblyAnchorView['recordGates'][number]['assemblyState'],
  evidenceRefs: string[],
): TenantAccountingAdvancedFormalRecordAssemblyAnchorView['recordGates'][number] {
  return { key, label, status, recordType, assemblyState, evidenceRefs };
}

function acceptedArtifactBinder(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  recordGateKey: string,
  recordType: TenantAccountingAdvancedAcceptedArtifactBinderView['binders'][number]['recordType'],
  acceptedArtifactRefs: string[],
  evidenceRefs: string[],
  blockerRefs: string[],
): TenantAccountingAdvancedAcceptedArtifactBinderView['binders'][number] {
  return {
    key,
    label,
    status,
    recordGateKey,
    recordType,
    acceptedArtifactRefs,
    evidenceRefs,
    blockerRefs,
  };
}

function formalRecordIndexSection(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  binderKey: string,
  sectionType: TenantAccountingAdvancedFormalRecordIndexWorkspaceView['indexSections'][number]['sectionType'],
  evidenceRefs: string[],
): TenantAccountingAdvancedFormalRecordIndexWorkspaceView['indexSections'][number] {
  return { key, label, status, binderKey, sectionType, evidenceRefs };
}

function recordConsistencyCheck(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  binderKey: string,
  checkType: TenantAccountingAdvancedRecordConsistencyReviewWorkspaceView['consistencyChecks'][number]['checkType'],
  resolutionRoute: TenantAccountingAdvancedRecordConsistencyReviewWorkspaceView['consistencyChecks'][number]['resolutionRoute'],
  blockerRefs: string[],
): TenantAccountingAdvancedRecordConsistencyReviewWorkspaceView['consistencyChecks'][number] {
  return {
    key,
    label,
    status,
    binderKey,
    checkType,
    resolutionRoute,
    blockerRefs,
  };
}

function formalRecordCommandLane(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  metric: string,
  count: number,
): TenantAccountingAdvancedFormalRecordAssemblyCommandCenterView['commandLanes'][number] {
  return { key, label, status, metric, count };
}

function formalRecordAssemblyCloseoutCheck(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  evidenceRefs: string[],
): TenantAccountingAdvancedFormalRecordAssemblyCloseoutView['closeoutChecklist'][number] {
  return { key, label, status, evidenceRefs };
}

function recordTypeFromArtifactKey(
  artifactKey: string,
): TenantAccountingAdvancedFormalRecordAssemblyAnchorView['recordGates'][number]['recordType'] {
  if (artifactKey.includes('certification')) {
    return 'certified_reconciliation';
  }
  if (artifactKey.includes('legalization')) {
    return 'formal_books';
  }
  if (artifactKey.includes('adjustment')) {
    return 'adjustment_evidence';
  }
  return 'financial_statement';
}

function formalRecordAssemblyDecisionFromStatus(
  status: AccountingReadinessStatus,
  consistencyReview: TenantAccountingAdvancedRecordConsistencyReviewWorkspaceView,
  blockers: string[],
): AccountingAdvancedFormalRecordAssemblyDecision {
  if (blockers.length > 0 || status === 'blocked') {
    return 'return_to_internal_acceptance';
  }
  if (consistencyReview.summary.routedCheckCount > 0) {
    return 'needs_record_consistency_review';
  }
  if (consistencyReview.summary.readyCheckCount > 0) {
    return 'ready_for_formal_record_closeout';
  }
  return 'do_not_assemble_formal_record';
}

function formalRecordCloseoutGate(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  gateType: TenantAccountingAdvancedFormalRecordCloseoutAnchorView['closeoutGates'][number]['gateType'],
  closeoutState: TenantAccountingAdvancedFormalRecordCloseoutAnchorView['closeoutGates'][number]['closeoutState'],
  evidenceRefs: string[],
): TenantAccountingAdvancedFormalRecordCloseoutAnchorView['closeoutGates'][number] {
  return { key, label, status, gateType, closeoutState, evidenceRefs };
}

function archiveReadinessFolder(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  folderType: TenantAccountingAdvancedArchiveReadinessWorkspaceView['archiveFolders'][number]['folderType'],
  retentionSignal: TenantAccountingAdvancedArchiveReadinessWorkspaceView['archiveFolders'][number]['retentionSignal'],
  evidenceRefs: string[],
  blockerRefs: string[],
): TenantAccountingAdvancedArchiveReadinessWorkspaceView['archiveFolders'][number] {
  return {
    key,
    label,
    status,
    folderType,
    retentionSignal,
    evidenceRefs,
    blockerRefs,
  };
}

function formalCloseoutEvidencePacket(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  archiveFolderKey: string,
  packetType: TenantAccountingAdvancedFormalCloseoutEvidencePacketView['evidencePackets'][number]['packetType'],
  evidenceRefs: string[],
  missingRefs: string[],
): TenantAccountingAdvancedFormalCloseoutEvidencePacketView['evidencePackets'][number] {
  return {
    key,
    label,
    status,
    archiveFolderKey,
    packetType,
    evidenceRefs,
    missingRefs,
  };
}

function professionalCloseoutAttestationItem(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  owner: AccountingAdvancedProfessionalOwner,
  attestationType: TenantAccountingAdvancedProfessionalCloseoutAttestationBoundaryView['attestationItems'][number]['attestationType'],
  evidenceRefs: string[],
  guardrail: string,
): TenantAccountingAdvancedProfessionalCloseoutAttestationBoundaryView['attestationItems'][number] {
  return {
    key,
    label,
    status,
    owner,
    attestationType,
    evidenceRefs,
    guardrail,
  };
}

function formalRecordCloseoutCommandLane(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  metric: string,
  count: number,
): TenantAccountingAdvancedFormalRecordCloseoutCommandCenterView['commandLanes'][number] {
  return { key, label, status, metric, count };
}

function formalRecordCloseoutCheck(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  evidenceRefs: string[],
): TenantAccountingAdvancedFormalRecordCloseoutCloseoutView['closeoutChecklist'][number] {
  return { key, label, status, evidenceRefs };
}

function evidencePacketTypeFromArchiveFolder(
  folderType: TenantAccountingAdvancedArchiveReadinessWorkspaceView['archiveFolders'][number]['folderType'],
): TenantAccountingAdvancedFormalCloseoutEvidencePacketView['evidencePackets'][number]['packetType'] {
  if (folderType === 'evidence_chain') {
    return 'source_artifacts';
  }
  if (folderType === 'decision_log') {
    return 'operator_decision';
  }
  if (folderType === 'professional_review') {
    return 'professional_boundary';
  }
  if (folderType === 'exceptions') {
    return 'consistency_snapshot';
  }
  return 'index_snapshot';
}

function formalRecordCloseoutDecisionFromStatus(
  status: AccountingReadinessStatus,
  attestationBoundary: TenantAccountingAdvancedProfessionalCloseoutAttestationBoundaryView,
  blockers: string[],
): AccountingAdvancedFormalRecordCloseoutDecision {
  if (blockers.length > 0 || status === 'blocked') {
    return 'return_to_formal_record_assembly';
  }
  if (attestationBoundary.boundaryStatus !== 'ready') {
    return 'needs_professional_attestation';
  }
  if (attestationBoundary.evidencePacket.archiveReadiness.archiveStatus !== 'ready') {
    return 'needs_archive_readiness_review';
  }
  if (attestationBoundary.summary.professionalOwnedItemCount > 0) {
    return 'ready_for_archive_handoff';
  }
  return 'do_not_close_formal_record';
}

function graduationArchiveHandoffGate(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  gateType: TenantAccountingAdvancedGraduationArchiveHandoffAnchorView['handoffGates'][number]['gateType'],
  handoffState: TenantAccountingAdvancedGraduationArchiveHandoffAnchorView['handoffGates'][number]['handoffState'],
  evidenceRefs: string[],
): TenantAccountingAdvancedGraduationArchiveHandoffAnchorView['handoffGates'][number] {
  return { key, label, status, gateType, handoffState, evidenceRefs };
}

function archiveHandoffItem(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  itemType: TenantAccountingAdvancedArchiveHandoffPackageView['handoffItems'][number]['itemType'],
  custodyMode: TenantAccountingAdvancedArchiveHandoffPackageView['handoffItems'][number]['custodyMode'],
  evidenceRefs: string[],
  blockerRefs: string[],
): TenantAccountingAdvancedArchiveHandoffPackageView['handoffItems'][number] {
  return {
    key,
    label,
    status,
    itemType,
    custodyMode,
    evidenceRefs,
    blockerRefs,
  };
}

function graduationSignal(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  signalType: TenantAccountingAdvancedGraduationSignalMatrixView['graduationSignals'][number]['signalType'],
  recommendation: TenantAccountingAdvancedGraduationSignalMatrixView['graduationSignals'][number]['recommendation'],
  evidenceRefs: string[],
): TenantAccountingAdvancedGraduationSignalMatrixView['graduationSignals'][number] {
  return { key, label, status, signalType, recommendation, evidenceRefs };
}

function productScopeDecision(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  scopeArea: TenantAccountingAdvancedProductScopeDecisionWorkspaceView['scopeDecisions'][number]['scopeArea'],
  decision: TenantAccountingAdvancedProductScopeDecisionWorkspaceView['scopeDecisions'][number]['decision'],
  evidenceRefs: string[],
): TenantAccountingAdvancedProductScopeDecisionWorkspaceView['scopeDecisions'][number] {
  return { key, label, status, scopeArea, decision, evidenceRefs };
}

function graduationArchiveHandoffCommandLane(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  metric: string,
  count: number,
): TenantAccountingAdvancedGraduationArchiveHandoffCommandCenterView['commandLanes'][number] {
  return { key, label, status, metric, count };
}

function graduationArchiveHandoffCloseoutCheck(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  evidenceRefs: string[],
): TenantAccountingAdvancedGraduationArchiveHandoffCloseoutView['closeoutChecklist'][number] {
  return { key, label, status, evidenceRefs };
}

function graduationArchiveHandoffDecisionFromStatus(
  status: AccountingReadinessStatus,
  productScopeDecisionView: TenantAccountingAdvancedProductScopeDecisionWorkspaceView,
  blockers: string[],
): AccountingAdvancedGraduationArchiveHandoffDecision {
  if (blockers.length > 0 || status === 'blocked') {
    return 'return_to_formal_record_closeout';
  }
  if (productScopeDecisionView.summary.fullAccountingCandidateCount > 0) {
    return 'graduate_to_full_accounting_candidate';
  }
  if (productScopeDecisionView.summary.archiveOnlyDecisionCount > 0) {
    return 'ready_for_archive_handoff_only';
  }
  if (productScopeDecisionView.summary.hardeningDecisionCount > 0) {
    return 'continue_accounting_advanced_hardening';
  }
  return 'do_not_graduate_or_handoff';
}

function fullAccountingCandidateSignal(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  signalType: TenantFullAccountingCandidateAnchorView['candidateSignals'][number]['signalType'],
  candidateState: TenantFullAccountingCandidateAnchorView['candidateSignals'][number]['candidateState'],
  evidenceRefs: string[],
): TenantFullAccountingCandidateAnchorView['candidateSignals'][number] {
  return { key, label, status, signalType, candidateState, evidenceRefs };
}

function fullAccountingLedgerScopeItem(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  scopeType: TenantFullAccountingCoreLedgerScopeBlueprintView['ledgerScopeItems'][number]['scopeType'],
  implementationMode: TenantFullAccountingCoreLedgerScopeBlueprintView['ledgerScopeItems'][number]['implementationMode'],
  evidenceRefs: string[],
): TenantFullAccountingCoreLedgerScopeBlueprintView['ledgerScopeItems'][number] {
  return { key, label, status, scopeType, implementationMode, evidenceRefs };
}

function fullAccountingBankBoundaryItem(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  boundaryType: TenantFullAccountingBankReconciliationBoundaryView['bankBoundaryItems'][number]['boundaryType'],
  ownership: TenantFullAccountingBankReconciliationBoundaryView['bankBoundaryItems'][number]['ownership'],
  evidenceRefs: string[],
): TenantFullAccountingBankReconciliationBoundaryView['bankBoundaryItems'][number] {
  return { key, label, status, boundaryType, ownership, evidenceRefs };
}

function fullAccountingStatementItem(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  statementType: TenantFullAccountingFinancialStatementsBlueprintView['statementItems'][number]['statementType'],
  readiness: TenantFullAccountingFinancialStatementsBlueprintView['statementItems'][number]['readiness'],
  evidenceRefs: string[],
): TenantFullAccountingFinancialStatementsBlueprintView['statementItems'][number] {
  return { key, label, status, statementType, readiness, evidenceRefs };
}

function fullAccountingStatutoryBoundaryItem(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  boundaryType: TenantFullAccountingLegalBooksStatutoryBoundaryView['statutoryBoundaryItems'][number]['boundaryType'],
  owner: AccountingAdvancedProfessionalOwner,
  evidenceRefs: string[],
  guardrail: string,
): TenantFullAccountingLegalBooksStatutoryBoundaryView['statutoryBoundaryItems'][number] {
  return { key, label, status, boundaryType, owner, evidenceRefs, guardrail };
}

function fullAccountingCandidateCloseoutCheck(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  evidenceRefs: string[],
): TenantFullAccountingCandidateCloseoutView['closeoutChecklist'][number] {
  return { key, label, status, evidenceRefs };
}

function fullAccountingCandidateDecisionFromStatus(
  status: AccountingReadinessStatus,
  candidateAnchor: TenantFullAccountingCandidateAnchorView,
  ledgerScopeBlueprint: TenantFullAccountingCoreLedgerScopeBlueprintView,
  legalBooksStatutoryBoundary: TenantFullAccountingLegalBooksStatutoryBoundaryView,
  blockers: string[],
): FullAccountingCandidateDecision {
  if (blockers.length > 0 || status === 'blocked') {
    return 'return_to_accounting_advanced_hardening';
  }
  if (
    candidateAnchor.summary.graduationCandidateCount > 0 &&
    ledgerScopeBlueprint.summary.persistenceDesignCount > 0 &&
    legalBooksStatutoryBoundary.summary.platformGuardrailItemCount > 0
  ) {
    return 'open_full_accounting_mvp';
  }
  if (candidateAnchor.summary.needsDiscoverySignalCount > 0) {
    return 'continue_candidate_discovery';
  }
  if (candidateAnchor.graduationCloseout.finalDecision === 'ready_for_archive_handoff_only') {
    return 'archive_handoff_only';
  }
  return 'do_not_open_full_accounting';
}

function fullAccountingMvpReadinessGate(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  gateType: TenantFullAccountingMvpReadinessAnchorView['readinessGates'][number]['gateType'],
  readinessState: TenantFullAccountingMvpReadinessAnchorView['readinessGates'][number]['readinessState'],
  evidenceRefs: string[],
): TenantFullAccountingMvpReadinessAnchorView['readinessGates'][number] {
  return { key, label, status, gateType, readinessState, evidenceRefs };
}

function fullAccountingLedgerPersistenceItem(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  persistenceType: TenantFullAccountingLedgerPersistenceDesignWorkspaceView['persistenceItems'][number]['persistenceType'],
  invariant: TenantFullAccountingLedgerPersistenceDesignWorkspaceView['persistenceItems'][number]['invariant'],
  evidenceRefs: string[],
): TenantFullAccountingLedgerPersistenceDesignWorkspaceView['persistenceItems'][number] {
  return { key, label, status, persistenceType, invariant, evidenceRefs };
}

function fullAccountingPostingPolicyItem(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  policyType: TenantFullAccountingPostingPolicyApprovalBoundaryView['policyItems'][number]['policyType'],
  owner: AccountingAdvancedProfessionalOwner,
  evidenceRefs: string[],
  guardrail: string,
): TenantFullAccountingPostingPolicyApprovalBoundaryView['policyItems'][number] {
  return { key, label, status, policyType, owner, evidenceRefs, guardrail };
}

function fullAccountingBankMvpReadinessItem(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  readinessType: TenantFullAccountingBankFeedReconciliationMvpReadinessView['bankReadinessItems'][number]['readinessType'],
  implementationMode: TenantFullAccountingBankFeedReconciliationMvpReadinessView['bankReadinessItems'][number]['implementationMode'],
  evidenceRefs: string[],
): TenantFullAccountingBankFeedReconciliationMvpReadinessView['bankReadinessItems'][number] {
  return { key, label, status, readinessType, implementationMode, evidenceRefs };
}

function fullAccountingStatementReadinessItem(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  readinessType: TenantFullAccountingTrialBalanceStatementReadinessView['statementReadinessItems'][number]['readinessType'],
  dependency: TenantFullAccountingTrialBalanceStatementReadinessView['statementReadinessItems'][number]['dependency'],
  evidenceRefs: string[],
): TenantFullAccountingTrialBalanceStatementReadinessView['statementReadinessItems'][number] {
  return { key, label, status, readinessType, dependency, evidenceRefs };
}

function fullAccountingMvpReadinessCloseoutCheck(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  evidenceRefs: string[],
): TenantFullAccountingMvpReadinessCloseoutView['closeoutChecklist'][number] {
  return { key, label, status, evidenceRefs };
}

function fullAccountingMvpReadinessDecisionFromStatus(
  status: AccountingReadinessStatus,
  readinessAnchor: TenantFullAccountingMvpReadinessAnchorView,
  ledgerPersistenceDesign: TenantFullAccountingLedgerPersistenceDesignWorkspaceView,
  postingPolicyBoundary: TenantFullAccountingPostingPolicyApprovalBoundaryView,
  blockers: string[],
): FullAccountingMvpReadinessDecision {
  if (blockers.length > 0 || status === 'blocked') {
    return 'return_to_candidate_discovery';
  }
  if (readinessAnchor.summary.needsReadinessGateCount > 0) {
    return 'continue_mvp_readiness';
  }
  if (
    ledgerPersistenceDesign.summary.approvalInvariantCount > 0 &&
    postingPolicyBoundary.summary.accountantOwnedItemCount > 0
  ) {
    return 'open_full_accounting_mvp_operations';
  }
  return 'do_not_open_mvp';
}

function fullAccountingMvpOperationLane(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  laneType: TenantFullAccountingMvpOperationsAnchorView['operationLanes'][number]['laneType'],
  operationMode: TenantFullAccountingMvpOperationsAnchorView['operationLanes'][number]['operationMode'],
  evidenceRefs: string[],
): TenantFullAccountingMvpOperationsAnchorView['operationLanes'][number] {
  return { key, label, status, laneType, operationMode, evidenceRefs };
}

function fullAccountingLedgerWorkItem(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  workType: TenantFullAccountingLedgerWorkbenchMvpView['ledgerWorkItems'][number]['workType'],
  workMode: TenantFullAccountingLedgerWorkbenchMvpView['ledgerWorkItems'][number]['workMode'],
  evidenceRefs: string[],
): TenantFullAccountingLedgerWorkbenchMvpView['ledgerWorkItems'][number] {
  return { key, label, status, workType, workMode, evidenceRefs };
}

function fullAccountingPostingDraftItem(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  draftState: TenantFullAccountingPostingDraftLaneView['draftItems'][number]['draftState'],
  approvalOwner: AccountingAdvancedProfessionalOwner,
  evidenceRefs: string[],
): TenantFullAccountingPostingDraftLaneView['draftItems'][number] {
  return { key, label, status, draftState, approvalOwner, evidenceRefs };
}

function fullAccountingReconciliationWorkItem(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  reconciliationType: TenantFullAccountingBankReconciliationWorkbenchMvpView['reconciliationItems'][number]['reconciliationType'],
  workMode: TenantFullAccountingBankReconciliationWorkbenchMvpView['reconciliationItems'][number]['workMode'],
  evidenceRefs: string[],
): TenantFullAccountingBankReconciliationWorkbenchMvpView['reconciliationItems'][number] {
  return { key, label, status, reconciliationType, workMode, evidenceRefs };
}

function fullAccountingTrialBalancePreviewItem(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  previewType: TenantFullAccountingTrialBalancePreviewWorkbenchView['previewItems'][number]['previewType'],
  dependency: TenantFullAccountingTrialBalancePreviewWorkbenchView['previewItems'][number]['dependency'],
  evidenceRefs: string[],
): TenantFullAccountingTrialBalancePreviewWorkbenchView['previewItems'][number] {
  return { key, label, status, previewType, dependency, evidenceRefs };
}

function fullAccountingMvpOperationsCloseoutCheck(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  evidenceRefs: string[],
): TenantFullAccountingMvpOperationsCloseoutView['closeoutChecklist'][number] {
  return { key, label, status, evidenceRefs };
}

function fullAccountingMvpOperationsDecisionFromStatus(
  status: AccountingReadinessStatus,
  operationsAnchor: TenantFullAccountingMvpOperationsAnchorView,
  ledgerWorkbench: TenantFullAccountingLedgerWorkbenchMvpView,
  postingDraftLane: TenantFullAccountingPostingDraftLaneView,
  blockers: string[],
): FullAccountingMvpOperationsDecision {
  if (blockers.length > 0 || status === 'blocked') {
    return 'return_to_mvp_readiness';
  }
  if (
    operationsAnchor.summary.simulationLaneCount > 0 &&
    ledgerWorkbench.summary.simulationItemCount > 0 &&
    postingDraftLane.summary.simulationApprovedCount > 0
  ) {
    return 'advance_to_controlled_pilot';
  }
  if (operationsAnchor.summary.readyLaneCount > 0) {
    return 'continue_operations_hardening';
  }
  return 'stop_full_accounting_mvp';
}

function fullAccountingControlledPilotLane(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  laneType: TenantFullAccountingControlledPilotAnchorView['pilotLanes'][number]['laneType'],
  pilotMode: TenantFullAccountingControlledPilotAnchorView['pilotLanes'][number]['pilotMode'],
  evidenceRefs: string[],
): TenantFullAccountingControlledPilotAnchorView['pilotLanes'][number] {
  return { key, label, status, laneType, pilotMode, evidenceRefs };
}

function fullAccountingPilotFrozenEvidence(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  sourceLane: TenantFullAccountingPilotEnrollmentPeriodFreezeView['frozenEvidence'][number]['sourceLane'],
  freezeMode: TenantFullAccountingPilotEnrollmentPeriodFreezeView['frozenEvidence'][number]['freezeMode'],
  evidenceRefs: string[],
): TenantFullAccountingPilotEnrollmentPeriodFreezeView['frozenEvidence'][number] {
  return { key, label, status, sourceLane, freezeMode, evidenceRefs };
}

function fullAccountingPilotRunbookStep(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  stepType: TenantFullAccountingPilotRunbookWorkspaceView['runbookSteps'][number]['stepType'],
  owner: AccountingAdvancedProfessionalOwner,
  successMetric: string,
  evidenceRefs: string[],
): TenantFullAccountingPilotRunbookWorkspaceView['runbookSteps'][number] {
  return { key, label, status, stepType, owner, successMetric, evidenceRefs };
}

function fullAccountingPilotReviewItem(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  reviewType: TenantFullAccountingPilotAccountantReviewRoomView['reviewItems'][number]['reviewType'],
  owner: AccountingAdvancedProfessionalOwner,
  evidenceRefs: string[],
): TenantFullAccountingPilotAccountantReviewRoomView['reviewItems'][number] {
  return { key, label, status, reviewType, owner, evidenceRefs };
}

function fullAccountingPilotOutcomeSignal(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  signalType: TenantFullAccountingPilotOutcomePacketView['outcomeSignals'][number]['signalType'],
  signalStrength: TenantFullAccountingPilotOutcomePacketView['outcomeSignals'][number]['signalStrength'],
  evidenceRefs: string[],
): TenantFullAccountingPilotOutcomePacketView['outcomeSignals'][number] {
  return { key, label, status, signalType, signalStrength, evidenceRefs };
}

function fullAccountingControlledPilotCloseoutCheck(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  evidenceRefs: string[],
): TenantFullAccountingControlledPilotCloseoutView['closeoutChecklist'][number] {
  return { key, label, status, evidenceRefs };
}

function fullAccountingControlledPilotDecisionFromStatus(
  status: AccountingReadinessStatus,
  pilotAnchor: TenantFullAccountingControlledPilotAnchorView,
  accountantReviewRoom: TenantFullAccountingPilotAccountantReviewRoomView,
  outcomePacket: TenantFullAccountingPilotOutcomePacketView,
  blockers: string[],
): FullAccountingControlledPilotDecision {
  if (blockers.length > 0 || status === 'blocked') {
    return 'return_to_mvp_operations';
  }
  if (pilotAnchor.summary.controlledLaneCount === 0) {
    return 'return_to_mvp_readiness';
  }
  if (
    accountantReviewRoom.summary.accountantOwnedItemCount > 0 &&
    outcomePacket.summary.accountantAcceptanceCount > 0 &&
    outcomePacket.summary.graduationSignalCount > 0
  ) {
    return 'prepare_full_accounting_graduation';
  }
  if (outcomePacket.summary.hardeningSignalCount > 0) {
    return 'continue_controlled_pilot';
  }
  return 'stop_full_accounting_mvp';
}

function fullAccountingGraduationLane(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  laneType: TenantFullAccountingGraduationAnchorView['graduationLanes'][number]['laneType'],
  graduationSignal: TenantFullAccountingGraduationAnchorView['graduationLanes'][number]['graduationSignal'],
  evidenceRefs: string[],
): TenantFullAccountingGraduationAnchorView['graduationLanes'][number] {
  return { key, label, status, laneType, graduationSignal, evidenceRefs };
}

function fullAccountingGraduationEvidenceSection(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  sectionType: TenantFullAccountingGraduationEvidenceDossierView['evidenceSections'][number]['sectionType'],
  evidenceRefs: string[],
): TenantFullAccountingGraduationEvidenceDossierView['evidenceSections'][number] {
  return { key, label, status, sectionType, evidenceRefs };
}

function fullAccountingGraduationModuleDecision(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  moduleType: TenantFullAccountingProductScopeGraduationMatrixView['moduleDecisions'][number]['moduleType'],
  scopeDecision: TenantFullAccountingProductScopeGraduationMatrixView['moduleDecisions'][number]['scopeDecision'],
  evidenceRefs: string[],
): TenantFullAccountingProductScopeGraduationMatrixView['moduleDecisions'][number] {
  return { key, label, status, moduleType, scopeDecision, evidenceRefs };
}

function fullAccountingProfessionalResponsibility(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  activityType: TenantFullAccountingProfessionalOperatingModelView['responsibilityAssignments'][number]['activityType'],
  owner: AccountingAdvancedProfessionalOwner,
  automationBoundary: TenantFullAccountingProfessionalOperatingModelView['responsibilityAssignments'][number]['automationBoundary'],
  evidenceRefs: string[],
): TenantFullAccountingProfessionalOperatingModelView['responsibilityAssignments'][number] {
  return { key, label, status, activityType, owner, automationBoundary, evidenceRefs };
}

function fullAccountingGraduationRiskControl(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  riskType: TenantFullAccountingGraduationRiskControlPackView['riskControls'][number]['riskType'],
  controlMode: TenantFullAccountingGraduationRiskControlPackView['riskControls'][number]['controlMode'],
  evidenceRefs: string[],
): TenantFullAccountingGraduationRiskControlPackView['riskControls'][number] {
  return { key, label, status, riskType, controlMode, evidenceRefs };
}

function fullAccountingGraduationCloseoutCheck(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  evidenceRefs: string[],
): TenantFullAccountingGraduationCloseoutView['closeoutChecklist'][number] {
  return { key, label, status, evidenceRefs };
}

function fullAccountingGraduationDecisionFromStatus(
  status: AccountingReadinessStatus,
  graduationAnchor: TenantFullAccountingGraduationAnchorView,
  productScopeMatrix: TenantFullAccountingProductScopeGraduationMatrixView,
  professionalOperatingModel: TenantFullAccountingProfessionalOperatingModelView,
  riskControlPack: TenantFullAccountingGraduationRiskControlPackView,
  blockers: string[],
): FullAccountingGraduationDecision {
  if (blockers.length > 0 || status === 'blocked') {
    return 'return_to_mvp_operations';
  }
  if (graduationAnchor.summary.graduableLaneCount === 0) {
    return 'return_to_mvp_readiness';
  }
  if (
    productScopeMatrix.summary.graduateModuleCount > 0 &&
    professionalOperatingModel.summary.humanApprovalCount > 0 &&
    riskControlPack.summary.rollbackControlCount > 0
  ) {
    return 'graduate_to_full_accounting_product_design';
  }
  if (graduationAnchor.summary.needsMorePilotLaneCount > 0) {
    return 'continue_controlled_pilot';
  }
  return 'do_not_graduate_full_accounting';
}

function fullAccountingProductDesignLane(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  laneType: TenantFullAccountingProductDesignAnchorView['designLanes'][number]['laneType'],
  designMode: TenantFullAccountingProductDesignAnchorView['designLanes'][number]['designMode'],
  evidenceRefs: string[],
): TenantFullAccountingProductDesignAnchorView['designLanes'][number] {
  return { key, label, status, laneType, designMode, evidenceRefs };
}

function fullAccountingProductScopeItem(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  moduleType: TenantFullAccountingProductScopeContractView['scopeItems'][number]['moduleType'],
  scopeMode: TenantFullAccountingProductScopeContractView['scopeItems'][number]['scopeMode'],
  entryCriteria: string,
  exitCriteria: string,
  evidenceRefs: string[],
): TenantFullAccountingProductScopeContractView['scopeItems'][number] {
  return { key, label, status, moduleType, scopeMode, entryCriteria, exitCriteria, evidenceRefs };
}

function fullAccountingProductResponsibility(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  responsibilityType: TenantFullAccountingProductProfessionalResponsibilityMatrixView['responsibilities'][number]['responsibilityType'],
  owner: AccountingAdvancedProfessionalOwner,
  evidenceRefs: string[],
): TenantFullAccountingProductProfessionalResponsibilityMatrixView['responsibilities'][number] {
  return { key, label, status, responsibilityType, owner, evidenceRefs };
}

function fullAccountingProductArtifact(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  artifactType: TenantFullAccountingOfficialArtifactBoundaryRegistryView['artifacts'][number]['artifactType'],
  artifactStatus: TenantFullAccountingOfficialArtifactBoundaryRegistryView['artifacts'][number]['artifactStatus'],
  evidenceRefs: string[],
): TenantFullAccountingOfficialArtifactBoundaryRegistryView['artifacts'][number] {
  return { key, label, status, artifactType, artifactStatus, evidenceRefs };
}

function fullAccountingWorkflowStage(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  stageType: TenantFullAccountingWorkflowControlBlueprintView['workflowStages'][number]['stageType'],
  controlType: TenantFullAccountingWorkflowControlBlueprintView['workflowStages'][number]['controlType'],
  evidenceRefs: string[],
): TenantFullAccountingWorkflowControlBlueprintView['workflowStages'][number] {
  return { key, label, status, stageType, controlType, evidenceRefs };
}

function fullAccountingProductDesignCloseoutCheck(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  evidenceRefs: string[],
): TenantFullAccountingProductDesignCloseoutView['closeoutChecklist'][number] {
  return { key, label, status, evidenceRefs };
}

function fullAccountingProductDesignDecisionFromStatus(
  status: AccountingReadinessStatus,
  productDesignAnchor: TenantFullAccountingProductDesignAnchorView,
  scopeContract: TenantFullAccountingProductScopeContractView,
  responsibilityMatrix: TenantFullAccountingProductProfessionalResponsibilityMatrixView,
  artifactBoundaryRegistry: TenantFullAccountingOfficialArtifactBoundaryRegistryView,
  workflowControlBlueprint: TenantFullAccountingWorkflowControlBlueprintView,
  blockers: string[],
): FullAccountingProductDesignDecision {
  if (blockers.length > 0 || status === 'blocked') {
    return 'return_to_graduation';
  }
  if (productDesignAnchor.summary.includedLaneCount === 0) {
    return 'return_to_controlled_pilot';
  }
  if (
    scopeContract.summary.includedItemCount > 0 &&
    responsibilityMatrix.summary.accountantApprovalCount > 0 &&
    artifactBoundaryRegistry.summary.excludedArtifactCount > 0 &&
    workflowControlBlueprint.summary.professionalReviewGateCount > 0
  ) {
    return 'open_formal_readiness';
  }
  if (scopeContract.summary.limitedItemCount > 0) {
    return 'continue_product_design';
  }
  return 'do_not_design_full_accounting_product';
}

function fullAccountingFormalReadinessLane(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  laneType: TenantFullAccountingFormalReadinessAnchorView['readinessLanes'][number]['laneType'],
  readinessMode: TenantFullAccountingFormalReadinessAnchorView['readinessLanes'][number]['readinessMode'],
  evidenceRefs: string[],
): TenantFullAccountingFormalReadinessAnchorView['readinessLanes'][number] {
  return { key, label, status, laneType, readinessMode, evidenceRefs };
}

function fullAccountingPolicyTemplate(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  templateType: TenantFullAccountingPolicyTemplateRegistryView['templates'][number]['templateType'],
  templateMode: TenantFullAccountingPolicyTemplateRegistryView['templates'][number]['templateMode'],
  evidenceRefs: string[],
): TenantFullAccountingPolicyTemplateRegistryView['templates'][number] {
  return { key, label, status, templateType, templateMode, evidenceRefs };
}

function fullAccountingProfessionalPortalShellItem(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  shellType: TenantFullAccountingProfessionalPortalReadinessShellView['shellItems'][number]['shellType'],
  owner: AccountingAdvancedProfessionalOwner,
  evidenceRefs: string[],
): TenantFullAccountingProfessionalPortalReadinessShellView['shellItems'][number] {
  return { key, label, status, shellType, owner, evidenceRefs };
}

function fullAccountingLedgerPostingReadinessItem(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  readinessType: TenantFullAccountingFormalLedgerPostingReadinessPackView['readinessItems'][number]['readinessType'],
  controlMode: TenantFullAccountingFormalLedgerPostingReadinessPackView['readinessItems'][number]['controlMode'],
  evidenceRefs: string[],
): TenantFullAccountingFormalLedgerPostingReadinessPackView['readinessItems'][number] {
  return { key, label, status, readinessType, controlMode, evidenceRefs };
}

function fullAccountingStatementBankBoundaryItem(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  boundaryType: TenantFullAccountingStatementBankFormalBoundaryPackView['boundaryItems'][number]['boundaryType'],
  boundaryMode: TenantFullAccountingStatementBankFormalBoundaryPackView['boundaryItems'][number]['boundaryMode'],
  evidenceRefs: string[],
): TenantFullAccountingStatementBankFormalBoundaryPackView['boundaryItems'][number] {
  return { key, label, status, boundaryType, boundaryMode, evidenceRefs };
}

function fullAccountingFormalReadinessCloseoutCheck(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  evidenceRefs: string[],
): TenantFullAccountingFormalReadinessCloseoutView['closeoutChecklist'][number] {
  return { key, label, status, evidenceRefs };
}

function fullAccountingFormalReadinessDecisionFromStatus(
  status: AccountingReadinessStatus,
  formalReadinessAnchor: TenantFullAccountingFormalReadinessAnchorView,
  policyTemplateRegistry: TenantFullAccountingPolicyTemplateRegistryView,
  professionalPortalShell: TenantFullAccountingProfessionalPortalReadinessShellView,
  ledgerPostingReadinessPack: TenantFullAccountingFormalLedgerPostingReadinessPackView,
  statementBankBoundaryPack: TenantFullAccountingStatementBankFormalBoundaryPackView,
  blockers: string[],
): FullAccountingFormalReadinessDecision {
  if (blockers.length > 0 || status === 'blocked') {
    return 'return_to_product_design';
  }
  if (formalReadinessAnchor.summary.formalReadyLaneCount === 0) {
    return 'return_to_graduation';
  }
  if (
    policyTemplateRegistry.summary.reviewTemplateCount > 0 &&
    professionalPortalShell.summary.accountantOwnedCount > 0 &&
    ledgerPostingReadinessPack.summary.approvalGateCount > 0 &&
    statementBankBoundaryPack.summary.professionalReviewCount > 0
  ) {
    return 'open_formal_artifact_drafting';
  }
  if (statementBankBoundaryPack.summary.externalOnlyCount > 0) {
    return 'continue_formal_readiness';
  }
  return 'do_not_open_formal_readiness';
}

function fullAccountingFormalArtifactDraftingLane(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  laneType: TenantFullAccountingFormalArtifactDraftingAnchorView['draftingLanes'][number]['laneType'],
  draftMode: TenantFullAccountingFormalArtifactDraftingAnchorView['draftingLanes'][number]['draftMode'],
  evidenceRefs: string[],
): TenantFullAccountingFormalArtifactDraftingAnchorView['draftingLanes'][number] {
  return { key, label, status, laneType, draftMode, evidenceRefs };
}

function fullAccountingFormalLedgerDraft(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  draftType: TenantFullAccountingFormalLedgerDraftPackView['ledgerDrafts'][number]['draftType'],
  draftState: TenantFullAccountingFormalLedgerDraftPackView['ledgerDrafts'][number]['draftState'],
  evidenceRefs: string[],
): TenantFullAccountingFormalLedgerDraftPackView['ledgerDrafts'][number] {
  return { key, label, status, draftType, draftState, evidenceRefs };
}

function fullAccountingPostingApprovalDraft(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  approvalType: TenantFullAccountingPostingApprovalDraftPackView['approvalDrafts'][number]['approvalType'],
  owner: AccountingAdvancedProfessionalOwner,
  evidenceRefs: string[],
): TenantFullAccountingPostingApprovalDraftPackView['approvalDrafts'][number] {
  return { key, label, status, approvalType, owner, evidenceRefs };
}

function fullAccountingBankEvidenceDraft(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  evidenceType: TenantFullAccountingBankReconciliationEvidenceDraftPackView['bankDrafts'][number]['evidenceType'],
  evidenceMode: TenantFullAccountingBankReconciliationEvidenceDraftPackView['bankDrafts'][number]['evidenceMode'],
  evidenceRefs: string[],
): TenantFullAccountingBankReconciliationEvidenceDraftPackView['bankDrafts'][number] {
  return { key, label, status, evidenceType, evidenceMode, evidenceRefs };
}

function fullAccountingStatementDraft(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  statementType: TenantFullAccountingTrialBalanceFinancialStatementDraftPackView['statementDrafts'][number]['statementType'],
  draftMode: TenantFullAccountingTrialBalanceFinancialStatementDraftPackView['statementDrafts'][number]['draftMode'],
  evidenceRefs: string[],
): TenantFullAccountingTrialBalanceFinancialStatementDraftPackView['statementDrafts'][number] {
  return { key, label, status, statementType, draftMode, evidenceRefs };
}

function fullAccountingFormalArtifactDraftingCloseoutCheck(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  evidenceRefs: string[],
): TenantFullAccountingFormalArtifactDraftingCloseoutView['closeoutChecklist'][number] {
  return { key, label, status, evidenceRefs };
}

function fullAccountingFormalArtifactDraftingDecisionFromStatus(
  status: AccountingReadinessStatus,
  draftingAnchor: TenantFullAccountingFormalArtifactDraftingAnchorView,
  ledgerDraftPack: TenantFullAccountingFormalLedgerDraftPackView,
  postingApprovalDraftPack: TenantFullAccountingPostingApprovalDraftPackView,
  bankEvidenceDraftPack: TenantFullAccountingBankReconciliationEvidenceDraftPackView,
  statementDraftPack: TenantFullAccountingTrialBalanceFinancialStatementDraftPackView,
  blockers: string[],
): FullAccountingFormalArtifactDraftingDecision {
  if (blockers.length > 0 || status === 'blocked') {
    return 'return_to_formal_readiness';
  }
  if (draftingAnchor.summary.draftLaneCount === 0) {
    return 'return_to_product_design';
  }
  if (
    ledgerDraftPack.summary.draftCount > 0 &&
    postingApprovalDraftPack.summary.accountantOwnedDraftCount > 0 &&
    bankEvidenceDraftPack.summary.boundaryCount > 0 &&
    statementDraftPack.summary.professionalReviewCount > 0
  ) {
    return 'open_professional_review_execution';
  }
  if (statementDraftPack.summary.boundaryCount > 0) {
    return 'continue_artifact_drafting';
  }
  return 'do_not_draft_formal_artifacts';
}

function fullAccountingProfessionalReviewGate(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  evidenceRefs: string[],
  professionalOwner: AccountingAdvancedProfessionalOwner,
  gate: string,
): TenantFullAccountingProfessionalReviewExecutionAnchorView['reviewGates'][number] {
  return { key, label, status, evidenceRefs, professionalOwner, gate };
}

function fullAccountingDraftReviewRow(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  artifactType: TenantFullAccountingAccountantDraftReviewRoomView['reviewRows'][number]['artifactType'],
  reviewer: AccountingAdvancedProfessionalOwner,
  finding: string,
  preliminaryDecision: TenantFullAccountingAccountantDraftReviewRoomView['reviewRows'][number]['preliminaryDecision'],
): TenantFullAccountingAccountantDraftReviewRoomView['reviewRows'][number] {
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

function fullAccountingReviewChangeRequest(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  sourceReviewKey: string,
  requestedBy: AccountingAdvancedProfessionalOwner,
  requiredAction: string,
  evidenceRefs: string[],
): TenantFullAccountingReviewChangeRequestPackView['changeRequests'][number] {
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

function fullAccountingChangeActionFromReviewRow(
  row: TenantFullAccountingAccountantDraftReviewRoomView['reviewRows'][number],
): string {
  if (row.preliminaryDecision === 'needs_external_signoff') {
    return 'Adjuntar evidencia externa y registrar signoff requerido antes de aprobacion formal.';
  }
  if (row.preliminaryDecision === 'reject_draft') {
    return 'Rehacer el draft antes de cualquier recomendacion profesional.';
  }
  return 'Resolver observaciones profesionales y actualizar evidencia del draft.';
}

function fullAccountingApprovalRecommendation(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  artifactType: TenantFullAccountingProfessionalApprovalRecommendationPackView['recommendations'][number]['artifactType'],
  recommendation: TenantFullAccountingProfessionalApprovalRecommendationPackView['recommendations'][number]['recommendation'],
  requiredOwner: AccountingAdvancedProfessionalOwner,
  rationale: string,
): TenantFullAccountingProfessionalApprovalRecommendationPackView['recommendations'][number] {
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

function fullAccountingRecommendationFromReviewRow(
  row: TenantFullAccountingAccountantDraftReviewRoomView['reviewRows'][number],
): TenantFullAccountingProfessionalApprovalRecommendationPackView['recommendations'][number]['recommendation'] {
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

function fullAccountingRecommendationRationaleFromReviewRow(
  row: TenantFullAccountingAccountantDraftReviewRoomView['reviewRows'][number],
): string {
  if (row.preliminaryDecision === 'approve_for_recommendation') {
    return 'Draft revisado sin cambios criticos antes del formal approval workflow.';
  }
  if (row.preliminaryDecision === 'needs_external_signoff') {
    return 'Requiere signoff externo antes de cualquier aprobacion formal.';
  }
  if (row.preliminaryDecision === 'reject_draft') {
    return 'Draft no debe avanzar sin re-trabajo profesional.';
  }
  return 'Debe resolver cambios solicitados antes de recomendar aprobacion.';
}

function fullAccountingReviewCommandLane(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  owner: AccountingAdvancedProfessionalOwner,
  primaryMetric: string,
  nextAction: string,
): TenantFullAccountingReviewExecutionCommandCenterView['lanes'][number] {
  return { key, label, status, owner, primaryMetric, nextAction };
}

function fullAccountingProfessionalReviewCloseoutCheck(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  evidenceRefs: string[],
): TenantFullAccountingProfessionalReviewExecutionCloseoutView['closeoutChecklist'][number] {
  return { key, label, status, evidenceRefs };
}

function fullAccountingProfessionalReviewExecutionDecisionFromStatus(
  closeoutStatus: AccountingReadinessStatus,
  approvalRecommendationPack: TenantFullAccountingProfessionalApprovalRecommendationPackView,
  commandCenter: TenantFullAccountingReviewExecutionCommandCenterView,
  blockers: string[],
): FullAccountingProfessionalReviewExecutionDecision {
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
    return 'continue_professional_review';
  }
  if (approvalRecommendationPack.summary.recommendApprovalCount > 0) {
    return 'open_formal_approval_workflow';
  }
  return 'return_to_formal_readiness';
}

function fullAccountingFormalApprovalGate(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  evidenceRefs: string[],
  requiredOwner: AccountingAdvancedProfessionalOwner,
  gate: string,
): TenantFullAccountingFormalApprovalWorkflowAnchorView['approvalGates'][number] {
  return { key, label, status, evidenceRefs, requiredOwner, gate };
}

function fullAccountingApprovalAuthority(
  key: string,
  label: string,
  artifactType: TenantFullAccountingApprovalAuthorityMatrixView['authorities'][number]['artifactType'],
  status: AccountingReadinessStatus,
  requiredOwner: AccountingAdvancedProfessionalOwner,
  authorityBoundary: string,
): TenantFullAccountingApprovalAuthorityMatrixView['authorities'][number] {
  return {
    key,
    label,
    artifactType,
    status,
    requiredOwner,
    authorityBoundary,
  };
}

function fullAccountingApprovalEvidence(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  artifactType: TenantFullAccountingFormalApprovalEvidencePackView['evidenceItems'][number]['artifactType'],
  evidenceRefs: string[],
  approvalQuestion: string,
): TenantFullAccountingFormalApprovalEvidencePackView['evidenceItems'][number] {
  return { key, label, status, artifactType, evidenceRefs, approvalQuestion };
}

function fullAccountingApprovalDecision(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  artifactType: TenantFullAccountingApprovalDecisionWorkspaceView['decisions'][number]['artifactType'],
  decision: TenantFullAccountingApprovalDecisionWorkspaceView['decisions'][number]['decision'],
  decidedBy: AccountingAdvancedProfessionalOwner,
  rationale: string,
): TenantFullAccountingApprovalDecisionWorkspaceView['decisions'][number] {
  return { key, label, status, artifactType, decision, decidedBy, rationale };
}

function fullAccountingApprovalDecisionFromEvidence(
  item: TenantFullAccountingFormalApprovalEvidencePackView['evidenceItems'][number],
): TenantFullAccountingApprovalDecisionWorkspaceView['decisions'][number]['decision'] {
  if (item.status === 'ready') {
    return 'approved_for_signature_flow';
  }
  if (
    item.artifactType === 'bank_evidence' ||
    item.artifactType === 'financial_statement'
  ) {
    return 'requires_external_review';
  }
  if (item.status === 'blocked') {
    return 'rejected';
  }
  return 'requires_changes';
}

function fullAccountingOwnerFromApprovalArtifactType(
  artifactType: TenantFullAccountingApprovalDecisionWorkspaceView['decisions'][number]['artifactType'],
): AccountingAdvancedProfessionalOwner {
  if (artifactType === 'financial_statement') {
    return 'legal_representative';
  }
  if (artifactType === 'bank_evidence') {
    return 'auditor';
  }
  return 'external_accountant';
}

function fullAccountingApprovalDecisionRationale(
  item: TenantFullAccountingFormalApprovalEvidencePackView['evidenceItems'][number],
): string {
  if (item.status === 'ready') {
    return 'Evidencia lista para aprobacion interna pendiente de firma/certificacion.';
  }
  if (
    item.artifactType === 'bank_evidence' ||
    item.artifactType === 'financial_statement'
  ) {
    return 'Requiere review externo antes de avanzar a signature/certification boundary.';
  }
  if (item.status === 'blocked') {
    return 'No debe aprobarse hasta resolver blockers de evidencia.';
  }
  return 'Debe resolver cambios profesionales antes de aprobacion formal.';
}

function fullAccountingFormalApprovalLane(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  owner: AccountingAdvancedProfessionalOwner,
  primaryMetric: string,
  nextAction: string,
): TenantFullAccountingFormalApprovalCommandCenterView['lanes'][number] {
  return { key, label, status, owner, primaryMetric, nextAction };
}

function fullAccountingFormalApprovalCloseoutCheck(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  evidenceRefs: string[],
): TenantFullAccountingFormalApprovalWorkflowCloseoutView['closeoutChecklist'][number] {
  return { key, label, status, evidenceRefs };
}

function fullAccountingFormalApprovalWorkflowDecisionFromStatus(
  closeoutStatus: AccountingReadinessStatus,
  decisionWorkspace: TenantFullAccountingApprovalDecisionWorkspaceView,
  commandCenter: TenantFullAccountingFormalApprovalCommandCenterView,
  blockers: string[],
): FullAccountingFormalApprovalWorkflowDecision {
  if (blockers.length > 0 || closeoutStatus === 'blocked') {
    return 'return_to_professional_review';
  }
  if (decisionWorkspace.summary.rejectedCount > 0) {
    return 'do_not_approve_formal_artifacts';
  }
  if (
    decisionWorkspace.summary.requiresChangesCount > 0 ||
    decisionWorkspace.summary.requiresExternalReviewCount > 0 ||
    commandCenter.summary.needsReviewLaneCount > 0
  ) {
    return 'continue_formal_approval';
  }
  if (decisionWorkspace.summary.approvedForSignatureFlowCount > 0) {
    return 'open_signature_certification_boundary';
  }
  return 'return_to_artifact_drafting';
}

function fullAccountingSignatureBoundaryGate(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  evidenceRefs: string[],
  requiredAct: TenantFullAccountingSignatureCertificationBoundaryAnchorView['boundaryGates'][number]['requiredAct'],
  boundary: string,
): TenantFullAccountingSignatureCertificationBoundaryAnchorView['boundaryGates'][number] {
  return { key, label, status, evidenceRefs, requiredAct, boundary };
}

function fullAccountingFormalSignatory(
  key: string,
  label: string,
  artifactType: TenantFullAccountingFormalSignatoryRegistryView['signatories'][number]['artifactType'],
  status: AccountingReadinessStatus,
  requiredAct: TenantFullAccountingFormalSignatoryRegistryView['signatories'][number]['requiredAct'],
  requiredOwner: AccountingAdvancedProfessionalOwner,
  requiredEvidence: string[],
): TenantFullAccountingFormalSignatoryRegistryView['signatories'][number] {
  return {
    key,
    label,
    artifactType,
    status,
    requiredOwner,
    requiredAct,
    requiredEvidence,
  };
}

function fullAccountingSignatureEvidenceItem(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  signatoryKey: string,
  requiredAct: TenantFullAccountingSignatureEvidenceReadinessPackView['evidenceItems'][number]['requiredAct'],
  evidenceRefs: string[],
  missingEvidence: string[],
): TenantFullAccountingSignatureEvidenceReadinessPackView['evidenceItems'][number] {
  return { key, label, status, signatoryKey, requiredAct, missingEvidence, evidenceRefs };
}

function fullAccountingSignatureEvidenceRequirements(
  signatory: TenantFullAccountingFormalSignatoryRegistryView['signatories'][number],
): string[] {
  if (signatory.status === 'ready') {
    return [];
  }
  return signatory.requiredEvidence;
}

function fullAccountingCertificationRequirement(
  key: string,
  label: string,
  artifactType: TenantFullAccountingCertificationRequirementWorkspaceView['requirements'][number]['artifactType'],
  status: AccountingReadinessStatus,
  certifier: AccountingAdvancedProfessionalOwner,
  certificationBoundary: string,
  evidenceRefs: string[],
): TenantFullAccountingCertificationRequirementWorkspaceView['requirements'][number] {
  return { key, label, status, artifactType, certifier, certificationBoundary, evidenceRefs };
}

function fullAccountingLegalizationItem(
  key: string,
  label: string,
  artifactType: TenantFullAccountingLegalizationBoundaryPacketView['legalizationItems'][number]['artifactType'],
  status: AccountingReadinessStatus,
  requiredOwner: AccountingAdvancedProfessionalOwner,
  legalizationBoundary: string,
  evidenceRefs: string[],
): TenantFullAccountingLegalizationBoundaryPacketView['legalizationItems'][number] {
  return {
    key,
    label,
    status,
    artifactType,
    requiredOwner,
    legalizationBoundary,
    evidenceRefs,
  };
}

function fullAccountingSignatureBoundaryCloseoutCheck(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  evidenceRefs: string[],
): TenantFullAccountingSignatureCertificationBoundaryCloseoutView['closeoutChecklist'][number] {
  return { key, label, status, evidenceRefs };
}

function fullAccountingSignatureCertificationBoundaryDecisionFromStatus(
  closeoutStatus: AccountingReadinessStatus,
  signatoryRegistry: TenantFullAccountingFormalSignatoryRegistryView,
  signatureEvidencePack: TenantFullAccountingSignatureEvidenceReadinessPackView,
  certificationWorkspace: TenantFullAccountingCertificationRequirementWorkspaceView,
  legalizationPacket: TenantFullAccountingLegalizationBoundaryPacketView,
  blockers: string[],
): FullAccountingSignatureCertificationBoundaryDecision {
  if (blockers.length > 0 || closeoutStatus === 'blocked') {
    return 'return_to_formal_approval';
  }
  if (
    signatureEvidencePack.summary.missingEvidenceCount > 0 ||
    certificationWorkspace.summary.needsReviewRequirementCount > 0 ||
    legalizationPacket.summary.needsReviewLegalizationItemCount > 0
  ) {
    return 'continue_signature_certification_boundary';
  }
  if (signatoryRegistry.summary.signatoryCount > 0) {
    return 'open_external_execution_handoff';
  }
  return 'do_not_prepare_external_execution';
}

function fullAccountingExternalHandoffGate(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  evidenceRefs: string[],
  externalAct: TenantFullAccountingExternalExecutionHandoffAnchorView['handoffGates'][number]['externalAct'],
  handoffBoundary: string,
): TenantFullAccountingExternalExecutionHandoffAnchorView['handoffGates'][number] {
  return { key, label, status, evidenceRefs, externalAct, handoffBoundary };
}

function fullAccountingExternalExecutorAssignment(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  externalAct: TenantFullAccountingExternalExecutorAssignmentMatrixView['assignments'][number]['externalAct'],
  executorRole: TenantFullAccountingExternalExecutorAssignmentMatrixView['assignments'][number]['executorRole'],
  responsibility: string,
): TenantFullAccountingExternalExecutorAssignmentMatrixView['assignments'][number] {
  return { key, label, status, externalAct, executorRole, responsibility };
}

function fullAccountingExecutionBundle(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  assignmentKey: string,
  artifactRefs: string[],
  evidenceRefs: string[],
  blockerRefs: string[],
): TenantFullAccountingExecutionHandoffEvidenceBundleView['bundles'][number] {
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

function fullAccountingExternalInstruction(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  assignmentKey: string,
  instruction: string,
  expectedReturnEvidence: string[],
): TenantFullAccountingExternalExecutionInstructionPackView['instructions'][number] {
  return {
    key,
    label,
    status,
    assignmentKey,
    instruction,
    expectedReturnEvidence,
  };
}

function fullAccountingReturnEvidenceChannel(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  expectedStatus: TenantFullAccountingExecutionReturnEvidenceIntakeView['returnChannels'][number]['expectedStatus'],
  requiredEvidence: string[],
): TenantFullAccountingExecutionReturnEvidenceIntakeView['returnChannels'][number] {
  return { key, label, status, expectedStatus, requiredEvidence };
}

function fullAccountingExternalHandoffCloseoutCheck(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  evidenceRefs: string[],
): TenantFullAccountingExternalExecutionHandoffCloseoutView['closeoutChecklist'][number] {
  return { key, label, status, evidenceRefs };
}

function fullAccountingExternalExecutionHandoffDecisionFromStatus(
  closeoutStatus: AccountingReadinessStatus,
  executorMatrix: TenantFullAccountingExternalExecutorAssignmentMatrixView,
  evidenceBundle: TenantFullAccountingExecutionHandoffEvidenceBundleView,
  returnEvidenceIntake: TenantFullAccountingExecutionReturnEvidenceIntakeView,
  blockers: string[],
): FullAccountingExternalExecutionHandoffDecision {
  if (blockers.length > 0 || closeoutStatus === 'blocked') {
    return 'return_to_signature_certification_boundary';
  }
  if (
    executorMatrix.summary.needsReviewAssignmentCount > 0 ||
    evidenceBundle.summary.needsReviewBundleCount > 0 ||
    returnEvidenceIntake.summary.needsReviewChannelCount > 0
  ) {
    return 'continue_external_execution_handoff';
  }
  if (executorMatrix.summary.assignmentCount > 0) {
    return 'open_external_execution_tracking';
  }
  return 'do_not_handoff_external_execution';
}

function fullAccountingExternalTrackingLane(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  externalAct: TenantFullAccountingExternalExecutionTrackingAnchorView['trackingLanes'][number]['externalAct'],
  trackingState: TenantFullAccountingExternalExecutionTrackingAnchorView['trackingLanes'][number]['trackingState'],
  evidenceRefs: string[],
): TenantFullAccountingExternalExecutionTrackingAnchorView['trackingLanes'][number] {
  return { key, label, status, externalAct, trackingState, evidenceRefs };
}

function fullAccountingExternalTrackingEvent(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  laneKey: string,
  externalAct: TenantFullAccountingExternalExecutionStatusLedgerView['events'][number]['externalAct'],
  expectedActor: string,
  eventState: TenantFullAccountingExternalExecutionStatusLedgerView['events'][number]['eventState'],
  evidenceRequired: string[],
  evidenceReceived: string[],
  blockerRefs: string[],
): TenantFullAccountingExternalExecutionStatusLedgerView['events'][number] {
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

function fullAccountingReturnedEvidenceValidation(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  eventKey: string,
  validationResult: TenantFullAccountingReturnedEvidenceValidationWorkspaceView['validations'][number]['validationResult'],
  requiredEvidence: string[],
  receivedEvidence: string[],
  blockerRefs: string[],
): TenantFullAccountingReturnedEvidenceValidationWorkspaceView['validations'][number] {
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

function fullAccountingExternalObservation(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  validationKey: string,
  resolutionRoute: TenantFullAccountingExternalObservationResolutionQueueView['observations'][number]['resolutionRoute'],
  reason: string,
): TenantFullAccountingExternalObservationResolutionQueueView['observations'][number] {
  return { key, label, status, validationKey, resolutionRoute, reason };
}

function fullAccountingTrackingCommandLane(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  metric: string,
  count: number,
): TenantFullAccountingExternalExecutionTrackingCommandCenterView['commandLanes'][number] {
  return { key, label, status, metric, count };
}

function fullAccountingExternalTrackingCloseoutCheck(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  evidenceRefs: string[],
): TenantFullAccountingExternalExecutionTrackingCloseoutView['closeoutChecklist'][number] {
  return { key, label, status, evidenceRefs };
}

function fullAccountingExternalActorForAct(
  externalAct: TenantFullAccountingExternalExecutionTrackingAnchorView['trackingLanes'][number]['externalAct'],
): string {
  if (externalAct === 'signature') {
    return 'external_signatory';
  }
  if (externalAct === 'certification') {
    return 'external_certifier';
  }
  return 'legalization_authority';
}

function fullAccountingExpectedEvidenceForAct(
  externalAct: TenantFullAccountingExternalExecutionTrackingAnchorView['trackingLanes'][number]['externalAct'],
): string[] {
  if (externalAct === 'signature') {
    return ['signed_artifact_reference', 'signatory_identity'];
  }
  if (externalAct === 'certification') {
    return ['certification_reference', 'certifier_identity'];
  }
  return ['legalization_reference', 'legalization_authority'];
}

function fullAccountingResolutionRouteForValidation(
  validationResult: TenantFullAccountingReturnedEvidenceValidationWorkspaceView['validations'][number]['validationResult'],
): TenantFullAccountingExternalObservationResolutionQueueView['observations'][number]['resolutionRoute'] {
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

function fullAccountingExternalExecutionTrackingDecisionFromStatus(
  status: AccountingReadinessStatus,
  validationWorkspace: TenantFullAccountingReturnedEvidenceValidationWorkspaceView,
  observationQueue: TenantFullAccountingExternalObservationResolutionQueueView,
  blockers: string[],
): FullAccountingExternalExecutionTrackingDecision {
  if (blockers.length > 0 || status === 'blocked') {
    return 'return_to_external_execution_handoff';
  }
  if (
    validationWorkspace.summary.rejectedReturnCount > 0 ||
    observationQueue.summary.routedObservationCount > 0
  ) {
    return 'resolve_external_observations';
  }
  if (validationWorkspace.summary.validReturnCount > 0) {
    return 'open_external_result_intake';
  }
  if (validationWorkspace.summary.insufficientEvidenceCount > 0) {
    return 'continue_external_execution_tracking';
  }
  return 'do_not_accept_external_results';
}

function fullAccountingExternalResultIntakeGate(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  externalAct: TenantFullAccountingExternalResultIntakeAnchorView['resultIntakeGates'][number]['externalAct'],
  intakeState: TenantFullAccountingExternalResultIntakeAnchorView['resultIntakeGates'][number]['intakeState'],
  evidenceRefs: string[],
): TenantFullAccountingExternalResultIntakeAnchorView['resultIntakeGates'][number] {
  return { key, label, status, externalAct, intakeState, evidenceRefs };
}

function fullAccountingReturnedArtifact(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  intakeGateKey: string,
  artifactKind: TenantFullAccountingReturnedArtifactRegistryView['returnedArtifacts'][number]['artifactKind'],
  actorRef: string,
  evidenceRefs: string[],
  blockerRefs: string[],
): TenantFullAccountingReturnedArtifactRegistryView['returnedArtifacts'][number] {
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

function fullAccountingInternalAcceptanceCriterion(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  artifactKey: string,
  criteriaType: TenantFullAccountingInternalAcceptanceCriteriaWorkspaceView['criteria'][number]['criteriaType'],
  evidenceRefs: string[],
  blockerRefs: string[],
): TenantFullAccountingInternalAcceptanceCriteriaWorkspaceView['criteria'][number] {
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

function fullAccountingAcceptanceDecision(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  artifactKey: string,
  decision: TenantFullAccountingAcceptanceDecisionWorkspaceView['decisions'][number]['decision'],
  reason: string,
): TenantFullAccountingAcceptanceDecisionWorkspaceView['decisions'][number] {
  return { key, label, status, artifactKey, decision, reason };
}

function fullAccountingInternalAcceptanceCommandLane(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  metric: string,
  count: number,
): TenantFullAccountingInternalAcceptanceCommandCenterView['commandLanes'][number] {
  return { key, label, status, metric, count };
}

function fullAccountingExternalResultIntakeCloseoutCheck(
  key: string,
  label: string,
  status: AccountingReadinessStatus,
  evidenceRefs: string[],
): TenantFullAccountingExternalResultIntakeCloseoutView['closeoutChecklist'][number] {
  return { key, label, status, evidenceRefs };
}

function fullAccountingExternalActFromValidationKey(
  eventKey: string,
): TenantFullAccountingExternalResultIntakeAnchorView['resultIntakeGates'][number]['externalAct'] {
  if (eventKey.includes('certification')) {
    return 'certification';
  }
  if (eventKey.includes('legalization')) {
    return 'legalization';
  }
  return 'signature';
}

function fullAccountingArtifactKindFromIntakeGate(
  gate: TenantFullAccountingExternalResultIntakeAnchorView['resultIntakeGates'][number],
): TenantFullAccountingReturnedArtifactRegistryView['returnedArtifacts'][number]['artifactKind'] {
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

function fullAccountingExternalResultIntakeDecisionFromStatus(
  status: AccountingReadinessStatus,
  decisionWorkspace: TenantFullAccountingAcceptanceDecisionWorkspaceView,
  blockers: string[],
): FullAccountingExternalResultIntakeDecision {
  if (blockers.length > 0 || status === 'blocked') {
    return 'return_to_external_execution_handoff';
  }
  if (decisionWorkspace.summary.returnToHandoffDecisionCount > 0) {
    return 'return_to_external_execution_handoff';
  }
  if (decisionWorkspace.summary.returnToTrackingDecisionCount > 0) {
    return 'return_to_external_execution_tracking';
  }
  if (decisionWorkspace.summary.needsReviewDecisionCount > 0) {
    return 'continue_internal_acceptance_review';
  }
  if (decisionWorkspace.summary.acceptedDecisionCount > 0) {
    return 'open_formal_record_assembly';
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
