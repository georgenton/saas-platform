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
