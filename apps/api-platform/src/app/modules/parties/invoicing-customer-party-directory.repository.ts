import { CustomerRepository } from '@saas-platform/invoicing-application';
import { Customer } from '@saas-platform/invoicing-domain';
import {
  Party,
  PartyFiscalProfile,
  PartyKind,
  PartyRole,
} from '@saas-platform/parties-domain';

export class InvoicingCustomerPartyDirectoryRepository {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async findByTenantId(tenantId: string): Promise<Party[]> {
    const customers = await this.customerRepository.findByTenantId(tenantId);

    return customers.map((customer) => this.mapCustomerToParty(customer));
  }

  async findByTenantIdAndId(
    tenantId: string,
    partyId: string,
  ): Promise<Party | null> {
    const customer = await this.customerRepository.findByTenantIdAndId(
      tenantId,
      partyId,
    );

    return customer ? this.mapCustomerToParty(customer) : null;
  }

  async applyFiscalCorrection(
    tenantId: string,
    partyId: string,
    correction: {
      taxpayerId?: string | null;
      identificationType?: string | null;
      fiscalAddress?: string | null;
      email?: string | null;
      taxpayerName?: string | null;
      appliedAt: Date;
    },
  ): Promise<Party | null> {
    const customer = await this.customerRepository.findByTenantIdAndId(
      tenantId,
      partyId,
    );

    if (!customer) {
      return null;
    }

    const data = customer.toPrimitives();
    const corrected = Customer.create({
      ...data,
      name: correction.taxpayerName ?? data.name,
      email: correction.email ?? data.email,
      taxId: correction.taxpayerId ?? data.taxId,
      identificationType:
        (correction.identificationType as typeof data.identificationType) ??
        data.identificationType ??
        null,
      identification: correction.taxpayerId ?? data.identification ?? null,
      billingAddress: correction.fiscalAddress ?? data.billingAddress ?? null,
      updatedAt: correction.appliedAt,
    });

    await this.customerRepository.save(corrected);

    return this.mapCustomerToParty(corrected);
  }

  private mapCustomerToParty(customer: Customer): Party {
    const data = customer.toPrimitives();

    return Party.create({
      id: data.id,
      tenantId: data.tenantId,
      displayName: data.name,
      email: data.email ?? null,
      taxId: data.taxId ?? null,
      identificationType: data.identificationType ?? null,
      identification: data.identification ?? null,
      billingAddress: data.billingAddress ?? null,
      roles: ['customer'],
      kind: inferPartyKind(data.identificationType ?? null),
      sourceContext: 'invoicing_customer',
      fiscalProfile: buildEcuadorFiscalProfile({
        displayName: data.name,
        email: data.email ?? null,
        taxId: data.taxId ?? null,
        identificationType: data.identificationType ?? null,
        identification: data.identification ?? null,
        billingAddress: data.billingAddress ?? null,
        roles: ['customer'],
      }),
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }
}

function inferPartyKind(identificationType: string | null): PartyKind {
  if (!identificationType) {
    return 'unknown';
  }

  return identificationType === '04' ? 'organization' : 'person';
}

function buildEcuadorFiscalProfile(input: {
  displayName: string;
  email: string | null;
  taxId: string | null;
  identificationType: string | null;
  identification: string | null;
  billingAddress: string | null;
  roles: PartyRole[];
}): PartyFiscalProfile {
  const taxpayerId = input.taxId ?? input.identification;
  const missingFields = [
    taxpayerId ? null : 'taxpayer_id',
    input.identificationType ? null : 'identification_type',
    input.billingAddress ? null : 'fiscal_address',
    input.email ? null : 'email',
  ].filter((field): field is string => field !== null);

  const reviewNotes = [
    input.taxId && input.identification && input.taxId !== input.identification
      ? 'tax_id_and_identification_do_not_match'
      : null,
    input.identificationType === '04' && taxpayerId && taxpayerId.length !== 13
      ? 'ruc_should_have_13_digits'
      : null,
    input.identificationType === '05' && taxpayerId && taxpayerId.length !== 10
      ? 'cedula_should_have_10_digits'
      : null,
  ].filter((note): note is string => note !== null);

  return {
    country: 'EC',
    taxpayerId,
    taxpayerName: input.displayName,
    identificationType: input.identificationType,
    fiscalAddress: input.billingAddress,
    email: input.email,
    roles: [...input.roles],
    completenessStatus:
      missingFields.length === 0 && reviewNotes.length === 0
        ? 'complete'
        : 'needs_review',
    missingFields,
    reviewNotes,
  };
}
