import { useEffect, useRef, type ReactNode } from 'react';
import styles from '../../app/app.module.css';
import type { InvoiceDetailResponse } from '../../app/types';
import {
  deriveDeliveryCloseoutMeta,
  deriveDeliveryCloseoutStatus,
  derivePaymentCloseoutMeta,
  deriveSriCloseoutStatus,
  type InvoicingCloseoutTone,
} from './closeout';
import type {
  InvoicingWorkspaceFoundationModel,
  InvoicingWorkspaceHeroActionKey,
} from './model';
import { InvoicingWorkspaceSummary } from './workspace-summary';

export type InvoicingWorkspaceSubview =
  | 'overview'
  | 'settings'
  | 'draft'
  | 'documents';

const INVOICING_WORKSPACE_TABS: Array<{
  href: string;
  key: InvoicingWorkspaceSubview;
  label: string;
}> = [
  { href: '#invoicing-domain', key: 'overview', label: 'Resumen' },
  { href: '#invoicing-settings-sri', key: 'settings', label: 'Configuracion SRI' },
  { href: '#invoicing-customer-draft', key: 'draft', label: 'Clientes y borrador' },
  { href: '#invoicing-documents', key: 'documents', label: 'Documentos' },
];

const INVOICING_SUBVIEW_CONTEXT: Record<
  InvoicingWorkspaceSubview,
  {
    actionHref: string;
    actionLabel: string;
    description: string;
    eyebrow: string;
    title: string;
  }
> = {
  overview: {
    actionHref: '#invoicing-settings-sri',
    actionLabel: 'Revisar SRI',
    description:
      'Vista ejecutiva del producto: readiness Ecuador, métricas y próximo foco operativo.',
    eyebrow: 'Resumen operativo',
    title: 'Estado general de facturación',
  },
  settings: {
    actionHref: '#invoicing-customer-draft',
    actionLabel: 'Crear borrador',
    description:
      'Configura emisor, firma, numeración y conexión SRI sin mezclarlo con la cola documental.',
    eyebrow: 'Preparación fiscal',
    title: 'Configuración SRI',
  },
  draft: {
    actionHref: '#invoicing-documents',
    actionLabel: 'Ver documentos',
    description:
      'Crea compradores y borradores con una guía clara antes de pasar a revisión o envío.',
    eyebrow: 'Emisión guiada',
    title: 'Clientes y borrador',
  },
  documents: {
    actionHref: '#invoicing-settings-sri',
    actionLabel: 'Ajustar SRI',
    description:
      'Revisa la cola, el comprobante seleccionado, estado electrónico, evidencia y acciones.',
    eyebrow: 'Operación documental',
    title: 'Documentos y envío',
  },
};

type InvoicingDomainSectionProps = {
  activeSubview: InvoicingWorkspaceSubview;
  children?: ReactNode;
  currentTenancyName: string | null;
  effectiveError: string | null;
  emptyState:
    | 'no-session'
    | 'no-tenancy'
    | 'product-disabled'
    | 'ready';
  invoiceDetailLoading: boolean;
  invoicingActionMessage: string | null;
  invoicingLoading: boolean;
  invoiceEmailRecipient: string;
  model: InvoicingWorkspaceFoundationModel;
  onPrimaryAction: (actionKey: InvoicingWorkspaceHeroActionKey) => void;
  onRefresh: () => void;
  selectedInvoiceDetail: InvoiceDetailResponse | null;
  formatElectronicStatus: (value: string | null) => string;
  formatMoney: (valueInCents: number, currency: string) => string;
};

