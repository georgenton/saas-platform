import type {
  CommandCenterAccessState,
  CommandCenterDomainKey,
  CommandCenterReadinessTone,
} from './model';

export const COMMAND_CENTER_BFF_ENDPOINT_TEMPLATE =
  '/tenancy/tenants/:tenantSlug/command-center';

export function buildCommandCenterBffEndpoint(tenantSlug: string): string {
  return COMMAND_CENTER_BFF_ENDPOINT_TEMPLATE.replace(
    ':tenantSlug',
    encodeURIComponent(tenantSlug),
  );
}

export function commandCenterBffQueryKey(tenantSlug: string | null) {
  return ['command-center', tenantSlug] as const;
}

export type CommandCenterBffAccessOverview = {
  total: number;
  counts: Array<{
    state: CommandCenterAccessState;
    label: string;
    value: number;
  }>;
};

export type CommandCenterBffDomain = {
  key: CommandCenterDomainKey;
  name: string;
  summary?: string;
};

export type CommandCenterBffReadinessSignal = {
  label: string;
  value: string;
  tone: CommandCenterReadinessTone;
};

export type CommandCenterBffEvidence = {
  label: string;
  source: string;
  when: string;
  mono?: string;
};

export type CommandCenterBffBlocker = {
  text: string;
  tone: 'info' | 'neutral' | 'primary' | 'warning';
};

export type CommandCenterBffProduct = {
  key: string;
  domain: CommandCenterDomainKey;
  accessState: CommandCenterAccessState;
  purpose: string;
  readiness?: CommandCenterBffReadinessSignal[];
  evidence?: CommandCenterBffEvidence | null;
  blocker?: CommandCenterBffBlocker | null;
  includes?: string[];
  addonPrice?: string;
  requiresPlan?: string;
};

export type CommandCenterBffResponse = {
  tenantSlug: string;
  generatedAt: string;
  accessOverview: CommandCenterBffAccessOverview;
  domains: CommandCenterBffDomain[];
  products: CommandCenterBffProduct[];
};
