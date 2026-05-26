import { AiMemoryRetrieval } from '@saas-platform/ai-domain';
import {
  AiMemoryRetrievalResponseDto,
  toAiMemoryRetrievalResponseDto,
} from './ai-memory-record.response';

export interface AiRetrievalWorkspaceResponseDto {
  tenantSlug: string;
  generatedAt: string;
  counts: {
    totalAgents: number;
    agentsWithMemory: number;
    totalRetrievedRecords: number;
    uniqueRetrievedRecords: number;
  };
  agents: Array<{
    agentKey: string;
    title: string;
    domainKey: 'growth' | 'invoicing' | 'ecommerce';
    productKey: string;
    retrieval: AiMemoryRetrievalResponseDto;
  }>;
}

export const toAiRetrievalWorkspaceResponseDto = (input: {
  tenantSlug: string;
  generatedAt: Date;
  counts: AiRetrievalWorkspaceResponseDto['counts'];
  agents: Array<{
    agentKey: string;
    title: string;
    domainKey: 'growth' | 'invoicing' | 'ecommerce';
    productKey: string;
    retrieval: AiMemoryRetrieval;
  }>;
}): AiRetrievalWorkspaceResponseDto => ({
  tenantSlug: input.tenantSlug,
  generatedAt: input.generatedAt.toISOString(),
  counts: {
    ...input.counts,
  },
  agents: input.agents.map((entry) => ({
    agentKey: entry.agentKey,
    title: entry.title,
    domainKey: entry.domainKey,
    productKey: entry.productKey,
    retrieval: toAiMemoryRetrievalResponseDto(entry.retrieval),
  })),
});
