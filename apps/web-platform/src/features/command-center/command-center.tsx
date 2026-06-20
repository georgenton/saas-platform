import type { ReactNode } from 'react';
import styles from '../../app/app.module.css';
import { Banner, Button, ButtonLink, StatusPill } from '../../shared/design-system';
import {
  COMMAND_CENTER_ACCESS_LABELS,
  COMMAND_CENTER_DOMAINS,
  type CommandCenterAccessState,
  type CommandCenterProduct,
} from './model';

export type CommandCenterAccessCounts = Record<CommandCenterAccessState, number>;

type CommandCenterProps = {
  accessCounts: CommandCenterAccessCounts;
  catalogError: string | null;
  catalogLoading: boolean;
  currentPlanLabel: string;
  currentPlanPriceLabel: string;
  hasCurrentTenancy: boolean;
  hasSession: boolean;
  maxUsersLabel: string;
  products: CommandCenterProduct[];
  subscriptionStatusLabel: string;
  tenantMemberCount: number;
  tenantName: string;
  tenantRoleLabel: string;
  tenantSlug: string;
  tenantTaxId?: string | null;
  userDisplayName: string;
};

const productIconNames: Record<string, string> = {
  accounting: 'accounting',
  'ai-console': 'ai',
  ecommerce: 'ecommerce',
  growth: 'growth',
  invoicing: 'invoicing',
  'medical-clinics': 'medical',
  'psychology-clinics': 'psychology',
  'tax-compliance-ec': 'tax',
};

const domainIconNames: Record<string, string> = {
  ai: 'ai',
  clinics: 'medical',
  commerce: 'growth',
  finance: 'invoicing',
};

function MiniIcon({ name }: { name: string }) {
  switch (name) {
    case 'building':
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="M6 21V4h12v17" />
          <path d="M9 8h2" />
          <path d="M13 8h2" />
          <path d="M9 12h2" />
          <path d="M13 12h2" />
          <path d="M9 21v-5h6v5" />
        </svg>
      );
    case 'creditCard':
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="M4 7h16v10H4z" />
          <path d="M4 10h16" />
          <path d="M8 15h4" />
        </svg>
      );
    case 'layers':
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="m12 3 8 4-8 4-8-4z" />
          <path d="m4 12 8 4 8-4" />
          <path d="m4 17 8 4 8-4" />
        </svg>
      );
    case 'invoicing':
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="M7 3h8l4 4v14H7z" />
          <path d="M15 3v5h4" />
          <path d="M10 13h6" />
          <path d="M10 17h5" />
        </svg>
      );
    case 'tax':
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="M6 4h12v16H6z" />
          <path d="M9 8h6" />
          <path d="M9 12h6" />
          <path d="M9 16h2" />
        </svg>
      );
    case 'accounting':
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="M7 4h10v16H7z" />
          <path d="M10 8h4" />
          <path d="M10 12h4" />
          <path d="M10 16h4" />
        </svg>
      );
    case 'growth':
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="M4 17h16" />
          <path d="M6 15l4-4 3 3 5-7" />
          <path d="M17 7h1v1" />
        </svg>
      );
    case 'ecommerce':
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="M5 8h14l-1 12H6z" />
          <path d="M9 8a3 3 0 0 1 6 0" />
        </svg>
      );
    case 'ai':
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="M12 3v4" />
          <path d="M12 17v4" />
          <path d="M3 12h4" />
          <path d="M17 12h4" />
          <path d="m7.5 7.5 2.2 2.2" />
          <path d="m14.3 14.3 2.2 2.2" />
        </svg>
      );
    case 'medical':
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="M12 5v14" />
          <path d="M5 12h14" />
          <path d="M7 7h10v10H7z" />
        </svg>
      );
    case 'psychology':
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="M9 18c-3-1-5-4-5-7a8 8 0 0 1 16 0c0 3-2 6-5 7" />
          <path d="M9 18v3h6v-3" />
          <path d="M9 11h6" />
        </svg>
      );
    case 'refresh':
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="M20 6v5h-5" />
          <path d="M4 18v-5h5" />
          <path d="M18 9a7 7 0 0 0-11-3" />
          <path d="M6 15a7 7 0 0 0 11 3" />
        </svg>
      );
    case 'clock':
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="8" />
          <path d="M12 8v5l3 2" />
        </svg>
      );
    case 'check':
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="m5 13 4 4L19 7" />
        </svg>
      );
    case 'lock':
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <rect x="5" y="10" width="14" height="10" rx="2" />
          <path d="M8 10V8a4 4 0 0 1 8 0v2" />
        </svg>
      );
    default:
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="M4 4h7v7H4z" />
          <path d="M13 4h7v7h-7z" />
          <path d="M4 13h7v7H4z" />
          <path d="M13 13h7v7h-7z" />
        </svg>
      );
  }
}

