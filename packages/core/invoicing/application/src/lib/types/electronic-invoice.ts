import { Invoice, IssuerProfile } from '@saas-platform/invoicing-domain';
import { InvoiceDocumentLineView, InvoiceDocumentView } from './invoice-view';

const IVA_PERCENTAGE_CODE_BY_RATE = new Map<number, string>([
  [0, '0'],
  [12, '2'],
  [13, '3'],
  [15, '4'],
]);

export interface SriAccessKeyInput {
  invoice: Invoice;
  issuerProfile: IssuerProfile;
}

export interface SriAccessKeyRequirements {
  issuerProfilePresent: boolean;
  hasDocumentCode: boolean;
  hasEstablishmentCode: boolean;
  hasEmissionPointCode: boolean;
  hasSequenceNumber: boolean;
}

export function formatEcuadorInvoiceNumber(input: {
  establishmentCode: string;
  emissionPointCode: string;
  sequenceNumber: number;
}): string {
  return `${input.establishmentCode}-${input.emissionPointCode}-${String(
    input.sequenceNumber,
  ).padStart(9, '0')}`;
}

export function formatSriIssueDate(value: Date): string {
  const day = String(value.getUTCDate()).padStart(2, '0');
  const month = String(value.getUTCMonth() + 1).padStart(2, '0');
  const year = String(value.getUTCFullYear());

  return `${day}/${month}/${year}`;
}

export function getSriAccessKeyRequirements(
  invoice: Invoice,
  issuerProfile: IssuerProfile | null,
): SriAccessKeyRequirements {
  return {
    issuerProfilePresent: issuerProfile !== null,
    hasDocumentCode: Boolean(invoice.documentCode),
    hasEstablishmentCode: Boolean(invoice.establishmentCode),
    hasEmissionPointCode: Boolean(invoice.emissionPointCode),
    hasSequenceNumber: invoice.sequenceNumber !== null,
  };
}

export function canBuildSriAccessKey(
  invoice: Invoice,
  issuerProfile: IssuerProfile | null,
): issuerProfile is IssuerProfile {
  const requirements = getSriAccessKeyRequirements(invoice, issuerProfile);

  return (
    requirements.issuerProfilePresent &&
    requirements.hasDocumentCode &&
    requirements.hasEstablishmentCode &&
    requirements.hasEmissionPointCode &&
    requirements.hasSequenceNumber
  );
}

