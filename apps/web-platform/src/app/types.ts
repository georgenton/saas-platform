export interface AuthenticatedInvitationResponse {
  invitation: {
    id: string;
    email: string;
    roleKey: string;
    status: string;
    invitedByUserId: string;
    acceptedByUserId: string | null;
    expiresAt: string;
    acceptedAt: string | null;
    createdAt: string;
    updatedAt: string;
  };
  tenant: {
    id: string;
    name: string;
    slug: string;
    status: string;
  };
  canAccept: boolean;
}

export interface InvitationResponse {
  id: string;
  tenantId: string;
  email: string;
  roleKey: string;
  status: string;
  invitedByUserId: string;
  acceptedByUserId: string | null;
  expiresAt: string;
  acceptedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SessionTenancy {
  tenant: {
    id: string;
    name: string;
    slug: string;
    status: string;
  };
  membership: {
    id: string;
    status: string;
    invitedBy: string | null;
    createdAt: string;
    updatedAt: string;
  };
  roleKeys: string[];
  permissionKeys: string[];
  subscription?: {
    id: string;
    tenantId: string;
    planId: string;
    status: string;
    startedAt: string;
    expiresAt: string | null;
    trialEndsAt: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
  entitlements?: SessionEntitlement[];
}

export interface SessionEntitlement {
  id: string;
  tenantId: string;
  key: string;
  value: unknown;
  source: string;
  createdAt: string;
  updatedAt: string;
}

export interface SessionPendingInvitation {
  invitation: {
    id: string;
    email: string;
    roleKey: string;
    status: string;
    invitedByUserId: string;
    acceptedByUserId: string | null;
    expiresAt: string;
    acceptedAt: string | null;
    createdAt: string;
    updatedAt: string;
  };
  tenant: {
    id: string;
    name: string;
    slug: string;
    status: string;
  };
}

export interface AuthenticatedSessionResponse {
  id: string;
  email: string | null;
  provider: string | null;
  externalAuthId: string | null;
  currentTenancy: SessionTenancy | null;
  pendingInvitations: SessionPendingInvitation[];
  sessionState: {
    canSelectTenancy: boolean;
    hasPendingInvitations: boolean;
    hasTenancies: boolean;
    recommendedFlow:
      | 'workspace'
      | 'select-tenancy'
      | 'accept-invitation'
      | 'empty';
  };
  tenancies: SessionTenancy[];
}

export interface PlatformPlan {
  id: string;
  key: string;
  name: string;
  description: string | null;
  priceInCents: number;
  currency: string;
  billingCycle: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PlatformProduct {
  id: string;
  key: string;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerResponse {
  id: string;
  tenantId: string;
  name: string;
  email: string | null;
  taxId: string | null;
  identificationType: string | null;
  identification: string | null;
  billingAddress: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TaxRateResponse {
  id: string;
  tenantId: string;
  name: string;
  percentage: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IssuerProfileResponse {
  id: string;
  tenantId: string;
  legalName: string;
  commercialName: string | null;
  taxId: string;
  environment: string;
  emissionType: string;
  accountingObligated: boolean;
  specialTaxpayerCode: string | null;
  rimpeTaxpayerType: string | null;
  matrixAddress: string;
  establishmentAddress: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceNumberingSettingsResponse {
  id: string;
  tenantId: string;
  documentCode: string;
  establishmentCode: string;
  emissionPointCode: string;
  nextSequenceNumber: number;
  previewNumber: string;
  createdAt: string;
  updatedAt: string;
}

export interface ElectronicSignatureSettingsResponse {
  id: string;
  tenantId: string;
  provider: string;
  certificateLabel: string;
  storageMode: string;
  certificateFingerprint: string | null;
  pkcs12SecretRef: string | null;
  privateKeyPasswordSecretRef: string | null;
  subjectName: string | null;
  materialConfigured: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ElectronicSignatureMaterialInspectionResponse {
  tenantSlug: string;
  signatureProvider: string | null;
  certificateLabel: string | null;
  storageMode: string | null;
  isActive: boolean;
  materialConfigured: boolean;
  inspection: {
    status: 'not_configured' | 'not_applicable' | 'likely_usable' | 'invalid';
    detail: string;
    encoding: 'not_applicable' | 'base64_der' | 'pem_like' | 'unknown';
    probeMethod: 'not_applicable' | 'shape_only' | 'openssl_pkcs12';
    certificateValidityStatus:
      | 'not_applicable'
      | 'unknown'
      | 'valid'
      | 'expiring_soon'
      | 'expired'
      | 'not_yet_valid';
    cryptographicProofStatus:
      | 'not_applicable'
      | 'unknown'
      | 'verified'
      | 'failed';
    cryptographicProofDetail: string;
    passwordPresent: boolean;
    hasAdvisoryWarning: boolean;
    fingerprintPresent: boolean;
    subjectNamePresent: boolean;
    extractedFingerprint: string | null;
    extractedTaxId: string | null;
    extractedSubjectName: string | null;
    extractedIssuerName: string | null;
    validFrom: string | null;
    validUntil: string | null;
    daysUntilExpiry: number | null;
    byteLength: number | null;
  };
}

export interface ElectronicSubmissionSettingsResponse {
  id: string;
  tenantId: string;
  provider: string;
  environment: string;
  transmissionMode: string;
  receptionUrl: string | null;
  authorizationUrl: string | null;
  credentialsSecretRef: string | null;
  timeoutMs: number;
  gatewayConfigured: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ElectronicSandboxReadinessResponse {
  tenantSlug: string;
  stage: 'electronic_invoicing_ec_mvp';
  environment: 'test' | 'production' | null;
  signatureProvider: string | null;
  submissionProvider: string | null;
  transmissionMode: string | null;
  internalSignerMaterialStatus:
    | 'not_configured'
    | 'not_applicable'
    | 'likely_usable'
    | 'invalid';
  internalSignerMaterialDetail: string;
  isInternalSignerMaterialReady: boolean;
  internalSignerCertificateValidityStatus:
    | 'not_applicable'
    | 'unknown'
    | 'valid'
    | 'expiring_soon'
    | 'expired'
    | 'not_yet_valid';
  internalSignerCertificateValidityDetail: string;
  internalSignerCertificateValidUntil: string | null;
  isInternalSignerCertificateCurrentlyValid: boolean;
  internalSignerCryptoProofStatus:
    | 'not_applicable'
    | 'unknown'
    | 'verified'
    | 'failed';
  internalSignerCryptoProofDetail: string;
  isInternalSignerCryptographicallyReady: boolean;
  internalSignerOfflineCompatibilityStatus:
    | 'not_applicable'
    | 'unknown'
    | 'verified'
    | 'failed';
  internalSignerOfflineCompatibilityDetail: string;
  isInternalSignerOfflineCompatible: boolean;
  internalSignerIssuerAlignmentStatus:
    | 'not_applicable'
    | 'unknown'
    | 'matched'
    | 'mismatched';
  internalSignerIssuerAlignmentDetail: string;
  internalSignerExtractedTaxId: string | null;
  isInternalSignerIssuerAligned: boolean;
  latestRemoteSriSubmissionStatus: string | null;
  latestRemoteSriSubmissionSummary: string | null;
  latestRemoteSriSubmissionCategory:
    | 'taxpayer_not_registered'
    | 'xml_structure'
    | 'authorization_rejected'
    | 'technical_failure'
    | 'unknown'
    | null;
  latestRemoteSriSubmissionOccurredAt: string | null;
  isReadyForLocalStubSubmission: boolean;
  isReadyForRemoteSandboxSubmission: boolean;
  isReadyForPresignedRemoteSandboxSubmission: boolean;
  blockers: string[];
  warnings: string[];
  checks: Array<{
    key: string;
    label: string;
    status: 'ready' | 'warning' | 'blocked';
    detail: string;
  }>;
  documentSupport: Array<{
    documentCode: '01' | '04' | '05' | '06' | '07';
    label: string;
    numberingConfigured: boolean;
    previewAvailable: boolean;
    rideAvailable: boolean;
    schemaValidationAvailable: boolean;
    submitSupported: boolean;
    detail: string;
  }>;
  recommendedNextStep: string;
}

export interface InvoiceTotals {
  subtotalInCents: number;
  taxInCents: number;
  totalInCents: number;
}

export interface InvoiceSettlement {
  paidInCents: number;
  balanceDueInCents: number;
  isFullyPaid: boolean;
}

export interface PaymentResponse {
  id: string;
  tenantId: string;
  invoiceId: string;
  amountInCents: number;
  currency: string;
  status: string;
  method: string;
  reference: string | null;
  paidAt: string;
  notes: string | null;
  reversedAt: string | null;
  reversalReason: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceItemResponse {
  id: string;
  tenantId: string;
  invoiceId: string;
  position: number;
  description: string;
  quantity: number;
  unitPriceInCents: number;
  lineTotalInCents: number;
  taxRateId: string | null;
  taxRateName: string | null;
  taxRatePercentage: number | null;
  lineTaxInCents: number;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceSummaryResponse {
  id: string;
  tenantId: string;
  customerId: string;
  number: string;
  documentCode: string | null;
  establishmentCode: string | null;
  emissionPointCode: string | null;
  sequenceNumber: number | null;
  buyerIdentificationType: string | null;
  buyerIdentification: string | null;
  buyerName: string | null;
  buyerAddress: string | null;
  electronicStatus: string | null;
  accessKey: string | null;
  authorizationNumber: string | null;
  authorizedAt: string | null;
  electronicStatusMessage: string | null;
  signedAt: string | null;
  submittedAt: string | null;
  submissionReference: string | null;
  status: string;
  currency: string;
  issuedAt: string;
  dueAt: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  itemCount: number;
  totals: InvoiceTotals;
  settlement: InvoiceSettlement;
}

export interface InvoiceDetailResponse {
  id: string;
  tenantId: string;
  customerId: string;
  number: string;
  documentCode: string | null;
  establishmentCode: string | null;
  emissionPointCode: string | null;
  sequenceNumber: number | null;
  buyerIdentificationType: string | null;
  buyerIdentification: string | null;
  buyerName: string | null;
  buyerAddress: string | null;
  electronicStatus: string | null;
  accessKey: string | null;
  authorizationNumber: string | null;
  authorizedAt: string | null;
  electronicStatusMessage: string | null;
  signedAt: string | null;
  submittedAt: string | null;
  submissionReference: string | null;
  status: string;
  currency: string;
  issuedAt: string;
  dueAt: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  items: InvoiceItemResponse[];
  payments: PaymentResponse[];
  electronicEvents: {
    id: string;
    tenantId: string;
    invoiceId: string;
    eventType: string;
    provider: string;
    providerStatus: string;
    endpoint: string | null;
    soapAction: string | null;
    message: string;
    requestPayload: string | null;
    responsePayload: string | null;
    submissionReference: string | null;
    authorizationNumber: string | null;
    occurredAt: string;
    sriDiagnostics: {
      state: string | null;
      authorizationNumber: string | null;
      authorizationDate: string | null;
      accessKey: string | null;
      summary: string | null;
      messages: Array<{
        identifier: string | null;
        message: string;
        additionalInfo: string[];
      }>;
    } | null;
  }[];
  totals: InvoiceTotals;
  settlement: InvoiceSettlement;
}

export interface CreditNoteResponse {
  invoice: InvoiceDetailResponse;
  creditNote: {
    sourceInvoiceId: string | null;
    sourceInvoiceNumber: string | null;
    sourceInvoiceIssuedAt: string | null;
    reason: string | null;
  };
}

export interface DebitNoteResponse {
  invoice: InvoiceDetailResponse;
  debitNote: {
    sourceInvoiceId: string | null;
    sourceInvoiceNumber: string | null;
    sourceInvoiceIssuedAt: string | null;
    reason: string | null;
    amountInCents: number;
  };
}

export interface RemissionGuideResponse {
  invoice: InvoiceDetailResponse;
  remissionGuide: {
    sourceInvoiceId: string | null;
    sourceInvoiceNumber: string | null;
    sourceInvoiceIssuedAt: string | null;
    shipmentReason: string | null;
    shipmentStartAt: string | null;
    shipmentEndAt: string | null;
    departureAddress: string | null;
    arrivalAddress: string | null;
    carrierName: string | null;
    carrierIdentificationType: string | null;
    carrierIdentification: string | null;
    vehiclePlate: string | null;
    destinationRoute: string | null;
  };
}

export interface WithholdingResponse {
  invoice: InvoiceDetailResponse;
  withholding: {
    sourceInvoiceId: string | null;
    sourceInvoiceNumber: string | null;
    sourceInvoiceIssuedAt: string | null;
    reason: string | null;
    amountInCents: number;
  };
}

export interface InvoiceDocumentResponse {
  issuer: {
    tenantId: string;
    tenantName: string;
    tenantSlug: string;
    legalName: string;
    commercialName: string | null;
    taxId: string | null;
    environment: string | null;
    emissionType: string | null;
    accountingObligated: boolean | null;
    specialTaxpayerCode: string | null;
    rimpeTaxpayerType: string | null;
    matrixAddress: string | null;
    establishmentAddress: string | null;
  };
  customer: {
    name: string;
    email: string | null;
    taxId: string | null;
    identificationType: string | null;
    identification: string | null;
    billingAddress: string | null;
  };
  invoice: {
    id: string;
    tenantId: string;
    customerId: string;
    number: string;
    documentCode: string | null;
    establishmentCode: string | null;
    emissionPointCode: string | null;
    sequenceNumber: number | null;
    buyerIdentificationType: string | null;
    buyerIdentification: string | null;
    buyerName: string | null;
    buyerAddress: string | null;
    electronicStatus: string | null;
    accessKey: string | null;
    authorizationNumber: string | null;
    authorizedAt: string | null;
    electronicStatusMessage: string | null;
    signedAt: string | null;
    submittedAt: string | null;
    submissionReference: string | null;
    status: string;
    currency: string;
    issuedAt: string;
    dueAt: string | null;
    notes: string | null;
    createdAt: string;
    updatedAt: string;
  };
  lines: {
    id: string;
    position: number;
    description: string;
    quantity: number;
    unitPriceInCents: number;
    lineSubtotalInCents: number;
    taxRateId: string | null;
    taxRateName: string | null;
    taxRatePercentage: number | null;
    lineTaxInCents: number;
    lineTotalInCents: number;
  }[];
  totals: InvoiceTotals;
}

export interface InvoiceRideResponse {
  issuer: InvoiceDocumentResponse['issuer'];
  customer: InvoiceDocumentResponse['customer'];
  invoice: InvoiceDocumentResponse['invoice'];
  lines: InvoiceDocumentResponse['lines'];
  totals: InvoiceTotals;
  ride: {
    documentLabel: string;
    environmentLabel: string;
    emissionTypeLabel: string;
    sequenceDisplay: string | null;
    electronicStatusLabel: string;
    canBePrintedAsAuthorized: boolean;
    accessKey: string | null;
    accessKeyChunks: string[];
    authorizationNumber: string | null;
    authorizedAt: string | null;
    authorizationMessage: string | null;
    additionalInfoFields: Array<{
      label: string;
      value: string;
    }>;
  };
}

export interface InvoiceElectronicArtifactsResponse {
  fileBaseName: string;
  rideHtmlFileName: string;
  xmlFileName: string;
  accessKey: string | null;
  electronicStatus: string | null;
  canDownloadRide: boolean;
  canDownloadXml: boolean;
}

export interface InvoicingReportSummaryResponse {
  generatedAt: string;
  customerCount: number;
  invoiceCount: number;
  statusBreakdown: {
    status: string;
    count: number;
  }[];
  totalsByCurrency: {
    currency: string;
    subtotalInCents: number;
    taxInCents: number;
    totalInCents: number;
    paidInCents: number;
    outstandingTotalInCents: number;
  }[];
  monthlyTotals: {
    month: string;
    currency: string;
    invoiceCount: number;
    totalInCents: number;
    taxInCents: number;
  }[];
}

export interface InvoiceDocumentDraftingAssistResponse {
  tenantSlug: string;
  generatedAt: string;
  summary: {
    tone: 'healthy' | 'warning' | 'critical';
    readinessStatus: 'ready' | 'needs_attention' | 'blocked';
    headline: string;
    detail: string;
    suggestedFocus: string;
  };
  checklist: Array<{
    key: string;
    label: string;
    status: 'ready' | 'warning' | 'blocked';
    detail: string;
  }>;
  documentGuidance: Array<{
    documentCode: '01' | '04' | '05' | '06' | '07';
    label: string;
    status: 'ready' | 'warning' | 'blocked';
    detail: string;
    recommendedUse: string;
  }>;
  reportSnapshot: {
    customerCount: number;
    invoiceCount: number;
    outstandingTotalInCents: number;
    dominantStatus: string | null;
    busiestMonth: string | null;
  };
  draftingHints: Array<{
    key: string;
    title: string;
    objective: string;
    whenToUse: string;
    recommendedInputs: string[];
    caution: string;
  }>;
  safeActions: string[];
  blockedActions: string[];
}

export interface GrowthConversationWorkbenchThreadResponse {
  threadId: string;
  leadId: string | null;
  assigneeUserId: string | null;
  subject: string;
  channel: string;
  status: string;
  latestMessagePreview: string | null;
  nextActionOwner: string;
  firstResponseStatus: string;
  followUpStatus: string;
  staleStatus: string;
  priority: string;
  messageCount: number;
  hoursSinceLastActivity: number;
  hoursSinceLastInbound: number | null;
  hoursSinceOpened: number;
  openedAt: string;
  lastActivityAt: string;
  lastInboundAt: string | null;
  lastOutboundAt: string | null;
}

export interface GrowthConversationWorkbenchResponse {
  tenantSlug: string;
  generatedAt: string;
  policy: {
    firstResponseSlaHours: number;
    followUpSlaHours: number;
    staleThreadHours: number;
  };
  summary: {
    openThreadCount: number;
    unassignedThreadCount: number;
    waitingOnTeamCount: number;
    waitingOnCustomerCount: number;
    overdueFirstResponseCount: number;
    overdueFollowUpCount: number;
    staleThreadCount: number;
  };
  threads: GrowthConversationWorkbenchThreadResponse[];
}

export interface WhatsappProviderReportingResponse {
  provider: string;
  messageCount: number;
  pendingCount: number;
  sentCount: number;
  deliveredCount: number;
  readCount: number;
  failedCount: number;
}

export interface WhatsappFailureClassReportingResponse {
  provider: string;
  failureClass: string;
  failurePhase: string;
  messageCount: number;
  retryableCount: number;
  permanentCount: number;
}

export interface WhatsappProviderTaxonomyReportingResponse {
  provider: string;
  providerTaxonomyFamily: string;
  providerTaxonomyDetail: string;
  failureClass: string;
  failurePhase: string;
  messageCount: number;
  retryableCount: number;
  permanentCount: number;
}

export interface WhatsappProviderErrorCodeReportingResponse {
  provider: string;
  providerErrorCode: string;
  failureClass: string;
  failurePhase: string;
  retryDisposition: string;
  providerTaxonomyFamily: string;
  providerTaxonomyDetail: string;
  occurrenceCount: number;
  latestFailureReason: string | null;
  latestProviderStatusDetail: string | null;
}

export interface WhatsappRetryOperationsSummaryResponse {
  totalFailedMessageCount: number;
  retryableFailedMessageCount: number;
  permanentFailedMessageCount: number;
  cooldownBlockedCount: number;
  readyNowCount: number;
  defaultBaseBackoffMinutes: number;
  maxBackoffMinutes: number;
}

export interface WhatsappOperationalThresholdsResponse {
  immediateSendRejectionRateWarning: number;
  asynchronousDeliveryFailureRateWarning: number;
  readyRetryQueueWarningCount: number;
  cooldownRetryQueueWarningCount: number;
  authOrConfigurationCriticalCount: number;
  policyBlockCriticalCount: number;
  rateLimitedWarningCount: number;
  unknownFailureWarningCount: number;
}

export interface WhatsappOperationalDashboardResponse {
  overallStatus: 'healthy' | 'warning' | 'critical';
  immediateSendRejectionRate: number;
  asynchronousDeliveryFailureRate: number;
  readyRetryQueueCount: number;
  cooldownRetryQueueCount: number;
  permanentFailureCount: number;
  leadingFailureClass: string | null;
  leadingProvider: string | null;
  leadingProviderTaxonomyFamily: string | null;
  leadingProviderTaxonomyDetail: string | null;
}

export interface WhatsappOperationalAlertResponse {
  key: string;
  severity: 'warning' | 'critical';
  title: string;
  summary: string;
  thresholdKey: string;
  observedValue: number;
  thresholdValue: number;
  thresholdUnit: 'count' | 'rate';
  provider: string | null;
  failureClass: string | null;
  providerTaxonomyFamily: string | null;
  providerTaxonomyDetail: string | null;
  affectedMessageCount: number;
  recommendedAction: string;
}

export interface WhatsappOutboundReportingSummaryResponse {
  tenantSlug: string;
  generatedAt: string;
  totals: {
    outboundMessageCount: number;
    freeformMessageCount: number;
    templateMessageCount: number;
    approvedTemplateMessageCount: number;
    pendingCount: number;
    sentCount: number;
    deliveredCount: number;
    readCount: number;
    failedCount: number;
    immediateSendRejectionFailedCount: number;
    asynchronousDeliveryFailedCount: number;
    retryableFailedCount: number;
    permanentFailedCount: number;
  };
  byProvider: WhatsappProviderReportingResponse[];
  byFailureClass: WhatsappFailureClassReportingResponse[];
  byProviderTaxonomy: WhatsappProviderTaxonomyReportingResponse[];
  topProviderErrorCodes: WhatsappProviderErrorCodeReportingResponse[];
  retryOperations: WhatsappRetryOperationsSummaryResponse;
  operationalThresholds: WhatsappOperationalThresholdsResponse;
  operationalDashboard: WhatsappOperationalDashboardResponse;
  operationalAlerts: WhatsappOperationalAlertResponse[];
}

export interface WhatsappRetryRunnerExecutionResponse {
  sourceMessageId: string;
  sourceExternalMessageId: string | null;
  disposition: string;
  status: string;
  failedAttemptCount: number;
  backoffMinutes: number;
  nextRetryAt: string;
  retryMessageId: string | null;
  retryExternalMessageId: string | null;
}

export interface WhatsappRetryRunnerSummaryResponse {
  tenantSlug: string;
  generatedAt: string;
  limitApplied: number;
  candidateFailedMessageCount: number;
  leafFailedMessageCount: number;
  supersededFailedMessageCount: number;
  readyNowCount: number;
  retriedCount: number;
  skippedCooldownCount: number;
  skippedPermanentCount: number;
  executions: WhatsappRetryRunnerExecutionResponse[];
}

export interface WhatsappOperationalMonitorSummaryResponse {
  tenantSlug: string;
  generatedAt: string;
  autoRunReadyRetriesEnabled: boolean;
  overallStatus: 'healthy' | 'warning' | 'critical';
  totalAlertCount: number;
  criticalAlertCount: number;
  warningAlertCount: number;
  operationalThresholds: WhatsappOperationalThresholdsResponse;
  operationalDashboard: WhatsappOperationalDashboardResponse;
  operationalAlerts: WhatsappOperationalAlertResponse[];
  retryRunnerExecuted: boolean;
  retryRunnerSummary: WhatsappRetryRunnerSummaryResponse | null;
}

export interface WhatsappOperationalMonitorRunResponse {
  id: string;
  triggerSource: 'manual' | 'scheduler';
  generatedAt: string;
  autoRunReadyRetriesEnabled: boolean;
  overallStatus: 'healthy' | 'warning' | 'critical';
  totalAlertCount: number;
  criticalAlertCount: number;
  warningAlertCount: number;
  operationalThresholds: WhatsappOperationalThresholdsResponse;
  operationalDashboard: WhatsappOperationalDashboardResponse;
  operationalAlerts: WhatsappOperationalAlertResponse[];
  retryRunnerExecuted: boolean;
  retryRunnerSummary: WhatsappRetryRunnerSummaryResponse | null;
  createdAt: string;
}

export interface WhatsappOperationalAlertAcknowledgementResponse {
  id: string;
  alertKey: string;
  title: string;
  severity: 'warning' | 'critical';
  summary: string;
  provider: string | null;
  failureClass: string | null;
  providerTaxonomyFamily: string | null;
  providerTaxonomyDetail: string | null;
  affectedMessageCount: number;
  recommendedAction: string;
  lastSeenGeneratedAt: string | null;
  acknowledgedAt: string;
  acknowledgedByUserId: string;
  acknowledgedByEmail: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GrowthOperationalCaseResponse {
  id: string;
  sourceKey: string;
  caseType: 'alert_escalation' | 'ownership_routing' | 'follow_up';
  status: 'open' | 'in_progress' | 'resolved';
  priority: 'warning' | 'critical';
  title: string;
  summary: string;
  nextAction: string;
  followUpState: 'pending_team' | 'scheduled' | 'waiting_customer' | null;
  routingPolicyKey:
    | 'growth_ops'
    | 'escalation_review'
    | 'owner_assignment'
    | 'follow_up_team'
    | 'follow_up_waiting_customer';
  threadId: string | null;
  alertKey: string | null;
  dueAt: string | null;
  assignedUserId: string | null;
  assignedUserEmail: string | null;
  createdByUserId: string;
  createdByEmail: string | null;
  resolvedAt: string | null;
  resolvedByUserId: string | null;
  resolvedByEmail: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GrowthOperationalCaseRoutingReviewResponse {
  reviewedCount: number;
  updatedCount: number;
  escalationReviewCount: number;
  cases: GrowthOperationalCaseResponse[];
}

export interface GrowthOperationalCaseAutoAssignmentResponse {
  policyKey: 'balanced' | 'owner_queue_first' | 'follow_up_first';
  candidateCount: number;
  reviewedCount: number;
  assignedCount: number;
  threadAssignmentCount: number;
  inheritedOwnerCount: number;
  fallbackAssignmentCount: number;
  cases: GrowthOperationalCaseResponse[];
}

export interface GrowthOperationalCaseAutoAssignmentSettingsResponse {
  id: string;
  tenantId: string;
  defaultPolicyKey: 'balanced' | 'owner_queue_first' | 'follow_up_first';
  createdAt: string;
  updatedAt: string;
}

export interface GrowthAssistTaskResponse {
  key: string;
  urgency: 'today' | 'soon' | 'watch';
  category: 'reply_now' | 'follow_up' | 'assign_owner' | 'channel_risk';
  title: string;
  summary: string;
  actionLabel: string;
  dueAt: string | null;
  threadId: string | null;
  operationalCaseId: string | null;
}

export interface GrowthAssistConversationCueResponse {
  key: string;
  warmth: 'hot' | 'warm' | 'watch';
  title: string;
  summary: string;
  suggestedReply: string;
  nextMove: string;
  threadId: string;
}

export interface GrowthAssistReplySuggestionResponse {
  key: string;
  warmth: 'hot' | 'warm' | 'watch';
  title: string;
  reason: string;
  goal: string;
  suggestedReply: string;
  followUpPrompt: string;
  checklist: string[];
  threadId: string;
}

export interface GrowthAssistNextActionResponse {
  key: string;
  emphasis: 'do_now' | 'today' | 'stabilize';
  actionType: 'reply_now' | 'follow_up' | 'assign_owner' | 'channel_risk';
  title: string;
  whyNow: string;
  recommendedAction: string;
  businessImpact: string;
  threadId: string | null;
  operationalCaseId: string | null;
}

export interface GrowthAssistLeadWarmthHintResponse {
  key: string;
  warmth: 'hot' | 'warm' | 'watch';
  title: string;
  signalSummary: string;
  whyWarmth: string;
  recommendedCadence: string;
  riskNote: string;
  threadId: string;
}

export interface GrowthAssistPlaybookResponse {
  key: string;
  title: string;
  detail: string;
  goal: string;
  avoid: string;
  successSignal: string;
  whenToUse: string;
  steps: string[];
}

export interface GrowthAssistWaitingCustomerResponse {
  caseId: string;
  title: string;
  summary: string;
  nextAction: string;
  assignedUserEmail: string | null;
  dueAt: string | null;
}

export interface GrowthAssistDailyAgendaResponse {
  tenantSlug: string;
  generatedAt: string;
  summary: {
    tone: 'healthy' | 'warning' | 'critical';
    headline: string;
    detail: string;
    replyNowCount: number;
    followUpNowCount: number;
    waitingCustomerCount: number;
    queueToOrganizeCount: number;
    channelRiskCount: number;
    savedPolicyKey: 'balanced' | 'owner_queue_first' | 'follow_up_first';
  };
  leadWarmthSummary: {
    hotCount: number;
    warmCount: number;
    watchCount: number;
    dominantWarmth: 'hot' | 'warm' | 'watch' | 'none';
    recommendedFocus: string;
  };
  tasks: GrowthAssistTaskResponse[];
  conversationCues: GrowthAssistConversationCueResponse[];
  replySuggestions: GrowthAssistReplySuggestionResponse[];
  nextActions: GrowthAssistNextActionResponse[];
  leadWarmthHints: GrowthAssistLeadWarmthHintResponse[];
  playbooks: GrowthAssistPlaybookResponse[];
  waitingCustomerQueue: GrowthAssistWaitingCustomerResponse[];
  channelHealth: {
    overallStatus: 'healthy' | 'warning' | 'critical';
    totalAlertCount: number;
    readyRetryCount: number;
    topAlertTitle: string | null;
    topAlertSummary: string | null;
    topAlertRecommendedAction: string | null;
  };
}

export interface AiAgentCatalogResponse {
  key: string;
  title: string;
  summary: string;
  domainKey: 'growth' | 'invoicing' | 'ecommerce';
  productKey: string;
  availability: 'ready' | 'planned';
  defaultMode: 'suggestion' | 'guarded_execution';
  supportedSurfaceKeys: string[];
}

export interface AiOperatingModelAgentResponse {
  agent: {
    key: string;
    title: string;
    summary: string;
    domainKey: 'growth' | 'invoicing' | 'ecommerce';
    productKey: string;
    availability: 'ready' | 'planned';
    defaultMode: 'suggestion' | 'guarded_execution';
    supportedSurfaceKeys: string[];
  };
  requiredPermissionKey: string;
  primarySurface: {
    key: string;
    title: string;
    sourceContractKey: string;
  };
  promptPack: {
    key: string;
    version: string;
    mode: 'suggestion' | 'guarded_execution';
    title: string;
    summary: string;
    objective: string;
  };
  approvalPolicies: Array<{
    policyKey: string;
    agentKey: string;
    scope: 'suggestion_review';
    title: string;
    summary: string;
    reviewGuidance: string;
    approvalRequired: boolean;
  }>;
  primaryApprovalPolicyKey: string | null;
  approvalPolicyKeys: string[];
  toolAccess: Array<{
    tool: {
      key: string;
      title: string;
      summary: string;
      domainKey: 'growth' | 'invoicing' | 'ecommerce';
      availability: 'ready' | 'planned';
      riskLevel: 'low' | 'medium' | 'high';
      actionKind: 'read' | 'draft' | 'propose' | 'execute';
      requiresApproval: boolean;
      inputContract: {
        sourceSurfaceKeys: string[];
        primaryPayload: string;
        requiredContext: string[];
      };
      outputContract: {
        primaryArtifact: string;
        suggestedOutputKeys: string[];
        humanReviewFocus: string[];
      };
      executionBoundary: {
        executionMode: 'suggestion_only' | 'guarded_execution_planned';
        stateMutation: 'none' | 'planned';
        externalSideEffects: 'none' | 'planned';
        reviewRequirement: string;
        blockedCapabilities: string[];
      };
    };
    accessLevel: 'allowed' | 'approval_required' | 'blocked';
    rationale: string;
  }>;
  handoffContract: {
    requestApprovalRationale: string;
    reviewNotes: {
      approved: string;
      rejected: string;
    };
  };
  guardedExecutionCandidateToolKey: string | null;
  guardedExecutionCandidate: {
    toolKey: string;
    title: string;
    targetKind:
      | 'growth_operational_case'
      | 'invoice'
      | 'ecommerce_launch_plan';
    operatingLane:
      | 'operational_case_assignment_lane'
      | 'single_record_execution_lane';
    blastRadius: 'single_record' | 'single_queue_lane';
    safeFallbackMode:
      | 'suggestion_only'
      | 'suggestion_only_with_manual_assignment';
    preferredPilotTypeWhenReady:
      | 'human_gate_then_execute'
      | 'shadow_review';
    targetSelectionLabel: string;
    emptyTargetSelectionLabel: string;
    executeActionLabel: string;
    rollbackActionLabel: string;
  } | null;
}

export interface AiOperatingModelResponse {
  version: string;
  agents: AiOperatingModelAgentResponse[];
  counts: {
    totalAgents: number;
    readyAgents: number;
    plannedAgents: number;
    agentsWithApprovalPolicies: number;
    agentsWithGuardedExecutionCandidate: number;
    totalToolAccessEntries: number;
    approvalRequiredToolAccessEntries: number;
    blockedToolAccessEntries: number;
  };
}

export interface AiPromptRegistryResponse {
  key: string;
  version: string;
  agentKey: string;
  mode: 'suggestion' | 'guarded_execution';
  title: string;
  summary: string;
  objective: string;
  styleGuidance: string[];
  constraints: string[];
  suggestedOutputs: {
    key: string;
    label: string;
    description: string;
  }[];
}

export interface AiToolRegistryResponse {
  key: string;
  title: string;
  summary: string;
  domainKey: 'growth' | 'invoicing' | 'ecommerce';
  availability: 'ready' | 'planned';
  riskLevel: 'low' | 'medium' | 'high';
  actionKind: 'read' | 'draft' | 'propose' | 'execute';
  requiresApproval: boolean;
  inputContract: {
    sourceSurfaceKeys: string[];
    primaryPayload: string;
    requiredContext: string[];
  };
  outputContract: {
    primaryArtifact: string;
    suggestedOutputKeys: string[];
    humanReviewFocus: string[];
  };
  executionBoundary: {
    executionMode: 'suggestion_only' | 'guarded_execution_planned';
    stateMutation: 'none' | 'planned';
    externalSideEffects: 'none' | 'planned';
    reviewRequirement: string;
    blockedCapabilities: string[];
  };
}

export interface AiAgentToolAccessResponse {
  tool: AiToolRegistryResponse;
  accessLevel: 'allowed' | 'approval_required' | 'blocked';
  rationale: string;
}

export interface AiApprovalPolicyResponse {
  policyKey: string;
  agentKey: string;
  scope: 'suggestion_review';
  title: string;
  summary: string;
  reviewGuidance: string;
  approvalRequired: boolean;
}

export interface AiSuggestionEnvelopeResponse {
  tenantSlug: string;
  generatedAt: string;
  mode: 'suggestion';
  agent: AiAgentCatalogResponse;
  surface: {
    key: string;
    title: string;
    sourceContractKey: string;
    sourceGeneratedAt: string;
  };
  promptPack: {
    key: string;
    version: string;
    agentKey: string;
    mode: 'suggestion' | 'guarded_execution';
    title: string;
    summary: string;
    objective: string;
    styleGuidance: string[];
    constraints: string[];
    suggestedOutputs: {
      key: string;
      label: string;
      description: string;
    }[];
  };
  toolAccess: AiAgentToolAccessResponse[];
  contextBlocks: {
    key: string;
    title: string;
    detail: string;
    bullets: string[];
  }[];
  retrieval?: AiMemoryRetrievalResponse;
}

export interface AiSuggestionRunResponse {
  id: string;
  tenantSlug: string;
  agentKey: string;
  mode: 'suggestion';
  status: 'prepared';
  surfaceKey: string;
  sourceContractKey: string;
  sourceGeneratedAt: string;
  promptPackKey: string;
  promptPackVersion: string;
  generatedAt: string;
  requestedByUserId: string;
  requestedByEmail: string | null;
  summary: string;
  suggestedOutputKeys: string[];
  approvalSummary: {
    status: 'not_requested' | 'pending' | 'approved' | 'rejected';
    totalRequests: number;
    latestRequestId: string | null;
    latestPolicyKey: string | null;
    latestRequestedAt: string | null;
    latestReviewedAt: string | null;
  };
  envelope: AiSuggestionEnvelopeResponse;
  createdAt: string;
}

export interface AiSuggestionRunDetailResponse extends AiSuggestionRunResponse {
  approvalRequests: AiApprovalRequestResponse[];
}

export type AiApprovalRequestStatus = 'pending' | 'approved' | 'rejected';
export type AiApprovalRequestStatusFilter = 'all' | AiApprovalRequestStatus;

export interface AiApprovalRequestResponse {
  id: string;
  tenantSlug: string;
  agentKey: string;
  policyKey: string;
  scope: 'suggestion_review';
  suggestionRunId: string;
  requestedByUserId: string;
  requestedByEmail: string | null;
  rationale: string | null;
  summary: string;
  status: AiApprovalRequestStatus;
  reviewedAt: string | null;
  reviewedByUserId: string | null;
  reviewedByEmail: string | null;
  reviewNote: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AiActionCenterResponse {
  tenantSlug: string;
  generatedAt: string;
  counts: {
    pendingApprovalRequests: number;
    reviewableSuggestionRuns: number;
    reviewedApprovalRequests: number;
  };
  featuredPendingApprovalRequest: AiApprovalRequestResponse | null;
  featuredReviewableSuggestionRun: AiSuggestionRunResponse | null;
  latestReviewedApprovalRequest: AiApprovalRequestResponse | null;
}

export interface AiApprovalWorkspaceAgentSummaryResponse {
  agentKey: string;
  title: string;
  totalApprovalRequests: number;
  pendingApprovalRequests: number;
  approvedApprovalRequests: number;
  rejectedApprovalRequests: number;
  latestRequestedAt: string | null;
  latestReviewedAt: string | null;
}

export interface AiApprovalWorkspaceResponse {
  tenantSlug: string;
  generatedAt: string;
  counts: {
    totalApprovalRequests: number;
    pendingApprovalRequests: number;
    approvedApprovalRequests: number;
    rejectedApprovalRequests: number;
  };
  agentBreakdown: AiApprovalWorkspaceAgentSummaryResponse[];
  oldestPendingApprovalRequest: AiApprovalRequestResponse | null;
  latestReviewedApprovalRequest: AiApprovalRequestResponse | null;
  recentApprovalRequests: AiApprovalRequestResponse[];
}

export type AiActivityFeedEventType =
  | 'suggestion_run_prepared'
  | 'approval_requested'
  | 'approval_reviewed';

export interface AiActivityFeedEntryResponse {
  id: string;
  tenantSlug: string;
  agentKey: string;
  eventType: AiActivityFeedEventType;
  occurredAt: string;
  suggestionRunId: string;
  approvalRequestId: string | null;
  actorUserId: string | null;
  actorEmail: string | null;
  summary: string;
  detail: string;
}

export interface AiActivityFeedResponse {
  tenantSlug: string;
  generatedAt: string;
  entries: AiActivityFeedEntryResponse[];
}

export interface AiMemoryRecordResponse {
  id: string;
  tenantSlug: string;
  scope: 'tenant' | 'domain' | 'agent';
  domainKey: 'growth' | 'invoicing' | 'ecommerce' | null;
  agentKey: string | null;
  sourceKind: 'operator_note' | 'approval_memory' | 'guarded_execution_memory';
  freshness: 'working_memory' | 'durable_memory';
  title: string;
  summary: string;
  detail: string;
  tags: string[];
  status: 'active' | 'inactive';
  createdByUserId: string | null;
  createdByEmail: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AiMemoryRecordDetailResponse {
  tenantSlug: string;
  generatedAt: string;
  record: AiMemoryRecordResponse;
  currentRetrieval: {
    agentCount: number;
    agents: Array<{
      agentKey: string;
      title: string;
      domainKey: 'growth' | 'invoicing' | 'ecommerce';
      inclusionReason: string;
    }>;
    notes: string[];
  };
  provenance: {
    usageCount: number;
    agentsUsingCount: number;
    latestUsedAt: string | null;
    recentSuggestionRuns: Array<{
      suggestionRunId: string;
      agentKey: string;
      surfaceKey: string;
      sourceContractKey: string;
      promptPackKey: string;
      promptPackVersion: string;
      generatedAt: string;
      createdAt: string;
      requestedByUserId: string;
      requestedByEmail: string | null;
      summary: string;
      memoryScope: 'tenant' | 'domain' | 'agent';
      memoryInclusionReason: string | null;
    }>;
    notes: string[];
  };
}

export interface AiMemoryRetrievalResponse {
  retrievedAt: string;
  recordCount: number;
  policy: {
    version: 'v1';
    limit: number;
    suppressedDuplicateCount: number;
    archivedRecordCount: number;
    prioritizedRecordIds: string[];
    archivalSummary: string;
    rankingSummary: string;
  };
  records: Array<{
    id: string;
    scope: 'tenant' | 'domain' | 'agent';
    domainKey: 'growth' | 'invoicing' | 'ecommerce' | null;
    agentKey: string | null;
    sourceKind: 'operator_note' | 'approval_memory' | 'guarded_execution_memory';
    freshness: 'working_memory' | 'durable_memory';
    title: string;
    summary: string;
    detail: string;
    tags: string[];
    lastUpdatedAt: string;
    inclusionReason: string;
  }>;
  notes: string[];
}

export interface AiRetrievalWorkspaceResponse {
  tenantSlug: string;
  generatedAt: string;
  counts: {
    totalAgents: number;
    agentsWithMemory: number;
    totalRetrievedRecords: number;
    uniqueRetrievedRecords: number;
  };
  agents: Array<{
    agentKey: string;
    title: string;
    domainKey: 'growth' | 'invoicing' | 'ecommerce';
    productKey: string;
    retrieval: AiMemoryRetrievalResponse;
  }>;
}

export interface AiEcommerceLaunchWorkspaceResponse {
  tenantSlug: string;
  generatedAt: string;
  summary: {
    tone: 'healthy' | 'warning' | 'critical';
    launchReadiness: 'launch_ready' | 'needs_activation' | 'needs_core_modules';
    headline: string;
    detail: string;
    suggestedFocus: string;
  };
  moduleSnapshot: {
    productEnabled: boolean;
    activeModuleCount: number;
    coreModuleCount: number;
    optionalModuleCount: number;
    inactiveModuleKeys: string[];
  };
  checklist: Array<{
    key: string;
    label: string;
    isCore: boolean;
    status: 'ready' | 'warning' | 'blocked';
    detail: string;
  }>;
  channelGuidance: Array<{
    key: 'catalog' | 'landing' | 'campaign' | 'operations';
    title: string;
    status: 'ready' | 'warning' | 'blocked';
    detail: string;
    recommendedUse: string;
  }>;
  launchPlans: AiEcommerceLaunchPlanResponse[];
  launchHints: Array<{
    key: string;
    title: string;
    objective: string;
    whenToUse: string;
    recommendedInputs: string[];
    caution: string;
  }>;
  safeActions: string[];
  blockedActions: string[];
}

export interface AiEcommerceLaunchPlanResponse {
  id: string;
  title: string;
  status: 'ready' | 'warning' | 'blocked';
  guardedExecutionReadiness:
    | 'shadow_review_ready'
    | 'needs_activation'
    | 'needs_core_modules';
  scopeSummary: string;
  selectedChannels: Array<'catalog' | 'landing' | 'campaign'>;
  nextStep: string;
}

export type EcommerceLaunchPlanResponse = AiEcommerceLaunchPlanResponse;

export type EcommerceLaunchWorkspaceResponse = AiEcommerceLaunchWorkspaceResponse;

export interface EcommerceLaunchPlanRegistryResponse {
  tenantSlug: string;
  generatedAt: string;
  workspaceSummary: {
    tone: 'healthy' | 'warning' | 'critical';
    launchReadiness: 'launch_ready' | 'needs_activation' | 'needs_core_modules';
    headline: string;
    detail: string;
    suggestedFocus: string;
  };
  counts: {
    totalPlans: number;
    readyPlans: number;
    warningPlans: number;
    blockedPlans: number;
    shadowReviewReadyPlans: number;
    activationBlockedPlans: number;
    coreModuleBlockedPlans: number;
  };
  plans: EcommerceLaunchPlanResponse[];
}

export interface EcommerceLaunchPlanDetailResponse {
  tenantSlug: string;
  generatedAt: string;
  workspaceSummary: {
    tone: 'healthy' | 'warning' | 'critical';
    launchReadiness: 'launch_ready' | 'needs_activation' | 'needs_core_modules';
    headline: string;
    detail: string;
    suggestedFocus: string;
  };
  moduleSnapshot: {
    productEnabled: boolean;
    activeModuleCount: number;
    coreModuleCount: number;
    optionalModuleCount: number;
    inactiveModuleKeys: string[];
  };
  checklist: Array<{
    key: string;
    label: string;
    isCore: boolean;
    status: 'ready' | 'warning' | 'blocked';
    detail: string;
  }>;
  channelGuidance: Array<{
    key: 'catalog' | 'landing' | 'campaign' | 'operations';
    title: string;
    status: 'ready' | 'warning' | 'blocked';
    detail: string;
    recommendedUse: string;
  }>;
  launchHints: Array<{
    key: string;
    title: string;
    objective: string;
    whenToUse: string;
    recommendedInputs: string[];
    caution: string;
  }>;
  safeActions: string[];
  blockedActions: string[];
  plan: EcommerceLaunchPlanResponse;
}

export interface RequestEcommerceLaunchPlanActivationReadinessResponse {
  tenantSlug: string;
  generatedAt: string;
  activationStatus:
    | 'ready_for_shadow_review'
    | 'needs_activation'
    | 'needs_core_modules';
  summary: string;
  requiredActions: string[];
  blockedBy: string[];
  guardrails: string[];
  plan: EcommerceLaunchPlanResponse;
}

export interface EcommerceStoreSetupWorkspaceResponse {
  tenantSlug: string;
  generatedAt: string;
  summary: {
    tone: 'healthy' | 'warning' | 'critical';
    setupReadiness:
      | 'ready_to_configure'
      | 'needs_activation'
      | 'needs_store_foundation';
    headline: string;
    detail: string;
    suggestedFocus: string;
  };
  productSnapshot: {
    ecommerceEnabled: boolean;
    invoicingEnabled: boolean;
    enabledProductKeys: string[];
  };
  moduleSnapshot: {
    productEnabled: boolean;
    activeModuleCount: number;
    coreModuleCount: number;
    optionalModuleCount: number;
    inactiveModuleKeys: string[];
  };
  capabilities: Array<{
    key:
      | 'store_identity'
      | 'catalog_authoring'
      | 'landing_readiness'
      | 'invoicing_connection'
      | 'whatsapp_sales_flow';
    title: string;
    status: 'ready' | 'warning' | 'blocked';
    detail: string;
    nextStep: string;
  }>;
  safeActions: string[];
  blockedActions: string[];
}

export interface EcommerceStoreProfileWorkspaceResponse {
  tenantSlug: string;
  generatedAt: string;
  summary: {
    tone: 'healthy' | 'warning' | 'critical';
    profileReadiness:
      | 'draft_ready'
      | 'needs_activation'
      | 'needs_commercial_connections';
    headline: string;
    detail: string;
    suggestedFocus: string;
  };
  identityDraft: {
    storeName: string;
    storefrontSlug: string;
    launchNarrative: string;
    primaryChannel: 'catalog' | 'landing' | 'whatsapp';
  };
  connections: Array<{
    key: 'ecommerce' | 'invoicing' | 'growth' | 'ai_assistant';
    title: string;
    status: 'ready' | 'warning' | 'blocked';
    detail: string;
  }>;
  recommendedAssets: string[];
  safeActions: string[];
  blockedActions: string[];
}

export interface EcommerceProductAuthoringWorkspaceResponse {
  tenantSlug: string;
  generatedAt: string;
  summary: {
    tone: 'healthy' | 'warning' | 'critical';
    authoringReadiness:
      | 'starter_set_ready'
      | 'needs_activation'
      | 'needs_store_profile';
    headline: string;
    detail: string;
    suggestedFocus: string;
  };
  draftCollection: {
    profileStoreName: string;
    collectionLabel: string;
    primaryChannel: 'catalog' | 'landing' | 'whatsapp';
    draftCount: number;
  };
  readinessChecklist: Array<{
    key:
      | 'store_profile'
      | 'catalog_foundation'
      | 'invoicing_connection'
      | 'growth_handoff';
    title: string;
    status: 'ready' | 'warning' | 'blocked';
    detail: string;
  }>;
  drafts: Array<{
    id: string;
    title: string;
    productType: 'core_offer' | 'entry_offer' | 'upsell';
    status: 'draft' | 'blocked';
    rationale: string;
    suggestedChannels: Array<'catalog' | 'landing' | 'whatsapp'>;
  }>;
  safeActions: string[];
  blockedActions: string[];
}

export interface EcommerceProductAuthoringDraftResponse {
  id: string;
  title: string;
  productType: 'core_offer' | 'entry_offer' | 'upsell';
  status: 'draft' | 'blocked';
  rationale: string;
  suggestedChannels: Array<'catalog' | 'landing' | 'whatsapp'>;
}

export interface SavedEcommerceProductAuthoringDraftResponse {
  id: string;
  tenantId: string;
  tenantSlug: string;
  sourceDraftId: string;
  title: string;
  productType: 'core_offer' | 'entry_offer' | 'upsell';
  status: 'saved_draft';
  rationale: string;
  suggestedChannels: Array<'catalog' | 'landing' | 'whatsapp'>;
  briefingStatus:
    | 'ready_for_ai_brief'
    | 'needs_commercial_connections'
    | 'needs_activation'
    | null;
  briefSummary: string | null;
  briefRequiredInputs: string[];
  briefGuardrails: string[];
  refinementStatus:
    | 'ready_for_refinement'
    | 'needs_commercial_connections'
    | 'needs_activation'
    | null;
  refinementSummary: string | null;
  pricingBand: string | null;
  offerAngle: string | null;
  primaryCta: string | null;
  channelSequence: string[];
  refinementGuardrails: string[];
  promotedToWorkspaceAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface EcommerceProductAuthoringDraftDetailResponse {
  tenantSlug: string;
  generatedAt: string;
  workspaceSummary: EcommerceProductAuthoringWorkspaceResponse['summary'];
  draftCollection: EcommerceProductAuthoringWorkspaceResponse['draftCollection'];
  readinessChecklist: EcommerceProductAuthoringWorkspaceResponse['readinessChecklist'];
  safeActions: string[];
  blockedActions: string[];
  draft: EcommerceProductAuthoringDraftResponse;
  savedDraft: SavedEcommerceProductAuthoringDraftResponse | null;
}

export interface RequestEcommerceProductAuthoringDraftBriefResponse {
  tenantSlug: string;
  generatedAt: string;
  briefingStatus:
    | 'ready_for_ai_brief'
    | 'needs_commercial_connections'
    | 'needs_activation';
  summary: string;
  requiredInputs: string[];
  guardrails: string[];
  draft: EcommerceProductAuthoringDraftResponse;
}

export interface RequestEcommerceProductAuthoringDraftRefinementPacketResponse {
  tenantSlug: string;
  generatedAt: string;
  refinementStatus:
    | 'ready_for_refinement'
    | 'needs_commercial_connections'
    | 'needs_activation';
  summary: string;
  pricingBand: string;
  offerAngle: string;
  primaryCta: string;
  channelSequence: string[];
  guardrails: string[];
  draft: EcommerceProductAuthoringDraftResponse;
}

export interface SaveEcommerceProductAuthoringDraftResponse {
  tenantSlug: string;
  generatedAt: string;
  summary: string;
  savedDraft: SavedEcommerceProductAuthoringDraftResponse;
}

export interface EcommerceSavedProductDraftRegistryResponse {
  tenantSlug: string;
  generatedAt: string;
  summary: {
    totalSavedDrafts: number;
    readyForRefinementCount: number;
    needsCommercialConnectionsCount: number;
    needsActivationCount: number;
    headline: string;
    detail: string;
  };
  drafts: SavedEcommerceProductAuthoringDraftResponse[];
}

export interface EcommerceProductWorkspaceResponse {
  tenantSlug: string;
  generatedAt: string;
  savedDraftId: string;
  promotedAt: string;
  status:
    | 'ready_for_copy_edit'
    | 'needs_commercial_connections'
    | 'needs_activation';
  headline: string;
  detail: string;
  editableSnapshot: {
    title: string;
    pricingBand: string | null;
    offerAngle: string | null;
    primaryCta: string | null;
    suggestedChannels: Array<'catalog' | 'landing' | 'whatsapp'>;
    channelSequence: string[];
  };
  guardrails: string[];
  nextActions: string[];
}

export interface EcommerceProductWorkspaceRegistryResponse {
  tenantSlug: string;
  generatedAt: string;
  summary: {
    totalProductWorkspaces: number;
    readyForCopyEditCount: number;
    needsCommercialConnectionsCount: number;
    needsActivationCount: number;
    headline: string;
    detail: string;
  };
  workspaces: EcommerceProductWorkspaceResponse[];
}

export interface EcommerceProductWorkspaceDetailResponse {
  tenantSlug: string;
  generatedAt: string;
  workspace: EcommerceProductWorkspaceResponse;
  sourceDraftId: string;
  readiness: {
    briefingStatus:
      | 'ready_for_ai_brief'
      | 'needs_commercial_connections'
      | 'needs_activation'
      | null;
    refinementStatus:
      | 'ready_for_refinement'
      | 'needs_commercial_connections'
      | 'needs_activation'
      | null;
    lastSavedAt: string;
  };
}

export interface PromoteEcommerceSavedDraftToProductWorkspaceResponse {
  workspace: EcommerceProductWorkspaceResponse;
}

export interface UpdateEcommerceProductWorkspaceEditableSnapshotResponse {
  workspace: EcommerceProductWorkspaceDetailResponse;
}

export interface RequestEcommerceProductWorkspaceReadinessPacketResponse {
  tenantSlug: string;
  generatedAt: string;
  workspace: EcommerceProductWorkspaceResponse;
  readinessStatus:
    | 'ready_for_product_setup'
    | 'needs_commercial_connections'
    | 'needs_activation';
  summary: string;
  requiredDecisions: string[];
  blockedBy: string[];
  recommendedArtifacts: string[];
  guardrails: string[];
}

export interface EcommerceProductSetupResponse {
  tenantSlug: string;
  generatedAt: string;
  productSetupId: string;
  savedDraftId: string;
  sourceDraftId: string;
  status:
    | 'draft_setup'
    | 'needs_commercial_connections'
    | 'needs_activation';
  title: string;
  productType: 'core_offer' | 'entry_offer' | 'upsell';
  pricingBand: string | null;
  offerAngle: string | null;
  primaryCta: string | null;
  suggestedChannels: Array<'catalog' | 'landing' | 'whatsapp'>;
  channelSequence: string[];
  promotedFromWorkspaceAt: string;
}

export interface EcommerceProductSetupRegistryResponse {
  tenantSlug: string;
  generatedAt: string;
  summary: {
    totalProductSetups: number;
    draftSetupCount: number;
    needsCommercialConnectionsCount: number;
    needsActivationCount: number;
    headline: string;
    detail: string;
  };
  productSetups: EcommerceProductSetupResponse[];
}

export interface EcommerceProductSetupDetailResponse {
  tenantSlug: string;
  generatedAt: string;
  productSetup: EcommerceProductSetupResponse;
  summary: string;
  nextActions: string[];
  blockedBy: string[];
  guardrails: string[];
}

export interface PromoteEcommerceProductWorkspaceToProductSetupResponse {
  productSetup: EcommerceProductSetupResponse;
}

export interface RequestEcommerceProductSetupDefinitionPacketResponse {
  tenantSlug: string;
  generatedAt: string;
  productSetup: EcommerceProductSetupResponse;
  definitionStatus:
    | 'ready_for_product_definition'
    | 'needs_commercial_connections'
    | 'needs_activation';
  summary: string;
  requiredDecisions: string[];
  blockedBy: string[];
  recommendedArtifacts: string[];
  guardrails: string[];
}

export interface UpdateEcommerceProductSetupEditableSnapshotResponse {
  setup: EcommerceProductSetupDetailResponse;
}

export interface EcommerceProductEntityResponse {
  tenantSlug: string;
  generatedAt: string;
  productEntityId: string;
  productSetupId: string;
  savedDraftId: string;
  sourceDraftId: string;
  status:
    | 'draft_catalog_product'
    | 'needs_channel_assets'
    | 'needs_activation';
  title: string;
  productType: 'core_offer' | 'entry_offer' | 'upsell';
  pricingBand: string | null;
  offerAngle: string | null;
  primaryCta: string | null;
  suggestedChannels: Array<'catalog' | 'landing' | 'whatsapp'>;
  channelSequence: string[];
  promotedFromSetupAt: string;
}

export interface EcommerceProductEntityRegistryResponse {
  tenantSlug: string;
  generatedAt: string;
  summary: {
    totalProductEntities: number;
    draftCatalogProductCount: number;
    needsChannelAssetsCount: number;
    needsActivationCount: number;
    headline: string;
    detail: string;
  };
  productEntities: EcommerceProductEntityResponse[];
}

export interface EcommerceProductEntityDetailResponse {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponse;
  summary: string;
  nextActions: string[];
  blockedBy: string[];
  guardrails: string[];
}

export interface PromoteEcommerceProductSetupToProductEntityResponse {
  productEntity: EcommerceProductEntityResponse;
}

export interface RequestEcommerceProductEntityCommercializationPacketResponse {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponse;
  commercializationStatus:
    | 'ready_for_channel_rollout'
    | 'needs_channel_assets'
    | 'needs_activation';
  summary: string;
  requiredDecisions: string[];
  blockedBy: string[];
  recommendedArtifacts: string[];
  guardrails: string[];
}

export interface EcommerceProductEntityChannelAssetsWorkspaceResponse {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponse;
  workspaceStatus:
    | 'ready_to_draft_assets'
    | 'needs_channel_assets'
    | 'needs_activation';
  summary: string;
  channels: {
    landing: {
      status: 'ready_to_draft' | 'needs_core_copy' | 'blocked';
      headline: string;
      recommendedAssets: string[];
    };
    catalog: {
      status: 'ready_to_draft' | 'needs_core_copy' | 'blocked';
      headline: string;
      recommendedAssets: string[];
    };
    whatsapp: {
      status: 'ready_to_draft' | 'needs_core_copy' | 'blocked';
      headline: string;
      recommendedAssets: string[];
    };
  };
  nextActions: string[];
  blockedBy: string[];
  guardrails: string[];
}

export interface EcommerceProductEntityChannelAssetDraftsWorkspaceResponse {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponse;
  workspaceStatus:
    | 'ready_to_prepare_drafts'
    | 'needs_channel_assets'
    | 'needs_activation';
  summary: string;
  drafts: {
    landing: {
      status: 'ready_to_prepare' | 'needs_core_copy' | 'blocked';
      headline: string;
      sections: string[];
      recommendedOwner: 'ecommerce' | 'growth' | 'shared';
    };
    catalog: {
      status: 'ready_to_prepare' | 'needs_core_copy' | 'blocked';
      headline: string;
      blocks: string[];
      recommendedOwner: 'ecommerce' | 'growth' | 'shared';
    };
    whatsapp: {
      status: 'ready_to_prepare' | 'needs_core_copy' | 'blocked';
      headline: string;
      sequence: string[];
      recommendedOwner: 'growth' | 'shared';
    };
  };
  nextActions: string[];
  blockedBy: string[];
  guardrails: string[];
}

export interface EcommerceProductEntityChannelDraftDetailResponse {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponse;
  channelKey: 'landing' | 'catalog' | 'whatsapp';
  draftStatus: 'ready_to_prepare' | 'needs_core_copy' | 'blocked';
  summary: string;
  headline: string;
  recommendedOwner: 'ecommerce' | 'growth' | 'shared';
  structure: string[];
  requiredInputs: string[];
  blockedBy: string[];
  guardrails: string[];
}

export interface RequestEcommerceProductEntityChannelDraftActionPacketResponse {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponse;
  channelKey: 'landing' | 'catalog' | 'whatsapp';
  actionStatus: 'ready_to_prepare' | 'needs_core_copy' | 'blocked';
  summary: string;
  requiredInputs: string[];
  recommendedArtifacts: string[];
  nextStep: string;
  blockedBy: string[];
  guardrails: string[];
}

export interface RequestEcommerceProductEntityChannelDraftPublishReadinessPacketResponse {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponse;
  channelKey: 'landing' | 'catalog' | 'whatsapp';
  readinessStatus:
    | 'ready_for_publish_preparation'
    | 'needs_core_copy'
    | 'blocked';
  summary: string;
  requiredChecks: string[];
  recommendedArtifacts: string[];
  blockedBy: string[];
  guardrails: string[];
}

export interface EcommerceProductEntityChannelDraftPublishPreparationWorkspaceResponse {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponse;
  channelKey: 'landing' | 'catalog' | 'whatsapp';
  preparationStatus: 'ready_to_stage' | 'needs_core_copy' | 'blocked';
  summary: string;
  handoffOwner: 'ecommerce' | 'growth' | 'shared';
  draftBlueprint: string[];
  publishChecklist: string[];
  recommendedArtifacts: string[];
  nextMilestone: string;
  blockedBy: string[];
  guardrails: string[];
}

export interface EcommerceSavedProductEntityChannelDraftResponse {
  id: string;
  tenantId: string;
  tenantSlug: string;
  productEntityId: string;
  channelKey: 'landing' | 'catalog' | 'whatsapp';
  status: 'saved_channel_draft';
  preparationStatus: 'ready_to_stage' | 'needs_core_copy' | 'blocked';
  handoffOwner: 'ecommerce' | 'growth' | 'shared';
  title: string;
  summary: string;
  headline: string;
  draftBlueprint: string[];
  publishChecklist: string[];
  recommendedArtifacts: string[];
  nextMilestone: string;
  blockedBy: string[];
  guardrails: string[];
  createdAt: string;
  updatedAt: string;
}

export interface EcommerceSavedProductEntityChannelDraftRegistryResponse {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponse;
  summary: {
    totalSavedDrafts: number;
    readyToStageCount: number;
    needsCoreCopyCount: number;
    blockedCount: number;
    headline: string;
    detail: string;
  };
  drafts: EcommerceSavedProductEntityChannelDraftResponse[];
}

export interface SaveEcommerceProductEntityChannelDraftResponse {
  tenantSlug: string;
  generatedAt: string;
  summary: string;
  savedChannelDraft: EcommerceSavedProductEntityChannelDraftResponse;
}

export interface EcommerceSavedProductEntityChannelDraftDetailResponse {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponse;
  savedChannelDraft: EcommerceSavedProductEntityChannelDraftResponse;
  summary: string;
  nextActions: string[];
  blockedBy: string[];
  guardrails: string[];
}

export interface UpdateEcommerceSavedProductEntityChannelDraftEditableSnapshotResponse {
  savedChannelDraft: EcommerceSavedProductEntityChannelDraftDetailResponse;
}

export interface EcommerceProductEntityChannelAssetWorkspaceResponse {
  tenantSlug: string;
  generatedAt: string;
  productEntityId: string;
  channelKey: 'landing' | 'catalog' | 'whatsapp';
  promotedAt: string;
  status: 'ready_for_asset_edit' | 'needs_core_copy' | 'blocked';
  handoffOwner: 'ecommerce' | 'growth' | 'shared';
  headline: string;
  detail: string;
  editableSnapshot: {
    title: string;
    headline: string;
    draftBlueprint: string[];
    publishChecklist: string[];
    recommendedArtifacts: string[];
    nextMilestone: string;
  };
  guardrails: string[];
  nextActions: string[];
}

export interface EcommerceProductEntityChannelAssetWorkspaceRegistryResponse {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponse;
  summary: {
    totalWorkspaces: number;
    readyForAssetEditCount: number;
    needsCoreCopyCount: number;
    blockedCount: number;
    headline: string;
    detail: string;
  };
  workspaces: EcommerceProductEntityChannelAssetWorkspaceResponse[];
}

export interface EcommerceProductEntityChannelAssetWorkspaceDetailResponse {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponse;
  workspace: EcommerceProductEntityChannelAssetWorkspaceResponse;
  sourceSavedChannelDraftId: string;
  blockedBy: string[];
}

export interface PromoteEcommerceSavedProductEntityChannelDraftToChannelAssetWorkspaceResponse {
  workspace: EcommerceProductEntityChannelAssetWorkspaceResponse;
}

export interface RequestEcommerceProductEntityChannelAssetPublishPacketResponse {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponse;
  channelKey: 'landing' | 'catalog' | 'whatsapp';
  publishStatus: 'ready_for_staging' | 'needs_core_copy' | 'blocked';
  handoffOwner: 'ecommerce' | 'growth' | 'shared';
  summary: string;
  requiredChecks: string[];
  recommendedArtifacts: string[];
  nextMilestone: string;
  blockedBy: string[];
  guardrails: string[];
}

export interface EcommerceProductEntityChannelAssetEntityResponse {
  tenantSlug: string;
  generatedAt: string;
  assetEntityId: string;
  productEntityId: string;
  sourceSavedChannelDraftId: string;
  channelKey: 'landing' | 'catalog' | 'whatsapp';
  promotedAt: string;
  status: 'draft_asset_entity' | 'needs_publish_copy' | 'blocked';
  handoffOwner: 'ecommerce' | 'growth' | 'shared';
  title: string;
  headline: string;
  summary: string;
  draftBlueprint: string[];
  publishChecklist: string[];
  recommendedArtifacts: string[];
  nextMilestone: string;
  blockedBy: string[];
  guardrails: string[];
}

export interface EcommerceProductEntityChannelAssetEntityRegistryResponse {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponse;
  summary: {
    totalAssetEntities: number;
    draftAssetEntityCount: number;
    needsPublishCopyCount: number;
    blockedCount: number;
    headline: string;
    detail: string;
  };
  assetEntities: EcommerceProductEntityChannelAssetEntityResponse[];
}

export interface EcommerceProductEntityChannelAssetEntityDetailResponse {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponse;
  assetEntity: EcommerceProductEntityChannelAssetEntityResponse;
}

export interface UpdateEcommerceProductEntityChannelAssetEntityEditableSnapshotResponse {
  assetEntity: EcommerceProductEntityChannelAssetEntityDetailResponse;
}

export interface RequestEcommerceProductEntityChannelAssetEntityPublishPreparationPacketResponse {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponse;
  channelKey: 'landing' | 'catalog' | 'whatsapp';
  preparationStatus:
    | 'ready_for_release_candidate'
    | 'needs_publish_copy'
    | 'blocked';
  handoffOwner: 'ecommerce' | 'growth' | 'shared';
  summary: string;
  requiredChecks: string[];
  recommendedArtifacts: string[];
  nextMilestone: string;
  blockedBy: string[];
  guardrails: string[];
}

export interface PromoteEcommerceProductEntityChannelAssetWorkspaceToChannelAssetEntityResponse {
  assetEntity: EcommerceProductEntityChannelAssetEntityResponse;
}

export interface EcommerceProductEntityChannelReleaseCandidateResponse {
  tenantSlug: string;
  generatedAt: string;
  releaseCandidateId: string;
  productEntityId: string;
  sourceAssetEntityId: string;
  channelKey: 'landing' | 'catalog' | 'whatsapp';
  promotedAt: string;
  status: 'candidate_ready' | 'needs_publish_copy' | 'blocked';
  handoffOwner: 'ecommerce' | 'growth' | 'shared';
  title: string;
  headline: string;
  summary: string;
  publishChecklist: string[];
  recommendedArtifacts: string[];
  nextMilestone: string;
  blockedBy: string[];
  guardrails: string[];
}

export interface EcommerceProductEntityChannelReleaseCandidateRegistryResponse {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponse;
  summary: {
    totalCandidates: number;
    readyCount: number;
    needsPublishCopyCount: number;
    blockedCount: number;
    headline: string;
    detail: string;
  };
  releaseCandidates: EcommerceProductEntityChannelReleaseCandidateResponse[];
}

export interface EcommerceProductEntityChannelReleaseCandidateDetailResponse {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponse;
  releaseCandidate: EcommerceProductEntityChannelReleaseCandidateResponse;
}

export interface PromoteEcommerceProductEntityChannelAssetEntityToReleaseCandidateResponse {
  releaseCandidate: EcommerceProductEntityChannelReleaseCandidateResponse;
}

export interface AiMemoryWorkspaceAgentResponse {
  agentKey: string;
  title: string;
  domainKey: 'growth' | 'invoicing' | 'ecommerce';
  productKey: string;
  availability: 'ready' | 'planned';
  defaultMode: 'suggestion' | 'guarded_execution';
  supportedSurfaceKeys: string[];
  promptPack: {
    key: string;
    version: string;
    mode: 'suggestion' | 'guarded_execution';
    title: string;
    summary: string;
  };
  toolAccessSummary: {
    allowedCount: number;
    approvalRequiredCount: number;
    blockedCount: number;
  };
  pendingApprovalRequestsCount: number;
  oldestPendingApprovalRequest: AiApprovalRequestResponse | null;
  latestReviewedApprovalRequest: AiApprovalRequestResponse | null;
  latestSuggestionRun: AiSuggestionRunResponse | null;
  recentActivityAt: string | null;
  memoryNotes: string[];
}

export interface AiMemoryWorkspaceResponse {
  tenantSlug: string;
  generatedAt: string;
  counts: {
    totalAgents: number;
    agentsWithSuggestionRuns: number;
    agentsWithPendingApprovals: number;
    totalPendingApprovalRequests: number;
  };
  agents: AiMemoryWorkspaceAgentResponse[];
}

export interface AiHealthWorkspaceAgentResponse {
  agentKey: string;
  title: string;
  domainKey: 'growth' | 'invoicing' | 'ecommerce';
  status: 'healthy' | 'warning' | 'critical';
  pendingApprovalRequestsCount: number;
  reviewableSuggestionRunsCount: number;
  toolAccessSummary: {
    allowedCount: number;
    approvalRequiredCount: number;
    blockedCount: number;
  };
  recentActivityAt: string | null;
  oldestPendingApprovalRequest: AiApprovalRequestResponse | null;
  latestSuggestionRun: AiSuggestionRunResponse | null;
  notes: string[];
}

export interface AiHealthWorkspaceResponse {
  tenantSlug: string;
  generatedAt: string;
  overallStatus: 'healthy' | 'warning' | 'critical';
  counts: {
    totalAgents: number;
    healthyAgents: number;
    warningAgents: number;
    criticalAgents: number;
  };
  agents: AiHealthWorkspaceAgentResponse[];
}

export interface AiEvaluationWorkspaceAgentResponse {
  agentKey: string;
  title: string;
  domainKey: 'growth' | 'invoicing' | 'ecommerce';
  status: 'healthy' | 'warning' | 'critical';
  reviewedApprovalRequestsCount: number;
  approvedReviewedApprovalRequestsCount: number;
  rejectedReviewedApprovalRequestsCount: number;
  approvalRatePercentage: number | null;
  latestReviewedAt: string | null;
  latestReviewedApprovalRequest: AiApprovalRequestResponse | null;
  notes: string[];
}

export interface AiEvaluationWorkspaceResponse {
  tenantSlug: string;
  generatedAt: string;
  overallStatus: 'healthy' | 'warning' | 'critical';
  counts: {
    totalAgents: number;
    agentsWithReviewedOutcomes: number;
    reviewedApprovalRequests: number;
    approvedReviewedApprovalRequests: number;
    rejectedReviewedApprovalRequests: number;
  };
  agents: AiEvaluationWorkspaceAgentResponse[];
}

export interface AiGovernanceWorkspaceAgentResponse {
  agentKey: string;
  title: string;
  domainKey: 'growth' | 'invoicing' | 'ecommerce';
  productKey: string;
  defaultMode: 'suggestion' | 'guarded_execution';
  promptPack: {
    key: string;
    version: string;
    mode: 'suggestion' | 'guarded_execution';
    title: string;
  };
  approvalPolicyKeys: string[];
  toolAccessSummary: {
    allowedCount: number;
    approvalRequiredCount: number;
    blockedCount: number;
  };
  executionModes: Array<'suggestion_only' | 'guarded_execution_planned'>;
  blockedCapabilities: string[];
  reviewRequirementHighlights: string[];
  notes: string[];
}

export interface AiGovernanceWorkspaceResponse {
  tenantSlug: string;
  generatedAt: string;
  counts: {
    totalAgents: number;
    suggestionModeAgents: number;
    guardedExecutionPlannedAgents: number;
    approvalRequiredTools: number;
    blockedTools: number;
  };
  agents: AiGovernanceWorkspaceAgentResponse[];
}

export interface AiPolicySimulationWorkspaceAgentResponse {
  agentKey: string;
  title: string;
  domainKey: 'growth' | 'invoicing' | 'ecommerce';
  productKey: string;
  defaultMode: 'suggestion' | 'guarded_execution';
  approvalPolicyKeys: string[];
  currentToolAccessSummary: {
    allowedCount: number;
    approvalRequiredCount: number;
    blockedCount: number;
  };
  simulatedToolAccessSummary: {
    allowedCount: number;
    approvalRequiredCount: number;
    blockedCount: number;
  };
  simulationStatus: 'review_ready' | 'more_reviewable' | 'still_blocked';
  promotedToolKeys: string[];
  stillBlockedToolKeys: string[];
  notes: string[];
}

export interface AiPolicySimulationWorkspaceResponse {
  tenantSlug: string;
  generatedAt: string;
  counts: {
    totalAgents: number;
    agentsWithSimulationDelta: number;
    toolsPromotedToApprovalRequired: number;
    toolsStillBlocked: number;
  };
  agents: AiPolicySimulationWorkspaceAgentResponse[];
}

export interface AiApprovalDesignWorkspaceAgentResponse {
  agentKey: string;
  title: string;
  domainKey: 'growth' | 'invoicing' | 'ecommerce';
  productKey: string;
  approvalPolicyKeys: string[];
  currentExpectedReviewLoad: {
    pendingApprovalRequests: number;
    reviewableSuggestionRuns: number;
    totalHumanReviewTouches: number;
  };
  simulatedExpectedReviewLoad: {
    pendingApprovalRequests: number;
    reviewableSuggestionRuns: number;
    promotedToolReviewPoints: number;
    totalHumanReviewTouches: number;
  };
  designStatus: 'unchanged' | 'heavier_review' | 'blocked_design';
  promotedToolKeys: string[];
  stillBlockedToolKeys: string[];
  notes: string[];
}

export interface AiApprovalDesignWorkspaceResponse {
  tenantSlug: string;
  generatedAt: string;
  counts: {
    totalAgents: number;
    agentsWithHeavierReview: number;
    currentExpectedHumanReviews: number;
    simulatedExpectedHumanReviews: number;
    addedHumanReviewTouches: number;
  };
  agents: AiApprovalDesignWorkspaceAgentResponse[];
}

export interface AiApprovalCapacityWorkspaceAgentResponse {
  agentKey: string;
  title: string;
  domainKey: 'growth' | 'invoicing' | 'ecommerce';
  productKey: string;
  approvalPolicyKeys: string[];
  currentMinimumReviewsPerDay: number;
  simulatedMinimumReviewsPerDay: number;
  addedReviewsPerDay: number;
  capacityStatus: 'stable' | 'watch' | 'overloaded';
  promotedToolKeys: string[];
  stillBlockedToolKeys: string[];
  bottleneckReasons: string[];
  notes: string[];
}

export interface AiApprovalCapacityWorkspaceResponse {
  tenantSlug: string;
  generatedAt: string;
  counts: {
    totalAgents: number;
    agentsAtCapacityRisk: number;
    currentMinimumReviewsPerDay: number;
    simulatedMinimumReviewsPerDay: number;
    addedReviewsPerDay: number;
  };
  agents: AiApprovalCapacityWorkspaceAgentResponse[];
}

export interface AiApprovalSlaWorkspaceAgentResponse {
  agentKey: string;
  title: string;
  domainKey: 'growth' | 'invoicing' | 'ecommerce';
  productKey: string;
  approvalPolicyKeys: string[];
  pendingApprovalRequests: number;
  reviewableSuggestionRuns: number;
  promotedToolKeys: string[];
  stillBlockedToolKeys: string[];
  currentEstimatedClearDays: number;
  simulatedEstimatedClearDays: number;
  currentSlaStatus: 'on_track' | 'at_risk' | 'breached';
  simulatedSlaStatus: 'on_track' | 'at_risk' | 'breached';
  notes: string[];
}

export interface AiApprovalSlaWorkspaceResponse {
  tenantSlug: string;
  generatedAt: string;
  counts: {
    totalAgents: number;
    agentsAtRisk: number;
    agentsBreached: number;
    currentBacklogTouches: number;
    simulatedBacklogTouches: number;
    addedBacklogTouches: number;
  };
  agents: AiApprovalSlaWorkspaceAgentResponse[];
}

export interface AiApprovalStaffingWorkspaceAgentResponse {
  agentKey: string;
  title: string;
  domainKey: 'growth' | 'invoicing' | 'ecommerce';
  productKey: string;
  approvalPolicyKeys: string[];
  currentRequiredReviewerEquivalents: number;
  simulatedRequiredReviewerEquivalents: number;
  addedReviewerEquivalents: number;
  staffingStatus: 'sufficient' | 'watch' | 'insufficient';
  promotedToolKeys: string[];
  stillBlockedToolKeys: string[];
  staffingReasons: string[];
  notes: string[];
}

export interface AiApprovalStaffingWorkspaceResponse {
  tenantSlug: string;
  generatedAt: string;
  counts: {
    totalAgents: number;
    agentsNeedingMoreCoverage: number;
    currentRequiredReviewerEquivalents: number;
    simulatedRequiredReviewerEquivalents: number;
    addedReviewerEquivalents: number;
  };
  agents: AiApprovalStaffingWorkspaceAgentResponse[];
}

export interface AiApprovalStaffingPlanWorkspaceAgentResponse {
  agentKey: string;
  title: string;
  domainKey: 'growth' | 'invoicing' | 'ecommerce';
  productKey: string;
  approvalPolicyKeys: string[];
  currentRequiredReviewerEquivalents: number;
  simulatedRequiredReviewerEquivalents: number;
  recommendedReviewerEquivalents: number;
  additionalReviewerEquivalentsToAssign: number;
  priorityRank: number;
  planStatus: 'maintain' | 'increase' | 'blocked';
  promotedToolKeys: string[];
  stillBlockedToolKeys: string[];
  planActions: string[];
  notes: string[];
}

export interface AiApprovalStaffingPlanWorkspaceResponse {
  tenantSlug: string;
  generatedAt: string;
  counts: {
    totalAgents: number;
    agentsRequiringIncrease: number;
    totalRecommendedReviewerEquivalents: number;
    totalAdditionalReviewerEquivalents: number;
    highestPriorityAgents: number;
  };
  agents: AiApprovalStaffingPlanWorkspaceAgentResponse[];
}

export interface AiApprovalRolloutWorkspaceAgentResponse {
  agentKey: string;
  title: string;
  domainKey: 'growth' | 'invoicing' | 'ecommerce';
  productKey: string;
  approvalPolicyKeys: string[];
  currentRequiredReviewerEquivalents: number;
  recommendedReviewerEquivalents: number;
  additionalReviewerEquivalentsToAssign: number;
  priorityRank: number;
  rolloutPhase: 'phase_1' | 'phase_2' | 'hold';
  rolloutStatus: 'increase_then_rollout' | 'safe_to_rollout' | 'blocked';
  promotedToolKeys: string[];
  stillBlockedToolKeys: string[];
  rolloutActions: string[];
  notes: string[];
}

export interface AiApprovalRolloutWorkspaceResponse {
  tenantSlug: string;
  generatedAt: string;
  counts: {
    totalAgents: number;
    phase1Agents: number;
    phase2Agents: number;
    holdAgents: number;
    totalAdditionalReviewerEquivalents: number;
  };
  agents: AiApprovalRolloutWorkspaceAgentResponse[];
}

export interface AiApprovalReadinessWorkspaceAgentResponse {
  agentKey: string;
  title: string;
  domainKey: 'growth' | 'invoicing' | 'ecommerce';
  productKey: string;
  approvalPolicyKeys: string[];
  currentRequiredReviewerEquivalents: number;
  recommendedReviewerEquivalents: number;
  additionalReviewerEquivalentsToAssign: number;
  currentSlaStatus: 'on_track' | 'at_risk' | 'breached';
  simulatedSlaStatus: 'on_track' | 'at_risk' | 'breached';
  rolloutPhase: 'phase_1' | 'phase_2' | 'hold';
  readinessStatus: 'ready_now' | 'needs_coverage' | 'blocked';
  readinessReasons: string[];
  nextStep: string;
  notes: string[];
}

export interface AiApprovalReadinessWorkspaceResponse {
  tenantSlug: string;
  generatedAt: string;
  counts: {
    totalAgents: number;
    readyNowAgents: number;
    needsCoverageAgents: number;
    blockedAgents: number;
  };
  agents: AiApprovalReadinessWorkspaceAgentResponse[];
}

export interface AiApprovalLaunchWorkspaceAgentResponse {
  agentKey: string;
  title: string;
  domainKey: 'growth' | 'invoicing' | 'ecommerce';
  productKey: string;
  approvalPolicyKeys: string[];
  currentRequiredReviewerEquivalents: number;
  recommendedReviewerEquivalents: number;
  additionalReviewerEquivalentsToAssign: number;
  rolloutPhase: 'phase_1' | 'phase_2' | 'hold';
  simulatedSlaStatus: 'on_track' | 'at_risk' | 'breached';
  launchStatus: 'launch_now' | 'pilot_after_coverage' | 'hold';
  launchWindow: 'current_window' | 'next_window' | 'defer';
  recommendedAction: string;
  launchChecklist: string[];
  notes: string[];
}

export interface AiApprovalLaunchWorkspaceResponse {
  tenantSlug: string;
  generatedAt: string;
  counts: {
    totalAgents: number;
    launchNowAgents: number;
    pilotAfterCoverageAgents: number;
    holdAgents: number;
    totalCoverageGap: number;
  };
  agents: AiApprovalLaunchWorkspaceAgentResponse[];
}

export interface AiGuardedExecutionWorkspaceAgentResponse {
  agentKey: string;
  title: string;
  domainKey: 'growth' | 'invoicing' | 'ecommerce';
  productKey: string;
  currentMode: 'suggestion' | 'guarded_execution';
  approvalPolicyKeys: string[];
  executionCandidateToolKeys: string[];
  approvalRequiredToolKeys: string[];
  pendingApprovalRequests: number;
  reviewableSuggestionRuns: number;
  rolloutPhase: 'phase_1' | 'phase_2' | 'hold';
  guardedExecutionStatus:
    | 'pilot_candidate'
    | 'needs_launch_readiness'
    | 'suggestion_only';
  guardrailChecklist: string[];
  nextStep: string;
  notes: string[];
}

export interface AiGuardedExecutionWorkspaceResponse {
  tenantSlug: string;
  generatedAt: string;
  counts: {
    totalAgents: number;
    pilotCandidateAgents: number;
    needsLaunchReadinessAgents: number;
    suggestionOnlyAgents: number;
    executionCandidateTools: number;
  };
  agents: AiGuardedExecutionWorkspaceAgentResponse[];
}

export interface AiGuardedExecutionPilotWorkspaceAgentResponse {
  agentKey: string;
  title: string;
  domainKey: 'growth' | 'invoicing' | 'ecommerce';
  productKey: string;
  currentMode: 'suggestion' | 'guarded_execution';
  approvalPolicyKeys: string[];
  candidateToolKey: string | null;
  rolloutPhase: 'phase_1' | 'phase_2' | 'hold';
  simulatedSlaStatus: 'on_track' | 'at_risk' | 'breached';
  pilotStatus: 'ready_for_pilot' | 'needs_operational_backing' | 'no_candidate';
  pilotType: 'human_gate_then_execute' | 'shadow_review' | 'not_available';
  additionalReviewerEquivalentsToAssign: number;
  pilotPreconditions: string[];
  pilotGuardrails: string[];
  recommendedPilotScope: string;
  nextStep: string;
  notes: string[];
}

export interface AiGuardedExecutionPilotWorkspaceResponse {
  tenantSlug: string;
  generatedAt: string;
  counts: {
    totalAgents: number;
    readyForPilotAgents: number;
    needsOperationalBackingAgents: number;
    noCandidateAgents: number;
    candidateToolPilots: number;
  };
  agents: AiGuardedExecutionPilotWorkspaceAgentResponse[];
}

export interface AiGuardedExecutionRunbookWorkspaceAgentResponse {
  agentKey: string;
  title: string;
  domainKey: 'growth' | 'invoicing' | 'ecommerce';
  productKey: string;
  currentMode: 'suggestion' | 'guarded_execution';
  approvalPolicyKeys: string[];
  candidateToolKey: string | null;
  pilotType: 'human_gate_then_execute' | 'shadow_review' | 'not_available';
  rolloutPhase: 'phase_1' | 'phase_2' | 'hold';
  simulatedSlaStatus: 'on_track' | 'at_risk' | 'breached';
  additionalReviewerEquivalentsToAssign: number;
  runbookStatus: 'ready_to_document' | 'needs_design' | 'not_available';
  operatingLane: string;
  namedHumanGate: string;
  blastRadius: 'single_record' | 'single_queue_lane' | 'no_execution_scope';
  stopConditions: string[];
  entryChecklist: string[];
  exitCriteria: string[];
  nextStep: string;
  notes: string[];
}

export interface AiGuardedExecutionRunbookWorkspaceResponse {
  tenantSlug: string;
  generatedAt: string;
  counts: {
    totalAgents: number;
    readyToDocumentAgents: number;
    needsDesignAgents: number;
    notAvailableAgents: number;
    candidateRunbooks: number;
  };
  agents: AiGuardedExecutionRunbookWorkspaceAgentResponse[];
}

export interface AiGuardedExecutionRollbackWorkspaceAgentResponse {
  agentKey: string;
  title: string;
  domainKey: 'growth' | 'invoicing' | 'ecommerce';
  productKey: string;
  currentMode: 'suggestion' | 'guarded_execution';
  approvalPolicyKeys: string[];
  candidateToolKey: string | null;
  pilotType: 'human_gate_then_execute' | 'shadow_review' | 'not_available';
  rolloutPhase: 'phase_1' | 'phase_2' | 'hold';
  simulatedSlaStatus: 'on_track' | 'at_risk' | 'breached';
  runbookStatus: 'ready_to_document' | 'needs_design' | 'not_available';
  rollbackStatus: 'ready_with_rollback' | 'needs_rollback_design' | 'not_applicable';
  rollbackOwner: string;
  blastRadius: 'single_record' | 'single_queue_lane' | 'no_execution_scope';
  rollbackTriggerSummary: string[];
  rollbackSteps: string[];
  verificationChecks: string[];
  safeFallbackMode: string;
  nextStep: string;
  notes: string[];
}

export interface AiGuardedExecutionRollbackWorkspaceResponse {
  tenantSlug: string;
  generatedAt: string;
  counts: {
    totalAgents: number;
    readyWithRollbackAgents: number;
    needsRollbackDesignAgents: number;
    notApplicableAgents: number;
    rollbackCandidateTools: number;
  };
  agents: AiGuardedExecutionRollbackWorkspaceAgentResponse[];
}

export interface AiGuardedExecutionAuditWorkspaceAgentResponse {
  agentKey: string;
  title: string;
  domainKey: 'growth' | 'invoicing' | 'ecommerce';
  productKey: string;
  currentMode: 'suggestion' | 'guarded_execution';
  approvalPolicyKeys: string[];
  candidateToolKey: string | null;
  pilotType: 'human_gate_then_execute' | 'shadow_review' | 'not_available';
  rolloutPhase: 'phase_1' | 'phase_2' | 'hold';
  simulatedSlaStatus: 'on_track' | 'at_risk' | 'breached';
  runbookStatus: 'ready_to_document' | 'needs_design' | 'not_available';
  rollbackStatus: 'ready_with_rollback' | 'needs_rollback_design' | 'not_applicable';
  auditStatus: 'ready_for_audit' | 'needs_evidence_design' | 'not_applicable';
  auditOwner: string;
  safeFallbackMode: string;
  evidencePackSummary: string[];
  requiredArtifacts: string[];
  loggingChecks: string[];
  reviewTrailSummary: string[];
  nextStep: string;
  notes: string[];
}

export interface AiGuardedExecutionAuditWorkspaceResponse {
  tenantSlug: string;
  generatedAt: string;
  counts: {
    totalAgents: number;
    readyForAuditAgents: number;
    needsEvidenceDesignAgents: number;
    notApplicableAgents: number;
    auditCandidateTools: number;
  };
  agents: AiGuardedExecutionAuditWorkspaceAgentResponse[];
}

export interface AiGuardedExecutionLaunchWorkspaceAgentResponse {
  agentKey: string;
  title: string;
  domainKey: 'growth' | 'invoicing' | 'ecommerce';
  productKey: string;
  currentMode: 'suggestion' | 'guarded_execution';
  approvalPolicyKeys: string[];
  candidateToolKey: string | null;
  pilotType: 'human_gate_then_execute' | 'shadow_review' | 'not_available';
  rolloutPhase: 'phase_1' | 'phase_2' | 'hold';
  simulatedSlaStatus: 'on_track' | 'at_risk' | 'breached';
  runbookStatus: 'ready_to_document' | 'needs_design' | 'not_available';
  rollbackStatus: 'ready_with_rollback' | 'needs_rollback_design' | 'not_applicable';
  auditStatus: 'ready_for_audit' | 'needs_evidence_design' | 'not_applicable';
  launchStatus: 'ready_to_launch' | 'pilot_only' | 'hold';
  launchWindow: 'current_window' | 'next_window' | 'defer';
  launchOwner: string;
  safeFallbackMode: string;
  launchChecklist: string[];
  blockingFactors: string[];
  successSignals: string[];
  nextStep: string;
  notes: string[];
}

export interface AiGuardedExecutionLaunchWorkspaceResponse {
  tenantSlug: string;
  generatedAt: string;
  counts: {
    totalAgents: number;
    readyToLaunchAgents: number;
    pilotOnlyAgents: number;
    holdAgents: number;
    launchCandidateTools: number;
  };
  agents: AiGuardedExecutionLaunchWorkspaceAgentResponse[];
}

export interface AiGuardedExecutionMonitorWorkspaceAgentResponse {
  agentKey: string;
  title: string;
  domainKey: 'growth' | 'invoicing' | 'ecommerce';
  productKey: string;
  currentMode: 'suggestion' | 'guarded_execution';
  approvalPolicyKeys: string[];
  candidateToolKey: string | null;
  launchStatus: 'ready_to_launch' | 'pilot_only' | 'hold';
  launchWindow: 'current_window' | 'next_window' | 'defer';
  monitorStatus: 'ready_to_monitor' | 'monitor_after_launch' | 'not_applicable';
  monitorOwner: string;
  safeFallbackMode: string;
  watchWindow: 'day_0' | 'next_window' | 'not_scheduled';
  watchSignals: string[];
  escalationSignals: string[];
  rollbackReadinessChecks: string[];
  nextStep: string;
  notes: string[];
}

export interface AiGuardedExecutionMonitorWorkspaceResponse {
  tenantSlug: string;
  generatedAt: string;
  counts: {
    totalAgents: number;
    readyToMonitorAgents: number;
    monitorAfterLaunchAgents: number;
    notApplicableAgents: number;
    monitorCandidateTools: number;
  };
  agents: AiGuardedExecutionMonitorWorkspaceAgentResponse[];
}

export interface AiGuardedExecutionControlWorkspaceAgentResponse {
  agentKey: string;
  title: string;
  domainKey: 'growth' | 'invoicing' | 'ecommerce';
  productKey: string;
  currentMode: 'suggestion' | 'guarded_execution';
  approvalPolicyKeys: string[];
  candidateToolKey: string | null;
  controlStatus: 'open_lane' | 'pilot_then_open' | 'hold';
  controlWindow: 'current_window' | 'next_window' | 'defer';
  launchStatus: 'ready_to_launch' | 'pilot_only' | 'hold';
  monitorStatus: 'ready_to_monitor' | 'monitor_after_launch' | 'not_applicable';
  controlOwner: string;
  escalationOwner: string;
  safeFallbackMode: string;
  topAction: string;
  controlChecklist: string[];
  guardrails: string[];
  nextStep: string;
  notes: string[];
}

export interface AiGuardedExecutionControlWorkspaceResponse {
  tenantSlug: string;
  generatedAt: string;
  counts: {
    totalAgents: number;
    openLaneAgents: number;
    pilotThenOpenAgents: number;
    holdAgents: number;
    controlCandidateTools: number;
  };
  agents: AiGuardedExecutionControlWorkspaceAgentResponse[];
}

export interface AiGuardedExecutionExecutionResponse {
  tenantSlug: string;
  agentKey: string;
  approvalRequestId: string;
  suggestionRunId: string;
  toolKey: string;
  targetKind:
    | 'growth_operational_case'
    | 'invoice_payment'
    | 'ecommerce_launch_plan';
  executedAt: string;
  summary: string;
  detail: string;
  operationalCase: GrowthOperationalCaseResponse | null;
  invoice: InvoiceDetailResponse | null;
  payment: PaymentResponse | null;
  launchPlan: AiEcommerceLaunchPlanResponse | null;
}

export interface AiGuardedExecutionRollbackExecutionResponse {
  tenantSlug: string;
  agentKey: string;
  approvalRequestId: string;
  suggestionRunId: string;
  toolKey: string;
  targetKind:
    | 'growth_operational_case'
    | 'invoice_payment'
    | 'ecommerce_launch_plan';
  rolledBackAt: string;
  safeFallbackMode: 'suggestion_only';
  summary: string;
  detail: string;
  operationalCase: GrowthOperationalCaseResponse | null;
  invoice: InvoiceDetailResponse | null;
  payment: PaymentResponse | null;
  launchPlan: AiEcommerceLaunchPlanResponse | null;
}

export type AiGuardedExecutionEventLogEntryType =
  | 'suggestion_run_prepared'
  | 'approval_requested'
  | 'approval_reviewed'
  | 'guarded_execution_executed'
  | 'guarded_execution_rolled_back'
  | 'guarded_execution_pilot_only'
  | 'guarded_execution_lane_ready';

export interface AiGuardedExecutionEventLogEntryResponse {
  id: string;
  tenantSlug: string;
  agentKey: string;
  eventType: AiGuardedExecutionEventLogEntryType;
  occurredAt: string;
  suggestionRunId: string | null;
  approvalRequestId: string | null;
  candidateToolKey: string | null;
  summary: string;
  detail: string;
}

export interface AiGuardedExecutionEventLogWorkspaceResponse {
  tenantSlug: string;
  generatedAt: string;
  counts: {
    totalEvents: number;
    suggestionRunPreparedEvents: number;
    approvalRequestedEvents: number;
    approvalReviewedEvents: number;
    executedEvents: number;
    rolledBackEvents: number;
    guardedExecutionStatusEvents: number;
  };
  entries: AiGuardedExecutionEventLogEntryResponse[];
}

export interface AiOperationsSummaryResponse {
  tenantSlug: string;
  generatedAt: string;
  actionCenter: AiActionCenterResponse;
  handoffWorkspace: {
    counts: {
      totalSuggestionRuns: number;
      reviewableSuggestionRuns: number;
      pendingApprovalSuggestionRuns: number;
      approvedSuggestionRuns: number;
    };
    agentBreakdown: AiHandoffWorkspaceAgentSummaryResponse[];
    latestSuggestionRun: AiSuggestionRunResponse | null;
  };
  approvalWorkspace: {
    counts: {
      totalApprovalRequests: number;
      pendingApprovalRequests: number;
      approvedApprovalRequests: number;
      rejectedApprovalRequests: number;
    };
    agentBreakdown: AiApprovalWorkspaceAgentSummaryResponse[];
    oldestPendingApprovalRequest: AiApprovalRequestResponse | null;
    latestReviewedApprovalRequest: AiApprovalRequestResponse | null;
  };
}

export interface AiHandoffWorkspaceAgentSummaryResponse {
  agentKey: string;
  title: string;
  totalSuggestionRuns: number;
  reviewableSuggestionRuns: number;
  pendingApprovalSuggestionRuns: number;
  approvedSuggestionRuns: number;
  latestGeneratedAt: string | null;
}

export interface AiHandoffWorkspaceResponse {
  tenantSlug: string;
  generatedAt: string;
  counts: {
    totalSuggestionRuns: number;
    reviewableSuggestionRuns: number;
    pendingApprovalSuggestionRuns: number;
    approvedSuggestionRuns: number;
  };
  agentBreakdown: AiHandoffWorkspaceAgentSummaryResponse[];
  recentSuggestionRuns: AiSuggestionRunResponse[];
}

export interface WhatsappOperationalAlertFrequencyResponse {
  alertKey: string;
  title: string;
  severity: 'warning' | 'critical';
  occurrenceCount: number;
  lastSeenAt: string;
}

export interface WhatsappOperationalThresholdCalibrationResponse {
  thresholdKey: string;
  thresholdUnit: 'rate' | 'count';
  sampleCount: number;
  currentValue: number;
  recommendedValue: number;
  p50Observed: number;
  p95Observed: number;
  maxObserved: number;
  direction: 'raise' | 'lower' | 'keep';
  confidence: 'low' | 'medium' | 'high';
  rationale: string;
}

export interface WhatsappOperationalMonitorAnalyticsResponse {
  tenantSlug: string;
  generatedAt: string;
  runCount: number;
  windowStartAt: string | null;
  windowEndAt: string | null;
  latestOverallStatus: 'healthy' | 'warning' | 'critical' | null;
  statusCounts: {
    healthy: number;
    warning: number;
    critical: number;
  };
  triggerSourceCounts: {
    manual: number;
    scheduler: number;
  };
  alertFrequency: WhatsappOperationalAlertFrequencyResponse[];
  thresholdCalibration: WhatsappOperationalThresholdCalibrationResponse[];
}
