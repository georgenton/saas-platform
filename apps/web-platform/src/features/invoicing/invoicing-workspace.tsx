import type { ReactNode } from 'react';
import styles from '../../app/app.module.css';
import { Card } from '../../shared/design-system/card';
import { Metric } from '../../shared/design-system/metric';
import { StatusPill } from '../../shared/design-system/status-pill';
import type { InvoiceDetailResponse, InvoiceSummaryResponse } from '../../app/types';
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

type InvoicingWorkspaceOperationsProps = {
  detailChildren?: ReactNode;
  formatBuyerIdentificationType: (value: string | null) => string;
  formatDate: (value: string | null | undefined) => string;
  formatElectronicStatus: (value: string | null) => string;
  formatInvoiceStatus: (value: string) => string;
  formatMoney: (valueInCents: number, currency: string) => string;
  invoiceDetailLoading: boolean;
  invoicingLoading: boolean;
  invoices: InvoiceSummaryResponse[];
  onMarkInvoicePaid: () => void;
  onMarkInvoiceIssued: () => void;
  onMarkInvoiceVoid: () => void;
  onSelectInvoice: (invoiceId: string) => void;
  resolveCustomerName: (customerId: string, buyerName?: string | null) => string;
  selectedInvoiceDetail: InvoiceDetailResponse | null;
  selectedInvoiceId: string | null;
  selectedInvoiceSummary: InvoiceSummaryResponse | null;
  statusActionLoadingKey: string | null;
};

