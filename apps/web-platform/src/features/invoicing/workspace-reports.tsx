import styles from '../../app/app.module.css';
import type { InvoicingReportSummaryResponse } from '../../app/types';

type InvoicingWorkspaceReportsProps = {
  formatDate: (value: string | null | undefined) => string;
  formatInvoiceStatus: (value: string) => string;
  formatMoney: (valueInCents: number, currency: string) => string;
  formatReportMonth: (value: string) => string;
  report: InvoicingReportSummaryResponse;
};

export function InvoicingWorkspaceReports({
  formatDate,
  formatInvoiceStatus,
  formatMoney,
  formatReportMonth,
  report,
}: InvoicingWorkspaceReportsProps) {
  return (
    <div className={styles.stack}>
      <div className={styles.sectionHeading}>
        <div>
          <span className={styles.label}>Reports</span>
          <h3>Resumen operativo</h3>
        </div>
        <small className={styles.muted}>
          Generado {formatDate(report.generatedAt)}
        </small>
      </div>

      <div className={styles.invoiceKpiGrid}>
        <div className={styles.commercialCard}>
          <span className={styles.muted}>Customers</span>
          <strong>{report.customerCount}</strong>
        </div>
        <div className={styles.commercialCard}>
          <span className={styles.muted}>Invoices</span>
          <strong>{report.invoiceCount}</strong>
        </div>
        <div className={styles.commercialCard}>
          <span className={styles.muted}>Estados</span>
          <strong>{report.statusBreakdown.length}</strong>
        </div>
        <div className={styles.commercialCard}>
          <span className={styles.muted}>Currencies</span>
          <strong>{report.totalsByCurrency.length}</strong>
        </div>
      </div>

      <div className={styles.twoColumn}>
        <div className={styles.stack}>
          <div className={styles.sectionHeading}>
            <div>
              <span className={styles.label}>Status mix</span>
              <h3>Facturas por estado</h3>
            </div>
          </div>

          {report.statusBreakdown.map((entry) => (
            <div className={styles.invoiceItemCard} key={entry.status}>
              <div className={styles.invoiceCardHeader}>
                <strong>{formatInvoiceStatus(entry.status)}</strong>
                <span className={styles.statusPill}>{entry.count}</span>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.stack}>
          <div className={styles.sectionHeading}>
            <div>
              <span className={styles.label}>Currency totals</span>
              <h3>Totales por moneda</h3>
            </div>
          </div>

          {report.totalsByCurrency.map((entry) => (
            <div className={styles.invoiceItemCard} key={entry.currency}>
              <div className={styles.invoiceCardHeader}>
                <strong>{entry.currency}</strong>
                <span className={styles.statusPill}>
                  {formatMoney(entry.totalInCents, entry.currency)}
                </span>
              </div>
              <small>
                Subtotal: {formatMoney(entry.subtotalInCents, entry.currency)}
              </small>
              <small>Tax: {formatMoney(entry.taxInCents, entry.currency)}</small>
              <small>
                Outstanding:{' '}
                {formatMoney(entry.outstandingTotalInCents, entry.currency)}
              </small>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.stack}>
        <div className={styles.sectionHeading}>
          <div>
            <span className={styles.label}>Monthly trend</span>
            <h3>Totales mensuales</h3>
          </div>
        </div>

        {report.monthlyTotals.length === 0 ? (
          <div className={styles.emptyState}>
            <p>Todavia no hay actividad suficiente para reportes mensuales.</p>
          </div>
        ) : (
          <div className={styles.stack}>
            {report.monthlyTotals.map((entry) => (
              <div
                className={styles.invoiceItemCard}
                key={`${entry.month}-${entry.currency}`}
              >
                <div className={styles.invoiceCardHeader}>
                  <strong>
                    {formatReportMonth(entry.month)} · {entry.currency}
                  </strong>
                  <span className={styles.statusPill}>
                    {entry.invoiceCount} facturas
                  </span>
                </div>
                <small>
                  Total: {formatMoney(entry.totalInCents, entry.currency)}
                </small>
                <small>
                  Tax: {formatMoney(entry.taxInCents, entry.currency)}
                </small>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
