import {
  apiRequest,
  getArg,
  hasFlag,
  loadDotEnv,
  normalizeBaseUrl,
  printLine,
  printSection,
  resolveToken,
} from './ec-sandbox-smoke-lib.mjs';

loadDotEnv();

const baseUrl = normalizeBaseUrl(
  getArg('api-url', process.env.SMOKE_API_URL || 'http://127.0.0.1:3000/api'),
);
const tenantSlug = getArg(
  'tenant-slug',
  process.env.SMOKE_TENANT_SLUG || 'saas-platform-local',
);
const period = getArg('period', process.env.SMOKE_TAX_PERIOD || '2026-06');
const year = Number.parseInt(
  getArg('year', process.env.SMOKE_TAX_YEAR || '2026'),
  10,
);
const executeWithholdingDraft = hasFlag('execute-withholding-draft');
const token = resolveToken();

if (Number.isNaN(year)) {
  throw new Error('--year debe ser numerico.');
}

function taxPath(path) {
  return `/tax-compliance/tenants/${encodeURIComponent(tenantSlug)}/ec${path}`;
}

function periodQuery() {
  return `period=${encodeURIComponent(period)}&year=${encodeURIComponent(
    String(year),
  )}`;
}

function assertStatus(label, value) {
  if (!value) {
    throw new Error(`${label} no devolvio readiness/status.`);
  }
}

printSection('EC tax compliance operational smoke');
printLine('api', baseUrl);
printLine('tenant', tenantSlug);
printLine('period', period);
printLine('year', year);

const enabledProducts = await apiRequest({
  baseUrl,
  path: `/tenancy/tenants/${encodeURIComponent(tenantSlug)}/products`,
  token,
});
const taxComplianceEnabled = enabledProducts.some(
  (product) => product.key === 'tax-compliance-ec',
);

if (!taxComplianceEnabled) {
  throw new Error(
    `Tenant ${tenantSlug} no tiene tax-compliance-ec habilitado.`,
  );
}

printLine('product access', 'tax-compliance-ec');

const smokeIssuedAccessKey = `SMOKE-SRI-ISSUED-${period}`;
const smokeReceivedAccessKey = `SMOKE-SRI-RECEIVED-${period}`;

const purchaseEvidence = await apiRequest({
  baseUrl,
  path: taxPath('/purchase-expense-evidence'),
  token,
  method: 'POST',
  body: {
    period,
    year,
    supplierName: 'Proveedor smoke tributario',
    supplierTaxpayerId: '1790012345001',
    documentNumber: `SMOKE-${period}`,
    documentCode: smokeReceivedAccessKey,
    issuedAt: `${period}-15T00:00:00.000Z`,
    category: 'services',
    currency: 'USD',
    subtotalInCents: 10000,
    vatInCents: 1200,
    totalInCents: 11200,
    deductible: true,
    supportReference: `smoke://tax-compliance/${period}/purchase-expense`,
  },
});
printLine('purchase evidence', purchaseEvidence.status);

const sriImport = await apiRequest({
  baseUrl,
  path: taxPath('/sri-fiscal-evidence-import'),
  token,
  method: 'POST',
  body: {
    period,
    year,
    source: 'sri_report',
    importedByEmail: 'smoke@saas-platform.dev',
    vouchers: [
      {
        direction: 'issued',
        voucherType: 'invoice',
        accessKey: smokeIssuedAccessKey,
        authorizationNumber: smokeIssuedAccessKey,
        authorizationDate: `${period}-16T00:00:00.000Z`,
        issuedAt: `${period}-16T00:00:00.000Z`,
        emitterTaxpayerId: '1799999999001',
        emitterName: 'Tenant smoke tributario',
        receiverTaxpayerId: '1790012345001',
        receiverName: 'Cliente smoke SRI',
        documentNumber: `001-001-${String(year).slice(-2)}${period.slice(-2)}001`,
        currency: 'USD',
        subtotalInCents: 24000,
        vatInCents: 2880,
        totalInCents: 26880,
        xmlReference: `smoke://tax-compliance/${period}/sri-issued.xml`,
        rideReference: `smoke://tax-compliance/${period}/sri-issued.pdf`,
      },
      {
        direction: 'received',
        voucherType: 'invoice',
        accessKey: smokeReceivedAccessKey,
        authorizationNumber: smokeReceivedAccessKey,
        authorizationDate: `${period}-15T00:00:00.000Z`,
        issuedAt: `${period}-15T00:00:00.000Z`,
        emitterTaxpayerId: '1790012345001',
        emitterName: 'Proveedor smoke tributario',
        receiverTaxpayerId: '1799999999001',
        receiverName: 'Tenant smoke tributario',
        documentNumber: `001-002-${String(year).slice(-2)}${period.slice(-2)}002`,
        currency: 'USD',
        subtotalInCents: 10000,
        vatInCents: 1200,
        totalInCents: 11200,
        xmlReference: `smoke://tax-compliance/${period}/sri-received.xml`,
        rideReference: `smoke://tax-compliance/${period}/sri-received.pdf`,
      },
    ],
  },
});
printLine('sri import', `${sriImport.summary.totalVouchers} vouchers`);

