export type CommandCenterAccessState =
  | 'enabled'
  | 'permission_limited'
  | 'blocked_by_plan'
  | 'available'
  | 'disabled';

export type CommandCenterReadinessTone = 'success' | 'warning' | 'neutral';

export type CommandCenterDomainKey = 'finance' | 'commerce' | 'ai' | 'clinics';

export type CommandCenterProductDefinition = {
  key: string;
  aliases: string[];
  name: string;
  domain: CommandCenterDomainKey;
  purpose: string;
  href: string;
  requiredPermission?: string;
  requiresPlan?: string;
  addonPrice?: string;
  includes: string[];
};

export type CommandCenterProduct = CommandCenterProductDefinition & {
  accessState: CommandCenterAccessState;
  readiness: Array<{
    label: string;
    value: string;
    tone: CommandCenterReadinessTone;
  }>;
  evidence: {
    label: string;
    source: string;
    when: string;
  } | null;
  blocker: string | null;
  primaryAction: string;
  secondaryAction: string | null;
};

export type CommandCenterDomain = {
  key: CommandCenterDomainKey;
  name: string;
  summary: string;
};

export const COMMAND_CENTER_DOMAINS: CommandCenterDomain[] = [
  {
    key: 'finance',
    name: 'Finanzas y Cumplimiento',
    summary: 'Facturacion, impuestos y cierre contable.',
  },
  {
    key: 'commerce',
    name: 'Crecimiento y Comercio',
    summary: 'Conversaciones, tienda y post-venta.',
  },
  {
    key: 'ai',
    name: 'IA y Automatización',
    summary: 'Sugerencias, aprobaciones y ejecución protegida.',
  },
  {
    key: 'clinics',
    name: 'Clínicas',
    summary: 'Operaciones clínicas separadas por dominio.',
  },
];

export const COMMAND_CENTER_PRODUCTS: CommandCenterProductDefinition[] = [
  {
    key: 'invoicing',
    aliases: ['invoicing'],
    name: 'Electronic Invoicing EC',
    domain: 'finance',
    purpose: 'Emision electronica SRI: facturas, notas, guias y retenciones.',
    href: '#invoicing-domain',
    includes: ['Perfil emisor SRI', 'Documentos electronicos', 'Pagos y reportes'],
  },
  {
    key: 'tax-compliance-ec',
    aliases: ['tax-compliance-ec', 'tax-compliance'],
    name: 'Tax Compliance EC',
    domain: 'finance',
    purpose: 'Prepara IVA, renta y retenciones con handoff al contador.',
    href: '#tax-compliance-ec',
    requiredPermission: 'tax.manage',
    includes: ['Periodos fiscales', 'Evidencia tributaria', 'Revision contable'],
  },
  {
    key: 'accounting',
    aliases: ['accounting', 'full-accounting'],
    name: 'Full Accounting',
    domain: 'finance',
    purpose: 'Libros formales, conciliacion y cierre con limite profesional.',
    href: '#accounting-domain',
    requiresPlan: 'scale',
    includes: ['Cierre mensual', 'Conciliacion bancaria', 'Handoff al contador'],
  },
  {
    key: 'growth',
    aliases: ['growth'],
    name: 'Growth',
    domain: 'commerce',
    purpose: 'WhatsApp, conversaciones, casos operativos y CRM ligero.',
    href: '#growth-console',
    requiredPermission: 'growth.conversations.read',
    includes: ['Conversaciones WhatsApp', 'Casos operativos', 'Monitoreo de proveedor'],
  },
  {
    key: 'ecommerce',
    aliases: ['ecommerce'],
    name: 'Ecommerce',
    domain: 'commerce',
    purpose: 'Catalogo, tienda, pedidos y operacion post-venta.',
    href: '#ecommerce-domain',
    includes: ['Tienda y catalogo', 'Pedidos', 'Handoff a facturacion'],
  },
  {
    key: 'ai-console',
    aliases: ['ai', 'ai-console'],
    name: 'AI Console',
    domain: 'ai',
    purpose: 'Sugerir, aprobar y ejecutar con guardas. Nunca actua sola.',
    href: '#ai-console',
    includes: ['Aprobaciones', 'Ejecucion protegida', 'Memoria y retrieval'],
  },
  {
    key: 'medical-clinics',
    aliases: ['medical', 'medical-clinics'],
    name: 'Medical Clinics',
    domain: 'clinics',
    purpose: 'Pacientes, citas y paquetes de encuentro clinico.',
    href: '#medical-clinics-domain',
    addonPrice: '$39 / mes',
    includes: ['Pacientes y citas', 'Expedientes', 'Paquetes de encuentro'],
  },
  {
    key: 'psychology-clinics',
    aliases: ['psychology', 'psychology-clinics'],
    name: 'Psychology Clinics',
    domain: 'clinics',
    purpose: 'Terapeutas, sesiones y notas con revision previa.',
    href: '#psychology-clinics-domain',
    addonPrice: '$29 / mes',
    includes: ['Sesiones', 'Notas revisables', 'Agenda terapeutica'],
  },
];

export const COMMAND_CENTER_ACCESS_LABELS: Record<
  CommandCenterAccessState,
  string
> = {
  enabled: 'Activo',
  permission_limited: 'Permiso limitado',
  blocked_by_plan: 'Requiere plan',
  available: 'Disponible',
  disabled: 'No habilitado',
};

export function productIsInSet(
  product: CommandCenterProductDefinition,
  productKeys: Set<string>,
): boolean {
  return product.aliases.some((alias) => productKeys.has(alias));
}

export function planSatisfiesRequirement(
  currentPlan: { id?: string | null; name?: string | null } | null,
  requiredPlan: string | undefined,
): boolean {
  if (!requiredPlan) {
    return true;
  }

  const normalizedPlan = `${currentPlan?.id ?? ''} ${currentPlan?.name ?? ''}`
    .toLowerCase()
    .trim();

  return normalizedPlan.includes(requiredPlan.toLowerCase());
}
