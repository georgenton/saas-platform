import { Injectable } from '@nestjs/common';
import {
  DescribeElectronicInvoiceSignerCapabilityInput,
  ElectronicInvoiceSigner,
  ElectronicInvoiceSignerCapability,
  SignElectronicInvoiceInput,
  SignedElectronicInvoice,
} from '@saas-platform/invoicing-application';
import { StubLocalElectronicInvoiceSigner } from './stub-local-electronic-invoice-signer';
import { StubXadesPkcs12ElectronicInvoiceSigner } from './stub-xades-pkcs12-electronic-invoice-signer';

@Injectable()
export class RoutingElectronicInvoiceSigner
  implements ElectronicInvoiceSigner
{
  constructor(
    private readonly stubLocalElectronicInvoiceSigner: StubLocalElectronicInvoiceSigner,
    private readonly stubXadesPkcs12ElectronicInvoiceSigner: StubXadesPkcs12ElectronicInvoiceSigner,
  ) {}

  describeCapability(
    input: DescribeElectronicInvoiceSignerCapabilityInput,
  ): ElectronicInvoiceSignerCapability {
    switch (input.signatureSettings.provider) {
      case 'xades_pkcs12':
        return this.stubXadesPkcs12ElectronicInvoiceSigner.describeCapability(
          input,
        );
      case 'stub_local':
      default:
        return this.stubLocalElectronicInvoiceSigner.describeCapability(input);
    }
  }

  async sign(
    input: SignElectronicInvoiceInput,
  ): Promise<SignedElectronicInvoice> {
    switch (input.signatureSettings.provider) {
      case 'xades_pkcs12':
        return this.stubXadesPkcs12ElectronicInvoiceSigner.sign(input);
      case 'stub_local':
      default:
        return this.stubLocalElectronicInvoiceSigner.sign(input);
    }
  }
}
