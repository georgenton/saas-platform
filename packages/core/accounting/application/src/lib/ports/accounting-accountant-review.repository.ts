import {
  AccountingAccountantReviewStatus,
  TenantAccountingAccountantReviewView,
  TenantAccountingAccountantHandoffWorkspaceView,
} from '@saas-platform/accounting-domain';

export interface AccountingAccountantReviewRepository {
  save(review: TenantAccountingAccountantReviewView): Promise<void>;
  findByTenantIdAndId(
    tenantId: string,
    reviewId: string,
  ): Promise<TenantAccountingAccountantReviewView | null>;
  listByTenantIdAndPeriod(
    tenantId: string,
    period: string,
  ): Promise<TenantAccountingAccountantReviewView[]>;
  findLatestByTenantIdAndPeriod(
    tenantId: string,
    period: string,
  ): Promise<TenantAccountingAccountantReviewView | null>;
}

export interface CreateAccountingAccountantReviewCommand {
  id: string;
  tenantId: string;
  tenantSlug: string;
  period: string;
  year: number;
  requestedByUserId: string | null;
  requestedByEmail: string | null;
  summary: string;
  questions: string[];
  riskFlags: TenantAccountingAccountantHandoffWorkspaceView['riskFlags'];
  evidenceReferences: string[];
  now: Date;
}

export interface TransitionAccountingAccountantReviewCommand {
  status: AccountingAccountantReviewStatus;
  transitionedAt: Date;
  transitionedByUserId: string | null;
  note: string | null;
}

export const ACCOUNTING_ACCOUNTANT_REVIEW_REPOSITORY = Symbol(
  'ACCOUNTING_ACCOUNTANT_REVIEW_REPOSITORY',
);