export function InvoicingDomainSection({
  activeSubview,
  children,
  currentTenancyName,
  effectiveError,
  emptyState,
  invoiceDetailLoading,
  invoicingActionMessage,
  invoicingLoading,
  invoiceEmailRecipient,
  model,
  onPrimaryAction,
  onRefresh,
  selectedInvoiceDetail,
  formatElectronicStatus,
  formatMoney,
}: InvoicingDomainSectionProps) {
  const subviewContext = INVOICING_SUBVIEW_CONTEXT[activeSubview];
  const subviewHeadingRef = useRef<HTMLDivElement | null>(null);
  const subviewHeadingId = `invoicing-${activeSubview}-heading`;

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      subviewHeadingRef.current?.focus({ preventScroll: true });
      subviewHeadingRef.current?.scrollIntoView({
        block: 'start',
        behavior: 'smooth',
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [activeSubview]);

  return (
    <section
      className={styles.adminPanel}
      data-product-workspace="invoicing"
      data-product-workspace-subview={activeSubview}
      id="invoicing-domain"
    >
      <div className={styles.productWorkspaceHero}>
        <div className={styles.productWorkspaceTitleRow}>
          <span className={styles.label}>Producto activo · Ecuador</span>
          <h2>Facturacion electronica SRI</h2>
        </div>
        <div className={styles.productWorkspaceActions}>
          <a className={styles.secondaryButton} href="#platform-home">
            Volver al Command Center
          </a>
          <a className={styles.primaryButton} href="#invoicing-settings-sri">
            Configurar SRI
          </a>
        </div>
      </div>

      <InvoicingSubviewNav activeSubview={activeSubview} />

      <div
        aria-labelledby={subviewHeadingId}
        className={`${styles.sectionHeading} ${styles.productWorkspaceSubviewHeading}`}
        ref={subviewHeadingRef}
        tabIndex={-1}
      >
        <div>
          <span className={styles.label}>{subviewContext.eyebrow}</span>
          <h2 id={subviewHeadingId}>{subviewContext.title}</h2>
        </div>
        {emptyState === 'ready' ? (
          <button
            className={styles.ghostButton}
            disabled={invoicingLoading || invoiceDetailLoading}
            onClick={onRefresh}
            type="button"
          >
            {invoicingLoading ? 'Refrescando...' : 'Refrescar invoicing'}
          </button>
        ) : null}
      </div>

      {emptyState === 'no-session' ? (
        <div className={styles.emptyState}>
          <p>Primero carguemos la sesion para abrir el workspace de invoicing.</p>
        </div>
      ) : emptyState === 'no-tenancy' ? (
        <div className={styles.emptyState}>
          <p>
            Selecciona un tenant actual para consultar y operar el dominio de
            invoicing.
          </p>
        </div>
      ) : emptyState === 'product-disabled' ? (
        <div className={styles.emptyState}>
          <p>
            El producto <strong>invoicing</strong> no esta habilitado para{' '}
            {currentTenancyName ?? 'este tenant'} segun su acceso efectivo
            actual.
          </p>
        </div>
      ) : (
        <div className={styles.stack}>
          {effectiveError ? (
            <p className={styles.errorBanner} role="alert">
              {effectiveError}
            </p>
          ) : null}
          {invoicingActionMessage ? (
            <p
              aria-live="polite"
              className={styles.successBanner}
              role="status"
            >
              {invoicingActionMessage}
            </p>
          ) : null}

          <div className={styles.productWorkspaceContext}>
            <p>{subviewContext.description}</p>
            <a
              className={styles.secondaryButton}
              href={subviewContext.actionHref}
            >
              {subviewContext.actionLabel}
            </a>
          </div>

          <InvoicingContextStrip
            formatElectronicStatus={formatElectronicStatus}
            formatMoney={formatMoney}
            invoiceEmailRecipient={invoiceEmailRecipient}
            selectedInvoiceDetail={selectedInvoiceDetail}
          />

          {activeSubview === 'overview' ? (
            <InvoicingWorkspaceSummary
              model={model}
              onPrimaryAction={onPrimaryAction}
            />
          ) : null}

          {children}
        </div>
      )}
    </section>
  );
}

function InvoicingSubviewNav({
  activeSubview,
}: {
  activeSubview: InvoicingWorkspaceSubview;
}) {
  return (
    <nav
      aria-label="Navegacion interna de facturacion electronica"
      className={styles.productWorkspaceTabs}
    >
      {INVOICING_WORKSPACE_TABS.map((tab) => (
        <a
          aria-current={activeSubview === tab.key ? 'page' : undefined}
          href={tab.href}
          key={tab.key}
        >
          {tab.label}
        </a>
      ))}
    </nav>
  );
}

function InvoicingContextStrip({
  formatElectronicStatus,
  formatMoney,
  invoiceEmailRecipient,
  selectedInvoiceDetail,
}: {
  formatElectronicStatus: (value: string | null) => string;
  formatMoney: (valueInCents: number, currency: string) => string;
  invoiceEmailRecipient: string;
  selectedInvoiceDetail: InvoiceDetailResponse | null;
}) {
  if (!selectedInvoiceDetail) {
    return (
      <section
        aria-label="Contexto de factura activa"
        className={styles.invoicingContextStrip}
      >
        <div className={styles.invoicingContextIdentity}>
          <span className={styles.label}>Factura activa</span>
          <strong>Selecciona un documento</strong>
          <small>
            La tira de contexto mostrara numero, cliente, total y estado cuando
            exista una factura activa.
          </small>
        </div>
      </section>
    );
  }

  const sriStatus = deriveSriCloseoutStatus(selectedInvoiceDetail);
  const deliveryStatus = deriveDeliveryCloseoutMeta(
    deriveDeliveryCloseoutStatus({
      isSending: false,
      recipientEmail: invoiceEmailRecipient,
    }),
  );
  const paymentStatus = derivePaymentCloseoutMeta(selectedInvoiceDetail);

  return (
    <section
      aria-label="Contexto de factura activa"
      className={styles.invoicingContextStrip}
    >
      <div className={styles.invoicingContextIdentity}>
        <span className={styles.label}>Factura activa</span>
        <strong className={styles.monoValue}>{selectedInvoiceDetail.number}</strong>
        <small>
          {selectedInvoiceDetail.buyerName ?? 'Cliente sin nombre'} ·{' '}
          {formatMoney(
            selectedInvoiceDetail.totals.totalInCents,
            selectedInvoiceDetail.currency,
          )}
        </small>
      </div>

      <div className={styles.invoicingContextTriad}>
        <InvoicingContextSignal
          detail={formatElectronicStatus(selectedInvoiceDetail.electronicStatus)}
          label="SRI"
          status={sriStatus.label}
          tone={sriStatus.tone}
        />
        <InvoicingContextSignal
          detail={invoiceEmailRecipient || 'Correo pendiente'}
          label="Entrega"
          status={deliveryStatus.label}
          tone={deliveryStatus.tone}
        />
        <InvoicingContextSignal
          detail={formatMoney(
            selectedInvoiceDetail.settlement.balanceDueInCents,
            selectedInvoiceDetail.currency,
          )}
          label="Pago"
          status={paymentStatus.label}
          tone={paymentStatus.tone}
        />
      </div>
    </section>
  );
}

function InvoicingContextSignal({
  detail,
  label,
  status,
  tone,
}: {
  detail: string;
  label: string;
  status: string;
  tone: InvoicingCloseoutTone;
}) {
  return (
    <div className={styles.invoicingContextSignal}>
      <span>{label}</span>
      <strong>{status}</strong>
      <small>{detail}</small>
      <i
        aria-hidden="true"
        className={`${styles.invoicingContextSignalDot} ${
          tone === 'success'
            ? styles.invoicingContextSignalSuccess
            : tone === 'warning'
              ? styles.invoicingContextSignalWarning
              : tone === 'danger'
                ? styles.invoicingContextSignalDanger
                : tone === 'info'
                  ? styles.invoicingContextSignalInfo
                  : ''
        }`}
      />
    </div>
  );
}
