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
      name: `AI Guarded Invoice Smoke ${runId}`,
      email: `owner.invoice.smoke.${runId}@saas-platform.dev`,
      identificationType: '05',
      identification: `999${runId.slice(-10)}`,
      billingAddress: 'Smoke billing address',
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
        'Smoke invoice for the second guarded-execution lane over invoicing payment posting.',
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
      description: `AI guarded execution invoice item ${runId}`,
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
      `Invoice ${invoice.id} is ${invoiceDetailBeforeExecution.status}, expected issued before guarded execution.`,
    );
  }

  if (invoiceDetailBeforeExecution.settlement.balanceDueInCents <= 0) {
    throw new Error(
      `Invoice ${invoice.id} has no outstanding balance before guarded execution.`,
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
        'Smoke approval request for the second guarded-execution invoicing lane.',
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
        'Smoke approval review for the second guarded-execution invoicing lane.',
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
      invoiceId: invoice.id,
    },
  });

  if (execution.targetKind !== 'invoice_payment') {
    throw new Error(
      `Guarded execution targetKind=${execution.targetKind}, expected invoice_payment.`,
    );
  }

  if (execution.toolKey !== 'invoice_payment_collection_execution') {
    throw new Error(
      `Guarded execution toolKey=${execution.toolKey}, expected invoice_payment_collection_execution.`,
    );
  }

  if (execution.invoice?.status !== 'paid') {
    throw new Error(
      `Guarded execution did not move invoice ${invoice.id} to paid state.`,
    );
  }

  if (execution.payment?.status !== 'posted') {
    throw new Error(
      `Guarded execution payment ${execution.payment?.id ?? 'unknown'} is not posted.`,
    );
  }

  if (execution.payment?.reference !== `ai-approval:${approvalRequest.id}`) {
    throw new Error(
      `Guarded execution payment reference=${execution.payment?.reference}, expected ai-approval:${approvalRequest.id}.`,
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
      invoiceId: invoice.id,
    },
  });

  if (rollback.targetKind !== 'invoice_payment') {
    throw new Error(
      `Guarded rollback targetKind=${rollback.targetKind}, expected invoice_payment.`,
    );
  }

  if (rollback.invoice?.status !== 'issued') {
    throw new Error(
      `Guarded rollback did not return invoice ${invoice.id} to issued state.`,
    );
  }

  if (rollback.payment?.status !== 'reversed') {
    throw new Error(
      `Guarded rollback payment ${rollback.payment?.id ?? 'unknown'} is not reversed.`,
    );
  }

  if (rollback.safeFallbackMode !== 'suggestion_only') {
    throw new Error(
      `Guarded rollback returned safeFallbackMode=${rollback.safeFallbackMode}, expected suggestion_only.`,
    );
  }

  const invoiceDetailAfterRollback = await apiRequest({
    baseUrl,
    path: `/invoicing/tenants/${encodeURIComponent(
      tenantSlug,
    )}/invoices/${encodeURIComponent(invoice.id)}`,
    token,
    method: 'GET',
  });

  if (invoiceDetailAfterRollback.status !== 'issued') {
    throw new Error(
      `Invoice ${invoice.id} is ${invoiceDetailAfterRollback.status} after rollback, expected issued.`,
    );
  }

  if (
    invoiceDetailAfterRollback.settlement.balanceDueInCents !== itemAmountInCents
  ) {
    throw new Error(
      `Invoice ${invoice.id} balanceDueInCents=${invoiceDetailAfterRollback.settlement.balanceDueInCents}, expected ${itemAmountInCents} after rollback.`,
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

  if (
    executedEntry.candidateToolKey !== 'invoice_payment_collection_execution'
  ) {
    throw new Error(
      `Executed event candidateToolKey=${executedEntry.candidateToolKey}, expected invoice_payment_collection_execution.`,
    );
  }

  if (
    rolledBackEntry.candidateToolKey !== 'invoice_payment_collection_execution'
  ) {
    throw new Error(
      `Rolled back event candidateToolKey=${rolledBackEntry.candidateToolKey}, expected invoice_payment_collection_execution.`,
    );
  }

  printSection('Guarded Execution Invoice Smoke');
  printLine('tenantSlug', tenantSlug);
  printLine('agentKey', agentKey);
  printLine('invoiceId', invoice.id);
  printLine('invoiceNumber', invoice.number);
  printLine('suggestionRunId', suggestionRun.id);
  printLine('approvalRequestId', approvalRequest.id);

  printSection('Execution');
  printLine('executedAt', execution.executedAt);
  printLine('invoiceStatus', execution.invoice?.status);
  printLine('paymentId', execution.payment?.id);
  printLine('paymentStatus', execution.payment?.status);
  printLine('paymentReference', execution.payment?.reference);

  printSection('Rollback');
  printLine('rolledBackAt', rollback.rolledBackAt);
  printLine('safeFallbackMode', rollback.safeFallbackMode);
  printLine('invoiceStatus', rollback.invoice?.status);
  printLine('paymentStatus', rollback.payment?.status);

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
