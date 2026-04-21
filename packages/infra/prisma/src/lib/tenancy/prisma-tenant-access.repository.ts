import { Injectable } from '@nestjs/common';
import {
  TenantAccessRecord,
  TenantAccessRepository,
} from '@saas-platform/tenancy-application';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaTenantAccessRepository implements TenantAccessRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByTenantAndUser(
    tenantId: string,
    userId: string,
  ): Promise<TenantAccessRecord | null> {
    const membership = await this.prisma.membership.findFirst({
      where: {
        tenantId,
        userId,
      },
      include: {
        membershipRoles: {
          include: {
            role: {
              include: {
                rolePermissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!membership) {
      return null;
    }

    const roleKeys = membership.membershipRoles.map(
      (membershipRole) => membershipRole.role.key,
    );
    const permissionKeys = membership.membershipRoles.flatMap((membershipRole) =>
      membershipRole.role.rolePermissions.map(
        (rolePermission) => rolePermission.permission.key,
      ),
    );

    return {
      membershipId: membership.id,
      membershipStatus: membership.status,
      roleKeys: [...new Set(roleKeys)],
      permissionKeys: [...new Set(permissionKeys)],
    };
  }
}
