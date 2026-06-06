import {
  AccountingBankReconciliationControlEventType,
  AccountingBankReconciliationControlStatus,
  TenantAccountingBankReconciliationControlView,
} from '@saas-platform/accounting-domain';
import {
  TenantNotFoundError,
  TenantRepository,
} from '@saas-platform/tenancy-application';
import { AccountingBankReconciliationControlRepository } from '../ports/accounting-bank-reconciliation-control.repository';
import { AccountingBankReconciliationControlIdGenerator } from '../ports/id-generators';

export class RecordTenantAccountingBankReconciliationControlUseCase {
  constructor(
    private readonly accountingBankReconciliationControlRepository: AccountingBankReconciliationControlRepository,
    private readonly accountingBankReconciliationControlIdGenerator: AccountingBankReconciliationControlIdGenerator,
    private readonly tenantRepository: TenantRepository,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
    eventType: AccountingBankReconciliationControlEventType;
    status: AccountingBankReconciliationControlStatus;
    source: string;
    actorUserId?: string | null;
    actorEmail?: string | null;
    reason?: string | null;
    evidenceReference?: string | null;
    payload: Record<string, string | number | boolean | null>;
    blockers?: string[];
    impactChecklist?: string[];
  }): Promise<TenantAccountingBankReconciliationControlView> {
    const tenant = await this.tenantRepository.findBySlug(input.tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(input.tenantSlug);
    }

    return this.accountingBankReconciliationControlRepository.save({
      id: this.accountingBankReconciliationControlIdGenerator.nextId(),
      tenantId: tenant.id,
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      eventType: input.eventType,
      status: input.status,
      source: input.source,
      actorUserId: input.actorUserId ?? null,
      actorEmail: input.actorEmail ?? null,
      occurredAt: this.nowProvider(),
      reason: input.reason ?? null,
      evidenceReference: input.evidenceReference ?? null,
      payload: input.payload,
      blockers: input.blockers ?? [],
      impactChecklist: input.impactChecklist ?? [],
    });
  }
}
