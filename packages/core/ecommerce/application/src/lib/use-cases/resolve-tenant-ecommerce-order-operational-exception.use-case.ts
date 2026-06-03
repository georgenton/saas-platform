import {
  TenantEcommerceOrderOperationalExceptionResolutionView,
} from '@saas-platform/ecommerce-domain';
import { RecordTenantEcommerceOrderOperationalEventUseCase } from './record-tenant-ecommerce-order-operational-event.use-case';
import { RequestTenantEcommerceOrderOperationalExceptionPacketUseCase } from './request-tenant-ecommerce-order-operational-exception-packet.use-case';

export type ResolveTenantEcommerceOrderOperationalExceptionCommand = {
  resolutionSummary?: string;
  resolvedSignals?: string[];
  nextStep?: string;
};

export class ResolveTenantEcommerceOrderOperationalExceptionUseCase {
  constructor(
    private readonly requestTenantEcommerceOrderOperationalExceptionPacketUseCase: RequestTenantEcommerceOrderOperationalExceptionPacketUseCase,
    private readonly recordTenantEcommerceOrderOperationalEventUseCase: RecordTenantEcommerceOrderOperationalEventUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
    orderDraftId: string,
    command: ResolveTenantEcommerceOrderOperationalExceptionCommand = {},
  ): Promise<TenantEcommerceOrderOperationalExceptionResolutionView | null> {
    const packet =
      await this.requestTenantEcommerceOrderOperationalExceptionPacketUseCase.execute(
        tenantSlug,
        productEntityId,
        orderDraftId,
      );

    if (!packet) {
      return null;
    }

    const resolvedSignals =
      command.resolvedSignals && command.resolvedSignals.length > 0
        ? command.resolvedSignals
        : this.resolveSignalsFromPacket(packet.evidenceChecklist);
    const resolutionStatus =
      packet.severity === 'high' && resolvedSignals.length === 0
        ? 'blocked'
        : packet.severity === 'low'
          ? 'resolved'
          : 'needs_follow_up';
    const summary =
      command.resolutionSummary?.trim() ||
      `Resolución operativa registrada para ${packet.exceptionType}.`;
    const nextStep =
      command.nextStep?.trim() ||
      (resolutionStatus === 'resolved'
        ? 'Recargar operational review y health board para verificar cierre.'
        : 'Mantener seguimiento y volver a revisar el packet después de nueva evidencia.');
    const event =
      await this.recordTenantEcommerceOrderOperationalEventUseCase.execute(
        tenantSlug,
        productEntityId,
        orderDraftId,
        {
          eventType: 'operational_exception_resolution',
          sourceWorkspace: 'operational-exception-resolution',
          status: resolutionStatus,
          summary,
          payload: {
            exceptionType: packet.exceptionType,
            severity: packet.severity,
            resolvedSignals,
            nextStep,
          },
        },
      );

    if (!event) {
      return null;
    }

    return {
      tenantSlug,
      productEntityId,
      orderDraftId,
      generatedAt: this.nowProvider(),
      resolutionStatus,
      summary,
      resolvedSignals,
      event,
      nextStep,
      guardrails: [
        ...packet.guardrails,
        'La resolución sólo afecta señales operativas posteriores dentro del timeline; conservar evidencia externa.',
      ],
    };
  }

  private resolveSignalsFromPacket(evidenceChecklist: string[]): string[] {
    return evidenceChecklist
      .filter((entry) => entry.startsWith('Evidencia '))
      .map((entry) => entry.replace(/^Evidencia [^:]+: /, '').trim())
      .filter(Boolean);
  }
}
