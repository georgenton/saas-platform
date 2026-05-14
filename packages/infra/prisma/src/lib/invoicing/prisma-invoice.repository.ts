import { Injectable } from '@nestjs/common';
import { InvoiceRepository } from '@saas-platform/invoicing-application';
import {
  BuyerIdentificationType,
  InvoiceElectronicStatus,
  Invoice,
  InvoiceStatus,
} from '@saas-platform/invoicing-domain';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaInvoiceRepository implements InvoiceRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(invoice: Invoice): Promise<void> {
    const data = invoice.toPrimitives();
    const updateData: any = {
      customerId: data.customerId,
      number: data.number,
      documentCode: data.documentCode,
      establishmentCode: data.establishmentCode,
      emissionPointCode: data.emissionPointCode,
      sequenceNumber: data.sequenceNumber,
      modifiedDocumentId: data.modifiedDocumentId ?? null,
      modifiedDocumentNumber: data.modifiedDocumentNumber ?? null,
      modifiedDocumentIssuedAt: data.modifiedDocumentIssuedAt ?? null,
      modificationReason: data.modificationReason ?? null,
      shipmentReason: data.shipmentReason ?? null,
      shipmentStartAt: data.shipmentStartAt ?? null,
      shipmentEndAt: data.shipmentEndAt ?? null,
      departureAddress: data.departureAddress ?? null,
      arrivalAddress: data.arrivalAddress ?? null,
      carrierName: data.carrierName ?? null,
      carrierIdentificationType: data.carrierIdentificationType ?? null,
      carrierIdentification: data.carrierIdentification ?? null,
      vehiclePlate: data.vehiclePlate ?? null,
      destinationRoute: data.destinationRoute ?? null,
      buyerIdentificationType: data.buyerIdentificationType ?? null,
      buyerIdentification: data.buyerIdentification ?? null,
      buyerName: data.buyerName ?? null,
      buyerAddress: data.buyerAddress ?? null,
      electronicStatus: data.electronicStatus ?? null,
      accessKey: data.accessKey ?? null,
      authorizationNumber: data.authorizationNumber ?? null,
      authorizedAt: data.authorizedAt ?? null,
      electronicStatusMessage: data.electronicStatusMessage ?? null,
      signedAt: data.signedAt ?? null,
      submittedAt: data.submittedAt ?? null,
      submissionReference: data.submissionReference ?? null,
      status: data.status,
      currency: data.currency,
      issuedAt: data.issuedAt,
      dueAt: data.dueAt,
      notes: data.notes,
      updatedAt: data.updatedAt,
    };
    const createData: any = {
      id: data.id,
      tenantId: data.tenantId,
      customerId: data.customerId,
      number: data.number,
      documentCode: data.documentCode,
      establishmentCode: data.establishmentCode,
      emissionPointCode: data.emissionPointCode,
      sequenceNumber: data.sequenceNumber,
      modifiedDocumentId: data.modifiedDocumentId ?? null,
      modifiedDocumentNumber: data.modifiedDocumentNumber ?? null,
      modifiedDocumentIssuedAt: data.modifiedDocumentIssuedAt ?? null,
      modificationReason: data.modificationReason ?? null,
      shipmentReason: data.shipmentReason ?? null,
      shipmentStartAt: data.shipmentStartAt ?? null,
      shipmentEndAt: data.shipmentEndAt ?? null,
      departureAddress: data.departureAddress ?? null,
      arrivalAddress: data.arrivalAddress ?? null,
      carrierName: data.carrierName ?? null,
      carrierIdentificationType: data.carrierIdentificationType ?? null,
      carrierIdentification: data.carrierIdentification ?? null,
      vehiclePlate: data.vehiclePlate ?? null,
      destinationRoute: data.destinationRoute ?? null,
      buyerIdentificationType: data.buyerIdentificationType ?? null,
      buyerIdentification: data.buyerIdentification ?? null,
      buyerName: data.buyerName ?? null,
      buyerAddress: data.buyerAddress ?? null,
      electronicStatus: data.electronicStatus ?? null,
      accessKey: data.accessKey ?? null,
      authorizationNumber: data.authorizationNumber ?? null,
      authorizedAt: data.authorizedAt ?? null,
      electronicStatusMessage: data.electronicStatusMessage ?? null,
      signedAt: data.signedAt ?? null,
      submittedAt: data.submittedAt ?? null,
      submissionReference: data.submissionReference ?? null,
      status: data.status,
      currency: data.currency,
      issuedAt: data.issuedAt,
      dueAt: data.dueAt,
      notes: data.notes,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };

    await this.prisma.invoice.upsert({
      where: { id: data.id },
      update: updateData,
      create: createData,
    });
  }

  async findByTenantId(tenantId: string): Promise<Invoice[]> {
    const invoices = await this.prisma.invoice.findMany({
      where: { tenantId },
      orderBy: [{ createdAt: 'desc' }, { number: 'desc' }],
    });

    return (invoices as any[]).map((invoice) => this.toDomain(invoice));
  }

  async findByTenantIdAndId(
    tenantId: string,
    invoiceId: string,
  ): Promise<Invoice | null> {
    const invoice = await this.prisma.invoice.findFirst({
      where: {
        id: invoiceId,
        tenantId,
      },
    });

    return invoice ? this.toDomain(invoice as any) : null;
  }

  private toDomain(record: {
    id: string;
    tenantId: string;
    customerId: string;
    number: string;
    documentCode: string | null;
    establishmentCode: string | null;
    emissionPointCode: string | null;
    sequenceNumber: number | null;
    modifiedDocumentId: string | null;
    modifiedDocumentNumber: string | null;
    modifiedDocumentIssuedAt: Date | null;
    modificationReason: string | null;
    shipmentReason: string | null;
    shipmentStartAt: Date | null;
    shipmentEndAt: Date | null;
    departureAddress: string | null;
    arrivalAddress: string | null;
    carrierName: string | null;
    carrierIdentificationType: string | null;
    carrierIdentification: string | null;
    vehiclePlate: string | null;
    destinationRoute: string | null;
    buyerIdentificationType: string | null;
    buyerIdentification: string | null;
    buyerName: string | null;
    buyerAddress: string | null;
    electronicStatus: string | null;
    accessKey: string | null;
    authorizationNumber: string | null;
    authorizedAt: Date | null;
    electronicStatusMessage: string | null;
    signedAt: Date | null;
    submittedAt: Date | null;
    submissionReference: string | null;
    status: string;
    currency: string;
    issuedAt: Date;
    dueAt: Date | null;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): Invoice {
    return Invoice.create({
      id: record.id,
      tenantId: record.tenantId,
      customerId: record.customerId,
      number: record.number,
      documentCode: record.documentCode,
      establishmentCode: record.establishmentCode,
      emissionPointCode: record.emissionPointCode,
      sequenceNumber: record.sequenceNumber,
      modifiedDocumentId: record.modifiedDocumentId,
      modifiedDocumentNumber: record.modifiedDocumentNumber,
      modifiedDocumentIssuedAt: record.modifiedDocumentIssuedAt,
      modificationReason: record.modificationReason,
      shipmentReason: record.shipmentReason,
      shipmentStartAt: record.shipmentStartAt,
      shipmentEndAt: record.shipmentEndAt,
      departureAddress: record.departureAddress,
      arrivalAddress: record.arrivalAddress,
      carrierName: record.carrierName,
      carrierIdentificationType:
        record.carrierIdentificationType as BuyerIdentificationType | null,
      carrierIdentification: record.carrierIdentification,
      vehiclePlate: record.vehiclePlate,
      destinationRoute: record.destinationRoute,
      buyerIdentificationType: record.buyerIdentificationType as BuyerIdentificationType | null,
      buyerIdentification: record.buyerIdentification,
      buyerName: record.buyerName,
      buyerAddress: record.buyerAddress,
      electronicStatus: record.electronicStatus as InvoiceElectronicStatus | null,
      accessKey: record.accessKey,
      authorizationNumber: record.authorizationNumber,
      authorizedAt: record.authorizedAt,
      electronicStatusMessage: record.electronicStatusMessage,
      signedAt: record.signedAt,
      submittedAt: record.submittedAt,
      submissionReference: record.submissionReference,
      status: record.status as InvoiceStatus,
      currency: record.currency,
      issuedAt: record.issuedAt,
      dueAt: record.dueAt,
      notes: record.notes,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}
