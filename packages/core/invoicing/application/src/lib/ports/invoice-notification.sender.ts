export interface SendInvoiceNotificationCommand {
  recipientEmail: string;
  subject: string;
  text: string;
  html: string;
}

export interface InvoiceNotificationSender {
  sendInvoiceEmail(command: SendInvoiceNotificationCommand): Promise<void>;
}
