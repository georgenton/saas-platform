import {
  TenantAccountingBankAccountRegistryWorkspaceView,
  TenantAccountingBankStatementImportProfileWorkspaceView,
  TenantAccountingOpeningBalanceApprovalPacketView,
  TenantAccountingOpeningBalanceControlRegistryView,
  TenantAccountingOpeningBalanceJournalMaterializationView,
  TenantAccountingOperationalCommandCenterView,
} from '@saas-platform/accounting-domain';

export interface RequestAccountingOpeningBalanceApprovalPacketRequestDto {
  period: string;
  year: number;
  decision: 'prepare' | 'approve' | 'reject';
  reviewerUserId?: string | null;
  reviewerEmail?: string | null;
  note?: string | null;
  evidenceReference?: string | null;
  lineKeys?: string[];
}

export interface CreateAccountingOpeningBalanceJournalEntryRequestDto {
  period: string;
  year: number;
  reviewerUserId?: string | null;
  reviewerEmail?: string | null;
  note?: string | null;
  evidenceReference?: string | null;
}

export type AccountingOpeningBalanceApprovalPacketResponseDto =
  Serialized<TenantAccountingOpeningBalanceApprovalPacketView>;
export type AccountingOpeningBalanceControlRegistryResponseDto =
  Serialized<TenantAccountingOpeningBalanceControlRegistryView>;
export type AccountingOpeningBalanceJournalMaterializationResponseDto =
  Serialized<TenantAccountingOpeningBalanceJournalMaterializationView>;
export type AccountingBankAccountRegistryWorkspaceResponseDto =
  Serialized<TenantAccountingBankAccountRegistryWorkspaceView>;
export type AccountingBankStatementImportProfileWorkspaceResponseDto =
  Serialized<TenantAccountingBankStatementImportProfileWorkspaceView>;
export type AccountingOperationalCommandCenterResponseDto =
  Serialized<TenantAccountingOperationalCommandCenterView>;

export function toAccountingOpeningBalanceApprovalPacketResponseDto(
  view: TenantAccountingOpeningBalanceApprovalPacketView,
): AccountingOpeningBalanceApprovalPacketResponseDto {
  return serialize(view);
}

export function toAccountingOpeningBalanceControlRegistryResponseDto(
  view: TenantAccountingOpeningBalanceControlRegistryView,
): AccountingOpeningBalanceControlRegistryResponseDto {
  return serialize(view);
}

export function toAccountingOpeningBalanceJournalMaterializationResponseDto(
  view: TenantAccountingOpeningBalanceJournalMaterializationView,
): AccountingOpeningBalanceJournalMaterializationResponseDto {
  return serialize(view);
}

export function toAccountingBankAccountRegistryWorkspaceResponseDto(
  view: TenantAccountingBankAccountRegistryWorkspaceView,
): AccountingBankAccountRegistryWorkspaceResponseDto {
  return serialize(view);
}

export function toAccountingBankStatementImportProfileWorkspaceResponseDto(
  view: TenantAccountingBankStatementImportProfileWorkspaceView,
): AccountingBankStatementImportProfileWorkspaceResponseDto {
  return serialize(view);
}

export function toAccountingOperationalCommandCenterResponseDto(
  view: TenantAccountingOperationalCommandCenterView,
): AccountingOperationalCommandCenterResponseDto {
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
