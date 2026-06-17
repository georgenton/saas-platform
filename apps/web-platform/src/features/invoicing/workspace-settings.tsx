import type { FormEventHandler } from 'react';
import styles from '../../app/app.module.css';
import type {
  ElectronicSandboxReadinessResponse,
  ElectronicSignatureMaterialInspectionResponse,
} from '../../app/types';

type SettingsSectionKey = 'issuer' | 'numbering' | 'signature' | 'gateway';
type SettingsTone = 'success' | 'warning' | 'danger' | 'neutral';

type SettingsStatus = {
  label: string;
  tone: SettingsTone;
};

type SettingsReadinessViewModel = {
  gateway: SettingsStatus;
  issuer: SettingsStatus;
  numbering: SettingsStatus;
  recommendedSection: SettingsSectionKey | null;
  sandboxTier: SettingsStatus;
  signature: SettingsStatus;
  verdict: SettingsStatus & {
    description: string;
    title: string;
  };
};

type InvoicingWorkspaceSettingsProps = {
  actionLoading: string | null;
  canSyncIssuerTaxId: boolean;
  extractedCertificateTaxId: string | null;
  formatDate: (value: string | null | undefined) => string;
  handleSyncIssuerProfileTaxIdFromSignature: () => void;
  issuerForm: {
    accountingObligated: boolean;
    commercialName: string;
    environment: 'test' | 'production';
    establishmentAddress: string;
    legalName: string;
    matrixAddress: string;
    rimpeTaxpayerType: string;
    specialTaxpayerCode: string;
    taxId: string;
    taxIdMatchesCertificate: boolean | null;
    onAccountingObligatedChange: (value: boolean) => void;
    onCommercialNameChange: (value: string) => void;
    onEnvironmentChange: (value: 'test' | 'production') => void;
    onEstablishmentAddressChange: (value: string) => void;
    onLegalNameChange: (value: string) => void;
    onMatrixAddressChange: (value: string) => void;
    onRimpeTaxpayerTypeChange: (value: string) => void;
    onSpecialTaxpayerCodeChange: (value: string) => void;
    onSubmit: FormEventHandler<HTMLFormElement>;
    onTaxIdChange: (value: string) => void;
  };
  numberingForm: {
    documentCode: string;
    emissionPointCode: string;
    establishmentCode: string;
    nextSequence: string;
    previewNumber: string | null;
    onDocumentCodeChange: (value: string) => void;
    onEmissionPointCodeChange: (value: string) => void;
    onEstablishmentCodeChange: (value: string) => void;
    onNextSequenceChange: (value: string) => void;
    onSubmit: FormEventHandler<HTMLFormElement>;
  };
  signatureForm: {
    certificateFingerprint: string;
    certificateLabel: string;
    hydrateMetadataFromPkcs12: boolean;
    inspection: ElectronicSignatureMaterialInspectionResponse | null;
    isActive: boolean;
    materialConfigured: boolean;
    passwordSecretRef: string;
    pkcs12SecretRef: string;
    provider: 'stub_local' | 'xades_pkcs12';
    storageMode: 'stub_inline' | 'secret_ref';
    subjectName: string;
    onCertificateFingerprintChange: (value: string) => void;
    onCertificateLabelChange: (value: string) => void;
    onHydrateMetadataFromPkcs12Change: (value: boolean) => void;
    onIsActiveChange: (value: boolean) => void;
    onPasswordSecretRefChange: (value: string) => void;
    onPkcs12SecretRefChange: (value: string) => void;
    onProviderChange: (value: 'stub_local' | 'xades_pkcs12') => void;
    onStorageModeChange: (value: 'stub_inline' | 'secret_ref') => void;
    onSubjectNameChange: (value: string) => void;
    onSubmit: FormEventHandler<HTMLFormElement>;
  };
  submissionForm: {
    authorizationUrl: string;
    credentialsSecretRef: string;
    environment: 'test' | 'production';
    gatewayConfigured: boolean;
    isActive: boolean;
    provider: 'stub_sri' | 'sri_offline_ws';
    readiness: ElectronicSandboxReadinessResponse | null;
    receptionUrl: string;
    timeoutMs: string;
    transmissionMode: 'sync_stub' | 'offline';
    onAuthorizationUrlChange: (value: string) => void;
    onCredentialsSecretRefChange: (value: string) => void;
    onEnvironmentChange: (value: 'test' | 'production') => void;
    onIsActiveChange: (value: boolean) => void;
    onProviderChange: (value: 'stub_sri' | 'sri_offline_ws') => void;
    onReceptionUrlChange: (value: string) => void;
    onSubmit: FormEventHandler<HTMLFormElement>;
    onTimeoutMsChange: (value: string) => void;
    onTransmissionModeChange: (value: 'sync_stub' | 'offline') => void;
  };
};

