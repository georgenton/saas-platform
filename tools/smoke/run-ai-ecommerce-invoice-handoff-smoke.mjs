import {
  apiRequest,
  getArg,
  hasFlag,
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

function requireProductEntity(result, productEntityId, label) {
  if (result?.productEntity?.productEntityId !== productEntityId) {
    throw new Error(
      `${label} productEntityId=${result?.productEntity?.productEntityId}, expected ${productEntityId}.`,
    );
  }
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
    return (
      orderDrafts.find((entry) => entry.id === requestedOrderDraftId) ?? null
    );
  }

  return (
    orderDrafts.find((entry) => entry.status !== 'blocked') ??
    orderDrafts[0] ??
    null
  );
}

function pickAuthoringDraft(workspace, requestedDraftId) {
  const drafts = requireArray(workspace?.drafts, 'authoring drafts');

  if (requestedDraftId) {
    return drafts.find((entry) => entry.id === requestedDraftId) ?? null;
  }

  return (
    drafts.find((entry) => entry.status !== 'blocked') ?? drafts[0] ?? null
  );
}

function unique(values) {
  return Array.from(new Set(values.filter(Boolean)));
}

function formatList(values) {
  return values.length > 0 ? values.join(' | ') : 'none';
}

function inferPlanKeyFromSubscriptionId(planId) {
  if (typeof planId !== 'string' || planId.length === 0) {
    return null;
  }

  if (planId.includes('starter')) {
    return 'starter';
  }

  if (planId.includes('growth')) {
    return 'growth';
  }

  if (planId.includes('enterprise')) {
    return 'enterprise';
  }

  return null;
}

function assertNoMissingWhenReady(status, readyStatuses, missingFields, label) {
  if (readyStatuses.includes(status) && missingFields.length > 0) {
    throw new Error(
      `${label} is ${status} but still has missing fiscal fields: ${missingFields.join(
        ', ',
      )}.`,
    );
  }
}

async function bootstrapProductEntity({
  baseUrl,
  tenantSlug,
  requestedAuthoringDraftId,
  token,
}) {
  const authoringWorkspace = await apiRequest({
    baseUrl,
    path: `/ecommerce/tenants/${encodeURIComponent(
      tenantSlug,
    )}/product-authoring-workspace`,
    token,
    method: 'GET',
  });

  const authoringDraft = pickAuthoringDraft(
    authoringWorkspace,
    requestedAuthoringDraftId,
  );

  if (!authoringDraft || authoringDraft.status === 'blocked') {
    throw new Error(
      `No bootstrap-ready ecommerce authoring draft was found for tenant ${tenantSlug}. Provide --bootstrap-plan-key enterprise for a temporary ecommerce plan bootstrap, or provide an unblocked --bootstrap-draft-id.`,
    );
  }

  const saveResponse = await apiRequest({
    baseUrl,
    path: `/ecommerce/tenants/${encodeURIComponent(
      tenantSlug,
    )}/product-authoring-drafts/${encodeURIComponent(authoringDraft.id)}/save`,
    token,
    method: 'POST',
  });
  const savedDraft = saveResponse.savedDraft ?? null;

  if (!savedDraft?.id) {
    throw new Error(
      'Bootstrap saved draft response did not include savedDraft.id.',
    );
  }

  const workspaceResponse = await apiRequest({
    baseUrl,
    path: `/ecommerce/tenants/${encodeURIComponent(
      tenantSlug,
    )}/saved-product-drafts/${encodeURIComponent(
      savedDraft.id,
    )}/promote-to-product-workspace`,
    token,
    method: 'POST',
  });
  const workspace = workspaceResponse.workspace ?? null;

  if (!workspace?.savedDraftId) {
    throw new Error(
      'Bootstrap product workspace response did not include workspace.savedDraftId.',
    );
  }

  const productSetupResponse = await apiRequest({
    baseUrl,
    path: `/ecommerce/tenants/${encodeURIComponent(
      tenantSlug,
    )}/product-workspaces/${encodeURIComponent(
      workspace.savedDraftId,
    )}/promote-to-product-setup`,
    token,
    method: 'POST',
  });
  const productSetup = productSetupResponse.productSetup ?? null;

  if (!productSetup?.productSetupId) {
    throw new Error(
      'Bootstrap product setup response did not include productSetup.productSetupId.',
    );
  }

  const productEntityResponse = await apiRequest({
    baseUrl,
    path: `/ecommerce/tenants/${encodeURIComponent(
      tenantSlug,
    )}/product-setups/${encodeURIComponent(
      productSetup.productSetupId,
    )}/promote-to-product-entity`,
    token,
    method: 'POST',
  });
  const productEntity = productEntityResponse.productEntity ?? null;

  if (!productEntity?.productEntityId) {
    throw new Error(
      'Bootstrap product entity response did not include productEntity.productEntityId.',
    );
  }

  return {
    authoringDraft,
    savedDraft,
    workspace,
    productSetup,
    productEntity,
  };
}

