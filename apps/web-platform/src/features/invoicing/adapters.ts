import type {
  CustomerResponse,
  ElectronicSandboxReadinessResponse,
  ElectronicSignatureMaterialInspectionResponse,
  ElectronicSubmissionSettingsResponse,
  InvoiceNumberingSettingsResponse,
  InvoiceSummaryResponse,
  IssuerProfileResponse,
} from '../../app/types';
import type {
  InvoicingReadinessTone,
  InvoicingWorkspaceFoundationModel,
  InvoicingWorkspaceHero,
  InvoicingWorkspaceHeroActionKey,
  InvoicingWorkspaceReadiness,
  InvoicingWorkspaceReadinessSignal,
  InvoicingWorkspaceStage,
  InvoicingWorkspaceStagePreview,
} from './model';

type CreateInvoicingWorkspaceFoundationModelInput = {
  customers: CustomerResponse[];
  electronicSandboxReadiness: ElectronicSandboxReadinessResponse | null;
  electronicSignatureMaterialInspection: ElectronicSignatureMaterialInspectionResponse | null;
  electronicSubmissionSettings: ElectronicSubmissionSettingsResponse | null;
  formatMoney: (valueInCents: number, currency: string) => string;
  humanizeKey: (value: string | null) => string;
  invoiceNumberingSettings: InvoiceNumberingSettingsResponse | null;
  invoices: InvoiceSummaryResponse[];
  issuerProfile: IssuerProfileResponse | null;
  selectedInvoice: InvoiceSummaryResponse | null;
};

export function createInvoicingWorkspaceFoundationModel({
  customers,
  electronicSandboxReadiness,
  electronicSignatureMaterialInspection,
  electronicSubmissionSettings,
  formatMoney,
  humanizeKey,
  invoiceNumberingSettings,
  invoices,
  issuerProfile,
  selectedInvoice,
}: CreateInvoicingWorkspaceFoundationModelInput): InvoicingWorkspaceFoundationModel {
  const issuedInvoiceCount = invoices.filter(
    (invoice) => invoice.status.toLowerCase() === 'issued',
  ).length;
  const portfolioCurrency = invoices[0]?.currency ?? 'USD';
  const portfolioTotal = invoices.reduce(
    (sum, invoice) => sum + invoice.totals.totalInCents,
    0,
  );
  const nextInvoiceNumber =
    invoiceNumberingSettings?.previewNumber ??
    `INV-${String(invoices.length + 1).padStart(4, '0')}`;
  const readiness = buildReadiness({
    electronicSandboxReadiness,
    electronicSignatureMaterialInspection,
    electronicSubmissionSettings,
    humanizeKey,
    invoiceNumberingSettings,
    issuerProfile,
  });
  const hero = buildHero({
    issuerProfile,
    readiness,
    invoices,
  });
  const stagePreview = buildStagePreview({
    customers,
    formatMoney,
    invoices,
    selectedInvoice,
  });

  return {
    generatedFrom: 'client-composed',
    hero,
    metrics: [
      {
        key: 'customers',
        label: 'Customers activos',
        value: String(customers.length),
      },
      {
        key: 'issued-invoices',
        label: 'Facturas emitidas',
        value: String(issuedInvoiceCount),
      },
      {
        key: 'portfolio-total',
        label: 'Valor total del portafolio',
        value: formatMoney(portfolioTotal, portfolioCurrency),
      },
      {
        key: 'next-number',
        label: 'Siguiente numero sugerido',
        value: nextInvoiceNumber,
      },
    ],
    readiness,
    nextActions: buildNextActions({
      electronicSubmissionSettings,
      invoiceNumberingSettings,
      invoices,
      issuerProfile,
      readiness,
    }),
    stagePreview,
  };
}

function buildReadinessSignal(
  key: string,
  label: string,
  value: string,
  sub: string,
  tone: InvoicingReadinessTone,
): InvoicingWorkspaceReadinessSignal {
  return {
    key,
    label,
    sub,
    tone,
    value,
  };
}

