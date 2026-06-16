import styles from '../../app/app.module.css';
import { Card } from '../../shared/design-system/card';
import { Metric } from '../../shared/design-system/metric';
import { StatusPill } from '../../shared/design-system/status-pill';
import type {
  InvoicingReadinessTone,
  InvoicingWorkspaceFoundationModel,
} from './model';

type InvoicingWorkspaceSummaryProps = {
  model: InvoicingWorkspaceFoundationModel;
};

const statusToneByReadinessTone: Record<
  InvoicingReadinessTone,
  'default' | 'success' | 'warning'
> = {
  neutral: 'default',
  success: 'success',
  warning: 'warning',
};

export function InvoicingWorkspaceSummary({
  model,
}: InvoicingWorkspaceSummaryProps) {
  return (
    <section className={styles.stack} aria-label="Invoicing workspace summary">
      <div className={styles.sectionHeading}>
        <div>
          <span className={styles.label}>{model.summary.eyebrow}</span>
          <h3>{model.summary.title}</h3>
          <p>{model.summary.description}</p>
        </div>
        <StatusPill>Client composed</StatusPill>
      </div>

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
            <StatusPill>Operativo</StatusPill>
          </div>
          <div className={styles.stack}>
            {model.readiness.map((signal) => (
              <div className={styles.invoiceItemCard} key={signal.key}>
                <div className={styles.invoiceCardHeader}>
                  <strong>{signal.label}</strong>
                  <StatusPill tone={statusToneByReadinessTone[signal.tone]}>
                    {signal.value}
                  </StatusPill>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card variant="summary">
          <div className={styles.invoiceCardHeader}>
            <strong>Siguientes acciones</strong>
            <StatusPill>Handoff</StatusPill>
          </div>
          <div className={styles.stack}>
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
