import type { ReactNode } from 'react';
import styles from '../../app/app.module.css';
import type { InvoiceDocumentDraftingAssistResponse } from '../../app/types';

type InvoicingWorkspaceAssistProps = {
  children?: ReactNode;
  formatMoney: (valueInCents: number, currency: string) => string;
  invoicePortfolioCurrency: string;
  operationalStatusLabel: (tone: string) => string;
  operationalStatusTone: (tone: string) => string;
  workspace: InvoiceDocumentDraftingAssistResponse;
};

export function InvoicingWorkspaceAssist({
  children,
  formatMoney,
  invoicePortfolioCurrency,
  operationalStatusLabel,
  operationalStatusTone,
  workspace,
}: InvoicingWorkspaceAssistProps) {
  return (
    <div className={styles.twoColumn}>
      <div className={styles.detailCard}>
        <div className={styles.sectionHeading}>
          <div>
            <span className={styles.label}>Invoicing Assist</span>
            <h3>Surface determinística para drafting documental</h3>
          </div>
          <span
            className={`${styles.statusPill} ${operationalStatusTone(
              workspace.summary.tone,
            )}`}
          >
            {operationalStatusLabel(workspace.summary.tone)}
          </span>
        </div>

        <p>{workspace.summary.headline}</p>
        <small>{workspace.summary.detail}</small>

        <div className={styles.invoiceKpiGrid}>
          <div className={styles.commercialCard}>
            <span className={styles.muted}>Readiness</span>
            <strong>{workspace.summary.readinessStatus}</strong>
            <small>Estado base del carril tributario</small>
          </div>
          <div className={styles.commercialCard}>
            <span className={styles.muted}>Outstanding</span>
            <strong>
              {formatMoney(
                workspace.reportSnapshot.outstandingTotalInCents,
                invoicePortfolioCurrency,
              )}
            </strong>
            <small>Saldo pendiente agregado del tenant</small>
          </div>
          <div className={styles.commercialCard}>
            <span className={styles.muted}>Invoices</span>
            <strong>{workspace.reportSnapshot.invoiceCount}</strong>
            <small>Base documental ya registrada</small>
          </div>
          <div className={styles.commercialCard}>
            <span className={styles.muted}>Customers</span>
            <strong>{workspace.reportSnapshot.customerCount}</strong>
            <small>Contexto comercial disponible</small>
          </div>
        </div>

        <div className={styles.stack}>
          <div className={styles.sectionHeading}>
            <div>
              <span className={styles.label}>Checklist</span>
              <h3>Controles formales que la IA debe respetar</h3>
            </div>
          </div>
          {workspace.checklist.map((entry) => (
            <div className={styles.invoiceItemCard} key={entry.key}>
              <div className={styles.invoiceCardHeader}>
                <strong>{entry.label}</strong>
                <span
                  className={`${styles.statusPill} ${operationalStatusTone(
                    entry.status === 'blocked'
                      ? 'critical'
                      : entry.status === 'warning'
                        ? 'warning'
                        : 'healthy',
                  )}`}
                >
                  {entry.status}
                </span>
              </div>
              <small>{entry.detail}</small>
            </div>
          ))}
        </div>
      </div>

      {children}
    </div>
  );
}
