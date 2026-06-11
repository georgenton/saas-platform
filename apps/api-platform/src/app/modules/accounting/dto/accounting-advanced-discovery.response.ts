import {
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
  TenantAccountingAdvancedProfessionalResponsibilityAssignmentMatrixView,
  TenantAccountingAdvancedProfessionalReviewWorkflowDesignView,
  TenantAccountingCertifiedBankEvidenceBoundaryView,
  TenantAccountingFormalNeedsClassifierView,
  TenantAccountingMinimumLedgerCloseoutDesignWorkspaceView,
} from '@saas-platform/accounting-domain';

export type AccountingAdvancedDiscoveryAnchorResponseDto =
  Serialized<TenantAccountingAdvancedDiscoveryAnchorView>;
export type AccountingAdvancedDiscoveryIntakeResponseDto =
  Serialized<TenantAccountingAdvancedDiscoveryIntakeView>;
export type AccountingFormalNeedsClassifierResponseDto =
  Serialized<TenantAccountingFormalNeedsClassifierView>;
export type AccountingAccountantDiscoveryWorkspaceResponseDto =
  Serialized<TenantAccountingAccountantDiscoveryWorkspaceView>;
export type AccountingAdvancedDiscoveryReadinessPacketResponseDto =
  Serialized<TenantAccountingAdvancedDiscoveryReadinessPacketView>;
export type AccountingAdvancedDiscoveryCloseoutResponseDto =
  Serialized<TenantAccountingAdvancedDiscoveryCloseoutView>;
export type AccountingAdvancedMvpScopeRegistryResponseDto =
  Serialized<TenantAccountingAdvancedMvpScopeRegistryView>;
export type AccountingAdvancedMvpScopeDecisionRecordResponseDto =
  Serialized<TenantAccountingAdvancedMvpScopeDecisionRecordView>;
export type AccountingMinimumLedgerCloseoutDesignWorkspaceResponseDto =
  Serialized<TenantAccountingMinimumLedgerCloseoutDesignWorkspaceView>;
export type AccountingCertifiedBankEvidenceBoundaryResponseDto =
  Serialized<TenantAccountingCertifiedBankEvidenceBoundaryView>;
export type AccountingAdvancedAuditTrailReadinessPacketResponseDto =
  Serialized<TenantAccountingAdvancedAuditTrailReadinessPacketView>;
export type AccountingAdvancedMvpReadinessCloseoutResponseDto =
  Serialized<TenantAccountingAdvancedMvpReadinessCloseoutView>;
export type AccountingAdvancedMvpExecutionAnchorResponseDto =
  Serialized<TenantAccountingAdvancedMvpExecutionAnchorView>;
export type AccountingAdvancedBankReconciliationMvpWorkbenchResponseDto =
  Serialized<TenantAccountingAdvancedBankReconciliationMvpWorkbenchView>;
export type AccountingAdvancedLedgerCloseoutMvpWorkbenchResponseDto =
  Serialized<TenantAccountingAdvancedLedgerCloseoutMvpWorkbenchView>;
export type AccountingAdvancedMvpAccountantReviewPacketResponseDto =
  Serialized<TenantAccountingAdvancedMvpAccountantReviewPacketView>;
export type AccountingAdvancedMvpCommandCenterResponseDto =
  Serialized<TenantAccountingAdvancedMvpCommandCenterView>;
export type AccountingAdvancedMvpOperatingCloseoutResponseDto =
  Serialized<TenantAccountingAdvancedMvpOperatingCloseoutView>;
export type AccountingAdvancedPilotEnrollmentResponseDto =
  Serialized<TenantAccountingAdvancedPilotEnrollmentView>;
export type AccountingAdvancedPilotEvidenceSnapshotResponseDto =
  Serialized<TenantAccountingAdvancedPilotEvidenceSnapshotView>;
export type AccountingAdvancedPilotAccountantReviewRoomResponseDto =
  Serialized<TenantAccountingAdvancedPilotAccountantReviewRoomView>;
export type AccountingAdvancedPilotRunbookResponseDto =
  Serialized<TenantAccountingAdvancedPilotRunbookView>;
