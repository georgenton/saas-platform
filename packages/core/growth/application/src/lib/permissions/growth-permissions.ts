export const GROWTH_PERMISSION_CATALOG = {
  conversations: {
    read: 'growth.conversations.read',
    manage: 'growth.conversations.manage',
  },
  leads: {
    read: 'growth.leads.read',
    manage: 'growth.leads.manage',
  },
  opportunities: {
    read: 'growth.opportunities.read',
    manage: 'growth.opportunities.manage',
  },
} as const;

export const GROWTH_PERMISSIONS = {
  CONVERSATIONS_READ: GROWTH_PERMISSION_CATALOG.conversations.read,
  CONVERSATIONS_MANAGE: GROWTH_PERMISSION_CATALOG.conversations.manage,
  LEADS_READ: GROWTH_PERMISSION_CATALOG.leads.read,
  LEADS_MANAGE: GROWTH_PERMISSION_CATALOG.leads.manage,
  OPPORTUNITIES_READ: GROWTH_PERMISSION_CATALOG.opportunities.read,
  OPPORTUNITIES_MANAGE: GROWTH_PERMISSION_CATALOG.opportunities.manage,
} as const;
