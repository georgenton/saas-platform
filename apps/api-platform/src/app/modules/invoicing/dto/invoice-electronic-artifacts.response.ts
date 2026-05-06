import { InvoiceElectronicDocumentArtifactsView } from '@saas-platform/invoicing-application';

export interface InvoiceElectronicArtifactsResponseDto {
  fileBaseName: string;
  rideHtmlFileName: string;
  xmlFileName: string;
  accessKey: string | null;
  electronicStatus: string | null;
  canDownloadRide: boolean;
  canDownloadXml: boolean;
}

export const toInvoiceElectronicArtifactsResponseDto = (
  view: InvoiceElectronicDocumentArtifactsView,
): InvoiceElectronicArtifactsResponseDto => ({
  fileBaseName: view.fileBaseName,
  rideHtmlFileName: view.rideHtmlFileName,
  xmlFileName: view.xmlFileName,
  accessKey: view.accessKey,
  electronicStatus: view.electronicStatus,
  canDownloadRide: view.canDownloadRide,
  canDownloadXml: view.canDownloadXml,
});
