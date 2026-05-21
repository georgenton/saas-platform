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
