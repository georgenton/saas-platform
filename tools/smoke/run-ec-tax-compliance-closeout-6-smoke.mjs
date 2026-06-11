import {
  apiRequest,
  getArg,
  loadDotEnv,
  normalizeBaseUrl,
  printLine,
  printSection,
  resolveToken,
} from './ec-sandbox-smoke-lib.mjs';

loadDotEnv();

const baseUrl = normalizeBaseUrl(
  getArg('api-url', process.env.SMOKE_API_URL || 'http://127.0.0.1:3000/api'),
);
const tenantSlug = getArg(
  'tenant-slug',
  process.env.SMOKE_TENANT_SLUG || 'saas-platform-local',
);
const period = getArg('period', process.env.SMOKE_TAX_PERIOD || '2026-06');
const year = Number.parseInt(
  getArg('year', process.env.SMOKE_TAX_YEAR || '2026'),
  10,
);
const token = resolveToken();

if (Number.isNaN(year)) {
  throw new Error('--year debe ser numerico.');
}

function taxPath(path) {
  return `/tax-compliance/tenants/${encodeURIComponent(tenantSlug)}/ec${path}`;
}

function periodQuery() {
  return `period=${encodeURIComponent(period)}&year=${encodeURIComponent(
    String(year),
  )}`;
}

function assertValue(label, value) {
  if (!value) {
    throw new Error(`${label} no devolvio un valor esperado.`);
  }
}

function assertNonEmpty(label, value) {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error(`${label} no devolvio items.`);
  }
}

printSection('EC tax compliance closeout 6 smoke');
printLine('api', baseUrl);
printLine('tenant', tenantSlug);
printLine('period', period);
printLine('year', year);

const enabledProducts = await apiRequest({
  baseUrl,
  path: `/tenancy/tenants/${encodeURIComponent(tenantSlug)}/products`,
  token,
});
const taxComplianceEnabled = enabledProducts.some(
  (product) => product.key === 'tax-compliance-ec',
);

if (!taxComplianceEnabled) {
  throw new Error(
    `Tenant ${tenantSlug} no tiene tax-compliance-ec habilitado.`,
  );
}

