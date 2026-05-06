import { Injectable } from '@nestjs/common';
import {
  CheckElectronicInvoiceAuthorizationInput,
  ElectronicInvoiceAuthorizationResult,
  ElectronicInvoiceSubmissionGateway,
  ElectronicInvoiceSubmissionResult,
  SubmitElectronicInvoiceInput,
} from '@saas-platform/invoicing-application';
import { AxiosSriOfflineWsClient } from './axios-sri-offline-ws-client';
import { StubSriOfflineWsClient } from './stub-sri-offline-ws-client';

@Injectable()
export class StubSriOfflineWsSubmissionGateway
  implements ElectronicInvoiceSubmissionGateway
{
  constructor(
    private readonly axiosSriOfflineWsClient: AxiosSriOfflineWsClient,
    private readonly sriOfflineWsClient: StubSriOfflineWsClient,
  ) {}

  async submit(
    input: SubmitElectronicInvoiceInput,
  ): Promise<ElectronicInvoiceSubmissionResult> {
    const client = this.resolveClient(input.submissionSettings.transmissionMode);
    const reception = await client.submitReception({
      accessKey: input.accessKey,
      invoiceId: input.invoiceId,
      signedXml: input.signedXml,
      environment: input.submissionSettings.environment,
      receptionUrl: input.submissionSettings.receptionUrl,
      timeoutMs: input.submissionSettings.timeoutMs,
      credentialsSecretRef: input.submissionSettings.credentialsSecretRef,
    });

    return {
      electronicStatus:
        reception.providerStatus === 'RECIBIDA' ? 'submitted' : 'rejected',
      submittedAt: reception.submittedAt,
      submissionReference: reception.submissionReference,
      statusMessage: reception.message,
      technicalTrace: {
        endpoint: reception.endpoint,
        soapAction: reception.soapAction,
        providerStatus: reception.providerStatus,
        requestPayload: reception.requestPayload,
        responsePayload: reception.responsePayload,
      },
    };
  }

  async checkAuthorization(
    input: CheckElectronicInvoiceAuthorizationInput,
  ): Promise<ElectronicInvoiceAuthorizationResult> {
    const client = this.resolveClient(input.submissionSettings.transmissionMode);
    const authorization = await client.checkAuthorization({
      accessKey: input.accessKey,
      invoiceId: input.invoiceId,
      submissionReference: input.submissionReference,
      environment: input.submissionSettings.environment,
      authorizationUrl: input.submissionSettings.authorizationUrl,
      timeoutMs: input.submissionSettings.timeoutMs,
      credentialsSecretRef: input.submissionSettings.credentialsSecretRef,
    });

    return {
      electronicStatus:
        authorization.providerStatus === 'AUTORIZADO'
          ? 'authorized'
          : 'rejected',
      authorizationNumber: authorization.authorizationNumber,
      authorizedAt: authorization.authorizedAt,
      statusMessage: authorization.message,
      technicalTrace: {
        endpoint: authorization.endpoint,
        soapAction: authorization.soapAction,
        providerStatus: authorization.providerStatus,
        requestPayload: authorization.requestPayload,
        responsePayload: authorization.responsePayload,
      },
    };
  }

  private resolveClient(transmissionMode: 'sync_stub' | 'offline') {
    return transmissionMode === 'offline'
      ? this.axiosSriOfflineWsClient
      : this.sriOfflineWsClient;
  }
}
