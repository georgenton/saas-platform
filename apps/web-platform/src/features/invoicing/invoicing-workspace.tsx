import styles from '../../app/app.module.css';
import { Card } from '../../shared/design-system/card';
import { Metric } from '../../shared/design-system/metric';
import { StatusPill } from '../../shared/design-system/status-pill';
import type {
  InvoicingReadinessTone,
  InvoicingWorkspaceFoundationModel,
  InvoicingWorkspaceHeroActionKey,
  InvoicingWorkspaceStage,
} from './model';

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

const stepLabels = ['Borrador', 'Generado', 'Enviado', 'Autorizado'] as const;

export function InvoicingWorkspaceSummary({
  model,
  onPrimaryAction,
}: InvoicingWorkspaceSummaryProps) {
  return (
    <section className={styles.stack} aria-label="Invoicing workspace summary">
      <Card as="section" className={styles.invoicingHeroCard} variant="summary">
        <div className={styles.invoicingHeroHeader}>
          <div className={styles.stack}>
            <span className={styles.label}>{model.hero.eyebrow}</span>
            <div className={styles.stack}>
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
            <Metric label={metric.label} value={metric.value} />
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
                {model.readiness.blockers.map((blocker) => (
                  <p key={blocker}>{blocker}</p>
                ))}
              </div>
            ) : (
              <p className={styles.muted}>
                El carril principal ya tiene base suficiente para emitir y seguir
                documentos electrónicos.
              </p>
            )}
            {model.readiness.pillars.map((signal) => (
              <div className={styles.invoiceItemCard} key={signal.key}>
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
              <div className={styles.invoiceItemCard}>
                <div className={styles.invoiceCardHeader}>
                  <strong>{model.stagePreview.number}</strong>
                  <StatusPill>{model.stagePreview.electronicLabel}</StatusPill>
                </div>
                <small>
                  {model.stagePreview.customerName} · {model.stagePreview.total}
                </small>
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
              <div className={styles.invoiceItemCard} key={action}>
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

export function Stepper({ stage }: { stage: InvoicingWorkspaceStage }) {
  const currentStepIndex = currentStepPosition(stage);

  return (
    <div className={styles.invoicingStepper} aria-label="Estado del documento">
      {stepLabels.map((label, index) => {
        const tone = stepTone(stage, index, currentStepIndex);

        return (
          <div className={styles.invoicingStepperStep} key={label}>
            <span
              className={`${styles.invoicingStepperNode} ${
                styles[`invoicingStepperNode${capitalizeTone(tone)}`]
              }`}
            >
              {stepGlyph(stage, index, currentStepIndex)}
            </span>
            <small>{label}</small>
          </div>
        );
      })}
    </div>
  );
}

function currentStepPosition(stage: InvoicingWorkspaceStage): number {
  switch (stage) {
    case 'generated':
      return 1;
    case 'submitted':
    case 'rejected':
      return 2;
    case 'authorized':
      return 3;
    default:
      return 0;
  }
}

function stepTone(
  stage: InvoicingWorkspaceStage,
  index: number,
  currentStepIndex: number,
): InvoicingReadinessTone {
  if (stage === 'rejected' && index === 2) {
    return 'danger';
  }

  if (index < currentStepIndex) {
    return 'success';
  }

  if (index === currentStepIndex) {
    return stage === 'authorized' ? 'success' : 'warning';
  }

  return 'neutral';
}

function stepGlyph(
  stage: InvoicingWorkspaceStage,
  index: number,
  currentStepIndex: number,
): string {
  if (stage === 'rejected' && index === 2) {
    return 'x';
  }

  if (index < currentStepIndex || stage === 'authorized') {
    return '✓';
  }

  if (index === currentStepIndex) {
    return '•';
  }

  return '○';
}

function capitalizeTone(tone: InvoicingReadinessTone): string {
  return `${tone.charAt(0).toUpperCase()}${tone.slice(1)}`;
}
