import {
  EcuadorTaxAccountantHandoffRoomV2View,
  EcuadorTaxComplianceProductCloseoutV3View,
  EcuadorTaxEvidenceQualityCenterView,
  EcuadorTaxFilingReadinessCertificateView,
  EcuadorTaxObligationRiskMonitorView,
  EcuadorTaxOperatingDashboardV3View,
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
