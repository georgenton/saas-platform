import { ElectronicSubmissionSettingsRepository } from '../ports/electronic-submission-settings.repository';
import {
  ElectronicInvoiceOfflineSignatureProbe,
} from '../ports/electronic-invoice-offline-signature-probe';
import {
  ElectronicSignatureMaterialInspection,
  ElectronicSignatureMaterialInspector,
} from '../ports/electronic-signature-material-inspector';
import { ElectronicInvoiceSigner } from '../ports/electronic-invoice-signer';
import { ElectronicInvoiceXmlSchemaValidator } from '../ports/electronic-invoice-xml-schema-validator';
import { ElectronicSignatureSettingsRepository } from '../ports/electronic-signature-settings.repository';
import { InvoiceElectronicEventRepository } from '../ports/invoice-electronic-event.repository';
import { InvoiceNumberingSettingsRepository } from '../ports/invoice-numbering-settings.repository';
import { IssuerProfileRepository } from '../ports/issuer-profile.repository';
import { SecretReferenceResolver } from '../ports/secret-reference-resolver';
import {
  ElectronicInvoicingDocumentSupport,
  ElectronicInvoicingReadinessCheck,
  ElectronicInvoicingSandboxReadiness,
} from '../types/electronic-invoicing-readiness';
import {
  TenantNotFoundError,
  TenantRepository,
} from '@saas-platform/tenancy-application';

export class GetTenantElectronicSandboxReadinessUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly issuerProfileRepository: IssuerProfileRepository,
    private readonly invoiceNumberingSettingsRepository: InvoiceNumberingSettingsRepository,
    private readonly electronicSignatureSettingsRepository: ElectronicSignatureSettingsRepository,
    private readonly electronicSubmissionSettingsRepository: ElectronicSubmissionSettingsRepository,
    private readonly invoiceElectronicEventRepository: InvoiceElectronicEventRepository,
    private readonly secretReferenceResolver: SecretReferenceResolver,
    private readonly electronicSignatureMaterialInspector: ElectronicSignatureMaterialInspector,
    private readonly electronicInvoiceSigner: ElectronicInvoiceSigner,
    private readonly electronicInvoiceXmlSchemaValidator: ElectronicInvoiceXmlSchemaValidator,
    private readonly electronicInvoiceOfflineSignatureProbe: ElectronicInvoiceOfflineSignatureProbe,
  ) {}

  async execute(tenantSlug: string): Promise<ElectronicInvoicingSandboxReadiness> {
    const tenant = await this.tenantRepository.findBySlug(tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(tenantSlug);
    }

    const [
      issuerProfile,
      invoiceNumberingSettings,
      creditNoteNumberingSettings,
      debitNoteNumberingSettings,
      remissionGuideNumberingSettings,
      withholdingNumberingSettings,
      signatureSettings,
      submissionSettings,
      invoiceSchemaSupport,
      creditNoteSchemaSupport,
      debitNoteSchemaSupport,
      remissionGuideSchemaSupport,
      withholdingSchemaSupport,
    ] = await Promise.all([
      this.issuerProfileRepository.findByTenantId(tenant.id),
      this.invoiceNumberingSettingsRepository.findByTenantIdAndDocumentCode(
        tenant.id,
        '01',
      ),
      this.invoiceNumberingSettingsRepository.findByTenantIdAndDocumentCode(
        tenant.id,
        '04',
      ),
      this.invoiceNumberingSettingsRepository.findByTenantIdAndDocumentCode(
        tenant.id,
        '05',
      ),
      this.invoiceNumberingSettingsRepository.findByTenantIdAndDocumentCode(
        tenant.id,
        '06',
      ),
      this.invoiceNumberingSettingsRepository.findByTenantIdAndDocumentCode(
        tenant.id,
        '07',
      ),
      this.electronicSignatureSettingsRepository.findByTenantId(tenant.id),
      this.electronicSubmissionSettingsRepository.findByTenantId(tenant.id),
      this.electronicInvoiceXmlSchemaValidator.describeSupport('01'),
      this.electronicInvoiceXmlSchemaValidator.describeSupport('04'),
      this.electronicInvoiceXmlSchemaValidator.describeSupport('05'),
      this.electronicInvoiceXmlSchemaValidator.describeSupport('06'),
      this.electronicInvoiceXmlSchemaValidator.describeSupport('07'),
    ]);

    const checks: ElectronicInvoicingReadinessCheck[] = [];
    const blockers: string[] = [];
    const warnings: string[] = [];
    let internalSignerMaterialStatus:
      | 'not_configured'
      | 'not_applicable'
      | 'likely_usable'
      | 'invalid' = 'not_configured';
    let internalSignerMaterialDetail =
      'No existe una configuracion activa de firma electronica.';
    let internalSignerCertificateValidityStatus:
      | 'not_applicable'
      | 'unknown'
      | 'valid'
      | 'expiring_soon'
      | 'expired'
      | 'not_yet_valid' = 'not_applicable';
    let internalSignerCertificateValidityDetail =
      'La vigencia del certificado no aplica mientras no exista un PKCS#12 inspeccionable.';
    let internalSignerCertificateValidUntil: string | null = null;
    let internalSignerCryptoProofStatus:
      | 'not_applicable'
      | 'unknown'
      | 'verified'
      | 'failed' = 'not_applicable';
    let internalSignerCryptoProofDetail =
      'La prueba criptografica no aplica mientras no exista un PKCS#12 inspeccionable.';
    let internalSignerOfflineCompatibilityStatus:
      | 'not_applicable'
      | 'unknown'
      | 'verified'
      | 'failed' = 'not_applicable';
    let internalSignerOfflineCompatibilityDetail =
      'La compatibilidad offline local no aplica mientras no exista un PKCS#12 inspeccionable.';
    let internalSignerIssuerAlignmentStatus:
      | 'not_applicable'
      | 'unknown'
      | 'matched'
      | 'mismatched' = 'not_applicable';
    let internalSignerIssuerAlignmentDetail =
      'La alineacion entre certificado y emisor no aplica mientras no exista un PKCS#12 inspeccionable.';
    let internalSignerExtractedTaxId: string | null = null;
    let latestRemoteSriSubmissionStatus: string | null = null;
    let latestRemoteSriSubmissionSummary: string | null = null;
    let latestRemoteSriSubmissionCategory:
      | 'taxpayer_not_registered'
      | 'xml_structure'
      | 'authorization_rejected'
      | 'technical_failure'
      | 'unknown'
      | null = null;
    let latestRemoteSriSubmissionOccurredAt: string | null = null;

    if (!issuerProfile) {
      pushBlocked(
        checks,
        blockers,
        'issuer_profile',
        'Perfil fiscal',
        'Falta configurar el perfil fiscal del emisor para el tenant.',
      );
    } else {
      checks.push({
        key: 'issuer_profile',
        label: 'Perfil fiscal',
        status: 'ready',
        detail: `Configurado para ${issuerProfile.environment} con RUC ${issuerProfile.taxId}.`,
      });
    }

    if (!invoiceNumberingSettings) {
      pushBlocked(
        checks,
        blockers,
        'invoice_numbering',
        'Numeracion Ecuador',
        'Falta configurar establecimiento, punto de emision y secuencial.',
      );
    } else {
      checks.push({
        key: 'invoice_numbering',
        label: 'Numeracion Ecuador',
        status: 'ready',
        detail: `Preview ${invoiceNumberingSettings.establishmentCode}-${invoiceNumberingSettings.emissionPointCode}-${String(invoiceNumberingSettings.nextSequenceNumber).padStart(9, '0')}.`,
      });
    }

    if (!signatureSettings || !signatureSettings.isActive) {
      pushBlocked(
        checks,
        blockers,
        'signature_settings',
        'Firma electronica',
        'No existe una configuracion activa de firma electronica.',
      );
    } else {
      checks.push({
        key: 'signature_settings',
        label: 'Firma electronica',
        status: 'ready',
        detail: `Provider activo: ${signatureSettings.provider}.`,
      });

      if (!signatureSettings.hasSigningMaterialConfigured()) {
        internalSignerMaterialStatus = 'invalid';
        internalSignerMaterialDetail =
          'La configuracion de firma existe, pero el material PKCS#12 o su password siguen incompletos.';
        pushBlocked(
          checks,
          blockers,
          'signature_material',
          'Material de firma',
          'La configuracion de firma existe, pero el material PKCS#12 o su password siguen incompletos.',
        );
      } else {
        const signatureMaterialIssues = await this.validateSecretRefs([
          signatureSettings.pkcs12SecretRef,
          signatureSettings.privateKeyPasswordSecretRef,
        ]);

        if (signatureMaterialIssues.length > 0) {
          internalSignerMaterialStatus = 'invalid';
          internalSignerMaterialDetail = signatureMaterialIssues.join(' ');
          pushBlocked(
            checks,
            blockers,
            'signature_material',
            'Material de firma',
            signatureMaterialIssues.join(' '),
          );
        } else {
          checks.push({
            key: 'signature_material',
            label: 'Material de firma',
            status: 'ready',
            detail:
              signatureSettings.provider === 'xades_pkcs12'
                ? 'Las referencias del PKCS#12 y password responden desde el resolver configurado.'
                : 'El provider stub_local no requiere PKCS#12 ni password externo para el carril local.',
          });

          const signatureMaterialInspection =
            await this.electronicSignatureMaterialInspector.inspect({
              signatureSettings,
            });

          internalSignerMaterialStatus = signatureMaterialInspection.status;
          internalSignerMaterialDetail = signatureMaterialInspection.detail;
          internalSignerCertificateValidityStatus =
            signatureMaterialInspection.certificateValidityStatus;
          internalSignerCertificateValidUntil =
            signatureMaterialInspection.validUntil;
          internalSignerCryptoProofStatus =
            signatureMaterialInspection.cryptographicProofStatus;
          internalSignerCryptoProofDetail =
            signatureMaterialInspection.cryptographicProofDetail;
          internalSignerExtractedTaxId =
            signatureMaterialInspection.extractedTaxId;

          if (signatureMaterialInspection.status === 'likely_usable') {
            checks.push({
              key: 'signature_material_probe',
              label: 'Inspeccion estructural PKCS#12',
              status: 'ready',
              detail: signatureMaterialInspection.detail,
            });

            if (signatureMaterialInspection.hasAdvisoryWarning) {
              warnings.push(signatureMaterialInspection.detail);
            }

            const validityEvaluation = evaluateCertificateValidity(
              signatureMaterialInspection,
            );
            internalSignerCertificateValidityDetail = validityEvaluation.detail;

            if (validityEvaluation.status === 'ready') {
              checks.push({
                key: 'signature_certificate_validity',
                label: 'Vigencia del certificado',
                status: 'ready',
                detail: validityEvaluation.detail,
              });
            } else if (validityEvaluation.status === 'warning') {
              checks.push({
                key: 'signature_certificate_validity',
                label: 'Vigencia del certificado',
                status: 'warning',
                detail: validityEvaluation.detail,
              });
              warnings.push(validityEvaluation.detail);
            } else {
              pushBlocked(
                checks,
                blockers,
                'signature_certificate_validity',
                'Vigencia del certificado',
                validityEvaluation.detail,
              );
            }

            const issuerAlignmentEvaluation = evaluateIssuerAlignment({
              inspection: signatureMaterialInspection,
              issuerTaxId: issuerProfile?.taxId ?? null,
            });
            internalSignerIssuerAlignmentStatus =
              issuerAlignmentEvaluation.status;
            internalSignerIssuerAlignmentDetail =
              issuerAlignmentEvaluation.detail;

            if (issuerAlignmentEvaluation.level === 'ready') {
              checks.push({
                key: 'signature_issuer_alignment',
                label: 'Alineacion emisor-certificado',
                status: 'ready',
                detail: issuerAlignmentEvaluation.detail,
              });
            } else if (issuerAlignmentEvaluation.level === 'warning') {
              checks.push({
                key: 'signature_issuer_alignment',
                label: 'Alineacion emisor-certificado',
                status: 'warning',
                detail: issuerAlignmentEvaluation.detail,
              });
              warnings.push(issuerAlignmentEvaluation.detail);
            } else {
              pushBlocked(
                checks,
                blockers,
                'signature_issuer_alignment',
                'Alineacion emisor-certificado',
                issuerAlignmentEvaluation.detail,
              );
            }

            const cryptographicProofEvaluation = evaluateCryptographicProof(
              signatureMaterialInspection,
            );
            internalSignerCryptoProofDetail =
              cryptographicProofEvaluation.detail;

            if (cryptographicProofEvaluation.status === 'ready') {
              checks.push({
                key: 'signature_crypto_proof',
                label: 'Prueba criptografica interna',
                status: 'ready',
                detail: cryptographicProofEvaluation.detail,
              });

              if (!issuerProfile) {
                internalSignerOfflineCompatibilityStatus = 'unknown';
                internalSignerOfflineCompatibilityDetail =
                  'La compatibilidad offline local todavia no puede probarse porque falta un perfil fiscal valido.';
                pushBlocked(
                  checks,
                  blockers,
                  'signature_offline_probe',
                  'Compatibilidad offline local',
                  internalSignerOfflineCompatibilityDetail,
                );
              } else {
                const offlineSignatureProbe =
                  await this.electronicInvoiceOfflineSignatureProbe.inspect({
                    tenantSlug,
                    signatureSettings,
                    issuerProfile,
                  });
                internalSignerOfflineCompatibilityStatus =
                  offlineSignatureProbe.status;
                internalSignerOfflineCompatibilityDetail =
                  offlineSignatureProbe.detail;

                if (offlineSignatureProbe.status === 'verified') {
                  checks.push({
                    key: 'signature_offline_probe',
                    label: 'Compatibilidad offline local',
                    status: 'ready',
                    detail: offlineSignatureProbe.detail,
                  });
                } else if (offlineSignatureProbe.status === 'failed') {
                  pushBlocked(
                    checks,
                    blockers,
                    'signature_offline_probe',
                    'Compatibilidad offline local',
                    offlineSignatureProbe.detail,
                  );
                } else {
                  checks.push({
                    key: 'signature_offline_probe',
                    label: 'Compatibilidad offline local',
                    status: 'warning',
                    detail: offlineSignatureProbe.detail,
                  });
                  warnings.push(offlineSignatureProbe.detail);
                }
              }
            } else if (cryptographicProofEvaluation.status === 'warning') {
              checks.push({
                key: 'signature_crypto_proof',
                label: 'Prueba criptografica interna',
                status: 'warning',
                detail: cryptographicProofEvaluation.detail,
              });
              warnings.push(cryptographicProofEvaluation.detail);
              internalSignerOfflineCompatibilityStatus = 'unknown';
              internalSignerOfflineCompatibilityDetail =
                'La compatibilidad offline local todavia no se probo porque la prueba criptografica aun no esta en estado ready.';
              checks.push({
                key: 'signature_offline_probe',
                label: 'Compatibilidad offline local',
                status: 'warning',
                detail: internalSignerOfflineCompatibilityDetail,
              });
              warnings.push(internalSignerOfflineCompatibilityDetail);
            } else {
              pushBlocked(
                checks,
                blockers,
                'signature_crypto_proof',
                'Prueba criptografica interna',
                cryptographicProofEvaluation.detail,
              );
            }
          } else if (signatureMaterialInspection.status === 'not_applicable') {
            internalSignerCertificateValidityDetail =
              'La vigencia del certificado no aplica para providers que no usan PKCS#12.';
            internalSignerCryptoProofDetail =
              'La prueba criptografica no aplica para providers que no usan PKCS#12.';
            internalSignerOfflineCompatibilityDetail =
              'La compatibilidad offline local no aplica para providers que no usan PKCS#12.';
            internalSignerIssuerAlignmentStatus = 'not_applicable';
            internalSignerIssuerAlignmentDetail =
              'La alineacion entre certificado y emisor no aplica para providers que no usan PKCS#12.';
            checks.push({
              key: 'signature_material_probe',
              label: 'Inspeccion estructural PKCS#12',
              status: 'ready',
              detail: signatureMaterialInspection.detail,
            });
            checks.push({
              key: 'signature_certificate_validity',
              label: 'Vigencia del certificado',
              status: 'ready',
              detail:
                'La vigencia del certificado no aplica para providers que no usan PKCS#12.',
            });
            checks.push({
              key: 'signature_crypto_proof',
              label: 'Prueba criptografica interna',
              status: 'ready',
              detail:
                'La prueba criptografica no aplica para providers que no usan PKCS#12.',
            });
            checks.push({
              key: 'signature_offline_probe',
              label: 'Compatibilidad offline local',
              status: 'ready',
              detail:
                'La compatibilidad offline local no aplica para providers que no usan PKCS#12.',
            });
            checks.push({
              key: 'signature_issuer_alignment',
              label: 'Alineacion emisor-certificado',
              status: 'ready',
              detail:
                'La alineacion entre certificado y emisor no aplica para providers que no usan PKCS#12.',
            });
          } else {
            internalSignerCertificateValidityStatus = 'unknown';
            internalSignerCertificateValidityDetail =
              'No fue posible evaluar la vigencia del certificado porque el PKCS#12 todavia no pudo abrirse correctamente.';
              internalSignerCryptoProofStatus = 'unknown';
              internalSignerCryptoProofDetail =
                'No fue posible ejecutar la prueba criptografica porque el PKCS#12 todavia no pudo abrirse correctamente.';
              internalSignerOfflineCompatibilityStatus = 'unknown';
              internalSignerOfflineCompatibilityDetail =
                'No fue posible probar la compatibilidad offline local porque el PKCS#12 todavia no pudo abrirse correctamente.';
              internalSignerIssuerAlignmentStatus = 'unknown';
              internalSignerIssuerAlignmentDetail =
                'No fue posible contrastar certificado y emisor porque el PKCS#12 todavia no pudo abrirse correctamente.';
              pushBlocked(
                checks,
                blockers,
              'signature_material_probe',
              'Inspeccion estructural PKCS#12',
              signatureMaterialInspection.detail,
            );
            pushBlocked(
              checks,
              blockers,
              'signature_certificate_validity',
              'Vigencia del certificado',
              internalSignerCertificateValidityDetail,
            );
            pushBlocked(
              checks,
              blockers,
              'signature_crypto_proof',
                'Prueba criptografica interna',
                internalSignerCryptoProofDetail,
              );
              pushBlocked(
                checks,
                blockers,
                'signature_offline_probe',
                'Compatibilidad offline local',
                internalSignerOfflineCompatibilityDetail,
              );
              pushBlocked(
                checks,
                blockers,
                'signature_issuer_alignment',
                'Alineacion emisor-certificado',
                internalSignerIssuerAlignmentDetail,
              );
            }
          }
        }

      const signerCapability = this.electronicInvoiceSigner.describeCapability({
        signatureSettings,
      });

      if (signerCapability.supportsSriOfflineSubmission) {
        checks.push({
          key: 'signature_capability',
          label: 'Capacidad de firma real',
          status: 'ready',
          detail: signerCapability.detail,
        });
      } else {
        pushBlocked(
          checks,
          blockers,
          'signature_capability',
          'Capacidad de firma real',
          signerCapability.detail,
        );
      }
    }

    if (!submissionSettings || !submissionSettings.isActive) {
      pushBlocked(
        checks,
        blockers,
        'submission_settings',
        'Gateway SRI',
        'No existe una configuracion activa de envio electronico.',
      );
    } else {
      checks.push({
        key: 'submission_settings',
        label: 'Gateway SRI',
        status: 'ready',
        detail: `Provider ${submissionSettings.provider} en modo ${submissionSettings.transmissionMode}.`,
      });

      if (!submissionSettings.hasGatewayConfigured()) {
        pushBlocked(
          checks,
          blockers,
          'submission_gateway',
          'URLs del gateway',
          'La recepcion o la autorizacion del gateway SRI siguen incompletas.',
        );
      } else {
        checks.push({
          key: 'submission_gateway',
          label: 'URLs del gateway',
          status: 'ready',
          detail: 'Recepcion y autorizacion configuradas para el provider actual.',
        });
      }

      if (submissionSettings.provider !== 'sri_offline_ws') {
        pushBlocked(
          checks,
          blockers,
          'submission_transport',
          'Transporte remoto',
          'El provider actual sigue siendo stub_sri; para sandbox real debe usarse sri_offline_ws.',
        );
      } else if (submissionSettings.transmissionMode !== 'offline') {
        pushBlocked(
          checks,
          blockers,
          'submission_transport',
          'Transporte remoto',
          'El tenant sigue en sync_stub; para probar contra SRI debe usarse transmissionMode=offline.',
        );
      } else {
        checks.push({
          key: 'submission_transport',
          label: 'Transporte remoto',
          status: 'ready',
          detail: 'El tenant ya apunta al camino HTTP/SOAP remoto del esquema offline.',
        });
      }

      if (
        issuerProfile &&
        issuerProfile.environment !== submissionSettings.environment
      ) {
        pushBlocked(
          checks,
          blockers,
          'environment_alignment',
          'Alineacion de ambiente',
          `El perfil fiscal esta en ${issuerProfile.environment} pero el gateway esta en ${submissionSettings.environment}.`,
        );
      } else {
        checks.push({
          key: 'environment_alignment',
          label: 'Alineacion de ambiente',
          status: 'ready',
          detail: `Firma y envio apuntan al ambiente ${submissionSettings.environment}.`,
        });
      }

      if (
        issuerProfile &&
        submissionSettings.provider === 'sri_offline_ws' &&
        submissionSettings.environment === 'test' &&
        isKnownLocalSandboxDemoTaxId(issuerProfile.taxId)
      ) {
        pushBlocked(
          checks,
          blockers,
          'sandbox_taxpayer_registration',
          'Contribuyente sandbox',
          `El RUC ${issuerProfile.taxId} corresponde al fixture local por defecto y no a un contribuyente habilitado en CELCER. Para probar contra SRI sandbox necesitas un emisor realmente registrado en el ambiente de pruebas.`,
        );
      } else {
        checks.push({
          key: 'sandbox_taxpayer_registration',
          label: 'Contribuyente sandbox',
          status: 'ready',
          detail:
            submissionSettings.provider === 'sri_offline_ws' &&
            submissionSettings.environment === 'test'
              ? 'El emisor no coincide con el fixture local conocido y puede pasar a una prueba controlada en CELCER.'
              : 'La verificacion de contribuyente sandbox solo aplica cuando el gateway apunta a CELCER.',
        });
      }

      const latestRemoteSriSubmission =
        submissionSettings.provider === 'sri_offline_ws'
          ? await this.invoiceElectronicEventRepository.findLatestByTenantIdAndProvider(
              tenant.id,
              'sri_offline_ws',
              'submission',
            )
          : null;

      if (latestRemoteSriSubmission) {
        const remoteFeedback = classifyRemoteSriSubmissionFeedback(
          latestRemoteSriSubmission.message,
          latestRemoteSriSubmission.responsePayload,
          latestRemoteSriSubmission.providerStatus,
        );
        latestRemoteSriSubmissionStatus = latestRemoteSriSubmission.providerStatus;
        latestRemoteSriSubmissionSummary = remoteFeedback.summary;
        latestRemoteSriSubmissionCategory = remoteFeedback.category;
        latestRemoteSriSubmissionOccurredAt =
          latestRemoteSriSubmission.occurredAt.toISOString();

        if (remoteFeedback.summary) {
          checks.push({
            key: 'remote_feedback',
            label: 'Ultimo feedback remoto',
            status:
              remoteFeedback.category === 'taxpayer_not_registered'
                ? 'blocked'
                : remoteFeedback.category === 'xml_structure' ||
                    remoteFeedback.category === 'authorization_rejected' ||
                    remoteFeedback.category === 'technical_failure'
                  ? 'warning'
                  : 'ready',
            detail: `Ultimo resultado SRI: ${remoteFeedback.summary}`,
          });
        }

        if (
          remoteFeedback.category === 'taxpayer_not_registered' &&
          !blockedKeysFrom(checks).has('sandbox_taxpayer_registration')
        ) {
          pushBlocked(
            checks,
            blockers,
            'sandbox_taxpayer_registration',
            'Contribuyente sandbox',
            `SRI ya devolvio evidencia de registro faltante para este emisor: ${remoteFeedback.summary}`,
          );
        } else if (
          remoteFeedback.category &&
          remoteFeedback.category !== 'taxpayer_not_registered' &&
          remoteFeedback.summary
        ) {
          warnings.push(`Ultimo feedback remoto SRI: ${remoteFeedback.summary}`);
        }
      }

      if (!submissionSettings.credentialsSecretRef) {
        checks.push({
          key: 'credentials_secret',
          label: 'Credenciales del gateway',
          status: 'ready',
          detail:
            'No hay credentialsSecretRef configurado. El cliente HTTP actual puede operar sin cabeceras adicionales, pero la referencia sigue disponible si el entorno o un proxy la requieren.',
        });
      } else {
        const credentialIssues = await this.validateSecretRefs([
          submissionSettings.credentialsSecretRef,
        ]);

        if (credentialIssues.length > 0) {
          pushBlocked(
            checks,
            blockers,
            'credentials_secret',
            'Credenciales del gateway',
            credentialIssues.join(' '),
          );
        } else {
          checks.push({
            key: 'credentials_secret',
            label: 'Credenciales del gateway',
            status: 'ready',
            detail: 'La referencia de credenciales responde desde el resolver configurado.',
          });
        }
      }
    }

    const documentSupport: ElectronicInvoicingDocumentSupport[] = [
      {
        documentCode: '01',
        label: 'Factura ECU (01)',
        numberingConfigured: Boolean(invoiceNumberingSettings),
        previewAvailable: true,
        rideAvailable: true,
        schemaValidationAvailable: invoiceSchemaSupport.isSchemaAvailable,
        submitSupported: invoiceSchemaSupport.isSchemaAvailable,
        detail: invoiceSchemaSupport.isSchemaAvailable
          ? 'La factura 01 ya tiene preview XML, RIDE, validacion XSD y el carril de submit electronico habilitado.'
          : invoiceSchemaSupport.detail,
      },
      {
        documentCode: '04',
        label: 'Nota de credito ECU (04)',
        numberingConfigured: Boolean(creditNoteNumberingSettings),
        previewAvailable: true,
        rideAvailable: true,
        schemaValidationAvailable: creditNoteSchemaSupport.isSchemaAvailable,
        submitSupported: creditNoteSchemaSupport.isSchemaAvailable,
        detail: creditNoteSchemaSupport.isSchemaAvailable
          ? 'La nota de credito 04 ya tiene preview XML, RIDE y validacion XSD local. El carril de submit electronico ya puede probarse con la misma frontera tecnica del documento 01.'
          : `${creditNoteSchemaSupport.detail} El documento 04 queda hoy en modo preview y RIDE, sin submit electronico.`,
      },
      {
        documentCode: '05',
        label: 'Nota de debito ECU (05)',
        numberingConfigured: Boolean(debitNoteNumberingSettings),
        previewAvailable: true,
        rideAvailable: true,
        schemaValidationAvailable: debitNoteSchemaSupport.isSchemaAvailable,
        submitSupported: debitNoteSchemaSupport.isSchemaAvailable,
        detail: debitNoteSchemaSupport.isSchemaAvailable
          ? 'La nota de debito 05 ya tiene draft, preview XML, RIDE y validacion XSD local. El carril de submit electronico queda habilitado sobre la misma frontera tecnica multi-documento.'
          : `${debitNoteSchemaSupport.detail} El documento 05 queda hoy en modo draft, preview y RIDE, sin submit electronico.`,
      },
      {
        documentCode: '06',
        label: 'Guia de remision ECU (06)',
        numberingConfigured: Boolean(remissionGuideNumberingSettings),
        previewAvailable: true,
        rideAvailable: true,
        schemaValidationAvailable: remissionGuideSchemaSupport.isSchemaAvailable,
        submitSupported: remissionGuideSchemaSupport.isSchemaAvailable,
        detail: remissionGuideSchemaSupport.isSchemaAvailable
          ? 'La guia de remision 06 ya tiene draft, preview XML, RIDE y validacion XSD local. El carril de submit electronico queda habilitado sobre la misma frontera tecnica multi-documento.'
          : `${remissionGuideSchemaSupport.detail} El documento 06 queda hoy en modo draft, preview y RIDE, sin submit electronico.`,
      },
      {
        documentCode: '07',
        label: 'Comprobante de retencion ECU (07)',
        numberingConfigured: Boolean(withholdingNumberingSettings),
        previewAvailable: true,
        rideAvailable: true,
        schemaValidationAvailable: withholdingSchemaSupport.isSchemaAvailable,
        submitSupported: withholdingSchemaSupport.isSchemaAvailable,
        detail: withholdingSchemaSupport.isSchemaAvailable
          ? 'El comprobante de retencion 07 ya tiene draft, preview XML, RIDE y validacion XSD local. El carril de submit electronico queda habilitado sobre la misma frontera tecnica multi-documento.'
          : `${withholdingSchemaSupport.detail} El documento 07 queda hoy en modo draft, preview y RIDE, sin submit electronico.`,
      },
    ];

    const blockedKeys = blockedKeysFrom(checks);
    const hasAnyDocumentSubmitSupport = documentSupport.some(
      (item) => item.submitSupported,
    );
    const isReadyForLocalStubSubmission =
      hasAnyDocumentSubmitSupport &&
      !blockedKeys.has('issuer_profile') &&
      !blockedKeys.has('signature_settings') &&
      !blockedKeys.has('signature_material') &&
      submissionSettings?.isActive === true &&
      submissionSettings.provider === 'stub_sri';
    const isReadyForPresignedRemoteSandboxSubmission =
      hasAnyDocumentSubmitSupport &&
      !blockedKeys.has('issuer_profile') &&
      !blockedKeys.has('submission_settings') &&
      !blockedKeys.has('submission_gateway') &&
      !blockedKeys.has('submission_transport') &&
      !blockedKeys.has('environment_alignment') &&
      !blockedKeys.has('sandbox_taxpayer_registration') &&
      !blockedKeys.has('credentials_secret');
    const isReadyForRemoteSandboxSubmission =
      isReadyForPresignedRemoteSandboxSubmission &&
      !blockedKeys.has('signature_settings') &&
      !blockedKeys.has('signature_material') &&
      !blockedKeys.has('signature_material_probe') &&
      !blockedKeys.has('signature_certificate_validity') &&
      !blockedKeys.has('signature_crypto_proof') &&
      !blockedKeys.has('signature_issuer_alignment') &&
      internalSignerOfflineCompatibilityStatus === 'verified' &&
      !blockedKeys.has('signature_capability');
    const recommendedNextStep = resolveRecommendedNextStep({
      isReadyForRemoteSandboxSubmission,
      internalSignerCertificateValidityStatus,
      internalSignerMaterialStatus,
      internalSignerCryptoProofStatus,
      internalSignerOfflineCompatibilityStatus,
      internalSignerIssuerAlignmentStatus,
      hasKnownSandboxTaxpayerRegistrationIssue: blockedKeys.has(
        'sandbox_taxpayer_registration',
      ),
      latestRemoteSriSubmissionCategory,
      isReadyForPresignedRemoteSandboxSubmission,
      isReadyForLocalStubSubmission,
    });

    return {
      tenantSlug,
      stage: 'electronic_invoicing_ec_mvp',
      environment:
        submissionSettings?.environment ?? issuerProfile?.environment ?? null,
      signatureProvider: signatureSettings?.provider ?? null,
      submissionProvider: submissionSettings?.provider ?? null,
      transmissionMode: submissionSettings?.transmissionMode ?? null,
      internalSignerMaterialStatus,
      internalSignerMaterialDetail,
      isInternalSignerMaterialReady:
        internalSignerMaterialStatus === 'likely_usable',
      internalSignerCertificateValidityStatus,
      internalSignerCertificateValidityDetail,
      internalSignerCertificateValidUntil,
      isInternalSignerCertificateCurrentlyValid:
        internalSignerCertificateValidityStatus === 'valid' ||
        internalSignerCertificateValidityStatus === 'expiring_soon',
      internalSignerCryptoProofStatus,
      internalSignerCryptoProofDetail,
      isInternalSignerCryptographicallyReady:
        internalSignerCryptoProofStatus === 'verified',
      internalSignerOfflineCompatibilityStatus,
      internalSignerOfflineCompatibilityDetail,
      isInternalSignerOfflineCompatible:
        internalSignerOfflineCompatibilityStatus === 'verified',
      internalSignerIssuerAlignmentStatus,
      internalSignerIssuerAlignmentDetail,
      internalSignerExtractedTaxId,
      isInternalSignerIssuerAligned:
        internalSignerIssuerAlignmentStatus === 'matched',
      latestRemoteSriSubmissionStatus,
      latestRemoteSriSubmissionSummary,
      latestRemoteSriSubmissionCategory,
      latestRemoteSriSubmissionOccurredAt,
      isReadyForLocalStubSubmission,
      isReadyForRemoteSandboxSubmission,
      isReadyForPresignedRemoteSandboxSubmission,
      blockers,
      warnings,
      checks,
      documentSupport,
      recommendedNextStep,
    };
  }

  private async validateSecretRefs(
    refs: Array<string | null>,
  ): Promise<string[]> {
    const issues: string[] = [];

    for (const ref of refs) {
      if (!ref) {
        continue;
      }

      try {
        const resolved = await this.secretReferenceResolver.resolve(ref);

        if (!resolved) {
          issues.push(`La referencia "${ref}" no pudo resolverse.`);
        }
      } catch (error) {
        issues.push(
          error instanceof Error
            ? error.message
            : `La referencia "${ref}" fallo al resolverse.`,
        );
      }
    }

    return issues;
  }
}

