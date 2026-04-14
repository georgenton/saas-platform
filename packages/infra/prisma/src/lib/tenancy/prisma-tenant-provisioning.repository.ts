import { Injectable } from '@nestjs/common';
import { TenantProvisioningRepository } from '@saas-platform/tenancy-application';
import { Membership, Tenant } from '@saas-platform/tenancy-domain';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaTenantProvisioningRepository
  implements TenantProvisioningRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async createTenantWithOwner(
    tenant: Tenant,
    membership: Membership,
  ): Promise<void> {
    const tenantData = tenant.toPrimitives();
    const membershipData = membership.toPrimitives();

    await this.prisma.$transaction([
      this.prisma.tenant.create({
        data: {
          id: tenantData.id,
          name: tenantData.name,
          slug: tenantData.slug,
          status: tenantData.status,
          createdAt: tenantData.createdAt,
          updatedAt: tenantData.updatedAt,
        },
      }),
      this.prisma.membership.create({
        data: {
          id: membershipData.id,
          tenantId: membershipData.tenantId,
          userId: membershipData.userId,
          status: membershipData.status,
          invitedBy: membershipData.invitedBy,
          createdAt: membershipData.createdAt,
          updatedAt: membershipData.updatedAt,
        },
      }),
    ]);
  }
}
