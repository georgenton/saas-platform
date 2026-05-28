import { GrowthOperationalCaseRecord } from '@saas-platform/growth-application';
import { InvoiceDetailView } from '@saas-platform/invoicing-application';
import { Payment } from '@saas-platform/invoicing-domain';
import { TenantEcommerceLaunchPlanView } from '@saas-platform/ai-application';
import {
  GrowthOperationalCaseResponseDto,
  toGrowthOperationalCaseResponseDto,
} from '../../growth/dto/growth-operational-case.response';
import {
  InvoiceDetailResponseDto,
  toInvoiceDetailResponseDto,
} from '../../invoicing/dto/invoice-detail.response';
import {
  PaymentResponseDto,
  toPaymentResponseDto,
} from '../../invoicing/dto/payment.response';
import {
  AiEcommerceLaunchPlanResponseDto,
  toAiEcommerceLaunchPlanResponseDto,
} from './ai-ecommerce-launch-workspace.response';

export interface AiGuardedExecutionRollbackExecutionResponseDto {
  tenantSlug: string;
  agentKey: string;
  approvalRequestId: string;
  suggestionRunId: string;
  toolKey: string;
  targetKind:
    | 'growth_operational_case'
    | 'invoice_payment'
    | 'ecommerce_launch_plan';
  rolledBackAt: string;
  safeFallbackMode: 'suggestion_only';
  summary: string;
  detail: string;
  operationalCase: GrowthOperationalCaseResponseDto | null;
  invoice: InvoiceDetailResponseDto | null;
  payment: PaymentResponseDto | null;
  launchPlan: AiEcommerceLaunchPlanResponseDto | null;
}

export function toAiGuardedExecutionRollbackExecutionResponseDto(input: {
  tenantSlug: string;
  agentKey: string;
  approvalRequestId: string;
  suggestionRunId: string;
  toolKey: string;
  targetKind:
    | 'growth_operational_case'
    | 'invoice_payment'
    | 'ecommerce_launch_plan';
  rolledBackAt: Date;
  summary: string;
  detail: string;
  operationalCase?: GrowthOperationalCaseRecord | null;
  invoice?: InvoiceDetailView | null;
  payment?: Payment | null;
  launchPlan?: TenantEcommerceLaunchPlanView | null;
}): AiGuardedExecutionRollbackExecutionResponseDto {
  return {
    tenantSlug: input.tenantSlug,
    agentKey: input.agentKey,
    approvalRequestId: input.approvalRequestId,
    suggestionRunId: input.suggestionRunId,
    toolKey: input.toolKey,
    targetKind: input.targetKind,
    rolledBackAt: input.rolledBackAt.toISOString(),
    safeFallbackMode: 'suggestion_only',
    summary: input.summary,
    detail: input.detail,
    operationalCase: input.operationalCase
      ? toGrowthOperationalCaseResponseDto(input.operationalCase)
      : null,
    invoice: input.invoice ? toInvoiceDetailResponseDto(input.invoice) : null,
    payment: input.payment ? toPaymentResponseDto(input.payment) : null,
    launchPlan: input.launchPlan
      ? toAiEcommerceLaunchPlanResponseDto(input.launchPlan)
      : null,
  };
}
