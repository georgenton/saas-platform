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

export function buildSriElectronicDocumentXmlPreview(input: {
  document: InvoiceDocumentView;
  accessKey: string;
}): string {
  const invoice = input.document.invoice.toPrimitives();
  const documentCode = invoice.documentCode ?? '01';
  const isCreditNote = documentCode === '04';
  const isDebitNote = documentCode === '05';
  const isRemissionGuide = documentCode === '06';
  const isWithholding = documentCode === '07';
  const xmlLines =
    isCreditNote
      ? input.document.lines.map((line) => ({
          ...line,
          unitPriceInCents: Math.abs(line.unitPriceInCents),
          lineSubtotalInCents: Math.abs(line.lineSubtotalInCents),
          lineTaxInCents: Math.abs(line.lineTaxInCents),
          lineTotalInCents: Math.abs(line.lineTotalInCents),
        }))
      : input.document.lines;
  const details = buildInvoiceXmlDetails(xmlLines);

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
  const debitTaxesXml = details.taxGroups
    .map(
      (group) => `
      <impuesto>
        <codigo>2</codigo>
        <codigoPorcentaje>${escapeXml(group.percentageCode)}</codigoPorcentaje>
        <tarifa>${formatPercentage(group.ratePercentage)}</tarifa>
        <baseImponible>${formatCents(group.baseInCents)}</baseImponible>
        <valor>${formatCents(group.taxInCents)}</valor>
      </impuesto>`,
    )
    .join('');
  const withholdingTaxesXml = details.lines
    .map(
      (line) => `
      <impuesto>
        <codigo>${escapeXml(line.taxRatePercentage === null ? '1' : '2')}</codigo>
        <codigoRetencion>${escapeXml(line.taxRatePercentage === null ? '001' : '001')}</codigoRetencion>
        <baseImponible>${formatCents(line.lineSubtotalInCents)}</baseImponible>
        <porcentajeRetener>${formatPercentage(line.taxRatePercentage ?? 0)}</porcentajeRetener>
        <valorRetenido>${formatCents(line.lineTotalInCents)}</valorRetenido>
        <codDocSustento>01</codDocSustento>
        <numDocSustento>${escapeXml(normalizeDigits(invoice.modifiedDocumentNumber ?? ''))}</numDocSustento>
        <fechaEmisionDocSustento>${escapeXml(
          invoice.modifiedDocumentIssuedAt
            ? formatSriIssueDate(invoice.modifiedDocumentIssuedAt)
            : '',
        )}</fechaEmisionDocSustento>
      </impuesto>`,
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

  const infoTributariaXml = `
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
  </infoTributaria>`;
  const obligatedAccounting = input.document.issuer.accountingObligated ? 'SI' : 'NO';
  if (isCreditNote) {
    const modificationAmountInCents = Math.abs(input.document.totals.totalInCents);
    const subtotalInCents = Math.abs(input.document.totals.subtotalInCents);

    return `<?xml version="1.0" encoding="UTF-8"?>
<notaCredito id="comprobante" version="1.0.0">
${infoTributariaXml}
  <infoNotaCredito>
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
    <codDocModificado>01</codDocModificado>
    <numDocModificado>${escapeXml(invoice.modifiedDocumentNumber ?? '')}</numDocModificado>
    <fechaEmisionDocSustento>${escapeXml(
      invoice.modifiedDocumentIssuedAt
        ? formatSriIssueDate(invoice.modifiedDocumentIssuedAt)
        : '',
    )}</fechaEmisionDocSustento>
    <totalSinImpuestos>${formatCents(subtotalInCents)}</totalSinImpuestos>
    <valorModificacion>${formatCents(modificationAmountInCents)}</valorModificacion>
    <moneda>${escapeXml(invoice.currency)}</moneda>
    <totalConImpuestos>${totalTaxesXml}
    </totalConImpuestos>
    <motivos>
      <motivo>
        <razon>${escapeXml(invoice.modificationReason ?? 'Nota de credito')}</razon>
        <valor>${formatCents(modificationAmountInCents)}</valor>
      </motivo>
    </motivos>
  </infoNotaCredito>
  <detalles>${detailXml}
  </detalles>
</notaCredito>
`;
  }

  if (isDebitNote) {
    const paymentDelayInDays = invoice.dueAt
      ? Math.max(calculateDiffInDays(invoice.issuedAt, invoice.dueAt), 0)
      : 0;
    const motiveXml = details.lines
      .map(
        (line) => `
      <motivo>
        <razon>${escapeXml(line.description)}</razon>
        <valor>${formatCents(line.lineSubtotalInCents)}</valor>
      </motivo>`,
      )
      .join('');

    return `<?xml version="1.0" encoding="UTF-8"?>
<notaDebito id="comprobante" version="1.0.0">
${infoTributariaXml}
  <infoNotaDebito>
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
    <codDocModificado>01</codDocModificado>
    <numDocModificado>${escapeXml(invoice.modifiedDocumentNumber ?? '')}</numDocModificado>
    <fechaEmisionDocSustento>${escapeXml(
      invoice.modifiedDocumentIssuedAt
        ? formatSriIssueDate(invoice.modifiedDocumentIssuedAt)
        : '',
    )}</fechaEmisionDocSustento>
    <impuestos>${debitTaxesXml}
    </impuestos>
    <valorTotal>${formatCents(input.document.totals.totalInCents)}</valorTotal>
    <pagos>
      <pago>
        <formaPago>20</formaPago>
        <total>${formatCents(input.document.totals.totalInCents)}</total>
        <plazo>${paymentDelayInDays}</plazo>
        <unidadTiempo>DAYS</unidadTiempo>
      </pago>
    </pagos>
  </infoNotaDebito>
  <motivos>${motiveXml}
  </motivos>
</notaDebito>
`;
  }

  if (isWithholding) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<comprobanteRetencion id="comprobante" version="2.0.0">
${infoTributariaXml}
  <infoCompRetencion>
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
    <tipoIdentificacionSujetoRetenido>${escapeXml(
      input.document.customer.identificationType ?? '',
    )}</tipoIdentificacionSujetoRetenido>
    <razonSocialSujetoRetenido>${escapeXml(input.document.customer.name)}</razonSocialSujetoRetenido>
    <identificacionSujetoRetenido>${escapeXml(
      input.document.customer.identification ?? input.document.customer.taxId ?? '',
    )}</identificacionSujetoRetenido>
    <periodoFiscal>${escapeXml(formatSriFiscalPeriod(invoice.issuedAt))}</periodoFiscal>
  </infoCompRetencion>
  <impuestos>${withholdingTaxesXml}
  </impuestos>
</comprobanteRetencion>
`;
  }

  if (isRemissionGuide) {
    const guideDetailXml = details.lines
      .map(
        (line) => `
        <detalle>
          <codigoInterno>${line.position}</codigoInterno>
          <descripcion>${escapeXml(line.description)}</descripcion>
          <cantidad>${formatQuantity(line.quantity)}</cantidad>
        </detalle>`,
      )
      .join('');

    return `<?xml version="1.0" encoding="UTF-8"?>
<guiaRemision id="comprobante" version="1.0.0">
${infoTributariaXml}
  <infoGuiaRemision>
    <dirEstablecimiento>${escapeXml(
      input.document.issuer.establishmentAddress ?? input.document.issuer.matrixAddress ?? '',
    )}</dirEstablecimiento>
    <dirPartida>${escapeXml(invoice.departureAddress ?? '')}</dirPartida>
    <razonSocialTransportista>${escapeXml(invoice.carrierName ?? '')}</razonSocialTransportista>
    <tipoIdentificacionTransportista>${escapeXml(
      invoice.carrierIdentificationType ?? '',
    )}</tipoIdentificacionTransportista>
    <rucTransportista>${escapeXml(
      normalizeDigits(invoice.carrierIdentification ?? ''),
    )}</rucTransportista>
    ${
      input.document.issuer.specialTaxpayerCode
        ? `<contribuyenteEspecial>${escapeXml(
            input.document.issuer.specialTaxpayerCode,
          )}</contribuyenteEspecial>`
        : ''
    }
    <obligadoContabilidad>${obligatedAccounting}</obligadoContabilidad>
    <fechaIniTransporte>${escapeXml(
      invoice.shipmentStartAt
        ? formatSriIssueDate(invoice.shipmentStartAt)
        : formatSriIssueDate(invoice.issuedAt),
    )}</fechaIniTransporte>
    <fechaFinTransporte>${escapeXml(
      invoice.shipmentEndAt
        ? formatSriIssueDate(invoice.shipmentEndAt)
        : formatSriIssueDate(invoice.issuedAt),
    )}</fechaFinTransporte>
    <placa>${escapeXml(invoice.vehiclePlate ?? '')}</placa>
  </infoGuiaRemision>
  <destinatarios>
    <destinatario>
      <identificacionDestinatario>${escapeXml(
        input.document.customer.identification ?? input.document.customer.taxId ?? '',
      )}</identificacionDestinatario>
      <razonSocialDestinatario>${escapeXml(input.document.customer.name)}</razonSocialDestinatario>
      <dirDestinatario>${escapeXml(
        invoice.arrivalAddress ?? input.document.customer.billingAddress ?? '',
      )}</dirDestinatario>
      <motivoTraslado>${escapeXml(
        invoice.shipmentReason ?? invoice.modificationReason ?? 'Traslado de mercaderia',
      )}</motivoTraslado>
      <codDocSustento>01</codDocSustento>
      <numDocSustento>${escapeXml(invoice.modifiedDocumentNumber ?? '')}</numDocSustento>
      <fechaEmisionDocSustento>${escapeXml(
        invoice.modifiedDocumentIssuedAt
          ? formatSriIssueDate(invoice.modifiedDocumentIssuedAt)
          : '',
      )}</fechaEmisionDocSustento>
      ${
        invoice.destinationRoute
          ? `<ruta>${escapeXml(invoice.destinationRoute)}</ruta>`
          : ''
      }
      <detalles>${guideDetailXml}
      </detalles>
    </destinatario>
  </destinatarios>
</guiaRemision>
`;
  }

  const paymentDelayInDays = invoice.dueAt
    ? Math.max(calculateDiffInDays(invoice.issuedAt, invoice.dueAt), 0)
    : 0;

  return `<?xml version="1.0" encoding="UTF-8"?>
<factura id="comprobante" version="2.1.0">
${infoTributariaXml}
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

export function buildSriInvoiceXmlPreview(input: {
  document: InvoiceDocumentView;
  accessKey: string;
}): string {
  return buildSriElectronicDocumentXmlPreview(input);
}

export function validateSriElectronicDocumentXml(input: {
  xml: string;
  accessKey: string;
}): string[] {
  const issues: string[] = [];
  const xml = input.xml;
  const accessKey = normalizeDigits(input.accessKey);
  const codDoc = extractTagValue(xml, 'codDoc');
  const valorModificacion = extractTagValue(xml, 'valorModificacion');
  const valorTotal = extractTagValue(xml, 'valorTotal');
  const isCreditNote = codDoc === '04' || xml.includes('<notaCredito ');
  const isDebitNote = codDoc === '05' || xml.includes('<notaDebito ');
  const isRemissionGuide = codDoc === '06' || xml.includes('<guiaRemision ');
  const isWithholding = codDoc === '07' || xml.includes('<comprobanteRetencion ');
  const rootTag = isCreditNote
    ? 'notaCredito'
    : isDebitNote
      ? 'notaDebito'
      : isRemissionGuide
        ? 'guiaRemision'
      : isWithholding
        ? 'comprobanteRetencion'
      : 'factura';
  const versionLabel =
    isWithholding
      ? '2.0.0'
      : isCreditNote || isDebitNote || isRemissionGuide
        ? '1.0.0'
        : '2.1.0';

  if (!xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')) {
    issues.push('El XML debe comenzar con la declaracion XML UTF-8.');
  }

  if (!xml.includes(`<${rootTag} id="comprobante" version="${versionLabel}">`)) {
    issues.push(
      `El comprobante debe declarar ${
        isCreditNote
          ? 'notaCredito'
          : isDebitNote
            ? 'notaDebito'
            : isRemissionGuide
              ? 'guiaRemision'
            : isWithholding
              ? 'comprobanteRetencion'
              : 'factura'
      } version ${versionLabel}.`,
    );
  }

  if (!xml.includes('<infoTributaria>')) {
    issues.push('Falta el bloque infoTributaria.');
  }

  if (
    !xml.includes(
      isCreditNote
        ? '<infoNotaCredito>'
        : isDebitNote
          ? '<infoNotaDebito>'
          : isRemissionGuide
            ? '<infoGuiaRemision>'
          : isWithholding
            ? '<infoCompRetencion>'
          : '<infoFactura>',
    )
  ) {
    issues.push(
      `Falta el bloque ${
        isCreditNote
          ? 'infoNotaCredito'
          : isDebitNote
            ? 'infoNotaDebito'
            : isRemissionGuide
              ? 'infoGuiaRemision'
            : isWithholding
              ? 'infoCompRetencion'
            : 'infoFactura'
      }.`,
    );
  }

  if (!isDebitNote && !isWithholding && !xml.includes('<detalles>')) {
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
    ...(isRemissionGuide
      ? [
          'dirPartida',
          'razonSocialTransportista',
          'tipoIdentificacionTransportista',
          'rucTransportista',
          'fechaIniTransporte',
          'fechaFinTransporte',
          'placa',
          'identificacionDestinatario',
          'razonSocialDestinatario',
          'dirDestinatario',
          'motivoTraslado',
          'codDocSustento',
          'numDocSustento',
          'fechaEmisionDocSustento',
        ]
      : ['fechaEmision']),
    ...(isRemissionGuide
      ? []
      : isWithholding
      ? [
          'tipoIdentificacionSujetoRetenido',
          'razonSocialSujetoRetenido',
          'identificacionSujetoRetenido',
          'periodoFiscal',
        ]
      : [
          'tipoIdentificacionComprador',
          'razonSocialComprador',
          'identificacionComprador',
        ]),
    ...(isCreditNote
      ? []
      : isDebitNote
        ? ['valorTotal']
        : isRemissionGuide || isWithholding
          ? []
          : ['importeTotal']),
  ]) {
    if (!extractTagValue(xml, tagName)) {
      issues.push(`Falta el valor obligatorio ${tagName} en el XML.`);
    }
  }
  if (isCreditNote && !valorModificacion) {
    issues.push('Falta el valor obligatorio valorModificacion en el XML.');
  }

  const ambiente = extractTagValue(xml, 'ambiente');
  const tipoEmision = extractTagValue(xml, 'tipoEmision');
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
    isRemissionGuide
      ? 'tipoIdentificacionTransportista'
      : isWithholding
        ? 'tipoIdentificacionSujetoRetenido'
        : 'tipoIdentificacionComprador',
  );
  const buyerName = extractTagValue(
    xml,
    isRemissionGuide
      ? 'razonSocialDestinatario'
      : isWithholding
        ? 'razonSocialSujetoRetenido'
        : 'razonSocialComprador',
  );
  const buyerIdentification = extractTagValue(
    xml,
    isRemissionGuide
      ? 'identificacionDestinatario'
      : isWithholding
        ? 'identificacionSujetoRetenido'
        : 'identificacionComprador',
  );
  const buyerAddress = extractTagValue(
    xml,
    isRemissionGuide ? 'dirDestinatario' : 'direccionComprador',
  );
  const totalSinImpuestos = isRemissionGuide
    ? null
    : extractTagValue(xml, 'totalSinImpuestos');
  const importeTotal = isCreditNote
    ? valorModificacion
    : isDebitNote
      ? valorTotal
      : isRemissionGuide || isWithholding
        ? null
        : extractTagValue(xml, 'importeTotal');
  const moneda =
    isDebitNote || isRemissionGuide || isWithholding
      ? null
      : extractTagValue(xml, 'moneda');
  const paymentTotal =
    isCreditNote || isRemissionGuide || isWithholding
      ? null
      : extractTagValue(xml, 'total');
  const totalDescuento =
    isCreditNote || isDebitNote || isRemissionGuide || isWithholding
      ? '0.00'
      : extractTagValue(xml, 'totalDescuento');
  const propina =
    isCreditNote || isDebitNote || isRemissionGuide || isWithholding
      ? '0.00'
      : extractTagValue(xml, 'propina');
  const infoTributariaBlocks = extractTagBlocks(xml, 'infoTributaria');
  const infoComprobanteBlocks = extractTagBlocks(
    xml,
    isCreditNote
      ? 'infoNotaCredito'
      : isDebitNote
        ? 'infoNotaDebito'
        : isRemissionGuide
          ? 'infoGuiaRemision'
        : isWithholding
          ? 'infoCompRetencion'
        : 'infoFactura',
  );
  const pagosBlocks = extractTagBlocks(xml, 'pagos');
  const pagoBlocks = extractTagBlocks(xml, 'pago');
  const detalleBlocks = extractTagBlocks(xml, 'detalle');
  const totalImpuestoBlocks = isDebitNote
    ? extractTagBlocks(xml, 'impuesto')
    : isWithholding
      ? extractTagBlocks(xml, 'impuesto')
    : extractTagBlocks(xml, 'totalImpuesto');
  const codDocModificado = extractTagValue(xml, 'codDocModificado');
  const numDocModificado = extractTagValue(xml, 'numDocModificado');
  const fechaEmisionDocSustento = extractTagValue(
    xml,
    'fechaEmisionDocSustento',
  );
  const motivoBlocks = extractTagBlocks(xml, 'motivo');
  const periodoFiscal = extractTagValue(xml, 'periodoFiscal');

  if (infoTributariaBlocks.length !== 1) {
    issues.push('El XML debe contener exactamente un bloque infoTributaria.');
  }

  if (infoComprobanteBlocks.length !== 1) {
    issues.push(
      `El XML debe contener exactamente un bloque ${
        isCreditNote
          ? 'infoNotaCredito'
          : isDebitNote
            ? 'infoNotaDebito'
            : isRemissionGuide
              ? 'infoGuiaRemision'
            : isWithholding
              ? 'infoCompRetencion'
            : 'infoFactura'
      }.`,
    );
  }

  if (!isCreditNote && !isRemissionGuide && !isWithholding) {
    if (pagosBlocks.length !== 1) {
      issues.push('El XML debe contener exactamente un bloque pagos.');
    }

    if (pagoBlocks.length !== 1) {
      issues.push('El XML debe contener exactamente un bloque pago para este MVP.');
    }
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

  if (!isDebitNote && !isWithholding && (!buyerAddress || buyerAddress.trim().length < 5)) {
    issues.push('La direccion del comprador debe estar informada.');
  }

  if (buyerIdentificationType) {
    validateBuyerIdentificationByType(
      buyerIdentificationType,
      buyerIdentification,
      issues,
    );
  }

  if (!isDebitNote && !isWithholding && detalleBlocks.length === 0) {
    issues.push('La factura electronica debe contener al menos un detalle.');
  }

  const detailSubtotalSum = sumTagValues(detalleBlocks, 'precioTotalSinImpuesto');
  const parsedSubtotal = isDebitNote
    ? sumTagValues(motivoBlocks, 'valor')
    : isRemissionGuide
      ? detailSubtotalSum
    : isWithholding
      ? sumTagValues(totalImpuestoBlocks, 'valorRetenido')
    : parseAmount(totalSinImpuestos);
  const parsedTotal = parseAmount(importeTotal);
  const parsedPaymentTotal = parseAmount(paymentTotal);
  const detailTaxSum = sumNestedTaxValues(detalleBlocks, 'valor');
  const headerTaxSum = sumTagValues(totalImpuestoBlocks, 'valor');

  if (!isDebitNote && !isRemissionGuide && parsedSubtotal === null) {
    issues.push('totalSinImpuestos debe ser un decimal valido con dos decimales.');
  }

  if (parseAmount(totalDescuento) === null) {
    issues.push('totalDescuento debe ser un decimal valido con dos decimales.');
  }

  if (!isRemissionGuide && !isWithholding && parsedTotal === null) {
    issues.push('importeTotal debe ser un decimal valido con dos decimales.');
  }

  if (parseAmount(propina) === null) {
    issues.push('propina debe ser un decimal valido con dos decimales.');
  }

  if (!isRemissionGuide && !isWithholding && parsedPaymentTotal === null) {
    issues.push('El total del bloque pagos debe ser un decimal valido con dos decimales.');
  }

  if (!isDebitNote && !isRemissionGuide && !isWithholding && (!moneda || !/^[A-Z]{3}$/.test(moneda))) {
    issues.push('La moneda debe estar en formato ISO de 3 letras mayusculas.');
  }

  if (isCreditNote) {
    if (codDoc !== '04') {
      issues.push('La nota de credito debe declarar codDoc 04.');
    }

    if (codDocModificado !== '01') {
      issues.push(
        'La nota de credito debe declarar codDocModificado 01 para este MVP.',
      );
    }

    if (!numDocModificado || numDocModificado.trim().length < 3) {
      issues.push(
        'La nota de credito debe incluir numDocModificado del comprobante sustento.',
      );
    }

    if (
      !fechaEmisionDocSustento ||
      !/^\d{2}\/\d{2}\/\d{4}$/.test(fechaEmisionDocSustento)
    ) {
      issues.push(
        'La nota de credito debe incluir fechaEmisionDocSustento con formato dd/mm/yyyy.',
      );
    }

    const parsedModificationAmount = parseAmount(valorModificacion);

    if (parsedModificationAmount === null) {
      issues.push(
        'La nota de credito debe incluir valorModificacion decimal valido.',
      );
    } else if (parsedTotal !== null && parsedModificationAmount !== Math.abs(parsedTotal)) {
      issues.push(
        'valorModificacion debe coincidir con el valor absoluto del total de la nota de credito.',
      );
    }

    if (motivoBlocks.length !== 1) {
      issues.push(
        'La nota de credito debe contener exactamente un bloque motivo para este MVP.',
      );
    } else {
      const razon = extractTagValue(motivoBlocks[0], 'razon');
      const valor = extractTagValue(motivoBlocks[0], 'valor');

      if (!razon || razon.trim().length < 3) {
        issues.push('La nota de credito debe incluir una razon suficiente en motivo.');
      }

      const parsedMotivoValor = parseAmount(valor);

      if (parsedMotivoValor === null) {
        issues.push('La nota de credito debe incluir un valor decimal valido en motivo.');
      } else if (parsedTotal !== null && parsedMotivoValor !== Math.abs(parsedTotal)) {
        issues.push(
          'El valor del motivo debe coincidir con el valor absoluto del total de la nota de credito.',
        );
      }
    }
  } else if (isDebitNote) {
    if (codDoc !== '05') {
      issues.push('La nota de debito debe declarar codDoc 05.');
    }

    if (codDocModificado !== '01') {
      issues.push(
        'La nota de debito debe declarar codDocModificado 01 para este MVP.',
      );
    }

    if (!numDocModificado || numDocModificado.trim().length < 3) {
      issues.push(
        'La nota de debito debe incluir numDocModificado del comprobante sustento.',
      );
    }

    if (
      !fechaEmisionDocSustento ||
      !/^\d{2}\/\d{2}\/\d{4}$/.test(fechaEmisionDocSustento)
    ) {
      issues.push(
        'La nota de debito debe incluir fechaEmisionDocSustento con formato dd/mm/yyyy.',
      );
    }

    if (motivoBlocks.length === 0) {
      issues.push('La nota de debito debe contener al menos un motivo.');
    } else {
      for (const motivoBlock of motivoBlocks) {
        const razon = extractTagValue(motivoBlock, 'razon');
        const valor = extractTagValue(motivoBlock, 'valor');

        if (!razon || razon.trim().length < 3) {
          issues.push('Cada motivo de la nota de debito debe incluir una razon suficiente.');
        }

        const parsedMotivoValor = parseAmount(valor);

        if (parsedMotivoValor === null) {
          issues.push('Cada motivo de la nota de debito debe incluir un valor decimal valido.');
        }
      }
    }
  } else if (isRemissionGuide) {
    const dirPartida = extractTagValue(xml, 'dirPartida');
    const razonSocialTransportista = extractTagValue(
      xml,
      'razonSocialTransportista',
    );
    const tipoIdentificacionTransportista = extractTagValue(
      xml,
      'tipoIdentificacionTransportista',
    );
    const rucTransportista = extractTagValue(xml, 'rucTransportista');
    const fechaIniTransporte = extractTagValue(xml, 'fechaIniTransporte');
    const fechaFinTransporte = extractTagValue(xml, 'fechaFinTransporte');
    const placa = extractTagValue(xml, 'placa');
    const identificacionDestinatario = extractTagValue(
      xml,
      'identificacionDestinatario',
    );
    const razonSocialDestinatario = extractTagValue(
      xml,
      'razonSocialDestinatario',
    );
    const dirDestinatario = extractTagValue(xml, 'dirDestinatario');
    const motivoTraslado = extractTagValue(xml, 'motivoTraslado');
    const codDocSustento = extractTagValue(xml, 'codDocSustento');
    const numDocSustento = extractTagValue(xml, 'numDocSustento');
    const destinatarioBlocks = extractTagBlocks(xml, 'destinatario');

    if (codDoc !== '06') {
      issues.push('La guia de remision debe declarar codDoc 06.');
    }

    if (destinatarioBlocks.length !== 1) {
      issues.push(
        'La guia de remision debe contener exactamente un bloque destinatario para este MVP.',
      );
    }

    if (!dirPartida || dirPartida.trim().length < 5) {
      issues.push('La guia de remision debe incluir dirPartida suficiente.');
    }

    if (!razonSocialTransportista || razonSocialTransportista.trim().length < 3) {
      issues.push(
        'La guia de remision debe incluir razonSocialTransportista suficiente.',
      );
    }

    if (!tipoIdentificacionTransportista) {
      issues.push(
        'La guia de remision debe incluir tipoIdentificacionTransportista.',
      );
    } else {
      validateBuyerIdentificationByType(
        tipoIdentificacionTransportista,
        rucTransportista,
        issues,
      );
    }

    if (!fechaIniTransporte || !/^\d{2}\/\d{2}\/\d{4}$/.test(fechaIniTransporte)) {
      issues.push(
        'La guia de remision debe incluir fechaIniTransporte con formato dd/mm/yyyy.',
      );
    }

    if (!fechaFinTransporte || !/^\d{2}\/\d{2}\/\d{4}$/.test(fechaFinTransporte)) {
      issues.push(
        'La guia de remision debe incluir fechaFinTransporte con formato dd/mm/yyyy.',
      );
    }

    if (!placa || placa.trim().length < 5) {
      issues.push('La guia de remision debe incluir una placa suficiente.');
    }

    if (
      !identificacionDestinatario ||
      normalizeDigits(identificacionDestinatario).length < 5
    ) {
      issues.push(
        'La guia de remision debe incluir identificacionDestinatario suficiente.',
      );
    }

    if (!razonSocialDestinatario || razonSocialDestinatario.trim().length < 3) {
      issues.push(
        'La guia de remision debe incluir razonSocialDestinatario suficiente.',
      );
    }

    if (!dirDestinatario || dirDestinatario.trim().length < 5) {
      issues.push('La guia de remision debe incluir dirDestinatario suficiente.');
    }

    if (!motivoTraslado || motivoTraslado.trim().length < 3) {
      issues.push('La guia de remision debe incluir motivoTraslado suficiente.');
    }

    if (codDocSustento !== '01') {
      issues.push(
        'La guia de remision debe declarar codDocSustento 01 para este MVP.',
      );
    }

    if (!numDocSustento || normalizeDigits(numDocSustento).length < 9) {
      issues.push(
        'La guia de remision debe incluir un numDocSustento suficiente.',
      );
    }

    if (
      !fechaEmisionDocSustento ||
      !/^\d{2}\/\d{2}\/\d{4}$/.test(fechaEmisionDocSustento)
    ) {
      issues.push(
        'La guia de remision debe incluir fechaEmisionDocSustento con formato dd/mm/yyyy.',
      );
    }
  } else if (isWithholding) {
    if (codDoc !== '07') {
      issues.push('El comprobante de retencion debe declarar codDoc 07.');
    }

    if (!periodoFiscal || !/^\d{2}\/\d{4}$/.test(periodoFiscal)) {
      issues.push(
        'El comprobante de retencion debe incluir periodoFiscal con formato mm/yyyy.',
      );
    }

    if (totalImpuestoBlocks.length === 0) {
      issues.push('El comprobante de retencion debe contener al menos un impuesto.');
    } else {
      for (const impuestoBlock of totalImpuestoBlocks) {
        const codigo = extractTagValue(impuestoBlock, 'codigo');
        const codigoRetencion = extractTagValue(impuestoBlock, 'codigoRetencion');
        const baseImponible = extractTagValue(impuestoBlock, 'baseImponible');
        const porcentajeRetener = extractTagValue(impuestoBlock, 'porcentajeRetener');
        const valorRetenido = extractTagValue(impuestoBlock, 'valorRetenido');
        const codDocSustento = extractTagValue(impuestoBlock, 'codDocSustento');
        const numDocSustento = extractTagValue(impuestoBlock, 'numDocSustento');
        const fechaDocSustento = extractTagValue(
          impuestoBlock,
          'fechaEmisionDocSustento',
        );

        if (!codigo || !/^\d+$/.test(codigo)) {
          issues.push('Cada impuesto de retencion debe incluir un codigo numerico.');
        }

        if (!codigoRetencion || !/^\d+$/.test(codigoRetencion)) {
          issues.push(
            'Cada impuesto de retencion debe incluir un codigoRetencion numerico.',
          );
        }

        if (parseAmount(baseImponible) === null) {
          issues.push(
            'Cada impuesto de retencion debe incluir una baseImponible decimal valida.',
          );
        }

        if (!porcentajeRetener || !/^\d+\.\d{2}$/.test(porcentajeRetener)) {
          issues.push(
            'Cada impuesto de retencion debe incluir un porcentajeRetener decimal valido.',
          );
        }

        if (parseAmount(valorRetenido) === null) {
          issues.push(
            'Cada impuesto de retencion debe incluir un valorRetenido decimal valido.',
          );
        }

        if (codDocSustento !== '01') {
          issues.push(
            'Cada impuesto de retencion debe declarar codDocSustento 01 para este MVP.',
          );
        }

        if (!numDocSustento || normalizeDigits(numDocSustento).length < 9) {
          issues.push(
            'Cada impuesto de retencion debe incluir un numDocSustento suficiente.',
          );
        }

        if (!fechaDocSustento || !/^\d{2}\/\d{2}\/\d{4}$/.test(fechaDocSustento)) {
          issues.push(
            'Cada impuesto de retencion debe incluir fechaEmisionDocSustento con formato dd/mm/yyyy.',
          );
        }
      }
    }
  } else if (codDoc && codDoc !== '01') {
    issues.push('La factura electronica debe declarar codDoc 01.');
  }

  if (!isDebitNote && !isRemissionGuide && parsedSubtotal !== null && detailSubtotalSum !== parsedSubtotal) {
    issues.push(
      'La suma de precioTotalSinImpuesto de los detalles no coincide con totalSinImpuestos.',
    );
  }

  if (!isDebitNote && !isRemissionGuide && detailTaxSum !== headerTaxSum) {
    issues.push(
      'La suma de impuestos de los detalles no coincide con totalConImpuestos.',
    );
  }

  if (
    !isRemissionGuide &&
    !isWithholding &&
    parsedSubtotal !== null &&
    parsedTotal !== null &&
    parsedSubtotal + headerTaxSum !== parsedTotal
  ) {
    issues.push(
      'importeTotal no coincide con totalSinImpuestos mas totalConImpuestos.',
    );
  }

  if (
    !isCreditNote &&
    !isRemissionGuide &&
    !isWithholding &&
    parsedTotal !== null &&
    parsedPaymentTotal !== null &&
    parsedTotal !== parsedPaymentTotal
  ) {
    issues.push('El bloque pagos debe coincidir con el importe total de la factura.');
  }

  if (!isCreditNote && !isRemissionGuide && !isWithholding) {
    validatePaymentBlocks(pagoBlocks, issues);
  }
  if (isDebitNote) {
    validateDebitTaxBlocks(totalImpuestoBlocks, issues);
  } else if (isWithholding) {
    validateWithholdingTaxBlocks(totalImpuestoBlocks, issues);
  } else if (isRemissionGuide) {
    validateRemissionGuideDetailBlocks(detalleBlocks, issues);
  } else {
    validateTotalTaxBlocks(totalImpuestoBlocks, issues);
    validateDetailBlocks(detalleBlocks, issues);
  }

  return issues;
}

export function validateSriInvoiceXml(input: {
  xml: string;
  accessKey: string;
}): string[] {
  return validateSriElectronicDocumentXml(input);
}

function buildInvoiceXmlDetails(lines: InvoiceDocumentLineView[]): {
  lines: Array<
    InvoiceDocumentLineView & {
      taxPercentageCode: string;
    }
  >;
  taxGroups: Array<{
    percentageCode: string;
    ratePercentage: number;
    baseInCents: number;
    taxInCents: number;
  }>;
} {
  const taxGroups = new Map<
    string,
    {
      percentageCode: string;
      ratePercentage: number;
      baseInCents: number;
      taxInCents: number;
    }
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
        ratePercentage: line.taxRatePercentage ?? 0,
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

function formatSriFiscalPeriod(value: Date): string {
  return `${String(value.getUTCMonth() + 1).padStart(2, '0')}/${value.getUTCFullYear()}`;
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

function validateDebitTaxBlocks(blocks: string[], issues: string[]): void {
  if (blocks.length === 0) {
    issues.push('La nota de debito debe contener al menos un impuesto en cabecera.');
    return;
  }

  for (const block of blocks) {
    const codigo = extractTagValue(block, 'codigo');
    const codigoPorcentaje = extractTagValue(block, 'codigoPorcentaje');
    const tarifa = extractTagValue(block, 'tarifa');
    const baseImponible = extractTagValue(block, 'baseImponible');
    const valor = extractTagValue(block, 'valor');

    if (codigo !== '2') {
      issues.push('Cada impuesto de nota de debito debe usar codigo 2 para IVA en este MVP.');
    }

    if (!codigoPorcentaje || !/^\d+$/.test(codigoPorcentaje)) {
      issues.push('Cada impuesto de nota de debito debe incluir un codigoPorcentaje numerico.');
    }

    if (!tarifa || !/^\d+\.\d{2}$/.test(tarifa)) {
      issues.push('Cada impuesto de nota de debito debe incluir una tarifa decimal valida.');
    }

    if (parseAmount(baseImponible) === null) {
      issues.push(
        'Cada impuesto de nota de debito debe incluir una baseImponible decimal valida.',
      );
    }

    if (parseAmount(valor) === null) {
      issues.push('Cada impuesto de nota de debito debe incluir un valor decimal valido.');
    }
  }
}

function validateWithholdingTaxBlocks(blocks: string[], issues: string[]): void {
  if (blocks.length === 0) {
    issues.push(
      'El comprobante de retencion debe contener al menos un impuesto en cabecera.',
    );
    return;
  }

  for (const block of blocks) {
    const codigo = extractTagValue(block, 'codigo');
    const codigoRetencion = extractTagValue(block, 'codigoRetencion');
    const baseImponible = extractTagValue(block, 'baseImponible');
    const porcentajeRetener = extractTagValue(block, 'porcentajeRetener');
    const valorRetenido = extractTagValue(block, 'valorRetenido');

    if (!codigo || !/^\d+$/.test(codigo)) {
      issues.push(
        'Cada impuesto de retencion debe incluir un codigo numerico valido.',
      );
    }

    if (!codigoRetencion || !/^\d+$/.test(codigoRetencion)) {
      issues.push(
        'Cada impuesto de retencion debe incluir un codigoRetencion numerico valido.',
      );
    }

    if (parseAmount(baseImponible) === null) {
      issues.push(
        'Cada impuesto de retencion debe incluir una baseImponible decimal valida.',
      );
    }

    if (!porcentajeRetener || !/^\d+\.\d{2}$/.test(porcentajeRetener)) {
      issues.push(
        'Cada impuesto de retencion debe incluir un porcentajeRetener decimal valido.',
      );
    }

    if (parseAmount(valorRetenido) === null) {
      issues.push(
        'Cada impuesto de retencion debe incluir un valorRetenido decimal valido.',
      );
    }
  }
}

function validateRemissionGuideDetailBlocks(
  blocks: string[],
  issues: string[],
): void {
  for (const block of blocks) {
    const codigoInterno = extractTagValue(block, 'codigoInterno');
    const descripcion = extractTagValue(block, 'descripcion');
    const cantidad = extractTagValue(block, 'cantidad');

    if (!codigoInterno || !/^\d+$/.test(codigoInterno)) {
      issues.push('Cada detalle de guia de remision debe incluir un codigoInterno numerico.');
    }

    if (!descripcion || descripcion.trim().length < 3) {
      issues.push('Cada detalle de guia de remision debe incluir una descripcion suficiente.');
    }

    if (!cantidad || !/^\d+(\.\d{1,2})?$/.test(cantidad) || Number(cantidad) <= 0) {
      issues.push('Cada detalle de guia de remision debe incluir una cantidad positiva valida.');
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
