import { Injectable } from '@nestjs/common';
import { TaxComplianceEcommerceEvidenceRepository } from '@saas-platform/tax-compliance-application';
import { EcuadorTaxEcommerceEvidenceSummaryView } from '@saas-platform/tax-compliance-domain';
import { PrismaService } from '../prisma.service';

type EcommerceOrderDraftRow = {
  id: string;
  tenantSlug: string;
  productEntityId: string;
  status: string;
  orderLabel: string;
  invoicingReadinessStatus: string;
  updatedAt: Date;
};

type EcommerceOrderOperationalEventRow = {
  eventType: string;
  status: string;
  occurredAt: Date;
};

@Injectable()
export class PrismaTaxComplianceEcommerceEvidenceRepository
  implements TaxComplianceEcommerceEvidenceRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async summarizeTenantPeriod(command: {
    tenantSlug: string;
    period: string;
    generatedAt: Date;
  }): Promise<EcuadorTaxEcommerceEvidenceSummaryView> {
    const { start, end } = resolvePeriodRange(command.period);
    const [orders, events] = await Promise.all([
      this.orderDelegate.findMany({
        where: {
          tenantSlug: command.tenantSlug,
          updatedAt: {
            gte: start,
            lt: end,
          },
        },
        orderBy: [{ updatedAt: 'desc' }],
        take: 50,
      }),
      this.eventDelegate.findMany({
        where: {
          tenantSlug: command.tenantSlug,
          occurredAt: {
            gte: start,
            lt: end,
          },
        },
      }),
    ]);
    const orderRows = orders as EcommerceOrderDraftRow[];
    const eventRows = events as EcommerceOrderOperationalEventRow[];
    const readyToInvoiceCount = orderRows.filter(
      (order) => order.invoicingReadinessStatus === 'ready_to_invoice',
    ).length;
    const blockedCount = orderRows.filter(
      (order) => order.status === 'blocked',
    ).length;
    const needsFiscalDataCount = orderRows.filter(
      (order) => order.invoicingReadinessStatus !== 'ready_to_invoice',
    ).length;
    const confirmedPaymentEventCount = eventRows.filter(
      (event) =>
        event.eventType === 'payment_reconciliation' &&
        event.status === 'confirmed',
    ).length;
    const disputedPaymentEventCount = eventRows.filter(
      (event) =>
        event.eventType === 'payment_reconciliation' &&
        event.status === 'disputed',
    ).length;
    const deliveredEventCount = eventRows.filter(
      (event) =>
        event.eventType === 'post_sale_closeout' ||
        event.eventType === 'fulfillment_availability',
    ).length;
    const status =
      orderRows.length === 0
        ? 'no_activity'
        : blockedCount > 0 ||
            needsFiscalDataCount > 0 ||
            disputedPaymentEventCount > 0
          ? 'requires_review'
          : 'connected';

    return {
      tenantSlug: command.tenantSlug,
      period: command.period,
      generatedAt: command.generatedAt,
      status,
      orderCount: orderRows.length,
      readyToInvoiceCount,
      blockedCount,
      needsFiscalDataCount,
      confirmedPaymentEventCount,
      disputedPaymentEventCount,
      deliveredEventCount,
      orderHighlights: orderRows.slice(0, 10).map((order) => ({
        orderDraftId: order.id,
        productEntityId: order.productEntityId,
        orderLabel: order.orderLabel,
        invoicingReadinessStatus: order.invoicingReadinessStatus,
        status: order.status,
        updatedAt: order.updatedAt,
      })),
      notes: buildNotes({
        orderCount: orderRows.length,
        readyToInvoiceCount,
        blockedCount,
        needsFiscalDataCount,
        disputedPaymentEventCount,
      }),
    };
  }

  private get orderDelegate(): any {
    return (this.prisma as any).ecommerceOrderDraft;
  }

  private get eventDelegate(): any {
    return (this.prisma as any).ecommerceOrderOperationalEvent;
  }
}

function resolvePeriodRange(period: string): { start: Date; end: Date } {
  const [yearPart, monthPart] = period.split('-');
  const year = Number.parseInt(yearPart, 10);
  const month = Number.parseInt(monthPart, 10);

  if (!Number.isFinite(year) || !Number.isFinite(month)) {
    const currentYear = new Date().getUTCFullYear();
    return {
      start: new Date(Date.UTC(currentYear, 0, 1)),
      end: new Date(Date.UTC(currentYear + 1, 0, 1)),
    };
  }

  return {
    start: new Date(Date.UTC(year, month - 1, 1)),
    end: new Date(Date.UTC(year, month, 1)),
  };
}

function buildNotes(input: {
  orderCount: number;
  readyToInvoiceCount: number;
  blockedCount: number;
  needsFiscalDataCount: number;
  disputedPaymentEventCount: number;
}): string[] {
  if (input.orderCount === 0) {
    return ['No hay ordenes ecommerce actualizadas en este periodo.'];
  }

  return [
    `${input.orderCount} ordenes ecommerce aportan evidencia operativa del periodo.`,
    `${input.readyToInvoiceCount} ordenes estan listas para bridge de facturacion.`,
    input.blockedCount > 0
      ? `${input.blockedCount} ordenes ecommerce estan bloqueadas.`
      : null,
    input.needsFiscalDataCount > 0
      ? `${input.needsFiscalDataCount} ordenes requieren datos fiscales antes de declarar.`
      : null,
    input.disputedPaymentEventCount > 0
      ? `${input.disputedPaymentEventCount} eventos de cobro disputado requieren conciliacion.`
      : null,
  ].filter((note): note is string => note !== null);
}
