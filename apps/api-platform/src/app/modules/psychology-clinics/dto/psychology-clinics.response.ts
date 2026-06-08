import {
  PsychologyClinicProfileSnapshot,
  TenantPsychologyClinicFoundationCloseout,
  TenantPsychologyClinicPatientIntakeWorkspace,
  TenantPsychologyClinicPatientRecord,
  TenantPsychologyClinicProductAnchorView,
  TenantPsychologyClinicProfileWorkspace,
  TenantPsychologyClinicSessionNoteDraftPacket,
  TenantPsychologyClinicSessionRecord,
  TenantPsychologyClinicSessionSchedulingWorkspace,
} from '@saas-platform/psychology-clinics-domain';

export type PsychologyClinicProductAnchorResponseDto =
  TenantPsychologyClinicProductAnchorView;
export type PsychologyClinicProfileWorkspaceResponseDto =
  TenantPsychologyClinicProfileWorkspace;
export type PsychologyClinicPatientIntakeWorkspaceResponseDto =
  TenantPsychologyClinicPatientIntakeWorkspace;
export type PsychologyClinicPatientRecordResponseDto =
  TenantPsychologyClinicPatientRecord;
export type PsychologyClinicSessionSchedulingWorkspaceResponseDto =
  TenantPsychologyClinicSessionSchedulingWorkspace;
export type PsychologyClinicSessionRecordResponseDto =
  TenantPsychologyClinicSessionRecord;
export type PsychologyClinicSessionNoteDraftPacketResponseDto =
  TenantPsychologyClinicSessionNoteDraftPacket;
export type PsychologyClinicFoundationCloseoutResponseDto =
  TenantPsychologyClinicFoundationCloseout;

export interface UpsertPsychologyClinicProfileWorkspaceRequestDto {
  snapshot: Partial<PsychologyClinicProfileSnapshot>;
}

export interface RegisterPsychologyClinicPatientIntakeRequestDto {
  patientDisplayName: string;
  identificationStatus?: TenantPsychologyClinicPatientRecord['identificationStatus'];
  contactStatus?: TenantPsychologyClinicPatientRecord['contactStatus'];
  therapyConsentStatus?: TenantPsychologyClinicPatientRecord['therapyConsentStatus'];
  messagingOptInStatus?: TenantPsychologyClinicPatientRecord['messagingOptInStatus'];
  initialRiskReviewStatus?: TenantPsychologyClinicPatientRecord['initialRiskReviewStatus'];
  presentingConcern: string;
  contact?: Partial<TenantPsychologyClinicPatientRecord['contact']>;
  emergencyContact?: Partial<
    TenantPsychologyClinicPatientRecord['emergencyContact']
  >;
  blockers?: string[];
}

export interface CreatePsychologyClinicSessionRequestDto {
  patientId: string;
  serviceName: string;
  therapistId: string;
  therapistName: string;
  modality?: TenantPsychologyClinicSessionRecord['modality'];
  startsAt: string;
  blockers?: string[];
}

export interface TransitionPsychologyClinicSessionRequestDto {
  status: TenantPsychologyClinicSessionRecord['status'];
  blockers?: string[];
}

export const toPsychologyClinicProductAnchorResponseDto = (
  view: TenantPsychologyClinicProductAnchorView,
): PsychologyClinicProductAnchorResponseDto => view;

export const toPsychologyClinicProfileWorkspaceResponseDto = (
  view: TenantPsychologyClinicProfileWorkspace,
): PsychologyClinicProfileWorkspaceResponseDto => view;

export const toPsychologyClinicPatientIntakeWorkspaceResponseDto = (
  view: TenantPsychologyClinicPatientIntakeWorkspace,
): PsychologyClinicPatientIntakeWorkspaceResponseDto => view;

export const toPsychologyClinicPatientRecordResponseDto = (
  view: TenantPsychologyClinicPatientRecord,
): PsychologyClinicPatientRecordResponseDto => view;

export const toPsychologyClinicSessionSchedulingWorkspaceResponseDto = (
  view: TenantPsychologyClinicSessionSchedulingWorkspace,
): PsychologyClinicSessionSchedulingWorkspaceResponseDto => view;

export const toPsychologyClinicSessionRecordResponseDto = (
  view: TenantPsychologyClinicSessionRecord,
): PsychologyClinicSessionRecordResponseDto => view;

export const toPsychologyClinicSessionNoteDraftPacketResponseDto = (
  view: TenantPsychologyClinicSessionNoteDraftPacket,
): PsychologyClinicSessionNoteDraftPacketResponseDto => view;

export const toPsychologyClinicFoundationCloseoutResponseDto = (
  view: TenantPsychologyClinicFoundationCloseout,
): PsychologyClinicFoundationCloseoutResponseDto => view;
