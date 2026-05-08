import {
  Customer,
  Invoice,
  InvoiceElectronicEvent,
  InvoiceItem,
  IssuerProfile,
  Payment,
} from '@saas-platform/invoicing-domain';

export interface InvoiceTotalsView {
  subtotalInCents: number;
  taxInCents: number;
  totalInCents: number;
}

export interface InvoiceSummaryView {
  invoice: Invoice;
  itemCount: number;
  totals: InvoiceTotalsView;
  settlement: InvoiceSettlementView;
}

export interface InvoiceDetailView {
  invoice: Invoice;
  items: InvoiceItem[];
  payments: Payment[];
  electronicEvents: InvoiceElectronicEvent[];
  totals: InvoiceTotalsView;
  settlement: InvoiceSettlementView;
}

export interface InvoiceSettlementView {
  paidInCents: number;
  balanceDueInCents: number;
  isFullyPaid: boolean;
}

export interface InvoiceDocumentPartyView {
  name: string;
  email: string | null;
  taxId: string | null;
  identificationType: string | null;
  identification: string | null;
  billingAddress: string | null;
}

export interface InvoiceDocumentIssuerView {
  tenantId: string;
  tenantName: string;
  tenantSlug: string;
  legalName: string;
  commercialName: string | null;
  taxId: string | null;
  environment: string | null;
  emissionType: string | null;
  accountingObligated: boolean | null;
  specialTaxpayerCode: string | null;
  rimpeTaxpayerType: string | null;
  matrixAddress: string | null;
  establishmentAddress: string | null;
}

export interface InvoiceDocumentLineView {
  id: string;
  position: number;
  description: string;
  quantity: number;
  unitPriceInCents: number;
  lineSubtotalInCents: number;
  taxRateId: string | null;
  taxRateName: string | null;
  taxRatePercentage: number | null;
  lineTaxInCents: number;
  lineTotalInCents: number;
}

export interface InvoiceDocumentView {
  issuer: InvoiceDocumentIssuerView;
  customer: InvoiceDocumentPartyView;
  invoice: Invoice;
  lines: InvoiceDocumentLineView[];
  totals: InvoiceTotalsView;
}

export interface InvoiceRideView {
  issuer: InvoiceDocumentIssuerView;
  customer: InvoiceDocumentPartyView;
  invoice: Invoice;
  lines: InvoiceDocumentLineView[];
  totals: InvoiceTotalsView;
  ride: {
    documentLabel: string;
    environmentLabel: string;
    emissionTypeLabel: string;
    sequenceDisplay: string | null;
    electronicStatusLabel: string;
    canBePrintedAsAuthorized: boolean;
    accessKey: string | null;
    accessKeyChunks: string[];
    authorizationNumber: string | null;
    authorizedAt: Date | null;
    authorizationMessage: string | null;
    additionalInfoFields: Array<{
      label: string;
      value: string;
    }>;
  };
}

export interface InvoiceElectronicDocumentArtifactsView {
  fileBaseName: string;
  rideHtmlFileName: string;
  xmlFileName: string;
  accessKey: string | null;
  electronicStatus: string | null;
  canDownloadRide: boolean;
  canDownloadXml: boolean;
}

export function calculateInvoiceTotals(
  items: InvoiceItem[],
): InvoiceTotalsView {
  const subtotalInCents = items.reduce(
    (sum, item) => sum + item.lineTotalInCents,
    0,
  );
  const taxInCents = items.reduce((sum, item) => sum + item.lineTaxInCents, 0);

  return {
    subtotalInCents,
    taxInCents,
    totalInCents: subtotalInCents + taxInCents,
  };
}

export function calculateInvoiceSettlement(
  totalInCents: number,
  payments: Pick<Payment, 'amountInCents' | 'status'>[],
): InvoiceSettlementView {
  const paidInCents = payments
    .filter((payment) => payment.status === 'posted')
    .reduce(
      (sum, payment) => sum + payment.amountInCents,
      0,
    );
  const balanceDueInCents = Math.max(totalInCents - paidInCents, 0);

  return {
    paidInCents,
    balanceDueInCents,
    isFullyPaid: balanceDueInCents === 0 && totalInCents > 0,
  };
}

