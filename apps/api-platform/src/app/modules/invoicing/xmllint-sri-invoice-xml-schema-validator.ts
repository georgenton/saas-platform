import { execFile } from 'node:child_process';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { Injectable } from '@nestjs/common';
import { ElectronicInvoiceXmlSchemaValidator } from '@saas-platform/invoicing-application';

@Injectable()
export class XmllintSriInvoiceXmlSchemaValidator
  implements ElectronicInvoiceXmlSchemaValidator
{
  private readonly schemaPath = resolve(
    process.cwd(),
    'vendor/sri/factura-2.1.0/XML y XSD Factura/factura_V2.1.0.xsd',
  );

  async validate(input: { xml: string }): Promise<string[]> {
    const tempDir = await mkdtemp(join(tmpdir(), 'sri-invoice-xsd-'));
    const xmlPath = join(tempDir, 'invoice.xml');

    try {
      await writeFile(xmlPath, input.xml, 'utf8');

      await new Promise<void>((resolvePromise, rejectPromise) => {
        execFile(
          'xmllint',
          ['--noout', '--schema', this.schemaPath, xmlPath],
          (error, stdout, stderr) => {
            if (!error) {
              resolvePromise();
              return;
            }

            rejectPromise(
              new Error(this.normalizeXmllintOutput(stderr || stdout || error.message)),
            );
          },
        );
      });

      return [];
    } catch (error) {
      return this.extractIssues(error);
    } finally {
      await rm(tempDir, { force: true, recursive: true });
    }
  }

  private extractIssues(error: unknown): string[] {
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
          .replace(this.schemaPath, 'factura_V2.1.0.xsd')
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
}
