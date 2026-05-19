import {
  apiRequest,
  bootstrapRemoteSandboxConfiguration,
  getArg,
  hasFlag,
  loadDotEnv,
  normalizeBaseUrl,
  printLine,
  printSection,
  resolveToken,
  toBoolean,
} from './ec-sandbox-smoke-lib.mjs';

function requireReadiness(readiness) {
  if (!readiness.isReadyForRemoteSandboxSubmission) {
    const blockers = Array.isArray(readiness.blockers)
      ? readiness.blockers.join(' | ')
      : 'Readiness remoto interno no disponible.';

    throw new Error(
      `El tenant todavia no esta listo para sandbox remoto interno. ${blockers}`,
    );
  }
}

async function ensureInvoiceNumbering({ baseUrl, tenantSlug, token }) {
  const establishmentCode = getArg('establishment-code', '001');
  const emissionPointCode = getArg('emission-point-code', '002');
  const nextSequenceNumber = Number.parseInt(
    getArg('next-sequence-number', '1'),
    10,
  );

  if (Number.isNaN(nextSequenceNumber) || nextSequenceNumber <= 0) {
    throw new Error('next-sequence-number debe ser un entero positivo.');
  }

  const numbering = await apiRequest({
    baseUrl,
    path: `/invoicing/tenants/${encodeURIComponent(
      tenantSlug,
    )}/numbering/invoice`,
    token,
    method: 'POST',
    body: {
      documentCode: '01',
      establishmentCode,
      emissionPointCode,
      nextSequenceNumber,
    },
  });

  printSection('Invoice Numbering');
  printLine('previewNumber', numbering.previewNumber);
  printLine('nextSequenceNumber', numbering.nextSequenceNumber);

  return numbering;
}

async function createSmokeCustomer({ baseUrl, tenantSlug, token, runId }) {
  const customer = await apiRequest({
    baseUrl,
    path: `/invoicing/tenants/${encodeURIComponent(tenantSlug)}/customers`,
    token,
    method: 'POST',
    body: {
      name: getArg('customer-name', `Smoke Customer ${runId}`),
      email: getArg('customer-email', `smoke-${runId}@example.test`),
      taxId: getArg('customer-tax-id', `099${runId.slice(-10)}`),
      identificationType: getArg('customer-identification-type', '05'),
      identification: getArg('customer-identification', `099${runId.slice(-10)}`),
      billingAddress: getArg(
        'customer-billing-address',
        'Av. Demo y Calle Sandbox',
      ),
    },
  });

  printSection('Customer');
  printLine('customerId', customer.id);
  printLine('customerName', customer.name);

  return customer;
}

async function createSmokeTaxRate({ baseUrl, tenantSlug, token, runId }) {
  const taxRate = await apiRequest({
    baseUrl,
    path: `/invoicing/tenants/${encodeURIComponent(tenantSlug)}/taxes`,
    token,
    method: 'POST',
    body: {
      name: getArg('tax-name', `VAT 12% Smoke ${runId}`),
      percentage: Number.parseFloat(getArg('tax-percentage', '12')),
      isActive: true,
    },
  });

  printSection('Tax Rate');
  printLine('taxRateId', taxRate.id);
  printLine('taxRateName', taxRate.name);
  printLine('taxRatePercentage', taxRate.percentage);

  return taxRate;
}

async function createSmokeInvoice({
  baseUrl,
  tenantSlug,
  token,
  customerId,
  runId,
}) {
  const issuedAt = getArg('invoice-issued-at', new Date().toISOString());
  const dueAt = getArg(
    'invoice-due-at',
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  );

  const invoice = await apiRequest({
    baseUrl,
    path: `/invoicing/tenants/${encodeURIComponent(tenantSlug)}/invoices`,
    token,
    method: 'POST',
    body: {
      customerId,
      currency: getArg('invoice-currency', 'USD'),
      status: 'draft',
      issuedAt,
      dueAt,
      notes: getArg(
        'invoice-notes',
        `Smoke remoto interno ${runId}`,
      ),
    },
  });

  printSection('Invoice');
  printLine('invoiceId', invoice.id);
  printLine('invoiceNumber', invoice.number);
  printLine('status', invoice.status);

  return invoice;
}

async function addSmokeInvoiceItem({
  baseUrl,
  tenantSlug,
  token,
  invoiceId,
  taxRateId,
}) {
  const item = await apiRequest({
    baseUrl,
    path: `/invoicing/tenants/${encodeURIComponent(
      tenantSlug,
    )}/invoices/${encodeURIComponent(invoiceId)}/items`,
    token,
    method: 'POST',
    body: {
      description: getArg(
        'item-description',
        'Servicio smoke sandbox remoto interno',
      ),
      quantity: Number.parseFloat(getArg('item-quantity', '1')),
      unitPriceInCents: Number.parseInt(
        getArg('item-unit-price-in-cents', '10000'),
        10,
      ),
      taxRateId,
    },
  });

  printSection('Invoice Item');
  printLine('itemId', item.id);
  printLine('lineTotalInCents', item.lineTotalInCents);
  printLine('lineTaxInCents', item.lineTaxInCents);

  return item;
}

async function issueInvoice({ baseUrl, tenantSlug, token, invoiceId }) {
  const invoice = await apiRequest({
    baseUrl,
    path: `/invoicing/tenants/${encodeURIComponent(
      tenantSlug,
    )}/invoices/${encodeURIComponent(invoiceId)}/status`,
    token,
    method: 'POST',
    body: {
      status: 'issued',
    },
  });

  printSection('Invoice Issuance');
  printLine('status', invoice.status);

  return invoice;
}

