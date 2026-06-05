import {
  EcuadorTaxAccountantReviewPacketView,
  EcuadorTaxAccountantReviewView,
  EcuadorTaxAccountantWorkbenchView,
  EcuadorTaxAccountingBridgeMappingView,
  EcuadorTaxAccountingBridgePreviewView,
  EcuadorTaxAccountingBridgeSuggestedAccountsView,
  EcuadorTaxAccountingReadinessPacketView,
  EcuadorTaxAnnexesReadinessView,
  EcuadorTaxAuditReadinessView,
  EcuadorTaxCalendarReviewWorkspaceView,
  EcuadorTaxComplianceEventView,
  EcuadorTaxDeclarationFormCatalogView,
  EcuadorTaxDeclarationApprovalPacketView,
  EcuadorTaxDeclarationDraftPacketView,
  EcuadorTaxDueMonitorView,
  EcuadorTaxEcommerceEvidenceSummaryView,
  EcuadorTaxEvidenceSummaryView,
  EcuadorTaxFilingHandoffView,
  EcuadorTaxGrowthReminderPacketView,
  EcuadorTaxIncomeTaxEvidencePacketView,
  EcuadorTaxObligationMatrixView,
  EcuadorTaxObligationCalendarView,
  EcuadorTaxObligationSettingsView,
  EcuadorTaxOperationalCloseoutView,
  EcuadorTaxObligationView,
  EcuadorTaxPeriodEvidenceVaultView,
  EcuadorTaxPeriodCloseoutPacketView,
  EcuadorTaxPeriodCloseoutReportView,
  EcuadorTaxPeriodWorkspaceView,
  EcuadorTaxPeriodPreparationPacketView,
  EcuadorTaxPurchaseExpenseEvidenceRecordView,
  EcuadorTaxPurchaseExpenseEvidenceWorkspaceView,
  EcuadorTaxReconciliationWorkspaceView,
  EcuadorTaxRuleCatalogView,
  EcuadorTaxReviewAssistantPacketView,
  EcuadorTaxSalesBookView,
  EcuadorTaxSupplierFiscalReadinessWorkspaceView,
  EcuadorTaxSriFiscalEvidenceImportBatchView,
  EcuadorTaxSriFiscalEvidenceWorkspaceView,
  EcuadorTaxSriPlatformReconciliationWorkspaceView,
  EcuadorTaxpayerProfileView,
  EcuadorTaxVatDeclarationReadinessPacketView,
  EcuadorTaxVatDeclarationApprovalView,
  EcuadorTaxVatDeclarationDraftView,
  EcuadorTaxVatInputOutputReconciliationPacketView,
  EcuadorTaxWithholdingDraftBridgePacketView,
  EcuadorTaxWithholdingDraftExecutionPacketView,
  EcuadorTaxWithholdingEvidencePacketView,
  EcuadorTaxWithholdingRegistryView,
} from '@saas-platform/tax-compliance-domain';

export interface EcuadorTaxpayerProfileResponseDto {
  tenantSlug: string;
  tenantId: string;
  generatedAt: string;
  country: string;
  legalName: string;
  commercialName: string | null;
  taxpayerId: string | null;
  regime: string;
  accountingObligated: boolean | null;
  specialTaxpayerCode: string | null;
  matrixAddress: string | null;
  establishmentAddress: string | null;
  source: string;
  readinessStatus: string;
  missingFields: string[];
  reviewNotes: string[];
  thirdPartyFiscalSummary: {
    totalParties: number;
    completeParties: number;
    needsReviewParties: number;
    missingFieldCounts: Record<string, number>;
  };
}

export interface EcuadorTaxObligationResponseDto {
  key: string;
  label: string;
  applies: boolean;
  frequency: string;
  source: string;
  readinessStatus: string;
  dependsOn: string[];
  notes: string[];
}

export interface EcuadorTaxObligationMatrixResponseDto {
  tenantSlug: string;
  generatedAt: string;
  taxpayerProfile: EcuadorTaxpayerProfileResponseDto;
  obligations: EcuadorTaxObligationResponseDto[];
  persistedSettings: EcuadorTaxObligationSettingsResponseDto | null;
  guardrails: string[];
}

export interface EcuadorTaxObligationSettingsResponseDto {
  tenantSlug: string;
  generatedAt: string;
  source: string;
  regime: string;
  accountingObligated: boolean | null;
  specialTaxpayerCode: string | null;
  ninthDigit: string | null;
  obligations: Array<{
    key: string;
    applies: boolean;
    frequency: string;
    notes: string[];
  }>;
  updatedByUserId: string | null;
  updatedByEmail: string | null;
  updatedAt: string | null;
  guardrails: string[];
}

export interface EcuadorTaxCalendarEntryResponseDto {
  obligationKey: string;
  label: string;
  period: string;
  frequency: string;
  dueDate: string | null;
  dueDay: number | null;
  source: string;
  readinessStatus: string;
  notes: string[];
}

export interface EcuadorTaxObligationCalendarResponseDto {
  tenantSlug: string;
  year: number;
  generatedAt: string;
  taxpayerProfile: EcuadorTaxpayerProfileResponseDto;
  ninthDigit: string | null;
  entries: EcuadorTaxCalendarEntryResponseDto[];
  guardrails: string[];
}

export interface EcuadorTaxCalendarReviewWorkspaceResponseDto {
  tenantSlug: string;
  year: number;
  generatedAt: string;
  asOfDate: string;
  taxpayerProfile: EcuadorTaxpayerProfileResponseDto;
  summary: {
    totalEntries: number;
    overdueCount: number;
    dueSoonCount: number;
    blockedCount: number;
    needsReviewCount: number;
  };
  priorityEntries: Array<
    EcuadorTaxCalendarEntryResponseDto & {
      dueStatus: string;
      daysUntilDue: number | null;
      reviewPriority: string;
      reviewReasons: string[];
    }
  >;
  nextActions: string[];
  guardrails: string[];
}

export interface EcuadorTaxDueMonitorResponseDto {
  tenantSlug: string;
  year: number;
  generatedAt: string;
  asOfDate: string;
  windowDays: number;
  alerts: Array<{
    obligationKey: string;
    label: string;
    period: string;
    dueDate: string | null;
    dueStatus: string;
    daysUntilDue: number | null;
    severity: string;
    message: string;
  }>;
  summary: {
    overdueCount: number;
    dueSoonCount: number;
    unscheduledCount: number;
  };
  guardrails: string[];
}

export interface EcuadorTaxEvidenceSummaryResponseDto {
  invoicing: {
    invoiceCount: number;
    statusBreakdown: Array<{ status: string; count: number }>;
    totalsByCurrency: Array<{
      currency: string;
      subtotalInCents: number;
      taxInCents: number;
      totalInCents: number;
      paidInCents: number;
      outstandingTotalInCents: number;
    }>;
    monthlyTotals: Array<{
      month: string;
      currency: string;
      invoiceCount: number;
      totalInCents: number;
      taxInCents: number;
    }>;
  };
  parties: {
    totalParties: number;
    completeParties: number;
    needsReviewParties: number;
    issueSummaries: Array<{ issue: string; count: number }>;
    incompletePartyIds: string[];
  };
  ecommerce: {
    status: string;
    orderCount: number;
    readyToInvoiceCount: number;
    blockedCount: number;
    needsFiscalDataCount: number;
    confirmedPaymentEventCount: number;
    disputedPaymentEventCount: number;
    deliveredEventCount: number;
    period: string;
    notes: string[];
  };
}

export interface EcuadorTaxEcommerceEvidenceSummaryResponseDto {
  tenantSlug: string;
  period: string;
  generatedAt: string;
  status: string;
  orderCount: number;
  readyToInvoiceCount: number;
  blockedCount: number;
  needsFiscalDataCount: number;
  confirmedPaymentEventCount: number;
  disputedPaymentEventCount: number;
  deliveredEventCount: number;
  orderHighlights: Array<{
    orderDraftId: string;
    productEntityId: string;
    orderLabel: string;
    invoicingReadinessStatus: string;
    status: string;
    updatedAt: string;
  }>;
  notes: string[];
}

