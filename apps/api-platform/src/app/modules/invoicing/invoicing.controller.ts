import {
  Body,
  ConflictException,
  Controller,
  Get,
  Header,
  NotFoundException,
  Param,
  Post,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import {
  CheckTenantInvoiceElectronicAuthorizationUseCase,
  CreateTenantCustomerUseCase,
  CustomerNotFoundError,
  CreateTenantInvoiceUseCase,
  CreateTenantInvoiceItemUseCase,
  CreateTenantInvoicePaymentUseCase,
  CreateTenantTaxRateUseCase,
  CustomerEmailMissingError,
  ElectronicSubmissionSettingsNotFoundError,
  ElectronicSignatureSettingsNotFoundError,
  GetTenantCustomerByIdUseCase,
  GetTenantElectronicSubmissionSettingsUseCase,
  GetTenantElectronicSignatureSettingsUseCase,
  GetTenantInvoiceNumberingSettingsUseCase,
  GetTenantInvoiceDetailUseCase,
  GetTenantInvoiceDocumentUseCase,
  GetTenantInvoiceElectronicXmlPreviewUseCase,
  GetTenantInvoicingReportSummaryUseCase,
  GetTenantInvoiceItemByIdUseCase,
  GetTenantIssuerProfileUseCase,
  INVOICING_PERMISSIONS,
  ListTenantCustomersUseCase,
  ListTenantInvoiceItemsUseCase,
  ListTenantInvoicePaymentsUseCase,
  ListTenantInvoiceSummariesUseCase,
  ListTenantTaxRatesUseCase,
  InvoiceNotFoundError,
  InvoiceItemNotFoundError,
  InvoiceNumberRequiredError,
  InvoiceNumberingSettingsNotFoundError,
  InvoiceNotFullySettledError,
  InvalidInvoiceElectronicAuthorizationStateError,
  InvalidInvoiceElectronicSubmissionStateError,
  InvoiceElectronicSubmissionGatewayIncompleteError,
  InvoiceElectronicSubmissionNotConfiguredError,
  InvoiceElectronicSecretResolutionError,
  InvoiceElectronicSignatureMaterialIncompleteError,
  InvoiceElectronicXmlValidationError,
  InvalidInvoicePaymentStateError,
  InvalidInvoiceElectronicStatusError,
  InvoiceElectronicSignatureNotConfiguredError,
  InvalidPaymentReversalStateError,
  InvalidInvoiceStatusTransitionError,
  InvoiceAuthorizationDataRequiredError,
  InvoiceElectronicMetadataIncompleteError,
  InvoicePaymentExceedsBalanceError,
  IssuerProfileNotFoundError,
  PaymentNotFoundError,
  ReverseTenantInvoicePaymentUseCase,
  renderInvoiceDocumentHtml,
  SendTenantInvoiceEmailUseCase,
  SubmitTenantInvoiceElectronicDocumentUseCase,
  TaxRateNotFoundError,
  UpdateTenantInvoiceStatusUseCase,
  UpdateTenantInvoiceElectronicStatusUseCase,
  UpsertTenantElectronicSubmissionSettingsUseCase,
  UpsertTenantElectronicSignatureSettingsUseCase,
  UpsertTenantInvoiceNumberingSettingsUseCase,
  UpsertTenantIssuerProfileUseCase,
} from '@saas-platform/invoicing-application';
import {
  TenantAccessContext,
  TenantNotFoundError,
} from '@saas-platform/tenancy-application';
import { JwtAuthenticationGuard } from '../auth/jwt-authentication.guard';
import { RequireTenantPermission } from '../tenancy/require-tenant-permission.decorator';
import { RequireTenantProductAccess } from '../tenancy/require-tenant-product-access.decorator';
import { TenantAccess } from '../tenancy/tenant-access.decorator';
import { TenantMembershipGuard } from '../tenancy/tenant-membership.guard';
import { TenantPermissionGuard } from '../tenancy/tenant-permission.guard';
import { TenantProductAccessGuard } from '../tenancy/tenant-product-access.guard';
import { CreateCustomerRequestDto } from './dto/create-customer.request';
import { CreateInvoiceRequestDto } from './dto/create-invoice.request';
import { CreateInvoiceItemRequestDto } from './dto/create-invoice-item.request';
import { CreateTaxRateRequestDto } from './dto/create-tax-rate.request';
import { CreateInvoicePaymentRequestDto } from './dto/create-invoice-payment.request';
import { ReverseInvoicePaymentRequestDto } from './dto/reverse-invoice-payment.request';
import { SendInvoiceEmailRequestDto } from './dto/send-invoice-email.request';
import { UpdateInvoiceStatusRequestDto } from './dto/update-invoice-status.request';
import { UpdateInvoiceElectronicStatusRequestDto } from './dto/update-invoice-electronic-status.request';
import { UpsertElectronicSubmissionSettingsRequestDto } from './dto/upsert-electronic-submission-settings.request';
import { UpsertElectronicSignatureSettingsRequestDto } from './dto/upsert-electronic-signature-settings.request';
import { UpsertIssuerProfileRequestDto } from './dto/upsert-issuer-profile.request';
import { UpsertInvoiceNumberingSettingsRequestDto } from './dto/upsert-invoice-numbering-settings.request';
import {
  ElectronicSubmissionSettingsResponseDto,
  toElectronicSubmissionSettingsResponseDto,
} from './dto/electronic-submission-settings.response';
import {
  ElectronicSignatureSettingsResponseDto,
  toElectronicSignatureSettingsResponseDto,
} from './dto/electronic-signature-settings.response';
import {
  SubmitInvoiceElectronicDocumentResponseDto,
  toSubmitInvoiceElectronicDocumentResponseDto,
} from './dto/submit-invoice-electronic-document.response';
import {
  CustomerResponseDto,
  toCustomerResponseDto,
} from './dto/customer.response';
import {
  InvoiceNumberingSettingsResponseDto,
  toInvoiceNumberingSettingsResponseDto,
} from './dto/invoice-numbering-settings.response';
import {
  IssuerProfileResponseDto,
  toIssuerProfileResponseDto,
} from './dto/issuer-profile.response';
import {
  InvoiceItemResponseDto,
  toInvoiceItemResponseDto,
} from './dto/invoice-item.response';
import { PaymentResponseDto, toPaymentResponseDto } from './dto/payment.response';
import {
  InvoiceDetailResponseDto,
  toInvoiceDetailResponseDto,
} from './dto/invoice-detail.response';
import {
  InvoicingReportSummaryResponseDto,
  toInvoicingReportSummaryResponseDto,
} from './dto/invoicing-report.response';
import {
  InvoiceDocumentResponseDto,
  toInvoiceDocumentResponseDto,
} from './dto/invoice-document.response';
import {
  InvoiceSummaryResponseDto,
  toInvoiceSummaryResponseDto,
} from './dto/invoice-summary.response';
import {
  TaxRateResponseDto,
  toTaxRateResponseDto,
} from './dto/tax-rate.response';

@Controller('invoicing/tenants')
@UseGuards(
  JwtAuthenticationGuard,
  TenantMembershipGuard,
  TenantPermissionGuard,
  TenantProductAccessGuard,
)
@RequireTenantProductAccess({ productKey: 'invoicing' })
export class InvoicingController {
  constructor(
    private readonly createTenantCustomerUseCase: CreateTenantCustomerUseCase,
    private readonly createTenantInvoiceUseCase: CreateTenantInvoiceUseCase,
    private readonly createTenantInvoiceItemUseCase: CreateTenantInvoiceItemUseCase,
    private readonly createTenantInvoicePaymentUseCase: CreateTenantInvoicePaymentUseCase,
    private readonly createTenantTaxRateUseCase: CreateTenantTaxRateUseCase,
    private readonly getTenantCustomerByIdUseCase: GetTenantCustomerByIdUseCase,
    private readonly getTenantElectronicSubmissionSettingsUseCase: GetTenantElectronicSubmissionSettingsUseCase,
    private readonly getTenantElectronicSignatureSettingsUseCase: GetTenantElectronicSignatureSettingsUseCase,
    private readonly getTenantInvoiceNumberingSettingsUseCase: GetTenantInvoiceNumberingSettingsUseCase,
    private readonly getTenantInvoiceDetailUseCase: GetTenantInvoiceDetailUseCase,
    private readonly getTenantInvoiceDocumentUseCase: GetTenantInvoiceDocumentUseCase,
    private readonly getTenantInvoiceElectronicXmlPreviewUseCase: GetTenantInvoiceElectronicXmlPreviewUseCase,
    private readonly getTenantInvoicingReportSummaryUseCase: GetTenantInvoicingReportSummaryUseCase,
    private readonly getTenantInvoiceItemByIdUseCase: GetTenantInvoiceItemByIdUseCase,
    private readonly getTenantIssuerProfileUseCase: GetTenantIssuerProfileUseCase,
    private readonly listTenantCustomersUseCase: ListTenantCustomersUseCase,
    private readonly listTenantInvoiceItemsUseCase: ListTenantInvoiceItemsUseCase,
    private readonly listTenantInvoicePaymentsUseCase: ListTenantInvoicePaymentsUseCase,
    private readonly listTenantInvoiceSummariesUseCase: ListTenantInvoiceSummariesUseCase,
    private readonly listTenantTaxRatesUseCase: ListTenantTaxRatesUseCase,
    private readonly reverseTenantInvoicePaymentUseCase: ReverseTenantInvoicePaymentUseCase,
    private readonly sendTenantInvoiceEmailUseCase: SendTenantInvoiceEmailUseCase,
    private readonly checkTenantInvoiceElectronicAuthorizationUseCase: CheckTenantInvoiceElectronicAuthorizationUseCase,
    private readonly submitTenantInvoiceElectronicDocumentUseCase: SubmitTenantInvoiceElectronicDocumentUseCase,
    private readonly updateTenantInvoiceStatusUseCase: UpdateTenantInvoiceStatusUseCase,
    private readonly updateTenantInvoiceElectronicStatusUseCase: UpdateTenantInvoiceElectronicStatusUseCase,
    private readonly upsertTenantElectronicSubmissionSettingsUseCase: UpsertTenantElectronicSubmissionSettingsUseCase,
    private readonly upsertTenantElectronicSignatureSettingsUseCase: UpsertTenantElectronicSignatureSettingsUseCase,
    private readonly upsertTenantInvoiceNumberingSettingsUseCase: UpsertTenantInvoiceNumberingSettingsUseCase,
    private readonly upsertTenantIssuerProfileUseCase: UpsertTenantIssuerProfileUseCase,
  ) {}

  @Get(':slug/electronic-signature')
  @RequireTenantPermission(INVOICING_PERMISSIONS.INVOICES_READ)
  async getTenantElectronicSignatureSettings(
    @Param('slug') slug: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<ElectronicSignatureSettingsResponseDto> {
    try {
      const settings =
        await this.getTenantElectronicSignatureSettingsUseCase.execute(
          tenantAccess?.tenantSlug ?? slug,
        );

      return toElectronicSignatureSettingsResponseDto(settings);
    } catch (error) {
      if (
        error instanceof TenantNotFoundError ||
        error instanceof ElectronicSignatureSettingsNotFoundError
      ) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Post(':slug/electronic-signature')
  @RequireTenantPermission(INVOICING_PERMISSIONS.INVOICES_MANAGE)
  async upsertTenantElectronicSignatureSettings(
    @Param('slug') slug: string,
    @Body() body: UpsertElectronicSignatureSettingsRequestDto,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<ElectronicSignatureSettingsResponseDto> {
    try {
      const settings =
        await this.upsertTenantElectronicSignatureSettingsUseCase.execute({
          tenantSlug: tenantAccess?.tenantSlug ?? slug,
          provider: body.provider,
          certificateLabel: body.certificateLabel,
          storageMode: body.storageMode,
          certificateFingerprint: body.certificateFingerprint ?? null,
          pkcs12SecretRef: body.pkcs12SecretRef ?? null,
          privateKeyPasswordSecretRef:
            body.privateKeyPasswordSecretRef ?? null,
          subjectName: body.subjectName ?? null,
          isActive: body.isActive,
        });

      return toElectronicSignatureSettingsResponseDto(settings);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/electronic-submission')
  @RequireTenantPermission(INVOICING_PERMISSIONS.INVOICES_READ)
  async getTenantElectronicSubmissionSettings(
    @Param('slug') slug: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<ElectronicSubmissionSettingsResponseDto> {
    try {
      const settings =
        await this.getTenantElectronicSubmissionSettingsUseCase.execute(
          tenantAccess?.tenantSlug ?? slug,
        );

      return toElectronicSubmissionSettingsResponseDto(settings);
    } catch (error) {
      if (
        error instanceof TenantNotFoundError ||
        error instanceof ElectronicSubmissionSettingsNotFoundError
      ) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Post(':slug/electronic-submission')
  @RequireTenantPermission(INVOICING_PERMISSIONS.INVOICES_MANAGE)
  async upsertTenantElectronicSubmissionSettings(
    @Param('slug') slug: string,
    @Body() body: UpsertElectronicSubmissionSettingsRequestDto,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<ElectronicSubmissionSettingsResponseDto> {
    try {
      const settings =
        await this.upsertTenantElectronicSubmissionSettingsUseCase.execute({
          tenantSlug: tenantAccess?.tenantSlug ?? slug,
          provider: body.provider,
          environment: body.environment,
          transmissionMode: body.transmissionMode,
          receptionUrl: body.receptionUrl ?? null,
          authorizationUrl: body.authorizationUrl ?? null,
          credentialsSecretRef: body.credentialsSecretRef ?? null,
          timeoutMs: body.timeoutMs,
          isActive: body.isActive,
        });

      return toElectronicSubmissionSettingsResponseDto(settings);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/electronic-profile')
  @RequireTenantPermission(INVOICING_PERMISSIONS.INVOICES_READ)
  async getTenantIssuerProfile(
    @Param('slug') slug: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<IssuerProfileResponseDto> {
    try {
      const profile = await this.getTenantIssuerProfileUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
      );

      return toIssuerProfileResponseDto(profile);
    } catch (error) {
      if (
        error instanceof TenantNotFoundError ||
        error instanceof IssuerProfileNotFoundError
      ) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Post(':slug/electronic-profile')
  @RequireTenantPermission(INVOICING_PERMISSIONS.INVOICES_MANAGE)
  async upsertTenantIssuerProfile(
    @Param('slug') slug: string,
    @Body() body: UpsertIssuerProfileRequestDto,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<IssuerProfileResponseDto> {
    try {
      const profile = await this.upsertTenantIssuerProfileUseCase.execute({
        tenantSlug: tenantAccess?.tenantSlug ?? slug,
        legalName: body.legalName,
        commercialName: body.commercialName ?? null,
        taxId: body.taxId,
        environment: body.environment,
        emissionType: body.emissionType,
        accountingObligated: body.accountingObligated,
        specialTaxpayerCode: body.specialTaxpayerCode ?? null,
        rimpeTaxpayerType: body.rimpeTaxpayerType ?? null,
        matrixAddress: body.matrixAddress,
        establishmentAddress: body.establishmentAddress,
      });

      return toIssuerProfileResponseDto(profile);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/numbering/invoice')
  @RequireTenantPermission(INVOICING_PERMISSIONS.INVOICES_READ)
  async getTenantInvoiceNumberingSettings(
    @Param('slug') slug: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<InvoiceNumberingSettingsResponseDto> {
    try {
      const settings = await this.getTenantInvoiceNumberingSettingsUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
      );

      return toInvoiceNumberingSettingsResponseDto(settings);
    } catch (error) {
      if (
        error instanceof TenantNotFoundError ||
        error instanceof InvoiceNumberingSettingsNotFoundError
      ) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Post(':slug/numbering/invoice')
  @RequireTenantPermission(INVOICING_PERMISSIONS.INVOICES_MANAGE)
  async upsertTenantInvoiceNumberingSettings(
    @Param('slug') slug: string,
    @Body() body: UpsertInvoiceNumberingSettingsRequestDto,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<InvoiceNumberingSettingsResponseDto> {
    try {
      const settings =
        await this.upsertTenantInvoiceNumberingSettingsUseCase.execute({
          tenantSlug: tenantAccess?.tenantSlug ?? slug,
          documentCode: body.documentCode,
          establishmentCode: body.establishmentCode,
          emissionPointCode: body.emissionPointCode,
          nextSequenceNumber: body.nextSequenceNumber,
        });

      return toInvoiceNumberingSettingsResponseDto(settings);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/taxes')
  @RequireTenantPermission(INVOICING_PERMISSIONS.TAXES_READ)
  async listTenantTaxRates(
    @Param('slug') slug: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<TaxRateResponseDto[]> {
    try {
      const taxRates = await this.listTenantTaxRatesUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
      );

      return taxRates.map((taxRate) => toTaxRateResponseDto(taxRate));
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Post(':slug/taxes')
  @RequireTenantPermission(INVOICING_PERMISSIONS.TAXES_MANAGE)
  async createTenantTaxRate(
    @Param('slug') slug: string,
    @Body() body: CreateTaxRateRequestDto,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<TaxRateResponseDto> {
    try {
      const taxRate = await this.createTenantTaxRateUseCase.execute({
        tenantSlug: tenantAccess?.tenantSlug ?? slug,
        name: body.name,
        percentage: body.percentage,
        isActive: body.isActive,
      });

      return toTaxRateResponseDto(taxRate);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/customers')
  @RequireTenantPermission(INVOICING_PERMISSIONS.CUSTOMERS_READ)
  async listTenantCustomers(
    @Param('slug') slug: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<CustomerResponseDto[]> {
    try {
      const customers = await this.listTenantCustomersUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
      );

      return customers.map((customer) => toCustomerResponseDto(customer));
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/customers/:customerId')
  @RequireTenantPermission(INVOICING_PERMISSIONS.CUSTOMERS_READ)
  async getTenantCustomerById(
    @Param('slug') slug: string,
    @Param('customerId') customerId: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<CustomerResponseDto> {
    try {
      const customer = await this.getTenantCustomerByIdUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
        customerId,
      );

      return toCustomerResponseDto(customer);
    } catch (error) {
      if (
        error instanceof TenantNotFoundError ||
        error instanceof CustomerNotFoundError
      ) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Post(':slug/customers')
  @RequireTenantPermission(INVOICING_PERMISSIONS.CUSTOMERS_MANAGE)
  async createTenantCustomer(
    @Param('slug') slug: string,
    @Body() body: CreateCustomerRequestDto,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<CustomerResponseDto> {
    try {
      const customer = await this.createTenantCustomerUseCase.execute({
        tenantSlug: tenantAccess?.tenantSlug ?? slug,
        name: body.name,
        email: body.email ?? null,
        taxId: body.taxId ?? null,
        identificationType: body.identificationType ?? null,
        identification: body.identification ?? null,
        billingAddress: body.billingAddress ?? null,
      });

      return toCustomerResponseDto(customer);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/reports/summary')
  @RequireTenantPermission(INVOICING_PERMISSIONS.REPORTS_READ)
  async getTenantInvoicingReportSummary(
    @Param('slug') slug: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<InvoicingReportSummaryResponseDto> {
    try {
      const report = await this.getTenantInvoicingReportSummaryUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
      );

      return toInvoicingReportSummaryResponseDto(report);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/invoices')
  @RequireTenantPermission(INVOICING_PERMISSIONS.INVOICES_READ)
  async listTenantInvoices(
    @Param('slug') slug: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<InvoiceSummaryResponseDto[]> {
    try {
      const invoices = await this.listTenantInvoiceSummariesUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
      );

      return invoices.map((invoice) => toInvoiceSummaryResponseDto(invoice));
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/invoices/:invoiceId')
  @RequireTenantPermission(INVOICING_PERMISSIONS.INVOICES_READ)
  async getTenantInvoiceById(
    @Param('slug') slug: string,
    @Param('invoiceId') invoiceId: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<InvoiceDetailResponseDto> {
    try {
      const invoice = await this.getTenantInvoiceDetailUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
        invoiceId,
      );

      return toInvoiceDetailResponseDto(invoice);
    } catch (error) {
      if (
        error instanceof TenantNotFoundError ||
        error instanceof InvoiceNotFoundError
      ) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/invoices/:invoiceId/document')
  @RequireTenantPermission(INVOICING_PERMISSIONS.INVOICES_READ)
  async getTenantInvoiceDocument(
    @Param('slug') slug: string,
    @Param('invoiceId') invoiceId: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<InvoiceDocumentResponseDto> {
    try {
      const document = await this.getTenantInvoiceDocumentUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
        invoiceId,
      );

      return toInvoiceDocumentResponseDto(document);
    } catch (error) {
      if (
        error instanceof TenantNotFoundError ||
        error instanceof InvoiceNotFoundError ||
        error instanceof CustomerNotFoundError
      ) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/invoices/:invoiceId/document/html')
  @Header('Content-Type', 'text/html; charset=utf-8')
  @RequireTenantPermission(INVOICING_PERMISSIONS.INVOICES_READ)
  async getTenantInvoiceDocumentHtml(
    @Param('slug') slug: string,
    @Param('invoiceId') invoiceId: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<string> {
    try {
      const document = await this.getTenantInvoiceDocumentUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
        invoiceId,
      );

      return renderInvoiceDocumentHtml(document);
    } catch (error) {
      if (
        error instanceof TenantNotFoundError ||
        error instanceof InvoiceNotFoundError ||
        error instanceof CustomerNotFoundError
      ) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/invoices/:invoiceId/electronic-document/xml')
  @Header('Content-Type', 'application/xml; charset=utf-8')
  @RequireTenantPermission(INVOICING_PERMISSIONS.INVOICES_READ)
  async getTenantInvoiceElectronicXmlPreview(
    @Param('slug') slug: string,
    @Param('invoiceId') invoiceId: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<string> {
    try {
      return await this.getTenantInvoiceElectronicXmlPreviewUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
        invoiceId,
      );
    } catch (error) {
      if (
        error instanceof TenantNotFoundError ||
        error instanceof InvoiceNotFoundError ||
        error instanceof CustomerNotFoundError
      ) {
        throw new NotFoundException(error.message);
      }

      if (error instanceof InvoiceElectronicMetadataIncompleteError) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }

  @Post(':slug/invoices/:invoiceId/send-email')
  @RequireTenantPermission(INVOICING_PERMISSIONS.NOTIFICATIONS_SEND)
  async sendTenantInvoiceEmail(
    @Param('slug') slug: string,
    @Param('invoiceId') invoiceId: string,
    @Body() body: SendInvoiceEmailRequestDto,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<{ delivered: true }> {
    try {
      await this.sendTenantInvoiceEmailUseCase.execute({
        tenantSlug: tenantAccess?.tenantSlug ?? slug,
        invoiceId,
        recipientEmail: body.recipientEmail ?? null,
        message: body.message ?? null,
      });

      return { delivered: true };
    } catch (error) {
      if (
        error instanceof TenantNotFoundError ||
        error instanceof InvoiceNotFoundError ||
        error instanceof CustomerNotFoundError
      ) {
        throw new NotFoundException(error.message);
      }

      if (error instanceof CustomerEmailMissingError) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }

  @Post(':slug/invoices/:invoiceId/electronic-document/submit')
  @RequireTenantPermission(INVOICING_PERMISSIONS.INVOICES_MANAGE)
  async submitTenantInvoiceElectronicDocument(
    @Param('slug') slug: string,
    @Param('invoiceId') invoiceId: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<SubmitInvoiceElectronicDocumentResponseDto> {
    try {
      const invoice =
        await this.submitTenantInvoiceElectronicDocumentUseCase.execute({
          tenantSlug: tenantAccess?.tenantSlug ?? slug,
          invoiceId,
        });

      return toSubmitInvoiceElectronicDocumentResponseDto({
        electronicStatus: invoice.electronicStatus,
        accessKey: invoice.accessKey,
        submittedAt: invoice.submittedAt,
        submissionReference: invoice.submissionReference,
      });
    } catch (error) {
      if (
        error instanceof TenantNotFoundError ||
        error instanceof InvoiceNotFoundError
      ) {
        throw new NotFoundException(error.message);
      }

      if (
        error instanceof InvalidInvoiceElectronicSubmissionStateError ||
        error instanceof InvoiceElectronicMetadataIncompleteError ||
        error instanceof InvoiceElectronicSubmissionGatewayIncompleteError ||
        error instanceof InvoiceElectronicSubmissionNotConfiguredError ||
        error instanceof InvoiceElectronicSignatureMaterialIncompleteError ||
        error instanceof InvoiceElectronicSignatureNotConfiguredError ||
        error instanceof InvoiceElectronicSecretResolutionError ||
        error instanceof InvoiceElectronicXmlValidationError
      ) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }

  @Post(':slug/invoices/:invoiceId/electronic-document/check-authorization')
  @RequireTenantPermission(INVOICING_PERMISSIONS.INVOICES_MANAGE)
  async checkTenantInvoiceElectronicAuthorization(
    @Param('slug') slug: string,
    @Param('invoiceId') invoiceId: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<InvoiceDetailResponseDto> {
    try {
      await this.checkTenantInvoiceElectronicAuthorizationUseCase.execute({
        tenantSlug: tenantAccess?.tenantSlug ?? slug,
        invoiceId,
      });

      const detail = await this.getTenantInvoiceDetailUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
        invoiceId,
      );

      return toInvoiceDetailResponseDto(detail);
    } catch (error) {
      if (
        error instanceof TenantNotFoundError ||
        error instanceof InvoiceNotFoundError
      ) {
        throw new NotFoundException(error.message);
      }

      if (error instanceof InvalidInvoiceElectronicAuthorizationStateError) {
        throw new BadRequestException(error.message);
      }

      if (
        error instanceof InvoiceElectronicSubmissionGatewayIncompleteError ||
        error instanceof InvoiceElectronicSubmissionNotConfiguredError ||
        error instanceof InvoiceElectronicSecretResolutionError
      ) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }

  @Post(':slug/invoices/:invoiceId/status')
  @RequireTenantPermission(INVOICING_PERMISSIONS.INVOICES_MANAGE)
  async updateTenantInvoiceStatus(
    @Param('slug') slug: string,
    @Param('invoiceId') invoiceId: string,
    @Body() body: UpdateInvoiceStatusRequestDto,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<InvoiceDetailResponseDto> {
    try {
      await this.updateTenantInvoiceStatusUseCase.execute({
        tenantSlug: tenantAccess?.tenantSlug ?? slug,
        invoiceId,
        status: body.status,
      });

      const invoice = await this.getTenantInvoiceDetailUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
        invoiceId,
      );

      return toInvoiceDetailResponseDto(invoice);
    } catch (error) {
      if (error instanceof TenantNotFoundError || error instanceof InvoiceNotFoundError) {
        throw new NotFoundException(error.message);
      }

      if (error instanceof InvalidInvoiceStatusTransitionError) {
        throw new ConflictException(error.message);
      }

      if (error instanceof InvoiceNotFullySettledError) {
        throw new ConflictException(error.message);
      }

      throw error;
    }
  }

  @Post(':slug/invoices/:invoiceId/electronic-status')
  @RequireTenantPermission(INVOICING_PERMISSIONS.INVOICES_MANAGE)
  async updateTenantInvoiceElectronicStatus(
    @Param('slug') slug: string,
    @Param('invoiceId') invoiceId: string,
    @Body() body: UpdateInvoiceElectronicStatusRequestDto,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<InvoiceDetailResponseDto> {
    try {
      await this.updateTenantInvoiceElectronicStatusUseCase.execute({
        tenantSlug: tenantAccess?.tenantSlug ?? slug,
        invoiceId,
        electronicStatus: body.electronicStatus ?? null,
        accessKey: body.accessKey ?? null,
        authorizationNumber: body.authorizationNumber ?? null,
        authorizedAt: body.authorizedAt ? new Date(body.authorizedAt) : null,
        electronicStatusMessage: body.electronicStatusMessage ?? null,
      });

      const detail = await this.getTenantInvoiceDetailUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
        invoiceId,
      );

      return toInvoiceDetailResponseDto(detail);
    } catch (error) {
      if (
        error instanceof TenantNotFoundError ||
        error instanceof InvoiceNotFoundError
      ) {
        throw new NotFoundException(error.message);
      }

      if (
        error instanceof InvalidInvoiceElectronicStatusError ||
        error instanceof InvoiceAuthorizationDataRequiredError ||
        error instanceof InvoiceElectronicMetadataIncompleteError
      ) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }

  @Post(':slug/invoices')
  @RequireTenantPermission(INVOICING_PERMISSIONS.INVOICES_MANAGE)
  async createTenantInvoice(
    @Param('slug') slug: string,
    @Body() body: CreateInvoiceRequestDto,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<InvoiceDetailResponseDto> {
    try {
      const invoice = await this.createTenantInvoiceUseCase.execute({
        tenantSlug: tenantAccess?.tenantSlug ?? slug,
        customerId: body.customerId,
        number: body.number?.trim() || undefined,
        currency: body.currency,
        status: body.status,
        issuedAt: body.issuedAt ? new Date(body.issuedAt) : undefined,
        dueAt: body.dueAt ? new Date(body.dueAt) : null,
        notes: body.notes ?? null,
      });

      return toInvoiceDetailResponseDto({
        invoice,
        items: [],
        payments: [],
        electronicEvents: [],
        totals: {
          subtotalInCents: 0,
          taxInCents: 0,
          totalInCents: 0,
        },
        settlement: {
          paidInCents: 0,
          balanceDueInCents: 0,
          isFullyPaid: false,
        },
      });
    } catch (error) {
      if (
        error instanceof TenantNotFoundError ||
        error instanceof CustomerNotFoundError
      ) {
        throw new NotFoundException(error.message);
      }

      if (error instanceof InvoiceNumberRequiredError) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/invoices/:invoiceId/items')
  @RequireTenantPermission(INVOICING_PERMISSIONS.INVOICES_READ)
  async listTenantInvoiceItems(
    @Param('slug') slug: string,
    @Param('invoiceId') invoiceId: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<InvoiceItemResponseDto[]> {
    try {
      const items = await this.listTenantInvoiceItemsUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
        invoiceId,
      );

      return items.map((item) => toInvoiceItemResponseDto(item));
    } catch (error) {
      if (
        error instanceof TenantNotFoundError ||
        error instanceof InvoiceNotFoundError
      ) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/invoices/:invoiceId/items/:itemId')
  @RequireTenantPermission(INVOICING_PERMISSIONS.INVOICES_READ)
  async getTenantInvoiceItemById(
    @Param('slug') slug: string,
    @Param('invoiceId') invoiceId: string,
    @Param('itemId') itemId: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<InvoiceItemResponseDto> {
    try {
      const item = await this.getTenantInvoiceItemByIdUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
        invoiceId,
        itemId,
      );

      return toInvoiceItemResponseDto(item);
    } catch (error) {
      if (
        error instanceof TenantNotFoundError ||
        error instanceof InvoiceNotFoundError ||
        error instanceof InvoiceItemNotFoundError
      ) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/invoices/:invoiceId/payments')
  @RequireTenantPermission(INVOICING_PERMISSIONS.PAYMENTS_READ)
  async listTenantInvoicePayments(
    @Param('slug') slug: string,
    @Param('invoiceId') invoiceId: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<PaymentResponseDto[]> {
    try {
      const payments = await this.listTenantInvoicePaymentsUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
        invoiceId,
      );

      return payments.map((payment) => toPaymentResponseDto(payment));
    } catch (error) {
      if (
        error instanceof TenantNotFoundError ||
        error instanceof InvoiceNotFoundError
      ) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Post(':slug/invoices/:invoiceId/payments')
  @RequireTenantPermission(INVOICING_PERMISSIONS.PAYMENTS_MANAGE)
  async createTenantInvoicePayment(
    @Param('slug') slug: string,
    @Param('invoiceId') invoiceId: string,
    @Body() body: CreateInvoicePaymentRequestDto,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<PaymentResponseDto> {
    try {
      const payment = await this.createTenantInvoicePaymentUseCase.execute({
        tenantSlug: tenantAccess?.tenantSlug ?? slug,
        invoiceId,
        amountInCents: body.amountInCents,
        method: body.method,
        reference: body.reference ?? null,
        paidAt: body.paidAt ? new Date(body.paidAt) : undefined,
        notes: body.notes ?? null,
      });

      return toPaymentResponseDto(payment);
    } catch (error) {
      if (
        error instanceof TenantNotFoundError ||
        error instanceof InvoiceNotFoundError
      ) {
        throw new NotFoundException(error.message);
      }

      if (
        error instanceof InvalidInvoicePaymentStateError ||
        error instanceof InvoicePaymentExceedsBalanceError
      ) {
        throw new ConflictException(error.message);
      }

      throw error;
    }
  }

  @Post(':slug/invoices/:invoiceId/payments/:paymentId/reverse')
  @RequireTenantPermission(INVOICING_PERMISSIONS.PAYMENTS_MANAGE)
  async reverseTenantInvoicePayment(
    @Param('slug') slug: string,
    @Param('invoiceId') invoiceId: string,
    @Param('paymentId') paymentId: string,
    @Body() body: ReverseInvoicePaymentRequestDto,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<PaymentResponseDto> {
    try {
      const payment = await this.reverseTenantInvoicePaymentUseCase.execute({
        tenantSlug: tenantAccess?.tenantSlug ?? slug,
        invoiceId,
        paymentId,
        reason: body.reason ?? null,
      });

      return toPaymentResponseDto(payment);
    } catch (error) {
      if (
        error instanceof TenantNotFoundError ||
        error instanceof InvoiceNotFoundError ||
        error instanceof PaymentNotFoundError
      ) {
        throw new NotFoundException(error.message);
      }

      if (error instanceof InvalidPaymentReversalStateError) {
        throw new ConflictException(error.message);
      }

      throw error;
    }
  }

  @Post(':slug/invoices/:invoiceId/items')
  @RequireTenantPermission(INVOICING_PERMISSIONS.INVOICES_MANAGE)
  async createTenantInvoiceItem(
    @Param('slug') slug: string,
    @Param('invoiceId') invoiceId: string,
    @Body() body: CreateInvoiceItemRequestDto,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<InvoiceItemResponseDto> {
    try {
      const item = await this.createTenantInvoiceItemUseCase.execute({
        tenantSlug: tenantAccess?.tenantSlug ?? slug,
        invoiceId,
        description: body.description,
        quantity: body.quantity,
        unitPriceInCents: body.unitPriceInCents,
        taxRateId: body.taxRateId ?? null,
      });

      return toInvoiceItemResponseDto(item);
    } catch (error) {
      if (
        error instanceof TenantNotFoundError ||
        error instanceof InvoiceNotFoundError ||
        error instanceof TaxRateNotFoundError
      ) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }
}