export function toInvoiceDocumentLines(
  items: InvoiceItem[],
): InvoiceDocumentLineView[] {
  return items.map((item) => ({
    id: item.id,
    position: item.position,
    description: item.description,
    quantity: item.quantity,
    unitPriceInCents: item.unitPriceInCents,
    lineSubtotalInCents: item.lineTotalInCents,
    taxRateId: item.taxRateId,
    taxRateName: item.taxRateName,
    taxRatePercentage: item.taxRatePercentage,
    lineTaxInCents: item.lineTaxInCents,
    lineTotalInCents: item.lineTotalInCents + item.lineTaxInCents,
  }));
}

export function buildInvoiceDocumentView(input: {
  tenant: {
    id: string;
    name: string;
    slug: string;
  };
  issuerProfile?: IssuerProfile | null;
  customer: Customer;
  invoice: Invoice;
  items: InvoiceItem[];
}): InvoiceDocumentView {
  return {
    issuer: {
      tenantId: input.tenant.id,
      tenantName: input.tenant.name,
      tenantSlug: input.tenant.slug,
      legalName: input.issuerProfile?.legalName ?? input.tenant.name,
      commercialName: input.issuerProfile?.commercialName ?? null,
      taxId: input.issuerProfile?.taxId ?? null,
      environment: input.issuerProfile?.environment ?? null,
      emissionType: input.issuerProfile?.emissionType ?? null,
      accountingObligated: input.issuerProfile?.accountingObligated ?? null,
      specialTaxpayerCode: input.issuerProfile?.specialTaxpayerCode ?? null,
      rimpeTaxpayerType: input.issuerProfile?.rimpeTaxpayerType ?? null,
      matrixAddress: input.issuerProfile?.matrixAddress ?? null,
      establishmentAddress: input.issuerProfile?.establishmentAddress ?? null,
    },
    customer: {
      name: input.invoice.buyerName ?? input.customer.name,
      email: input.customer.email,
      taxId: input.invoice.buyerIdentification ?? input.customer.taxId,
      identificationType:
        input.invoice.buyerIdentificationType ?? input.customer.identificationType,
      identification:
        input.invoice.buyerIdentification ?? input.customer.identification,
      billingAddress: input.invoice.buyerAddress ?? input.customer.billingAddress,
    },
    invoice: input.invoice,
    lines: toInvoiceDocumentLines(input.items),
    totals: calculateInvoiceTotals(input.items),
  };
}

export function buildInvoiceRideView(
  document: InvoiceDocumentView,
): InvoiceRideView {
  const primitives = document.invoice.toPrimitives();
  const sequenceDisplay =
    primitives.sequenceNumber != null
      ? String(primitives.sequenceNumber).padStart(9, '0')
      : null;
  const rideLines =
    primitives.documentCode === '04'
      ? document.lines.map((line) => ({
          ...line,
          unitPriceInCents: Math.abs(line.unitPriceInCents),
          lineSubtotalInCents: Math.abs(line.lineSubtotalInCents),
          lineTaxInCents: Math.abs(line.lineTaxInCents),
          lineTotalInCents: Math.abs(line.lineTotalInCents),
        }))
      : document.lines;
  const rideTotals =
    primitives.documentCode === '04'
      ? {
          subtotalInCents: Math.abs(document.totals.subtotalInCents),
          taxInCents: Math.abs(document.totals.taxInCents),
          totalInCents: Math.abs(document.totals.totalInCents),
        }
      : document.totals;

  return {
    issuer: document.issuer,
    customer: document.customer,
    invoice: document.invoice,
    lines: rideLines,
    totals: rideTotals,
    ride: {
      documentLabel: formatRideDocumentLabel(primitives.documentCode),
      environmentLabel: formatRideEnvironmentLabel(document.issuer.environment),
      emissionTypeLabel: formatRideEmissionTypeLabel(document.issuer.emissionType),
      sequenceDisplay,
      electronicStatusLabel: formatRideElectronicStatusLabel(
        primitives.electronicStatus,
      ),
      canBePrintedAsAuthorized: primitives.electronicStatus === 'authorized',
      accessKey: primitives.accessKey ?? null,
      accessKeyChunks: splitAccessKeyForRide(primitives.accessKey ?? null),
      authorizationNumber: primitives.authorizationNumber ?? null,
      authorizedAt: primitives.authorizedAt ?? null,
      authorizationMessage: primitives.electronicStatusMessage ?? null,
      additionalInfoFields: buildRideAdditionalInfoFields(document),
    },
  };
}

