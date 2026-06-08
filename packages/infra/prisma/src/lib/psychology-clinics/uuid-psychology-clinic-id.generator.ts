import { randomUUID } from 'node:crypto';
import { PsychologyClinicIdGenerator } from '@saas-platform/psychology-clinics-application';

export class UuidPsychologyClinicIdGenerator
  implements PsychologyClinicIdGenerator
{
  generate(): string {
    return randomUUID();
  }
}
