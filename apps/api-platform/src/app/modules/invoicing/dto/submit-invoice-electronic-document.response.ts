export interface SubmitInvoiceElectronicDocumentResponseDto {
  submitted: true;
  electronicStatus: string | null;
  accessKey: string | null;
  submittedAt: string | null;
  submissionReference: string | null;
}

export const toSubmitInvoiceElectronicDocumentResponseDto = (input: {
  accessKey: string | null;
  electronicStatus: string | null;
  submissionReference: string | null;
  submittedAt: Date | null;
}): SubmitInvoiceElectronicDocumentResponseDto => ({
  submitted: true,
  electronicStatus: input.electronicStatus,
  accessKey: input.accessKey,
  submittedAt: input.submittedAt?.toISOString() ?? null,
  submissionReference: input.submissionReference,
});
