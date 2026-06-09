import {
  TenantMedicalClinicAppointmentSchedulingWorkspace,
  TenantMedicalClinicAppointmentEncounterQueueV60,
  TenantMedicalClinicAppointmentRecord,
  TenantMedicalClinicBillingTaxBridge,
  TenantMedicalClinicCarePlanTaskWorkspace,
  TenantMedicalClinicClinicalBoundaryCloseout,
  TenantMedicalClinicClinicalEvidenceRegistry,
  TenantMedicalClinicClinicalNoteDraftPacket,
  TenantMedicalClinicCommandCenterV60,
  TenantMedicalClinicCrossProductHandoffCenterV60,
  TenantMedicalClinicEncounterCloseout,
  TenantMedicalClinicEncounterWorkspace,
  TenantMedicalClinicGrowthReminderBridge,
  TenantMedicalClinicMedicalHistoryDraftRecord,
  TenantMedicalClinicOrdersReferralReadinessPacket,
  TenantMedicalClinicPatientClinicalTimelineWorkspace,
  TenantMedicalClinicPatientIdentityConsentQueueV60,
  TenantMedicalClinicPatientIntakeWorkspace,
  TenantMedicalClinicPatientRecord,
  TenantMedicalClinicPrescriptionReadinessPacket,
  TenantMedicalClinicOperatingCloseoutV60,
  TenantMedicalClinicProductAnchorView,
  TenantMedicalClinicProductCloseout,
  TenantMedicalClinicProfileWorkspace,
  TenantMedicalClinicRecordsCloseout,
  TenantMedicalClinicTreatmentFollowUpReadiness,
} from '@saas-platform/medical-clinics-domain';

export type MedicalClinicProductAnchorResponseDto =
  TenantMedicalClinicProductAnchorView;
export type MedicalClinicProductCloseoutResponseDto =
  TenantMedicalClinicProductCloseout;
export type MedicalClinicCommandCenterV60ResponseDto =
  TenantMedicalClinicCommandCenterV60;
export type MedicalClinicPatientIdentityConsentQueueV60ResponseDto =
  TenantMedicalClinicPatientIdentityConsentQueueV60;
export type MedicalClinicAppointmentEncounterQueueV60ResponseDto =
  TenantMedicalClinicAppointmentEncounterQueueV60;
export type MedicalClinicCrossProductHandoffCenterV60ResponseDto =
  TenantMedicalClinicCrossProductHandoffCenterV60;
export type MedicalClinicOperatingCloseoutV60ResponseDto =
  TenantMedicalClinicOperatingCloseoutV60;
export type MedicalClinicProfileWorkspaceResponseDto =
  TenantMedicalClinicProfileWorkspace;
export type MedicalClinicPatientIntakeWorkspaceResponseDto =
  TenantMedicalClinicPatientIntakeWorkspace;
export type MedicalClinicAppointmentSchedulingWorkspaceResponseDto =
  TenantMedicalClinicAppointmentSchedulingWorkspace;
export type MedicalClinicGrowthReminderBridgeResponseDto =
  TenantMedicalClinicGrowthReminderBridge;
export type MedicalClinicBillingTaxBridgeResponseDto =
  TenantMedicalClinicBillingTaxBridge;
export type MedicalClinicPatientRecordResponseDto =
  TenantMedicalClinicPatientRecord;
export type MedicalClinicAppointmentRecordResponseDto =
  TenantMedicalClinicAppointmentRecord;
export type MedicalClinicEncounterWorkspaceResponseDto =
  TenantMedicalClinicEncounterWorkspace;
export type MedicalClinicClinicalNoteDraftPacketResponseDto =
  TenantMedicalClinicClinicalNoteDraftPacket;
export type MedicalClinicTreatmentFollowUpReadinessResponseDto =
  TenantMedicalClinicTreatmentFollowUpReadiness;
export type MedicalClinicPrescriptionReadinessPacketResponseDto =
  TenantMedicalClinicPrescriptionReadinessPacket;
