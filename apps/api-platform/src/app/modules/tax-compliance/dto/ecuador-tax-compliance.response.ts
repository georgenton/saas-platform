import {
  EcuadorTaxObligationMatrixView,
  EcuadorTaxObligationCalendarView,
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

export interface EcuadorTaxCalendarEntryResponseDto {
  obligationKey: string;
  label: string;
  period: string;
  frequency: string;
  dueDate: string | null;
  dueDay: number | null;
  source: string;
  readinessStatus: string;
  notes: string[];
}

export interface EcuadorTaxObligationCalendarResponseDto {
  tenantSlug: string;
  year: number;
  generatedAt: string;
  taxpayerProfile: EcuadorTaxpayerProfileResponseDto;
  ninthDigit: string | null;
  entries: EcuadorTaxCalendarEntryResponseDto[];
  guardrails: string[];
}

export interface EcuadorTaxEvidenceSummaryResponseDto {
  invoicing: {
    invoiceCount: number;
    statusBreakdown: Array<{ status: string; count: number }>;
    totalsByCurrency: Array<{
      currency: string;
      subtotalInCents: number;
      taxInCents: number;
      totalInCents: number;
      paidInCents: number;
      outstandingTotalInCents: number;
    }>;
    monthlyTotals: Array<{
      month: string;
      currency: string;
      invoiceCount: number;
      totalInCents: number;
      taxInCents: number;
    }>;
  };
  parties: {
    totalParties: number;
    completeParties: number;
    needsReviewParties: number;
    issueSummaries: Array<{ issue: string; count: number }>;
    incompletePartyIds: string[];
  };
  ecommerce: {
    status: string;
    notes: string[];
  };
}

export interface EcuadorTaxPeriodPreparationPacketResponseDto {
  tenantSlug: string;
  period: string;
  generatedAt: string;
  taxpayerProfile: EcuadorTaxpayerProfileResponseDto;
  obligations: EcuadorTaxObligationResponseDto[];
  readinessStatus: string;
  evidenceSummary: EcuadorTaxEvidenceSummaryResponseDto;
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

export function toEcuadorTaxObligationCalendarResponseDto(
  calendar: EcuadorTaxObligationCalendarView,
): EcuadorTaxObligationCalendarResponseDto {
  return {
    tenantSlug: calendar.tenantSlug,
    year: calendar.year,
    generatedAt: calendar.generatedAt.toISOString(),
    taxpayerProfile: toEcuadorTaxpayerProfileResponseDto(
      calendar.taxpayerProfile,
    ),
    ninthDigit: calendar.ninthDigit,
    entries: calendar.entries.map((entry) => ({
      obligationKey: entry.obligationKey,
      label: entry.label,
      period: entry.period,
      frequency: entry.frequency,
      dueDate: entry.dueDate,
      dueDay: entry.dueDay,
      source: entry.source,
      readinessStatus: entry.readinessStatus,
      notes: [...entry.notes],
    })),
    guardrails: [...calendar.guardrails],
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
    evidenceSummary: {
      invoicing: {
        invoiceCount: packet.evidenceSummary.invoicing.invoiceCount,
        statusBreakdown:
          packet.evidenceSummary.invoicing.statusBreakdown.map((status) => ({
            status: status.status,
            count: status.count,
          })),
        totalsByCurrency:
          packet.evidenceSummary.invoicing.totalsByCurrency.map((total) => ({
            currency: total.currency,
            subtotalInCents: total.subtotalInCents,
            taxInCents: total.taxInCents,
            totalInCents: total.totalInCents,
            paidInCents: total.paidInCents,
            outstandingTotalInCents: total.outstandingTotalInCents,
          })),
        monthlyTotals:
          packet.evidenceSummary.invoicing.monthlyTotals.map((month) => ({
            month: month.month,
            currency: month.currency,
            invoiceCount: month.invoiceCount,
            totalInCents: month.totalInCents,
            taxInCents: month.taxInCents,
          })),
      },
      parties: {
        totalParties: packet.evidenceSummary.parties.totalParties,
        completeParties: packet.evidenceSummary.parties.completeParties,
        needsReviewParties:
          packet.evidenceSummary.parties.needsReviewParties,
        issueSummaries: packet.evidenceSummary.parties.issueSummaries.map(
          (issue) => ({
            issue: issue.issue,
            count: issue.count,
          }),
        ),
        incompletePartyIds: [
          ...packet.evidenceSummary.parties.incompletePartyIds,
        ],
      },
      ecommerce: {
        status: packet.evidenceSummary.ecommerce.status,
        notes: [...packet.evidenceSummary.ecommerce.notes],
      },
    },
    evidenceChecklist: [...packet.evidenceChecklist],
    accountantHandoff: { ...packet.accountantHandoff },
    blockedBy: [...packet.blockedBy],
    nextStep: packet.nextStep,
    guardrails: [...packet.guardrails],
  };
}
