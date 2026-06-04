export type EcuadorTaxpayerRegime =
  | 'general'
  | 'rimpe_entrepreneur'
  | 'rimpe_popular_business'
  | 'unknown';

export type EcuadorTaxObligationKey =
  | 'vat'
  | 'income_tax'
  | 'withholding'
  | 'annexes';

export type EcuadorTaxObligationFrequency =
  | 'monthly'
  | 'semiannual'
  | 'annual'
  | 'event_driven'
  | 'unknown';

export type EcuadorTaxReadinessStatus =
  | 'ready'
  | 'needs_review'
  | 'blocked';

export interface EcuadorTaxpayerProfileView {
  tenantSlug: string;
  tenantId: string;
  generatedAt: Date;
  country: 'EC';
  legalName: string;
  commercialName: string | null;
  taxpayerId: string | null;
  regime: EcuadorTaxpayerRegime;
  accountingObligated: boolean | null;
  specialTaxpayerCode: string | null;
  matrixAddress: string | null;
  establishmentAddress: string | null;
  source: 'invoicing_issuer_profile';
  readinessStatus: EcuadorTaxReadinessStatus;
  missingFields: string[];
  reviewNotes: string[];
  thirdPartyFiscalSummary: {
    totalParties: number;
    completeParties: number;
    needsReviewParties: number;
    missingFieldCounts: Record<string, number>;
  };
}

export interface EcuadorTaxObligationView {
  key: EcuadorTaxObligationKey;
  label: string;
  applies: boolean;
  frequency: EcuadorTaxObligationFrequency;
  source: 'sri_rule_of_thumb';
  readinessStatus: EcuadorTaxReadinessStatus;
  dependsOn: string[];
  notes: string[];
}

export interface EcuadorTaxObligationMatrixView {
  tenantSlug: string;
  generatedAt: Date;
  taxpayerProfile: EcuadorTaxpayerProfileView;
  obligations: EcuadorTaxObligationView[];
  guardrails: string[];
}

export interface EcuadorTaxCalendarEntryView {
  obligationKey: EcuadorTaxObligationKey;
  label: string;
  period: string;
  frequency: EcuadorTaxObligationFrequency;
  dueDate: string | null;
  dueDay: number | null;
  source: 'sri_rule_of_thumb';
  readinessStatus: EcuadorTaxReadinessStatus;
  notes: string[];
}

export interface EcuadorTaxObligationCalendarView {
  tenantSlug: string;
  year: number;
  generatedAt: Date;
  taxpayerProfile: EcuadorTaxpayerProfileView;
  ninthDigit: string | null;
  entries: EcuadorTaxCalendarEntryView[];
  guardrails: string[];
}

export interface EcuadorTaxEvidenceSummaryView {
  invoicing: {
    invoiceCount: number;
    statusBreakdown: Array<{ status: string; count: number }>;
    totalsByCurrency: Array<{
      currency: string;
      subtotalInCents: number;
      taxInCents: number;
      totalInCents: number;
      paidInCents: number;
      outstandingTotalInCents: number;
    }>;
    monthlyTotals: Array<{
      month: string;
      currency: string;
      invoiceCount: number;
      totalInCents: number;
      taxInCents: number;
    }>;
  };
  parties: {
    totalParties: number;
    completeParties: number;
    needsReviewParties: number;
    issueSummaries: Array<{ issue: string; count: number }>;
    incompletePartyIds: string[];
  };
  ecommerce: {
    status: 'not_connected_yet';
    notes: string[];
  };
}

export interface EcuadorTaxPeriodPreparationPacketView {
  tenantSlug: string;
  period: string;
  generatedAt: Date;
  taxpayerProfile: EcuadorTaxpayerProfileView;
  obligations: EcuadorTaxObligationView[];
  readinessStatus: EcuadorTaxReadinessStatus;
  evidenceSummary: EcuadorTaxEvidenceSummaryView;
  evidenceChecklist: string[];
  accountantHandoff: {
    recommended: boolean;
    reason: string;
    packetSummary: string;
  };
  blockedBy: string[];
  nextStep: string;
  guardrails: string[];
}
