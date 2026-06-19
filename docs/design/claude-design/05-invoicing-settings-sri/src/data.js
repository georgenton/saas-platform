/* Mock data for slice 05 — Invoicing Settings · Ecuador SRI preparation.
   Refines the operational settings + readiness area implemented in
   apps/web-platform/src/features/invoicing/workspace-settings.tsx.

   RECONCILED against the frozen backend contract (apps/web-platform/src/app/types.ts):
     IssuerProfileResponse · InvoiceNumberingSettingsResponse ·
     ElectronicSignatureSettingsResponse · ElectronicSignatureMaterialInspectionResponse ·
     ElectronicSubmissionSettingsResponse · ElectronicSandboxReadinessResponse.
   Field names, enums and shapes below match those types 1:1 so the design maps
   directly onto the real forms in workspace-settings.tsx. No endpoints invented.

   window.SETTINGS_DATA carries shell context (reused from slices 00/02/03) and
   one SCENARIO per state the handoff asks us to design explicitly. The readiness
   verdict is DERIVED from the sandbox-readiness tiers (local stub → presigned
   remote → remote internal), never assumed. */
(function () {
  /* ---- canonical healthy certificate inspection (PKCS#12 likely_usable) ---- */
  function inspectionHealthy() {
    return {
      status: 'likely_usable',
      detail: 'El keystore PKCS#12 se abrió y el certificado es legible.',
      encoding: 'base64_der',
      probeMethod: 'openssl_pkcs12',
      certificateValidityStatus: 'valid',
      cryptographicProofStatus: 'verified',
      cryptographicProofDetail: 'Se firmó y verificó un reto interno con la clave privada.',
      passwordPresent: true,
      hasAdvisoryWarning: false,
      fingerprintPresent: true,
      subjectNamePresent: true,
      extractedFingerprint: 'A1:0F:88:4C:7E:22:9B:D3:61:04:FE:5A:88:C9:33:71:6E:0B:2D:4A',
      extractedTaxId: '1790012345001',
      extractedSubjectName: 'CN=ACME LOGISTICA S.A., O=ACME LOGISTICA S.A., C=EC',
      extractedIssuerName: 'CN=AC SECURITY DATA S.A. 2, O=SECURITY DATA, C=EC',
      validFrom: '2024-11-08',
      validUntil: '2026-11-08',
      daysUntilExpiry: 510,
      byteLength: 4096
    };
  }

  /* ---- the four settings forms (healthy baseline) ---------------------- */
  function issuerHealthy() {
    return {
      legalName: 'Acme Logística S.A.',
      commercialName: 'Acme Logística',
      taxId: '1790012345001',
      environment: 'production',         // 'test' | 'production'
      emissionType: 'normal',
      accountingObligated: true,
      specialTaxpayerCode: '5368',
      rimpeTaxpayerType: '',             // '' = no RIMPE regime
      matrixAddress: 'Av. Amazonas N34-120 y Av. Atahualpa, Quito',
      establishmentAddress: 'Av. Amazonas N34-120, local 3, Quito',
      taxIdMatchesCertificate: true,     // vs extracted cert tax id
      extractedCertificateTaxId: '1790012345001'
    };
  }
  function numberingHealthy() {
    return {
      documentCode: '01',                // CodDoc
      documentLabel: 'Factura',
      establishmentCode: '001',          // Estab
      emissionPointCode: '001',          // PtoEmi
      nextSequenceNumber: 148,
      previewNumber: '001-001-000000148',
      otherPoints: [
        { documentCode: '04', documentLabel: 'Nota de crédito', previewNumber: '001-001-000000037' },
        { documentCode: '07', documentLabel: 'Comprobante de retención', previewNumber: '001-001-000000061' }
      ]
    };
  }
  function signatureHealthy() {
    return {
      provider: 'xades_pkcs12',          // 'stub_local' | 'xades_pkcs12'
      storageMode: 'secret_ref',         // 'stub_inline' | 'secret_ref'
      certificateLabel: 'Firma Legal · Security Data 2024',
      subjectName: 'CN=ACME LOGISTICA S.A., O=ACME LOGISTICA S.A.',
      certificateFingerprint: 'A1:0F:88:4C:7E:22:9B:D3:61:04:FE:5A:88:C9:33:71:6E:0B:2D:4A',
      pkcs12SecretRef: 'vault://ec/signatures/acme-logistica/pkcs12',
      passwordSecretRef: 'vault://ec/signatures/acme-logistica/password',
      hydrateMetadataFromPkcs12: true,
      materialConfigured: true,
      isActive: true,
      inspection: inspectionHealthy()
    };
  }
  function submissionHealthy() {
    return {
      provider: 'sri_offline_ws',        // 'stub_sri' | 'sri_offline_ws'
      environment: 'production',
      transmissionMode: 'offline',       // 'sync_stub' | 'offline'
      receptionUrl: 'https://cel.sri.gob.ec/comprobantes-electronicos-ws/RecepcionComprobantesOffline?wsdl',
      authorizationUrl: 'https://cel.sri.gob.ec/comprobantes-electronicos-ws/AutorizacionComprobantesOffline?wsdl',
      credentialsSecretRef: 'vault://ec/sri/acme-logistica',
      timeoutMs: 30000,
      gatewayConfigured: true,
      isActive: true
    };
  }

  /* ---- ElectronicSandboxReadinessResponse (healthy baseline) ----------- */
  function documentSupportHealthy() {
    return [
      { documentCode: '01', label: 'Factura', numberingConfigured: true, previewAvailable: true, rideAvailable: true, schemaValidationAvailable: true, submitSupported: true, detail: 'Factura lista para emisión electrónica.' },
      { documentCode: '04', label: 'Nota de crédito', numberingConfigured: true, previewAvailable: true, rideAvailable: true, schemaValidationAvailable: true, submitSupported: true, detail: 'Nota de crédito habilitada.' },
      { documentCode: '05', label: 'Nota de débito', numberingConfigured: true, previewAvailable: true, rideAvailable: true, schemaValidationAvailable: true, submitSupported: true, detail: 'Nota de débito habilitada.' },
      { documentCode: '07', label: 'Comprobante de retención', numberingConfigured: true, previewAvailable: true, rideAvailable: true, schemaValidationAvailable: true, submitSupported: true, detail: 'Retención habilitada.' },
      { documentCode: '06', label: 'Guía de remisión', numberingConfigured: false, previewAvailable: true, rideAvailable: true, schemaValidationAvailable: true, submitSupported: false, detail: 'Falta configurar numeración para guía de remisión.' }
    ];
  }
  function readinessHealthy() {
    return {
      stage: 'electronic_invoicing_ec_mvp',
      environment: 'production',
      signatureProvider: 'xades_pkcs12',
      submissionProvider: 'sri_offline_ws',
      transmissionMode: 'offline',
      internalSignerMaterialStatus: 'likely_usable',
      internalSignerMaterialDetail: 'Keystore PKCS#12 abrible y certificado legible.',
      isInternalSignerMaterialReady: true,
      internalSignerCertificateValidityStatus: 'valid',
      internalSignerCertificateValidityDetail: 'El certificado está vigente.',
      internalSignerCertificateValidUntil: '2026-11-08',
      isInternalSignerCertificateCurrentlyValid: true,
      internalSignerCryptoProofStatus: 'verified',
      internalSignerCryptoProofDetail: 'Reto firmado y verificado con la clave privada.',
      isInternalSignerCryptographicallyReady: true,
      internalSignerOfflineCompatibilityStatus: 'verified',
      internalSignerOfflineCompatibilityDetail: 'Firma compatible con el esquema offline del SRI.',
      isInternalSignerOfflineCompatible: true,
      internalSignerIssuerAlignmentStatus: 'matched',
      internalSignerIssuerAlignmentDetail: 'El RUC del perfil coincide con el certificado.',
      internalSignerExtractedTaxId: '1790012345001',
      isInternalSignerIssuerAligned: true,
      latestRemoteSriSubmissionStatus: 'RECEIVED',
      latestRemoteSriSubmissionSummary: 'Último envío de prueba recibido por el SRI sin observaciones.',
      latestRemoteSriSubmissionCategory: null,
      latestRemoteSriSubmissionOccurredAt: '2026-06-15T14:32:07-05:00',
      isReadyForLocalStubSubmission: true,
      isReadyForRemoteSandboxSubmission: true,
      isReadyForPresignedRemoteSandboxSubmission: true,
      blockers: [],
      warnings: [],
      checks: [
        { key: 'issuer_profile', label: 'Perfil fiscal del emisor', status: 'ready', detail: 'Razón social, RUC y direcciones completas.' },
        { key: 'numbering', label: 'Numeración de facturas', status: 'ready', detail: 'Serie 001-001 con secuencial activo.' },
        { key: 'signature_material', label: 'Material de firma', status: 'ready', detail: 'PKCS#12 cargable y verificado.' },
        { key: 'certificate_validity', label: 'Vigencia del certificado', status: 'ready', detail: 'Vence el 08 nov 2026.' },
        { key: 'crypto_proof', label: 'Prueba criptográfica', status: 'ready', detail: 'Firma de reto verificada.' },
        { key: 'issuer_alignment', label: 'Alineación emisor-certificado', status: 'ready', detail: 'RUC alineado.' },
        { key: 'gateway', label: 'Gateway SRI', status: 'ready', detail: 'Producción · recepción y autorización configuradas.' }
      ],
      documentSupport: documentSupportHealthy(),
      recommendedNextStep: 'Todo listo: puedes emitir comprobantes electrónicos en producción desde el listado de facturas.'
    };
  }

  function base() {
    return {
      label: '', permission: { canManage: true, role: 'Owner' },
      canSyncIssuerTaxId: true,
      issuer: issuerHealthy(), numbering: numberingHealthy(),
      signature: signatureHealthy(), submission: submissionHealthy(),
      readiness: readinessHealthy()
    };
  }

  window.SETTINGS_DATA = {
    /* GET /api/auth/me + /api/tenancy/tenants/{slug} */
    user: { name: 'José Quizá Manchuro', email: 'jose@acme-logistica.ec', role: 'owner' },
    tenant: { name: 'Acme Logística S.A.', slug: 'acme-logistica', ruc: '1790012345001', role: 'Owner', environment: 'production' },
    memberships: [
      { name: 'Acme Logística S.A.', slug: 'acme-logistica', role: 'Owner' },
      { name: 'Andes Salud', slug: 'andes-salud', role: 'Operator' }
    ],

    /* GET /api/tenancy/tenants/{slug}/products — sidebar nav (Invoicing active) */
    products: [
      { key: 'dashboard', name: 'Dashboard', group: 'Core', icon: 'dashboard', state: 'enabled' },
      { key: 'invoicing', name: 'Invoicing', group: 'Finance', icon: 'invoicing', state: 'enabled', badge: 3 },
      { key: 'tax-compliance-ec', name: 'Tax Compliance EC', group: 'Finance', icon: 'tax', state: 'limited', note: 'View only — needs tax.manage' },
      { key: 'accounting', name: 'Accounting', group: 'Finance', icon: 'accounting', state: 'locked', note: 'Available on Scale' },
      { key: 'ecommerce', name: 'Ecommerce', group: 'Commerce', icon: 'ecommerce', state: 'enabled' },
      { key: 'growth', name: 'Growth', group: 'Commerce', icon: 'growth', state: 'enabled', badge: 3 },
      { key: 'ai-console', name: 'AI Console', group: 'Platform', icon: 'ai', state: 'limited', note: 'Approvals restricted' },
      { key: 'parties', name: 'Parties', group: 'Platform', icon: 'parties', state: 'enabled' },
      { key: 'medical', name: 'Medical Clinics', group: 'Clinics', icon: 'medical', state: 'available', note: '$39 / mo add-on' },
      { key: 'psychology', name: 'Psychology Clinics', group: 'Clinics', icon: 'psychology', state: 'disabled', note: 'Not enabled' },
      { key: 'settings', name: 'Settings', group: 'Platform', icon: 'settings', state: 'enabled' }
    ],

    backendError: { title: 'No pudimos cargar la configuración del SRI', message: 'No pudimos consultar el perfil electrónico ni la preparación de sandbox (GET /api/invoicing/tenants/acme-logistica/electronic-profile).', correlationId: 'req_5be2d144' },

    /* AI assistant — suggestion-first, never autonomous */
    assistant: {
      greeting: 'Hola José — revisé la configuración electrónica de este tenant.',
      disclaimer: 'El asistente prepara y explica. No firma, configura ni declara nada ante el SRI sin tu aprobación.',
      suggestions: [
        { icon: 'key', tone: 'warning', title: 'Tu firma vence pronto', body: 'El certificado caduca en 21 días. Puedo dejarte el recordatorio listo y abrir el formulario cuando tengas el nuevo PKCS#12.', action: 'Preparar renovación' },
        { icon: 'shieldCheck', tone: 'info', title: 'Revisión de preparación', body: 'Reviso los cuatro bloques (emisor, numeración, firma y gateway) y la preparación de sandbox, y te resumo qué falta.', action: 'Revisar preparación' }
      ]
    },

    moods: [
      { key: 'comfort', label: 'Comfort', desc: 'Balanced, corporate-friendly' },
      { key: 'focus', label: 'Focus', desc: 'Denser, stronger hierarchy' },
      { key: 'calm', label: 'Calm', desc: 'Softer, gentle contrast' },
      { key: 'high-contrast', label: 'High contrast', desc: 'Accessibility-first' },
      { key: 'night', label: 'Night', desc: 'Low-glare dark' }
    ],

    /* -------------------------------------------------------------------
       SCENARIOS — one per state the handoff asks us to design explicitly.
       ------------------------------------------------------------------- */
    scenarios: (function () {
      const S = {};

      /* 1 — healthy / ready: remote-internal sandbox tier, nothing urgent */
      S.ready = (function () {
        const s = base();
        s.label = 'Listo / saludable';
        s.readiness.recommendedNextStep = 'Todo listo: el emisor, la numeración, la firma y el gateway están verificados. Puedes emitir comprobantes electrónicos en producción.';
        return s;
      })();

      /* 2 — issuer incomplete: matrix + establishment address missing */
      S.issuer_incomplete = (function () {
        const s = base();
        s.label = 'Emisor incompleto';
        s.issuer = Object.assign(issuerHealthy(), { matrixAddress: '', establishmentAddress: '', specialTaxpayerCode: '' });
        const r = readinessHealthy();
        r.isReadyForRemoteSandboxSubmission = false;
        r.isReadyForPresignedRemoteSandboxSubmission = false;
        r.blockers = ['Falta la dirección de la matriz y del establecimiento en el perfil fiscal del emisor.'];
        r.checks = r.checks.map(function (c) { return c.key === 'issuer_profile' ? { key: 'issuer_profile', label: 'Perfil fiscal del emisor', status: 'blocked', detail: 'Faltan la dirección de matriz y de establecimiento.' } : c; });
        r.recommendedNextStep = 'Completa la dirección de la matriz y del establecimiento en el perfil fiscal para habilitar la emisión.';
        s.readiness = r;
        return s;
      })();

      /* 3 — numbering incomplete: no emission point / sequence */
      S.numbering_incomplete = (function () {
        const s = base();
        s.label = 'Numeración incompleta';
        s.numbering = Object.assign(numberingHealthy(), { emissionPointCode: '', nextSequenceNumber: null, previewNumber: null, otherPoints: [] });
        const r = readinessHealthy();
        r.isReadyForRemoteSandboxSubmission = false;
        r.isReadyForPresignedRemoteSandboxSubmission = false;
        r.blockers = ['No hay punto de emisión ni secuencial configurados para Factura (01).'];
        r.checks = r.checks.map(function (c) { return c.key === 'numbering' ? { key: 'numbering', label: 'Numeración de facturas', status: 'blocked', detail: 'Falta punto de emisión y secuencial.' } : c; });
        r.documentSupport = documentSupportHealthy().map(function (d) { return d.documentCode === '01' ? Object.assign({}, d, { numberingConfigured: false, submitSupported: false, detail: 'Falta numeración para Factura.' }) : d; });
        r.recommendedNextStep = 'Configura el establecimiento, el punto de emisión y el secuencial inicial de la factura.';
        s.readiness = r;
        return s;
      })();

      /* 4 — signature missing: no certificate material */
      S.signature_missing = (function () {
        const s = base();
        s.label = 'Firma no configurada';
        s.signature = {
          provider: 'xades_pkcs12', storageMode: 'secret_ref', certificateLabel: '', subjectName: '',
          certificateFingerprint: '', pkcs12SecretRef: '', passwordSecretRef: '', hydrateMetadataFromPkcs12: true,
          materialConfigured: false, isActive: false,
          inspection: { status: 'not_configured', detail: 'No hay material PKCS#12 configurado para inspeccionar.', encoding: 'not_applicable', probeMethod: 'not_applicable', certificateValidityStatus: 'not_applicable', cryptographicProofStatus: 'not_applicable', cryptographicProofDetail: 'Sin material para probar.', passwordPresent: false, hasAdvisoryWarning: false, fingerprintPresent: false, subjectNamePresent: false, extractedFingerprint: null, extractedTaxId: null, extractedSubjectName: null, extractedIssuerName: null, validFrom: null, validUntil: null, daysUntilExpiry: null, byteLength: null }
        };
        s.issuer = Object.assign(issuerHealthy(), { taxIdMatchesCertificate: null, extractedCertificateTaxId: null });
        s.canSyncIssuerTaxId = false;
        const r = readinessHealthy();
        r.signatureProvider = null;
        r.internalSignerMaterialStatus = 'not_configured';
        r.internalSignerMaterialDetail = 'No hay material de firma cargado.';
        r.isInternalSignerMaterialReady = false;
        r.internalSignerCertificateValidityStatus = 'not_applicable';
        r.internalSignerCryptoProofStatus = 'not_applicable';
        r.internalSignerIssuerAlignmentStatus = 'not_applicable';
        r.internalSignerExtractedTaxId = null;
        r.isInternalSignerCryptographicallyReady = false;
        r.isReadyForRemoteSandboxSubmission = false;
        r.isReadyForPresignedRemoteSandboxSubmission = false;
        r.isReadyForLocalStubSubmission = true; // stub path still works without real material
        r.blockers = ['No hay un certificado de firma cargado. Sin firma no se puede emitir al SRI.'];
        r.checks = r.checks.map(function (c) {
          if (c.key === 'signature_material') return { key: 'signature_material', label: 'Material de firma', status: 'blocked', detail: 'Sin certificado PKCS#12 cargado.' };
          if (c.key === 'certificate_validity') return { key: 'certificate_validity', label: 'Vigencia del certificado', status: 'blocked', detail: 'No aplica sin certificado.' };
          if (c.key === 'crypto_proof') return { key: 'crypto_proof', label: 'Prueba criptográfica', status: 'blocked', detail: 'No aplica sin material.' };
          if (c.key === 'issuer_alignment') return { key: 'issuer_alignment', label: 'Alineación emisor-certificado', status: 'warning', detail: 'Sin certificado para contrastar el RUC.' };
          return c;
        });
        r.recommendedNextStep = 'Carga un certificado PKCS#12 emitido por una entidad autorizada (Security Data, BCE, ANF, Uanataca) para habilitar la firma.';
        s.readiness = r;
        return s;
      })();

      /* 5 — signature expiring: valid now but < 30 days */
      S.signature_expiring = (function () {
        const s = base();
        s.label = 'Firma por vencer';
        const insp = inspectionHealthy();
        insp.certificateValidityStatus = 'expiring_soon';
        insp.validUntil = '2026-07-07';
        insp.daysUntilExpiry = 21;
        s.signature = Object.assign(signatureHealthy(), { inspection: insp });
        const r = readinessHealthy();
        r.internalSignerCertificateValidityStatus = 'expiring_soon';
        r.internalSignerCertificateValidityDetail = 'El certificado caduca en 21 días (07 jul 2026).';
        r.internalSignerCertificateValidUntil = '2026-07-07';
        r.warnings = ['El certificado de firma caduca en 21 días (07 jul 2026). Aún puedes emitir, pero conviene renovarlo pronto.'];
        r.checks = r.checks.map(function (c) { return c.key === 'certificate_validity' ? { key: 'certificate_validity', label: 'Vigencia del certificado', status: 'warning', detail: 'Caduca en 21 días (07 jul 2026).' } : c; });
        r.recommendedNextStep = 'Renueva tu certificado antes del 07 jul 2026 para evitar una interrupción en la emisión.';
        s.readiness = r;
        return s;
      })();

      /* 6 — signature expired / blocked */
      S.signature_expired = (function () {
        const s = base();
        s.label = 'Firma caducada · bloqueada';
        const insp = inspectionHealthy();
        insp.certificateValidityStatus = 'expired';
        insp.validUntil = '2026-05-30';
        insp.daysUntilExpiry = -17;
        s.signature = Object.assign(signatureHealthy(), { inspection: insp });
        const r = readinessHealthy();
        r.internalSignerCertificateValidityStatus = 'expired';
        r.internalSignerCertificateValidityDetail = 'El certificado venció el 30 may 2026.';
        r.internalSignerCertificateValidUntil = '2026-05-30';
        r.isInternalSignerCertificateCurrentlyValid = false;
        r.isReadyForRemoteSandboxSubmission = false;
        r.isReadyForPresignedRemoteSandboxSubmission = false;
        r.blockers = ['El certificado de firma venció el 30 may 2026. No se puede firmar ni emitir hasta renovarlo.'];
        r.checks = r.checks.map(function (c) { return c.key === 'certificate_validity' ? { key: 'certificate_validity', label: 'Vigencia del certificado', status: 'blocked', detail: 'Venció el 30 may 2026.' } : c; });
        r.recommendedNextStep = 'Carga un certificado vigente. La emisión está detenida hasta renovar la firma; el resto de la configuración está intacta.';
        s.readiness = r;
        return s;
      })();

      /* 7 — gateway incomplete: submission not configured / not active */
      S.gateway_incomplete = (function () {
        const s = base();
        s.label = 'Gateway incompleto';
        s.submission = Object.assign(submissionHealthy(), { authorizationUrl: null, credentialsSecretRef: '', gatewayConfigured: false, isActive: false });
        const r = readinessHealthy();
        r.submissionProvider = 'sri_offline_ws';
        r.isReadyForRemoteSandboxSubmission = false;
        r.isReadyForPresignedRemoteSandboxSubmission = false;
        r.blockers = ['El gateway de envío no está completo: falta la URL de autorización y está deshabilitado.'];
        r.checks = r.checks.map(function (c) { return c.key === 'gateway' ? { key: 'gateway', label: 'Gateway SRI', status: 'blocked', detail: 'Falta URL de autorización · envío deshabilitado.' } : c; });
        r.documentSupport = documentSupportHealthy().map(function (d) { return Object.assign({}, d, { submitSupported: false }); });
        r.recommendedNextStep = 'Completa la URL de autorización del gateway y habilita el envío electrónico para el tenant.';
        s.readiness = r;
        return s;
      })();

      /* 8 — sandbox blocked: configured, but remote sandbox tier not reachable.
         Local stub is ready; the last remote SRI test failed (taxpayer not
         registered) — distinct from a simple incomplete section. */
      S.sandbox_blocked = (function () {
        const s = base();
        s.label = 'Sandbox bloqueado';
        const r = readinessHealthy();
        r.internalSignerOfflineCompatibilityStatus = 'failed';
        r.internalSignerOfflineCompatibilityDetail = 'El SRI rechazó la última firma de prueba por incompatibilidad de esquema offline.';
        r.isInternalSignerOfflineCompatible = false;
        r.latestRemoteSriSubmissionStatus = 'RETURNED';
        r.latestRemoteSriSubmissionCategory = 'taxpayer_not_registered';
        r.latestRemoteSriSubmissionSummary = 'El SRI devolvió el comprobante: el RUC del emisor no está habilitado para facturación electrónica en el ambiente de pruebas.';
        r.latestRemoteSriSubmissionOccurredAt = '2026-06-16T09:12:44-05:00';
        r.isReadyForRemoteSandboxSubmission = false;
        r.isReadyForPresignedRemoteSandboxSubmission = false;
        r.isReadyForLocalStubSubmission = true;
        r.blockers = ['El SRI no acepta todavía el sandbox remoto: el RUC del emisor no está habilitado para facturación electrónica en pruebas.'];
        r.warnings = ['La última firma de prueba falló la compatibilidad offline del SRI.'];
        r.checks = r.checks.map(function (c) {
          if (c.key === 'offline_compat' || c.label.indexOf('offline') >= 0) return c;
          return c;
        }).concat([{ key: 'offline_compat', label: 'Compatibilidad offline', status: 'blocked', detail: 'El SRI rechazó la última firma de prueba.' }, { key: 'remote_feedback', label: 'Último feedback del SRI', status: 'warning', detail: 'RUC no habilitado para pruebas.' }]);
        r.recommendedNextStep = 'Puedes validar localmente con stub, pero el sandbox remoto sigue bloqueado: habilita el RUC para facturación electrónica de pruebas en el portal del SRI y reintenta.';
        s.readiness = r;
        return s;
      })();

      /* 9 — permission-limited: view only */
      S.permission_limited = (function () {
        const s = base();
        s.label = 'Permiso limitado';
        s.permission = { canManage: false, role: 'Operator', missingPermission: 'invoicing.settings.manage' };
        s.canSyncIssuerTaxId = false;
        const insp = inspectionHealthy();
        insp.certificateValidityStatus = 'expiring_soon';
        insp.validUntil = '2026-07-07';
        insp.daysUntilExpiry = 21;
        s.signature = Object.assign(signatureHealthy(), { inspection: insp });
        const r = readinessHealthy();
        r.internalSignerCertificateValidityStatus = 'expiring_soon';
        r.internalSignerCertificateValidUntil = '2026-07-07';
        r.warnings = ['El certificado de firma caduca en 21 días. Avísale a un Owner para renovarlo.'];
        r.checks = r.checks.map(function (c) { return c.key === 'certificate_validity' ? { key: 'certificate_validity', label: 'Vigencia del certificado', status: 'warning', detail: 'Caduca en 21 días.' } : c; });
        r.recommendedNextStep = 'Puedes revisar toda la configuración y la preparación; pídele a un Owner que aplique los cambios (falta el permiso invoicing.settings.manage).';
        s.readiness = r;
        return s;
      })();

      return S;
    })()
  };
})();
