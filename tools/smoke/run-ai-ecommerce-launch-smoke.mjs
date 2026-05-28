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

function findToolAccess(toolAccess, toolKey) {
  return toolAccess.find((entry) => entry.tool?.key === toolKey) ?? null;
}

function findContextBlock(contextBlocks, key) {
  return contextBlocks.find((entry) => entry.key === key) ?? null;
}

function findAgentBreakdownEntry(entries, agentKey) {
  return entries.find((entry) => entry.agentKey === agentKey) ?? null;
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

async function main() {
  loadDotEnv();

  const baseUrl = normalizeBaseUrl(
    getArg('base-url', 'http://127.0.0.1:3000/api'),
  );
  const tenantSlug = getArg('tenant-slug', 'saas-platform-local');
  const agentKey = getArg('agent-key', 'ecommerce-launch-assistant');
  const bootstrapPlanKey = getArg('bootstrap-plan-key', '');
  const shouldBootstrapIfDisabled =
    hasFlag('bootstrap-if-disabled') || bootstrapPlanKey.length > 0;
  const token = resolveToken();
  const runId = `${Date.now()}`;
  let originalPlanKey = null;
  let originalSubscriptionStatus = 'active';
  let planBootstrapped = false;

  try {
    let ecommerceWorkspace = await apiRequest({
      baseUrl,
      path: `/ai/tenants/${encodeURIComponent(
        tenantSlug,
      )}/ecommerce-launch-workspace`,
      token,
      method: 'GET',
    });

    if (!ecommerceWorkspace?.moduleSnapshot?.productEnabled) {
      if (!shouldBootstrapIfDisabled) {
        throw new Error(
          `Ecommerce launch workspace for tenant ${tenantSlug} is not product-enabled. Re-run with --bootstrap-if-disabled --bootstrap-plan-key enterprise to validate the real lane.`,
        );
      }

      const currentSubscription = await apiRequest({
        baseUrl,
        path: `/tenancy/tenants/${encodeURIComponent(tenantSlug)}/subscription`,
        token,
        method: 'GET',
      });

      originalPlanKey = inferPlanKeyFromSubscriptionId(
        currentSubscription?.planId ?? null,
      );
      originalSubscriptionStatus = currentSubscription?.status ?? 'active';

      if (!bootstrapPlanKey) {
        throw new Error(
          'bootstrap-if-disabled requires --bootstrap-plan-key so the smoke knows which plan enables ecommerce.',
        );
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

      planBootstrapped = true;

      ecommerceWorkspace = await apiRequest({
        baseUrl,
        path: `/ai/tenants/${encodeURIComponent(
          tenantSlug,
        )}/ecommerce-launch-workspace`,
        token,
        method: 'GET',
      });
    }

    if (!ecommerceWorkspace?.moduleSnapshot?.productEnabled) {
      throw new Error(
        `Ecommerce launch workspace for tenant ${tenantSlug} is still not product-enabled after bootstrap.`,
      );
    }

    if (
      typeof ecommerceWorkspace.moduleSnapshot.activeModuleCount !== 'number' ||
      ecommerceWorkspace.moduleSnapshot.activeModuleCount <= 0
    ) {
      throw new Error(
        `Ecommerce launch workspace for tenant ${tenantSlug} has no active modules.`,
      );
    }

    if (!Array.isArray(ecommerceWorkspace.channelGuidance)) {
      throw new Error('Ecommerce launch workspace is missing channel guidance.');
    }

    const campaignGuidance =
      ecommerceWorkspace.channelGuidance.find((entry) => entry.key === 'campaign') ??
      null;

    if (!campaignGuidance) {
      throw new Error('Ecommerce launch workspace is missing campaign guidance.');
    }

    const launchPlan =
      ecommerceWorkspace.launchPlans?.find(
        (entry) => entry.guardedExecutionReadiness === 'shadow_review_ready',
      ) ?? null;

    if (!launchPlan) {
      throw new Error(
        'Ecommerce launch workspace is missing a shadow-review-ready launch plan.',
      );
    }

    const suggestionEnvelope = await apiRequest({
      baseUrl,
      path: `/ai/tenants/${encodeURIComponent(
        tenantSlug,
      )}/agents/${encodeURIComponent(agentKey)}/suggestion-envelope`,
      token,
      method: 'GET',
    });

    if (suggestionEnvelope.agent?.key !== agentKey) {
      throw new Error(
        `Suggestion envelope agentKey=${suggestionEnvelope.agent?.key}, expected ${agentKey}.`,
      );
    }

  if (suggestionEnvelope.mode !== 'suggestion') {
    throw new Error(
      `Suggestion envelope mode=${suggestionEnvelope.mode}, expected suggestion.`,
    );
  }

  if (suggestionEnvelope.surface?.key !== 'ecommerce_launch_workspace') {
    throw new Error(
      `Suggestion envelope surfaceKey=${suggestionEnvelope.surface?.key}, expected ecommerce_launch_workspace.`,
    );
  }

  if (suggestionEnvelope.promptPack?.key !== 'ecommerce-launch-assistant-core') {
    throw new Error(
      `Suggestion envelope promptPackKey=${suggestionEnvelope.promptPack?.key}, expected ecommerce-launch-assistant-core.`,
    );
  }

  if (suggestionEnvelope.promptPack?.version !== 'v1') {
    throw new Error(
      `Suggestion envelope promptPackVersion=${suggestionEnvelope.promptPack?.version}, expected v1.`,
    );
  }

  const launchToolAccess = findToolAccess(
    suggestionEnvelope.toolAccess ?? [],
    'ecommerce_launch_briefing',
  );

  if (!launchToolAccess) {
    throw new Error(
      'Suggestion envelope is missing ecommerce_launch_briefing tool access.',
    );
  }

  if (launchToolAccess.accessLevel !== 'approval_required') {
    throw new Error(
      `Tool access level=${launchToolAccess.accessLevel}, expected approval_required.`,
    );
  }

  if (
    launchToolAccess.tool?.executionBoundary?.executionMode !== 'suggestion_only'
  ) {
    throw new Error(
      `Tool executionMode=${launchToolAccess.tool?.executionBoundary?.executionMode}, expected suggestion_only.`,
    );
  }

    const launchSummaryBlock = findContextBlock(
      suggestionEnvelope.contextBlocks ?? [],
      'launch_summary',
    );
    const safetyBoundariesBlock = findContextBlock(
      suggestionEnvelope.contextBlocks ?? [],
      'safety_boundaries',
    );

    if (!launchSummaryBlock || !safetyBoundariesBlock) {
      throw new Error(
        'Suggestion envelope is missing launch_summary or safety_boundaries context blocks.',
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

  if (suggestionRun.agentKey !== agentKey) {
    throw new Error(
      `Prepared suggestion run agentKey=${suggestionRun.agentKey}, expected ${agentKey}.`,
    );
  }

  if (suggestionRun.status !== 'prepared') {
    throw new Error(
      `Prepared suggestion run status=${suggestionRun.status}, expected prepared.`,
    );
  }

  if (
    !Array.isArray(suggestionRun.suggestedOutputKeys) ||
    !suggestionRun.suggestedOutputKeys.includes('launch_brief')
  ) {
    throw new Error(
      'Prepared suggestion run is missing suggested output key launch_brief.',
    );
  }

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

  if (persistedRunDetail.envelope?.surface?.key !== 'ecommerce_launch_workspace') {
    throw new Error(
      `Persisted suggestion run surfaceKey=${persistedRunDetail.envelope?.surface?.key}, expected ecommerce_launch_workspace.`,
    );
  }

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
        rationale: `Smoke approval request for ecommerce launch suggestion run ${runId}.`,
      },
    });

  if (approvalRequest.agentKey !== agentKey || approvalRequest.status !== 'pending') {
    throw new Error(
      `Approval request state agentKey=${approvalRequest.agentKey} status=${approvalRequest.status}, expected ecommerce pending request.`,
    );
  }

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
        reviewNote: `Smoke approval review for ecommerce launch suggestion run ${runId}.`,
      },
    });

  if (reviewedApprovalRequest.status !== 'approved') {
    throw new Error(
      `Reviewed approval request ${reviewedApprovalRequest.id} status=${reviewedApprovalRequest.status}, expected approved.`,
    );
  }

    const handoffWorkspace = await apiRequest({
      baseUrl,
      path: `/ai/tenants/${encodeURIComponent(tenantSlug)}/handoff-workspace`,
      token,
      method: 'GET',
    });

  const ecommerceHandoff = findAgentBreakdownEntry(
    handoffWorkspace.agentBreakdown ?? [],
    agentKey,
  );

  if (!ecommerceHandoff) {
    throw new Error(
      `Handoff workspace is missing agent breakdown for ${agentKey}.`,
    );
  }

  if (ecommerceHandoff.totalSuggestionRuns < 1) {
    throw new Error(
      `Handoff workspace totalSuggestionRuns=${ecommerceHandoff.totalSuggestionRuns}, expected at least 1 for ${agentKey}.`,
    );
  }

    const approvalWorkspace = await apiRequest({
      baseUrl,
      path: `/ai/tenants/${encodeURIComponent(tenantSlug)}/approval-workspace`,
      token,
      method: 'GET',
    });

  const ecommerceApproval = findAgentBreakdownEntry(
    approvalWorkspace.agentBreakdown ?? [],
    agentKey,
  );

  if (!ecommerceApproval) {
    throw new Error(
      `Approval workspace is missing agent breakdown for ${agentKey}.`,
    );
  }

  if (ecommerceApproval.approvedApprovalRequests < 1) {
    throw new Error(
      `Approval workspace approvedApprovalRequests=${ecommerceApproval.approvedApprovalRequests}, expected at least 1 for ${agentKey}.`,
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
        launchPlanId: launchPlan.id,
      },
    });

    if (execution.targetKind !== 'ecommerce_launch_plan') {
      throw new Error(
        `Guarded execution targetKind=${execution.targetKind}, expected ecommerce_launch_plan.`,
      );
    }

    if (execution.toolKey !== 'ecommerce_launch_publish_execution') {
      throw new Error(
        `Guarded execution toolKey=${execution.toolKey}, expected ecommerce_launch_publish_execution.`,
      );
    }

    if (execution.launchPlan?.id !== launchPlan.id) {
      throw new Error(
        `Guarded execution launchPlanId=${execution.launchPlan?.id}, expected ${launchPlan.id}.`,
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
        launchPlanId: launchPlan.id,
      },
    });

    if (rollback.targetKind !== 'ecommerce_launch_plan') {
      throw new Error(
        `Guarded rollback targetKind=${rollback.targetKind}, expected ecommerce_launch_plan.`,
      );
    }

    if (rollback.safeFallbackMode !== 'suggestion_only') {
      throw new Error(
        `Guarded rollback returned safeFallbackMode=${rollback.safeFallbackMode}, expected suggestion_only.`,
      );
    }

    if (rollback.launchPlan?.id !== launchPlan.id) {
      throw new Error(
        `Guarded rollback launchPlanId=${rollback.launchPlan?.id}, expected ${launchPlan.id}.`,
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

    if (executedEntry.candidateToolKey !== 'ecommerce_launch_publish_execution') {
      throw new Error(
        `Executed event candidateToolKey=${executedEntry.candidateToolKey}, expected ecommerce_launch_publish_execution.`,
      );
    }

    if (
      rolledBackEntry.candidateToolKey !== 'ecommerce_launch_publish_execution'
    ) {
      throw new Error(
        `Rolled back event candidateToolKey=${rolledBackEntry.candidateToolKey}, expected ecommerce_launch_publish_execution.`,
      );
    }

    printSection('AI Ecommerce Launch Smoke');
    printLine('tenantSlug', tenantSlug);
    printLine('agentKey', agentKey);
    printLine('suggestionRunId', suggestionRun.id);
    printLine('approvalRequestId', approvalRequest.id);
    printLine('launchPlanId', launchPlan.id);

    printSection('Workspace');
    printLine('launchReadiness', ecommerceWorkspace.summary?.launchReadiness);
    printLine(
      'activeModuleCount',
      ecommerceWorkspace.moduleSnapshot?.activeModuleCount,
    );
    printLine('campaignGuidanceStatus', campaignGuidance.status);
    printLine('planBootstrapped', planBootstrapped ? 'yes' : 'no');

    printSection('Suggestion Envelope');
    printLine(
      'promptPack',
      `${suggestionEnvelope.promptPack?.key}@${suggestionEnvelope.promptPack?.version}`,
    );
    printLine('toolAccessLevel', launchToolAccess.accessLevel);
    printLine(
      'suggestedOutputs',
      (suggestionEnvelope.promptPack?.suggestedOutputs ?? [])
        .map((entry) => entry.key)
        .join(', '),
    );

    printSection('Prepared Handoff');
    printLine('suggestionRunStatus', suggestionRun.status);
    printLine(
      'suggestedOutputKeys',
      (suggestionRun.suggestedOutputKeys ?? []).join(', '),
    );
    printLine('persistedSurfaceKey', persistedRunDetail.envelope?.surface?.key);

    printSection('Human Gate');
    printLine('approvalRequestStatus', approvalRequest.status);
    printLine('reviewedApprovalStatus', reviewedApprovalRequest.status);
    printLine('handoffTotalSuggestionRuns', ecommerceHandoff.totalSuggestionRuns);
    printLine(
      'approvalApprovedRequests',
      ecommerceApproval.approvedApprovalRequests,
    );

    printSection('Publish Pilot');
    printLine('executedAt', execution.executedAt);
    printLine('launchPlanTitle', execution.launchPlan?.title);
    printLine('rolledBackAt', rollback.rolledBackAt);
    printLine('safeFallbackMode', rollback.safeFallbackMode);
    printLine('executedEventId', executedEntry.id);
    printLine('rolledBackEventId', rolledBackEntry.id);

    printSection('Result');
    printLine('status', 'ok');
  } finally {
    if (planBootstrapped && originalPlanKey && originalPlanKey !== bootstrapPlanKey) {
      await apiRequest({
        baseUrl,
        path: `/tenancy/tenants/${encodeURIComponent(tenantSlug)}/subscription`,
        token,
        method: 'PUT',
        body: {
          planKey: originalPlanKey,
          status: originalSubscriptionStatus,
        },
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