export function InvoicingWorkspaceSettings({
  actionLoading,
  canSyncIssuerTaxId,
  extractedCertificateTaxId,
  formatDate,
  handleSyncIssuerProfileTaxIdFromSignature,
  issuerForm,
  numberingForm,
  signatureForm,
  submissionForm,
}: InvoicingWorkspaceSettingsProps) {
  const readinessView = buildSettingsReadinessView({
    issuerForm,
    numberingForm,
    signatureForm,
    submissionForm,
  });

  return (
    <div className={styles.invoicingSettingsSurface}>
      <SriReadinessHeader
        environment={issuerForm.environment}
        readinessView={readinessView}
      />

      <SriRecommendedStep
        readiness={submissionForm.readiness}
        readinessView={readinessView}
      />

      <div
        className={`${styles.detailCard} ${styles.invoicingSettingsSectionCard} ${
          readinessView.recommendedSection === 'issuer'
            ? styles.invoicingSettingsSectionCardHighlighted
            : ''
        }`}
        id="invoicing-issuer-profile"
      >
        <div className={styles.sectionHeading}>
          <div>
            <span className={styles.label}>Electronic issuer</span>
            <h3>Perfil fiscal del emisor</h3>
          </div>
          <StatusBadge status={readinessView.issuer} />
        </div>

        <form className={styles.stack} onSubmit={issuerForm.onSubmit}>
          <div className={styles.invoiceInlineGrid}>
            <label className={styles.field}>
              <span>Razon social</span>
              <input
                onChange={(event) =>
                  issuerForm.onLegalNameChange(event.target.value)
                }
                placeholder="Mi Empresa S.A."
                value={issuerForm.legalName}
              />
            </label>
            <label className={styles.field}>
              <span>Nombre comercial</span>
              <input
                onChange={(event) =>
                  issuerForm.onCommercialNameChange(event.target.value)
                }
                placeholder="Mi Empresa"
                value={issuerForm.commercialName}
              />
            </label>
          </div>

          <div className={styles.invoiceInlineGrid}>
            <label className={styles.field}>
              <span>RUC</span>
              <input
                maxLength={13}
                onChange={(event) => issuerForm.onTaxIdChange(event.target.value)}
                placeholder="1790012345001"
                value={issuerForm.taxId}
              />
            </label>
            <label className={styles.field}>
              <span>Ambiente</span>
              <select
                className={styles.selectField}
                onChange={(event) =>
                  issuerForm.onEnvironmentChange(
                    event.target.value === 'production' ? 'production' : 'test',
                  )
                }
                value={issuerForm.environment}
              >
                <option value="test">Pruebas</option>
                <option value="production">Produccion</option>
              </select>
            </label>
          </div>

          {extractedCertificateTaxId ? (
            <div className={styles.detailCard}>
              <span className={styles.muted}>RUC extraido del certificado</span>
              <strong>{extractedCertificateTaxId}</strong>
              <p>
                {issuerForm.taxIdMatchesCertificate === true
                  ? 'El perfil fiscal actual ya coincide con el certificado inspeccionado.'
                  : issuerForm.taxIdMatchesCertificate === false
                    ? 'El RUC del perfil fiscal no coincide con el certificado. Antes de probar CELCER conviene alinearlos.'
                    : 'Todavia falta completar el RUC del perfil fiscal para contrastarlo contra el certificado.'}
              </p>
              <button
                className={styles.secondaryButton}
                disabled={issuerForm.taxId.trim() === extractedCertificateTaxId}
                onClick={() =>
                  issuerForm.onTaxIdChange(extractedCertificateTaxId)
                }
                type="button"
              >
                Usar RUC del certificado
              </button>
              <button
                className={styles.secondaryButton}
                disabled={
                  !canSyncIssuerTaxId ||
                  actionLoading === 'sync-issuer-profile-tax-id'
                }
                onClick={handleSyncIssuerProfileTaxIdFromSignature}
                type="button"
              >
                {actionLoading === 'sync-issuer-profile-tax-id'
                  ? 'Alineando...'
                  : 'Alinear y guardar'}
              </button>
            </div>
          ) : null}

          <div className={styles.invoiceInlineGrid}>
            <label className={styles.field}>
              <span>Contribuyente especial</span>
              <input
                onChange={(event) =>
                  issuerForm.onSpecialTaxpayerCodeChange(event.target.value)
                }
                placeholder="5368"
                value={issuerForm.specialTaxpayerCode}
              />
            </label>
            <label className={styles.field}>
              <span>RIMPE</span>
              <input
                onChange={(event) =>
                  issuerForm.onRimpeTaxpayerTypeChange(event.target.value)
                }
                placeholder="Negocio popular / Emprendedor"
                value={issuerForm.rimpeTaxpayerType}
              />
            </label>
          </div>

          <label className={styles.checkboxField}>
            <input
              checked={issuerForm.accountingObligated}
              onChange={(event) =>
                issuerForm.onAccountingObligatedChange(event.target.checked)
              }
              type="checkbox"
            />
            <span>Obligado a llevar contabilidad</span>
          </label>

          <label className={styles.field}>
            <span>Direccion matriz</span>
            <input
              onChange={(event) =>
                issuerForm.onMatrixAddressChange(event.target.value)
              }
              placeholder="Av. Principal y Calle Secundaria"
              value={issuerForm.matrixAddress}
            />
          </label>

          <label className={styles.field}>
            <span>Direccion establecimiento</span>
            <input
              onChange={(event) =>
                issuerForm.onEstablishmentAddressChange(event.target.value)
              }
              placeholder="Sucursal matriz o punto de emision"
              value={issuerForm.establishmentAddress}
            />
          </label>

          <button
            className={styles.primaryButton}
            disabled={
              !issuerForm.legalName.trim() ||
              !issuerForm.taxId.trim() ||
              !issuerForm.matrixAddress.trim() ||
              !issuerForm.establishmentAddress.trim() ||
              actionLoading === 'upsert-issuer-profile'
            }
            type="submit"
          >
            {actionLoading === 'upsert-issuer-profile'
              ? 'Guardando perfil...'
              : 'Guardar perfil fiscal'}
          </button>
        </form>
      </div>

      <div
        className={`${styles.detailCard} ${styles.invoicingSettingsSectionCard} ${
          readinessView.recommendedSection === 'numbering'
            ? styles.invoicingSettingsSectionCardHighlighted
            : ''
        }`}
      >
        <div className={styles.sectionHeading}>
          <div>
            <span className={styles.label}>Ecuador numbering</span>
            <h3>Serie y secuencial</h3>
          </div>
          <StatusBadge status={readinessView.numbering} />
        </div>

        <div className={styles.invoicingSettingsNumberPreview}>
          <span>{numberingForm.establishmentCode || '000'}</span>
          <span>{numberingForm.emissionPointCode || '000'}</span>
          <span>
            {numberingForm.previewNumber
              ? numberingForm.previewNumber.split('-')[2]
              : numberingForm.nextSequence.padStart(9, '0')}
          </span>
        </div>

        <form className={styles.stack} onSubmit={numberingForm.onSubmit}>
          <div className={styles.invoiceInlineGrid}>
            <label className={styles.field}>
              <span>CodDoc</span>
              <input
                maxLength={2}
                onChange={(event) =>
                  numberingForm.onDocumentCodeChange(event.target.value)
                }
                placeholder="01"
                value={numberingForm.documentCode}
              />
            </label>
            <label className={styles.field}>
              <span>Estab</span>
              <input
                maxLength={3}
                onChange={(event) =>
                  numberingForm.onEstablishmentCodeChange(event.target.value)
                }
                placeholder="001"
                value={numberingForm.establishmentCode}
              />
            </label>
            <label className={styles.field}>
              <span>PtoEmi</span>
              <input
                maxLength={3}
                onChange={(event) =>
                  numberingForm.onEmissionPointCodeChange(event.target.value)
                }
                placeholder="002"
                value={numberingForm.emissionPointCode}
              />
            </label>
          </div>

          <label className={styles.field}>
            <span>Siguiente secuencial</span>
            <input
              min="1"
              onChange={(event) =>
                numberingForm.onNextSequenceChange(event.target.value)
              }
              placeholder="31"
              type="number"
              value={numberingForm.nextSequence}
            />
          </label>

          <button
            className={styles.primaryButton}
            disabled={
              !numberingForm.documentCode.trim() ||
              !numberingForm.establishmentCode.trim() ||
              !numberingForm.emissionPointCode.trim() ||
              !numberingForm.nextSequence.trim() ||
              actionLoading === 'upsert-invoice-numbering'
            }
            type="submit"
          >
            {actionLoading === 'upsert-invoice-numbering'
              ? 'Guardando numeracion...'
              : 'Guardar numeracion'}
          </button>

          <p className={styles.muted}>
            {numberingForm.previewNumber
              ? `Proxima factura sugerida: ${numberingForm.previewNumber}`
              : 'Si dejas el numero vacio al crear la factura, se usara esta configuracion automaticamente.'}
          </p>
        </form>
      </div>

      <div
        className={`${styles.detailCard} ${styles.invoicingSettingsSectionCard} ${
          readinessView.recommendedSection === 'signature'
            ? styles.invoicingSettingsSectionCardHighlighted
            : ''
        }`}
        id="invoicing-signature-settings"
      >
        <div className={styles.sectionHeading}>
          <div>
            <span className={styles.label}>Electronic signature</span>
            <h3>Configuracion de firma</h3>
          </div>
          <StatusBadge status={readinessView.signature} />
        </div>

        <SignatureHealthStrip signatureForm={signatureForm} />

        <form className={styles.stack} onSubmit={signatureForm.onSubmit}>
          <div className={styles.invoiceInlineGrid}>
            <label className={styles.field}>
              <span>Provider</span>
              <select
                className={styles.selectField}
                onChange={(event) =>
                  signatureForm.onProviderChange(
                    event.target.value === 'xades_pkcs12'
                      ? 'xades_pkcs12'
                      : 'stub_local',
                  )
                }
                value={signatureForm.provider}
              >
                <option value="stub_local">stub_local</option>
                <option value="xades_pkcs12">xades_pkcs12</option>
              </select>
            </label>
            <label className={styles.field}>
              <span>Storage mode</span>
              <select
                className={styles.selectField}
                onChange={(event) =>
                  signatureForm.onStorageModeChange(
                    event.target.value === 'secret_ref'
                      ? 'secret_ref'
                      : 'stub_inline',
                  )
                }
                value={signatureForm.storageMode}
              >
                <option value="stub_inline">stub_inline</option>
                <option value="secret_ref">secret_ref</option>
              </select>
            </label>
          </div>

          <div className={styles.invoiceInlineGrid}>
            <label className={styles.field}>
              <span>Nombre del certificado</span>
              <input
                onChange={(event) =>
                  signatureForm.onCertificateLabelChange(event.target.value)
                }
                placeholder="TOKEN BCE pruebas / Firma Legal"
                value={signatureForm.certificateLabel}
              />
            </label>
            <label className={styles.field}>
              <span>Subject name</span>
              <input
                onChange={(event) =>
                  signatureForm.onSubjectNameChange(event.target.value)
                }
                placeholder="CN=Empresa S.A., O=Empresa"
                value={signatureForm.subjectName}
              />
            </label>
          </div>

          <div className={styles.invoiceInlineGrid}>
            <label className={styles.field}>
              <span>Fingerprint</span>
              <input
                onChange={(event) =>
                  signatureForm.onCertificateFingerprintChange(
                    event.target.value,
                  )
                }
                placeholder="AA:BB:CC:DD..."
                value={signatureForm.certificateFingerprint}
              />
            </label>
            <label className={styles.field}>
              <span>Estado del material</span>
              <input
                disabled
                value={
                  signatureForm.materialConfigured ? 'Configurado' : 'Incompleto'
                }
              />
            </label>
          </div>

          {signatureForm.provider === 'xades_pkcs12' ? (
            <>
              <div className={styles.invoiceInlineGrid}>
                <label className={styles.field}>
                  <span>PKCS#12 secret ref</span>
                  <input
                    onChange={(event) =>
                      signatureForm.onPkcs12SecretRefChange(event.target.value)
                    }
                    placeholder="vault://ec/signatures/tenant-123/pkcs12"
                    value={signatureForm.pkcs12SecretRef}
                  />
                </label>
                <label className={styles.field}>
                  <span>Password secret ref</span>
                  <input
                    onChange={(event) =>
                      signatureForm.onPasswordSecretRefChange(event.target.value)
                    }
                    placeholder="vault://ec/signatures/tenant-123/password"
                    value={signatureForm.passwordSecretRef}
                  />
                </label>
              </div>

              <label className={styles.checkboxField}>
                <input
                  checked={signatureForm.hydrateMetadataFromPkcs12}
                  onChange={(event) =>
                    signatureForm.onHydrateMetadataFromPkcs12Change(
                      event.target.checked,
                    )
                  }
                  type="checkbox"
                />
                <span>
                  Hidratar fingerprint y subject desde el PKCS#12 al guardar
                </span>
              </label>
            </>
          ) : null}

          <label className={styles.checkboxField}>
            <input
              checked={signatureForm.isActive}
              onChange={(event) =>
                signatureForm.onIsActiveChange(event.target.checked)
              }
              type="checkbox"
            />
            <span>Firma habilitada para el tenant</span>
          </label>

          <button
            className={styles.primaryButton}
            disabled={
              !signatureForm.certificateLabel.trim() ||
              actionLoading === 'upsert-electronic-signature-settings'
            }
            type="submit"
          >
            {actionLoading === 'upsert-electronic-signature-settings'
              ? 'Guardando firma...'
              : 'Guardar firma electronica'}
          </button>

          <p className={styles.muted}>
            Esta configuracion separa metadatos visibles del material sensible.
            Para `xades_pkcs12`, el sistema ya exige referencias al PKCS#12 y su
            password antes de firmar, y ahora ya puede producir una firma
            criptografica inicial aunque XAdES completo siga pendiente.
          </p>

          {signatureForm.inspection ? (
            <SignatureInspectionCard inspection={signatureForm.inspection} />
          ) : null}
        </form>
      </div>

      <div
        className={`${styles.detailCard} ${styles.invoicingSettingsSectionCard} ${
          readinessView.recommendedSection === 'gateway'
            ? styles.invoicingSettingsSectionCardHighlighted
            : ''
        }`}
      >
        <div className={styles.sectionHeading}>
          <div>
            <span className={styles.label}>Electronic submission</span>
            <h3>Gateway SRI</h3>
          </div>
          <StatusBadge status={readinessView.gateway} />
        </div>

        {submissionForm.readiness ? (
          <SriReadinessRail readiness={submissionForm.readiness} />
        ) : null}

        <form className={styles.stack} onSubmit={submissionForm.onSubmit}>
          <div className={styles.invoiceInlineGrid}>
            <label className={styles.field}>
              <span>Provider</span>
              <select
                className={styles.selectField}
                onChange={(event) =>
                  submissionForm.onProviderChange(
                    event.target.value === 'sri_offline_ws'
                      ? 'sri_offline_ws'
                      : 'stub_sri',
                  )
                }
                value={submissionForm.provider}
              >
                <option value="stub_sri">stub_sri</option>
                <option value="sri_offline_ws">sri_offline_ws</option>
              </select>
            </label>
            <label className={styles.field}>
              <span>Ambiente</span>
              <select
                className={styles.selectField}
                onChange={(event) =>
                  submissionForm.onEnvironmentChange(
                    event.target.value === 'production' ? 'production' : 'test',
                  )
                }
                value={submissionForm.environment}
              >
                <option value="test">Pruebas</option>
                <option value="production">Produccion</option>
              </select>
            </label>
          </div>

          <div className={styles.invoiceInlineGrid}>
            <label className={styles.field}>
              <span>Modo de transmision</span>
              <select
                className={styles.selectField}
                onChange={(event) =>
                  submissionForm.onTransmissionModeChange(
                    event.target.value === 'offline' ? 'offline' : 'sync_stub',
                  )
                }
                value={submissionForm.transmissionMode}
              >
                <option value="sync_stub">sync_stub</option>
                <option value="offline">offline</option>
              </select>
            </label>
            <label className={styles.field}>
              <span>Timeout (ms)</span>
              <input
                min="1000"
                onChange={(event) =>
                  submissionForm.onTimeoutMsChange(event.target.value)
                }
                type="number"
                value={submissionForm.timeoutMs}
              />
            </label>
          </div>

          <div className={styles.invoiceInlineGrid}>
            <label className={styles.field}>
              <span>Reception URL</span>
              <input
                onChange={(event) =>
                  submissionForm.onReceptionUrlChange(event.target.value)
                }
                placeholder="https://celcer.sri.gob.ec/..."
                value={submissionForm.receptionUrl}
              />
            </label>
            <label className={styles.field}>
              <span>Authorization URL</span>
              <input
                onChange={(event) =>
                  submissionForm.onAuthorizationUrlChange(event.target.value)
                }
                placeholder="https://celcer.sri.gob.ec/..."
                value={submissionForm.authorizationUrl}
              />
            </label>
          </div>

          <div className={styles.invoiceInlineGrid}>
            <label className={styles.field}>
              <span>Credentials secret ref</span>
              <input
                onChange={(event) =>
                  submissionForm.onCredentialsSecretRefChange(event.target.value)
                }
                placeholder="vault://ec/sri/tenant-123"
                value={submissionForm.credentialsSecretRef}
              />
            </label>
            <label className={styles.field}>
              <span>Gateway readiness</span>
              <input
                disabled
                value={
                  submissionForm.gatewayConfigured ? 'Configurado' : 'Incompleto'
                }
              />
            </label>
          </div>

          <label className={styles.checkboxField}>
            <input
              checked={submissionForm.isActive}
              onChange={(event) =>
                submissionForm.onIsActiveChange(event.target.checked)
              }
              type="checkbox"
            />
            <span>Envio electronico habilitado para el tenant</span>
          </label>

          <button
            className={styles.primaryButton}
            disabled={
              !submissionForm.timeoutMs.trim() ||
              actionLoading === 'upsert-electronic-submission-settings'
            }
            type="submit"
          >
            {actionLoading === 'upsert-electronic-submission-settings'
              ? 'Guardando gateway...'
              : 'Guardar gateway SRI'}
          </button>

          <p className={styles.muted}>
            Este setting prepara la frontera real de recepcion y autorizacion.
            En `stub_sri` todo queda local; en `sri_offline_ws` ya empezamos a
            modelar URLs y, opcionalmente, secretos por tenant sin cambiar el
            contrato del gateway.
          </p>

          {submissionForm.readiness ? (
            <SandboxReadinessCard
              formatDate={formatDate}
              readiness={submissionForm.readiness}
            />
          ) : null}
        </form>
      </div>
    </div>
  );
}

