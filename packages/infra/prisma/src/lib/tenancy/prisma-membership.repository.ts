import { Injectable } from '@nestjs/common';
import { MembershipRepository } from '@saas-platform/tenancy-application';
import { Membership, MembershipStatus } from '@saas-platform/tenancy-domain';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaMembershipRepository implements MembershipRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(membership: Membership): Promise<void> {
    const data = membership.toPrimitives();

    await this.prisma.membership.upsert({
      where: { id: data.id },
      update: {
        status: data.status,
        invitedBy: data.invitedBy,
        updatedAt: data.updatedAt,
      },
      create: {
        id: data.id,
        tenantId: data.tenantId,
        userId: data.userId,
        status: data.status,
        invitedBy: data.invitedBy,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
    });
  }

  async findByTenantAndUser(
    tenantId: string,
    userId: string,
  ): Promise<Membership | null> {
    const membership = await this.prisma.membership.findFirst({
      where: { tenantId, userId },
    });

    return membership ? this.toDomain(membership) : null;
  }

  private toDomain(record: {
    id: string;
    tenantId: string;
    userId: string;
    status: string;
    invitedBy: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): Membership {
    return Membership.create({
      id: record.id,
      tenantId: record.tenantId,
      userId: record.userId,
      status: record.status as MembershipStatus,
      invitedBy: record.invitedBy,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}
