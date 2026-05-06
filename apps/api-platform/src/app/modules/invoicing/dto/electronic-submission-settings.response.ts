import { ElectronicSubmissionSettings } from '@saas-platform/invoicing-domain';

export interface ElectronicSubmissionSettingsResponseDto {
  id: string;
  tenantId: string;
  provider: string;
  environment: string;
  transmissionMode: string;
  receptionUrl: string | null;
  authorizationUrl: string | null;
  credentialsSecretRef: string | null;
  timeoutMs: number;
  gatewayConfigured: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const toElectronicSubmissionSettingsResponseDto = (
  settings: ElectronicSubmissionSettings,
): ElectronicSubmissionSettingsResponseDto => {
  const data = settings.toPrimitives();

  return {
    id: data.id,
    tenantId: data.tenantId,
    provider: data.provider,
    environment: data.environment,
    transmissionMode: data.transmissionMode,
    receptionUrl: data.receptionUrl,
    authorizationUrl: data.authorizationUrl,
    credentialsSecretRef: data.credentialsSecretRef,
    timeoutMs: data.timeoutMs,
    gatewayConfigured: settings.hasGatewayConfigured(),
    isActive: data.isActive,
    createdAt: data.createdAt.toISOString(),
    updatedAt: data.updatedAt.toISOString(),
  };
};
