import {
  EcuadorTaxDeclarationFormKey,
  EcuadorTaxFilingGuidePacketView,
} from '@saas-platform/tax-compliance-domain';
import { RecordTenantEcuadorTaxComplianceEventUseCase } from './record-tenant-ecuador-tax-compliance-event.use-case';
import { RequestTenantEcuadorTaxDeclarationFormDraftPacketUseCase } from './request-tenant-ecuador-tax-declaration-form-draft-packet.use-case';

export class RequestTenantEcuadorTaxFilingGuidePacketUseCase {
  constructor(
    private readonly requestTenantEcuadorTaxDeclarationFormDraftPacketUseCase: RequestTenantEcuadorTaxDeclarationFormDraftPacketUseCase,
    private readonly recordTenantEcuadorTaxComplianceEventUseCase: RecordTenantEcuadorTaxComplianceEventUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
    formKey?: EcuadorTaxDeclarationFormKey;
    recordEvent?: boolean;
  }): Promise<EcuadorTaxFilingGuidePacketView> {
    const draft =
      await this.requestTenantEcuadorTaxDeclarationFormDraftPacketUseCase.execute(
        {
          ...input,
          recordEvent: false,
        },
      );
    const copyChecklist = draft.suggestedBoxes.map((box) => ({
      boxKey: box.boxKey,
      label: box.label,
      valueLabel:
        box.suggestedValueInCents === null
          ? 'manual'
          : formatMoney(box.suggestedValueInCents, box.currency ?? 'USD'),
      evidenceCount: box.evidenceIds.length,
      reviewRequired: box.readinessStatus !== 'ready',
    }));
    const view: EcuadorTaxFilingGuidePacketView = {
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      generatedAt: this.nowProvider(),
      formKey: draft.formKey,
      readinessStatus: draft.readinessStatus,
      assistantMode: 'guided_manual_entry',
      steps: [
        {
          key: 'open_sri_online',
          order: 1,
          title: 'Abrir SRI en Linea',
          instruction:
            'Ingresar manualmente al portal SRI en Linea con credenciales del contribuyente o contador autorizado.',
          source: 'sri_online_manual_path',
          humanGate: true,
        },
        {
          key: 'select_form',
          order: 2,
          title: 'Seleccionar formulario',
          instruction: `Ir a Declaraciones / Declaracion de Impuestos / Elaboracion y envio de declaraciones y escoger ${draft.formLabel}.`,
          source: 'tax_declaration_form_catalog',
          humanGate: true,
        },
        {
          key: 'copy_suggested_boxes',
          order: 3,
          title: 'Copiar casilleros sugeridos',
          instruction:
            'Copiar solo los casilleros marcados como listos y revisar los que aparecen en needs_review o blocked.',
          source: 'tax_declaration_form_draft_packet',
          humanGate: true,
        },
        {
          key: 'complete_manual_boxes',
          order: 4,
          title: 'Completar casilleros manuales',
          instruction:
            'Completar arrastres, ajustes, multas, intereses, perdidas, gastos personales u otros campos manuales con apoyo del contador.',
          source: 'manual_only_boxes',
          humanGate: true,
        },
        {
          key: 'human_review_before_submit',
          order: 5,
          title: 'Revision antes de enviar',
          instruction:
            'Comparar totales del portal SRI contra el packet y dejar evidencia de aprobacion humana antes de presentar.',
          source: 'accountant_review_gate',
          humanGate: true,
        },
        {
          key: 'record_external_handoff',
          order: 6,
          title: 'Registrar handoff externo',
          instruction:
            'Despues de enviar o pagar fuera de la plataforma, registrar el handoff externo con referencia y responsable.',
          source: 'tax_filing_handoff',
          humanGate: true,
        },
      ],
      copyChecklist,
      accountantQuestions: draft.accountantReview.suggestedQuestions,
      blockedCapabilities: [
        'store_sri_credentials',
        'bypass_recaptcha',
        'submit_sri_declaration',
        'sign_tax_form',
        'pay_tax',
      ],
      nextStep:
        draft.readinessStatus === 'blocked'
          ? 'Resolver blockers del borrador antes de seguir la guia de declaracion.'
          : 'Usar la guia como acompanamiento manual con revision humana antes de presentar en SRI.',
      guardrails: [
        'La guia no automatiza el portal SRI ni reemplaza al contribuyente o contador.',
        'No se deben ingresar credenciales SRI en la plataforma.',
        'El envio y pago siguen siendo acciones externas realizadas por humanos.',
      ],
    };

    if (input.recordEvent ?? true) {
      await this.recordTenantEcuadorTaxComplianceEventUseCase.execute({
        tenantSlug: input.tenantSlug,
        period: input.period,
        year: input.year,
        eventType: 'tax_filing_guide_packet_requested',
        source: 'tax_filing_guide_packet',
        payload: {
          formKey: view.formKey,
          readinessStatus: view.readinessStatus,
          stepCount: view.steps.length,
          copyChecklistCount: view.copyChecklist.length,
        },
      });
    }

    return view;
  }
}

function formatMoney(amountInCents: number, currency: string): string {
  return `${currency} ${(amountInCents / 100).toFixed(2)}`;
}
