import {
  EcuadorTaxPartiesPersistenceDecisionPackView,
  EcuadorTaxReadinessStatus,
} from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxPartyFiscalValidationLedgerUseCase } from './get-tenant-ecuador-tax-party-fiscal-validation-ledger.use-case';
import { RecordTenantEcuadorTaxComplianceEventUseCase } from './record-tenant-ecuador-tax-compliance-event.use-case';
import { RequestTenantEcuadorTaxComplianceHardeningCloseoutV4UseCase } from './request-tenant-ecuador-tax-compliance-hardening-closeout-v4.use-case';

export class RequestTenantEcuadorTaxPartiesPersistenceDecisionPackUseCase {
  constructor(
    private readonly requestTenantEcuadorTaxComplianceHardeningCloseoutV4UseCase: RequestTenantEcuadorTaxComplianceHardeningCloseoutV4UseCase,
    private readonly getTenantEcuadorTaxPartyFiscalValidationLedgerUseCase: GetTenantEcuadorTaxPartyFiscalValidationLedgerUseCase,
    private readonly recordTenantEcuadorTaxComplianceEventUseCase: RecordTenantEcuadorTaxComplianceEventUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
    recordEvent?: boolean;
  }): Promise<EcuadorTaxPartiesPersistenceDecisionPackView> {
    const [closeout, ledger] = await Promise.all([
      this.requestTenantEcuadorTaxComplianceHardeningCloseoutV4UseCase.execute(
        input,
      ),
      this.getTenantEcuadorTaxPartyFiscalValidationLedgerUseCase.execute({
        ...input,
        recordEvent: false,
      }),
    ]);
    const duplicateGroupCount =
      closeout.partyEvidenceBridge.summary.duplicateGroupCount;
    const blockedForDeclarationsCount =
      closeout.partyEvidenceBridge.summary.blockedForDeclarationsCount;
    const validationDiscrepancyCount = ledger.summary.discrepancyCount;
    const accountantQuestionCount =
      closeout.accountantReviewFromPartyRisks.summary.suggestedQuestionCount;
    const decisionDrivers = [
      driver(
        'duplicates',
        'Duplicados cross-product',
        duplicateGroupCount > 0 ? 'blocked' : 'ready',
        `${duplicateGroupCount} grupos duplicados detectados.`,
      ),
      driver(
        'supplier_customer_blockers',
        'Clientes/proveedores bloquean declaraciones',
        blockedForDeclarationsCount > 0 ? 'blocked' : 'ready',
        `${blockedForDeclarationsCount} terceros bloquean declaraciones.`,
      ),
      driver(
        'validation_discrepancies',
        'Discrepancias de evidencia fiscal',
        validationDiscrepancyCount > 0 ? 'blocked' : 'ready',
        `${validationDiscrepancyCount} discrepancias en ledger fiscal.`,
      ),
      driver(
        'accountant_party_questions',
        'Preguntas recurrentes de contador',
        accountantQuestionCount > 0 ? 'needs_review' : 'ready',
        `${accountantQuestionCount} preguntas sugeridas sobre terceros.`,
      ),
      driver(
        'hardening_closeout',
        'Closeout tributario con parties',
        closeout.closeoutStatus === 'tax_hardened'
          ? 'ready'
          : closeout.closeoutStatus === 'blocked'
            ? 'blocked'
            : 'needs_review',
        `Closeout 4.0: ${closeout.closeoutStatus}.`,
      ),
    ];
    const blockingDriverCount = decisionDrivers.filter(
      (item) => item.status === 'blocked',
    ).length;
    const persistenceDriverCount = decisionDrivers.filter(
      (item) => item.status !== 'ready',
    ).length;
    const decisionStatus =
      blockingDriverCount > 0
        ? 'blocked'
        : persistenceDriverCount >= 2
          ? 'parties_persistence_candidate'
          : 'facade_still_ok';
    const blockers = decisionDrivers
      .filter((item) => item.status === 'blocked')
      .map((item) => `parties_persistence.${item.key}`);
    const pack: EcuadorTaxPartiesPersistenceDecisionPackView = {
      ...input,
      generatedAt: this.nowProvider(),
      decisionStatus,
      decisionDrivers,
      summary: {
        driverCount: decisionDrivers.length,
        blockingDriverCount,
        persistenceDriverCount,
        validationDiscrepancyCount,
      },
      recommendedAction:
        decisionStatus === 'facade_still_ok'
          ? 'Mantener Parties como facade y seguir hardening tributario.'
          : decisionStatus === 'parties_persistence_candidate'
            ? 'Preparar discovery de persistencia propia de Parties.'
            : 'Resolver blockers antes de mover escrituras fuera de Invoicing.',
      blockers,
      nextStep:
        decisionStatus === 'facade_still_ok'
          ? 'Postergar migracion de Parties persistence.'
          : 'Definir modelo de aliases, proveedores y validaciones antes de crear tablas.',
      guardrails: [
        'El decision pack no crea persistencia ni migra datos.',
        'La persistencia propia solo se justifica si hay presion repetida de duplicados, proveedores o evidencia fiscal.',
      ],
    };

    if (input.recordEvent ?? true) {
      await this.recordTenantEcuadorTaxComplianceEventUseCase.execute({
        tenantSlug: input.tenantSlug,
        period: input.period,
        year: input.year,
        eventType: 'tax_parties_persistence_decision_pack_requested',
        source: 'tax_parties_persistence_decision_pack',
        payload: {
          decisionStatus,
          blockingDriverCount,
          persistenceDriverCount,
        },
      });
    }

    return pack;
  }
}

function driver(
  key: string,
  label: string,
  status: EcuadorTaxReadinessStatus,
  evidence: string,
): EcuadorTaxPartiesPersistenceDecisionPackView['decisionDrivers'][number] {
  return { key, label, status, evidence };
}
