import { TenantNotFoundError, TenantRepository } from '@saas-platform/tenancy-application';
import {
  Invoice,
  InvoiceElectronicStatus,
  InvoiceStatus,
  IssuerProfile,
} from '@saas-platform/invoicing-domain';
import { InvalidInvoiceElectronicStatusError } from '../errors/invalid-invoice-electronic-status.error';
import { InvoiceAuthorizationDataRequiredError } from '../errors/invoice-authorization-data-required.error';
import { InvoiceElectronicMetadataIncompleteError } from '../errors/invoice-electronic-metadata-incomplete.error';
import { InvoiceNotFoundError } from '../errors/invoice-not-found.error';
import { IssuerProfileRepository } from '../ports/issuer-profile.repository';
import { InvoiceRepository } from '../ports/invoice.repository';
import {
  buildSriAccessKey,
  canBuildSriAccessKey,
} from '../types/electronic-invoice';

export interface UpdateTenantInvoiceElectronicStatusInput {
  tenantSlug: string;
  invoiceId: string;
  electronicStatus: InvoiceElectronicStatus | null;
  accessKey?: string | null;
  authorizationNumber?: string | null;
  authorizedAt?: Date | null;
  electronicStatusMessage?: string | null;
}

export class UpdateTenantInvoiceElectronicStatusUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly invoiceRepository: InvoiceRepository,
    private readonly issuerProfileRepository: IssuerProfileRepository,
  ) {}

  async execute(
    input: UpdateTenantInvoiceElectronicStatusInput,
  ) {
    const tenant = await this.tenantRepository.findBySlug(input.tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(input.tenantSlug);
    }

    const invoice = await this.invoiceRepository.findByTenantIdAndId(
      tenant.id,
      input.invoiceId,
    );

    if (!invoice) {
      throw new InvoiceNotFoundError(input.tenantSlug, input.invoiceId);
    }

    if (
      input.electronicStatus !== null &&
      !this.canManageElectronicStatus(invoice.status)
    ) {
      throw new InvalidInvoiceElectronicStatusError(
        input.tenantSlug,
        input.invoiceId,
      );
    }

    let accessKey = this.normalizeOptionalValue(input.accessKey);
    let authorizationNumber = this.normalizeOptionalValue(
      input.authorizationNumber,
    );
    const electronicStatusMessage = this.normalizeOptionalValue(
      input.electronicStatusMessage,
    );
    const authorizedAt =
      input.electronicStatus === 'authorized'
        ? input.authorizedAt ?? new Date()
        : null;

    if (input.electronicStatus !== null && !accessKey) {
      const issuerProfile = await this.issuerProfileRepository.findByTenantId(
        tenant.id,
      );

      accessKey = this.buildAutomaticAccessKey(
        input.tenantSlug,
        invoice.id,
        invoice,
        issuerProfile,
      );
    }

    if (input.electronicStatus === 'authorized' && !authorizationNumber) {
      authorizationNumber = accessKey;
    }

    if (
      input.electronicStatus === 'authorized' &&
      (!accessKey || !authorizationNumber)
    ) {
      throw new InvoiceAuthorizationDataRequiredError(
        input.tenantSlug,
        input.invoiceId,
        input.electronicStatus,
      );
    }

    const updatedInvoice = invoice.updateElectronicStatus(
      {
        electronicStatus: input.electronicStatus,
        accessKey,
        authorizationNumber,
        authorizedAt,
        electronicStatusMessage,
        signedAt: invoice.signedAt,
        submittedAt: invoice.submittedAt,
        submissionReference: invoice.submissionReference,
      },
      new Date(),
    );

    await this.invoiceRepository.save(updatedInvoice);

    return updatedInvoice;
  }

  private canManageElectronicStatus(status: InvoiceStatus): boolean {
    return status === 'issued' || status === 'partially_paid' || status === 'paid';
  }

  private normalizeOptionalValue(value?: string | null): string | null {
    const normalizedValue = value?.trim();

    return normalizedValue ? normalizedValue : null;
  }

  private buildAutomaticAccessKey(
    tenantSlug: string,
    invoiceId: string,
    invoice: Invoice,
    issuerProfile: IssuerProfile | null,
  ): string {
    if (!canBuildSriAccessKey(invoice, issuerProfile)) {
      throw new InvoiceElectronicMetadataIncompleteError(tenantSlug, invoiceId);
    }

    return buildSriAccessKey({
      invoice,
      issuerProfile,
    });
  }
}
