import { Module } from '@nestjs/common';
import {
  TAX_COMPLIANCE_ACCOUNTANT_REVIEW_ID_GENERATOR,
  TAX_COMPLIANCE_ACCOUNTANT_REVIEW_REPOSITORY,
  TAX_COMPLIANCE_ECOMMERCE_EVIDENCE_REPOSITORY,
  TAX_COMPLIANCE_EVENT_ID_GENERATOR,
  TAX_COMPLIANCE_EVENT_REPOSITORY,
} from '@saas-platform/tax-compliance-application';
import { PrismaModule } from '../prisma.module';
import { PrismaTaxComplianceAccountantReviewRepository } from './prisma-tax-compliance-accountant-review.repository';
import { PrismaTaxComplianceEcommerceEvidenceRepository } from './prisma-tax-compliance-ecommerce-evidence.repository';
import { PrismaTaxComplianceEventRepository } from './prisma-tax-compliance-event.repository';
import { UuidTaxComplianceAccountantReviewIdGenerator } from './uuid-tax-compliance-accountant-review-id.generator';
import { UuidTaxComplianceEventIdGenerator } from './uuid-tax-compliance-event-id.generator';

@Module({
  imports: [PrismaModule],
  providers: [
    PrismaTaxComplianceAccountantReviewRepository,
    PrismaTaxComplianceEcommerceEvidenceRepository,
    PrismaTaxComplianceEventRepository,
    UuidTaxComplianceAccountantReviewIdGenerator,
    UuidTaxComplianceEventIdGenerator,
    {
      provide: TAX_COMPLIANCE_ACCOUNTANT_REVIEW_REPOSITORY,
      useExisting: PrismaTaxComplianceAccountantReviewRepository,
    },
    {
      provide: TAX_COMPLIANCE_ECOMMERCE_EVIDENCE_REPOSITORY,
      useExisting: PrismaTaxComplianceEcommerceEvidenceRepository,
    },
    {
      provide: TAX_COMPLIANCE_EVENT_REPOSITORY,
      useExisting: PrismaTaxComplianceEventRepository,
    },
    {
      provide: TAX_COMPLIANCE_ACCOUNTANT_REVIEW_ID_GENERATOR,
      useExisting: UuidTaxComplianceAccountantReviewIdGenerator,
    },
    {
      provide: TAX_COMPLIANCE_EVENT_ID_GENERATOR,
      useExisting: UuidTaxComplianceEventIdGenerator,
    },
  ],
  exports: [
    TAX_COMPLIANCE_ACCOUNTANT_REVIEW_REPOSITORY,
    TAX_COMPLIANCE_ECOMMERCE_EVIDENCE_REPOSITORY,
    TAX_COMPLIANCE_EVENT_REPOSITORY,
    TAX_COMPLIANCE_ACCOUNTANT_REVIEW_ID_GENERATOR,
    TAX_COMPLIANCE_EVENT_ID_GENERATOR,
  ],
})
export class TaxCompliancePersistenceModule {}
