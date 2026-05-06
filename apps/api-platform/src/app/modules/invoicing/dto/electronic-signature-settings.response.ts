import { ElectronicSignatureSettings } from '@saas-platform/invoicing-domain';

export interface ElectronicSignatureSettingsResponseDto {
  id: string;
  tenantId: string;
  provider: string;
  certificateLabel: string;
  storageMode: string;
  certificateFingerprint: string | null;
  pkcs12SecretRef: string | null;
  privateKeyPasswordSecretRef: string | null;
  subjectName: string | null;
  materialConfigured: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const toElectronicSignatureSettingsResponseDto = (
  settings: ElectronicSignatureSettings,
): ElectronicSignatureSettingsResponseDto => {
  const data = settings.toPrimitives();

  return {
    id: data.id,
    tenantId: data.tenantId,
    provider: data.provider,
    certificateLabel: data.certificateLabel,
    storageMode: data.storageMode,
    certificateFingerprint: data.certificateFingerprint,
    pkcs12SecretRef: data.pkcs12SecretRef,
    privateKeyPasswordSecretRef: data.privateKeyPasswordSecretRef,
    subjectName: data.subjectName,
    materialConfigured: settings.hasSigningMaterialConfigured(),
    isActive: data.isActive,
    createdAt: data.createdAt.toISOString(),
    updatedAt: data.updatedAt.toISOString(),
  };
};
