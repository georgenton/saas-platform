import { Injectable } from '@nestjs/common';
import { InvoiceElectronicEventRepository } from '@saas-platform/invoicing-application';
import {
  InvoiceElectronicEvent,
  InvoiceElectronicEventType,
} from '@saas-platform/invoicing-domain';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaInvoiceElectronicEventRepository
  implements InvoiceElectronicEventRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async save(event: InvoiceElectronicEvent): Promise<void> {
    const data = event.toPrimitives();

    await this.prisma.invoiceElectronicEvent.upsert({
      where: { id: data.id },
      update: {
        eventType: data.eventType,
        provider: data.provider,
        providerStatus: data.providerStatus,
        endpoint: data.endpoint,
        soapAction: data.soapAction,
        message: data.message,
        requestPayload: data.requestPayload,
        responsePayload: data.responsePayload,
        submissionReference: data.submissionReference,
        authorizationNumber: data.authorizationNumber,
        occurredAt: data.occurredAt,
      },
      create: {
        id: data.id,
        tenantId: data.tenantId,
        invoiceId: data.invoiceId,
        eventType: data.eventType,
        provider: data.provider,
        providerStatus: data.providerStatus,
        endpoint: data.endpoint,
        soapAction: data.soapAction,
        message: data.message,
        requestPayload: data.requestPayload,
        responsePayload: data.responsePayload,
        submissionReference: data.submissionReference,
        authorizationNumber: data.authorizationNumber,
        occurredAt: data.occurredAt,
      },
    });
  }

  async findByTenantIdAndInvoiceId(
    tenantId: string,
    invoiceId: string,
  ): Promise<InvoiceElectronicEvent[]> {
    const events = await this.prisma.invoiceElectronicEvent.findMany({
      where: {
        tenantId,
        invoiceId,
      },
      orderBy: [{ occurredAt: 'desc' }, { id: 'desc' }],
    });

    return events.map((event) =>
      InvoiceElectronicEvent.create({
        id: event.id,
        tenantId: event.tenantId,
        invoiceId: event.invoiceId,
        eventType: event.eventType as InvoiceElectronicEventType,
        provider: event.provider,
        providerStatus: event.providerStatus,
        endpoint: event.endpoint,
        soapAction: event.soapAction,
        message: event.message,
        requestPayload: event.requestPayload,
        responsePayload: event.responsePayload,
        submissionReference: event.submissionReference,
        authorizationNumber: event.authorizationNumber,
        occurredAt: event.occurredAt,
      }),
    );
  }
}
