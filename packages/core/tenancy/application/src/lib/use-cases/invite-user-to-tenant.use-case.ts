import {
  Invitation,
  InvitationStatus,
} from '@saas-platform/tenancy-domain';
import { InvitationAlreadyExistsError } from '../errors/invitation-already-exists.error';
import { InvitationIdGenerator } from '../ports/invitation-id.generator';
import { InvitationRepository } from '../ports/invitation.repository';
import { TenantRepository } from '../ports/tenant.repository';
import { TENANT_ROLES } from '../roles/tenant-roles';
import { TenantNotFoundError } from '../errors/tenant-not-found.error';

export interface InviteUserToTenantCommand {
  tenantSlug: string;
  email: string;
  invitedByUserId: string;
}

export class InviteUserToTenantUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly invitationRepository: InvitationRepository,
    private readonly invitationIdGenerator: InvitationIdGenerator,
  ) {}

  async execute(command: InviteUserToTenantCommand): Promise<Invitation> {
    const tenant = await this.tenantRepository.findBySlug(command.tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(command.tenantSlug);
    }

    const normalizedEmail = command.email.trim().toLowerCase();
    const existingInvitation =
      await this.invitationRepository.findPendingByTenantAndEmail(
        tenant.id,
        normalizedEmail,
      );

    if (existingInvitation) {
      throw new InvitationAlreadyExistsError(command.tenantSlug, normalizedEmail);
    }

    const invitation = Invitation.create({
      id: this.invitationIdGenerator.generate(),
      tenantId: tenant.id,
      email: normalizedEmail,
      roleKey: TENANT_ROLES.MEMBER,
      status: InvitationStatus.Pending,
      invitedByUserId: command.invitedByUserId,
      acceptedByUserId: null,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      acceptedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.invitationRepository.save(invitation);

    return invitation;
  }
}
