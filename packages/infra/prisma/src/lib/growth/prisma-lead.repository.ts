import { Injectable } from '@nestjs/common';
import { LeadRepository } from '@saas-platform/growth-application';
import { Lead, LeadStatus } from '@saas-platform/growth-domain';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaLeadRepository implements LeadRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(lead: Lead): Promise<void> {
    const data = lead.toPrimitives();

    await this.prismaClient.lead.upsert({
      where: { id: data.id },
      update: {
        fullName: data.fullName,
        email: data.email,
        phoneE164: data.phoneE164,
        whatsappE164: data.whatsappE164,
        source: data.source,
        status: data.status,
        notes: data.notes,
        updatedAt: data.updatedAt,
      },
      create: {
        id: data.id,
        tenantId: data.tenantId,
        fullName: data.fullName,
        email: data.email,
        phoneE164: data.phoneE164,
        whatsappE164: data.whatsappE164,
        source: data.source,
        status: data.status,
        notes: data.notes,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
    });
  }

  async findByTenantId(tenantId: string): Promise<Lead[]> {
    const leads = await this.prismaClient.lead.findMany({
      where: { tenantId },
      orderBy: [{ createdAt: 'desc' }, { fullName: 'asc' }],
    });

    return leads.map((lead) => this.toDomain(lead));
  }

  async findByTenantIdAndId(
    tenantId: string,
    leadId: string,
  ): Promise<Lead | null> {
    const lead = await this.prismaClient.lead.findFirst({
      where: {
        id: leadId,
        tenantId,
      },
    });

    return lead ? this.toDomain(lead) : null;
  }

  private toDomain(record: {
    id: string;
    tenantId: string;
    fullName: string;
    email: string | null;
    phoneE164: string | null;
    whatsappE164: string | null;
    source: string;
    status: string;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): Lead {
    return Lead.create({
      id: record.id,
      tenantId: record.tenantId,
      fullName: record.fullName,
      email: record.email,
      phoneE164: record.phoneE164,
      whatsappE164: record.whatsappE164,
      source: record.source,
      status: record.status as LeadStatus,
      notes: record.notes,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  private get prismaClient(): PrismaClient {
    return this.prisma as PrismaClient;
  }
}
