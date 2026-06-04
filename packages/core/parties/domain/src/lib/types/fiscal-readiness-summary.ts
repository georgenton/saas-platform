export interface PartyFiscalReadinessRoleSummary {
  role: string;
  totalParties: number;
  completeParties: number;
  needsReviewParties: number;
}

export interface PartyFiscalReadinessIssueSummary {
  issue: string;
  count: number;
}

export interface PartyFiscalReadinessPartySnapshot {
  id: string;
  displayName: string;
  roles: string[];
  taxpayerId: string | null;
  identificationType: string | null;
  fiscalAddress: string | null;
  email: string | null;
  completenessStatus: string;
  missingFields: string[];
  reviewNotes: string[];
}

export interface PartyFiscalReadinessSummary {
  tenantSlug: string;
  generatedAt: Date;
  totalParties: number;
  completeParties: number;
  needsReviewParties: number;
  roleSummaries: PartyFiscalReadinessRoleSummary[];
  issueSummaries: PartyFiscalReadinessIssueSummary[];
  incompleteParties: PartyFiscalReadinessPartySnapshot[];
  guardrails: string[];
}
