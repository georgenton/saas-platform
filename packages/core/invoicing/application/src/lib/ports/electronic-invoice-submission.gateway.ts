import { ElectronicSubmissionSettings } from '@saas-platform/invoicing-domain';

export interface SubmitElectronicInvoiceInput {
  tenantSlug: string;
  invoiceId: string;
  accessKey: string;
  signedXml: string;
  submissionSettings: ElectronicSubmissionSettings;
}

export interface ElectronicInvoiceGatewayTrace {
  endpoint: string | null;
  soapAction: string | null;
  providerStatus: string;
  requestPayload: string | null;
  responsePayload: string | null;
}

export interface ElectronicInvoiceSubmissionResult {
  electronicStatus: 'submitted' | 'rejected';
  submittedAt: Date;
  submissionReference: string;
  statusMessage: string;
  technicalTrace?: ElectronicInvoiceGatewayTrace;
}

export interface CheckElectronicInvoiceAuthorizationInput {
  tenantSlug: string;
  invoiceId: string;
  accessKey: string;
  submissionReference: string;
  submissionSettings: ElectronicSubmissionSettings;
}

export interface ElectronicInvoiceAuthorizationResult {
  electronicStatus: 'authorized' | 'rejected';
  authorizationNumber: string | null;
  authorizedAt: Date | null;
  statusMessage: string;
  technicalTrace?: ElectronicInvoiceGatewayTrace;
}

export interface ElectronicInvoiceSubmissionGateway {
  submit(
    input: SubmitElectronicInvoiceInput,
  ): Promise<ElectronicInvoiceSubmissionResult>;

  checkAuthorization(
    input: CheckElectronicInvoiceAuthorizationInput,
  ): Promise<ElectronicInvoiceAuthorizationResult>;
}