export type MedicalClinicEncounterCloseoutResponseDto =
  TenantMedicalClinicEncounterCloseout;
export type MedicalClinicClinicalBoundaryCloseoutResponseDto =
  TenantMedicalClinicClinicalBoundaryCloseout;
export type MedicalClinicPatientClinicalTimelineWorkspaceResponseDto =
  TenantMedicalClinicPatientClinicalTimelineWorkspace;
export type MedicalClinicMedicalHistoryDraftRecordResponseDto =
  TenantMedicalClinicMedicalHistoryDraftRecord;
export type MedicalClinicClinicalEvidenceRegistryResponseDto =
  TenantMedicalClinicClinicalEvidenceRegistry;
export type MedicalClinicOrdersReferralReadinessPacketResponseDto =
  TenantMedicalClinicOrdersReferralReadinessPacket;
export type MedicalClinicCarePlanTaskWorkspaceResponseDto =
  TenantMedicalClinicCarePlanTaskWorkspace;
export type MedicalClinicRecordsCloseoutResponseDto =
  TenantMedicalClinicRecordsCloseout;

export interface UpsertMedicalClinicProfileWorkspaceRequestDto {
  snapshot: Partial<
    Omit<TenantMedicalClinicProfileWorkspace, 'tenantSlug' | 'generatedAt'>
  >;
}

export interface RegisterMedicalClinicPatientIntakeRequestDto {
  patientDisplayName: string;
  identificationStatus?: TenantMedicalClinicPatientRecord['identificationStatus'];
  contactStatus?: TenantMedicalClinicPatientRecord['contactStatus'];
  consentStatus?: TenantMedicalClinicPatientRecord['consentStatus'];
  messagingOptInStatus?: TenantMedicalClinicPatientRecord['messagingOptInStatus'];
  triageReason: string;
  contact?: Partial<TenantMedicalClinicPatientRecord['contact']>;
  representative?: Partial<TenantMedicalClinicPatientRecord['representative']>;
  blockers?: string[];
}

export interface CreateMedicalClinicAppointmentRequestDto {
  patientId: string;
  serviceName: string;
  professionalId: string;
  professionalName: string;
  startsAt: string;
  amountInCents?: number | null;
  currency?: 'USD' | null;
  blockers?: string[];
}

export interface TransitionMedicalClinicAppointmentRequestDto {
  status: TenantMedicalClinicAppointmentRecord['status'];
  blockers?: string[];
}

export const toMedicalClinicProductAnchorResponseDto = (
  view: TenantMedicalClinicProductAnchorView,
): MedicalClinicProductAnchorResponseDto => view;

export const toMedicalClinicProductCloseoutResponseDto = (
  view: TenantMedicalClinicProductCloseout,
): MedicalClinicProductCloseoutResponseDto => view;

export const toMedicalClinicCommandCenterV60ResponseDto = (
  view: TenantMedicalClinicCommandCenterV60,
): MedicalClinicCommandCenterV60ResponseDto => view;

export const toMedicalClinicPatientIdentityConsentQueueV60ResponseDto = (
  view: TenantMedicalClinicPatientIdentityConsentQueueV60,
): MedicalClinicPatientIdentityConsentQueueV60ResponseDto => view;

export const toMedicalClinicAppointmentEncounterQueueV60ResponseDto = (
  view: TenantMedicalClinicAppointmentEncounterQueueV60,
): MedicalClinicAppointmentEncounterQueueV60ResponseDto => view;

export const toMedicalClinicCrossProductHandoffCenterV60ResponseDto = (
  view: TenantMedicalClinicCrossProductHandoffCenterV60,
): MedicalClinicCrossProductHandoffCenterV60ResponseDto => view;

export const toMedicalClinicOperatingCloseoutV60ResponseDto = (
  view: TenantMedicalClinicOperatingCloseoutV60,
): MedicalClinicOperatingCloseoutV60ResponseDto => view;

