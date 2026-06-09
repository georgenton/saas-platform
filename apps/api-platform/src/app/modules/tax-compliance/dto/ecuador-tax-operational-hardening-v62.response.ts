import {
  EcuadorTaxAccountantPacketExportV62View,
  EcuadorTaxAccountantFeedbackIntakeQueueV70View,
  EcuadorTaxEvidenceCorrectionWorkbenchV70View,
  EcuadorTaxFormBoxEvidenceBinderV2View,
  EcuadorTaxOperationalHardeningCloseoutV62View,
  EcuadorTaxOperatorActionCenterV62View,
  EcuadorTaxPilotCloseoutDecisionPacketV70View,
  EcuadorTaxPilotFeedbackCloseoutV70View,
  EcuadorTaxPilotTenantReadinessRoomV70View,
  EcuadorTaxSriEvidenceImportPersistenceLedgerV62View,
  EcuadorTaxSriReconciliationExceptionQueueV62View,
} from '@saas-platform/tax-compliance-domain';

export type EcuadorTaxSriEvidenceImportPersistenceLedgerV62ResponseDto =
  Serialized<EcuadorTaxSriEvidenceImportPersistenceLedgerV62View>;
export type EcuadorTaxSriReconciliationExceptionQueueV62ResponseDto =
  Serialized<EcuadorTaxSriReconciliationExceptionQueueV62View>;
export type EcuadorTaxFormBoxEvidenceBinderV2ResponseDto =
  Serialized<EcuadorTaxFormBoxEvidenceBinderV2View>;
export type EcuadorTaxAccountantPacketExportV62ResponseDto =
  Serialized<EcuadorTaxAccountantPacketExportV62View>;
export type EcuadorTaxOperatorActionCenterV62ResponseDto =
  Serialized<EcuadorTaxOperatorActionCenterV62View>;
export type EcuadorTaxOperationalHardeningCloseoutV62ResponseDto =
  Serialized<EcuadorTaxOperationalHardeningCloseoutV62View>;
export type EcuadorTaxPilotTenantReadinessRoomV70ResponseDto =
  Serialized<EcuadorTaxPilotTenantReadinessRoomV70View>;
export type EcuadorTaxAccountantFeedbackIntakeQueueV70ResponseDto =
  Serialized<EcuadorTaxAccountantFeedbackIntakeQueueV70View>;
export type EcuadorTaxEvidenceCorrectionWorkbenchV70ResponseDto =
  Serialized<EcuadorTaxEvidenceCorrectionWorkbenchV70View>;
export type EcuadorTaxPilotCloseoutDecisionPacketV70ResponseDto =
  Serialized<EcuadorTaxPilotCloseoutDecisionPacketV70View>;
export type EcuadorTaxPilotFeedbackCloseoutV70ResponseDto =
  Serialized<EcuadorTaxPilotFeedbackCloseoutV70View>;

export function toEcuadorTaxSriEvidenceImportPersistenceLedgerV62ResponseDto(
  view: EcuadorTaxSriEvidenceImportPersistenceLedgerV62View,
): EcuadorTaxSriEvidenceImportPersistenceLedgerV62ResponseDto {
  return serialize(view);
}

export function toEcuadorTaxSriReconciliationExceptionQueueV62ResponseDto(
  view: EcuadorTaxSriReconciliationExceptionQueueV62View,
): EcuadorTaxSriReconciliationExceptionQueueV62ResponseDto {
  return serialize(view);
}

export function toEcuadorTaxFormBoxEvidenceBinderV2ResponseDto(
  view: EcuadorTaxFormBoxEvidenceBinderV2View,
): EcuadorTaxFormBoxEvidenceBinderV2ResponseDto {
  return serialize(view);
}

export function toEcuadorTaxAccountantPacketExportV62ResponseDto(
  view: EcuadorTaxAccountantPacketExportV62View,
): EcuadorTaxAccountantPacketExportV62ResponseDto {
  return serialize(view);
}

export function toEcuadorTaxOperatorActionCenterV62ResponseDto(
  view: EcuadorTaxOperatorActionCenterV62View,
): EcuadorTaxOperatorActionCenterV62ResponseDto {
  return serialize(view);
}

export function toEcuadorTaxOperationalHardeningCloseoutV62ResponseDto(
  view: EcuadorTaxOperationalHardeningCloseoutV62View,
): EcuadorTaxOperationalHardeningCloseoutV62ResponseDto {
  return serialize(view);
}

export function toEcuadorTaxPilotTenantReadinessRoomV70ResponseDto(
  view: EcuadorTaxPilotTenantReadinessRoomV70View,
): EcuadorTaxPilotTenantReadinessRoomV70ResponseDto {
  return serialize(view);
}

export function toEcuadorTaxAccountantFeedbackIntakeQueueV70ResponseDto(
  view: EcuadorTaxAccountantFeedbackIntakeQueueV70View,
): EcuadorTaxAccountantFeedbackIntakeQueueV70ResponseDto {
  return serialize(view);
}

export function toEcuadorTaxEvidenceCorrectionWorkbenchV70ResponseDto(
  view: EcuadorTaxEvidenceCorrectionWorkbenchV70View,
): EcuadorTaxEvidenceCorrectionWorkbenchV70ResponseDto {
  return serialize(view);
}

export function toEcuadorTaxPilotCloseoutDecisionPacketV70ResponseDto(
  view: EcuadorTaxPilotCloseoutDecisionPacketV70View,
): EcuadorTaxPilotCloseoutDecisionPacketV70ResponseDto {
  return serialize(view);
}

export function toEcuadorTaxPilotFeedbackCloseoutV70ResponseDto(
  view: EcuadorTaxPilotFeedbackCloseoutV70View,
): EcuadorTaxPilotFeedbackCloseoutV70ResponseDto {
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
