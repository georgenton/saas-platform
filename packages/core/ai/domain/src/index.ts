export type AiDomainKey = 'growth' | 'invoicing' | 'ecommerce';

export type AiAgentAvailability = 'ready' | 'planned';

export type AiAgentMode = 'suggestion' | 'guarded_execution';
export type AiToolAvailability = 'ready' | 'planned';
export type AiToolRiskLevel = 'low' | 'medium' | 'high';
export type AiToolActionKind = 'read' | 'draft' | 'propose' | 'execute';
export type AiToolAccessLevel = 'allowed' | 'approval_required' | 'blocked';
export type AiToolExecutionMode =
  | 'suggestion_only'
  | 'guarded_execution_planned';
export type AiToolStateMutation = 'none' | 'planned';
export type AiToolExternalSideEffects = 'none' | 'planned';
export type AiApprovalScope = 'suggestion_review';
export type AiApprovalRequestStatus = 'pending' | 'approved' | 'rejected';
export type AiSuggestionRunApprovalStatus =
  | 'not_requested'
  | AiApprovalRequestStatus;
export type AiGuardedExecutionEventType = 'executed' | 'rolled_back';
export type AiGuardedExecutionTargetKind =
  | 'growth_operational_case'
  | 'invoice'
  | 'ecommerce_launch_plan';
export type AiGuardedExecutionOperatingLane =
  | 'operational_case_assignment_lane'
  | 'single_record_execution_lane';
export type AiGuardedExecutionBlastRadius =
  | 'single_record'
  | 'single_queue_lane';
export type AiGuardedExecutionSafeFallbackMode =
  | 'suggestion_only'
  | 'suggestion_only_with_manual_assignment';
export type AiGuardedExecutionPilotType =
  | 'human_gate_then_execute'
  | 'shadow_review'
  | 'not_available';
export type AiMemoryRecordScope = 'tenant' | 'domain' | 'agent';
export type AiMemoryRecordStatus = 'active' | 'inactive';
export type AiMemoryRecordSourceKind =
  | 'operator_note'
  | 'approval_memory'
  | 'guarded_execution_memory';
export type AiMemoryRecordFreshness = 'working_memory' | 'durable_memory';

export interface AiAgentCatalogEntry {
  key: string;
  title: string;
  summary: string;
  domainKey: AiDomainKey;
  productKey: string;
  availability: AiAgentAvailability;
  defaultMode: AiAgentMode;
  supportedSurfaceKeys: string[];
}

export interface AiSuggestionOutputDescriptor {
  key: string;
  label: string;
  description: string;
}

export interface AiToolInputContract {
  sourceSurfaceKeys: string[];
  primaryPayload: string;
  requiredContext: string[];
}

export interface AiToolOutputContract {
  primaryArtifact: string;
  suggestedOutputKeys: string[];
  humanReviewFocus: string[];
}

export interface AiToolExecutionBoundary {
  executionMode: AiToolExecutionMode;
  stateMutation: AiToolStateMutation;
  externalSideEffects: AiToolExternalSideEffects;
  reviewRequirement: string;
  blockedCapabilities: string[];
}

export interface AiToolDefinition {
  key: string;
  title: string;
  summary: string;
  domainKey: AiDomainKey;
  availability: AiToolAvailability;
  riskLevel: AiToolRiskLevel;
  actionKind: AiToolActionKind;
  requiresApproval: boolean;
  inputContract: AiToolInputContract;
  outputContract: AiToolOutputContract;
  executionBoundary: AiToolExecutionBoundary;
}

export interface AiAgentToolAccessEntry {
  agentKey: string;
  toolKey: string;
  accessLevel: AiToolAccessLevel;
  rationale: string;
}

export interface AiPromptRegistryEntry {
  key: string;
  version: string;
  agentKey: string;
  mode: 'suggestion' | 'guarded_execution';
  title: string;
  summary: string;
  objective: string;
  styleGuidance: string[];
  constraints: string[];
  suggestedOutputs: AiSuggestionOutputDescriptor[];
}

export interface AiApprovalPolicyEntry {
  policyKey: string;
  agentKey: string;
  scope: AiApprovalScope;
  title: string;
  summary: string;
  reviewGuidance: string;
  approvalRequired: boolean;
}