export function buildInvoiceElectronicDocumentArtifactsView(
  document: InvoiceDocumentView,
): InvoiceElectronicDocumentArtifactsView {
  const invoice = document.invoice.toPrimitives();
  const sequenceDisplay =
    invoice.sequenceNumber != null
      ? String(invoice.sequenceNumber).padStart(9, '0')
      : sanitizeElectronicFileNameSegment(invoice.number ?? '');
  const fileBaseName = [
    sanitizeElectronicFileNameSegment(
      document.issuer.taxId ?? document.issuer.tenantSlug,
    ),
    sanitizeElectronicFileNameSegment(invoice.documentCode ?? 'invoice'),
    sanitizeElectronicFileNameSegment(invoice.establishmentCode ?? '000'),
    sanitizeElectronicFileNameSegment(invoice.emissionPointCode ?? '000'),
    sanitizeElectronicFileNameSegment(sequenceDisplay),
  ]
    .filter((segment) => segment.length > 0)
    .join('-');

  return {
    fileBaseName,
    rideHtmlFileName: `${fileBaseName}-ride.html`,
    xmlFileName: `${fileBaseName}.xml`,
    accessKey: invoice.accessKey ?? null,
    electronicStatus: invoice.electronicStatus ?? null,
    canDownloadRide: true,
    canDownloadXml:
      Boolean(invoice.documentCode) &&
      Boolean(invoice.establishmentCode) &&
      Boolean(invoice.emissionPointCode),
  };
}

function splitAccessKeyForRide(value: string | null): string[] {
  if (!value) {
    return [];
  }

  return value.match(/.{1,7}/g) ?? [value];
}

function sanitizeElectronicFileNameSegment(value: string | null | undefined): string {
  if (!value) {
    return '';
  }

  return value
    .trim()
    .replace(/[^a-zA-Z0-9_-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
}

function buildRideAdditionalInfoFields(
  document: InvoiceDocumentView,
): Array<{ label: string; value: string }> {
  const invoice = document.invoice.toPrimitives();
  const fields: Array<{ label: string; value: string | null | undefined }> = [
    {
      label: 'Email comprador',
      value: document.customer.email,
    },
    {
      label: 'Direccion comprador',
      value: document.customer.billingAddress,
    },
    {
      label: 'Direccion matriz',
      value: document.issuer.matrixAddress,
    },
    {
      label: 'Direccion establecimiento',
      value: document.issuer.establishmentAddress,
    },
    {
      label: 'Referencia envio',
      value: invoice.submissionReference,
    },
    {
      label: 'Mensaje autorizacion',
      value: invoice.electronicStatusMessage,
    },
  ];

  if (invoice.documentCode === '04') {
    fields.push(
      {
        label: 'Documento modificado',
        value: invoice.modifiedDocumentNumber,
      },
      {
        label: 'Fecha documento sustento',
        value: invoice.modifiedDocumentIssuedAt?.toISOString() ?? null,
      },
      {
        label: 'Motivo',
        value: invoice.modificationReason,
      },
    );
  }

  if (invoice.notes) {
    fields.push({
      label: 'Notas',
      value: invoice.notes,
    });
  }

  return fields
    .filter((field) => field.value && field.value.trim().length > 0)
    .map((field) => ({
      label: field.label,
      value: field.value!.trim(),
    }));
}

function createDocumentCurrencyFormatter(currency: string): (valueInCents: number) => string {
  const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  });

  return (valueInCents: number): string => currencyFormatter.format(valueInCents / 100);
}