function SriReadinessHeader({
  environment,
  readinessView,
}: {
  environment: 'test' | 'production';
  readinessView: SettingsReadinessViewModel;
}) {
  return (
    <div
      className={`${styles.detailCard} ${styles.invoicingSettingsReadinessHeader}`}
    >
      <div className={styles.invoicingSettingsVerdict}>
        <div>
          <span className={styles.label}>Preparacion SRI</span>
          <h3>{readinessView.verdict.title}</h3>
          <p>{readinessView.verdict.description}</p>
        </div>
        <div className={styles.badgeRow}>
          <StatusBadge status={readinessView.verdict} />
          <StatusBadge
            status={{
              label: environment === 'production' ? 'Produccion' : 'Pruebas',
              tone: environment === 'production' ? 'success' : 'warning',
            }}
          />
          <StatusBadge status={readinessView.sandboxTier} />
        </div>
      </div>

      <div className={styles.invoicingSettingsPillarGrid}>
        <PillarCard label="Emisor" status={readinessView.issuer} />
        <PillarCard label="Numeracion" status={readinessView.numbering} />
        <PillarCard label="Firma" status={readinessView.signature} />
        <PillarCard label="Gateway" status={readinessView.gateway} />
      </div>
    </div>
  );
}

function SriRecommendedStep({
  readiness,
  readinessView,
}: {
  readiness: ElectronicSandboxReadinessResponse | null;
  readinessView: SettingsReadinessViewModel;
}) {
  const status = readinessView.verdict.tone === 'success'
    ? { label: 'Listo', tone: 'success' as const }
    : { label: 'Siguiente paso', tone: readinessView.verdict.tone };

  return (
    <div className={styles.invoicingSRINextStepCard}>
      <div className={styles.invoicingSRINextStepHeader}>
        <span className={styles.label}>Recomendacion</span>
        <StatusBadge status={status} />
      </div>
      <strong className={styles.invoicingSRINextStepTitle}>
        {recommendedSectionTitle(readinessView.recommendedSection)}
      </strong>
      <p className={styles.invoicingSRINextStepDescription}>
        {readiness?.recommendedNextStep ??
          'Completa los cuatro bloques para habilitar una revision operativa de emision electronica.'}
      </p>
    </div>
  );
}

