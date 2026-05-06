import { InvoiceNumberingSettings } from '@saas-platform/invoicing-domain';

export interface InvoiceNumberingSettingsResponseDto {
  id: string;
  tenantId: string;
  documentCode: string;
  establishmentCode: string;
  emissionPointCode: string;
  nextSequenceNumber: number;
  previewNumber: string;
  createdAt: string;
  updatedAt: string;
}

export const toInvoiceNumberingSettingsResponseDto = (
  settings: InvoiceNumberingSettings,
): InvoiceNumberingSettingsResponseDto => {
  const data = settings.toPrimitives();

  return {
    id: data.id,
    tenantId: data.tenantId,
    documentCode: data.documentCode,
    establishmentCode: data.establishmentCode,
    emissionPointCode: data.emissionPointCode,
    nextSequenceNumber: data.nextSequenceNumber,
    previewNumber: `${data.establishmentCode}-${data.emissionPointCode}-${String(
      data.nextSequenceNumber,
    ).padStart(9, '0')}`,
    createdAt: data.createdAt.toISOString(),
    updatedAt: data.updatedAt.toISOString(),
  };
};
