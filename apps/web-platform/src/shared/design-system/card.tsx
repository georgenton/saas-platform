import type { HTMLAttributes, ReactNode } from 'react';
import styles from '../../app/app.module.css';

type CardVariant = 'summary' | 'product-active' | 'product-inactive';

type CardProps = HTMLAttributes<HTMLElement> & {
  as?: 'article' | 'section' | 'div';
  children: ReactNode;
  variant?: CardVariant;
};

const cardClassByVariant: Record<CardVariant, string> = {
  summary: styles.commandSummaryCard,
  'product-active': `${styles.productStatusCard} ${styles.productStatusCardActive}`,
  'product-inactive': `${styles.productStatusCard} ${styles.productStatusCardInactive}`,
};

export function Card({
  as: Component = 'article',
  children,
  className,
  variant = 'summary',
  ...props
}: CardProps) {
  return (
    <Component
      className={`${cardClassByVariant[variant]} ${className ?? ''}`.trim()}
      {...props}
    >
      {children}
    </Component>
  );
}
