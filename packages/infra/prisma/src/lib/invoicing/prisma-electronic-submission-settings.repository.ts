import { Injectable } from '@nestjs/common';
import { ElectronicSubmissionSettingsRepository } from '@saas-platform/invoicing-application';
import {
  ElectronicSubmissionEnvironment,
  ElectronicSubmissionProvider,
  ElectronicSubmissionSettings,
  ElectronicSubmissionTransmissionMode,
} from '@saas-platform/invoicing-domain';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaElectronicSubmissionSettingsRepository
  implements ElectronicSubmissionSettingsRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async save(settings: ElectronicSubmissionSettings): Promise<void> {
    const data = settings.toPrimitives();

    await this.prisma.electronicSubmissionSettings.upsert({
      where: { tenantId: data.tenantId },
      update: {
        provider: data.provider,
        environment: data.environment,
        transmissionMode: data.transmissionMode,
        receptionUrl: data.receptionUrl,
        authorizationUrl: data.authorizationUrl,
        credentialsSecretRef: data.credentialsSecretRef,
        timeoutMs: data.timeoutMs,
        isActive: data.isActive,
        updatedAt: data.updatedAt,
      },
      create: {
        id: data.id,
        tenantId: data.tenantId,
        provider: data.provider,
        environment: data.environment,
        transmissionMode: data.transmissionMode,
        receptionUrl: data.receptionUrl,
        authorizationUrl: data.authorizationUrl,
        credentialsSecretRef: data.credentialsSecretRef,
        timeoutMs: data.timeoutMs,
        isActive: data.isActive,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
    });
  }

  async findByTenantId(
    tenantId: string,
  ): Promise<ElectronicSubmissionSettings | null> {
    const record = await this.prisma.electronicSubmissionSettings.findUnique({
      where: { tenantId },
    });

    return record ? this.toDomain(record) : null;
  }

  private toDomain(record: {
    id: string;
    tenantId: string;
    provider: string;
    environment: string;
    transmissionMode: string;
    receptionUrl: string | null;
    authorizationUrl: string | null;
    credentialsSecretRef: string | null;
    timeoutMs: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): ElectronicSubmissionSettings {
    return ElectronicSubmissionSettings.create({
      id: record.id,
      tenantId: record.tenantId,
      provider: record.provider as ElectronicSubmissionProvider,
      environment: record.environment as ElectronicSubmissionEnvironment,
      transmissionMode:
        record.transmissionMode as ElectronicSubmissionTransmissionMode,
      receptionUrl: record.receptionUrl,
      authorizationUrl: record.authorizationUrl,
      credentialsSecretRef: record.credentialsSecretRef,
      timeoutMs: record.timeoutMs,
      isActive: record.isActive,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}
