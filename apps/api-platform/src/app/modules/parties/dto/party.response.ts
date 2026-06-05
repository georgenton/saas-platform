import {
  Party,
  PartyFiscalCorrectionResult,
  PartyFiscalCleanupPacket,
  PartyFiscalCleanupWorkspace,
  PartyFiscalReadinessSummary,
} from '@saas-platform/parties-domain';

export interface PartyResponseDto {
  id: string;
  tenantId: string;
  displayName: string;
  email: string | null;
  taxId: string | null;
  identificationType: string | null;
  identification: string | null;
  billingAddress: string | null;
  roles: string[];
  kind: string;
  sourceContext: string;
  fiscalProfile: PartyFiscalProfileResponseDto | null;
  createdAt: string;
  updatedAt: string;
}

export interface PartyFiscalProfileResponseDto {
  country: string;
  taxpayerId: string | null;
  taxpayerName: string;
  identificationType: string | null;
  fiscalAddress: string | null;
  email: string | null;
  roles: string[];
  completenessStatus: string;
  missingFields: string[];
  reviewNotes: string[];
}

export interface PartyFiscalReadinessSummaryResponseDto {
  tenantSlug: string;
  generatedAt: string;
  totalParties: number;
  completeParties: number;
  needsReviewParties: number;
  roleSummaries: Array<{
    role: string;
    totalParties: number;
    completeParties: number;
    needsReviewParties: number;
  }>;
  issueSummaries: Array<{
    issue: string;
    count: number;
  }>;
  incompleteParties: Array<{
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
  }>;
  guardrails: string[];
}

export interface PartyFiscalCleanupWorkspaceResponseDto {
  tenantSlug: string;
  generatedAt: string;
  readinessStatus: string;
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
    priority: string;
    missingFields: string[];
    reviewNotes: string[];
    suggestedAction: string;
  }>;
  duplicateGroups: Array<{
    key: string;
    reason: string;
    partyIds: string[];
    displayNames: string[];
    suggestedAction: string;
  }>;
  issueSummaries: Array<{
    issue: string;
    count: number;
  }>;
  nextStep: string;
  guardrails: string[];
}

export interface PartyFiscalCleanupPacketResponseDto {
  tenantSlug: string;
  partyId: string;
  generatedAt: string;
  readinessStatus: string;
  partySnapshot: {
    id: string;
    displayName: string;
    roles: string[];
    taxpayerId: string | null;
    priority: string;
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
    reason: string;
    partyIds: string[];
    displayNames: string[];
  }>;
  checklist: string[];
  nextStep: string;
  guardrails: string[];
}

export interface PartyFiscalCorrectionResultResponseDto {
  tenantSlug: string;
  partyId: string;
  appliedAt: string;
  status: string;
  correctedParty: {
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
  };
  remainingMissingFields: string[];
  reviewNotes: string[];
  nextStep: string;
  guardrails: string[];
}

export const toPartyResponseDto = (party: Party): PartyResponseDto => {
  const data = party.toPrimitives();

  return {
    id: data.id,
    tenantId: data.tenantId,
    displayName: data.displayName,
    email: data.email ?? null,
    taxId: data.taxId ?? null,
    identificationType: data.identificationType ?? null,
    identification: data.identification ?? null,
    billingAddress: data.billingAddress ?? null,
    roles: [...data.roles],
    kind: data.kind,
    sourceContext: data.sourceContext,
    fiscalProfile: data.fiscalProfile
      ? {
          country: data.fiscalProfile.country,
          taxpayerId: data.fiscalProfile.taxpayerId,
          taxpayerName: data.fiscalProfile.taxpayerName,
          identificationType: data.fiscalProfile.identificationType,
          fiscalAddress: data.fiscalProfile.fiscalAddress,
          email: data.fiscalProfile.email,
          roles: [...data.fiscalProfile.roles],
          completenessStatus: data.fiscalProfile.completenessStatus,
          missingFields: [...data.fiscalProfile.missingFields],
          reviewNotes: [...data.fiscalProfile.reviewNotes],
        }
      : null,
    createdAt: data.createdAt.toISOString(),
    updatedAt: data.updatedAt.toISOString(),
  };
};

