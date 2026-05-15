export class ElectronicSignatureExtractedTaxIdUnavailableError extends Error {
  constructor(tenantSlug: string, detail?: string) {
    super(
      detail
        ? `No se pudo extraer un RUC utilizable del certificado para el tenant "${tenantSlug}": ${detail}`
        : `No se pudo extraer un RUC utilizable del certificado para el tenant "${tenantSlug}".`,
    );
  }
}