export type AccountingAdvancedPilotOutcomePacketResponseDto =
  Serialized<TenantAccountingAdvancedPilotOutcomePacketView>;
export type AccountingAdvancedPilotCloseoutResponseDto =
  Serialized<TenantAccountingAdvancedPilotCloseoutView>;
export type AccountingAdvancedPilotLearningRegistryResponseDto =
  Serialized<TenantAccountingAdvancedPilotLearningRegistryView>;
export type AccountingAdvancedExternalAccountantAcceptanceCriteriaResponseDto =
  Serialized<TenantAccountingAdvancedExternalAccountantAcceptanceCriteriaView>;
export type AccountingAdvancedProductGraduationMatrixResponseDto =
  Serialized<TenantAccountingAdvancedProductGraduationMatrixView>;
export type AccountingAdvancedFormalBooksBoundaryBlueprintResponseDto =
  Serialized<TenantAccountingAdvancedFormalBooksBoundaryBlueprintView>;
export type AccountingAdvancedCertifiedBankFeedBoundaryBlueprintResponseDto =
  Serialized<TenantAccountingAdvancedCertifiedBankFeedBoundaryBlueprintView>;
export type AccountingAdvancedGraduationCloseoutResponseDto =
  Serialized<TenantAccountingAdvancedGraduationCloseoutView>;
export type AccountingAdvancedPoliciesClosingTemplateRegistryResponseDto =
  Serialized<TenantAccountingAdvancedPoliciesClosingTemplateRegistryView>;
export type AccountingAdvancedExternalAccountantPortalShellResponseDto =
  Serialized<TenantAccountingAdvancedExternalAccountantPortalShellView>;
export type AccountingAdvancedAdjustmentAutomationWorkbenchResponseDto =
  Serialized<TenantAccountingAdvancedAdjustmentAutomationWorkbenchView>;
export type AccountingAdvancedMultiPeriodFinancialStatementWorkspaceResponseDto =
  Serialized<TenantAccountingAdvancedMultiPeriodFinancialStatementWorkspaceView>;
export type AccountingAdvancedFormalBooksDraftSigningBoundaryPacketResponseDto =
  Serialized<TenantAccountingAdvancedFormalBooksDraftSigningBoundaryPacketView>;
export type AccountingAdvancedCertifiedBankReconciliationReadinessCloseoutResponseDto =
  Serialized<TenantAccountingAdvancedCertifiedBankReconciliationReadinessCloseoutView>;
export type AccountingAdvancedFormalProductScopeContractResponseDto =
  Serialized<TenantAccountingAdvancedFormalProductScopeContractView>;
export type AccountingAdvancedProfessionalResponsibilityAssignmentMatrixResponseDto =
  Serialized<TenantAccountingAdvancedProfessionalResponsibilityAssignmentMatrixView>;
export type AccountingAdvancedFormalArtifactDraftRegistryResponseDto =
  Serialized<TenantAccountingAdvancedFormalArtifactDraftRegistryView>;
export type AccountingAdvancedProfessionalReviewWorkflowDesignResponseDto =
  Serialized<TenantAccountingAdvancedProfessionalReviewWorkflowDesignView>;
export type AccountingAdvancedFormalProductRiskGuardrailPackResponseDto =
  Serialized<TenantAccountingAdvancedFormalProductRiskGuardrailPackView>;
export type AccountingAdvancedFormalProductDesignCloseoutResponseDto =
  Serialized<TenantAccountingAdvancedFormalProductDesignCloseoutView>;
export type AccountingAdvancedFormalArtifactDraftingAnchorResponseDto =
  Serialized<TenantAccountingAdvancedFormalArtifactDraftingAnchorView>;
export type AccountingAdvancedAdjustmentDraftPackResponseDto =
  Serialized<TenantAccountingAdvancedAdjustmentDraftPackView>;
export type AccountingAdvancedFormalBooksDraftWorkspaceResponseDto =
  Serialized<TenantAccountingAdvancedFormalBooksDraftWorkspaceView>;