function buildReadiness(input: {
  electronicSandboxReadiness: ElectronicSandboxReadinessResponse | null;
  electronicSignatureMaterialInspection: ElectronicSignatureMaterialInspectionResponse | null;
  electronicSubmissionSettings: ElectronicSubmissionSettingsResponse | null;
  humanizeKey: (value: string | null) => string;
  invoiceNumberingSettings: InvoiceNumberingSettingsResponse | null;
  issuerProfile: IssuerProfileResponse | null;
}): InvoicingWorkspaceReadiness {
  const blockers: string[] = [];
  const signatureValidity =
    input.electronicSignatureMaterialInspection?.inspection
      .certificateValidityStatus ?? 'not_applicable';
  const signatureMaterialStatus =
    input.electronicSignatureMaterialInspection?.inspection.status ??
    'not_configured';
  const gatewayConfigured = Boolean(
    input.electronicSubmissionSettings?.gatewayConfigured,
  );
  const gatewayActive = Boolean(input.electronicSubmissionSettings?.isActive);
  const issuerReady = Boolean(input.issuerProfile);
  const numberingReady = Boolean(input.invoiceNumberingSettings);
  const sandboxBlockers = input.electronicSandboxReadiness?.blockers ?? [];

  if (!issuerReady) {
    blockers.push('Falta configurar el perfil fiscal del emisor.');
  }

  if (
    signatureMaterialStatus === 'not_configured' ||
    signatureMaterialStatus === 'invalid'
  ) {
    blockers.push('La firma electrónica todavía no está lista para operar.');
  }

  if (signatureValidity === 'expired' || signatureValidity === 'not_yet_valid') {
    blockers.push('La vigencia del certificado impide enviar documentos al SRI.');
  }

  if (!gatewayConfigured || !gatewayActive) {
    blockers.push('El gateway de envío SRI necesita revisión antes de operar.');
  }

  if (!numberingReady) {
    blockers.push('Falta configurar la numeración electrónica del documento 01.');
  }

  blockers.push(...sandboxBlockers.slice(0, 2));

  return {
    ready: blockers.length === 0,
    blockers,
    pillars: [
      buildReadinessSignal(
        'issuer-profile',
        'Emisor',
        issuerReady ? input.issuerProfile?.legalName ?? 'Listo' : 'Pendiente',
        issuerReady
          ? `Ambiente ${humanizeEnvironment(input.issuerProfile?.environment)}`
          : 'Completa RUC, razón social y direcciones.',
        issuerReady ? 'success' : 'warning',
      ),
      buildReadinessSignal(
        'electronic-signature',
        'Firma',
        signatureValueLabel(signatureMaterialStatus, signatureValidity),
        input.electronicSignatureMaterialInspection?.inspection.detail ??
          'Inspecciona y activa el material criptográfico.',
        signatureTone(signatureMaterialStatus, signatureValidity),
      ),
      buildReadinessSignal(
        'submission-gateway',
        'Gateway',
        gatewayConfigured
          ? gatewayActive
            ? 'Activo'
            : 'Configurado'
          : 'Pendiente',
        gatewayConfigured
          ? `Modo ${input.humanizeKey(
              input.electronicSubmissionSettings?.transmissionMode ?? null,
            )}`
          : 'Configura credenciales y endpoints del envío SRI.',
        gatewayConfigured && gatewayActive
          ? 'success'
          : gatewayConfigured
            ? 'warning'
            : 'danger',
      ),
      buildReadinessSignal(
        'numbering',
        'Numeración',
        input.invoiceNumberingSettings?.previewNumber ?? 'Pendiente',
        numberingReady
          ? 'Serie y secuencial sugeridos para el siguiente documento.'
          : 'Define estab, ptoEmi y próximo secuencial.',
        numberingReady ? 'success' : 'warning',
      ),
    ],
  };
}

function buildHero(input: {
  invoices: InvoiceSummaryResponse[];
  issuerProfile: IssuerProfileResponse | null;
  readiness: InvoicingWorkspaceReadiness;
}): InvoicingWorkspaceHero {
  if (!input.issuerProfile) {
    return {
      eyebrow: 'Operaciones · configuración inicial',
      title: 'Empecemos por dejar listo tu emisor electrónico.',
      description:
        'Antes de emitir documentos al SRI, completa el perfil fiscal con el RUC, ambiente y direcciones del emisor.',
      primaryActionKey: 'configure-issuer',
      primaryActionLabel: 'Configurar emisor',
      state: 'no-issuer',
    };
  }

  if (!input.readiness.ready) {
    return {
      eyebrow: 'Operaciones · readiness SRI',
      title: 'Hay bloqueos que conviene resolver antes de enviar al SRI.',
      description:
        'La pantalla ya te muestra qué pilar está incompleto para que avances con tranquilidad y sin falsas autorizaciones.',
      primaryActionKey: 'review-signature',
      primaryActionLabel: 'Revisar readiness',
      state: 'readiness-blocked',
    };
  }

  if (input.invoices.length === 0) {
    return {
      eyebrow: 'Operaciones · primer documento',
      title: 'Tu carril está listo para emitir la primera factura.',
      description:
        'Ya tienes base fiscal suficiente; ahora el siguiente paso natural es crear el primer comprobante y validar el flujo completo.',
      primaryActionKey: 'create-invoice',
      primaryActionLabel: 'Nueva factura',
      state: 'no-invoices',
    };
  }

  if (input.invoices.some((invoice) => invoiceNeedsAttention(invoice))) {
    return {
      eyebrow: 'Operaciones · seguimiento',
      title: 'Tienes documentos que requieren seguimiento electrónico.',
      description:
        'Revisa facturas generadas, enviadas o devueltas para completar el ciclo operativo con evidencia clara.',
      primaryActionKey: 'review-pending',
      primaryActionLabel: 'Revisar por autorizar',
      state: 'operating',
    };
  }

  return {
    eyebrow: 'Operaciones · al día',
    title: 'Tu facturación está operativa y lista para seguir emitiendo.',
    description:
      'El emisor, la firma, el gateway y la numeración ya tienen una base utilizable para trabajar con más confianza.',
    primaryActionKey: 'create-invoice',
    primaryActionLabel: 'Nueva factura',
    state: 'operating',
  };
}

