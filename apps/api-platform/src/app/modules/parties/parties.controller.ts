import {
  Controller,
  Get,
  NotFoundException,
  Param,
  UseGuards,
} from '@nestjs/common';
import { INVOICING_PERMISSIONS } from '@saas-platform/invoicing-application';
import {
  GetTenantPartyByIdUseCase,
  GetTenantPartyFiscalCleanupPacketUseCase,
  GetTenantPartyFiscalCleanupWorkspaceUseCase,
  GetTenantPartyFiscalReadinessSummaryUseCase,
  ListTenantPartiesUseCase,
  PartyNotFoundError,
} from '@saas-platform/parties-application';
import { TenantNotFoundError } from '@saas-platform/tenancy-application';
import { JwtAuthenticationGuard } from '../auth/jwt-authentication.guard';
import { RequireTenantPermission } from '../tenancy/require-tenant-permission.decorator';
import { RequireTenantProductAccess } from '../tenancy/require-tenant-product-access.decorator';
import { TenantAccess } from '../tenancy/tenant-access.decorator';
import { TenantMembershipGuard } from '../tenancy/tenant-membership.guard';
import { TenantPermissionGuard } from '../tenancy/tenant-permission.guard';
import { TenantProductAccessGuard } from '../tenancy/tenant-product-access.guard';
import {
  PartyFiscalReadinessSummaryResponseDto,
  PartyFiscalCleanupPacketResponseDto,
  PartyFiscalCleanupWorkspaceResponseDto,
  PartyResponseDto,
  toPartyFiscalCleanupPacketResponseDto,
  toPartyFiscalCleanupWorkspaceResponseDto,
  toPartyFiscalReadinessSummaryResponseDto,
  toPartyResponseDto,
} from './dto/party.response';

type TenantAccessContext = {
  tenantSlug?: string;
};

@Controller('parties/tenants')
@UseGuards(
  JwtAuthenticationGuard,
  TenantMembershipGuard,
  TenantPermissionGuard,
  TenantProductAccessGuard,
)
@RequireTenantProductAccess({ productKey: 'invoicing' })
export class PartiesController {
  constructor(
    private readonly listTenantPartiesUseCase: ListTenantPartiesUseCase,
    private readonly getTenantPartyByIdUseCase: GetTenantPartyByIdUseCase,
    private readonly getTenantPartyFiscalReadinessSummaryUseCase: GetTenantPartyFiscalReadinessSummaryUseCase,
    private readonly getTenantPartyFiscalCleanupWorkspaceUseCase: GetTenantPartyFiscalCleanupWorkspaceUseCase,
    private readonly getTenantPartyFiscalCleanupPacketUseCase: GetTenantPartyFiscalCleanupPacketUseCase,
  ) {}

  @Get(':slug/parties')
  @RequireTenantPermission(INVOICING_PERMISSIONS.CUSTOMERS_READ)
  async listTenantParties(
    @Param('slug') slug: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<PartyResponseDto[]> {
    try {
      const parties = await this.listTenantPartiesUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
      );

      return parties.map((party) => toPartyResponseDto(party));
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/fiscal-readiness-summary')
  @RequireTenantPermission(INVOICING_PERMISSIONS.CUSTOMERS_READ)
  async getTenantPartyFiscalReadinessSummary(
    @Param('slug') slug: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<PartyFiscalReadinessSummaryResponseDto> {
    try {
      const summary =
        await this.getTenantPartyFiscalReadinessSummaryUseCase.execute(
          tenantAccess?.tenantSlug ?? slug,
        );

      return toPartyFiscalReadinessSummaryResponseDto(summary);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/fiscal-cleanup-workspace')
  @RequireTenantPermission(INVOICING_PERMISSIONS.CUSTOMERS_READ)
  async getTenantPartyFiscalCleanupWorkspace(
    @Param('slug') slug: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<PartyFiscalCleanupWorkspaceResponseDto> {
    try {
      const workspace =
        await this.getTenantPartyFiscalCleanupWorkspaceUseCase.execute(
          tenantAccess?.tenantSlug ?? slug,
        );

      return toPartyFiscalCleanupWorkspaceResponseDto(workspace);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/fiscal-cleanup-workspace/:partyId/packet')
  @RequireTenantPermission(INVOICING_PERMISSIONS.CUSTOMERS_READ)
  async getTenantPartyFiscalCleanupPacket(
    @Param('slug') slug: string,
    @Param('partyId') partyId: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<PartyFiscalCleanupPacketResponseDto> {
    try {
      const packet =
        await this.getTenantPartyFiscalCleanupPacketUseCase.execute({
          tenantSlug: tenantAccess?.tenantSlug ?? slug,
          partyId,
        });

      return toPartyFiscalCleanupPacketResponseDto(packet);
    } catch (error) {
      if (
        error instanceof TenantNotFoundError ||
        error instanceof PartyNotFoundError
      ) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/parties/:partyId')
  @RequireTenantPermission(INVOICING_PERMISSIONS.CUSTOMERS_READ)
  async getTenantPartyById(
    @Param('slug') slug: string,
    @Param('partyId') partyId: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<PartyResponseDto> {
    try {
      const party = await this.getTenantPartyByIdUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
        partyId,
      );

      return toPartyResponseDto(party);
    } catch (error) {
      if (
        error instanceof TenantNotFoundError ||
        error instanceof PartyNotFoundError
      ) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }
}
