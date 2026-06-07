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
const token = resolveToken();

function partiesPath(path) {
  return `/parties/tenants/${encodeURIComponent(tenantSlug)}${path}`;
}

function assertReadiness(label, payload) {
  if (!payload?.readinessStatus) {
    throw new Error(`${label} no devolvio readinessStatus.`);
  }
}

printSection('Parties 2.0 fiscal directory smoke');
printLine('api', baseUrl);
printLine('tenant', tenantSlug);

const enabledProducts = await apiRequest({
  baseUrl,
  path: `/tenancy/tenants/${encodeURIComponent(tenantSlug)}/products`,
  token,
});
const invoicingEnabled = enabledProducts.some(
  (product) => product.key === 'invoicing',
);

if (!invoicingEnabled) {
  throw new Error(`Tenant ${tenantSlug} no tiene invoicing habilitado.`);
}

printLine('product access', 'invoicing');

const [
  directoryCore,
  fiscalIdentity,
  productRoleBridge,
  duplicateMerge,
  supplierCustomerReadiness,
  closeoutPack,
] = await Promise.all([
  apiRequest({
    baseUrl,
    path: partiesPath('/directory-core-v2'),
    token,
  }),
  apiRequest({
    baseUrl,
    path: partiesPath('/fiscal-identity-profile'),
    token,
  }),
  apiRequest({
    baseUrl,
    path: partiesPath('/product-role-bridge'),
    token,
  }),
  apiRequest({
    baseUrl,
    path: partiesPath('/duplicate-merge-readiness'),
    token,
  }),
  apiRequest({
    baseUrl,
    path: partiesPath('/supplier-customer-fiscal-readiness'),
    token,
  }),
  apiRequest({
    baseUrl,
    path: partiesPath('/product-closeout-pack'),
    token,
    method: 'POST',
  }),
]);

assertReadiness('directory core', directoryCore);
assertReadiness('fiscal identity', fiscalIdentity);
assertReadiness('product role bridge', productRoleBridge);
assertReadiness('duplicate merge', duplicateMerge);
assertReadiness('supplier/customer readiness', supplierCustomerReadiness);
assertReadiness('closeout pack', closeoutPack);

if (!Array.isArray(closeoutPack.acceptanceChecklist)) {
  throw new Error('closeout pack no devolvio acceptanceChecklist.');
}

printLine(
  'directory',
  `${directoryCore.summary.totalParties} parties, ${directoryCore.summary.needsReviewParties} needs review`,
);
printLine(
  'fiscal identity',
  `${fiscalIdentity.summary.completeProfiles}/${fiscalIdentity.summary.totalParties} complete`,
);
printLine(
  'duplicate merge',
  `${duplicateMerge.summary.duplicateGroupCount} groups`,
);
printLine(
  'closeout',
  `${closeoutPack.readinessStatus}, next=${closeoutPack.recommendedNextProduct}`,
);
printLine('status', 'ok');
