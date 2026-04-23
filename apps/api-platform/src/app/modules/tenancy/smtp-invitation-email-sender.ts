import { Logger } from '@nestjs/common';
import {
  InvitationEmailSender,
  SendInvitationEmailCommand,
} from '@saas-platform/tenancy-application';
import nodemailer, { Transporter } from 'nodemailer';

interface SmtpInvitationEmailSenderOptions {
  fromAddress?: string;
  smtpHost?: string;
  smtpPassword?: string;
  smtpPort?: string;
  smtpSecure?: string;
  smtpUser?: string;
  webBaseUrl?: string;
}

export class SmtpInvitationEmailSender implements InvitationEmailSender {
  private readonly logger = new Logger(SmtpInvitationEmailSender.name);
  private readonly transporter: Transporter | null;
  private readonly fromAddress: string | null;
  private readonly webBaseUrl: string;

  constructor(options: SmtpInvitationEmailSenderOptions) {
    this.fromAddress = options.fromAddress ?? null;
    this.webBaseUrl = (
      options.webBaseUrl ?? 'http://127.0.0.1:4200'
    ).replace(/\/$/, '');

    if (
      !this.fromAddress ||
      !options.smtpHost ||
      !options.smtpPort ||
      !options.smtpUser ||
      !options.smtpPassword
    ) {
      this.transporter = null;
      return;
    }

    this.transporter = nodemailer.createTransport({
      auth: {
        user: options.smtpUser,
        pass: options.smtpPassword,
      },
      host: options.smtpHost,
      port: Number(options.smtpPort),
      secure: options.smtpSecure === 'true',
    });
  }

  async sendInvitation(command: SendInvitationEmailCommand): Promise<void> {
    const invitationUrl = `${this.webBaseUrl}/?invitationId=${encodeURIComponent(
      command.invitationId,
    )}`;

    if (!this.transporter || !this.fromAddress) {
      this.logger.warn(
        `Invitation email delivery skipped for ${command.recipientEmail}. Configure INVITATION_EMAIL_FROM plus SMTP env vars to enable delivery. Invitation link: ${invitationUrl}`,
      );
      return;
    }

    const subject =
      command.reason === 'resent'
        ? `Recordatorio: invitacion a ${command.tenantName}`
        : `Invitacion a ${command.tenantName}`;

    try {
      await this.transporter.sendMail({
        from: this.fromAddress,
        to: command.recipientEmail,
        subject,
        text: [
          `Te invitaron al tenant ${command.tenantName} (${command.tenantSlug}).`,
          `Rol sugerido: ${command.roleKey}.`,
          `La invitacion expira el ${command.expiresAt.toISOString()}.`,
          '',
          `Revisa y acepta aqui: ${invitationUrl}`,
        ].join('\n'),
        html: `
          <div style="font-family: Arial, sans-serif; color: #1f1a14; line-height: 1.6;">
            <p>Te invitaron al tenant <strong>${command.tenantName}</strong> <span style="color:#6f6358;">(${command.tenantSlug})</span>.</p>
            <p>Rol sugerido: <strong>${command.roleKey}</strong>.</p>
            <p>La invitacion expira el <strong>${command.expiresAt.toISOString()}</strong>.</p>
            <p>
              <a
                href="${invitationUrl}"
                style="display:inline-block;padding:12px 18px;border-radius:999px;background:#1c5ea5;color:#ffffff;text-decoration:none;font-weight:700;"
              >
                Revisar invitacion
              </a>
            </p>
            <p style="color:#6f6358;font-size:14px;">Si el boton no funciona, abre este enlace: ${invitationUrl}</p>
          </div>
        `,
      });
    } catch (error) {
      this.logger.error(
        `Invitation email delivery failed for ${command.recipientEmail}: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      );
    }
  }
}
