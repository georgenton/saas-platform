import { Injectable } from '@nestjs/common';
import { CustomerRepository } from '@saas-platform/invoicing-application';
import { Customer } from '@saas-platform/invoicing-domain';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaCustomerRepository implements CustomerRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(customer: Customer): Promise<void> {
    const data = customer.toPrimitives();

    await this.prisma.customer.upsert({
      where: { id: data.id },
      update: {
        name: data.name,
        email: data.email,
        taxId: data.taxId,
        updatedAt: data.updatedAt,
      },
      create: {
        id: data.id,
        tenantId: data.tenantId,
        name: data.name,
        email: data.email,
        taxId: data.taxId,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
    });
  }

  async findByTenantId(tenantId: string): Promise<Customer[]> {
    const customers = await this.prisma.customer.findMany({
      where: { tenantId },
      orderBy: [{ createdAt: 'asc' }, { name: 'asc' }],
    });

    return customers.map((customer) => this.toDomain(customer));
  }

  async findByTenantIdAndId(
    tenantId: string,
    customerId: string,
  ): Promise<Customer | null> {
    const customer = await this.prisma.customer.findFirst({
      where: {
        id: customerId,
        tenantId,
      },
    });

    return customer ? this.toDomain(customer) : null;
  }

  private toDomain(record: {
    id: string;
    tenantId: string;
    name: string;
    email: string | null;
    taxId: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): Customer {
    return Customer.create({
      id: record.id,
      tenantId: record.tenantId,
      name: record.name,
      email: record.email,
      taxId: record.taxId,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}