async function submitInvoice({ baseUrl, tenantSlug, token, invoiceId }) {
  const submission = await apiRequest({
    baseUrl,
    path: `/invoicing/tenants/${encodeURIComponent(
      tenantSlug,
    )}/invoices/${encodeURIComponent(invoiceId)}/electronic-document/submit`,
    token,
    method: 'POST',
  });

  printSection('Electronic Submission');
  printLine('submitted', submission.submitted);
  printLine('electronicStatus', submission.electronicStatus);
  printLine('accessKey', submission.accessKey);
  printLine('submissionReference', submission.submissionReference);

  return submission;
}

async function getInvoiceDetail({ baseUrl, tenantSlug, token, invoiceId }) {
  return apiRequest({
    baseUrl,
    path: `/invoicing/tenants/${encodeURIComponent(
      tenantSlug,
    )}/invoices/${encodeURIComponent(invoiceId)}`,
    token,
  });
}

async function main() {
  loadDotEnv();

  const baseUrl = normalizeBaseUrl(
    getArg('base-url', 'http://127.0.0.1:3000/api'),
  );
  const tenantSlug = getArg('tenant-slug', 'saas-platform-local');
  const bootstrapRemoteSandbox =
    hasFlag('bootstrap-remote-sandbox') ||
    toBoolean(getArg('bootstrap-remote-sandbox', 'false'));
  const syncIssuerTaxId =
    hasFlag('sync-issuer-tax-id') ||
    toBoolean(getArg('sync-issuer-tax-id', 'false'));
  const checkAuthorization =
    hasFlag('check-authorization') ||
    toBoolean(getArg('check-authorization', 'false'));
  const token = resolveToken();
  const runId = Date.now().toString();

  if (bootstrapRemoteSandbox) {
    await bootstrapRemoteSandboxConfiguration({
      baseUrl,
      tenantSlug,
      token,
    });
  }

  const inspectionResponse = await apiRequest({
    baseUrl,
    path: `/invoicing/tenants/${encodeURIComponent(
      tenantSlug,
    )}/electronic-signature/inspection`,
    token,
  });

  const inspection = inspectionResponse.inspection;

  if (syncIssuerTaxId && inspection.extractedTaxId) {
    await apiRequest({
      baseUrl,
      path: `/invoicing/tenants/${encodeURIComponent(
        tenantSlug,
      )}/electronic-profile/sync-certificate-tax-id`,
      token,
      method: 'POST',
    });
  }

  const readiness = await apiRequest({
    baseUrl,
    path: `/invoicing/tenants/${encodeURIComponent(
      tenantSlug,
    )}/electronic-document/readiness`,
    token,
  });

  printSection('Readiness Before Submission');
  printLine(
    'isReadyForRemoteSandboxSubmission',
    readiness.isReadyForRemoteSandboxSubmission,
  );
  printLine(
    'internalSignerIssuerAlignmentStatus',
    readiness.internalSignerIssuerAlignmentStatus,
  );
  printLine(
    'internalSignerOfflineCompatibilityStatus',
    readiness.internalSignerOfflineCompatibilityStatus,
  );
  printLine('recommendedNextStep', readiness.recommendedNextStep);

  requireReadiness(readiness);

  await ensureInvoiceNumbering({ baseUrl, tenantSlug, token });
  const customer = await createSmokeCustomer({
    baseUrl,
    tenantSlug,
    token,
    runId,
  });
  const taxRate = await createSmokeTaxRate({
    baseUrl,
    tenantSlug,
    token,
    runId,
  });
  const invoice = await createSmokeInvoice({
    baseUrl,
    tenantSlug,
    token,
    customerId: customer.id,
    runId,
  });

  await addSmokeInvoiceItem({
    baseUrl,
    tenantSlug,
    token,
    invoiceId: invoice.id,
    taxRateId: taxRate.id,
  });
  await issueInvoice({
    baseUrl,
    tenantSlug,
    token,
    invoiceId: invoice.id,
  });
  await submitInvoice({
    baseUrl,
    tenantSlug,
    token,
    invoiceId: invoice.id,
  });

  const detail = await getInvoiceDetail({
    baseUrl,
    tenantSlug,
    token,
    invoiceId: invoice.id,
  });

  if (checkAuthorization) {
    await apiRequest({
      baseUrl,
      path: `/invoicing/tenants/${encodeURIComponent(
        tenantSlug,
      )}/invoices/${encodeURIComponent(
        invoice.id,
      )}/electronic-document/check-authorization`,
      token,
      method: 'POST',
    });
  }

  printSection('Invoice Detail After Submission');
  printLine('invoiceId', detail.id);
  printLine('invoiceNumber', detail.number);
  printLine('status', detail.status);
  printLine('electronicStatus', detail.electronicStatus);
  printLine('accessKey', detail.accessKey);
  printLine('submissionReference', detail.submissionReference);
  printLine('authorizationNumber', detail.authorizationNumber);
  printLine('electronicStatusMessage', detail.electronicStatusMessage);
  printLine(
    'latestSriDiagnosticsCount',
    Array.isArray(detail.latestSriDiagnostics?.messages)
      ? detail.latestSriDiagnostics.messages.length
      : 0,
  );

  printSection('Result');
  printLine('status', 'ok');
}

main().catch((error) => {
  process.stderr.write(
    `${error instanceof Error ? error.message : String(error)}\n`,
  );
  process.exit(1);
});
