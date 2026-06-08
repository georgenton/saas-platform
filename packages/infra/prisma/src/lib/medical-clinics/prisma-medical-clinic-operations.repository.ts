import { Injectable } from '@nestjs/common';
import { MedicalClinicOperationsRepository } from '@saas-platform/medical-clinics-application';
import {
  MedicalClinicProfileSnapshot,
  TenantMedicalClinicAppointmentRecord,
  TenantMedicalClinicOperationalEventRecord,
  TenantMedicalClinicPatientRecord,
} from '@saas-platform/medical-clinics-domain';
import { PrismaService } from '../prisma.service';

type ProfileRow = {
  readinessStatus: string;
  clinicProfileJson: string;
  careLocationsJson: string;
  professionalsJson: string;
  serviceCatalogJson: string;
  blockersJson: string;
  guardrailsJson: string;
};

type PatientRow = {
  id: string;
  tenantSlug: string;
  patientDisplayName: string;
  identificationStatus: string;
  contactStatus: string;
  consentStatus: string;
  messagingOptInStatus: string;
  triageReason: string;
  contactJson: string;
  representativeJson: string;
  blockersJson: string;
  createdAt: Date;
  updatedAt: Date;
};

type AppointmentRow = {
  id: string;
  tenantSlug: string;
  patientId: string;
  patient?: { patientDisplayName: string };
  serviceName: string;
  professionalId: string;
  professionalName: string;
  startsAt: Date;
  status: string;
  reminderStatus: string;
  billingStatus: string;
  amountInCents: number | null;
  currency: string | null;
  blockersJson: string;
  createdAt: Date;
  updatedAt: Date;
};

type EventRow = {
  id: string;
  tenantSlug: string;
  appointmentId: string | null;
  eventType: string;
  source: string;
  status: string;
  payloadJson: string;
  occurredAt: Date;
  createdAt: Date;
};

