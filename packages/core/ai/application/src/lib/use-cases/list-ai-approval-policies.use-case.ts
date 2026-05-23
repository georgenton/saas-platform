import { AiApprovalPolicyEntry } from '@saas-platform/ai-domain';
import { AI_APPROVAL_POLICY_REGISTRY } from '../support/ai-agent-catalog';

export class ListAiApprovalPoliciesUseCase {
  execute(): AiApprovalPolicyEntry[] {
    return AI_APPROVAL_POLICY_REGISTRY.map((entry) => ({ ...entry }));
  }
}
