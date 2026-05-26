import { AiMemoryRecord } from '@saas-platform/ai-domain';

const DAY_IN_MS = 1000 * 60 * 60 * 24;

export const AI_MEMORY_ARCHIVAL_POLICY_SUMMARY =
  'Operator notes are never auto-archived; working guarded-execution memory archives after 7 days; working approval memory archives after 14 days; durable automated memory archives after 45 days.';

export interface AiMemoryArchivalDecision {
  shouldArchive: boolean;
  ageInDays: number;
  reason: string | null;
}

export function getAiMemoryArchivalDecision(
  record: AiMemoryRecord,
  now: Date,
): AiMemoryArchivalDecision {
  if (record.status !== 'active') {
    return {
      shouldArchive: false,
      ageInDays: getAgeInDays(record.updatedAt, now),
      reason: null,
    };
  }

  if (record.sourceKind === 'operator_note') {
    return {
      shouldArchive: false,
      ageInDays: getAgeInDays(record.updatedAt, now),
      reason: null,
    };
  }

  const ageInDays = getAgeInDays(record.updatedAt, now);
  const thresholdInDays = getArchivalThresholdInDays(record);

  if (ageInDays < thresholdInDays) {
    return {
      shouldArchive: false,
      ageInDays,
      reason: null,
    };
  }

  return {
    shouldArchive: true,
    ageInDays,
    reason:
      record.freshness === 'working_memory'
        ? `${record.sourceKind} exceeded the ${thresholdInDays}-day working-memory retention window.`
        : `${record.sourceKind} exceeded the ${thresholdInDays}-day durable automated retention window.`,
  };
}

function getArchivalThresholdInDays(record: AiMemoryRecord): number {
  if (record.freshness === 'durable_memory') {
    return 45;
  }

  return record.sourceKind === 'guarded_execution_memory' ? 7 : 14;
}

function getAgeInDays(updatedAt: Date, now: Date): number {
  return Math.floor(
    Math.max(0, now.getTime() - updatedAt.getTime()) / DAY_IN_MS,
  );
}
