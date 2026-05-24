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

export interface AiSuggestionContextBlock {
  key: string;
  title: string;
  detail: string;
  bullets: string[];
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
