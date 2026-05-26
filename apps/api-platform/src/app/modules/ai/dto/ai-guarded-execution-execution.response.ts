import { GrowthOperationalCaseRecord } from '@saas-platform/growth-application';
import { InvoiceDetailView } from '@saas-platform/invoicing-application';
import { Payment } from '@saas-platform/invoicing-domain';
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

export interface AiGuardedExecutionExecutionResponseDto {
  tenantSlug: string;
  agentKey: string;
  approvalRequestId: string;
  suggestionRunId: string;
  toolKey: string;
  targetKind: 'growth_operational_case' | 'invoice_payment';
  executedAt: string;
  summary: string;
  detail: string;
  operationalCase: GrowthOperationalCaseResponseDto | null;
  invoice: InvoiceDetailResponseDto | null;
  payment: PaymentResponseDto | null;
}

export function toAiGuardedExecutionExecutionResponseDto(input: {
  tenantSlug: string;
  agentKey: string;
  approvalRequestId: string;
  suggestionRunId: string;
  toolKey: string;
  targetKind: 'growth_operational_case' | 'invoice_payment';
  executedAt: Date;
  summary: string;
  detail: string;
  operationalCase?: GrowthOperationalCaseRecord | null;
  invoice?: InvoiceDetailView | null;
  payment?: Payment | null;
}): AiGuardedExecutionExecutionResponseDto {
  return {
    tenantSlug: input.tenantSlug,
    agentKey: input.agentKey,
    approvalRequestId: input.approvalRequestId,
    suggestionRunId: input.suggestionRunId,
    toolKey: input.toolKey,
    targetKind: input.targetKind,
    executedAt: input.executedAt.toISOString(),
    summary: input.summary,
    detail: input.detail,
    operationalCase: input.operationalCase
      ? toGrowthOperationalCaseResponseDto(input.operationalCase)
      : null,
    invoice: input.invoice ? toInvoiceDetailResponseDto(input.invoice) : null,
    payment: input.payment ? toPaymentResponseDto(input.payment) : null,
  };
}
