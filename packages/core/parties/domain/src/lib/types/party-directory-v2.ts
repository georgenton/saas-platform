import { PartyFiscalReadinessIssueSummary } from './fiscal-readiness-summary';

export type PartyDirectoryV2ReadinessStatus =
  | 'ready'
  | 'needs_review'
  | 'blocked';
export type PartyDirectoryV2DuplicateReason =
  | 'taxpayer_id'
  | 'email'
  | 'display_name';

export interface PartyDirectoryV2Snapshot {
  id: string;
  displayName: string;
  roles: string[];
  sourceContext: string;
  taxpayerId: string | null;
  identificationType: string | null;
  fiscalAddress: string | null;
  email: string | null;
  completenessStatus: string;
  missingFields: string[];
  reviewNotes: string[];
  linkedProducts: string[];
  updatedAt: Date;
}

export interface PartyDirectoryCoreV2Workspace {
  tenantSlug: string;
  generatedAt: Date;
  readinessStatus: PartyDirectoryV2ReadinessStatus;
  summary: {
    totalParties: number;
    completeParties: number;
    needsReviewParties: number;
    customerCount: number;
    supplierCount: number;
    linkedProductCount: number;
  };
  parties: PartyDirectoryV2Snapshot[];
  nextStep: string;
  guardrails: string[];
}

export interface PartyFiscalIdentityProfileWorkspace {
  tenantSlug: string;
  generatedAt: Date;
  readinessStatus: PartyDirectoryV2ReadinessStatus;
  summary: {
    totalParties: number;
    completeProfiles: number;
    needsReviewProfiles: number;
    missingTaxpayerIdCount: number;
    missingIdentificationTypeCount: number;
    missingFiscalAddressCount: number;
    missingEmailCount: number;
  };
  profiles: Array<{
    partyId: string;
    displayName: string;
    taxpayerId: string | null;
    taxpayerName: string;
    identificationType: string | null;
    fiscalAddress: string | null;
    email: string | null;
    status: string;
    missingFields: string[];
    reviewNotes: string[];
  }>;
  issueSummaries: PartyFiscalReadinessIssueSummary[];
  nextStep: string;
  guardrails: string[];
}

export interface PartyProductRoleBridgeWorkspace {
  tenantSlug: string;
  generatedAt: Date;
  readinessStatus: PartyDirectoryV2ReadinessStatus;
  roleSummaries: Array<{
    role: string;
    totalParties: number;
    linkedProducts: string[];
    missingFiscalProfileCount: number;
  }>;
  productLinks: Array<{
    productKey: string;
    role: string;
    partyIds: string[];
    readinessImpact: string;
  }>;
  nextStep: string;
  guardrails: string[];
}

export interface PartyDuplicateMergeReadinessWorkspace {
  tenantSlug: string;
  generatedAt: Date;
  readinessStatus: PartyDirectoryV2ReadinessStatus;
  summary: {
    duplicateGroupCount: number;
    affectedPartyCount: number;
    blockingGroupCount: number;
  };
  duplicateGroups: Array<{
    key: string;
    reason: PartyDirectoryV2DuplicateReason;
    partyIds: string[];
    displayNames: string[];
    suggestedSurvivorPartyId: string | null;
    mergeRisk: 'high' | 'medium' | 'low';
    checklist: string[];
  }>;
  nextStep: string;
  guardrails: string[];
}

export interface PartySupplierCustomerFiscalReadinessWorkspace {
  tenantSlug: string;
  generatedAt: Date;
  readinessStatus: PartyDirectoryV2ReadinessStatus;
  summary: {
    customerCount: number;
    supplierCount: number;
    readyForInvoicingCount: number;
    readyForTaxComplianceCount: number;
    blockedForDeclarationsCount: number;
  };
  customerReadiness: PartyDirectoryV2Snapshot[];
  supplierReadiness: PartyDirectoryV2Snapshot[];
  nextStep: string;
  guardrails: string[];
}

export interface PartiesProductCloseoutPack {
  tenantSlug: string;
  generatedAt: Date;
  readinessStatus: PartyDirectoryV2ReadinessStatus;
  directoryCore: PartyDirectoryCoreV2Workspace['summary'];
  fiscalIdentity: PartyFiscalIdentityProfileWorkspace['summary'];
  productRoleBridge: PartyProductRoleBridgeWorkspace['roleSummaries'];
  duplicateMerge: PartyDuplicateMergeReadinessWorkspace['summary'];
  supplierCustomerReadiness: PartySupplierCustomerFiscalReadinessWorkspace['summary'];
  acceptanceChecklist: Array<{
    item: string;
    status: 'passed' | 'needs_review' | 'blocked';
    evidence: string;
  }>;
  recommendedNextProduct:
    | 'tax-compliance-hardening'
    | 'accounting-advanced-discovery';
  nextStep: string;
  guardrails: string[];
}
