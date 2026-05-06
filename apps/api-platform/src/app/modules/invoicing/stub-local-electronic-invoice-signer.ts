import { Injectable } from '@nestjs/common';
import {
  ElectronicInvoiceSigner,
  SignElectronicInvoiceInput,
  SignedElectronicInvoice,
} from '@saas-platform/invoicing-application';

@Injectable()
export class StubLocalElectronicInvoiceSigner
  implements ElectronicInvoiceSigner
{
  async sign(
    input: SignElectronicInvoiceInput,
  ): Promise<SignedElectronicInvoice> {
    const signedAt = new Date();
    const signatureBlock = `
  <ds:Signature xmlns:ds="http://www.w3.org/2000/09/xmldsig#">
    <ds:SignatureValue>stub-signature-for-${input.accessKey}</ds:SignatureValue>
    <ds:KeyInfo>
      <ds:KeyName>${input.signatureSettings.certificateLabel}</ds:KeyName>
    </ds:KeyInfo>
  </ds:Signature>`;

    return {
      signedXml: input.xml.replace('</factura>', `${signatureBlock}\n</factura>`),
      signedAt,
      signerName: `stub_local:${input.signatureSettings.certificateLabel}`,
    };
  }
}
