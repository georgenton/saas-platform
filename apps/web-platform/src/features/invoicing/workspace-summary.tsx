import { useMemo, useState } from 'react';
import styles from '../../app/app.module.css';
import type {
  InvoiceDetailResponse,
  InvoiceSummaryResponse,
} from '../../app/types';
import { Card } from '../../shared/design-system/card';
import { Metric } from '../../shared/design-system/metric';
import { StatusPill } from '../../shared/design-system/status-pill';
import type {
  InvoicingReadinessTone,
  InvoicingWorkspaceFoundationModel,
  InvoicingWorkspaceHeroActionKey,
  InvoicingWorkspaceStage,
} from './model';
import { Stepper, deriveStageFromInvoiceDetail } from './workspace-shared';

type InvoicingWorkspaceSummaryProps = {
  formatDate: (value: string | null | undefined) => string;
  formatElectronicStatus: (value: string | null) => string;
  formatInvoiceStatus: (value: string) => string;
  formatMoney: (valueInCents: number, currency: string) => string;
  invoiceDetailLoading: boolean;
  invoices: InvoiceSummaryResponse[];
  model: InvoicingWorkspaceFoundationModel;
  onPrimaryAction?: (actionKey: InvoicingWorkspaceHeroActionKey) => void;
  onSelectInvoice: (invoiceId: string) => void;
  resolveCustomerName: (customerId: string, buyerName?: string | null) => string;
  selectedInvoiceDetail: InvoiceDetailResponse | null;
  selectedInvoiceId: string | null;
  selectedInvoiceSummary: InvoiceSummaryResponse | null;
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

const queueFilters = [
  { key: 'all', label: 'Todas' },
  { key: 'draft', label: 'Borradores' },
  { key: 'attention', label: 'Por autorizar' },
  { key: 'authorized', label: 'Autorizadas' },
  { key: 'rejected', label: 'Rechazadas' },
] as const;

type QueueFilter = (typeof queueFilters)[number]['key'];

export function InvoicingWorkspaceSummary({
  formatDate,
  formatElectronicStatus,
  formatInvoiceStatus,
  formatMoney,
  invoiceDetailLoading,
  invoices,
  model,
  onPrimaryAction,
  onSelectInvoice,
  resolveCustomerName,
  selectedInvoiceDetail,
  selectedInvoiceId,
  selectedInvoiceSummary,
}: InvoicingWorkspaceSummaryProps) {
  const [queueFilter, setQueueFilter] = useState<QueueFilter>('all');
  const heroTone = heroStatusTone(model);
  const filteredInvoices = useMemo(
    () => invoices.filter((invoice) => matchesQueueFilter(invoice, queueFilter)),
    [invoices, queueFilter],
  );

  return (
    <section
      className={styles.invoicingDomainConsole}
      aria-label="Invoicing workspace summary"
    >
      <Card
        as="section"
        className={styles.invoicingDomainHero}
        variant="summary"
      >
        <div className={styles.invoicingDomainHeroMain}>
          <span
            className={`${styles.invoicingDomainHeroIcon} ${
              styles[`invoicingDomainHeroIcon${capitalizeTone(heroTone)}`]
            }`}
            aria-hidden="true"
          >
            {heroTone === 'danger' ? '!' : '✓'}
          </span>
          <div>
            <span className={styles.label}>{model.hero.eyebrow}</span>
            <h2>{model.hero.title}</h2>
            <p>{model.hero.description}</p>
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

      <div className={styles.invoicingDomainMetricGrid}>
        {model.metrics.map((metric) => (
          <Card key={metric.key} variant="summary">
            <div className={styles.invoicingDomainMetricCard}>
              <Metric label={metric.label} value={metric.value} />
            </div>
          </Card>
        ))}
      </div>

      <div className={styles.invoicingDomainWorkGrid}>
        <Card
          as="section"
          className={styles.invoicingDomainQueueCard}
          variant="summary"
        >
          <div className={styles.invoicingDomainCardHeader}>
            <div>
              <h3>Facturas</h3>
              <p>Selecciona una para revisarla a la derecha</p>
            </div>
            <a className={styles.primaryButton} href="#invoicing-customer-draft">
              + Nueva
            </a>
          </div>

          <div
            className={styles.invoicingDomainQueueFilters}
            aria-label="Filtro de facturas"
          >
            {queueFilters.map((filter) => (
              <button
                className={
                  queueFilter === filter.key
                    ? styles.invoicingDomainQueueFilterActive
                    : ''
                }
                key={filter.key}
                onClick={() => setQueueFilter(filter.key)}
                type="button"
              >
                <span>{filter.label}</span>
                <small>{countInvoicesByFilter(invoices, filter.key)}</small>
              </button>
            ))}
          </div>

          {filteredInvoices.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No hay facturas en este filtro.</p>
            </div>
          ) : (
            <div className={styles.invoicingDomainQueueList}>
              <div
                className={styles.invoicingDomainQueueHeader}
                aria-hidden="true"
              >
                <span>Número</span>
                <span>Cliente</span>
                <span>Total</span>
                <span>Estado</span>
              </div>
              {filteredInvoices.map((invoice) => {
                const stage = deriveStageFromInvoiceSummary(invoice);

                return (
                  <button
                    className={`${styles.invoicingDomainQueueRow} ${
                      invoice.id === selectedInvoiceId
                        ? styles.invoicingDomainQueueRowActive
                        : ''
                    }`}
                    key={invoice.id}
                    onClick={() => onSelectInvoice(invoice.id)}
                    type="button"
                  >
                    <strong>{invoice.number}</strong>
                    <span>
                      <b>
                        {resolveCustomerName(invoice.customerId, invoice.buyerName)}
                      </b>
                      <small>
                        {formatDate(invoice.issuedAt)} · {invoice.itemCount}{' '}
                        item{invoice.itemCount === 1 ? '' : 's'}
                      </small>
                    </span>
                    <em>{formatMoney(invoice.totals.totalInCents, invoice.currency)}</em>
                    <StatusPill tone={stageTone(stage)}>
                      {stageLabel(stage, formatInvoiceStatus(invoice.status))}
                    </StatusPill>
                  </button>
                );
              })}
            </div>
          )}
        </Card>

        <Card
          as="aside"
          className={styles.invoicingDomainDetailCard}
          variant="summary"
        >
          {invoiceDetailLoading ? (
            <div className={styles.emptyState}>
              <p>Cargando detalle de factura...</p>
            </div>
          ) : selectedInvoiceDetail ? (
            <InvoiceFocusPanel
              formatDate={formatDate}
              formatElectronicStatus={formatElectronicStatus}
              formatInvoiceStatus={formatInvoiceStatus}
              formatMoney={formatMoney}
              resolveCustomerName={resolveCustomerName}
              selectedInvoiceDetail={selectedInvoiceDetail}
            />
          ) : selectedInvoiceSummary ? (
            <InvoiceSummaryFocusPanel
              formatMoney={formatMoney}
              resolveCustomerName={resolveCustomerName}
              selectedInvoiceSummary={selectedInvoiceSummary}
            />
          ) : (
            <div className={styles.emptyState}>
              <p>Selecciona una factura para revisar el foco operativo.</p>
            </div>
          )}
        </Card>
      </div>
    </section>
  );
}

