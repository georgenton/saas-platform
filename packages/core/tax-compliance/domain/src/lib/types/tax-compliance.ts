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

export interface EcuadorTaxPeriodPreparationPacketView {
  tenantSlug: string;
  period: string;
  generatedAt: Date;
  taxpayerProfile: EcuadorTaxpayerProfileView;
  obligations: EcuadorTaxObligationView[];
  readinessStatus: EcuadorTaxReadinessStatus;
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
