import { EcuadorTaxAccountantReviewPacketView } from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxPeriodWorkspaceUseCase } from './get-tenant-ecuador-tax-period-workspace.use-case';

export class RequestTenantEcuadorTaxAccountantReviewPacketUseCase {
  constructor(
    private readonly getTenantEcuadorTaxPeriodWorkspaceUseCase: GetTenantEcuadorTaxPeriodWorkspaceUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<EcuadorTaxAccountantReviewPacketView> {
    const workspace = await this.getTenantEcuadorTaxPeriodWorkspaceUseCase.execute(
      input,
    );
    const evidence = workspace.preparationPacket.evidenceSummary;
    const missingEvidence = [
      ...workspace.blockers,
      ...workspace.preparationPacket.evidenceChecklist.filter((item) =>
        item.toLowerCase().includes('pendiente'),
      ),
    ];

    return {
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      generatedAt: this.nowProvider(),
      executiveSummary: `Periodo ${input.period} esta en estado ${workspace.status} con ${workspace.blockers.length} blockers y ${workspace.dueAlerts.length} alertas de calendario.`,
      workspaceStatus: workspace.status,
      declarationSections: workspace.declarationDraftPacket.declarationSections,
      suggestedQuestions:
        workspace.declarationDraftPacket.accountantReview.suggestedQuestions,
      missingEvidence,
      calendarAlerts: workspace.dueAlerts,
      incompleteThirdPartyIds: evidence.parties.incompletePartyIds,
      handoffChecklist: [
        'Revisar perfil tributario y regimen aplicable.',
        'Validar ventas, retenciones, compras y sustento del periodo.',
        'Confirmar vencimientos y si existen declaraciones/pagos fuera del sistema.',
        'Registrar observaciones antes de preparar declaracion final.',
      ],
      responsibilityGuardrails: [
        'El packet organiza evidencia y preguntas; la revision profesional sigue siendo responsabilidad del contador o responsable tributario.',
        'No se presenta informacion al SRI desde este packet.',
      ],
      nextStep:
        workspace.status === 'blocked'
          ? 'Completar evidencia y terceros fiscales antes de solicitar aprobacion.'
          : 'Enviar packet al contador para revision y aprobacion.',
    };
  }
}