function evaluateCertificateValidity(
  inspection: ElectronicSignatureMaterialInspection,
): {
  status: 'ready' | 'warning' | 'blocked';
  detail: string;
} {
  switch (inspection.certificateValidityStatus) {
    case 'not_applicable':
      return {
        status: 'ready',
        detail:
          'La vigencia del certificado no aplica para providers que no usan PKCS#12.',
      };
    case 'valid':
      return {
        status: 'ready',
        detail: inspection.validUntil
          ? `El certificado sigue vigente hasta ${inspection.validUntil}.`
          : 'El certificado sigue vigente segun la inspeccion de OpenSSL.',
      };
    case 'expiring_soon':
      return {
        status: 'warning',
        detail: inspection.validUntil
          ? `El certificado sigue vigente, pero vence pronto${formatDaysSuffix(inspection.daysUntilExpiry)} (${inspection.validUntil}).`
          : `El certificado sigue vigente, pero vence pronto${formatDaysSuffix(inspection.daysUntilExpiry)}.`,
      };
    case 'expired':
      return {
        status: 'blocked',
        detail: inspection.validUntil
          ? `El certificado ya vencio${formatDaysAgoSuffix(inspection.daysUntilExpiry)} (${inspection.validUntil}).`
          : `El certificado ya vencio${formatDaysAgoSuffix(inspection.daysUntilExpiry)}.`,
      };
    case 'not_yet_valid':
      return {
        status: 'blocked',
        detail: inspection.validFrom
          ? `El certificado todavia no entra en vigencia. Su fecha inicial es ${inspection.validFrom}.`
          : 'El certificado todavia no entra en vigencia segun la inspeccion de OpenSSL.',
      };
    case 'unknown':
    default:
      return {
        status: 'blocked',
        detail:
          'OpenSSL pudo abrir el PKCS#12, pero no fue posible interpretar con certeza la vigencia del certificado.',
      };
  }
}