const [
  sriSourceImportCenter,
  vatDeclarationWorkspace,
  incomeTaxEvidenceWorkspace,
  filingAssistant,
  accountantEscalationBoundary,
  accountingBoundaryAiReview,
  declarationHandoffCloseout,
  sriImportLedgerV62,
  sriExceptionQueueV62,
  formBoxBinderV2,
  accountantPacketV62,
  operatorActionCenterV62,
  operationalHardeningCloseoutV62,
  pilotReadinessRoomV70,
  accountantFeedbackQueueV70,
  evidenceCorrectionWorkbenchV70,
  pilotDecisionPacketV70,
  pilotFeedbackCloseoutV70,
  pilotCohortRegistryV71,
  pilotAnalyticsDashboardV71,
  accountantSlaTrackerV71,
  pilotLearningBacklogV71,
  accountingAdvancedEvidenceGateV71,
  pilotOperationsCloseoutV71,
  pilotEvidenceLedgerV72,
  pilotMultiTenantCohortV72,
  pilotRepeatedSignalDetectorV72,
  accountantWorkbenchV72,
  aiPilotAssistantPacketV72,
  pilotCloseoutV72,
  pilotPeriodMemoryV73,
  accountingDiscoveryDossierV73,
  accountantDecisionRecordV73,
  cohortExpansionReadinessV73,
  aiPilotDecisionExplainerV73,
  pilotDecisionCloseoutV73,
] = await Promise.all([
  apiRequest({
    baseUrl,
    path: taxPath(`/sri-source-import-center-v2?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: taxPath(`/vat-declaration-workspace-v2?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: taxPath(`/income-tax-evidence-workspace-v2?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: taxPath(`/filing-assistant-v2?${periodQuery()}&formKey=iva`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: taxPath(`/accountant-escalation-service-boundary?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: taxPath(`/accounting-boundary-ai-review?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: taxPath(`/declaration-handoff-closeout-v6?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: taxPath(
      `/sri-evidence-import-persistence-ledger-v62?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: taxPath(`/sri-reconciliation-exception-queue-v62?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: taxPath(`/form-box-evidence-binder-v2?${periodQuery()}&formKey=iva`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: taxPath(`/accountant-packet-export-v62?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: taxPath(`/operator-action-center-v62?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: taxPath(`/operational-hardening-closeout-v62?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: taxPath(`/pilot-tenant-readiness-room-v70?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: taxPath(`/accountant-feedback-intake-queue-v70?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: taxPath(`/evidence-correction-workbench-v70?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: taxPath(`/pilot-closeout-decision-packet-v70?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: taxPath(`/pilot-feedback-closeout-v70?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: taxPath(`/pilot-cohort-registry-v71?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: taxPath(`/pilot-feedback-analytics-dashboard-v71?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: taxPath(`/accountant-collaboration-sla-tracker-v71?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: taxPath(`/pilot-learning-backlog-v71?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: taxPath(`/accounting-advanced-evidence-gate-v71?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: taxPath(`/pilot-operations-closeout-v71?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: taxPath(`/pilot-evidence-persistence-ledger-v72?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: taxPath(`/pilot-multi-tenant-cohort-v72?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: taxPath(`/pilot-repeated-signal-detector-v72?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: taxPath(`/accountant-collaboration-workbench-v72?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: taxPath(`/ai-pilot-assistant-packet-v72?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: taxPath(`/pilot-closeout-v72?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: taxPath(`/pilot-period-over-period-memory-v73?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: taxPath(`/accounting-advanced-discovery-dossier-v73?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: taxPath(`/accountant-decision-record-v73?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: taxPath(`/pilot-cohort-expansion-readiness-v73?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: taxPath(`/ai-pilot-decision-explainer-v73?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: taxPath(`/pilot-decision-closeout-v73?${periodQuery()}`),
    token,
  }),
]);

assertValue('sri source import center', sriSourceImportCenter.centerStatus);
assertValue(
  'vat declaration workspace',
  vatDeclarationWorkspace.readinessStatus,
);
assertValue(
  'income tax evidence workspace',
  incomeTaxEvidenceWorkspace.readinessStatus,
);
assertValue('filing assistant', filingAssistant.assistantStatus);
assertValue(
  'accountant escalation boundary',
  accountantEscalationBoundary.escalationStatus,
);
assertValue(
  'accounting boundary ai review',
  accountingBoundaryAiReview.reviewStatus,
);
assertValue(
  'declaration handoff closeout',
  declarationHandoffCloseout.closeoutStatus,
);
assertValue(
  'declaration handoff decision',
  declarationHandoffCloseout.decision,
);
assertValue(
  'declaration handoff next step',
  declarationHandoffCloseout.decision.nextStep,
);
assertNonEmpty(
  'declaration handoff lanes',
  declarationHandoffCloseout.handoffLanes,
);
assertNonEmpty(
  'declaration handoff guardrails',
  declarationHandoffCloseout.guardrails,
);
assertValue('sri import ledger 6.2', sriImportLedgerV62.ledgerStatus);
assertValue('sri exception queue 6.2', sriExceptionQueueV62.queueStatus);
assertValue('form box binder v2', formBoxBinderV2.binderStatus);
assertValue('accountant packet 6.2', accountantPacketV62.packetStatus);
assertValue(
  'operator action center 6.2',
  operatorActionCenterV62.actionCenterStatus,
);
assertValue(
  'operational hardening closeout 6.2',
  operationalHardeningCloseoutV62.closeoutStatus,
);
assertNonEmpty(
  'operator action center actions',
  operatorActionCenterV62.actions,
);
assertNonEmpty(
  'operational hardening checklist',
  operationalHardeningCloseoutV62.closeoutChecklist,
);
assertValue('pilot readiness room 7.0', pilotReadinessRoomV70.readinessStatus);
assertValue(
  'accountant feedback queue 7.0',
  accountantFeedbackQueueV70.queueStatus,
);
assertValue(
  'evidence correction workbench 7.0',
  evidenceCorrectionWorkbenchV70.workbenchStatus,
);
assertValue('pilot decision packet 7.0', pilotDecisionPacketV70.packetStatus);
assertValue(
  'pilot feedback closeout 7.0',
  pilotFeedbackCloseoutV70.closeoutStatus,
);
assertNonEmpty(
  'pilot feedback checklist',
  pilotFeedbackCloseoutV70.closeoutChecklist,
);
assertValue('pilot cohort registry 7.1', pilotCohortRegistryV71.registryStatus);
assertValue(
  'pilot analytics dashboard 7.1',
  pilotAnalyticsDashboardV71.dashboardStatus,
);
assertValue('accountant sla tracker 7.1', accountantSlaTrackerV71.trackerStatus);
assertValue('pilot learning backlog 7.1', pilotLearningBacklogV71.backlogStatus);
assertValue(
  'accounting advanced evidence gate 7.1',
  accountingAdvancedEvidenceGateV71.gateStatus,
);
assertValue(
  'pilot operations closeout 7.1',
  pilotOperationsCloseoutV71.closeoutStatus,
);
assertNonEmpty('pilot cohort members 7.1', pilotCohortRegistryV71.cohortMembers);
assertNonEmpty('pilot learning items 7.1', pilotLearningBacklogV71.learningItems);
assertNonEmpty(
  'pilot operations checklist 7.1',
  pilotOperationsCloseoutV71.closeoutChecklist,
);
assertValue('pilot evidence ledger 7.2', pilotEvidenceLedgerV72.ledgerStatus);
assertValue('pilot multi tenant cohort 7.2', pilotMultiTenantCohortV72.cohortStatus);
assertValue(
  'pilot repeated signal detector 7.2',
  pilotRepeatedSignalDetectorV72.detectorStatus,
);
assertValue(
  'accountant collaboration workbench 7.2',
  accountantWorkbenchV72.workbenchStatus,
);
assertValue('ai pilot assistant packet 7.2', aiPilotAssistantPacketV72.assistantStatus);
assertValue('pilot closeout 7.2', pilotCloseoutV72.closeoutStatus);
assertNonEmpty('pilot evidence records 7.2', pilotEvidenceLedgerV72.persistedRecords);
assertNonEmpty('pilot cohort rows 7.2', pilotMultiTenantCohortV72.cohortRows);
assertNonEmpty('pilot assistant actions 7.2', aiPilotAssistantPacketV72.suggestedActions);
assertNonEmpty('pilot closeout checklist 7.2', pilotCloseoutV72.closeoutChecklist);
assertValue('pilot period memory 7.3', pilotPeriodMemoryV73.memoryStatus);
assertValue(
  'accounting discovery dossier 7.3',
  accountingDiscoveryDossierV73.dossierStatus,
);
assertValue(
  'accountant decision record 7.3',
  accountantDecisionRecordV73.recordStatus,
);
assertValue(
  'cohort expansion readiness 7.3',
  cohortExpansionReadinessV73.readinessStatus,
);
assertValue(
  'ai pilot decision explainer 7.3',
  aiPilotDecisionExplainerV73.explainerStatus,
);
assertValue('pilot decision closeout 7.3', pilotDecisionCloseoutV73.closeoutStatus);
assertNonEmpty('pilot memory rows 7.3', pilotPeriodMemoryV73.memoryRows);
assertNonEmpty(
  'accounting discovery dossier sections 7.3',
  accountingDiscoveryDossierV73.dossierSections,
);
assertNonEmpty('accountant decisions 7.3', accountantDecisionRecordV73.decisions);
assertNonEmpty('ai decision cards 7.3', aiPilotDecisionExplainerV73.explanationCards);
assertNonEmpty(
  'pilot decision closeout checklist 7.3',
  pilotDecisionCloseoutV73.closeoutChecklist,
);

printLine('sri import center', sriSourceImportCenter.centerStatus);
printLine('iva workspace', vatDeclarationWorkspace.readinessStatus);
printLine('renta workspace', incomeTaxEvidenceWorkspace.readinessStatus);
printLine('filing assistant', filingAssistant.assistantStatus);
printLine('accountant boundary', accountantEscalationBoundary.escalationStatus);
printLine('ai boundary review', accountingBoundaryAiReview.reviewStatus);
printLine('closeout 6.0', declarationHandoffCloseout.closeoutStatus);
printLine('next step', declarationHandoffCloseout.decision.nextStep);
printLine('handoff lanes', declarationHandoffCloseout.handoffLanes.length);
printLine('guardrails', declarationHandoffCloseout.guardrails.length);
printLine('import ledger 6.2', sriImportLedgerV62.ledgerStatus);
printLine('exception queue 6.2', sriExceptionQueueV62.queueStatus);
printLine('form binder 2.0', formBoxBinderV2.binderStatus);
printLine('accountant packet 6.2', accountantPacketV62.packetStatus);
printLine('action center 6.2', operatorActionCenterV62.actionCenterStatus);
printLine('closeout 6.2', operationalHardeningCloseoutV62.closeoutStatus);
printLine('actions', operatorActionCenterV62.actions.length);
printLine('pilot readiness 7.0', pilotReadinessRoomV70.readinessStatus);
printLine('feedback queue 7.0', accountantFeedbackQueueV70.queueStatus);
printLine('correction workbench 7.0', evidenceCorrectionWorkbenchV70.workbenchStatus);
printLine('decision packet 7.0', pilotDecisionPacketV70.packetStatus);
printLine('pilot closeout 7.0', pilotFeedbackCloseoutV70.closeoutStatus);
printLine('pilot next product', pilotFeedbackCloseoutV70.recommendedNextProduct);
printLine('cohort registry 7.1', pilotCohortRegistryV71.registryStatus);
printLine('analytics dashboard 7.1', pilotAnalyticsDashboardV71.dashboardStatus);
printLine('accountant sla 7.1', accountantSlaTrackerV71.trackerStatus);
printLine('learning backlog 7.1', pilotLearningBacklogV71.backlogStatus);
printLine(
  'accounting gate 7.1',
  accountingAdvancedEvidenceGateV71.recommendation.nextProduct,
);
printLine('pilot closeout 7.1', pilotOperationsCloseoutV71.closeoutStatus);
printLine(
  'pilot operations next product',
  pilotOperationsCloseoutV71.recommendedNextProduct,
);
printLine('pilot ledger 7.2', pilotEvidenceLedgerV72.ledgerStatus);
printLine('pilot cohort 7.2', pilotMultiTenantCohortV72.cohortStatus);
printLine('repeated signals 7.2', pilotRepeatedSignalDetectorV72.detectorStatus);
printLine('accountant workbench 7.2', accountantWorkbenchV72.workbenchStatus);
printLine('ai pilot packet 7.2', aiPilotAssistantPacketV72.assistantStatus);
printLine('pilot closeout 7.2', pilotCloseoutV72.closeoutStatus);
printLine('pilot next product 7.2', pilotCloseoutV72.recommendedNextProduct);
printLine('pilot memory 7.3', pilotPeriodMemoryV73.memoryStatus);
printLine('discovery dossier 7.3', accountingDiscoveryDossierV73.dossierStatus);
printLine('accountant record 7.3', accountantDecisionRecordV73.recordStatus);
printLine('cohort expansion 7.3', cohortExpansionReadinessV73.readinessStatus);
printLine('ai decision explainer 7.3', aiPilotDecisionExplainerV73.explainerStatus);
printLine('pilot decision 7.3', pilotDecisionCloseoutV73.finalDecision);

printSection('EC tax compliance closeout 6/6.2/7.0/7.1/7.2/7.3 smoke passed');
