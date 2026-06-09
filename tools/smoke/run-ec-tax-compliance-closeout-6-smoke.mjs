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

function taxPath(path) {
  return `/tax-compliance/tenants/${encodeURIComponent(tenantSlug)}/ec${path}`;
}

function periodQuery() {
  return `period=${encodeURIComponent(period)}&year=${encodeURIComponent(
    String(year),
  )}`;
}

function assertValue(label, value) {
  if (!value) {
    throw new Error(`${label} no devolvio un valor esperado.`);
  }
}

function assertNonEmpty(label, value) {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error(`${label} no devolvio items.`);
  }
}

printSection('EC tax compliance closeout 6 smoke');
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

const [
  sriSourceImportCenter,
  vatDeclarationWorkspace,
  incomeTaxEvidenceWorkspace,
  filingAssistant,
  accountantEscalationBoundary,
  accountingBoundaryAiReview,
  declarationHandoffCloseout,
] = await Promise.all([
  apiRequest({
    baseUrl,
    path: taxPath(`/sri-source-import-center-v2?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: taxPath(`/vat-declaration-workspace-v2?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: taxPath(`/income-tax-evidence-workspace-v2?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: taxPath(`/filing-assistant-v2?${periodQuery()}&formKey=iva`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: taxPath(`/accountant-escalation-service-boundary?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: taxPath(`/accounting-boundary-ai-review?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: taxPath(`/declaration-handoff-closeout-v6?${periodQuery()}`),
    token,
  }),
]);

assertValue('sri source import center', sriSourceImportCenter.centerStatus);
assertValue(
  'vat declaration workspace',
  vatDeclarationWorkspace.readinessStatus,
);
assertValue(
  'income tax evidence workspace',
  incomeTaxEvidenceWorkspace.readinessStatus,
);
assertValue('filing assistant', filingAssistant.assistantStatus);
assertValue(
  'accountant escalation boundary',
  accountantEscalationBoundary.escalationStatus,
);
assertValue(
  'accounting boundary ai review',
  accountingBoundaryAiReview.reviewStatus,
);
assertValue(
  'declaration handoff closeout',
  declarationHandoffCloseout.closeoutStatus,
);
assertValue(
  'declaration handoff decision',
  declarationHandoffCloseout.decision,
);
assertValue(
  'declaration handoff next step',
  declarationHandoffCloseout.decision.nextStep,
);
assertNonEmpty(
  'declaration handoff lanes',
  declarationHandoffCloseout.handoffLanes,
);
assertNonEmpty(
  'declaration handoff guardrails',
  declarationHandoffCloseout.guardrails,
);

printLine('sri import center', sriSourceImportCenter.centerStatus);
printLine('iva workspace', vatDeclarationWorkspace.readinessStatus);
printLine('renta workspace', incomeTaxEvidenceWorkspace.readinessStatus);
printLine('filing assistant', filingAssistant.assistantStatus);
printLine('accountant boundary', accountantEscalationBoundary.escalationStatus);
printLine('ai boundary review', accountingBoundaryAiReview.reviewStatus);
printLine('closeout 6.0', declarationHandoffCloseout.closeoutStatus);
printLine('next step', declarationHandoffCloseout.decision.nextStep);
printLine('handoff lanes', declarationHandoffCloseout.handoffLanes.length);
printLine('guardrails', declarationHandoffCloseout.guardrails.length);

printSection('EC tax compliance closeout 6 smoke passed');
