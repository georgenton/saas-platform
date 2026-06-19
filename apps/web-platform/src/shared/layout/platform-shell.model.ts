export const PLATFORM_MOODS = [
  {
    key: 'comfort',
    label: 'Comfort',
    summary: 'Profesional y amigable',
  },
  {
    key: 'focus',
    label: 'Focus',
    summary: 'Denso para operacion',
  },
  {
    key: 'calm',
    label: 'Calm',
    summary: 'Suave para jornadas largas',
  },
  {
    key: 'high-contrast',
    label: 'Alto contraste',
    summary: 'Accesibilidad primero',
  },
  {
    key: 'night',
    label: 'Night',
    summary: 'Baja luz',
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
