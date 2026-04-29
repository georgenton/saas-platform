export interface AuthenticatedInvitationResponse {
  invitation: {
    id: string;
    email: string;
    roleKey: string;
    status: string;
    invitedByUserId: string;
    acceptedByUserId: string | null;
    expiresAt: string;
    acceptedAt: string | null;
    createdAt: string;
    updatedAt: string;
  };
  tenant: {
    id: string;
    name: string;
    slug: string;
    status: string;
  };
  canAccept: boolean;
}

export interface InvitationResponse {
  id: string;
  tenantId: string;
  email: string;
  roleKey: string;
  status: string;
  invitedByUserId: string;
  acceptedByUserId: string | null;
  expiresAt: string;
  acceptedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SessionTenancy {
  tenant: {
    id: string;
    name: string;
    slug: string;
    status: string;
  };
  membership: {
    id: string;
    status: string;
    invitedBy: string | null;
    createdAt: string;
    updatedAt: string;
  };
  roleKeys: string[];
  permissionKeys: string[];
  subscription?: {
    id: string;
    tenantId: string;
    planId: string;
    status: string;
    startedAt: string;
    expiresAt: string | null;
    trialEndsAt: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
  entitlements?: SessionEntitlement[];
}

export interface SessionEntitlement {
  id: string;
  tenantId: string;
  key: string;
  value: unknown;
  source: string;
  createdAt: string;
  updatedAt: string;
}

export interface SessionPendingInvitation {
  invitation: {
    id: string;
    email: string;
    roleKey: string;
    status: string;
    invitedByUserId: string;
    acceptedByUserId: string | null;
    expiresAt: string;
    acceptedAt: string | null;
    createdAt: string;
    updatedAt: string;
  };
  tenant: {
    id: string;
    name: string;
    slug: string;
    status: string;
  };
}

export interface AuthenticatedSessionResponse {
  id: string;
  email: string | null;
  provider: string | null;
  externalAuthId: string | null;
  currentTenancy: SessionTenancy | null;
  pendingInvitations: SessionPendingInvitation[];
  sessionState: {
    canSelectTenancy: boolean;
    hasPendingInvitations: boolean;
    hasTenancies: boolean;
    recommendedFlow:
      | 'workspace'
      | 'select-tenancy'
      | 'accept-invitation'
      | 'empty';
  };
  tenancies: SessionTenancy[];
}

export interface PlatformPlan {
  id: string;
  key: string;
  name: string;
  description: string | null;
  priceInCents: number;
  currency: string;
  billingCycle: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PlatformProduct {
  id: string;
  key: string;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerResponse {
  id: string;
  tenantId: string;
  name: string;
  email: string | null;
  taxId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TaxRateResponse {
  id: string;
  tenantId: string;
  name: string;
  percentage: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceTotals {
  subtotalInCents: number;
  taxInCents: number;
  totalInCents: number;
}

export interface InvoiceSettlement {
  paidInCents: number;
  balanceDueInCents: number;
  isFullyPaid: boolean;
}

export interface PaymentResponse {
  id: string;
  tenantId: string;
  invoiceId: string;
  amountInCents: number;
  currency: string;
  method: string;
  reference: string | null;
  paidAt: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceItemResponse {
  id: string;
  tenantId: string;
  invoiceId: string;
  position: number;
  description: string;
  quantity: number;
  unitPriceInCents: number;
  lineTotalInCents: number;
  taxRateId: string | null;
  taxRateName: string | null;
  taxRatePercentage: number | null;
  lineTaxInCents: number;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceSummaryResponse {
  id: string;
  tenantId: string;
  customerId: string;
  number: string;
  status: string;
  currency: string;
  issuedAt: string;
  dueAt: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  itemCount: number;
  totals: InvoiceTotals;
  settlement: InvoiceSettlement;
}

export interface InvoiceDetailResponse {
  id: string;
  tenantId: string;
  customerId: string;
  number: string;
  status: string;
  currency: string;
  issuedAt: string;
  dueAt: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  items: InvoiceItemResponse[];
  payments: PaymentResponse[];
  totals: InvoiceTotals;
  settlement: InvoiceSettlement;
}

export interface InvoiceDocumentResponse {
  issuer: {
    tenantId: string;
    tenantName: string;
    tenantSlug: string;
  };
  customer: {
    name: string;
    email: string | null;
    taxId: string | null;
  };
  invoice: {
    id: string;
    tenantId: string;
    customerId: string;
    number: string;
    status: string;
    currency: string;
    issuedAt: string;
    dueAt: string | null;
    notes: string | null;
    createdAt: string;
    updatedAt: string;
  };
  lines: {
    id: string;
    position: number;
    description: string;
    quantity: number;
    unitPriceInCents: number;
    lineSubtotalInCents: number;
    taxRateId: string | null;
    taxRateName: string | null;
    taxRatePercentage: number | null;
    lineTaxInCents: number;
    lineTotalInCents: number;
  }[];
  totals: InvoiceTotals;
}

export interface InvoicingReportSummaryResponse {
  generatedAt: string;
  customerCount: number;
  invoiceCount: number;
  statusBreakdown: {
    status: string;
    count: number;
  }[];
  totalsByCurrency: {
    currency: string;
    subtotalInCents: number;
    taxInCents: number;
    totalInCents: number;
    paidInCents: number;
    outstandingTotalInCents: number;
  }[];
  monthlyTotals: {
    month: string;
    currency: string;
    invoiceCount: number;
    totalInCents: number;
    taxInCents: number;
  }[];
}
