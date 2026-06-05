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

export interface PartyFiscalCleanupWorkspace {
  tenantSlug: string;
  generatedAt: Date;
  readinessStatus: 'ready' | 'needs_review' | 'blocked';
  summary: {
    totalParties: number;
    completeParties: number;
    needsReviewParties: number;
    duplicateGroupCount: number;
    criticalIssueCount: number;
  };
  priorityParties: Array<{
    id: string;
    displayName: string;
    roles: string[];
    taxpayerId: string | null;
    priority: 'critical' | 'high' | 'normal';
    missingFields: string[];
    reviewNotes: string[];
    suggestedAction: string;
  }>;
  duplicateGroups: Array<{
    key: string;
    reason: 'taxpayer_id' | 'email' | 'display_name';
    partyIds: string[];
    displayNames: string[];
    suggestedAction: string;
  }>;
  issueSummaries: PartyFiscalReadinessIssueSummary[];
  nextStep: string;
  guardrails: string[];
}

export interface PartyFiscalCleanupPacket {
  tenantSlug: string;
  partyId: string;
  generatedAt: Date;
  readinessStatus: 'ready' | 'needs_review' | 'blocked';
  partySnapshot: {
    id: string;
    displayName: string;
    roles: string[];
    taxpayerId: string | null;
    priority: 'critical' | 'high' | 'normal';
    missingFields: string[];
    reviewNotes: string[];
  };
  suggestedPayload: {
    taxpayerId: string | null;
    identificationType: string | null;
    fiscalAddress: string | null;
    email: string | null;
    taxpayerName: string;
  };
  duplicateWarnings: Array<{
    key: string;
    reason: 'taxpayer_id' | 'email' | 'display_name';
    partyIds: string[];
    displayNames: string[];
  }>;
  checklist: string[];
  nextStep: string;
  guardrails: string[];
}

export interface PartyFiscalCorrectionResult {
  tenantSlug: string;
  partyId: string;
  appliedAt: Date;
  status: 'applied' | 'needs_review';
  correctedParty: PartyFiscalReadinessPartySnapshot;
  remainingMissingFields: string[];
  reviewNotes: string[];
  nextStep: string;
  guardrails: string[];
}
