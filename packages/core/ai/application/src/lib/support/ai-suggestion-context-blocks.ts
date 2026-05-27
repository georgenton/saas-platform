import {
  AiMemoryRetrieval,
  AiSuggestionContextBlock,
} from '@saas-platform/ai-domain';

const EMPTY_CONTEXT_BLOCK_BULLET =
  'No deterministic signals were available for this block yet.';

export function buildAiRetrievedMemoryContextBlocks(
  records: AiMemoryRetrieval['records'],
): AiSuggestionContextBlock[] {
  return records.map((entry) => ({
    key: `memory_${entry.id}`,
    title: `Memory: ${entry.title}`,
    detail: entry.summary,
    bullets: [
      entry.detail,
      `Scope: ${entry.scope}`,
      `Source: ${entry.sourceKind}`,
      `Freshness: ${entry.freshness}`,
      `Why included: ${entry.inclusionReason}`,
    ],
  }));
}

export function finalizeAiSuggestionContextBlocks(
  blocks: AiSuggestionContextBlock[],
): AiSuggestionContextBlock[] {
  return blocks.map((block) => ({
    ...block,
    bullets:
      block.bullets.length > 0
        ? block.bullets
        : [EMPTY_CONTEXT_BLOCK_BULLET],
  }));
}
