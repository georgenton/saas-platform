import { Invoice } from '@saas-platform/invoicing-domain';
import {
  InvoiceDetailResponseDto,
  toInvoiceDetailResponseDto,
} from './invoice-detail.response';

export interface RemissionGuideResponseDto {
  invoice: InvoiceDetailResponseDto;
  remissionGuide: {
    sourceInvoiceId: string | null;
    sourceInvoiceNumber: string | null;
    sourceInvoiceIssuedAt: string | null;
    shipmentReason: string | null;
    shipmentStartAt: string | null;
    shipmentEndAt: string | null;
    departureAddress: string | null;
    arrivalAddress: string | null;
    carrierName: string | null;
    carrierIdentificationType: string | null;
    carrierIdentification: string | null;
    vehiclePlate: string | null;
    destinationRoute: string | null;
  };
}

export const toRemissionGuideResponseDto = (
  detail: Parameters<typeof toInvoiceDetailResponseDto>[0],
  sourceInvoice: Invoice,
): RemissionGuideResponseDto => {
  const remissionGuide = detail.invoice.toPrimitives();

  return {
    invoice: toInvoiceDetailResponseDto(detail),
    remissionGuide: {
      sourceInvoiceId: remissionGuide.modifiedDocumentId ?? sourceInvoice.id,
      sourceInvoiceNumber:
        remissionGuide.modifiedDocumentNumber ?? sourceInvoice.number,
      sourceInvoiceIssuedAt:
        remissionGuide.modifiedDocumentIssuedAt?.toISOString() ??
        sourceInvoice.issuedAt.toISOString(),
      shipmentReason:
        remissionGuide.shipmentReason ?? remissionGuide.modificationReason ?? null,
      shipmentStartAt: remissionGuide.shipmentStartAt?.toISOString() ?? null,
      shipmentEndAt: remissionGuide.shipmentEndAt?.toISOString() ?? null,
      departureAddress: remissionGuide.departureAddress ?? null,
      arrivalAddress: remissionGuide.arrivalAddress ?? null,
      carrierName: remissionGuide.carrierName ?? null,
      carrierIdentificationType:
        remissionGuide.carrierIdentificationType ?? null,
      carrierIdentification: remissionGuide.carrierIdentification ?? null,
      vehiclePlate: remissionGuide.vehiclePlate ?? null,
      destinationRoute: remissionGuide.destinationRoute ?? null,
    },
  };
};