export type AccountingAdvancedFinancialStatementsDraftPackResponseDto =
  Serialized<TenantAccountingAdvancedFinancialStatementsDraftPackView>;
export type AccountingAdvancedCertifiedReconciliationDraftPackResponseDto =
  Serialized<TenantAccountingAdvancedCertifiedReconciliationDraftPackView>;
export type AccountingAdvancedFormalArtifactDraftingCloseoutResponseDto =
  Serialized<TenantAccountingAdvancedFormalArtifactDraftingCloseoutView>;
export type AccountingAdvancedProfessionalReviewExecutionAnchorResponseDto =
  Serialized<TenantAccountingAdvancedProfessionalReviewExecutionAnchorView>;
export type AccountingAdvancedAccountantDraftReviewRoomResponseDto =
  Serialized<TenantAccountingAdvancedAccountantDraftReviewRoomView>;
export type AccountingAdvancedReviewChangeRequestPackResponseDto =
  Serialized<TenantAccountingAdvancedReviewChangeRequestPackView>;
export type AccountingAdvancedProfessionalApprovalRecommendationPackResponseDto =
  Serialized<TenantAccountingAdvancedProfessionalApprovalRecommendationPackView>;
export type AccountingAdvancedReviewExecutionCommandCenterResponseDto =
  Serialized<TenantAccountingAdvancedReviewExecutionCommandCenterView>;
export type AccountingAdvancedProfessionalReviewExecutionCloseoutResponseDto =
  Serialized<TenantAccountingAdvancedProfessionalReviewExecutionCloseoutView>;

export function toAccountingAdvancedDiscoveryAnchorResponseDto(
  view: TenantAccountingAdvancedDiscoveryAnchorView,
): AccountingAdvancedDiscoveryAnchorResponseDto {
  return serialize(view);
}

export function toAccountingAdvancedDiscoveryIntakeResponseDto(
  view: TenantAccountingAdvancedDiscoveryIntakeView,
): AccountingAdvancedDiscoveryIntakeResponseDto {
  return serialize(view);
}

export function toAccountingFormalNeedsClassifierResponseDto(
  view: TenantAccountingFormalNeedsClassifierView,
): AccountingFormalNeedsClassifierResponseDto {
  return serialize(view);
}

export function toAccountingAccountantDiscoveryWorkspaceResponseDto(
  view: TenantAccountingAccountantDiscoveryWorkspaceView,
): AccountingAccountantDiscoveryWorkspaceResponseDto {
  return serialize(view);
}

export function toAccountingAdvancedDiscoveryReadinessPacketResponseDto(
  view: TenantAccountingAdvancedDiscoveryReadinessPacketView,
): AccountingAdvancedDiscoveryReadinessPacketResponseDto {
  return serialize(view);
}

export function toAccountingAdvancedDiscoveryCloseoutResponseDto(
  view: TenantAccountingAdvancedDiscoveryCloseoutView,
): AccountingAdvancedDiscoveryCloseoutResponseDto {
  return serialize(view);
}

export function toAccountingAdvancedMvpScopeRegistryResponseDto(
  view: TenantAccountingAdvancedMvpScopeRegistryView,
): AccountingAdvancedMvpScopeRegistryResponseDto {
  return serialize(view);
}

export function toAccountingAdvancedMvpScopeDecisionRecordResponseDto(
  view: TenantAccountingAdvancedMvpScopeDecisionRecordView,
): AccountingAdvancedMvpScopeDecisionRecordResponseDto {
  return serialize(view);
}

export function toAccountingMinimumLedgerCloseoutDesignWorkspaceResponseDto(
  view: TenantAccountingMinimumLedgerCloseoutDesignWorkspaceView,
): AccountingMinimumLedgerCloseoutDesignWorkspaceResponseDto {
  return serialize(view);
}

export function toAccountingCertifiedBankEvidenceBoundaryResponseDto(
  view: TenantAccountingCertifiedBankEvidenceBoundaryView,
): AccountingCertifiedBankEvidenceBoundaryResponseDto {
  return serialize(view);
}

