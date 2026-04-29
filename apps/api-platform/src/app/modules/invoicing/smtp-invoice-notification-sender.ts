import { Logger } from '@nestjs/common';
import {
  InvoiceNotificationSender,
  SendInvoiceNotificationCommand,
} from '@saas-platform/invoicing-application';
import nodemailer, { Transporter } from 'nodemailer';

interface SmtpInvoiceNotificationSenderOptions {
  fromAddress?: string;
  smtpHost?: string;
  smtpPassword?: string;
  smtpPort?: string;
  smtpSecure?: string;
  smtpUser?: string;
}

export class SmtpInvoiceNotificationSender
  implements InvoiceNotificationSender
{
  private readonly logger = new Logger(SmtpInvoiceNotificationSender.name);
  private readonly transporter: Transporter | null;
  private readonly fromAddress: string | null;

  constructor(options: SmtpInvoiceNotificationSenderOptions) {
    this.fromAddress = options.fromAddress ?? null;

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

  async sendInvoiceEmail(
    command: SendInvoiceNotificationCommand,
  ): Promise<void> {
    if (!this.transporter || !this.fromAddress) {
      this.logger.warn(
        `Invoice email delivery skipped for ${command.recipientEmail}. Configure INVOICING_EMAIL_FROM or INVITATION_EMAIL_FROM plus SMTP env vars to enable delivery.`,
      );
      return;
    }

    try {
      await this.transporter.sendMail({
        from: this.fromAddress,
        to: command.recipientEmail,
        subject: command.subject,
        text: command.text,
        html: command.html,
      });
    } catch (error) {
      this.logger.error(
        `Invoice email delivery failed for ${command.recipientEmail}: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      );
    }
  }
}
