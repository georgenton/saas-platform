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

printSection('Accounting foundation smoke OK');
