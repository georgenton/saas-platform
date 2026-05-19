import { Injectable } from '@nestjs/common';
import {
  OpportunityRepository,
} from '@saas-platform/growth-application';
import {
  Opportunity,
  OpportunityStage,
} from '@saas-platform/growth-domain';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaOpportunityRepository implements OpportunityRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(opportunity: Opportunity): Promise<void> {
    const data = opportunity.toPrimitives();

    await this.prismaClient.opportunity.upsert({
      where: { id: data.id },
      update: {
        leadId: data.leadId,
        threadId: data.threadId,
        assigneeUserId: data.assigneeUserId,
        title: data.title,
        stage: data.stage,
        amountInCents: data.amountInCents,
        currency: data.currency,
        notes: data.notes,
        closedAt: data.closedAt,
        updatedAt: data.updatedAt,
      },
      create: {
        id: data.id,
        tenantId: data.tenantId,
        leadId: data.leadId,
        threadId: data.threadId,
        assigneeUserId: data.assigneeUserId,
        title: data.title,
        stage: data.stage,
        amountInCents: data.amountInCents,
        currency: data.currency,
        notes: data.notes,
        closedAt: data.closedAt,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
    });
  }

  async findByTenantId(
    tenantId: string,
    assigneeUserId?: string | null,
  ): Promise<Opportunity[]> {
    const opportunities = await this.prismaClient.opportunity.findMany({
      where: {
        tenantId,
        ...(assigneeUserId ? { assigneeUserId } : {}),
      },
      orderBy: [{ updatedAt: 'desc' }, { createdAt: 'desc' }],
    });

    return opportunities.map((opportunity) => this.toDomain(opportunity));
  }

  async findByTenantIdAndId(
    tenantId: string,
    opportunityId: string,
  ): Promise<Opportunity | null> {
    const opportunity = await this.prismaClient.opportunity.findFirst({
      where: {
        id: opportunityId,
        tenantId,
      },
    });

    return opportunity ? this.toDomain(opportunity) : null;
  }

  private toDomain(record: {
    id: string;
    tenantId: string;
    leadId: string | null;
    threadId: string | null;
    assigneeUserId: string | null;
    title: string;
    stage: string;
    amountInCents: number | null;
    currency: string | null;
    notes: string | null;
    closedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }): Opportunity {
    return Opportunity.create({
      id: record.id,
      tenantId: record.tenantId,
      leadId: record.leadId,
      threadId: record.threadId,
      assigneeUserId: record.assigneeUserId,
      title: record.title,
      stage: record.stage as OpportunityStage,
      amountInCents: record.amountInCents,
      currency: record.currency,
      notes: record.notes,
      closedAt: record.closedAt,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  private get prismaClient(): PrismaService {
    return this.prisma;
  }
}
