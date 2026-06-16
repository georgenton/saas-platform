import type { PlatformMoodKey } from '../../shared/layout/platform-shell.model';

export type AccessPhase =
  | 'gateway'
  | 'checking'
  | 'backend-unavailable'
  | 'invalid-token'
  | 'invitation'
  | 'workspace-select'
  | 'no-tenant'
  | 'ready';

export type AccessInvitationModel = {
  canAccept: boolean;
  email: string;
  expiresAtLabel: string;
  invitationId: string;
  invitedByLabel: string;
  roleLabel: string;
  statusLabel: string;
  tenantName: string;
};

export type AccessWorkspaceOption = {
  permissionCount: number;
  roleLabel: string;
  slug: string;
  title: string;
};

export type AccessGatewayModel = {
  advancedOpen: boolean;
  capabilities: string[];
  currentUserEmail: string | null;
  hasStoredToken: boolean;
  invitation: AccessInvitationModel | null;
  mood: PlatformMoodKey;
  phase: AccessPhase;
  sessionError: string | null;
  tokenInput: string;
  workspaceOptions: AccessWorkspaceOption[];
};
