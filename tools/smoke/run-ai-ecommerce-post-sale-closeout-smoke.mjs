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

function pickProductEntity(registry, requestedProductEntityId) {
  const productEntities = requireArray(
    registry?.productEntities,
    'productEntities',
  );

  if (requestedProductEntityId) {
    return (
      productEntities.find(
        (entry) => entry.productEntityId === requestedProductEntityId,
      ) ?? null
    );
  }

  return (
    productEntities.find((entry) => entry.status !== 'needs_activation') ??
    productEntities[0] ??
    null
  );
}

function pickOrderDraft(registry, requestedOrderDraftId) {
  const orderDrafts = requireArray(registry?.orderDrafts, 'orderDrafts');

  if (requestedOrderDraftId) {
    return orderDrafts.find((entry) => entry.id === requestedOrderDraftId) ?? null;
  }

  return (
    orderDrafts.find((entry) => entry.status !== 'blocked') ??
    orderDrafts[0] ??
    null
  );
}

async function resolveSmokeTargets({
  baseUrl,
  tenantSlug,
  requestedProductEntityId,
  requestedOrderDraftId,
  token,
}) {
  const productRegistry = await apiRequest({
    baseUrl,
    path: `/ecommerce/tenants/${encodeURIComponent(
      tenantSlug,
    )}/product-entities`,
    token,
    method: 'GET',
  });

  const productEntity = pickProductEntity(
    productRegistry,
    requestedProductEntityId,
  );

  if (!productEntity) {
    throw new Error(
      `No ecommerce product entity was found for tenant ${tenantSlug}. Create or promote a product entity before running this smoke.`,
    );
  }

  const productEntityId = productEntity.productEntityId;
  const orderDraftRegistry = await apiRequest({
    baseUrl,
    path: `/ecommerce/tenants/${encodeURIComponent(
      tenantSlug,
    )}/product-entities/${encodeURIComponent(productEntityId)}/order-drafts`,
    token,
    method: 'GET',
  });

  let orderDraft = pickOrderDraft(orderDraftRegistry, requestedOrderDraftId);
  let orderDraftCreated = false;

  if (!orderDraft && !requestedOrderDraftId) {
    const saveResponse = await apiRequest({
      baseUrl,
      path: `/ecommerce/tenants/${encodeURIComponent(
        tenantSlug,
      )}/product-entities/${encodeURIComponent(productEntityId)}/save-order-draft`,
      token,
      method: 'POST',
    });
    orderDraft = saveResponse.orderDraft ?? null;
    orderDraftCreated = Boolean(orderDraft);
  }

  if (!orderDraft) {
    throw new Error(
      `No ecommerce order draft was found for productEntityId=${productEntityId}. Run without --order-draft-id to let the smoke create one, or create an order draft first.`,
    );
  }

  return {
    orderDraft,
    orderDraftCreated,
    productEntity,
    productRegistrySummary: productRegistry.summary,
    orderDraftRegistrySummary: orderDraftRegistry.summary,
  };
}

async function main() {
  loadDotEnv();

  const baseUrl = normalizeBaseUrl(
    getArg('base-url', 'http://127.0.0.1:3000/api'),
  );
  const tenantSlug = getArg('tenant-slug', 'saas-platform-local');
  const requestedProductEntityId = getArg('product-entity-id', '');
  const requestedOrderDraftId = getArg('order-draft-id', '');
  const token = resolveToken();

  const {
    orderDraft,
    orderDraftCreated,
    productEntity,
    productRegistrySummary,
    orderDraftRegistrySummary,
  } = await resolveSmokeTargets({
    baseUrl,
    tenantSlug,
    requestedProductEntityId,
    requestedOrderDraftId,
    token,
  });
  const productEntityId = productEntity.productEntityId;
  const orderDraftId = orderDraft.id;

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
  printLine('productTitle', productEntity.title);
  printLine('orderDraftId', orderDraftId);
  printLine('orderLabel', orderDraft.orderLabel);
  printLine('orderDraftCreated', orderDraftCreated ? 'yes' : 'no');
  printLine(
    'availableProductEntities',
    productRegistrySummary?.totalProductEntities ?? 'unknown',
  );
  printLine(
    'availableOrderDrafts',
    orderDraftRegistrySummary?.totalOrderDrafts ?? 'unknown',
  );

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
