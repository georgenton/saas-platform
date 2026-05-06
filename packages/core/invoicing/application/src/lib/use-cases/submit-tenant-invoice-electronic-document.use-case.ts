import { TenantNotFoundError, TenantRepository } from '@saas-platform/tenancy-application';
import { InvoiceStatus } from '@saas-platform/invoicing-domain';
import { InvoiceElectronicEventIdGenerator } from '../ports/invoice-electronic-event-id.generator';
import { InvoiceElectronicEventRepository } from '../ports/invoice-electronic-event.repository';
import { ElectronicSubmissionSettingsRepository } from '../ports/electronic-submission-settings.repository';
import { InvalidInvoiceElectronicSubmissionStateError } from '../errors/invalid-invoice-electronic-submission-state.error';
import { InvoiceElectronicSubmissionGatewayIncompleteError } from '../errors/invoice-electronic-submission-gateway-incomplete.error';
import { InvoiceElectronicSubmissionNotConfiguredError } from '../errors/invoice-electronic-submission-not-configured.error';
import { InvoiceElectronicSignatureNotConfiguredError } from '../errors/invoice-electronic-signature-not-configured.error';
import { InvoiceElectronicSignatureMaterialIncompleteError } from '../errors/invoice-electronic-signature-material-incomplete.error';
import { ElectronicSignatureSettingsRepository } from '../ports/electronic-signature-settings.repository';
import { InvoiceElectronicMetadataIncompleteError } from '../errors/invoice-electronic-metadata-incomplete.error';
import { InvoiceElectronicXmlValidationError } from '../errors/invoice-electronic-xml-validation.error';
import { InvoiceNotFoundError } from '../errors/invoice-not-found.error';
import { ElectronicInvoiceSigner } from '../ports/electronic-invoice-signer';
import { ElectronicInvoiceXmlSchemaValidator } from '../ports/electronic-invoice-xml-schema-validator';
import { ElectronicInvoiceSubmissionGateway } from '../ports/electronic-invoice-submission.gateway';
import { IssuerProfileRepository } from '../ports/issuer-profile.repository';
import { InvoiceRepository } from '../ports/invoice.repository';
import { InvoiceElectronicEvent } from '@saas-platform/invoicing-domain';
import {
  buildSriAccessKey,
  buildSriInvoiceXmlPreview,
  canBuildSriAccessKey,
  validateSriInvoiceXml,
} from '../types/electronic-invoice';
import { GetTenantInvoiceDocumentUseCase } from './get-tenant-invoice-document.use-case';

export interface SubmitTenantInvoiceElectronicDocumentInput {
  tenantSlug: string;
  invoiceId: string;
}

