import {
  GetTenantElectronicSandboxReadinessUseCase,
} from './get-tenant-electronic-sandbox-readiness.use-case';
import {
  GetTenantInvoicingReportSummaryUseCase,
} from './get-tenant-invoicing-report-summary.use-case';

export interface TenantInvoiceDocumentDraftingAssistChecklistItemView {
  key: string;
  label: string;
  status: 'ready' | 'warning' | 'blocked';
  detail: string;
}

export interface TenantInvoiceDocumentDraftingAssistDocumentGuidanceView {
  documentCode: '01' | '04' | '05' | '06' | '07';
  label: string;
  status: 'ready' | 'warning' | 'blocked';
  detail: string;
  recommendedUse: string;
}

export interface TenantInvoiceDocumentDraftingAssistHintView {
  key: string;
  title: string;
  objective: string;
  whenToUse: string;
  recommendedInputs: string[];
  caution: string;
}

export interface TenantInvoiceDocumentDraftingAssistView {
  tenantSlug: string;
  generatedAt: Date;
  summary: {
    tone: 'healthy' | 'warning' | 'critical';
    readinessStatus: 'ready' | 'needs_attention' | 'blocked';
    headline: string;
    detail: string;
    suggestedFocus: string;
  };
  checklist: TenantInvoiceDocumentDraftingAssistChecklistItemView[];
  documentGuidance: TenantInvoiceDocumentDraftingAssistDocumentGuidanceView[];
  reportSnapshot: {
    customerCount: number;
    invoiceCount: number;
    outstandingTotalInCents: number;
    dominantStatus: string | null;
    busiestMonth: string | null;
  };
  draftingHints: TenantInvoiceDocumentDraftingAssistHintView[];
  safeActions: string[];
  blockedActions: string[];
}

