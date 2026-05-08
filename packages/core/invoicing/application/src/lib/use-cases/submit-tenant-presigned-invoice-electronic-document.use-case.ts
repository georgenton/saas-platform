import {
  TenantNotFoundError,
  TenantRepository,
} from '@saas-platform/tenancy-application';
import { InvoiceElectronicEvent, InvoiceStatus } from '@saas-platform/invoicing-domain';
import { InvoiceElectronicEventIdGenerator } from '../ports/invoice-electronic-event-id.generator';
import { InvoiceElectronicEventRepository } from '../ports/invoice-electronic-event.repository';
import { ElectronicSubmissionSettingsRepository } from '../ports/electronic-submission-settings.repository';
import { InvalidInvoiceElectronicSubmissionStateError } from '../errors/invalid-invoice-electronic-submission-state.error';
import { InvoiceElectronicSubmissionGatewayIncompleteError } from '../errors/invoice-electronic-submission-gateway-incomplete.error';
import { InvoiceElectronicSubmissionNotConfiguredError } from '../errors/invoice-electronic-submission-not-configured.error';
import { InvoiceElectronicMetadataIncompleteError } from '../errors/invoice-electronic-metadata-incomplete.error';
import { UnsupportedElectronicInvoiceDocumentCodeError } from '../errors/unsupported-electronic-invoice-document-code.error';
import { InvoiceElectronicXmlValidationError } from '../errors/invoice-electronic-xml-validation.error';
import { InvoiceNotFoundError } from '../errors/invoice-not-found.error';
import { ElectronicInvoiceXmlSchemaValidator } from '../ports/electronic-invoice-xml-schema-validator';
import { ElectronicInvoiceSubmissionGateway } from '../ports/electronic-invoice-submission.gateway';
import { IssuerProfileRepository } from '../ports/issuer-profile.repository';
import { InvoiceRepository } from '../ports/invoice.repository';
import {
  buildSriAccessKey,
  canBuildSriAccessKey,
  validateSriElectronicDocumentXml,
} from '../types/electronic-invoice';

export interface SubmitTenantPresignedInvoiceElectronicDocumentInput {
  tenantSlug: string;
  invoiceId: string;
  signedXml: string;
  signerName?: string | null;
}

export class SubmitTenantPresignedInvoiceElectronicDocumentUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly invoiceRepository: InvoiceRepository,
    private readonly invoiceElectronicEventRepository: InvoiceElectronicEventRepository,
    private readonly invoiceElectronicEventIdGenerator: InvoiceElectronicEventIdGenerator,
    private readonly electronicSubmissionSettingsRepository: ElectronicSubmissionSettingsRepository,
    private readonly issuerProfileRepository: IssuerProfileRepository,
    private readonly electronicInvoiceXmlSchemaValidator: ElectronicInvoiceXmlSchemaValidator,
    private readonly electronicInvoiceSubmissionGateway: ElectronicInvoiceSubmissionGateway,
  ) {}

  async execute(
    input: SubmitTenantPresignedInvoiceElectronicDocumentInput,
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

    const documentCode = invoice.documentCode ?? '01';
    const schemaSupport =
      await this.electronicInvoiceXmlSchemaValidator.describeSupport(
        documentCode,
      );

    if (!schemaSupport.isSchemaAvailable) {
      throw new UnsupportedElectronicInvoiceDocumentCodeError(
        input.tenantSlug,
        input.invoiceId,
        documentCode,
      );
    }

    const issuerProfile = await this.issuerProfileRepository.findByTenantId(
      tenant.id,
    );
    const submissionSettings =
      await this.electronicSubmissionSettingsRepository.findByTenantId(
        tenant.id,
      );

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

    const accessKey = invoice.accessKey
      ? invoice.accessKey
      : buildSriAccessKey({
          invoice,
          issuerProfile,
        });

    const xmlIssues = validateSriElectronicDocumentXml({
      xml: input.signedXml,
      accessKey,
    });

    if (!hasXmlDigitalSignature(input.signedXml)) {
      xmlIssues.push(
        'El XML prefirmado no contiene un bloque ds:Signature reconocible.',
      );
    }

    if (xmlIssues.length > 0) {
      throw new InvoiceElectronicXmlValidationError(xmlIssues);
    }

    const schemaIssues =
      await this.electronicInvoiceXmlSchemaValidator.validate({
        documentCode,
        xml: input.signedXml,
      });

    if (schemaIssues.length > 0) {
      throw new InvoiceElectronicXmlValidationError(schemaIssues);
    }

    const signedAt = new Date();
    const submissionResult = await this.electronicInvoiceSubmissionGateway.submit({
      tenantSlug: input.tenantSlug,
      invoiceId: input.invoiceId,
      accessKey,
      signedXml: input.signedXml,
      submissionSettings,
    });

    const externalSignerName =
      input.signerName?.trim() || 'external_signed_xml';
    const statusMessage = [
      `XML firmado externamente por ${externalSignerName}.`,
      submissionResult.statusMessage,
    ]
      .filter(Boolean)
      .join(' ');

    const updatedInvoice = invoice.updateElectronicStatus(
      {
        electronicStatus: submissionResult.electronicStatus,
        accessKey,
        authorizationNumber: invoice.authorizationNumber,
        authorizedAt: invoice.authorizedAt,
        electronicStatusMessage: statusMessage,
        signedAt,
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
        provider: `${submissionSettings.provider}:external_signed_xml`,
        providerStatus:
          submissionResult.technicalTrace?.providerStatus ??
          submissionResult.electronicStatus,
        endpoint: submissionResult.technicalTrace?.endpoint ?? null,
        soapAction: submissionResult.technicalTrace?.soapAction ?? null,
        message: statusMessage,
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

function hasXmlDigitalSignature(xml: string): boolean {
  return /<ds:Signature\b/i.test(xml) || /<Signature\b/i.test(xml);
}
