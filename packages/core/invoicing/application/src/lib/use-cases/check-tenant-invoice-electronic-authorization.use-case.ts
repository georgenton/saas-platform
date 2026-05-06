import { TenantNotFoundError, TenantRepository } from '@saas-platform/tenancy-application';
import { ElectronicSubmissionSettingsRepository } from '../ports/electronic-submission-settings.repository';
import { InvoiceElectronicEventIdGenerator } from '../ports/invoice-electronic-event-id.generator';
import { InvoiceElectronicEventRepository } from '../ports/invoice-electronic-event.repository';
import { InvoiceElectronicSubmissionGatewayIncompleteError } from '../errors/invoice-electronic-submission-gateway-incomplete.error';
import { InvoiceElectronicSubmissionNotConfiguredError } from '../errors/invoice-electronic-submission-not-configured.error';
import { InvalidInvoiceElectronicAuthorizationStateError } from '../errors/invalid-invoice-electronic-authorization-state.error';
import { InvoiceNotFoundError } from '../errors/invoice-not-found.error';
import { ElectronicInvoiceSubmissionGateway } from '../ports/electronic-invoice-submission.gateway';
import { InvoiceRepository } from '../ports/invoice.repository';
import { InvoiceElectronicEvent } from '@saas-platform/invoicing-domain';

export interface CheckTenantInvoiceElectronicAuthorizationInput {
  tenantSlug: string;
  invoiceId: string;
}

export class CheckTenantInvoiceElectronicAuthorizationUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly invoiceRepository: InvoiceRepository,
    private readonly invoiceElectronicEventRepository: InvoiceElectronicEventRepository,
    private readonly invoiceElectronicEventIdGenerator: InvoiceElectronicEventIdGenerator,
    private readonly electronicSubmissionSettingsRepository: ElectronicSubmissionSettingsRepository,
    private readonly electronicInvoiceSubmissionGateway: ElectronicInvoiceSubmissionGateway,
  ) {}

  async execute(
    input: CheckTenantInvoiceElectronicAuthorizationInput,
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
      invoice.electronicStatus !== 'submitted' ||
      !invoice.accessKey ||
      !invoice.submissionReference
    ) {
      throw new InvalidInvoiceElectronicAuthorizationStateError(
        input.tenantSlug,
        input.invoiceId,
      );
    }

    const submissionSettings =
      await this.electronicSubmissionSettingsRepository.findByTenantId(
        tenant.id,
      );

    if (!submissionSettings?.isActive) {
      throw new InvoiceElectronicSubmissionNotConfiguredError(
        input.tenantSlug,
        input.invoiceId,
      );
    }

    if (!submissionSettings.hasGatewayConfigured()) {
      throw new InvoiceElectronicSubmissionGatewayIncompleteError(
        input.tenantSlug,
        input.invoiceId,
      );
    }

    const authorizationResult =
      await this.electronicInvoiceSubmissionGateway.checkAuthorization({
        tenantSlug: input.tenantSlug,
        invoiceId: input.invoiceId,
        accessKey: invoice.accessKey,
        submissionReference: invoice.submissionReference,
        submissionSettings,
      });

    const updatedInvoice = invoice.updateElectronicStatus(
      {
        electronicStatus: authorizationResult.electronicStatus,
        accessKey: invoice.accessKey,
        authorizationNumber:
          authorizationResult.authorizationNumber ?? invoice.authorizationNumber,
        authorizedAt: authorizationResult.authorizedAt,
        electronicStatusMessage: authorizationResult.statusMessage,
        signedAt: invoice.signedAt,
        submittedAt: invoice.submittedAt,
        submissionReference: invoice.submissionReference,
      },
      new Date(),
    );

    await this.invoiceRepository.save(updatedInvoice);
    await this.invoiceElectronicEventRepository.save(
      InvoiceElectronicEvent.create({
        id: this.invoiceElectronicEventIdGenerator.generate(),
        tenantId: tenant.id,
        invoiceId: invoice.id,
        eventType: 'authorization_check',
        provider: submissionSettings.provider,
        providerStatus:
          authorizationResult.technicalTrace?.providerStatus ??
          authorizationResult.electronicStatus,
        endpoint: authorizationResult.technicalTrace?.endpoint ?? null,
        soapAction: authorizationResult.technicalTrace?.soapAction ?? null,
        message: authorizationResult.statusMessage,
        requestPayload:
          authorizationResult.technicalTrace?.requestPayload ?? null,
        responsePayload:
          authorizationResult.technicalTrace?.responsePayload ?? null,
        submissionReference: invoice.submissionReference,
        authorizationNumber:
          authorizationResult.authorizationNumber ?? invoice.authorizationNumber,
        occurredAt: authorizationResult.authorizedAt ?? new Date(),
      }),
    );

    return updatedInvoice;
  }
}