function SriReadinessRail({
  readiness,
}: {
  readiness: ElectronicSandboxReadinessResponse;
}) {
  return (
    <div className={styles.invoicingSettingsReadinessRail}>
      <div>
        <span className={styles.label}>Sandbox ladder</span>
        <div className={styles.invoicingSettingsTierList}>
          <TierRung
            active={readiness.isReadyForLocalStubSubmission}
            label="Validacion local"
          />
          <TierRung
            active={readiness.isReadyForPresignedRemoteSandboxSubmission}
            label="XML prefirmado remoto"
          />
          <TierRung
            active={readiness.isReadyForRemoteSandboxSubmission}
            label="Firma interna remota"
          />
        </div>
      </div>

      {readiness.checks.length > 0 ? (
        <div>
          <span className={styles.label}>Checks</span>
          <div className={styles.invoicingSettingsCheckList}>
            {readiness.checks.map((check) => (
              <div className={styles.invoicingSettingsCheckItem} key={check.key}>
                <StatusBadge
                  status={{
                    label: check.status,
                    tone: check.status === 'ready'
                      ? 'success'
                      : check.status === 'blocked'
                        ? 'danger'
                        : 'warning',
                  }}
                />
                <div>
                  <strong>{check.label}</strong>
                  <small>{check.detail}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {readiness.blockers.length > 0 || readiness.warnings.length > 0 ? (
        <div className={styles.invoicingSettingsGapList}>
          <span className={styles.label}>Que falta</span>
          {readiness.blockers.map((item) => (
            <p key={`blocker-${item}`}>{item}</p>
          ))}
          {readiness.warnings.map((item) => (
            <p key={`warning-${item}`}>{item}</p>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function SignatureHealthStrip({
  signatureForm,
}: {
  signatureForm: InvoicingWorkspaceSettingsProps['signatureForm'];
}) {
  const validity = signatureForm.inspection?.inspection.certificateValidityStatus;
  const daysUntilExpiry = signatureForm.inspection?.inspection.daysUntilExpiry;

  return (
    <div className={styles.invoicingSettingsHealthStrip}>
      <ReadinessFact
        label="Material"
        value={signatureForm.materialConfigured ? 'Configurado' : 'Incompleto'}
      />
      <ReadinessFact
        label="Vigencia"
        value={validity ? certificateValidityLabel(validity) : 'Sin evidencia'}
        detail={
          daysUntilExpiry !== null && daysUntilExpiry !== undefined
            ? `${daysUntilExpiry} dias restantes`
            : null
        }
      />
      <ReadinessFact
        label="Prueba criptografica"
        value={
          signatureForm.inspection
            ? cryptoProofLabel(
                signatureForm.inspection.inspection.cryptographicProofStatus,
              )
            : 'Sin evidencia'
        }
      />
    </div>
  );
}

function PillarCard({
  label,
  status,
}: {
  label: string;
  status: SettingsStatus;
}) {
  return (
    <div className={styles.invoicingSettingsPillarCard}>
      <span>{label}</span>
      <StatusBadge status={status} />
    </div>
  );
}

function TierRung({ active, label }: { active: boolean; label: string }) {
  return (
    <div className={styles.invoicingSettingsTierRung}>
      <span
        className={`${styles.invoicingReadinessDot} ${
          active
            ? styles.invoicingReadinessDotSuccess
            : styles.invoicingReadinessDotNeutral
        }`}
      />
      <span>{label}</span>
    </div>
  );
}

function StatusBadge({ status }: { status: SettingsStatus }) {
  const toneClass =
    status.tone === 'success'
      ? styles.statusPillSuccess
      : status.tone === 'warning'
        ? styles.statusPillWarning
        : status.tone === 'danger'
          ? styles.statusPillDanger
          : '';

  return (
    <span className={`${styles.statusPill} ${toneClass}`}>{status.label}</span>
  );
}

function SignatureInspectionCard({
  inspection,
}: {
  inspection: ElectronicSignatureMaterialInspectionResponse;
}) {
  return (
    <div className={styles.detailCard}>
      <span className={styles.muted}>PKCS#12 inspection</span>
      <h3>
        {inspection.inspection.status === 'likely_usable'
          ? 'Keystore abrible'
          : inspection.inspection.status === 'not_applicable'
            ? 'No aplica'
            : inspection.inspection.status === 'not_configured'
              ? 'Sin configuracion'
              : 'Inspeccion con hallazgos'}
      </h3>
      <p>{inspection.inspection.detail}</p>
      <div className={styles.invoiceInlineGrid}>
        <div className={styles.field}>
          <span>Probe method</span>
          <input disabled value={inspection.inspection.probeMethod} />
        </div>
        <div className={styles.field}>
          <span>Encoding</span>
          <input disabled value={inspection.inspection.encoding} />
        </div>
      </div>
      <div className={styles.invoiceInlineGrid}>
        <div className={styles.field}>
          <span>Extracted fingerprint</span>
          <input
            disabled
            value={inspection.inspection.extractedFingerprint ?? 'No extraido'}
          />
        </div>
        <div className={styles.field}>
          <span>Extracted subject</span>
          <input
            disabled
            value={inspection.inspection.extractedSubjectName ?? 'No extraido'}
          />
        </div>
      </div>
      <div className={styles.invoiceInlineGrid}>
        <div className={styles.field}>
          <span>Extracted issuer</span>
          <input
            disabled
            value={inspection.inspection.extractedIssuerName ?? 'No extraido'}
          />
        </div>
        <div className={styles.field}>
          <span>Extracted tax ID</span>
          <input
            disabled
            value={inspection.inspection.extractedTaxId ?? 'No extraido'}
          />
        </div>
        <div className={styles.field}>
          <span>Validity status</span>
          <input
            disabled
            value={inspection.inspection.certificateValidityStatus}
          />
        </div>
      </div>
      <div className={styles.invoiceInlineGrid}>
        <div className={styles.field}>
          <span>Valid from</span>
          <input disabled value={inspection.inspection.validFrom ?? 'No extraido'} />
        </div>
        <div className={styles.field}>
          <span>Valid until</span>
          <input disabled value={inspection.inspection.validUntil ?? 'No extraido'} />
        </div>
      </div>
      <div className={styles.invoiceInlineGrid}>
        <div className={styles.field}>
          <span>Days until expiry</span>
          <input
            disabled
            value={
              inspection.inspection.daysUntilExpiry !== null
                ? String(inspection.inspection.daysUntilExpiry)
                : 'No calculado'
            }
          />
        </div>
        <div className={styles.field}>
          <span>Crypto proof</span>
          <input
            disabled
            value={inspection.inspection.cryptographicProofStatus}
          />
        </div>
      </div>
      <p>{inspection.inspection.cryptographicProofDetail}</p>
    </div>
  );
}

function SandboxReadinessCard({
  formatDate,
  readiness,
}: {
  formatDate: (value: string | null | undefined) => string;
  readiness: ElectronicSandboxReadinessResponse;
}) {
  return (
    <div className={styles.detailCard}>
      <div className={styles.sectionHeading}>
        <div>
          <span className={styles.label}>Sandbox readiness</span>
          <h3>
            {readiness.isReadyForRemoteSandboxSubmission
              ? 'Listo para sandbox remoto con firma interna'
              : readiness.isReadyForPresignedRemoteSandboxSubmission
                ? 'Listo para sandbox remoto con XML prefirmado'
                : readiness.isReadyForLocalStubSubmission
                  ? 'Listo para validacion local con stub'
                  : 'Todavia bloqueado para sandbox real'}
          </h3>
        </div>
      </div>

      <div className={styles.invoiceDetailGrid}>
        <ReadinessFact
          label="Signature provider"
          value={readiness.signatureProvider ?? 'No configurado'}
        />
        <ReadinessFact
          label="Submission path"
          value={readiness.submissionProvider ?? 'No configurado'}
          detail={readiness.transmissionMode ?? 'Sin transmission mode'}
        />
        <ReadinessFact
          label="Local stub"
          value={readiness.isReadyForLocalStubSubmission ? 'Listo' : 'Pendiente'}
        />
        <ReadinessFact
          label="Remote presigned"
          value={
            readiness.isReadyForPresignedRemoteSandboxSubmission
              ? 'Listo'
              : 'Pendiente'
          }
        />
        <ReadinessFact
          label="Remote internal signer"
          value={
            readiness.isReadyForRemoteSandboxSubmission ? 'Listo' : 'Pendiente'
          }
        />
        <ReadinessFact
          label="PKCS#12 interno"
          value={
            readiness.isInternalSignerMaterialReady
              ? 'Cargable'
              : readiness.internalSignerMaterialStatus === 'not_applicable'
                ? 'No aplica'
                : readiness.internalSignerMaterialStatus === 'not_configured'
                  ? 'No configurado'
                  : 'Pendiente'
          }
          detail={readiness.internalSignerMaterialDetail}
        />
        <ReadinessFact
          label="Vigencia certificado"
          value={certificateValidityLabel(
            readiness.internalSignerCertificateValidityStatus,
          )}
          detail={readiness.internalSignerCertificateValidityDetail}
          extra={
            readiness.internalSignerCertificateValidUntil
              ? `Vence: ${readiness.internalSignerCertificateValidUntil}`
              : null
          }
        />
        <ReadinessFact
          label="Prueba criptografica"
          value={cryptoProofLabel(readiness.internalSignerCryptoProofStatus)}
          detail={readiness.internalSignerCryptoProofDetail}
        />
        <ReadinessFact
          label="Compatibilidad offline"
          value={cryptoProofLabel(readiness.internalSignerOfflineCompatibilityStatus)}
          detail={readiness.internalSignerOfflineCompatibilityDetail}
        />
        <ReadinessFact
          label="Alineacion emisor-certificado"
          value={issuerAlignmentLabel(readiness.internalSignerIssuerAlignmentStatus)}
          detail={readiness.internalSignerIssuerAlignmentDetail}
          extra={
            readiness.internalSignerExtractedTaxId
              ? `RUC extraido: ${readiness.internalSignerExtractedTaxId}`
              : null
          }
        />
        <ReadinessFact
          label="Ultimo feedback remoto SRI"
          value={remoteSriFeedbackLabel(readiness)}
          detail={
            readiness.latestRemoteSriSubmissionSummary ??
            'Todavia no existe un envio remoto reciente registrado para este tenant.'
          }
          extra={
            readiness.latestRemoteSriSubmissionOccurredAt
              ? `Ultimo intento: ${formatDate(
                  readiness.latestRemoteSriSubmissionOccurredAt,
                )}${
                  readiness.latestRemoteSriSubmissionStatus
                    ? ` · ${readiness.latestRemoteSriSubmissionStatus}`
                    : ''
                }`
              : null
          }
        />
      </div>

      {readiness.blockers.length > 0 ? (
        <div className={styles.detailCard}>
          <span className={styles.muted}>Blockers</span>
          {readiness.blockers.map((item) => (
            <p key={item}>{item}</p>
          ))}
        </div>
      ) : null}

      {readiness.warnings.length > 0 ? (
        <div className={styles.detailCard}>
          <span className={styles.muted}>Warnings</span>
          {readiness.warnings.map((item) => (
            <p key={item}>{item}</p>
          ))}
        </div>
      ) : null}

      {readiness.documentSupport.length > 0 ? (
        <div className={styles.detailCard}>
          <span className={styles.muted}>Document support matrix</span>
          {readiness.documentSupport.map((item) => (
            <div className={styles.detailCard} key={item.documentCode}>
              <strong>
                {item.label} · {item.documentCode}
              </strong>
              <p>{item.detail}</p>
              <div className={styles.invoiceDetailGrid}>
                <ReadinessFact
                  label="Numbering"
                  value={item.numberingConfigured ? 'Configurado' : 'Pendiente'}
                />
                <ReadinessFact
                  label="Preview XML"
                  value={item.previewAvailable ? 'Si' : 'No'}
                />
                <ReadinessFact
                  label="RIDE"
                  value={item.rideAvailable ? 'Si' : 'No'}
                />
                <ReadinessFact
                  label="XSD local"
                  value={
                    item.schemaValidationAvailable ? 'Disponible' : 'Faltante'
                  }
                />
                <ReadinessFact
                  label="Submit electronico"
                  value={item.submitSupported ? 'Habilitado' : 'Bloqueado'}
                />
              </div>
            </div>
          ))}
        </div>
      ) : null}

      <p className={styles.muted}>{readiness.recommendedNextStep}</p>
    </div>
  );
}

function ReadinessFact({
  label,
  value,
  detail,
  extra,
}: {
  detail?: string | null;
  extra?: string | null;
  label: string;
  value: string;
}) {
  return (
    <div className={styles.detailCard}>
      <span className={styles.muted}>{label}</span>
      <strong>{value}</strong>
      {detail ? <small>{detail}</small> : null}
      {extra ? <small>{extra}</small> : null}
    </div>
  );
}

function certificateValidityLabel(
  value:
    | 'not_applicable'
    | 'unknown'
    | 'valid'
    | 'expiring_soon'
    | 'expired'
    | 'not_yet_valid',
) {
  switch (value) {
    case 'valid':
      return 'Vigente';
    case 'expiring_soon':
      return 'Por vencer';
    case 'expired':
      return 'Vencido';
    case 'not_yet_valid':
      return 'Aun no vigente';
    case 'not_applicable':
      return 'No aplica';
    default:
      return 'Desconocida';
  }
}

function cryptoProofLabel(
  value: 'not_applicable' | 'unknown' | 'verified' | 'failed',
) {
  switch (value) {
    case 'verified':
      return 'Verificada';
    case 'not_applicable':
      return 'No aplica';
    case 'unknown':
      return 'Pendiente';
    default:
      return 'Fallida';
  }
}

function issuerAlignmentLabel(
  value: 'not_applicable' | 'unknown' | 'matched' | 'mismatched',
) {
  switch (value) {
    case 'matched':
      return 'Alineado';
    case 'mismatched':
      return 'Desalineado';
    case 'not_applicable':
      return 'No aplica';
    default:
      return 'Sin evidencia';
  }
}

function remoteSriFeedbackLabel(readiness: ElectronicSandboxReadinessResponse) {
  switch (readiness.latestRemoteSriSubmissionCategory) {
    case 'taxpayer_not_registered':
      return 'Emisor no registrado';
    case 'xml_structure':
      return 'Estructura XML';
    case 'authorization_rejected':
      return 'Autorizacion rechazada';
    case 'technical_failure':
      return 'Falla tecnica';
    default:
      return readiness.latestRemoteSriSubmissionSummary
        ? 'Registrado'
        : 'Sin historial remoto';
  }
}

function buildSettingsReadinessView({
  issuerForm,
  numberingForm,
  signatureForm,
  submissionForm,
}: Pick<
  InvoicingWorkspaceSettingsProps,
  'issuerForm' | 'numberingForm' | 'signatureForm' | 'submissionForm'
>): SettingsReadinessViewModel {
  const issuer = issuerStatus(issuerForm);
  const numbering = numberingStatus(numberingForm);
  const signature = signatureStatus(signatureForm);
  const gateway = gatewayStatus(submissionForm);
  const sandboxTier = sandboxTierStatus(submissionForm.readiness);
  const verdict = readinessVerdict(submissionForm.readiness, sandboxTier);
  const recommendedSection = recommendedSectionFor({
    gateway,
    issuer,
    numbering,
    sandboxTier,
    signature,
  });

  return {
    gateway,
    issuer,
    numbering,
    recommendedSection,
    sandboxTier,
    signature,
    verdict,
  };
}

function issuerStatus(
  issuerForm: InvoicingWorkspaceSettingsProps['issuerForm'],
): SettingsStatus {
  const complete =
    Boolean(issuerForm.legalName.trim()) &&
    Boolean(issuerForm.taxId.trim()) &&
    Boolean(issuerForm.matrixAddress.trim()) &&
    Boolean(issuerForm.establishmentAddress.trim());

  return complete
    ? { label: 'Configurado', tone: 'success' }
    : { label: 'Por completar', tone: 'warning' };
}

function numberingStatus(
  numberingForm: InvoicingWorkspaceSettingsProps['numberingForm'],
): SettingsStatus {
  const complete =
    Boolean(numberingForm.documentCode.trim()) &&
    Boolean(numberingForm.establishmentCode.trim()) &&
    Boolean(numberingForm.emissionPointCode.trim()) &&
    Boolean(numberingForm.nextSequence.trim());

  return complete
    ? { label: 'Configurada', tone: 'success' }
    : { label: 'Por completar', tone: 'warning' };
}

function signatureStatus(
  signatureForm: InvoicingWorkspaceSettingsProps['signatureForm'],
): SettingsStatus {
  if (!signatureForm.materialConfigured) {
    return { label: 'No configurada', tone: 'neutral' };
  }

  const inspection = signatureForm.inspection?.inspection;

  if (inspection?.certificateValidityStatus === 'expired') {
    return { label: 'Caducada', tone: 'danger' };
  }

  if (inspection?.status === 'invalid') {
    return { label: 'Con hallazgos', tone: 'danger' };
  }

  if (inspection?.certificateValidityStatus === 'expiring_soon') {
    return { label: 'Por vencer', tone: 'warning' };
  }

  if (inspection?.certificateValidityStatus === 'not_yet_valid') {
    return { label: 'Aun no vigente', tone: 'warning' };
  }

  if (!signatureForm.isActive) {
    return { label: 'Deshabilitada', tone: 'neutral' };
  }

  return { label: 'Vigente', tone: 'success' };
}

function gatewayStatus(
  submissionForm: InvoicingWorkspaceSettingsProps['submissionForm'],
): SettingsStatus {
  const complete =
    submissionForm.gatewayConfigured &&
    submissionForm.isActive &&
    Boolean(submissionForm.authorizationUrl.trim());

  return complete
    ? { label: 'Configurado', tone: 'success' }
    : { label: 'Por completar', tone: 'warning' };
}

function sandboxTierStatus(
  readiness: ElectronicSandboxReadinessResponse | null,
): SettingsStatus {
  if (!readiness) {
    return { label: 'Sin readiness', tone: 'neutral' };
  }

  if (readiness.isReadyForRemoteSandboxSubmission) {
    return { label: 'Sandbox remoto interno', tone: 'success' };
  }

  if (readiness.isReadyForPresignedRemoteSandboxSubmission) {
    return { label: 'Sandbox remoto prefirmado', tone: 'success' };
  }

  if (readiness.isReadyForLocalStubSubmission) {
    return { label: 'Validacion local', tone: 'warning' };
  }

  return { label: 'Sin ruta de envio', tone: 'danger' };
}

function readinessVerdict(
  readiness: ElectronicSandboxReadinessResponse | null,
  sandboxTier: SettingsStatus,
): SettingsReadinessViewModel['verdict'] {
  if (!readiness) {
    return {
      description:
        'Todavia no hay lectura de readiness. Los formularios se pueden revisar, pero no asumimos preparacion SRI.',
      label: 'Sin lectura',
      title: 'Readiness pendiente',
      tone: 'neutral',
    };
  }

  const remoteReady =
    readiness.isReadyForRemoteSandboxSubmission ||
    readiness.isReadyForPresignedRemoteSandboxSubmission;

  if (remoteReady && readiness.warnings.length === 0) {
    return {
      description:
        'El emisor, la numeracion, la firma y el gateway tienen evidencia suficiente para operar.',
      label: 'Listo',
      title: 'Listo para preparar emision',
      tone: 'success',
    };
  }

  if (remoteReady) {
    return {
      description:
        'La ruta remota esta disponible, pero hay advertencias que conviene atender antes de operar a escala.',
      label: 'Con advertencias',
      title: 'Listo, con atencion pendiente',
      tone: 'warning',
    };
  }

  if (readiness.blockers.length > 0 || sandboxTier.tone === 'danger') {
    return {
      description:
        'Hay bloqueos reales en la preparacion electronica. Atiende el siguiente paso recomendado antes de emitir.',
      label: 'Bloqueado',
      title: 'Emision electronica bloqueada',
      tone: 'danger',
    };
  }

  return {
    description:
      'La validacion local puede estar disponible, pero falta completar la ruta remota o alguna evidencia clave.',
    label: 'Incompleto',
    title: 'Falta completar preparacion',
    tone: 'warning',
  };
}

function recommendedSectionFor({
  gateway,
  issuer,
  numbering,
  sandboxTier,
  signature,
}: {
  gateway: SettingsStatus;
  issuer: SettingsStatus;
  numbering: SettingsStatus;
  sandboxTier: SettingsStatus;
  signature: SettingsStatus;
}): SettingsSectionKey | null {
  if (signature.tone === 'danger' || signature.tone === 'neutral') {
    return 'signature';
  }

  if (issuer.tone !== 'success') {
    return 'issuer';
  }

  if (numbering.tone !== 'success') {
    return 'numbering';
  }

  if (gateway.tone !== 'success' || sandboxTier.tone !== 'success') {
    return 'gateway';
  }

  if (signature.tone === 'warning') {
    return 'signature';
  }

  return null;
}

function recommendedSectionTitle(section: SettingsSectionKey | null): string {
  switch (section) {
    case 'issuer':
      return 'Completa la identidad fiscal del emisor';
    case 'numbering':
      return 'Configura la serie y el secuencial de Ecuador';
    case 'signature':
      return 'Revisa la firma electronica y su evidencia';
    case 'gateway':
      return 'Completa el gateway y la ruta SRI';
    default:
      return 'Todo listo para continuar con facturas';
  }
}