export interface AiOperatingModelAgentPromptPackReference {
  key: string;
  version: string;
  mode: 'suggestion' | 'guarded_execution';
  title: string;
  summary: string;
  objective: string;
}

export interface AiOperatingModelAgentPrimarySurfaceReference {
  key: string;
  title: string;
  sourceContractKey: string;
}

export interface AiOperatingModelAgentApprovalPolicyReference {
  policyKey: string;
  agentKey: string;
  scope: AiApprovalScope;
  title: string;
  summary: string;
  reviewGuidance: string;
  approvalRequired: boolean;
}

export interface AiOperatingModelAgentToolAccessEntry {
  tool: AiToolDefinition;
  accessLevel: AiToolAccessLevel;
  rationale: string;
}

export interface AiOperatingModelAgentHandoffContract {
  requestApprovalRationale: string;
  reviewNotes: {
    approved: string;
    rejected: string;
  };
}

export interface AiGuardedExecutionCandidateDescriptor {
  toolKey: string;
  title: string;
  targetKind: AiGuardedExecutionTargetKind;
  operatingLane: AiGuardedExecutionOperatingLane;
  blastRadius: AiGuardedExecutionBlastRadius;
  safeFallbackMode: AiGuardedExecutionSafeFallbackMode;
  preferredPilotTypeWhenReady: Exclude<
    AiGuardedExecutionPilotType,
    'not_available'
  >;
  targetSelectionLabel: string;
  emptyTargetSelectionLabel: string;
  executeActionLabel: string;
  rollbackActionLabel: string;
}

export interface AiOperatingModelAgentEntry {
  agent: AiAgentCatalogEntry;
  requiredPermissionKey: string;
  primarySurface: AiOperatingModelAgentPrimarySurfaceReference;
  promptPack: AiOperatingModelAgentPromptPackReference;
  approvalPolicies: AiOperatingModelAgentApprovalPolicyReference[];
  approvalPolicyKeys: string[];
  toolAccess: AiOperatingModelAgentToolAccessEntry[];
  handoffContract: AiOperatingModelAgentHandoffContract;
  guardedExecutionCandidateToolKey: string | null;
  guardedExecutionCandidate: AiGuardedExecutionCandidateDescriptor | null;
}

export interface AiOperatingModelManifest {
  version: string;
  agents: AiOperatingModelAgentEntry[];
  counts: {
    totalAgents: number;
    readyAgents: number;
    plannedAgents: number;
    agentsWithApprovalPolicies: number;
    agentsWithGuardedExecutionCandidate: number;
    totalToolAccessEntries: number;
    approvalRequiredToolAccessEntries: number;
    blockedToolAccessEntries: number;
  };
}

export interface AiSuggestionContextBlock {
  key: string;
  title: string;
  detail: string;
  bullets: string[];
}

export interface CreateAiMemoryRecordCommand {
  tenantId: string;
  tenantSlug: string;
  scope: AiMemoryRecordScope;
  domainKey: AiDomainKey | null;
  agentKey: string | null;
  sourceKind: AiMemoryRecordSourceKind;
  freshness: AiMemoryRecordFreshness;
  title: string;
  summary: string;
  detail: string;
  tags: string[];
  status: AiMemoryRecordStatus;
  createdByUserId: string | null;
  createdByEmail: string | null;
}

