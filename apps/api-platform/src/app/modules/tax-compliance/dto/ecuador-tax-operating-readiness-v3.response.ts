import {
  EcuadorTaxAccountantHandoffRoomV2View,
  EcuadorTaxAccountantFilingReviewRoomV3View,
  EcuadorTaxAccountantReviewFromPartyRisksView,
  EcuadorTaxAnnexesReadinessV2View,
  EcuadorTaxAssistedFiscalCorrectionFlowView,
  EcuadorTaxComplianceDeclarationCloseoutV3View,
  EcuadorTaxComplianceHardeningCloseoutV4View,
  EcuadorTaxComplianceProductCloseoutV3View,
  EcuadorTaxDeclarationArtifactExportV2View,
  EcuadorTaxCompliancePostFilingCloseoutV4View,
  EcuadorTaxDeclarationPartyImpactWorkspaceView,
  EcuadorTaxDeclarationPartyRecalculationPacketView,
  EcuadorTaxEvidenceQualityCenterView,
  EcuadorTaxFilingReadinessCertificateView,
  EcuadorTaxExternalFilingResultRecordView,
  EcuadorTaxFormBoxEvidenceBinderView,
  EcuadorTaxObligationFilingWorkspaceView,
  EcuadorTaxObligationRiskMonitorView,
  EcuadorTaxOperatingDashboardV3View,
  EcuadorTaxPaymentObligationTrackerView,
  EcuadorTaxPeriodPostFilingCertificateView,
  EcuadorTaxPostFilingExceptionCenterView,
  EcuadorTaxSriFilingReceiptEvidenceVaultView,
  EcuadorTaxAccountantPartyRiskReviewExecutionView,
  EcuadorTaxPartiesOperationalCommandCenterView,
  EcuadorTaxPartiesPersistenceDecisionPackView,
  EcuadorTaxPartyFiscalValidationLedgerView,
  EcuadorTaxPartyEvidenceBridgeView,
  EcuadorTaxPartySriEvidenceImportView,
  EcuadorTaxSriTaxpayerValidationReadinessView,
} from '@saas-platform/tax-compliance-domain';

export type EcuadorTaxEvidenceQualityCenterResponseDto =
  Serialized<EcuadorTaxEvidenceQualityCenterView>;
export type EcuadorTaxObligationRiskMonitorResponseDto =
  Serialized<EcuadorTaxObligationRiskMonitorView>;
export type EcuadorTaxAccountantHandoffRoomV2ResponseDto =
  Serialized<EcuadorTaxAccountantHandoffRoomV2View>;
export type EcuadorTaxFilingReadinessCertificateResponseDto =
  Serialized<EcuadorTaxFilingReadinessCertificateView>;
export type EcuadorTaxOperatingDashboardV3ResponseDto =
  Serialized<EcuadorTaxOperatingDashboardV3View>;
export type EcuadorTaxComplianceProductCloseoutV3ResponseDto =
  Serialized<EcuadorTaxComplianceProductCloseoutV3View>;
export type EcuadorTaxPartyEvidenceBridgeResponseDto =
  Serialized<EcuadorTaxPartyEvidenceBridgeView>;
export type EcuadorTaxSriTaxpayerValidationReadinessResponseDto =
  Serialized<EcuadorTaxSriTaxpayerValidationReadinessView>;
export type EcuadorTaxDeclarationPartyImpactWorkspaceResponseDto =
  Serialized<EcuadorTaxDeclarationPartyImpactWorkspaceView>;
export type EcuadorTaxAssistedFiscalCorrectionFlowResponseDto =
  Serialized<EcuadorTaxAssistedFiscalCorrectionFlowView>;
export type EcuadorTaxAccountantReviewFromPartyRisksResponseDto =
  Serialized<EcuadorTaxAccountantReviewFromPartyRisksView>;
export type EcuadorTaxComplianceHardeningCloseoutV4ResponseDto =
  Serialized<EcuadorTaxComplianceHardeningCloseoutV4View>;
export type EcuadorTaxPartySriEvidenceImportResponseDto =
  Serialized<EcuadorTaxPartySriEvidenceImportView>;
export type EcuadorTaxPartyFiscalValidationLedgerResponseDto =
  Serialized<EcuadorTaxPartyFiscalValidationLedgerView>;
export type EcuadorTaxDeclarationPartyRecalculationPacketResponseDto =
  Serialized<EcuadorTaxDeclarationPartyRecalculationPacketView>;
export type EcuadorTaxAccountantPartyRiskReviewExecutionResponseDto =
  Serialized<EcuadorTaxAccountantPartyRiskReviewExecutionView>;
export type EcuadorTaxPartiesPersistenceDecisionPackResponseDto =
  Serialized<EcuadorTaxPartiesPersistenceDecisionPackView>;
