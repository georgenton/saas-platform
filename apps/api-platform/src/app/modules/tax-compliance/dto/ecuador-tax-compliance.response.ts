import {
  EcuadorTaxObligationMatrixView,
  EcuadorTaxObligationView,
  EcuadorTaxPeriodPreparationPacketView,
  EcuadorTaxpayerProfileView,
} from '@saas-platform/tax-compliance-domain';

export interface EcuadorTaxpayerProfileResponseDto {
  tenantSlug: string;
  tenantId: string;
  generatedAt: string;
  country: string;
  legalName: string;
  commercialName: string | null;
  taxpayerId: string | null;
  regime: string;
  accountingObligated: boolean | null;
  specialTaxpayerCode: string | null;
  matrixAddress: string | null;
  establishmentAddress: string | null;
  source: string;
  readinessStatus: string;
  missingFields: string[];
  reviewNotes: string[];
  thirdPartyFiscalSummary: {
    totalParties: number;
    completeParties: number;
    needsReviewParties: number;
    missingFieldCounts: Record<string, number>;
  };
}

export interface EcuadorTaxObligationResponseDto {
  key: string;
  label: string;
  applies: boolean;
  frequency: string;
  source: string;
  readinessStatus: string;
  dependsOn: string[];
  notes: string[];
}

export interface EcuadorTaxObligationMatrixResponseDto {
  tenantSlug: string;
  generatedAt: string;
  taxpayerProfile: EcuadorTaxpayerProfileResponseDto;
  obligations: EcuadorTaxObligationResponseDto[];
  guardrails: string[];
}

export interface EcuadorTaxPeriodPreparationPacketResponseDto {
  tenantSlug: string;
  period: string;
  generatedAt: string;
  taxpayerProfile: EcuadorTaxpayerProfileResponseDto;
  obligations: EcuadorTaxObligationResponseDto[];
  readinessStatus: string;
  evidenceChecklist: string[];
  accountantHandoff: {
    recommended: boolean;
    reason: string;
    packetSummary: string;
  };
  blockedBy: string[];
  nextStep: string;
  guardrails: string[];
}

export function toEcuadorTaxpayerProfileResponseDto(
  profile: EcuadorTaxpayerProfileView,
): EcuadorTaxpayerProfileResponseDto {
  return {
    tenantSlug: profile.tenantSlug,
    tenantId: profile.tenantId,
    generatedAt: profile.generatedAt.toISOString(),
    country: profile.country,
    legalName: profile.legalName,
    commercialName: profile.commercialName,
    taxpayerId: profile.taxpayerId,
    regime: profile.regime,
    accountingObligated: profile.accountingObligated,
    specialTaxpayerCode: profile.specialTaxpayerCode,
    matrixAddress: profile.matrixAddress,
    establishmentAddress: profile.establishmentAddress,
    source: profile.source,
    readinessStatus: profile.readinessStatus,
    missingFields: [...profile.missingFields],
    reviewNotes: [...profile.reviewNotes],
    thirdPartyFiscalSummary: {
      totalParties: profile.thirdPartyFiscalSummary.totalParties,
      completeParties: profile.thirdPartyFiscalSummary.completeParties,
      needsReviewParties: profile.thirdPartyFiscalSummary.needsReviewParties,
      missingFieldCounts: {
        ...profile.thirdPartyFiscalSummary.missingFieldCounts,
      },
    },
  };
}

export function toEcuadorTaxObligationResponseDto(
  obligation: EcuadorTaxObligationView,
): EcuadorTaxObligationResponseDto {
  return {
    key: obligation.key,
    label: obligation.label,
    applies: obligation.applies,
    frequency: obligation.frequency,
    source: obligation.source,
    readinessStatus: obligation.readinessStatus,
    dependsOn: [...obligation.dependsOn],
    notes: [...obligation.notes],
  };
}

export function toEcuadorTaxObligationMatrixResponseDto(
  matrix: EcuadorTaxObligationMatrixView,
): EcuadorTaxObligationMatrixResponseDto {
  return {
    tenantSlug: matrix.tenantSlug,
    generatedAt: matrix.generatedAt.toISOString(),
    taxpayerProfile: toEcuadorTaxpayerProfileResponseDto(
      matrix.taxpayerProfile,
    ),
    obligations: matrix.obligations.map((obligation) =>
      toEcuadorTaxObligationResponseDto(obligation),
    ),
    guardrails: [...matrix.guardrails],
  };
}

export function toEcuadorTaxPeriodPreparationPacketResponseDto(
  packet: EcuadorTaxPeriodPreparationPacketView,
): EcuadorTaxPeriodPreparationPacketResponseDto {
  return {
    tenantSlug: packet.tenantSlug,
    period: packet.period,
    generatedAt: packet.generatedAt.toISOString(),
    taxpayerProfile: toEcuadorTaxpayerProfileResponseDto(
      packet.taxpayerProfile,
    ),
    obligations: packet.obligations.map((obligation) =>
      toEcuadorTaxObligationResponseDto(obligation),
    ),
    readinessStatus: packet.readinessStatus,
    evidenceChecklist: [...packet.evidenceChecklist],
    accountantHandoff: { ...packet.accountantHandoff },
    blockedBy: [...packet.blockedBy],
    nextStep: packet.nextStep,
    guardrails: [...packet.guardrails],
  };
}