const [
  purchaseWorkspace,
  supplierReadiness,
  vatPacket,
  incomePacket,
  withholdingPacket,
  bridgePacket,
  ruleCatalog,
  accountantWorkbench,
  closeoutPacket,
  auditReadiness,
  vatDraft,
  vatApproval,
  withholdingRegistry,
  evidenceVault,
  operationalCloseout,
  filingHandoff,
  annexesReadiness,
  accountingBridgePreview,
  accountingBridgeMapping,
  reviewAssistantPacket,
  closeoutReport,
  sriEvidenceWorkspace,
  sriPlatformReconciliation,
  declarationFormCatalog,
  declarationFormDraftPacket,
  declarationSourceLedger,
  obligationMatrixV2Workspace,
  sriEvidenceIntakeV2Workspace,
  vatDeclarationDraftWorkspace,
  vatFormContractWorkspace,
  formMappingCatalog,
  incomeTaxEvidenceWorkspace,
  incomeTaxFormContractWorkspace,
  aiFilingAssistantPacket,
  declarationReviewLoopWorkspace,
  annexesWorkspace,
  periodCloseoutCertification,
  filingGuidePacket,
  declarationArtifactExport,
  accountingBridgeSuggestedAccounts,
  growthReminderPacket,
  accountingReadinessPacket,
] = await Promise.all([
  apiRequest({
    baseUrl,
    path: taxPath(`/purchase-expense-evidence-workspace?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: taxPath(`/supplier-fiscal-readiness-workspace?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: taxPath(`/vat-input-output-reconciliation-packet?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: taxPath(`/income-tax-evidence-packet?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: taxPath(`/withholding-evidence-packet?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: taxPath('/withholding-draft-bridge-packet'),
    token,
    method: 'POST',
    body: { period, year, candidateType: 'sale' },
  }),
  apiRequest({
    baseUrl,
    path: taxPath(`/tax-rule-catalog?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: taxPath(`/accountant-workbench?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: taxPath(`/period-closeout-packet?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: taxPath(`/audit-readiness?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: taxPath(`/vat-declaration-draft?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: taxPath(`/vat-declaration-approval?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: taxPath(`/withholding-registry?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: taxPath(`/period-evidence-vault?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: taxPath(`/operational-closeout?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: taxPath(`/filing-handoff?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: taxPath(`/annexes-readiness?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: taxPath(`/accounting-bridge-preview?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: taxPath(`/accounting-bridge-mapping?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: taxPath(`/tax-review-assistant-packet?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: taxPath(`/period-closeout-report?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: taxPath(`/sri-fiscal-evidence-workspace?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: taxPath(`/sri-platform-reconciliation-workspace?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: taxPath(`/declaration-form-catalog?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: taxPath(
      `/declaration-form-draft-packet?${periodQuery()}&formKey=iva`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: taxPath(`/declaration-source-ledger?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: taxPath(`/obligation-matrix-v2-workspace?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: taxPath(`/sri-evidence-intake-v2-workspace?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: taxPath(`/vat-declaration-draft-workspace?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: taxPath(`/vat-form-contract-workspace?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: taxPath(`/form-mapping-catalog?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: taxPath(`/income-tax-evidence-workspace?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: taxPath(`/income-tax-form-contract-workspace?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: taxPath(`/ai-filing-assistant-packet?${periodQuery()}&formKey=iva`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: taxPath(`/declaration-review-loop-workspace?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: taxPath(`/annexes-workspace?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: taxPath(`/period-closeout-certification?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: taxPath(`/filing-guide-packet?${periodQuery()}&formKey=iva`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: taxPath(`/declaration-artifact-export?${periodQuery()}&formKey=iva`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: taxPath(`/accounting-bridge-suggested-accounts?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: taxPath(
      `/growth-reminder-packet?year=${encodeURIComponent(String(year))}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: taxPath(`/accounting-readiness-packet?${periodQuery()}`),
    token,
  }),
]);

assertStatus('purchase workspace', purchaseWorkspace.readinessStatus);
assertStatus('supplier readiness', supplierReadiness.readinessStatus);
assertStatus('vat packet', vatPacket.readinessStatus);
assertStatus('income packet', incomePacket.readinessStatus);
assertStatus('withholding packet', withholdingPacket.readinessStatus);
assertStatus('bridge packet', bridgePacket.readinessStatus);
assertStatus('rule catalog', ruleCatalog.readinessStatus);
assertStatus('accountant workbench', accountantWorkbench.readinessStatus);
assertStatus('closeout packet', closeoutPacket.closeoutStatus);
assertStatus('audit readiness', auditReadiness.readinessStatus);
assertStatus('vat draft', vatDraft.readinessStatus);
assertStatus('vat approval', vatApproval.status);
assertStatus('withholding registry', withholdingRegistry.readinessStatus);
assertStatus('evidence vault', evidenceVault.readinessStatus);
assertStatus('operational closeout', operationalCloseout.status);
assertStatus(
  'filing handoff',
  filingHandoff.status ?? filingHandoff.operationalCloseoutStatus,
);
assertStatus('annexes readiness', annexesReadiness.readinessStatus);
assertStatus(
  'accounting bridge preview',
  accountingBridgePreview.readinessStatus,
);
assertStatus(
  'accounting bridge mapping',
  accountingBridgeMapping.readinessStatus,
);
assertStatus('review assistant packet', reviewAssistantPacket.readinessStatus);
assertStatus('closeout report', closeoutReport.readinessStatus);
assertStatus('sri evidence workspace', sriEvidenceWorkspace.readinessStatus);
assertStatus(
  'sri platform reconciliation',
  sriPlatformReconciliation.readinessStatus,
);
assertStatus(
  'declaration form catalog',
  declarationFormCatalog.readinessStatus,
);
assertStatus(
  'declaration form draft packet',
  declarationFormDraftPacket.readinessStatus,
);
assertStatus(
  'declaration source ledger',
  declarationSourceLedger.readinessStatus,
);
assertStatus(
  'obligation matrix v2 workspace',
  obligationMatrixV2Workspace.readinessStatus,
);
assertStatus(
  'sri evidence intake v2 workspace',
  sriEvidenceIntakeV2Workspace.readinessStatus,
);
assertStatus(
  'vat declaration draft workspace',
  vatDeclarationDraftWorkspace.readinessStatus,
);
assertStatus(
  'vat form contract workspace',
  vatFormContractWorkspace.readinessStatus,
);
assertStatus('form mapping catalog', formMappingCatalog.readinessStatus);
assertStatus(
  'income tax evidence workspace',
  incomeTaxEvidenceWorkspace.readinessStatus,
);
assertStatus(
  'income tax form contract workspace',
  incomeTaxFormContractWorkspace.readinessStatus,
);
assertStatus(
  'ai filing assistant packet',
  aiFilingAssistantPacket.assistantStatus,
);
assertStatus(
  'declaration review loop',
  declarationReviewLoopWorkspace.loopStatus,
);
assertStatus('annexes workspace', annexesWorkspace.readinessStatus);
assertStatus(
  'period closeout certification',
  periodCloseoutCertification.certificationStatus,
);
assertStatus('filing guide packet', filingGuidePacket.readinessStatus);
assertStatus(
  'declaration artifact export',
  declarationArtifactExport.readinessStatus,
);
assertStatus(
  'accounting bridge suggested accounts',
  accountingBridgeSuggestedAccounts.summary,
);
assertStatus('growth reminder packet', growthReminderPacket.readinessStatus);
assertStatus(
  'accounting readiness packet',
  accountingReadinessPacket.readinessStatus,
);

let mappedAccountingBridge = accountingBridgeMapping;

if (accountingBridgeMapping.summary.unmappedHintCount > 0) {
  mappedAccountingBridge = await apiRequest({
    baseUrl,
    path: taxPath('/accounting-bridge-mapping'),
    token,
    method: 'POST',
    body: {
      period,
      year,
      mappings: accountingBridgeMapping.rows
        .filter((row) => !row.mapped)
        .slice(0, 8)
        .map((row, index) => ({
          accountHint: row.accountHint,
          suggestedAccountCode: `SMOKE-TAX-${String(index + 1).padStart(3, '0')}`,
          suggestedAccountName: row.accountHint,
        })),
      updatedByEmail: 'smoke@saas-platform.dev',
    },
  });
  assertStatus(
    'mapped accounting bridge',
    mappedAccountingBridge.readinessStatus,
  );
}

let executionPacket = null;

if (executeWithholdingDraft && bridgePacket.createWithholdingDraftInput) {
  executionPacket = await apiRequest({
    baseUrl,
    path: taxPath('/withholding-draft-bridge/execute'),
    token,
    method: 'POST',
    body: {
      period,
      year,
      candidateType: 'sale',
      candidateId: bridgePacket.selectedCandidate?.candidateId ?? null,
      number: `001-002-${String(Date.now()).slice(-9).padStart(9, '0')}`,
    },
  });
}

printSection('Summary');
printLine('purchase workspace', purchaseWorkspace.readinessStatus);
printLine('supplier readiness', supplierReadiness.readinessStatus);
printLine('vat packet', vatPacket.readinessStatus);
printLine('income packet', incomePacket.readinessStatus);
printLine('withholding packet', withholdingPacket.readinessStatus);
printLine('bridge packet', bridgePacket.readinessStatus);
printLine('rules', ruleCatalog.rules.length);
printLine('accountant workbench', accountantWorkbench.readinessStatus);
printLine('closeout', closeoutPacket.closeoutStatus);
printLine('audit readiness', auditReadiness.readinessStatus);
printLine('vat draft', vatDraft.readinessStatus);
printLine('vat approval', vatApproval.status);
printLine('withholding registry', withholdingRegistry.readinessStatus);
printLine('evidence vault', evidenceVault.readinessStatus);
printLine('operational closeout', operationalCloseout.status);
printLine('filing handoff', filingHandoff.status ?? 'pending');
printLine('annexes', annexesReadiness.readinessStatus);
printLine('accounting bridge', accountingBridgePreview.readinessStatus);
printLine(
  'accounting mapping',
  `${mappedAccountingBridge.summary.mappedHintCount}/${mappedAccountingBridge.summary.hintCount}`,
);
printLine('assistant', reviewAssistantPacket.readinessStatus);
printLine(
  'assistant unmapped hints',
  reviewAssistantPacket.contextSnapshot.accountingBridgeUnmappedHintCount ?? 0,
);
printLine('closeout report', closeoutReport.readinessStatus);
printLine('sri evidence', sriEvidenceWorkspace.readinessStatus);
printLine(
  'sri reconciliation issues',
  sriPlatformReconciliation.issueSummary.totalIssues,
);
printLine('declaration forms', declarationFormCatalog.forms.length);
printLine('declaration draft', declarationFormDraftPacket.readinessStatus);
printLine('source ledger rows', declarationSourceLedger.summary.rowCount);
printLine(
  'obligation matrix v2',
  `${obligationMatrixV2Workspace.summary.appliesCount}/${obligationMatrixV2Workspace.summary.obligationCount}`,
);
printLine(
  'sri intake v2',
  `${sriEvidenceIntakeV2Workspace.deduplication.ledgerSriRows} ledger rows`,
);
printLine(
  'vat workspace',
  `${vatDeclarationDraftWorkspace.summary.readyBucketCount}/${vatDeclarationDraftWorkspace.summary.bucketCount}`,
);
printLine(
  'vat contract',
  `${vatFormContractWorkspace.summary.highConfidenceBoxCount}/${vatFormContractWorkspace.summary.contractBoxCount}`,
);
printLine(
  'form mappings',
  `${formMappingCatalog.summary.highConfidenceMappingCount}/${formMappingCatalog.summary.mappingCount}`,
);
printLine(
  'income taxable base',
  incomeTaxEvidenceWorkspace.summary.estimatedTaxableBaseInCents,
);
printLine(
  'income contract lines',
  incomeTaxFormContractWorkspace.contractLines.length,
);
printLine(
  'filing assistant',
  `${aiFilingAssistantPacket.assistantStatus} · ${aiFilingAssistantPacket.suggestedSteps.length} steps`,
);
printLine('review loop', declarationReviewLoopWorkspace.loopStatus);
printLine('annex workspace', annexesWorkspace.readinessStatus);
printLine(
  'closeout certification',
  periodCloseoutCertification.certificationStatus,
);
printLine('filing guide steps', filingGuidePacket.steps.length);
printLine('artifact export', declarationArtifactExport.readinessStatus);
printLine(
  'suggested accounts',
  accountingBridgeSuggestedAccounts.summary.suggestionCount,
);
printLine('growth reminders', growthReminderPacket.summary.reminderCount);
printLine('accounting readiness', accountingReadinessPacket.recommendation);
printLine(
  'withholding execution',
  executionPacket?.withholdingDraft?.number ?? 'skipped',
);
