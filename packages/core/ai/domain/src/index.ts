export type AiDomainKey = 'growth' | 'invoicing' | 'ecommerce';

export type AiAgentAvailability = 'ready' | 'planned';

export type AiAgentMode = 'suggestion' | 'guarded_execution';
export type AiToolAvailability = 'ready' | 'planned';
export type AiToolRiskLevel = 'low' | 'medium' | 'high';
export type AiToolActionKind = 'read' | 'draft' | 'propose' | 'execute';
export type AiToolAccessLevel = 'allowed' | 'approval_required' | 'blocked';

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

export interface AiToolDefinition {
  key: string;
  title: string;
  summary: string;
  domainKey: AiDomainKey;
  availability: AiToolAvailability;
  riskLevel: AiToolRiskLevel;
  actionKind: AiToolActionKind;
  requiresApproval: boolean;
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
