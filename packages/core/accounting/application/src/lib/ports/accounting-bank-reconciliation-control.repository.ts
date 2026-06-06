import {
  AccountingBankReconciliationControlEventType,
  AccountingBankReconciliationControlStatus,
  TenantAccountingBankReconciliationControlView,
} from '@saas-platform/accounting-domain';

export interface AccountingBankReconciliationControlRepository {
  save(command: {
    id: string;
    tenantId: string;
    tenantSlug: string;
    period: string;
    year: number;
    eventType: AccountingBankReconciliationControlEventType;
    status: AccountingBankReconciliationControlStatus;
    source: string;
    actorUserId?: string | null;
    actorEmail?: string | null;
    occurredAt: Date;
    reason?: string | null;
    evidenceReference?: string | null;
    payload: TenantAccountingBankReconciliationControlView['payload'];
    blockers: string[];
    impactChecklist: string[];
  }): Promise<TenantAccountingBankReconciliationControlView>;

  listByPeriod(command: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<TenantAccountingBankReconciliationControlView[]>;
}

export const ACCOUNTING_BANK_RECONCILIATION_CONTROL_REPOSITORY = Symbol(
  'ACCOUNTING_BANK_RECONCILIATION_CONTROL_REPOSITORY',
);
