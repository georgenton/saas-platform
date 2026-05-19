import {
  TenantGrowthAssigneeWorkloadView,
  TenantGrowthAssignmentWorkloadView,
} from '@saas-platform/growth-application';

export interface GrowthAssignmentAssigneeWorkloadResponseDto {
  userId: string;
  displayName: string | null;
  email: string | null;
  openThreadCount: number;
  openWhatsappThreadCount: number;
  openManualThreadCount: number;
  openOpportunityCount: number;
  openOpportunityAmountInCents: number;
  wonOpportunityCount: number;
  lostOpportunityCount: number;
}

export interface GrowthAssignmentWorkloadResponseDto {
  tenantSlug: string;
  generatedAt: string;
  totals: {
    openThreadCount: number;
    unassignedOpenThreadCount: number;
    openOpportunityCount: number;
    unassignedOpenOpportunityCount: number;
    openOpportunityAmountInCents: number;
  };
  assignees: GrowthAssignmentAssigneeWorkloadResponseDto[];
}

const toAssigneeResponseDto = (
  assignee: TenantGrowthAssigneeWorkloadView,
): GrowthAssignmentAssigneeWorkloadResponseDto => ({
  userId: assignee.userId,
  displayName: assignee.displayName,
  email: assignee.email,
  openThreadCount: assignee.openThreadCount,
  openWhatsappThreadCount: assignee.openWhatsappThreadCount,
  openManualThreadCount: assignee.openManualThreadCount,
  openOpportunityCount: assignee.openOpportunityCount,
  openOpportunityAmountInCents: assignee.openOpportunityAmountInCents,
  wonOpportunityCount: assignee.wonOpportunityCount,
  lostOpportunityCount: assignee.lostOpportunityCount,
});

export const toGrowthAssignmentWorkloadResponseDto = (
  view: TenantGrowthAssignmentWorkloadView,
): GrowthAssignmentWorkloadResponseDto => ({
  tenantSlug: view.tenantSlug,
  generatedAt: view.generatedAt.toISOString(),
  totals: { ...view.totals },
  assignees: view.assignees.map((assignee) => toAssigneeResponseDto(assignee)),
});
