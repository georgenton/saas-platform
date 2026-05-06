import { Injectable } from '@nestjs/common';
import { ElectronicSignatureSettingsRepository } from '@saas-platform/invoicing-application';
import {
  ElectronicSignatureStorageMode,
  ElectronicSignatureProvider,
  ElectronicSignatureSettings,
} from '@saas-platform/invoicing-domain';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaElectronicSignatureSettingsRepository
  implements ElectronicSignatureSettingsRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async save(settings: ElectronicSignatureSettings): Promise<void> {
    const data = settings.toPrimitives();

    await this.prisma.electronicSignatureSettings.upsert({
      where: { tenantId: data.tenantId },
      update: {
        provider: data.provider,
        certificateLabel: data.certificateLabel,
        storageMode: data.storageMode,
        certificateFingerprint: data.certificateFingerprint,
        pkcs12SecretRef: data.pkcs12SecretRef,
        privateKeyPasswordSecretRef: data.privateKeyPasswordSecretRef,
        subjectName: data.subjectName,
        isActive: data.isActive,
        updatedAt: data.updatedAt,
      },
      create: {
        id: data.id,
        tenantId: data.tenantId,
        provider: data.provider,
        certificateLabel: data.certificateLabel,
        storageMode: data.storageMode,
        certificateFingerprint: data.certificateFingerprint,
        pkcs12SecretRef: data.pkcs12SecretRef,
        privateKeyPasswordSecretRef: data.privateKeyPasswordSecretRef,
        subjectName: data.subjectName,
        isActive: data.isActive,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
    });
  }

  async findByTenantId(
    tenantId: string,
  ): Promise<ElectronicSignatureSettings | null> {
    const record = await this.prisma.electronicSignatureSettings.findUnique({
      where: { tenantId },
    });

    return record ? this.toDomain(record) : null;
  }

  private toDomain(record: {
    id: string;
    tenantId: string;
    provider: string;
    certificateLabel: string;
    storageMode: string;
    certificateFingerprint: string | null;
    pkcs12SecretRef: string | null;
    privateKeyPasswordSecretRef: string | null;
    subjectName: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): ElectronicSignatureSettings {
    return ElectronicSignatureSettings.create({
      id: record.id,
      tenantId: record.tenantId,
      provider: record.provider as ElectronicSignatureProvider,
      certificateLabel: record.certificateLabel,
      storageMode: record.storageMode as ElectronicSignatureStorageMode,
      certificateFingerprint: record.certificateFingerprint,
      pkcs12SecretRef: record.pkcs12SecretRef,
      privateKeyPasswordSecretRef: record.privateKeyPasswordSecretRef,
      subjectName: record.subjectName,
      isActive: record.isActive,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}