function evaluateCryptographicProof(
  inspection: ElectronicSignatureMaterialInspection,
): {
  status: 'ready' | 'warning' | 'blocked';
  detail: string;
} {
  switch (inspection.cryptographicProofStatus) {
    case 'not_applicable':
      return {
        status: 'ready',
        detail:
          'La prueba criptografica no aplica para providers que no usan PKCS#12.',
      };
    case 'verified':
      return {
        status: 'ready',
        detail: inspection.cryptographicProofDetail,
      };
    case 'unknown':
      return {
        status: 'blocked',
        detail:
          inspection.cryptographicProofDetail ||
          'No fue posible confirmar una prueba criptografica real con la llave privada del PKCS#12.',
      };
    case 'failed':
    default:
      return {
        status: 'blocked',
        detail:
          inspection.cryptographicProofDetail ||
          'La llave privada del PKCS#12 no supero una prueba criptografica real.',
      };
  }
}

function evaluateIssuerAlignment(input: {
  inspection: ElectronicSignatureMaterialInspection;
  issuerTaxId: string | null;
}): {
  status: 'not_applicable' | 'unknown' | 'matched' | 'mismatched';
  level: 'ready' | 'warning' | 'blocked';
  detail: string;
} {
  if (input.inspection.status !== 'likely_usable') {
    return {
      status: 'unknown',
      level: 'blocked',
      detail:
        'No fue posible contrastar certificado y emisor porque el PKCS#12 todavia no pudo abrirse correctamente.',
    };
  }

  if (!input.issuerTaxId) {
    return {
      status: 'unknown',
      level: 'blocked',
      detail:
        'Falta un perfil fiscal valido para contrastar el RUC del emisor contra el certificado.',
    };
  }

  const extractedTaxId = normalizeTaxId(input.inspection.extractedTaxId);
  const issuerTaxId = normalizeTaxId(input.issuerTaxId);

  if (!extractedTaxId) {
    return {
      status: 'unknown',
      level: 'warning',
      detail:
        'El PKCS#12 ya abrio, pero no fue posible extraer un RUC claro desde el certificado. Conviene contrastar manualmente que el certificado corresponda al mismo emisor configurado en el tenant.',
    };
  }

  if (extractedTaxId !== issuerTaxId) {
    return {
      status: 'mismatched',
      level: 'blocked',
      detail: `El certificado inspeccionado sugiere el RUC ${extractedTaxId}, pero el perfil fiscal del tenant usa ${issuerTaxId}. Antes de probar CELCER conviene alinear emisor y PKCS#12.`,
    };
  }

  return {
    status: 'matched',
    level: 'ready',
    detail: `El certificado inspeccionado y el perfil fiscal del tenant apuntan al mismo RUC ${issuerTaxId}.`,
  };
}

