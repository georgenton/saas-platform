import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  CreateTenantCustomerUseCase,
  CustomerNotFoundError,
  CreateTenantInvoiceUseCase,
  CreateTenantInvoiceItemUseCase,
  GetTenantCustomerByIdUseCase,
  GetTenantInvoiceDetailUseCase,
  GetTenantInvoiceItemByIdUseCase,
  INVOICING_PERMISSIONS,
  ListTenantCustomersUseCase,
  ListTenantInvoiceItemsUseCase,
  ListTenantInvoiceSummariesUseCase,
  InvoiceNotFoundError,
  InvoiceItemNotFoundError,
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
import {
  CustomerResponseDto,
  toCustomerResponseDto,
} from './dto/customer.response';
import {
  InvoiceItemResponseDto,
  toInvoiceItemResponseDto,
} from './dto/invoice-item.response';
import {
  InvoiceDetailResponseDto,
  toInvoiceDetailResponseDto,
} from './dto/invoice-detail.response';
import {
  InvoiceSummaryResponseDto,
  toInvoiceSummaryResponseDto,
} from './dto/invoice-summary.response';

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
    private readonly getTenantCustomerByIdUseCase: GetTenantCustomerByIdUseCase,
    private readonly getTenantInvoiceDetailUseCase: GetTenantInvoiceDetailUseCase,
    private readonly getTenantInvoiceItemByIdUseCase: GetTenantInvoiceItemByIdUseCase,
    private readonly listTenantCustomersUseCase: ListTenantCustomersUseCase,
    private readonly listTenantInvoiceItemsUseCase: ListTenantInvoiceItemsUseCase,
    private readonly listTenantInvoiceSummariesUseCase: ListTenantInvoiceSummariesUseCase,
  ) {}

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
      });

      return toCustomerResponseDto(customer);
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
        number: body.number,
        currency: body.currency,
        status: body.status,
        issuedAt: body.issuedAt ? new Date(body.issuedAt) : undefined,
        dueAt: body.dueAt ? new Date(body.dueAt) : null,
        notes: body.notes ?? null,
      });

      return toInvoiceDetailResponseDto({
        invoice,
        items: [],
        totals: {
          subtotalInCents: 0,
          taxInCents: 0,
          totalInCents: 0,
        },
      });
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
      });

      return toInvoiceItemResponseDto(item);
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
}
