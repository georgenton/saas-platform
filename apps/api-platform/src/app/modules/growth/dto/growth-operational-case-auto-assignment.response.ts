import { AutoAssignTenantGrowthOperationalCasesResult } from '@saas-platform/growth-application';
import {
  GrowthOperationalCaseResponseDto,
  toGrowthOperationalCaseResponseDto,
} from './growth-operational-case.response';

export interface GrowthOperationalCaseAutoAssignmentResponseDto {
  candidateCount: number;
  reviewedCount: number;
  assignedCount: number;
  threadAssignmentCount: number;
  cases: GrowthOperationalCaseResponseDto[];
}

export const toGrowthOperationalCaseAutoAssignmentResponseDto = (
  result: AutoAssignTenantGrowthOperationalCasesResult,
): GrowthOperationalCaseAutoAssignmentResponseDto => ({
  candidateCount: result.candidateCount,
  reviewedCount: result.reviewedCount,
  assignedCount: result.assignedCount,
  threadAssignmentCount: result.threadAssignmentCount,
  cases: result.cases.map((entry) => toGrowthOperationalCaseResponseDto(entry)),
});