@Injectable()
export class PrismaMedicalClinicOperationsRepository
  implements MedicalClinicOperationsRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async getTenantIdBySlug(tenantSlug: string): Promise<string | null> {
    const tenant = await (this.prisma as any).tenant.findUnique({
      where: { slug: tenantSlug },
      select: { id: true },
    });

    return tenant?.id ?? null;
  }

  async getProfile(
    tenantSlug: string,
  ): Promise<MedicalClinicProfileSnapshot | null> {
    const record = await this.profileDelegate.findFirst({
      where: { tenantSlug },
    });

    return record ? this.toProfile(record as ProfileRow) : null;
  }

  async upsertProfile(
    command: Parameters<MedicalClinicOperationsRepository['upsertProfile']>[0],
  ): Promise<MedicalClinicProfileSnapshot> {
    const record = await this.profileDelegate.upsert({
      where: { tenantId: command.tenantId },
      update: this.profileData(command.snapshot, command.tenantSlug),
      create: {
        id: command.id,
        tenantId: command.tenantId,
        ...this.profileData(command.snapshot, command.tenantSlug),
      },
    });

    return this.toProfile(record as ProfileRow);
  }

  async listPatients(
    tenantSlug: string,
  ): Promise<TenantMedicalClinicPatientRecord[]> {
    const records = await this.patientDelegate.findMany({
      where: { tenantSlug },
      orderBy: [{ updatedAt: 'desc' }, { createdAt: 'desc' }],
    });

    return records.map((record: PatientRow) => this.toPatient(record));
  }

  async savePatient(
    command: Parameters<MedicalClinicOperationsRepository['savePatient']>[0],
  ): Promise<TenantMedicalClinicPatientRecord> {
    const record = await this.patientDelegate.create({
      data: {
        id: command.id,
        tenantId: command.tenantId,
        tenantSlug: command.tenantSlug,
        patientDisplayName: command.patientDisplayName,
        identificationStatus: command.identificationStatus,
        contactStatus: command.contactStatus,
        consentStatus: command.consentStatus,
        messagingOptInStatus: command.messagingOptInStatus,
        triageReason: command.triageReason,
        contactJson: JSON.stringify(command.contact),
        representativeJson: JSON.stringify(command.representative),
        blockersJson: JSON.stringify(command.blockers),
      },
    });

    return this.toPatient(record as PatientRow);
  }

  async listAppointments(
    tenantSlug: string,
  ): Promise<TenantMedicalClinicAppointmentRecord[]> {
    const records = await this.appointmentDelegate.findMany({
      where: { tenantSlug },
      include: { patient: { select: { patientDisplayName: true } } },
      orderBy: [{ startsAt: 'asc' }, { createdAt: 'asc' }],
    });

    return records.map((record: AppointmentRow) => this.toAppointment(record));
  }

  async saveAppointment(
    command: Parameters<
      MedicalClinicOperationsRepository['saveAppointment']
    >[0],
  ): Promise<TenantMedicalClinicAppointmentRecord> {
    const record = await this.appointmentDelegate.create({
      data: {
        id: command.id,
        tenantId: command.tenantId,
        tenantSlug: command.tenantSlug,
        patientId: command.patientId,
        serviceName: command.serviceName,
        professionalId: command.professionalId,
        professionalName: command.professionalName,
        startsAt: command.startsAt,
        status: command.status,
        reminderStatus: command.reminderStatus,
        billingStatus: command.billingStatus,
        amountInCents: command.amountInCents,
        currency: command.currency,
        blockersJson: JSON.stringify(command.blockers),
      },
      include: { patient: { select: { patientDisplayName: true } } },
    });

    return this.toAppointment(record as AppointmentRow);
  }

  async transitionAppointment(
    command: Parameters<
      MedicalClinicOperationsRepository['transitionAppointment']
    >[0],
  ): Promise<TenantMedicalClinicAppointmentRecord | null> {
    const existing = await this.appointmentDelegate.findFirst({
      where: { tenantSlug: command.tenantSlug, id: command.appointmentId },
    });

    if (!existing) {
      return null;
    }

    const record = await this.appointmentDelegate.update({
      where: { id: command.appointmentId },
      data: {
        status: command.status,
        ...(command.reminderStatus
          ? { reminderStatus: command.reminderStatus }
          : {}),
        ...(command.billingStatus
          ? { billingStatus: command.billingStatus }
          : {}),
        ...(command.blockers
          ? { blockersJson: JSON.stringify(command.blockers) }
          : {}),
      },
      include: { patient: { select: { patientDisplayName: true } } },
    });

    return this.toAppointment(record as AppointmentRow);
  }

  async recordEvent(
    command: Parameters<MedicalClinicOperationsRepository['recordEvent']>[0],
  ): Promise<TenantMedicalClinicOperationalEventRecord> {
    const record = await this.eventDelegate.create({
      data: {
        id: command.id,
        tenantId: command.tenantId,
        tenantSlug: command.tenantSlug,
        appointmentId: command.appointmentId,
        eventType: command.eventType,
        source: command.source,
        status: command.status,
        payloadJson: JSON.stringify(command.payload),
        occurredAt: command.occurredAt,
      },
    });

    return this.toEvent(record as EventRow);
  }

  async listEvents(
    tenantSlug: string,
  ): Promise<TenantMedicalClinicOperationalEventRecord[]> {
    const records = await this.eventDelegate.findMany({
      where: { tenantSlug },
      orderBy: [{ occurredAt: 'desc' }, { createdAt: 'desc' }],
    });

    return records.map((record: EventRow) => this.toEvent(record));
  }

  private profileData(
    snapshot: MedicalClinicProfileSnapshot,
    tenantSlug: string,
  ): Record<string, unknown> {
    return {
      tenantSlug,
      readinessStatus: snapshot.workspaceStatus,
      clinicProfileJson: JSON.stringify(snapshot.clinicProfile),
      careLocationsJson: JSON.stringify(snapshot.careLocations),
      professionalsJson: JSON.stringify(snapshot.professionals),
      serviceCatalogJson: JSON.stringify(snapshot.serviceCatalog),
      blockersJson: JSON.stringify(snapshot.blockers),
      guardrailsJson: JSON.stringify(snapshot.guardrails),
    };
  }

  private toProfile(record: ProfileRow): MedicalClinicProfileSnapshot {
    return {
      workspaceStatus:
        record.readinessStatus as MedicalClinicProfileSnapshot['workspaceStatus'],
      clinicProfile: JSON.parse(record.clinicProfileJson),
      careLocations: JSON.parse(record.careLocationsJson),
      professionals: JSON.parse(record.professionalsJson),
      serviceCatalog: JSON.parse(record.serviceCatalogJson),
      blockers: JSON.parse(record.blockersJson),
      guardrails: JSON.parse(record.guardrailsJson),
    };
  }

  private toPatient(record: PatientRow): TenantMedicalClinicPatientRecord {
    return {
      id: record.id,
      tenantSlug: record.tenantSlug,
      patientDisplayName: record.patientDisplayName,
      identificationStatus:
        record.identificationStatus as TenantMedicalClinicPatientRecord['identificationStatus'],
      contactStatus:
        record.contactStatus as TenantMedicalClinicPatientRecord['contactStatus'],
      consentStatus:
        record.consentStatus as TenantMedicalClinicPatientRecord['consentStatus'],
      messagingOptInStatus:
        record.messagingOptInStatus as TenantMedicalClinicPatientRecord['messagingOptInStatus'],
      triageReason: record.triageReason,
      contact: JSON.parse(record.contactJson),
      representative: JSON.parse(record.representativeJson),
      blockers: JSON.parse(record.blockersJson),
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }

  private toAppointment(
    record: AppointmentRow,
  ): TenantMedicalClinicAppointmentRecord {
    return {
      id: record.id,
      tenantSlug: record.tenantSlug,
      patientId: record.patientId,
      patientDisplayName: record.patient?.patientDisplayName ?? 'Paciente',
      serviceName: record.serviceName,
      professionalId: record.professionalId,
      professionalName: record.professionalName,
      startsAt: record.startsAt,
      status: record.status as TenantMedicalClinicAppointmentRecord['status'],
      reminderStatus:
        record.reminderStatus as TenantMedicalClinicAppointmentRecord['reminderStatus'],
      billingStatus:
        record.billingStatus as TenantMedicalClinicAppointmentRecord['billingStatus'],
      amountInCents: record.amountInCents,
      currency:
        record.currency as TenantMedicalClinicAppointmentRecord['currency'],
      blockers: JSON.parse(record.blockersJson),
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }

  private toEvent(record: EventRow): TenantMedicalClinicOperationalEventRecord {
    return {
      id: record.id,
      tenantSlug: record.tenantSlug,
      appointmentId: record.appointmentId,
      eventType: record.eventType,
      source: record.source,
      status:
        record.status as TenantMedicalClinicOperationalEventRecord['status'],
      payload: JSON.parse(record.payloadJson),
      occurredAt: record.occurredAt,
      createdAt: record.createdAt,
    };
  }

  private get profileDelegate(): any {
    return (this.prisma as any).medicalClinicProfile;
  }

  private get patientDelegate(): any {
    return (this.prisma as any).medicalClinicPatient;
  }

  private get appointmentDelegate(): any {
    return (this.prisma as any).medicalClinicAppointment;
  }

  private get eventDelegate(): any {
    return (this.prisma as any).medicalClinicOperationalEvent;
  }
}