export function buildSriAccessKey(input: SriAccessKeyInput): string {
  const issuedAt = formatSriIssueDate(input.invoice.issuedAt).replace(/\//g, '');
  const documentCode = input.invoice.documentCode ?? '';
  const taxId = normalizeDigits(input.issuerProfile.taxId);
  const environment = input.issuerProfile.environment === 'production' ? '2' : '1';
  const establishmentCode = input.invoice.establishmentCode ?? '';
  const emissionPointCode = input.invoice.emissionPointCode ?? '';
  const sequenceNumber = String(input.invoice.sequenceNumber ?? '').padStart(9, '0');
  const numericCode = deterministicNumericCode(input.invoice.id);
  const emissionType = input.issuerProfile.emissionType === 'normal' ? '1' : '1';
  const partialAccessKey = [
    issuedAt,
    documentCode,
    taxId,
    environment,
    establishmentCode,
    emissionPointCode,
    sequenceNumber,
    numericCode,
    emissionType,
  ].join('');

  return `${partialAccessKey}${calculateModulo11CheckDigit(partialAccessKey)}`;
}

export function buildSriInvoiceXmlPreview(input: {
  document: InvoiceDocumentView;
  accessKey: string;
}): string {
  const invoice = input.document.invoice.toPrimitives();
  const details = buildInvoiceXmlDetails(input.document.lines);
  const paymentDelayInDays = invoice.dueAt
    ? Math.max(calculateDiffInDays(invoice.issuedAt, invoice.dueAt), 0)
    : 0;

  const totalTaxesXml = details.taxGroups
    .map(
      (group) => `
      <totalImpuesto>
        <codigo>2</codigo>
        <codigoPorcentaje>${escapeXml(group.percentageCode)}</codigoPorcentaje>
        <baseImponible>${formatCents(group.baseInCents)}</baseImponible>
        <valor>${formatCents(group.taxInCents)}</valor>
      </totalImpuesto>`,
    )
    .join('');

  const detailXml = details.lines
    .map(
      (line) => `
      <detalle>
        <codigoPrincipal>${line.position}</codigoPrincipal>
        <descripcion>${escapeXml(line.description)}</descripcion>
        <cantidad>${formatQuantity(line.quantity)}</cantidad>
        <precioUnitario>${formatCents(line.unitPriceInCents)}</precioUnitario>
        <descuento>0.00</descuento>
        <precioTotalSinImpuesto>${formatCents(line.lineSubtotalInCents)}</precioTotalSinImpuesto>
        <impuestos>
          <impuesto>
            <codigo>2</codigo>
            <codigoPorcentaje>${escapeXml(line.taxPercentageCode)}</codigoPorcentaje>
            <tarifa>${formatPercentage(line.taxRatePercentage ?? 0)}</tarifa>
            <baseImponible>${formatCents(line.lineSubtotalInCents)}</baseImponible>
            <valor>${formatCents(line.lineTaxInCents)}</valor>
          </impuesto>
        </impuestos>
      </detalle>`,
    )
    .join('');

  const obligatedAccounting = input.document.issuer.accountingObligated ? 'SI' : 'NO';

  return `<?xml version="1.0" encoding="UTF-8"?>
<factura id="comprobante" version="2.1.0">
  <infoTributaria>
    <ambiente>${escapeXml(
      input.document.issuer.environment === 'production' ? '2' : '1',
    )}</ambiente>
    <tipoEmision>${escapeXml(
      input.document.issuer.emissionType === 'normal' ? '1' : '1',
    )}</tipoEmision>
    <razonSocial>${escapeXml(input.document.issuer.legalName)}</razonSocial>
    ${input.document.issuer.commercialName ? `<nombreComercial>${escapeXml(input.document.issuer.commercialName)}</nombreComercial>` : ''}
    <ruc>${escapeXml(normalizeDigits(input.document.issuer.taxId ?? ''))}</ruc>
    <claveAcceso>${escapeXml(input.accessKey)}</claveAcceso>
    <codDoc>${escapeXml(invoice.documentCode ?? '')}</codDoc>
    <estab>${escapeXml(invoice.establishmentCode ?? '')}</estab>
    <ptoEmi>${escapeXml(invoice.emissionPointCode ?? '')}</ptoEmi>
    <secuencial>${escapeXml(String(invoice.sequenceNumber ?? '').padStart(9, '0'))}</secuencial>
    <dirMatriz>${escapeXml(input.document.issuer.matrixAddress ?? '')}</dirMatriz>
  </infoTributaria>
  <infoFactura>
    <fechaEmision>${escapeXml(formatSriIssueDate(invoice.issuedAt))}</fechaEmision>
    <dirEstablecimiento>${escapeXml(
      input.document.issuer.establishmentAddress ?? input.document.issuer.matrixAddress ?? '',
    )}</dirEstablecimiento>
    ${
      input.document.issuer.specialTaxpayerCode
        ? `<contribuyenteEspecial>${escapeXml(
            input.document.issuer.specialTaxpayerCode,
          )}</contribuyenteEspecial>`
        : ''
    }
    <obligadoContabilidad>${obligatedAccounting}</obligadoContabilidad>
    <tipoIdentificacionComprador>${escapeXml(
      input.document.customer.identificationType ?? '',
    )}</tipoIdentificacionComprador>
    <razonSocialComprador>${escapeXml(input.document.customer.name)}</razonSocialComprador>
    <identificacionComprador>${escapeXml(
      input.document.customer.identification ?? input.document.customer.taxId ?? '',
    )}</identificacionComprador>
    <direccionComprador>${escapeXml(
      input.document.customer.billingAddress ?? '',
    )}</direccionComprador>
    <totalSinImpuestos>${formatCents(input.document.totals.subtotalInCents)}</totalSinImpuestos>
    <totalDescuento>0.00</totalDescuento>
    <totalConImpuestos>${totalTaxesXml}
    </totalConImpuestos>
    <propina>0.00</propina>
    <importeTotal>${formatCents(input.document.totals.totalInCents)}</importeTotal>
    <moneda>${escapeXml(invoice.currency)}</moneda>
    <pagos>
      <pago>
        <formaPago>20</formaPago>
        <total>${formatCents(input.document.totals.totalInCents)}</total>
        <plazo>${paymentDelayInDays}</plazo>
        <unidadTiempo>DAYS</unidadTiempo>
      </pago>
    </pagos>
  </infoFactura>
  <detalles>${detailXml}
  </detalles>
</factura>
`;
}

export function validateSriInvoiceXml(input: {
  xml: string;
  accessKey: string;
}): string[] {
  const issues: string[] = [];
  const xml = input.xml;
  const accessKey = normalizeDigits(input.accessKey);

  if (!xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')) {
    issues.push('El XML debe comenzar con la declaracion XML UTF-8.');
  }

  if (!xml.includes('<factura id="comprobante" version="2.1.0">')) {
    issues.push('El comprobante debe declarar factura version 2.1.0.');
  }

  if (!xml.includes('<infoTributaria>')) {
    issues.push('Falta el bloque infoTributaria.');
  }

  if (!xml.includes('<infoFactura>')) {
    issues.push('Falta el bloque infoFactura.');
  }

  if (!xml.includes('<detalles>')) {
    issues.push('Falta el bloque detalles.');
  }

  if (!xml.includes(`<claveAcceso>${escapeXml(input.accessKey)}</claveAcceso>`)) {
    issues.push('La clave de acceso del XML no coincide con la clave calculada.');
  }

  if (accessKey.length !== 49) {
    issues.push('La clave de acceso debe tener exactamente 49 digitos.');
  } else {
    const expectedCheckDigit = calculateModulo11CheckDigit(accessKey.slice(0, 48));

    if (accessKey[48] !== expectedCheckDigit) {
      issues.push('La clave de acceso no cumple el digito verificador modulo 11.');
    }
  }

  for (const tagName of [
    'ruc',
    'codDoc',
    'estab',
    'ptoEmi',
    'secuencial',
    'fechaEmision',
    'tipoIdentificacionComprador',
    'razonSocialComprador',
    'identificacionComprador',
    'importeTotal',
  ]) {
    if (!extractTagValue(xml, tagName)) {
      issues.push(`Falta el valor obligatorio ${tagName} en el XML.`);
    }
  }

  const ambiente = extractTagValue(xml, 'ambiente');
  const tipoEmision = extractTagValue(xml, 'tipoEmision');
  const codDoc = extractTagValue(xml, 'codDoc');
  const estab = extractTagValue(xml, 'estab');
  const ptoEmi = extractTagValue(xml, 'ptoEmi');
  const secuencial = extractTagValue(xml, 'secuencial');
  const fechaEmision = extractTagValue(xml, 'fechaEmision');
  const razonSocial = extractTagValue(xml, 'razonSocial');
  const dirMatriz = extractTagValue(xml, 'dirMatriz');
  const dirEstablecimiento = extractTagValue(xml, 'dirEstablecimiento');
  const ruc = extractTagValue(xml, 'ruc');
  const buyerIdentificationType = extractTagValue(
    xml,
    'tipoIdentificacionComprador',
  );
  const buyerName = extractTagValue(xml, 'razonSocialComprador');
  const buyerIdentification = extractTagValue(xml, 'identificacionComprador');
  const buyerAddress = extractTagValue(xml, 'direccionComprador');
  const totalSinImpuestos = extractTagValue(xml, 'totalSinImpuestos');
  const totalDescuento = extractTagValue(xml, 'totalDescuento');
  const importeTotal = extractTagValue(xml, 'importeTotal');
  const propina = extractTagValue(xml, 'propina');
  const moneda = extractTagValue(xml, 'moneda');
  const paymentTotal = extractTagValue(xml, 'total');
  const infoTributariaBlocks = extractTagBlocks(xml, 'infoTributaria');
  const infoFacturaBlocks = extractTagBlocks(xml, 'infoFactura');
  const pagosBlocks = extractTagBlocks(xml, 'pagos');
  const pagoBlocks = extractTagBlocks(xml, 'pago');
  const detalleBlocks = extractTagBlocks(xml, 'detalle');
  const totalImpuestoBlocks = extractTagBlocks(xml, 'totalImpuesto');

  if (infoTributariaBlocks.length !== 1) {
    issues.push('El XML debe contener exactamente un bloque infoTributaria.');
  }

  if (infoFacturaBlocks.length !== 1) {
    issues.push('El XML debe contener exactamente un bloque infoFactura.');
  }

  if (pagosBlocks.length !== 1) {
    issues.push('El XML debe contener exactamente un bloque pagos.');
  }

  if (pagoBlocks.length !== 1) {
    issues.push('El XML debe contener exactamente un bloque pago para este MVP.');
  }

  if (ambiente && !['1', '2'].includes(ambiente)) {
    issues.push('El ambiente del XML debe ser 1 o 2.');
  }

  if (tipoEmision && tipoEmision !== '1') {
    issues.push('El tipo de emision soportado por ahora debe ser 1.');
  }

  if (codDoc && !/^\d{2}$/.test(codDoc)) {
    issues.push('El codigo de documento debe tener 2 digitos.');
  }

  if (estab && !/^\d{3}$/.test(estab)) {
    issues.push('El codigo de establecimiento debe tener 3 digitos.');
  }

  if (ptoEmi && !/^\d{3}$/.test(ptoEmi)) {
    issues.push('El punto de emision debe tener 3 digitos.');
  }

  if (secuencial && !/^\d{9}$/.test(secuencial)) {
    issues.push('El secuencial debe tener 9 digitos.');
  }

  if (fechaEmision && !/^\d{2}\/\d{2}\/\d{4}$/.test(fechaEmision)) {
    issues.push('La fecha de emision debe tener formato dd/mm/yyyy.');
  }

  if (!razonSocial || razonSocial.trim().length < 3) {
    issues.push('La razon social del emisor debe tener contenido suficiente.');
  }

  if (!dirMatriz || dirMatriz.trim().length < 5) {
    issues.push('La direccion matriz del emisor debe estar informada.');
  }

  if (!dirEstablecimiento || dirEstablecimiento.trim().length < 5) {
    issues.push('La direccion del establecimiento debe estar informada.');
  }

  if (ruc && normalizeDigits(ruc).length !== 13) {
    issues.push('El RUC del emisor en el XML debe tener 13 digitos.');
  }

  if (!buyerIdentification || normalizeDigits(buyerIdentification).length < 5) {
    issues.push(
      'La identificacion del comprador debe estar presente y tener una longitud razonable.',
    );
  }

  if (!buyerName || buyerName.trim().length < 3) {
    issues.push('La razon social del comprador debe tener contenido suficiente.');
  }

  if (!buyerAddress || buyerAddress.trim().length < 5) {
    issues.push('La direccion del comprador debe estar informada.');
  }

  if (buyerIdentificationType) {
    validateBuyerIdentificationByType(
      buyerIdentificationType,
      buyerIdentification,
      issues,
    );
  }

  if (detalleBlocks.length === 0) {
    issues.push('La factura electronica debe contener al menos un detalle.');
  }

  const parsedSubtotal = parseAmount(totalSinImpuestos);
  const parsedTotal = parseAmount(importeTotal);
  const parsedPaymentTotal = parseAmount(paymentTotal);
  const detailSubtotalSum = sumTagValues(detalleBlocks, 'precioTotalSinImpuesto');
  const detailTaxSum = sumNestedTaxValues(detalleBlocks, 'valor');
  const headerTaxSum = sumTagValues(totalImpuestoBlocks, 'valor');

  if (parsedSubtotal === null) {
    issues.push('totalSinImpuestos debe ser un decimal valido con dos decimales.');
  }

  if (parseAmount(totalDescuento) === null) {
    issues.push('totalDescuento debe ser un decimal valido con dos decimales.');
  }

  if (parsedTotal === null) {
    issues.push('importeTotal debe ser un decimal valido con dos decimales.');
  }

  if (parseAmount(propina) === null) {
    issues.push('propina debe ser un decimal valido con dos decimales.');
  }

  if (parsedPaymentTotal === null) {
    issues.push('El total del bloque pagos debe ser un decimal valido con dos decimales.');
  }

  if (!moneda || !/^[A-Z]{3}$/.test(moneda)) {
    issues.push('La moneda debe estar en formato ISO de 3 letras mayusculas.');
  }

  if (parsedSubtotal !== null && detailSubtotalSum !== parsedSubtotal) {
    issues.push(
      'La suma de precioTotalSinImpuesto de los detalles no coincide con totalSinImpuestos.',
    );
  }

  if (detailTaxSum !== headerTaxSum) {
    issues.push(
      'La suma de impuestos de los detalles no coincide con totalConImpuestos.',
    );
  }

  if (
    parsedSubtotal !== null &&
    parsedTotal !== null &&
    parsedSubtotal + headerTaxSum !== parsedTotal
  ) {
    issues.push(
      'importeTotal no coincide con totalSinImpuestos mas totalConImpuestos.',
    );
  }

  if (parsedTotal !== null && parsedPaymentTotal !== null && parsedTotal !== parsedPaymentTotal) {
    issues.push('El bloque pagos debe coincidir con el importe total de la factura.');
  }

  validatePaymentBlocks(pagoBlocks, issues);
  validateTotalTaxBlocks(totalImpuestoBlocks, issues);
  validateDetailBlocks(detalleBlocks, issues);

  return issues;
}

function buildInvoiceXmlDetails(lines: InvoiceDocumentLineView[]): {
  lines: Array<
    InvoiceDocumentLineView & {
      taxPercentageCode: string;
    }
  >;
  taxGroups: Array<{
    percentageCode: string;
    baseInCents: number;
    taxInCents: number;
  }>;
} {
  const taxGroups = new Map<
    string,
    { percentageCode: string; baseInCents: number; taxInCents: number }
  >();

  const normalizedLines = lines.map((line) => {
    const taxPercentageCode = toSriIvaPercentageCode(line.taxRatePercentage);
    const existingGroup = taxGroups.get(taxPercentageCode);

    if (existingGroup) {
      existingGroup.baseInCents += line.lineSubtotalInCents;
      existingGroup.taxInCents += line.lineTaxInCents;
    } else {
      taxGroups.set(taxPercentageCode, {
        percentageCode: taxPercentageCode,
        baseInCents: line.lineSubtotalInCents,
        taxInCents: line.lineTaxInCents,
      });
    }

    return {
      ...line,
      taxPercentageCode,
    };
  });

  return {
    lines: normalizedLines,
    taxGroups: Array.from(taxGroups.values()),
  };
}

function toSriIvaPercentageCode(percentage: number | null): string {
  if (percentage === null) {
    return '0';
  }

  return IVA_PERCENTAGE_CODE_BY_RATE.get(percentage) ?? '6';
}

function deterministicNumericCode(seed: string): string {
  let hash = 0;

  for (const character of seed) {
    hash = (hash * 31 + character.charCodeAt(0)) % 100_000_000;
  }

  return String(hash).padStart(8, '0');
}

function calculateModulo11CheckDigit(value: string): string {
  let multiplier = 2;
  let total = 0;

  for (let index = value.length - 1; index >= 0; index -= 1) {
    total += Number(value[index]) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }

  const remainder = 11 - (total % 11);

  if (remainder === 11) {
    return '0';
  }

  if (remainder === 10) {
    return '1';
  }

  return String(remainder);
}

function calculateDiffInDays(start: Date, end: Date): number {
  const millisecondsPerDay = 24 * 60 * 60 * 1000;

  return Math.round((end.getTime() - start.getTime()) / millisecondsPerDay);
}

function normalizeDigits(value: string): string {
  return value.replace(/\D/g, '');
}

function formatCents(valueInCents: number): string {
  return (valueInCents / 100).toFixed(2);
}

function formatPercentage(value: number): string {
  return value.toFixed(2);
}

function formatQuantity(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(2);
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function extractTagValue(xml: string, tagName: string): string | null {
  const tagPattern = new RegExp(`<${tagName}>([\\s\\S]*?)<\\/${tagName}>`, 'i');
  const match = xml.match(tagPattern);

  return match?.[1]?.trim() || null;
}

function extractTagBlocks(xml: string, tagName: string): string[] {
  const blockPattern = new RegExp(`<${tagName}>([\\s\\S]*?)<\\/${tagName}>`, 'gi');

  return Array.from(xml.matchAll(blockPattern), (match) => match[1] ?? '');
}

function parseAmount(value: string | null): number | null {
  if (!value || !/^-?\d+\.\d{2}$/.test(value.trim())) {
    return null;
  }

  return Math.round(Number(value) * 100);
}

function sumTagValues(blocks: string[], tagName: string): number {
  return blocks.reduce((total, block) => {
    const value = parseAmount(extractTagValue(block, tagName));

    return total + (value ?? 0);
  }, 0);
}

function sumNestedTaxValues(blocks: string[], tagName: string): number {
  return blocks.reduce((total, block) => {
    const taxBlocks = extractTagBlocks(block, 'impuesto');

    return total + sumTagValues(taxBlocks, tagName);
  }, 0);
}

function validateBuyerIdentificationByType(
  identificationType: string,
  identification: string | null,
  issues: string[],
): void {
  const normalizedIdentification = normalizeDigits(identification ?? '');

  switch (identificationType) {
    case '04':
      if (normalizedIdentification.length !== 13) {
        issues.push('El comprador con tipo 04 debe tener un RUC de 13 digitos.');
      }
      break;
    case '05':
      if (normalizedIdentification.length !== 10) {
        issues.push('El comprador con tipo 05 debe tener una cedula de 10 digitos.');
      }
      break;
    case '06':
      if ((identification ?? '').trim().length < 3) {
        issues.push('El comprador con tipo 06 debe tener una identificacion valida.');
      }
      break;
    case '07':
      if (normalizedIdentification !== '9999999999999') {
        issues.push(
          'El comprador con tipo 07 debe usar la identificacion 9999999999999.',
        );
      }
      break;
    case '08':
      if ((identification ?? '').trim().length < 5) {
        issues.push('El comprador con tipo 08 debe tener una identificacion suficiente.');
      }
      break;
    default:
      issues.push('El tipo de identificacion del comprador no es valido para Ecuador.');
      break;
  }
}

function validatePaymentBlocks(blocks: string[], issues: string[]): void {
  for (const block of blocks) {
    const formaPago = extractTagValue(block, 'formaPago');
    const plazo = extractTagValue(block, 'plazo');
    const unidadTiempo = extractTagValue(block, 'unidadTiempo');
    const total = extractTagValue(block, 'total');

    if (!formaPago || !/^\d{2}$/.test(formaPago)) {
      issues.push('Cada pago debe incluir una formaPago de 2 digitos.');
    }

    if (parseAmount(total) === null) {
      issues.push('Cada pago debe incluir un total decimal valido.');
    }

    if (!plazo || !/^\d+$/.test(plazo)) {
      issues.push('Cada pago debe incluir un plazo entero no negativo.');
    }

    if (!unidadTiempo || !/^[A-Z]+$/.test(unidadTiempo)) {
      issues.push('Cada pago debe incluir una unidadTiempo valida en mayusculas.');
    }
  }
}

function validateTotalTaxBlocks(blocks: string[], issues: string[]): void {
  if (blocks.length === 0) {
    issues.push('El bloque totalConImpuestos debe contener al menos un totalImpuesto.');
    return;
  }

  for (const block of blocks) {
    const codigo = extractTagValue(block, 'codigo');
    const codigoPorcentaje = extractTagValue(block, 'codigoPorcentaje');
    const baseImponible = extractTagValue(block, 'baseImponible');
    const valor = extractTagValue(block, 'valor');

    if (codigo !== '2') {
      issues.push('Cada totalImpuesto debe usar codigo 2 para IVA en este MVP.');
    }

    if (!codigoPorcentaje || !/^\d+$/.test(codigoPorcentaje)) {
      issues.push('Cada totalImpuesto debe incluir un codigoPorcentaje numerico.');
    }

    if (parseAmount(baseImponible) === null) {
      issues.push('Cada totalImpuesto debe incluir una baseImponible decimal valida.');
    }

    if (parseAmount(valor) === null) {
      issues.push('Cada totalImpuesto debe incluir un valor decimal valido.');
    }
  }
}

function validateDetailBlocks(blocks: string[], issues: string[]): void {
  for (const block of blocks) {
    const codigoPrincipal = extractTagValue(block, 'codigoPrincipal');
    const descripcion = extractTagValue(block, 'descripcion');
    const cantidad = extractTagValue(block, 'cantidad');
    const precioUnitario = extractTagValue(block, 'precioUnitario');
    const descuento = extractTagValue(block, 'descuento');
    const precioTotalSinImpuesto = extractTagValue(block, 'precioTotalSinImpuesto');
    const impuestoBlocks = extractTagBlocks(block, 'impuesto');

    if (!codigoPrincipal || !/^\d+$/.test(codigoPrincipal)) {
      issues.push('Cada detalle debe incluir un codigoPrincipal numerico.');
    }

    if (!descripcion || descripcion.trim().length < 3) {
      issues.push('Cada detalle debe incluir una descripcion suficiente.');
    }

    if (!cantidad || !/^\d+(\.\d{1,2})?$/.test(cantidad) || Number(cantidad) <= 0) {
      issues.push('Cada detalle debe incluir una cantidad positiva valida.');
    }

    if (parseAmount(precioUnitario) === null) {
      issues.push('Cada detalle debe incluir un precioUnitario decimal valido.');
    }

    if (parseAmount(descuento) === null) {
      issues.push('Cada detalle debe incluir un descuento decimal valido.');
    }

    if (parseAmount(precioTotalSinImpuesto) === null) {
      issues.push(
        'Cada detalle debe incluir un precioTotalSinImpuesto decimal valido.',
      );
    }

    if (impuestoBlocks.length === 0) {
      issues.push('Cada detalle debe contener al menos un impuesto.');
      continue;
    }

    for (const impuestoBlock of impuestoBlocks) {
      const codigo = extractTagValue(impuestoBlock, 'codigo');
      const codigoPorcentaje = extractTagValue(impuestoBlock, 'codigoPorcentaje');
      const tarifa = extractTagValue(impuestoBlock, 'tarifa');
      const baseImponible = extractTagValue(impuestoBlock, 'baseImponible');
      const valor = extractTagValue(impuestoBlock, 'valor');

      if (codigo !== '2') {
        issues.push('Cada impuesto de detalle debe usar codigo 2 para IVA en este MVP.');
      }

      if (!codigoPorcentaje || !/^\d+$/.test(codigoPorcentaje)) {
        issues.push('Cada impuesto de detalle debe incluir un codigoPorcentaje numerico.');
      }

      if (!tarifa || !/^\d+\.\d{2}$/.test(tarifa)) {
        issues.push('Cada impuesto de detalle debe incluir una tarifa decimal valida.');
      }

      if (parseAmount(baseImponible) === null) {
        issues.push(
          'Cada impuesto de detalle debe incluir una baseImponible decimal valida.',
        );
      }

      if (parseAmount(valor) === null) {
        issues.push('Cada impuesto de detalle debe incluir un valor decimal valido.');
      }
    }
  }
}