export function InvoicingWorkspaceOperations({
  detailChildren,
  formatBuyerIdentificationType,
  formatDate,
  formatElectronicStatus,
  formatInvoiceStatus,
  formatMoney,
  invoiceDetailLoading,
  invoicingLoading,
  invoices,
  onMarkInvoicePaid,
  onMarkInvoiceIssued,
  onMarkInvoiceVoid,
  onSelectInvoice,
  resolveCustomerName,
  selectedInvoiceDetail,
  selectedInvoiceId,
  selectedInvoiceSummary,
  statusActionLoadingKey,
}: InvoicingWorkspaceOperationsProps) {
  return (
    <div className={styles.stack}>
      <div className={styles.detailCard}>
        <div className={styles.sectionHeading}>
          <div>
            <span className={styles.label}>Invoices</span>
            <h3>{invoices.length} facturas</h3>
          </div>
        </div>

        {invoicingLoading ? (
          <p className={styles.muted}>Cargando invoices...</p>
        ) : invoices.length === 0 ? (
          <div className={styles.emptyState}>
            <p>Este tenant todavia no tiene facturas creadas.</p>
          </div>
        ) : (
          <div className={styles.stack}>
            {invoices.map((invoice) => (
              <button
                className={`${styles.invoiceCard} ${
                  invoice.id === selectedInvoiceId ? styles.invoiceCardActive : ''
                }`}
                key={invoice.id}
                onClick={() => onSelectInvoice(invoice.id)}
                type="button"
              >
                <div className={styles.invoiceCardHeader}>
                  <strong>{invoice.number}</strong>
                  <span className={styles.statusPill}>
                    {formatInvoiceStatus(invoice.status)}
                  </span>
                </div>
                <span>
                  {resolveCustomerName(invoice.customerId, invoice.buyerName)}
                </span>
                <small>
                  {invoice.itemCount} items ·{' '}
                  {formatMoney(invoice.totals.totalInCents, invoice.currency)}
                </small>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className={styles.detailCard} id="invoicing-invoice-detail">
        <div className={styles.sectionHeading}>
          <div>
            <span className={styles.label}>Invoice detail</span>
            <h3>
              {selectedInvoiceDetail?.number ??
                selectedInvoiceSummary?.number ??
                'Selecciona una factura'}
            </h3>
          </div>
        </div>

        {invoiceDetailLoading ? (
          <p className={styles.muted}>Cargando detalle de factura...</p>
        ) : selectedInvoiceDetail ? (
          <>
            <div className={styles.invoiceItemCard}>
              <div className={styles.invoiceCardHeader}>
                <strong>
                  {resolveCustomerName(
                    selectedInvoiceDetail.customerId,
                    selectedInvoiceDetail.buyerName,
                  )}
                </strong>
                <StatusPill>
                  {formatElectronicStatus(selectedInvoiceDetail.electronicStatus)}
                </StatusPill>
              </div>
              <small>
                {selectedInvoiceDetail.buyerIdentificationType
                  ? `${formatBuyerIdentificationType(
                      selectedInvoiceDetail.buyerIdentificationType,
                    )}: ${
                      selectedInvoiceDetail.buyerIdentification ??
                      'Sin identificacion'
                    }`
                  : 'Sin identificacion Ecuador'}
              </small>
              <Stepper stage={deriveStageFromInvoiceDetail(selectedInvoiceDetail)} />
            </div>

            <div className={styles.invoiceDetailGrid}>
              <div>
                <span className={styles.muted}>Customer</span>
                <strong>
                  {resolveCustomerName(
                    selectedInvoiceDetail.customerId,
                    selectedInvoiceDetail.buyerName,
                  )}
                </strong>
                <small>
                  {selectedInvoiceDetail.buyerIdentificationType
                    ? `${formatBuyerIdentificationType(
                        selectedInvoiceDetail.buyerIdentificationType,
                      )}: ${
                        selectedInvoiceDetail.buyerIdentification ??
                        'Sin identificacion'
                      }`
                    : 'Sin identificacion Ecuador'}
                </small>
              </div>
              <div>
                <span className={styles.muted}>Issued</span>
                <strong>{formatDate(selectedInvoiceDetail.issuedAt)}</strong>
              </div>
              <div>
                <span className={styles.muted}>Due</span>
                <strong>{formatDate(selectedInvoiceDetail.dueAt)}</strong>
              </div>
              <div>
                <span className={styles.muted}>Currency</span>
                <strong>{selectedInvoiceDetail.currency}</strong>
              </div>
              <div>
                <span className={styles.muted}>Estado</span>
                <strong>{formatInvoiceStatus(selectedInvoiceDetail.status)}</strong>
              </div>
              <div>
                <span className={styles.muted}>Serie Ecuador</span>
                <strong>
                  {selectedInvoiceDetail.establishmentCode &&
                  selectedInvoiceDetail.emissionPointCode
                    ? `${selectedInvoiceDetail.establishmentCode}-${selectedInvoiceDetail.emissionPointCode}`
                    : 'No configurada'}
                </strong>
              </div>
              <div>
                <span className={styles.muted}>Secuencial</span>
                <strong>
                  {selectedInvoiceDetail.sequenceNumber !== null
                    ? String(selectedInvoiceDetail.sequenceNumber).padStart(9, '0')
                    : 'Manual'}
                </strong>
              </div>
            </div>

            <div className={styles.invoiceTotalsGrid}>
              <div className={styles.commercialCard}>
                <span className={styles.muted}>Estado electronico</span>
                <strong>
                  {formatElectronicStatus(selectedInvoiceDetail.electronicStatus)}
                </strong>
              </div>
              <div className={styles.commercialCard}>
                <span className={styles.muted}>Subtotal</span>
                <strong>
                  {formatMoney(
                    selectedInvoiceDetail.totals.subtotalInCents,
                    selectedInvoiceDetail.currency,
                  )}
                </strong>
              </div>
              <div className={styles.commercialCard}>
                <span className={styles.muted}>Total</span>
                <strong>
                  {formatMoney(
                    selectedInvoiceDetail.totals.totalInCents,
                    selectedInvoiceDetail.currency,
                  )}
                </strong>
              </div>
              <div className={styles.commercialCard}>
                <span className={styles.muted}>Pagado</span>
                <strong>
                  {formatMoney(
                    selectedInvoiceDetail.settlement.paidInCents,
                    selectedInvoiceDetail.currency,
                  )}
                </strong>
              </div>
              <div className={styles.commercialCard}>
                <span className={styles.muted}>Saldo</span>
                <strong>
                  {formatMoney(
                    selectedInvoiceDetail.settlement.balanceDueInCents,
                    selectedInvoiceDetail.currency,
                  )}
                </strong>
              </div>
            </div>

            <div className={styles.actionRow}>
              {selectedInvoiceDetail.status === 'draft' ? (
                <button
                  className={styles.secondaryButton}
                  disabled={statusActionLoadingKey === 'invoice-status:issued'}
                  onClick={onMarkInvoiceIssued}
                  type="button"
                >
                  {statusActionLoadingKey === 'invoice-status:issued'
                    ? 'Emitiendo...'
                    : 'Marcar como emitida'}
                </button>
              ) : null}

              {(selectedInvoiceDetail.status === 'issued' ||
                selectedInvoiceDetail.status === 'partially_paid') ? (
                <button
                  className={styles.primaryButton}
                  disabled={statusActionLoadingKey === 'invoice-status:paid'}
                  onClick={onMarkInvoicePaid}
                  type="button"
                >
                  {statusActionLoadingKey === 'invoice-status:paid'
                    ? 'Registrando...'
                    : 'Marcar como pagada'}
                </button>
              ) : null}

              {(selectedInvoiceDetail.status === 'draft' ||
                selectedInvoiceDetail.status === 'issued') ? (
                <button
                  className={styles.dangerButton}
                  disabled={statusActionLoadingKey === 'invoice-status:void'}
                  onClick={onMarkInvoiceVoid}
                  type="button"
                >
                  {statusActionLoadingKey === 'invoice-status:void'
                    ? 'Anulando...'
                    : 'Anular factura'}
                </button>
              ) : null}
            </div>

            {detailChildren}
          </>
        ) : (
          <div className={styles.emptyState}>
            <p>Selecciona una factura para revisar su detalle operacional.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function deriveStageFromInvoiceDetail(
  invoice: InvoiceDetailResponse,
): InvoicingWorkspaceStage {
  const electronicStatus = invoice.electronicStatus?.toLowerCase() ?? '';

  if (electronicStatus.includes('authorized')) {
    return 'authorized';
  }

  if (electronicStatus.includes('rejected') || electronicStatus.includes('returned')) {
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
