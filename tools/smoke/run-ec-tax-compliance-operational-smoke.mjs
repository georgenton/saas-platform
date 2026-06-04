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
const year = Number.parseInt(getArg('year', process.env.SMOKE_TAX_YEAR || '2026'), 10);
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
    documentCode: '01',
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
printLine(
  'withholding execution',
  executionPacket?.withholdingDraft?.number ?? 'skipped',
);
