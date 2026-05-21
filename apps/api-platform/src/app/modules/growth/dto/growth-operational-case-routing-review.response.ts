import { ReviewTenantGrowthOperationalCaseRoutingResult } from '@saas-platform/growth-application';
import {
  GrowthOperationalCaseResponseDto,
  toGrowthOperationalCaseResponseDto,
} from './growth-operational-case.response';

export interface GrowthOperationalCaseRoutingReviewResponseDto {
  reviewedCount: number;
  updatedCount: number;
  escalationReviewCount: number;
  cases: GrowthOperationalCaseResponseDto[];
}

export const toGrowthOperationalCaseRoutingReviewResponseDto = (
  result: ReviewTenantGrowthOperationalCaseRoutingResult,
): GrowthOperationalCaseRoutingReviewResponseDto => ({
  reviewedCount: result.reviewedCount,
  updatedCount: result.updatedCount,
  escalationReviewCount: result.escalationReviewCount,
  cases: result.cases.map((entry) => toGrowthOperationalCaseResponseDto(entry)),
});
