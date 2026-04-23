export interface SendInvitationEmailCommand {
  invitationId: string;
  recipientEmail: string;
  tenantName: string;
  tenantSlug: string;
  roleKey: string;
  expiresAt: Date;
  reason: 'created' | 'resent';
}

export interface InvitationEmailSender {
  sendInvitation(command: SendInvitationEmailCommand): Promise<void>;
}
