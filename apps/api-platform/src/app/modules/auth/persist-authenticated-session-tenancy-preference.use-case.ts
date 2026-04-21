import {
  UserNotFoundError,
  UserRepository,
} from '@saas-platform/identity-application';
import { ListUserTenanciesUseCase } from '@saas-platform/tenancy-application';
import { AuthenticatedSessionTenantNotFoundError } from './authenticated-session-tenant-not-found.error';

export interface PersistAuthenticatedSessionTenancyPreferenceCommand {
  authenticatedUserId: string;
  tenantSlug?: string | null;
}

export class PersistAuthenticatedSessionTenancyPreferenceUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly listUserTenanciesUseCase: ListUserTenanciesUseCase,
  ) {}

  async execute(
    command: PersistAuthenticatedSessionTenancyPreferenceCommand,
  ): Promise<void> {
    const user = await this.userRepository.findById(command.authenticatedUserId);

    if (!user) {
      throw new UserNotFoundError(command.authenticatedUserId);
    }

    let preferredTenantId: string | null = null;

    if (command.tenantSlug) {
      const tenancies = await this.listUserTenanciesUseCase.execute(user.id);
      const selectedTenancy = tenancies.find(
        (tenancy) => tenancy.tenant.slug === command.tenantSlug,
      );

      if (!selectedTenancy) {
        throw new AuthenticatedSessionTenantNotFoundError(command.tenantSlug);
      }

      preferredTenantId = selectedTenancy.tenant.id;
    }

    await this.userRepository.save(
      user.setPreferredTenant(new Date(), preferredTenantId),
    );
  }
}
