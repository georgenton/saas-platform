import { Injectable } from '@nestjs/common';
import { TenantRepository } from '@saas-platform/tenancy-application';
import { Tenant, TenantStatus } from '@saas-platform/tenancy-domain';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaTenantRepository implements TenantRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(tenant: Tenant): Promise<void> {
    const data = tenant.toPrimitives();

    await this.prisma.tenant.upsert({
      where: { id: data.id },
      update: {
        name: data.name,
        slug: data.slug,
        status: data.status,
        updatedAt: data.updatedAt,
      },
      create: {
        id: data.id,
        name: data.name,
        slug: data.slug,
        status: data.status,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
    });
  }

  async findById(id: string): Promise<Tenant | null> {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id },
    });

    return tenant ? this.toDomain(tenant) : null;
  }

  async findBySlug(slug: string): Promise<Tenant | null> {
    const tenant = await this.prisma.tenant.findUnique({
      where: { slug },
    });

    return tenant ? this.toDomain(tenant) : null;
  }

  private toDomain(record: {
    id: string;
    name: string;
    slug: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
  }): Tenant {
    return Tenant.create({
      id: record.id,
      name: record.name,
      slug: record.slug,
      status: record.status as TenantStatus,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}
