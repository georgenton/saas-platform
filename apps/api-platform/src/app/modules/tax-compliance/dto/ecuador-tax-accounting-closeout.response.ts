import {
  EcuadorTaxAccountingBoundaryCloseoutView,
  EcuadorTaxAccountingEvidenceFromFoundationView,
  EcuadorTaxAssistedDeclarationReviewPackV2View,
  EcuadorTaxCommandCenterV2View,
} from '@saas-platform/tax-compliance-domain';

export type EcuadorTaxAccountingEvidenceFromFoundationResponseDto =
  Serialized<EcuadorTaxAccountingEvidenceFromFoundationView>;
export type EcuadorTaxCommandCenterV2ResponseDto =
  Serialized<EcuadorTaxCommandCenterV2View>;
export type EcuadorTaxAssistedDeclarationReviewPackV2ResponseDto =
  Serialized<EcuadorTaxAssistedDeclarationReviewPackV2View>;
export type EcuadorTaxAccountingBoundaryCloseoutResponseDto =
  Serialized<EcuadorTaxAccountingBoundaryCloseoutView>;

export function toEcuadorTaxAccountingEvidenceFromFoundationResponseDto(
  view: EcuadorTaxAccountingEvidenceFromFoundationView,
): EcuadorTaxAccountingEvidenceFromFoundationResponseDto {
  return serialize(view);
}

export function toEcuadorTaxCommandCenterV2ResponseDto(
  view: EcuadorTaxCommandCenterV2View,
): EcuadorTaxCommandCenterV2ResponseDto {
  return serialize(view);
}

export function toEcuadorTaxAssistedDeclarationReviewPackV2ResponseDto(
  view: EcuadorTaxAssistedDeclarationReviewPackV2View,
): EcuadorTaxAssistedDeclarationReviewPackV2ResponseDto {
  return serialize(view);
}

export function toEcuadorTaxAccountingBoundaryCloseoutResponseDto(
  view: EcuadorTaxAccountingBoundaryCloseoutView,
): EcuadorTaxAccountingBoundaryCloseoutResponseDto {
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