export function toAccountingAdvancedAuditTrailReadinessPacketResponseDto(
  view: TenantAccountingAdvancedAuditTrailReadinessPacketView,
): AccountingAdvancedAuditTrailReadinessPacketResponseDto {
  return serialize(view);
}

export function toAccountingAdvancedMvpReadinessCloseoutResponseDto(
  view: TenantAccountingAdvancedMvpReadinessCloseoutView,
): AccountingAdvancedMvpReadinessCloseoutResponseDto {
  return serialize(view);
}

export function toAccountingAdvancedMvpExecutionAnchorResponseDto(
  view: TenantAccountingAdvancedMvpExecutionAnchorView,
): AccountingAdvancedMvpExecutionAnchorResponseDto {
  return serialize(view);
}

export function toAccountingAdvancedBankReconciliationMvpWorkbenchResponseDto(
  view: TenantAccountingAdvancedBankReconciliationMvpWorkbenchView,
): AccountingAdvancedBankReconciliationMvpWorkbenchResponseDto {
  return serialize(view);
}

export function toAccountingAdvancedLedgerCloseoutMvpWorkbenchResponseDto(
  view: TenantAccountingAdvancedLedgerCloseoutMvpWorkbenchView,
): AccountingAdvancedLedgerCloseoutMvpWorkbenchResponseDto {
  return serialize(view);
}

export function toAccountingAdvancedMvpAccountantReviewPacketResponseDto(
  view: TenantAccountingAdvancedMvpAccountantReviewPacketView,
): AccountingAdvancedMvpAccountantReviewPacketResponseDto {
  return serialize(view);
}

export function toAccountingAdvancedMvpCommandCenterResponseDto(
  view: TenantAccountingAdvancedMvpCommandCenterView,
): AccountingAdvancedMvpCommandCenterResponseDto {
  return serialize(view);
}

export function toAccountingAdvancedMvpOperatingCloseoutResponseDto(
  view: TenantAccountingAdvancedMvpOperatingCloseoutView,
): AccountingAdvancedMvpOperatingCloseoutResponseDto {
  return serialize(view);
}

export function toAccountingAdvancedPilotEnrollmentResponseDto(
  view: TenantAccountingAdvancedPilotEnrollmentView,
): AccountingAdvancedPilotEnrollmentResponseDto {
  return serialize(view);
}

export function toAccountingAdvancedPilotEvidenceSnapshotResponseDto(
  view: TenantAccountingAdvancedPilotEvidenceSnapshotView,
): AccountingAdvancedPilotEvidenceSnapshotResponseDto {
  return serialize(view);
}

export function toAccountingAdvancedPilotAccountantReviewRoomResponseDto(
  view: TenantAccountingAdvancedPilotAccountantReviewRoomView,
): AccountingAdvancedPilotAccountantReviewRoomResponseDto {
  return serialize(view);
}

export function toAccountingAdvancedPilotRunbookResponseDto(
  view: TenantAccountingAdvancedPilotRunbookView,
): AccountingAdvancedPilotRunbookResponseDto {
  return serialize(view);
}

export function toAccountingAdvancedPilotOutcomePacketResponseDto(
  view: TenantAccountingAdvancedPilotOutcomePacketView,
): AccountingAdvancedPilotOutcomePacketResponseDto {
  return serialize(view);
}

export function toAccountingAdvancedPilotCloseoutResponseDto(
  view: TenantAccountingAdvancedPilotCloseoutView,
): AccountingAdvancedPilotCloseoutResponseDto {
  return serialize(view);
}

export function toAccountingAdvancedPilotLearningRegistryResponseDto(
  view: TenantAccountingAdvancedPilotLearningRegistryView,
): AccountingAdvancedPilotLearningRegistryResponseDto {
  return serialize(view);
}

export function toAccountingAdvancedExternalAccountantAcceptanceCriteriaResponseDto(
  view: TenantAccountingAdvancedExternalAccountantAcceptanceCriteriaView,
): AccountingAdvancedExternalAccountantAcceptanceCriteriaResponseDto {
  return serialize(view);
}

