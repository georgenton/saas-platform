import type { InvoiceSummaryResponse } from '../../app/types';
import type { InvoicingWorkspaceSubview } from '../invoicing/model';
import type { PlatformShellNavItem } from '../../shared/layout/platform-shell.model';

export type ActiveProductWorkspace = 'invoicing' | null;

type BuildPlatformShellNavItemsInput = {
  canAccessTransversalAiConsole: boolean;
  canManageInvitations: boolean;
  canReadGrowthConversations: boolean;
  currentTenantSlug: string | null;
  enabledProductKeys: Set<string>;
  invoices: InvoiceSummaryResponse[];
  sessionFlowLabel: string;
};

export function resolveActiveProductWorkspace(
  activeHash: string,
): ActiveProductWorkspace {
  return activeHash === '#invoicing-domain' || activeHash.startsWith('#invoicing-')
    ? 'invoicing'
    : null;
}

export function resolveActiveInvoicingSubview(
  activeHash: string,
): InvoicingWorkspaceSubview {
  if (
    activeHash === '#invoicing-settings-sri' ||
    activeHash === '#invoicing-issuer-profile'
  ) {
    return 'settings';
  }

  if (
    activeHash === '#invoicing-customer-draft' ||
    activeHash === '#invoicing-customer-draft-flow'
  ) {
    return 'draft';
  }

  if (
    activeHash === '#invoicing-items' ||
    activeHash === '#invoicing-invoice-items'
  ) {
    return 'items';
  }

  if (
    activeHash === '#invoicing-sri-lifecycle' ||
    activeHash === '#invoicing-electronic-lifecycle' ||
    activeHash === '#invoicing-electronic-status'
  ) {
    return 'sri-lifecycle';
  }

  if (
    activeHash === '#invoicing-documents' ||
    activeHash === '#invoicing-invoice-detail'
  ) {
    return 'documents';
  }

  if (
    activeHash === '#invoicing-closeout' ||
    activeHash === '#invoicing-payment-email-closeout'
  ) {
    return 'closeout';
  }

  return 'overview';
}

export function buildPlatformShellNavItems({
  canAccessTransversalAiConsole,
  canManageInvitations,
  canReadGrowthConversations,
  currentTenantSlug,
  enabledProductKeys,
  invoices,
  sessionFlowLabel,
}: BuildPlatformShellNavItemsInput): PlatformShellNavItem[] {
  return [
    {
      group: 'core',
      href: '#platform-home',
      iconLabel: 'D',
      label: 'Dashboard',
      meta: sessionFlowLabel,
      state: currentTenantSlug ? 'Activo' : 'Listo',
      status: 'active',
    },
    {
      group: 'core',
      href: '#tenant-workspace',
      iconLabel: 'W',
      label: 'Workspace',
      meta: currentTenantSlug ?? 'Sin tenant',
      state: currentTenantSlug ? 'Activo' : 'Pendiente',
      status: currentTenantSlug ? 'active' : 'available',
    },
    {
      group: 'finance',
      href: '#invoicing-domain',
      iconLabel: 'I',
      label: 'Invoicing',
      meta: enabledProductKeys.has('invoicing')
        ? 'Producto activo'
        : 'No habilitado',
      state: enabledProductKeys.has('invoicing') ? 'Activo' : 'Disponible',
      status: enabledProductKeys.has('invoicing') ? 'active' : 'available',
      badge: invoices.length || undefined,
    },
    {
      group: 'finance',
      href: '#tax-compliance-ec',
      iconLabel: 'T',
      label: 'Tax Compliance EC',
      meta: enabledProductKeys.has('tax-compliance-ec')
        ? 'Producto activo'
        : 'Depende de evidencia',
      state: enabledProductKeys.has('tax-compliance-ec')
        ? 'Activo'
        : 'Disponible',
      status: enabledProductKeys.has('tax-compliance-ec') ? 'active' : 'available',
    },
    {
      group: 'finance',
      href: '#accounting',
      iconLabel: 'A',
      label: 'Accounting',
      meta: enabledProductKeys.has('accounting') ? 'Producto activo' : 'Backlog',
      state: enabledProductKeys.has('accounting') ? 'Activo' : 'Bloqueado',
      status: enabledProductKeys.has('accounting') ? 'active' : 'locked',
    },
    {
      group: 'commerce',
      href: '#ecommerce',
      iconLabel: 'E',
      label: 'Ecommerce',
      meta: enabledProductKeys.has('ecommerce')
        ? 'Producto activo'
        : 'No habilitado',
      state: enabledProductKeys.has('ecommerce') ? 'Activo' : 'Disponible',
      status: enabledProductKeys.has('ecommerce') ? 'active' : 'available',
    },
    {
      group: 'commerce',
      href: '#growth-console',
      iconLabel: 'G',
      label: 'Growth',
      meta: enabledProductKeys.has('growth') ? 'Producto activo' : 'No habilitado',
      state: canReadGrowthConversations ? 'Operable' : 'Limitado',
      status: canReadGrowthConversations ? 'active' : 'limited',
    },
    {
      group: 'clinics',
      href: '#medical-clinics',
      iconLabel: 'M',
      label: 'Medical Clinics',
      meta: enabledProductKeys.has('medical-clinics')
        ? 'Producto activo'
        : 'No habilitado',
      state: enabledProductKeys.has('medical-clinics') ? 'Activo' : 'Disponible',
      status: enabledProductKeys.has('medical-clinics') ? 'active' : 'available',
    },
    {
      group: 'clinics',
      href: '#psychology-clinics',
      iconLabel: 'P',
      label: 'Psychology Clinics',
      meta: enabledProductKeys.has('psychology-clinics')
        ? 'Producto activo'
        : 'No habilitado',
      state: enabledProductKeys.has('psychology-clinics') ? 'Activo' : 'Backlog',
      status: enabledProductKeys.has('psychology-clinics') ? 'active' : 'locked',
    },
    {
      group: 'platform',
      href: '#ai-console',
      iconLabel: 'AI',
      label: 'AI Console',
      meta: 'Sugerencias y aprobaciones',
      state: canAccessTransversalAiConsole ? 'Operable' : 'Limitado',
      status: canAccessTransversalAiConsole ? 'active' : 'limited',
    },
    {
      group: 'platform',
      href: '#tenant-admin',
      iconLabel: 'T',
      label: 'Tenant admin',
      meta: canManageInvitations ? 'Invitaciones' : 'Solo lectura',
      state: canManageInvitations ? 'Operable' : 'Limitado',
      status: canManageInvitations ? 'active' : 'limited',
    },
  ];
}
