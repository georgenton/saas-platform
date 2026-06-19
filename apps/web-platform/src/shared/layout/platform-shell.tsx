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
  { key: 'finance', label: 'Finance' },
  { key: 'commerce', label: 'Commerce' },
  { key: 'clinics', label: 'Clinics' },
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

function ShellIcon({ label }: { label: string }) {
  const normalizedLabel = label.toLowerCase();

  if (normalizedLabel === 'ai') {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M12 3v4" />
        <path d="M12 17v4" />
        <path d="M3 12h4" />
        <path d="M17 12h4" />
        <path d="m7.5 7.5 2.2 2.2" />
        <path d="m14.3 14.3 2.2 2.2" />
        <path d="m16.5 7.5-2.2 2.2" />
        <path d="m9.7 14.3-2.2 2.2" />
      </svg>
    );
  }

  if (normalizedLabel === 'i') {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M7 3h8l4 4v14H7z" />
        <path d="M15 3v5h4" />
        <path d="M10 13h6" />
        <path d="M10 17h6" />
      </svg>
    );
  }

  if (normalizedLabel === 'd') {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M4 4h7v7H4z" />
        <path d="M13 4h7v7h-7z" />
        <path d="M4 13h7v7H4z" />
        <path d="M13 13h7v7h-7z" />
      </svg>
    );
  }

  if (normalizedLabel === 'w') {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M4 10.5 12 4l8 6.5" />
        <path d="M6 9.5V20h12V9.5" />
        <path d="M10 20v-6h4v6" />
      </svg>
    );
  }

  return <span aria-hidden="true">{label.slice(0, 1)}</span>;
}

function ChevronDownIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="m7 10 5 5 5-5" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="m21 21-4.3-4.3" />
      <circle cx="11" cy="11" r="7" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 8-3 8h18s-3-1-3-8" />
      <path d="M10 20a2 2 0 0 0 4 0" />
    </svg>
  );
}

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
                        <ShellIcon label={item.iconLabel} />
                      </span>
                      <span className={styles.sidebarNavCopy}>
                        <strong>{item.label}</strong>
                      </span>
                      {item.badge !== undefined ? (
                        <em>{item.badge}</em>
                      ) : item.status === 'locked' ? (
                        <em>Lock</em>
                      ) : item.status === 'limited' ? (
                        <em className={styles.sidebarNavItemDot}> </em>
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
            <ShellIcon label="D" />
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
                <ShellIcon label="D" />
              </span>
              <span>
                <strong>{title}</strong>
                <small>Owner · {tenantSlug}</small>
              </span>
              <span className={styles.topbarTenantChevron} aria-hidden="true">
                <ChevronDownIcon />
              </span>
            </button>
            <span className={styles.topbarBreadcrumb} aria-label={headline}>
              <span aria-hidden="true">
                <ChevronRightIcon />
              </span>
              {activeProductWorkspace === 'invoicing' ? 'Invoicing' : 'Dashboard'}
            </span>
          </div>

          <div className={styles.topbarActions}>
            <a className={styles.topbarAssistantButton} href="#ai-console">
              <ShellIcon label="AI" />
              Asistente
            </a>
            <label className={styles.topbarSearch}>
              <span aria-hidden="true">
                <SearchIcon />
              </span>
              <input
                aria-label="Buscar en el workspace"
                placeholder={
                  activeProductWorkspace === 'invoicing'
                    ? 'Buscar factura...'
                    : 'Buscar...'
                }
                type="search"
              />
              <kbd>⌘K</kbd>
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
              <BellIcon />
              <span aria-hidden="true" className={styles.topbarNotificationDot} />
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
