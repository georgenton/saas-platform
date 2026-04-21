import { Injectable } from '@nestjs/common';
import {
  MembershipRoleRepository,
  RoleNotFoundError,
} from '@saas-platform/tenancy-application';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaMembershipRoleRepository implements MembershipRoleRepository {
  constructor(private readonly prisma: PrismaService) {}

  async assignRole(
    membershipId: string,
    roleKey: string,
    assignedAt: Date,
  ): Promise<void> {
    const role = await this.prisma.role.findUnique({
      where: { key: roleKey },
      select: { id: true },
    });

    if (!role) {
      throw new RoleNotFoundError(roleKey);
    }

    await this.prisma.membershipRole.upsert({
      where: {
        membershipId_roleId: {
          membershipId,
          roleId: role.id,
        },
      },
      create: {
        id: `${membershipId}:${role.id}`,
        membershipId,
        roleId: role.id,
        createdAt: assignedAt,
      },
      update: {},
    });
  }

  async countMembershipsWithRole(
    tenantId: string,
    roleKey: string,
  ): Promise<number> {
    return this.prisma.membershipRole.count({
      where: {
        role: {
          key: roleKey,
        },
        membership: {
          tenantId,
        },
      },
    });
  }

  async hasRole(membershipId: string, roleKey: string): Promise<boolean> {
    const membershipRole = await this.prisma.membershipRole.findFirst({
      where: {
        membershipId,
        role: {
          key: roleKey,
        },
      },
      select: { id: true },
    });

    return Boolean(membershipRole);
  }

  async removeRole(membershipId: string, roleKey: string): Promise<void> {
    const role = await this.prisma.role.findUnique({
      where: { key: roleKey },
      select: { id: true },
    });

    if (!role) {
      throw new RoleNotFoundError(roleKey);
    }

    await this.prisma.membershipRole.deleteMany({
      where: {
        membershipId,
        roleId: role.id,
      },
    });
  }
}
