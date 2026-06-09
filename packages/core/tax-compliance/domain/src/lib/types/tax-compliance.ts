export type EcuadorTaxpayerRegime =
  | 'general'
  | 'rimpe_entrepreneur'
  | 'rimpe_popular_business'
  | 'unknown';

export type EcuadorTaxObligationKey =
  | 'vat'
  | 'income_tax'
  | 'withholding'
  | 'annexes';

export type EcuadorTaxObligationFrequency =
  | 'monthly'
  | 'semiannual'
  | 'annual'
  | 'event_driven'
  | 'unknown';

export type EcuadorTaxReadinessStatus = 'ready' | 'needs_review' | 'blocked';
export type EcuadorTaxDueStatus =
  | 'overdue'
  | 'due_soon'
  | 'upcoming'
  | 'unscheduled';
export type EcuadorTaxReviewPriority = 'critical' | 'high' | 'normal';
export type EcuadorTaxPeriodWorkspaceStatus =
  | 'blocked'
  | 'needs_review'
  | 'ready_for_accountant'
  | 'ready_for_declaration';
export type EcuadorTaxReconciliationStatus =
  | 'blocked'
  | 'needs_review'
  | 'reconciled';
export type EcuadorTaxVatDeclarationReadinessStatus =
  | 'blocked'
  | 'needs_review'
  | 'ready_for_accountant';
export type EcuadorTaxPeriodCloseoutStatus =
  | 'blocked'
  | 'needs_review'
  | 'ready_for_accountant'
  | 'ready_for_external_filing';
export type EcuadorTaxVatApprovalStatus =
  | 'draft'
  | 'needs_accountant_review'
  | 'changes_requested'
  | 'approved_for_external_filing';
export type EcuadorTaxOperationalCloseoutStatus =
  | 'open'
  | 'in_review'
  | 'ready_for_external_filing'
  | 'closed_operationally';
export type EcuadorTaxFilingHandoffStatus =
  | 'payment_pending'
  | 'filed_externally'
  | 'paid_externally'
  | 'filing_rejected';
export type EcuadorTaxPurchaseExpenseCategory =
  | 'inventory'
  | 'services'
  | 'operating_expense'
  | 'asset'
  | 'non_deductible'
  | 'uncategorized';
export type EcuadorTaxPurchaseExpenseEvidenceStatus =
  | 'draft'
  | 'needs_supplier_data'
  | 'needs_tax_review'
  | 'ready';
export type EcuadorTaxSriVoucherDirection = 'issued' | 'received';
export type EcuadorTaxSriVoucherType =
  | 'invoice'
  | 'credit_note'
  | 'debit_note'
  | 'withholding'
  | 'purchase_settlement'
  | 'remission_guide'
  | 'other';
export type EcuadorTaxSriEvidenceImportSource =
  | 'sri_report'
  | 'sri_xml'
  | 'manual_summary';
export type EcuadorTaxSriReconciliationIssueSeverity =
  | 'blocking'
  | 'review'
  | 'info';
export type EcuadorTaxDeclarationFormKey =
  | 'iva'
  | 'income_tax_natural_person'
  | 'income_tax_company'
  | 'withholding_income_tax'
  | 'multiple_payments'
  | 'multiple_declarations';
export type EcuadorTaxDeclarationFormSupportStatus =
  | 'draftable'
  | 'needs_review'
  | 'manual_only';
export type EcuadorTaxComplianceEventType =
  | 'period_workspace_generated'
  | 'accountant_packet_requested'
  | 'accountant_review_transitioned'
  | 'declaration_draft_requested'
  | 'due_monitor_reviewed'
  | 'tax_sales_book_generated'
  | 'tax_reconciliation_reviewed'
  | 'vat_readiness_packet_requested'
  | 'period_closeout_packet_requested'
  | 'purchase_expense_evidence_reviewed'
  | 'vat_input_output_reconciliation_requested'
  | 'income_tax_evidence_packet_requested'
  | 'purchase_expense_evidence_recorded'
  | 'supplier_fiscal_readiness_reviewed'
  | 'withholding_evidence_packet_requested'
  | 'withholding_draft_bridge_requested'
  | 'withholding_draft_executed'
  | 'tax_rule_catalog_reviewed'
  | 'accountant_workbench_reviewed'
  | 'tax_obligation_settings_upserted'
  | 'vat_declaration_draft_requested'
  | 'period_evidence_vault_reviewed'
  | 'vat_declaration_approval_transitioned'
  | 'withholding_registry_reviewed'
  | 'period_operational_closeout_transitioned'
  | 'tax_filing_handoff_recorded'
  | 'tax_annexes_readiness_reviewed'
  | 'tax_accounting_bridge_preview_requested'
  | 'tax_accounting_bridge_mapping_upserted'
  | 'tax_review_assistant_packet_requested'
  | 'tax_period_closeout_report_requested'
  | 'tax_accounting_readiness_packet_requested'
  | 'sri_fiscal_evidence_import_recorded'
  | 'sri_fiscal_evidence_workspace_reviewed'
  | 'sri_platform_reconciliation_reviewed'
  | 'tax_declaration_form_catalog_reviewed'
  | 'tax_declaration_form_draft_packet_requested'
  | 'tax_filing_guide_packet_requested'
  | 'tax_declaration_artifact_export_requested'
  | 'tax_obligation_matrix_v2_reviewed'
  | 'sri_evidence_intake_v2_reviewed'
  | 'tax_vat_form_contract_reviewed'
  | 'tax_income_tax_form_contract_reviewed'
  | 'tax_annexes_workspace_reviewed'
  | 'tax_period_closeout_certification_requested'
  | 'tax_command_center_reviewed'
  | 'tax_accountant_collaboration_pack_requested'
  | 'tax_filing_evidence_vault_v2_reviewed'
  | 'tax_exception_center_reviewed'
  | 'tax_annual_rollup_workspace_reviewed'
  | 'tax_product_closeout_pack_requested'
  | 'tax_party_sri_evidence_import_recorded'
  | 'tax_party_fiscal_validation_ledger_reviewed'
  | 'tax_declaration_party_recalculation_requested'
  | 'tax_accountant_party_risk_review_requested'
  | 'tax_parties_persistence_decision_pack_requested'
  | 'tax_parties_operational_command_center_reviewed'
  | 'tax_obligation_filing_workspace_reviewed'
  | 'tax_form_box_evidence_binder_reviewed'
  | 'tax_annexes_readiness_v2_reviewed'
  | 'tax_accountant_filing_review_room_v3_reviewed'
  | 'tax_declaration_artifact_export_v2_requested'
  | 'tax_compliance_declaration_closeout_v3_requested'
  | 'tax_external_filing_result_recorded'
  | 'tax_payment_obligation_tracker_reviewed'
  | 'tax_sri_filing_receipt_evidence_vault_reviewed'
  | 'tax_post_filing_exception_center_reviewed'
  | 'tax_period_post_filing_certificate_requested'
  | 'tax_compliance_post_filing_closeout_v4_requested';
export type EcuadorTaxAccountantReviewStatus =
  | 'pending_accountant'
  | 'in_review'
  | 'changes_requested'
  | 'approved';

export interface EcuadorTaxpayerProfileView {
  tenantSlug: string;
  tenantId: string;
  generatedAt: Date;
  country: 'EC';
  legalName: string;
  commercialName: string | null;
  taxpayerId: string | null;
  regime: EcuadorTaxpayerRegime;
  accountingObligated: boolean | null;
  specialTaxpayerCode: string | null;
  matrixAddress: string | null;
  establishmentAddress: string | null;
  source: 'invoicing_issuer_profile';
  readinessStatus: EcuadorTaxReadinessStatus;
  missingFields: string[];
  reviewNotes: string[];
  thirdPartyFiscalSummary: {
    totalParties: number;
    completeParties: number;
    needsReviewParties: number;
    missingFieldCounts: Record<string, number>;
  };
}

export interface EcuadorTaxObligationView {
  key: EcuadorTaxObligationKey;
  label: string;
  applies: boolean;
  frequency: EcuadorTaxObligationFrequency;
  source: 'sri_rule_of_thumb';
  readinessStatus: EcuadorTaxReadinessStatus;
  dependsOn: string[];
  notes: string[];
}

export interface EcuadorTaxObligationMatrixView {
  tenantSlug: string;
  generatedAt: Date;
  taxpayerProfile: EcuadorTaxpayerProfileView;
  obligations: EcuadorTaxObligationView[];
  persistedSettings: EcuadorTaxObligationSettingsView | null;
  guardrails: string[];
}

export interface EcuadorTaxObligationSettingsView {
  tenantSlug: string;
  generatedAt: Date;
  source: 'tax_compliance_event_ledger' | 'heuristic_fallback';
  regime: EcuadorTaxpayerRegime;
  accountingObligated: boolean | null;
  specialTaxpayerCode: string | null;
  ninthDigit: string | null;
  obligations: Array<{
    key: EcuadorTaxObligationKey;
    applies: boolean;
    frequency: EcuadorTaxObligationFrequency;
    notes: string[];
  }>;
  updatedByUserId: string | null;
  updatedByEmail: string | null;
  updatedAt: Date | null;
  guardrails: string[];
}

export interface EcuadorTaxCalendarEntryView {
  obligationKey: EcuadorTaxObligationKey;
  label: string;
  period: string;
  frequency: EcuadorTaxObligationFrequency;
  dueDate: string | null;
  dueDay: number | null;
  source: 'sri_rule_of_thumb';
  readinessStatus: EcuadorTaxReadinessStatus;
  notes: string[];
}

export interface EcuadorTaxObligationCalendarView {
  tenantSlug: string;
  year: number;
  generatedAt: Date;
  taxpayerProfile: EcuadorTaxpayerProfileView;
  ninthDigit: string | null;
  entries: EcuadorTaxCalendarEntryView[];
  guardrails: string[];
}

export interface EcuadorTaxCalendarReviewEntryView
  extends EcuadorTaxCalendarEntryView {
  dueStatus: EcuadorTaxDueStatus;
  daysUntilDue: number | null;
  reviewPriority: EcuadorTaxReviewPriority;
  reviewReasons: string[];
}

export interface EcuadorTaxCalendarReviewWorkspaceView {
  tenantSlug: string;
  year: number;
  generatedAt: Date;
  asOfDate: string;
  taxpayerProfile: EcuadorTaxpayerProfileView;
  summary: {
    totalEntries: number;
    overdueCount: number;
    dueSoonCount: number;
    blockedCount: number;
    needsReviewCount: number;
  };
  priorityEntries: EcuadorTaxCalendarReviewEntryView[];
  nextActions: string[];
  guardrails: string[];
}

