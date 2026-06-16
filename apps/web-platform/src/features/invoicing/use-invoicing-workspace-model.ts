import { useMemo } from 'react';
import {
  createInvoicingWorkspaceFoundationModel,
} from './adapters';
import type {
  CustomerResponse,
  ElectronicSubmissionSettingsResponse,
  InvoiceNumberingSettingsResponse,
  InvoiceSummaryResponse,
  IssuerProfileResponse,
} from '../../app/types';
import type { InvoicingWorkspaceFoundationModel } from './model';

type UseInvoicingWorkspaceModelInput = {
  customers: CustomerResponse[];
  electronicSubmissionSettings: ElectronicSubmissionSettingsResponse | null;
  formatMoney: (valueInCents: number, currency: string) => string;
  humanizeKey: (value: string | null) => string;
  invoiceNumberingSettings: InvoiceNumberingSettingsResponse | null;
  invoices: InvoiceSummaryResponse[];
  issuerProfile: IssuerProfileResponse | null;
};

export function useInvoicingWorkspaceModel(
  input: UseInvoicingWorkspaceModelInput,
): InvoicingWorkspaceFoundationModel {
  return useMemo(
    () => createInvoicingWorkspaceFoundationModel(input),
    [input],
  );
}
