import {
  apiRequest,
  getArg,
  loadDotEnv,
  normalizeBaseUrl,
  printLine,
  printSection,
  resolveToken,
} from './ec-sandbox-smoke-lib.mjs';

function getAgentRetrieval(workspace, agentKey) {
  const agentEntry =
    workspace.agents.find((entry) => entry.agentKey === agentKey) ?? null;

  if (!agentEntry) {
    throw new Error(
      `Retrieval workspace is missing agentKey=${agentKey}.`,
    );
  }

  return agentEntry.retrieval;
}

function findRetrievedRecord(retrieval, recordId) {
  return retrieval.records.find((entry) => entry.id === recordId) ?? null;
}

function assertPolicyShape(policy, expectedRecordId) {
  if (policy.version !== 'v1') {
    throw new Error(`Unexpected retrieval policy version=${policy.version}.`);
  }

  if (!Array.isArray(policy.prioritizedRecordIds)) {
    throw new Error('Retrieval policy prioritizedRecordIds is not an array.');
  }

  if (!policy.prioritizedRecordIds.includes(expectedRecordId)) {
    throw new Error(
      `Retrieval policy is missing prioritizedRecordId=${expectedRecordId}.`,
    );
  }

  if (typeof policy.archivedRecordCount !== 'number') {
    throw new Error('Retrieval policy archivedRecordCount is not numeric.');
  }

  if (
    typeof policy.archivalSummary !== 'string' ||
    !policy.archivalSummary.includes('Operator notes are never auto-archived')
  ) {
    throw new Error('Retrieval policy archivalSummary is missing or unexpected.');
  }

  if (
    typeof policy.rankingSummary !== 'string' ||
    !policy.rankingSummary.includes(
      'operator_note > guarded_execution_memory > approval_memory',
    )
  ) {
    throw new Error('Retrieval policy rankingSummary is missing or unexpected.');
  }
}

