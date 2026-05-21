import {
  AuthenticatedInvitationResponse,
  AuthenticatedSessionResponse,
  CreditNoteResponse,
  DebitNoteResponse,
  GrowthConversationWorkbenchResponse,
  RemissionGuideResponse,
  WithholdingResponse,
  CustomerResponse,
  GrowthOperationalCaseResponse,
  ElectronicSandboxReadinessResponse,
  ElectronicSignatureMaterialInspectionResponse,
  ElectronicSubmissionSettingsResponse,
  ElectronicSignatureSettingsResponse,
  InvoiceElectronicArtifactsResponse,
  InvoiceNumberingSettingsResponse,
  InvoiceDetailResponse,
  InvoiceDocumentResponse,
  InvoiceRideResponse,
  IssuerProfileResponse,
  InvoicingReportSummaryResponse,
  InvitationResponse,
  InvoiceItemResponse,
  InvoiceSummaryResponse,
  PaymentResponse,
  PlatformPlan,
  PlatformProduct,
  TaxRateResponse,
  WhatsappOperationalMonitorAnalyticsResponse,
  WhatsappOperationalMonitorSummaryResponse,
  WhatsappOperationalMonitorRunResponse,
  WhatsappOperationalAlertAcknowledgementResponse,
  WhatsappOutboundReportingSummaryResponse,
} from './types';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:3000/api';

const buildHeaders = (token: string, json = true): HeadersInit => ({
  Authorization: `Bearer ${token}`,
  ...(json ? { 'Content-Type': 'application/json' } : {}),
});

async function request<T>(
  path: string,
  options: RequestInit & { token: string },
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...buildHeaders(options.token, options.body !== undefined),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

async function requestText(
  path: string,
  options: RequestInit & { token: string },
): Promise<string> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...buildHeaders(options.token, options.body !== undefined),
      ...options.headers,
    },
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(text || `Request failed with status ${response.status}`);
  }

  return text;
}

function extractFileNameFromDisposition(value: string | null): string | null {
  if (!value) {
    return null;
  }

  const match = value.match(/filename=\"?([^"]+)\"?/i);
  return match ? match[1] : null;
}

async function requestDownload(
  path: string,
  options: RequestInit & { token: string },
): Promise<{ content: string; fileName: string | null; contentType: string | null }> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...buildHeaders(options.token, options.body !== undefined),
      ...options.headers,
    },
  });

  const content = await response.text();

  if (!response.ok) {
    throw new Error(content || `Request failed with status ${response.status}`);
  }

  return {
    content,
    fileName: extractFileNameFromDisposition(
      response.headers.get('content-disposition'),
    ),
    contentType: response.headers.get('content-type'),
  };
}

export async function fetchSession(
  token: string,
  tenantSlug?: string | null,
): Promise<AuthenticatedSessionResponse> {
  const query = tenantSlug
    ? `?tenantSlug=${encodeURIComponent(tenantSlug)}`
    : '';

  return request<AuthenticatedSessionResponse>(`/auth/me${query}`, {
    method: 'GET',
    token,
  });
}

export async function listPlans(token: string): Promise<PlatformPlan[]> {
  return request<PlatformPlan[]>('/platform/plans', {
    method: 'GET',
    token,
  });
}

export async function listProducts(token: string): Promise<PlatformProduct[]> {
  return request<PlatformProduct[]>('/platform/products', {
    method: 'GET',
    token,
  });
}

