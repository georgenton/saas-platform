import { CreateTenantWithholdingUseCase } from '@saas-platform/invoicing-application';
import {
  ExecuteTaxComplianceWithholdingDraftInput,
  ExecuteTaxComplianceWithholdingDraftResult,
  TaxComplianceWithholdingDraftExecutor,
} from '@saas-platform/tax-compliance-application';

export class InvoicingWithholdingDraftExecutor
  implements TaxComplianceWithholdingDraftExecutor
{
  constructor(
    private readonly createTenantWithholdingUseCase: CreateTenantWithholdingUseCase,
  ) {}

  async execute(
    input: ExecuteTaxComplianceWithholdingDraftInput,
  ): Promise<ExecuteTaxComplianceWithholdingDraftResult> {
    const result = await this.createTenantWithholdingUseCase.execute({
      tenantSlug: input.tenantSlug,
      sourceInvoiceId: input.sourceInvoiceId,
      reason: input.reason,
      amountInCents: input.amountInCents,
      taxRateId: input.taxRateId,
      number: input.number ?? undefined,
      issuedAt: input.issuedAt ?? undefined,
      notes: input.notes,
    });
    const withholding = result.withholding.toPrimitives();
    const sourceInvoice = result.sourceInvoice.toPrimitives();
    const initialItem = result.initialItem.toPrimitives();

    return {
      id: withholding.id,
      number: withholding.number,
      status: withholding.status,
      documentCode: withholding.documentCode ?? null,
      sourceInvoiceId: withholding.modifiedDocumentId ?? sourceInvoice.id,
      sourceInvoiceNumber:
        withholding.modifiedDocumentNumber ?? sourceInvoice.number,
      amountInCents: initialItem.lineTotalInCents,
      currency: withholding.currency,
    };
  }
}
