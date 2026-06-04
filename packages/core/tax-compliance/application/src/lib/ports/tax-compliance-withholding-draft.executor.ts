export interface ExecuteTaxComplianceWithholdingDraftInput {
  tenantSlug: string;
  sourceInvoiceId: string;
  reason: string;
  amountInCents: number;
  taxRateId?: string | null;
  number?: string | null;
  issuedAt?: Date | null;
  notes?: string | null;
}

export interface ExecuteTaxComplianceWithholdingDraftResult {
  id: string;
  number: string;
  status: string;
  documentCode: string | null;
  sourceInvoiceId: string | null;
  sourceInvoiceNumber: string | null;
  amountInCents: number;
  currency: string;
}

export interface TaxComplianceWithholdingDraftExecutor {
  execute(
    input: ExecuteTaxComplianceWithholdingDraftInput,
  ): Promise<ExecuteTaxComplianceWithholdingDraftResult>;
}
