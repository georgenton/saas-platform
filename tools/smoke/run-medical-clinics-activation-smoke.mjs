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
  getArg('base-url', process.env.SMOKE_API_URL || 'http://127.0.0.1:3000/api'),
);
const tenantSlug = getArg(
  'tenant-slug',
  process.env.SMOKE_TENANT_SLUG || 'saas-platform-local',
);
const token = resolveToken();

function clinicsPath(path) {
  return `/medical-clinics/tenants/${encodeURIComponent(tenantSlug)}${path}`;
}

function assertStatus(label, value) {
  if (!value) {
    throw new Error(`${label} no devolvio readiness/status.`);
  }
}

printSection('Medical Clinics activation smoke');
printLine('api', baseUrl);
printLine('tenant', tenantSlug);

const enabledProducts = await apiRequest({
  baseUrl,
  path: `/tenancy/tenants/${encodeURIComponent(tenantSlug)}/products`,
  token,
});
const medicalClinicsEnabled = enabledProducts.some(
  (product) => product.key === 'medical-clinics',
);

if (!medicalClinicsEnabled) {
  throw new Error(`Tenant ${tenantSlug} no tiene medical-clinics habilitado.`);
}

const productAnchor = await apiRequest({
  baseUrl,
  path: clinicsPath('/product-anchor'),
  token,
});
assertStatus('product anchor', productAnchor.anchorStatus);
printLine('product', productAnchor.productName);

const patient = await apiRequest({
  baseUrl,
  path: clinicsPath('/patient-intake'),
  token,
  method: 'POST',
  body: {
    patientDisplayName: `Smoke Medical Patient ${Date.now()}`,
    identificationStatus: 'ready',
    contactStatus: 'ready',
    consentStatus: 'ready',
    messagingOptInStatus: 'ready',
    triageReason: 'Smoke control general',
  },
});
printLine('patient', patient.id);

const appointment = await apiRequest({
  baseUrl,
  path: clinicsPath('/appointments'),
  token,
  method: 'POST',
  body: {
    patientId: patient.id,
    serviceName: 'Smoke consulta general',
    professionalId: 'professional_general_001',
    professionalName: 'Dra. Smoke',
    startsAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    amountInCents: 3500,
    currency: 'USD',
  },
});
printLine('appointment', appointment.id);

await apiRequest({
  baseUrl,
  path: clinicsPath(
    `/appointments/${encodeURIComponent(appointment.id)}/transitions`,
  ),
  token,
  method: 'POST',
  body: {
    status: 'completed',
    blockers: [],
  },
});

const [
  encounter,
  note,
  followUp,
  prescription,
  orders,
  encounterCloseout,
  history,
  timeline,
  evidence,
  carePlan,
  recordsCloseout,
  growthBridge,
  billingBridge,
  productCloseout,
] = await Promise.all([
  apiRequest({
    baseUrl,
    path: clinicsPath(
      `/appointments/${encodeURIComponent(appointment.id)}/encounter-workspace`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: clinicsPath(
      `/appointments/${encodeURIComponent(
        appointment.id,
      )}/clinical-note-draft-packet`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: clinicsPath(
      `/appointments/${encodeURIComponent(
        appointment.id,
      )}/treatment-follow-up-readiness`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: clinicsPath(
      `/appointments/${encodeURIComponent(
        appointment.id,
      )}/prescription-readiness-packet`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: clinicsPath(
      `/appointments/${encodeURIComponent(
        appointment.id,
      )}/orders-referral-readiness-packet`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: clinicsPath(
      `/appointments/${encodeURIComponent(appointment.id)}/encounter-closeout`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: clinicsPath(
      `/patients/${encodeURIComponent(patient.id)}/medical-history-draft-record`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: clinicsPath(
      `/patients/${encodeURIComponent(patient.id)}/clinical-timeline-workspace`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: clinicsPath(
      `/patients/${encodeURIComponent(patient.id)}/clinical-evidence-registry`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: clinicsPath(
      `/patients/${encodeURIComponent(patient.id)}/care-plan-task-workspace`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: clinicsPath(
      `/patients/${encodeURIComponent(patient.id)}/records-closeout`,
    ),
    token,
  }),
  apiRequest({ baseUrl, path: clinicsPath('/growth-reminder-bridge'), token }),
  apiRequest({ baseUrl, path: clinicsPath('/billing-tax-bridge'), token }),
  apiRequest({ baseUrl, path: clinicsPath('/product-closeout'), token }),
]);

assertStatus('encounter workspace', encounter.workspaceStatus);
assertStatus('note packet', note.packetStatus);
assertStatus('follow-up readiness', followUp.readinessStatus);
assertStatus('prescription packet', prescription.packetStatus);
assertStatus('orders packet', orders.packetStatus);
assertStatus('encounter closeout', encounterCloseout.closeoutStatus);
assertStatus('history draft', history.recordStatus);
assertStatus('timeline', timeline.workspaceStatus);
assertStatus('evidence registry', evidence.registryStatus);
assertStatus('care plan', carePlan.workspaceStatus);
assertStatus('records closeout', recordsCloseout.closeoutStatus);
assertStatus('growth bridge', growthBridge.bridgeStatus);
assertStatus('billing bridge', billingBridge.bridgeStatus);
assertStatus('product closeout', productCloseout.closeoutStatus);

printLine('encounter', encounter.workspaceStatus);
printLine('records', recordsCloseout.closeoutStatus);
printLine('product closeout', productCloseout.closeoutStatus);
printLine('next product', productCloseout.recommendedNextProduct);
printLine('status', 'ok');
