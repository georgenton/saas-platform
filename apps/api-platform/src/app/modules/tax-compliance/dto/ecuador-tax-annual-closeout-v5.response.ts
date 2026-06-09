import {
  EcuadorTaxAccountingAdvancedDiscoveryGateView,
  EcuadorTaxAccountingAdvancedGateV2View,
  EcuadorTaxAccountingBoundaryAiReviewView,
  EcuadorTaxAnnualFiscalYearWorkspaceView,
  EcuadorTaxAnnualIncomeTaxReconciliationV2View,
  EcuadorTaxAuditReadinessBinderView,
  EcuadorTaxComplianceAnnualCloseoutV5View,
  EcuadorTaxDeclarationHandoffCloseoutV6View,
  EcuadorTaxExternalAccountantAnnualReviewRoomView,
  EcuadorTaxProfessionalHandoffV6View,
} from '@saas-platform/tax-compliance-domain';

export type EcuadorTaxAnnualFiscalYearWorkspaceResponseDto =
  Serialized<EcuadorTaxAnnualFiscalYearWorkspaceView>;
export type EcuadorTaxAnnualIncomeTaxReconciliationV2ResponseDto =
  Serialized<EcuadorTaxAnnualIncomeTaxReconciliationV2View>;
export type EcuadorTaxAuditReadinessBinderResponseDto =
  Serialized<EcuadorTaxAuditReadinessBinderView>;
export type EcuadorTaxExternalAccountantAnnualReviewRoomResponseDto =
  Serialized<EcuadorTaxExternalAccountantAnnualReviewRoomView>;
export type EcuadorTaxAccountingAdvancedDiscoveryGateResponseDto =
  Serialized<EcuadorTaxAccountingAdvancedDiscoveryGateView>;
export type EcuadorTaxComplianceAnnualCloseoutV5ResponseDto =
  Serialized<EcuadorTaxComplianceAnnualCloseoutV5View>;
export type EcuadorTaxProfessionalHandoffV6ResponseDto =
  Serialized<EcuadorTaxProfessionalHandoffV6View>;
export type EcuadorTaxAccountingAdvancedGateV2ResponseDto =
  Serialized<EcuadorTaxAccountingAdvancedGateV2View>;
export type EcuadorTaxAccountingBoundaryAiReviewResponseDto =
  Serialized<EcuadorTaxAccountingBoundaryAiReviewView>;
export type EcuadorTaxDeclarationHandoffCloseoutV6ResponseDto =
  Serialized<EcuadorTaxDeclarationHandoffCloseoutV6View>;

export function toEcuadorTaxAnnualFiscalYearWorkspaceResponseDto(
  view: EcuadorTaxAnnualFiscalYearWorkspaceView,
): EcuadorTaxAnnualFiscalYearWorkspaceResponseDto {
  return serialize(view);
}

export function toEcuadorTaxAnnualIncomeTaxReconciliationV2ResponseDto(
  view: EcuadorTaxAnnualIncomeTaxReconciliationV2View,
): EcuadorTaxAnnualIncomeTaxReconciliationV2ResponseDto {
  return serialize(view);
}

export function toEcuadorTaxAuditReadinessBinderResponseDto(
  view: EcuadorTaxAuditReadinessBinderView,
): EcuadorTaxAuditReadinessBinderResponseDto {
  return serialize(view);
}

export function toEcuadorTaxExternalAccountantAnnualReviewRoomResponseDto(
  view: EcuadorTaxExternalAccountantAnnualReviewRoomView,
): EcuadorTaxExternalAccountantAnnualReviewRoomResponseDto {
  return serialize(view);
}

export function toEcuadorTaxAccountingAdvancedDiscoveryGateResponseDto(
  view: EcuadorTaxAccountingAdvancedDiscoveryGateView,
): EcuadorTaxAccountingAdvancedDiscoveryGateResponseDto {
  return serialize(view);
}

export function toEcuadorTaxComplianceAnnualCloseoutV5ResponseDto(
  view: EcuadorTaxComplianceAnnualCloseoutV5View,
): EcuadorTaxComplianceAnnualCloseoutV5ResponseDto {
  return serialize(view);
}

export function toEcuadorTaxProfessionalHandoffV6ResponseDto(
  view: EcuadorTaxProfessionalHandoffV6View,
): EcuadorTaxProfessionalHandoffV6ResponseDto {
  return serialize(view);
}

export function toEcuadorTaxAccountingAdvancedGateV2ResponseDto(
  view: EcuadorTaxAccountingAdvancedGateV2View,
): EcuadorTaxAccountingAdvancedGateV2ResponseDto {
  return serialize(view);
}

export function toEcuadorTaxAccountingBoundaryAiReviewResponseDto(
  view: EcuadorTaxAccountingBoundaryAiReviewView,
): EcuadorTaxAccountingBoundaryAiReviewResponseDto {
  return serialize(view);
}

export function toEcuadorTaxDeclarationHandoffCloseoutV6ResponseDto(
  view: EcuadorTaxDeclarationHandoffCloseoutV6View,
): EcuadorTaxDeclarationHandoffCloseoutV6ResponseDto {
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