function buildStagePreview(input: {
  customers: CustomerResponse[];
  formatMoney: (valueInCents: number, currency: string) => string;
  invoices: InvoiceSummaryResponse[];
  selectedInvoice: InvoiceSummaryResponse | null;
}): InvoicingWorkspaceStagePreview | null {
  const invoice =
    input.selectedInvoice ??
    input.invoices.find((entry) => invoiceNeedsAttention(entry)) ??
    input.invoices[0] ??
    null;

  if (!invoice) {
    return null;
  }

  const customerName =
    invoice.buyerName ??
    input.customers.find((entry) => entry.id === invoice.customerId)?.name ??
    invoice.customerId;
  const stage = deriveElectronicStage(invoice);

  return {
    customerName,
    electronicLabel: electronicStageLabel(stage),
    id: invoice.id,
    number: invoice.number,
    statusLabel: invoice.status,
    total: input.formatMoney(invoice.totals.totalInCents, invoice.currency),
    stage,
  };
}

function buildNextActions(input: {
  electronicSubmissionSettings: ElectronicSubmissionSettingsResponse | null;
  invoiceNumberingSettings: InvoiceNumberingSettingsResponse | null;
  invoices: InvoiceSummaryResponse[];
  issuerProfile: IssuerProfileResponse | null;
  readiness: InvoicingWorkspaceReadiness;
}): string[] {
  const actions: string[] = [];

  if (!input.issuerProfile) {
    actions.push('Configurar perfil emisor antes de operar SRI.');
  }

  if (!input.electronicSubmissionSettings?.gatewayConfigured) {
    actions.push('Revisar electronic submission y credenciales del gateway.');
  }

  if (!input.invoiceNumberingSettings) {
    actions.push('Definir numeracion para factura 01.');
  }

  if (input.readiness.blockers.length > 0) {
    actions.push(input.readiness.blockers[0] ?? 'Resolver el bloqueo principal del carril SRI.');
  }

  if (input.invoices.length === 0) {
    actions.push('Crear la primera factura o validar el flujo de pruebas.');
  }

  const pendingElectronicCount = input.invoices.filter((invoice) =>
    invoiceNeedsAttention(invoice),
  ).length;

  if (pendingElectronicCount > 0) {
    actions.push(
      `${pendingElectronicCount} documento${pendingElectronicCount === 1 ? '' : 's'} requiere${pendingElectronicCount === 1 ? '' : 'n'} seguimiento electrónico.`,
    );
  }

  return actions.length > 0
    ? actions
    : ['Workspace listo para operar documentos y revisar autorizaciones.'];
}

function humanizeEnvironment(environment: string | undefined): string {
  if (environment === 'production') {
    return 'producción';
  }

  if (environment === 'test') {
    return 'pruebas';
  }

  return 'pendiente';
}

function signatureTone(
  materialStatus: string,
  validityStatus: string,
): InvoicingReadinessTone {
  if (
    materialStatus === 'invalid' ||
    validityStatus === 'expired' ||
    validityStatus === 'not_yet_valid'
  ) {
    return 'danger';
  }

  if (
    materialStatus === 'not_configured' ||
    validityStatus === 'expiring_soon' ||
    validityStatus === 'unknown'
  ) {
    return 'warning';
  }

  return 'success';
}

function signatureValueLabel(
  materialStatus: string,
  validityStatus: string,
): string {
  if (materialStatus === 'not_configured') {
    return 'Sin configurar';
  }

  if (materialStatus === 'invalid') {
    return 'Inválida';
  }

  if (validityStatus === 'expired') {
    return 'Caducada';
  }

  if (validityStatus === 'expiring_soon') {
    return 'Por vencer';
  }

  return 'Lista';
}

function invoiceNeedsAttention(invoice: InvoiceSummaryResponse): boolean {
  const stage = deriveElectronicStage(invoice);
  return stage === 'generated' || stage === 'submitted' || stage === 'rejected';
}

function deriveElectronicStage(
  invoice: InvoiceSummaryResponse,
): InvoicingWorkspaceStage {
  const electronicStatus = invoice.electronicStatus?.toLowerCase() ?? '';

  if (electronicStatus.includes('authorized')) {
    return 'authorized';
  }

  if (electronicStatus.includes('rejected') || electronicStatus.includes('returned')) {
    return 'rejected';
  }

  if (electronicStatus.includes('submitted') || invoice.submittedAt) {
    return 'submitted';
  }

  if (electronicStatus.includes('generated') || invoice.signedAt) {
    return 'generated';
  }

  return 'none';
}

function electronicStageLabel(stage: InvoicingWorkspaceStage): string {
  switch (stage) {
    case 'generated':
      return 'Generado';
    case 'submitted':
      return 'Enviado';
    case 'authorized':
      return 'Autorizado';
    case 'rejected':
      return 'Rechazado';
    default:
      return 'Borrador';
  }
}