function InvoiceFocusPanel({
  formatDate,
  formatElectronicStatus,
  formatInvoiceStatus,
  formatMoney,
  resolveCustomerName,
  selectedInvoiceDetail,
}: {
  formatDate: (value: string | null | undefined) => string;
  formatElectronicStatus: (value: string | null) => string;
  formatInvoiceStatus: (value: string) => string;
  formatMoney: (valueInCents: number, currency: string) => string;
  resolveCustomerName: (customerId: string, buyerName?: string | null) => string;
  selectedInvoiceDetail: InvoiceDetailResponse;
}) {
  const stage = deriveStageFromInvoiceDetail(selectedInvoiceDetail);

  return (
    <div className={styles.invoicingDomainDetailContent}>
      <div className={styles.invoicingDomainDetailTitle}>
        <div>
          <span>{selectedInvoiceDetail.number}</span>
          <h3>
            {resolveCustomerName(
              selectedInvoiceDetail.customerId,
              selectedInvoiceDetail.buyerName,
            )}
          </h3>
        </div>
        <StatusPill tone={stageTone(stage)}>
          {stageLabel(stage, formatInvoiceStatus(selectedInvoiceDetail.status))}
        </StatusPill>
      </div>

      <strong className={styles.invoicingDomainDetailTotal}>
        {formatMoney(
          selectedInvoiceDetail.totals.totalInCents,
          selectedInvoiceDetail.currency,
        )}
      </strong>

      <Stepper stage={stage} />

      <div className={styles.invoicingDomainDetailFacts}>
        <span>Condición del documento</span>
        <strong>{formatInvoiceStatus(selectedInvoiceDetail.status)}</strong>
        <span>Condición electrónica</span>
        <strong>{formatElectronicStatus(selectedInvoiceDetail.electronicStatus)}</strong>
        <span>Emitida</span>
        <strong>{formatDate(selectedInvoiceDetail.issuedAt)}</strong>
        <span>Saldo</span>
        <strong>
          {formatMoney(
            selectedInvoiceDetail.settlement.balanceDueInCents,
            selectedInvoiceDetail.currency,
          )}
        </strong>
      </div>

      <a className={styles.secondaryButton} href="#invoicing-documents">
        Abrir documento completo
      </a>
    </div>
  );
}

