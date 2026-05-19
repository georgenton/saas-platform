import { Injectable } from '@nestjs/common';
import { WhatsappMessageTemplateRepository } from '@saas-platform/growth-application';
import {
  WhatsappMessageTemplate,
  WhatsappMessageTemplateCategory,
} from '@saas-platform/growth-domain';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaWhatsappMessageTemplateRepository
  implements WhatsappMessageTemplateRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async save(template: WhatsappMessageTemplate): Promise<void> {
    const data = template.toPrimitives();

    await this.whatsappMessageTemplateDelegate.upsert({
      where: { id: data.id },
      update: {
        key: data.key,
        name: data.name,
        languageCode: data.languageCode,
        category: data.category,
        bodyTemplate: data.bodyTemplate,
        intentKey: data.intentKey,
        providerTemplateName: data.providerTemplateName,
        providerApprovalStatus: data.providerApprovalStatus,
        status: data.status,
        updatedAt: data.updatedAt,
      },
      create: {
        id: data.id,
        tenantId: data.tenantId,
        key: data.key,
        name: data.name,
        languageCode: data.languageCode,
        category: data.category,
        bodyTemplate: data.bodyTemplate,
        intentKey: data.intentKey,
        providerTemplateName: data.providerTemplateName,
        providerApprovalStatus: data.providerApprovalStatus,
        status: data.status,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
    });
  }

  async findByTenantId(tenantId: string): Promise<WhatsappMessageTemplate[]> {
    const templates = await this.whatsappMessageTemplateDelegate.findMany({
      where: { tenantId },
      orderBy: [{ createdAt: 'desc' }],
    });

    return templates.map((template) => this.toDomain(template as any));
  }

  async findByTenantIdAndId(
    tenantId: string,
    templateId: string,
  ): Promise<WhatsappMessageTemplate | null> {
    const template = await this.whatsappMessageTemplateDelegate.findFirst({
      where: {
        tenantId,
        id: templateId,
      },
    });

    return template ? this.toDomain(template as any) : null;
  }

  async findByTenantIdAndKey(
    tenantId: string,
    key: string,
  ): Promise<WhatsappMessageTemplate | null> {
    const template = await this.whatsappMessageTemplateDelegate.findFirst({
      where: {
        tenantId,
        key,
      },
    });

    return template ? this.toDomain(template as any) : null;
  }

  private toDomain(record: {
    id: string;
    tenantId: string;
    key: string;
    name: string;
    languageCode: string;
    category: string;
    bodyTemplate: string;
    intentKey: string | null;
    providerTemplateName: string | null;
    providerApprovalStatus: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
  }): WhatsappMessageTemplate {
    return WhatsappMessageTemplate.create({
      id: record.id,
      tenantId: record.tenantId,
      key: record.key,
      name: record.name,
      languageCode: record.languageCode,
      category: record.category as WhatsappMessageTemplateCategory,
      bodyTemplate: record.bodyTemplate,
      intentKey: record.intentKey,
      providerTemplateName: record.providerTemplateName,
      providerApprovalStatus:
        record.providerApprovalStatus as
          | 'draft'
          | 'pending_review'
          | 'approved'
          | 'rejected',
      status: record.status as 'active' | 'archived',
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  private get prismaClient(): PrismaService {
    return this.prisma;
  }

  private get whatsappMessageTemplateDelegate(): any {
    return (this.prismaClient as any).whatsappMessageTemplate;
  }
}