export async function listTenantEnabledProducts(
  token: string,
  tenantSlug: string,
): Promise<PlatformProduct[]> {
  return request<PlatformProduct[]>(
    `/tenancy/tenants/${encodeURIComponent(tenantSlug)}/products`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function setCurrentTenancy(
  token: string,
  tenantSlug: string | null,
): Promise<AuthenticatedSessionResponse> {
  return request<AuthenticatedSessionResponse>('/auth/me/current-tenancy', {
    method: 'PUT',
    token,
    body: JSON.stringify({ tenantSlug }),
  });
}

export async function fetchInvitationForInvitee(
  token: string,
  invitationId: string,
): Promise<AuthenticatedInvitationResponse> {
  return request<AuthenticatedInvitationResponse>(
    `/auth/invitations/${encodeURIComponent(invitationId)}`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function acceptInvitation(
  token: string,
  invitationId: string,
): Promise<AuthenticatedSessionResponse> {
  return request<AuthenticatedSessionResponse>(
    `/auth/invitations/${encodeURIComponent(invitationId)}/accept`,
    {
      method: 'POST',
      token,
    },
  );
}

export async function listTenantInvitations(
  token: string,
  tenantSlug: string,
): Promise<InvitationResponse[]> {
  return request<InvitationResponse[]>(
    `/tenancy/tenants/${encodeURIComponent(tenantSlug)}/invitations`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function getTenantInvitation(
  token: string,
  tenantSlug: string,
  invitationId: string,
): Promise<InvitationResponse> {
  return request<InvitationResponse>(
    `/tenancy/tenants/${encodeURIComponent(
      tenantSlug,
    )}/invitations/${encodeURIComponent(invitationId)}`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function createInvitation(
  token: string,
  tenantSlug: string,
  email: string,
): Promise<InvitationResponse> {
  return request<InvitationResponse>(
    `/tenancy/tenants/${encodeURIComponent(tenantSlug)}/invitations`,
    {
      method: 'POST',
      token,
      body: JSON.stringify({ email }),
    },
  );
}

export async function cancelInvitation(
  token: string,
  tenantSlug: string,
  invitationId: string,
): Promise<void> {
  await request<void>(
    `/tenancy/tenants/${encodeURIComponent(
      tenantSlug,
    )}/invitations/${encodeURIComponent(invitationId)}`,
    {
      method: 'DELETE',
      token,
    },
  );
}

export async function resendInvitation(
  token: string,
  tenantSlug: string,
  invitationId: string,
): Promise<InvitationResponse> {
  return request<InvitationResponse>(
    `/tenancy/tenants/${encodeURIComponent(
      tenantSlug,
    )}/invitations/${encodeURIComponent(invitationId)}/resend`,
    {
      method: 'POST',
      token,
    },
  );
}

export async function listCustomers(
  token: string,
  tenantSlug: string,
): Promise<CustomerResponse[]> {
  return request<CustomerResponse[]>(
    `/invoicing/tenants/${encodeURIComponent(tenantSlug)}/customers`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function fetchIssuerProfile(
  token: string,
  tenantSlug: string,
): Promise<IssuerProfileResponse> {
  return request<IssuerProfileResponse>(
    `/invoicing/tenants/${encodeURIComponent(tenantSlug)}/electronic-profile`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function upsertIssuerProfile(
  token: string,
  tenantSlug: string,
  body: {
    legalName: string;
    commercialName?: string | null;
    taxId: string;
    environment: 'test' | 'production';
    emissionType?: 'normal';
    accountingObligated: boolean;
    specialTaxpayerCode?: string | null;
    rimpeTaxpayerType?: string | null;
    matrixAddress: string;
    establishmentAddress: string;
  },
): Promise<IssuerProfileResponse> {
  return request<IssuerProfileResponse>(
    `/invoicing/tenants/${encodeURIComponent(tenantSlug)}/electronic-profile`,
    {
      method: 'POST',
      token,
      body: JSON.stringify(body),
    },
  );
}

export async function syncIssuerProfileTaxIdFromSignature(
  token: string,
  tenantSlug: string,
): Promise<IssuerProfileResponse> {
  return request<IssuerProfileResponse>(
    `/invoicing/tenants/${encodeURIComponent(
      tenantSlug,
    )}/electronic-profile/sync-certificate-tax-id`,
    {
      method: 'POST',
      token,
    },
  );
}

export async function fetchElectronicSignatureSettings(
  token: string,
  tenantSlug: string,
): Promise<ElectronicSignatureSettingsResponse> {
  return request<ElectronicSignatureSettingsResponse>(
    `/invoicing/tenants/${encodeURIComponent(tenantSlug)}/electronic-signature`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function fetchElectronicSignatureMaterialInspection(
  token: string,
  tenantSlug: string,
): Promise<ElectronicSignatureMaterialInspectionResponse> {
  return request<ElectronicSignatureMaterialInspectionResponse>(
    `/invoicing/tenants/${encodeURIComponent(
      tenantSlug,
    )}/electronic-signature/inspection`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function fetchElectronicSubmissionSettings(
  token: string,
  tenantSlug: string,
): Promise<ElectronicSubmissionSettingsResponse> {
  return request<ElectronicSubmissionSettingsResponse>(
    `/invoicing/tenants/${encodeURIComponent(tenantSlug)}/electronic-submission`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function fetchElectronicSandboxReadiness(
  token: string,
  tenantSlug: string,
): Promise<ElectronicSandboxReadinessResponse> {
  return request<ElectronicSandboxReadinessResponse>(
    `/invoicing/tenants/${encodeURIComponent(
      tenantSlug,
    )}/electronic-document/readiness`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function upsertElectronicSignatureSettings(
  token: string,
  tenantSlug: string,
  body: {
    provider?: 'stub_local' | 'xades_pkcs12';
    certificateLabel: string;
    storageMode?: 'stub_inline' | 'secret_ref';
    certificateFingerprint?: string | null;
    pkcs12SecretRef?: string | null;
    privateKeyPasswordSecretRef?: string | null;
    subjectName?: string | null;
    hydrateMetadataFromPkcs12?: boolean;
    isActive: boolean;
  },
): Promise<ElectronicSignatureSettingsResponse> {
  return request<ElectronicSignatureSettingsResponse>(
    `/invoicing/tenants/${encodeURIComponent(tenantSlug)}/electronic-signature`,
    {
      method: 'POST',
      token,
      body: JSON.stringify(body),
    },
  );
}

export async function upsertElectronicSubmissionSettings(
  token: string,
  tenantSlug: string,
  body: {
    provider?: 'stub_sri' | 'sri_offline_ws';
    environment?: 'test' | 'production';
    transmissionMode?: 'sync_stub' | 'offline';
    receptionUrl?: string | null;
    authorizationUrl?: string | null;
    credentialsSecretRef?: string | null;
    timeoutMs: number;
    isActive: boolean;
  },
): Promise<ElectronicSubmissionSettingsResponse> {
  return request<ElectronicSubmissionSettingsResponse>(
    `/invoicing/tenants/${encodeURIComponent(tenantSlug)}/electronic-submission`,
    {
      method: 'POST',
      token,
      body: JSON.stringify(body),
    },
  );
}

export async function fetchInvoiceNumberingSettings(
  token: string,
  tenantSlug: string,
  documentCode = '01',
): Promise<InvoiceNumberingSettingsResponse> {
  const numberingPath = resolveNumberingPath(documentCode);

  return request<InvoiceNumberingSettingsResponse>(
    `/invoicing/tenants/${encodeURIComponent(tenantSlug)}/numbering/${numberingPath}`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function fetchCreditNoteNumberingSettings(
  token: string,
  tenantSlug: string,
): Promise<InvoiceNumberingSettingsResponse> {
  return request<InvoiceNumberingSettingsResponse>(
    `/invoicing/tenants/${encodeURIComponent(tenantSlug)}/numbering/credit-note`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function upsertInvoiceNumberingSettings(
  token: string,
  tenantSlug: string,
  body: {
    documentCode?: string;
    establishmentCode: string;
    emissionPointCode: string;
    nextSequenceNumber: number;
  },
): Promise<InvoiceNumberingSettingsResponse> {
  const numberingPath = resolveNumberingPath(body.documentCode ?? '01');

  return request<InvoiceNumberingSettingsResponse>(
    `/invoicing/tenants/${encodeURIComponent(tenantSlug)}/numbering/${numberingPath}`,
    {
      method: 'POST',
      token,
      body: JSON.stringify(body),
    },
  );
}

export async function upsertCreditNoteNumberingSettings(
  token: string,
  tenantSlug: string,
  body: {
    establishmentCode: string;
    emissionPointCode: string;
    nextSequenceNumber: number;
  },
): Promise<InvoiceNumberingSettingsResponse> {
  return request<InvoiceNumberingSettingsResponse>(
    `/invoicing/tenants/${encodeURIComponent(tenantSlug)}/numbering/credit-note`,
    {
      method: 'POST',
      token,
      body: JSON.stringify(body),
    },
  );
}

export async function fetchWithholdingNumberingSettings(
  token: string,
  tenantSlug: string,
): Promise<InvoiceNumberingSettingsResponse> {
  return request<InvoiceNumberingSettingsResponse>(
    `/invoicing/tenants/${encodeURIComponent(tenantSlug)}/numbering/withholding`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function upsertWithholdingNumberingSettings(
  token: string,
  tenantSlug: string,
  body: {
    establishmentCode: string;
    emissionPointCode: string;
    nextSequenceNumber: number;
  },
): Promise<InvoiceNumberingSettingsResponse> {
  return request<InvoiceNumberingSettingsResponse>(
    `/invoicing/tenants/${encodeURIComponent(tenantSlug)}/numbering/withholding`,
    {
      method: 'POST',
      token,
      body: JSON.stringify(body),
    },
  );
}

export async function createCustomer(
  token: string,
  tenantSlug: string,
  body: {
    name: string;
    email?: string | null;
    taxId?: string | null;
    identificationType?: '04' | '05' | '06' | '07' | '08' | null;
    identification?: string | null;
    billingAddress?: string | null;
  },
): Promise<CustomerResponse> {
  return request<CustomerResponse>(
    `/invoicing/tenants/${encodeURIComponent(tenantSlug)}/customers`,
    {
      method: 'POST',
      token,
      body: JSON.stringify(body),
    },
  );
}

export async function listTaxRates(
  token: string,
  tenantSlug: string,
): Promise<TaxRateResponse[]> {
  return request<TaxRateResponse[]>(
    `/invoicing/tenants/${encodeURIComponent(tenantSlug)}/taxes`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function createTaxRate(
  token: string,
  tenantSlug: string,
  body: {
    name: string;
    percentage: number;
    isActive?: boolean;
  },
): Promise<TaxRateResponse> {
  return request<TaxRateResponse>(
    `/invoicing/tenants/${encodeURIComponent(tenantSlug)}/taxes`,
    {
      method: 'POST',
      token,
      body: JSON.stringify(body),
    },
  );
}

export async function fetchInvoiceDocument(
  token: string,
  tenantSlug: string,
  invoiceId: string,
): Promise<InvoiceDocumentResponse> {
  return request<InvoiceDocumentResponse>(
    `/invoicing/tenants/${encodeURIComponent(
      tenantSlug,
    )}/invoices/${encodeURIComponent(invoiceId)}/document`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function fetchInvoiceDocumentHtml(
  token: string,
  tenantSlug: string,
  invoiceId: string,
): Promise<string> {
  return requestText(
    `/invoicing/tenants/${encodeURIComponent(
      tenantSlug,
    )}/invoices/${encodeURIComponent(invoiceId)}/document/html`,
    {
      method: 'GET',
      token,
      headers: {
        Accept: 'text/html',
      },
    },
  );
}

export async function fetchInvoiceElectronicRide(
  token: string,
  tenantSlug: string,
  invoiceId: string,
): Promise<InvoiceRideResponse> {
  return request<InvoiceRideResponse>(
    `/invoicing/tenants/${encodeURIComponent(
      tenantSlug,
    )}/invoices/${encodeURIComponent(invoiceId)}/electronic-document/ride`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function fetchInvoiceElectronicArtifacts(
  token: string,
  tenantSlug: string,
  invoiceId: string,
): Promise<InvoiceElectronicArtifactsResponse> {
  return request<InvoiceElectronicArtifactsResponse>(
    `/invoicing/tenants/${encodeURIComponent(
      tenantSlug,
    )}/invoices/${encodeURIComponent(invoiceId)}/electronic-document/artifacts`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function fetchInvoiceElectronicRideHtml(
  token: string,
  tenantSlug: string,
  invoiceId: string,
): Promise<string> {
  return requestText(
    `/invoicing/tenants/${encodeURIComponent(
      tenantSlug,
    )}/invoices/${encodeURIComponent(invoiceId)}/electronic-document/ride/html`,
    {
      method: 'GET',
      token,
      headers: {
        Accept: 'text/html',
      },
    },
  );
}

export async function downloadInvoiceElectronicRideHtml(
  token: string,
  tenantSlug: string,
  invoiceId: string,
): Promise<{ content: string; fileName: string | null; contentType: string | null }> {
  return requestDownload(
    `/invoicing/tenants/${encodeURIComponent(
      tenantSlug,
    )}/invoices/${encodeURIComponent(invoiceId)}/electronic-document/ride/download`,
    {
      method: 'GET',
      token,
      headers: {
        Accept: 'text/html',
      },
    },
  );
}

export async function fetchInvoiceElectronicXmlPreview(
  token: string,
  tenantSlug: string,
  invoiceId: string,
): Promise<string> {
  return requestText(
    `/invoicing/tenants/${encodeURIComponent(
      tenantSlug,
    )}/invoices/${encodeURIComponent(invoiceId)}/electronic-document/xml`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function downloadInvoiceElectronicXmlPreview(
  token: string,
  tenantSlug: string,
  invoiceId: string,
): Promise<{ content: string; fileName: string | null; contentType: string | null }> {
  return requestDownload(
    `/invoicing/tenants/${encodeURIComponent(
      tenantSlug,
    )}/invoices/${encodeURIComponent(invoiceId)}/electronic-document/xml/download`,
    {
      method: 'GET',
      token,
      headers: {
        Accept: 'application/xml',
      },
    },
  );
}

export async function sendInvoiceEmail(
  token: string,
  tenantSlug: string,
  invoiceId: string,
  body: {
    recipientEmail?: string | null;
    message?: string | null;
  },
): Promise<{ delivered: true }> {
  return request<{ delivered: true }>(
    `/invoicing/tenants/${encodeURIComponent(
      tenantSlug,
    )}/invoices/${encodeURIComponent(invoiceId)}/send-email`,
    {
      method: 'POST',
      token,
      body: JSON.stringify(body),
    },
  );
}

export async function fetchInvoicingReportSummary(
  token: string,
  tenantSlug: string,
): Promise<InvoicingReportSummaryResponse> {
  return request<InvoicingReportSummaryResponse>(
    `/invoicing/tenants/${encodeURIComponent(tenantSlug)}/reports/summary`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function listInvoices(
  token: string,
  tenantSlug: string,
): Promise<InvoiceSummaryResponse[]> {
  return request<InvoiceSummaryResponse[]>(
    `/invoicing/tenants/${encodeURIComponent(tenantSlug)}/invoices`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function fetchInvoiceDetail(
  token: string,
  tenantSlug: string,
  invoiceId: string,
): Promise<InvoiceDetailResponse> {
  return request<InvoiceDetailResponse>(
    `/invoicing/tenants/${encodeURIComponent(
      tenantSlug,
    )}/invoices/${encodeURIComponent(invoiceId)}`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function createInvoice(
  token: string,
  tenantSlug: string,
  body: {
    customerId: string;
    number?: string;
    currency: string;
    status?: string;
    issuedAt?: string;
    dueAt?: string | null;
    notes?: string | null;
  },
): Promise<InvoiceDetailResponse> {
  return request<InvoiceDetailResponse>(
    `/invoicing/tenants/${encodeURIComponent(tenantSlug)}/invoices`,
    {
      method: 'POST',
      token,
      body: JSON.stringify(body),
    },
  );
}

export async function createCreditNote(
  token: string,
  tenantSlug: string,
  body: {
    sourceInvoiceId: string;
    reason: string;
    number?: string;
    issuedAt?: string;
    notes?: string | null;
  },
): Promise<CreditNoteResponse> {
  return request<CreditNoteResponse>(
    `/invoicing/tenants/${encodeURIComponent(tenantSlug)}/credit-notes`,
    {
      method: 'POST',
      token,
      body: JSON.stringify(body),
    },
  );
}

export async function createDebitNote(
  token: string,
  tenantSlug: string,
  body: {
    sourceInvoiceId: string;
    reason: string;
    amountInCents: number;
    taxRateId?: string | null;
    number?: string;
    issuedAt?: string;
    notes?: string | null;
  },
): Promise<DebitNoteResponse> {
  return request<DebitNoteResponse>(
    `/invoicing/tenants/${encodeURIComponent(tenantSlug)}/debit-notes`,
    {
      method: 'POST',
      token,
      body: JSON.stringify(body),
    },
  );
}

export async function createRemissionGuide(
  token: string,
  tenantSlug: string,
  body: {
    sourceInvoiceId: string;
    shipmentReason: string;
    shipmentStartAt: string;
    shipmentEndAt: string;
    departureAddress: string;
    arrivalAddress: string;
    carrierName: string;
    carrierIdentificationType: '04' | '05' | '06' | '07' | '08';
    carrierIdentification: string;
    vehiclePlate: string;
    destinationRoute?: string | null;
    number?: string;
    issuedAt?: string;
    notes?: string | null;
  },
): Promise<RemissionGuideResponse> {
  return request<RemissionGuideResponse>(
    `/invoicing/tenants/${encodeURIComponent(tenantSlug)}/remission-guides`,
    {
      method: 'POST',
      token,
      body: JSON.stringify(body),
    },
  );
}

export async function createWithholding(
  token: string,
  tenantSlug: string,
  body: {
    sourceInvoiceId: string;
    reason: string;
    amountInCents: number;
    taxRateId?: string | null;
    number?: string;
    issuedAt?: string;
    notes?: string | null;
  },
): Promise<WithholdingResponse> {
  return request<WithholdingResponse>(
    `/invoicing/tenants/${encodeURIComponent(tenantSlug)}/withholdings`,
    {
      method: 'POST',
      token,
      body: JSON.stringify(body),
    },
  );
}

function resolveNumberingPath(documentCode: string): string {
  switch (documentCode) {
    case '04':
      return 'credit-note';
    case '05':
      return 'debit-note';
    case '06':
      return 'remission-guide';
    case '07':
      return 'withholding';
    case '01':
    default:
      return 'invoice';
  }
}

export async function updateInvoiceStatus(
  token: string,
  tenantSlug: string,
  invoiceId: string,
  status: 'issued' | 'paid' | 'void',
): Promise<InvoiceDetailResponse> {
  return request<InvoiceDetailResponse>(
    `/invoicing/tenants/${encodeURIComponent(
      tenantSlug,
    )}/invoices/${encodeURIComponent(invoiceId)}/status`,
    {
      method: 'POST',
      token,
      body: JSON.stringify({ status }),
    },
  );
}

export async function updateInvoiceElectronicStatus(
  token: string,
  tenantSlug: string,
  invoiceId: string,
  body: {
    electronicStatus?: 'pending_submission' | 'submitted' | 'authorized' | 'rejected' | null;
    accessKey?: string | null;
    authorizationNumber?: string | null;
    authorizedAt?: string | null;
    electronicStatusMessage?: string | null;
  },
): Promise<InvoiceDetailResponse> {
  return request<InvoiceDetailResponse>(
    `/invoicing/tenants/${encodeURIComponent(
      tenantSlug,
    )}/invoices/${encodeURIComponent(invoiceId)}/electronic-status`,
    {
      method: 'POST',
      token,
      body: JSON.stringify(body),
    },
  );
}

export async function submitInvoiceElectronicDocument(
  token: string,
  tenantSlug: string,
  invoiceId: string,
): Promise<{
  submitted: true;
  electronicStatus: string | null;
  accessKey: string | null;
  submittedAt: string | null;
  submissionReference: string | null;
}> {
  return request(
    `/invoicing/tenants/${encodeURIComponent(
      tenantSlug,
    )}/invoices/${encodeURIComponent(invoiceId)}/electronic-document/submit`,
    {
      method: 'POST',
      token,
    },
  );
}

export async function submitPresignedInvoiceElectronicDocument(
  token: string,
  tenantSlug: string,
  invoiceId: string,
  body: {
    signedXml: string;
    signerName?: string | null;
  },
): Promise<{
  submitted: true;
  electronicStatus: string | null;
  accessKey: string | null;
  submittedAt: string | null;
  submissionReference: string | null;
}> {
  return request(
    `/invoicing/tenants/${encodeURIComponent(
      tenantSlug,
    )}/invoices/${encodeURIComponent(
      invoiceId,
    )}/electronic-document/submit-presigned`,
    {
      method: 'POST',
      token,
      body: JSON.stringify(body),
    },
  );
}

export async function checkInvoiceElectronicAuthorization(
  token: string,
  tenantSlug: string,
  invoiceId: string,
): Promise<InvoiceDetailResponse> {
  return request<InvoiceDetailResponse>(
    `/invoicing/tenants/${encodeURIComponent(
      tenantSlug,
    )}/invoices/${encodeURIComponent(
      invoiceId,
    )}/electronic-document/check-authorization`,
    {
      method: 'POST',
      token,
    },
  );
}

export async function createInvoicePayment(
  token: string,
  tenantSlug: string,
  invoiceId: string,
  body: {
    amountInCents: number;
    method: string;
    reference?: string | null;
    paidAt?: string | null;
    notes?: string | null;
  },
): Promise<PaymentResponse> {
  return request<PaymentResponse>(
    `/invoicing/tenants/${encodeURIComponent(
      tenantSlug,
    )}/invoices/${encodeURIComponent(invoiceId)}/payments`,
    {
      method: 'POST',
      token,
      body: JSON.stringify(body),
    },
  );
}

export async function reverseInvoicePayment(
  token: string,
  tenantSlug: string,
  invoiceId: string,
  paymentId: string,
  body: {
    reason?: string | null;
  },
): Promise<PaymentResponse> {
  return request<PaymentResponse>(
    `/invoicing/tenants/${encodeURIComponent(
      tenantSlug,
    )}/invoices/${encodeURIComponent(invoiceId)}/payments/${encodeURIComponent(
      paymentId,
    )}/reverse`,
    {
      method: 'POST',
      token,
      body: JSON.stringify(body),
    },
  );
}

export async function fetchGrowthConversationWorkbench(
  token: string,
  tenantSlug: string,
  query?: {
    assigneeUserId?: string | null;
    channel?: 'manual' | 'whatsapp' | null;
    firstResponseSlaHours?: number | null;
    followUpSlaHours?: number | null;
    staleThreadHours?: number | null;
  },
): Promise<GrowthConversationWorkbenchResponse> {
  const search = new URLSearchParams();

  if (query?.assigneeUserId?.trim()) {
    search.set('assigneeUserId', query.assigneeUserId.trim());
  }

  if (query?.channel) {
    search.set('channel', query.channel);
  }

  if (query?.firstResponseSlaHours) {
    search.set('firstResponseSlaHours', String(query.firstResponseSlaHours));
  }

  if (query?.followUpSlaHours) {
    search.set('followUpSlaHours', String(query.followUpSlaHours));
  }

  if (query?.staleThreadHours) {
    search.set('staleThreadHours', String(query.staleThreadHours));
  }

  const queryString = search.toString();

  return request<GrowthConversationWorkbenchResponse>(
    `/growth/tenants/${encodeURIComponent(
      tenantSlug,
    )}/conversations/workbench${queryString ? `?${queryString}` : ''}`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function fetchWhatsappOutboundReportingSummary(
  token: string,
  tenantSlug: string,
): Promise<WhatsappOutboundReportingSummaryResponse> {
  return request<WhatsappOutboundReportingSummaryResponse>(
    `/growth/tenants/${encodeURIComponent(
      tenantSlug,
    )}/conversations/whatsapp-reporting/outbound-summary`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function runWhatsappOperationalMonitor(
  token: string,
  tenantSlug: string,
  body?: {
    occurredAt?: string | null;
    autoRunReadyRetries?: boolean | null;
    retryReadyLimit?: number | null;
  },
): Promise<WhatsappOperationalMonitorSummaryResponse> {
  return request<WhatsappOperationalMonitorSummaryResponse>(
    `/growth/tenants/${encodeURIComponent(
      tenantSlug,
    )}/conversations/whatsapp-reporting/monitor`,
    {
      method: 'POST',
      token,
      body: JSON.stringify(body ?? {}),
    },
  );
}

export async function fetchWhatsappOperationalMonitorRuns(
  token: string,
  tenantSlug: string,
  limit = 20,
): Promise<WhatsappOperationalMonitorRunResponse[]> {
  const search = new URLSearchParams();
  search.set('limit', String(limit));

  return request<WhatsappOperationalMonitorRunResponse[]>(
    `/growth/tenants/${encodeURIComponent(
      tenantSlug,
    )}/conversations/whatsapp-reporting/monitor-runs?${search.toString()}`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function fetchWhatsappOperationalMonitorAnalytics(
  token: string,
  tenantSlug: string,
  limit = 50,
): Promise<WhatsappOperationalMonitorAnalyticsResponse> {
  const search = new URLSearchParams();
  search.set('limit', String(limit));

  return request<WhatsappOperationalMonitorAnalyticsResponse>(
    `/growth/tenants/${encodeURIComponent(
      tenantSlug,
    )}/conversations/whatsapp-reporting/monitor-analytics?${search.toString()}`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function fetchWhatsappOperationalAlertAcknowledgements(
  token: string,
  tenantSlug: string,
): Promise<WhatsappOperationalAlertAcknowledgementResponse[]> {
  return request<WhatsappOperationalAlertAcknowledgementResponse[]>(
    `/growth/tenants/${encodeURIComponent(
      tenantSlug,
    )}/conversations/whatsapp-reporting/alert-acknowledgements`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function fetchGrowthOperationalCases(
  token: string,
  tenantSlug: string,
  status?: 'open' | 'in_progress' | 'resolved',
): Promise<GrowthOperationalCaseResponse[]> {
  const query = status ? `?status=${encodeURIComponent(status)}` : '';

  return request<GrowthOperationalCaseResponse[]>(
    `/growth/tenants/${encodeURIComponent(
      tenantSlug,
    )}/conversations/operational-cases${query}`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function createGrowthOperationalCase(
  token: string,
  tenantSlug: string,
  input: {
    sourceKey: string;
    caseType: 'alert_escalation' | 'ownership_routing' | 'follow_up';
    priority: 'warning' | 'critical';
    title: string;
    summary: string;
    nextAction: string;
    followUpState?: 'pending_team' | 'scheduled' | 'waiting_customer' | null;
    threadId?: string | null;
    alertKey?: string | null;
    dueAt?: string | null;
  },
): Promise<GrowthOperationalCaseResponse> {
  return request<GrowthOperationalCaseResponse>(
    `/growth/tenants/${encodeURIComponent(
      tenantSlug,
    )}/conversations/operational-cases`,
    {
      method: 'POST',
      token,
      body: JSON.stringify(input),
    },
  );
}

export async function takeGrowthOperationalCase(
  token: string,
  tenantSlug: string,
  caseId: string,
): Promise<GrowthOperationalCaseResponse> {
  return request<GrowthOperationalCaseResponse>(
    `/growth/tenants/${encodeURIComponent(
      tenantSlug,
    )}/conversations/operational-cases/${encodeURIComponent(caseId)}/take`,
    {
      method: 'POST',
      token,
    },
  );
}

export async function resolveGrowthOperationalCase(
  token: string,
  tenantSlug: string,
  caseId: string,
): Promise<GrowthOperationalCaseResponse> {
  return request<GrowthOperationalCaseResponse>(
    `/growth/tenants/${encodeURIComponent(
      tenantSlug,
    )}/conversations/operational-cases/${encodeURIComponent(caseId)}/resolve`,
    {
      method: 'POST',
      token,
    },
  );
}

export async function reopenGrowthOperationalCase(
  token: string,
  tenantSlug: string,
  caseId: string,
): Promise<GrowthOperationalCaseResponse> {
  return request<GrowthOperationalCaseResponse>(
    `/growth/tenants/${encodeURIComponent(
      tenantSlug,
    )}/conversations/operational-cases/${encodeURIComponent(caseId)}/reopen`,
    {
      method: 'POST',
      token,
    },
  );
}

export async function updateGrowthOperationalCaseFollowUpState(
  token: string,
  tenantSlug: string,
  caseId: string,
  input: {
    followUpState: 'pending_team' | 'scheduled' | 'waiting_customer';
    nextAction?: string | null;
    dueAt?: string | null;
  },
): Promise<GrowthOperationalCaseResponse> {
  return request<GrowthOperationalCaseResponse>(
    `/growth/tenants/${encodeURIComponent(
      tenantSlug,
    )}/conversations/operational-cases/${encodeURIComponent(
      caseId,
    )}/follow-up-state`,
    {
      method: 'POST',
      token,
      body: JSON.stringify(input),
    },
  );
}

export async function acknowledgeWhatsappOperationalAlert(
  token: string,
  tenantSlug: string,
  alertKey: string,
  body: {
    title: string;
    severity: 'warning' | 'critical';
    summary: string;
    provider?: string | null;
    failureClass?: string | null;
    providerTaxonomyFamily?: string | null;
    providerTaxonomyDetail?: string | null;
    affectedMessageCount?: number | null;
    recommendedAction: string;
    lastSeenGeneratedAt?: string | null;
  },
): Promise<WhatsappOperationalAlertAcknowledgementResponse> {
  return request<WhatsappOperationalAlertAcknowledgementResponse>(
    `/growth/tenants/${encodeURIComponent(
      tenantSlug,
    )}/conversations/whatsapp-reporting/alert-acknowledgements/${encodeURIComponent(
      alertKey,
    )}`,
    {
      method: 'PUT',
      token,
      body: JSON.stringify(body),
    },
  );
}

export async function deleteWhatsappOperationalAlertAcknowledgement(
  token: string,
  tenantSlug: string,
  alertKey: string,
): Promise<void> {
  await request<void>(
    `/growth/tenants/${encodeURIComponent(
      tenantSlug,
    )}/conversations/whatsapp-reporting/alert-acknowledgements/${encodeURIComponent(
      alertKey,
    )}`,
    {
      method: 'DELETE',
      token,
    },
  );
}

export async function createInvoiceItem(
  token: string,
  tenantSlug: string,
  invoiceId: string,
  body: {
    description: string;
    quantity: number;
    unitPriceInCents: number;
    taxRateId?: string | null;
  },
): Promise<InvoiceItemResponse> {
  return request<InvoiceItemResponse>(
    `/invoicing/tenants/${encodeURIComponent(
      tenantSlug,
    )}/invoices/${encodeURIComponent(invoiceId)}/items`,
    {
      method: 'POST',
      token,
      body: JSON.stringify(body),
    },
  );
}
