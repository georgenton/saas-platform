import { Injectable } from '@nestjs/common';
import { PsychologyClinicOperationsRepository } from '@saas-platform/psychology-clinics-application';
import {
  PsychologyClinicProfileSnapshot,
  TenantPsychologyClinicOperationalEventRecord,
  TenantPsychologyClinicPatientRecord,
  TenantPsychologyClinicSessionRecord,
} from '@saas-platform/psychology-clinics-domain';
import { PrismaService } from '../prisma.service';

type ProfileRow = {
  readinessStatus: string;
  clinicProfileJson: string;
  therapistsJson: string;
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
  therapyConsentStatus: string;
  messagingOptInStatus: string;
  initialRiskReviewStatus: string;
  presentingConcern: string;
  contactJson: string;
  emergencyContactJson: string;
  blockersJson: string;
  createdAt: Date;
  updatedAt: Date;
};

type SessionRow = {
  id: string;
  tenantSlug: string;
  patientId: string;
  patient?: { patientDisplayName: string };
  serviceName: string;
  therapistId: string;
  therapistName: string;
  modality: string;
  startsAt: Date;
  status: string;
  reminderStatus: string;
  billingStatus: string;
  blockersJson: string;
  createdAt: Date;
  updatedAt: Date;
};

type EventRow = {
  id: string;
  tenantSlug: string;
  sessionId: string | null;
  eventType: string;
  source: string;
  status: string;
  payloadJson: string;
  occurredAt: Date;
  createdAt: Date;
};