export const toPartyFiscalReadinessSummaryResponseDto = (
  summary: PartyFiscalReadinessSummary,
): PartyFiscalReadinessSummaryResponseDto => ({
  tenantSlug: summary.tenantSlug,
  generatedAt: summary.generatedAt.toISOString(),
  totalParties: summary.totalParties,
  completeParties: summary.completeParties,
  needsReviewParties: summary.needsReviewParties,
  roleSummaries: summary.roleSummaries.map((roleSummary) => ({
    role: roleSummary.role,
    totalParties: roleSummary.totalParties,
    completeParties: roleSummary.completeParties,
    needsReviewParties: roleSummary.needsReviewParties,
  })),
  issueSummaries: summary.issueSummaries.map((issueSummary) => ({
    issue: issueSummary.issue,
    count: issueSummary.count,
  })),
  incompleteParties: summary.incompleteParties.map((party) => ({
    id: party.id,
    displayName: party.displayName,
    roles: [...party.roles],
    taxpayerId: party.taxpayerId,
    identificationType: party.identificationType,
    fiscalAddress: party.fiscalAddress,
    email: party.email,
    completenessStatus: party.completenessStatus,
    missingFields: [...party.missingFields],
    reviewNotes: [...party.reviewNotes],
  })),
  guardrails: [...summary.guardrails],
});

export const toPartyFiscalCleanupWorkspaceResponseDto = (
  workspace: PartyFiscalCleanupWorkspace,
): PartyFiscalCleanupWorkspaceResponseDto => ({
  tenantSlug: workspace.tenantSlug,
  generatedAt: workspace.generatedAt.toISOString(),
  readinessStatus: workspace.readinessStatus,
  summary: { ...workspace.summary },
  priorityParties: workspace.priorityParties.map((party) => ({
    ...party,
    roles: [...party.roles],
    missingFields: [...party.missingFields],
    reviewNotes: [...party.reviewNotes],
  })),
  duplicateGroups: workspace.duplicateGroups.map((group) => ({
    ...group,
    partyIds: [...group.partyIds],
    displayNames: [...group.displayNames],
  })),
  issueSummaries: workspace.issueSummaries.map((issueSummary) => ({
    ...issueSummary,
  })),
  nextStep: workspace.nextStep,
  guardrails: [...workspace.guardrails],
});

export const toPartyFiscalCleanupPacketResponseDto = (
  packet: PartyFiscalCleanupPacket,
): PartyFiscalCleanupPacketResponseDto => ({
  tenantSlug: packet.tenantSlug,
  partyId: packet.partyId,
  generatedAt: packet.generatedAt.toISOString(),
  readinessStatus: packet.readinessStatus,
  partySnapshot: {
    ...packet.partySnapshot,
    roles: [...packet.partySnapshot.roles],
    missingFields: [...packet.partySnapshot.missingFields],
    reviewNotes: [...packet.partySnapshot.reviewNotes],
  },
  suggestedPayload: { ...packet.suggestedPayload },
  duplicateWarnings: packet.duplicateWarnings.map((warning) => ({
    ...warning,
    partyIds: [...warning.partyIds],
    displayNames: [...warning.displayNames],
  })),
  checklist: [...packet.checklist],
  nextStep: packet.nextStep,
  guardrails: [...packet.guardrails],
});

export const toPartyFiscalCorrectionResultResponseDto = (
  result: PartyFiscalCorrectionResult,
): PartyFiscalCorrectionResultResponseDto => ({
  tenantSlug: result.tenantSlug,
  partyId: result.partyId,
  appliedAt: result.appliedAt.toISOString(),
  status: result.status,
  correctedParty: {
    ...result.correctedParty,
    roles: [...result.correctedParty.roles],
    missingFields: [...result.correctedParty.missingFields],
    reviewNotes: [...result.correctedParty.reviewNotes],
  },
  remainingMissingFields: [...result.remainingMissingFields],
  reviewNotes: [...result.reviewNotes],
  nextStep: result.nextStep,
  guardrails: [...result.guardrails],
});