export type EcuadorTaxPartiesOperationalCommandCenterResponseDto =
  Serialized<EcuadorTaxPartiesOperationalCommandCenterView>;
export type EcuadorTaxObligationFilingWorkspaceResponseDto =
  Serialized<EcuadorTaxObligationFilingWorkspaceView>;
export type EcuadorTaxFormBoxEvidenceBinderResponseDto =
  Serialized<EcuadorTaxFormBoxEvidenceBinderView>;
export type EcuadorTaxAnnexesReadinessV2ResponseDto =
  Serialized<EcuadorTaxAnnexesReadinessV2View>;
export type EcuadorTaxAccountantFilingReviewRoomV3ResponseDto =
  Serialized<EcuadorTaxAccountantFilingReviewRoomV3View>;
export type EcuadorTaxDeclarationArtifactExportV2ResponseDto =
  Serialized<EcuadorTaxDeclarationArtifactExportV2View>;
export type EcuadorTaxComplianceDeclarationCloseoutV3ResponseDto =
  Serialized<EcuadorTaxComplianceDeclarationCloseoutV3View>;
export type EcuadorTaxExternalFilingResultRecordResponseDto =
  Serialized<EcuadorTaxExternalFilingResultRecordView>;
export type EcuadorTaxPaymentObligationTrackerResponseDto =
  Serialized<EcuadorTaxPaymentObligationTrackerView>;
export type EcuadorTaxSriFilingReceiptEvidenceVaultResponseDto =
  Serialized<EcuadorTaxSriFilingReceiptEvidenceVaultView>;
export type EcuadorTaxPostFilingExceptionCenterResponseDto =
  Serialized<EcuadorTaxPostFilingExceptionCenterView>;
export type EcuadorTaxPeriodPostFilingCertificateResponseDto =
  Serialized<EcuadorTaxPeriodPostFilingCertificateView>;
export type EcuadorTaxCompliancePostFilingCloseoutV4ResponseDto =
  Serialized<EcuadorTaxCompliancePostFilingCloseoutV4View>;

export function toEcuadorTaxEvidenceQualityCenterResponseDto(
  view: EcuadorTaxEvidenceQualityCenterView,
): EcuadorTaxEvidenceQualityCenterResponseDto {
  return serialize(view);
}

export function toEcuadorTaxObligationRiskMonitorResponseDto(
  view: EcuadorTaxObligationRiskMonitorView,
): EcuadorTaxObligationRiskMonitorResponseDto {
  return serialize(view);
}

export function toEcuadorTaxAccountantHandoffRoomV2ResponseDto(
  view: EcuadorTaxAccountantHandoffRoomV2View,
): EcuadorTaxAccountantHandoffRoomV2ResponseDto {
  return serialize(view);
}

export function toEcuadorTaxFilingReadinessCertificateResponseDto(
  view: EcuadorTaxFilingReadinessCertificateView,
): EcuadorTaxFilingReadinessCertificateResponseDto {
  return serialize(view);
}

export function toEcuadorTaxOperatingDashboardV3ResponseDto(
  view: EcuadorTaxOperatingDashboardV3View,
): EcuadorTaxOperatingDashboardV3ResponseDto {
  return serialize(view);
}

export function toEcuadorTaxComplianceProductCloseoutV3ResponseDto(
  view: EcuadorTaxComplianceProductCloseoutV3View,
): EcuadorTaxComplianceProductCloseoutV3ResponseDto {
  return serialize(view);
}

export function toEcuadorTaxPartyEvidenceBridgeResponseDto(
  view: EcuadorTaxPartyEvidenceBridgeView,
): EcuadorTaxPartyEvidenceBridgeResponseDto {
  return serialize(view);
}

export function toEcuadorTaxSriTaxpayerValidationReadinessResponseDto(
  view: EcuadorTaxSriTaxpayerValidationReadinessView,
): EcuadorTaxSriTaxpayerValidationReadinessResponseDto {
  return serialize(view);
}

export function toEcuadorTaxDeclarationPartyImpactWorkspaceResponseDto(
  view: EcuadorTaxDeclarationPartyImpactWorkspaceView,
): EcuadorTaxDeclarationPartyImpactWorkspaceResponseDto {
  return serialize(view);
}

export function toEcuadorTaxAssistedFiscalCorrectionFlowResponseDto(
  view: EcuadorTaxAssistedFiscalCorrectionFlowView,
): EcuadorTaxAssistedFiscalCorrectionFlowResponseDto {
  return serialize(view);
}

export function toEcuadorTaxAccountantReviewFromPartyRisksResponseDto(
  view: EcuadorTaxAccountantReviewFromPartyRisksView,
): EcuadorTaxAccountantReviewFromPartyRisksResponseDto {
  return serialize(view);
}