function resolveRecommendedNextStep(input: {
  isReadyForRemoteSandboxSubmission: boolean;
  internalSignerCertificateValidityStatus:
    | 'not_applicable'
    | 'unknown'
    | 'valid'
    | 'expiring_soon'
    | 'expired'
    | 'not_yet_valid';
  internalSignerMaterialStatus:
    | 'not_configured'
    | 'not_applicable'
    | 'likely_usable'
    | 'invalid';
  internalSignerCryptoProofStatus:
    | 'not_applicable'
    | 'unknown'
    | 'verified'
    | 'failed';
  internalSignerOfflineCompatibilityStatus:
    | 'not_applicable'
    | 'unknown'
    | 'verified'
    | 'failed';
  internalSignerIssuerAlignmentStatus:
    | 'not_applicable'
    | 'unknown'
    | 'matched'
    | 'mismatched';
  hasKnownSandboxTaxpayerRegistrationIssue: boolean;
  latestRemoteSriSubmissionCategory:
    | 'taxpayer_not_registered'
    | 'xml_structure'
    | 'authorization_rejected'
    | 'technical_failure'
    | 'unknown'
    | null;
  isReadyForPresignedRemoteSandboxSubmission: boolean;
  isReadyForLocalStubSubmission: boolean;
}): string {
  if (input.hasKnownSandboxTaxpayerRegistrationIssue) {
    return 'El pipeline interno ya esta sano, pero el emisor todavia usa el RUC demo local. Cambia el perfil fiscal a un contribuyente realmente habilitado en CELCER antes de insistir con sandbox remoto.';
  }

  if (input.latestRemoteSriSubmissionCategory === 'taxpayer_not_registered') {
    return 'El ultimo rechazo remoto del SRI confirma que el emisor todavia no esta habilitado en CELCER. Alinea el perfil fiscal con un contribuyente sandbox real antes de seguir ajustando la firma.';
  }

  if (input.latestRemoteSriSubmissionCategory === 'xml_structure') {
    return 'El ultimo rechazo remoto del SRI apunta a estructura XML o firma XAdES. El siguiente paso es revisar el artefacto firmado y contrastarlo contra el perfil esperado por CELCER antes de reintentar.';
  }

  if (input.latestRemoteSriSubmissionCategory === 'authorization_rejected') {
    return 'El ultimo intento remoto llego a una fase mas avanzada pero termino rechazado. Conviene revisar el detalle estructurado del SRI y corregir la observacion puntual antes de reintentar.';
  }

  if (input.latestRemoteSriSubmissionCategory === 'technical_failure') {
    return 'El ultimo intento remoto parece fallar por transporte o integracion. Revisa conectividad, endpoints y payloads SOAP antes de insistir con otra prueba.';
  }

  if (input.internalSignerIssuerAlignmentStatus === 'mismatched') {
    return 'El certificado inspeccionado parece pertenecer a un emisor distinto del RUC configurado en el tenant. Alinea primero emisor fiscal y PKCS#12 antes de insistir con CELCER.';
  }

  if (input.isReadyForRemoteSandboxSubmission) {
    return 'El tenant ya puede pasar a una prueba controlada contra SRI sandbox con firma interna.';
  }

  if (input.internalSignerCertificateValidityStatus === 'expired') {
    return 'El PKCS#12 ya abre, pero el certificado esta vencido. Renueva el certificado antes de insistir con sandbox remoto.';
  }

  if (input.internalSignerCertificateValidityStatus === 'not_yet_valid') {
    return 'El PKCS#12 ya abre, pero el certificado todavia no entra en vigencia. Espera su fecha de validez o carga el certificado correcto.';
  }

  if (
    input.internalSignerCertificateValidityStatus === 'unknown' &&
    input.internalSignerMaterialStatus === 'likely_usable'
  ) {
    return 'El PKCS#12 ya abre, pero todavia falta interpretar bien la vigencia del certificado antes de confiar en el carril remoto interno.';
  }

  if (
    input.internalSignerCertificateValidityStatus === 'expiring_soon' &&
    input.isReadyForPresignedRemoteSandboxSubmission
  ) {
    return 'El tenant ya puede probar sandbox remoto, pero el certificado vence pronto. Conviene planificar la renovacion antes de depender del signer interno.';
  }

  if (
    input.internalSignerCryptoProofStatus === 'failed' &&
    input.internalSignerMaterialStatus === 'likely_usable'
  ) {
    return 'El PKCS#12 ya abre, pero la llave privada no supero una prueba criptografica real. Revisa password, compatibilidad del keystore o material corrupto antes de insistir con sandbox remoto.';
  }

  if (
    input.internalSignerCryptoProofStatus === 'unknown' &&
    input.internalSignerMaterialStatus === 'likely_usable'
  ) {
    return 'El PKCS#12 ya abre, pero todavia falta confirmar que la llave privada realmente firme y verifique un challenge antes de confiar en el carril remoto interno.';
  }

  if (
    input.internalSignerOfflineCompatibilityStatus === 'failed' &&
    input.internalSignerMaterialStatus === 'likely_usable'
  ) {
    return 'El PKCS#12 ya abre y la llave privada responde, pero la firma interna todavia no supera la compatibilidad offline local del repo. Conviene corregir esa frontera antes de insistir con sandbox remoto interno.';
  }

  if (
    input.internalSignerOfflineCompatibilityStatus === 'unknown' &&
    input.internalSignerMaterialStatus === 'likely_usable'
  ) {
    return 'El PKCS#12 ya abre y la llave privada responde, pero todavia falta confirmar la compatibilidad offline local del XML firmado antes de confiar en el carril remoto interno.';
  }

  if (
    input.internalSignerIssuerAlignmentStatus === 'unknown' &&
    input.internalSignerMaterialStatus === 'likely_usable'
  ) {
    return 'El PKCS#12 ya abre y firma, pero todavia no hay evidencia suficiente para contrastar que el certificado corresponda al mismo emisor fiscal del tenant. Verifica manualmente esa alineacion antes de insistir con CELCER.';
  }

  if (
    input.internalSignerMaterialStatus === 'likely_usable' &&
    input.isReadyForPresignedRemoteSandboxSubmission
  ) {
    return input.internalSignerCryptoProofStatus === 'verified' &&
      input.internalSignerOfflineCompatibilityStatus === 'verified'
      ? 'El signer interno ya supera las pruebas locales del repo. El siguiente paso es una prueba controlada contra SRI sandbox con el tenant alineado.'
      : 'El material PKCS#12 ya parece cargable y el signer interno ya avanzo, pero todavia falta cerrar la compatibilidad offline local antes de depender del carril remoto interno.';
  }

  if (input.isReadyForPresignedRemoteSandboxSubmission) {
    return 'El tenant ya puede probar sandbox remoto usando XML prefirmado. La firma interna avanza, pero todavia falta cerrar o verificar la compatibilidad offline local antes de depender de ella.';
  }

  if (input.isReadyForLocalStubSubmission) {
    return 'El tenant puede seguir validando el pipeline interno con stub local mientras termina de cerrar el camino remoto.';
  }

  return 'Primero resuelve los blockers del flujo 01 y despues cambia a una prueba controlada en sandbox.';
}

