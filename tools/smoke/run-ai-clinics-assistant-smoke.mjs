import {
  apiRequest,
  getArg,
  loadDotEnv,
  normalizeBaseUrl,
  printLine,
  printSection,
  resolveToken,
} from './ec-sandbox-smoke-lib.mjs';

function findAgent(agents, agentKey) {
  return agents.find((entry) => entry.agent?.key === agentKey) ?? null;
}

function assertNoGuardedExecution(agent, agentKey) {
  if (!agent) {
    throw new Error(`AI model is missing ${agentKey}.`);
  }

  if (agent.guardedExecutionCandidateToolKey !== null) {
    throw new Error(`${agentKey} unexpectedly exposes guarded execution.`);
  }
}

async function fetchEnvelope({ baseUrl, token, tenantSlug, agentKey }) {
  const envelope = await apiRequest({
    baseUrl,
    path: `/ai/tenants/${encodeURIComponent(
      tenantSlug,
    )}/agents/${encodeURIComponent(agentKey)}/suggestion-envelope`,
    token,
    method: 'GET',
  });

  if (envelope.agent?.key !== agentKey) {
    throw new Error(
      `Envelope agentKey=${envelope.agent?.key}, expected ${agentKey}.`,
    );
  }

  if (!envelope.toolAccess?.some((entry) => entry.accessLevel === 'approval_required')) {
    throw new Error(`${agentKey} envelope must expose approval-required tool access.`);
  }

  if (!envelope.contextBlocks?.some((entry) => entry.key === 'safety_boundaries')) {
    throw new Error(`${agentKey} envelope is missing safety boundaries.`);
  }

  return envelope;
}

async function main() {
  loadDotEnv();

  const baseUrl = normalizeBaseUrl(
    getArg('base-url', 'http://127.0.0.1:3000/api'),
  );
  const tenantSlug = getArg('tenant-slug', 'saas-platform-local');
  const token = resolveToken();

  printSection('AI Clinics Assistant Smoke');
  printLine(`Base URL: ${baseUrl}`);
  printLine(`Tenant: ${tenantSlug}`);

  const registry = await apiRequest({
    baseUrl,
    path: '/ai/clinics/domain-contract-registry',
    token,
    method: 'GET',
  });

  if (registry.summary?.templateCount !== 2) {
    throw new Error('AI clinics registry must expose exactly two templates.');
  }

  const guardrails = await apiRequest({
    baseUrl,
    path: '/ai/clinics/guardrail-approval-pack',
    token,
    method: 'GET',
  });

  const blockedCapabilities = guardrails.guardrails?.flatMap(
    (entry) => entry.blockedCapabilities ?? [],
  );

  for (const capability of [
    'diagnose_patient',
    'sign_clinical_record',
    'mutate_clinic_state',
  ]) {
    if (!blockedCapabilities?.includes(capability)) {
      throw new Error(`Guardrail pack is missing blocked capability ${capability}.`);
    }
  }

  const closeout = await apiRequest({
    baseUrl,
    path: '/ai/clinics/closeout-growth-bridge-review',
    token,
    method: 'GET',
  });

  if (!closeout.decision?.growthConnected) {
    throw new Error('AI clinics closeout must confirm Growth bridge connectivity.');
  }

  const model = await apiRequest({
    baseUrl,
    path: '/ai/model',
    token,
    method: 'GET',
  });

  assertNoGuardedExecution(
    findAgent(model.agents ?? [], 'medical-clinic-assistant'),
    'medical-clinic-assistant',
  );
  assertNoGuardedExecution(
    findAgent(model.agents ?? [], 'psychology-clinic-assistant'),
    'psychology-clinic-assistant',
  );

  await fetchEnvelope({
    baseUrl,
    token,
    tenantSlug,
    agentKey: 'medical-clinic-assistant',
  });
  await fetchEnvelope({
    baseUrl,
    token,
    tenantSlug,
    agentKey: 'psychology-clinic-assistant',
  });

  printLine('AI Clinics assistant smoke completed.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
