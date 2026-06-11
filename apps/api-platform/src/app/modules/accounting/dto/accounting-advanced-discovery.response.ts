import {
  TenantAccountingAccountantDiscoveryWorkspaceView,
  TenantAccountingAdvancedAuditTrailReadinessPacketView,
  TenantAccountingAdvancedDiscoveryAnchorView,
  TenantAccountingAdvancedDiscoveryCloseoutView,
  TenantAccountingAdvancedDiscoveryIntakeView,
  TenantAccountingAdvancedDiscoveryReadinessPacketView,
  TenantAccountingAdvancedMvpReadinessCloseoutView,
  TenantAccountingAdvancedMvpScopeDecisionRecordView,
  TenantAccountingAdvancedMvpScopeRegistryView,
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
