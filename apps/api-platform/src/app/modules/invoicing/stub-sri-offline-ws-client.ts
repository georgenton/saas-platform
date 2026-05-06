import { Injectable } from '@nestjs/common';
import {
  buildSriOfflineAuthorizationEnvelope,
  buildSriOfflineAuthorizationResponseXml,
  buildSriOfflineReceptionEnvelope,
  buildSriOfflineReceptionResponseXml,
  simulateSriOfflineAuthorizationResponse,
  simulateSriOfflineReceptionResponse,
} from './stub-sri-offline-ws-mapper';
import {
  SriOfflineWsAuthorizationResult,
  SriOfflineWsClient,
  SriOfflineWsReceptionResult,
} from './sri-offline-ws.client';

@Injectable()
export class StubSriOfflineWsClient implements SriOfflineWsClient {
  async submitReception(input: {
    accessKey: string;
    invoiceId: string;
    signedXml: string;
    environment: 'test' | 'production';
    receptionUrl: string | null;
    timeoutMs: number;
    credentialsSecretRef: string | null;
  }): Promise<SriOfflineWsReceptionResult> {
    const envelope = buildSriOfflineReceptionEnvelope({
      accessKey: input.accessKey,
      invoiceId: input.invoiceId,
      signedXml: input.signedXml,
      submissionSettings: {
        environment: input.environment,
        receptionUrl: input.receptionUrl,
      },
    });
    const reception = simulateSriOfflineReceptionResponse(
      {
        accessKey: input.accessKey,
        invoiceId: input.invoiceId,
        signedXml: input.signedXml,
        submissionSettings: {
          environment: input.environment,
          receptionUrl: input.receptionUrl,
        },
      },
      envelope,
    );

    return {
      endpoint: envelope.endpoint,
      soapAction: envelope.soapAction,
      providerStatus: reception.state,
      message: reception.message,
      submittedAt: reception.submittedAt,
      submissionReference: reception.submissionReference,
      requestPayload: envelope.xml,
      responsePayload: buildSriOfflineReceptionResponseXml(reception),
    };
  }

  async checkAuthorization(input: {
    accessKey: string;
    invoiceId: string;
    submissionReference: string;
    environment: 'test' | 'production';
    authorizationUrl: string | null;
    timeoutMs: number;
    credentialsSecretRef: string | null;
  }): Promise<SriOfflineWsAuthorizationResult> {
    const envelope = buildSriOfflineAuthorizationEnvelope({
      accessKey: input.accessKey,
      invoiceId: input.invoiceId,
      submissionReference: input.submissionReference,
      submissionSettings: {
        environment: input.environment,
        authorizationUrl: input.authorizationUrl,
      },
    });
    const authorization = simulateSriOfflineAuthorizationResponse(
      {
        accessKey: input.accessKey,
        invoiceId: input.invoiceId,
        submissionReference: input.submissionReference,
        submissionSettings: {
          environment: input.environment,
          authorizationUrl: input.authorizationUrl,
        },
      },
      envelope,
    );

    return {
      endpoint: envelope.endpoint,
      soapAction: envelope.soapAction,
      providerStatus: authorization.state,
      message: authorization.message,
      authorizationNumber: authorization.authorizationNumber,
      authorizedAt: authorization.authorizedAt,
      requestPayload: envelope.xml,
      responsePayload: buildSriOfflineAuthorizationResponseXml(authorization),
    };
  }
}