export class SubmitTenantInvoiceElectronicDocumentUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly invoiceRepository: InvoiceRepository,
    private readonly invoiceElectronicEventRepository: InvoiceElectronicEventRepository,
    private readonly invoiceElectronicEventIdGenerator: InvoiceElectronicEventIdGenerator,
    private readonly electronicSubmissionSettingsRepository: ElectronicSubmissionSettingsRepository,
    private readonly electronicSignatureSettingsRepository: ElectronicSignatureSettingsRepository,
    private readonly issuerProfileRepository: IssuerProfileRepository,
    private readonly getTenantInvoiceDocumentUseCase: GetTenantInvoiceDocumentUseCase,
    private readonly electronicInvoiceXmlSchemaValidator: ElectronicInvoiceXmlSchemaValidator,
    private readonly electronicInvoiceSigner: ElectronicInvoiceSigner,
    private readonly electronicInvoiceSubmissionGateway: ElectronicInvoiceSubmissionGateway,
  ) {}

  async execute(
    input: SubmitTenantInvoiceElectronicDocumentInput,
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

    if (!this.canSubmitElectronicDocument(invoice.status)) {
      throw new InvalidInvoiceElectronicSubmissionStateError(
        input.tenantSlug,
        input.invoiceId,
      );
    }

    const issuerProfile = await this.issuerProfileRepository.findByTenantId(
      tenant.id,
    );
    const submissionSettings =
      await this.electronicSubmissionSettingsRepository.findByTenantId(
        tenant.id,
      );
    const signatureSettings =
      await this.electronicSignatureSettingsRepository.findByTenantId(tenant.id);

    if (!canBuildSriAccessKey(invoice, issuerProfile)) {
      throw new InvoiceElectronicMetadataIncompleteError(
        input.tenantSlug,
        input.invoiceId,
      );
    }

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

    if (!signatureSettings?.isActive) {
      throw new InvoiceElectronicSignatureNotConfiguredError(
        input.tenantSlug,
        input.invoiceId,
      );
    }

    if (!signatureSettings.hasSigningMaterialConfigured()) {
      throw new InvoiceElectronicSignatureMaterialIncompleteError(
        input.tenantSlug,
        input.invoiceId,
      );
    }

    const accessKey = invoice.accessKey
      ? invoice.accessKey
      : buildSriAccessKey({
          invoice,
          issuerProfile,
        });
    const document = await this.getTenantInvoiceDocumentUseCase.execute(
      input.tenantSlug,
      input.invoiceId,
    );
    const xml = buildSriInvoiceXmlPreview({
      document,
      accessKey,
    });
    const xmlIssues = validateSriInvoiceXml({
      xml,
      accessKey,
    });

    if (xmlIssues.length > 0) {
      throw new InvoiceElectronicXmlValidationError(xmlIssues);
    }

    const schemaIssues =
      await this.electronicInvoiceXmlSchemaValidator.validate({
        xml,
      });

    if (schemaIssues.length > 0) {
      throw new InvoiceElectronicXmlValidationError(schemaIssues);
    }

    const signedDocument = await this.electronicInvoiceSigner.sign({
      tenantSlug: input.tenantSlug,
      invoiceId: input.invoiceId,
      accessKey,
      xml,
      issuerProfile,
      signatureSettings,
    });
    const submissionResult = await this.electronicInvoiceSubmissionGateway.submit({
      tenantSlug: input.tenantSlug,
      invoiceId: input.invoiceId,
      accessKey,
      signedXml: signedDocument.signedXml,
      submissionSettings,
    });

    const updatedInvoice = invoice.updateElectronicStatus(
      {
        electronicStatus: submissionResult.electronicStatus,
        accessKey,
        authorizationNumber: invoice.authorizationNumber,
        authorizedAt: invoice.authorizedAt,
        electronicStatusMessage: submissionResult.statusMessage,
        signedAt: signedDocument.signedAt,
        submittedAt: submissionResult.submittedAt,
        submissionReference: submissionResult.submissionReference,
      },
      new Date(),
    );

    await this.invoiceRepository.save(updatedInvoice);
    await this.invoiceElectronicEventRepository.save(
      InvoiceElectronicEvent.create({
        id: this.invoiceElectronicEventIdGenerator.generate(),
        tenantId: tenant.id,
        invoiceId: invoice.id,
        eventType: 'submission',
        provider: submissionSettings.provider,
        providerStatus:
          submissionResult.technicalTrace?.providerStatus ??
          submissionResult.electronicStatus,
        endpoint: submissionResult.technicalTrace?.endpoint ?? null,
        soapAction: submissionResult.technicalTrace?.soapAction ?? null,
        message: submissionResult.statusMessage,
        requestPayload: submissionResult.technicalTrace?.requestPayload ?? null,
        responsePayload: submissionResult.technicalTrace?.responsePayload ?? null,
        submissionReference: submissionResult.submissionReference,
        authorizationNumber: null,
        occurredAt: submissionResult.submittedAt,
      }),
    );

    return updatedInvoice;
  }

  private canSubmitElectronicDocument(status: InvoiceStatus): boolean {
    return status === 'issued' || status === 'partially_paid' || status === 'paid';
  }
}
