import { useMemo } from 'react';
import {
  createInvoicingWorkspaceFoundationModel,
} from './adapters';
import type {
  CustomerResponse,
  ElectronicSandboxReadinessResponse,
  ElectronicSubmissionSettingsResponse,
  ElectronicSignatureMaterialInspectionResponse,
  InvoiceNumberingSettingsResponse,
  InvoiceSummaryResponse,
  IssuerProfileResponse,
} from '../../app/types';
import type { InvoicingWorkspaceFoundationModel } from './model';

type UseInvoicingWorkspaceModelInput = {
  customers: CustomerResponse[];
  electronicSandboxReadiness: ElectronicSandboxReadinessResponse | null;
  electronicSignatureMaterialInspection: ElectronicSignatureMaterialInspectionResponse | null;
  electronicSubmissionSettings: ElectronicSubmissionSettingsResponse | null;
  formatMoney: (valueInCents: number, currency: string) => string;
  humanizeKey: (value: string | null) => string;
  invoiceNumberingSettings: InvoiceNumberingSettingsResponse | null;
  invoices: InvoiceSummaryResponse[];
  issuerProfile: IssuerProfileResponse | null;
  selectedInvoice: InvoiceSummaryResponse | null;
};

export function useInvoicingWorkspaceModel(
  input: UseInvoicingWorkspaceModelInput,
): InvoicingWorkspaceFoundationModel {
  return useMemo(
    () => createInvoicingWorkspaceFoundationModel(input),
    [input],
  );
}
