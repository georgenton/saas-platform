import { Inject, Injectable } from '@nestjs/common';
import {
  ElectronicSignatureMaterialInspection,
  ElectronicSignatureMaterialInspector,
  InspectElectronicSignatureMaterialInput,
  SECRET_REFERENCE_RESOLVER,
  SecretReferenceResolver,
} from '@saas-platform/invoicing-application';

@Injectable()
export class EnvElectronicSignatureMaterialInspector
  implements ElectronicSignatureMaterialInspector
{
  constructor(
    @Inject(SECRET_REFERENCE_RESOLVER)
    private readonly secretReferenceResolver: SecretReferenceResolver,
  ) {}

  async inspect(
    input: InspectElectronicSignatureMaterialInput,
  ): Promise<ElectronicSignatureMaterialInspection> {
    const { signatureSettings } = input;

    if (!signatureSettings.isActive) {
      return {
        status: 'not_configured',
        detail: 'No existe una configuracion activa de firma electronica.',
        encoding: 'not_applicable',
        passwordPresent: false,
        fingerprintPresent: Boolean(signatureSettings.certificateFingerprint),
        subjectNamePresent: Boolean(signatureSettings.subjectName),
        byteLength: null,
      };
    }

    if (signatureSettings.provider !== 'xades_pkcs12') {
      return {
        status: 'not_applicable',
        detail:
          'El provider actual no usa PKCS#12. Esta inspeccion solo aplica al carril de firma interna xades_pkcs12.',
        encoding: 'not_applicable',
        passwordPresent: false,
        fingerprintPresent: Boolean(signatureSettings.certificateFingerprint),
        subjectNamePresent: Boolean(signatureSettings.subjectName),
        byteLength: null,
      };
    }

    if (
      !signatureSettings.pkcs12SecretRef ||
      !signatureSettings.privateKeyPasswordSecretRef
    ) {
      return {
        status: 'invalid',
        detail:
          'La configuracion xades_pkcs12 todavia no expone referencias completas para el PKCS#12 y su password.',
        encoding: 'unknown',
        passwordPresent: false,
        fingerprintPresent: Boolean(signatureSettings.certificateFingerprint),
        subjectNamePresent: Boolean(signatureSettings.subjectName),
        byteLength: null,
      };
    }

    try {
      const [resolvedPkcs12, resolvedPassword] = await Promise.all([
        this.secretReferenceResolver.resolve(signatureSettings.pkcs12SecretRef),
        this.secretReferenceResolver.resolve(
          signatureSettings.privateKeyPasswordSecretRef,
        ),
      ]);
      const passwordPresent = resolvedPassword.trim().length > 0;

      if (!passwordPresent) {
        return {
          status: 'invalid',
          detail:
            'La referencia del password responde, pero el valor resuelto sigue vacio.',
          encoding: 'unknown',
          passwordPresent: false,
          fingerprintPresent: Boolean(signatureSettings.certificateFingerprint),
          subjectNamePresent: Boolean(signatureSettings.subjectName),
          byteLength: null,
        };
      }

      const normalizedPkcs12 = resolvedPkcs12.trim();

      if (!normalizedPkcs12) {
        return {
          status: 'invalid',
          detail:
            'La referencia del PKCS#12 responde, pero el valor resuelto sigue vacio.',
          encoding: 'unknown',
          passwordPresent: true,
          fingerprintPresent: Boolean(signatureSettings.certificateFingerprint),
          subjectNamePresent: Boolean(signatureSettings.subjectName),
          byteLength: null,
        };
      }

      if (/-----BEGIN [A-Z0-9 ]+-----/.test(normalizedPkcs12)) {
        return {
          status: 'invalid',
          detail:
            'El material resuelto parece PEM textual. Para xades_pkcs12 esperamos un PKCS#12 serializado en base64.',
          encoding: 'pem_like',
          passwordPresent: true,
          fingerprintPresent: Boolean(signatureSettings.certificateFingerprint),
          subjectNamePresent: Boolean(signatureSettings.subjectName),
          byteLength: null,
        };
      }

      const decodedPkcs12 = decodeBase64Pkcs12(normalizedPkcs12);

      if (!decodedPkcs12) {
        return {
          status: 'invalid',
          detail:
            'El material resuelto no parece un PKCS#12 base64 valido. La frontera interna todavia no podria cargarlo de forma confiable.',
          encoding: 'unknown',
          passwordPresent: true,
          fingerprintPresent: Boolean(signatureSettings.certificateFingerprint),
          subjectNamePresent: Boolean(signatureSettings.subjectName),
          byteLength: null,
        };
      }

      if (decodedPkcs12.length < 64 || decodedPkcs12[0] !== 0x30) {
        return {
          status: 'invalid',
          detail:
            'El material base64 decodifica, pero no conserva la forma ASN.1 esperada para un PKCS#12 utilizable.',
          encoding: 'base64_der',
          passwordPresent: true,
          fingerprintPresent: Boolean(signatureSettings.certificateFingerprint),
          subjectNamePresent: Boolean(signatureSettings.subjectName),
          byteLength: decodedPkcs12.length,
        };
      }

      const metadataHints: string[] = [];

      if (!signatureSettings.certificateFingerprint) {
        metadataHints.push('falta certificateFingerprint');
      }

      if (!signatureSettings.subjectName) {
        metadataHints.push('falta subjectName');
      }

      return {
        status: 'likely_usable',
        detail:
          metadataHints.length > 0
            ? `El PKCS#12 resuelve como base64/DER y el password no esta vacio. Aun conviene completar metadata visible del certificado: ${metadataHints.join(', ')}.`
            : 'El PKCS#12 resuelve como base64/DER, el password no esta vacio y la metadata principal del certificado ya esta presente.',
        encoding: 'base64_der',
        passwordPresent: true,
        fingerprintPresent: Boolean(signatureSettings.certificateFingerprint),
        subjectNamePresent: Boolean(signatureSettings.subjectName),
        byteLength: decodedPkcs12.length,
      };
    } catch (error) {
      return {
        status: 'invalid',
        detail:
          error instanceof Error
            ? error.message
            : 'No se pudo inspeccionar el material PKCS#12 del signer interno.',
        encoding: 'unknown',
        passwordPresent: false,
        fingerprintPresent: Boolean(signatureSettings.certificateFingerprint),
        subjectNamePresent: Boolean(signatureSettings.subjectName),
        byteLength: null,
      };
    }
  }
}

function decodeBase64Pkcs12(value: string): Buffer | null {
  const normalized = value.replace(/\s+/g, '');

  if (
    normalized.length < 16 ||
    normalized.length % 4 !== 0 ||
    !/^[A-Za-z0-9+/=]+$/.test(normalized)
  ) {
    return null;
  }

  try {
    const decoded = Buffer.from(normalized, 'base64');

    if (decoded.length === 0) {
      return null;
    }

    const canonicalInput = normalized.replace(/=+$/, '');
    const canonicalDecoded = decoded
      .toString('base64')
      .replace(/=+$/, '');

    return canonicalInput === canonicalDecoded ? decoded : null;
  } catch {
    return null;
  }
}
