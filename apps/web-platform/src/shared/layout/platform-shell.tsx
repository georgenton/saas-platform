import type { ReactNode } from 'react';
import styles from '../../app/app.module.css';
import {
  PLATFORM_MOODS,
  type PlatformMoodKey,
  type PlatformShellMetric,
  type PlatformShellNavItem,
} from './platform-shell.model';

type PlatformShellProps = {
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
  return (
    <div className={styles.shell} data-mood={mood}>
      <aside className={styles.sidebar} aria-label="Navegacion principal">
        <div className={styles.sidebarBrand}>
          <span className={styles.brandMark}>SP</span>
          <div>
            <strong>SaaS Platform</strong>
            <small>Multi-product workspace</small>
          </div>
        </div>

        <nav className={styles.sidebarNav}>
          {navItems.map((item) => (
            <a className={styles.sidebarNavItem} href={item.href} key={item.href}>
              <span>
                <strong>{item.label}</strong>
                <small>{item.meta}</small>
              </span>
              <em>{item.state}</em>
            </a>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <span>API</span>
          <strong>{apiBaseUrl}</strong>
        </div>
      </aside>

      <main className={styles.page}>
        <header className={styles.topbar}>
          <div className={styles.topbarIdentity}>
            <span className={styles.eyebrow}>Workspace operativo</span>
            <h1>{title}</h1>
            <p>{headline}</p>
          </div>

          <div className={styles.topbarActions}>
            <div className={styles.tenantBadge}>
              <span>Tenant</span>
              <strong>{tenantSlug}</strong>
            </div>
            <div className={styles.moodPanel}>
              <div>
                <span>Modo visual</span>
                <strong>
                  {PLATFORM_MOODS.find((platformMood) => platformMood.key === mood)
                    ?.label}
                </strong>
              </div>
              <div
                aria-label="Elegir mood de interfaz"
                className={styles.moodSelector}
                role="radiogroup"
              >
                {PLATFORM_MOODS.map((platformMood) => (
                  <button
                    aria-checked={mood === platformMood.key}
                    aria-label={`${platformMood.label}: ${platformMood.summary}`}
                    className={`${styles.moodButton} ${
                      mood === platformMood.key ? styles.moodButtonActive : ''
                    }`}
                    key={platformMood.key}
                    onClick={() => onMoodChange(platformMood.key)}
                    role="radio"
                    title={platformMood.summary}
                    type="button"
                  >
                    <span
                      className={styles.moodSwatch}
                      data-preview-mood={platformMood.key}
                    />
                    <span>{platformMood.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </header>

        <section className={styles.shellOverview} aria-label="Estado del shell">
          {metrics.map((metric) => (
            <div className={styles.metric} key={metric.label}>
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
            </div>
          ))}
        </section>

        {children}
      </main>
    </div>
  );
}
