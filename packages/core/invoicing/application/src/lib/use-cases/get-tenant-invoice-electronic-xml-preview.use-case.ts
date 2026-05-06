import { TenantNotFoundError, TenantRepository } from '@saas-platform/tenancy-application';
import { CustomerNotFoundError } from '../errors/customer-not-found.error';
import { InvoiceElectronicMetadataIncompleteError } from '../errors/invoice-electronic-metadata-incomplete.error';
import { InvoiceNotFoundError } from '../errors/invoice-not-found.error';
import { IssuerProfileRepository } from '../ports/issuer-profile.repository';
import { GetTenantInvoiceDocumentUseCase } from './get-tenant-invoice-document.use-case';
import {
  buildSriAccessKey,
  buildSriInvoiceXmlPreview,
  canBuildSriAccessKey,
} from '../types/electronic-invoice';

export class GetTenantInvoiceElectronicXmlPreviewUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly issuerProfileRepository: IssuerProfileRepository,
    private readonly getTenantInvoiceDocumentUseCase: GetTenantInvoiceDocumentUseCase,
  ) {}

  async execute(tenantSlug: string, invoiceId: string): Promise<string> {
    try {
      const tenant = await this.tenantRepository.findBySlug(tenantSlug);

      if (!tenant) {
        throw new TenantNotFoundError(tenantSlug);
      }

      const document = await this.getTenantInvoiceDocumentUseCase.execute(
        tenantSlug,
        invoiceId,
      );
      const issuerProfile = await this.issuerProfileRepository.findByTenantId(
        tenant.id,
      );

      if (!canBuildSriAccessKey(document.invoice, issuerProfile)) {
        throw new InvoiceElectronicMetadataIncompleteError(tenantSlug, invoiceId);
      }

      const accessKey =
        document.invoice.accessKey ??
        buildSriAccessKey({
          invoice: document.invoice,
          issuerProfile,
        });

      return buildSriInvoiceXmlPreview({
        document,
        accessKey,
      });
    } catch (error) {
      if (
        error instanceof TenantNotFoundError ||
        error instanceof InvoiceNotFoundError ||
        error instanceof CustomerNotFoundError ||
        error instanceof InvoiceElectronicMetadataIncompleteError
      ) {
        throw error;
      }

      throw error;
    }
  }
}
