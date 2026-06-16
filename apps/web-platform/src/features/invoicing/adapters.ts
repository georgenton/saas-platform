import type {
  CustomerResponse,
  ElectronicSubmissionSettingsResponse,
  InvoiceNumberingSettingsResponse,
  InvoiceSummaryResponse,
  IssuerProfileResponse,
} from '../../app/types';
import type {
  InvoicingReadinessTone,
  InvoicingWorkspaceFoundationModel,
} from './model';

type CreateInvoicingWorkspaceFoundationModelInput = {
  customers: CustomerResponse[];
  electronicSubmissionSettings: ElectronicSubmissionSettingsResponse | null;
  formatMoney: (valueInCents: number, currency: string) => string;
  humanizeKey: (value: string | null) => string;
  invoiceNumberingSettings: InvoiceNumberingSettingsResponse | null;
  invoices: InvoiceSummaryResponse[];
  issuerProfile: IssuerProfileResponse | null;
};

export function createInvoicingWorkspaceFoundationModel({
  customers,
  electronicSubmissionSettings,
  formatMoney,
  humanizeKey,
  invoiceNumberingSettings,
  invoices,
  issuerProfile,
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
  const gatewayActive = Boolean(electronicSubmissionSettings?.isActive);
  const gatewayConfigured = Boolean(
    electronicSubmissionSettings?.gatewayConfigured,
  );

  return {
    generatedFrom: 'client-composed',
    summary: {
      eyebrow: 'Invoicing workspace foundation',
      title: 'Facturacion electronica Ecuador',
      description:
        'Resumen operativo para emisor, ambiente SRI, numeracion y cartera antes de operar documentos.',
    },
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
    readiness: [
      buildReadinessSignal(
        'issuer-profile',
        'Emisor SRI',
        issuerProfile ? issuerProfile.legalName : 'Pendiente',
        issuerProfile ? 'success' : 'warning',
      ),
      buildReadinessSignal(
        'issuer-environment',
        'Ambiente',
        issuerProfile?.environment
          ? humanizeKey(issuerProfile.environment)
          : 'Sin perfil',
        issuerProfile?.environment === 'production'
          ? 'success'
          : issuerProfile
            ? 'neutral'
            : 'warning',
      ),
      buildReadinessSignal(
        'submission-gateway',
        'Gateway SRI',
        gatewayConfigured
          ? gatewayActive
            ? 'Configurado y activo'
            : 'Configurado inactivo'
          : 'Pendiente',
        gatewayConfigured && gatewayActive
          ? 'success'
          : gatewayConfigured
            ? 'neutral'
            : 'warning',
      ),
      buildReadinessSignal(
        'numbering',
        'Numeracion',
        invoiceNumberingSettings ? nextInvoiceNumber : 'Pendiente',
        invoiceNumberingSettings ? 'success' : 'warning',
      ),
    ],
    nextActions: buildNextActions({
      electronicSubmissionSettings,
      invoiceNumberingSettings,
      invoices,
      issuerProfile,
    }),
  };
}

function buildReadinessSignal(
  key: string,
  label: string,
  value: string,
  tone: InvoicingReadinessTone,
) {
  return {
    key,
    label,
    tone,
    value,
  };
}

function buildNextActions(input: {
  electronicSubmissionSettings: ElectronicSubmissionSettingsResponse | null;
  invoiceNumberingSettings: InvoiceNumberingSettingsResponse | null;
  invoices: InvoiceSummaryResponse[];
  issuerProfile: IssuerProfileResponse | null;
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

  if (input.invoices.length === 0) {
    actions.push('Crear la primera factura o validar el flujo de pruebas.');
  }

  return actions.length > 0
    ? actions
    : ['Workspace listo para operar documentos y revisar autorizaciones.'];
}
