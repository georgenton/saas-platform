import {
  EcuadorTaxAccountantReviewStatus,
  EcuadorTaxAccountantReviewView,
  EcuadorTaxEvidenceSummaryView,
} from '@saas-platform/tax-compliance-domain';

export interface TaxComplianceAccountantReviewRepository {
  save(review: EcuadorTaxAccountantReviewView): Promise<void>;
  findByTenantIdAndId(
    tenantId: string,
    reviewId: string,
  ): Promise<EcuadorTaxAccountantReviewView | null>;
  listByTenantIdAndPeriod(
    tenantId: string,
    period: string,
  ): Promise<EcuadorTaxAccountantReviewView[]>;
  findLatestByTenantIdAndPeriod(
    tenantId: string,
    period: string,
  ): Promise<EcuadorTaxAccountantReviewView | null>;
}

export interface CreateTaxComplianceAccountantReviewCommand {
  id: string;
  tenantId: string;
  tenantSlug: string;
  period: string;
  year: number;
  requestedByUserId: string | null;
  requestedByEmail: string | null;
  summary: string;
  questions: string[];
  evidenceSummary: EcuadorTaxEvidenceSummaryView;
  now: Date;
}

export interface TransitionTaxComplianceAccountantReviewCommand {
  status: EcuadorTaxAccountantReviewStatus;
  transitionedAt: Date;
  transitionedByUserId: string | null;
  note: string | null;
}
