import { AiPromptRegistryEntry } from '@saas-platform/ai-domain';

export interface AiPromptRegistryResponseDto {
  key: string;
  version: string;
  agentKey: string;
  mode: 'suggestion' | 'guarded_execution';
  title: string;
  summary: string;
  objective: string;
  styleGuidance: string[];
  constraints: string[];
  suggestedOutputs: {
    key: string;
    label: string;
    description: string;
  }[];
}

export const toAiPromptRegistryResponseDto = (
  entry: AiPromptRegistryEntry,
): AiPromptRegistryResponseDto => ({
  ...entry,
  styleGuidance: [...entry.styleGuidance],
  constraints: [...entry.constraints],
  suggestedOutputs: entry.suggestedOutputs.map((output) => ({ ...output })),
});