export interface AiMemoryRecord extends CreateAiMemoryRecordCommand {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AiRetrievedMemoryRecord {
  id: string;
  scope: AiMemoryRecordScope;
  domainKey: AiDomainKey | null;
  agentKey: string | null;
  sourceKind: AiMemoryRecordSourceKind;
  freshness: AiMemoryRecordFreshness;
  title: string;
  summary: string;
  detail: string;
  tags: string[];
  lastUpdatedAt: Date;
  inclusionReason: string;
}

export interface AiMemoryRetrieval {
  retrievedAt: Date;
  recordCount: number;
  policy: {
    version: 'v1';
    limit: number;
    suppressedDuplicateCount: number;
    archivedRecordCount: number;
    prioritizedRecordIds: string[];
    archivalSummary: string;
    rankingSummary: string;
  };
  records: AiRetrievedMemoryRecord[];
  notes: string[];
}

export interface AiMemoryRecordUsageReference {
  suggestionRunId: string;
  agentKey: string;
  surfaceKey: string;
  sourceContractKey: string;
  promptPackKey: string;
  promptPackVersion: string;
  generatedAt: Date;
  createdAt: Date;
  requestedByUserId: string;
  requestedByEmail: string | null;
  summary: string;
  memoryScope: AiMemoryRecordScope;
  memoryInclusionReason: string | null;
}

export interface AiMemoryRecordProvenance {
  usageCount: number;
  agentsUsingCount: number;
  latestUsedAt: Date | null;
  recentSuggestionRuns: AiMemoryRecordUsageReference[];
  notes: string[];
}

export interface AiMemoryRecordDetailView {
  record: AiMemoryRecord;
  provenance: AiMemoryRecordProvenance;
}

export interface TenantAiSuggestionEnvelope {
  tenantSlug: string;
  generatedAt: Date;
  mode: 'suggestion';
  agent: AiAgentCatalogEntry;
  surface: {
    key: string;
    title: string;
    sourceContractKey: string;
    sourceGeneratedAt: Date;
  };
  promptPack: AiPromptRegistryEntry;
  toolAccess: {
    tool: AiToolDefinition;
    accessLevel: AiToolAccessLevel;
    rationale: string;
  }[];
  contextBlocks: AiSuggestionContextBlock[];
  retrieval?: AiMemoryRetrieval;
}

export type AiSuggestionRunStatus = 'prepared';

export interface CreateAiSuggestionRunCommand {
  tenantId: string;
  tenantSlug: string;
  agentKey: string;
  mode: 'suggestion';
  status: AiSuggestionRunStatus;
  surfaceKey: string;
  sourceContractKey: string;
  sourceGeneratedAt: Date;
  promptPackKey: string;
  promptPackVersion: string;
  generatedAt: Date;
  requestedByUserId: string;
  requestedByEmail: string | null;
  summary: string;
  suggestedOutputKeys: string[];
  envelope: TenantAiSuggestionEnvelope;
}

export interface AiSuggestionRunRecord extends CreateAiSuggestionRunCommand {
  id: string;
  createdAt: Date;
}

export interface AiSuggestionRunApprovalSummary {
  status: AiSuggestionRunApprovalStatus;
  totalRequests: number;
  latestRequestId: string | null;
  latestPolicyKey: string | null;
  latestRequestedAt: Date | null;
  latestReviewedAt: Date | null;
}

export interface AiSuggestionRunHistoryEntry extends AiSuggestionRunRecord {
  approvalSummary: AiSuggestionRunApprovalSummary;
}

export interface AiSuggestionRunDetailView extends AiSuggestionRunHistoryEntry {
  approvalRequests: AiApprovalRequestRecord[];
}

export interface CreateAiApprovalRequestCommand {
  tenantId: string;
  tenantSlug: string;
  agentKey: string;
  policyKey: string;
  scope: AiApprovalScope;
  suggestionRunId: string;
  requestedByUserId: string;
  requestedByEmail: string | null;
  rationale: string | null;
  summary: string;
  status: 'pending';
}

export interface ReviewAiApprovalRequestCommand {
  requestId: string;
  status: Exclude<AiApprovalRequestStatus, 'pending'>;
  reviewedByUserId: string;
  reviewedByEmail: string | null;
  reviewNote: string | null;
}

export interface AiApprovalRequestRecord {
  id: string;
  tenantId: string;
  tenantSlug: string;
  agentKey: string;
  policyKey: string;
  scope: AiApprovalScope;
  suggestionRunId: string;
  requestedByUserId: string;
  requestedByEmail: string | null;
  rationale: string | null;
  summary: string;
  status: AiApprovalRequestStatus;
  reviewedAt: Date | null;
  reviewedByUserId: string | null;
  reviewedByEmail: string | null;
  reviewNote: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAiGuardedExecutionEventCommand {
  tenantId: string;
  tenantSlug: string;
  agentKey: string;
  eventType: AiGuardedExecutionEventType;
  approvalRequestId: string;
  suggestionRunId: string;
  toolKey: string;
  caseId: string;
  safeFallbackMode: 'suggestion_only' | null;
  summary: string;
  detail: string;
  occurredAt: Date;
  createdByUserId: string | null;
  createdByEmail: string | null;
}

export interface AiGuardedExecutionEventRecord
  extends CreateAiGuardedExecutionEventCommand {
  id: string;
  createdAt: Date;
}
