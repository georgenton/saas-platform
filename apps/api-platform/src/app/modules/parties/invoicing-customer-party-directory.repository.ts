import { CustomerRepository } from '@saas-platform/invoicing-application';
import { Customer } from '@saas-platform/invoicing-domain';
import { Party, PartyKind } from '@saas-platform/parties-domain';

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
