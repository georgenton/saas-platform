import {
  apiRequest,
  getArg,
  loadDotEnv,
  normalizeBaseUrl,
  printLine,
  printSection,
  resolveToken,
} from './ec-sandbox-smoke-lib.mjs';

function findEventEntry(entries, eventType, approvalRequestId) {
  return (
    entries.find(
      (entry) =>
        entry.eventType === eventType &&
        entry.approvalRequestId === approvalRequestId,
    ) ?? null
  );
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
  const dueAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();

  const operationalCase = await apiRequest({
    baseUrl,
    path: `/growth/tenants/${encodeURIComponent(
      tenantSlug,
    )}/conversations/operational-cases`,
    token,
    method: 'POST',
    body: {
      sourceKey: `guarded_execution_smoke:${runId}`,
      caseType: 'alert_escalation',
      priority: 'warning',
      title: `Guarded execution smoke ${runId}`,
      summary:
        'Smoke case for the first guarded-execution lane over Growth operational assignment.',
      nextAction:
        'Use the first guarded-execution lane to take and then roll back this operational case.',
      alertKey: `guarded_execution_smoke_${runId}`,
      dueAt,
    },
  });

  const suggestionRun = await apiRequest({
    baseUrl,
    path: `/ai/tenants/${encodeURIComponent(
      tenantSlug,
    )}/agents/${encodeURIComponent(agentKey)}/suggestion-runs`,
    token,
    method: 'POST',
  });

  const approvalRequest = await apiRequest({
    baseUrl,
    path: `/ai/tenants/${encodeURIComponent(
      tenantSlug,
    )}/agents/${encodeURIComponent(agentKey)}/suggestion-runs/${encodeURIComponent(
      suggestionRun.id,
    )}/approval-requests`,
    token,
    method: 'POST',
    body: {
      rationale:
        'Smoke approval request for the first guarded-execution Growth lane.',
    },
  });

  const reviewedApprovalRequest = await apiRequest({
    baseUrl,
    path: `/ai/tenants/${encodeURIComponent(
      tenantSlug,
    )}/agents/${encodeURIComponent(agentKey)}/approval-requests/${encodeURIComponent(
      approvalRequest.id,
    )}/review`,
    token,
    method: 'POST',
    body: {
      status: 'approved',
      reviewNote:
        'Smoke approval review for the first guarded-execution Growth lane.',
    },
  });

  if (reviewedApprovalRequest.status !== 'approved') {
    throw new Error(
      `Approval request ${reviewedApprovalRequest.id} was not approved by the smoke review step.`,
    );
  }

  const execution = await apiRequest({
    baseUrl,
    path: `/ai/tenants/${encodeURIComponent(
      tenantSlug,
    )}/agents/${encodeURIComponent(agentKey)}/approval-requests/${encodeURIComponent(
      approvalRequest.id,
    )}/guarded-execution`,
    token,
    method: 'POST',
    body: {
      caseId: operationalCase.id,
    },
  });

  if (execution.operationalCase?.status !== 'in_progress') {
    throw new Error(
      `Guarded execution did not move case ${operationalCase.id} to in_progress.`,
    );
  }

  const rollback = await apiRequest({
    baseUrl,
    path: `/ai/tenants/${encodeURIComponent(
      tenantSlug,
    )}/agents/${encodeURIComponent(agentKey)}/approval-requests/${encodeURIComponent(
      approvalRequest.id,
    )}/guarded-execution-rollback`,
    token,
    method: 'POST',
    body: {
      caseId: operationalCase.id,
    },
  });

  if (rollback.operationalCase?.status !== 'open') {
    throw new Error(
      `Guarded rollback did not return case ${operationalCase.id} to open state.`,
    );
  }

  if (rollback.safeFallbackMode !== 'suggestion_only') {
    throw new Error(
      `Guarded rollback returned safeFallbackMode=${rollback.safeFallbackMode}, expected suggestion_only.`,
    );
  }

  const eventLog = await apiRequest({
    baseUrl,
    path: `/ai/tenants/${encodeURIComponent(
      tenantSlug,
    )}/guarded-execution-event-log-workspace`,
    token,
    method: 'GET',
  });

  const executedEntry = findEventEntry(
    eventLog.entries,
    'guarded_execution_executed',
    approvalRequest.id,
  );
  const rolledBackEntry = findEventEntry(
    eventLog.entries,
    'guarded_execution_rolled_back',
    approvalRequest.id,
  );

  if (!executedEntry) {
    throw new Error(
      `Guarded execution event log is missing executed entry for approvalRequestId=${approvalRequest.id}.`,
    );
  }

  if (!rolledBackEntry) {
    throw new Error(
      `Guarded execution event log is missing rolled back entry for approvalRequestId=${approvalRequest.id}.`,
    );
  }

  if (executedEntry.candidateToolKey !== 'growth_case_assignment_execution') {
    throw new Error(
      `Executed event candidateToolKey=${executedEntry.candidateToolKey}, expected growth_case_assignment_execution.`,
    );
  }

  if (rolledBackEntry.candidateToolKey !== 'growth_case_assignment_execution') {
    throw new Error(
      `Rolled back event candidateToolKey=${rolledBackEntry.candidateToolKey}, expected growth_case_assignment_execution.`,
    );
  }

  printSection('Guarded Execution Smoke');
  printLine('tenantSlug', tenantSlug);
  printLine('agentKey', agentKey);
  printLine('operationalCaseId', operationalCase.id);
  printLine('suggestionRunId', suggestionRun.id);
  printLine('approvalRequestId', approvalRequest.id);

  printSection('Execution');
  printLine('executedAt', execution.executedAt);
  printLine('operationalCaseStatus', execution.operationalCase?.status);
  printLine('assignedUserId', execution.operationalCase?.assignedUserId);

  printSection('Rollback');
  printLine('rolledBackAt', rollback.rolledBackAt);
  printLine('safeFallbackMode', rollback.safeFallbackMode);
  printLine('operationalCaseStatus', rollback.operationalCase?.status);

  printSection('Event Log');
  printLine('executedEventId', executedEntry.id);
  printLine('rolledBackEventId', rolledBackEntry.id);
  printLine('executedEvents', eventLog.counts?.executedEvents ?? 'n/a');
  printLine('rolledBackEvents', eventLog.counts?.rolledBackEvents ?? 'n/a');

  printSection('Result');
  printLine('status', 'ok');
}

main().catch((error) => {
  process.stderr.write(
    `${error instanceof Error ? error.message : String(error)}\n`,
  );
  process.exit(1);
});
