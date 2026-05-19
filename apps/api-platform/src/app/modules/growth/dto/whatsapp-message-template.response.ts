import { WhatsappMessageTemplate } from '@saas-platform/growth-domain';

export interface WhatsappMessageTemplateResponseDto {
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
  createdAt: string;
  updatedAt: string;
}

export const toWhatsappMessageTemplateResponseDto = (
  template: WhatsappMessageTemplate,
): WhatsappMessageTemplateResponseDto => {
  const data = template.toPrimitives();

  return {
    id: data.id,
    tenantId: data.tenantId,
    key: data.key,
    name: data.name,
    languageCode: data.languageCode,
    category: data.category,
    bodyTemplate: data.bodyTemplate,
    intentKey: data.intentKey ?? null,
    providerTemplateName: data.providerTemplateName ?? null,
    providerApprovalStatus: data.providerApprovalStatus,
    status: data.status,
    createdAt: data.createdAt.toISOString(),
    updatedAt: data.updatedAt.toISOString(),
  };
};