export function toAccountingAdvancedProductGraduationMatrixResponseDto(
  view: TenantAccountingAdvancedProductGraduationMatrixView,
): AccountingAdvancedProductGraduationMatrixResponseDto {
  return serialize(view);
}

export function toAccountingAdvancedFormalBooksBoundaryBlueprintResponseDto(
  view: TenantAccountingAdvancedFormalBooksBoundaryBlueprintView,
): AccountingAdvancedFormalBooksBoundaryBlueprintResponseDto {
  return serialize(view);
}

export function toAccountingAdvancedCertifiedBankFeedBoundaryBlueprintResponseDto(
  view: TenantAccountingAdvancedCertifiedBankFeedBoundaryBlueprintView,
): AccountingAdvancedCertifiedBankFeedBoundaryBlueprintResponseDto {
  return serialize(view);
}

export function toAccountingAdvancedGraduationCloseoutResponseDto(
  view: TenantAccountingAdvancedGraduationCloseoutView,
): AccountingAdvancedGraduationCloseoutResponseDto {
  return serialize(view);
}

export function toAccountingAdvancedPoliciesClosingTemplateRegistryResponseDto(
  view: TenantAccountingAdvancedPoliciesClosingTemplateRegistryView,
): AccountingAdvancedPoliciesClosingTemplateRegistryResponseDto {
  return serialize(view);
}

export function toAccountingAdvancedExternalAccountantPortalShellResponseDto(
  view: TenantAccountingAdvancedExternalAccountantPortalShellView,
): AccountingAdvancedExternalAccountantPortalShellResponseDto {
  return serialize(view);
}

export function toAccountingAdvancedAdjustmentAutomationWorkbenchResponseDto(
  view: TenantAccountingAdvancedAdjustmentAutomationWorkbenchView,
): AccountingAdvancedAdjustmentAutomationWorkbenchResponseDto {
  return serialize(view);
}

export function toAccountingAdvancedMultiPeriodFinancialStatementWorkspaceResponseDto(
  view: TenantAccountingAdvancedMultiPeriodFinancialStatementWorkspaceView,
): AccountingAdvancedMultiPeriodFinancialStatementWorkspaceResponseDto {
  return serialize(view);
}

export function toAccountingAdvancedFormalBooksDraftSigningBoundaryPacketResponseDto(
  view: TenantAccountingAdvancedFormalBooksDraftSigningBoundaryPacketView,
): AccountingAdvancedFormalBooksDraftSigningBoundaryPacketResponseDto {
  return serialize(view);
}

export function toAccountingAdvancedCertifiedBankReconciliationReadinessCloseoutResponseDto(
  view: TenantAccountingAdvancedCertifiedBankReconciliationReadinessCloseoutView,
): AccountingAdvancedCertifiedBankReconciliationReadinessCloseoutResponseDto {
  return serialize(view);
}

export function toAccountingAdvancedFormalProductScopeContractResponseDto(
  view: TenantAccountingAdvancedFormalProductScopeContractView,
): AccountingAdvancedFormalProductScopeContractResponseDto {
  return serialize(view);
}

export function toAccountingAdvancedProfessionalResponsibilityAssignmentMatrixResponseDto(
  view: TenantAccountingAdvancedProfessionalResponsibilityAssignmentMatrixView,
): AccountingAdvancedProfessionalResponsibilityAssignmentMatrixResponseDto {
  return serialize(view);
}

export function toAccountingAdvancedFormalArtifactDraftRegistryResponseDto(
  view: TenantAccountingAdvancedFormalArtifactDraftRegistryView,
): AccountingAdvancedFormalArtifactDraftRegistryResponseDto {
  return serialize(view);
}

export function toAccountingAdvancedProfessionalReviewWorkflowDesignResponseDto(
  view: TenantAccountingAdvancedProfessionalReviewWorkflowDesignView,
): AccountingAdvancedProfessionalReviewWorkflowDesignResponseDto {
  return serialize(view);
}

