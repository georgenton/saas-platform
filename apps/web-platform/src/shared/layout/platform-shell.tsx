import type { ReactNode } from 'react';
import styles from '../../app/app.module.css';
import { Metric, MoodSelector } from '../design-system';
import type {
  PlatformMoodKey,
  PlatformShellMetric,
  PlatformShellNavItem,
} from './platform-shell.model';

const navGroups: Array<{
  key: PlatformShellNavItem['group'];
  label: string;
}> = [
  { key: 'core', label: 'Core' },
  { key: 'finance', label: 'Finanzas' },
  { key: 'commerce', label: 'Comercio' },
  { key: 'clinics', label: 'Clinicas' },
  { key: 'platform', label: 'Platform' },
];

type PlatformShellProps = {
  activeProductWorkspace?: 'invoicing' | null;
  activeHash?: string;
  apiBaseUrl: string;
  children: ReactNode;
  headline: string;
  metrics: PlatformShellMetric[];
  mood: PlatformMoodKey;
  navItems: PlatformShellNavItem[];
  onMoodChange: (mood: PlatformMoodKey) => void;
  tenantSlug: string;
  title: string;
};

export function PlatformShell({
  activeProductWorkspace = null,
  activeHash = '#platform-home',
  apiBaseUrl,
  children,
  headline,
  metrics,
  mood,
  navItems,
  onMoodChange,
  tenantSlug,
  title,
}: PlatformShellProps) {
  const pageClassName = activeProductWorkspace
    ? `${styles.page} ${styles.pageProductWorkspaceActive}`
    : styles.page;

  return (
    <div className={styles.shell} data-mood={mood}>
      <aside className={styles.sidebar} aria-label="Navegacion principal">
        <div className={styles.sidebarBrand}>
          <span className={styles.brandMark}>S</span>
          <div>
            <strong>SaaSPlatform</strong>
            <small>Multi-product workspace</small>
          </div>
        </div>

        <nav className={styles.sidebarNav}>
          {navGroups.map((group) => {
            const groupItems = navItems.filter((item) => item.group === group.key);

            if (!groupItems.length) {
              return null;
            }

            return (
              <div className={styles.sidebarNavGroup} key={group.key}>
                <span className={styles.sidebarNavGroupLabel}>
                  {group.label}
                </span>
                {groupItems.map((item) => {
                  const isActive =
                    activeHash === item.href ||
                    (item.href === '#invoicing-domain' &&
                      activeHash.startsWith('#invoicing-'));
                  const isDisabled =
                    item.status === 'disabled' || item.status === 'locked';

                  return (
                    <a
                      aria-current={isActive ? 'page' : undefined}
                      aria-disabled={isDisabled || undefined}
                      className={`${styles.sidebarNavItem} ${
                        isActive ? styles.sidebarNavItemActive : ''
                      } ${
                        isDisabled ? styles.sidebarNavItemDisabled : ''
                      }`.trim()}
                      href={isDisabled ? undefined : item.href}
                      key={item.href}
                    >
                      <span className={styles.sidebarNavIcon} aria-hidden="true">
                        {item.iconLabel}
                      </span>
                      <span className={styles.sidebarNavCopy}>
                        <strong>{item.label}</strong>
                        <small>{item.meta}</small>
                      </span>
                      {item.badge !== undefined ? (
                        <em>{item.badge}</em>
                      ) : item.status === 'locked' ? (
                        <em>Lock</em>
                      ) : item.status === 'limited' ? (
                        <em>!</em>
                      ) : null}
                    </a>
                  );
                })}
              </div>
            );
          })}
        </nav>

        <div className={styles.sidebarFooter}>
          <a className={styles.sidebarAddProduct} href="#platform-home">
            Add products
          </a>
          <div className={styles.sidebarUser}>
            <span className={styles.sidebarUserAvatar} aria-hidden="true">
              {title.slice(0, 2).toUpperCase()}
            </span>
            <span>
              <strong>{title}</strong>
              <small>Owner</small>
            </span>
          </div>
          <div className={styles.sidebarApi}>
            <span>API</span>
            <strong>{apiBaseUrl}</strong>
          </div>
        </div>
      </aside>

      <main
        className={pageClassName}
        data-active-product-workspace={activeProductWorkspace ?? undefined}
      >
        <header className={styles.topbar}>
          <div className={styles.topbarTenant}>
            <button className={styles.topbarTenantButton} type="button">
              <span className={styles.topbarTenantIcon} aria-hidden="true">
                SP
              </span>
              <span>
                <strong>{title}</strong>
                <small>{tenantSlug}</small>
              </span>
            </button>
            <span className={styles.topbarBreadcrumb} aria-label={headline}>
              {activeProductWorkspace === 'invoicing' ? 'Invoicing' : 'Dashboard'}
            </span>
          </div>

          <div className={styles.topbarActions}>
            <a className={styles.topbarAssistantButton} href="#ai-console">
              Asistente
            </a>
            <label className={styles.topbarSearch}>
              <span aria-hidden="true">⌕</span>
              <input
                aria-label="Buscar en el workspace"
                placeholder={
                  activeProductWorkspace === 'invoicing'
                    ? 'Buscar factura...'
                    : 'Buscar...'
                }
                type="search"
              />
            </label>
            <MoodSelector
              mood={mood}
              onMoodChange={onMoodChange}
              variant="compact"
            />
            <button
              aria-label="Notificaciones"
              className={styles.topbarIconButton}
              type="button"
            >
              !
            </button>
            <span className={styles.topbarAvatar} aria-hidden="true">
              {title
                .split(/\s+/)
                .filter(Boolean)
                .slice(0, 2)
                .map((part) => part[0])
                .join('')
                .toUpperCase()}
            </span>
          </div>
        </header>

        <section className={styles.shellOverview} aria-label="Estado del shell">
          {metrics.map((metric) => (
            <Metric key={metric.label} label={metric.label} value={metric.value} />
          ))}
        </section>

        {children}
      </main>
    </div>
  );
}
