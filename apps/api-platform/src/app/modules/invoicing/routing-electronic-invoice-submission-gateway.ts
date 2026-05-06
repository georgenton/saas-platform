import { Injectable } from '@nestjs/common';
import {
  CheckElectronicInvoiceAuthorizationInput,
  ElectronicInvoiceAuthorizationResult,
  ElectronicInvoiceSubmissionGateway,
  ElectronicInvoiceSubmissionResult,
  SubmitElectronicInvoiceInput,
} from '@saas-platform/invoicing-application';
import { StubSriOfflineWsSubmissionGateway } from './stub-sri-offline-ws-submission-gateway';
import { StubSriSubmissionGateway } from './stub-sri-submission-gateway';

@Injectable()
export class RoutingElectronicInvoiceSubmissionGateway
  implements ElectronicInvoiceSubmissionGateway
{
  constructor(
    private readonly stubSriSubmissionGateway: StubSriSubmissionGateway,
    private readonly stubSriOfflineWsSubmissionGateway: StubSriOfflineWsSubmissionGateway,
  ) {}

  async submit(
    input: SubmitElectronicInvoiceInput,
  ): Promise<ElectronicInvoiceSubmissionResult> {
    switch (input.submissionSettings.provider) {
      case 'sri_offline_ws':
        return this.stubSriOfflineWsSubmissionGateway.submit(input);
      case 'stub_sri':
      default:
        return this.stubSriSubmissionGateway.submit(input);
    }
  }

  async checkAuthorization(
    input: CheckElectronicInvoiceAuthorizationInput,
  ): Promise<ElectronicInvoiceAuthorizationResult> {
    switch (input.submissionSettings.provider) {
      case 'sri_offline_ws':
        return this.stubSriOfflineWsSubmissionGateway.checkAuthorization(input);
      case 'stub_sri':
      default:
        return this.stubSriSubmissionGateway.checkAuthorization(input);
    }
  }
}
