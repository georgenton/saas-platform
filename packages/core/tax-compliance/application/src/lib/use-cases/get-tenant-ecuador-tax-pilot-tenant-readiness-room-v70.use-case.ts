import {
  EcuadorTaxPilotTenantReadinessRoomV70View,
  EcuadorTaxReadinessStatus,
} from '@saas-platform/tax-compliance-domain';
import { RequestTenantEcuadorTaxOperationalHardeningCloseoutV62UseCase } from './request-tenant-ecuador-tax-operational-hardening-closeout-v62.use-case';

export class GetTenantEcuadorTaxPilotTenantReadinessRoomV70UseCase {
  constructor(
    private readonly requestTenantEcuadorTaxOperationalHardeningCloseoutV62UseCase: RequestTenantEcuadorTaxOperationalHardeningCloseoutV62UseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<EcuadorTaxPilotTenantReadinessRoomV70View> {
    const operationalCloseout =
      await this.requestTenantEcuadorTaxOperationalHardeningCloseoutV62UseCase.execute(
        input,
      );
    const readinessSections: EcuadorTaxPilotTenantReadinessRoomV70View['readinessSections'] =
      [
        section(
          'operational_closeout',
          'Tax 6.2 operational closeout',
          operationalCloseout.closeoutStatus,
          'tax_compliance',
          ['operational_hardening_closeout_v62'],
          operationalCloseout.nextStep,
        ),
        section(
          'sri_evidence',
          'SRI evidence import',
          operationalCloseout.importLedger.ledgerStatus,
          'operator',
          ['sri_import_persistence_ledger_v62'],
          operationalCloseout.importLedger.nextStep,
        ),
        section(
          'exception_queue',
          'SRI/platform exceptions',
          operationalCloseout.exceptionQueue.queueStatus,
          operationalCloseout.exceptionQueue.summary.accountantOwnedCount > 0
            ? 'accountant'
            : 'operator',
          operationalCloseout.exceptionQueue.exceptions.map(
            (exception) => exception.key,
          ),
          operationalCloseout.exceptionQueue.nextStep,
        ),
        section(
          'accountant_packet',
          'Accountant packet',
          operationalCloseout.accountantPacket.packetStatus,
          'accountant',
          ['accountant_packet_export_v62'],
          operationalCloseout.accountantPacket.nextStep,
        ),
        section(
          'operator_actions',
          'Operator action center',
          operationalCloseout.actionCenter.actionCenterStatus,
          'operator',
          operationalCloseout.actionCenter.actions.map((action) => action.key),
          operationalCloseout.actionCenter.nextStep,
        ),
      ];
    const blockers = operationalCloseout.blockers;
    const readinessStatus = resolveStatus(
      readinessSections.map((entry) => entry.status),
      blockers,
    );
    const requiresAccountant =
      operationalCloseout.accountantPacket.summary.accountantOwnedSectionCount >
        0 ||
      operationalCloseout.actionCenter.summary.accountantActionCount > 0;

    return {
      ...input,
      generatedAt: this.nowProvider(),
      readinessStatus,
      operationalCloseout,
      readinessSections,
      pilotDecision: {
        canStartPilot: readinessStatus !== 'blocked',
        requiresAccountant,
        mode:
          readinessStatus === 'blocked'
            ? 'blocked_until_hardening'
            : requiresAccountant
              ? 'accountant_in_loop_pilot'
              : 'assisted_self_service_pilot',
        reason:
          readinessStatus === 'blocked'
            ? 'Existen blockers 6.2 antes de iniciar piloto.'
            : requiresAccountant
              ? 'El piloto debe operar con contador externo en el loop.'
              : 'El tenant puede pilotear tax compliance asistido con controles humanos.',
      },
      summary: {
        sectionCount: readinessSections.length,
        readySectionCount: readinessSections.filter(
          (entry) => entry.status === 'ready',
        ).length,
        accountantOwnedSectionCount: readinessSections.filter(
          (entry) => entry.owner === 'accountant',
        ).length,
        blockerCount: new Set(blockers).size,
      },
      blockers: [...new Set(blockers)],
      nextStep:
        readinessStatus === 'blocked'
          ? 'Cerrar blockers de evidencia, excepciones o packet antes del piloto.'
          : 'Iniciar piloto con modo de servicio y responsable definidos.',
      guardrails: [
        'Pilot readiness no declara, no paga y no certifica cumplimiento tributario.',
        'El contador conserva la decision profesional cuando el periodo lo requiere.',
      ],
    };
  }
}

function section(
  key: string,
  label: string,
  status: EcuadorTaxReadinessStatus,
  owner: EcuadorTaxPilotTenantReadinessRoomV70View['readinessSections'][number]['owner'],
  evidenceRefs: string[],
  nextAction: string,
): EcuadorTaxPilotTenantReadinessRoomV70View['readinessSections'][number] {
  return { key, label, status, owner, evidenceRefs, nextAction };
}

function resolveStatus(
  statuses: EcuadorTaxReadinessStatus[],
  blockers: string[],
): EcuadorTaxReadinessStatus {
  if (blockers.length > 0 || statuses.includes('blocked')) {
    return 'blocked';
  }

  return statuses.includes('needs_review') ? 'needs_review' : 'ready';
}
