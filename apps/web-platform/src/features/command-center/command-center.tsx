import styles from '../../app/app.module.css';
import { Banner, Button, ButtonLink, Card, StatusPill } from '../../shared/design-system';
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
};

function ProductStatusCard({ product }: { product: CommandCenterProduct }) {
  const isOperational =
    product.accessState === 'enabled' ||
    product.accessState === 'permission_limited';
  const primaryIsLink = isOperational;

  return (
    <Card
      variant={isOperational ? 'product-active' : 'product-inactive'}
    >
      <div className={styles.productStatusHeader}>
        <span className={styles.productIconTile}>
          {product.name
            .split(' ')
            .slice(0, 2)
            .map((part) => part[0])
            .join('')}
        </span>
        <div>
          <h4>{product.name}</h4>
          <p>{product.purpose}</p>
        </div>
        <span
          className={`${styles.productAccessPill} ${
            styles[`productAccess_${product.accessState}`]
          }`}
        >
          {COMMAND_CENTER_ACCESS_LABELS[product.accessState]}
        </span>
      </div>

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
        <ul className={styles.includesList}>
          {product.includes.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}

      {product.evidence ? (
        <div className={styles.evidenceStrip}>
          <strong>{product.evidence.label}</strong>
          <span>
            {product.evidence.source} · {product.evidence.when}
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
          <Button disabled variant="secondary">
            {product.primaryAction}
          </Button>
        )}
        {product.secondaryAction ? (
          <Button disabled variant="ghost">
            {product.secondaryAction}
          </Button>
        ) : null}
      </div>
    </Card>
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
}: CommandCenterProps) {
  return (
    <section
      className={styles.commandCenter}
      id="product-command-center"
      aria-label="Product Command Center"
    >
      <div className={styles.commandCenterHeader}>
        <div>
          <span className={styles.label}>Product Command Center</span>
          <h2>Centro operativo del workspace</h2>
          <p>
            Tus productos activos, disponibles y bloqueados en una sola vista
            modular. Las acciones de add-on y plan quedan visibles como estados
            futuros, sin inventar endpoints.
          </p>
        </div>
        {hasCurrentTenancy ? (
          <StatusPill>Tenant activo</StatusPill>
        ) : (
          <StatusPill tone="warning">Sin tenant</StatusPill>
        )}
      </div>

      <div className={styles.commandSummaryRail}>
        <Card>
          <span className={styles.label}>Tenant</span>
          <h3>{tenantName}</h3>
          <dl>
            <div>
              <dt>Slug</dt>
              <dd>{tenantSlug}</dd>
            </div>
            <div>
              <dt>Rol</dt>
              <dd>{tenantRoleLabel}</dd>
            </div>
            <div>
              <dt>Miembros</dt>
              <dd>{tenantMemberCount} workspace(s)</dd>
            </div>
          </dl>
        </Card>

        <Card>
          <span className={styles.label}>Subscription</span>
          <h3>{currentPlanLabel}</h3>
          <dl>
            <div>
              <dt>Estado</dt>
              <dd>{subscriptionStatusLabel}</dd>
            </div>
            <div>
              <dt>Precio</dt>
              <dd>{currentPlanPriceLabel}</dd>
            </div>
            <div>
              <dt>Capacidad</dt>
              <dd>{maxUsersLabel}</dd>
            </div>
          </dl>
        </Card>

        <Card>
          <span className={styles.label}>Product access</span>
          <h3>{products.length} modulos visibles</h3>
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
        </Card>
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
                  <h3>{domain.name}</h3>
                  <p>{domain.summary}</p>
                </div>
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