export function toEcuadorTaxComplianceHardeningCloseoutV4ResponseDto(
  view: EcuadorTaxComplianceHardeningCloseoutV4View,
): EcuadorTaxComplianceHardeningCloseoutV4ResponseDto {
  return serialize(view);
}

export function toEcuadorTaxPartySriEvidenceImportResponseDto(
  view: EcuadorTaxPartySriEvidenceImportView,
): EcuadorTaxPartySriEvidenceImportResponseDto {
  return serialize(view);
}

export function toEcuadorTaxPartyFiscalValidationLedgerResponseDto(
  view: EcuadorTaxPartyFiscalValidationLedgerView,
): EcuadorTaxPartyFiscalValidationLedgerResponseDto {
  return serialize(view);
}

export function toEcuadorTaxDeclarationPartyRecalculationPacketResponseDto(
  view: EcuadorTaxDeclarationPartyRecalculationPacketView,
): EcuadorTaxDeclarationPartyRecalculationPacketResponseDto {
  return serialize(view);
}

export function toEcuadorTaxAccountantPartyRiskReviewExecutionResponseDto(
  view: EcuadorTaxAccountantPartyRiskReviewExecutionView,
): EcuadorTaxAccountantPartyRiskReviewExecutionResponseDto {
  return serialize(view);
}

export function toEcuadorTaxPartiesPersistenceDecisionPackResponseDto(
  view: EcuadorTaxPartiesPersistenceDecisionPackView,
): EcuadorTaxPartiesPersistenceDecisionPackResponseDto {
  return serialize(view);
}

export function toEcuadorTaxPartiesOperationalCommandCenterResponseDto(
  view: EcuadorTaxPartiesOperationalCommandCenterView,
): EcuadorTaxPartiesOperationalCommandCenterResponseDto {
  return serialize(view);
}

export function toEcuadorTaxObligationFilingWorkspaceResponseDto(
  view: EcuadorTaxObligationFilingWorkspaceView,
): EcuadorTaxObligationFilingWorkspaceResponseDto {
  return serialize(view);
}

export function toEcuadorTaxFormBoxEvidenceBinderResponseDto(
  view: EcuadorTaxFormBoxEvidenceBinderView,
): EcuadorTaxFormBoxEvidenceBinderResponseDto {
  return serialize(view);
}

export function toEcuadorTaxAnnexesReadinessV2ResponseDto(
  view: EcuadorTaxAnnexesReadinessV2View,
): EcuadorTaxAnnexesReadinessV2ResponseDto {
  return serialize(view);
}

export function toEcuadorTaxAccountantFilingReviewRoomV3ResponseDto(
  view: EcuadorTaxAccountantFilingReviewRoomV3View,
): EcuadorTaxAccountantFilingReviewRoomV3ResponseDto {
  return serialize(view);
}

export function toEcuadorTaxDeclarationArtifactExportV2ResponseDto(
  view: EcuadorTaxDeclarationArtifactExportV2View,
): EcuadorTaxDeclarationArtifactExportV2ResponseDto {
  return serialize(view);
}

export function toEcuadorTaxComplianceDeclarationCloseoutV3ResponseDto(
  view: EcuadorTaxComplianceDeclarationCloseoutV3View,
): EcuadorTaxComplianceDeclarationCloseoutV3ResponseDto {
  return serialize(view);
}

export function toEcuadorTaxExternalFilingResultRecordResponseDto(
  view: EcuadorTaxExternalFilingResultRecordView,
): EcuadorTaxExternalFilingResultRecordResponseDto {
  return serialize(view);
}

export function toEcuadorTaxPaymentObligationTrackerResponseDto(
  view: EcuadorTaxPaymentObligationTrackerView,
): EcuadorTaxPaymentObligationTrackerResponseDto {
  return serialize(view);
}

export function toEcuadorTaxSriFilingReceiptEvidenceVaultResponseDto(
  view: EcuadorTaxSriFilingReceiptEvidenceVaultView,
): EcuadorTaxSriFilingReceiptEvidenceVaultResponseDto {
  return serialize(view);
}

export function toEcuadorTaxPostFilingExceptionCenterResponseDto(
  view: EcuadorTaxPostFilingExceptionCenterView,
): EcuadorTaxPostFilingExceptionCenterResponseDto {
  return serialize(view);
}

export function toEcuadorTaxPeriodPostFilingCertificateResponseDto(
  view: EcuadorTaxPeriodPostFilingCertificateView,
): EcuadorTaxPeriodPostFilingCertificateResponseDto {
  return serialize(view);
}

export function toEcuadorTaxCompliancePostFilingCloseoutV4ResponseDto(
  view: EcuadorTaxCompliancePostFilingCloseoutV4View,
): EcuadorTaxCompliancePostFilingCloseoutV4ResponseDto {
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