async function bootstrapStorefrontChannels({
  baseUrl,
  productEntityId,
  tenantSlug,
  token,
}) {
  const channelKeys = ['landing', 'catalog', 'whatsapp'];
  const bootstrapped = [];

  for (const channelKey of channelKeys) {
    await apiRequest({
      baseUrl,
      path: `/ecommerce/tenants/${encodeURIComponent(
        tenantSlug,
      )}/product-entities/${encodeURIComponent(
        productEntityId,
      )}/channel-drafts/${encodeURIComponent(channelKey)}/save`,
      token,
      method: 'POST',
    });

    await apiRequest({
      baseUrl,
      path: `/ecommerce/tenants/${encodeURIComponent(
        tenantSlug,
      )}/product-entities/${encodeURIComponent(
        productEntityId,
      )}/saved-channel-drafts/${encodeURIComponent(
        channelKey,
      )}/promote-to-channel-asset-workspace`,
      token,
      method: 'POST',
    });

    await apiRequest({
      baseUrl,
      path: `/ecommerce/tenants/${encodeURIComponent(
        tenantSlug,
      )}/product-entities/${encodeURIComponent(
        productEntityId,
      )}/channel-asset-workspaces/${encodeURIComponent(
        channelKey,
      )}/promote-to-channel-asset-entity`,
      token,
      method: 'POST',
    });

    await apiRequest({
      baseUrl,
      path: `/ecommerce/tenants/${encodeURIComponent(
        tenantSlug,
      )}/product-entities/${encodeURIComponent(
        productEntityId,
      )}/channel-asset-entities/${encodeURIComponent(
        channelKey,
      )}/promote-to-release-candidate`,
      token,
      method: 'POST',
    });

    bootstrapped.push(channelKey);
  }

  return bootstrapped;
}

async function enableBootstrapPlanIfRequested({
  baseUrl,
  bootstrapPlanKey,
  tenantSlug,
  token,
}) {
  if (!bootstrapPlanKey) {
    return {
      bootstrapped: false,
      originalPlanKey: null,
      originalSubscriptionStatus: null,
    };
  }

  const currentSubscription = await apiRequest({
    baseUrl,
    path: `/tenancy/tenants/${encodeURIComponent(tenantSlug)}/subscription`,
    token,
    method: 'GET',
  });
  const originalPlanKey = inferPlanKeyFromSubscriptionId(
    currentSubscription?.planId ?? null,
  );
  const originalSubscriptionStatus = currentSubscription?.status ?? 'active';

  if (originalPlanKey === bootstrapPlanKey) {
    return {
      bootstrapped: false,
      originalPlanKey,
      originalSubscriptionStatus,
    };
  }

  await apiRequest({
    baseUrl,
    path: `/tenancy/tenants/${encodeURIComponent(tenantSlug)}/subscription`,
    token,
    method: 'PUT',
    body: {
      planKey: bootstrapPlanKey,
      status: originalSubscriptionStatus,
    },
  });

  return {
    bootstrapped: true,
    originalPlanKey,
    originalSubscriptionStatus,
  };
}

async function restoreBootstrapPlan({
  baseUrl,
  originalPlanKey,
  originalSubscriptionStatus,
  tenantSlug,
  token,
}) {
  if (!originalPlanKey) {
    return;
  }

  await apiRequest({
    baseUrl,
    path: `/tenancy/tenants/${encodeURIComponent(tenantSlug)}/subscription`,
    token,
    method: 'PUT',
    body: {
      planKey: originalPlanKey,
      status: originalSubscriptionStatus ?? 'active',
    },
  });
}