export interface EcuadorTaxSalesBookResponseDto {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: string;
  source: string;
  readinessStatus: string;
  totalsByCurrency: Array<{
    currency: string;
    documentCount: number;
    subtotalInCents: number;
    taxInCents: number;
    totalInCents: number;
    paidInCents: number;
    outstandingTotalInCents: number;
  }>;
  documentRows: Array<{
    invoiceId: string;
    number: string;
    documentCode: string | null;
    status: string;
    electronicStatus: string | null;
    issuedAt: string;
    currency: string;
    subtotalInCents: number;
    taxInCents: number;
    totalInCents: number;
    paidInCents: number;
    outstandingTotalInCents: number;
    customerId: string;
    buyerIdentification: string | null;
    buyerName: string | null;
    blockers: string[];
  }>;
  ecommerceEvidence: EcuadorTaxEcommerceEvidenceSummaryResponseDto;
  blockers: string[];
  reviewNotes: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxPeriodPreparationPacketResponseDto {
  tenantSlug: string;
  period: string;
  generatedAt: string;
  taxpayerProfile: EcuadorTaxpayerProfileResponseDto;
  obligations: EcuadorTaxObligationResponseDto[];
  readinessStatus: string;
  evidenceSummary: EcuadorTaxEvidenceSummaryResponseDto;
  salesBookPreview: {
    readinessStatus: string;
    documentCount: number;
    blockerCount: number;
    ecommerceOrderCount: number;
  };
  evidenceChecklist: string[];
  accountantHandoff: {
    recommended: boolean;
    reason: string;
    packetSummary: string;
  };
  blockedBy: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxDeclarationDraftPacketResponseDto {
  tenantSlug: string;
  period: string;
  generatedAt: string;
  taxpayerProfile: EcuadorTaxpayerProfileResponseDto;
  readinessStatus: string;
  declarationSections: Array<{
    section: string;
    readinessStatus: string;
    source: string;
    summary: string;
    blockers: string[];
  }>;
  accountantReview: {
    required: boolean;
    reasons: string[];
    suggestedQuestions: string[];
  };
  sourcePackets: {
    preparationPacketGeneratedAt: string;
    calendarEntryCount: number;
    evidenceSummary: EcuadorTaxEvidenceSummaryResponseDto;
    salesBookReadinessStatus: string;
  };
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxPeriodWorkspaceResponseDto {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: string;
  status: string;
  taxpayerProfile: EcuadorTaxpayerProfileResponseDto;
  calendarEntries: EcuadorTaxCalendarEntryResponseDto[];
  dueAlerts: EcuadorTaxDueMonitorResponseDto['alerts'];
  preparationPacket: EcuadorTaxPeriodPreparationPacketResponseDto;
  declarationDraftPacket: EcuadorTaxDeclarationDraftPacketResponseDto;
  salesBook: EcuadorTaxSalesBookResponseDto;
  blockers: string[];
  nextActions: string[];
  guardrails: string[];
}

export interface EcuadorTaxAccountantReviewPacketResponseDto {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: string;
  executiveSummary: string;
  workspaceStatus: string;
  declarationSections: EcuadorTaxDeclarationDraftPacketResponseDto['declarationSections'];
  suggestedQuestions: string[];
  missingEvidence: string[];
  calendarAlerts: EcuadorTaxDueMonitorResponseDto['alerts'];
  incompleteThirdPartyIds: string[];
  handoffChecklist: string[];
  responsibilityGuardrails: string[];
  nextStep: string;
}

export interface EcuadorTaxComplianceEventResponseDto {
  id: string;
  tenantId: string;
  tenantSlug: string;
  period: string;
  year: number;
  eventType: string;
  source: string;
  payload: Record<string, unknown>;
  occurredAt: string;
  createdAt: string;
}

export interface EcuadorTaxAccountantReviewResponseDto {
  id: string;
  tenantId: string;
  tenantSlug: string;
  period: string;
  year: number;
  status: string;
  requestedByUserId: string | null;
  requestedByEmail: string | null;
  summary: string;
  questions: string[];
  evidenceSummary: EcuadorTaxEvidenceSummaryResponseDto;
  transitionHistory: Array<{
    status: string;
    transitionedAt: string;
    transitionedByUserId: string | null;
    note: string | null;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface EcuadorTaxDeclarationApprovalPacketResponseDto {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: string;
  latestAccountantReview: EcuadorTaxAccountantReviewResponseDto | null;
  approvalReadiness: string;
  remainingBlockers: string[];
  evidenceSummary: EcuadorTaxEvidenceSummaryResponseDto;
  declarationSections: EcuadorTaxDeclarationDraftPacketResponseDto['declarationSections'];
  availableAuditEvents: EcuadorTaxComplianceEventResponseDto[];
  approvalChecklist: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxReconciliationWorkspaceResponseDto {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: string;
  status: string;
  salesBook: EcuadorTaxSalesBookResponseDto;
  ecommerceEvidence: EcuadorTaxEcommerceEvidenceSummaryResponseDto;
  accountantReviews: EcuadorTaxAccountantReviewResponseDto[];
  checks: Array<{
    key: string;
    source: string;
    readinessStatus: string;
    summary: string;
    blockers: string[];
  }>;
  blockers: string[];
  reviewNotes: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxVatDeclarationReadinessPacketResponseDto {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: string;
  readinessStatus: string;
  reconciliationStatus: string;
  vatObligation: EcuadorTaxCalendarEntryResponseDto | null;
  salesTotalsByCurrency: EcuadorTaxSalesBookResponseDto['totalsByCurrency'];
  vatSummaryByCurrency: Array<{
    currency: string;
    taxableBaseInCents: number;
    vatInCents: number;
    documentCount: number;
  }>;
  blockers: string[];
  accountantQuestions: string[];
  supportChecklist: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxPeriodCloseoutPacketResponseDto {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: string;
  closeoutStatus: string;
  workspaceStatus: string;
  salesBookStatus: string;
  reconciliationStatus: string;
  vatReadinessStatus: string;
  latestAccountantReview: EcuadorTaxAccountantReviewResponseDto | null;
  approvalReadiness: string;
  ledgerCompleteness: {
    requiredEventTypes: string[];
    presentEventTypes: string[];
    missingEventTypes: string[];
  };
  closeoutChecklist: string[];
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxPurchaseExpenseEvidenceRecordResponseDto {
  evidenceId: string;
  tenantSlug: string;
  period: string;
  year: number;
  supplierPartyId: string | null;
  supplierName: string;
  supplierTaxpayerId: string | null;
  documentNumber: string | null;
  documentCode: string | null;
  issuedAt: string | null;
  category: string;
  currency: string;
  subtotalInCents: number;
  vatInCents: number;
  totalInCents: number;
  deductible: boolean | null;
  supportReference: string | null;
  status: string;
  readinessStatus: string;
  blockers: string[];
  reviewNotes: string[];
  createdAt: string;
  updatedAt: string;
}

export interface EcuadorTaxPurchaseExpenseEvidenceWorkspaceResponseDto {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: string;
  readinessStatus: string;
  source: string;
  documentRows: Array<{
    evidenceId: string;
    supplierPartyId: string | null;
    supplierName: string;
    supplierTaxpayerId: string | null;
    documentNumber: string | null;
    documentCode: string | null;
    issuedAt: string | null;
    category: string;
    currency: string;
    subtotalInCents: number;
    vatInCents: number;
    totalInCents: number;
    deductible: boolean | null;
    supportReference: string | null;
    status: string;
    readinessStatus: string;
    blockers: string[];
    reviewNotes: string[];
  }>;
  totalsByCurrency: Array<{
    currency: string;
    documentCount: number;
    subtotalInCents: number;
    vatInCents: number;
    totalInCents: number;
    deductibleSubtotalInCents: number;
  }>;
  supplierReadiness: {
    totalSuppliers: number;
    completeSuppliers: number;
    needsReviewSuppliers: number;
    incompleteSupplierIds: string[];
  };
  blockers: string[];
  reviewNotes: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxSupplierFiscalReadinessWorkspaceResponseDto {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: string;
  readinessStatus: string;
  summary: {
    supplierCount: number;
    completeSupplierCount: number;
    needsReviewSupplierCount: number;
    purchaseEvidenceSupplierCount: number;
  };
  supplierRows: Array<{
    supplierKey: string;
    supplierPartyId: string | null;
    supplierName: string;
    supplierTaxpayerId: string | null;
    source: string;
    purchaseEvidenceCount: number;
    missingFields: string[];
    readinessStatus: string;
    blockers: string[];
  }>;
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxVatInputOutputReconciliationPacketResponseDto {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: string;
  readinessStatus: string;
  outputVatByCurrency: EcuadorTaxVatDeclarationReadinessPacketResponseDto['vatSummaryByCurrency'];
  inputVatByCurrency: Array<{
    currency: string;
    creditableVatInCents: number;
    purchaseDocumentCount: number;
  }>;
  netVatByCurrency: Array<{
    currency: string;
    outputVatInCents: number;
    inputVatInCents: number;
    estimatedVatPayableInCents: number;
  }>;
  purchaseExpenseEvidenceStatus: string;
  vatReadinessStatus: string;
  blockers: string[];
  accountantQuestions: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxVatDeclarationDraftResponseDto {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: string;
  readinessStatus: string;
  vatObligation: EcuadorTaxCalendarEntryResponseDto | null;
  outputVatByCurrency: EcuadorTaxVatDeclarationReadinessPacketResponseDto['vatSummaryByCurrency'];
  inputVatByCurrency: EcuadorTaxVatInputOutputReconciliationPacketResponseDto['inputVatByCurrency'];
  netVatByCurrency: EcuadorTaxVatInputOutputReconciliationPacketResponseDto['netVatByCurrency'];
  declarationSections: Array<{
    key: string;
    label: string;
    readinessStatus: string;
    amountInCents: number;
    currency: string | null;
    notes: string[];
  }>;
  blockers: string[];
  accountantQuestions: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxVatDeclarationApprovalResponseDto {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: string;
  status: string;
  draft: EcuadorTaxVatDeclarationDraftResponseDto;
  transitionHistory: Array<{
    status: string;
    transitionedAt: string;
    transitionedByUserId: string | null;
    transitionedByEmail: string | null;
    note: string | null;
  }>;
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxIncomeTaxEvidencePacketResponseDto {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: string;
  readinessStatus: string;
  incomeObligation: EcuadorTaxCalendarEntryResponseDto | null;
  revenueByCurrency: Array<{
    currency: string;
    grossRevenueInCents: number;
    documentCount: number;
  }>;
  expenseByCurrency: Array<{
    currency: string;
    deductibleExpenseInCents: number;
    expenseDocumentCount: number;
  }>;
  estimatedTaxableBaseByCurrency: Array<{
    currency: string;
    revenueInCents: number;
    deductibleExpenseInCents: number;
    estimatedTaxableBaseInCents: number;
  }>;
  blockers: string[];
  accountantQuestions: string[];
  supportChecklist: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxWithholdingEvidencePacketResponseDto {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: string;
  readinessStatus: string;
  withholdingObligation: EcuadorTaxCalendarEntryResponseDto | null;
  salesCandidates: Array<{
    invoiceId: string;
    number: string;
    buyerName: string | null;
    buyerIdentification: string | null;
    currency: string;
    taxableBaseInCents: number;
    vatInCents: number;
    candidateReason: string;
  }>;
  purchaseCandidates: Array<{
    evidenceId: string;
    supplierName: string;
    supplierTaxpayerId: string | null;
    currency: string;
    taxableBaseInCents: number;
    vatInCents: number;
    category: string;
    candidateReason: string;
  }>;
  blockers: string[];
  accountantQuestions: string[];
  supportChecklist: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxWithholdingDraftBridgePacketResponseDto {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: string;
  readinessStatus: string;
  source: string;
  selectedCandidate: {
    candidateType: string;
    candidateId: string;
    label: string;
    currency: string;
    taxableBaseInCents: number;
    vatInCents: number;
    candidateReason: string;
  } | null;
  createWithholdingDraftInput: {
    sourceInvoiceId: string;
    reason: string;
    amountInCents: number;
    taxRateId: string | null;
    number: string | null;
    issuedAt: string | null;
    notes: string | null;
  } | null;
  bridgeChecklist: string[];
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxWithholdingDraftExecutionPacketResponseDto {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: string;
  readinessStatus: string;
  bridgePacket: EcuadorTaxWithholdingDraftBridgePacketResponseDto;
  withholdingDraft: {
    id: string;
    number: string;
    status: string;
    documentCode: string | null;
    sourceInvoiceId: string | null;
    sourceInvoiceNumber: string | null;
    amountInCents: number;
    currency: string;
  } | null;
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxWithholdingRegistryResponseDto {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: string;
  readinessStatus: string;
  summary: {
    salesCandidateCount: number;
    purchaseCandidateCount: number;
    executedDraftCount: number;
    pendingSupportCount: number;
  };
  rows: Array<{
    key: string;
    source: string;
    label: string;
    readinessStatus: string;
    amountInCents: number;
    currency: string;
    supportReference: string | null;
    nextStep: string;
  }>;
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxRuleCatalogResponseDto {
  tenantSlug: string;
  generatedAt: string;
  country: string;
  readinessStatus: string;
  rules: Array<{
    ruleKey: string;
    obligationKey: string;
    title: string;
    appliesToCategory: string | null;
    appliesWhen: string[];
    operationalEffect: string;
    accountantReviewRecommended: boolean;
    evidenceInputs: string[];
    guardrails: string[];
  }>;
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxAccountantWorkbenchResponseDto {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: string;
  readinessStatus: string;
  summary: {
    blockingSectionCount: number;
    needsReviewSectionCount: number;
    readySectionCount: number;
    accountantReviewCount: number;
    ruleCount: number;
  };
  sections: Array<{
    key: string;
    label: string;
    readinessStatus: string;
    blockerCount: number;
    questionCount: number;
    nextStep: string;
  }>;
  blockers: string[];
  accountantQuestions: string[];
  latestAccountantReview: EcuadorTaxAccountantReviewResponseDto | null;
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxAuditReadinessResponseDto {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: string;
  generatedOutputs: Array<{
    eventType: string;
    generated: boolean;
    source: string;
    recommendedPersistence: string;
  }>;
  missingPersistence: string[];
  recommendedAuditEvents: Array<{
    eventType: string;
    reason: string;
    minimumPayload: string[];
  }>;
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxPeriodEvidenceVaultResponseDto {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: string;
  readinessStatus: string;
  folders: Array<{
    key: string;
    label: string;
    readinessStatus: string;
    artifactCount: number;
    missingItems: string[];
    nextStep: string;
  }>;
  exportedSummary: {
    salesDocuments: number;
    purchaseDocuments: number;
    withholdingCandidates: number;
    accountantReviews: number;
    auditEventCount: number;
  };
  missingItems: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxOperationalCloseoutResponseDto {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: string;
  status: string;
  checklist: Array<{
    key: string;
    label: string;
    completed: boolean;
    blocker: string | null;
  }>;
  vatApprovalStatus: string;
  withholdingReadinessStatus: string;
  evidenceVaultStatus: string;
  transitionHistory: Array<{
    status: string;
    transitionedAt: string;
    transitionedByUserId: string | null;
    transitionedByEmail: string | null;
    note: string | null;
  }>;
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxFilingHandoffResponseDto {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: string;
  status: string | null;
  externalReference: string | null;
  filedAt: string | null;
  paidAt: string | null;
  amountPaidInCents: number | null;
  currency: string | null;
  responsibleUserId: string | null;
  responsibleEmail: string | null;
  note: string | null;
  operationalCloseoutStatus: string;
  transitionHistory: Array<{
    status: string;
    recordedAt: string;
    externalReference: string | null;
    responsibleUserId: string | null;
    responsibleEmail: string | null;
    note: string | null;
  }>;
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxAnnexesReadinessResponseDto {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: string;
  readinessStatus: string;
  annexes: Array<{
    key: string;
    label: string;
    applies: boolean;
    readinessStatus: string;
    evidenceSources: string[];
    blockerCount: number;
    blockers: string[];
    nextStep: string;
  }>;
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxAccountingBridgePreviewResponseDto {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: string;
  readinessStatus: string;
  entries: Array<{
    key: string;
    label: string;
    source: string;
    debitInCents: number;
    creditInCents: number;
    currency: string;
    accountHint: string | null;
    requiresChartOfAccounts: boolean;
    notes: string[];
  }>;
  summary: {
    entryCount: number;
    requiresChartOfAccountsCount: number;
    salesDocuments: number;
    purchaseDocuments: number;
    withholdingCandidates: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxAccountingBridgeMappingResponseDto {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: string;
  readinessStatus: string;
  rows: Array<{
    accountHint: string;
    suggestedAccountCode: string | null;
    suggestedAccountName: string | null;
    mapped: boolean;
    previewEntryCount: number;
    updatedByUserId: string | null;
    updatedByEmail: string | null;
    updatedAt: string | null;
  }>;
  summary: {
    hintCount: number;
    mappedHintCount: number;
    unmappedHintCount: number;
    previewEntryCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxAccountingBridgeSuggestedAccountsResponseDto {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: string;
  rows: Array<{
    accountHint: string;
    suggestedAccountCode: string;
    suggestedAccountName: string;
    category: string;
    source: string;
    appliesToEntryKeys: string[];
    notes: string[];
  }>;
  summary: {
    suggestionCount: number;
    previewHintCount: number;
    unmatchedHintCount: number;
  };
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxGrowthReminderPacketResponseDto {
  tenantSlug: string;
  year: number;
  generatedAt: string;
  asOfDate: string;
  readinessStatus: string;
  reminders: Array<{
    key: string;
    obligationKey: string;
    period: string;
    dueDate: string | null;
    severity: string;
    channel: string;
    suggestedMessage: string;
    owner: string;
    source: string;
  }>;
  summary: {
    reminderCount: number;
    overdueCount: number;
    dueSoonCount: number;
  };
  targetWorkspace: {
    productKey: string;
    handoffMode: string;
  };
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxReviewAssistantPacketResponseDto {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: string;
  readinessStatus: string;
  executiveSummary: string;
  riskSignals: Array<{
    key: string;
    severity: string;
    label: string;
    detail: string;
    source: string;
  }>;
  accountantQuestions: string[];
  suggestedActions: Array<{
    key: string;
    label: string;
    owner: string;
    priority: string;
    source: string;
  }>;
  contextSnapshot: {
    vatApprovalStatus: string;
    operationalCloseoutStatus: string;
    filingHandoffStatus: string | null;
    annexesReadinessStatus: string;
    accountingBridgeReadinessStatus: string;
    accountingBridgeMappingStatus: string;
    accountingBridgeUnmappedHintCount: number;
    evidenceVaultStatus: string;
    eventCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxPeriodCloseoutReportResponseDto {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: string;
  readinessStatus: string;
  sections: Array<{
    key: string;
    label: string;
    readinessStatus: string;
    summary: string;
    blockerCount: number;
    artifactCount: number;
  }>;
  totals: {
    salesDocuments: number;
    purchaseDocuments: number;
    withholdingCandidates: number;
    annexesApplicable: number;
    accountingPreviewEntries: number;
    accountingMappedHints: number;
    accountingUnmappedHints: number;
    auditEventCount: number;
  };
  filingHandoffStatus: string | null;
  closeoutStatus: string;
  blockers: string[];
  accountantQuestions: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxAccountingReadinessPacketResponseDto {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: string;
  readinessStatus: string;
  recommendation: string;
  summary: {
    accountingMappedHints: number;
    accountingUnmappedHints: number;
    closeoutBlockerCount: number;
    assistantRiskSignalCount: number;
    evidenceArtifactCount: number;
    auditEventCount: number;
  };
  decisionSignals: Array<{
    key: string;
    label: string;
    severity: string;
    rationale: string;
  }>;
  suggestedAccountingScope: Array<{
    key: string;
    label: string;
    reason: string;
    source: string;
  }>;
  nextProductRecommendation: {
    productKey: string;
    rationale: string;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export function toEcuadorTaxpayerProfileResponseDto(
  profile: EcuadorTaxpayerProfileView,
): EcuadorTaxpayerProfileResponseDto {
  return {
    tenantSlug: profile.tenantSlug,
    tenantId: profile.tenantId,
    generatedAt: profile.generatedAt.toISOString(),
    country: profile.country,
    legalName: profile.legalName,
    commercialName: profile.commercialName,
    taxpayerId: profile.taxpayerId,
    regime: profile.regime,
    accountingObligated: profile.accountingObligated,
    specialTaxpayerCode: profile.specialTaxpayerCode,
    matrixAddress: profile.matrixAddress,
    establishmentAddress: profile.establishmentAddress,
    source: profile.source,
    readinessStatus: profile.readinessStatus,
    missingFields: [...profile.missingFields],
    reviewNotes: [...profile.reviewNotes],
    thirdPartyFiscalSummary: {
      totalParties: profile.thirdPartyFiscalSummary.totalParties,
      completeParties: profile.thirdPartyFiscalSummary.completeParties,
      needsReviewParties: profile.thirdPartyFiscalSummary.needsReviewParties,
      missingFieldCounts: {
        ...profile.thirdPartyFiscalSummary.missingFieldCounts,
      },
    },
  };
}

export function toEcuadorTaxObligationResponseDto(
  obligation: EcuadorTaxObligationView,
): EcuadorTaxObligationResponseDto {
  return {
    key: obligation.key,
    label: obligation.label,
    applies: obligation.applies,
    frequency: obligation.frequency,
    source: obligation.source,
    readinessStatus: obligation.readinessStatus,
    dependsOn: [...obligation.dependsOn],
    notes: [...obligation.notes],
  };
}

export function toEcuadorTaxObligationMatrixResponseDto(
  matrix: EcuadorTaxObligationMatrixView,
): EcuadorTaxObligationMatrixResponseDto {
  return {
    tenantSlug: matrix.tenantSlug,
    generatedAt: matrix.generatedAt.toISOString(),
    taxpayerProfile: toEcuadorTaxpayerProfileResponseDto(
      matrix.taxpayerProfile,
    ),
    obligations: matrix.obligations.map((obligation) =>
      toEcuadorTaxObligationResponseDto(obligation),
    ),
    persistedSettings: matrix.persistedSettings
      ? toEcuadorTaxObligationSettingsResponseDto(matrix.persistedSettings)
      : null,
    guardrails: [...matrix.guardrails],
  };
}

export function toEcuadorTaxObligationSettingsResponseDto(
  settings: EcuadorTaxObligationSettingsView,
): EcuadorTaxObligationSettingsResponseDto {
  return {
    tenantSlug: settings.tenantSlug,
    generatedAt: settings.generatedAt.toISOString(),
    source: settings.source,
    regime: settings.regime,
    accountingObligated: settings.accountingObligated,
    specialTaxpayerCode: settings.specialTaxpayerCode,
    ninthDigit: settings.ninthDigit,
    obligations: settings.obligations.map((obligation) => ({
      key: obligation.key,
      applies: obligation.applies,
      frequency: obligation.frequency,
      notes: [...obligation.notes],
    })),
    updatedByUserId: settings.updatedByUserId,
    updatedByEmail: settings.updatedByEmail,
    updatedAt: settings.updatedAt ? settings.updatedAt.toISOString() : null,
    guardrails: [...settings.guardrails],
  };
}

export function toEcuadorTaxObligationCalendarResponseDto(
  calendar: EcuadorTaxObligationCalendarView,
): EcuadorTaxObligationCalendarResponseDto {
  return {
    tenantSlug: calendar.tenantSlug,
    year: calendar.year,
    generatedAt: calendar.generatedAt.toISOString(),
    taxpayerProfile: toEcuadorTaxpayerProfileResponseDto(
      calendar.taxpayerProfile,
    ),
    ninthDigit: calendar.ninthDigit,
    entries: calendar.entries.map((entry) => ({
      obligationKey: entry.obligationKey,
      label: entry.label,
      period: entry.period,
      frequency: entry.frequency,
      dueDate: entry.dueDate,
      dueDay: entry.dueDay,
      source: entry.source,
      readinessStatus: entry.readinessStatus,
      notes: [...entry.notes],
    })),
    guardrails: [...calendar.guardrails],
  };
}

export function toEcuadorTaxCalendarReviewWorkspaceResponseDto(
  workspace: EcuadorTaxCalendarReviewWorkspaceView,
): EcuadorTaxCalendarReviewWorkspaceResponseDto {
  return {
    tenantSlug: workspace.tenantSlug,
    year: workspace.year,
    generatedAt: workspace.generatedAt.toISOString(),
    asOfDate: workspace.asOfDate,
    taxpayerProfile: toEcuadorTaxpayerProfileResponseDto(
      workspace.taxpayerProfile,
    ),
    summary: { ...workspace.summary },
    priorityEntries: workspace.priorityEntries.map((entry) => ({
      obligationKey: entry.obligationKey,
      label: entry.label,
      period: entry.period,
      frequency: entry.frequency,
      dueDate: entry.dueDate,
      dueDay: entry.dueDay,
      source: entry.source,
      readinessStatus: entry.readinessStatus,
      notes: [...entry.notes],
      dueStatus: entry.dueStatus,
      daysUntilDue: entry.daysUntilDue,
      reviewPriority: entry.reviewPriority,
      reviewReasons: [...entry.reviewReasons],
    })),
    nextActions: [...workspace.nextActions],
    guardrails: [...workspace.guardrails],
  };
}

export function toEcuadorTaxDueMonitorResponseDto(
  monitor: EcuadorTaxDueMonitorView,
): EcuadorTaxDueMonitorResponseDto {
  return {
    tenantSlug: monitor.tenantSlug,
    year: monitor.year,
    generatedAt: monitor.generatedAt.toISOString(),
    asOfDate: monitor.asOfDate,
    windowDays: monitor.windowDays,
    alerts: monitor.alerts.map((alert) => ({
      obligationKey: alert.obligationKey,
      label: alert.label,
      period: alert.period,
      dueDate: alert.dueDate,
      dueStatus: alert.dueStatus,
      daysUntilDue: alert.daysUntilDue,
      severity: alert.severity,
      message: alert.message,
    })),
    summary: { ...monitor.summary },
    guardrails: [...monitor.guardrails],
  };
}

function toEcuadorTaxDueMonitorAlertResponseDto(
  alert: EcuadorTaxDueMonitorView['alerts'][number],
): EcuadorTaxDueMonitorResponseDto['alerts'][number] {
  return {
    obligationKey: alert.obligationKey,
    label: alert.label,
    period: alert.period,
    dueDate: alert.dueDate,
    dueStatus: alert.dueStatus,
    daysUntilDue: alert.daysUntilDue,
    severity: alert.severity,
    message: alert.message,
  };
}

function toEcuadorTaxCalendarEntryResponseDto(
  entry: EcuadorTaxObligationCalendarView['entries'][number],
): EcuadorTaxCalendarEntryResponseDto {
  return {
    obligationKey: entry.obligationKey,
    label: entry.label,
    period: entry.period,
    frequency: entry.frequency,
    dueDate: entry.dueDate,
    dueDay: entry.dueDay,
    source: entry.source,
    readinessStatus: entry.readinessStatus,
    notes: [...entry.notes],
  };
}

export function toEcuadorTaxPeriodPreparationPacketResponseDto(
  packet: EcuadorTaxPeriodPreparationPacketView,
): EcuadorTaxPeriodPreparationPacketResponseDto {
  return {
    tenantSlug: packet.tenantSlug,
    period: packet.period,
    generatedAt: packet.generatedAt.toISOString(),
    taxpayerProfile: toEcuadorTaxpayerProfileResponseDto(
      packet.taxpayerProfile,
    ),
    obligations: packet.obligations.map((obligation) =>
      toEcuadorTaxObligationResponseDto(obligation),
    ),
    readinessStatus: packet.readinessStatus,
    evidenceSummary: {
      invoicing: {
        invoiceCount: packet.evidenceSummary.invoicing.invoiceCount,
        statusBreakdown: packet.evidenceSummary.invoicing.statusBreakdown.map(
          (status) => ({
            status: status.status,
            count: status.count,
          }),
        ),
        totalsByCurrency: packet.evidenceSummary.invoicing.totalsByCurrency.map(
          (total) => ({
            currency: total.currency,
            subtotalInCents: total.subtotalInCents,
            taxInCents: total.taxInCents,
            totalInCents: total.totalInCents,
            paidInCents: total.paidInCents,
            outstandingTotalInCents: total.outstandingTotalInCents,
          }),
        ),
        monthlyTotals: packet.evidenceSummary.invoicing.monthlyTotals.map(
          (month) => ({
            month: month.month,
            currency: month.currency,
            invoiceCount: month.invoiceCount,
            totalInCents: month.totalInCents,
            taxInCents: month.taxInCents,
          }),
        ),
      },
      parties: {
        totalParties: packet.evidenceSummary.parties.totalParties,
        completeParties: packet.evidenceSummary.parties.completeParties,
        needsReviewParties: packet.evidenceSummary.parties.needsReviewParties,
        issueSummaries: packet.evidenceSummary.parties.issueSummaries.map(
          (issue) => ({
            issue: issue.issue,
            count: issue.count,
          }),
        ),
        incompletePartyIds: [
          ...packet.evidenceSummary.parties.incompletePartyIds,
        ],
      },
      ecommerce: {
        status: packet.evidenceSummary.ecommerce.status,
        orderCount: packet.evidenceSummary.ecommerce.orderCount,
        readyToInvoiceCount:
          packet.evidenceSummary.ecommerce.readyToInvoiceCount,
        blockedCount: packet.evidenceSummary.ecommerce.blockedCount,
        needsFiscalDataCount:
          packet.evidenceSummary.ecommerce.needsFiscalDataCount,
        confirmedPaymentEventCount:
          packet.evidenceSummary.ecommerce.confirmedPaymentEventCount,
        disputedPaymentEventCount:
          packet.evidenceSummary.ecommerce.disputedPaymentEventCount,
        deliveredEventCount:
          packet.evidenceSummary.ecommerce.deliveredEventCount,
        period: packet.evidenceSummary.ecommerce.period,
        notes: [...packet.evidenceSummary.ecommerce.notes],
      },
    },
    salesBookPreview: { ...packet.salesBookPreview },
    evidenceChecklist: [...packet.evidenceChecklist],
    accountantHandoff: { ...packet.accountantHandoff },
    blockedBy: [...packet.blockedBy],
    nextStep: packet.nextStep,
    guardrails: [...packet.guardrails],
  };
}

export function toEcuadorTaxDeclarationDraftPacketResponseDto(
  packet: EcuadorTaxDeclarationDraftPacketView,
): EcuadorTaxDeclarationDraftPacketResponseDto {
  return {
    tenantSlug: packet.tenantSlug,
    period: packet.period,
    generatedAt: packet.generatedAt.toISOString(),
    taxpayerProfile: toEcuadorTaxpayerProfileResponseDto(
      packet.taxpayerProfile,
    ),
    readinessStatus: packet.readinessStatus,
    declarationSections: packet.declarationSections.map((section) => ({
      section: section.section,
      readinessStatus: section.readinessStatus,
      source: section.source,
      summary: section.summary,
      blockers: [...section.blockers],
    })),
    accountantReview: {
      required: packet.accountantReview.required,
      reasons: [...packet.accountantReview.reasons],
      suggestedQuestions: [...packet.accountantReview.suggestedQuestions],
    },
    sourcePackets: {
      preparationPacketGeneratedAt:
        packet.sourcePackets.preparationPacketGeneratedAt.toISOString(),
      calendarEntryCount: packet.sourcePackets.calendarEntryCount,
      evidenceSummary: toEvidenceSummaryResponseDto(
        packet.sourcePackets.evidenceSummary,
      ),
      salesBookReadinessStatus: packet.sourcePackets.salesBookReadinessStatus,
    },
    nextStep: packet.nextStep,
    guardrails: [...packet.guardrails],
  };
}

export function toEcuadorTaxPeriodWorkspaceResponseDto(
  workspace: EcuadorTaxPeriodWorkspaceView,
): EcuadorTaxPeriodWorkspaceResponseDto {
  return {
    tenantSlug: workspace.tenantSlug,
    period: workspace.period,
    year: workspace.year,
    generatedAt: workspace.generatedAt.toISOString(),
    status: workspace.status,
    taxpayerProfile: toEcuadorTaxpayerProfileResponseDto(
      workspace.taxpayerProfile,
    ),
    calendarEntries: workspace.calendarEntries.map((entry) =>
      toEcuadorTaxCalendarEntryResponseDto(entry),
    ),
    dueAlerts: workspace.dueAlerts.map((alert) =>
      toEcuadorTaxDueMonitorAlertResponseDto(alert),
    ),
    preparationPacket: toEcuadorTaxPeriodPreparationPacketResponseDto(
      workspace.preparationPacket,
    ),
    declarationDraftPacket: toEcuadorTaxDeclarationDraftPacketResponseDto(
      workspace.declarationDraftPacket,
    ),
    salesBook: toEcuadorTaxSalesBookResponseDto(workspace.salesBook),
    blockers: [...workspace.blockers],
    nextActions: [...workspace.nextActions],
    guardrails: [...workspace.guardrails],
  };
}

export function toEcuadorTaxEcommerceEvidenceSummaryResponseDto(
  summary: EcuadorTaxEcommerceEvidenceSummaryView,
): EcuadorTaxEcommerceEvidenceSummaryResponseDto {
  return {
    tenantSlug: summary.tenantSlug,
    period: summary.period,
    generatedAt: summary.generatedAt.toISOString(),
    status: summary.status,
    orderCount: summary.orderCount,
    readyToInvoiceCount: summary.readyToInvoiceCount,
    blockedCount: summary.blockedCount,
    needsFiscalDataCount: summary.needsFiscalDataCount,
    confirmedPaymentEventCount: summary.confirmedPaymentEventCount,
    disputedPaymentEventCount: summary.disputedPaymentEventCount,
    deliveredEventCount: summary.deliveredEventCount,
    orderHighlights: summary.orderHighlights.map((order) => ({
      orderDraftId: order.orderDraftId,
      productEntityId: order.productEntityId,
      orderLabel: order.orderLabel,
      invoicingReadinessStatus: order.invoicingReadinessStatus,
      status: order.status,
      updatedAt: order.updatedAt.toISOString(),
    })),
    notes: [...summary.notes],
  };
}

export function toEcuadorTaxSalesBookResponseDto(
  book: EcuadorTaxSalesBookView,
): EcuadorTaxSalesBookResponseDto {
  return {
    tenantSlug: book.tenantSlug,
    period: book.period,
    year: book.year,
    generatedAt: book.generatedAt.toISOString(),
    source: book.source,
    readinessStatus: book.readinessStatus,
    totalsByCurrency: book.totalsByCurrency.map((total) => ({
      currency: total.currency,
      documentCount: total.documentCount,
      subtotalInCents: total.subtotalInCents,
      taxInCents: total.taxInCents,
      totalInCents: total.totalInCents,
      paidInCents: total.paidInCents,
      outstandingTotalInCents: total.outstandingTotalInCents,
    })),
    documentRows: book.documentRows.map((row) => ({
      invoiceId: row.invoiceId,
      number: row.number,
      documentCode: row.documentCode,
      status: row.status,
      electronicStatus: row.electronicStatus,
      issuedAt: row.issuedAt.toISOString(),
      currency: row.currency,
      subtotalInCents: row.subtotalInCents,
      taxInCents: row.taxInCents,
      totalInCents: row.totalInCents,
      paidInCents: row.paidInCents,
      outstandingTotalInCents: row.outstandingTotalInCents,
      customerId: row.customerId,
      buyerIdentification: row.buyerIdentification,
      buyerName: row.buyerName,
      blockers: [...row.blockers],
    })),
    ecommerceEvidence: toEcuadorTaxEcommerceEvidenceSummaryResponseDto(
      book.ecommerceEvidence,
    ),
    blockers: [...book.blockers],
    reviewNotes: [...book.reviewNotes],
    nextStep: book.nextStep,
    guardrails: [...book.guardrails],
  };
}

export function toEcuadorTaxAccountantReviewPacketResponseDto(
  packet: EcuadorTaxAccountantReviewPacketView,
): EcuadorTaxAccountantReviewPacketResponseDto {
  return {
    tenantSlug: packet.tenantSlug,
    period: packet.period,
    year: packet.year,
    generatedAt: packet.generatedAt.toISOString(),
    executiveSummary: packet.executiveSummary,
    workspaceStatus: packet.workspaceStatus,
    declarationSections: packet.declarationSections.map((section) => ({
      section: section.section,
      readinessStatus: section.readinessStatus,
      source: section.source,
      summary: section.summary,
      blockers: [...section.blockers],
    })),
    suggestedQuestions: [...packet.suggestedQuestions],
    missingEvidence: [...packet.missingEvidence],
    calendarAlerts: packet.calendarAlerts.map((alert) =>
      toEcuadorTaxDueMonitorAlertResponseDto(alert),
    ),
    incompleteThirdPartyIds: [...packet.incompleteThirdPartyIds],
    handoffChecklist: [...packet.handoffChecklist],
    responsibilityGuardrails: [...packet.responsibilityGuardrails],
    nextStep: packet.nextStep,
  };
}

export function toEcuadorTaxComplianceEventResponseDto(
  event: EcuadorTaxComplianceEventView,
): EcuadorTaxComplianceEventResponseDto {
  return {
    id: event.id,
    tenantId: event.tenantId,
    tenantSlug: event.tenantSlug,
    period: event.period,
    year: event.year,
    eventType: event.eventType,
    source: event.source,
    payload: { ...event.payload },
    occurredAt: event.occurredAt.toISOString(),
    createdAt: event.createdAt.toISOString(),
  };
}

export function toEcuadorTaxAccountantReviewResponseDto(
  review: EcuadorTaxAccountantReviewView,
): EcuadorTaxAccountantReviewResponseDto {
  return {
    id: review.id,
    tenantId: review.tenantId,
    tenantSlug: review.tenantSlug,
    period: review.period,
    year: review.year,
    status: review.status,
    requestedByUserId: review.requestedByUserId,
    requestedByEmail: review.requestedByEmail,
    summary: review.summary,
    questions: [...review.questions],
    evidenceSummary: toEvidenceSummaryResponseDto(review.evidenceSummary),
    transitionHistory: review.transitionHistory.map((transition) => ({
      status: transition.status,
      transitionedAt: transition.transitionedAt.toISOString(),
      transitionedByUserId: transition.transitionedByUserId,
      note: transition.note,
    })),
    createdAt: review.createdAt.toISOString(),
    updatedAt: review.updatedAt.toISOString(),
  };
}

export function toEcuadorTaxDeclarationApprovalPacketResponseDto(
  packet: EcuadorTaxDeclarationApprovalPacketView,
): EcuadorTaxDeclarationApprovalPacketResponseDto {
  return {
    tenantSlug: packet.tenantSlug,
    period: packet.period,
    year: packet.year,
    generatedAt: packet.generatedAt.toISOString(),
    latestAccountantReview: packet.latestAccountantReview
      ? toEcuadorTaxAccountantReviewResponseDto(packet.latestAccountantReview)
      : null,
    approvalReadiness: packet.approvalReadiness,
    remainingBlockers: [...packet.remainingBlockers],
    evidenceSummary: toEvidenceSummaryResponseDto(packet.evidenceSummary),
    declarationSections: packet.declarationSections.map((section) => ({
      section: section.section,
      readinessStatus: section.readinessStatus,
      source: section.source,
      summary: section.summary,
      blockers: [...section.blockers],
    })),
    availableAuditEvents: packet.availableAuditEvents.map((event) =>
      toEcuadorTaxComplianceEventResponseDto(event),
    ),
    approvalChecklist: [...packet.approvalChecklist],
    nextStep: packet.nextStep,
    guardrails: [...packet.guardrails],
  };
}

export function toEcuadorTaxReconciliationWorkspaceResponseDto(
  workspace: EcuadorTaxReconciliationWorkspaceView,
): EcuadorTaxReconciliationWorkspaceResponseDto {
  return {
    tenantSlug: workspace.tenantSlug,
    period: workspace.period,
    year: workspace.year,
    generatedAt: workspace.generatedAt.toISOString(),
    status: workspace.status,
    salesBook: toEcuadorTaxSalesBookResponseDto(workspace.salesBook),
    ecommerceEvidence: toEcuadorTaxEcommerceEvidenceSummaryResponseDto(
      workspace.ecommerceEvidence,
    ),
    accountantReviews: workspace.accountantReviews.map((review) =>
      toEcuadorTaxAccountantReviewResponseDto(review),
    ),
    checks: workspace.checks.map((check) => ({
      key: check.key,
      source: check.source,
      readinessStatus: check.readinessStatus,
      summary: check.summary,
      blockers: [...check.blockers],
    })),
    blockers: [...workspace.blockers],
    reviewNotes: [...workspace.reviewNotes],
    nextStep: workspace.nextStep,
    guardrails: [...workspace.guardrails],
  };
}

export function toEcuadorTaxVatDeclarationReadinessPacketResponseDto(
  packet: EcuadorTaxVatDeclarationReadinessPacketView,
): EcuadorTaxVatDeclarationReadinessPacketResponseDto {
  return {
    tenantSlug: packet.tenantSlug,
    period: packet.period,
    year: packet.year,
    generatedAt: packet.generatedAt.toISOString(),
    readinessStatus: packet.readinessStatus,
    reconciliationStatus: packet.reconciliationStatus,
    vatObligation: packet.vatObligation
      ? toEcuadorTaxCalendarEntryResponseDto(packet.vatObligation)
      : null,
    salesTotalsByCurrency: packet.salesTotalsByCurrency.map((total) => ({
      currency: total.currency,
      documentCount: total.documentCount,
      subtotalInCents: total.subtotalInCents,
      taxInCents: total.taxInCents,
      totalInCents: total.totalInCents,
      paidInCents: total.paidInCents,
      outstandingTotalInCents: total.outstandingTotalInCents,
    })),
    vatSummaryByCurrency: packet.vatSummaryByCurrency.map((total) => ({
      currency: total.currency,
      taxableBaseInCents: total.taxableBaseInCents,
      vatInCents: total.vatInCents,
      documentCount: total.documentCount,
    })),
    blockers: [...packet.blockers],
    accountantQuestions: [...packet.accountantQuestions],
    supportChecklist: [...packet.supportChecklist],
    nextStep: packet.nextStep,
    guardrails: [...packet.guardrails],
  };
}

export function toEcuadorTaxPeriodCloseoutPacketResponseDto(
  packet: EcuadorTaxPeriodCloseoutPacketView,
): EcuadorTaxPeriodCloseoutPacketResponseDto {
  return {
    tenantSlug: packet.tenantSlug,
    period: packet.period,
    year: packet.year,
    generatedAt: packet.generatedAt.toISOString(),
    closeoutStatus: packet.closeoutStatus,
    workspaceStatus: packet.workspaceStatus,
    salesBookStatus: packet.salesBookStatus,
    reconciliationStatus: packet.reconciliationStatus,
    vatReadinessStatus: packet.vatReadinessStatus,
    latestAccountantReview: packet.latestAccountantReview
      ? toEcuadorTaxAccountantReviewResponseDto(packet.latestAccountantReview)
      : null,
    approvalReadiness: packet.approvalReadiness,
    ledgerCompleteness: {
      requiredEventTypes: [...packet.ledgerCompleteness.requiredEventTypes],
      presentEventTypes: [...packet.ledgerCompleteness.presentEventTypes],
      missingEventTypes: [...packet.ledgerCompleteness.missingEventTypes],
    },
    closeoutChecklist: [...packet.closeoutChecklist],
    blockers: [...packet.blockers],
    nextStep: packet.nextStep,
    guardrails: [...packet.guardrails],
  };
}

export function toEcuadorTaxPurchaseExpenseEvidenceWorkspaceResponseDto(
  workspace: EcuadorTaxPurchaseExpenseEvidenceWorkspaceView,
): EcuadorTaxPurchaseExpenseEvidenceWorkspaceResponseDto {
  return {
    tenantSlug: workspace.tenantSlug,
    period: workspace.period,
    year: workspace.year,
    generatedAt: workspace.generatedAt.toISOString(),
    readinessStatus: workspace.readinessStatus,
    source: workspace.source,
    documentRows: workspace.documentRows.map((row) => ({
      evidenceId: row.evidenceId,
      supplierPartyId: row.supplierPartyId,
      supplierName: row.supplierName,
      supplierTaxpayerId: row.supplierTaxpayerId,
      documentNumber: row.documentNumber,
      documentCode: row.documentCode,
      issuedAt: row.issuedAt ? row.issuedAt.toISOString() : null,
      category: row.category,
      currency: row.currency,
      subtotalInCents: row.subtotalInCents,
      vatInCents: row.vatInCents,
      totalInCents: row.totalInCents,
      deductible: row.deductible,
      supportReference: row.supportReference,
      status: row.status,
      readinessStatus: row.readinessStatus,
      blockers: [...row.blockers],
      reviewNotes: [...row.reviewNotes],
    })),
    totalsByCurrency: workspace.totalsByCurrency.map((total) => ({
      currency: total.currency,
      documentCount: total.documentCount,
      subtotalInCents: total.subtotalInCents,
      vatInCents: total.vatInCents,
      totalInCents: total.totalInCents,
      deductibleSubtotalInCents: total.deductibleSubtotalInCents,
    })),
    supplierReadiness: {
      totalSuppliers: workspace.supplierReadiness.totalSuppliers,
      completeSuppliers: workspace.supplierReadiness.completeSuppliers,
      needsReviewSuppliers: workspace.supplierReadiness.needsReviewSuppliers,
      incompleteSupplierIds: [
        ...workspace.supplierReadiness.incompleteSupplierIds,
      ],
    },
    blockers: [...workspace.blockers],
    reviewNotes: [...workspace.reviewNotes],
    nextStep: workspace.nextStep,
    guardrails: [...workspace.guardrails],
  };
}

export function toEcuadorTaxPurchaseExpenseEvidenceRecordResponseDto(
  record: EcuadorTaxPurchaseExpenseEvidenceRecordView,
): EcuadorTaxPurchaseExpenseEvidenceRecordResponseDto {
  return {
    evidenceId: record.evidenceId,
    tenantSlug: record.tenantSlug,
    period: record.period,
    year: record.year,
    supplierPartyId: record.supplierPartyId,
    supplierName: record.supplierName,
    supplierTaxpayerId: record.supplierTaxpayerId,
    documentNumber: record.documentNumber,
    documentCode: record.documentCode,
    issuedAt: record.issuedAt ? record.issuedAt.toISOString() : null,
    category: record.category,
    currency: record.currency,
    subtotalInCents: record.subtotalInCents,
    vatInCents: record.vatInCents,
    totalInCents: record.totalInCents,
    deductible: record.deductible,
    supportReference: record.supportReference,
    status: record.status,
    readinessStatus: record.readinessStatus,
    blockers: [...record.blockers],
    reviewNotes: [...record.reviewNotes],
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}

export function toEcuadorTaxSupplierFiscalReadinessWorkspaceResponseDto(
  workspace: EcuadorTaxSupplierFiscalReadinessWorkspaceView,
): EcuadorTaxSupplierFiscalReadinessWorkspaceResponseDto {
  return {
    tenantSlug: workspace.tenantSlug,
    period: workspace.period,
    year: workspace.year,
    generatedAt: workspace.generatedAt.toISOString(),
    readinessStatus: workspace.readinessStatus,
    summary: { ...workspace.summary },
    supplierRows: workspace.supplierRows.map((row) => ({
      supplierKey: row.supplierKey,
      supplierPartyId: row.supplierPartyId,
      supplierName: row.supplierName,
      supplierTaxpayerId: row.supplierTaxpayerId,
      source: row.source,
      purchaseEvidenceCount: row.purchaseEvidenceCount,
      missingFields: [...row.missingFields],
      readinessStatus: row.readinessStatus,
      blockers: [...row.blockers],
    })),
    blockers: [...workspace.blockers],
    nextStep: workspace.nextStep,
    guardrails: [...workspace.guardrails],
  };
}

export function toEcuadorTaxVatInputOutputReconciliationPacketResponseDto(
  packet: EcuadorTaxVatInputOutputReconciliationPacketView,
): EcuadorTaxVatInputOutputReconciliationPacketResponseDto {
  return {
    tenantSlug: packet.tenantSlug,
    period: packet.period,
    year: packet.year,
    generatedAt: packet.generatedAt.toISOString(),
    readinessStatus: packet.readinessStatus,
    outputVatByCurrency: packet.outputVatByCurrency.map((total) => ({
      currency: total.currency,
      taxableBaseInCents: total.taxableBaseInCents,
      vatInCents: total.vatInCents,
      documentCount: total.documentCount,
    })),
    inputVatByCurrency: packet.inputVatByCurrency.map((total) => ({
      currency: total.currency,
      creditableVatInCents: total.creditableVatInCents,
      purchaseDocumentCount: total.purchaseDocumentCount,
    })),
    netVatByCurrency: packet.netVatByCurrency.map((total) => ({
      currency: total.currency,
      outputVatInCents: total.outputVatInCents,
      inputVatInCents: total.inputVatInCents,
      estimatedVatPayableInCents: total.estimatedVatPayableInCents,
    })),
    purchaseExpenseEvidenceStatus: packet.purchaseExpenseEvidenceStatus,
    vatReadinessStatus: packet.vatReadinessStatus,
    blockers: [...packet.blockers],
    accountantQuestions: [...packet.accountantQuestions],
    nextStep: packet.nextStep,
    guardrails: [...packet.guardrails],
  };
}

export function toEcuadorTaxVatDeclarationDraftResponseDto(
  draft: EcuadorTaxVatDeclarationDraftView,
): EcuadorTaxVatDeclarationDraftResponseDto {
  return {
    tenantSlug: draft.tenantSlug,
    period: draft.period,
    year: draft.year,
    generatedAt: draft.generatedAt.toISOString(),
    readinessStatus: draft.readinessStatus,
    vatObligation: draft.vatObligation
      ? toEcuadorTaxCalendarEntryResponseDto(draft.vatObligation)
      : null,
    outputVatByCurrency: draft.outputVatByCurrency.map((total) => ({
      ...total,
    })),
    inputVatByCurrency: draft.inputVatByCurrency.map((total) => ({
      ...total,
    })),
    netVatByCurrency: draft.netVatByCurrency.map((total) => ({ ...total })),
    declarationSections: draft.declarationSections.map((section) => ({
      ...section,
      notes: [...section.notes],
    })),
    blockers: [...draft.blockers],
    accountantQuestions: [...draft.accountantQuestions],
    nextStep: draft.nextStep,
    guardrails: [...draft.guardrails],
  };
}

export function toEcuadorTaxVatDeclarationApprovalResponseDto(
  approval: EcuadorTaxVatDeclarationApprovalView,
): EcuadorTaxVatDeclarationApprovalResponseDto {
  return {
    tenantSlug: approval.tenantSlug,
    period: approval.period,
    year: approval.year,
    generatedAt: approval.generatedAt.toISOString(),
    status: approval.status,
    draft: toEcuadorTaxVatDeclarationDraftResponseDto(approval.draft),
    transitionHistory: approval.transitionHistory.map((transition) => ({
      status: transition.status,
      transitionedAt: transition.transitionedAt.toISOString(),
      transitionedByUserId: transition.transitionedByUserId,
      transitionedByEmail: transition.transitionedByEmail,
      note: transition.note,
    })),
    blockers: [...approval.blockers],
    nextStep: approval.nextStep,
    guardrails: [...approval.guardrails],
  };
}

export function toEcuadorTaxIncomeTaxEvidencePacketResponseDto(
  packet: EcuadorTaxIncomeTaxEvidencePacketView,
): EcuadorTaxIncomeTaxEvidencePacketResponseDto {
  return {
    tenantSlug: packet.tenantSlug,
    period: packet.period,
    year: packet.year,
    generatedAt: packet.generatedAt.toISOString(),
    readinessStatus: packet.readinessStatus,
    incomeObligation: packet.incomeObligation
      ? toEcuadorTaxCalendarEntryResponseDto(packet.incomeObligation)
      : null,
    revenueByCurrency: packet.revenueByCurrency.map((total) => ({
      currency: total.currency,
      grossRevenueInCents: total.grossRevenueInCents,
      documentCount: total.documentCount,
    })),
    expenseByCurrency: packet.expenseByCurrency.map((total) => ({
      currency: total.currency,
      deductibleExpenseInCents: total.deductibleExpenseInCents,
      expenseDocumentCount: total.expenseDocumentCount,
    })),
    estimatedTaxableBaseByCurrency: packet.estimatedTaxableBaseByCurrency.map(
      (total) => ({
        currency: total.currency,
        revenueInCents: total.revenueInCents,
        deductibleExpenseInCents: total.deductibleExpenseInCents,
        estimatedTaxableBaseInCents: total.estimatedTaxableBaseInCents,
      }),
    ),
    blockers: [...packet.blockers],
    accountantQuestions: [...packet.accountantQuestions],
    supportChecklist: [...packet.supportChecklist],
    nextStep: packet.nextStep,
    guardrails: [...packet.guardrails],
  };
}

export function toEcuadorTaxWithholdingEvidencePacketResponseDto(
  packet: EcuadorTaxWithholdingEvidencePacketView,
): EcuadorTaxWithholdingEvidencePacketResponseDto {
  return {
    tenantSlug: packet.tenantSlug,
    period: packet.period,
    year: packet.year,
    generatedAt: packet.generatedAt.toISOString(),
    readinessStatus: packet.readinessStatus,
    withholdingObligation: packet.withholdingObligation
      ? toEcuadorTaxCalendarEntryResponseDto(packet.withholdingObligation)
      : null,
    salesCandidates: packet.salesCandidates.map((candidate) => ({
      invoiceId: candidate.invoiceId,
      number: candidate.number,
      buyerName: candidate.buyerName,
      buyerIdentification: candidate.buyerIdentification,
      currency: candidate.currency,
      taxableBaseInCents: candidate.taxableBaseInCents,
      vatInCents: candidate.vatInCents,
      candidateReason: candidate.candidateReason,
    })),
    purchaseCandidates: packet.purchaseCandidates.map((candidate) => ({
      evidenceId: candidate.evidenceId,
      supplierName: candidate.supplierName,
      supplierTaxpayerId: candidate.supplierTaxpayerId,
      currency: candidate.currency,
      taxableBaseInCents: candidate.taxableBaseInCents,
      vatInCents: candidate.vatInCents,
      category: candidate.category,
      candidateReason: candidate.candidateReason,
    })),
    blockers: [...packet.blockers],
    accountantQuestions: [...packet.accountantQuestions],
    supportChecklist: [...packet.supportChecklist],
    nextStep: packet.nextStep,
    guardrails: [...packet.guardrails],
  };
}

export function toEcuadorTaxWithholdingDraftBridgePacketResponseDto(
  packet: EcuadorTaxWithholdingDraftBridgePacketView,
): EcuadorTaxWithholdingDraftBridgePacketResponseDto {
  return {
    tenantSlug: packet.tenantSlug,
    period: packet.period,
    year: packet.year,
    generatedAt: packet.generatedAt.toISOString(),
    readinessStatus: packet.readinessStatus,
    source: packet.source,
    selectedCandidate: packet.selectedCandidate
      ? { ...packet.selectedCandidate }
      : null,
    createWithholdingDraftInput: packet.createWithholdingDraftInput
      ? {
          ...packet.createWithholdingDraftInput,
          issuedAt: packet.createWithholdingDraftInput.issuedAt
            ? packet.createWithholdingDraftInput.issuedAt.toISOString()
            : null,
        }
      : null,
    bridgeChecklist: [...packet.bridgeChecklist],
    blockers: [...packet.blockers],
    nextStep: packet.nextStep,
    guardrails: [...packet.guardrails],
  };
}

export function toEcuadorTaxWithholdingDraftExecutionPacketResponseDto(
  packet: EcuadorTaxWithholdingDraftExecutionPacketView,
): EcuadorTaxWithholdingDraftExecutionPacketResponseDto {
  return {
    tenantSlug: packet.tenantSlug,
    period: packet.period,
    year: packet.year,
    generatedAt: packet.generatedAt.toISOString(),
    readinessStatus: packet.readinessStatus,
    bridgePacket: toEcuadorTaxWithholdingDraftBridgePacketResponseDto(
      packet.bridgePacket,
    ),
    withholdingDraft: packet.withholdingDraft
      ? { ...packet.withholdingDraft }
      : null,
    blockers: [...packet.blockers],
    nextStep: packet.nextStep,
    guardrails: [...packet.guardrails],
  };
}

export function toEcuadorTaxWithholdingRegistryResponseDto(
  registry: EcuadorTaxWithholdingRegistryView,
): EcuadorTaxWithholdingRegistryResponseDto {
  return {
    tenantSlug: registry.tenantSlug,
    period: registry.period,
    year: registry.year,
    generatedAt: registry.generatedAt.toISOString(),
    readinessStatus: registry.readinessStatus,
    summary: { ...registry.summary },
    rows: registry.rows.map((row) => ({ ...row })),
    blockers: [...registry.blockers],
    nextStep: registry.nextStep,
    guardrails: [...registry.guardrails],
  };
}

export function toEcuadorTaxRuleCatalogResponseDto(
  catalog: EcuadorTaxRuleCatalogView,
): EcuadorTaxRuleCatalogResponseDto {
  return {
    tenantSlug: catalog.tenantSlug,
    generatedAt: catalog.generatedAt.toISOString(),
    country: catalog.country,
    readinessStatus: catalog.readinessStatus,
    rules: catalog.rules.map((rule) => ({
      ruleKey: rule.ruleKey,
      obligationKey: rule.obligationKey,
      title: rule.title,
      appliesToCategory: rule.appliesToCategory,
      appliesWhen: [...rule.appliesWhen],
      operationalEffect: rule.operationalEffect,
      accountantReviewRecommended: rule.accountantReviewRecommended,
      evidenceInputs: [...rule.evidenceInputs],
      guardrails: [...rule.guardrails],
    })),
    blockers: [...catalog.blockers],
    nextStep: catalog.nextStep,
    guardrails: [...catalog.guardrails],
  };
}

export function toEcuadorTaxAccountantWorkbenchResponseDto(
  workbench: EcuadorTaxAccountantWorkbenchView,
): EcuadorTaxAccountantWorkbenchResponseDto {
  return {
    tenantSlug: workbench.tenantSlug,
    period: workbench.period,
    year: workbench.year,
    generatedAt: workbench.generatedAt.toISOString(),
    readinessStatus: workbench.readinessStatus,
    summary: { ...workbench.summary },
    sections: workbench.sections.map((section) => ({ ...section })),
    blockers: [...workbench.blockers],
    accountantQuestions: [...workbench.accountantQuestions],
    latestAccountantReview: workbench.latestAccountantReview
      ? toEcuadorTaxAccountantReviewResponseDto(
          workbench.latestAccountantReview,
        )
      : null,
    nextStep: workbench.nextStep,
    guardrails: [...workbench.guardrails],
  };
}

export function toEcuadorTaxAuditReadinessResponseDto(
  readiness: EcuadorTaxAuditReadinessView,
): EcuadorTaxAuditReadinessResponseDto {
  return {
    tenantSlug: readiness.tenantSlug,
    period: readiness.period,
    year: readiness.year,
    generatedAt: readiness.generatedAt.toISOString(),
    generatedOutputs: readiness.generatedOutputs.map((output) => ({
      eventType: output.eventType,
      generated: output.generated,
      source: output.source,
      recommendedPersistence: output.recommendedPersistence,
    })),
    missingPersistence: [...readiness.missingPersistence],
    recommendedAuditEvents: readiness.recommendedAuditEvents.map((event) => ({
      eventType: event.eventType,
      reason: event.reason,
      minimumPayload: [...event.minimumPayload],
    })),
    nextStep: readiness.nextStep,
    guardrails: [...readiness.guardrails],
  };
}

export function toEcuadorTaxPeriodEvidenceVaultResponseDto(
  vault: EcuadorTaxPeriodEvidenceVaultView,
): EcuadorTaxPeriodEvidenceVaultResponseDto {
  return {
    tenantSlug: vault.tenantSlug,
    period: vault.period,
    year: vault.year,
    generatedAt: vault.generatedAt.toISOString(),
    readinessStatus: vault.readinessStatus,
    folders: vault.folders.map((folder) => ({
      ...folder,
      missingItems: [...folder.missingItems],
    })),
    exportedSummary: { ...vault.exportedSummary },
    missingItems: [...vault.missingItems],
    nextStep: vault.nextStep,
    guardrails: [...vault.guardrails],
  };
}

export function toEcuadorTaxOperationalCloseoutResponseDto(
  closeout: EcuadorTaxOperationalCloseoutView,
): EcuadorTaxOperationalCloseoutResponseDto {
  return {
    tenantSlug: closeout.tenantSlug,
    period: closeout.period,
    year: closeout.year,
    generatedAt: closeout.generatedAt.toISOString(),
    status: closeout.status,
    checklist: closeout.checklist.map((item) => ({ ...item })),
    vatApprovalStatus: closeout.vatApprovalStatus,
    withholdingReadinessStatus: closeout.withholdingReadinessStatus,
    evidenceVaultStatus: closeout.evidenceVaultStatus,
    transitionHistory: closeout.transitionHistory.map((transition) => ({
      status: transition.status,
      transitionedAt: transition.transitionedAt.toISOString(),
      transitionedByUserId: transition.transitionedByUserId,
      transitionedByEmail: transition.transitionedByEmail,
      note: transition.note,
    })),
    blockers: [...closeout.blockers],
    nextStep: closeout.nextStep,
    guardrails: [...closeout.guardrails],
  };
}

export function toEcuadorTaxFilingHandoffResponseDto(
  handoff: EcuadorTaxFilingHandoffView,
): EcuadorTaxFilingHandoffResponseDto {
  return {
    tenantSlug: handoff.tenantSlug,
    period: handoff.period,
    year: handoff.year,
    generatedAt: handoff.generatedAt.toISOString(),
    status: handoff.status,
    externalReference: handoff.externalReference,
    filedAt: handoff.filedAt ? handoff.filedAt.toISOString() : null,
    paidAt: handoff.paidAt ? handoff.paidAt.toISOString() : null,
    amountPaidInCents: handoff.amountPaidInCents,
    currency: handoff.currency,
    responsibleUserId: handoff.responsibleUserId,
    responsibleEmail: handoff.responsibleEmail,
    note: handoff.note,
    operationalCloseoutStatus: handoff.operationalCloseoutStatus,
    transitionHistory: handoff.transitionHistory.map((transition) => ({
      status: transition.status,
      recordedAt: transition.recordedAt.toISOString(),
      externalReference: transition.externalReference,
      responsibleUserId: transition.responsibleUserId,
      responsibleEmail: transition.responsibleEmail,
      note: transition.note,
    })),
    blockers: [...handoff.blockers],
    nextStep: handoff.nextStep,
    guardrails: [...handoff.guardrails],
  };
}

export function toEcuadorTaxAnnexesReadinessResponseDto(
  readiness: EcuadorTaxAnnexesReadinessView,
): EcuadorTaxAnnexesReadinessResponseDto {
  return {
    tenantSlug: readiness.tenantSlug,
    period: readiness.period,
    year: readiness.year,
    generatedAt: readiness.generatedAt.toISOString(),
    readinessStatus: readiness.readinessStatus,
    annexes: readiness.annexes.map((annex) => ({
      ...annex,
      evidenceSources: [...annex.evidenceSources],
      blockers: [...annex.blockers],
    })),
    blockers: [...readiness.blockers],
    nextStep: readiness.nextStep,
    guardrails: [...readiness.guardrails],
  };
}

export function toEcuadorTaxAccountingBridgePreviewResponseDto(
  preview: EcuadorTaxAccountingBridgePreviewView,
): EcuadorTaxAccountingBridgePreviewResponseDto {
  return {
    tenantSlug: preview.tenantSlug,
    period: preview.period,
    year: preview.year,
    generatedAt: preview.generatedAt.toISOString(),
    readinessStatus: preview.readinessStatus,
    entries: preview.entries.map((entry) => ({
      ...entry,
      notes: [...entry.notes],
    })),
    summary: { ...preview.summary },
    blockers: [...preview.blockers],
    nextStep: preview.nextStep,
    guardrails: [...preview.guardrails],
  };
}

export function toEcuadorTaxAccountingBridgeMappingResponseDto(
  mapping: EcuadorTaxAccountingBridgeMappingView,
): EcuadorTaxAccountingBridgeMappingResponseDto {
  return {
    tenantSlug: mapping.tenantSlug,
    period: mapping.period,
    year: mapping.year,
    generatedAt: mapping.generatedAt.toISOString(),
    readinessStatus: mapping.readinessStatus,
    rows: mapping.rows.map((row) => ({
      accountHint: row.accountHint,
      suggestedAccountCode: row.suggestedAccountCode,
      suggestedAccountName: row.suggestedAccountName,
      mapped: row.mapped,
      previewEntryCount: row.previewEntryCount,
      updatedByUserId: row.updatedByUserId,
      updatedByEmail: row.updatedByEmail,
      updatedAt: row.updatedAt ? row.updatedAt.toISOString() : null,
    })),
    summary: { ...mapping.summary },
    blockers: [...mapping.blockers],
    nextStep: mapping.nextStep,
    guardrails: [...mapping.guardrails],
  };
}

export function toEcuadorTaxAccountingBridgeSuggestedAccountsResponseDto(
  catalog: EcuadorTaxAccountingBridgeSuggestedAccountsView,
): EcuadorTaxAccountingBridgeSuggestedAccountsResponseDto {
  return {
    tenantSlug: catalog.tenantSlug,
    period: catalog.period,
    year: catalog.year,
    generatedAt: catalog.generatedAt.toISOString(),
    rows: catalog.rows.map((row) => ({
      ...row,
      appliesToEntryKeys: [...row.appliesToEntryKeys],
      notes: [...row.notes],
    })),
    summary: { ...catalog.summary },
    nextStep: catalog.nextStep,
    guardrails: [...catalog.guardrails],
  };
}

export function toEcuadorTaxGrowthReminderPacketResponseDto(
  packet: EcuadorTaxGrowthReminderPacketView,
): EcuadorTaxGrowthReminderPacketResponseDto {
  return {
    tenantSlug: packet.tenantSlug,
    year: packet.year,
    generatedAt: packet.generatedAt.toISOString(),
    asOfDate: packet.asOfDate,
    readinessStatus: packet.readinessStatus,
    reminders: packet.reminders.map((reminder) => ({ ...reminder })),
    summary: { ...packet.summary },
    targetWorkspace: { ...packet.targetWorkspace },
    nextStep: packet.nextStep,
    guardrails: [...packet.guardrails],
  };
}

export function toEcuadorTaxReviewAssistantPacketResponseDto(
  packet: EcuadorTaxReviewAssistantPacketView,
): EcuadorTaxReviewAssistantPacketResponseDto {
  return {
    tenantSlug: packet.tenantSlug,
    period: packet.period,
    year: packet.year,
    generatedAt: packet.generatedAt.toISOString(),
    readinessStatus: packet.readinessStatus,
    executiveSummary: packet.executiveSummary,
    riskSignals: packet.riskSignals.map((signal) => ({ ...signal })),
    accountantQuestions: [...packet.accountantQuestions],
    suggestedActions: packet.suggestedActions.map((action) => ({ ...action })),
    contextSnapshot: { ...packet.contextSnapshot },
    blockers: [...packet.blockers],
    nextStep: packet.nextStep,
    guardrails: [...packet.guardrails],
  };
}

export function toEcuadorTaxPeriodCloseoutReportResponseDto(
  report: EcuadorTaxPeriodCloseoutReportView,
): EcuadorTaxPeriodCloseoutReportResponseDto {
  return {
    tenantSlug: report.tenantSlug,
    period: report.period,
    year: report.year,
    generatedAt: report.generatedAt.toISOString(),
    readinessStatus: report.readinessStatus,
    sections: report.sections.map((section) => ({ ...section })),
    totals: { ...report.totals },
    filingHandoffStatus: report.filingHandoffStatus,
    closeoutStatus: report.closeoutStatus,
    blockers: [...report.blockers],
    accountantQuestions: [...report.accountantQuestions],
    nextStep: report.nextStep,
    guardrails: [...report.guardrails],
  };
}

export function toEcuadorTaxAccountingReadinessPacketResponseDto(
  packet: EcuadorTaxAccountingReadinessPacketView,
): EcuadorTaxAccountingReadinessPacketResponseDto {
  return {
    tenantSlug: packet.tenantSlug,
    period: packet.period,
    year: packet.year,
    generatedAt: packet.generatedAt.toISOString(),
    readinessStatus: packet.readinessStatus,
    recommendation: packet.recommendation,
    summary: { ...packet.summary },
    decisionSignals: packet.decisionSignals.map((signal) => ({ ...signal })),
    suggestedAccountingScope: packet.suggestedAccountingScope.map((scope) => ({
      ...scope,
    })),
    nextProductRecommendation: { ...packet.nextProductRecommendation },
    blockers: [...packet.blockers],
    nextStep: packet.nextStep,
    guardrails: [...packet.guardrails],
  };
}

export type EcuadorTaxSriVoucherEvidenceResponseDto = Omit<
  EcuadorTaxSriFiscalEvidenceWorkspaceView['voucherRows'][number],
  'authorizationDate' | 'issuedAt'
> & {
  authorizationDate: string | null;
  issuedAt: string | null;
};

export interface EcuadorTaxSriFiscalEvidenceWorkspaceResponseDto
  extends Omit<
    EcuadorTaxSriFiscalEvidenceWorkspaceView,
    'generatedAt' | 'voucherRows'
  > {
  generatedAt: string;
  voucherRows: EcuadorTaxSriVoucherEvidenceResponseDto[];
}

export interface EcuadorTaxSriFiscalEvidenceImportBatchResponseDto
  extends Omit<
    EcuadorTaxSriFiscalEvidenceImportBatchView,
    'generatedAt' | 'voucherRows'
  > {
  generatedAt: string;
  voucherRows: EcuadorTaxSriVoucherEvidenceResponseDto[];
}

export interface EcuadorTaxSriPlatformReconciliationWorkspaceResponseDto
  extends Omit<
    EcuadorTaxSriPlatformReconciliationWorkspaceView,
    'generatedAt'
  > {
  generatedAt: string;
}

export interface EcuadorTaxDeclarationFormCatalogResponseDto
  extends Omit<
    EcuadorTaxDeclarationFormCatalogView,
    'generatedAt' | 'taxpayerProfile'
  > {
  generatedAt: string;
  taxpayerProfile: EcuadorTaxpayerProfileResponseDto;
}

export function toEcuadorTaxSriFiscalEvidenceWorkspaceResponseDto(
  workspace: EcuadorTaxSriFiscalEvidenceWorkspaceView,
): EcuadorTaxSriFiscalEvidenceWorkspaceResponseDto {
  return {
    ...workspace,
    generatedAt: workspace.generatedAt.toISOString(),
    voucherRows: workspace.voucherRows.map(toSriVoucherEvidenceResponseDto),
  };
}

export function toEcuadorTaxSriFiscalEvidenceImportBatchResponseDto(
  batch: EcuadorTaxSriFiscalEvidenceImportBatchView,
): EcuadorTaxSriFiscalEvidenceImportBatchResponseDto {
  return {
    ...batch,
    generatedAt: batch.generatedAt.toISOString(),
    voucherRows: batch.voucherRows.map(toSriVoucherEvidenceResponseDto),
  };
}

export function toEcuadorTaxSriPlatformReconciliationWorkspaceResponseDto(
  workspace: EcuadorTaxSriPlatformReconciliationWorkspaceView,
): EcuadorTaxSriPlatformReconciliationWorkspaceResponseDto {
  return {
    ...workspace,
    generatedAt: workspace.generatedAt.toISOString(),
  };
}

export function toEcuadorTaxDeclarationFormCatalogResponseDto(
  catalog: EcuadorTaxDeclarationFormCatalogView,
): EcuadorTaxDeclarationFormCatalogResponseDto {
  return {
    ...catalog,
    generatedAt: catalog.generatedAt.toISOString(),
    taxpayerProfile: toEcuadorTaxpayerProfileResponseDto(
      catalog.taxpayerProfile,
    ),
  };
}

function toSriVoucherEvidenceResponseDto(
  voucher: EcuadorTaxSriFiscalEvidenceWorkspaceView['voucherRows'][number],
): EcuadorTaxSriVoucherEvidenceResponseDto {
  return {
    ...voucher,
    authorizationDate: voucher.authorizationDate?.toISOString() ?? null,
    issuedAt: voucher.issuedAt?.toISOString() ?? null,
  };
}

function toEvidenceSummaryResponseDto(
  evidenceSummary: EcuadorTaxEvidenceSummaryView,
): EcuadorTaxEvidenceSummaryResponseDto {
  return {
    invoicing: {
      invoiceCount: evidenceSummary.invoicing.invoiceCount,
      statusBreakdown: evidenceSummary.invoicing.statusBreakdown.map(
        (status) => ({
          status: status.status,
          count: status.count,
        }),
      ),
      totalsByCurrency: evidenceSummary.invoicing.totalsByCurrency.map(
        (total) => ({
          currency: total.currency,
          subtotalInCents: total.subtotalInCents,
          taxInCents: total.taxInCents,
          totalInCents: total.totalInCents,
          paidInCents: total.paidInCents,
          outstandingTotalInCents: total.outstandingTotalInCents,
        }),
      ),
      monthlyTotals: evidenceSummary.invoicing.monthlyTotals.map((month) => ({
        month: month.month,
        currency: month.currency,
        invoiceCount: month.invoiceCount,
        totalInCents: month.totalInCents,
        taxInCents: month.taxInCents,
      })),
    },
    parties: {
      totalParties: evidenceSummary.parties.totalParties,
      completeParties: evidenceSummary.parties.completeParties,
      needsReviewParties: evidenceSummary.parties.needsReviewParties,
      issueSummaries: evidenceSummary.parties.issueSummaries.map((issue) => ({
        issue: issue.issue,
        count: issue.count,
      })),
      incompletePartyIds: [...evidenceSummary.parties.incompletePartyIds],
    },
    ecommerce: {
      status: evidenceSummary.ecommerce.status,
      orderCount: evidenceSummary.ecommerce.orderCount,
      readyToInvoiceCount: evidenceSummary.ecommerce.readyToInvoiceCount,
      blockedCount: evidenceSummary.ecommerce.blockedCount,
      needsFiscalDataCount: evidenceSummary.ecommerce.needsFiscalDataCount,
      confirmedPaymentEventCount:
        evidenceSummary.ecommerce.confirmedPaymentEventCount,
      disputedPaymentEventCount:
        evidenceSummary.ecommerce.disputedPaymentEventCount,
      deliveredEventCount: evidenceSummary.ecommerce.deliveredEventCount,
      period: evidenceSummary.ecommerce.period,
      notes: [...evidenceSummary.ecommerce.notes],
    },
  };
}
