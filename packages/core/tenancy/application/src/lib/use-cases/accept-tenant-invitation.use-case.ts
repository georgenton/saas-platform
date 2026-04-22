import { UserNotFoundError, UserRepository } from '@saas-platform/identity-application';
import {
  InvitationStatus,
  Membership,
  MembershipStatus,
} from '@saas-platform/tenancy-domain';
import { InvitationAlreadyProcessedError } from '../errors/invitation-already-processed.error';
import { InvitationEmailMismatchError } from '../errors/invitation-email-mismatch.error';
import { InvitationExpiredError } from '../errors/invitation-expired.error';
import { InvitationNotFoundError } from '../errors/invitation-not-found.error';
import { MembershipAlreadyExistsError } from '../errors/membership-already-exists.error';
import { InvitationAcceptanceRepository } from '../ports/invitation-acceptance.repository';
import { InvitationRepository } from '../ports/invitation.repository';
import { MembershipIdGenerator } from '../ports/membership-id.generator';
import { MembershipRepository } from '../ports/membership.repository';
import { TenantRepository } from '../ports/tenant.repository';

export interface AcceptTenantInvitationCommand {
  invitationId: string;
  authenticatedUserId: string;
  authenticatedUserEmail: string;
}

export class AcceptTenantInvitationUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly userRepository: UserRepository,
    private readonly membershipRepository: MembershipRepository,
    private readonly invitationRepository: InvitationRepository,
    private readonly invitationAcceptanceRepository: InvitationAcceptanceRepository,
    private readonly membershipIdGenerator: MembershipIdGenerator,
  ) {}

  async execute(command: AcceptTenantInvitationCommand): Promise<Membership> {
    const invitation = await this.invitationRepository.findById(
      command.invitationId,
    );

    if (!invitation) {
      throw new InvitationNotFoundError(command.invitationId);
    }

    if (invitation.status !== InvitationStatus.Pending) {
      throw new InvitationAlreadyProcessedError(command.invitationId);
    }

    const now = new Date();

    if (invitation.expiresAt.getTime() < now.getTime()) {
      await this.invitationRepository.save(invitation.expire(now));
      throw new InvitationExpiredError(command.invitationId);
    }

    if (
      invitation.email !== command.authenticatedUserEmail.trim().toLowerCase()
    ) {
      throw new InvitationEmailMismatchError(command.invitationId);
    }

    const user = await this.userRepository.findById(command.authenticatedUserId);

    if (!user) {
      throw new UserNotFoundError(command.authenticatedUserId);
    }

    const tenant = await this.tenantRepository.findById(invitation.tenantId);

    if (!tenant) {
      throw new InvitationNotFoundError(command.invitationId);
    }

    const existingMembership =
      await this.membershipRepository.findByTenantAndUser(
        invitation.tenantId,
        command.authenticatedUserId,
      );

    if (existingMembership) {
      throw new MembershipAlreadyExistsError(
        tenant.slug,
        command.authenticatedUserId,
      );
    }

    const membership = Membership.create({
      id: this.membershipIdGenerator.generate(),
      tenantId: invitation.tenantId,
      userId: command.authenticatedUserId,
      status: MembershipStatus.Active,
      invitedBy: invitation.invitedByUserId,
      createdAt: now,
      updatedAt: now,
    });

    await this.invitationAcceptanceRepository.acceptInvitation(
      invitation.accept(now, command.authenticatedUserId),
      membership,
    );

    return membership;
  }
}
