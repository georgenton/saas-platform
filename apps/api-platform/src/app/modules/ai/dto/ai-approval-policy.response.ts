import { AiApprovalPolicyEntry } from '@saas-platform/ai-domain';

export interface AiApprovalPolicyResponseDto {
  policyKey: string;
  agentKey: string;
  scope: 'suggestion_review';
  title: string;
  summary: string;
  reviewGuidance: string;
  approvalRequired: boolean;
}

export const toAiApprovalPolicyResponseDto = (
  entry: AiApprovalPolicyEntry,
): AiApprovalPolicyResponseDto => ({
  ...entry,
});
