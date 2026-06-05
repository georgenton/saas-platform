import {
  apiRequest,
  getArg,
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
const token = resolveToken();

if (Number.isNaN(year)) {
  throw new Error('--year debe ser numerico.');
}

function accountingPath(path) {
  return `/accounting/tenants/${encodeURIComponent(tenantSlug)}${path}`;
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

printSection('Accounting foundation smoke');
printLine('api', baseUrl);
printLine('tenant', tenantSlug);
printLine('period', period);
printLine('year', year);

const enabledProducts = await apiRequest({
  baseUrl,
  path: `/tenancy/tenants/${encodeURIComponent(tenantSlug)}/products`,
  token,
});
const accountingEnabled = enabledProducts.some(
  (product) => product.key === 'accounting',
);

if (!accountingEnabled) {
  throw new Error(`Tenant ${tenantSlug} no tiene accounting habilitado.`);
}

printLine('product access', 'accounting');

const [intakeWorkspace, chartOfAccountsWorkspace, journalDraftPreview] =
  await Promise.all([
    apiRequest({
      baseUrl,
      path: accountingPath(`/intake-workspace?${periodQuery()}`),
      token,
    }),
    apiRequest({
      baseUrl,
      path: accountingPath(`/chart-of-accounts-workspace?${periodQuery()}`),
      token,
    }),
    apiRequest({
      baseUrl,
      path: accountingPath(`/journal-draft-preview?${periodQuery()}`),
      token,
    }),
  ]);

assertStatus('intake workspace', intakeWorkspace.readinessStatus);
assertStatus(
  'chart of accounts workspace',
  chartOfAccountsWorkspace.readinessStatus,
);
assertStatus('journal draft preview', journalDraftPreview.journalStatus);

if (!Array.isArray(chartOfAccountsWorkspace.accounts)) {
  throw new Error('chart-of-accounts-workspace no devolvio accounts[].');
}

if (!Array.isArray(journalDraftPreview.draftEntries)) {
  throw new Error('journal-draft-preview no devolvio draftEntries[].');
}

printLine('intake', intakeWorkspace.recommendation);
printLine(
  'accounts',
  `${chartOfAccountsWorkspace.summary.accountCount} total, ${chartOfAccountsWorkspace.summary.needsMappingCount} por mapear`,
);
printLine(
  'journal drafts',
  `${journalDraftPreview.summary.draftEntryCount} borradores, ${journalDraftPreview.summary.balancedDraftCount} balanceados`,
);
printLine('next step', journalDraftPreview.nextStep);

const pendingAccounts = chartOfAccountsWorkspace.accounts.filter(
  (account) => account.mappedAccountHint && account.status !== 'mapped',
);

if (pendingAccounts.length > 0) {
  const mapping = await apiRequest({
    baseUrl,
    path: accountingPath('/chart-mapping'),
    token,
    method: 'POST',
    body: {
      period,
      year,
      mappings: pendingAccounts.slice(0, 6).map((account) => ({
        accountHint: account.mappedAccountHint,
        suggestedAccountCode: account.code,
        suggestedAccountName: account.name,
      })),
      updatedByEmail: 'smoke@saas-platform.dev',
    },
  });

  assertStatus('chart mapping management', mapping.mappingStatus);
  printLine(
    'chart mapping',
    `${mapping.updatedMappingCount} revisados, ${mapping.mappingStatus}`,
  );
}

const refreshedJournalDraftPreview = await apiRequest({
  baseUrl,
  path: accountingPath(`/journal-draft-preview?${periodQuery()}`),
  token,
});
const reviewableDraftKeys = refreshedJournalDraftPreview.draftEntries
  .filter((entry) => entry.blockers.length === 0 && entry.totals.balanced)
  .map((entry) => entry.draftEntryKey);

if (reviewableDraftKeys.length > 0) {
  const approvalPacket = await apiRequest({
    baseUrl,
    path: accountingPath('/journal-draft-approval-packet'),
    token,
    method: 'POST',
    body: {
      period,
      year,
      draftEntryKeys: reviewableDraftKeys,
      decision: 'approve',
      reviewerEmail: 'smoke@saas-platform.dev',
      note: 'Smoke approval for accounting foundation preview.',
    },
  });

  assertStatus('journal approval packet', approvalPacket.approvalStatus);
  printLine(
    'journal approval',
    `${approvalPacket.summary.approvedDraftEntryCount} aprobados, ${approvalPacket.approvalStatus}`,
  );

  const journalCreation = await apiRequest({
    baseUrl,
    path: accountingPath('/journal-entries'),
    token,
    method: 'POST',
    body: {
      period,
      year,
      draftEntryKeys: approvalPacket.approvedDraftEntryKeys,
      reviewerEmail: 'smoke@saas-platform.dev',
      note: 'Smoke journal registry creation.',
    },
  });

  assertStatus('journal entry creation', journalCreation.creationStatus);
  printLine(
    'journal registry write',
    `${journalCreation.summary.createdEntryCount} entries, ${journalCreation.creationStatus}`,
  );
}

const ledgerPreview = await apiRequest({
  baseUrl,
  path: accountingPath(`/ledger-preview-workspace?${periodQuery()}`),
  token,
});

assertStatus('ledger preview workspace', ledgerPreview.ledgerStatus);
printLine(
  'ledger preview',
  `${ledgerPreview.summary.accountCount} cuentas, ${ledgerPreview.summary.approvedPreviewEntryCount} entries`,
);

const [
  journalRegistry,
  ledgerRegistry,
  closeoutReadiness,
  trialBalance,
  closeoutReport,
] = await Promise.all([
  apiRequest({
    baseUrl,
    path: accountingPath(`/journal-registry?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(`/ledger-registry-workspace?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(`/period-closeout-readiness?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(`/trial-balance-workspace?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(`/period-closeout-report?${periodQuery()}`),
    token,
  }),
]);

assertStatus('journal registry', journalRegistry.registryStatus);
assertStatus('ledger registry workspace', ledgerRegistry.ledgerStatus);
assertStatus('period closeout readiness', closeoutReadiness.readinessStatus);
assertStatus('trial balance workspace', trialBalance.trialBalanceStatus);
assertStatus('period closeout report', closeoutReport.reportStatus);
printLine(
  'journal registry',
  `${journalRegistry.summary.entryCount} entries, ${journalRegistry.registryStatus}`,
);
printLine(
  'ledger registry',
  `${ledgerRegistry.summary.accountCount} cuentas, ${ledgerRegistry.ledgerStatus}`,
);
printLine(
  'closeout readiness',
  `${closeoutReadiness.summary.readyCheckCount}/${closeoutReadiness.summary.checkCount} checks, ${closeoutReadiness.readinessStatus}`,
);
printLine(
  'trial balance',
  `${trialBalance.summary.accountCount} cuentas, ${trialBalance.trialBalanceStatus}`,
);

const closeoutPacket = await apiRequest({
  baseUrl,
  method: 'POST',
  path: accountingPath('/period-closeout-packet'),
  token,
  body: {
    period,
    year,
    decision: 'approve',
    reviewerUserId: 'smoke-accounting-reviewer',
    reviewerEmail: 'accounting-reviewer@saas-platform.dev',
    note: 'Smoke closeout packet for accounting foundation.',
  },
});

assertStatus('period closeout packet', closeoutPacket.closeoutStatus);
printLine(
  'closeout packet',
  `${closeoutPacket.summary.readyApprovalCount} approvals, ${closeoutPacket.closeoutStatus}`,
);
printLine(
  'closeout report',
  `${closeoutReport.summary.sectionCount} secciones, ${closeoutReport.reportStatus}`,
);

const lockReadiness = await apiRequest({
  baseUrl,
  path: accountingPath(`/period-lock-readiness?${periodQuery()}`),
  token,
});

assertStatus('period lock readiness', lockReadiness.lockReadinessStatus);
printLine(
  'period lock',
  `${lockReadiness.summary.readyCheckCount}/${lockReadiness.summary.checkCount} checks, ${lockReadiness.lockReadinessStatus}`,
);

const adjustment = await apiRequest({
  baseUrl,
  method: 'POST',
  path: accountingPath('/adjusting-journal-entries'),
  token,
  body: {
    period,
    year,
    adjustmentType: 'manual_adjustment',
    label: 'Smoke closeout adjustment',
    currency: 'USD',
    lines: [
      {
        lineKey: 'smoke_adjustment:expense',
        accountCode: '501.01',
        accountName: 'Gastos operativos',
        debitInCents: 100,
        creditInCents: 0,
        sourceEntryKey: 'smoke_closeout_adjustment',
        accountHint: 'Gastos operativos',
        notes: ['Smoke adjustment debit line.'],
      },
      {
        lineKey: 'smoke_adjustment:cash',
        accountCode: '101.01',
        accountName: 'Caja y bancos',
        debitInCents: 0,
        creditInCents: 100,
        sourceEntryKey: 'smoke_closeout_adjustment',
        accountHint: 'Caja y bancos',
        notes: ['Smoke adjustment credit line.'],
      },
    ],
    reviewerUserId: 'smoke-accounting-reviewer',
    reviewerEmail: 'accounting-reviewer@saas-platform.dev',
    note: 'Smoke adjustment for accounting foundation.',
  },
});

assertStatus('adjusting journal entry', adjustment.creationStatus);
printLine(
  'adjustment',
  `${adjustment.summary.lineCount} lines, ${adjustment.creationStatus}`,
);

const financialStatementPreview = await apiRequest({
  baseUrl,
  path: accountingPath(`/financial-statement-preview?${periodQuery()}`),
  token,
});

assertStatus(
  'financial statement preview',
  financialStatementPreview.previewStatus,
);
printLine(
  'financial preview',
  `${financialStatementPreview.summary.trialBalanceAccountCount} cuentas, ${financialStatementPreview.previewStatus}`,
);

printSection('Accounting foundation smoke OK');
