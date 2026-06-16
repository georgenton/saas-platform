import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import styles from '../../app/app.module.css';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
};

type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
};

const buttonClassByVariant: Record<ButtonVariant, string> = {
  primary: styles.primaryButton,
  secondary: styles.secondaryButton,
  ghost: styles.ghostButton,
};

export function Button({
  children,
  className,
  type = 'button',
  variant = 'primary',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${buttonClassByVariant[variant]} ${className ?? ''}`.trim()}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  children,
  className,
  variant = 'primary',
  ...props
}: ButtonLinkProps) {
  return (
    <a
      className={`${buttonClassByVariant[variant]} ${className ?? ''}`.trim()}
      {...props}
    >
      {children}
    </a>
  );
}
