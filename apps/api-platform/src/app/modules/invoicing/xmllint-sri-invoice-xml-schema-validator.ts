import { execFile } from 'node:child_process';
import { access, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { Injectable } from '@nestjs/common';
import {
  ElectronicInvoiceXmlSchemaSupportDescriptor,
  ElectronicInvoiceXmlSchemaValidator,
} from '@saas-platform/invoicing-application';

@Injectable()
export class XmllintSriInvoiceXmlSchemaValidator
  implements ElectronicInvoiceXmlSchemaValidator
{
  private readonly schemaRegistry: Record<
    string,
    {
      path: string;
      schemaLabel: string;
    }
  > = {
    '01': {
      path: resolve(
        process.cwd(),
        'vendor/sri/factura-2.1.0/XML y XSD Factura/factura_V2.1.0.xsd',
      ),
      schemaLabel: 'factura_V2.1.0.xsd',
    },
    '04': {
      path: resolve(
        process.cwd(),
        'vendor/sri/nota-credito-1.0.0/XML y XSD Nota de Credito/notaCredito_V1.0.0.xsd',
      ),
      schemaLabel: 'notaCredito_V1.0.0.xsd',
    },
    '05': {
      path: resolve(
        process.cwd(),
        'vendor/sri/nota-debito-1.0.0/XML y XSD Nota de Debito/notaDebito_V1.0.0.xsd',
      ),
      schemaLabel: 'notaDebito_V1.0.0.xsd',
    },
  };

  async validate(input: {
    documentCode: string;
    xml: string;
  }): Promise<string[]> {
    const tempDir = await mkdtemp(join(tmpdir(), 'sri-invoice-xsd-'));
    const xmlPath = join(tempDir, 'invoice.xml');
    const schemaSupport = await this.describeSupport(input.documentCode);
    const schemaPath = this.schemaRegistry[input.documentCode]?.path;

    try {
      if (!schemaPath || !schemaSupport.isSchemaAvailable) {
        return [schemaSupport.detail];
      }

      await writeFile(xmlPath, input.xml, 'utf8');

      await new Promise<void>((resolvePromise, rejectPromise) => {
        execFile(
          'xmllint',
          ['--noout', '--schema', schemaPath, xmlPath],
          (error, stdout, stderr) => {
            if (!error) {
              resolvePromise();
              return;
            }

            rejectPromise(
              new Error(
                this.normalizeXmllintOutput(
                  stderr || stdout || error.message,
                ),
              ),
            );
          },
        );
      });

      return [];
    } catch (error) {
      return this.extractIssues(error, schemaPath);
    } finally {
      await rm(tempDir, { force: true, recursive: true });
    }
  }

  async describeSupport(
    documentCode: string,
  ): Promise<ElectronicInvoiceXmlSchemaSupportDescriptor> {
    const schema = this.schemaRegistry[documentCode];

    if (!schema) {
      return {
        documentCode,
        schemaLabel: 'schema.xsd',
        isSchemaAvailable: false,
        detail: `No existe una estrategia de validacion XSD registrada para el document code "${documentCode}".`,
      };
    }

    try {
      await access(schema.path);

      return {
        documentCode,
        schemaLabel: schema.schemaLabel,
        isSchemaAvailable: true,
        detail: `El esquema oficial ${schema.schemaLabel} ya esta disponible en el repo para el document code "${documentCode}".`,
      };
    } catch {
      return {
        documentCode,
        schemaLabel: schema.schemaLabel,
        isSchemaAvailable: false,
        detail: `El XSD oficial para document code "${documentCode}" todavia no esta disponible en el repo (${schema.schemaLabel}).`,
      };
    }
  }

  private extractIssues(error: unknown, schemaPath: string): string[] {
    const fallback =
      'La validacion XSD del comprobante electronico fallo sin un detalle legible.';

    if (!(error instanceof Error)) {
      return [fallback];
    }

    const message = error.message.trim();

    if (message.length === 0) {
      return [fallback];
    }

    return message
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line) =>
        line
          .replace(schemaPath, this.toSchemaFileName(schemaPath))
          .replace(/.*\/invoice\.xml:/, 'invoice.xml:'),
      );
  }

  private normalizeXmllintOutput(output: string): string {
    const lines = output
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .filter((line) => !line.endsWith('validates'));

    if (lines.length === 0) {
      return 'La validacion XSD del comprobante electronico fallo.';
    }

    return lines.join('\n');
  }

  private toSchemaFileName(schemaPath: string): string {
    return schemaPath.split('/').pop() ?? 'schema.xsd';
  }

}
