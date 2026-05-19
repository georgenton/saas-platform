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

async function main() {
  loadDotEnv();

  const baseUrl = normalizeBaseUrl(
    getArg('base-url', 'http://127.0.0.1:3000/api'),
  );
  const tenantSlug = getArg('tenant-slug', 'saas-platform-local');
  const bootstrapRemoteSandbox =
    hasFlag('bootstrap-remote-sandbox') ||
    toBoolean(getArg('bootstrap-remote-sandbox', 'false'));
  const syncIssuerTaxIdExplicit =
    hasFlag('sync-issuer-tax-id') ||
    toBoolean(getArg('sync-issuer-tax-id', 'false'));
  const syncIssuerTaxId = syncIssuerTaxIdExplicit || bootstrapRemoteSandbox;
  const requireRemoteReady =
    hasFlag('require-remote-ready') ||
    toBoolean(getArg('require-remote-ready', 'false'));

  const token = resolveToken();

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

  printSection('Electronic Signature Inspection');
  printLine('tenantSlug', inspectionResponse.tenantSlug);
  printLine('status', inspection.status);
  printLine('probeMethod', inspection.probeMethod);
  printLine('detail', inspection.detail);
  printLine('extractedTaxId', inspection.extractedTaxId);
  printLine('certificateValidityStatus', inspection.certificateValidityStatus);
  printLine('cryptographicProofStatus', inspection.cryptographicProofStatus);

  let issuerProfile = null;
  let issuerProfileFetchError = null;

  try {
    issuerProfile = await apiRequest({
      baseUrl,
      path: `/invoicing/tenants/${encodeURIComponent(
        tenantSlug,
      )}/electronic-profile`,
      token,
    });
  } catch (error) {
    issuerProfileFetchError = error;
  }

  if (issuerProfile) {
    printSection('Issuer Profile');
    printLine('legalName', issuerProfile.legalName);
    printLine('taxId', issuerProfile.taxId);
    printLine('environment', issuerProfile.environment);
  } else {
    printSection('Issuer Profile');
    printLine('status', 'not_configured');
    printLine(
      'detail',
      issuerProfileFetchError instanceof Error
        ? issuerProfileFetchError.message
        : 'Issuer profile is not configured.',
    );
  }

  if (
    syncIssuerTaxId &&
    issuerProfile &&
    inspection.extractedTaxId &&
    issuerProfile.taxId !== inspection.extractedTaxId
  ) {
    printSection('Issuer Alignment Action');
    printLine('action', 'upsert electronic profile using extracted certificate tax id');

    issuerProfile = await apiRequest({
      baseUrl,
      path: `/invoicing/tenants/${encodeURIComponent(
        tenantSlug,
      )}/electronic-profile/sync-certificate-tax-id`,
      token,
      method: 'POST',
    });

    printLine('updatedTaxId', issuerProfile.taxId);
  } else if (syncIssuerTaxId) {
    printSection('Issuer Alignment Action');
    if (!issuerProfile) {
      printLine(
        'result',
        'skipped: issuer profile is missing, so the script cannot align taxId automatically.',
      );
    } else if (!inspection.extractedTaxId) {
      printLine(
        'result',
        'skipped: the certificate inspection did not expose an extracted tax id.',
      );
    } else {
      printLine('result', 'skipped: issuer profile tax id already matches certificate.');
    }
  }

  const readiness = await apiRequest({
    baseUrl,
    path: `/invoicing/tenants/${encodeURIComponent(
      tenantSlug,
    )}/electronic-document/readiness`,
    token,
  });

  printSection('Sandbox Readiness');
  printLine(
    'isReadyForRemoteSandboxSubmission',
    readiness.isReadyForRemoteSandboxSubmission,
  );
  printLine(
    'isReadyForPresignedRemoteSandboxSubmission',
    readiness.isReadyForPresignedRemoteSandboxSubmission,
  );
  printLine(
    'internalSignerIssuerAlignmentStatus',
    readiness.internalSignerIssuerAlignmentStatus,
  );
  printLine(
    'internalSignerIssuerAlignmentDetail',
    readiness.internalSignerIssuerAlignmentDetail,
  );
  printLine(
    'internalSignerExtractedTaxId',
    readiness.internalSignerExtractedTaxId,
  );
  printLine(
    'internalSignerOfflineCompatibilityStatus',
    readiness.internalSignerOfflineCompatibilityStatus,
  );
  printLine('latestRemoteSriSubmissionStatus', readiness.latestRemoteSriSubmissionStatus);
  printLine(
    'latestRemoteSriSubmissionSummary',
    readiness.latestRemoteSriSubmissionSummary,
  );
  printLine('recommendedNextStep', readiness.recommendedNextStep);

  if (Array.isArray(readiness.blockers) && readiness.blockers.length > 0) {
    printSection('Blockers');
    for (const blocker of readiness.blockers) {
      printLine('blocker', blocker);
    }
  }

  if (Array.isArray(readiness.warnings) && readiness.warnings.length > 0) {
    printSection('Warnings');
    for (const warning of readiness.warnings) {
      printLine('warning', warning);
    }
  }

  if (requireRemoteReady && !readiness.isReadyForRemoteSandboxSubmission) {
    process.exitCode = 1;
    printSection('Result');
    printLine(
      'status',
      'failed: remote sandbox readiness is still blocked for internal signer flow.',
    );
    return;
  }

  printSection('Result');
  printLine('status', 'ok');
}

main().catch((error) => {
  process.stderr.write(
    `${error instanceof Error ? error.message : String(error)}\n`,
  );
  process.exit(1);
});