export interface EcuadorTaxDueMonitorAlertView {
  obligationKey: EcuadorTaxObligationKey;
  label: string;
  period: string;
  dueDate: string | null;
  dueStatus: EcuadorTaxDueStatus;
  daysUntilDue: number | null;
  severity: EcuadorTaxReviewPriority;
  message: string;
}

export interface EcuadorTaxDueMonitorView {
  tenantSlug: string;
  year: number;
  generatedAt: Date;
  asOfDate: string;
  windowDays: number;
  alerts: EcuadorTaxDueMonitorAlertView[];
  summary: {
    overdueCount: number;
    dueSoonCount: number;
    unscheduledCount: number;
  };
  guardrails: string[];
}

export interface EcuadorTaxEvidenceSummaryView {
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
    status: 'connected' | 'no_activity' | 'requires_review';
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

export interface EcuadorTaxEcommerceEvidenceSummaryView {
  tenantSlug: string;
  period: string;
  generatedAt: Date;
  status: EcuadorTaxEvidenceSummaryView['ecommerce']['status'];
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
    updatedAt: Date;
  }>;
  notes: string[];
}

export interface EcuadorTaxSalesBookView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  source: 'invoicing_and_ecommerce_operational_evidence';
  readinessStatus: EcuadorTaxReadinessStatus;
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
    issuedAt: Date;
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
  ecommerceEvidence: EcuadorTaxEcommerceEvidenceSummaryView;
  blockers: string[];
  reviewNotes: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxPeriodPreparationPacketView {
  tenantSlug: string;
  period: string;
  generatedAt: Date;
  taxpayerProfile: EcuadorTaxpayerProfileView;
  obligations: EcuadorTaxObligationView[];
  readinessStatus: EcuadorTaxReadinessStatus;
  evidenceSummary: EcuadorTaxEvidenceSummaryView;
  salesBookPreview: {
    readinessStatus: EcuadorTaxReadinessStatus;
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

export interface EcuadorTaxDeclarationDraftPacketView {
  tenantSlug: string;
  period: string;
  generatedAt: Date;
  taxpayerProfile: EcuadorTaxpayerProfileView;
  readinessStatus: EcuadorTaxReadinessStatus;
  declarationSections: Array<{
    section: string;
    readinessStatus: EcuadorTaxReadinessStatus;
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
    preparationPacketGeneratedAt: Date;
    calendarEntryCount: number;
    evidenceSummary: EcuadorTaxEvidenceSummaryView;
    salesBookReadinessStatus: EcuadorTaxReadinessStatus;
  };
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxPeriodWorkspaceView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  status: EcuadorTaxPeriodWorkspaceStatus;
  taxpayerProfile: EcuadorTaxpayerProfileView;
  calendarEntries: EcuadorTaxCalendarEntryView[];
  dueAlerts: EcuadorTaxDueMonitorAlertView[];
  preparationPacket: EcuadorTaxPeriodPreparationPacketView;
  declarationDraftPacket: EcuadorTaxDeclarationDraftPacketView;
  salesBook: EcuadorTaxSalesBookView;
  blockers: string[];
  nextActions: string[];
  guardrails: string[];
}

export interface EcuadorTaxReconciliationCheckView {
  key: string;
  source: string;
  readinessStatus: EcuadorTaxReadinessStatus;
  summary: string;
  blockers: string[];
}

export interface EcuadorTaxReconciliationWorkspaceView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  status: EcuadorTaxReconciliationStatus;
  salesBook: EcuadorTaxSalesBookView;
  ecommerceEvidence: EcuadorTaxEcommerceEvidenceSummaryView;
  accountantReviews: EcuadorTaxAccountantReviewView[];
  checks: EcuadorTaxReconciliationCheckView[];
  blockers: string[];
  reviewNotes: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxSriVoucherEvidenceView {
  evidenceId: string;
  direction: EcuadorTaxSriVoucherDirection;
  voucherType: EcuadorTaxSriVoucherType;
  source: EcuadorTaxSriEvidenceImportSource;
  accessKey: string | null;
  authorizationNumber: string | null;
  authorizationDate: Date | null;
  issuedAt: Date | null;
  emitterTaxpayerId: string | null;
  emitterName: string | null;
  receiverTaxpayerId: string | null;
  receiverName: string | null;
  establishment: string | null;
  emissionPoint: string | null;
  sequential: string | null;
  documentNumber: string | null;
  currency: string;
  subtotalInCents: number;
  vatInCents: number;
  incomeTaxWithholdingInCents: number;
  vatWithholdingInCents: number;
  totalInCents: number;
  relatedAccessKey: string | null;
  xmlReference: string | null;
  rideReference: string | null;
  readinessStatus: EcuadorTaxReadinessStatus;
  blockers: string[];
  reviewNotes: string[];
}

export interface EcuadorTaxSriFiscalEvidenceWorkspaceView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  readinessStatus: EcuadorTaxReadinessStatus;
  source: 'tax_compliance_event_ledger';
  summary: {
    totalVouchers: number;
    issuedVouchers: number;
    receivedVouchers: number;
    duplicateAccessKeys: number;
    readyVouchers: number;
    needsReviewVouchers: number;
    blockedVouchers: number;
    importedBatchCount: number;
  };
  totalsByDirectionAndCurrency: Array<{
    direction: EcuadorTaxSriVoucherDirection;
    currency: string;
    voucherCount: number;
    subtotalInCents: number;
    vatInCents: number;
    incomeTaxWithholdingInCents: number;
    vatWithholdingInCents: number;
    totalInCents: number;
  }>;
  voucherRows: EcuadorTaxSriVoucherEvidenceView[];
  blockers: string[];
  reviewNotes: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxSriFiscalEvidenceImportBatchView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  importId: string;
  source: EcuadorTaxSriEvidenceImportSource;
  importedByUserId: string | null;
  importedByEmail: string | null;
  summary: EcuadorTaxSriFiscalEvidenceWorkspaceView['summary'];
  voucherRows: EcuadorTaxSriVoucherEvidenceView[];
  blockers: string[];
  reviewNotes: string[];
  guardrails: string[];
}

export interface EcuadorTaxSriPlatformReconciliationWorkspaceView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  readinessStatus: EcuadorTaxReadinessStatus;
  sriEvidenceSummary: EcuadorTaxSriFiscalEvidenceWorkspaceView['summary'];
  platformSummary: {
    salesDocuments: number;
    purchaseDocuments: number;
    ecommerceOrdersReadyToInvoice: number;
  };
  issueSummary: {
    totalIssues: number;
    blockingIssues: number;
    reviewIssues: number;
    infoIssues: number;
  };
  issues: Array<{
    key: string;
    severity: EcuadorTaxSriReconciliationIssueSeverity;
    source: 'sri' | 'platform' | 'cross_check';
    summary: string;
    evidenceIds: string[];
    platformReferences: string[];
    suggestedAction: string;
  }>;
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxDeclarationFormCatalogView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  readinessStatus: EcuadorTaxReadinessStatus;
  taxpayerProfile: EcuadorTaxpayerProfileView;
  forms: Array<{
    formKey: EcuadorTaxDeclarationFormKey;
    label: string;
    obligationKey: EcuadorTaxObligationKey | 'payment';
    supportStatus: EcuadorTaxDeclarationFormSupportStatus;
    periodicity: EcuadorTaxObligationFrequency;
    taxpayerCompatibility: EcuadorTaxReadinessStatus;
    requiredEvidence: string[];
    draftableBoxes: Array<{
      boxKey: string;
      label: string;
      source: string;
      calculation: string;
    }>;
    manualOnlyBoxes: string[];
    blockers: string[];
    reviewNotes: string[];
  }>;
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxDeclarationFormDraftPacketView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  formKey: EcuadorTaxDeclarationFormKey;
  formLabel: string;
  readinessStatus: EcuadorTaxReadinessStatus;
  supportStatus: EcuadorTaxDeclarationFormSupportStatus;
  suggestedBoxes: Array<{
    boxKey: string;
    label: string;
    suggestedValueInCents: number | null;
    currency: string | null;
    readinessStatus: EcuadorTaxReadinessStatus;
    source: string;
    calculation: string;
    evidenceIds: string[];
    platformReferences: string[];
    explanation: string;
    blockers: string[];
  }>;
  manualOnlyBoxes: Array<{
    boxKey: string;
    reason: string;
    requiredOwner: 'operator' | 'accountant';
  }>;
  evidenceSummary: {
    sriVouchers: number;
    reconciliationIssues: number;
    blockingIssues: number;
    reviewIssues: number;
  };
  accountantReview: {
    required: boolean;
    reasons: string[];
    suggestedQuestions: string[];
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export type EcuadorTaxDeclarationSource =
  | 'invoicing'
  | 'ecommerce'
  | 'sri_import'
  | 'manual_evidence'
  | 'accounting';

export interface EcuadorTaxDeclarationSourceLedgerView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  readinessStatus: EcuadorTaxReadinessStatus;
  sourceRows: Array<{
    rowKey: string;
    source: EcuadorTaxDeclarationSource;
    direction: 'sale' | 'purchase' | 'withholding' | 'accounting_closeout';
    documentType: string;
    reference: string;
    counterpartyName: string | null;
    counterpartyTaxpayerId: string | null;
    issuedAt: Date | null;
    currency: string;
    subtotalInCents: number;
    vatInCents: number;
    incomeTaxWithholdingInCents: number;
    vatWithholdingInCents: number;
    totalInCents: number;
    readinessStatus: EcuadorTaxReadinessStatus;
    blockers: string[];
    notes: string[];
  }>;
  totalsBySource: Array<{
    source: EcuadorTaxDeclarationSource;
    rowCount: number;
    subtotalInCents: number;
    vatInCents: number;
    incomeTaxWithholdingInCents: number;
    vatWithholdingInCents: number;
    totalInCents: number;
  }>;
  summary: {
    rowCount: number;
    salesSubtotalInCents: number;
    purchaseSubtotalInCents: number;
    outputVatInCents: number;
    inputVatInCents: number;
    incomeTaxWithholdingInCents: number;
    vatWithholdingInCents: number;
    gapCount: number;
    accountingCloseoutAvailable: boolean;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxVatDeclarationDraftWorkspaceView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  readinessStatus: EcuadorTaxReadinessStatus;
  sourceLedger: EcuadorTaxDeclarationSourceLedgerView;
  formDraftPacket: EcuadorTaxDeclarationFormDraftPacketView;
  vatBuckets: Array<{
    bucketKey:
      | 'taxable_sales'
      | 'zero_rate_sales'
      | 'not_subject_sales'
      | 'creditable_purchases'
      | 'non_creditable_purchases'
      | 'withholdings';
    label: string;
    amountInCents: number;
    vatInCents: number;
    sourceRowCount: number;
    readinessStatus: EcuadorTaxReadinessStatus;
  }>;
  suggestedFormBoxes: EcuadorTaxDeclarationFormDraftPacketView['suggestedBoxes'];
  summary: {
    bucketCount: number;
    readyBucketCount: number;
    suggestedBoxCount: number;
    outputVatInCents: number;
    inputVatInCents: number;
    estimatedVatPayableInCents: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxFormMappingCatalogView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  readinessStatus: EcuadorTaxReadinessStatus;
  forms: Array<{
    formKey: EcuadorTaxDeclarationFormKey;
    label: string;
    supportStatus: EcuadorTaxDeclarationFormSupportStatus;
    mappings: Array<{
      boxKey: string;
      label: string;
      metricKey: string;
      source: EcuadorTaxDeclarationSource | 'derived' | 'manual';
      confidence: 'high' | 'medium' | 'low';
      explanation: string;
    }>;
    manualOnlyBoxes: string[];
    blockers: string[];
  }>;
  summary: {
    formCount: number;
    mappingCount: number;
    highConfidenceMappingCount: number;
    manualOnlyBoxCount: number;
  };
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxIncomeTaxEvidenceWorkspaceView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  readinessStatus: EcuadorTaxReadinessStatus;
  sourceLedger: EcuadorTaxDeclarationSourceLedgerView;
  evidencePacket: EcuadorTaxIncomeTaxEvidencePacketView;
  classifications: Array<{
    key: string;
    label: string;
    amountInCents: number;
    rowCount: number;
    readinessStatus: EcuadorTaxReadinessStatus;
    notes: string[];
  }>;
  summary: {
    grossRevenueInCents: number;
    deductibleExpenseInCents: number;
    nonDeductibleReviewAmountInCents: number;
    estimatedTaxableBaseInCents: number;
    withholdingCreditInCents: number;
    gapCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxAiFilingAssistantPacketView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  formKey: EcuadorTaxDeclarationFormKey;
  assistantStatus: EcuadorTaxReadinessStatus;
  sourceLedger: EcuadorTaxDeclarationSourceLedgerView;
  vatWorkspace: EcuadorTaxVatDeclarationDraftWorkspaceView;
  incomeTaxWorkspace: EcuadorTaxIncomeTaxEvidenceWorkspaceView;
  suggestedSteps: Array<{
    key: string;
    order: number;
    title: string;
    instruction: string;
    humanGate: boolean;
  }>;
  accountantQuestions: string[];
  evidenceUsed: string[];
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxDeclarationReviewLoopWorkspaceView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  loopStatus:
    | 'draft_ready'
    | 'sent_to_accountant'
    | 'changes_requested'
    | 'approved_for_filing'
    | 'filed_externally';
  latestAccountantReview: EcuadorTaxAccountantReviewView | null;
  filingHandoff: EcuadorTaxFilingHandoffView;
  sourceLedger: EcuadorTaxDeclarationSourceLedgerView;
  reviewChecklist: Array<{
    key: string;
    label: string;
    status: EcuadorTaxReadinessStatus;
    detail: string;
  }>;
  summary: {
    checklistCount: number;
    readyChecklistCount: number;
    sourceRowCount: number;
    blockerCount: number;
    filedExternally: boolean;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxObligationMatrixV2WorkspaceView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  readinessStatus: EcuadorTaxReadinessStatus;
  taxpayerProfile: EcuadorTaxpayerProfileView;
  matrix: EcuadorTaxObligationMatrixView;
  obligations: Array<
    EcuadorTaxObligationView & {
      periodApplicability: 'current_period' | 'annual_context' | 'needs_review';
      accountantRequired: boolean;
      declarationForms: EcuadorTaxDeclarationFormKey[];
      evidenceSources: string[];
      closeoutGate: EcuadorTaxReadinessStatus;
    }
  >;
  summary: {
    obligationCount: number;
    appliesCount: number;
    accountantRequiredCount: number;
    blockedCount: number;
    needsReviewCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxSriEvidenceIntakeV2WorkspaceView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  readinessStatus: EcuadorTaxReadinessStatus;
  workspace: EcuadorTaxSriFiscalEvidenceWorkspaceView;
  sourceLedger: EcuadorTaxDeclarationSourceLedgerView;
  intakeChannels: Array<{
    key: EcuadorTaxSriEvidenceImportSource;
    label: string;
    acceptedFormats: string[];
    voucherCount: number;
    readinessStatus: EcuadorTaxReadinessStatus;
    nextStep: string;
  }>;
  deduplication: {
    duplicateAccessKeys: number;
    ledgerSriRows: number;
    blockedVoucherCount: number;
    needsReviewVoucherCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxVatFormContractWorkspaceView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  readinessStatus: EcuadorTaxReadinessStatus;
  vatWorkspace: EcuadorTaxVatDeclarationDraftWorkspaceView;
  formMappingCatalog: EcuadorTaxFormMappingCatalogView;
  contractBoxes: Array<{
    boxKey: string;
    label: string;
    metricKey: string;
    amountInCents: number;
    source: string;
    confidence: 'high' | 'medium' | 'low';
    readinessStatus: EcuadorTaxReadinessStatus;
    explanation: string;
  }>;
  summary: {
    contractBoxCount: number;
    highConfidenceBoxCount: number;
    manualOnlyBoxCount: number;
    outputVatInCents: number;
    inputVatInCents: number;
    estimatedVatPayableInCents: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxIncomeTaxFormContractWorkspaceView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  readinessStatus: EcuadorTaxReadinessStatus;
  incomeTaxWorkspace: EcuadorTaxIncomeTaxEvidenceWorkspaceView;
  formMappingCatalog: EcuadorTaxFormMappingCatalogView;
  contractLines: Array<{
    key: string;
    label: string;
    amountInCents: number;
    source: string;
    readinessStatus: EcuadorTaxReadinessStatus;
    accountantReviewRequired: boolean;
    notes: string[];
  }>;
  summary: {
    grossRevenueInCents: number;
    deductibleExpenseInCents: number;
    estimatedTaxableBaseInCents: number;
    withholdingCreditInCents: number;
    accountantReviewLineCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxAnnexesWorkspaceView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  readinessStatus: EcuadorTaxReadinessStatus;
  annexesReadiness: EcuadorTaxAnnexesReadinessView;
  sourceLedger: EcuadorTaxDeclarationSourceLedgerView;
  annexWorkItems: Array<{
    key: string;
    label: string;
    readinessStatus: EcuadorTaxReadinessStatus;
    sourceRowCount: number;
    evidenceSources: string[];
    blockers: string[];
    nextStep: string;
  }>;
  summary: {
    applicableAnnexCount: number;
    readyAnnexCount: number;
    sourceRowCount: number;
    blockerCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxPeriodCloseoutCertificationView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  certificationStatus:
    | 'blocked'
    | 'needs_accountant_review'
    | 'ready_to_certify'
    | 'externally_filed';
  closeoutReport: EcuadorTaxPeriodCloseoutReportView;
  declarationReviewLoop: EcuadorTaxDeclarationReviewLoopWorkspaceView;
  obligationMatrix: EcuadorTaxObligationMatrixV2WorkspaceView;
  certificationChecklist: Array<{
    key: string;
    label: string;
    status: EcuadorTaxReadinessStatus;
    detail: string;
  }>;
  summary: {
    checklistCount: number;
    readyChecklistCount: number;
    blockerCount: number;
    accountantQuestionCount: number;
    filedExternally: boolean;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxCommandCenterView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  commandStatus: 'blocked' | 'needs_review' | 'ready' | 'externally_filed';
  certification: EcuadorTaxPeriodCloseoutCertificationView;
  commandTiles: Array<{
    key: string;
    label: string;
    status: EcuadorTaxReadinessStatus;
    primaryMetric: string;
    secondaryMetric: string;
    nextAction: string;
  }>;
  summary: {
    tileCount: number;
    readyTileCount: number;
    blockerCount: number;
    accountantQuestionCount: number;
    filedExternally: boolean;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxAccountantCollaborationPackView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  readinessStatus: EcuadorTaxReadinessStatus;
  certification: EcuadorTaxPeriodCloseoutCertificationView;
  reviewBundle: Array<{
    key: string;
    label: string;
    owner: 'accountant' | 'operator' | 'system';
    priority: EcuadorTaxReviewPriority;
    status: EcuadorTaxReadinessStatus;
    evidenceRefs: string[];
    questions: string[];
  }>;
  summary: {
    bundleItemCount: number;
    accountantOwnedCount: number;
    criticalCount: number;
    questionCount: number;
    blockerCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxFilingEvidenceVaultV2View {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  readinessStatus: EcuadorTaxReadinessStatus;
  baseVault: EcuadorTaxPeriodEvidenceVaultView;
  certification: EcuadorTaxPeriodCloseoutCertificationView;
  evidenceFolders: Array<{
    key: string;
    label: string;
    readinessStatus: EcuadorTaxReadinessStatus;
    artifactCount: number;
    requiredFor: string[];
    missingItems: string[];
  }>;
  summary: {
    folderCount: number;
    readyFolderCount: number;
    artifactCount: number;
    missingItemCount: number;
    certificationBlockerCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxExceptionCenterView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  readinessStatus: EcuadorTaxReadinessStatus;
  exceptions: Array<{
    key: string;
    label: string;
    severity: EcuadorTaxReviewPriority;
    status: EcuadorTaxReadinessStatus;
    source: string;
    owner: 'operator' | 'accountant' | 'system';
    recommendedAction: string;
  }>;
  summary: {
    exceptionCount: number;
    criticalCount: number;
    accountantOwnedCount: number;
    operatorOwnedCount: number;
    blockedCount: number;
  };
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxAnnualRollupWorkspaceView {
  tenantSlug: string;
  year: number;
  generatedAt: Date;
  readinessStatus: EcuadorTaxReadinessStatus;
  currentPeriod: string;
  currentCertification: EcuadorTaxPeriodCloseoutCertificationView;
  monthlySnapshots: Array<{
    period: string;
    status: EcuadorTaxReadinessStatus;
    revenueInCents: number;
    deductibleExpenseInCents: number;
    withholdingCreditInCents: number;
    blockerCount: number;
  }>;
  annualSummary: {
    revenueInCents: number;
    deductibleExpenseInCents: number;
    estimatedTaxableBaseInCents: number;
    withholdingCreditInCents: number;
    reviewedPeriodCount: number;
    blockedPeriodCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxProductCloseoutPackView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  productStatus: 'mvp_complete' | 'needs_closeout' | 'blocked';
  commandCenter: EcuadorTaxCommandCenterView;
  annualRollup: EcuadorTaxAnnualRollupWorkspaceView;
  closeoutChecklist: Array<{
    key: string;
    label: string;
    status: EcuadorTaxReadinessStatus;
    evidence: string[];
  }>;
  summary: {
    checklistCount: number;
    readyChecklistCount: number;
    endpointSurfaceCount: number;
    smokeCoverageCount: number;
    blockerCount: number;
  };
  recommendedNextProduct:
    | 'parties_2_0'
    | 'accounting_2_0'
    | 'tax_compliance_hardening';
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxAccountingEvidenceFromFoundationView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  readinessStatus: EcuadorTaxReadinessStatus;
  evidenceSources: Array<{
    key: string;
    label: string;
    status: EcuadorTaxReadinessStatus;
    source:
      | 'tax_accounting_readiness'
      | 'tax_closeout_report'
      | 'tax_command_center';
    detail: string;
  }>;
  summary: {
    sourceCount: number;
    readySourceCount: number;
    needsReviewSourceCount: number;
    blockedSourceCount: number;
    accountingMappedHints: number;
    accountingUnmappedHints: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxCommandCenterV2View {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  commandStatus: 'blocked' | 'needs_review' | 'ready' | 'externally_filed';
  baseCommandCenter: EcuadorTaxCommandCenterView;
  accountingEvidence: EcuadorTaxAccountingEvidenceFromFoundationView;
  commandTiles: EcuadorTaxCommandCenterView['commandTiles'];
  summary: EcuadorTaxCommandCenterView['summary'] & {
    accountingReadySourceCount: number;
    accountingBlockedSourceCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxAssistedDeclarationReviewPackV2View {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  readinessStatus: EcuadorTaxReadinessStatus;
  commandCenter: EcuadorTaxCommandCenterV2View;
  accountingEvidence: EcuadorTaxAccountingEvidenceFromFoundationView;
  reviewItems: Array<{
    key: string;
    label: string;
    status: EcuadorTaxReadinessStatus;
    owner: 'operator' | 'accountant' | 'system';
    evidenceRefs: string[];
    question: string;
  }>;
  summary: {
    reviewItemCount: number;
    accountantQuestionCount: number;
    blockedItemCount: number;
    readyItemCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxAccountingBoundaryCloseoutView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  boundaryStatus: 'ready' | 'needs_review' | 'blocked';
  currentOperatingModel: 'tax_compliance_plus_accounting_foundation';
  escalationRules: Array<{
    key: string;
    label: string;
    targetProduct: 'tax-compliance-ec' | 'accounting-advanced';
    rationale: string;
  }>;
  backlog: Array<{
    key: string;
    label: string;
    product: 'tax-compliance-ec' | 'accounting-advanced';
    priority: EcuadorTaxReviewPriority;
  }>;
  summary: {
    escalationRuleCount: number;
    taxBacklogCount: number;
    accountingAdvancedBacklogCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxSriSourceImportCenterV2View {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  centerStatus: EcuadorTaxReadinessStatus;
  intake: EcuadorTaxSriEvidenceIntakeV2WorkspaceView;
  reconciliation: EcuadorTaxSriPlatformReconciliationWorkspaceView;
  sourceChannels: Array<{
    key: EcuadorTaxSriEvidenceImportSource;
    label: string;
    status: EcuadorTaxReadinessStatus;
    acceptedFormats: string[];
    voucherCount: number;
    issueCount: number;
    nextAction: string;
  }>;
  summary: {
    channelCount: number;
    readyChannelCount: number;
    sriVoucherCount: number;
    duplicateAccessKeys: number;
    reconciliationIssueCount: number;
    blockingIssueCount: number;
    ledgerSriRows: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxVatDeclarationWorkspaceV2View {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  readinessStatus: EcuadorTaxReadinessStatus;
  vatWorkspace: EcuadorTaxVatDeclarationDraftWorkspaceView;
  accountingEvidence: EcuadorTaxAccountingEvidenceFromFoundationView;
  reviewBuckets: Array<{
    key: string;
    label: string;
    status: EcuadorTaxReadinessStatus;
    amountInCents: number;
    vatInCents: number;
    source: 'vat_workspace' | 'accounting_foundation';
    reviewQuestion: string;
  }>;
  summary: {
    bucketCount: number;
    readyBucketCount: number;
    suggestedBoxCount: number;
    outputVatInCents: number;
    inputVatInCents: number;
    estimatedVatPayableInCents: number;
    accountingBlockedSourceCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxIncomeTaxEvidenceWorkspaceV2View {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  readinessStatus: EcuadorTaxReadinessStatus;
  incomeTaxWorkspace: EcuadorTaxIncomeTaxEvidenceWorkspaceView;
  annualRollup: EcuadorTaxAnnualRollupWorkspaceView;
  accountingEvidence: EcuadorTaxAccountingEvidenceFromFoundationView;
  evidenceLines: Array<{
    key: string;
    label: string;
    status: EcuadorTaxReadinessStatus;
    amountInCents: number;
    source: 'period_income_tax' | 'annual_rollup' | 'accounting_foundation';
    accountantReviewRequired: boolean;
    note: string;
  }>;
  summary: {
    evidenceLineCount: number;
    accountantReviewLineCount: number;
    grossRevenueInCents: number;
    deductibleExpenseInCents: number;
    estimatedTaxableBaseInCents: number;
    withholdingCreditInCents: number;
    annualBlockedPeriodCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxFilingAssistantV2View {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  assistantStatus: EcuadorTaxReadinessStatus;
  assistantPacket: EcuadorTaxAiFilingAssistantPacketView;
  assistedReviewPack: EcuadorTaxAssistedDeclarationReviewPackV2View;
  walkthrough: Array<{
    key: string;
    order: number;
    title: string;
    status: EcuadorTaxReadinessStatus;
    evidenceRefs: string[];
    humanGate: boolean;
    instruction: string;
  }>;
  summary: {
    stepCount: number;
    humanGateCount: number;
    accountantQuestionCount: number;
    blockerCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxAccountantEscalationServiceBoundaryView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  escalationStatus:
    | 'self_service_ready'
    | 'accountant_review_required'
    | 'accounting_advanced_required';
  boundaryCloseout: EcuadorTaxAccountingBoundaryCloseoutView;
  incomeTaxWorkspace: EcuadorTaxIncomeTaxEvidenceWorkspaceV2View;
  escalationRules: Array<{
    key: string;
    label: string;
    status: EcuadorTaxReadinessStatus;
    target: 'tax-compliance-ec' | 'accountant' | 'accounting-advanced';
    trigger: string;
    recommendedAction: string;
  }>;
  summary: {
    ruleCount: number;
    accountantRuleCount: number;
    accountingAdvancedRuleCount: number;
    blockedRuleCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxComplianceCloseoutV2View {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  closeoutStatus: 'ready_for_next_product' | 'needs_review' | 'blocked';
  sriSourceImportCenter: EcuadorTaxSriSourceImportCenterV2View;
  vatDeclarationWorkspace: EcuadorTaxVatDeclarationWorkspaceV2View;
  incomeTaxEvidenceWorkspace: EcuadorTaxIncomeTaxEvidenceWorkspaceV2View;
  filingAssistant: EcuadorTaxFilingAssistantV2View;
  escalationBoundary: EcuadorTaxAccountantEscalationServiceBoundaryView;
  commandCenter: EcuadorTaxCommandCenterV2View;
  checklist: Array<{
    key: string;
    label: string;
    status: EcuadorTaxReadinessStatus;
    evidence: string[];
  }>;
  summary: {
    checklistCount: number;
    readyChecklistCount: number;
    blockerCount: number;
    taxComplianceSurfaceCount: number;
    accountingAdvancedEscalationCount: number;
  };
  recommendedNextStep:
    | 'tax_compliance_hardening'
    | 'accounting_advanced_discovery'
    | 'parties_2_0';
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxEvidenceQualityCenterView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  qualityStatus: EcuadorTaxReadinessStatus;
  closeout: EcuadorTaxComplianceCloseoutV2View;
  qualityFindings: Array<{
    key: string;
    label: string;
    status: EcuadorTaxReadinessStatus;
    source: 'sri' | 'platform' | 'accounting' | 'manual' | 'cross_check';
    severity: EcuadorTaxReviewPriority;
    recommendedAction: string;
  }>;
  summary: {
    findingCount: number;
    readyFindingCount: number;
    blockedFindingCount: number;
    criticalFindingCount: number;
    qualityScore: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxObligationRiskMonitorView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  riskStatus: EcuadorTaxReadinessStatus;
  qualityCenter: EcuadorTaxEvidenceQualityCenterView;
  obligationRisks: Array<{
    key: string;
    label: string;
    status: EcuadorTaxReadinessStatus;
    riskLevel: EcuadorTaxReviewPriority;
    dueSignal: string;
    evidenceSignal: string;
    accountantRequired: boolean;
    recommendedAction: string;
  }>;
  summary: {
    obligationRiskCount: number;
    criticalRiskCount: number;
    accountantRequiredCount: number;
    blockedRiskCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxAccountantHandoffRoomV2View {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  roomStatus: EcuadorTaxReadinessStatus;
  riskMonitor: EcuadorTaxObligationRiskMonitorView;
  filingHandoff: EcuadorTaxFilingHandoffView;
  handoffSections: Array<{
    key: string;
    label: string;
    status: EcuadorTaxReadinessStatus;
    owner: 'operator' | 'accountant' | 'system';
    questionCount: number;
    evidenceRefs: string[];
  }>;
  summary: {
    sectionCount: number;
    readySectionCount: number;
    accountantSectionCount: number;
    questionCount: number;
    blockerCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxFilingReadinessCertificateView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  certificateStatus:
    | 'blocked'
    | 'ready_for_accountant_review'
    | 'ready_for_external_filing';
  handoffRoom: EcuadorTaxAccountantHandoffRoomV2View;
  certificationItems: Array<{
    key: string;
    label: string;
    status: EcuadorTaxReadinessStatus;
    evidence: string[];
    attestation: string;
  }>;
  summary: {
    itemCount: number;
    readyItemCount: number;
    blockerCount: number;
    accountantQuestionCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxOperatingDashboardV3View {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  dashboardStatus: EcuadorTaxReadinessStatus;
  commandCenter: EcuadorTaxCommandCenterV2View;
  qualityCenter: EcuadorTaxEvidenceQualityCenterView;
  riskMonitor: EcuadorTaxObligationRiskMonitorView;
  readinessCertificate: EcuadorTaxFilingReadinessCertificateView;
  dashboardTiles: Array<{
    key: string;
    label: string;
    status: EcuadorTaxReadinessStatus;
    primaryMetric: string;
    secondaryMetric: string;
    nextAction: string;
  }>;
  summary: {
    tileCount: number;
    readyTileCount: number;
    blockerCount: number;
    accountantRequiredCount: number;
    qualityScore: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxComplianceProductCloseoutV3View {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  closeoutStatus: 'mvp_operable' | 'needs_hardening' | 'blocked';
  dashboard: EcuadorTaxOperatingDashboardV3View;
  closeoutChecklist: Array<{
    key: string;
    label: string;
    status: EcuadorTaxReadinessStatus;
    evidence: string[];
  }>;
  summary: {
    checklistCount: number;
    readyChecklistCount: number;
    blockerCount: number;
    operatingSurfaceCount: number;
    qualityScore: number;
  };
  recommendedNextProduct:
    | 'tax_compliance_hardening'
    | 'parties_2_0'
    | 'accounting_advanced_discovery';
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export type EcuadorTaxPartyHardeningRiskLevel =
  | 'critical'
  | 'high'
  | 'medium'
  | 'low';

export interface EcuadorTaxPartyEvidenceBridgeView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  readinessStatus: EcuadorTaxReadinessStatus;
  partyDirectoryStatus: string;
  impactedParties: Array<{
    partyId: string;
    displayName: string;
    roles: string[];
    taxpayerId: string | null;
    riskLevel: EcuadorTaxPartyHardeningRiskLevel;
    impactedObligations: Array<'iva' | 'renta' | 'retenciones' | 'anexos'>;
    missingFields: string[];
    reviewNotes: string[];
    recommendedAction: string;
  }>;
  summary: {
    totalParties: number;
    impactedPartyCount: number;
    criticalPartyCount: number;
    duplicateGroupCount: number;
    blockedForDeclarationsCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxSriTaxpayerValidationReadinessView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  readinessStatus: EcuadorTaxReadinessStatus;
  validationMode: 'readiness_only';
  validationCandidates: Array<{
    partyId: string;
    displayName: string;
    taxpayerId: string | null;
    identificationType: string | null;
    validationStatus: EcuadorTaxReadinessStatus;
    checks: Array<{
      key: string;
      label: string;
      status: EcuadorTaxReadinessStatus;
      detail: string;
    }>;
    recommendedAction: string;
  }>;
  summary: {
    candidateCount: number;
    readyCandidateCount: number;
    blockedCandidateCount: number;
    needsReviewCandidateCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxDeclarationPartyImpactWorkspaceView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  readinessStatus: EcuadorTaxReadinessStatus;
  declarationImpacts: Array<{
    declarationKey: 'iva' | 'renta' | 'retenciones' | 'anexos';
    label: string;
    impactedPartyIds: string[];
    blockedPartyIds: string[];
    readinessStatus: EcuadorTaxReadinessStatus;
    evidenceSource: string;
    nextAction: string;
  }>;
  partyRiskRows: EcuadorTaxPartyEvidenceBridgeView['impactedParties'];
  summary: {
    declarationCount: number;
    blockedDeclarationCount: number;
    impactedPartyCount: number;
    accountantReviewCandidateCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxAssistedFiscalCorrectionFlowView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  flowStatus: EcuadorTaxReadinessStatus;
  correctionCandidates: Array<{
    partyId: string;
    displayName: string;
    priority: 'critical' | 'high' | 'normal';
    source: 'parties_2_0' | 'tax_declaration_impact';
    correctionFields: string[];
    affectedDeclarations: string[];
    suggestedPayload: {
      taxpayerId: string | null;
      identificationType: string | null;
      fiscalAddress: string | null;
      email: string | null;
      taxpayerName: string;
    };
    nextAction: string;
  }>;
  auditTrail: Array<{
    eventKey: string;
    source: string;
    detail: string;
  }>;
  summary: {
    candidateCount: number;
    criticalCandidateCount: number;
    affectedDeclarationCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxAccountantReviewFromPartyRisksView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  escalationStatus: EcuadorTaxReadinessStatus;
  reviewTriggers: Array<{
    key: string;
    label: string;
    status: EcuadorTaxReadinessStatus;
    affectedPartyIds: string[];
    suggestedQuestion: string;
  }>;
  suggestedReviewRequest: {
    reason: string;
    questions: string[];
    evidenceReferences: string[];
  };
  summary: {
    triggerCount: number;
    blockingTriggerCount: number;
    affectedPartyCount: number;
    suggestedQuestionCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxComplianceHardeningCloseoutV4View {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  closeoutStatus: 'tax_hardened' | 'needs_party_cleanup' | 'blocked';
  partyEvidenceBridge: EcuadorTaxPartyEvidenceBridgeView;
  taxpayerValidationReadiness: EcuadorTaxSriTaxpayerValidationReadinessView;
  declarationPartyImpact: EcuadorTaxDeclarationPartyImpactWorkspaceView;
  assistedFiscalCorrectionFlow: EcuadorTaxAssistedFiscalCorrectionFlowView;
  accountantReviewFromPartyRisks: EcuadorTaxAccountantReviewFromPartyRisksView;
  productCloseoutV3: EcuadorTaxComplianceProductCloseoutV3View;
  hardeningChecklist: Array<{
    key: string;
    label: string;
    status: EcuadorTaxReadinessStatus;
    evidence: string[];
  }>;
  summary: {
    checklistCount: number;
    readyChecklistCount: number;
    blockerCount: number;
    partyRiskCount: number;
    accountantTriggerCount: number;
  };
  recommendedNextProduct:
    | 'tax_compliance_hardening'
    | 'parties_persistence'
    | 'accounting_advanced_discovery';
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxPartySriEvidenceImportView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  importStatus: EcuadorTaxReadinessStatus;
  source: 'sri_report' | 'sri_xml' | 'manual_summary' | 'future_api';
  importedByEmail: string | null;
  evidenceRows: Array<{
    partyId: string | null;
    displayName: string;
    taxpayerId: string | null;
    taxpayerName: string | null;
    validationStatus: EcuadorTaxReadinessStatus;
    sourceReference: string | null;
    observedAt: Date | null;
    matchedReadinessStatus: EcuadorTaxReadinessStatus;
    discrepancies: string[];
  }>;
  summary: {
    rowCount: number;
    matchedPartyCount: number;
    blockedRowCount: number;
    discrepancyCount: number;
  };
  eventId: string;
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxPartyFiscalValidationLedgerView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  ledgerStatus: EcuadorTaxReadinessStatus;
  entries: Array<{
    partyId: string;
    displayName: string;
    taxpayerId: string | null;
    currentReadinessStatus: EcuadorTaxReadinessStatus;
    latestEvidenceStatus: EcuadorTaxReadinessStatus | null;
    latestEvidenceSource: string | null;
    latestEvidenceAt: Date | null;
    discrepancyCount: number;
    overrideRequired: boolean;
    auditTrail: Array<{
      eventId: string;
      eventType: EcuadorTaxComplianceEventType;
      source: string;
      occurredAt: Date;
      detail: string;
    }>;
  }>;
  summary: {
    entryCount: number;
    evidenceBackedCount: number;
    discrepancyCount: number;
    overrideRequiredCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxDeclarationPartyRecalculationPacketView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  recalculationStatus: EcuadorTaxReadinessStatus;
  recalculationRows: Array<{
    partyId: string;
    displayName: string;
    affectedDeclarations: string[];
    previousRiskLevel: string;
    currentValidationStatus: EcuadorTaxReadinessStatus | null;
    correctionPending: boolean;
    before: string;
    after: string;
    recommendedAction: string;
  }>;
  summary: {
    rowCount: number;
    declarationCount: number;
    improvedPartyCount: number;
    stillBlockedPartyCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxAccountantPartyRiskReviewExecutionView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  executionStatus: EcuadorTaxReadinessStatus;
  review: EcuadorTaxAccountantReviewView | null;
  suggestedReviewRequest: EcuadorTaxAccountantReviewFromPartyRisksView['suggestedReviewRequest'];
  partyRiskSummary: EcuadorTaxAccountantReviewFromPartyRisksView['summary'];
  executionNotes: string[];
  eventId: string | null;
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxPartiesPersistenceDecisionPackView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  decisionStatus:
    | 'facade_still_ok'
    | 'parties_persistence_candidate'
    | 'blocked';
  decisionDrivers: Array<{
    key: string;
    label: string;
    status: EcuadorTaxReadinessStatus;
    evidence: string;
  }>;
  summary: {
    driverCount: number;
    blockingDriverCount: number;
    persistenceDriverCount: number;
    validationDiscrepancyCount: number;
  };
  recommendedAction: string;
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxPartiesOperationalCommandCenterView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  commandStatus: EcuadorTaxReadinessStatus;
  sriEvidenceImport: EcuadorTaxPartySriEvidenceImportView | null;
  validationLedger: EcuadorTaxPartyFiscalValidationLedgerView;
  recalculationPacket: EcuadorTaxDeclarationPartyRecalculationPacketView;
  accountantReviewExecution: EcuadorTaxAccountantPartyRiskReviewExecutionView;
  persistenceDecision: EcuadorTaxPartiesPersistenceDecisionPackView;
  hardeningCloseout: EcuadorTaxComplianceHardeningCloseoutV4View;
  commandTiles: Array<{
    key: string;
    label: string;
    status: EcuadorTaxReadinessStatus;
    metric: string;
    nextAction: string;
  }>;
  summary: {
    tileCount: number;
    readyTileCount: number;
    blockerCount: number;
    validationDiscrepancyCount: number;
    accountantQuestionCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxObligationFilingWorkspaceView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  workspaceStatus: EcuadorTaxReadinessStatus;
  obligations: Array<{
    key: 'iva' | 'income_tax' | 'withholding' | 'annexes';
    label: string;
    status: EcuadorTaxReadinessStatus;
    dueSignal: string;
    formCoverage: string;
    sourceRowCount: number;
    partyRiskCount: number;
    accountantGate: boolean;
    nextAction: string;
  }>;
  sourceLedger: EcuadorTaxDeclarationSourceLedgerView;
  formCatalog: EcuadorTaxDeclarationFormCatalogView;
  partyCommandCenter: EcuadorTaxPartiesOperationalCommandCenterView;
  summary: {
    obligationCount: number;
    readyObligationCount: number;
    accountantGateCount: number;
    partyRiskCount: number;
    blockerCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxFormBoxEvidenceBinderView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  formKey: EcuadorTaxDeclarationFormKey;
  binderStatus: EcuadorTaxReadinessStatus;
  boxes: Array<{
    boxKey: string;
    label: string;
    suggestedValueInCents: number;
    currency: string;
    readinessStatus: EcuadorTaxReadinessStatus;
    evidenceIds: string[];
    sourceRowCount: number;
    partyRiskCount: number;
    sriPlatformDifferenceCount: number;
    confidence: 'high' | 'medium' | 'low';
    accountantRequired: boolean;
    explanation: string;
  }>;
  manualOnlyBoxes: EcuadorTaxDeclarationFormDraftPacketView['manualOnlyBoxes'];
  sourceLedger: EcuadorTaxDeclarationSourceLedgerView;
  partyCommandCenter: EcuadorTaxPartiesOperationalCommandCenterView;
  summary: {
    boxCount: number;
    readyBoxCount: number;
    accountantRequiredBoxCount: number;
    manualOnlyBoxCount: number;
    evidenceReferenceCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxAnnexesReadinessV2View {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  readinessStatus: EcuadorTaxReadinessStatus;
  annexesWorkspace: EcuadorTaxAnnexesWorkspaceView;
  partyCommandCenter: EcuadorTaxPartiesOperationalCommandCenterView;
  annexes: Array<{
    key: string;
    label: string;
    status: EcuadorTaxReadinessStatus;
    requiredSources: string[];
    sourceRowCount: number;
    partyBlockerCount: number;
    accountantQuestionCount: number;
    nextAction: string;
  }>;
  summary: {
    annexCount: number;
    readyAnnexCount: number;
    blockedAnnexCount: number;
    partyBlockerCount: number;
    accountantQuestionCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxAccountantFilingReviewRoomV3View {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  roomStatus: EcuadorTaxReadinessStatus;
  obligationWorkspace: EcuadorTaxObligationFilingWorkspaceView;
  formBoxBinder: EcuadorTaxFormBoxEvidenceBinderView;
  annexesReadiness: EcuadorTaxAnnexesReadinessV2View;
  handoffRoom: EcuadorTaxAccountantHandoffRoomV2View;
  reviewSections: Array<{
    key: string;
    label: string;
    status: EcuadorTaxReadinessStatus;
    owner: 'operator' | 'accountant' | 'system';
    evidenceRefs: string[];
    questionCount: number;
    nextAction: string;
  }>;
  summary: {
    sectionCount: number;
    readySectionCount: number;
    accountantSectionCount: number;
    questionCount: number;
    blockerCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxDeclarationArtifactExportV2View {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  formKey: EcuadorTaxDeclarationFormKey;
  readinessStatus: EcuadorTaxReadinessStatus;
  baseExport: EcuadorTaxDeclarationArtifactExportView;
  formBoxBinder: EcuadorTaxFormBoxEvidenceBinderView;
  annexesReadiness: EcuadorTaxAnnexesReadinessV2View;
  accountantReviewRoom: EcuadorTaxAccountantFilingReviewRoomV3View;
  artifacts: Array<{
    key: string;
    label: string;
    format: 'json' | 'csv' | 'xlsx' | 'xml' | 'manual_checklist';
    supportStatus: 'available' | 'manual_only' | 'blocked';
    payload: Record<string, unknown>;
    blockers: string[];
  }>;
  summary: {
    artifactCount: number;
    availableArtifactCount: number;
    manualOnlyArtifactCount: number;
    blockedArtifactCount: number;
  };
  blockedCapabilities: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxComplianceDeclarationCloseoutV3View {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  closeoutStatus:
    | 'ready_for_external_filing'
    | 'accountant_review_required'
    | 'blocked'
    | 'accounting_advanced_candidate';
  obligationWorkspace: EcuadorTaxObligationFilingWorkspaceView;
  formBoxBinder: EcuadorTaxFormBoxEvidenceBinderView;
  annexesReadiness: EcuadorTaxAnnexesReadinessV2View;
  accountantReviewRoom: EcuadorTaxAccountantFilingReviewRoomV3View;
  artifactExport: EcuadorTaxDeclarationArtifactExportV2View;
  closeoutItems: Array<{
    key: string;
    label: string;
    status: EcuadorTaxReadinessStatus;
    evidence: string[];
  }>;
  summary: {
    itemCount: number;
    readyItemCount: number;
    blockerCount: number;
    accountantQuestionCount: number;
    availableArtifactCount: number;
  };
  recommendedNextStep:
    | 'external_filing_handoff'
    | 'accountant_review'
    | 'tax_evidence_cleanup'
    | 'accounting_advanced_discovery';
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxExternalFilingResultRecordView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  resultId: string;
  obligationKey: 'iva' | 'income_tax' | 'withholding' | 'annexes';
  formKey: EcuadorTaxDeclarationFormKey | null;
  resultStatus:
    | 'submitted_externally'
    | 'rejected_externally'
    | 'under_review'
    | 'payment_pending'
    | 'paid_externally';
  externalReference: string | null;
  filedAt: Date | null;
  paidAt: Date | null;
  expectedAmountInCents: number | null;
  paidAmountInCents: number | null;
  currency: string;
  responsibleUserId: string | null;
  responsibleEmail: string | null;
  evidenceRefs: string[];
  note: string | null;
  handoff: EcuadorTaxFilingHandoffView;
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxPaymentObligationTrackerView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  trackerStatus: EcuadorTaxReadinessStatus;
  filingResults: EcuadorTaxExternalFilingResultRecordView[];
  paymentRows: Array<{
    key: string;
    obligationKey: string;
    formKey: EcuadorTaxDeclarationFormKey | null;
    paymentStatus:
      | 'not_applicable'
      | 'pending'
      | 'partial'
      | 'paid'
      | 'rejected';
    expectedAmountInCents: number;
    paidAmountInCents: number;
    outstandingAmountInCents: number;
    currency: string;
    dueSignal: string;
    externalReference: string | null;
    nextAction: string;
  }>;
  summary: {
    rowCount: number;
    paidRowCount: number;
    pendingRowCount: number;
    expectedAmountInCents: number;
    paidAmountInCents: number;
    outstandingAmountInCents: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxSriFilingReceiptEvidenceVaultView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  vaultStatus: EcuadorTaxReadinessStatus;
  filingResults: EcuadorTaxExternalFilingResultRecordView[];
  receiptFolders: Array<{
    key: string;
    label: string;
    readinessStatus: EcuadorTaxReadinessStatus;
    externalReference: string | null;
    evidenceRefs: string[];
    requiredItems: string[];
    missingItems: string[];
  }>;
  summary: {
    folderCount: number;
    readyFolderCount: number;
    evidenceRefCount: number;
    missingItemCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxPostFilingExceptionCenterView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  centerStatus: EcuadorTaxReadinessStatus;
  paymentTracker: EcuadorTaxPaymentObligationTrackerView;
  receiptVault: EcuadorTaxSriFilingReceiptEvidenceVaultView;
  exceptions: Array<{
    key: string;
    label: string;
    status: EcuadorTaxReadinessStatus;
    severity: EcuadorTaxReviewPriority;
    owner: 'operator' | 'accountant' | 'system';
    source: 'filing_result' | 'payment' | 'receipt_vault' | 'closeout';
    recommendedAction: string;
  }>;
  summary: {
    exceptionCount: number;
    criticalCount: number;
    accountantOwnedCount: number;
    blockerCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxPeriodPostFilingCertificateView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  certificateStatus:
    | 'post_filing_complete'
    | 'payment_or_receipt_pending'
    | 'accountant_review_required'
    | 'blocked';
  declarationCloseout: EcuadorTaxComplianceDeclarationCloseoutV3View;
  paymentTracker: EcuadorTaxPaymentObligationTrackerView;
  receiptVault: EcuadorTaxSriFilingReceiptEvidenceVaultView;
  exceptionCenter: EcuadorTaxPostFilingExceptionCenterView;
  certificateItems: Array<{
    key: string;
    label: string;
    status: EcuadorTaxReadinessStatus;
    evidence: string[];
    attestation: string;
  }>;
  summary: {
    itemCount: number;
    readyItemCount: number;
    blockerCount: number;
    outstandingAmountInCents: number;
    evidenceRefCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxCompliancePostFilingCloseoutV4View {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  closeoutStatus:
    | 'closed_operationally'
    | 'payment_or_evidence_pending'
    | 'accountant_review_required'
    | 'accounting_advanced_candidate'
    | 'blocked';
  filingResults: EcuadorTaxExternalFilingResultRecordView[];
  paymentTracker: EcuadorTaxPaymentObligationTrackerView;
  receiptVault: EcuadorTaxSriFilingReceiptEvidenceVaultView;
  exceptionCenter: EcuadorTaxPostFilingExceptionCenterView;
  postFilingCertificate: EcuadorTaxPeriodPostFilingCertificateView;
  closeoutItems: Array<{
    key: string;
    label: string;
    status: EcuadorTaxReadinessStatus;
    evidence: string[];
  }>;
  summary: {
    itemCount: number;
    readyItemCount: number;
    blockerCount: number;
    outstandingAmountInCents: number;
    exceptionCount: number;
  };
  recommendedNextStep:
    | 'period_closed'
    | 'collect_payment_or_receipt'
    | 'accountant_review'
    | 'accounting_advanced_discovery';
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxFilingGuidePacketView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  formKey: EcuadorTaxDeclarationFormKey;
  readinessStatus: EcuadorTaxReadinessStatus;
  assistantMode: 'guided_manual_entry';
  steps: Array<{
    key: string;
    order: number;
    title: string;
    instruction: string;
    source: string;
    humanGate: boolean;
  }>;
  copyChecklist: Array<{
    boxKey: string;
    label: string;
    valueLabel: string;
    evidenceCount: number;
    reviewRequired: boolean;
  }>;
  accountantQuestions: string[];
  blockedCapabilities: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxDeclarationArtifactExportView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  formKey: EcuadorTaxDeclarationFormKey;
  readinessStatus: EcuadorTaxReadinessStatus;
  exportMode: 'guided_manual' | 'technical_artifact_available';
  artifacts: Array<{
    key: string;
    label: string;
    format: 'json' | 'csv' | 'xlsx' | 'xml' | 'manual_checklist';
    supportStatus: 'available' | 'manual_only' | 'blocked';
    payload: Record<string, unknown>;
    blockers: string[];
  }>;
  blockedCapabilities: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxAccountantReviewPacketView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  executiveSummary: string;
  workspaceStatus: EcuadorTaxPeriodWorkspaceStatus;
  declarationSections: EcuadorTaxDeclarationDraftPacketView['declarationSections'];
  suggestedQuestions: string[];
  missingEvidence: string[];
  calendarAlerts: EcuadorTaxDueMonitorAlertView[];
  incompleteThirdPartyIds: string[];
  sourceEvidenceSummary: EcuadorTaxEvidenceSummaryView;
  handoffChecklist: string[];
  responsibilityGuardrails: string[];
  nextStep: string;
}

export interface EcuadorTaxAuditReadinessView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
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

export interface EcuadorTaxVatDeclarationReadinessPacketView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  readinessStatus: EcuadorTaxVatDeclarationReadinessStatus;
  reconciliationStatus: EcuadorTaxReconciliationStatus;
  vatObligation: EcuadorTaxCalendarEntryView | null;
  salesTotalsByCurrency: EcuadorTaxSalesBookView['totalsByCurrency'];
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

export interface EcuadorTaxPeriodCloseoutPacketView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  closeoutStatus: EcuadorTaxPeriodCloseoutStatus;
  workspaceStatus: EcuadorTaxPeriodWorkspaceStatus;
  salesBookStatus: EcuadorTaxReadinessStatus;
  reconciliationStatus: EcuadorTaxReconciliationStatus;
  vatReadinessStatus: EcuadorTaxVatDeclarationReadinessStatus;
  latestAccountantReview: EcuadorTaxAccountantReviewView | null;
  approvalReadiness: EcuadorTaxDeclarationApprovalPacketView['approvalReadiness'];
  ledgerCompleteness: {
    requiredEventTypes: EcuadorTaxComplianceEventType[];
    presentEventTypes: EcuadorTaxComplianceEventType[];
    missingEventTypes: EcuadorTaxComplianceEventType[];
  };
  closeoutChecklist: string[];
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxPurchaseExpenseEvidenceRecordView {
  evidenceId: string;
  tenantSlug: string;
  period: string;
  year: number;
  supplierPartyId: string | null;
  supplierName: string;
  supplierTaxpayerId: string | null;
  documentNumber: string | null;
  documentCode: string | null;
  issuedAt: Date | null;
  category: EcuadorTaxPurchaseExpenseCategory;
  currency: string;
  subtotalInCents: number;
  vatInCents: number;
  totalInCents: number;
  deductible: boolean | null;
  supportReference: string | null;
  status: EcuadorTaxPurchaseExpenseEvidenceStatus;
  readinessStatus: EcuadorTaxReadinessStatus;
  blockers: string[];
  reviewNotes: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface EcuadorTaxPurchaseExpenseEvidenceWorkspaceView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  readinessStatus: EcuadorTaxReadinessStatus;
  source: 'operational_intake';
  documentRows: Array<{
    evidenceId: string;
    supplierPartyId: string | null;
    supplierName: string;
    supplierTaxpayerId: string | null;
    documentNumber: string | null;
    documentCode: string | null;
    issuedAt: Date | null;
    category: EcuadorTaxPurchaseExpenseCategory;
    currency: string;
    subtotalInCents: number;
    vatInCents: number;
    totalInCents: number;
    deductible: boolean | null;
    supportReference: string | null;
    status: EcuadorTaxPurchaseExpenseEvidenceStatus;
    readinessStatus: EcuadorTaxReadinessStatus;
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

export interface EcuadorTaxSupplierFiscalReadinessWorkspaceView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  readinessStatus: EcuadorTaxReadinessStatus;
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
    source: 'parties' | 'purchase_expense_evidence';
    purchaseEvidenceCount: number;
    missingFields: string[];
    readinessStatus: EcuadorTaxReadinessStatus;
    blockers: string[];
  }>;
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxVatInputOutputReconciliationPacketView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  readinessStatus: EcuadorTaxReadinessStatus;
  outputVatByCurrency: EcuadorTaxVatDeclarationReadinessPacketView['vatSummaryByCurrency'];
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
  purchaseExpenseEvidenceStatus: EcuadorTaxReadinessStatus;
  vatReadinessStatus: EcuadorTaxVatDeclarationReadinessStatus;
  blockers: string[];
  accountantQuestions: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxVatDeclarationDraftView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  readinessStatus: EcuadorTaxReadinessStatus;
  vatObligation: EcuadorTaxCalendarEntryView | null;
  outputVatByCurrency: EcuadorTaxVatInputOutputReconciliationPacketView['outputVatByCurrency'];
  inputVatByCurrency: EcuadorTaxVatInputOutputReconciliationPacketView['inputVatByCurrency'];
  netVatByCurrency: EcuadorTaxVatInputOutputReconciliationPacketView['netVatByCurrency'];
  declarationSections: Array<{
    key: string;
    label: string;
    readinessStatus: EcuadorTaxReadinessStatus;
    amountInCents: number;
    currency: string | null;
    notes: string[];
  }>;
  blockers: string[];
  accountantQuestions: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxVatDeclarationApprovalView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  status: EcuadorTaxVatApprovalStatus;
  draft: EcuadorTaxVatDeclarationDraftView;
  transitionHistory: Array<{
    status: EcuadorTaxVatApprovalStatus;
    transitionedAt: Date;
    transitionedByUserId: string | null;
    transitionedByEmail: string | null;
    note: string | null;
  }>;
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxIncomeTaxEvidencePacketView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  readinessStatus: EcuadorTaxReadinessStatus;
  incomeObligation: EcuadorTaxCalendarEntryView | null;
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

export interface EcuadorTaxWithholdingEvidencePacketView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  readinessStatus: EcuadorTaxReadinessStatus;
  withholdingObligation: EcuadorTaxCalendarEntryView | null;
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
    category: EcuadorTaxPurchaseExpenseCategory;
    candidateReason: string;
  }>;
  blockers: string[];
  accountantQuestions: string[];
  supportChecklist: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxWithholdingDraftBridgePacketView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  readinessStatus: EcuadorTaxReadinessStatus;
  source: 'withholding_evidence_packet';
  selectedCandidate: {
    candidateType: 'sale' | 'purchase';
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
    issuedAt: Date | null;
    notes: string | null;
  } | null;
  bridgeChecklist: string[];
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxWithholdingDraftExecutionPacketView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  readinessStatus: EcuadorTaxReadinessStatus;
  bridgePacket: EcuadorTaxWithholdingDraftBridgePacketView;
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

export interface EcuadorTaxWithholdingRegistryView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  readinessStatus: EcuadorTaxReadinessStatus;
  summary: {
    salesCandidateCount: number;
    purchaseCandidateCount: number;
    executedDraftCount: number;
    pendingSupportCount: number;
  };
  rows: Array<{
    key: string;
    source: 'sales_candidate' | 'purchase_candidate' | 'executed_draft';
    label: string;
    readinessStatus: EcuadorTaxReadinessStatus;
    amountInCents: number;
    currency: string;
    supportReference: string | null;
    nextStep: string;
  }>;
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxRuleCatalogView {
  tenantSlug: string;
  generatedAt: Date;
  country: 'EC';
  readinessStatus: EcuadorTaxReadinessStatus;
  rules: Array<{
    ruleKey: string;
    obligationKey: EcuadorTaxObligationKey;
    title: string;
    appliesToCategory: EcuadorTaxPurchaseExpenseCategory | null;
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

export interface EcuadorTaxAccountantWorkbenchView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  readinessStatus: EcuadorTaxReadinessStatus;
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
    readinessStatus: EcuadorTaxReadinessStatus;
    blockerCount: number;
    questionCount: number;
    nextStep: string;
  }>;
  blockers: string[];
  accountantQuestions: string[];
  latestAccountantReview: EcuadorTaxAccountantReviewView | null;
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxPeriodEvidenceVaultView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  readinessStatus: EcuadorTaxReadinessStatus;
  folders: Array<{
    key: string;
    label: string;
    readinessStatus: EcuadorTaxReadinessStatus;
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

export interface EcuadorTaxOperationalCloseoutView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  status: EcuadorTaxOperationalCloseoutStatus;
  checklist: Array<{
    key: string;
    label: string;
    completed: boolean;
    blocker: string | null;
  }>;
  vatApprovalStatus: EcuadorTaxVatApprovalStatus;
  withholdingReadinessStatus: EcuadorTaxReadinessStatus;
  evidenceVaultStatus: EcuadorTaxReadinessStatus;
  transitionHistory: Array<{
    status: EcuadorTaxOperationalCloseoutStatus;
    transitionedAt: Date;
    transitionedByUserId: string | null;
    transitionedByEmail: string | null;
    note: string | null;
  }>;
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxFilingHandoffView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  status: EcuadorTaxFilingHandoffStatus | null;
  externalReference: string | null;
  filedAt: Date | null;
  paidAt: Date | null;
  amountPaidInCents: number | null;
  currency: string | null;
  responsibleUserId: string | null;
  responsibleEmail: string | null;
  note: string | null;
  operationalCloseoutStatus: EcuadorTaxOperationalCloseoutStatus;
  transitionHistory: Array<{
    status: EcuadorTaxFilingHandoffStatus;
    recordedAt: Date;
    externalReference: string | null;
    responsibleUserId: string | null;
    responsibleEmail: string | null;
    note: string | null;
  }>;
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxAnnexesReadinessView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  readinessStatus: EcuadorTaxReadinessStatus;
  annexes: Array<{
    key: string;
    label: string;
    applies: boolean;
    readinessStatus: EcuadorTaxReadinessStatus;
    evidenceSources: string[];
    blockerCount: number;
    blockers: string[];
    nextStep: string;
  }>;
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxAccountingBridgePreviewView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  readinessStatus: EcuadorTaxReadinessStatus;
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

export interface EcuadorTaxAccountingBridgeMappingView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  readinessStatus: EcuadorTaxReadinessStatus;
  rows: Array<{
    accountHint: string;
    suggestedAccountCode: string | null;
    suggestedAccountName: string | null;
    mapped: boolean;
    previewEntryCount: number;
    updatedByUserId: string | null;
    updatedByEmail: string | null;
    updatedAt: Date | null;
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

export interface EcuadorTaxAccountingBridgeSuggestedAccountsView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  rows: Array<{
    accountHint: string;
    suggestedAccountCode: string;
    suggestedAccountName: string;
    category:
      | 'sales'
      | 'vat'
      | 'withholding'
      | 'purchase'
      | 'expense'
      | 'uncategorized';
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

export interface EcuadorTaxGrowthReminderPacketView {
  tenantSlug: string;
  year: number;
  generatedAt: Date;
  asOfDate: string;
  readinessStatus: EcuadorTaxReadinessStatus;
  reminders: Array<{
    key: string;
    obligationKey: string;
    period: string;
    dueDate: string | null;
    severity: 'critical' | 'high' | 'normal';
    channel: 'whatsapp' | 'manual';
    suggestedMessage: string;
    owner: 'operator' | 'accountant';
    source: string;
  }>;
  summary: {
    reminderCount: number;
    overdueCount: number;
    dueSoonCount: number;
  };
  targetWorkspace: {
    productKey: 'growth';
    handoffMode: 'operator_assist';
  };
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxReviewAssistantPacketView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  readinessStatus: EcuadorTaxReadinessStatus;
  executiveSummary: string;
  riskSignals: Array<{
    key: string;
    severity: EcuadorTaxReviewPriority;
    label: string;
    detail: string;
    source: string;
  }>;
  accountantQuestions: string[];
  suggestedActions: Array<{
    key: string;
    label: string;
    owner: 'operator' | 'accountant' | 'system';
    priority: EcuadorTaxReviewPriority;
    source: string;
  }>;
  contextSnapshot: {
    vatApprovalStatus: EcuadorTaxVatApprovalStatus;
    operationalCloseoutStatus: EcuadorTaxOperationalCloseoutStatus;
    filingHandoffStatus: EcuadorTaxFilingHandoffStatus | null;
    annexesReadinessStatus: EcuadorTaxReadinessStatus;
    accountingBridgeReadinessStatus: EcuadorTaxReadinessStatus;
    accountingBridgeMappingStatus: EcuadorTaxReadinessStatus;
    accountingBridgeUnmappedHintCount: number;
    evidenceVaultStatus: EcuadorTaxReadinessStatus;
    eventCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxPeriodCloseoutReportView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  readinessStatus: EcuadorTaxReadinessStatus;
  sections: Array<{
    key: string;
    label: string;
    readinessStatus: EcuadorTaxReadinessStatus;
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
    sriImportedVouchers: number;
    sriReconciliationIssues: number;
    declarationForms: number;
    declarationDraftBoxes: number;
    filingGuideSteps: number;
    declarationArtifacts: number;
    auditEventCount: number;
  };
  filingHandoffStatus: EcuadorTaxFilingHandoffStatus | null;
  closeoutStatus: EcuadorTaxOperationalCloseoutStatus;
  blockers: string[];
  accountantQuestions: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxAccountingReadinessPacketView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  readinessStatus: EcuadorTaxReadinessStatus;
  recommendation: 'stay_in_tax_compliance' | 'graduate_to_accounting';
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
    severity: EcuadorTaxReviewPriority;
    rationale: string;
  }>;
  suggestedAccountingScope: Array<{
    key: string;
    label: string;
    reason: string;
    source: string;
  }>;
  nextProductRecommendation: {
    productKey: 'tax-compliance-ec' | 'accounting';
    rationale: string;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxComplianceEventView {
  id: string;
  tenantId: string;
  tenantSlug: string;
  period: string;
  year: number;
  eventType: EcuadorTaxComplianceEventType;
  source: string;
  payload: Record<string, unknown>;
  occurredAt: Date;
  createdAt: Date;
}

export interface EcuadorTaxAccountantReviewView {
  id: string;
  tenantId: string;
  tenantSlug: string;
  period: string;
  year: number;
  status: EcuadorTaxAccountantReviewStatus;
  requestedByUserId: string | null;
  requestedByEmail: string | null;
  summary: string;
  questions: string[];
  evidenceSummary: EcuadorTaxEvidenceSummaryView;
  transitionHistory: Array<{
    status: EcuadorTaxAccountantReviewStatus;
    transitionedAt: Date;
    transitionedByUserId: string | null;
    note: string | null;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export interface EcuadorTaxDeclarationApprovalPacketView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  latestAccountantReview: EcuadorTaxAccountantReviewView | null;
  approvalReadiness:
    | 'blocked'
    | 'needs_accountant_review'
    | 'ready_for_human_approval';
  remainingBlockers: string[];
  evidenceSummary: EcuadorTaxEvidenceSummaryView;
  declarationSections: EcuadorTaxDeclarationDraftPacketView['declarationSections'];
  availableAuditEvents: EcuadorTaxComplianceEventView[];
  approvalChecklist: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxAnnualFiscalYearWorkspaceView {
  tenantSlug: string;
  year: number;
  generatedAt: Date;
  workspaceStatus: EcuadorTaxReadinessStatus;
  periodRows: Array<{
    period: string;
    eventCount: number;
    filingEventCount: number;
    paymentEventCount: number;
    exceptionEventCount: number;
    readinessStatus: EcuadorTaxReadinessStatus;
  }>;
  annualTotals: {
    periodCount: number;
    eventCount: number;
    filingEventCount: number;
    paymentEventCount: number;
    exceptionEventCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxAnnualIncomeTaxReconciliationV2View {
  tenantSlug: string;
  year: number;
  generatedAt: Date;
  reconciliationStatus: EcuadorTaxReadinessStatus;
  reconciliationRows: Array<{
    key: string;
    label: string;
    status: EcuadorTaxReadinessStatus;
    evidence: string;
    differenceSignal: 'none' | 'review_required' | 'blocked';
  }>;
  summary: {
    rowCount: number;
    needsReviewCount: number;
    blockedCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxAuditReadinessBinderView {
  tenantSlug: string;
  year: number;
  generatedAt: Date;
  binderStatus: EcuadorTaxReadinessStatus;
  folders: Array<{
    key: string;
    label: string;
    status: EcuadorTaxReadinessStatus;
    evidenceCount: number;
    owner: 'operator' | 'accountant';
  }>;
  summary: {
    folderCount: number;
    readyFolderCount: number;
    needsReviewFolderCount: number;
    blockedFolderCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxExternalAccountantAnnualReviewRoomView {
  tenantSlug: string;
  year: number;
  generatedAt: Date;
  roomStatus: EcuadorTaxReadinessStatus;
  reviewSections: Array<{
    key: string;
    label: string;
    status: EcuadorTaxReadinessStatus;
    questions: string[];
    evidenceRefs: string[];
  }>;
  summary: {
    sectionCount: number;
    questionCount: number;
    blockedSectionCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxAccountingAdvancedDiscoveryGateView {
  tenantSlug: string;
  year: number;
  generatedAt: Date;
  gateStatus: EcuadorTaxReadinessStatus;
  decisionSignals: Array<{
    key: string;
    label: string;
    severity: EcuadorTaxReviewPriority;
    rationale: string;
  }>;
  recommendation: {
    nextProduct: 'tax-compliance-ec' | 'accounting-advanced';
    reason: string;
    openAdvancedAccountingNow: boolean;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxComplianceAnnualCloseoutV5View {
  tenantSlug: string;
  year: number;
  generatedAt: Date;
  closeoutStatus: EcuadorTaxReadinessStatus;
  checklist: Array<{
    key: string;
    label: string;
    status: EcuadorTaxReadinessStatus;
    evidence: string;
  }>;
  decision: {
    status:
      | 'ready_for_external_accountant_review'
      | 'needs_evidence_hardening'
      | 'blocked';
    recommendedNextProduct: 'tax-compliance-ec' | 'accounting-advanced';
  };
  summary: {
    checkCount: number;
    readyCheckCount: number;
    needsReviewCheckCount: number;
    blockedCheckCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxProfessionalHandoffV6View {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  handoffStatus: EcuadorTaxReadinessStatus;
  accountantHandoffRoom: EcuadorTaxAccountantHandoffRoomV2View;
  annualCloseout: EcuadorTaxComplianceAnnualCloseoutV5View;
  professionalReviewSections: Array<{
    key: string;
    label: string;
    status: EcuadorTaxReadinessStatus;
    owner: 'operator' | 'accountant' | 'external_professional';
    evidenceRefs: string[];
    question: string;
  }>;
  decision: {
    serviceMode:
      | 'self_service_assisted'
      | 'external_accountant_review'
      | 'accounting_advanced_discovery';
    reason: string;
    accountantRequired: boolean;
  };
  summary: {
    sectionCount: number;
    accountantOwnedSectionCount: number;
    readySectionCount: number;
    needsReviewSectionCount: number;
    blockedSectionCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxAccountingAdvancedGateV2View {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  gateStatus: EcuadorTaxReadinessStatus;
  baseGate: EcuadorTaxAccountingAdvancedDiscoveryGateView;
  professionalHandoff: EcuadorTaxProfessionalHandoffV6View;
  decisionSignals: Array<{
    key: string;
    label: string;
    severity: EcuadorTaxReviewPriority;
    source: 'tax_compliance' | 'accountant_handoff' | 'annual_closeout';
    rationale: string;
  }>;
  recommendation: {
    nextProduct: 'tax-compliance-ec' | 'accounting-advanced';
    openAdvancedAccountingNow: boolean;
    reason: string;
    minimumEvidenceBeforeOpening: string[];
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxAccountingBoundaryAiReviewView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  reviewStatus: EcuadorTaxReadinessStatus;
  professionalHandoff: EcuadorTaxProfessionalHandoffV6View;
  accountingAdvancedGate: EcuadorTaxAccountingAdvancedGateV2View;
  boundaryLanes: Array<{
    key: string;
    label: string;
    owner: 'tax_compliance' | 'accounting_foundation' | 'accounting_advanced' | 'external_accountant';
    status: EcuadorTaxReadinessStatus;
    explanation: string;
    blockedAutomation: string[];
  }>;
  assistantInstructions: {
    allowedOutputs: string[];
    blockedOutputs: string[];
    requiredReview: string;
  };
  summary: {
    laneCount: number;
    blockedLaneCount: number;
    accountantRequired: boolean;
    openAdvancedAccountingNow: boolean;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface EcuadorTaxDeclarationHandoffCloseoutV6View {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  closeoutStatus: EcuadorTaxReadinessStatus;
  declarationCloseout: EcuadorTaxComplianceCloseoutV2View;
  professionalHandoff: EcuadorTaxProfessionalHandoffV6View;
  accountingAdvancedGate: EcuadorTaxAccountingAdvancedGateV2View;
  accountingBoundaryAiReview: EcuadorTaxAccountingBoundaryAiReviewView;
  handoffLanes: Array<{
    key: string;
    label: string;
    status: EcuadorTaxReadinessStatus;
    owner:
      | 'operator'
      | 'tax_compliance'
      | 'external_accountant'
      | 'accounting_advanced';
    evidenceRefs: string[];
    action: string;
  }>;
  decision: {
    nextStep:
      | 'continue_assisted_tax'
      | 'send_to_external_accountant'
      | 'open_accounting_advanced_discovery';
    reason: string;
    accountantRequired: boolean;
    openAdvancedAccountingNow: boolean;
  };
  summary: {
    laneCount: number;
    readyLaneCount: number;
    needsReviewLaneCount: number;
    blockedLaneCount: number;
    blockerCount: number;
    accountantOwnedLaneCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}
