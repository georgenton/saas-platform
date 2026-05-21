import { AutoAssignTenantGrowthOperationalCasesResult } from '@saas-platform/growth-application';
import {
  GrowthOperationalCaseResponseDto,
  toGrowthOperationalCaseResponseDto,
} from './growth-operational-case.response';

export interface GrowthOperationalCaseAutoAssignmentResponseDto {
  policyKey: 'balanced' | 'owner_queue_first' | 'follow_up_first';
  candidateCount: number;
  reviewedCount: number;
  assignedCount: number;
  threadAssignmentCount: number;
  inheritedOwnerCount: number;
  fallbackAssignmentCount: number;
  cases: GrowthOperationalCaseResponseDto[];
}

export const toGrowthOperationalCaseAutoAssignmentResponseDto = (
  result: AutoAssignTenantGrowthOperationalCasesResult,
): GrowthOperationalCaseAutoAssignmentResponseDto => ({
  policyKey: result.policyKey,
  candidateCount: result.candidateCount,
  reviewedCount: result.reviewedCount,
  assignedCount: result.assignedCount,
  threadAssignmentCount: result.threadAssignmentCount,
  inheritedOwnerCount: result.inheritedOwnerCount,
  fallbackAssignmentCount: result.fallbackAssignmentCount,
  cases: result.cases.map((entry) => toGrowthOperationalCaseResponseDto(entry)),
});
