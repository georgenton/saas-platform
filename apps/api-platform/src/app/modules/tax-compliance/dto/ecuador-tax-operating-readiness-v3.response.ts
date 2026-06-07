import {
  EcuadorTaxAccountantHandoffRoomV2View,
  EcuadorTaxAccountantReviewFromPartyRisksView,
  EcuadorTaxAssistedFiscalCorrectionFlowView,
  EcuadorTaxComplianceHardeningCloseoutV4View,
  EcuadorTaxComplianceProductCloseoutV3View,
  EcuadorTaxDeclarationPartyImpactWorkspaceView,
  EcuadorTaxEvidenceQualityCenterView,
  EcuadorTaxFilingReadinessCertificateView,
  EcuadorTaxObligationRiskMonitorView,
  EcuadorTaxOperatingDashboardV3View,
  EcuadorTaxPartyEvidenceBridgeView,
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
