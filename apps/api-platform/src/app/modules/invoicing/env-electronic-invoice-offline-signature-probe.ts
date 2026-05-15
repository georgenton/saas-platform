import { Injectable } from '@nestjs/common';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import {
  ElectronicInvoiceOfflineSignatureProbe,
  ElectronicInvoiceOfflineSignatureProbeResult,
  ELECTRONIC_INVOICE_SIGNER,
  ELECTRONIC_INVOICE_XML_SCHEMA_VALIDATOR,
  ElectronicInvoiceSigner,
  ElectronicInvoiceXmlSchemaValidator,
  ProbeElectronicInvoiceOfflineSignatureInput,
  validateSriOfflineSignedXmlShape,
} from '@saas-platform/invoicing-application';
import { Inject } from '@nestjs/common';

@Injectable()
export class EnvElectronicInvoiceOfflineSignatureProbe
  implements ElectronicInvoiceOfflineSignatureProbe
{
  private readonly sampleRegistry: Array<{
    documentCode: '04' | '05' | '06' | '07';
    xmlPath: string;
  }> = [
    {
      documentCode: '04',
      xmlPath:
        'vendor/sri/nota-credito-1.0.0/XML y XSD Nota de Credito/notaCredito_V1.0.0.xml',
    },
    {
      documentCode: '05',
      xmlPath:
        'vendor/sri/nota-debito-1.0.0/XML y XSD Nota de Debito/notaDebito_V1.0.0.xml',
    },
    {
      documentCode: '06',
      xmlPath:
        'vendor/sri/guia-remision-1.0.0/XML y XSD Guia de Remision/guiaRemision_V1.0.0.xml',
    },
    {
      documentCode: '07',
      xmlPath:
        'vendor/sri/comprobante-retencion-2.0.0/XML y XSD Comprobante de Retencion/comprobanteRetencion_V2.0.0.xml',
    },
  ];

  constructor(
    @Inject(ELECTRONIC_INVOICE_SIGNER)
    private readonly electronicInvoiceSigner: ElectronicInvoiceSigner,
    @Inject(ELECTRONIC_INVOICE_XML_SCHEMA_VALIDATOR)
    private readonly electronicInvoiceXmlSchemaValidator: ElectronicInvoiceXmlSchemaValidator,
  ) {}

  async inspect(
    input: ProbeElectronicInvoiceOfflineSignatureInput,
  ): Promise<ElectronicInvoiceOfflineSignatureProbeResult> {
    if (input.signatureSettings.provider !== 'xades_pkcs12') {
      return {
        status: 'not_applicable',
        detail:
          'La prueba offline local solo aplica al provider xades_pkcs12.',
        verifiedDocumentCodes: [],
      };
    }

    if (!input.signatureSettings.hasSigningMaterialConfigured()) {
      return {
        status: 'unknown',
        detail:
          'No fue posible ejecutar la prueba offline local porque el PKCS#12 o su password siguen incompletos.',
        verifiedDocumentCodes: [],
      };
    }

    const verifiedDocumentCodes: Array<'04' | '05' | '06' | '07'> = [];

    try {
      for (const sample of this.sampleRegistry) {
        const xml = await readFile(join(process.cwd(), sample.xmlPath), 'utf8');
        const signedDocument = await this.electronicInvoiceSigner.sign({
          tenantSlug: input.tenantSlug,
          invoiceId: `offline-probe-${sample.documentCode}`,
          accessKey: '1234567890123456789012345678901234567890123456789',
          xml,
          issuerProfile: input.issuerProfile,
          signatureSettings: input.signatureSettings,
        });
        const shapeIssues = validateSriOfflineSignedXmlShape(
          signedDocument.signedXml,
        );

        if (shapeIssues.length > 0) {
          return {
            status: 'failed',
            detail: `La firma interna no supero la compatibilidad offline local para document code ${sample.documentCode}. ${shapeIssues[0]}`,
            verifiedDocumentCodes,
          };
        }

        const schemaIssues =
          await this.electronicInvoiceXmlSchemaValidator.validate({
            documentCode: sample.documentCode,
            xml: signedDocument.signedXml,
          });

        if (schemaIssues.length > 0) {
          return {
            status: 'failed',
            detail: `La firma interna no supero la revalidacion XSD del document code ${sample.documentCode}. ${schemaIssues[0]}`,
            verifiedDocumentCodes,
          };
        }

        verifiedDocumentCodes.push(sample.documentCode);
      }

      return {
        status: 'verified',
        detail: `La firma interna pudo firmar y revalidar localmente ${verifiedDocumentCodes.join(', ')} con chequeo estructural offline y XSD local.`,
        verifiedDocumentCodes,
      };
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'La prueba offline local fallo sin un detalle legible.';

      return {
        status: 'failed',
        detail: `La prueba offline local no pudo completarse. ${message}`.trim(),
        verifiedDocumentCodes,
      };
    }
  }
}
