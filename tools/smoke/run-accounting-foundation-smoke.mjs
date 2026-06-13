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

function accountingPath(path) {
  return `/accounting/tenants/${encodeURIComponent(tenantSlug)}${path}`;
}

function periodQuery() {
  return `period=${encodeURIComponent(period)}&year=${encodeURIComponent(
    String(year),
  )}`;
}

function assertStatus(label, value) {
  if (!value) {
    throw new Error(`${label} no devolvio readiness/status.`);
  }
}

printSection('Accounting foundation smoke');
printLine('api', baseUrl);
printLine('tenant', tenantSlug);
printLine('period', period);
printLine('year', year);

const enabledProducts = await apiRequest({
  baseUrl,
  path: `/tenancy/tenants/${encodeURIComponent(tenantSlug)}/products`,
  token,
});
const accountingEnabled = enabledProducts.some(
  (product) => product.key === 'accounting',
);

if (!accountingEnabled) {
  throw new Error(`Tenant ${tenantSlug} no tiene accounting habilitado.`);
}

printLine('product access', 'accounting');

const [
  intakeWorkspace,
  chartOfAccountsWorkspace,
  journalDraftPreview,
  openingBalanceWorkspace,
  openingBalanceControlRegistry,
  bankAccountRegistryWorkspace,
  bankStatementImportProfileWorkspace,
] = await Promise.all([
  apiRequest({
    baseUrl,
    path: accountingPath(`/intake-workspace?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(`/chart-of-accounts-workspace?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(`/journal-draft-preview?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(`/opening-balance-workspace?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(`/opening-balance-control-registry?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(`/bank-account-registry-workspace?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/bank-statement-import-profile-workspace?${periodQuery()}`,
    ),
    token,
  }),
]);

assertStatus('intake workspace', intakeWorkspace.readinessStatus);
assertStatus(
  'chart of accounts workspace',
  chartOfAccountsWorkspace.readinessStatus,
);
assertStatus('journal draft preview', journalDraftPreview.journalStatus);
assertStatus(
  'opening balance workspace',
  openingBalanceWorkspace.openingBalanceStatus,
);
assertStatus(
  'opening balance control registry',
  openingBalanceControlRegistry.registryStatus,
);
assertStatus(
  'bank account registry workspace',
  bankAccountRegistryWorkspace.registryStatus,
);
assertStatus(
  'bank statement import profiles',
  bankStatementImportProfileWorkspace.profileStatus,
);

if (!Array.isArray(chartOfAccountsWorkspace.accounts)) {
  throw new Error('chart-of-accounts-workspace no devolvio accounts[].');
}

if (!Array.isArray(journalDraftPreview.draftEntries)) {
  throw new Error('journal-draft-preview no devolvio draftEntries[].');
}

printLine('intake', intakeWorkspace.recommendation);
printLine(
  'accounts',
  `${chartOfAccountsWorkspace.summary.accountCount} total, ${chartOfAccountsWorkspace.summary.needsMappingCount} por mapear`,
);
printLine(
  'journal drafts',
  `${journalDraftPreview.summary.draftEntryCount} borradores, ${journalDraftPreview.summary.balancedDraftCount} balanceados`,
);
printLine(
  'opening balances',
  `${openingBalanceWorkspace.summary.readyLineCount}/${openingBalanceWorkspace.summary.lineCount} listas, ${openingBalanceWorkspace.openingBalanceStatus}`,
);
printLine(
  'opening controls',
  `${openingBalanceControlRegistry.summary.materializedEntryCount} journals, ${openingBalanceControlRegistry.registryStatus}`,
);
printLine(
  'bank accounts',
  `${bankAccountRegistryWorkspace.summary.accountCount} cuentas, ${bankAccountRegistryWorkspace.registryStatus}`,
);
printLine(
  'bank import profiles',
  `${bankStatementImportProfileWorkspace.summary.readyProfileCount}/${bankStatementImportProfileWorkspace.summary.profileCount} listos`,
);
printLine('next step', journalDraftPreview.nextStep);

if (
  openingBalanceWorkspace.summary.lineCount > 0 &&
  openingBalanceWorkspace.summary.balanced
) {
  const openingApproval = await apiRequest({
    baseUrl,
    path: accountingPath('/opening-balance-approval-packet'),
    token,
    method: 'POST',
    body: {
      period,
      year,
      decision: 'approve',
      reviewerEmail: 'smoke@saas-platform.dev',
      note: 'Smoke opening balance approval.',
      evidenceReference: `smoke://accounting/${period}/opening-balance`,
    },
  });

  assertStatus('opening balance approval', openingApproval.approvalStatus);
  printLine(
    'opening approval',
    `${openingApproval.summary.approvedLineCount} aprobadas, ${openingApproval.approvalStatus}`,
  );

  const openingMaterialization = await apiRequest({
    baseUrl,
    path: accountingPath('/opening-balance-journal-entry'),
    token,
    method: 'POST',
    body: {
      period,
      year,
      reviewerEmail: 'smoke@saas-platform.dev',
      note: 'Smoke opening balance materialization.',
      evidenceReference: `smoke://accounting/${period}/opening-balance`,
    },
  });

  assertStatus(
    'opening balance materialization',
    openingMaterialization.materializationStatus,
  );
  printLine(
    'opening materialization',
    `${openingMaterialization.summary.createdEntryCount} creados, ${openingMaterialization.materializationStatus}`,
  );
}

const pendingAccounts = chartOfAccountsWorkspace.accounts.filter(
  (account) => account.mappedAccountHint && account.status !== 'mapped',
);

if (pendingAccounts.length > 0) {
  const mapping = await apiRequest({
    baseUrl,
    path: accountingPath('/chart-mapping'),
    token,
    method: 'POST',
    body: {
      period,
      year,
      mappings: pendingAccounts.slice(0, 6).map((account) => ({
        accountHint: account.mappedAccountHint,
        suggestedAccountCode: account.code,
        suggestedAccountName: account.name,
      })),
      updatedByEmail: 'smoke@saas-platform.dev',
    },
  });

  assertStatus('chart mapping management', mapping.mappingStatus);
  printLine(
    'chart mapping',
    `${mapping.updatedMappingCount} revisados, ${mapping.mappingStatus}`,
  );
}

const refreshedJournalDraftPreview = await apiRequest({
  baseUrl,
  path: accountingPath(`/journal-draft-preview?${periodQuery()}`),
  token,
});
const reviewableDraftKeys = refreshedJournalDraftPreview.draftEntries
  .filter((entry) => entry.blockers.length === 0 && entry.totals.balanced)
  .map((entry) => entry.draftEntryKey);

if (reviewableDraftKeys.length > 0) {
  const approvalPacket = await apiRequest({
    baseUrl,
    path: accountingPath('/journal-draft-approval-packet'),
    token,
    method: 'POST',
    body: {
      period,
      year,
      draftEntryKeys: reviewableDraftKeys,
      decision: 'approve',
      reviewerEmail: 'smoke@saas-platform.dev',
      note: 'Smoke approval for accounting foundation preview.',
    },
  });

  assertStatus('journal approval packet', approvalPacket.approvalStatus);
  printLine(
    'journal approval',
    `${approvalPacket.summary.approvedDraftEntryCount} aprobados, ${approvalPacket.approvalStatus}`,
  );

  const journalCreation = await apiRequest({
    baseUrl,
    path: accountingPath('/journal-entries'),
    token,
    method: 'POST',
    body: {
      period,
      year,
      draftEntryKeys: approvalPacket.approvedDraftEntryKeys,
      reviewerEmail: 'smoke@saas-platform.dev',
      note: 'Smoke journal registry creation.',
    },
  });

  assertStatus('journal entry creation', journalCreation.creationStatus);
  printLine(
    'journal registry write',
    `${journalCreation.summary.createdEntryCount} entries, ${journalCreation.creationStatus}`,
  );
}

const ledgerPreview = await apiRequest({
  baseUrl,
  path: accountingPath(`/ledger-preview-workspace?${periodQuery()}`),
  token,
});

assertStatus('ledger preview workspace', ledgerPreview.ledgerStatus);
printLine(
  'ledger preview',
  `${ledgerPreview.summary.accountCount} cuentas, ${ledgerPreview.summary.approvedPreviewEntryCount} entries`,
);

const [
  journalRegistry,
  ledgerRegistry,
  closeoutReadiness,
  trialBalance,
  closeoutReport,
] = await Promise.all([
  apiRequest({
    baseUrl,
    path: accountingPath(`/journal-registry?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(`/ledger-registry-workspace?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(`/period-closeout-readiness?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(`/trial-balance-workspace?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(`/period-closeout-report?${periodQuery()}`),
    token,
  }),
]);

assertStatus('journal registry', journalRegistry.registryStatus);
assertStatus('ledger registry workspace', ledgerRegistry.ledgerStatus);
assertStatus('period closeout readiness', closeoutReadiness.readinessStatus);
assertStatus('trial balance workspace', trialBalance.trialBalanceStatus);
assertStatus('period closeout report', closeoutReport.reportStatus);
printLine(
  'journal registry',
  `${journalRegistry.summary.entryCount} entries, ${journalRegistry.registryStatus}`,
);
printLine(
  'ledger registry',
  `${ledgerRegistry.summary.accountCount} cuentas, ${ledgerRegistry.ledgerStatus}`,
);
printLine(
  'closeout readiness',
  `${closeoutReadiness.summary.readyCheckCount}/${closeoutReadiness.summary.checkCount} checks, ${closeoutReadiness.readinessStatus}`,
);
printLine(
  'trial balance',
  `${trialBalance.summary.accountCount} cuentas, ${trialBalance.trialBalanceStatus}`,
);

const closeoutPacket = await apiRequest({
  baseUrl,
  method: 'POST',
  path: accountingPath('/period-closeout-packet'),
  token,
  body: {
    period,
    year,
    decision: 'approve',
    reviewerUserId: 'smoke-accounting-reviewer',
    reviewerEmail: 'accounting-reviewer@saas-platform.dev',
    note: 'Smoke closeout packet for accounting foundation.',
  },
});

assertStatus('period closeout packet', closeoutPacket.closeoutStatus);
printLine(
  'closeout packet',
  `${closeoutPacket.summary.readyApprovalCount} approvals, ${closeoutPacket.closeoutStatus}`,
);
printLine(
  'closeout report',
  `${closeoutReport.summary.sectionCount} secciones, ${closeoutReport.reportStatus}`,
);

const lockReadiness = await apiRequest({
  baseUrl,
  path: accountingPath(`/period-lock-readiness?${periodQuery()}`),
  token,
});

assertStatus('period lock readiness', lockReadiness.lockReadinessStatus);
printLine(
  'period lock',
  `${lockReadiness.summary.readyCheckCount}/${lockReadiness.summary.checkCount} checks, ${lockReadiness.lockReadinessStatus}`,
);

const adjustment = await apiRequest({
  baseUrl,
  method: 'POST',
  path: accountingPath('/adjusting-journal-entries'),
  token,
  body: {
    period,
    year,
    adjustmentType: 'manual_adjustment',
    label: 'Smoke closeout adjustment',
    currency: 'USD',
    lines: [
      {
        lineKey: 'smoke_adjustment:expense',
        accountCode: '501.01',
        accountName: 'Gastos operativos',
        debitInCents: 100,
        creditInCents: 0,
        sourceEntryKey: 'smoke_closeout_adjustment',
        accountHint: 'Gastos operativos',
        notes: ['Smoke adjustment debit line.'],
      },
      {
        lineKey: 'smoke_adjustment:cash',
        accountCode: '101.01',
        accountName: 'Caja y bancos',
        debitInCents: 0,
        creditInCents: 100,
        sourceEntryKey: 'smoke_closeout_adjustment',
        accountHint: 'Caja y bancos',
        notes: ['Smoke adjustment credit line.'],
      },
    ],
    reviewerUserId: 'smoke-accounting-reviewer',
    reviewerEmail: 'accounting-reviewer@saas-platform.dev',
    note: 'Smoke adjustment for accounting foundation.',
  },
});

assertStatus('adjusting journal entry', adjustment.creationStatus);
printLine(
  'adjustment',
  `${adjustment.summary.lineCount} lines, ${adjustment.creationStatus}`,
);

const financialStatementPreview = await apiRequest({
  baseUrl,
  path: accountingPath(`/financial-statement-preview?${periodQuery()}`),
  token,
});

assertStatus(
  'financial statement preview',
  financialStatementPreview.previewStatus,
);
printLine(
  'financial preview',
  `${financialStatementPreview.summary.trialBalanceAccountCount} cuentas, ${financialStatementPreview.previewStatus}`,
);

const bankReconciliationWorkspace = await apiRequest({
  baseUrl,
  path: accountingPath(`/bank-reconciliation-workspace?${periodQuery()}`),
  token,
});

assertStatus(
  'bank reconciliation workspace',
  bankReconciliationWorkspace.reconciliationStatus,
);
printLine(
  'bank reconciliation',
  `${bankReconciliationWorkspace.summary.exactMatchCount}/${bankReconciliationWorkspace.summary.candidateCount} matches, ${bankReconciliationWorkspace.reconciliationStatus}`,
);

if (bankReconciliationWorkspace.summary.bankAccountCount > 0) {
  const statementImport = await apiRequest({
    baseUrl,
    method: 'POST',
    path: accountingPath('/bank-statement-import'),
    token,
    body: {
      period,
      year,
      source: 'manual',
      originalFileName: `smoke-bank-${period}.json`,
      importedByUserId: 'smoke-accounting-reviewer',
      importedByEmail: 'accounting-reviewer@saas-platform.dev',
      notes: 'Smoke bank statement import.',
      lines: bankReconciliationWorkspace.bankAccounts.map((account, index) => ({
        accountCode: account.accountCode,
        accountName: account.accountName,
        postedAt: `${period}-28T12:00:00.000Z`,
        description: `Smoke bank statement ${account.accountName}`,
        direction: account.ledgerBalanceInCents >= 0 ? 'inflow' : 'outflow',
        amountInCents: Math.abs(account.ledgerBalanceInCents),
        currency: account.currency,
        reference: `smoke-bank-${period}-${index + 1}`,
        externalLineId: `smoke:${period}:${account.accountCode}`,
      })),
    },
  });

  assertStatus('bank statement import', statementImport.recordStatus);
  printLine(
    'bank statement import',
    `${statementImport.summary.recordedLineCount} lineas, ${statementImport.recordStatus}`,
  );
}

const bankStatementRegistry = await apiRequest({
  baseUrl,
  path: accountingPath(`/bank-statement-registry?${periodQuery()}`),
  token,
});

assertStatus('bank statement registry', bankStatementRegistry.registryStatus);
printLine(
  'bank statement registry',
  `${bankStatementRegistry.summary.batchCount} batches, ${bankStatementRegistry.summary.lineCount} lineas`,
);

if (bankReconciliationWorkspace.summary.exactMatchCount > 0) {
  const matchPacket = await apiRequest({
    baseUrl,
    method: 'POST',
    path: accountingPath('/reconciliation-match-packet'),
    token,
    body: {
      period,
      year,
      candidateKeys: bankReconciliationWorkspace.candidates
        .filter((candidate) => candidate.matchStatus === 'exact_match')
        .map((candidate) => candidate.candidateKey),
      decision: 'approve',
      reviewerUserId: 'smoke-accounting-reviewer',
      reviewerEmail: 'accounting-reviewer@saas-platform.dev',
      note: 'Smoke bank reconciliation match packet.',
    },
  });

  assertStatus('reconciliation match packet', matchPacket.packetStatus);
  printLine(
    'reconciliation packet',
    `${matchPacket.summary.approvedCandidateCount} aprobados, ${matchPacket.packetStatus}`,
  );
}

const exceptionPacket = await apiRequest({
  baseUrl,
  method: 'POST',
  path: accountingPath('/reconciliation-exception-packet'),
  token,
  body: {
    period,
    year,
  },
});

assertStatus(
  'reconciliation exception packet',
  exceptionPacket.exceptionStatus,
);
printLine(
  'reconciliation exceptions',
  `${exceptionPacket.summary.exceptionCount} excepciones, ${exceptionPacket.exceptionStatus}`,
);

const bankReconciliationControlRegistry = await apiRequest({
  baseUrl,
  path: accountingPath(
    `/bank-reconciliation-control-registry?${periodQuery()}`,
  ),
  token,
});

assertStatus(
  'bank reconciliation control registry',
  bankReconciliationControlRegistry.registryStatus,
);
printLine(
  'bank controls',
  `${bankReconciliationControlRegistry.summary.controlCount} controles, ${bankReconciliationControlRegistry.registryStatus}`,
);

const exceptionResolutionPacket = await apiRequest({
  baseUrl,
  method: 'POST',
  path: accountingPath('/reconciliation-exception-resolution-packet'),
  token,
  body: {
    period,
    year,
    decision: 'resolve',
    resolutionType: 'mark_timing_difference',
    exceptionKeys: exceptionPacket.exceptions.map(
      (exception) => exception.exceptionKey,
    ),
    actorUserId: 'smoke-accounting-reviewer',
    actorEmail: 'accounting-reviewer@saas-platform.dev',
    reason: 'Smoke reconciliation exception resolution.',
    evidenceReference: `smoke:${tenantSlug}:${period}:reconciliation-exception-resolution`,
  },
});

assertStatus(
  'reconciliation exception resolution packet',
  exceptionResolutionPacket.resolutionStatus,
);
printLine(
  'exception resolution',
  `${exceptionResolutionPacket.summary.resolvedExceptionCount}/${exceptionResolutionPacket.summary.requestedExceptionCount} resueltas, ${exceptionResolutionPacket.resolutionStatus}`,
);

const cashCloseoutReadiness = await apiRequest({
  baseUrl,
  path: accountingPath(`/period-cash-closeout-readiness?${periodQuery()}`),
  token,
});

assertStatus(
  'period cash closeout readiness',
  cashCloseoutReadiness.readinessStatus,
);
printLine(
  'cash closeout',
  `${cashCloseoutReadiness.summary.readyCheckCount}/${cashCloseoutReadiness.summary.checkCount} checks, ${cashCloseoutReadiness.readinessStatus}`,
);

const reconciliationReadiness = await apiRequest({
  baseUrl,
  path: accountingPath(`/period-reconciliation-readiness?${periodQuery()}`),
  token,
});

assertStatus(
  'period reconciliation readiness',
  reconciliationReadiness.readinessStatus,
);
printLine(
  'reconciliation readiness',
  `${reconciliationReadiness.summary.readyCheckCount}/${reconciliationReadiness.summary.checkCount} checks, ${reconciliationReadiness.readinessStatus}`,
);

const initialLockRegistry = await apiRequest({
  baseUrl,
  path: accountingPath(`/period-lock-registry?${periodQuery()}`),
  token,
});

assertStatus('period lock registry', initialLockRegistry.registryStatus);
printLine(
  'lock registry',
  `${initialLockRegistry.summary.controlCount} controles, ${initialLockRegistry.registryStatus}`,
);

if (initialLockRegistry.registryStatus !== 'locked') {
  const lockResult = await apiRequest({
    baseUrl,
    method: 'POST',
    path: accountingPath('/period-lock'),
    token,
    body: {
      period,
      year,
      lockedByUserId: 'smoke-accounting-reviewer',
      lockedByEmail: 'accounting-reviewer@saas-platform.dev',
      reason: 'Smoke internal accounting period lock.',
      evidenceReference: `smoke:${tenantSlug}:${period}:period-lock`,
    },
  });

  assertStatus('period lock result', lockResult.lockStatus);
  printLine(
    'period lock registry write',
    `${lockResult.lockStatus}, blockers ${lockResult.blockers.length}`,
  );
}

const reopenPacket = await apiRequest({
  baseUrl,
  method: 'POST',
  path: accountingPath('/period-reopen-packet'),
  token,
  body: {
    period,
    year,
    decision: 'prepare',
    reason: 'Smoke impact review before reopening a locked accounting period.',
    evidenceReference: `smoke:${tenantSlug}:${period}:period-reopen-review`,
    reopenedByUserId: 'smoke-accounting-reviewer',
    reopenedByEmail: 'accounting-reviewer@saas-platform.dev',
  },
});

assertStatus('period reopen packet', reopenPacket.reopenStatus);
printLine(
  'reopen packet',
  `${reopenPacket.summary.impactCount} impactos, ${reopenPacket.reopenStatus}`,
);

const auditTrailWorkspace = await apiRequest({
  baseUrl,
  path: accountingPath(`/audit-trail-workspace?${periodQuery()}`),
  token,
});

assertStatus('audit trail workspace', auditTrailWorkspace.auditStatus);
printLine(
  'audit trail',
  `${auditTrailWorkspace.summary.eventCount} eventos, ${auditTrailWorkspace.auditStatus}`,
);

const financialReviewPacket = await apiRequest({
  baseUrl,
  method: 'POST',
  path: accountingPath('/financial-statement-review-packet'),
  token,
  body: {
    period,
    year,
    decision: 'prepare',
    reviewerUserId: 'smoke-accounting-reviewer',
    reviewerEmail: 'accounting-reviewer@saas-platform.dev',
    note: 'Smoke financial statement review packet.',
    evidenceReference: `smoke:${tenantSlug}:${period}:financial-statement-review`,
  },
});

assertStatus(
  'financial statement review packet',
  financialReviewPacket.reviewStatus,
);
printLine(
  'financial review',
  `${financialReviewPacket.summary.readyChecklistCount}/${financialReviewPacket.summary.checklistCount} checks, ${financialReviewPacket.reviewStatus}`,
);

const evidenceVault = await apiRequest({
  baseUrl,
  path: accountingPath(`/period-evidence-vault?${periodQuery()}`),
  token,
});

assertStatus('period evidence vault', evidenceVault.vaultStatus);
printLine(
  'evidence vault',
  `${evidenceVault.summary.readyArtifactCount}/${evidenceVault.summary.artifactCount} artifacts, ${evidenceVault.vaultStatus}`,
);

const accountantHandoff = await apiRequest({
  baseUrl,
  path: accountingPath(`/accountant-handoff-workspace?${periodQuery()}`),
  token,
});

assertStatus('accountant handoff workspace', accountantHandoff.handoffStatus);
printLine(
  'accountant handoff',
  `${accountantHandoff.summary.riskFlagCount} riesgos, ${accountantHandoff.handoffStatus}`,
);

const accountantReview = await apiRequest({
  baseUrl,
  method: 'POST',
  path: accountingPath('/accountant-review/request'),
  token,
  body: {
    period,
    year,
    requestedByUserId: 'smoke-accounting-reviewer',
    requestedByEmail: 'accounting-reviewer@saas-platform.dev',
  },
});

assertStatus('accounting accountant review', accountantReview.status);
printLine(
  'accountant review',
  `${accountantReview.status}, preguntas ${accountantReview.questions.length}`,
);

const transitionedReview = await apiRequest({
  baseUrl,
  method: 'POST',
  path: accountingPath(
    `/accountant-review/${encodeURIComponent(accountantReview.id)}/transition`,
  ),
  token,
  body: {
    status: 'approved',
    transitionedByUserId: 'smoke-accounting-reviewer',
    note: 'Smoke accounting accountant review approval.',
  },
});

assertStatus(
  'accounting accountant review transition',
  transitionedReview.status,
);
printLine('review transition', transitionedReview.status);

const reviewResolutionPacket = await apiRequest({
  baseUrl,
  method: 'POST',
  path: accountingPath('/review-resolution-packet'),
  token,
  body: {
    period,
    year,
    reviewId: transitionedReview.id,
  },
});

assertStatus(
  'accounting review resolution packet',
  reviewResolutionPacket.resolutionStatus,
);
printLine(
  'review resolution',
  `${reviewResolutionPacket.summary.readyActionCount}/${reviewResolutionPacket.summary.actionCount} acciones, ${reviewResolutionPacket.resolutionStatus}`,
);

const certificationReadiness = await apiRequest({
  baseUrl,
  path: accountingPath(`/closeout-certification-readiness?${periodQuery()}`),
  token,
});

assertStatus(
  'accounting closeout certification readiness',
  certificationReadiness.certificationStatus,
);
printLine(
  'certification readiness',
  `${certificationReadiness.summary.readyCheckCount}/${certificationReadiness.summary.checkCount} checks, ${certificationReadiness.certificationStatus}`,
);

const correction = await apiRequest({
  baseUrl,
  method: 'POST',
  path: accountingPath('/corrections'),
  token,
  body: {
    period,
    year,
    source: 'accountant_review',
    status: 'open',
    severity: 'warning',
    title: 'Smoke professional correction',
    detail: 'Smoke correction registered before professional closeout.',
    recommendedAction: 'Review with accountant before external closeout.',
    ownerUserId: 'smoke-accounting-reviewer',
    ownerEmail: 'accounting-reviewer@saas-platform.dev',
    evidenceReference: `smoke:${tenantSlug}:${period}:professional-correction`,
  },
});

assertStatus('accounting correction', correction.status);
printLine('correction', `${correction.id}, ${correction.status}`);

const correctionsQueue = await apiRequest({
  baseUrl,
  path: accountingPath(`/corrections-queue?${periodQuery()}`),
  token,
});

assertStatus('accounting corrections queue', correctionsQueue.queueStatus);
printLine(
  'corrections queue',
  `${correctionsQueue.summary.openCount}/${correctionsQueue.summary.correctionCount} abiertas, ${correctionsQueue.queueStatus}`,
);

const adjustmentRecommendationPacket = await apiRequest({
  baseUrl,
  method: 'POST',
  path: accountingPath('/adjustment-recommendation-packet'),
  token,
  body: {
    period,
    year,
  },
});

assertStatus(
  'accounting adjustment recommendation packet',
  adjustmentRecommendationPacket.recommendationStatus,
);
printLine(
  'adjustment recommendations',
  `${adjustmentRecommendationPacket.summary.recommendationCount} sugeridas, ${adjustmentRecommendationPacket.recommendationStatus}`,
);

const evidenceAttachment = await apiRequest({
  baseUrl,
  method: 'POST',
  path: accountingPath('/evidence-attachments'),
  token,
  body: {
    period,
    year,
    attachmentType: 'accountant_note',
    source: 'professional_closeout_workspace',
    label: 'Smoke professional closeout note',
    reference: `smoke:${tenantSlug}:${period}:professional-closeout-note`,
    ownerUserId: 'smoke-accounting-reviewer',
    ownerEmail: 'accounting-reviewer@saas-platform.dev',
    status: 'ready',
    metadata: {
      source: 'smoke',
    },
  },
});

assertStatus('accounting evidence attachment', evidenceAttachment.status);
printLine(
  'evidence attachment',
  `${evidenceAttachment.id}, ${evidenceAttachment.status}`,
);

const evidenceAttachmentRegistry = await apiRequest({
  baseUrl,
  path: accountingPath(`/evidence-attachment-registry?${periodQuery()}`),
  token,
});

assertStatus(
  'accounting evidence attachment registry',
  evidenceAttachmentRegistry.registryStatus,
);
printLine(
  'evidence attachment registry',
  `${evidenceAttachmentRegistry.summary.readyAttachmentCount}/${evidenceAttachmentRegistry.summary.attachmentCount} ready, ${evidenceAttachmentRegistry.registryStatus}`,
);

const narrativeReport = await apiRequest({
  baseUrl,
  path: accountingPath(`/period-narrative-report?${periodQuery()}`),
  token,
});

assertStatus(
  'accounting period narrative report',
  narrativeReport.reportStatus,
);
printLine(
  'narrative report',
  `${narrativeReport.summary.sectionCount} secciones, ${narrativeReport.reportStatus}`,
);

const aiReviewAssistantPacket = await apiRequest({
  baseUrl,
  method: 'POST',
  path: accountingPath('/ai-review-assistant-packet'),
  token,
  body: {
    period,
    year,
  },
});

assertStatus(
  'accounting AI review assistant packet',
  aiReviewAssistantPacket.assistantStatus,
);
printLine(
  'AI review assistant',
  `${aiReviewAssistantPacket.summary.draftedResponseCount} respuestas, ${aiReviewAssistantPacket.assistantStatus}`,
);

const professionalCloseoutWorkspace = await apiRequest({
  baseUrl,
  path: accountingPath(`/professional-closeout-workspace?${periodQuery()}`),
  token,
});

assertStatus(
  'accounting professional closeout workspace',
  professionalCloseoutWorkspace.workspaceStatus,
);
printLine(
  'professional closeout',
  `${professionalCloseoutWorkspace.summary.correctionCount} correcciones, ${professionalCloseoutWorkspace.workspaceStatus}`,
);

const externalCloseoutRecord = await apiRequest({
  baseUrl,
  method: 'POST',
  path: accountingPath('/external-closeout-records'),
  token,
  body: {
    period,
    year,
    status: 'confirmed_by_accountant',
    accountantName: 'Smoke external accountant',
    accountantEmail: 'accounting-reviewer@saas-platform.dev',
    confirmedByUserId: 'smoke-accounting-reviewer',
    confirmedByEmail: 'accounting-reviewer@saas-platform.dev',
    confirmedAt: new Date().toISOString(),
    evidenceReference: `smoke:${tenantSlug}:${period}:external-closeout`,
    notes: 'Smoke external professional closeout confirmation.',
  },
});

assertStatus(
  'accounting external closeout record',
  externalCloseoutRecord.status,
);
printLine(
  'external closeout',
  `${externalCloseoutRecord.id}, ${externalCloseoutRecord.status}`,
);

const closeoutArtifactPacket = await apiRequest({
  baseUrl,
  method: 'POST',
  path: accountingPath('/professional-closeout-artifact-packet'),
  token,
  body: {
    period,
    year,
  },
});

assertStatus(
  'accounting professional closeout artifact packet',
  closeoutArtifactPacket.packetStatus,
);
printLine(
  'artifact packet',
  `${closeoutArtifactPacket.summary.readySectionCount}/${closeoutArtifactPacket.summary.sectionCount} sections, ${closeoutArtifactPacket.packetStatus}`,
);

const closeoutTimeline = await apiRequest({
  baseUrl,
  path: accountingPath(`/period-closeout-timeline?${periodQuery()}`),
  token,
});

assertStatus(
  'accounting period closeout timeline',
  closeoutTimeline.timelineStatus,
);
printLine(
  'closeout timeline',
  `${closeoutTimeline.summary.eventCount} eventos, ${closeoutTimeline.timelineStatus}`,
);

const legalBooksReadiness = await apiRequest({
  baseUrl,
  path: accountingPath(`/legal-books-readiness-packet?${periodQuery()}`),
  token,
});

assertStatus(
  'accounting legal books readiness',
  legalBooksReadiness.readinessStatus,
);
printLine(
  'legal books readiness',
  `${legalBooksReadiness.summary.readyCheckCount}/${legalBooksReadiness.summary.checkCount} checks, ${legalBooksReadiness.readinessStatus}`,
);

const finalReviewPacket = await apiRequest({
  baseUrl,
  method: 'POST',
  path: accountingPath('/financial-statement-final-review-packet'),
  token,
  body: {
    period,
    year,
  },
});

assertStatus(
  'accounting financial statement final review packet',
  finalReviewPacket.reviewStatus,
);
printLine(
  'final review',
  `${finalReviewPacket.summary.readyChecklistCount}/${finalReviewPacket.summary.checklistCount} checks, ${finalReviewPacket.reviewStatus}`,
);

const foundationCloseoutSummary = await apiRequest({
  baseUrl,
  path: accountingPath(`/foundation-closeout-summary?${periodQuery()}`),
  token,
});

assertStatus(
  'accounting foundation closeout summary',
  foundationCloseoutSummary.summaryStatus,
);
printLine(
  'foundation summary',
  `${foundationCloseoutSummary.summary.completedScopeCount} scopes, ${foundationCloseoutSummary.summaryStatus}`,
);

const operationalCommandCenter = await apiRequest({
  baseUrl,
  path: accountingPath(`/operational-command-center?${periodQuery()}`),
  token,
});

assertStatus(
  'accounting operational command center',
  operationalCommandCenter.commandStatus,
);
printLine(
  'command center',
  `${operationalCommandCenter.summary.readyLaneCount}/${operationalCommandCenter.summary.laneCount} lanes, ${operationalCommandCenter.commandStatus}`,
);

const [
  foundationCloseoutPackV2,
  taxComplianceFeedbackBridge,
  taxDeclarationEvidenceBridge,
  advancedDiscoveryAnchor,
  advancedDiscoveryIntake,
  formalNeedsClassifier,
  accountantDiscoveryWorkspace,
  advancedDiscoveryReadinessPacket,
  advancedDiscoveryCloseout,
  advancedMvpScopeRegistry,
  advancedMvpScopeDecisionRecord,
  minimumLedgerCloseoutDesign,
  certifiedBankEvidenceBoundary,
  advancedAuditTrailReadinessPacket,
  advancedMvpReadinessCloseout,
  advancedMvpExecutionAnchor,
  advancedBankReconciliationMvpWorkbench,
  advancedLedgerCloseoutMvpWorkbench,
  advancedMvpAccountantReviewPacket,
  advancedMvpCommandCenter,
  advancedMvpOperatingCloseout,
  advancedPilotEnrollment,
  advancedPilotEvidenceSnapshot,
  advancedPilotAccountantReviewRoom,
  advancedPilotRunbook,
  advancedPilotOutcomePacket,
  advancedPilotCloseout,
  advancedGraduationLearningRegistry,
  advancedGraduationAccountantAcceptanceCriteria,
  advancedGraduationProductMatrix,
  advancedGraduationFormalBooksBoundary,
  advancedGraduationCertifiedBankFeedBoundary,
  advancedGraduationCloseout,
  advancedFormalReadinessPolicies,
  advancedFormalReadinessAccountantPortal,
  advancedFormalReadinessAdjustmentWorkbench,
  advancedFormalReadinessMultiPeriodStatements,
  advancedFormalReadinessFormalBooksPacket,
  advancedFormalReadinessCertifiedBankCloseout,
  advancedFormalDesignScopeContract,
  advancedFormalDesignResponsibilityMatrix,
  advancedFormalDesignArtifactRegistry,
  advancedFormalDesignReviewWorkflow,
  advancedFormalDesignGuardrailPack,
  advancedFormalDesignCloseout,
  advancedFormalDraftingAnchor,
  advancedAdjustmentDraftPack,
  advancedFormalBooksDraftWorkspace,
  advancedFinancialStatementsDraftPack,
  advancedCertifiedReconciliationDraftPack,
  advancedFormalDraftingCloseout,
  advancedProfessionalReviewAnchor,
  advancedAccountantDraftReviewRoom,
  advancedReviewChangeRequestPack,
  advancedProfessionalApprovalRecommendationPack,
  advancedReviewExecutionCommandCenter,
  advancedProfessionalReviewCloseout,
  advancedFormalApprovalAnchor,
  advancedApprovalAuthorityMatrix,
  advancedFormalApprovalEvidencePack,
  advancedApprovalDecisionWorkspace,
  advancedFormalApprovalCommandCenter,
  advancedFormalApprovalCloseout,
  advancedSignatureCertificationAnchor,
  advancedFormalSignatoryRegistry,
  advancedSignatureEvidenceReadinessPack,
  advancedCertificationRequirementWorkspace,
  advancedLegalizationBoundaryPacket,
  advancedSignatureCertificationCloseout,
  advancedExternalExecutionHandoffAnchor,
  advancedExternalExecutorAssignmentMatrix,
  advancedExecutionHandoffEvidenceBundle,
  advancedExternalExecutionInstructionPack,
  advancedExecutionReturnEvidenceIntake,
  advancedExternalExecutionHandoffCloseout,
  advancedExternalExecutionTrackingAnchor,
  advancedExternalExecutionStatusLedger,
  advancedReturnedEvidenceValidationWorkspace,
  advancedExternalObservationResolutionQueue,
  advancedExternalExecutionTrackingCommandCenter,
  advancedExternalExecutionTrackingCloseout,
  advancedExternalResultIntakeAnchor,
  advancedReturnedArtifactRegistry,
  advancedInternalAcceptanceCriteriaWorkspace,
  advancedAcceptanceDecisionWorkspace,
  advancedInternalAcceptanceCommandCenter,
  advancedExternalResultIntakeCloseout,
  advancedFormalRecordAssemblyAnchor,
  advancedAcceptedArtifactBinder,
  advancedFormalRecordIndexWorkspace,
  advancedRecordConsistencyReviewWorkspace,
  advancedFormalRecordAssemblyCommandCenter,
  advancedFormalRecordAssemblyCloseout,
  advancedFormalRecordCloseoutAnchor,
  advancedArchiveReadinessWorkspace,
  advancedFormalCloseoutEvidencePacket,
  advancedProfessionalCloseoutAttestationBoundary,
  advancedFormalRecordCloseoutCommandCenter,
  advancedFormalRecordCloseoutCloseout,
  advancedGraduationArchiveHandoffAnchor,
  advancedArchiveHandoffPackage,
  advancedGraduationSignalMatrix,
  advancedProductScopeDecisionWorkspace,
  advancedGraduationArchiveHandoffCommandCenter,
  advancedGraduationArchiveHandoffCloseout,
  fullAccountingCandidateAnchor,
  fullAccountingCoreLedgerScopeBlueprint,
  fullAccountingBankReconciliationBoundary,
  fullAccountingFinancialStatementsBlueprint,
  fullAccountingLegalBooksStatutoryBoundary,
  fullAccountingCandidateCloseout,
  fullAccountingMvpReadinessAnchor,
  fullAccountingLedgerPersistenceDesign,
  fullAccountingPostingPolicyBoundary,
  fullAccountingBankFeedReconciliationReadiness,
  fullAccountingTrialBalanceStatementReadiness,
  fullAccountingMvpReadinessCloseout,
  fullAccountingMvpOperationsAnchor,
  fullAccountingLedgerWorkbenchMvp,
  fullAccountingPostingDraftLane,
  fullAccountingBankReconciliationWorkbenchMvp,
  fullAccountingTrialBalancePreviewWorkbench,
  fullAccountingMvpOperationsCloseout,
  fullAccountingControlledPilotAnchor,
  fullAccountingPilotEnrollmentPeriodFreeze,
  fullAccountingPilotRunbookWorkspace,
  fullAccountingPilotAccountantReviewRoom,
  fullAccountingPilotOutcomePacket,
  fullAccountingControlledPilotCloseout,
  fullAccountingGraduationAnchor,
  fullAccountingGraduationEvidenceDossier,
  fullAccountingProductScopeGraduationMatrix,
  fullAccountingProfessionalOperatingModel,
  fullAccountingGraduationRiskControlPack,
  fullAccountingGraduationCloseout,
  fullAccountingProductDesignAnchor,
  fullAccountingProductScopeContract,
  fullAccountingProductProfessionalResponsibilityMatrix,
  fullAccountingOfficialArtifactBoundaryRegistry,
  fullAccountingWorkflowControlBlueprint,
  fullAccountingProductDesignCloseout,
  fullAccountingFormalReadinessAnchor,
  fullAccountingPolicyTemplateRegistry,
  fullAccountingProfessionalPortalReadinessShell,
  fullAccountingFormalLedgerPostingReadinessPack,
  fullAccountingStatementBankFormalBoundaryPack,
  fullAccountingFormalReadinessCloseout,
  fullAccountingFormalArtifactDraftingAnchor,
  fullAccountingFormalLedgerDraftPack,
  fullAccountingPostingApprovalDraftPack,
  fullAccountingBankReconciliationEvidenceDraftPack,
  fullAccountingTrialBalanceFinancialStatementDraftPack,
  fullAccountingFormalArtifactDraftingCloseout,
  fullAccountingProfessionalReviewExecutionAnchor,
  fullAccountingAccountantDraftReviewRoom,
  fullAccountingReviewChangeRequestPack,
  fullAccountingProfessionalApprovalRecommendationPack,
  fullAccountingReviewExecutionCommandCenter,
  fullAccountingProfessionalReviewExecutionCloseout,
  fullAccountingFormalApprovalWorkflowAnchor,
  fullAccountingApprovalAuthorityMatrix,
  fullAccountingFormalApprovalEvidencePack,
  fullAccountingApprovalDecisionWorkspace,
  fullAccountingFormalApprovalCommandCenter,
  fullAccountingFormalApprovalWorkflowCloseout,
  fullAccountingSignatureCertificationBoundaryAnchor,
  fullAccountingFormalSignatoryRegistry,
  fullAccountingSignatureEvidenceReadinessPack,
  fullAccountingCertificationRequirementWorkspace,
  fullAccountingLegalizationBoundaryPacket,
  fullAccountingSignatureCertificationBoundaryCloseout,
  fullAccountingExternalExecutionHandoffAnchor,
  fullAccountingExternalExecutorAssignmentMatrix,
  fullAccountingExecutionHandoffEvidenceBundle,
  fullAccountingExternalExecutionInstructionPack,
  fullAccountingExecutionReturnEvidenceIntake,
  fullAccountingExternalExecutionHandoffCloseout,
  fullAccountingExternalExecutionTrackingAnchor,
  fullAccountingExternalExecutionStatusLedger,
  fullAccountingReturnedEvidenceValidationWorkspace,
  fullAccountingExternalObservationResolutionQueue,
  fullAccountingExternalExecutionTrackingCommandCenter,
  fullAccountingExternalExecutionTrackingCloseout,
  fullAccountingExternalResultIntakeAnchor,
  fullAccountingReturnedArtifactRegistry,
  fullAccountingInternalAcceptanceCriteriaWorkspace,
  fullAccountingAcceptanceDecisionWorkspace,
  fullAccountingInternalAcceptanceCommandCenter,
  fullAccountingExternalResultIntakeCloseout,
  fullAccountingFormalRecordAssemblyAnchor,
  fullAccountingAcceptedArtifactBinder,
  fullAccountingFormalRecordIndexWorkspace,
  fullAccountingRecordConsistencyReviewWorkspace,
  fullAccountingFormalRecordAssemblyCommandCenter,
  fullAccountingFormalRecordAssemblyCloseout,
] = await Promise.all([
  apiRequest({
    baseUrl,
    path: accountingPath(`/foundation-closeout-pack-v2?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(`/tax-compliance-feedback-bridge?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(`/tax-declaration-evidence-bridge?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(`/advanced-discovery/anchor?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(`/advanced-discovery/intake?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/advanced-discovery/formal-needs-classifier?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/advanced-discovery/accountant-workspace?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/advanced-discovery/readiness-packet?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(`/advanced-discovery/closeout?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/advanced-mvp-readiness/scope-registry?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/advanced-mvp-readiness/scope-decision-record?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/advanced-mvp-readiness/ledger-closeout-design?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/advanced-mvp-readiness/bank-evidence-boundary?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/advanced-mvp-readiness/audit-trail-packet?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(`/advanced-mvp-readiness/closeout?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/advanced-mvp-operations/execution-anchor?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/advanced-mvp-operations/bank-reconciliation-workbench?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/advanced-mvp-operations/ledger-closeout-workbench?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/advanced-mvp-operations/accountant-review-packet?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/advanced-mvp-operations/command-center?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(`/advanced-mvp-operations/closeout?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(`/advanced-pilot/enrollment?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(`/advanced-pilot/evidence-snapshot?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/advanced-pilot/accountant-review-room?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(`/advanced-pilot/runbook?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(`/advanced-pilot/outcome-packet?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(`/advanced-pilot/closeout?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/advanced-graduation/learning-registry?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/advanced-graduation/accountant-acceptance-criteria?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/advanced-graduation/product-matrix?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/advanced-graduation/formal-books-boundary?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/advanced-graduation/certified-bank-feed-boundary?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(`/advanced-graduation/closeout?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/advanced-formal-readiness/policies-closing-templates?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/advanced-formal-readiness/accountant-portal-shell?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/advanced-formal-readiness/adjustment-workbench?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/advanced-formal-readiness/multi-period-statements?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/advanced-formal-readiness/formal-books-boundary-packet?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/advanced-formal-readiness/certified-bank-reconciliation-closeout?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/advanced-formal-design/scope-contract?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/advanced-formal-design/responsibility-matrix?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/advanced-formal-design/artifact-registry?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/advanced-formal-design/review-workflow?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/advanced-formal-design/guardrail-pack?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(`/advanced-formal-design/closeout?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(`/advanced-formal-drafting/anchor?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/advanced-formal-drafting/adjustment-draft-pack?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/advanced-formal-drafting/formal-books-workspace?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/advanced-formal-drafting/financial-statements-pack?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/advanced-formal-drafting/certified-reconciliation-pack?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(`/advanced-formal-drafting/closeout?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/advanced-professional-review/anchor?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/advanced-professional-review/accountant-review-room?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/advanced-professional-review/change-request-pack?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/advanced-professional-review/approval-recommendation-pack?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/advanced-professional-review/command-center?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/advanced-professional-review/closeout?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(`/advanced-formal-approval/anchor?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/advanced-formal-approval/authority-matrix?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/advanced-formal-approval/evidence-pack?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/advanced-formal-approval/decision-workspace?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/advanced-formal-approval/command-center?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(`/advanced-formal-approval/closeout?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/advanced-signature-certification/anchor?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/advanced-signature-certification/signatory-registry?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/advanced-signature-certification/evidence-readiness-pack?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/advanced-signature-certification/certification-requirements?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/advanced-signature-certification/legalization-boundary?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/advanced-signature-certification/closeout?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/advanced-external-execution-handoff/anchor?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/advanced-external-execution-handoff/executor-assignment-matrix?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/advanced-external-execution-handoff/evidence-bundle?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/advanced-external-execution-handoff/instruction-pack?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/advanced-external-execution-handoff/return-evidence-intake?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/advanced-external-execution-handoff/closeout?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/advanced-external-execution-tracking/anchor?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/advanced-external-execution-tracking/status-ledger?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/advanced-external-execution-tracking/returned-evidence-validation?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/advanced-external-execution-tracking/observation-resolution-queue?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/advanced-external-execution-tracking/command-center?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/advanced-external-execution-tracking/closeout?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/advanced-external-result-intake/anchor?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/advanced-external-result-intake/returned-artifact-registry?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/advanced-external-result-intake/internal-acceptance-criteria?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/advanced-external-result-intake/acceptance-decision-workspace?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/advanced-external-result-intake/internal-acceptance-command-center?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/advanced-external-result-intake/closeout?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/advanced-formal-record-assembly/anchor?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/advanced-formal-record-assembly/accepted-artifact-binder?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/advanced-formal-record-assembly/record-index?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/advanced-formal-record-assembly/consistency-review?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/advanced-formal-record-assembly/command-center?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/advanced-formal-record-assembly/closeout?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/advanced-formal-record-closeout/anchor?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/advanced-formal-record-closeout/archive-readiness?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/advanced-formal-record-closeout/evidence-packet?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/advanced-formal-record-closeout/professional-boundary?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/advanced-formal-record-closeout/command-center?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/advanced-formal-record-closeout/closeout?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/advanced-graduation-archive-handoff/anchor?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/advanced-graduation-archive-handoff/package?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/advanced-graduation-archive-handoff/graduation-signals?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/advanced-graduation-archive-handoff/scope-decision?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/advanced-graduation-archive-handoff/command-center?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/advanced-graduation-archive-handoff/closeout?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(`/full-accounting-candidate/anchor?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/full-accounting-candidate/core-ledger-scope?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/full-accounting-candidate/bank-reconciliation-boundary?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/full-accounting-candidate/financial-statements-blueprint?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/full-accounting-candidate/legal-books-boundary?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(`/full-accounting-candidate/closeout?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(`/full-accounting-mvp-readiness/anchor?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/full-accounting-mvp-readiness/ledger-persistence-design?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/full-accounting-mvp-readiness/posting-policy-boundary?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/full-accounting-mvp-readiness/bank-feed-reconciliation?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/full-accounting-mvp-readiness/trial-balance-statements?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(`/full-accounting-mvp-readiness/closeout?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(`/full-accounting-mvp-operations/anchor?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/full-accounting-mvp-operations/ledger-workbench?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/full-accounting-mvp-operations/posting-draft-lane?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/full-accounting-mvp-operations/bank-reconciliation-workbench?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/full-accounting-mvp-operations/trial-balance-preview?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(`/full-accounting-mvp-operations/closeout?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(`/full-accounting-controlled-pilot/anchor?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/full-accounting-controlled-pilot/enrollment-freeze?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(`/full-accounting-controlled-pilot/runbook?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/full-accounting-controlled-pilot/accountant-review-room?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/full-accounting-controlled-pilot/outcome-packet?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(`/full-accounting-controlled-pilot/closeout?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(`/full-accounting-graduation/anchor?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/full-accounting-graduation/evidence-dossier?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(`/full-accounting-graduation/scope-matrix?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/full-accounting-graduation/professional-operating-model?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/full-accounting-graduation/risk-control-pack?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(`/full-accounting-graduation/closeout?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(`/full-accounting-product-design/anchor?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/full-accounting-product-design/scope-contract?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/full-accounting-product-design/responsibility-matrix?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/full-accounting-product-design/artifact-boundary-registry?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/full-accounting-product-design/workflow-control-blueprint?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/full-accounting-product-design/closeout?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(`/full-accounting-formal-readiness/anchor?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/full-accounting-formal-readiness/policy-template-registry?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/full-accounting-formal-readiness/professional-portal-shell?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/full-accounting-formal-readiness/ledger-posting-pack?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/full-accounting-formal-readiness/statement-bank-boundary?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(`/full-accounting-formal-readiness/closeout?${periodQuery()}`),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/full-accounting-formal-artifact-drafting/anchor?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/full-accounting-formal-artifact-drafting/ledger-draft-pack?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/full-accounting-formal-artifact-drafting/posting-approval-draft-pack?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/full-accounting-formal-artifact-drafting/bank-evidence-draft-pack?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/full-accounting-formal-artifact-drafting/statement-draft-pack?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/full-accounting-formal-artifact-drafting/closeout?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/full-accounting-professional-review-execution/anchor?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/full-accounting-professional-review-execution/review-room?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/full-accounting-professional-review-execution/change-request-pack?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/full-accounting-professional-review-execution/recommendation-pack?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/full-accounting-professional-review-execution/command-center?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/full-accounting-professional-review-execution/closeout?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/full-accounting-formal-approval/anchor?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/full-accounting-formal-approval/authority-matrix?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/full-accounting-formal-approval/evidence-pack?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/full-accounting-formal-approval/decision-workspace?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/full-accounting-formal-approval/command-center?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/full-accounting-formal-approval/closeout?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/full-accounting-signature-certification/anchor?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/full-accounting-signature-certification/signatory-registry?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/full-accounting-signature-certification/signature-evidence-pack?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/full-accounting-signature-certification/certification-requirements?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/full-accounting-signature-certification/legalization-boundary?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/full-accounting-signature-certification/closeout?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/full-accounting-external-execution-handoff/anchor?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/full-accounting-external-execution-handoff/executor-assignments?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/full-accounting-external-execution-handoff/evidence-bundle?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/full-accounting-external-execution-handoff/instruction-pack?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/full-accounting-external-execution-handoff/return-intake?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/full-accounting-external-execution-handoff/closeout?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/full-accounting-external-execution-tracking/anchor?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/full-accounting-external-execution-tracking/status-ledger?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/full-accounting-external-execution-tracking/returned-evidence-validation?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/full-accounting-external-execution-tracking/observation-queue?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/full-accounting-external-execution-tracking/command-center?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/full-accounting-external-execution-tracking/closeout?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/full-accounting-external-result-intake/anchor?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/full-accounting-external-result-intake/returned-artifacts?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/full-accounting-external-result-intake/acceptance-criteria?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/full-accounting-external-result-intake/acceptance-decisions?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/full-accounting-external-result-intake/command-center?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({
    baseUrl,
    path: accountingPath(
      `/full-accounting-external-result-intake/closeout?${periodQuery()}`,
    ),
    token,
  }),
  apiRequest({ baseUrl, path: accountingPath(`/full-accounting-formal-record-assembly/anchor?${periodQuery()}`), token }),
  apiRequest({ baseUrl, path: accountingPath(`/full-accounting-formal-record-assembly/accepted-artifact-binder?${periodQuery()}`), token }),
  apiRequest({ baseUrl, path: accountingPath(`/full-accounting-formal-record-assembly/record-index?${periodQuery()}`), token }),
  apiRequest({ baseUrl, path: accountingPath(`/full-accounting-formal-record-assembly/consistency-review?${periodQuery()}`), token }),
  apiRequest({ baseUrl, path: accountingPath(`/full-accounting-formal-record-assembly/command-center?${periodQuery()}`), token }),
  apiRequest({ baseUrl, path: accountingPath(`/full-accounting-formal-record-assembly/closeout?${periodQuery()}`), token }),
]);

assertStatus(
  'accounting foundation closeout pack v2',
  foundationCloseoutPackV2.closeoutStatus,
);
assertStatus(
  'accounting tax compliance feedback bridge',
  taxComplianceFeedbackBridge.bridgeStatus,
);
assertStatus(
  'accounting tax declaration evidence bridge',
  taxDeclarationEvidenceBridge.evidenceStatus,
);
assertStatus(
  'accounting advanced discovery anchor',
  advancedDiscoveryAnchor.anchorStatus,
);
assertStatus(
  'accounting advanced discovery intake',
  advancedDiscoveryIntake.intakeStatus,
);
assertStatus(
  'accounting formal needs classifier',
  formalNeedsClassifier.classifierStatus,
);
assertStatus(
  'accounting accountant discovery workspace',
  accountantDiscoveryWorkspace.workspaceStatus,
);
assertStatus(
  'accounting advanced discovery readiness packet',
  advancedDiscoveryReadinessPacket.packetStatus,
);
assertStatus(
  'accounting advanced discovery closeout',
  advancedDiscoveryCloseout.closeoutStatus,
);
assertStatus(
  'accounting advanced mvp scope registry',
  advancedMvpScopeRegistry.registryStatus,
);
assertStatus(
  'accounting advanced mvp scope decision record',
  advancedMvpScopeDecisionRecord.recordStatus,
);
assertStatus(
  'accounting minimum ledger closeout design',
  minimumLedgerCloseoutDesign.workspaceStatus,
);
assertStatus(
  'accounting certified bank evidence boundary',
  certifiedBankEvidenceBoundary.boundaryStatus,
);
assertStatus(
  'accounting advanced audit trail readiness packet',
  advancedAuditTrailReadinessPacket.packetStatus,
);
assertStatus(
  'accounting advanced mvp readiness closeout',
  advancedMvpReadinessCloseout.closeoutStatus,
);
assertStatus(
  'accounting advanced mvp execution anchor',
  advancedMvpExecutionAnchor.anchorStatus,
);
assertStatus(
  'accounting advanced bank reconciliation mvp workbench',
  advancedBankReconciliationMvpWorkbench.workbenchStatus,
);
assertStatus(
  'accounting advanced ledger closeout mvp workbench',
  advancedLedgerCloseoutMvpWorkbench.workbenchStatus,
);
assertStatus(
  'accounting advanced mvp accountant review packet',
  advancedMvpAccountantReviewPacket.packetStatus,
);
assertStatus(
  'accounting advanced mvp command center',
  advancedMvpCommandCenter.commandStatus,
);
assertStatus(
  'accounting advanced mvp operating closeout',
  advancedMvpOperatingCloseout.closeoutStatus,
);
assertStatus(
  'accounting advanced pilot enrollment',
  advancedPilotEnrollment.readinessStatus,
);
assertStatus(
  'accounting advanced pilot evidence snapshot',
  advancedPilotEvidenceSnapshot.snapshotStatus,
);
assertStatus(
  'accounting advanced pilot accountant review room',
  advancedPilotAccountantReviewRoom.roomStatus,
);
assertStatus(
  'accounting advanced pilot runbook',
  advancedPilotRunbook.runbookStatus,
);
assertStatus(
  'accounting advanced pilot outcome packet',
  advancedPilotOutcomePacket.packetStatus,
);
assertStatus(
  'accounting advanced pilot closeout',
  advancedPilotCloseout.closeoutStatus,
);
assertStatus(
  'accounting advanced graduation learning registry',
  advancedGraduationLearningRegistry.registryStatus,
);
assertStatus(
  'accounting advanced graduation accountant acceptance criteria',
  advancedGraduationAccountantAcceptanceCriteria.criteriaStatus,
);
assertStatus(
  'accounting advanced graduation product matrix',
  advancedGraduationProductMatrix.matrixStatus,
);
assertStatus(
  'accounting advanced graduation formal books boundary',
  advancedGraduationFormalBooksBoundary.blueprintStatus,
);
assertStatus(
  'accounting advanced graduation certified bank feed boundary',
  advancedGraduationCertifiedBankFeedBoundary.blueprintStatus,
);
assertStatus(
  'accounting advanced graduation closeout',
  advancedGraduationCloseout.closeoutStatus,
);
assertStatus(
  'accounting advanced formal readiness policies',
  advancedFormalReadinessPolicies.registryStatus,
);
assertStatus(
  'accounting advanced formal readiness accountant portal',
  advancedFormalReadinessAccountantPortal.portalStatus,
);
assertStatus(
  'accounting advanced formal readiness adjustment workbench',
  advancedFormalReadinessAdjustmentWorkbench.workbenchStatus,
);
assertStatus(
  'accounting advanced formal readiness multi-period statements',
  advancedFormalReadinessMultiPeriodStatements.workspaceStatus,
);
assertStatus(
  'accounting advanced formal readiness formal books packet',
  advancedFormalReadinessFormalBooksPacket.packetStatus,
);
assertStatus(
  'accounting advanced formal readiness certified bank closeout',
  advancedFormalReadinessCertifiedBankCloseout.closeoutStatus,
);
assertStatus(
  'accounting advanced formal design scope contract',
  advancedFormalDesignScopeContract.contractStatus,
);
assertStatus(
  'accounting advanced formal design responsibility matrix',
  advancedFormalDesignResponsibilityMatrix.matrixStatus,
);
assertStatus(
  'accounting advanced formal design artifact registry',
  advancedFormalDesignArtifactRegistry.registryStatus,
);
assertStatus(
  'accounting advanced formal design review workflow',
  advancedFormalDesignReviewWorkflow.workflowStatus,
);
assertStatus(
  'accounting advanced formal design guardrail pack',
  advancedFormalDesignGuardrailPack.packStatus,
);
assertStatus(
  'accounting advanced formal design closeout',
  advancedFormalDesignCloseout.closeoutStatus,
);
assertStatus(
  'accounting advanced formal drafting anchor',
  advancedFormalDraftingAnchor.anchorStatus,
);
assertStatus(
  'accounting advanced adjustment draft pack',
  advancedAdjustmentDraftPack.packStatus,
);
assertStatus(
  'accounting advanced formal books draft workspace',
  advancedFormalBooksDraftWorkspace.workspaceStatus,
);
assertStatus(
  'accounting advanced financial statements draft pack',
  advancedFinancialStatementsDraftPack.packStatus,
);
assertStatus(
  'accounting advanced certified reconciliation draft pack',
  advancedCertifiedReconciliationDraftPack.packStatus,
);
assertStatus(
  'accounting advanced formal drafting closeout',
  advancedFormalDraftingCloseout.closeoutStatus,
);
assertStatus(
  'accounting advanced professional review anchor',
  advancedProfessionalReviewAnchor.anchorStatus,
);
assertStatus(
  'accounting advanced accountant draft review room',
  advancedAccountantDraftReviewRoom.roomStatus,
);
assertStatus(
  'accounting advanced review change request pack',
  advancedReviewChangeRequestPack.packStatus,
);
assertStatus(
  'accounting advanced professional approval recommendation pack',
  advancedProfessionalApprovalRecommendationPack.packStatus,
);
assertStatus(
  'accounting advanced review execution command center',
  advancedReviewExecutionCommandCenter.commandStatus,
);
assertStatus(
  'accounting advanced professional review closeout',
  advancedProfessionalReviewCloseout.closeoutStatus,
);
assertStatus(
  'accounting advanced formal approval anchor',
  advancedFormalApprovalAnchor.anchorStatus,
);
assertStatus(
  'accounting advanced approval authority matrix',
  advancedApprovalAuthorityMatrix.matrixStatus,
);
assertStatus(
  'accounting advanced formal approval evidence pack',
  advancedFormalApprovalEvidencePack.packStatus,
);
assertStatus(
  'accounting advanced approval decision workspace',
  advancedApprovalDecisionWorkspace.workspaceStatus,
);
assertStatus(
  'accounting advanced formal approval command center',
  advancedFormalApprovalCommandCenter.commandStatus,
);
assertStatus(
  'accounting advanced formal approval closeout',
  advancedFormalApprovalCloseout.closeoutStatus,
);
assertStatus(
  'accounting advanced signature certification anchor',
  advancedSignatureCertificationAnchor.anchorStatus,
);
assertStatus(
  'accounting advanced formal signatory registry',
  advancedFormalSignatoryRegistry.registryStatus,
);
assertStatus(
  'accounting advanced signature evidence readiness pack',
  advancedSignatureEvidenceReadinessPack.packStatus,
);
assertStatus(
  'accounting advanced certification requirement workspace',
  advancedCertificationRequirementWorkspace.workspaceStatus,
);
assertStatus(
  'accounting advanced legalization boundary packet',
  advancedLegalizationBoundaryPacket.packetStatus,
);
assertStatus(
  'accounting advanced signature certification closeout',
  advancedSignatureCertificationCloseout.closeoutStatus,
);
assertStatus(
  'accounting advanced external execution handoff anchor',
  advancedExternalExecutionHandoffAnchor.anchorStatus,
);
assertStatus(
  'accounting advanced external executor assignment matrix',
  advancedExternalExecutorAssignmentMatrix.matrixStatus,
);
assertStatus(
  'accounting advanced execution handoff evidence bundle',
  advancedExecutionHandoffEvidenceBundle.bundleStatus,
);
assertStatus(
  'accounting advanced external execution instruction pack',
  advancedExternalExecutionInstructionPack.packStatus,
);
assertStatus(
  'accounting advanced execution return evidence intake',
  advancedExecutionReturnEvidenceIntake.intakeStatus,
);
assertStatus(
  'accounting advanced external execution handoff closeout',
  advancedExternalExecutionHandoffCloseout.closeoutStatus,
);
assertStatus(
  'accounting advanced external execution tracking anchor',
  advancedExternalExecutionTrackingAnchor.trackingStatus,
);
assertStatus(
  'accounting advanced external execution status ledger',
  advancedExternalExecutionStatusLedger.ledgerStatus,
);
assertStatus(
  'accounting advanced returned evidence validation workspace',
  advancedReturnedEvidenceValidationWorkspace.validationStatus,
);
assertStatus(
  'accounting advanced external observation resolution queue',
  advancedExternalObservationResolutionQueue.queueStatus,
);
assertStatus(
  'accounting advanced external execution tracking command center',
  advancedExternalExecutionTrackingCommandCenter.commandStatus,
);
assertStatus(
  'accounting advanced external execution tracking closeout',
  advancedExternalExecutionTrackingCloseout.closeoutStatus,
);
assertStatus(
  'accounting advanced external result intake anchor',
  advancedExternalResultIntakeAnchor.intakeStatus,
);
assertStatus(
  'accounting advanced returned artifact registry',
  advancedReturnedArtifactRegistry.registryStatus,
);
assertStatus(
  'accounting advanced internal acceptance criteria workspace',
  advancedInternalAcceptanceCriteriaWorkspace.criteriaStatus,
);
assertStatus(
  'accounting advanced acceptance decision workspace',
  advancedAcceptanceDecisionWorkspace.decisionStatus,
);
assertStatus(
  'accounting advanced internal acceptance command center',
  advancedInternalAcceptanceCommandCenter.commandStatus,
);
assertStatus(
  'accounting advanced external result intake closeout',
  advancedExternalResultIntakeCloseout.closeoutStatus,
);
assertStatus(
  'accounting advanced formal record assembly anchor',
  advancedFormalRecordAssemblyAnchor.assemblyStatus,
);
assertStatus(
  'accounting advanced accepted artifact binder',
  advancedAcceptedArtifactBinder.binderStatus,
);
assertStatus(
  'accounting advanced formal record index workspace',
  advancedFormalRecordIndexWorkspace.indexStatus,
);
assertStatus(
  'accounting advanced record consistency review workspace',
  advancedRecordConsistencyReviewWorkspace.reviewStatus,
);
assertStatus(
  'accounting advanced formal record assembly command center',
  advancedFormalRecordAssemblyCommandCenter.commandStatus,
);
assertStatus(
  'accounting advanced formal record assembly closeout',
  advancedFormalRecordAssemblyCloseout.closeoutStatus,
);
assertStatus(
  'accounting advanced formal record closeout anchor',
  advancedFormalRecordCloseoutAnchor.anchorStatus,
);
assertStatus(
  'accounting advanced archive readiness workspace',
  advancedArchiveReadinessWorkspace.archiveStatus,
);
assertStatus(
  'accounting advanced formal closeout evidence packet',
  advancedFormalCloseoutEvidencePacket.packetStatus,
);
assertStatus(
  'accounting advanced professional closeout attestation boundary',
  advancedProfessionalCloseoutAttestationBoundary.boundaryStatus,
);
assertStatus(
  'accounting advanced formal record closeout command center',
  advancedFormalRecordCloseoutCommandCenter.commandStatus,
);
assertStatus(
  'accounting advanced formal record closeout closeout',
  advancedFormalRecordCloseoutCloseout.closeoutStatus,
);
assertStatus(
  'accounting advanced graduation archive handoff anchor',
  advancedGraduationArchiveHandoffAnchor.anchorStatus,
);
assertStatus(
  'accounting advanced archive handoff package',
  advancedArchiveHandoffPackage.packageStatus,
);
assertStatus(
  'accounting advanced graduation signal matrix',
  advancedGraduationSignalMatrix.matrixStatus,
);
assertStatus(
  'accounting advanced product scope decision workspace',
  advancedProductScopeDecisionWorkspace.decisionStatus,
);
assertStatus(
  'accounting advanced graduation archive handoff command center',
  advancedGraduationArchiveHandoffCommandCenter.commandStatus,
);
assertStatus(
  'accounting advanced graduation archive handoff closeout',
  advancedGraduationArchiveHandoffCloseout.closeoutStatus,
);
assertStatus(
  'full accounting candidate anchor',
  fullAccountingCandidateAnchor.anchorStatus,
);
assertStatus(
  'full accounting core ledger scope blueprint',
  fullAccountingCoreLedgerScopeBlueprint.blueprintStatus,
);
assertStatus(
  'full accounting bank reconciliation boundary',
  fullAccountingBankReconciliationBoundary.boundaryStatus,
);
assertStatus(
  'full accounting financial statements blueprint',
  fullAccountingFinancialStatementsBlueprint.blueprintStatus,
);
assertStatus(
  'full accounting legal books statutory boundary',
  fullAccountingLegalBooksStatutoryBoundary.boundaryStatus,
);
assertStatus(
  'full accounting candidate closeout',
  fullAccountingCandidateCloseout.closeoutStatus,
);
assertStatus(
  'full accounting mvp readiness anchor',
  fullAccountingMvpReadinessAnchor.anchorStatus,
);
assertStatus(
  'full accounting ledger persistence design',
  fullAccountingLedgerPersistenceDesign.designStatus,
);
assertStatus(
  'full accounting posting policy boundary',
  fullAccountingPostingPolicyBoundary.boundaryStatus,
);
assertStatus(
  'full accounting bank feed reconciliation readiness',
  fullAccountingBankFeedReconciliationReadiness.readinessStatus,
);
assertStatus(
  'full accounting trial balance statement readiness',
  fullAccountingTrialBalanceStatementReadiness.readinessStatus,
);
assertStatus(
  'full accounting mvp readiness closeout',
  fullAccountingMvpReadinessCloseout.closeoutStatus,
);
assertStatus(
  'full accounting mvp operations anchor',
  fullAccountingMvpOperationsAnchor.anchorStatus,
);
assertStatus(
  'full accounting ledger workbench mvp',
  fullAccountingLedgerWorkbenchMvp.workbenchStatus,
);
assertStatus(
  'full accounting posting draft lane',
  fullAccountingPostingDraftLane.laneStatus,
);
assertStatus(
  'full accounting bank reconciliation workbench mvp',
  fullAccountingBankReconciliationWorkbenchMvp.workbenchStatus,
);
assertStatus(
  'full accounting trial balance preview workbench',
  fullAccountingTrialBalancePreviewWorkbench.previewStatus,
);
assertStatus(
  'full accounting mvp operations closeout',
  fullAccountingMvpOperationsCloseout.closeoutStatus,
);
assertStatus(
  'full accounting controlled pilot anchor',
  fullAccountingControlledPilotAnchor.anchorStatus,
);
assertStatus(
  'full accounting pilot enrollment period freeze',
  fullAccountingPilotEnrollmentPeriodFreeze.enrollmentStatus,
);
assertStatus(
  'full accounting pilot runbook workspace',
  fullAccountingPilotRunbookWorkspace.runbookStatus,
);
assertStatus(
  'full accounting pilot accountant review room',
  fullAccountingPilotAccountantReviewRoom.reviewStatus,
);
assertStatus(
  'full accounting pilot outcome packet',
  fullAccountingPilotOutcomePacket.outcomeStatus,
);
assertStatus(
  'full accounting controlled pilot closeout',
  fullAccountingControlledPilotCloseout.closeoutStatus,
);
assertStatus(
  'full accounting graduation anchor',
  fullAccountingGraduationAnchor.anchorStatus,
);
assertStatus(
  'full accounting graduation evidence dossier',
  fullAccountingGraduationEvidenceDossier.dossierStatus,
);
assertStatus(
  'full accounting product scope graduation matrix',
  fullAccountingProductScopeGraduationMatrix.matrixStatus,
);
assertStatus(
  'full accounting professional operating model',
  fullAccountingProfessionalOperatingModel.modelStatus,
);
assertStatus(
  'full accounting graduation risk control pack',
  fullAccountingGraduationRiskControlPack.packStatus,
);
assertStatus(
  'full accounting graduation closeout',
  fullAccountingGraduationCloseout.closeoutStatus,
);
assertStatus(
  'full accounting product design anchor',
  fullAccountingProductDesignAnchor.anchorStatus,
);
assertStatus(
  'full accounting product scope contract',
  fullAccountingProductScopeContract.contractStatus,
);
assertStatus(
  'full accounting product professional responsibility matrix',
  fullAccountingProductProfessionalResponsibilityMatrix.matrixStatus,
);
assertStatus(
  'full accounting official artifact boundary registry',
  fullAccountingOfficialArtifactBoundaryRegistry.registryStatus,
);
assertStatus(
  'full accounting workflow control blueprint',
  fullAccountingWorkflowControlBlueprint.blueprintStatus,
);
assertStatus(
  'full accounting product design closeout',
  fullAccountingProductDesignCloseout.closeoutStatus,
);
assertStatus(
  'full accounting formal readiness anchor',
  fullAccountingFormalReadinessAnchor.anchorStatus,
);
assertStatus(
  'full accounting policy template registry',
  fullAccountingPolicyTemplateRegistry.registryStatus,
);
assertStatus(
  'full accounting professional portal readiness shell',
  fullAccountingProfessionalPortalReadinessShell.shellStatus,
);
assertStatus(
  'full accounting formal ledger posting readiness pack',
  fullAccountingFormalLedgerPostingReadinessPack.packStatus,
);
assertStatus(
  'full accounting statement bank formal boundary pack',
  fullAccountingStatementBankFormalBoundaryPack.packStatus,
);
assertStatus(
  'full accounting formal readiness closeout',
  fullAccountingFormalReadinessCloseout.closeoutStatus,
);
assertStatus(
  'full accounting formal artifact drafting anchor',
  fullAccountingFormalArtifactDraftingAnchor.anchorStatus,
);
assertStatus(
  'full accounting formal ledger draft pack',
  fullAccountingFormalLedgerDraftPack.packStatus,
);
assertStatus(
  'full accounting posting approval draft pack',
  fullAccountingPostingApprovalDraftPack.packStatus,
);
assertStatus(
  'full accounting bank reconciliation evidence draft pack',
  fullAccountingBankReconciliationEvidenceDraftPack.packStatus,
);
assertStatus(
  'full accounting trial balance financial statement draft pack',
  fullAccountingTrialBalanceFinancialStatementDraftPack.packStatus,
);
assertStatus(
  'full accounting formal artifact drafting closeout',
  fullAccountingFormalArtifactDraftingCloseout.closeoutStatus,
);
assertStatus(
  'full accounting professional review execution anchor',
  fullAccountingProfessionalReviewExecutionAnchor.anchorStatus,
);
assertStatus(
  'full accounting accountant draft review room',
  fullAccountingAccountantDraftReviewRoom.roomStatus,
);
assertStatus(
  'full accounting review change request pack',
  fullAccountingReviewChangeRequestPack.packStatus,
);
assertStatus(
  'full accounting professional approval recommendation pack',
  fullAccountingProfessionalApprovalRecommendationPack.packStatus,
);
assertStatus(
  'full accounting review execution command center',
  fullAccountingReviewExecutionCommandCenter.commandStatus,
);
assertStatus(
  'full accounting professional review execution closeout',
  fullAccountingProfessionalReviewExecutionCloseout.closeoutStatus,
);
assertStatus(
  'full accounting formal approval workflow anchor',
  fullAccountingFormalApprovalWorkflowAnchor.anchorStatus,
);
assertStatus(
  'full accounting approval authority matrix',
  fullAccountingApprovalAuthorityMatrix.matrixStatus,
);
assertStatus(
  'full accounting formal approval evidence pack',
  fullAccountingFormalApprovalEvidencePack.packStatus,
);
assertStatus(
  'full accounting approval decision workspace',
  fullAccountingApprovalDecisionWorkspace.workspaceStatus,
);
assertStatus(
  'full accounting formal approval command center',
  fullAccountingFormalApprovalCommandCenter.commandStatus,
);
assertStatus(
  'full accounting formal approval workflow closeout',
  fullAccountingFormalApprovalWorkflowCloseout.closeoutStatus,
);
assertStatus(
  'full accounting signature certification boundary anchor',
  fullAccountingSignatureCertificationBoundaryAnchor.anchorStatus,
);
assertStatus(
  'full accounting formal signatory registry',
  fullAccountingFormalSignatoryRegistry.registryStatus,
);
assertStatus(
  'full accounting signature evidence readiness pack',
  fullAccountingSignatureEvidenceReadinessPack.packStatus,
);
assertStatus(
  'full accounting certification requirement workspace',
  fullAccountingCertificationRequirementWorkspace.workspaceStatus,
);
assertStatus(
  'full accounting legalization boundary packet',
  fullAccountingLegalizationBoundaryPacket.packetStatus,
);
assertStatus(
  'full accounting signature certification boundary closeout',
  fullAccountingSignatureCertificationBoundaryCloseout.closeoutStatus,
);
assertStatus(
  'full accounting external execution handoff anchor',
  fullAccountingExternalExecutionHandoffAnchor.anchorStatus,
);
assertStatus(
  'full accounting external executor assignment matrix',
  fullAccountingExternalExecutorAssignmentMatrix.matrixStatus,
);
assertStatus(
  'full accounting execution handoff evidence bundle',
  fullAccountingExecutionHandoffEvidenceBundle.bundleStatus,
);
assertStatus(
  'full accounting external execution instruction pack',
  fullAccountingExternalExecutionInstructionPack.packStatus,
);
assertStatus(
  'full accounting execution return evidence intake',
  fullAccountingExecutionReturnEvidenceIntake.intakeStatus,
);
assertStatus(
  'full accounting external execution handoff closeout',
  fullAccountingExternalExecutionHandoffCloseout.closeoutStatus,
);
assertStatus(
  'full accounting external execution tracking anchor',
  fullAccountingExternalExecutionTrackingAnchor.trackingStatus,
);
assertStatus(
  'full accounting external execution status ledger',
  fullAccountingExternalExecutionStatusLedger.ledgerStatus,
);
assertStatus(
  'full accounting returned evidence validation workspace',
  fullAccountingReturnedEvidenceValidationWorkspace.validationStatus,
);
assertStatus(
  'full accounting external observation resolution queue',
  fullAccountingExternalObservationResolutionQueue.queueStatus,
);
assertStatus(
  'full accounting external execution tracking command center',
  fullAccountingExternalExecutionTrackingCommandCenter.commandStatus,
);
assertStatus(
  'full accounting external execution tracking closeout',
  fullAccountingExternalExecutionTrackingCloseout.closeoutStatus,
);
assertStatus(
  'full accounting external result intake anchor',
  fullAccountingExternalResultIntakeAnchor.intakeStatus,
);
assertStatus(
  'full accounting returned artifact registry',
  fullAccountingReturnedArtifactRegistry.registryStatus,
);
assertStatus(
  'full accounting internal acceptance criteria workspace',
  fullAccountingInternalAcceptanceCriteriaWorkspace.criteriaStatus,
);
assertStatus(
  'full accounting acceptance decision workspace',
  fullAccountingAcceptanceDecisionWorkspace.decisionStatus,
);
assertStatus(
  'full accounting internal acceptance command center',
  fullAccountingInternalAcceptanceCommandCenter.commandStatus,
);
assertStatus(
  'full accounting external result intake closeout',
  fullAccountingExternalResultIntakeCloseout.closeoutStatus,
);
assertStatus('full accounting formal record assembly anchor', fullAccountingFormalRecordAssemblyAnchor.assemblyStatus);
assertStatus('full accounting accepted artifact binder', fullAccountingAcceptedArtifactBinder.binderStatus);
assertStatus('full accounting formal record index workspace', fullAccountingFormalRecordIndexWorkspace.indexStatus);
assertStatus('full accounting record consistency review workspace', fullAccountingRecordConsistencyReviewWorkspace.reviewStatus);
assertStatus('full accounting formal record assembly command center', fullAccountingFormalRecordAssemblyCommandCenter.commandStatus);
assertStatus('full accounting formal record assembly closeout', fullAccountingFormalRecordAssemblyCloseout.closeoutStatus);
if (!Array.isArray(advancedDiscoveryCloseout.closeoutChecklist)) {
  throw new Error('advanced-discovery/closeout no devolvio checklist[].');
}
if (!Array.isArray(advancedMvpReadinessCloseout.closeoutChecklist)) {
  throw new Error('advanced-mvp-readiness/closeout no devolvio checklist[].');
}
if (!Array.isArray(advancedMvpOperatingCloseout.closeoutChecklist)) {
  throw new Error('advanced-mvp-operations/closeout no devolvio checklist[].');
}
if (!Array.isArray(advancedPilotCloseout.closeoutChecklist)) {
  throw new Error('advanced-pilot/closeout no devolvio checklist[].');
}
if (!Array.isArray(advancedGraduationCloseout.closeoutChecklist)) {
  throw new Error('advanced-graduation/closeout no devolvio checklist[].');
}
if (!Array.isArray(advancedFormalDesignCloseout.closeoutChecklist)) {
  throw new Error('advanced-formal-design/closeout no devolvio checklist[].');
}
if (!Array.isArray(advancedFormalDraftingCloseout.closeoutChecklist)) {
  throw new Error('advanced-formal-drafting/closeout no devolvio checklist[].');
}
if (!Array.isArray(advancedProfessionalReviewCloseout.closeoutChecklist)) {
  throw new Error(
    'advanced-professional-review/closeout no devolvio checklist[].',
  );
}
if (!Array.isArray(advancedFormalApprovalCloseout.closeoutChecklist)) {
  throw new Error('advanced-formal-approval/closeout no devolvio checklist[].');
}
if (!Array.isArray(advancedSignatureCertificationCloseout.closeoutChecklist)) {
  throw new Error(
    'advanced-signature-certification/closeout no devolvio checklist[].',
  );
}
if (!Array.isArray(advancedExternalExecutionHandoffCloseout.closeoutChecklist)) {
  throw new Error(
    'advanced-external-execution-handoff/closeout no devolvio checklist[].',
  );
}
if (
  !Array.isArray(advancedExternalExecutionTrackingCloseout.closeoutChecklist)
) {
  throw new Error(
    'advanced-external-execution-tracking/closeout no devolvio checklist[].',
  );
}
if (!Array.isArray(advancedExternalResultIntakeCloseout.closeoutChecklist)) {
  throw new Error(
    'advanced-external-result-intake/closeout no devolvio checklist[].',
  );
}
if (!Array.isArray(advancedFormalRecordAssemblyCloseout.closeoutChecklist)) {
  throw new Error(
    'advanced-formal-record-assembly/closeout no devolvio checklist[].',
  );
}
if (!Array.isArray(advancedFormalRecordCloseoutCloseout.closeoutChecklist)) {
  throw new Error(
    'advanced-formal-record-closeout/closeout no devolvio checklist[].',
  );
}
if (!Array.isArray(advancedGraduationArchiveHandoffCloseout.closeoutChecklist)) {
  throw new Error(
    'advanced-graduation-archive-handoff/closeout no devolvio checklist[].',
  );
}
if (!Array.isArray(fullAccountingCandidateCloseout.closeoutChecklist)) {
  throw new Error(
    'full-accounting-candidate/closeout no devolvio checklist[].',
  );
}
if (!Array.isArray(fullAccountingMvpReadinessCloseout.closeoutChecklist)) {
  throw new Error(
    'full-accounting-mvp-readiness/closeout no devolvio checklist[].',
  );
}
if (!Array.isArray(fullAccountingMvpOperationsCloseout.closeoutChecklist)) {
  throw new Error(
    'full-accounting-mvp-operations/closeout no devolvio checklist[].',
  );
}
if (!Array.isArray(fullAccountingControlledPilotCloseout.closeoutChecklist)) {
  throw new Error(
    'full-accounting-controlled-pilot/closeout no devolvio checklist[].',
  );
}
if (!Array.isArray(fullAccountingGraduationCloseout.closeoutChecklist)) {
  throw new Error(
    'full-accounting-graduation/closeout no devolvio checklist[].',
  );
}
if (!Array.isArray(fullAccountingProductDesignCloseout.closeoutChecklist)) {
  throw new Error(
    'full-accounting-product-design/closeout no devolvio checklist[].',
  );
}
if (!Array.isArray(fullAccountingFormalReadinessCloseout.closeoutChecklist)) {
  throw new Error(
    'full-accounting-formal-readiness/closeout no devolvio checklist[].',
  );
}
if (
  !Array.isArray(
    fullAccountingFormalArtifactDraftingCloseout.closeoutChecklist,
  )
) {
  throw new Error(
    'full-accounting-formal-artifact-drafting/closeout no devolvio checklist[].',
  );
}
if (
  !Array.isArray(
    fullAccountingProfessionalReviewExecutionCloseout.closeoutChecklist,
  )
) {
  throw new Error(
    'full-accounting-professional-review-execution/closeout no devolvio checklist[].',
  );
}
if (!Array.isArray(fullAccountingFormalApprovalWorkflowCloseout.closeoutChecklist)) {
  throw new Error(
    'full-accounting-formal-approval/closeout no devolvio checklist[].',
  );
}
if (
  !Array.isArray(
    fullAccountingSignatureCertificationBoundaryCloseout.closeoutChecklist,
  )
) {
  throw new Error(
    'full-accounting-signature-certification/closeout no devolvio checklist[].',
  );
}
if (
  !Array.isArray(
    fullAccountingExternalExecutionHandoffCloseout.closeoutChecklist,
  )
) {
  throw new Error(
    'full-accounting-external-execution-handoff/closeout no devolvio checklist[].',
  );
}
if (
  !Array.isArray(
    fullAccountingExternalExecutionTrackingCloseout.closeoutChecklist,
  )
) {
  throw new Error(
    'full-accounting-external-execution-tracking/closeout no devolvio checklist[].',
  );
}
if (
  !Array.isArray(
    fullAccountingExternalResultIntakeCloseout.closeoutChecklist,
  )
) {
  throw new Error(
    'full-accounting-external-result-intake/closeout no devolvio checklist[].',
  );
}
if (!Array.isArray(fullAccountingFormalRecordAssemblyCloseout.closeoutChecklist)) {
  throw new Error('full-accounting-formal-record-assembly/closeout no devolvio checklist[].');
}
printLine(
  'foundation pack v2',
  `${foundationCloseoutPackV2.summary.completedCapabilityCount}/${foundationCloseoutPackV2.summary.capabilityCount} capabilities, ${foundationCloseoutPackV2.closeoutStatus}`,
);
printLine(
  'tax feedback bridge',
  `${taxComplianceFeedbackBridge.summary.usableSignalCount}/${taxComplianceFeedbackBridge.summary.signalCount} signals, ${taxComplianceFeedbackBridge.bridgeStatus}`,
);
printLine(
  'tax evidence bridge',
  `${taxDeclarationEvidenceBridge.summary.highConfidenceLineCount}/${taxDeclarationEvidenceBridge.summary.evidenceLineCount} lines, ${taxDeclarationEvidenceBridge.evidenceStatus}`,
);
printLine(
  'advanced discovery',
  `${advancedDiscoveryCloseout.summary.formalNeedCount} formal needs, ${advancedDiscoveryCloseout.finalDecision}`,
);
printLine(
  'advanced scope',
  `${advancedDiscoveryReadinessPacket.scopeRecommendation.minimumScope}, ${advancedDiscoveryReadinessPacket.scopeRecommendation.recommendedAction}`,
);
printLine(
  'advanced mvp',
  `${advancedMvpReadinessCloseout.summary.approvedLaneCount} approved lanes, ${advancedMvpReadinessCloseout.finalDecision}`,
);
printLine(
  'advanced audit',
  `${advancedAuditTrailReadinessPacket.summary.evidenceRefCount} evidence refs, ${advancedAuditTrailReadinessPacket.packetStatus}`,
);
printLine(
  'advanced operations',
  `${advancedMvpOperatingCloseout.commandCenter.executionAnchor.operatingMode}, ${advancedMvpOperatingCloseout.finalDecision}`,
);
printLine(
  'advanced command',
  `${advancedMvpCommandCenter.summary.readyLaneCount}/${advancedMvpCommandCenter.summary.laneCount} lanes, ${advancedMvpCommandCenter.commandStatus}`,
);
printLine(
  'advanced pilot',
  `${advancedPilotCloseout.finalOutcome}, ${advancedPilotCloseout.closeoutStatus}`,
);
printLine(
  'advanced graduation',
  `${advancedGraduationCloseout.finalDecision}, ${advancedGraduationCloseout.closeoutStatus}`,
);
printLine(
  'advanced formal readiness',
  `${advancedFormalReadinessCertifiedBankCloseout.finalDecision}, ${advancedFormalReadinessCertifiedBankCloseout.closeoutStatus}`,
);
printLine(
  'advanced formal design',
  `${advancedFormalDesignCloseout.finalDecision}, ${advancedFormalDesignCloseout.closeoutStatus}`,
);

printSection('Accounting foundation smoke OK');
