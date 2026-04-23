import {
  AuthenticatedInvitationResponse,
  AuthenticatedSessionResponse,
  InvitationResponse,
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