export class GetTenantInvoiceDocumentDraftingAssistUseCase {
  constructor(
    private readonly getTenantElectronicSandboxReadinessUseCase: GetTenantElectronicSandboxReadinessUseCase,
    private readonly getTenantInvoicingReportSummaryUseCase: GetTenantInvoicingReportSummaryUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
  ): Promise<TenantInvoiceDocumentDraftingAssistView> {
    const [readiness, report] = await Promise.all([
      this.getTenantElectronicSandboxReadinessUseCase.execute(tenantSlug),
      this.getTenantInvoicingReportSummaryUseCase.execute(tenantSlug),
    ]);

    const readinessStatus = this.resolveReadinessStatus(readiness);
    const summary = this.buildSummary(readinessStatus, readiness.recommendedNextStep);

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      summary,
      checklist: this.buildChecklist(readiness),
      documentGuidance: readiness.documentSupport.map((entry) => ({
        documentCode: entry.documentCode,
        label: entry.label,
        status: this.resolveDocumentGuidanceStatus(entry),
        detail: entry.detail,
        recommendedUse: this.describeDocumentRecommendedUse(entry.documentCode),
      })),
      reportSnapshot: {
        customerCount: report.customerCount,
        invoiceCount: report.invoiceCount,
        outstandingTotalInCents: report.totalsByCurrency.reduce(
          (total, entry) => total + entry.outstandingTotalInCents,
          0,
        ),
        dominantStatus:
          [...report.statusBreakdown].sort((left, right) => right.count - left.count)[0]
            ?.status ?? null,
        busiestMonth:
          [...report.monthlyTotals].sort(
            (left, right) =>
              right.invoiceCount - left.invoiceCount ||
              right.totalInCents - left.totalInCents,
          )[0]?.month ?? null,
      },
      draftingHints: this.buildDraftingHints(summary.readinessStatus),
      safeActions: [
        'Explicar en lenguaje simple que falta antes de emitir o revisar un comprobante.',
        'Resumir checklists y bloqueos usando el estado deterministico del tenant.',
        'Proponer el orden de preparacion mas seguro antes de pedir firma o envio.',
        'Ayudar a revisar si un documento parece listo para una validacion humana.',
      ],
      blockedActions: [
        'Firmar electronicamente el documento sin aprobacion humana.',
        'Enviar o autorizar comprobantes frente a SRI automaticamente.',
        'Declarar que un documento ya es fiscalmente valido solo por una sugerencia.',
        'Mutar estados tributarios o de envio fuera del flujo deterministico de invoicing.',
      ],
    };
  }

  private resolveReadinessStatus(readiness: {
    blockers: string[];
    warnings: string[];
    isReadyForLocalStubSubmission: boolean;
  }): 'ready' | 'needs_attention' | 'blocked' {
    if (readiness.blockers.length > 0 || !readiness.isReadyForLocalStubSubmission) {
      return 'blocked';
    }

    if (readiness.warnings.length > 0) {
      return 'needs_attention';
    }

    return 'ready';
  }

  private buildSummary(
    readinessStatus: 'ready' | 'needs_attention' | 'blocked',
    recommendedNextStep: string,
  ): TenantInvoiceDocumentDraftingAssistView['summary'] {
    if (readinessStatus === 'blocked') {
      return {
        tone: 'critical',
        readinessStatus,
        headline:
          'Antes de acelerar borradores o revisiones, el carril formal de facturacion necesita orden.',
        detail:
          'La IA puede ayudarte a explicar bloqueos, pero no conviene tratarla como atajo mientras falten piezas formales del tenant.',
        suggestedFocus: recommendedNextStep,
      };
    }

    if (readinessStatus === 'needs_attention') {
      return {
        tone: 'warning',
        readinessStatus,
        headline:
          'El tenant ya puede apoyarse en sugerencias, aunque conviene revisar detalles antes de empujar documentos.',
        detail:
          'Usa esta superficie para ordenar checklist, documentar riesgos y preparar mejor la revision humana.',
        suggestedFocus: recommendedNextStep,
      };
    }

    return {
      tone: 'healthy',
      readinessStatus,
      headline:
        'La base formal del tenant esta razonablemente estable para recibir ayuda guiada en drafting y revision.',
      detail:
        'La IA todavia no reemplaza validacion fiscal, pero ya puede asistir con checklist, explicaciones y orden de preparacion.',
      suggestedFocus: recommendedNextStep,
    };
  }

  private buildChecklist(readiness: {
    checks: Array<{
      key: string;
      label: string;
      status: 'ready' | 'warning' | 'blocked';
      detail: string;
    }>;
  }): TenantInvoiceDocumentDraftingAssistChecklistItemView[] {
    const preferredKeys = [
      'issuer_profile',
      'invoice_numbering',
      'signature_settings',
      'signature_material',
      'submission_settings',
    ];

    const byKey = new Map(readiness.checks.map((entry) => [entry.key, entry]));
    const ordered = preferredKeys
      .map((key) => byKey.get(key))
      .filter((entry): entry is NonNullable<typeof entry> => entry !== undefined);

    return ordered.length > 0 ? ordered : readiness.checks.slice(0, 5);
  }

  private resolveDocumentGuidanceStatus(document: {
    numberingConfigured: boolean;
    schemaValidationAvailable: boolean;
    submitSupported: boolean;
  }): 'ready' | 'warning' | 'blocked' {
    if (!document.numberingConfigured || !document.schemaValidationAvailable) {
      return 'blocked';
    }

    if (!document.submitSupported) {
      return 'warning';
    }

    return 'ready';
  }

  private describeDocumentRecommendedUse(
    documentCode: '01' | '04' | '05' | '06' | '07',
  ): string {
    switch (documentCode) {
      case '01':
        return 'Usalo para preparar facturas nuevas y revisar si el tenant ya tiene base suficiente para emitirlas sin improvisar.';
      case '04':
        return 'Usalo cuando haya que corregir o anular una factura previa con criterio documentado.';
      case '05':
        return 'Usalo para ajustes que aumentan valores o formalizan cargos adicionales sobre una factura base.';
      case '06':
        return 'Usalo cuando la operacion necesita soporte logistico y trazabilidad de traslado.';
      case '07':
        return 'Usalo cuando toque retener y documentar la obligacion tributaria asociada.';
    }
  }

  private buildDraftingHints(
    readinessStatus: TenantInvoiceDocumentDraftingAssistView['summary']['readinessStatus'],
  ): TenantInvoiceDocumentDraftingAssistHintView[] {
    const caution =
      readinessStatus === 'blocked'
        ? 'Primero resuelve bloqueos formales antes de convertir esto en un borrador operativo.'
        : readinessStatus === 'needs_attention'
          ? 'Toma la sugerencia como checklist guiado y no como validacion fiscal final.'
          : 'Aunque la base esta saludable, la validacion tributaria y la aprobacion humana siguen siendo obligatorias.';

    return [
      {
        key: 'drafting-brief',
        title: 'Brief de preparacion',
        objective:
          'Explicar que piezas conviene completar antes de redactar o revisar un comprobante.',
        whenToUse:
          'Cuando el operador necesita una guia corta para entender si el tenant esta listo o todavia tiene huecos.',
        recommendedInputs: [
          'Resumen del checklist formal',
          'Estado de numeracion y firma',
          'Siguiente paso recomendado por readiness',
        ],
        caution,
      },
      {
        key: 'review-checklist',
        title: 'Checklist de revision',
        objective:
          'Ordenar la revision humana para no confundir sugerencia de IA con validacion fiscal real.',
        whenToUse:
          'Cuando ya existe un documento en preparacion y se quiere revisar antes de enviarlo al flujo formal.',
        recommendedInputs: [
          'Tipo de comprobante',
          'Bloqueos y warnings activos',
          'Soporte disponible por CodDoc',
        ],
        caution,
      },
      {
        key: 'blocker-explainer',
        title: 'Explicador de bloqueos',
        objective:
          'Traducir hallazgos tecnicos o tributarios a lenguaje simple para el equipo operador.',
        whenToUse:
          'Cuando el tenant esta trabado y hace falta una explicacion accionable de por que no conviene avanzar.',
        recommendedInputs: [
          'Lista actual de blockers',
          'Warnings relevantes',
          'Ultimo siguiente paso recomendado',
        ],
        caution,
      },
    ];
  }
}
