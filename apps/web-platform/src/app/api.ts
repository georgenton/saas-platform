import {
  AiActivityFeedResponse,
  AiActionCenterResponse,
  AiApprovalCapacityWorkspaceResponse,
  AiApprovalDesignWorkspaceResponse,
  AiApprovalSlaWorkspaceResponse,
  AiApprovalStaffingWorkspaceResponse,
  AiApprovalStaffingPlanWorkspaceResponse,
  AiApprovalRolloutWorkspaceResponse,
  AiApprovalReadinessWorkspaceResponse,
  AiApprovalLaunchWorkspaceResponse,
  AiGuardedExecutionAuditWorkspaceResponse,
  AiGuardedExecutionLaunchWorkspaceResponse,
  AiGuardedExecutionMonitorWorkspaceResponse,
  AiGuardedExecutionControlWorkspaceResponse,
  AiGuardedExecutionExecutionResponse,
  AiGuardedExecutionRollbackExecutionResponse,
  AiGuardedExecutionEventLogWorkspaceResponse,
  AiGuardedExecutionRollbackWorkspaceResponse,
  AiGuardedExecutionRunbookWorkspaceResponse,
  AiGuardedExecutionWorkspaceResponse,
  AiGuardedExecutionPilotWorkspaceResponse,
  AiEvaluationWorkspaceResponse,
  AiGovernanceWorkspaceResponse,
  AiHealthWorkspaceResponse,
  AiPolicySimulationWorkspaceResponse,
  AiApprovalWorkspaceResponse,
  AiEcommerceLaunchWorkspaceResponse,
  AiMemoryWorkspaceResponse,
  AiMemoryRecordDetailResponse,
  AiMemoryRecordResponse,
  AiOperatingModelResponse,
  AiRetrievalWorkspaceResponse,
  AiOperationsSummaryResponse,
  EcommerceLaunchPlanDetailResponse,
  EcommerceLaunchPlanRegistryResponse,
  EcommerceProductAuthoringDraftDetailResponse,
  EcommerceProductEntityChannelDraftDetailResponse,
  EcommerceProductEntityChannelAssetWorkspaceDetailResponse,
  EcommerceProductEntityChannelAssetWorkspaceRegistryResponse,
  EcommerceProductEntityChannelAssetEntityDetailResponse,
  EcommerceProductEntityChannelAssetEntityRegistryResponse,
  EcommerceLandingAssetEntityWorkspaceResponse,
  EcommerceCatalogAssetEntityWorkspaceResponse,
  EcommerceCatalogCommercialCardResponse,
  EcommerceCatalogListingAssetResponse,
  EcommerceCatalogMerchandisingPacketResponse,
  EcommerceCheckoutCloseoutPacketResponse,
  EcommerceCheckoutCustomerCapturePacketResponse,
  EcommerceCheckoutOrderIntakeWorkspaceResponse,
  EcommerceCatalogStorefrontPlacementPacketResponse,
  EcommerceChannelReleaseApprovalPacketResponse,
  EcommerceChannelReleaseLaunchPacketResponse,
  EcommerceWhatsappChannelSequenceWorkspaceResponse,
  EcommerceChannelReleaseWorkbenchResponse,
  EcommerceChannelReleaseExecutionReadinessResponse,
  EcommerceChannelReleaseHandoffPacketResponse,
  EcommerceStorefrontPublishReviewWorkspaceResponse,
  EcommerceStorefrontPreviewWorkspaceResponse,
  EcommerceLandingPageStructureResponse,
  EcommerceLandingPublishArtifactResponse,
  EcommerceLiveStorefrontSessionWorkspaceResponse,
  EcommerceOrderApprovalDecisionResponse,
  EcommerceOrderDraftDetailResponse,
  EcommerceOrderFiscalDataCompletionWorkspaceResponse,
  EcommerceOrderGrowthFollowUpWorkspaceResponse,
  EcommerceOrderHandoffDecisionResponse,
  EcommerceOrderHandoffExecutionWorkspaceResponse,
  EcommerceOrderHoldResolutionWorkspaceResponse,
  EcommerceOrderRouteResolutionPacketResponse,
  EcommerceOrderInvoiceDraftBridgeResponse,
  EcommerceInvoiceDraftHandoffWorkspaceResponse,
  EcommerceInvoiceHandoffAcknowledgementResponse,
  EcommerceInvoiceDraftIntakeWorkspaceResponse,
  EcommerceInvoiceDraftOpenBridgeResponse,
  EcommerceInvoiceDraftLaunchBridgeResponse,
  EcommerceOrderPaymentReadinessWorkspaceResponse,
  EcommerceOrderPostSaleLifecycleDetailResponse,
  EcommerceOrderPostSaleLifecycleRegistryResponse,
  EcommerceOrderDraftRegistryResponse,
  EcommerceOrderOpsAttentionWorkspaceResponse,
  EcommerceOrderOpsEscalationBoardResponse,
  EcommerceOrderOperatorWorkboardResponse,
  EcommerceOrderOpsPriorityQueueResponse,
  EcommerceOrderReviewWorkspaceResponse,
  EcommerceOrderStatusLifecycleDetailResponse,
  EcommerceOrderStatusLifecycleRegistryResponse,
  EcommerceOrderDraftSaveResponse,
  EcommerceOrderInvoicingBridgeResponse,
  EcommerceOrderToGrowthConversationBridgeResponse,
  EcommerceOrderToInvoiceReadinessPacketResponse,
  EcommerceStorefrontReleaseControlWorkspaceResponse,
  EcommerceStorefrontGoLiveManifestResponse,
  EcommerceStorefrontReleaseCandidateBriefResponse,
  EcommerceWhatsappGrowthActivationPacketResponse,
  EcommerceWhatsappGrowthExecutionBridgeResponse,
  EcommerceWhatsappGrowthLaunchAcknowledgementPacketResponse,
  EcommerceWhatsappGrowthOperatorLaunchPacketResponse,
  EcommerceWhatsappGrowthActivationWorkspaceResponse,
  EcommerceWhatsappGrowthHandoffResponse,
  EcommerceWhatsappSalesFlowResponse,
  EcommerceProductEntityChannelReleaseCandidateDetailResponse,
  EcommerceProductEntityChannelReleaseCandidateRegistryResponse,
  PromoteEcommerceSavedProductEntityChannelDraftToChannelAssetWorkspaceResponse,
  PromoteEcommerceProductEntityChannelAssetEntityToReleaseCandidateResponse,
  PromoteEcommerceProductEntityChannelAssetWorkspaceToChannelAssetEntityResponse,
  RequestEcommerceProductEntityChannelAssetEntityPublishPreparationPacketResponse,
  RequestEcommerceProductEntityChannelAssetPublishPacketResponse,
  EcommerceProductEntityChannelDraftPublishPreparationWorkspaceResponse,
  EcommerceProductEntityDetailResponse,
  EcommerceSavedProductEntityChannelDraftDetailResponse,
  EcommerceSavedProductEntityChannelDraftRegistryResponse,
  EcommerceProductEntityChannelAssetDraftsWorkspaceResponse,
  EcommerceProductEntityChannelAssetsWorkspaceResponse,
  EcommerceProductEntityRegistryResponse,
  EcommerceProductSetupDetailResponse,
  EcommerceProductSetupRegistryResponse,
  PromoteEcommerceProductSetupToProductEntityResponse,
  RequestEcommerceProductEntityChannelDraftActionPacketResponse,
  RequestEcommerceProductEntityChannelDraftPublishReadinessPacketResponse,
  RequestEcommerceProductEntityCommercializationPacketResponse,
  SaveEcommerceProductEntityChannelDraftResponse,
  UpdateEcommerceProductEntityChannelAssetEntityEditableSnapshotResponse,
  UpdateEcommerceSavedProductEntityChannelDraftEditableSnapshotResponse,
  PromoteEcommerceProductWorkspaceToProductSetupResponse,
  RequestEcommerceProductSetupDefinitionPacketResponse,
  UpdateEcommerceProductSetupEditableSnapshotResponse,
  EcommerceProductWorkspaceDetailResponse,
  EcommerceProductWorkspaceRegistryResponse,
  EcommerceProductAuthoringWorkspaceResponse,
  PromoteEcommerceSavedDraftToProductWorkspaceResponse,
  RequestEcommerceProductWorkspaceReadinessPacketResponse,
  RequestEcommerceProductAuthoringDraftBriefResponse,
  EcommerceSavedProductDraftRegistryResponse,
  SaveEcommerceProductAuthoringDraftResponse,
  UpdateEcommerceProductWorkspaceEditableSnapshotResponse,
  RequestEcommerceProductAuthoringDraftRefinementPacketResponse,
  EcommerceStoreProfileWorkspaceResponse,
  EcommerceStoreSetupWorkspaceResponse,
  EcommerceLaunchWorkspaceResponse,
  RequestEcommerceLaunchPlanActivationReadinessResponse,
  AiApprovalPolicyResponse,
  AiApprovalRequestResponse,
  AiApprovalRequestStatusFilter,
  AiAgentCatalogResponse,
  AiAgentToolAccessResponse,
  AiHandoffWorkspaceResponse,
  AiPromptRegistryResponse,
  AiSuggestionEnvelopeResponse,
  AiSuggestionRunDetailResponse,
  AiSuggestionRunResponse,
  AiToolRegistryResponse,
  AuthenticatedInvitationResponse,
  AuthenticatedSessionResponse,
  CreditNoteResponse,
  DebitNoteResponse,
  GrowthAssistDailyAgendaResponse,
  GrowthConversationWorkbenchResponse,
  RemissionGuideResponse,
  WithholdingResponse,
  CustomerResponse,
  GrowthOperationalCaseAutoAssignmentResponse,
  GrowthOperationalCaseAutoAssignmentSettingsResponse,
  GrowthOperationalCaseResponse,
  GrowthOperationalCaseRoutingReviewResponse,
  ElectronicSandboxReadinessResponse,
  ElectronicSignatureMaterialInspectionResponse,
  ElectronicSubmissionSettingsResponse,
  ElectronicSignatureSettingsResponse,
  InvoiceElectronicArtifactsResponse,
  InvoiceDocumentDraftingAssistResponse,
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

export async function fetchInvoiceDocumentDraftingAssist(
  token: string,
  tenantSlug: string,
): Promise<InvoiceDocumentDraftingAssistResponse> {
  return request<InvoiceDocumentDraftingAssistResponse>(
    `/invoicing/tenants/${encodeURIComponent(
      tenantSlug,
    )}/assist/document-drafting`,
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

export async function fetchGrowthAssistDailyAgenda(
  token: string,
  tenantSlug: string,
): Promise<GrowthAssistDailyAgendaResponse> {
  return request<GrowthAssistDailyAgendaResponse>(
    `/growth/tenants/${encodeURIComponent(
      tenantSlug,
    )}/conversations/assist/daily-agenda`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function fetchAiAgentCatalog(
  token: string,
): Promise<AiAgentCatalogResponse[]> {
  return request<AiAgentCatalogResponse[]>('/ai/agents', {
    method: 'GET',
    token,
  });
}

export async function fetchAiApprovalPolicies(
  token: string,
): Promise<AiApprovalPolicyResponse[]> {
  return request<AiApprovalPolicyResponse[]>('/ai/approval-policies', {
    method: 'GET',
    token,
  });
}

export async function fetchAiPromptRegistry(
  token: string,
): Promise<AiPromptRegistryResponse[]> {
  return request<AiPromptRegistryResponse[]>('/ai/prompts', {
    method: 'GET',
    token,
  });
}

export async function fetchAiToolRegistry(
  token: string,
): Promise<AiToolRegistryResponse[]> {
  return request<AiToolRegistryResponse[]>('/ai/tools', {
    method: 'GET',
    token,
  });
}

export async function fetchAiOperatingModel(
  token: string,
): Promise<AiOperatingModelResponse> {
  return request<AiOperatingModelResponse>('/ai/model', {
    method: 'GET',
    token,
  });
}

export async function fetchAiAgentApprovalPolicies(
  token: string,
  agentKey: string,
): Promise<AiApprovalPolicyResponse[]> {
  return request<AiApprovalPolicyResponse[]>(
    `/ai/agents/${encodeURIComponent(agentKey)}/approval-policies`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function fetchAiAgentToolAccess(
  token: string,
  agentKey: string,
): Promise<AiAgentToolAccessResponse[]> {
  return request<AiAgentToolAccessResponse[]>(
    `/ai/agents/${encodeURIComponent(agentKey)}/tool-access`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function fetchTenantAiSuggestionEnvelope(
  token: string,
  tenantSlug: string,
  agentKey: string,
): Promise<AiSuggestionEnvelopeResponse> {
  return request<AiSuggestionEnvelopeResponse>(
    `/ai/tenants/${encodeURIComponent(
      tenantSlug,
    )}/agents/${encodeURIComponent(agentKey)}/suggestion-envelope`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function fetchTenantAiSuggestionRuns(
  token: string,
  tenantSlug: string,
  agentKey: string,
  limit = 10,
): Promise<AiSuggestionRunResponse[]> {
  return request<AiSuggestionRunResponse[]>(
    `/ai/tenants/${encodeURIComponent(
      tenantSlug,
    )}/agents/${encodeURIComponent(agentKey)}/suggestion-runs?limit=${encodeURIComponent(
      String(limit),
    )}`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function fetchTenantAiActionCenter(
  token: string,
  tenantSlug: string,
): Promise<AiActionCenterResponse> {
  return request<AiActionCenterResponse>(
    `/ai/tenants/${encodeURIComponent(tenantSlug)}/action-center`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function fetchTenantAiOperationsSummary(
  token: string,
  tenantSlug: string,
): Promise<AiOperationsSummaryResponse> {
  return request<AiOperationsSummaryResponse>(
    `/ai/tenants/${encodeURIComponent(tenantSlug)}/operations-summary`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function fetchTenantAiActivityFeed(
  token: string,
  tenantSlug: string,
  options?: {
    limit?: number;
    type?: 'all' | 'suggestion_run_prepared' | 'approval_requested' | 'approval_reviewed';
  },
): Promise<AiActivityFeedResponse> {
  const searchParams = new URLSearchParams();
  searchParams.set('limit', String(options?.limit ?? 20));

  if (options?.type && options.type !== 'all') {
    searchParams.set('type', options.type);
  }

  return request<AiActivityFeedResponse>(
    `/ai/tenants/${encodeURIComponent(
      tenantSlug,
    )}/activity-feed?${searchParams.toString()}`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function fetchTenantAiMemoryWorkspace(
  token: string,
  tenantSlug: string,
): Promise<AiMemoryWorkspaceResponse> {
  return request<AiMemoryWorkspaceResponse>(
    `/ai/tenants/${encodeURIComponent(tenantSlug)}/memory-workspace`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function fetchTenantAiMemoryRecords(
  token: string,
  tenantSlug: string,
  limit = 20,
  status: 'active' | 'inactive' | 'all' = 'all',
): Promise<AiMemoryRecordResponse[]> {
  return request<AiMemoryRecordResponse[]>(
    `/ai/tenants/${encodeURIComponent(
      tenantSlug,
    )}/memory-records?limit=${encodeURIComponent(String(limit))}&status=${encodeURIComponent(status)}`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function fetchTenantAiMemoryRecordDetail(
  token: string,
  tenantSlug: string,
  recordId: string,
): Promise<AiMemoryRecordDetailResponse> {
  return request<AiMemoryRecordDetailResponse>(
    `/ai/tenants/${encodeURIComponent(tenantSlug)}/memory-records/${encodeURIComponent(
      recordId,
    )}`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function createTenantAiMemoryRecord(
  token: string,
  tenantSlug: string,
  payload: {
    scope: 'tenant' | 'domain' | 'agent';
    domainKey?: 'growth' | 'invoicing' | 'ecommerce' | null;
    agentKey?: string | null;
    sourceKind?:
      | 'operator_note'
      | 'approval_memory'
      | 'guarded_execution_memory'
      | null;
    freshness?: 'working_memory' | 'durable_memory' | null;
    title: string;
    summary: string;
    detail: string;
    tags?: string[] | null;
  },
): Promise<AiMemoryRecordResponse> {
  return request<AiMemoryRecordResponse>(
    `/ai/tenants/${encodeURIComponent(tenantSlug)}/memory-records`,
    {
      method: 'POST',
      token,
      body: JSON.stringify(payload),
    },
  );
}

export async function updateTenantAiMemoryRecord(
  token: string,
  tenantSlug: string,
  recordId: string,
  payload: {
    sourceKind?:
      | 'operator_note'
      | 'approval_memory'
      | 'guarded_execution_memory'
      | null;
    freshness?: 'working_memory' | 'durable_memory' | null;
    title?: string | null;
    summary?: string | null;
    detail?: string | null;
    tags?: string[] | null;
    status?: 'active' | 'inactive' | null;
  },
): Promise<AiMemoryRecordResponse> {
  return request<AiMemoryRecordResponse>(
    `/ai/tenants/${encodeURIComponent(tenantSlug)}/memory-records/${encodeURIComponent(
      recordId,
    )}`,
    {
      method: 'PATCH',
      token,
      body: JSON.stringify(payload),
    },
  );
}

export async function fetchTenantAiRetrievalWorkspace(
  token: string,
  tenantSlug: string,
): Promise<AiRetrievalWorkspaceResponse> {
  return request<AiRetrievalWorkspaceResponse>(
    `/ai/tenants/${encodeURIComponent(tenantSlug)}/retrieval-workspace`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function fetchTenantAiEcommerceLaunchWorkspace(
  token: string,
  tenantSlug: string,
): Promise<AiEcommerceLaunchWorkspaceResponse> {
  return request<AiEcommerceLaunchWorkspaceResponse>(
    `/ai/tenants/${encodeURIComponent(tenantSlug)}/ecommerce-launch-workspace`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function fetchTenantEcommerceLaunchWorkspace(
  token: string,
  tenantSlug: string,
): Promise<EcommerceLaunchWorkspaceResponse> {
  return request<EcommerceLaunchWorkspaceResponse>(
    `/ecommerce/tenants/${encodeURIComponent(tenantSlug)}/launch-workspace`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function fetchTenantEcommerceStoreSetupWorkspace(
  token: string,
  tenantSlug: string,
): Promise<EcommerceStoreSetupWorkspaceResponse> {
  return request<EcommerceStoreSetupWorkspaceResponse>(
    `/ecommerce/tenants/${encodeURIComponent(tenantSlug)}/store-setup-workspace`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function fetchTenantEcommerceStoreProfileWorkspace(
  token: string,
  tenantSlug: string,
): Promise<EcommerceStoreProfileWorkspaceResponse> {
  return request<EcommerceStoreProfileWorkspaceResponse>(
    `/ecommerce/tenants/${encodeURIComponent(tenantSlug)}/store-profile-workspace`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function fetchTenantEcommerceProductAuthoringWorkspace(
  token: string,
  tenantSlug: string,
): Promise<EcommerceProductAuthoringWorkspaceResponse> {
  return request<EcommerceProductAuthoringWorkspaceResponse>(
    `/ecommerce/tenants/${encodeURIComponent(tenantSlug)}/product-authoring-workspace`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function fetchTenantEcommerceSavedProductDrafts(
  token: string,
  tenantSlug: string,
): Promise<EcommerceSavedProductDraftRegistryResponse> {
  return request<EcommerceSavedProductDraftRegistryResponse>(
    `/ecommerce/tenants/${encodeURIComponent(tenantSlug)}/saved-product-drafts`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function fetchTenantEcommerceProductWorkspaces(
  token: string,
  tenantSlug: string,
): Promise<EcommerceProductWorkspaceRegistryResponse> {
  return request<EcommerceProductWorkspaceRegistryResponse>(
    `/ecommerce/tenants/${encodeURIComponent(tenantSlug)}/product-workspaces`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function fetchTenantEcommerceProductWorkspaceDetail(
  token: string,
  tenantSlug: string,
  savedDraftId: string,
): Promise<EcommerceProductWorkspaceDetailResponse> {
  return request<EcommerceProductWorkspaceDetailResponse>(
    `/ecommerce/tenants/${encodeURIComponent(
      tenantSlug,
    )}/product-workspaces/${encodeURIComponent(savedDraftId)}`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function fetchTenantEcommerceProductSetups(
  token: string,
  tenantSlug: string,
): Promise<EcommerceProductSetupRegistryResponse> {
  return request<EcommerceProductSetupRegistryResponse>(
    `/ecommerce/tenants/${encodeURIComponent(tenantSlug)}/product-setups`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function fetchTenantEcommerceProductSetupDetail(
  token: string,
  tenantSlug: string,
  productSetupId: string,
): Promise<EcommerceProductSetupDetailResponse> {
  return request<EcommerceProductSetupDetailResponse>(
    `/ecommerce/tenants/${encodeURIComponent(
      tenantSlug,
    )}/product-setups/${encodeURIComponent(productSetupId)}`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function fetchTenantEcommerceProductEntities(
  token: string,
  tenantSlug: string,
): Promise<EcommerceProductEntityRegistryResponse> {
  return request<EcommerceProductEntityRegistryResponse>(
    `/ecommerce/tenants/${encodeURIComponent(tenantSlug)}/product-entities`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function fetchTenantEcommerceProductEntityDetail(
  token: string,
  tenantSlug: string,
  productEntityId: string,
): Promise<EcommerceProductEntityDetailResponse> {
  return request<EcommerceProductEntityDetailResponse>(
    `/ecommerce/tenants/${encodeURIComponent(
      tenantSlug,
    )}/product-entities/${encodeURIComponent(productEntityId)}`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function fetchTenantEcommerceProductEntityChannelAssetsWorkspace(
  token: string,
  tenantSlug: string,
  productEntityId: string,
): Promise<EcommerceProductEntityChannelAssetsWorkspaceResponse> {
  return request<EcommerceProductEntityChannelAssetsWorkspaceResponse>(
    `/ecommerce/tenants/${encodeURIComponent(
      tenantSlug,
    )}/product-entities/${encodeURIComponent(
      productEntityId,
    )}/channel-assets-workspace`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function fetchTenantEcommerceProductEntityChannelAssetDraftsWorkspace(
  token: string,
  tenantSlug: string,
  productEntityId: string,
): Promise<EcommerceProductEntityChannelAssetDraftsWorkspaceResponse> {
  return request<EcommerceProductEntityChannelAssetDraftsWorkspaceResponse>(
    `/ecommerce/tenants/${encodeURIComponent(
      tenantSlug,
    )}/product-entities/${encodeURIComponent(
      productEntityId,
    )}/channel-asset-drafts-workspace`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function fetchTenantEcommerceProductEntityChannelDraftDetail(
  token: string,
  tenantSlug: string,
  productEntityId: string,
  channelKey: 'landing' | 'catalog' | 'whatsapp',
): Promise<EcommerceProductEntityChannelDraftDetailResponse> {
  return request<EcommerceProductEntityChannelDraftDetailResponse>(
    `/ecommerce/tenants/${encodeURIComponent(
      tenantSlug,
    )}/product-entities/${encodeURIComponent(
      productEntityId,
    )}/channel-drafts/${encodeURIComponent(channelKey)}`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function fetchTenantEcommerceProductAuthoringDraftDetail(
  token: string,
  tenantSlug: string,
  draftId: string,
): Promise<EcommerceProductAuthoringDraftDetailResponse> {
  return request<EcommerceProductAuthoringDraftDetailResponse>(
    `/ecommerce/tenants/${encodeURIComponent(
      tenantSlug,
    )}/product-authoring-drafts/${encodeURIComponent(draftId)}`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function requestTenantEcommerceProductAuthoringDraftBrief(
  token: string,
  tenantSlug: string,
  draftId: string,
): Promise<RequestEcommerceProductAuthoringDraftBriefResponse> {
  return request<RequestEcommerceProductAuthoringDraftBriefResponse>(
    `/ecommerce/tenants/${encodeURIComponent(
      tenantSlug,
    )}/product-authoring-drafts/${encodeURIComponent(draftId)}/request-ai-brief`,
    {
      method: 'POST',
      token,
    },
  );
}

export async function requestTenantEcommerceProductAuthoringDraftRefinementPacket(
  token: string,
  tenantSlug: string,
  draftId: string,
): Promise<RequestEcommerceProductAuthoringDraftRefinementPacketResponse> {
  return request<RequestEcommerceProductAuthoringDraftRefinementPacketResponse>(
    `/ecommerce/tenants/${encodeURIComponent(
      tenantSlug,
    )}/product-authoring-drafts/${encodeURIComponent(
      draftId,
    )}/request-refinement-packet`,
    {
      method: 'POST',
      token,
    },
  );
}

export async function saveTenantEcommerceProductAuthoringDraft(
  token: string,
  tenantSlug: string,
  draftId: string,
): Promise<SaveEcommerceProductAuthoringDraftResponse> {
  return request<SaveEcommerceProductAuthoringDraftResponse>(
    `/ecommerce/tenants/${encodeURIComponent(
      tenantSlug,
    )}/product-authoring-drafts/${encodeURIComponent(draftId)}/save`,
    {
      method: 'POST',
      token,
    },
  );
}

export async function promoteTenantEcommerceSavedDraftToProductWorkspace(
  token: string,
  tenantSlug: string,
  savedDraftId: string,
): Promise<PromoteEcommerceSavedDraftToProductWorkspaceResponse> {
  return request<PromoteEcommerceSavedDraftToProductWorkspaceResponse>(
    `/ecommerce/tenants/${encodeURIComponent(
      tenantSlug,
    )}/saved-product-drafts/${encodeURIComponent(
      savedDraftId,
    )}/promote-to-product-workspace`,
    {
      method: 'POST',
      token,
    },
  );
}

export async function updateTenantEcommerceProductWorkspaceEditableSnapshot(
  token: string,
  tenantSlug: string,
  savedDraftId: string,
  body: {
    title: string;
    pricingBand: string | null;
    offerAngle: string | null;
    primaryCta: string | null;
    channelSequence: string[];
  },
): Promise<UpdateEcommerceProductWorkspaceEditableSnapshotResponse> {
  return request<UpdateEcommerceProductWorkspaceEditableSnapshotResponse>(
    `/ecommerce/tenants/${encodeURIComponent(
      tenantSlug,
    )}/product-workspaces/${encodeURIComponent(
      savedDraftId,
    )}/update-editable-snapshot`,
    {
      method: 'POST',
      token,
      body: JSON.stringify(body),
    },
  );
}

export async function promoteTenantEcommerceProductWorkspaceToProductSetup(
  token: string,
  tenantSlug: string,
  savedDraftId: string,
): Promise<PromoteEcommerceProductWorkspaceToProductSetupResponse> {
  return request<PromoteEcommerceProductWorkspaceToProductSetupResponse>(
    `/ecommerce/tenants/${encodeURIComponent(
      tenantSlug,
    )}/product-workspaces/${encodeURIComponent(
      savedDraftId,
    )}/promote-to-product-setup`,
    {
      method: 'POST',
      token,
    },
  );
}

export async function requestTenantEcommerceProductWorkspaceReadinessPacket(
  token: string,
  tenantSlug: string,
  savedDraftId: string,
): Promise<RequestEcommerceProductWorkspaceReadinessPacketResponse> {
  return request<RequestEcommerceProductWorkspaceReadinessPacketResponse>(
    `/ecommerce/tenants/${encodeURIComponent(
      tenantSlug,
    )}/product-workspaces/${encodeURIComponent(
      savedDraftId,
    )}/request-readiness-packet`,
    {
      method: 'POST',
      token,
    },
  );
}

export async function requestTenantEcommerceProductSetupDefinitionPacket(
  token: string,
  tenantSlug: string,
  productSetupId: string,
): Promise<RequestEcommerceProductSetupDefinitionPacketResponse> {
  return request<RequestEcommerceProductSetupDefinitionPacketResponse>(
    `/ecommerce/tenants/${encodeURIComponent(
      tenantSlug,
    )}/product-setups/${encodeURIComponent(
      productSetupId,
    )}/request-definition-packet`,
    {
      method: 'POST',
      token,
    },
  );
}

export async function updateTenantEcommerceProductSetupEditableSnapshot(
  token: string,
  tenantSlug: string,
  productSetupId: string,
  body: {
    title: string;
    pricingBand: string | null;
    offerAngle: string | null;
    primaryCta: string | null;
    channelSequence: string[];
  },
): Promise<UpdateEcommerceProductSetupEditableSnapshotResponse> {
  return request<UpdateEcommerceProductSetupEditableSnapshotResponse>(
    `/ecommerce/tenants/${encodeURIComponent(
      tenantSlug,
    )}/product-setups/${encodeURIComponent(
      productSetupId,
    )}/update-editable-snapshot`,
    {
      method: 'POST',
      token,
      body: JSON.stringify(body),
    },
  );
}

export async function promoteTenantEcommerceProductSetupToProductEntity(
  token: string,
  tenantSlug: string,
  productSetupId: string,
): Promise<PromoteEcommerceProductSetupToProductEntityResponse> {
  return request<PromoteEcommerceProductSetupToProductEntityResponse>(
    `/ecommerce/tenants/${encodeURIComponent(
      tenantSlug,
    )}/product-setups/${encodeURIComponent(
      productSetupId,
    )}/promote-to-product-entity`,
    {
      method: 'POST',
      token,
    },
  );
}

export async function requestTenantEcommerceProductEntityCommercializationPacket(
  token: string,
  tenantSlug: string,
  productEntityId: string,
): Promise<RequestEcommerceProductEntityCommercializationPacketResponse> {
  return request<RequestEcommerceProductEntityCommercializationPacketResponse>(
    `/ecommerce/tenants/${encodeURIComponent(
      tenantSlug,
    )}/product-entities/${encodeURIComponent(
      productEntityId,
    )}/request-commercialization-packet`,
    {
      method: 'POST',
      token,
    },
  );
}

export async function requestTenantEcommerceProductEntityChannelDraftActionPacket(
  token: string,
  tenantSlug: string,
  productEntityId: string,
  channelKey: 'landing' | 'catalog' | 'whatsapp',
): Promise<RequestEcommerceProductEntityChannelDraftActionPacketResponse> {
  return request<RequestEcommerceProductEntityChannelDraftActionPacketResponse>(
    `/ecommerce/tenants/${encodeURIComponent(
      tenantSlug,
    )}/product-entities/${encodeURIComponent(
      productEntityId,
    )}/channel-drafts/${encodeURIComponent(
      channelKey,
    )}/request-action-packet`,
    {
      method: 'POST',
      token,
    },
  );
}

export async function requestTenantEcommerceProductEntityChannelDraftPublishReadinessPacket(
  token: string,
  tenantSlug: string,
  productEntityId: string,
  channelKey: 'landing' | 'catalog' | 'whatsapp',
): Promise<RequestEcommerceProductEntityChannelDraftPublishReadinessPacketResponse> {
  return request<RequestEcommerceProductEntityChannelDraftPublishReadinessPacketResponse>(
    `/ecommerce/tenants/${encodeURIComponent(
      tenantSlug,
    )}/product-entities/${encodeURIComponent(
      productEntityId,
    )}/channel-drafts/${encodeURIComponent(
      channelKey,
    )}/request-publish-readiness-packet`,
    {
      method: 'POST',
      token,
    },
  );
}

export async function fetchTenantEcommerceProductEntityChannelDraftPublishPreparationWorkspace(
  token: string,
  tenantSlug: string,
  productEntityId: string,
  channelKey: 'landing' | 'catalog' | 'whatsapp',
): Promise<EcommerceProductEntityChannelDraftPublishPreparationWorkspaceResponse> {
  return request<EcommerceProductEntityChannelDraftPublishPreparationWorkspaceResponse>(
    `/ecommerce/tenants/${encodeURIComponent(
      tenantSlug,
    )}/product-entities/${encodeURIComponent(
      productEntityId,
    )}/channel-drafts/${encodeURIComponent(
      channelKey,
    )}/publish-preparation-workspace`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function fetchTenantEcommerceSavedProductEntityChannelDrafts(
  token: string,
  tenantSlug: string,
  productEntityId: string,
): Promise<EcommerceSavedProductEntityChannelDraftRegistryResponse> {
  return request<EcommerceSavedProductEntityChannelDraftRegistryResponse>(
    `/ecommerce/tenants/${encodeURIComponent(
      tenantSlug,
    )}/product-entities/${encodeURIComponent(
      productEntityId,
    )}/saved-channel-drafts`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function saveTenantEcommerceProductEntityChannelDraft(
  token: string,
  tenantSlug: string,
  productEntityId: string,
  channelKey: 'landing' | 'catalog' | 'whatsapp',
): Promise<SaveEcommerceProductEntityChannelDraftResponse> {
  return request<SaveEcommerceProductEntityChannelDraftResponse>(
    `/ecommerce/tenants/${encodeURIComponent(
      tenantSlug,
    )}/product-entities/${encodeURIComponent(
      productEntityId,
    )}/channel-drafts/${encodeURIComponent(channelKey)}/save`,
    {
      method: 'POST',
      token,
    },
  );
}

export async function fetchTenantEcommerceSavedProductEntityChannelDraftDetail(
  token: string,
  tenantSlug: string,
  productEntityId: string,
  channelKey: 'landing' | 'catalog' | 'whatsapp',
): Promise<EcommerceSavedProductEntityChannelDraftDetailResponse> {
  return request<EcommerceSavedProductEntityChannelDraftDetailResponse>(
    `/ecommerce/tenants/${encodeURIComponent(
      tenantSlug,
    )}/product-entities/${encodeURIComponent(
      productEntityId,
    )}/saved-channel-drafts/${encodeURIComponent(channelKey)}`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function updateTenantEcommerceSavedProductEntityChannelDraftEditableSnapshot(
  token: string,
  tenantSlug: string,
  productEntityId: string,
  channelKey: 'landing' | 'catalog' | 'whatsapp',
  patch: {
    title: string;
    headline: string;
    draftBlueprint: string[];
    recommendedArtifacts: string[];
    nextMilestone: string;
  },
): Promise<UpdateEcommerceSavedProductEntityChannelDraftEditableSnapshotResponse> {
  return request<UpdateEcommerceSavedProductEntityChannelDraftEditableSnapshotResponse>(
    `/ecommerce/tenants/${encodeURIComponent(
      tenantSlug,
    )}/product-entities/${encodeURIComponent(
      productEntityId,
    )}/saved-channel-drafts/${encodeURIComponent(
      channelKey,
    )}/update-editable-snapshot`,
    {
      method: 'POST',
      token,
      body: JSON.stringify(patch),
    },
  );
}

export async function fetchTenantEcommerceProductEntityChannelAssetWorkspaces(
  token: string,
  tenantSlug: string,
  productEntityId: string,
): Promise<EcommerceProductEntityChannelAssetWorkspaceRegistryResponse> {
  return request<EcommerceProductEntityChannelAssetWorkspaceRegistryResponse>(
    `/ecommerce/tenants/${encodeURIComponent(
      tenantSlug,
    )}/product-entities/${encodeURIComponent(
      productEntityId,
    )}/channel-asset-workspaces`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function fetchTenantEcommerceProductEntityChannelAssetWorkspaceDetail(
  token: string,
  tenantSlug: string,
  productEntityId: string,
  channelKey: 'landing' | 'catalog' | 'whatsapp',
): Promise<EcommerceProductEntityChannelAssetWorkspaceDetailResponse> {
  return request<EcommerceProductEntityChannelAssetWorkspaceDetailResponse>(
    `/ecommerce/tenants/${encodeURIComponent(
      tenantSlug,
    )}/product-entities/${encodeURIComponent(
      productEntityId,
    )}/channel-asset-workspaces/${encodeURIComponent(channelKey)}`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function promoteTenantEcommerceSavedProductEntityChannelDraftToChannelAssetWorkspace(
  token: string,
  tenantSlug: string,
  productEntityId: string,
  channelKey: 'landing' | 'catalog' | 'whatsapp',
): Promise<PromoteEcommerceSavedProductEntityChannelDraftToChannelAssetWorkspaceResponse> {
  return request<PromoteEcommerceSavedProductEntityChannelDraftToChannelAssetWorkspaceResponse>(
    `/ecommerce/tenants/${encodeURIComponent(
      tenantSlug,
    )}/product-entities/${encodeURIComponent(
      productEntityId,
    )}/saved-channel-drafts/${encodeURIComponent(
      channelKey,
    )}/promote-to-channel-asset-workspace`,
    {
      method: 'POST',
      token,
    },
  );
}

export async function requestTenantEcommerceProductEntityChannelAssetPublishPacket(
  token: string,
  tenantSlug: string,
  productEntityId: string,
  channelKey: 'landing' | 'catalog' | 'whatsapp',
): Promise<RequestEcommerceProductEntityChannelAssetPublishPacketResponse> {
  return request<RequestEcommerceProductEntityChannelAssetPublishPacketResponse>(
    `/ecommerce/tenants/${encodeURIComponent(
      tenantSlug,
    )}/product-entities/${encodeURIComponent(
      productEntityId,
    )}/channel-asset-workspaces/${encodeURIComponent(
      channelKey,
    )}/request-publish-packet`,
    {
      method: 'POST',
      token,
    },
  );
}

export async function fetchTenantEcommerceProductEntityChannelAssetEntities(
  token: string,
  tenantSlug: string,
  productEntityId: string,
): Promise<EcommerceProductEntityChannelAssetEntityRegistryResponse> {
  return request<EcommerceProductEntityChannelAssetEntityRegistryResponse>(
    `/ecommerce/tenants/${encodeURIComponent(
      tenantSlug,
    )}/product-entities/${encodeURIComponent(
      productEntityId,
    )}/channel-asset-entities`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function fetchTenantEcommerceProductEntityChannelAssetEntityDetail(
  token: string,
  tenantSlug: string,
  productEntityId: string,
  channelKey: 'landing' | 'catalog' | 'whatsapp',
): Promise<EcommerceProductEntityChannelAssetEntityDetailResponse> {
  return request<EcommerceProductEntityChannelAssetEntityDetailResponse>(
    `/ecommerce/tenants/${encodeURIComponent(
      tenantSlug,
    )}/product-entities/${encodeURIComponent(
      productEntityId,
    )}/channel-asset-entities/${encodeURIComponent(channelKey)}`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function promoteTenantEcommerceProductEntityChannelAssetWorkspaceToChannelAssetEntity(
  token: string,
  tenantSlug: string,
  productEntityId: string,
  channelKey: 'landing' | 'catalog' | 'whatsapp',
): Promise<PromoteEcommerceProductEntityChannelAssetWorkspaceToChannelAssetEntityResponse> {
  return request<PromoteEcommerceProductEntityChannelAssetWorkspaceToChannelAssetEntityResponse>(
    `/ecommerce/tenants/${encodeURIComponent(
      tenantSlug,
    )}/product-entities/${encodeURIComponent(
      productEntityId,
    )}/channel-asset-workspaces/${encodeURIComponent(
      channelKey,
    )}/promote-to-channel-asset-entity`,
    {
      method: 'POST',
      token,
    },
  );
}

export async function updateTenantEcommerceProductEntityChannelAssetEntityEditableSnapshot(
  token: string,
  tenantSlug: string,
  productEntityId: string,
  channelKey: 'landing' | 'catalog' | 'whatsapp',
  patch: {
    title: string;
    headline: string;
    draftBlueprint: string[];
    recommendedArtifacts: string[];
    nextMilestone: string;
  },
): Promise<UpdateEcommerceProductEntityChannelAssetEntityEditableSnapshotResponse> {
  return request<UpdateEcommerceProductEntityChannelAssetEntityEditableSnapshotResponse>(
    `/ecommerce/tenants/${encodeURIComponent(
      tenantSlug,
    )}/product-entities/${encodeURIComponent(
      productEntityId,
    )}/channel-asset-entities/${encodeURIComponent(
      channelKey,
    )}/update-editable-snapshot`,
    {
      method: 'POST',
      token,
      body: JSON.stringify(patch),
    },
  );
}

export async function requestTenantEcommerceProductEntityChannelAssetEntityPublishPreparationPacket(
  token: string,
  tenantSlug: string,
  productEntityId: string,
  channelKey: 'landing' | 'catalog' | 'whatsapp',
): Promise<RequestEcommerceProductEntityChannelAssetEntityPublishPreparationPacketResponse> {
  return request<RequestEcommerceProductEntityChannelAssetEntityPublishPreparationPacketResponse>(
    `/ecommerce/tenants/${encodeURIComponent(
      tenantSlug,
    )}/product-entities/${encodeURIComponent(
      productEntityId,
    )}/channel-asset-entities/${encodeURIComponent(
      channelKey,
    )}/request-publish-preparation-packet`,
    {
      method: 'POST',
      token,
    },
  );
}

export async function fetchTenantEcommerceProductEntityChannelReleaseCandidates(
  token: string,
  tenantSlug: string,
  productEntityId: string,
): Promise<EcommerceProductEntityChannelReleaseCandidateRegistryResponse> {
  return request<EcommerceProductEntityChannelReleaseCandidateRegistryResponse>(
    `/ecommerce/tenants/${encodeURIComponent(
      tenantSlug,
    )}/product-entities/${encodeURIComponent(
      productEntityId,
    )}/channel-release-candidates`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function fetchTenantEcommerceProductEntityChannelReleaseCandidateDetail(
  token: string,
  tenantSlug: string,
  productEntityId: string,
  channelKey: 'landing' | 'catalog' | 'whatsapp',
): Promise<EcommerceProductEntityChannelReleaseCandidateDetailResponse> {
  return request<EcommerceProductEntityChannelReleaseCandidateDetailResponse>(
    `/ecommerce/tenants/${encodeURIComponent(
      tenantSlug,
    )}/product-entities/${encodeURIComponent(
      productEntityId,
    )}/channel-release-candidates/${encodeURIComponent(channelKey)}`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function promoteTenantEcommerceProductEntityChannelAssetEntityToReleaseCandidate(
  token: string,
  tenantSlug: string,
  productEntityId: string,
  channelKey: 'landing' | 'catalog' | 'whatsapp',
): Promise<PromoteEcommerceProductEntityChannelAssetEntityToReleaseCandidateResponse> {
  return request<PromoteEcommerceProductEntityChannelAssetEntityToReleaseCandidateResponse>(
    `/ecommerce/tenants/${encodeURIComponent(
      tenantSlug,
    )}/product-entities/${encodeURIComponent(
      productEntityId,
    )}/channel-asset-entities/${encodeURIComponent(
      channelKey,
    )}/promote-to-release-candidate`,
    {
      method: 'POST',
      token,
    },
  );
}

export async function fetchTenantEcommerceLandingAssetEntityWorkspace(
  token: string,
  tenantSlug: string,
  productEntityId: string,
): Promise<EcommerceLandingAssetEntityWorkspaceResponse> {
  return request<EcommerceLandingAssetEntityWorkspaceResponse>(
    `/ecommerce/tenants/${encodeURIComponent(
      tenantSlug,
    )}/product-entities/${encodeURIComponent(
      productEntityId,
    )}/landing-asset-entity-workspace`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function fetchTenantEcommerceCatalogAssetEntityWorkspace(
  token: string,
  tenantSlug: string,
  productEntityId: string,
): Promise<EcommerceCatalogAssetEntityWorkspaceResponse> {
  return request<EcommerceCatalogAssetEntityWorkspaceResponse>(
    `/ecommerce/tenants/${encodeURIComponent(
      tenantSlug,
    )}/product-entities/${encodeURIComponent(
      productEntityId,
    )}/catalog-asset-entity-workspace`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function fetchTenantEcommerceCatalogCommercialCard(
  token: string,
  tenantSlug: string,
  productEntityId: string,
): Promise<EcommerceCatalogCommercialCardResponse> {
  return request<EcommerceCatalogCommercialCardResponse>(
    `/ecommerce/tenants/${encodeURIComponent(
      tenantSlug,
    )}/product-entities/${encodeURIComponent(
      productEntityId,
    )}/catalog-commercial-card`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function fetchTenantEcommerceStorefrontPreviewWorkspace(
  token: string,
  tenantSlug: string,
  productEntityId: string,
): Promise<EcommerceStorefrontPreviewWorkspaceResponse> {
  return request<EcommerceStorefrontPreviewWorkspaceResponse>(
    `/ecommerce/tenants/${encodeURIComponent(
      tenantSlug,
    )}/product-entities/${encodeURIComponent(
      productEntityId,
    )}/storefront-preview-workspace`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function fetchTenantEcommerceStorefrontPublishReviewWorkspace(
  token: string,
  tenantSlug: string,
  productEntityId: string,
): Promise<EcommerceStorefrontPublishReviewWorkspaceResponse> {
  return request<EcommerceStorefrontPublishReviewWorkspaceResponse>(
    `/ecommerce/tenants/${encodeURIComponent(
      tenantSlug,
    )}/product-entities/${encodeURIComponent(
      productEntityId,
    )}/storefront-publish-review-workspace`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function fetchTenantEcommerceLandingPublishArtifact(
  token: string,
  tenantSlug: string,
  productEntityId: string,
): Promise<EcommerceLandingPublishArtifactResponse> {
  return request<EcommerceLandingPublishArtifactResponse>(
    `/ecommerce/tenants/${encodeURIComponent(
      tenantSlug,
    )}/product-entities/${encodeURIComponent(
      productEntityId,
    )}/landing-publish-artifact`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function fetchTenantEcommerceStorefrontReleaseCandidateBrief(
  token: string,
  tenantSlug: string,
  productEntityId: string,
): Promise<EcommerceStorefrontReleaseCandidateBriefResponse> {
  return request<EcommerceStorefrontReleaseCandidateBriefResponse>(
    `/ecommerce/tenants/${encodeURIComponent(
      tenantSlug,
    )}/product-entities/${encodeURIComponent(
      productEntityId,
    )}/storefront-release-candidate-brief`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function fetchTenantEcommerceStorefrontReleaseControlWorkspace(
  token: string,
  tenantSlug: string,
  productEntityId: string,
): Promise<EcommerceStorefrontReleaseControlWorkspaceResponse> {
  return request<EcommerceStorefrontReleaseControlWorkspaceResponse>(
    `/ecommerce/tenants/${encodeURIComponent(
      tenantSlug,
    )}/product-entities/${encodeURIComponent(
      productEntityId,
    )}/storefront-release-control-workspace`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function fetchTenantEcommerceStorefrontGoLiveManifest(
  token: string,
  tenantSlug: string,
  productEntityId: string,
): Promise<EcommerceStorefrontGoLiveManifestResponse> {
  return request<EcommerceStorefrontGoLiveManifestResponse>(
    `/ecommerce/tenants/${encodeURIComponent(
      tenantSlug,
    )}/product-entities/${encodeURIComponent(
      productEntityId,
    )}/storefront-go-live-manifest`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function fetchTenantEcommerceLiveStorefrontSessionWorkspace(
  token: string,
  tenantSlug: string,
  productEntityId: string,
): Promise<EcommerceLiveStorefrontSessionWorkspaceResponse> {
  return request<EcommerceLiveStorefrontSessionWorkspaceResponse>(
    `/ecommerce/tenants/${encodeURIComponent(
      tenantSlug,
    )}/product-entities/${encodeURIComponent(
      productEntityId,
    )}/live-storefront-session-workspace`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function fetchTenantEcommerceWhatsappChannelSequenceWorkspace(
  token: string,
  tenantSlug: string,
  productEntityId: string,
): Promise<EcommerceWhatsappChannelSequenceWorkspaceResponse> {
  return request<EcommerceWhatsappChannelSequenceWorkspaceResponse>(
    `/ecommerce/tenants/${encodeURIComponent(
      tenantSlug,
    )}/product-entities/${encodeURIComponent(
      productEntityId,
    )}/whatsapp-channel-sequence-workspace`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function fetchTenantEcommerceChannelReleaseWorkbench(
  token: string,
  tenantSlug: string,
  productEntityId: string,
): Promise<EcommerceChannelReleaseWorkbenchResponse> {
  return request<EcommerceChannelReleaseWorkbenchResponse>(
    `/ecommerce/tenants/${encodeURIComponent(
      tenantSlug,
    )}/product-entities/${encodeURIComponent(
      productEntityId,
    )}/channel-release-workbench`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function fetchTenantEcommerceChannelReleaseExecutionReadiness(
  token: string,
  tenantSlug: string,
  productEntityId: string,
): Promise<EcommerceChannelReleaseExecutionReadinessResponse> {
  return request<EcommerceChannelReleaseExecutionReadinessResponse>(
    `/ecommerce/tenants/${encodeURIComponent(
      tenantSlug,
    )}/product-entities/${encodeURIComponent(
      productEntityId,
    )}/channel-release-execution-readiness`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function requestTenantEcommerceChannelReleaseHandoffPacket(
  token: string,
  tenantSlug: string,
  productEntityId: string,
): Promise<EcommerceChannelReleaseHandoffPacketResponse> {
  return request<EcommerceChannelReleaseHandoffPacketResponse>(
    `/ecommerce/tenants/${encodeURIComponent(
      tenantSlug,
    )}/product-entities/${encodeURIComponent(
      productEntityId,
    )}/request-release-handoff-packet`,
    {
      method: 'POST',
      token,
    },
  );
}

export async function requestTenantEcommerceChannelReleaseApprovalPacket(
  token: string,
  tenantSlug: string,
  productEntityId: string,
): Promise<EcommerceChannelReleaseApprovalPacketResponse> {
  return request<EcommerceChannelReleaseApprovalPacketResponse>(
    `/ecommerce/tenants/${encodeURIComponent(
      tenantSlug,
    )}/product-entities/${encodeURIComponent(
      productEntityId,
    )}/request-release-approval-packet`,
    {
      method: 'POST',
      token,
    },
  );
}

export async function requestTenantEcommerceChannelReleaseLaunchPacket(
  token: string,
  tenantSlug: string,
  productEntityId: string,
): Promise<EcommerceChannelReleaseLaunchPacketResponse> {
  return request<EcommerceChannelReleaseLaunchPacketResponse>(
    `/ecommerce/tenants/${encodeURIComponent(
      tenantSlug,
    )}/product-entities/${encodeURIComponent(
      productEntityId,
    )}/request-release-launch-packet`,
    {
      method: 'POST',
      token,
    },
  );
}

export async function fetchTenantEcommerceCatalogListingAsset(
  token: string,
  tenantSlug: string,
  productEntityId: string,
): Promise<EcommerceCatalogListingAssetResponse> {
  return request<EcommerceCatalogListingAssetResponse>(
    `/ecommerce/tenants/${encodeURIComponent(
      tenantSlug,
    )}/product-entities/${encodeURIComponent(
      productEntityId,
    )}/catalog-listing-asset`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function requestTenantEcommerceCatalogStorefrontPlacementPacket(
  token: string,
  tenantSlug: string,
  productEntityId: string,
): Promise<EcommerceCatalogStorefrontPlacementPacketResponse> {
  return request<EcommerceCatalogStorefrontPlacementPacketResponse>(
    `/ecommerce/tenants/${encodeURIComponent(
      tenantSlug,
    )}/product-entities/${encodeURIComponent(
      productEntityId,
    )}/request-catalog-storefront-placement-packet`,
    {
      method: 'POST',
      token,
    },
  );
}

export async function requestTenantEcommerceCatalogMerchandisingPacket(
  token: string,
  tenantSlug: string,
  productEntityId: string,
): Promise<EcommerceCatalogMerchandisingPacketResponse> {
  return request<EcommerceCatalogMerchandisingPacketResponse>(
    `/ecommerce/tenants/${encodeURIComponent(
      tenantSlug,
    )}/product-entities/${encodeURIComponent(
      productEntityId,
    )}/request-catalog-merchandising-packet`,
    {
      method: 'POST',
      token,
    },
  );
}

export async function fetchTenantEcommerceCheckoutOrderIntakeWorkspace(
  token: string,
  tenantSlug: string,
  productEntityId: string,
): Promise<EcommerceCheckoutOrderIntakeWorkspaceResponse> {
  return request<EcommerceCheckoutOrderIntakeWorkspaceResponse>(
    `/ecommerce/tenants/${encodeURIComponent(
      tenantSlug,
    )}/product-entities/${encodeURIComponent(
      productEntityId,
    )}/checkout-order-intake-workspace`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function requestTenantEcommerceCheckoutCustomerCapturePacket(
  token: string,
  tenantSlug: string,
  productEntityId: string,
): Promise<EcommerceCheckoutCustomerCapturePacketResponse> {
  return request<EcommerceCheckoutCustomerCapturePacketResponse>(
    `/ecommerce/tenants/${encodeURIComponent(
      tenantSlug,
    )}/product-entities/${encodeURIComponent(
      productEntityId,
    )}/request-checkout-customer-capture-packet`,
    {
      method: 'POST',
      token,
    },
  );
}

export async function saveTenantEcommerceOrderDraft(
  token: string,
  tenantSlug: string,
  productEntityId: string,
): Promise<EcommerceOrderDraftSaveResponse> {
  return request<EcommerceOrderDraftSaveResponse>(
    `/ecommerce/tenants/${encodeURIComponent(
      tenantSlug,
    )}/product-entities/${encodeURIComponent(
      productEntityId,
    )}/save-order-draft`,
    {
      method: 'POST',
      token,
    },
  );
}

export async function fetchTenantEcommerceOrderDrafts(
  token: string,
  tenantSlug: string,
  productEntityId: string,
): Promise<EcommerceOrderDraftRegistryResponse> {
  return request<EcommerceOrderDraftRegistryResponse>(
    `/ecommerce/tenants/${encodeURIComponent(
      tenantSlug,
    )}/product-entities/${encodeURIComponent(productEntityId)}/order-drafts`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function fetchTenantEcommerceOrderDraftDetail(
  token: string,
  tenantSlug: string,
  productEntityId: string,
  orderDraftId: string,
): Promise<EcommerceOrderDraftDetailResponse> {
  return request<EcommerceOrderDraftDetailResponse>(
    `/ecommerce/tenants/${encodeURIComponent(
      tenantSlug,
    )}/product-entities/${encodeURIComponent(
      productEntityId,
    )}/order-drafts/${encodeURIComponent(orderDraftId)}`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function fetchTenantEcommerceLandingPageStructure(
  token: string,
  tenantSlug: string,
  productEntityId: string,
): Promise<EcommerceLandingPageStructureResponse> {
  return request<EcommerceLandingPageStructureResponse>(
    `/ecommerce/tenants/${encodeURIComponent(
      tenantSlug,
    )}/product-entities/${encodeURIComponent(
      productEntityId,
    )}/landing-page-structure`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function fetchTenantEcommerceWhatsappSalesFlow(
  token: string,
  tenantSlug: string,
  productEntityId: string,
): Promise<EcommerceWhatsappSalesFlowResponse> {
  return request<EcommerceWhatsappSalesFlowResponse>(
    `/ecommerce/tenants/${encodeURIComponent(
      tenantSlug,
    )}/product-entities/${encodeURIComponent(
      productEntityId,
    )}/whatsapp-sales-flow`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function requestTenantEcommerceWhatsappGrowthHandoff(
  token: string,
  tenantSlug: string,
  productEntityId: string,
): Promise<EcommerceWhatsappGrowthHandoffResponse> {
  return request<EcommerceWhatsappGrowthHandoffResponse>(
    `/ecommerce/tenants/${encodeURIComponent(
      tenantSlug,
    )}/product-entities/${encodeURIComponent(
      productEntityId,
    )}/request-whatsapp-growth-handoff`,
    {
      method: 'POST',
      token,
    },
  );
}

export async function fetchTenantEcommerceWhatsappGrowthActivationWorkspace(
  token: string,
  tenantSlug: string,
  productEntityId: string,
): Promise<EcommerceWhatsappGrowthActivationWorkspaceResponse> {
  return request<EcommerceWhatsappGrowthActivationWorkspaceResponse>(
    `/ecommerce/tenants/${encodeURIComponent(
      tenantSlug,
    )}/product-entities/${encodeURIComponent(
      productEntityId,
    )}/whatsapp-growth-activation-workspace`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function requestTenantEcommerceWhatsappGrowthActivationPacket(
  token: string,
  tenantSlug: string,
  productEntityId: string,
): Promise<EcommerceWhatsappGrowthActivationPacketResponse> {
  return request<EcommerceWhatsappGrowthActivationPacketResponse>(
    `/ecommerce/tenants/${encodeURIComponent(
      tenantSlug,
    )}/product-entities/${encodeURIComponent(
      productEntityId,
    )}/request-whatsapp-growth-activation-packet`,
    {
      method: 'POST',
      token,
    },
  );
}

export async function requestTenantEcommerceWhatsappGrowthExecutionBridge(
  token: string,
  tenantSlug: string,
  productEntityId: string,
): Promise<EcommerceWhatsappGrowthExecutionBridgeResponse> {
  return request<EcommerceWhatsappGrowthExecutionBridgeResponse>(
    `/ecommerce/tenants/${encodeURIComponent(
      tenantSlug,
    )}/product-entities/${encodeURIComponent(
      productEntityId,
    )}/request-whatsapp-growth-execution-bridge`,
    {
      method: 'POST',
      token,
    },
  );
}

export async function requestTenantEcommerceWhatsappGrowthOperatorLaunchPacket(
  token: string,
  tenantSlug: string,
  productEntityId: string,
): Promise<EcommerceWhatsappGrowthOperatorLaunchPacketResponse> {
  return request<EcommerceWhatsappGrowthOperatorLaunchPacketResponse>(
    `/ecommerce/tenants/${encodeURIComponent(
      tenantSlug,
    )}/product-entities/${encodeURIComponent(
      productEntityId,
    )}/request-whatsapp-growth-operator-launch-packet`,
    {
      method: 'POST',
      token,
    },
  );
}

export async function requestTenantEcommerceWhatsappGrowthLaunchAcknowledgementPacket(
  token: string,
  tenantSlug: string,
  productEntityId: string,
): Promise<EcommerceWhatsappGrowthLaunchAcknowledgementPacketResponse> {
  return request<EcommerceWhatsappGrowthLaunchAcknowledgementPacketResponse>(
    `/ecommerce/tenants/${encodeURIComponent(
      tenantSlug,
    )}/product-entities/${encodeURIComponent(
      productEntityId,
    )}/request-whatsapp-growth-launch-acknowledgement-packet`,
    {
      method: 'POST',
      token,
    },
  );
}

export async function requestTenantEcommerceOrderInvoicingBridge(
  token: string,
  tenantSlug: string,
  productEntityId: string,
): Promise<EcommerceOrderInvoicingBridgeResponse> {
  return request<EcommerceOrderInvoicingBridgeResponse>(
    `/ecommerce/tenants/${encodeURIComponent(
      tenantSlug,
    )}/product-entities/${encodeURIComponent(
      productEntityId,
    )}/request-order-invoicing-bridge`,
    {
      method: 'POST',
      token,
    },
  );
}

export async function requestTenantEcommerceOrderToInvoiceReadinessPacket(
  token: string,
  tenantSlug: string,
  productEntityId: string,
): Promise<EcommerceOrderToInvoiceReadinessPacketResponse> {
  return request<EcommerceOrderToInvoiceReadinessPacketResponse>(
    `/ecommerce/tenants/${encodeURIComponent(
      tenantSlug,
    )}/product-entities/${encodeURIComponent(
      productEntityId,
    )}/request-order-to-invoice-readiness-packet`,
    {
      method: 'POST',
      token,
    },
  );
}

export async function requestTenantEcommerceCheckoutCloseoutPacket(
  token: string,
  tenantSlug: string,
  productEntityId: string,
  orderDraftId: string,
): Promise<EcommerceCheckoutCloseoutPacketResponse> {
  return request<EcommerceCheckoutCloseoutPacketResponse>(
    `/ecommerce/tenants/${encodeURIComponent(
      tenantSlug,
    )}/product-entities/${encodeURIComponent(
      productEntityId,
    )}/order-drafts/${encodeURIComponent(
      orderDraftId,
    )}/request-checkout-closeout-packet`,
    {
      method: 'POST',
      token,
    },
  );
}

export async function requestTenantEcommerceOrderToGrowthConversationBridge(
  token: string,
  tenantSlug: string,
  productEntityId: string,
  orderDraftId: string,
): Promise<EcommerceOrderToGrowthConversationBridgeResponse> {
  return request<EcommerceOrderToGrowthConversationBridgeResponse>(
    `/ecommerce/tenants/${encodeURIComponent(
      tenantSlug,
    )}/product-entities/${encodeURIComponent(
      productEntityId,
    )}/order-drafts/${encodeURIComponent(
      orderDraftId,
    )}/request-growth-conversation-bridge`,
    {
      method: 'POST',
      token,
    },
  );
}

export async function fetchTenantEcommerceOrderReviewWorkspace(
  token: string,
  tenantSlug: string,
  productEntityId: string,
  orderDraftId: string,
): Promise<EcommerceOrderReviewWorkspaceResponse> {
  return request<EcommerceOrderReviewWorkspaceResponse>(
    `/ecommerce/tenants/${encodeURIComponent(
      tenantSlug,
    )}/product-entities/${encodeURIComponent(
      productEntityId,
    )}/order-drafts/${encodeURIComponent(
      orderDraftId,
    )}/review-workspace`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function requestTenantEcommerceOrderApprovalDecision(
  token: string,
  tenantSlug: string,
  productEntityId: string,
  orderDraftId: string,
): Promise<EcommerceOrderApprovalDecisionResponse> {
  return request<EcommerceOrderApprovalDecisionResponse>(
    `/ecommerce/tenants/${encodeURIComponent(
      tenantSlug,
    )}/product-entities/${encodeURIComponent(
      productEntityId,
    )}/order-drafts/${encodeURIComponent(
      orderDraftId,
    )}/request-approval-decision`,
    {
      method: 'POST',
      token,
    },
  );
}

export async function requestTenantEcommerceOrderHandoffDecision(
  token: string,
  tenantSlug: string,
  productEntityId: string,
  orderDraftId: string,
): Promise<EcommerceOrderHandoffDecisionResponse> {
  return request<EcommerceOrderHandoffDecisionResponse>(
    `/ecommerce/tenants/${encodeURIComponent(
      tenantSlug,
    )}/product-entities/${encodeURIComponent(
      productEntityId,
    )}/order-drafts/${encodeURIComponent(
      orderDraftId,
    )}/request-handoff-decision`,
    {
      method: 'POST',
      token,
    },
  );
}

export async function fetchTenantEcommerceOrderFiscalDataCompletionWorkspace(
  token: string,
  tenantSlug: string,
  productEntityId: string,
  orderDraftId: string,
): Promise<EcommerceOrderFiscalDataCompletionWorkspaceResponse> {
  return request<EcommerceOrderFiscalDataCompletionWorkspaceResponse>(
    `/ecommerce/tenants/${encodeURIComponent(
      tenantSlug,
    )}/product-entities/${encodeURIComponent(
      productEntityId,
    )}/order-drafts/${encodeURIComponent(
      orderDraftId,
    )}/fiscal-data-completion-workspace`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function fetchTenantEcommerceInvoiceDraftIntakeWorkspace(
  token: string,
  tenantSlug: string,
  productEntityId: string,
  orderDraftId: string,
): Promise<EcommerceInvoiceDraftIntakeWorkspaceResponse> {
  return request<EcommerceInvoiceDraftIntakeWorkspaceResponse>(
    `/ecommerce/tenants/${encodeURIComponent(
      tenantSlug,
    )}/product-entities/${encodeURIComponent(
      productEntityId,
    )}/order-drafts/${encodeURIComponent(
      orderDraftId,
    )}/invoice-draft-intake-workspace`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function fetchTenantEcommerceOrderHandoffExecutionWorkspace(
  token: string,
  tenantSlug: string,
  productEntityId: string,
  orderDraftId: string,
): Promise<EcommerceOrderHandoffExecutionWorkspaceResponse> {
  return request<EcommerceOrderHandoffExecutionWorkspaceResponse>(
    `/ecommerce/tenants/${encodeURIComponent(
      tenantSlug,
    )}/product-entities/${encodeURIComponent(
      productEntityId,
    )}/order-drafts/${encodeURIComponent(
      orderDraftId,
    )}/handoff-execution-workspace`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function requestTenantEcommerceInvoiceDraftOpenBridge(
  token: string,
  tenantSlug: string,
  productEntityId: string,
  orderDraftId: string,
): Promise<EcommerceInvoiceDraftOpenBridgeResponse> {
  return request<EcommerceInvoiceDraftOpenBridgeResponse>(
    `/ecommerce/tenants/${encodeURIComponent(
      tenantSlug,
    )}/product-entities/${encodeURIComponent(
      productEntityId,
    )}/order-drafts/${encodeURIComponent(
      orderDraftId,
    )}/request-invoice-draft-open-bridge`,
    {
      method: 'POST',
      token,
    },
  );
}

export async function fetchTenantEcommerceOrderHoldResolutionWorkspace(
  token: string,
  tenantSlug: string,
  productEntityId: string,
  orderDraftId: string,
): Promise<EcommerceOrderHoldResolutionWorkspaceResponse> {
  return request<EcommerceOrderHoldResolutionWorkspaceResponse>(
    `/ecommerce/tenants/${encodeURIComponent(
      tenantSlug,
    )}/product-entities/${encodeURIComponent(
      productEntityId,
    )}/order-drafts/${encodeURIComponent(
      orderDraftId,
    )}/hold-resolution-workspace`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function requestTenantEcommerceInvoiceDraftLaunchBridge(
  token: string,
  tenantSlug: string,
  productEntityId: string,
  orderDraftId: string,
): Promise<EcommerceInvoiceDraftLaunchBridgeResponse> {
  return request<EcommerceInvoiceDraftLaunchBridgeResponse>(
    `/ecommerce/tenants/${encodeURIComponent(
      tenantSlug,
    )}/product-entities/${encodeURIComponent(
      productEntityId,
    )}/order-drafts/${encodeURIComponent(
      orderDraftId,
    )}/request-invoice-draft-launch-bridge`,
    {
      method: 'POST',
      token,
    },
  );
}

export async function requestTenantEcommerceOrderRouteResolutionPacket(
  token: string,
  tenantSlug: string,
  productEntityId: string,
  orderDraftId: string,
): Promise<EcommerceOrderRouteResolutionPacketResponse> {
  return request<EcommerceOrderRouteResolutionPacketResponse>(
    `/ecommerce/tenants/${encodeURIComponent(
      tenantSlug,
    )}/product-entities/${encodeURIComponent(
      productEntityId,
    )}/order-drafts/${encodeURIComponent(
      orderDraftId,
    )}/request-route-resolution-packet`,
    {
      method: 'POST',
      token,
    },
  );
}

export async function fetchTenantEcommerceInvoiceDraftHandoffWorkspace(
  token: string,
  tenantSlug: string,
  productEntityId: string,
  orderDraftId: string,
): Promise<EcommerceInvoiceDraftHandoffWorkspaceResponse> {
  return request<EcommerceInvoiceDraftHandoffWorkspaceResponse>(
    `/ecommerce/tenants/${encodeURIComponent(
      tenantSlug,
    )}/product-entities/${encodeURIComponent(
      productEntityId,
    )}/order-drafts/${encodeURIComponent(
      orderDraftId,
    )}/invoice-draft-handoff-workspace`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function requestTenantEcommerceInvoiceHandoffAcknowledgement(
  token: string,
  tenantSlug: string,
  productEntityId: string,
  orderDraftId: string,
): Promise<EcommerceInvoiceHandoffAcknowledgementResponse> {
  return request<EcommerceInvoiceHandoffAcknowledgementResponse>(
    `/ecommerce/tenants/${encodeURIComponent(
      tenantSlug,
    )}/product-entities/${encodeURIComponent(
      productEntityId,
    )}/order-drafts/${encodeURIComponent(
      orderDraftId,
    )}/request-invoice-handoff-acknowledgement`,
    {
      method: 'POST',
      token,
    },
  );
}

export async function requestTenantEcommerceOrderInvoiceDraftBridge(
  token: string,
  tenantSlug: string,
  productEntityId: string,
  orderDraftId: string,
): Promise<EcommerceOrderInvoiceDraftBridgeResponse> {
  return request<EcommerceOrderInvoiceDraftBridgeResponse>(
    `/ecommerce/tenants/${encodeURIComponent(
      tenantSlug,
    )}/product-entities/${encodeURIComponent(
      productEntityId,
    )}/order-drafts/${encodeURIComponent(
      orderDraftId,
    )}/request-invoice-draft-bridge`,
    {
      method: 'POST',
      token,
    },
  );
}

export async function fetchTenantEcommerceOrderOperatorWorkboard(
  token: string,
  tenantSlug: string,
  productEntityId: string,
): Promise<EcommerceOrderOperatorWorkboardResponse> {
  return request<EcommerceOrderOperatorWorkboardResponse>(
    `/ecommerce/tenants/${encodeURIComponent(
      tenantSlug,
    )}/product-entities/${encodeURIComponent(
      productEntityId,
    )}/order-operator-workboard`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function fetchTenantEcommerceOrderOpsPriorityQueue(
  token: string,
  tenantSlug: string,
  productEntityId: string,
): Promise<EcommerceOrderOpsPriorityQueueResponse> {
  return request<EcommerceOrderOpsPriorityQueueResponse>(
    `/ecommerce/tenants/${encodeURIComponent(
      tenantSlug,
    )}/product-entities/${encodeURIComponent(
      productEntityId,
    )}/order-ops-priority-queue`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function fetchTenantEcommerceOrderOpsAttentionWorkspace(
  token: string,
  tenantSlug: string,
  productEntityId: string,
): Promise<EcommerceOrderOpsAttentionWorkspaceResponse> {
  return request<EcommerceOrderOpsAttentionWorkspaceResponse>(
    `/ecommerce/tenants/${encodeURIComponent(
      tenantSlug,
    )}/product-entities/${encodeURIComponent(
      productEntityId,
    )}/order-ops-attention-workspace`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function fetchTenantEcommerceOrderOpsEscalationBoard(
  token: string,
  tenantSlug: string,
  productEntityId: string,
): Promise<EcommerceOrderOpsEscalationBoardResponse> {
  return request<EcommerceOrderOpsEscalationBoardResponse>(
    `/ecommerce/tenants/${encodeURIComponent(
      tenantSlug,
    )}/product-entities/${encodeURIComponent(
      productEntityId,
    )}/order-ops-escalation-board`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function fetchTenantEcommerceOrderGrowthFollowUpWorkspace(
  token: string,
  tenantSlug: string,
  productEntityId: string,
  orderDraftId: string,
): Promise<EcommerceOrderGrowthFollowUpWorkspaceResponse> {
  return request<EcommerceOrderGrowthFollowUpWorkspaceResponse>(
    `/ecommerce/tenants/${encodeURIComponent(
      tenantSlug,
    )}/product-entities/${encodeURIComponent(
      productEntityId,
    )}/order-drafts/${encodeURIComponent(
      orderDraftId,
    )}/growth-follow-up-workspace`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function fetchTenantEcommerceOrderPaymentReadinessWorkspace(
  token: string,
  tenantSlug: string,
  productEntityId: string,
  orderDraftId: string,
): Promise<EcommerceOrderPaymentReadinessWorkspaceResponse> {
  return request<EcommerceOrderPaymentReadinessWorkspaceResponse>(
    `/ecommerce/tenants/${encodeURIComponent(
      tenantSlug,
    )}/product-entities/${encodeURIComponent(
      productEntityId,
    )}/order-drafts/${encodeURIComponent(
      orderDraftId,
    )}/payment-readiness-workspace`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function fetchTenantEcommerceOrderStatusLifecycles(
  token: string,
  tenantSlug: string,
  productEntityId: string,
): Promise<EcommerceOrderStatusLifecycleRegistryResponse> {
  return request<EcommerceOrderStatusLifecycleRegistryResponse>(
    `/ecommerce/tenants/${encodeURIComponent(
      tenantSlug,
    )}/product-entities/${encodeURIComponent(
      productEntityId,
    )}/order-status-lifecycles`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function fetchTenantEcommerceOrderPostSaleLifecycles(
  token: string,
  tenantSlug: string,
  productEntityId: string,
): Promise<EcommerceOrderPostSaleLifecycleRegistryResponse> {
  return request<EcommerceOrderPostSaleLifecycleRegistryResponse>(
    `/ecommerce/tenants/${encodeURIComponent(
      tenantSlug,
    )}/product-entities/${encodeURIComponent(
      productEntityId,
    )}/order-post-sale-lifecycles`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function fetchTenantEcommerceOrderStatusLifecycleDetail(
  token: string,
  tenantSlug: string,
  productEntityId: string,
  orderDraftId: string,
): Promise<EcommerceOrderStatusLifecycleDetailResponse> {
  return request<EcommerceOrderStatusLifecycleDetailResponse>(
    `/ecommerce/tenants/${encodeURIComponent(
      tenantSlug,
    )}/product-entities/${encodeURIComponent(
      productEntityId,
    )}/order-status-lifecycles/${encodeURIComponent(orderDraftId)}`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function fetchTenantEcommerceOrderPostSaleLifecycleDetail(
  token: string,
  tenantSlug: string,
  productEntityId: string,
  orderDraftId: string,
): Promise<EcommerceOrderPostSaleLifecycleDetailResponse> {
  return request<EcommerceOrderPostSaleLifecycleDetailResponse>(
    `/ecommerce/tenants/${encodeURIComponent(
      tenantSlug,
    )}/product-entities/${encodeURIComponent(
      productEntityId,
    )}/order-post-sale-lifecycles/${encodeURIComponent(orderDraftId)}`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function fetchTenantEcommerceLaunchPlans(
  token: string,
  tenantSlug: string,
): Promise<EcommerceLaunchPlanRegistryResponse> {
  return request<EcommerceLaunchPlanRegistryResponse>(
    `/ecommerce/tenants/${encodeURIComponent(tenantSlug)}/launch-plans`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function fetchTenantEcommerceLaunchPlanDetail(
  token: string,
  tenantSlug: string,
  launchPlanId: string,
): Promise<EcommerceLaunchPlanDetailResponse> {
  return request<EcommerceLaunchPlanDetailResponse>(
    `/ecommerce/tenants/${encodeURIComponent(
      tenantSlug,
    )}/launch-plans/${encodeURIComponent(launchPlanId)}`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function requestTenantEcommerceLaunchPlanActivationReadiness(
  token: string,
  tenantSlug: string,
  launchPlanId: string,
): Promise<RequestEcommerceLaunchPlanActivationReadinessResponse> {
  return request<RequestEcommerceLaunchPlanActivationReadinessResponse>(
    `/ecommerce/tenants/${encodeURIComponent(
      tenantSlug,
    )}/launch-plans/${encodeURIComponent(
      launchPlanId,
    )}/request-activation-readiness`,
    {
      method: 'POST',
      token,
    },
  );
}

export async function fetchTenantAiHealthWorkspace(
  token: string,
  tenantSlug: string,
): Promise<AiHealthWorkspaceResponse> {
  return request<AiHealthWorkspaceResponse>(
    `/ai/tenants/${encodeURIComponent(tenantSlug)}/health-workspace`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function fetchTenantAiEvaluationWorkspace(
  token: string,
  tenantSlug: string,
): Promise<AiEvaluationWorkspaceResponse> {
  return request<AiEvaluationWorkspaceResponse>(
    `/ai/tenants/${encodeURIComponent(tenantSlug)}/evaluation-workspace`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function fetchTenantAiGovernanceWorkspace(
  token: string,
  tenantSlug: string,
): Promise<AiGovernanceWorkspaceResponse> {
  return request<AiGovernanceWorkspaceResponse>(
    `/ai/tenants/${encodeURIComponent(tenantSlug)}/governance-workspace`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function fetchTenantAiPolicySimulationWorkspace(
  token: string,
  tenantSlug: string,
): Promise<AiPolicySimulationWorkspaceResponse> {
  return request<AiPolicySimulationWorkspaceResponse>(
    `/ai/tenants/${encodeURIComponent(tenantSlug)}/policy-simulation-workspace`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function fetchTenantAiApprovalDesignWorkspace(
  token: string,
  tenantSlug: string,
): Promise<AiApprovalDesignWorkspaceResponse> {
  return request<AiApprovalDesignWorkspaceResponse>(
    `/ai/tenants/${encodeURIComponent(tenantSlug)}/approval-design-workspace`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function fetchTenantAiApprovalCapacityWorkspace(
  token: string,
  tenantSlug: string,
): Promise<AiApprovalCapacityWorkspaceResponse> {
  return request<AiApprovalCapacityWorkspaceResponse>(
    `/ai/tenants/${encodeURIComponent(tenantSlug)}/approval-capacity-workspace`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function fetchTenantAiApprovalSlaWorkspace(
  token: string,
  tenantSlug: string,
): Promise<AiApprovalSlaWorkspaceResponse> {
  return request<AiApprovalSlaWorkspaceResponse>(
    `/ai/tenants/${encodeURIComponent(tenantSlug)}/approval-sla-workspace`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function fetchTenantAiApprovalStaffingWorkspace(
  token: string,
  tenantSlug: string,
): Promise<AiApprovalStaffingWorkspaceResponse> {
  return request<AiApprovalStaffingWorkspaceResponse>(
    `/ai/tenants/${encodeURIComponent(tenantSlug)}/approval-staffing-workspace`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function fetchTenantAiApprovalStaffingPlanWorkspace(
  token: string,
  tenantSlug: string,
): Promise<AiApprovalStaffingPlanWorkspaceResponse> {
  return request<AiApprovalStaffingPlanWorkspaceResponse>(
    `/ai/tenants/${encodeURIComponent(
      tenantSlug,
    )}/approval-staffing-plan-workspace`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function fetchTenantAiApprovalRolloutWorkspace(
  token: string,
  tenantSlug: string,
): Promise<AiApprovalRolloutWorkspaceResponse> {
  return request<AiApprovalRolloutWorkspaceResponse>(
    `/ai/tenants/${encodeURIComponent(tenantSlug)}/approval-rollout-workspace`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function fetchTenantAiApprovalReadinessWorkspace(
  token: string,
  tenantSlug: string,
): Promise<AiApprovalReadinessWorkspaceResponse> {
  return request<AiApprovalReadinessWorkspaceResponse>(
    `/ai/tenants/${encodeURIComponent(tenantSlug)}/approval-readiness-workspace`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function fetchTenantAiApprovalLaunchWorkspace(
  token: string,
  tenantSlug: string,
): Promise<AiApprovalLaunchWorkspaceResponse> {
  return request<AiApprovalLaunchWorkspaceResponse>(
    `/ai/tenants/${encodeURIComponent(tenantSlug)}/approval-launch-workspace`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function fetchTenantAiGuardedExecutionWorkspace(
  token: string,
  tenantSlug: string,
): Promise<AiGuardedExecutionWorkspaceResponse> {
  return request<AiGuardedExecutionWorkspaceResponse>(
    `/ai/tenants/${encodeURIComponent(tenantSlug)}/guarded-execution-workspace`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function fetchTenantAiGuardedExecutionPilotWorkspace(
  token: string,
  tenantSlug: string,
): Promise<AiGuardedExecutionPilotWorkspaceResponse> {
  return request<AiGuardedExecutionPilotWorkspaceResponse>(
    `/ai/tenants/${encodeURIComponent(
      tenantSlug,
    )}/guarded-execution-pilot-workspace`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function fetchTenantAiGuardedExecutionRunbookWorkspace(
  token: string,
  tenantSlug: string,
): Promise<AiGuardedExecutionRunbookWorkspaceResponse> {
  return request<AiGuardedExecutionRunbookWorkspaceResponse>(
    `/ai/tenants/${encodeURIComponent(
      tenantSlug,
    )}/guarded-execution-runbook-workspace`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function fetchTenantAiGuardedExecutionRollbackWorkspace(
  token: string,
  tenantSlug: string,
): Promise<AiGuardedExecutionRollbackWorkspaceResponse> {
  return request<AiGuardedExecutionRollbackWorkspaceResponse>(
    `/ai/tenants/${encodeURIComponent(
      tenantSlug,
    )}/guarded-execution-rollback-workspace`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function fetchTenantAiGuardedExecutionAuditWorkspace(
  token: string,
  tenantSlug: string,
): Promise<AiGuardedExecutionAuditWorkspaceResponse> {
  return request<AiGuardedExecutionAuditWorkspaceResponse>(
    `/ai/tenants/${encodeURIComponent(
      tenantSlug,
    )}/guarded-execution-audit-workspace`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function fetchTenantAiGuardedExecutionLaunchWorkspace(
  token: string,
  tenantSlug: string,
): Promise<AiGuardedExecutionLaunchWorkspaceResponse> {
  return request<AiGuardedExecutionLaunchWorkspaceResponse>(
    `/ai/tenants/${encodeURIComponent(
      tenantSlug,
    )}/guarded-execution-launch-workspace`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function fetchTenantAiGuardedExecutionMonitorWorkspace(
  token: string,
  tenantSlug: string,
): Promise<AiGuardedExecutionMonitorWorkspaceResponse> {
  return request<AiGuardedExecutionMonitorWorkspaceResponse>(
    `/ai/tenants/${encodeURIComponent(
      tenantSlug,
    )}/guarded-execution-monitor-workspace`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function fetchTenantAiGuardedExecutionControlWorkspace(
  token: string,
  tenantSlug: string,
): Promise<AiGuardedExecutionControlWorkspaceResponse> {
  return request<AiGuardedExecutionControlWorkspaceResponse>(
    `/ai/tenants/${encodeURIComponent(
      tenantSlug,
    )}/guarded-execution-control-workspace`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function fetchTenantAiGuardedExecutionEventLogWorkspace(
  token: string,
  tenantSlug: string,
): Promise<AiGuardedExecutionEventLogWorkspaceResponse> {
  return request<AiGuardedExecutionEventLogWorkspaceResponse>(
    `/ai/tenants/${encodeURIComponent(
      tenantSlug,
    )}/guarded-execution-event-log-workspace`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function fetchTenantAiHandoffWorkspace(
  token: string,
  tenantSlug: string,
  limit = 10,
): Promise<AiHandoffWorkspaceResponse> {
  return request<AiHandoffWorkspaceResponse>(
    `/ai/tenants/${encodeURIComponent(
      tenantSlug,
    )}/handoff-workspace?limit=${encodeURIComponent(String(limit))}`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function fetchTenantAiSuggestionWorkspace(
  token: string,
  tenantSlug: string,
  limit = 10,
): Promise<AiSuggestionRunResponse[]> {
  return request<AiSuggestionRunResponse[]>(
    `/ai/tenants/${encodeURIComponent(
      tenantSlug,
    )}/suggestion-runs?limit=${encodeURIComponent(String(limit))}`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function fetchTenantAiSuggestionWorkspaceDetail(
  token: string,
  tenantSlug: string,
  suggestionRunId: string,
): Promise<AiSuggestionRunDetailResponse> {
  return request<AiSuggestionRunDetailResponse>(
    `/ai/tenants/${encodeURIComponent(
      tenantSlug,
    )}/suggestion-runs/${encodeURIComponent(suggestionRunId)}`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function fetchTenantAiSuggestionRunDetail(
  token: string,
  tenantSlug: string,
  agentKey: string,
  suggestionRunId: string,
): Promise<AiSuggestionRunDetailResponse> {
  return request<AiSuggestionRunDetailResponse>(
    `/ai/tenants/${encodeURIComponent(
      tenantSlug,
    )}/agents/${encodeURIComponent(
      agentKey,
    )}/suggestion-runs/${encodeURIComponent(suggestionRunId)}`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function fetchTenantAiApprovalRequests(
  token: string,
  tenantSlug: string,
  agentKey: string,
  options?: {
    limit?: number;
    status?: AiApprovalRequestStatusFilter | null;
  },
): Promise<AiApprovalRequestResponse[]> {
  const searchParams = new URLSearchParams();
  searchParams.set('limit', String(options?.limit ?? 10));

  if (options?.status && options.status !== 'all') {
    searchParams.set('status', options.status);
  }

  return request<AiApprovalRequestResponse[]>(
    `/ai/tenants/${encodeURIComponent(
      tenantSlug,
    )}/agents/${encodeURIComponent(agentKey)}/approval-requests?${searchParams.toString()}`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function fetchTenantAiApprovalWorkspace(
  token: string,
  tenantSlug: string,
  options?: {
    limit?: number;
    status?: AiApprovalRequestStatusFilter | null;
  },
): Promise<AiApprovalRequestResponse[]> {
  const searchParams = new URLSearchParams();
  searchParams.set('limit', String(options?.limit ?? 10));

  if (options?.status && options.status !== 'all') {
    searchParams.set('status', options.status);
  }

  return request<AiApprovalRequestResponse[]>(
    `/ai/tenants/${encodeURIComponent(
      tenantSlug,
    )}/approval-requests?${searchParams.toString()}`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function fetchTenantAiApprovalWorkspaceSummary(
  token: string,
  tenantSlug: string,
  options?: {
    limit?: number;
    status?: AiApprovalRequestStatusFilter | null;
  },
): Promise<AiApprovalWorkspaceResponse> {
  const searchParams = new URLSearchParams();
  searchParams.set('limit', String(options?.limit ?? 10));

  if (options?.status && options.status !== 'all') {
    searchParams.set('status', options.status);
  }

  return request<AiApprovalWorkspaceResponse>(
    `/ai/tenants/${encodeURIComponent(
      tenantSlug,
    )}/approval-workspace?${searchParams.toString()}`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function prepareTenantAiSuggestionRun(
  token: string,
  tenantSlug: string,
  agentKey: string,
): Promise<AiSuggestionRunResponse> {
  return request<AiSuggestionRunResponse>(
    `/ai/tenants/${encodeURIComponent(
      tenantSlug,
    )}/agents/${encodeURIComponent(agentKey)}/suggestion-runs`,
    {
      method: 'POST',
      token,
    },
  );
}

export async function requestTenantAiSuggestionRunApproval(
  token: string,
  tenantSlug: string,
  agentKey: string,
  suggestionRunId: string,
  body?: {
    rationale?: string | null;
  },
): Promise<AiApprovalRequestResponse> {
  return request<AiApprovalRequestResponse>(
    `/ai/tenants/${encodeURIComponent(
      tenantSlug,
    )}/agents/${encodeURIComponent(
      agentKey,
    )}/suggestion-runs/${encodeURIComponent(suggestionRunId)}/approval-requests`,
    {
      method: 'POST',
      token,
      body: JSON.stringify(body ?? {}),
    },
  );
}

export async function reviewTenantAiApprovalRequest(
  token: string,
  tenantSlug: string,
  agentKey: string,
  requestId: string,
  body: {
    status: 'approved' | 'rejected';
    reviewNote?: string | null;
  },
): Promise<AiApprovalRequestResponse> {
  return request<AiApprovalRequestResponse>(
    `/ai/tenants/${encodeURIComponent(
      tenantSlug,
    )}/agents/${encodeURIComponent(
      agentKey,
    )}/approval-requests/${encodeURIComponent(requestId)}/review`,
    {
      method: 'POST',
      token,
      body: JSON.stringify(body),
    },
  );
}

export async function executeTenantAiGuardedExecution(
  token: string,
  tenantSlug: string,
  agentKey: string,
  requestId: string,
  body: {
    caseId?: string;
    invoiceId?: string;
    launchPlanId?: string;
  },
): Promise<AiGuardedExecutionExecutionResponse> {
  return request<AiGuardedExecutionExecutionResponse>(
    `/ai/tenants/${encodeURIComponent(
      tenantSlug,
    )}/agents/${encodeURIComponent(
      agentKey,
    )}/approval-requests/${encodeURIComponent(requestId)}/guarded-execution`,
    {
      method: 'POST',
      token,
      body: JSON.stringify(body),
    },
  );
}

export async function rollbackTenantAiGuardedExecution(
  token: string,
  tenantSlug: string,
  agentKey: string,
  requestId: string,
  body: {
    caseId?: string;
    invoiceId?: string;
    launchPlanId?: string;
  },
): Promise<AiGuardedExecutionRollbackExecutionResponse> {
  return request<AiGuardedExecutionRollbackExecutionResponse>(
    `/ai/tenants/${encodeURIComponent(
      tenantSlug,
    )}/agents/${encodeURIComponent(
      agentKey,
    )}/approval-requests/${encodeURIComponent(requestId)}/guarded-execution-rollback`,
    {
      method: 'POST',
      token,
      body: JSON.stringify(body),
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
  routingPolicyKey?:
    | 'growth_ops'
    | 'escalation_review'
    | 'owner_assignment'
    | 'follow_up_team'
    | 'follow_up_waiting_customer',
): Promise<GrowthOperationalCaseResponse[]> {
  const params = new URLSearchParams();

  if (status) {
    params.set('status', status);
  }

  if (routingPolicyKey) {
    params.set('routingPolicyKey', routingPolicyKey);
  }

  const query = params.size > 0 ? `?${params.toString()}` : '';

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

export async function reviewGrowthOperationalCaseRouting(
  token: string,
  tenantSlug: string,
): Promise<GrowthOperationalCaseRoutingReviewResponse> {
  return request<GrowthOperationalCaseRoutingReviewResponse>(
    `/growth/tenants/${encodeURIComponent(
      tenantSlug,
    )}/conversations/operational-cases/review-routing`,
    {
      method: 'POST',
      token,
    },
  );
}

export async function fetchGrowthOperationalCaseAutoAssignmentSettings(
  token: string,
  tenantSlug: string,
): Promise<GrowthOperationalCaseAutoAssignmentSettingsResponse> {
  return request<GrowthOperationalCaseAutoAssignmentSettingsResponse>(
    `/growth/tenants/${encodeURIComponent(
      tenantSlug,
    )}/conversations/operational-cases/auto-assignment-settings`,
    {
      method: 'GET',
      token,
    },
  );
}

export async function upsertGrowthOperationalCaseAutoAssignmentSettings(
  token: string,
  tenantSlug: string,
  input: {
    defaultPolicyKey: 'balanced' | 'owner_queue_first' | 'follow_up_first';
  },
): Promise<GrowthOperationalCaseAutoAssignmentSettingsResponse> {
  return request<GrowthOperationalCaseAutoAssignmentSettingsResponse>(
    `/growth/tenants/${encodeURIComponent(
      tenantSlug,
    )}/conversations/operational-cases/auto-assignment-settings`,
    {
      method: 'PUT',
      token,
      body: JSON.stringify(input),
    },
  );
}

export async function autoAssignGrowthOperationalCases(
  token: string,
  tenantSlug: string,
  input?: {
    policyKey?: 'balanced' | 'owner_queue_first' | 'follow_up_first';
  },
): Promise<GrowthOperationalCaseAutoAssignmentResponse> {
  return request<GrowthOperationalCaseAutoAssignmentResponse>(
    `/growth/tenants/${encodeURIComponent(
      tenantSlug,
    )}/conversations/operational-cases/auto-assign`,
    {
      method: 'POST',
      token,
      body: input ? JSON.stringify(input) : undefined,
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
