import { TenantNotFoundError, TenantRepository } from '@saas-platform/tenancy-application';
import { Lead, LeadStatus } from '@saas-platform/growth-domain';
import { LeadIdGenerator } from '../ports/lead-id.generator';
import { LeadRepository } from '../ports/lead.repository';

export interface CreateTenantLeadInput {
  tenantSlug: string;
  fullName: string;
  email?: string | null;
  phoneE164?: string | null;
  whatsappE164?: string | null;
  source?: string | null;
  status?: LeadStatus | null;
  notes?: string | null;
}

export class CreateTenantLeadUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly leadRepository: LeadRepository,
    private readonly leadIdGenerator: LeadIdGenerator,
  ) {}

  async execute(input: CreateTenantLeadInput): Promise<Lead> {
    const tenant = await this.tenantRepository.findBySlug(input.tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(input.tenantSlug);
    }

    const now = new Date();
    const lead = Lead.create({
      id: this.leadIdGenerator.generate(),
      tenantId: tenant.id,
      fullName: input.fullName.trim(),
      email: this.normalizeEmail(input.email),
      phoneE164: this.normalizeOptionalValue(input.phoneE164),
      whatsappE164: this.normalizeOptionalValue(input.whatsappE164),
      source: this.normalizeOptionalValue(input.source) ?? 'manual_capture',
      status: input.status ?? 'captured',
      notes: this.normalizeOptionalValue(input.notes),
      createdAt: now,
      updatedAt: now,
    });

    await this.leadRepository.save(lead);

    return lead;
  }

  private normalizeEmail(value?: string | null): string | null {
    const normalizedValue = this.normalizeOptionalValue(value);

    return normalizedValue ? normalizedValue.toLowerCase() : null;
  }

  private normalizeOptionalValue(value?: string | null): string | null {
    const normalizedValue = value?.trim();

    return normalizedValue ? normalizedValue : null;
  }
}
