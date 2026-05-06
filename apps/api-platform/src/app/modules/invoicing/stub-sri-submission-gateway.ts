import { Injectable } from '@nestjs/common';
import {
  CheckElectronicInvoiceAuthorizationInput,
  ElectronicInvoiceSubmissionGateway,
  ElectronicInvoiceAuthorizationResult,
  ElectronicInvoiceSubmissionResult,
  SubmitElectronicInvoiceInput,
} from '@saas-platform/invoicing-application';

@Injectable()
export class StubSriSubmissionGateway
  implements ElectronicInvoiceSubmissionGateway
{
  async submit(
    input: SubmitElectronicInvoiceInput,
  ): Promise<ElectronicInvoiceSubmissionResult> {
    const submittedAt = new Date();
    const submissionReference = `stub-sri-${input.invoiceId}-${submittedAt.getTime()}`;
    const requestPayload = JSON.stringify({
      gateway: 'stub_sri',
      invoiceId: input.invoiceId,
      accessKey: input.accessKey,
      environment: input.submissionSettings.environment,
    });
    const responsePayload = JSON.stringify({
      state: 'submitted',
      submissionReference,
    });

    return {
      electronicStatus: 'submitted',
      submittedAt,
      submissionReference,
      statusMessage: `Documento firmado y enviado al gateway stub del SRI (${input.submissionSettings.environment}). Pendiente de autorizacion real.`,
      technicalTrace: {
        endpoint: null,
        soapAction: null,
        providerStatus: 'submitted',
        requestPayload,
        responsePayload,
      },
    };
  }

  async checkAuthorization(
    input: CheckElectronicInvoiceAuthorizationInput,
  ): Promise<ElectronicInvoiceAuthorizationResult> {
    const responsePayload = JSON.stringify({
      state: 'authorized',
      authorizationNumber: input.accessKey,
    });

    return {
      electronicStatus: 'authorized',
      authorizationNumber: input.accessKey,
      authorizedAt: new Date(),
      statusMessage: `Documento autorizado por el stub del SRI (${input.submissionSettings.environment}). Listo para reemplazar por polling real.`,
      technicalTrace: {
        endpoint: null,
        soapAction: null,
        providerStatus: 'authorized',
        requestPayload: JSON.stringify({
          gateway: 'stub_sri',
          invoiceId: input.invoiceId,
          accessKey: input.accessKey,
          submissionReference: input.submissionReference,
          environment: input.submissionSettings.environment,
        }),
        responsePayload,
      },
    };
  }
}
