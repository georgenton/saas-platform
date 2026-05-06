import { Injectable } from '@nestjs/common';
import {
  InvoiceElectronicSecretResolutionError,
  SecretReferenceResolver,
} from '@saas-platform/invoicing-application';

@Injectable()
export class EnvSecretReferenceResolver implements SecretReferenceResolver {
  async resolve(secretRef: string): Promise<string> {
    const envKey = normalizeSecretRef(secretRef);
    const value = process.env[envKey];

    if (!value) {
      throw new InvoiceElectronicSecretResolutionError(secretRef);
    }

    return value;
  }
}

function normalizeSecretRef(secretRef: string): string {
  return secretRef.startsWith('env:') ? secretRef.slice(4) : secretRef;
}
