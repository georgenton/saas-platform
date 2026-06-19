import type { HTMLAttributes, ReactNode } from 'react';
import styles from '../../app/app.module.css';

type StatusPillTone = 'default' | 'success' | 'warning' | 'danger';

type StatusPillProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
  tone?: StatusPillTone;
};

const statusClassByTone: Record<StatusPillTone, string> = {
  default: styles.statusPill,
  success: `${styles.statusPill} ${styles.statusPillSuccess}`,
  warning: `${styles.statusPill} ${styles.statusPillWarning}`,
  danger: `${styles.statusPill} ${styles.statusPillDanger}`,
};

export function StatusPill({
  children,
  className,
  tone = 'default',
  ...props
}: StatusPillProps) {
  return (
    <span
      className={`${statusClassByTone[tone]} ${className ?? ''}`.trim()}
      {...props}
    >
      {children}
    </span>
  );
}