function formatDocumentDate(value: Date | null): string {
  return value ? value.toISOString() : 'Not set';
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatRideEnvironmentLabel(value: string | null): string {
  if (!value) {
    return 'No configurado';
  }

  return value === 'production' ? 'PRODUCCION' : 'PRUEBAS';
}

function formatRideDocumentLabel(documentCode: string | null): string {
  switch (documentCode) {
    case '01':
      return 'RIDE Factura';
    case '04':
      return 'RIDE Nota de credito';
    default:
      return 'RIDE';
  }
}

function formatDocumentTitle(documentCode: string | null): string {
  switch (documentCode) {
    case '04':
      return 'Credit Note';
    case '01':
    case null:
      return 'Invoice';
    default:
      return 'Document';
  }
}

function formatRideEmissionTypeLabel(value: string | null): string {
  if (!value) {
    return 'No configurado';
  }

  return value === 'normal' ? 'NORMAL' : value.toUpperCase();
}

function formatRideElectronicStatusLabel(value: string | null): string {
  switch (value) {
    case 'pending_submission':
      return 'Pendiente de envio';
    case 'submitted':
      return 'Enviado al SRI';
    case 'authorized':
      return 'Autorizado';
    case 'rejected':
      return 'No autorizado';
    default:
      return 'Sin estado electronico';
  }
}

export function renderInvoiceDocumentHtml(view: InvoiceDocumentView): string {
  const invoice = view.invoice.toPrimitives();
  const formatMoney = createDocumentCurrencyFormatter(invoice.currency);
  const documentTitle = formatDocumentTitle(invoice.documentCode);

  const lineRows = view.lines
    .map(
      (line) => `
        <tr>
          <td>${line.position}</td>
          <td>${escapeHtml(line.description)}</td>
          <td>${line.quantity}</td>
          <td>${formatMoney(line.unitPriceInCents)}</td>
          <td>${line.taxRateName ? `${escapeHtml(line.taxRateName)}${line.taxRatePercentage !== null ? ` (${line.taxRatePercentage}%)` : ''}` : 'None'}</td>
          <td>${formatMoney(line.lineTaxInCents)}</td>
          <td>${formatMoney(line.lineTotalInCents)}</td>
        </tr>
      `,
    )
    .join('');

  return `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(documentTitle)} ${escapeHtml(invoice.number)}</title>
    <style>
      body { font-family: Arial, sans-serif; color: #1f1a14; margin: 32px; }
      .header { display: flex; justify-content: space-between; gap: 24px; margin-bottom: 24px; }
      .card { border: 1px solid #d7c7b6; border-radius: 16px; padding: 16px; background: #fffaf4; }
      .grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; margin-bottom: 24px; }
      h1, h2, h3, p { margin: 0; }
      h1 { font-size: 28px; margin-bottom: 8px; }
      .muted { color: #6f6358; font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 6px; }
      table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
      th, td { border-bottom: 1px solid #e4d7c9; padding: 12px 8px; text-align: left; vertical-align: top; }
      th { font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; color: #6f6358; }
      .totals { margin-left: auto; max-width: 320px; display: grid; gap: 8px; }
      .totals-row { display: flex; justify-content: space-between; gap: 16px; }
      .grand-total { font-weight: 700; font-size: 18px; }
      @media print { body { margin: 16px; } .card { break-inside: avoid; } table { break-inside: auto; } }
    </style>
  </head>
  <body>
    <div class="header">
      <div>
        <div class="muted">${escapeHtml(documentTitle)} document</div>
        <h1>${escapeHtml(documentTitle)} ${escapeHtml(invoice.number)}</h1>
        <p>Status: ${escapeHtml(invoice.status)}</p>
      </div>
      <div class="card">
        <div class="muted">Issuer</div>
        <h3>${escapeHtml(view.issuer.legalName)}</h3>
        <p>${escapeHtml(view.issuer.commercialName ?? view.issuer.tenantSlug)}</p>
        <p>${view.issuer.taxId ? `RUC: ${escapeHtml(view.issuer.taxId)}` : 'No tax profile configured'}</p>
      </div>
    </div>
    <div class="grid">
      <div class="card">
        <div class="muted">Issuer fiscal data</div>
        <p>Environment: ${escapeHtml(view.issuer.environment ?? 'not set')}</p>
        <p>Emission type: ${escapeHtml(view.issuer.emissionType ?? 'not set')}</p>
        <p>Matrix address: ${escapeHtml(view.issuer.matrixAddress ?? 'Not set')}</p>
        <p>Establishment address: ${escapeHtml(view.issuer.establishmentAddress ?? 'Not set')}</p>
      </div>
      <div class="card">
        <div class="muted">Customer</div>
        <h3>${escapeHtml(view.customer.name)}</h3>
        <p>${view.customer.email ? escapeHtml(view.customer.email) : 'No email configured'}</p>
        <p>${view.customer.identificationType ? `Tipo ID: ${escapeHtml(view.customer.identificationType)}` : 'Tipo ID no configurado'}</p>
        <p>${view.customer.identification ? escapeHtml(view.customer.identification) : 'No tax ID configured'}</p>
        <p>${view.customer.billingAddress ? escapeHtml(view.customer.billingAddress) : 'Direccion no configurada'}</p>
      </div>
      <div class="card">
        <div class="muted">Dates</div>
        <p>Issued: ${formatDocumentDate(invoice.issuedAt)}</p>
        <p>Due: ${formatDocumentDate(invoice.dueAt)}</p>
        <p>Currency: ${escapeHtml(invoice.currency)}</p>
        <p>Document code: ${escapeHtml(invoice.documentCode ?? 'Not set')}</p>
        <p>Establishment: ${escapeHtml(invoice.establishmentCode ?? 'Not set')}</p>
        <p>Emission point: ${escapeHtml(invoice.emissionPointCode ?? 'Not set')}</p>
        <p>Sequence: ${invoice.sequenceNumber !== null ? escapeHtml(String(invoice.sequenceNumber)) : 'Not set'}</p>
      </div>
      <div class="card">
        <div class="muted">Electronic authorization</div>
        <p>Status: ${escapeHtml(invoice.electronicStatus ?? 'not set')}</p>
        <p>Access key: ${escapeHtml(invoice.accessKey ?? 'Not set')}</p>
        <p>Authorization: ${escapeHtml(invoice.authorizationNumber ?? 'Not set')}</p>
        <p>Authorized at: ${formatDocumentDate(invoice.authorizedAt ?? null)}</p>
        <p>Signed at: ${formatDocumentDate(invoice.signedAt ?? null)}</p>
        <p>Submitted at: ${formatDocumentDate(invoice.submittedAt ?? null)}</p>
        <p>Submission ref: ${escapeHtml(invoice.submissionReference ?? 'Not set')}</p>
      </div>
    </div>
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Description</th>
          <th>Qty</th>
          <th>Unit price</th>
          <th>Tax</th>
          <th>Tax total</th>
          <th>Line total</th>
        </tr>
      </thead>
      <tbody>
        ${lineRows}
      </tbody>
    </table>
    <div class="totals">
      <div class="totals-row"><span>Subtotal</span><strong>${formatMoney(view.totals.subtotalInCents)}</strong></div>
      <div class="totals-row"><span>Tax</span><strong>${formatMoney(view.totals.taxInCents)}</strong></div>
      <div class="totals-row grand-total"><span>Total</span><span>${formatMoney(view.totals.totalInCents)}</span></div>
    </div>
    ${
      invoice.notes
        ? `<div class="card" style="margin-top:24px;"><div class="muted">Notes</div><p>${escapeHtml(invoice.notes)}</p></div>`
        : ''
    }
  </body>
</html>
  `.trim();
}

export function renderInvoiceRideHtml(view: InvoiceRideView): string {
  const invoice = view.invoice.toPrimitives();
  const formatMoney = createDocumentCurrencyFormatter(invoice.currency);
  const lineRows = view.lines
    .map(
      (line) => `
        <tr>
          <td>${line.position}</td>
          <td>${escapeHtml(line.description)}</td>
          <td>${line.quantity}</td>
          <td>${formatMoney(line.lineSubtotalInCents)}</td>
          <td>${formatMoney(line.lineTaxInCents)}</td>
          <td>${formatMoney(line.lineTotalInCents)}</td>
        </tr>
      `,
    )
    .join('');

  return `
<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(view.ride.documentLabel)} ${escapeHtml(invoice.number)}</title>
    <style>
      body { font-family: Arial, sans-serif; color: #241d18; margin: 24px; background: #f8f3eb; }
      .ride-shell { max-width: 980px; margin: 0 auto; background: #ffffff; border: 1px solid #d7c7b6; border-radius: 20px; overflow: hidden; }
      .hero { display: grid; grid-template-columns: 1.3fr 1fr; gap: 24px; padding: 24px; background: linear-gradient(135deg, #fff7ed, #f3e7d6); border-bottom: 1px solid #d7c7b6; }
      .stack { display: grid; gap: 12px; }
      .code-box { font-family: "Courier New", monospace; font-size: 12px; line-height: 1.5; padding: 12px; border-radius: 12px; background: #2a211a; color: #fff4e8; word-break: break-all; }
      .badge { display: inline-flex; padding: 6px 10px; border-radius: 999px; background: #2d6a4f; color: white; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; }
      .badge.pending { background: #9a6700; }
      .badge.rejected { background: #a61b29; }
      .grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; padding: 24px; }
      .card { border: 1px solid #eadbc9; border-radius: 16px; padding: 16px; background: #fffdf9; }
      .muted { color: #6f6358; font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 6px; }
      h1, h2, h3, p { margin: 0; }
      h1 { font-size: 30px; margin-bottom: 8px; }
      h2 { font-size: 18px; margin-bottom: 12px; }
      table { width: calc(100% - 48px); margin: 0 24px 24px; border-collapse: collapse; }
      th, td { border-bottom: 1px solid #e4d7c9; padding: 12px 8px; text-align: left; vertical-align: top; }
      th { font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; color: #6f6358; }
      .totals { width: 320px; margin: 0 24px 24px auto; display: grid; gap: 8px; }
      .totals-row { display: flex; justify-content: space-between; gap: 16px; }
      .grand-total { font-weight: 700; font-size: 18px; }
      .footer { padding: 0 24px 24px; color: #6f6358; font-size: 13px; line-height: 1.5; }
      @media print { body { margin: 0; background: white; } .ride-shell { border: none; border-radius: 0; } }
    </style>
  </head>
  <body>
    <div class="ride-shell">
      <div class="hero">
        <div class="stack">
          <div class="muted">Representacion impresa del documento electronico</div>
          <h1>${escapeHtml(view.ride.documentLabel)}</h1>
          <p>${escapeHtml(view.issuer.legalName)}</p>
          <p>${view.issuer.taxId ? `RUC ${escapeHtml(view.issuer.taxId)}` : 'RUC no configurado'}</p>
          <p>${escapeHtml(invoice.number)}</p>
          <div>
            <span class="badge ${invoice.electronicStatus === 'authorized' ? '' : invoice.electronicStatus === 'rejected' ? 'rejected' : 'pending'}">${escapeHtml(view.ride.electronicStatusLabel)}</span>
          </div>
        </div>
        <div class="stack">
          <div class="card">
            <div class="muted">Clave de acceso</div>
            <div class="code-box">${
              view.ride.accessKeyChunks.length > 0
                ? view.ride.accessKeyChunks.map((chunk) => escapeHtml(chunk)).join(' · ')
                : 'No generada'
            }</div>
          </div>
          <div class="card">
            <div class="muted">Autorizacion SRI</div>
            <p>${escapeHtml(view.ride.authorizationNumber ?? 'Pendiente de autorizacion')}</p>
            <p>${escapeHtml(
              view.ride.authorizedAt
                ? formatDocumentDate(view.ride.authorizedAt)
                : 'Sin fecha de autorizacion',
            )}</p>
          </div>
        </div>
      </div>

      <div class="grid">
        <div class="card">
          <div class="muted">Emisor</div>
          <h2>${escapeHtml(view.issuer.commercialName ?? view.issuer.legalName)}</h2>
          <p>Ambiente: ${escapeHtml(view.ride.environmentLabel)}</p>
          <p>Emision: ${escapeHtml(view.ride.emissionTypeLabel)}</p>
          <p>Direccion matriz: ${escapeHtml(view.issuer.matrixAddress ?? 'No configurada')}</p>
          <p>Direccion establecimiento: ${escapeHtml(view.issuer.establishmentAddress ?? 'No configurada')}</p>
        </div>
        <div class="card">
          <div class="muted">Comprador</div>
          <h2>${escapeHtml(view.customer.name)}</h2>
          <p>${view.customer.identificationType ? `Tipo ID: ${escapeHtml(view.customer.identificationType)}` : 'Tipo ID no configurado'}</p>
          <p>${escapeHtml(view.customer.identification ?? view.customer.taxId ?? 'Sin identificacion')}</p>
          <p>${escapeHtml(view.customer.billingAddress ?? 'Sin direccion del comprador')}</p>
        </div>
        <div class="card">
          <div class="muted">Datos del comprobante</div>
          <p>Fecha de emision: ${escapeHtml(formatDocumentDate(invoice.issuedAt))}</p>
          <p>CodDoc: ${escapeHtml(invoice.documentCode ?? 'No configurado')}</p>
          <p>Establecimiento: ${escapeHtml(invoice.establishmentCode ?? '---')}</p>
          <p>Punto de emision: ${escapeHtml(invoice.emissionPointCode ?? '---')}</p>
          <p>Secuencial: ${escapeHtml(view.ride.sequenceDisplay ?? 'Manual')}</p>
        </div>
        <div class="card">
          <div class="muted">Estado electronico</div>
          <p>${escapeHtml(view.ride.electronicStatusLabel)}</p>
          <p>${escapeHtml(view.ride.authorizationMessage ?? 'Sin mensaje tecnico adicional')}</p>
          <p>${view.ride.canBePrintedAsAuthorized ? 'Este RIDE refleja un comprobante autorizado.' : 'Este RIDE es referencial mientras no exista autorizacion definitiva.'}</p>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Descripcion</th>
            <th>Cantidad</th>
            <th>Subtotal</th>
            <th>Impuesto</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${lineRows}
        </tbody>
      </table>

      <div class="totals">
        <div class="totals-row"><span>Subtotal</span><strong>${formatMoney(view.totals.subtotalInCents)}</strong></div>
        <div class="totals-row"><span>Impuestos</span><strong>${formatMoney(view.totals.taxInCents)}</strong></div>
        <div class="totals-row grand-total"><span>Total</span><span>${formatMoney(view.totals.totalInCents)}</span></div>
      </div>

      ${
        view.ride.additionalInfoFields.length > 0
          ? `
      <div class="grid" style="padding-top:0;">
        <div class="card" style="grid-column: 1 / -1;">
          <div class="muted">Informacion adicional</div>
          ${view.ride.additionalInfoFields
            .map(
              (field) =>
                `<p><strong>${escapeHtml(field.label)}:</strong> ${escapeHtml(field.value)}</p>`,
            )
            .join('')}
        </div>
      </div>`
          : ''
      }

      <div class="footer">
        <p>RIDE generado desde la base de Electronic Invoicing EC del tenant ${escapeHtml(view.issuer.tenantSlug)}.</p>
        <p>Este documento resume los datos visibles del comprobante electronico y su estado de autorizacion al momento de la consulta.</p>
      </div>
    </div>
  </body>
</html>
  `.trim();
}
