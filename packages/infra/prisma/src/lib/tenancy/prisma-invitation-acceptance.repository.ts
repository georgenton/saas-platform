import { Injectable } from '@nestjs/common';
import { InvitationAcceptanceRepository } from '@saas-platform/tenancy-application';
import { Invitation, Membership } from '@saas-platform/tenancy-domain';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaInvitationAcceptanceRepository
  implements InvitationAcceptanceRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async acceptInvitation(
    invitation: Invitation,
    membership: Membership,
  ): Promise<void> {
    const invitationData = invitation.toPrimitives();
    const membershipData = membership.toPrimitives();

    const role = await this.prisma.role.findUnique({
      where: { key: invitationData.roleKey },
    });

    if (!role) {
      throw new Error(`Role "${invitationData.roleKey}" was not found.`);
    }

    await this.prisma.$transaction([
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
      this.prisma.membershipRole.create({
        data: {
          id: `${membershipData.id}:${role.id}`,
          membershipId: membershipData.id,
          roleId: role.id,
          createdAt: membershipData.createdAt,
        },
      }),
      this.prisma.invitation.update({
        where: { id: invitationData.id },
        data: {
          status: invitationData.status,
          acceptedByUserId: invitationData.acceptedByUserId,
          acceptedAt: invitationData.acceptedAt,
          updatedAt: invitationData.updatedAt,
        },
      }),
    ]);
  }
}
