import { Lead } from '@saas-platform/growth-domain';

export interface LeadResponseDto {
  id: string;
  tenantId: string;
  fullName: string;
  email: string | null;
  phoneE164: string | null;
  whatsappE164: string | null;
  source: string;
  status: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export const toLeadResponseDto = (lead: Lead): LeadResponseDto => {
  const data = lead.toPrimitives();

  return {
    id: data.id,
    tenantId: data.tenantId,
    fullName: data.fullName,
    email: data.email ?? null,
    phoneE164: data.phoneE164 ?? null,
    whatsappE164: data.whatsappE164 ?? null,
    source: data.source,
    status: data.status,
    notes: data.notes ?? null,
    createdAt: data.createdAt.toISOString(),
    updatedAt: data.updatedAt.toISOString(),
  };
};
