import {
  AccountingPeriodControlAction,
  AccountingPeriodControlStatus,
  TenantAccountingPeriodControlView,
} from '@saas-platform/accounting-domain';

export interface AccountingPeriodControlRepository {
  save(command: {
    id: string;
    tenantId: string;
    tenantSlug: string;
    period: string;
    year: number;
    status: AccountingPeriodControlStatus;
    action: AccountingPeriodControlAction;
    actionByUserId?: string | null;
    actionByEmail?: string | null;
    actionAt: Date;
    reason?: string | null;
    evidenceReference?: string | null;
    blockers: string[];
    snapshot: TenantAccountingPeriodControlView['snapshot'];
    impactChecklist: string[];
  }): Promise<TenantAccountingPeriodControlView>;

  listByPeriod(command: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<TenantAccountingPeriodControlView[]>;
}

export const ACCOUNTING_PERIOD_CONTROL_REPOSITORY = Symbol(
  'ACCOUNTING_PERIOD_CONTROL_REPOSITORY',
);
