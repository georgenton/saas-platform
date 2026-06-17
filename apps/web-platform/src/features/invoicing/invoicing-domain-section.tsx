import type { ReactNode } from 'react';
import styles from '../../app/app.module.css';
import type {
  InvoicingWorkspaceFoundationModel,
  InvoicingWorkspaceHeroActionKey,
} from './model';
import { InvoicingWorkspaceSummary } from './workspace-summary';

type InvoicingDomainSectionProps = {
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
  model: InvoicingWorkspaceFoundationModel;
  onPrimaryAction: (actionKey: InvoicingWorkspaceHeroActionKey) => void;
  onRefresh: () => void;
};

export function InvoicingDomainSection({
  children,
  currentTenancyName,
  effectiveError,
  emptyState,
  invoiceDetailLoading,
  invoicingActionMessage,
  invoicingLoading,
  model,
  onPrimaryAction,
  onRefresh,
}: InvoicingDomainSectionProps) {
  return (
    <section className={styles.adminPanel} id="invoicing-domain">
      <div className={styles.productWorkspaceHero}>
        <div>
          <span className={styles.label}>Producto activo · Ecuador</span>
          <h2>Facturacion electronica SRI</h2>
          <p>
            Opera emisor, firma, compradores, borradores, documentos y envio SRI
            desde una superficie dedicada. El Command Center queda como entrada;
            este es el workspace del producto.
          </p>
        </div>
        <div className={styles.productWorkspaceActions}>
          <a className={styles.secondaryButton} href="#product-command-center">
            Volver al Command Center
          </a>
          <a className={styles.primaryButton} href="#invoicing-issuer-profile">
            Configurar SRI
          </a>
        </div>
      </div>

      <nav
        aria-label="Navegacion interna de facturacion electronica"
        className={styles.productWorkspaceTabs}
      >
        <a href="#invoicing-domain">Resumen</a>
        <a href="#invoicing-issuer-profile">Configuracion SRI</a>
        <a href="#invoicing-customer-draft-flow">Clientes y borrador</a>
        <a href="#invoicing-invoice-detail">Documentos</a>
      </nav>

      <div className={styles.sectionHeading}>
        <div>
          <span className={styles.label}>Panel operativo</span>
          <h2>Resumen, configuracion y documentos</h2>
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
            <p className={styles.errorBanner}>{effectiveError}</p>
          ) : null}
          {invoicingActionMessage ? (
            <p className={styles.successBanner}>{invoicingActionMessage}</p>
          ) : null}

          <InvoicingWorkspaceSummary
            model={model}
            onPrimaryAction={onPrimaryAction}
          />

          {children}
        </div>
      )}
    </section>
  );
}
