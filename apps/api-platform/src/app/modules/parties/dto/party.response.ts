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
  createdAt: string;
  updatedAt: string;
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
    createdAt: data.createdAt.toISOString(),
    updatedAt: data.updatedAt.toISOString(),
  };
};
