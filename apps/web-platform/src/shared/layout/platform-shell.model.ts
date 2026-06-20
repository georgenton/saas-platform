export const PLATFORM_MOODS = [
  {
    key: 'comfort',
    label: 'Comfort',
    summary: 'Balanced, corporate-friendly',
  },
  {
    key: 'focus',
    label: 'Focus',
    summary: 'Denser, stronger hierarchy',
  },
  {
    key: 'calm',
    label: 'Calm',
    summary: 'Softer, gentle contrast',
  },
  {
    key: 'high-contrast',
    label: 'High contrast',
    summary: 'Accessibility-first',
  },
  {
    key: 'night',
    label: 'Night',
    summary: 'Low-glare dark',
  },
] as const;

export type PlatformMoodKey = (typeof PLATFORM_MOODS)[number]['key'];

export type PlatformShellNavItem = {
  badge?: string | number;
  group: 'core' | 'finance' | 'commerce' | 'clinics' | 'platform';
  href: string;
  iconLabel: string;
  label: string;
  meta: string;
  state: string;
  status?: 'active' | 'available' | 'disabled' | 'limited' | 'locked';
};

export type PlatformShellMetric = {
  label: string;
  value: string | number;
};
