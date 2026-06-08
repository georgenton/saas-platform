import {
  AiClinicsCloseoutGrowthBridgeReviewView,
  AiClinicsDomainContractRegistryView,
  AiClinicsGuardrailApprovalPackView,
} from '@saas-platform/ai-domain';

function toIsoString(value: Date | string): string {
  return value instanceof Date ? value.toISOString() : value;
}

export type AiClinicsDomainContractRegistryResponseDto =
  Omit<AiClinicsDomainContractRegistryView, 'generatedAt'> & {
    generatedAt: string;
  };

export type AiClinicsGuardrailApprovalPackResponseDto =
  Omit<AiClinicsGuardrailApprovalPackView, 'generatedAt'> & {
    generatedAt: string;
  };

export type AiClinicsCloseoutGrowthBridgeReviewResponseDto =
  Omit<AiClinicsCloseoutGrowthBridgeReviewView, 'generatedAt'> & {
    generatedAt: string;
  };

export const toAiClinicsDomainContractRegistryResponseDto = (
  view: AiClinicsDomainContractRegistryView,
): AiClinicsDomainContractRegistryResponseDto => ({
  ...view,
  generatedAt: toIsoString(view.generatedAt),
  templates: view.templates.map((template) => ({
    ...template,
    surfaces: template.surfaces.map((surface) => ({
      ...surface,
      blockedCapabilities: [...surface.blockedCapabilities],
    })),
  })),
  notes: [...view.notes],
});

export const toAiClinicsGuardrailApprovalPackResponseDto = (
  view: AiClinicsGuardrailApprovalPackView,
): AiClinicsGuardrailApprovalPackResponseDto => ({
  ...view,
  generatedAt: toIsoString(view.generatedAt),
  guardrails: view.guardrails.map((entry) => ({
    ...entry,
    blockedCapabilities: [...entry.blockedCapabilities],
  })),
  approvalPolicy: { ...view.approvalPolicy },
  notes: [...view.notes],
});

export const toAiClinicsCloseoutGrowthBridgeReviewResponseDto = (
  view: AiClinicsCloseoutGrowthBridgeReviewView,
): AiClinicsCloseoutGrowthBridgeReviewResponseDto => ({
  ...view,
  generatedAt: toIsoString(view.generatedAt),
  products: view.products.map((entry) => ({
    ...entry,
    evidence: [...entry.evidence],
    remainingWork: [...entry.remainingWork],
  })),
  decision: { ...view.decision },
  notes: [...view.notes],
});
