export type WhatsappMessageTemplateCategory =
  | 'utility'
  | 'marketing'
  | 'authentication';
export type WhatsappMessageTemplateProviderApprovalStatus =
  | 'draft'
  | 'pending_review'
  | 'approved'
  | 'rejected';

export interface WhatsappMessageTemplateProps {
  id: string;
  tenantId: string;
  key: string;
  name: string;
  languageCode: string;
  category: WhatsappMessageTemplateCategory;
  bodyTemplate: string;
  intentKey: string | null;
  providerTemplateName: string | null;
  providerApprovalStatus: WhatsappMessageTemplateProviderApprovalStatus;
  status: 'active' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

export class WhatsappMessageTemplate {
  private constructor(private readonly props: WhatsappMessageTemplateProps) {}

  static create(
    props: WhatsappMessageTemplateProps,
  ): WhatsappMessageTemplate {
    return new WhatsappMessageTemplate(props);
  }

  get id(): string {
    return this.props.id;
  }

  get tenantId(): string {
    return this.props.tenantId;
  }

  get key(): string {
    return this.props.key;
  }

  get bodyTemplate(): string {
    return this.props.bodyTemplate;
  }

  get intentKey(): string | null {
    return this.props.intentKey;
  }

  get languageCode(): string {
    return this.props.languageCode;
  }

  get providerTemplateName(): string | null {
    return this.props.providerTemplateName;
  }

  get providerApprovalStatus(): WhatsappMessageTemplateProviderApprovalStatus {
    return this.props.providerApprovalStatus;
  }

  get status(): 'active' | 'archived' {
    return this.props.status;
  }

  toPrimitives(): WhatsappMessageTemplateProps {
    return { ...this.props };
  }
}
