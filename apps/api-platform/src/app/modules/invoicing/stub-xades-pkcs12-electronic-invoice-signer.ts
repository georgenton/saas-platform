import { Inject, Injectable } from '@nestjs/common';
import {
  ElectronicInvoiceSigner,
  SECRET_REFERENCE_RESOLVER,
  SecretReferenceResolver,
  SignElectronicInvoiceInput,
  SignedElectronicInvoice,
} from '@saas-platform/invoicing-application';

@Injectable()
export class StubXadesPkcs12ElectronicInvoiceSigner
  implements ElectronicInvoiceSigner
{
  constructor(
    @Inject(SECRET_REFERENCE_RESOLVER)
    private readonly secretReferenceResolver: SecretReferenceResolver,
  ) {}

  async sign(
    input: SignElectronicInvoiceInput,
  ): Promise<SignedElectronicInvoice> {
    const signedAt = new Date();
    const subjectName =
      input.signatureSettings.subjectName ??
      input.signatureSettings.certificateLabel;
    const resolvedPkcs12 = input.signatureSettings.pkcs12SecretRef
      ? await this.secretReferenceResolver.resolve(
          input.signatureSettings.pkcs12SecretRef,
        )
      : null;
    const resolvedPassword = input.signatureSettings.privateKeyPasswordSecretRef
      ? await this.secretReferenceResolver.resolve(
          input.signatureSettings.privateKeyPasswordSecretRef,
        )
      : null;
    const signatureBlock = `
  <ds:Signature xmlns:ds="http://www.w3.org/2000/09/xmldsig#">
    <ds:SignatureValue>xades-stub-signature-for-${input.accessKey}</ds:SignatureValue>
    <ds:KeyInfo>
      <ds:X509Data>
        <ds:X509SubjectName>${subjectName}</ds:X509SubjectName>
      </ds:X509Data>
    </ds:KeyInfo>
    <etsi:QualifyingProperties xmlns:etsi="http://uri.etsi.org/01903/v1.3.2#">
      <etsi:SignedProperties>
        <etsi:SignedSignatureProperties>
          <etsi:SigningTime>${signedAt.toISOString()}</etsi:SigningTime>
          <etsi:SigningCertificate>${input.signatureSettings.certificateFingerprint ?? 'fingerprint-not-set'}</etsi:SigningCertificate>
          <etsi:SignerRole>${resolvedPkcs12 ? 'pkcs12-loaded' : 'pkcs12-missing'}</etsi:SignerRole>
          <etsi:SignaturePolicyIdentifier>${resolvedPassword ? 'password-loaded' : 'password-missing'}</etsi:SignaturePolicyIdentifier>
        </etsi:SignedSignatureProperties>
      </etsi:SignedProperties>
    </etsi:QualifyingProperties>
  </ds:Signature>`;

    return {
      signedXml: input.xml.replace('</factura>', `${signatureBlock}\n</factura>`),
      signedAt,
      signerName: `xades_pkcs12:${subjectName}`,
    };
  }
}
