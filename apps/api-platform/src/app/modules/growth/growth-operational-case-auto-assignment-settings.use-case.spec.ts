import {
  GetTenantGrowthOperationalCaseAutoAssignmentSettingsUseCase,
  UpsertTenantGrowthOperationalCaseAutoAssignmentSettingsUseCase,
} from '@saas-platform/growth-application';
import { GrowthOperationalCaseAutoAssignmentSettings } from '@saas-platform/growth-domain';
import {
  TenantNotFoundError,
  TenantRepository,
} from '@saas-platform/tenancy-application';

describe('Growth operational case auto-assignment settings use cases', () => {
  const tenantRepository: jest.Mocked<TenantRepository> = {
    findBySlug: jest.fn(),
  } as unknown as jest.Mocked<TenantRepository>;
  const settingsRepository = {
    findByTenantId: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(() => {
    jest.resetAllMocks();
    tenantRepository.findBySlug.mockResolvedValue({
      id: 'tenant_123',
      slug: 'saas-platform',
    } as any);
    settingsRepository.findByTenantId.mockResolvedValue(null);
    settingsRepository.save.mockResolvedValue(undefined);
  });

  it('synthesizes a balanced default when the tenant has no persisted settings yet', async () => {
    const useCase = new GetTenantGrowthOperationalCaseAutoAssignmentSettingsUseCase(
      tenantRepository,
      settingsRepository as any,
    );

    const result = await useCase.execute('saas-platform');

    expect(result.defaultPolicyKey).toBe('balanced');
    expect(result.id).toBe(
      'tenant_123:growth-operational-case-auto-assignment-settings',
    );
  });

  it('persists an updated default policy for the tenant', async () => {
    const useCase =
      new UpsertTenantGrowthOperationalCaseAutoAssignmentSettingsUseCase(
        tenantRepository,
        settingsRepository as any,
      );

    const result = await useCase.execute({
      tenantSlug: 'saas-platform',
      defaultPolicyKey: 'follow_up_first',
    });

    expect(result.defaultPolicyKey).toBe('follow_up_first');
    expect(settingsRepository.save).toHaveBeenCalledWith(
      expect.any(GrowthOperationalCaseAutoAssignmentSettings),
    );
  });

  it('fails when the tenant slug does not exist', async () => {
    tenantRepository.findBySlug.mockResolvedValue(null);
    const useCase = new GetTenantGrowthOperationalCaseAutoAssignmentSettingsUseCase(
      tenantRepository,
      settingsRepository as any,
    );

    await expect(useCase.execute('missing-tenant')).rejects.toBeInstanceOf(
      TenantNotFoundError,
    );
  });
});
