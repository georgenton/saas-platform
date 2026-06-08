import { Module } from '@nestjs/common';
import {
  PSYCHOLOGY_CLINIC_ID_GENERATOR,
  PSYCHOLOGY_CLINIC_OPERATIONS_REPOSITORY,
} from '@saas-platform/psychology-clinics-application';
import { PrismaModule } from '../prisma.module';
import { PrismaPsychologyClinicOperationsRepository } from './prisma-psychology-clinic-operations.repository';
import { UuidPsychologyClinicIdGenerator } from './uuid-psychology-clinic-id.generator';

@Module({
  imports: [PrismaModule],
  providers: [
    PrismaPsychologyClinicOperationsRepository,
    UuidPsychologyClinicIdGenerator,
    {
      provide: PSYCHOLOGY_CLINIC_OPERATIONS_REPOSITORY,
      useExisting: PrismaPsychologyClinicOperationsRepository,
    },
    {
      provide: PSYCHOLOGY_CLINIC_ID_GENERATOR,
      useExisting: UuidPsychologyClinicIdGenerator,
    },
  ],
  exports: [
    PSYCHOLOGY_CLINIC_OPERATIONS_REPOSITORY,
    PSYCHOLOGY_CLINIC_ID_GENERATOR,
  ],
})
export class PsychologyClinicsPersistenceModule {}
