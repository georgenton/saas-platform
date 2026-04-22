import { Injectable } from '@nestjs/common';
import {
  InvitationRepository,
} from '@saas-platform/tenancy-application';
import { Invitation, InvitationStatus } from '@saas-platform/tenancy-domain';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaInvitationRepository implements InvitationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(invitation: Invitation): Promise<void> {
    const data = invitation.toPrimitives();

    await this.prisma.invitation.upsert({
      where: { id: data.id },
      update: {
        email: data.email,
        roleKey: data.roleKey,
        status: data.status,
        invitedByUserId: data.invitedByUserId,
        acceptedByUserId: data.acceptedByUserId,
        expiresAt: data.expiresAt,
        acceptedAt: data.acceptedAt,
        updatedAt: data.updatedAt,
      },
      create: {
        id: data.id,
        tenantId: data.tenantId,
        email: data.email,
        roleKey: data.roleKey,
        status: data.status,
        invitedByUserId: data.invitedByUserId,
        acceptedByUserId: data.acceptedByUserId,
        expiresAt: data.expiresAt,
        acceptedAt: data.acceptedAt,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
    });
  }

  async findById(id: string): Promise<Invitation | null> {
    const invitation = await this.prisma.invitation.findUnique({
      where: { id },
    });

    return invitation ? this.toDomain(invitation) : null;
  }

  async findPendingByTenantAndEmail(
    tenantId: string,
    email: string,
  ): Promise<Invitation | null> {
    const invitation = await this.prisma.invitation.findFirst({
      where: {
        tenantId,
        email: email.trim().toLowerCase(),
        status: InvitationStatus.Pending,
      },
      orderBy: { createdAt: 'desc' },
    });

    return invitation ? this.toDomain(invitation) : null;
  }

  private toDomain(record: {
    id: string;
    tenantId: string;
    email: string;
    roleKey: string;
    status: string;
    invitedByUserId: string;
    acceptedByUserId: string | null;
    expiresAt: Date;
    acceptedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }): Invitation {
    return Invitation.create({
      id: record.id,
      tenantId: record.tenantId,
      email: record.email,
      roleKey: record.roleKey,
      status: record.status as InvitationStatus,
      invitedByUserId: record.invitedByUserId,
      acceptedByUserId: record.acceptedByUserId,
      expiresAt: record.expiresAt,
      acceptedAt: record.acceptedAt,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}
