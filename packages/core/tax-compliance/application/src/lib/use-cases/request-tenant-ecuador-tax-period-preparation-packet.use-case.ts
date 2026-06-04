import {
  EcuadorTaxPeriodPreparationPacketView,
  EcuadorTaxReadinessStatus,
} from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxObligationMatrixUseCase } from './get-tenant-ecuador-tax-obligation-matrix.use-case';

export class RequestTenantEcuadorTaxPeriodPreparationPacketUseCase {
  constructor(
    private readonly getTenantEcuadorTaxObligationMatrixUseCase: GetTenantEcuadorTaxObligationMatrixUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    period: string,
  ): Promise<EcuadorTaxPeriodPreparationPacketView> {
    const matrix =
      await this.getTenantEcuadorTaxObligationMatrixUseCase.execute(tenantSlug);

    const blockedBy = [
      ...matrix.taxpayerProfile.missingFields.map(
        (field) => `taxpayer_profile.${field}`,
      ),
      ...matrix.obligations
        .filter((obligation) => obligation.readinessStatus === 'blocked')
        .map((obligation) => `obligation.${obligation.key}`),
    ];

    const readinessStatus = getPacketReadinessStatus(
      blockedBy,
      matrix.obligations.some(
        (obligation) => obligation.readinessStatus === 'needs_review',
      ) || matrix.taxpayerProfile.reviewNotes.length > 0,
    );

    return {
      tenantSlug,
      period,
      generatedAt: this.nowProvider(),
      taxpayerProfile: matrix.taxpayerProfile,
      obligations: matrix.obligations,
      readinessStatus,
      evidenceChecklist: [
        'Ventas facturadas y documentos electronicos emitidos en el periodo',
        'Comprobantes de compra y gasto que sustenten credito tributario o deducibilidad',
        'Retenciones emitidas y recibidas',
        'Notas de credito, notas de debito y anulaciones relevantes',
        'Resumen de pagos, cobros y diferencias operativas desde Ecommerce cuando aplique',
        'Observaciones del contador sobre regimen, periodicidad y anexos aplicables',
      ],
      accountantHandoff: {
        recommended: readinessStatus !== 'ready',
        reason:
          readinessStatus === 'blocked'
            ? 'Faltan datos fiscales base antes de preparar la declaracion.'
            : readinessStatus === 'needs_review'
              ? 'Hay condiciones tributarias que requieren revision humana antes de declarar.'
              : 'El packet esta listo para revision final o autoservicio asistido.',
        packetSummary:
          'Packet de preparacion tributaria EC con perfil del contribuyente, matriz de obligaciones, evidencias requeridas y bloqueos operativos.',
      },
      blockedBy,
      nextStep:
        readinessStatus === 'blocked'
          ? 'Completar perfil tributario y terceros fiscales antes de preparar el periodo.'
          : readinessStatus === 'needs_review'
            ? 'Enviar packet al contador o responsable tributario para validar periodicidad, obligaciones y evidencias.'
            : 'Preparar declaracion con evidencias consolidadas y mantener aprobacion humana antes de presentar.',
      guardrails: matrix.guardrails,
    };
  }
}

function getPacketReadinessStatus(
  blockedBy: string[],
  needsReview: boolean,
): EcuadorTaxReadinessStatus {
  if (blockedBy.length > 0) {
    return 'blocked';
  }

  return needsReview ? 'needs_review' : 'ready';
}
