const SUPPORTED_SRI_ROOT_TAGS = [
  'factura',
  'notaCredito',
  'notaDebito',
  'guiaRemision',
  'comprobanteRetencion',
] as const;

export function insertElectronicSignature(
  xml: string,
  signatureBlock: string,
): string {
  const closingTagPattern = new RegExp(
    `</(${SUPPORTED_SRI_ROOT_TAGS.join('|')})>`,
    'i',
  );

  if (!closingTagPattern.test(xml)) {
    return xml;
  }

  return xml.replace(closingTagPattern, `${signatureBlock}</$1>`);
}