function InvoiceSummaryFocusPanel({
  formatMoney,
  resolveCustomerName,
  selectedInvoiceSummary,
}: {
  formatMoney: (valueInCents: number, currency: string) => string;
  resolveCustomerName: (customerId: string, buyerName?: string | null) => string;
  selectedInvoiceSummary: InvoiceSummaryResponse;
}) {
  const stage = deriveStageFromInvoiceSummary(selectedInvoiceSummary);

  return (
    <div className={styles.invoicingDomainDetailContent}>
      <div className={styles.invoicingDomainDetailTitle}>
        <div>
          <span>{selectedInvoiceSummary.number}</span>
          <h3>
            {resolveCustomerName(
              selectedInvoiceSummary.customerId,
              selectedInvoiceSummary.buyerName,
            )}
          </h3>
        </div>
        <StatusPill tone={stageTone(stage)}>
          {stageLabel(stage, selectedInvoiceSummary.status)}
        </StatusPill>
      </div>
      <strong className={styles.invoicingDomainDetailTotal}>
        {formatMoney(
          selectedInvoiceSummary.totals.totalInCents,
          selectedInvoiceSummary.currency,
        )}
      </strong>
      <Stepper stage={stage} />
      <a className={styles.secondaryButton} href="#invoicing-documents">
        Cargar detalle operativo
      </a>
    </div>
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

function matchesQueueFilter(
  invoice: InvoiceSummaryResponse,
  filter: QueueFilter,
) {
  if (filter === 'all') {
    return true;
  }

  const stage = deriveStageFromInvoiceSummary(invoice);

  if (filter === 'draft') {
    return invoice.status === 'draft';
  }

  if (filter === 'attention') {
    return stage === 'generated' || stage === 'submitted';
  }

  if (filter === 'authorized') {
    return stage === 'authorized';
  }

  return stage === 'rejected';
}

function countInvoicesByFilter(
  invoices: InvoiceSummaryResponse[],
  filter: QueueFilter,
) {
  return invoices.filter((invoice) => matchesQueueFilter(invoice, filter)).length;
}

function deriveStageFromInvoiceSummary(
  invoice: InvoiceSummaryResponse,
): InvoicingWorkspaceStage {
  const electronicStatus = invoice.electronicStatus?.toLowerCase() ?? '';

  if (electronicStatus.includes('authorized')) {
    return 'authorized';
  }

  if (
    electronicStatus.includes('rejected') ||
    electronicStatus.includes('returned')
  ) {
    return 'rejected';
  }

  if (electronicStatus.includes('submitted') || invoice.submittedAt) {
    return 'submitted';
  }

  if (electronicStatus.includes('generated') || invoice.signedAt) {
    return 'generated';
  }

  return 'none';
}

function stageTone(
  stage: InvoicingWorkspaceStage,
): 'default' | 'success' | 'warning' | 'danger' {
  switch (stage) {
    case 'authorized':
      return 'success';
    case 'generated':
    case 'submitted':
      return 'warning';
    case 'rejected':
      return 'danger';
    default:
      return 'default';
  }
}

function stageLabel(
  stage: InvoicingWorkspaceStage,
  fallback: string,
) {
  switch (stage) {
    case 'generated':
      return 'Generado';
    case 'submitted':
      return 'En el SRI';
    case 'authorized':
      return 'Autorizada';
    case 'rejected':
      return 'Rechazada';
    default:
      return fallback;
  }
}

function capitalizeTone(
  tone: InvoicingReadinessTone | ReturnType<typeof heroStatusTone>,
): string {
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
