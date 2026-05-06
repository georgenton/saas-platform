export type InvoiceElectronicEventType =
  | 'submission'
  | 'authorization_check';

export interface InvoiceElectronicEventProps {
  id: string;
  tenantId: string;
  invoiceId: string;
  eventType: InvoiceElectronicEventType;
  provider: string;
  providerStatus: string;
  endpoint: string | null;
  soapAction: string | null;
  message: string;
  requestPayload: string | null;
  responsePayload: string | null;
  submissionReference: string | null;
  authorizationNumber: string | null;
  occurredAt: Date;
}

export class InvoiceElectronicEvent {
  private constructor(
    private readonly props: InvoiceElectronicEventProps,
  ) {}

  static create(
    props: InvoiceElectronicEventProps,
  ): InvoiceElectronicEvent {
    return new InvoiceElectronicEvent(props);
  }

  get id(): string {
    return this.props.id;
  }

  get tenantId(): string {
    return this.props.tenantId;
  }

  get invoiceId(): string {
    return this.props.invoiceId;
  }

  get eventType(): InvoiceElectronicEventType {
    return this.props.eventType;
  }

  get provider(): string {
    return this.props.provider;
  }

  get providerStatus(): string {
    return this.props.providerStatus;
  }

  get endpoint(): string | null {
    return this.props.endpoint;
  }

  get soapAction(): string | null {
    return this.props.soapAction;
  }

  get message(): string {
    return this.props.message;
  }

  get requestPayload(): string | null {
    return this.props.requestPayload;
  }

  get responsePayload(): string | null {
    return this.props.responsePayload;
  }

  get submissionReference(): string | null {
    return this.props.submissionReference;
  }

  get authorizationNumber(): string | null {
    return this.props.authorizationNumber;
  }

  get occurredAt(): Date {
    return this.props.occurredAt;
  }

  toPrimitives(): InvoiceElectronicEventProps {
    return { ...this.props };
  }
}
