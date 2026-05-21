import { WhatsappMessageTemplate } from '@saas-platform/growth-domain';

export interface PersistedWhatsappTemplateRenderSnapshot {
  templateId: string;
  templateKey: string;
  templateName: string;
  templateLanguageCode: string;
  templateCategory: string;
  templateBodyTemplate: string;
  templateIntentKey: string | null;
  providerTemplateName: string | null;
  providerApprovalStatus: string;
  templateStatus: string;
  renderedBody: string;
  bodyParameterValues: string[];
  templateVariables: Record<string, string>;
}

export const buildPersistedWhatsappTemplateRenderSnapshot = (
  template: WhatsappMessageTemplate,
  renderedBody: string,
  bodyParameterValues: string[],
  templateVariables: Record<string, string | number | boolean | null>,
): PersistedWhatsappTemplateRenderSnapshot => {
  const data = template.toPrimitives();

  return {
    templateId: data.id,
    templateKey: data.key,
    templateName: data.name,
    templateLanguageCode: data.languageCode,
    templateCategory: data.category,
    templateBodyTemplate: data.bodyTemplate,
    templateIntentKey: data.intentKey,
    providerTemplateName: data.providerTemplateName,
    providerApprovalStatus: data.providerApprovalStatus,
    templateStatus: data.status,
    renderedBody,
    bodyParameterValues: [...bodyParameterValues],
    templateVariables: Object.fromEntries(
      Object.entries(templateVariables)
        .filter(([, value]) => value !== undefined && value !== null)
        .map(([key, value]) => [key, String(value)]),
    ),
  };
};

export const serializeWhatsappTemplateRenderSnapshot = (
  snapshot: PersistedWhatsappTemplateRenderSnapshot,
): string => JSON.stringify(snapshot);

export const parseWhatsappTemplateRenderSnapshot = (
  serializedSnapshot: string | null | undefined,
): PersistedWhatsappTemplateRenderSnapshot | null => {
  if (!serializedSnapshot?.trim()) {
    return null;
  }

  const parsed = JSON.parse(
    serializedSnapshot,
  ) as PersistedWhatsappTemplateRenderSnapshot;

  if (
    !parsed ||
    typeof parsed.templateId !== 'string' ||
    typeof parsed.templateKey !== 'string' ||
    typeof parsed.templateName !== 'string' ||
    typeof parsed.templateLanguageCode !== 'string' ||
    typeof parsed.templateCategory !== 'string' ||
    typeof parsed.templateBodyTemplate !== 'string' ||
    typeof parsed.providerApprovalStatus !== 'string' ||
    typeof parsed.templateStatus !== 'string' ||
    typeof parsed.renderedBody !== 'string' ||
    !Array.isArray(parsed.bodyParameterValues) ||
    typeof parsed.templateVariables !== 'object' ||
    parsed.templateVariables === null
  ) {
    return null;
  }

  return parsed;
};
