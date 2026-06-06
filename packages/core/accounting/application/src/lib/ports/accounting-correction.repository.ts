import {
  AccountingCorrectionSource,
  AccountingCorrectionStatus,
  TenantAccountingCorrectionView,
} from '@saas-platform/accounting-domain';

export interface AccountingCorrectionRepository {
  save(correction: TenantAccountingCorrectionView): Promise<void>;
  listByPeriod(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<TenantAccountingCorrectionView[]>;
}

export interface CreateAccountingCorrectionCommand {
  id: string;
  tenantId: string;
  tenantSlug: string;
  period: string;
  year: number;
  source: AccountingCorrectionSource;
  status: AccountingCorrectionStatus;
  severity: 'info' | 'warning' | 'critical';
  title: string;
  detail: string;
  recommendedAction: string;
  ownerUserId: string | null;
  ownerEmail: string | null;
  evidenceReference: string | null;
  now: Date;
}

export const ACCOUNTING_CORRECTION_REPOSITORY = Symbol(
  'ACCOUNTING_CORRECTION_REPOSITORY',
);
