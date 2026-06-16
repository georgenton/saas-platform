import type { HTMLAttributes, ReactNode } from 'react';
import styles from '../../app/app.module.css';

type BannerTone = 'info' | 'error' | 'success';

type BannerProps = HTMLAttributes<HTMLDivElement | HTMLParagraphElement> & {
  children: ReactNode;
  tone?: BannerTone;
};

const bannerClassByTone: Record<BannerTone, string> = {
  info: styles.commandBanner,
  error: styles.errorBanner,
  success: styles.successBanner,
};

export function Banner({
  children,
  className,
  tone = 'info',
  ...props
}: BannerProps) {
  const classNameValue = `${bannerClassByTone[tone]} ${className ?? ''}`.trim();

  if (tone === 'info') {
    return (
      <div className={classNameValue} {...props}>
        {children}
      </div>
    );
  }

  return (
    <p className={classNameValue} {...props}>
      {children}
    </p>
  );
}
