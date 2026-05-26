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
  const agentKey = getArg('agent-key', 'invoice-document-assistant');
  const token = resolveToken();
  const runId = `${Date.now()}`;
  const issuedAt = new Date().toISOString();
  const dueAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  const itemAmountInCents = Number.parseInt(
    getArg('amount-in-cents', '12345'),
    10,
  );

  if (Number.isNaN(itemAmountInCents) || itemAmountInCents <= 0) {
    throw new Error('amount-in-cents must be a positive integer.');
  }

  const customer = await apiRequest({
    baseUrl,
    path: `/invoicing/tenants/${encodeURIComponent(tenantSlug)}/customers`,
    token,
    method: 'POST',
    body: {
      name: `AI Guarded Invoice Reject Smoke ${runId}`,
      email: `owner.invoice.reject.smoke.${runId}@saas-platform.dev`,
      identificationType: '05',
      identification: `998${runId.slice(-10)}`,
      billingAddress: 'Smoke rejection billing address',
    },
  });

  const invoice = await apiRequest({
    baseUrl,
    path: `/invoicing/tenants/${encodeURIComponent(tenantSlug)}/invoices`,
    token,
    method: 'POST',
    body: {
      customerId: customer.id,
      currency: 'USD',
      status: 'issued',
      issuedAt,
      dueAt,
      notes:
        'Smoke invoice for rejected guarded execution fallback over invoicing payment posting.',
    },
  });

  await apiRequest({
    baseUrl,
    path: `/invoicing/tenants/${encodeURIComponent(
      tenantSlug,
    )}/invoices/${encodeURIComponent(invoice.id)}/items`,
    token,
    method: 'POST',
    body: {
      description: `AI guarded execution rejection invoice item ${runId}`,
      quantity: 1,
      unitPriceInCents: itemAmountInCents,
    },
  });

  const invoiceDetailBeforeExecution = await apiRequest({
    baseUrl,
    path: `/invoicing/tenants/${encodeURIComponent(
      tenantSlug,
    )}/invoices/${encodeURIComponent(invoice.id)}`,
    token,
    method: 'GET',
  });

  if (invoiceDetailBeforeExecution.status !== 'issued') {
    throw new Error(
      `Invoice ${invoice.id} is ${invoiceDetailBeforeExecution.status}, expected issued before rejected guarded execution.`,
    );
  }

  if (invoiceDetailBeforeExecution.settlement.balanceDueInCents <= 0) {
    throw new Error(
      `Invoice ${invoice.id} has no outstanding balance before rejected guarded execution.`,
    );
  }

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
        'Smoke approval request for rejected guarded-execution fallback validation over the invoicing lane.',
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
        'Rejected in smoke to confirm that invoicing guarded execution stays blocked.',
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
      invoiceId: invoice.id,
    },
    expectedStatus: 409,
  });

  const invoiceDetailAfterRejectedExecution = await apiRequest({
    baseUrl,
    path: `/invoicing/tenants/${encodeURIComponent(
      tenantSlug,
    )}/invoices/${encodeURIComponent(invoice.id)}`,
    token,
    method: 'GET',
  });

  if (invoiceDetailAfterRejectedExecution.status !== 'issued') {
    throw new Error(
      `Invoice ${invoice.id} changed to ${invoiceDetailAfterRejectedExecution.status} after rejected execution attempt.`,
    );
  }

  if (
    invoiceDetailAfterRejectedExecution.settlement.balanceDueInCents !==
    itemAmountInCents
  ) {
    throw new Error(
      `Invoice ${invoice.id} balanceDueInCents=${invoiceDetailAfterRejectedExecution.settlement.balanceDueInCents}, expected ${itemAmountInCents} after rejected execution attempt.`,
    );
  }

  const matchingPostedPayment =
    invoiceDetailAfterRejectedExecution.payments.find(
      (payment) =>
        payment.reference === `ai-approval:${approvalRequest.id}` &&
        payment.status === 'posted',
    ) ?? null;

  if (matchingPostedPayment) {
    throw new Error(
      `Invoice ${invoice.id} unexpectedly contains posted payment ${matchingPostedPayment.id} after rejected execution attempt.`,
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

  printSection('Guarded Execution Invoice Rejection Smoke');
  printLine('tenantSlug', tenantSlug);
  printLine('agentKey', agentKey);
  printLine('invoiceId', invoice.id);
  printLine('invoiceNumber', invoice.number);
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
  printLine('invoiceStatus', invoiceDetailAfterRejectedExecution.status);
  printLine(
    'balanceDueInCents',
    invoiceDetailAfterRejectedExecution.settlement.balanceDueInCents,
  );
  printLine('matchingPostedPayment', matchingPostedPayment?.id ?? null);
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
