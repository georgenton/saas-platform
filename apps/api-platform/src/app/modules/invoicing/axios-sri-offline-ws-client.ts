import axios, { AxiosError } from 'axios';
import { Inject, Injectable } from '@nestjs/common';
import {
  InvoiceElectronicSecretResolutionError,
  SECRET_REFERENCE_RESOLVER,
  SecretReferenceResolver,
} from '@saas-platform/invoicing-application';
import {
  buildSriOfflineAuthorizationEnvelope,
  buildSriOfflineReceptionEnvelope,
} from './stub-sri-offline-ws-mapper';
import {
  SriOfflineWsAuthorizationResult,
  SriOfflineWsClient,
  SriOfflineWsReceptionResult,
} from './sri-offline-ws.client';
import {
  parseSriOfflineResponseDiagnostics,
  summarizeSriOfflineResponseDiagnostics,
} from './sri-offline-response-diagnostics';

@Injectable()
export class AxiosSriOfflineWsClient implements SriOfflineWsClient {
  constructor(
    @Inject(SECRET_REFERENCE_RESOLVER)
    private readonly secretReferenceResolver: SecretReferenceResolver,
  ) {}

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

    try {
      const credentialsHeader = await this.resolveCredentialsSecretRef(
        input.credentialsSecretRef,
      );
      const response = await axios.post<string>(envelope.endpoint, envelope.xml, {
        headers: buildSoapHeaders(credentialsHeader),
        responseType: 'text',
        timeout: input.timeoutMs,
      });
      const responsePayload =
        typeof response.data === 'string'
          ? response.data
          : JSON.stringify(response.data);
      const providerStatus = extractTagValue(responsePayload, 'estado');
      const submittedAt = new Date();

      return {
        endpoint: envelope.endpoint,
        soapAction: envelope.soapAction,
        providerStatus: providerStatus === 'RECIBIDA' ? 'RECIBIDA' : 'DEVUELTA',
        message: buildResponseMessage({
          fallback: 'Respuesta de recepcion SRI offline recibida.',
          payload: responsePayload,
        }),
        submittedAt,
        submissionReference: `SRI-HTTP-${input.invoiceId}-${submittedAt.getTime()}`,
        requestPayload: envelope.xml,
        responsePayload,
      };
    } catch (error) {
      return {
        endpoint: envelope.endpoint,
        soapAction: envelope.soapAction,
        providerStatus: 'DEVUELTA',
        message: buildAxiosFailureMessage(error, 'recepcion'),
        submittedAt: new Date(),
        submissionReference: `SRI-HTTP-${input.invoiceId}-${Date.now()}`,
        requestPayload: envelope.xml,
        responsePayload: extractAxiosPayload(error),
      };
    }
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

    try {
      const credentialsHeader = await this.resolveCredentialsSecretRef(
        input.credentialsSecretRef,
      );
      const response = await axios.post<string>(envelope.endpoint, envelope.xml, {
        headers: buildSoapHeaders(credentialsHeader),
        responseType: 'text',
        timeout: input.timeoutMs,
      });
      const responsePayload =
        typeof response.data === 'string'
          ? response.data
          : JSON.stringify(response.data);
      const providerStatus = extractTagValue(responsePayload, 'estado');
      const authorizationNumber =
        extractTagValue(responsePayload, 'numeroAutorizacion') ??
        (providerStatus === 'AUTORIZADO' ? input.accessKey : null);
      const authorizedAt = parseOptionalDate(
        extractTagValue(responsePayload, 'fechaAutorizacion'),
      );

      return {
        endpoint: envelope.endpoint,
        soapAction: envelope.soapAction,
        providerStatus:
          providerStatus === 'AUTORIZADO' ? 'AUTORIZADO' : 'NO AUTORIZADO',
        message: buildResponseMessage({
          fallback: 'Respuesta de autorizacion SRI offline recibida.',
          payload: responsePayload,
        }),
        authorizationNumber,
        authorizedAt,
        requestPayload: envelope.xml,
        responsePayload,
      };
    } catch (error) {
      return {
        endpoint: envelope.endpoint,
        soapAction: envelope.soapAction,
        providerStatus: 'NO AUTORIZADO',
        message: buildAxiosFailureMessage(error, 'autorizacion'),
        authorizationNumber: null,
        authorizedAt: null,
        requestPayload: envelope.xml,
        responsePayload: extractAxiosPayload(error),
      };
    }
  }

  private async resolveCredentialsSecretRef(
    credentialsSecretRef: string | null,
  ): Promise<string | null> {
    if (!credentialsSecretRef) {
      return null;
    }

    const resolved = await this.secretReferenceResolver.resolve(
      credentialsSecretRef,
    );

    if (!resolved) {
      throw new InvoiceElectronicSecretResolutionError(credentialsSecretRef);
    }

    return resolved;
  }
}

function buildSoapHeaders(credentialsSecretValue: string | null): Record<string, string> {
  return {
    'content-type': 'text/xml; charset=utf-8',
    ...(credentialsSecretValue
      ? {
          'x-sri-credentials': credentialsSecretValue,
        }
      : {}),
  };
}

function buildResponseMessage(input: {
  fallback: string;
  payload: string;
}): string {
  const diagnostics = parseSriOfflineResponseDiagnostics(input.payload);

  return (
    summarizeSriOfflineResponseDiagnostics(
      diagnostics ?? {
        state: null,
        messages: [],
      },
    ) ??
    extractTagValue(input.payload, 'identificador') ??
    input.fallback
  );
}

function buildAxiosFailureMessage(error: unknown, phase: string): string {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<string>;

    return `Fallo tecnico en ${phase} SRI offline: ${axiosError.message}`;
  }

  return `Fallo tecnico inesperado en ${phase} SRI offline.`;
}

function extractAxiosPayload(error: unknown): string {
  if (!axios.isAxiosError(error)) {
    return '';
  }

  if (typeof error.response?.data === 'string') {
    return error.response.data;
  }

  if (error.response?.data) {
    return JSON.stringify(error.response.data);
  }

  return error.message;
}

function extractTagValue(payload: string, tagName: string): string | null {
  const tagPattern = new RegExp(`<${tagName}>([\\s\\S]*?)<\\/${tagName}>`, 'i');
  const match = payload.match(tagPattern);

  return match?.[1]?.trim() || null;
}

function parseOptionalDate(value: string | null): Date | null {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);

  return Number.isNaN(parsed.getTime()) ? null : parsed;
}
