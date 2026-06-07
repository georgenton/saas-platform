import {
  EcuadorTaxAccountantEscalationServiceBoundaryView,
  EcuadorTaxComplianceCloseoutV2View,
  EcuadorTaxFilingAssistantV2View,
  EcuadorTaxIncomeTaxEvidenceWorkspaceV2View,
  EcuadorTaxSriSourceImportCenterV2View,
  EcuadorTaxVatDeclarationWorkspaceV2View,
} from '@saas-platform/tax-compliance-domain';

export type EcuadorTaxSriSourceImportCenterV2ResponseDto =
  Serialized<EcuadorTaxSriSourceImportCenterV2View>;
export type EcuadorTaxVatDeclarationWorkspaceV2ResponseDto =
  Serialized<EcuadorTaxVatDeclarationWorkspaceV2View>;
export type EcuadorTaxIncomeTaxEvidenceWorkspaceV2ResponseDto =
  Serialized<EcuadorTaxIncomeTaxEvidenceWorkspaceV2View>;
export type EcuadorTaxFilingAssistantV2ResponseDto =
  Serialized<EcuadorTaxFilingAssistantV2View>;
export type EcuadorTaxAccountantEscalationServiceBoundaryResponseDto =
  Serialized<EcuadorTaxAccountantEscalationServiceBoundaryView>;
export type EcuadorTaxComplianceCloseoutV2ResponseDto =
  Serialized<EcuadorTaxComplianceCloseoutV2View>;

export function toEcuadorTaxSriSourceImportCenterV2ResponseDto(
  view: EcuadorTaxSriSourceImportCenterV2View,
): EcuadorTaxSriSourceImportCenterV2ResponseDto {
  return serialize(view);
}

export function toEcuadorTaxVatDeclarationWorkspaceV2ResponseDto(
  view: EcuadorTaxVatDeclarationWorkspaceV2View,
): EcuadorTaxVatDeclarationWorkspaceV2ResponseDto {
  return serialize(view);
}

export function toEcuadorTaxIncomeTaxEvidenceWorkspaceV2ResponseDto(
  view: EcuadorTaxIncomeTaxEvidenceWorkspaceV2View,
): EcuadorTaxIncomeTaxEvidenceWorkspaceV2ResponseDto {
  return serialize(view);
}

export function toEcuadorTaxFilingAssistantV2ResponseDto(
  view: EcuadorTaxFilingAssistantV2View,
): EcuadorTaxFilingAssistantV2ResponseDto {
  return serialize(view);
}

export function toEcuadorTaxAccountantEscalationServiceBoundaryResponseDto(
  view: EcuadorTaxAccountantEscalationServiceBoundaryView,
): EcuadorTaxAccountantEscalationServiceBoundaryResponseDto {
  return serialize(view);
}

export function toEcuadorTaxComplianceCloseoutV2ResponseDto(
  view: EcuadorTaxComplianceCloseoutV2View,
): EcuadorTaxComplianceCloseoutV2ResponseDto {
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
