import type { ReactNode } from 'react';
import styles from '../../app/app.module.css';
import { Metric, MoodSelector } from '../design-system';
import type {
  PlatformMoodKey,
  PlatformShellMetric,
  PlatformShellNavItem,
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
            <MoodSelector mood={mood} onMoodChange={onMoodChange} />
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
