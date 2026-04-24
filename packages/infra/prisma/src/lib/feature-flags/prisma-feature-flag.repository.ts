import { Injectable } from '@nestjs/common';
import { FeatureFlagRepository } from '@saas-platform/feature-flags-application';
import { FeatureFlag } from '@saas-platform/feature-flags-domain';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaFeatureFlagRepository implements FeatureFlagRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByTenantId(tenantId: string): Promise<FeatureFlag[]> {
    const featureFlags = await this.prisma.featureFlag.findMany({
      where: { tenantId },
      orderBy: [{ key: 'asc' }],
    });

    return featureFlags.map((featureFlag) => this.toDomain(featureFlag));
  }

  async upsert(input: {
    tenantId: string;
    key: string;
    enabled: boolean;
  }): Promise<FeatureFlag> {
    const id = `feature_flag_${input.tenantId}_${input.key}`;

    const featureFlag = await this.prisma.featureFlag.upsert({
      where: {
        tenantId_key: {
          tenantId: input.tenantId,
          key: input.key,
        },
      },
      create: {
        id,
        tenantId: input.tenantId,
        key: input.key,
        enabled: input.enabled,
      },
      update: {
        enabled: input.enabled,
      },
    });

    return this.toDomain(featureFlag);
  }

  private toDomain(featureFlag: {
    id: string;
    tenantId: string;
    key: string;
    enabled: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): FeatureFlag {
    return FeatureFlag.create({
      id: featureFlag.id,
      tenantId: featureFlag.tenantId,
      key: featureFlag.key,
      enabled: featureFlag.enabled,
      createdAt: featureFlag.createdAt,
      updatedAt: featureFlag.updatedAt,
    });
  }
}
