import { Module } from '@nestjs/common';
import {
  MEDICAL_CLINIC_ID_GENERATOR,
  MEDICAL_CLINIC_OPERATIONS_REPOSITORY,
} from '@saas-platform/medical-clinics-application';
import { PrismaModule } from '../prisma.module';
import { PrismaMedicalClinicOperationsRepository } from './prisma-medical-clinic-operations.repository';
import { UuidMedicalClinicIdGenerator } from './uuid-medical-clinic-id.generator';

@Module({
  imports: [PrismaModule],
  providers: [
    PrismaMedicalClinicOperationsRepository,
    UuidMedicalClinicIdGenerator,
    {
      provide: MEDICAL_CLINIC_OPERATIONS_REPOSITORY,
      useExisting: PrismaMedicalClinicOperationsRepository,
    },
    {
      provide: MEDICAL_CLINIC_ID_GENERATOR,
      useExisting: UuidMedicalClinicIdGenerator,
    },
  ],
  exports: [MEDICAL_CLINIC_OPERATIONS_REPOSITORY, MEDICAL_CLINIC_ID_GENERATOR],
})
export class MedicalClinicsPersistenceModule {}