function IconTile({
  active = true,
  name,
}: {
  active?: boolean;
  name: string;
}) {
  return (
    <span
      className={`${styles.commandIconTile} ${
        active ? styles.commandIconTileActive : ''
      }`}
    >
      <MiniIcon name={name} />
    </span>
  );
}

function AccessPill({
  accessState,
}: {
  accessState: CommandCenterAccessState;
}) {
  return (
    <span
      className={`${styles.productAccessPill} ${
        styles[`productAccess_${accessState}`]
      }`}
    >
      {accessState === 'blocked_by_plan' ? <MiniIcon name="lock" /> : null}
      {COMMAND_CENTER_ACCESS_LABELS[accessState]}
    </span>
  );
}

function ProductStatusCard({ product }: { product: CommandCenterProduct }) {
  const isOperational =
    product.accessState === 'enabled' ||
    product.accessState === 'permission_limited';
  const primaryIsLink = isOperational;
  const primaryVariant =
    product.accessState === 'disabled' ? 'secondary' : 'primary';

  return (
    <article
      className={`${styles.productStatusCard} ${
        isOperational
          ? styles.productStatusCardActive
          : styles.productStatusCardInactive
      }`}
    >
      <div className={styles.productStatusHeader}>
        <IconTile
          active={isOperational}
          name={productIconNames[product.key] ?? product.key}
        />
        <div>
          <h4>{product.name}</h4>
          <p>{product.purpose}</p>
        </div>
        <AccessPill accessState={product.accessState} />
      </div>

      <div className={styles.commandCardDivider} />

      {isOperational ? (
        <div className={styles.readinessList}>
          {product.readiness.map((item) => (
            <div className={styles.readinessRow} key={item.label}>
              <span>{item.label}</span>
              <strong>
                <i className={styles[`readinessDot_${item.tone}`]} />
                {item.value}
              </strong>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.includesList}>
          <span className={styles.label}>Qué desbloquea</span>
          {product.includes.map((item) => (
            <span className={styles.includesItem} key={item}>
              <MiniIcon name="check" />
              {item}
            </span>
          ))}
        </div>
      )}

      {product.evidence ? (
        <div className={styles.evidenceStrip}>
          <MiniIcon name="clock" />
          <span>
            <strong>{product.evidence.label}</strong>
            <small>
              {product.evidence.source} · {product.evidence.when}
            </small>
          </span>
        </div>
      ) : null}

      {product.blocker ? (
        <div className={styles.blockerRow}>{product.blocker}</div>
      ) : null}

      <div className={styles.productActionRow}>
        {primaryIsLink ? (
          <ButtonLink href={product.href}>
            {product.primaryAction}
          </ButtonLink>
        ) : (
          <Button disabled variant={primaryVariant}>
            {product.primaryAction}
          </Button>
        )}
        {product.secondaryAction ? (
          <Button disabled variant="ghost">
            {product.secondaryAction}
          </Button>
        ) : null}
      </div>
    </article>
  );
}

function SummaryCardShell({
  children,
  icon,
  label,
}: {
  children: ReactNode;
  icon: string;
  label: string;
}) {
  return (
    <article className={styles.commandSummaryCard}>
      <div className={styles.commandSummaryCardHeader}>
        <IconTile name={icon} />
        <span className={styles.label}>{label}</span>
      </div>
      {children}
    </article>
  );
}

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <div className={styles.commandSummaryRow}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export function CommandCenter({
  accessCounts,
  catalogError,
  catalogLoading,
  currentPlanLabel,
  currentPlanPriceLabel,
  hasCurrentTenancy,
  hasSession,
  maxUsersLabel,
  products,
  subscriptionStatusLabel,
  tenantMemberCount,
  tenantName,
  tenantRoleLabel,
  tenantSlug,
  tenantTaxId,
  userDisplayName,
}: CommandCenterProps) {
  const firstName = userDisplayName.split(/\s+/).filter(Boolean)[0] ?? 'equipo';
  const productCountLabel =
    products.length === 1 ? 'producto en tu espacio' : 'productos en tu espacio';
  const seatParts = maxUsersLabel.match(/(\d+)\s*\/\s*(\d+)/);
  const seatProgress =
    seatParts && Number(seatParts[2]) > 0
      ? Math.min(100, (Number(seatParts[1]) / Number(seatParts[2])) * 100)
      : null;

  return (
    <section
      className={styles.commandCenter}
      id="product-command-center"
      aria-label="Product Command Center"
    >
      <div className={styles.commandCenterHeader}>
        <div>
          <span className={styles.label}>Workspace</span>
          <h2>Centro de operaciones</h2>
          <p>
            Hola {firstName} — esto es lo que tu espacio de trabajo pide atender
            hoy. Entra a un producto o agrega los que necesites.
          </p>
        </div>
        <span className={styles.commandUpdated}>
          <MiniIcon name="refresh" />
          Actualizado hace un momento
        </span>
      </div>

      <div className={styles.commandSummaryRail}>
        <SummaryCardShell icon="building" label="Empresa">
          <h3>{tenantName}</h3>
          <div className={styles.commandSummaryRows}>
            <SummaryRow label="RUC" value={tenantTaxId ?? tenantSlug} />
            <SummaryRow label="Rol" value={tenantRoleLabel} />
            <SummaryRow
              label="Ambiente"
              value={
                <StatusPill
                  className={styles.commandSuccessPill}
                  tone={hasCurrentTenancy ? 'success' : 'default'}
                >
                  {hasCurrentTenancy ? 'Producción' : 'Sin tenant'}
                </StatusPill>
              }
            />
            <SummaryRow label="Miembros" value={tenantMemberCount} />
          </div>
        </SummaryCardShell>

        <SummaryCardShell icon="creditCard" label="Suscripción">
          <div className={styles.commandPlanTitle}>
            <h3>Plan {currentPlanLabel}</h3>
            <strong>{currentPlanPriceLabel}</strong>
          </div>
          <div className={styles.commandSummaryRows}>
            <SummaryRow label="Estado" value={subscriptionStatusLabel} />
            <SummaryRow label="Asientos" value={maxUsersLabel} />
          </div>
          {seatProgress !== null ? (
            <span className={styles.commandSeatProgress}>
              <i style={{ width: `${seatProgress}%` }} />
            </span>
          ) : null}
          <Button disabled variant="secondary">
            Gestionar plan
          </Button>
        </SummaryCardShell>

        <SummaryCardShell icon="layers" label="Productos">
          <div className={styles.commandProductCount}>
            <strong>{products.length}</strong>
            <span>{productCountLabel}</span>
          </div>
          <div className={styles.accessLegend}>
            {(Object.keys(accessCounts) as CommandCenterAccessState[]).map(
              (state) => (
                <span className={styles.accessLegendItem} key={state}>
                  <i className={styles[`accessDot_${state}`]} />
                  {COMMAND_CENTER_ACCESS_LABELS[state]}
                  <strong>{accessCounts[state]}</strong>
                </span>
              ),
            )}
          </div>
          <Button disabled variant="ghost">
            Add products
          </Button>
        </SummaryCardShell>
      </div>

      {!hasSession ? (
        <Banner>
          Conecta un Bearer token para transformar esta vista en un Command
          Center del tenant real.
        </Banner>
      ) : null}
      {catalogError ? <Banner tone="error">{catalogError}</Banner> : null}
      {catalogLoading ? (
        <Banner>Cargando catalogo y productos...</Banner>
      ) : null}

      <div className={styles.commandDomains}>
        {COMMAND_CENTER_DOMAINS.map((domain) => {
          const domainProducts = products.filter(
            (product) => product.domain === domain.key,
          );
          const activeCount = domainProducts.filter(
            (product) =>
              product.accessState === 'enabled' ||
              product.accessState === 'permission_limited',
          ).length;

          return (
            <section className={styles.commandDomainSection} key={domain.key}>
              <div className={styles.commandDomainHeader}>
                <div>
                  <span className={styles.commandDomainIcon}>
                    <MiniIcon name={domainIconNames[domain.key] ?? domain.key} />
                  </span>
                  <h3>{domain.name}</h3>
                </div>
                <i aria-hidden="true" />
                <StatusPill>
                  {activeCount} activos · {domainProducts.length} total
                </StatusPill>
              </div>

              <div className={styles.productStatusGrid}>
                {domainProducts.map((product) => (
                  <ProductStatusCard key={product.key} product={product} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </section>
  );
}
