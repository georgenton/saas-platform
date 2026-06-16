import styles from '../../app/app.module.css';
import { Card } from '../../shared/design-system/card';
import { Metric } from '../../shared/design-system/metric';
import { StatusPill } from '../../shared/design-system/status-pill';
import type {
  InvoicingReadinessTone,
  InvoicingWorkspaceFoundationModel,
  InvoicingWorkspaceHeroActionKey,
} from './model';
import { Stepper } from './workspace-shared';

type InvoicingWorkspaceSummaryProps = {
  model: InvoicingWorkspaceFoundationModel;
  onPrimaryAction?: (actionKey: InvoicingWorkspaceHeroActionKey) => void;
};

const statusToneByReadinessTone: Record<
  InvoicingReadinessTone,
  'default' | 'success' | 'warning' | 'danger'
> = {
  neutral: 'default',
  success: 'success',
  warning: 'warning',
  danger: 'danger',
};

export function InvoicingWorkspaceSummary({
  model,
  onPrimaryAction,
}: InvoicingWorkspaceSummaryProps) {
  const heroTone = heroStatusTone(model);
  const heroStatusLabel = heroStatusCopy(model);
  const heroSupport = heroSupportCopy(model);

  return (
    <section className={styles.stack} aria-label="Invoicing workspace summary">
      <Card as="section" className={styles.invoicingHeroCard} variant="summary">
        <div className={styles.invoicingHeroHeader}>
          <div className={styles.stack}>
            <span className={styles.label}>{model.hero.eyebrow}</span>
            <div className={styles.stack}>
              <div className={styles.invoicingHeroStatusRow}>
                <StatusPill tone={heroTone}>{heroStatusLabel}</StatusPill>
                <span className={styles.invoicingHeroStatusHint}>
                  {heroSupport}
                </span>
              </div>
              <h3 className={styles.invoicingHeroTitle}>{model.hero.title}</h3>
              <p className={styles.invoicingHeroDescription}>
                {model.hero.description}
              </p>
            </div>
          </div>
          <button
            className={styles.primaryButton}
            onClick={() => onPrimaryAction?.(model.hero.primaryActionKey)}
            type="button"
          >
            {model.hero.primaryActionLabel}
          </button>
        </div>

        <ReadinessRibbon model={model} />
      </Card>

      <div className={styles.invoiceKpiGrid}>
        {model.metrics.map((metric) => (
          <Card key={metric.key} variant="summary">
            <div className={styles.invoicingMetricCard}>
              <Metric label={metric.label} value={metric.value} />
            </div>
          </Card>
        ))}
      </div>

      <div className={styles.twoColumn}>
        <Card variant="summary">
          <div className={styles.invoiceCardHeader}>
            <strong>Readiness Ecuador</strong>
            <StatusPill tone={model.readiness.ready ? 'success' : 'warning'}>
              {model.readiness.ready ? 'Operativo' : 'Con bloqueos'}
            </StatusPill>
          </div>
          <div className={styles.stack}>
            {model.readiness.blockers.length > 0 ? (
              <div className={styles.invoicingReadinessBlockers}>
                <strong>Qué conviene resolver primero</strong>
                {model.readiness.blockers.map((blocker) => (
                  <p key={blocker}>{blocker}</p>
                ))}
              </div>
            ) : (
              <div className={styles.invoicingReadinessHealthy}>
                <strong>Base lista para operar</strong>
                <p className={styles.muted}>
                  El carril principal ya tiene base suficiente para emitir y
                  seguir documentos electrónicos sin perder visibilidad del
                  estado SRI.
                </p>
              </div>
            )}
            {model.readiness.pillars.map((signal) => (
              <div
                className={`${styles.invoiceItemCard} ${styles.invoicingReadinessSignalCard}`}
                key={signal.key}
              >
                <div className={styles.invoiceCardHeader}>
                  <strong>{signal.label}</strong>
                  <StatusPill tone={statusToneByReadinessTone[signal.tone]}>
                    {signal.value}
                  </StatusPill>
                </div>
                <small>{signal.sub}</small>
              </div>
            ))}
          </div>
        </Card>

        <Card variant="summary">
          <div className={styles.invoiceCardHeader}>
            <strong>Siguiente foco operativo</strong>
            <StatusPill>Workspace</StatusPill>
          </div>
          <div className={styles.stack}>
            {model.stagePreview ? (
              <div
                className={`${styles.invoiceItemCard} ${styles.invoicingStagePreviewCard}`}
              >
                <div className={styles.invoicingStagePreviewHeader}>
                  <div className={styles.stack}>
                    <strong>{model.stagePreview.number}</strong>
                    <small>
                      {model.stagePreview.customerName} · {model.stagePreview.total}
                    </small>
                  </div>
                  <StatusPill>{model.stagePreview.electronicLabel}</StatusPill>
                </div>
                <div className={styles.invoicingStagePreviewCue}>
                  <span className={styles.label}>Avance electrónico</span>
                  <p className={styles.muted}>
                    El sistema te muestra el tramo exacto del documento antes de
                    insinuar una autorización que todavía no exista.
                  </p>
                </div>
                <Stepper stage={model.stagePreview.stage} />
              </div>
            ) : (
              <div className={styles.invoiceItemCard}>
                <strong>Aún no hay un documento seleccionado</strong>
                <small>
                  Cuando exista una factura activa o pendiente, aquí veremos su
                  avance electrónico.
                </small>
              </div>
            )}

            {model.nextActions.map((action) => (
              <div
                className={`${styles.invoiceItemCard} ${styles.invoicingNextActionCard}`}
                key={action}
              >
                <p>{action}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
}

function ReadinessRibbon({
  model,
}: {
  model: InvoicingWorkspaceFoundationModel;
}) {
  return (
    <div className={styles.invoicingReadinessRibbon}>
      {model.readiness.pillars.map((pillar) => (
        <div className={styles.invoicingReadinessPillar} key={pillar.key}>
          <div className={styles.invoicingReadinessPillarHeader}>
            <span
              className={`${styles.invoicingReadinessDot} ${
                styles[`invoicingReadinessDot${capitalizeTone(pillar.tone)}`]
              }`}
            />
            <strong>{pillar.label}</strong>
          </div>
          <span>{pillar.value}</span>
          <small>{pillar.sub}</small>
        </div>
      ))}
    </div>
  );
}

function capitalizeTone(tone: InvoicingReadinessTone): string {
  return `${tone.charAt(0).toUpperCase()}${tone.slice(1)}`;
}

function heroStatusTone(
  model: InvoicingWorkspaceFoundationModel,
): 'default' | 'success' | 'warning' | 'danger' {
  if (model.hero.state === 'no-issuer') {
    return 'default';
  }

  if (model.hero.state === 'readiness-blocked') {
    return 'danger';
  }

  if (model.hero.state === 'no-invoices') {
    return 'success';
  }

  return model.readiness.ready ? 'success' : 'warning';
}

function heroStatusCopy(model: InvoicingWorkspaceFoundationModel): string {
  switch (model.hero.state) {
    case 'no-issuer':
      return 'Configuración inicial';
    case 'readiness-blocked':
      return 'Bloqueos activos';
    case 'no-invoices':
      return 'Listo para emitir';
    case 'permission-limited':
      return 'Permiso limitado';
    default:
      return model.stagePreview
        ? `Foco: ${model.stagePreview.electronicLabel}`
        : 'Operación en curso';
  }
}

function heroSupportCopy(model: InvoicingWorkspaceFoundationModel): string {
  switch (model.hero.state) {
    case 'no-issuer':
      return 'Primero ordenamos la base fiscal; luego ya emitimos con calma.';
    case 'readiness-blocked':
      return 'Una sola prioridad a la vez: resolver el pilar que hoy frena el envío al SRI.';
    case 'no-invoices':
      return 'La base ya está preparada para validar el flujo completo con tu primer comprobante.';
    case 'permission-limited':
      return 'Puedes revisar el workspace, pero las acciones operativas dependen del permiso correcto.';
    default:
      return model.nextActions[0] ??
        'Tu workspace ya tiene visibilidad suficiente para seguir documentos y autorizaciones.';
  }
}
