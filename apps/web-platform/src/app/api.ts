import {
  AuthenticatedInvitationResponse,
  AuthenticatedSessionResponse,
  CustomerResponse,
  InvoiceDetailResponse,
  InvoiceDocumentResponse,
  InvoicingReportSummaryResponse,
  InvitationResponse,
  InvoiceItemResponse,
  InvoiceSummaryResponse,
  PaymentResponse,
  PlatformPlan,
  PlatformProduct,
  TaxRateResponse,
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

export async function createCustomer(
  token: string,
  tenantSlug: string,
  body: {
    name: string;
    email?: string | null;
    taxId?: string | null;
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
    number: string;
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
