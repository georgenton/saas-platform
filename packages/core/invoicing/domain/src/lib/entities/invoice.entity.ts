import { BuyerIdentificationType } from './customer.entity';

export type InvoiceStatus =
  | 'draft'
  | 'issued'
  | 'partially_paid'
  | 'paid'
  | 'void';

export type InvoiceElectronicStatus =
  | 'pending_submission'
  | 'submitted'
  | 'authorized'
  | 'rejected';

export interface InvoiceProps {
  id: string;
  tenantId: string;
  customerId: string;
  number: string;
  documentCode?: string | null;
  establishmentCode?: string | null;
  emissionPointCode?: string | null;
  sequenceNumber?: number | null;
  modifiedDocumentId?: string | null;
  modifiedDocumentNumber?: string | null;
  modifiedDocumentIssuedAt?: Date | null;
  modificationReason?: string | null;
  buyerIdentificationType?: BuyerIdentificationType | null;
  buyerIdentification?: string | null;
  buyerName?: string | null;
  buyerAddress?: string | null;
  electronicStatus?: InvoiceElectronicStatus | null;
  accessKey?: string | null;
  authorizationNumber?: string | null;
  authorizedAt?: Date | null;
  electronicStatusMessage?: string | null;
  signedAt?: Date | null;
  submittedAt?: Date | null;
  submissionReference?: string | null;
  status: InvoiceStatus;
  currency: string;
  issuedAt: Date;
  dueAt: Date | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class Invoice {
  private constructor(private readonly props: InvoiceProps) {}

  static create(props: InvoiceProps): Invoice {
    return new Invoice(props);
  }

  get id(): string {
    return this.props.id;
  }

  get tenantId(): string {
    return this.props.tenantId;
  }

  get customerId(): string {
    return this.props.customerId;
  }

  get number(): string {
    return this.props.number;
  }

  get documentCode(): string | null {
    return this.props.documentCode ?? null;
  }

  get establishmentCode(): string | null {
    return this.props.establishmentCode ?? null;
  }

  get emissionPointCode(): string | null {
    return this.props.emissionPointCode ?? null;
  }

  get sequenceNumber(): number | null {
    return this.props.sequenceNumber ?? null;
  }

  get modifiedDocumentId(): string | null {
    return this.props.modifiedDocumentId ?? null;
  }

  get modifiedDocumentNumber(): string | null {
    return this.props.modifiedDocumentNumber ?? null;
  }

  get modifiedDocumentIssuedAt(): Date | null {
    return this.props.modifiedDocumentIssuedAt ?? null;
  }

  get modificationReason(): string | null {
    return this.props.modificationReason ?? null;
  }

  get buyerIdentificationType(): BuyerIdentificationType | null {
    return this.props.buyerIdentificationType ?? null;
  }

  get buyerIdentification(): string | null {
    return this.props.buyerIdentification ?? null;
  }

  get buyerName(): string | null {
    return this.props.buyerName ?? null;
  }

  get buyerAddress(): string | null {
    return this.props.buyerAddress ?? null;
  }

  get electronicStatus(): InvoiceElectronicStatus | null {
    return this.props.electronicStatus ?? null;
  }

  get accessKey(): string | null {
    return this.props.accessKey ?? null;
  }

  get authorizationNumber(): string | null {
    return this.props.authorizationNumber ?? null;
  }

  get authorizedAt(): Date | null {
    return this.props.authorizedAt ?? null;
  }

  get electronicStatusMessage(): string | null {
    return this.props.electronicStatusMessage ?? null;
  }

  get signedAt(): Date | null {
    return this.props.signedAt ?? null;
  }

  get submittedAt(): Date | null {
    return this.props.submittedAt ?? null;
  }

  get submissionReference(): string | null {
    return this.props.submissionReference ?? null;
  }

  get status(): InvoiceStatus {
    return this.props.status;
  }

  get currency(): string {
    return this.props.currency;
  }

  get issuedAt(): Date {
    return this.props.issuedAt;
  }

  get dueAt(): Date | null {
    return this.props.dueAt;
  }

  get notes(): string | null {
    return this.props.notes;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  canTransitionTo(nextStatus: InvoiceStatus): boolean {
    if (this.status === nextStatus) {
      return true;
    }

    switch (this.status) {
      case 'draft':
        return nextStatus === 'issued' || nextStatus === 'void';
      case 'issued':
        return (
          nextStatus === 'partially_paid' ||
          nextStatus === 'paid' ||
          nextStatus === 'void'
        );
      case 'partially_paid':
        return nextStatus === 'paid' || nextStatus === 'void';
      case 'paid':
        return false;
      case 'void':
        return false;
      default:
        return false;
    }
  }

  transitionTo(nextStatus: InvoiceStatus, at: Date): Invoice {
    return Invoice.create({
      ...this.props,
      status: nextStatus,
      updatedAt: at,
    });
  }

  updateElectronicStatus(
    input: {
      electronicStatus: InvoiceElectronicStatus | null;
      accessKey: string | null;
      authorizationNumber: string | null;
      authorizedAt: Date | null;
      electronicStatusMessage: string | null;
      signedAt: Date | null;
      submittedAt: Date | null;
      submissionReference: string | null;
    },
    at: Date,
  ): Invoice {
    return Invoice.create({
      ...this.props,
      electronicStatus: input.electronicStatus,
      accessKey: input.accessKey,
      authorizationNumber: input.authorizationNumber,
      authorizedAt: input.authorizedAt,
      electronicStatusMessage: input.electronicStatusMessage,
      signedAt: input.signedAt,
      submittedAt: input.submittedAt,
      submissionReference: input.submissionReference,
      updatedAt: at,
    });
  }

  toPrimitives(): InvoiceProps {
    return { ...this.props };
  }
}
