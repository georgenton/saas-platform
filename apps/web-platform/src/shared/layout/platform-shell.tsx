import { useState, type ReactNode } from 'react';
import styles from '../../app/app.module.css';
import { MoodSelector } from '../design-system';
import type {
  PlatformMoodKey,
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
  children: ReactNode;
  headline: string;
  mood: PlatformMoodKey;
  navItems: PlatformShellNavItem[];
  onMoodChange: (mood: PlatformMoodKey) => void;
  tenantRoleLabel?: string;
  tenantSlug: string;
  tenantTaxId?: string | null;
  title: string;
  userDisplayName?: string;
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

  if (normalizedLabel === 'h') {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M4 10.5 12 4l8 6.5" />
        <path d="M6 9.5V20h12V9.5" />
        <path d="M10 20v-6h4v6" />
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

  if (normalizedLabel === 'p') {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
        <circle cx="9.5" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.8" />
        <path d="M16 3.2a4 4 0 0 1 0 7.6" />
      </svg>
    );
  }

  if (normalizedLabel === 's') {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.6V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9c.2.6.8 1 1.6 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" />
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

function CloseIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function AssistantPanel({ onClose }: { onClose: () => void }) {
  const suggestions = [
    {
      action: 'Revisar lote',
      body: 'Revisa el lote de junio antes de enviarlo al SRI.',
      icon: 'I',
      tone: 'info',
      title: '7 facturas por autorizar',
    },
    {
      action: 'Ver evidencias',
      body: 'Te muestro qué comprobantes faltan antes de declarar.',
      icon: 'T',
      tone: 'warning',
      title: 'IVA de junio: faltan 2 evidencias',
    },
    {
      action: 'Abrir borradores',
      body: 'Tengo borradores de respuesta listos para tu aprobación.',
      icon: 'G',
      tone: 'neutral',
      title: '3 conversaciones sin responder',
    },
  ];

  return (
    <aside className={styles.assistantPanel} aria-label="Asistente IA">
      <div className={styles.assistantPanelHeader}>
        <span className={styles.assistantPanelMark} aria-hidden="true">
          <ShellIcon label="AI" />
        </span>
        <span>
          <strong>Asistente IA</strong>
          <small>Copiloto · suggestion mode</small>
        </span>
        <button
          aria-label="Cerrar asistente"
          className={styles.assistantPanelClose}
          onClick={onClose}
          type="button"
        >
          <CloseIcon />
        </button>
      </div>

      <div className={styles.assistantPanelBody}>
        <p>Hola José — preparé algunas cosas para tu revisión.</p>
        {suggestions.map((suggestion) => (
          <article className={styles.assistantSuggestion} key={suggestion.title}>
            <div>
              <span
                className={`${styles.assistantSuggestionIcon} ${
                  styles[`assistantSuggestion_${suggestion.tone}`]
                }`}
                aria-hidden="true"
              >
                <ShellIcon label={suggestion.icon} />
              </span>
              <span>
                <strong>{suggestion.title}</strong>
                <small>{suggestion.body}</small>
              </span>
            </div>
            <div className={styles.assistantSuggestionActions}>
              <button type="button">{suggestion.action}</button>
              <button type="button">Descartar</button>
            </div>
          </article>
        ))}
      </div>

      <div className={styles.assistantPanelFooter}>
        <div>
          <ShellIcon label="AI" />
          <span>Pregúntale al asistente…</span>
        </div>
        <small>
          El asistente sugiere y explica. No envía, firma ni declara nada sin tu
          aprobación.
        </small>
      </div>
    </aside>
  );
}

export function PlatformShell({
  activeProductWorkspace = null,
  activeHash = '#platform-home',
  children,
  headline,
  mood,
  navItems,
  onMoodChange,
  tenantRoleLabel = 'Owner',
  tenantSlug,
  tenantTaxId = null,
  title,
  userDisplayName,
}: PlatformShellProps) {
  const [assistantOpen, setAssistantOpen] = useState(false);
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
              {(userDisplayName ?? title).slice(0, 2).toUpperCase()}
            </span>
            <span>
              <strong>{userDisplayName ?? title}</strong>
              <small>{tenantRoleLabel}</small>
            </span>
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
                <small>
                  {tenantRoleLabel} ·{' '}
                  {tenantTaxId ? `RUC ${tenantTaxId}` : tenantSlug}
                </small>
              </span>
              <span className={styles.topbarTenantChevron} aria-hidden="true">
                <ChevronDownIcon />
              </span>
            </button>
            <span className={styles.topbarBreadcrumb} aria-label={headline}>
              <span aria-hidden="true">
                <ChevronRightIcon />
              </span>
              {activeProductWorkspace === 'invoicing'
                ? 'Invoicing'
                : activeHash === '#dashboard'
                  ? 'Dashboard'
                  : 'Command Center'}
            </span>
          </div>

          <div className={styles.topbarActions}>
            <button
              className={styles.topbarAssistantButton}
              onClick={() => setAssistantOpen(true)}
              type="button"
            >
              <ShellIcon label="AI" />
              Asistente
            </button>
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
              {(userDisplayName ?? title)
                .split(/\s+/)
                .filter(Boolean)
                .slice(0, 2)
                .map((part) => part[0])
                .join('')
                .toUpperCase()}
            </span>
          </div>
        </header>

        {children}
      </main>
      {assistantOpen ? (
        <AssistantPanel onClose={() => setAssistantOpen(false)} />
      ) : null}
    </div>
  );
}