@Injectable()
export class PrismaPsychologyClinicOperationsRepository
  implements PsychologyClinicOperationsRepository
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
  ): Promise<PsychologyClinicProfileSnapshot | null> {
    const record = await this.profileDelegate.findFirst({
      where: { tenantSlug },
    });

    return record ? this.toProfile(record as ProfileRow) : null;
  }

  async upsertProfile(
    command: Parameters<
      PsychologyClinicOperationsRepository['upsertProfile']
    >[0],
  ): Promise<PsychologyClinicProfileSnapshot> {
    const data = this.profileData(command.snapshot, command.tenantSlug);
    const record = await this.profileDelegate.upsert({
      where: { tenantId: command.tenantId },
      update: data,
      create: {
        id: command.id,
        tenantId: command.tenantId,
        ...data,
      },
    });

    return this.toProfile(record as ProfileRow);
  }

  async listPatients(
    tenantSlug: string,
  ): Promise<TenantPsychologyClinicPatientRecord[]> {
    const records = await this.patientDelegate.findMany({
      where: { tenantSlug },
      orderBy: [{ updatedAt: 'desc' }, { createdAt: 'desc' }],
    });

    return records.map((record: PatientRow) => this.toPatient(record));
  }

  async savePatient(
    command: Parameters<PsychologyClinicOperationsRepository['savePatient']>[0],
  ): Promise<TenantPsychologyClinicPatientRecord> {
    const record = await this.patientDelegate.create({
      data: {
        id: command.id,
        tenantId: command.tenantId,
        tenantSlug: command.tenantSlug,
        patientDisplayName: command.patientDisplayName,
        identificationStatus: command.identificationStatus,
        contactStatus: command.contactStatus,
        therapyConsentStatus: command.therapyConsentStatus,
        messagingOptInStatus: command.messagingOptInStatus,
        initialRiskReviewStatus: command.initialRiskReviewStatus,
        presentingConcern: command.presentingConcern,
        contactJson: JSON.stringify(command.contact),
        emergencyContactJson: JSON.stringify(command.emergencyContact),
        blockersJson: JSON.stringify(command.blockers),
      },
    });

    return this.toPatient(record as PatientRow);
  }

  async listSessions(
    tenantSlug: string,
  ): Promise<TenantPsychologyClinicSessionRecord[]> {
    const records = await this.sessionDelegate.findMany({
      where: { tenantSlug },
      include: { patient: { select: { patientDisplayName: true } } },
      orderBy: [{ startsAt: 'asc' }, { createdAt: 'asc' }],
    });

    return records.map((record: SessionRow) => this.toSession(record));
  }

  async saveSession(
    command: Parameters<PsychologyClinicOperationsRepository['saveSession']>[0],
  ): Promise<TenantPsychologyClinicSessionRecord> {
    const record = await this.sessionDelegate.create({
      data: {
        id: command.id,
        tenantId: command.tenantId,
        tenantSlug: command.tenantSlug,
        patientId: command.patientId,
        serviceName: command.serviceName,
        therapistId: command.therapistId,
        therapistName: command.therapistName,
        modality: command.modality,
        startsAt: command.startsAt,
        status: command.status,
        reminderStatus: command.reminderStatus,
        billingStatus: command.billingStatus,
        blockersJson: JSON.stringify(command.blockers),
      },
      include: { patient: { select: { patientDisplayName: true } } },
    });

    return this.toSession(record as SessionRow);
  }

  async transitionSession(
    command: Parameters<
      PsychologyClinicOperationsRepository['transitionSession']
    >[0],
  ): Promise<TenantPsychologyClinicSessionRecord | null> {
    const existing = await this.sessionDelegate.findFirst({
      where: { tenantSlug: command.tenantSlug, id: command.sessionId },
    });

    if (!existing) {
      return null;
    }

    const record = await this.sessionDelegate.update({
      where: { id: command.sessionId },
      data: {
        status: command.status,
        ...(command.blockers
          ? { blockersJson: JSON.stringify(command.blockers) }
          : {}),
      },
      include: { patient: { select: { patientDisplayName: true } } },
    });

    return this.toSession(record as SessionRow);
  }

  async recordEvent(
    command: Parameters<PsychologyClinicOperationsRepository['recordEvent']>[0],
  ): Promise<TenantPsychologyClinicOperationalEventRecord> {
    const record = await this.eventDelegate.create({
      data: {
        id: command.id,
        tenantId: command.tenantId,
        tenantSlug: command.tenantSlug,
        sessionId: command.sessionId,
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
  ): Promise<TenantPsychologyClinicOperationalEventRecord[]> {
    const records = await this.eventDelegate.findMany({
      where: { tenantSlug },
      orderBy: [{ occurredAt: 'desc' }, { createdAt: 'desc' }],
    });

    return records.map((record: EventRow) => this.toEvent(record));
  }

  private profileData(
    snapshot: PsychologyClinicProfileSnapshot,
    tenantSlug: string,
  ): Record<string, unknown> {
    return {
      tenantSlug,
      readinessStatus: snapshot.workspaceStatus,
      clinicProfileJson: JSON.stringify(snapshot.clinicProfile),
      therapistsJson: JSON.stringify(snapshot.therapists),
      serviceCatalogJson: JSON.stringify(snapshot.serviceCatalog),
      blockersJson: JSON.stringify(snapshot.blockers),
      guardrailsJson: JSON.stringify(snapshot.guardrails),
    };
  }

  private toProfile(record: ProfileRow): PsychologyClinicProfileSnapshot {
    return {
      workspaceStatus:
        record.readinessStatus as PsychologyClinicProfileSnapshot['workspaceStatus'],
      clinicProfile: JSON.parse(record.clinicProfileJson),
      therapists: JSON.parse(record.therapistsJson),
      serviceCatalog: JSON.parse(record.serviceCatalogJson),
      blockers: JSON.parse(record.blockersJson),
      guardrails: JSON.parse(record.guardrailsJson),
    };
  }

  private toPatient(record: PatientRow): TenantPsychologyClinicPatientRecord {
    return {
      id: record.id,
      tenantSlug: record.tenantSlug,
      patientDisplayName: record.patientDisplayName,
      identificationStatus:
        record.identificationStatus as TenantPsychologyClinicPatientRecord['identificationStatus'],
      contactStatus:
        record.contactStatus as TenantPsychologyClinicPatientRecord['contactStatus'],
      therapyConsentStatus:
        record.therapyConsentStatus as TenantPsychologyClinicPatientRecord['therapyConsentStatus'],
      messagingOptInStatus:
        record.messagingOptInStatus as TenantPsychologyClinicPatientRecord['messagingOptInStatus'],
      initialRiskReviewStatus:
        record.initialRiskReviewStatus as TenantPsychologyClinicPatientRecord['initialRiskReviewStatus'],
      presentingConcern: record.presentingConcern,
      contact: JSON.parse(record.contactJson),
      emergencyContact: JSON.parse(record.emergencyContactJson),
      blockers: JSON.parse(record.blockersJson),
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }

  private toSession(record: SessionRow): TenantPsychologyClinicSessionRecord {
    return {
      id: record.id,
      tenantSlug: record.tenantSlug,
      patientId: record.patientId,
      patientDisplayName: record.patient?.patientDisplayName ?? 'Paciente',
      serviceName: record.serviceName,
      therapistId: record.therapistId,
      therapistName: record.therapistName,
      modality:
        record.modality as TenantPsychologyClinicSessionRecord['modality'],
      startsAt: record.startsAt,
      status: record.status as TenantPsychologyClinicSessionRecord['status'],
      reminderStatus:
        record.reminderStatus as TenantPsychologyClinicSessionRecord['reminderStatus'],
      billingStatus:
        record.billingStatus as TenantPsychologyClinicSessionRecord['billingStatus'],
      blockers: JSON.parse(record.blockersJson),
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }

  private toEvent(
    record: EventRow,
  ): TenantPsychologyClinicOperationalEventRecord {
    return {
      id: record.id,
      tenantSlug: record.tenantSlug,
      sessionId: record.sessionId,
      eventType: record.eventType,
      source: record.source,
      status:
        record.status as TenantPsychologyClinicOperationalEventRecord['status'],
      payload: JSON.parse(record.payloadJson),
      occurredAt: record.occurredAt,
      createdAt: record.createdAt,
    };
  }

  private get profileDelegate(): any {
    return (this.prisma as any).psychologyClinicProfile;
  }

  private get patientDelegate(): any {
    return (this.prisma as any).psychologyClinicPatient;
  }

  private get sessionDelegate(): any {
    return (this.prisma as any).psychologyClinicSession;
  }

  private get eventDelegate(): any {
    return (this.prisma as any).psychologyClinicOperationalEvent;
  }
}
