import {
  apiRequest,
  getArg,
  loadDotEnv,
  normalizeBaseUrl,
  printLine,
  printSection,
  resolveToken,
} from './ec-sandbox-smoke-lib.mjs';

function requireArray(value, label) {
  if (!Array.isArray(value)) {
    throw new Error(`${label} must be an array.`);
  }

  return value;
}

function requireOrderDraft(result, orderDraftId, label) {
  if (result?.orderDraft?.id !== orderDraftId) {
    throw new Error(
      `${label} orderDraftId=${result?.orderDraft?.id}, expected ${orderDraftId}.`,
    );
  }
}

async function main() {
  loadDotEnv();

  const baseUrl = normalizeBaseUrl(
    getArg('base-url', 'http://127.0.0.1:3000/api'),
  );
  const tenantSlug = getArg('tenant-slug', 'saas-platform-local');
  const productEntityId = getArg('product-entity-id', '');
  const orderDraftId = getArg('order-draft-id', '');
  const token = resolveToken();

  if (!productEntityId || !orderDraftId) {
    throw new Error(
      'Post-sale closeout smoke requires --product-entity-id and --order-draft-id.',
    );
  }

  const basePath = `/ecommerce/tenants/${encodeURIComponent(
    tenantSlug,
  )}/product-entities/${encodeURIComponent(productEntityId)}`;
  const orderBasePath = `${basePath}/order-drafts/${encodeURIComponent(
    orderDraftId,
  )}`;

  const paymentDisputeWorkspace = await apiRequest({
    baseUrl,
    path: `${orderBasePath}/payment-dispute-workspace`,
    token,
    method: 'GET',
  });

  requireOrderDraft(paymentDisputeWorkspace, orderDraftId, 'Payment dispute');
  requireArray(paymentDisputeWorkspace.resolutionPaths, 'resolutionPaths');

  const disputeResolutionPacket = await apiRequest({
    baseUrl,
    path: `${orderBasePath}/request-payment-dispute-resolution-packet`,
    token,
    method: 'POST',
  });

  requireOrderDraft(disputeResolutionPacket, orderDraftId, 'Dispute resolution');
  requireArray(disputeResolutionPacket.requiredEvidence, 'requiredEvidence');
  requireArray(
    disputeResolutionPacket.resolutionChecklist,
    'resolutionChecklist',
  );

  const fulfillmentDeliveryWorkspace = await apiRequest({
    baseUrl,
    path: `${orderBasePath}/fulfillment-delivery-workspace`,
    token,
    method: 'GET',
  });

  requireOrderDraft(
    fulfillmentDeliveryWorkspace,
    orderDraftId,
    'Fulfillment delivery',
  );
  requireArray(fulfillmentDeliveryWorkspace.handoffNotes, 'handoffNotes');

  const deliveryConfirmationPacket = await apiRequest({
    baseUrl,
    path: `${orderBasePath}/request-fulfillment-delivery-confirmation-packet`,
    token,
    method: 'POST',
  });

  requireOrderDraft(
    deliveryConfirmationPacket,
    orderDraftId,
    'Delivery confirmation',
  );
  requireArray(deliveryConfirmationPacket.evidenceChecklist, 'evidenceChecklist');
  requireArray(deliveryConfirmationPacket.operatorNotes, 'operatorNotes');

  const reportingSummary = await apiRequest({
    baseUrl,
    path: `${basePath}/order-post-sale-reporting-summary`,
    token,
    method: 'GET',
  });

  if (reportingSummary?.productEntity?.productEntityId !== productEntityId) {
    throw new Error(
      `Reporting summary productEntityId=${reportingSummary?.productEntity?.productEntityId}, expected ${productEntityId}.`,
    );
  }

  if (typeof reportingSummary.summary?.totalOrders !== 'number') {
    throw new Error('Reporting summary is missing totalOrders.');
  }

  printSection('AI Ecommerce Post-Sale Closeout Smoke');
  printLine('tenantSlug', tenantSlug);
  printLine('productEntityId', productEntityId);
  printLine('orderDraftId', orderDraftId);

  printSection('Payment Dispute');
  printLine('workspaceStatus', paymentDisputeWorkspace.disputeStatus);
  printLine('resolutionDecision', disputeResolutionPacket.resolutionDecision);
  printLine('resolutionNextStep', disputeResolutionPacket.nextStep);

  printSection('Fulfillment Delivery');
  printLine('deliveryStatus', fulfillmentDeliveryWorkspace.deliveryStatus);
  printLine(
    'confirmationStatus',
    deliveryConfirmationPacket.confirmationStatus,
  );
  printLine('confirmationNextStep', deliveryConfirmationPacket.nextStep);

  printSection('Reporting Summary');
  printLine('totalOrders', reportingSummary.summary.totalOrders);
  printLine('confirmedCount', reportingSummary.summary.confirmedCount);
  printLine('deliveredCount', reportingSummary.summary.deliveredCount);
  printLine('divergenceCount', reportingSummary.summary.divergenceCount);
  printLine('nextFocus', reportingSummary.nextFocus);

  printSection('Result');
  printLine('status', 'ok');
}

main().catch((error) => {
  process.stderr.write(
    `${error instanceof Error ? error.message : String(error)}\n`,
  );
  process.exit(1);
});
