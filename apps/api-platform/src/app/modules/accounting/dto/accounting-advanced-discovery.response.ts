import {
  TenantAccountingAccountantDiscoveryWorkspaceView,
  TenantAccountingAdvancedDiscoveryAnchorView,
  TenantAccountingAdvancedDiscoveryCloseoutView,
  TenantAccountingAdvancedDiscoveryIntakeView,
  TenantAccountingAdvancedDiscoveryReadinessPacketView,
  TenantAccountingFormalNeedsClassifierView,
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
