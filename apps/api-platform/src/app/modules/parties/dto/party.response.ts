import { Party } from '@saas-platform/parties-domain';

export interface PartyResponseDto {
  id: string;
  tenantId: string;
  displayName: string;
  email: string | null;
  taxId: string | null;
  identificationType: string | null;
  identification: string | null;
  billingAddress: string | null;
  roles: string[];
  kind: string;
  sourceContext: string;
  fiscalProfile: PartyFiscalProfileResponseDto | null;
  createdAt: string;
  updatedAt: string;
}

export interface PartyFiscalProfileResponseDto {
  country: string;
  taxpayerId: string | null;
  taxpayerName: string;
  identificationType: string | null;
  fiscalAddress: string | null;
  email: string | null;
  roles: string[];
  completenessStatus: string;
  missingFields: string[];
  reviewNotes: string[];
}

export const toPartyResponseDto = (party: Party): PartyResponseDto => {
  const data = party.toPrimitives();

  return {
    id: data.id,
    tenantId: data.tenantId,
    displayName: data.displayName,
    email: data.email ?? null,
    taxId: data.taxId ?? null,
    identificationType: data.identificationType ?? null,
    identification: data.identification ?? null,
    billingAddress: data.billingAddress ?? null,
    roles: [...data.roles],
    kind: data.kind,
    sourceContext: data.sourceContext,
    fiscalProfile: data.fiscalProfile
      ? {
          country: data.fiscalProfile.country,
          taxpayerId: data.fiscalProfile.taxpayerId,
          taxpayerName: data.fiscalProfile.taxpayerName,
          identificationType: data.fiscalProfile.identificationType,
          fiscalAddress: data.fiscalProfile.fiscalAddress,
          email: data.fiscalProfile.email,
          roles: [...data.fiscalProfile.roles],
          completenessStatus: data.fiscalProfile.completenessStatus,
          missingFields: [...data.fiscalProfile.missingFields],
          reviewNotes: [...data.fiscalProfile.reviewNotes],
        }
      : null,
    createdAt: data.createdAt.toISOString(),
    updatedAt: data.updatedAt.toISOString(),
  };
};
