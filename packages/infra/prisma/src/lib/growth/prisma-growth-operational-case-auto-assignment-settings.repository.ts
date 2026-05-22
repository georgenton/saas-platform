import { Injectable } from '@nestjs/common';
import { GrowthOperationalCaseAutoAssignmentSettingsRepository } from '@saas-platform/growth-application';
import {
  GrowthOperationalCaseAutoAssignmentPolicyKey,
  GrowthOperationalCaseAutoAssignmentSettings,
} from '@saas-platform/growth-domain';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaGrowthOperationalCaseAutoAssignmentSettingsRepository
  implements GrowthOperationalCaseAutoAssignmentSettingsRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async save(
    settings: GrowthOperationalCaseAutoAssignmentSettings,
  ): Promise<void> {
    const data = settings.toPrimitives();

    await (this.prisma as any).growthOperationalCaseAutoAssignmentSettings.upsert({
      where: { tenantId: data.tenantId },
      update: {
        defaultPolicyKey: data.defaultPolicyKey,
        updatedAt: data.updatedAt,
      },
      create: {
        id: data.id,
        tenantId: data.tenantId,
        defaultPolicyKey: data.defaultPolicyKey,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
    });
  }

  async findByTenantId(
    tenantId: string,
  ): Promise<GrowthOperationalCaseAutoAssignmentSettings | null> {
    const record = await (this.prisma as any).growthOperationalCaseAutoAssignmentSettings.findUnique({
      where: { tenantId },
    });

    return record ? this.toDomain(record) : null;
  }

  private toDomain(record: {
    id: string;
    tenantId: string;
    defaultPolicyKey: string;
    createdAt: Date;
    updatedAt: Date;
  }): GrowthOperationalCaseAutoAssignmentSettings {
    return GrowthOperationalCaseAutoAssignmentSettings.create({
      id: record.id,
      tenantId: record.tenantId,
      defaultPolicyKey:
        record.defaultPolicyKey as GrowthOperationalCaseAutoAssignmentPolicyKey,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}
