import {
  apiRequest,
  getArg,
  loadDotEnv,
  normalizeBaseUrl,
  printLine,
  printSection,
  resolveToken,
} from './ec-sandbox-smoke-lib.mjs';

async function apiRequestExpectingStatus({
  baseUrl,
  path,
  token,
  method = 'GET',
  body,
  expectedStatus,
}) {
  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  const text = await response.text();
  let data = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (response.status !== expectedStatus) {
    const error =
      typeof data === 'object' && data && 'message' in data
        ? data.message
        : text || response.statusText;

    throw new Error(
      `${method} ${path} returned ${response.status}, expected ${expectedStatus}: ${error}`,
    );
  }

  return data;
}

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
      sourceKey: `guarded_execution_rejection_smoke:${runId}`,
      caseType: 'alert_escalation',
      priority: 'warning',
      title: `Guarded execution rejection smoke ${runId}`,
      summary:
        'Smoke case for rejected approval and no-execute fallback over the first Growth guarded lane.',
      nextAction:
        'Reject the human review request and confirm the guarded lane stays suggestion-only.',
      alertKey: `guarded_execution_rejection_smoke_${runId}`,
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
        'Smoke approval request for rejected guarded-execution fallback validation.',
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
      status: 'rejected',
      reviewNote:
        'Rejected in smoke to confirm that guarded execution stays blocked.',
    },
  });

  if (reviewedApprovalRequest.status !== 'rejected') {
    throw new Error(
      `Approval request ${reviewedApprovalRequest.id} was not rejected by the smoke review step.`,
    );
  }

  const rejectionResponse = await apiRequestExpectingStatus({
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
    expectedStatus: 409,
  });

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
  const reviewedEntry = findEventEntry(
    eventLog.entries,
    'approval_reviewed',
    approvalRequest.id,
  );

  if (executedEntry) {
    throw new Error(
      `Event log unexpectedly contains executed entry for rejected approvalRequestId=${approvalRequest.id}.`,
    );
  }

  if (rolledBackEntry) {
    throw new Error(
      `Event log unexpectedly contains rolled back entry for rejected approvalRequestId=${approvalRequest.id}.`,
    );
  }

  if (!reviewedEntry) {
    throw new Error(
      `Event log is missing approval_reviewed entry for rejected approvalRequestId=${approvalRequest.id}.`,
    );
  }

  const growthCaseList = await apiRequest({
    baseUrl,
    path: `/growth/tenants/${encodeURIComponent(
      tenantSlug,
    )}/conversations/operational-cases?status=open`,
    token,
    method: 'GET',
  });
  const caseAfterRejectedExecution =
    growthCaseList.find((entry) => entry.id === operationalCase.id) ?? null;

  if (!caseAfterRejectedExecution) {
    throw new Error(
      `Operational case ${operationalCase.id} was not found after rejected execution attempt.`,
    );
  }

  if (caseAfterRejectedExecution.status !== 'open') {
    throw new Error(
      `Operational case ${operationalCase.id} changed to ${caseAfterRejectedExecution.status} after rejected execution attempt.`,
    );
  }

  if (caseAfterRejectedExecution.assignedUserId !== null) {
    throw new Error(
      `Operational case ${operationalCase.id} was assigned after rejected execution attempt.`,
    );
  }

  printSection('Guarded Execution Rejection Smoke');
  printLine('tenantSlug', tenantSlug);
  printLine('agentKey', agentKey);
  printLine('operationalCaseId', operationalCase.id);
  printLine('suggestionRunId', suggestionRun.id);
  printLine('approvalRequestId', approvalRequest.id);

  printSection('Rejected Review');
  printLine('reviewStatus', reviewedApprovalRequest.status);
  printLine('reviewNote', reviewedApprovalRequest.reviewNote);

  printSection('Blocked Execute');
  printLine('httpStatus', 409);
  printLine(
    'message',
    Array.isArray(rejectionResponse?.message)
      ? rejectionResponse.message.join('; ')
      : rejectionResponse?.message,
  );

  printSection('Fallback Verification');
  printLine('operationalCaseStatus', caseAfterRejectedExecution.status);
  printLine('assignedUserId', caseAfterRejectedExecution.assignedUserId);
  printLine('executedEntryPresent', Boolean(executedEntry));
  printLine('rolledBackEntryPresent', Boolean(rolledBackEntry));
  printLine('reviewedEntryId', reviewedEntry.id);

  printSection('Result');
  printLine('status', 'ok');
}

main().catch((error) => {
  process.stderr.write(
    `${error instanceof Error ? error.message : String(error)}\n`,
  );
  process.exit(1);
});