export function toAccountingAdvancedFormalProductRiskGuardrailPackResponseDto(
  view: TenantAccountingAdvancedFormalProductRiskGuardrailPackView,
): AccountingAdvancedFormalProductRiskGuardrailPackResponseDto {
  return serialize(view);
}

export function toAccountingAdvancedFormalProductDesignCloseoutResponseDto(
  view: TenantAccountingAdvancedFormalProductDesignCloseoutView,
): AccountingAdvancedFormalProductDesignCloseoutResponseDto {
  return serialize(view);
}

export function toAccountingAdvancedFormalArtifactDraftingAnchorResponseDto(
  view: TenantAccountingAdvancedFormalArtifactDraftingAnchorView,
): AccountingAdvancedFormalArtifactDraftingAnchorResponseDto {
  return serialize(view);
}

export function toAccountingAdvancedAdjustmentDraftPackResponseDto(
  view: TenantAccountingAdvancedAdjustmentDraftPackView,
): AccountingAdvancedAdjustmentDraftPackResponseDto {
  return serialize(view);
}

export function toAccountingAdvancedFormalBooksDraftWorkspaceResponseDto(
  view: TenantAccountingAdvancedFormalBooksDraftWorkspaceView,
): AccountingAdvancedFormalBooksDraftWorkspaceResponseDto {
  return serialize(view);
}

export function toAccountingAdvancedFinancialStatementsDraftPackResponseDto(
  view: TenantAccountingAdvancedFinancialStatementsDraftPackView,
): AccountingAdvancedFinancialStatementsDraftPackResponseDto {
  return serialize(view);
}

export function toAccountingAdvancedCertifiedReconciliationDraftPackResponseDto(
  view: TenantAccountingAdvancedCertifiedReconciliationDraftPackView,
): AccountingAdvancedCertifiedReconciliationDraftPackResponseDto {
  return serialize(view);
}

export function toAccountingAdvancedFormalArtifactDraftingCloseoutResponseDto(
  view: TenantAccountingAdvancedFormalArtifactDraftingCloseoutView,
): AccountingAdvancedFormalArtifactDraftingCloseoutResponseDto {
  return serialize(view);
}

export function toAccountingAdvancedProfessionalReviewExecutionAnchorResponseDto(
  view: TenantAccountingAdvancedProfessionalReviewExecutionAnchorView,
): AccountingAdvancedProfessionalReviewExecutionAnchorResponseDto {
  return serialize(view);
}

export function toAccountingAdvancedAccountantDraftReviewRoomResponseDto(
  view: TenantAccountingAdvancedAccountantDraftReviewRoomView,
): AccountingAdvancedAccountantDraftReviewRoomResponseDto {
  return serialize(view);
}

export function toAccountingAdvancedReviewChangeRequestPackResponseDto(
  view: TenantAccountingAdvancedReviewChangeRequestPackView,
): AccountingAdvancedReviewChangeRequestPackResponseDto {
  return serialize(view);
}

export function toAccountingAdvancedProfessionalApprovalRecommendationPackResponseDto(
  view: TenantAccountingAdvancedProfessionalApprovalRecommendationPackView,
): AccountingAdvancedProfessionalApprovalRecommendationPackResponseDto {
  return serialize(view);
}

export function toAccountingAdvancedReviewExecutionCommandCenterResponseDto(
  view: TenantAccountingAdvancedReviewExecutionCommandCenterView,
): AccountingAdvancedReviewExecutionCommandCenterResponseDto {
  return serialize(view);
}

export function toAccountingAdvancedProfessionalReviewExecutionCloseoutResponseDto(
  view: TenantAccountingAdvancedProfessionalReviewExecutionCloseoutView,
): AccountingAdvancedProfessionalReviewExecutionCloseoutResponseDto {
  return serialize(view);
}

type Serialized<T> = T extends Date
  ? string
  : T extends Array<infer Item>
    ? Serialized<Item>[]
    : T extends object
      ? { [Key in keyof T]: Serialized<T[Key]> }
      : T;

function serialize<T>(view: T): Serialized<T> {
  return JSON.parse(JSON.stringify(view)) as Serialized<T>;
}
