export interface SriOfflineWsReceptionResult {
  endpoint: string;
  soapAction: 'validarComprobante';
  providerStatus: 'RECIBIDA' | 'DEVUELTA';
  message: string;
  submittedAt: Date;
  submissionReference: string;
  requestPayload: string;
  responsePayload: string;
}

export interface SriOfflineWsAuthorizationResult {
  endpoint: string;
  soapAction: 'autorizacionComprobante';
  providerStatus: 'AUTORIZADO' | 'NO AUTORIZADO';
  message: string;
  authorizationNumber: string | null;
  authorizedAt: Date | null;
  requestPayload: string;
  responsePayload: string;
}

export interface SriOfflineWsClient {
  submitReception(input: {
    accessKey: string;
    invoiceId: string;
    signedXml: string;
    environment: 'test' | 'production';
    receptionUrl: string | null;
    timeoutMs: number;
    credentialsSecretRef: string | null;
  }): Promise<SriOfflineWsReceptionResult>;

  checkAuthorization(input: {
    accessKey: string;
    invoiceId: string;
    submissionReference: string;
    environment: 'test' | 'production';
    authorizationUrl: string | null;
    timeoutMs: number;
    credentialsSecretRef: string | null;
  }): Promise<SriOfflineWsAuthorizationResult>;
}
