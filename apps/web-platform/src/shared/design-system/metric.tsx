import type { ReactNode } from 'react';
import styles from '../../app/app.module.css';

type MetricProps = {
  label: string;
  value: ReactNode;
};

export function Metric({ label, value }: MetricProps) {
  return (
    <div className={styles.metric}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
