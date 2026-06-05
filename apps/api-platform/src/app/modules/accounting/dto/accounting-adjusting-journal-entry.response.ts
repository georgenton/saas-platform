import { TenantAccountingAdjustingJournalEntryCreationResultView } from '@saas-platform/accounting-domain';
import {
  AccountingJournalEntryResponseDto,
  toAccountingJournalEntryResponseDto,
} from './accounting-journal-registry.response';

export interface CreateAccountingAdjustingJournalEntryRequestDto {
  period: string;
  year: number;
  adjustmentType:
    | 'reclassification'
    | 'rounding'
    | 'accrual'
    | 'manual_adjustment';
  label: string;
  currency?: string | null;
  lines: Array<{
    lineKey: string;
    accountCode: string;
    accountName: string;
    debitInCents: number;
    creditInCents: number;
    sourceEntryKey: string;
    accountHint: string;
    notes: string[];
  }>;
  reviewerUserId?: string | null;
  reviewerEmail?: string | null;
  note?: string | null;
}

export interface AccountingAdjustingJournalEntryCreationResultResponseDto {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: string;
  creationStatus: string;
  createdEntry: AccountingJournalEntryResponseDto | null;
  adjustmentType: string;
  summary: {
    lineCount: number;
    totalDebitInCents: number;
    totalCreditInCents: number;
    balanced: boolean;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export function toAccountingAdjustingJournalEntryCreationResultResponseDto(
  view: TenantAccountingAdjustingJournalEntryCreationResultView,
): AccountingAdjustingJournalEntryCreationResultResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    period: view.period,
    year: view.year,
    generatedAt: view.generatedAt.toISOString(),
    creationStatus: view.creationStatus,
    createdEntry: view.createdEntry
      ? toAccountingJournalEntryResponseDto(view.createdEntry)
      : null,
    adjustmentType: view.adjustmentType,
    summary: { ...view.summary },
    blockers: [...view.blockers],
    nextStep: view.nextStep,
    guardrails: [...view.guardrails],
  };
}
