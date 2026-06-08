import { randomUUID } from 'node:crypto';
import { MedicalClinicIdGenerator } from '@saas-platform/medical-clinics-application';

export class UuidMedicalClinicIdGenerator implements MedicalClinicIdGenerator {
  generate(): string {
    return randomUUID();
  }
}
