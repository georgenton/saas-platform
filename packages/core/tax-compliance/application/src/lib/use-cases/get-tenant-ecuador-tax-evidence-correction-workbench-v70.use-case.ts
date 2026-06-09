import {
  EcuadorTaxEvidenceCorrectionWorkbenchV70View,
  EcuadorTaxReadinessStatus,
} from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxAccountantFeedbackIntakeQueueV70UseCase } from './get-tenant-ecuador-tax-accountant-feedback-intake-queue-v70.use-case';

export class GetTenantEcuadorTaxEvidenceCorrectionWorkbenchV70UseCase {
  constructor(
    private readonly getTenantEcuadorTaxAccountantFeedbackIntakeQueueV70UseCase: GetTenantEcuadorTaxAccountantFeedbackIntakeQueueV70UseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<EcuadorTaxEvidenceCorrectionWorkbenchV70View> {
    const feedbackQueue =
      await this.getTenantEcuadorTaxAccountantFeedbackIntakeQueueV70UseCase.execute(
        input,
      );
    const correctionActions: EcuadorTaxEvidenceCorrectionWorkbenchV70View['correctionActions'] =
      feedbackQueue.feedbackItems.map((item) =>
        action(
          `correction_${item.key}`,
          `Corregir ${item.label}`,
          item.key,
          item.status,
          correctionTypeFor(item.source, item.owner),
          item.owner,
          item.evidenceRefs,
          item.recommendedAction,
        ),
      );
    const blockers = feedbackQueue.blockers;
    const workbenchStatus = resolveStatus(
      correctionActions.map((entry) => entry.status),
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      workbenchStatus,
      feedbackQueue,
      correctionActions,
      summary: {
        actionCount: correctionActions.length,
        readyActionCount: correctionActions.filter(
          (entry) => entry.status === 'ready',
        ).length,
        accountantActionCount: correctionActions.filter(
          (entry) => entry.owner === 'accountant',
        ).length,
        blockedActionCount: correctionActions.filter(
          (entry) => entry.status === 'blocked',
        ).length,
      },
      blockers: [...new Set(blockers)],
      nextStep:
        workbenchStatus === 'ready'
          ? 'Correcciones listas para decision packet del piloto.'
          : 'Cerrar acciones de correccion o enrutarlas al contador.',
      guardrails: [
        'Workbench propone acciones; no recalcula oficialmente ni presenta declaraciones.',
        'Las correcciones contables/tributarias quedan pendientes de revision humana.',
      ],
    };
  }
}

function correctionTypeFor(
  source: EcuadorTaxEvidenceCorrectionWorkbenchV70View['feedbackQueue']['feedbackItems'][number]['source'],
  owner: EcuadorTaxEvidenceCorrectionWorkbenchV70View['correctionActions'][number]['owner'],
): EcuadorTaxEvidenceCorrectionWorkbenchV70View['correctionActions'][number]['correctionType'] {
  if (owner === 'accountant') {
    return 'route_to_accountant';
  }

  if (source === 'reconciliation_exception') {
    return 'reconcile_sri_platform';
  }

  if (source === 'form_binder') {
    return 'update_form_box_hint';
  }

  if (source === 'pilot_readiness') {
    return 'request_missing_evidence';
  }

  return 'mark_not_applicable';
}

function action(
  key: string,
  label: string,
  sourceFeedbackKey: string,
  status: EcuadorTaxReadinessStatus,
  correctionType: EcuadorTaxEvidenceCorrectionWorkbenchV70View['correctionActions'][number]['correctionType'],
  owner: EcuadorTaxEvidenceCorrectionWorkbenchV70View['correctionActions'][number]['owner'],
  evidenceRefs: string[],
  nextAction: string,
): EcuadorTaxEvidenceCorrectionWorkbenchV70View['correctionActions'][number] {
  return {
    key,
    label,
    sourceFeedbackKey,
    status,
    correctionType,
    owner,
    evidenceRefs,
    nextAction,
  };
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