async function main() {
  loadDotEnv();

  const baseUrl = normalizeBaseUrl(
    getArg('base-url', 'http://127.0.0.1:3000/api'),
  );
  const tenantSlug = getArg('tenant-slug', 'saas-platform-local');
  const agentKey = getArg('agent-key', 'growth-assist-coach');
  const token = resolveToken();
  const runId = `${Date.now()}`;
  const memoryTitle = `Smoke retrieval memory ${runId}`;
  const memorySummary =
    'Smoke memory that should rank into the next suggestion envelope and persisted run.';
  const memoryDetail =
    'This smoke validates memory authoring -> retrieval workspace -> envelope hydration -> persisted run detail.';
  let createdMemoryRecordId = null;

  try {
    const memoryRecord = await apiRequest({
      baseUrl,
      path: `/ai/tenants/${encodeURIComponent(tenantSlug)}/memory-records`,
      token,
      method: 'POST',
      body: {
        scope: 'agent',
        agentKey,
        sourceKind: 'operator_note',
        freshness: 'working_memory',
        title: memoryTitle,
        summary: memorySummary,
        detail: memoryDetail,
        tags: ['smoke', 'retrieval', `agent:${agentKey}`, `run:${runId}`],
      },
    });

    createdMemoryRecordId = memoryRecord.id;

    const retrievalWorkspace = await apiRequest({
      baseUrl,
      path: `/ai/tenants/${encodeURIComponent(tenantSlug)}/retrieval-workspace`,
      token,
      method: 'GET',
    });

    const workspaceRetrieval = getAgentRetrieval(retrievalWorkspace, agentKey);
    const retrievedWorkspaceRecord = findRetrievedRecord(
      workspaceRetrieval,
      createdMemoryRecordId,
    );

    if (!retrievedWorkspaceRecord) {
      throw new Error(
        `Retrieval workspace did not hydrate created memory record ${createdMemoryRecordId}.`,
      );
    }

    assertPolicyShape(workspaceRetrieval.policy, createdMemoryRecordId);

    const suggestionEnvelope = await apiRequest({
      baseUrl,
      path: `/ai/tenants/${encodeURIComponent(
        tenantSlug,
      )}/agents/${encodeURIComponent(agentKey)}/suggestion-envelope`,
      token,
      method: 'GET',
    });

    if (!suggestionEnvelope.retrieval) {
      throw new Error('Suggestion envelope is missing retrieval provenance.');
    }

    const envelopeRecord = findRetrievedRecord(
      suggestionEnvelope.retrieval,
      createdMemoryRecordId,
    );

    if (!envelopeRecord) {
      throw new Error(
        `Suggestion envelope retrieval is missing memory record ${createdMemoryRecordId}.`,
      );
    }

    assertPolicyShape(
      suggestionEnvelope.retrieval.policy,
      createdMemoryRecordId,
    );

    const suggestionRun = await apiRequest({
      baseUrl,
      path: `/ai/tenants/${encodeURIComponent(
        tenantSlug,
      )}/agents/${encodeURIComponent(agentKey)}/suggestion-runs`,
      token,
      method: 'POST',
    });

    if (!suggestionRun.envelope?.retrieval) {
      throw new Error('Prepared suggestion run is missing envelope retrieval.');
    }

    const preparedRunRecord = findRetrievedRecord(
      suggestionRun.envelope.retrieval,
      createdMemoryRecordId,
    );

    if (!preparedRunRecord) {
      throw new Error(
        `Prepared suggestion run envelope is missing memory record ${createdMemoryRecordId}.`,
      );
    }

    assertPolicyShape(
      suggestionRun.envelope.retrieval.policy,
      createdMemoryRecordId,
    );

    const persistedRunDetail = await apiRequest({
      baseUrl,
      path: `/ai/tenants/${encodeURIComponent(
        tenantSlug,
      )}/agents/${encodeURIComponent(agentKey)}/suggestion-runs/${encodeURIComponent(
        suggestionRun.id,
      )}`,
      token,
      method: 'GET',
    });

    if (!persistedRunDetail.envelope?.retrieval) {
      throw new Error('Persisted suggestion run detail is missing retrieval.');
    }

    const persistedRunRecord = findRetrievedRecord(
      persistedRunDetail.envelope.retrieval,
      createdMemoryRecordId,
    );

    if (!persistedRunRecord) {
      throw new Error(
        `Persisted suggestion run detail is missing memory record ${createdMemoryRecordId}.`,
      );
    }

    assertPolicyShape(
      persistedRunDetail.envelope.retrieval.policy,
      createdMemoryRecordId,
    );

    printSection('AI Retrieval-Fed Run Smoke');
    printLine('tenantSlug', tenantSlug);
    printLine('agentKey', agentKey);
    printLine('memoryRecordId', createdMemoryRecordId);
    printLine('suggestionRunId', suggestionRun.id);

    printSection('Retrieval Workspace');
    printLine('retrievedRecordTitle', retrievedWorkspaceRecord.title);
    printLine(
      'workspaceRecordCount',
      workspaceRetrieval.recordCount,
    );
    printLine(
      'workspaceArchivedRecordCount',
      workspaceRetrieval.policy.archivedRecordCount,
    );

    printSection('Envelope Hydration');
    printLine('envelopeRecordTitle', envelopeRecord.title);
    printLine(
      'preparedRunRetrievedCount',
      suggestionRun.envelope.retrieval.recordCount,
    );

    printSection('Persisted Run Detail');
    printLine('persistedRunRecordTitle', persistedRunRecord.title);
    printLine(
      'persistedRunPrioritizedRecordIds',
      persistedRunDetail.envelope.retrieval.policy.prioritizedRecordIds.join(', '),
    );

    printSection('Result');
    printLine('status', 'ok');
  } finally {
    if (createdMemoryRecordId) {
      await apiRequest({
        baseUrl,
        path: `/ai/tenants/${encodeURIComponent(
          tenantSlug,
        )}/memory-records/${encodeURIComponent(createdMemoryRecordId)}`,
        token,
        method: 'PATCH',
        body: {
          status: 'inactive',
        },
      }).catch(() => undefined);
    }
  }
}

main().catch((error) => {
  process.stderr.write(
    `${error instanceof Error ? error.message : String(error)}\n`,
  );
  process.exit(1);
});
