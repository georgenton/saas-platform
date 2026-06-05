import {
  TenantAccountingPeriodControlView,
  TenantAccountingPeriodLockRegistryView,
  TenantAccountingPeriodLockResultView,
  TenantAccountingPeriodReopenPacketView,
} from '@saas-platform/accounting-domain';
import {
  AccountingPeriodLockReadinessResponseDto,
  toAccountingPeriodLockReadinessResponseDto,
} from './accounting-period-lock-readiness.response';

export interface LockAccountingPeriodRequestDto {
  period: string;
  year: number;
  lockedByUserId?: string | null;
  lockedByEmail?: string | null;
  reason?: string | null;
  evidenceReference?: string | null;
}

export interface RequestAccountingPeriodReopenPacketRequestDto {
  period: string;
  year: number;
  decision: 'prepare' | 'reopen';
  reason: string;
  evidenceReference?: string | null;
  reopenedByUserId?: string | null;
  reopenedByEmail?: string | null;
}

export interface AccountingPeriodControlResponseDto {
  id: string;
  tenantId: string;
  tenantSlug: string;
  period: string;
  year: number;
  status: string;
  action: string;
  actionByUserId: string | null;
  actionByEmail: string | null;
  actionAt: string;
  reason: string | null;
  evidenceReference: string | null;
  blockers: string[];
  snapshot: TenantAccountingPeriodControlView['snapshot'];
  impactChecklist: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AccountingPeriodLockRegistryResponseDto {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: string;
  registryStatus: string;
  latestControl: AccountingPeriodControlResponseDto | null;
  controls: AccountingPeriodControlResponseDto[];
  lockReadiness: AccountingPeriodLockReadinessResponseDto;
  summary: TenantAccountingPeriodLockRegistryView['summary'];
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface AccountingPeriodLockResultResponseDto {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: string;
  lockStatus: string;
  control: AccountingPeriodControlResponseDto | null;
  registry: AccountingPeriodLockRegistryResponseDto;
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface AccountingPeriodReopenPacketResponseDto {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: string;
  reopenStatus: string;
  control: AccountingPeriodControlResponseDto | null;
  latestLock: AccountingPeriodControlResponseDto | null;
  impactChecklist: Array<{
    key: string;
    label: string;
    status: string;
    detail: string;
  }>;
  summary: TenantAccountingPeriodReopenPacketView['summary'];
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export function toAccountingPeriodControlResponseDto(
  control: TenantAccountingPeriodControlView,
): AccountingPeriodControlResponseDto {
  return {
    ...control,
    actionAt: control.actionAt.toISOString(),
    blockers: [...control.blockers],
    snapshot: { ...control.snapshot },
    impactChecklist: [...control.impactChecklist],
    createdAt: control.createdAt.toISOString(),
    updatedAt: control.updatedAt.toISOString(),
  };
}

export function toAccountingPeriodLockRegistryResponseDto(
  view: TenantAccountingPeriodLockRegistryView,
): AccountingPeriodLockRegistryResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    period: view.period,
    year: view.year,
    generatedAt: view.generatedAt.toISOString(),
    registryStatus: view.registryStatus,
    latestControl: view.latestControl
      ? toAccountingPeriodControlResponseDto(view.latestControl)
      : null,
    controls: view.controls.map(toAccountingPeriodControlResponseDto),
    lockReadiness: toAccountingPeriodLockReadinessResponseDto(
      view.lockReadiness,
    ),
    summary: { ...view.summary },
    blockers: [...view.blockers],
    nextStep: view.nextStep,
    guardrails: [...view.guardrails],
  };
}

export function toAccountingPeriodLockResultResponseDto(
  view: TenantAccountingPeriodLockResultView,
): AccountingPeriodLockResultResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    period: view.period,
    year: view.year,
    generatedAt: view.generatedAt.toISOString(),
    lockStatus: view.lockStatus,
    control: view.control
      ? toAccountingPeriodControlResponseDto(view.control)
      : null,
    registry: toAccountingPeriodLockRegistryResponseDto(view.registry),
    blockers: [...view.blockers],
    nextStep: view.nextStep,
    guardrails: [...view.guardrails],
  };
}

export function toAccountingPeriodReopenPacketResponseDto(
  view: TenantAccountingPeriodReopenPacketView,
): AccountingPeriodReopenPacketResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    period: view.period,
    year: view.year,
    generatedAt: view.generatedAt.toISOString(),
    reopenStatus: view.reopenStatus,
    control: view.control
      ? toAccountingPeriodControlResponseDto(view.control)
      : null,
    latestLock: view.latestLock
      ? toAccountingPeriodControlResponseDto(view.latestLock)
      : null,
    impactChecklist: view.impactChecklist.map((item) => ({ ...item })),
    summary: { ...view.summary },
    blockers: [...view.blockers],
    nextStep: view.nextStep,
    guardrails: [...view.guardrails],
  };
}