function formatDaysSuffix(daysUntilExpiry: number | null): string {
  if (daysUntilExpiry === null) {
    return '';
  }

  return ` (${daysUntilExpiry} dias)`;
}

function formatDaysAgoSuffix(daysUntilExpiry: number | null): string {
  if (daysUntilExpiry === null) {
    return '';
  }

  return ` hace ${Math.abs(daysUntilExpiry)} dias`;
}

function pushBlocked(
  checks: ElectronicInvoicingReadinessCheck[],
  blockers: string[],
  key: ElectronicInvoicingReadinessCheck['key'],
  label: string,
  detail: string,
): void {
  checks.push({
    key,
    label,
    status: 'blocked',
    detail,
  });
  blockers.push(detail);
}

function blockedKeysFrom(
  checks: ElectronicInvoicingReadinessCheck[],
): Set<ElectronicInvoicingReadinessCheck['key']> {
  return new Set(
    checks.filter((check) => check.status === 'blocked').map((check) => check.key),
  );
}

function isKnownLocalSandboxDemoTaxId(taxId: string): boolean {
  const normalized = normalizeTaxId(taxId);

  return normalized === '1790012345001';
}

function normalizeTaxId(value: string | null | undefined): string {
  return value?.replace(/\D/g, '') ?? '';
}

function classifyRemoteSriSubmissionFeedback(
  message: string,
  responsePayload: string | null,
  providerStatus: string,
): {
  category:
    | 'taxpayer_not_registered'
    | 'xml_structure'
    | 'authorization_rejected'
    | 'technical_failure'
    | 'unknown';
  summary: string | null;
} {
  const haystack = `${message}\n${responsePayload ?? ''}`.toLowerCase();

  if (haystack.includes('no existe un contribuyente registrado con el ruc')) {
    return {
      category: 'taxpayer_not_registered',
      summary: message,
    };
  }

  if (haystack.includes('archivo no cumple estructura xml')) {
    return {
      category: 'xml_structure',
      summary: message,
    };
  }

  if (
    haystack.includes('fallo tecnico') ||
    haystack.includes('timeout') ||
    haystack.includes('socket') ||
    haystack.includes('axios')
  ) {
    return {
      category: 'technical_failure',
      summary: message,
    };
  }

  if (
    providerStatus === 'DEVUELTA' ||
    providerStatus === 'NO AUTORIZADO' ||
    providerStatus === 'rejected'
  ) {
    return {
      category: 'authorization_rejected',
      summary: message,
    };
  }

  return {
    category: 'unknown',
    summary: message || null,
  };
}