export const toMedicalClinicProfileWorkspaceResponseDto = (
  view: TenantMedicalClinicProfileWorkspace,
): MedicalClinicProfileWorkspaceResponseDto => view;

export const toMedicalClinicPatientIntakeWorkspaceResponseDto = (
  view: TenantMedicalClinicPatientIntakeWorkspace,
): MedicalClinicPatientIntakeWorkspaceResponseDto => view;

export const toMedicalClinicAppointmentSchedulingWorkspaceResponseDto = (
  view: TenantMedicalClinicAppointmentSchedulingWorkspace,
): MedicalClinicAppointmentSchedulingWorkspaceResponseDto => view;

export const toMedicalClinicGrowthReminderBridgeResponseDto = (
  view: TenantMedicalClinicGrowthReminderBridge,
): MedicalClinicGrowthReminderBridgeResponseDto => view;

export const toMedicalClinicBillingTaxBridgeResponseDto = (
  view: TenantMedicalClinicBillingTaxBridge,
): MedicalClinicBillingTaxBridgeResponseDto => view;

export const toMedicalClinicPatientRecordResponseDto = (
  view: TenantMedicalClinicPatientRecord,
): MedicalClinicPatientRecordResponseDto => view;

export const toMedicalClinicAppointmentRecordResponseDto = (
  view: TenantMedicalClinicAppointmentRecord,
): MedicalClinicAppointmentRecordResponseDto => view;

export const toMedicalClinicEncounterWorkspaceResponseDto = (
  view: TenantMedicalClinicEncounterWorkspace,
): MedicalClinicEncounterWorkspaceResponseDto => view;

export const toMedicalClinicClinicalNoteDraftPacketResponseDto = (
  view: TenantMedicalClinicClinicalNoteDraftPacket,
): MedicalClinicClinicalNoteDraftPacketResponseDto => view;

export const toMedicalClinicTreatmentFollowUpReadinessResponseDto = (
  view: TenantMedicalClinicTreatmentFollowUpReadiness,
): MedicalClinicTreatmentFollowUpReadinessResponseDto => view;

export const toMedicalClinicPrescriptionReadinessPacketResponseDto = (
  view: TenantMedicalClinicPrescriptionReadinessPacket,
): MedicalClinicPrescriptionReadinessPacketResponseDto => view;

export const toMedicalClinicEncounterCloseoutResponseDto = (
  view: TenantMedicalClinicEncounterCloseout,
): MedicalClinicEncounterCloseoutResponseDto => view;

export const toMedicalClinicClinicalBoundaryCloseoutResponseDto = (
  view: TenantMedicalClinicClinicalBoundaryCloseout,
): MedicalClinicClinicalBoundaryCloseoutResponseDto => view;

export const toMedicalClinicPatientClinicalTimelineWorkspaceResponseDto = (
  view: TenantMedicalClinicPatientClinicalTimelineWorkspace,
): MedicalClinicPatientClinicalTimelineWorkspaceResponseDto => view;

export const toMedicalClinicMedicalHistoryDraftRecordResponseDto = (
  view: TenantMedicalClinicMedicalHistoryDraftRecord,
): MedicalClinicMedicalHistoryDraftRecordResponseDto => view;

export const toMedicalClinicClinicalEvidenceRegistryResponseDto = (
  view: TenantMedicalClinicClinicalEvidenceRegistry,
): MedicalClinicClinicalEvidenceRegistryResponseDto => view;

export const toMedicalClinicOrdersReferralReadinessPacketResponseDto = (
  view: TenantMedicalClinicOrdersReferralReadinessPacket,
): MedicalClinicOrdersReferralReadinessPacketResponseDto => view;

export const toMedicalClinicCarePlanTaskWorkspaceResponseDto = (
  view: TenantMedicalClinicCarePlanTaskWorkspace,
): MedicalClinicCarePlanTaskWorkspaceResponseDto => view;

export const toMedicalClinicRecordsCloseoutResponseDto = (
  view: TenantMedicalClinicRecordsCloseout,
): MedicalClinicRecordsCloseoutResponseDto => view;
