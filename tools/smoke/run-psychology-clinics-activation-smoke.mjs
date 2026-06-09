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
  return `/psychology-clinics/tenants/${encodeURIComponent(tenantSlug)}${path}`;
}

function assertStatus(label, value) {
  if (!value) {
    throw new Error(`${label} no devolvio readiness/status.`);
  }
}

printSection('Psychology Clinics activation smoke');
printLine('api', baseUrl);
printLine('tenant', tenantSlug);

const enabledProducts = await apiRequest({
  baseUrl,
  path: `/tenancy/tenants/${encodeURIComponent(tenantSlug)}/products`,
  token,
});
const psychologyClinicsEnabled = enabledProducts.some(
  (product) => product.key === 'psychology-clinics',
);

if (!psychologyClinicsEnabled) {
  throw new Error(
    `Tenant ${tenantSlug} no tiene psychology-clinics habilitado.`,
  );
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
    patientDisplayName: `Smoke Psychology Patient ${Date.now()}`,
    identificationStatus: 'ready',
    contactStatus: 'ready',
    therapyConsentStatus: 'ready',
    messagingOptInStatus: 'ready',
    initialRiskReviewStatus: 'ready',
    presentingConcern: 'Smoke anxiety intake',
  },
});
printLine('patient', patient.id);

const session = await apiRequest({
  baseUrl,
  path: clinicsPath('/sessions'),
  token,
  method: 'POST',
  body: {
    patientId: patient.id,
    serviceName: 'Smoke terapia individual',
    therapistId: 'therapist_demo_001',
    therapistName: 'Ps. Smoke',
    modality: 'teletherapy_review_required',
    startsAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
  },
});
printLine('session', session.id);

await apiRequest({
  baseUrl,
  path: clinicsPath(`/sessions/${encodeURIComponent(session.id)}/transitions`),
  token,
  method: 'POST',
  body: {
    status: 'completed',
    blockers: [],
  },
});

const [
  note,
  followUp,
  treatmentPlan,
  timeline,
  recordsHardening,
  evidence,
  safety,
  privacy,
  reviewLoop,
  recordsCloseout,
  ehrDiscovery,
  signature,
  outcomes,
  assessments,
  handoffContracts,
  closeoutV4,
  growthBridge,
  billingBridge,
  productReadiness,
  boundary,
  closeoutV5,
  commandCenter,
  privacyRiskQueue,
  sessionTreatmentQueue,
  handoffCenter,
  operatingCloseout,
] = await Promise.all([
  apiRequest({
    baseUrl,
    path: clinicsPath(
      `/sessions/${encodeURIComponent(session.id)}/session-note-draft-packet`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: clinicsPath(
      `/sessions/${encodeURIComponent(
        session.id,
      )}/treatment-follow-up-readiness`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: clinicsPath(
      `/patients/${encodeURIComponent(patient.id)}/treatment-plan-workspace`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: clinicsPath(
      `/patients/${encodeURIComponent(patient.id)}/timeline-workspace`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: clinicsPath(
      `/patients/${encodeURIComponent(
        patient.id,
      )}/records-hardening-workspace`,
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
      `/patients/${encodeURIComponent(
        patient.id,
      )}/risk-safety-review-workspace`,
    ),
    token,
  }),
  apiRequest({ baseUrl, path: clinicsPath('/privacy-consent-control-center'), token }),
  apiRequest({
    baseUrl,
    path: clinicsPath(
      `/sessions/${encodeURIComponent(session.id)}/session-note-review-loop`,
    ),
    token,
  }),
  apiRequest({ baseUrl, path: clinicsPath('/records-closeout-v3'), token }),
  apiRequest({ baseUrl, path: clinicsPath('/ehr-discovery-workspace'), token }),
  apiRequest({
    baseUrl,
    path: clinicsPath('/formal-record-signature-readiness'),
    token,
  }),
  apiRequest({
    baseUrl,
    path: clinicsPath(
      `/patients/${encodeURIComponent(patient.id)}/outcomes-review-workspace`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: clinicsPath(
      `/patients/${encodeURIComponent(patient.id)}/assessment-scale-registry`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: clinicsPath('/external-document-handoff-contracts'),
    token,
  }),
  apiRequest({ baseUrl, path: clinicsPath('/closeout-v4'), token }),
  apiRequest({ baseUrl, path: clinicsPath('/growth-reminder-bridge'), token }),
  apiRequest({ baseUrl, path: clinicsPath('/billing-tax-bridge'), token }),
  apiRequest({ baseUrl, path: clinicsPath('/product-readiness-report'), token }),
  apiRequest({ baseUrl, path: clinicsPath('/boundary-compliance-closeout'), token }),
  apiRequest({ baseUrl, path: clinicsPath('/closeout-v5'), token }),
  apiRequest({ baseUrl, path: clinicsPath('/command-center-v60'), token }),
  apiRequest({
    baseUrl,
    path: clinicsPath('/patient-privacy-risk-queue-v60'),
    token,
  }),
  apiRequest({
    baseUrl,
    path: clinicsPath('/session-treatment-queue-v60'),
    token,
  }),
  apiRequest({
    baseUrl,
    path: clinicsPath('/cross-product-handoff-center-v60'),
    token,
  }),
  apiRequest({ baseUrl, path: clinicsPath('/operating-closeout-v60'), token }),
]);

assertStatus('note packet', note.packetStatus);
assertStatus('follow-up readiness', followUp.readinessStatus);
assertStatus('treatment plan', treatmentPlan.workspaceStatus);
assertStatus('timeline', timeline.workspaceStatus);
assertStatus('records hardening', recordsHardening.workspaceStatus);
assertStatus('evidence registry', evidence.registryStatus);
assertStatus('safety review', safety.workspaceStatus);
assertStatus('privacy control center', privacy.controlStatus);
assertStatus('review loop', reviewLoop.reviewStatus);
assertStatus('records closeout', recordsCloseout.closeoutStatus);
assertStatus('EHR discovery', ehrDiscovery.workspaceStatus);
assertStatus('signature readiness', signature.readinessStatus);
assertStatus('outcomes review', outcomes.workspaceStatus);
assertStatus('assessment registry', assessments.registryStatus);
assertStatus('handoff contracts', handoffContracts.handoffStatus);
assertStatus('closeout v4', closeoutV4.closeoutStatus);
assertStatus('growth bridge', growthBridge.bridgeStatus);
assertStatus('billing bridge', billingBridge.bridgeStatus);
assertStatus('product readiness', productReadiness.reportStatus);
assertStatus('boundary closeout', boundary.closeoutStatus);
assertStatus('closeout v5', closeoutV5.closeoutStatus);
assertStatus('command center 6.0', commandCenter.commandStatus);
assertStatus('privacy risk queue 6.0', privacyRiskQueue.queueStatus);
assertStatus('session treatment queue 6.0', sessionTreatmentQueue.queueStatus);
assertStatus('handoff center 6.0', handoffCenter.handoffStatus);
assertStatus('operating closeout 6.0', operatingCloseout.closeoutStatus);

printLine('records', recordsCloseout.closeoutStatus);
printLine('product closeout', closeoutV5.closeoutStatus);
printLine('next product', closeoutV5.decision.recommendedNextProduct);
printLine('command center 6.0', commandCenter.commandStatus);
printLine('privacy risk queue 6.0', privacyRiskQueue.queueStatus);
printLine('session treatment queue 6.0', sessionTreatmentQueue.queueStatus);
printLine('handoff center 6.0', handoffCenter.handoffStatus);
printLine('operating closeout 6.0', operatingCloseout.closeoutStatus);
printLine('status', 'ok');
