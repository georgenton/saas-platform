import {
  TenantAccountingFoundationCloseoutPackV2View,
  TenantAccountingTaxComplianceFeedbackBridgeView,
  TenantAccountingTaxDeclarationEvidenceBridgeView,
} from '@saas-platform/accounting-domain';

export type AccountingFoundationCloseoutPackV2ResponseDto =
  Serialized<TenantAccountingFoundationCloseoutPackV2View>;
export type AccountingTaxComplianceFeedbackBridgeResponseDto =
  Serialized<TenantAccountingTaxComplianceFeedbackBridgeView>;
export type AccountingTaxDeclarationEvidenceBridgeResponseDto =
  Serialized<TenantAccountingTaxDeclarationEvidenceBridgeView>;

export function toAccountingFoundationCloseoutPackV2ResponseDto(
  view: TenantAccountingFoundationCloseoutPackV2View,
): AccountingFoundationCloseoutPackV2ResponseDto {
  return serialize(view);
}

export function toAccountingTaxComplianceFeedbackBridgeResponseDto(
  view: TenantAccountingTaxComplianceFeedbackBridgeView,
): AccountingTaxComplianceFeedbackBridgeResponseDto {
  return serialize(view);
}

export function toAccountingTaxDeclarationEvidenceBridgeResponseDto(
  view: TenantAccountingTaxDeclarationEvidenceBridgeView,
): AccountingTaxDeclarationEvidenceBridgeResponseDto {
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