async function resolveSmokeTargets({
  baseUrl,
  bootstrapProductEntityIfMissing,
  requestedAuthoringDraftId,
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
  let resolvedProductEntity = productEntity;
  let productEntityCreated = false;
  let productEntityBootstrap = null;

  if (
    !resolvedProductEntity &&
    bootstrapProductEntityIfMissing &&
    !requestedProductEntityId
  ) {
    productEntityBootstrap = await bootstrapProductEntity({
      baseUrl,
      tenantSlug,
      requestedAuthoringDraftId,
      token,
    });
    resolvedProductEntity = productEntityBootstrap.productEntity;
    productEntityCreated = true;
  }

  if (!resolvedProductEntity) {
    throw new Error(
      `No ecommerce product entity was found for tenant ${tenantSlug}. Run without --no-bootstrap-product-entity to let the smoke create one, or create/promote a product entity first.`,
    );
  }

  const productEntityId = resolvedProductEntity.productEntityId;
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
  let storefrontChannelsBootstrapped = [];

  if (!orderDraft && !requestedOrderDraftId) {
    storefrontChannelsBootstrapped = await bootstrapStorefrontChannels({
      baseUrl,
      productEntityId,
      tenantSlug,
      token,
    });

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
    productEntity: resolvedProductEntity,
    productEntityCreated,
    productEntityBootstrap,
    storefrontChannelsBootstrapped,
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
  const requestedAuthoringDraftId = getArg('bootstrap-draft-id', '');
  const bootstrapPlanKey = getArg('bootstrap-plan-key', '');
  const bootstrapProductEntityIfMissing = !hasFlag(
    'no-bootstrap-product-entity',
  );
  const token = resolveToken();
  const subscriptionBootstrap = await enableBootstrapPlanIfRequested({
    baseUrl,
    bootstrapPlanKey,
    tenantSlug,
    token,
  });

  try {
    const {
      orderDraft,
      orderDraftCreated,
      productEntity,
      productEntityBootstrap,
      productEntityCreated,
      storefrontChannelsBootstrapped,
      productRegistrySummary,
      orderDraftRegistrySummary,
    } = await resolveSmokeTargets({
      baseUrl,
      bootstrapProductEntityIfMissing,
      requestedAuthoringDraftId,
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

    const orderInvoicingBridge = await apiRequest({
      baseUrl,
      path: `${basePath}/request-order-invoicing-bridge`,
      token,
      method: 'POST',
    });
    requireProductEntity(
      orderInvoicingBridge,
      productEntityId,
      'Invoicing bridge',
    );
    requireArray(orderInvoicingBridge.fiscalRequirements, 'fiscalRequirements');

    const readinessPacket = await apiRequest({
      baseUrl,
      path: `${basePath}/request-order-to-invoice-readiness-packet`,
      token,
      method: 'POST',
    });
    requireProductEntity(readinessPacket, productEntityId, 'Readiness packet');
    requireArray(
      readinessPacket.fiscalRequirements,
      'readiness fiscalRequirements',
    );
    requireArray(readinessPacket.missingFields, 'readiness missingFields');
    requireArray(
      readinessPacket.handoffArtifacts,
      'readiness handoffArtifacts',
    );
    requireArray(
      readinessPacket.operatorChecklist,
      'readiness operatorChecklist',
    );

    const invoiceDraftBridge = await apiRequest({
      baseUrl,
      path: `${orderBasePath}/request-invoice-draft-bridge`,
      token,
      method: 'POST',
    });
    requireOrderDraft(invoiceDraftBridge, orderDraftId, 'Invoice draft bridge');
    requireArray(invoiceDraftBridge.requiredFields, 'draft requiredFields');
    requireArray(invoiceDraftBridge.missingFields, 'draft missingFields');
    requireArray(invoiceDraftBridge.handoffArtifacts, 'draft handoffArtifacts');
    requireArray(
      invoiceDraftBridge.operatorChecklist,
      'draft operatorChecklist',
    );

    const fiscalCompletionWorkspace = await apiRequest({
      baseUrl,
      path: `${orderBasePath}/fiscal-data-completion-workspace`,
      token,
      method: 'GET',
    });
    requireOrderDraft(
      fiscalCompletionWorkspace,
      orderDraftId,
      'Fiscal completion',
    );
    requireArray(
      fiscalCompletionWorkspace.requiredFields,
      'fiscal requiredFields',
    );
    requireArray(
      fiscalCompletionWorkspace.missingFields,
      'fiscal missingFields',
    );
    requireArray(fiscalCompletionWorkspace.completionHints, 'completionHints');

    const invoiceDraftIntakeWorkspace = await apiRequest({
      baseUrl,
      path: `${orderBasePath}/invoice-draft-intake-workspace`,
      token,
      method: 'GET',
    });
    requireOrderDraft(
      invoiceDraftIntakeWorkspace,
      orderDraftId,
      'Invoice draft intake',
    );
    requireArray(
      invoiceDraftIntakeWorkspace.fiscalSnapshot?.missingFields,
      'intake missingFields',
    );
    requireArray(
      invoiceDraftIntakeWorkspace.operatorChecklist,
      'intake operatorChecklist',
    );

    const invoiceDraftOpenBridge = await apiRequest({
      baseUrl,
      path: `${orderBasePath}/request-invoice-draft-open-bridge`,
      token,
      method: 'POST',
    });
    requireOrderDraft(
      invoiceDraftOpenBridge,
      orderDraftId,
      'Invoice open bridge',
    );
    requireArray(
      invoiceDraftOpenBridge.fiscalSnapshot?.missingFields,
      'open bridge missingFields',
    );
    requireArray(
      invoiceDraftOpenBridge.operatorChecklist,
      'open bridge operatorChecklist',
    );

    const invoiceDraftLaunchBridge = await apiRequest({
      baseUrl,
      path: `${orderBasePath}/request-invoice-draft-launch-bridge`,
      token,
      method: 'POST',
    });
    requireOrderDraft(
      invoiceDraftLaunchBridge,
      orderDraftId,
      'Invoice launch bridge',
    );
    requireArray(invoiceDraftLaunchBridge.fiscalArtifacts, 'fiscalArtifacts');
    requireArray(
      invoiceDraftLaunchBridge.commercialArtifacts,
      'commercialArtifacts',
    );
    requireArray(
      invoiceDraftLaunchBridge.operatorChecklist,
      'launch operatorChecklist',
    );

    const invoiceDraftHandoffWorkspace = await apiRequest({
      baseUrl,
      path: `${orderBasePath}/invoice-draft-handoff-workspace`,
      token,
      method: 'GET',
    });
    requireOrderDraft(
      invoiceDraftHandoffWorkspace,
      orderDraftId,
      'Invoice handoff',
    );
    requireArray(
      invoiceDraftHandoffWorkspace.handoffArtifacts,
      'handoffArtifacts',
    );
    requireArray(
      invoiceDraftHandoffWorkspace.operatorChecklist,
      'handoff operatorChecklist',
    );

    const handoffAcknowledgement = await apiRequest({
      baseUrl,
      path: `${orderBasePath}/request-invoice-handoff-acknowledgement`,
      token,
      method: 'POST',
    });
    requireOrderDraft(
      handoffAcknowledgement,
      orderDraftId,
      'Invoice handoff acknowledgement',
    );
    requireArray(handoffAcknowledgement.receivedArtifacts, 'receivedArtifacts');
    requireArray(handoffAcknowledgement.missingSignals, 'missingSignals');

    const missingFiscalFields = unique([
      ...readinessPacket.missingFields,
      ...invoiceDraftBridge.missingFields,
      ...fiscalCompletionWorkspace.missingFields,
      ...invoiceDraftIntakeWorkspace.fiscalSnapshot.missingFields,
      ...invoiceDraftOpenBridge.fiscalSnapshot.missingFields,
    ]);

    assertNoMissingWhenReady(
      readinessPacket.readinessStatus,
      ['ready_to_invoice'],
      readinessPacket.missingFields,
      'Readiness packet',
    );
    assertNoMissingWhenReady(
      invoiceDraftBridge.bridgeStatus,
      ['ready_to_open_invoice_draft'],
      invoiceDraftBridge.missingFields,
      'Invoice draft bridge',
    );
    assertNoMissingWhenReady(
      invoiceDraftOpenBridge.bridgeStatus,
      ['ready_to_open'],
      invoiceDraftOpenBridge.fiscalSnapshot.missingFields,
      'Invoice draft open bridge',
    );
    assertNoMissingWhenReady(
      invoiceDraftLaunchBridge.launchStatus,
      ['ready_to_launch'],
      missingFiscalFields,
      'Invoice draft launch bridge',
    );
    assertNoMissingWhenReady(
      invoiceDraftHandoffWorkspace.workspaceStatus,
      ['ready_for_invoice_handoff'],
      missingFiscalFields,
      'Invoice draft handoff workspace',
    );
    assertNoMissingWhenReady(
      handoffAcknowledgement.acknowledgementStatus,
      ['accepted'],
      unique([
        ...missingFiscalFields,
        ...handoffAcknowledgement.missingSignals,
      ]),
      'Invoice handoff acknowledgement',
    );

    printSection('AI Ecommerce Invoice Handoff Smoke');
    printLine('tenantSlug', tenantSlug);
    printLine('productEntityId', productEntityId);
    printLine('productTitle', productEntity.title);
    printLine('productEntityCreated', productEntityCreated ? 'yes' : 'no');
    printLine(
      'subscriptionPlanBootstrapped',
      subscriptionBootstrap.bootstrapped ? 'yes' : 'no',
    );
    if (productEntityBootstrap) {
      printLine('bootstrapDraftId', productEntityBootstrap.authoringDraft.id);
      printLine('bootstrapSavedDraftId', productEntityBootstrap.savedDraft.id);
      printLine(
        'bootstrapProductSetupId',
        productEntityBootstrap.productSetup.productSetupId,
      );
    }
    printLine(
      'storefrontChannelsBootstrapped',
      formatList(storefrontChannelsBootstrapped),
    );
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

    printSection('Readiness');
    printLine('bridgeStatus', orderInvoicingBridge.bridgeStatus);
    printLine('readinessStatus', readinessPacket.readinessStatus);
    printLine('captureStatus', readinessPacket.readinessSnapshot.captureStatus);
    printLine(
      'buyerProfileStatus',
      readinessPacket.readinessSnapshot.buyerProfileStatus,
    );
    printLine('missingFiscalFields', formatList(missingFiscalFields));

    printSection('Invoice Draft');
    printLine('draftBridgeStatus', invoiceDraftBridge.bridgeStatus);
    printLine('intakeStatus', invoiceDraftIntakeWorkspace.workspaceStatus);
    printLine('openBridgeStatus', invoiceDraftOpenBridge.bridgeStatus);
    printLine('launchStatus', invoiceDraftLaunchBridge.launchStatus);

    printSection('Handoff');
    printLine('handoffStatus', invoiceDraftHandoffWorkspace.workspaceStatus);
    printLine(
      'routeConfirmed',
      invoiceDraftHandoffWorkspace.routeSnapshot.routeConfirmed,
    );
    printLine(
      'acknowledgementStatus',
      handoffAcknowledgement.acknowledgementStatus,
    );
    printLine(
      'receivedArtifacts',
      formatList(handoffAcknowledgement.receivedArtifacts),
    );
    printLine(
      'missingSignals',
      formatList(handoffAcknowledgement.missingSignals),
    );
    printLine('nextStep', handoffAcknowledgement.nextStep);

    printSection('Result');
    printLine('status', 'ok');
  } finally {
    if (subscriptionBootstrap.bootstrapped) {
      await restoreBootstrapPlan({
        baseUrl,
        originalPlanKey: subscriptionBootstrap.originalPlanKey,
        originalSubscriptionStatus:
          subscriptionBootstrap.originalSubscriptionStatus,
        tenantSlug,
        token,
      });
    }
  }
}

main().catch((error) => {
  process.stderr.write(
    `${error instanceof Error ? error.message : String(error)}\n`,
  );
  process.exit(1);
});
