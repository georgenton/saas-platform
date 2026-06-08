import {
  PsychologyClinicProfileSnapshot,
  TenantPsychologyClinicAssessmentScaleRegistry,
  TenantPsychologyClinicBillingTaxBridge,
  TenantPsychologyClinicClinicalEvidenceRegistry,
  TenantPsychologyClinicCloseoutV4,
  TenantPsychologyClinicEhrDiscoveryWorkspace,
  TenantPsychologyClinicExternalDocumentHandoffContracts,
  TenantPsychologyClinicFoundationCloseout,
  TenantPsychologyClinicFormalRecordSignatureReadiness,
  TenantPsychologyClinicGrowthReminderBridge,
  TenantPsychologyClinicOperationsCloseout,
  TenantPsychologyClinicOutcomesReviewWorkspace,
  TenantPsychologyClinicPatientIntakeWorkspace,
  TenantPsychologyClinicPatientRecord,
  TenantPsychologyClinicPatientTimelineWorkspace,
  TenantPsychologyClinicPrivacyConsentControlCenter,
  TenantPsychologyClinicProductAnchorView,
  TenantPsychologyClinicProfileWorkspace,
  TenantPsychologyClinicRecordsCloseoutV3,
  TenantPsychologyClinicRecordsHardeningWorkspace,
  TenantPsychologyClinicRiskSafetyReviewWorkspace,
  TenantPsychologyClinicSessionNoteDraftPacket,
  TenantPsychologyClinicSessionNoteReviewLoop,
  TenantPsychologyClinicSessionRecord,
  TenantPsychologyClinicSessionSchedulingWorkspace,
  TenantPsychologyClinicTreatmentFollowUpReadiness,
  TenantPsychologyClinicTreatmentPlanWorkspace,
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
export type PsychologyClinicTreatmentPlanWorkspaceResponseDto =
  TenantPsychologyClinicTreatmentPlanWorkspace;
export type PsychologyClinicTreatmentFollowUpReadinessResponseDto =
  TenantPsychologyClinicTreatmentFollowUpReadiness;
export type PsychologyClinicGrowthReminderBridgeResponseDto =
  TenantPsychologyClinicGrowthReminderBridge;
export type PsychologyClinicBillingTaxBridgeResponseDto =
  TenantPsychologyClinicBillingTaxBridge;
export type PsychologyClinicPatientTimelineWorkspaceResponseDto =
  TenantPsychologyClinicPatientTimelineWorkspace;
export type PsychologyClinicOperationsCloseoutResponseDto =
  TenantPsychologyClinicOperationsCloseout;
export type PsychologyClinicRecordsHardeningWorkspaceResponseDto =
  TenantPsychologyClinicRecordsHardeningWorkspace;
export type PsychologyClinicClinicalEvidenceRegistryResponseDto =
  TenantPsychologyClinicClinicalEvidenceRegistry;
export type PsychologyClinicSessionNoteReviewLoopResponseDto =
  TenantPsychologyClinicSessionNoteReviewLoop;
export type PsychologyClinicRiskSafetyReviewWorkspaceResponseDto =
  TenantPsychologyClinicRiskSafetyReviewWorkspace;
export type PsychologyClinicPrivacyConsentControlCenterResponseDto =
  TenantPsychologyClinicPrivacyConsentControlCenter;
export type PsychologyClinicRecordsCloseoutV3ResponseDto =
  TenantPsychologyClinicRecordsCloseoutV3;
export type PsychologyClinicEhrDiscoveryWorkspaceResponseDto =
  TenantPsychologyClinicEhrDiscoveryWorkspace;
export type PsychologyClinicFormalRecordSignatureReadinessResponseDto =
  TenantPsychologyClinicFormalRecordSignatureReadiness;
export type PsychologyClinicOutcomesReviewWorkspaceResponseDto =
  TenantPsychologyClinicOutcomesReviewWorkspace;
export type PsychologyClinicAssessmentScaleRegistryResponseDto =
  TenantPsychologyClinicAssessmentScaleRegistry;
export type PsychologyClinicExternalDocumentHandoffContractsResponseDto =
  TenantPsychologyClinicExternalDocumentHandoffContracts;
export type PsychologyClinicCloseoutV4ResponseDto =
  TenantPsychologyClinicCloseoutV4;

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

export const toPsychologyClinicTreatmentPlanWorkspaceResponseDto = (
  view: TenantPsychologyClinicTreatmentPlanWorkspace,
): PsychologyClinicTreatmentPlanWorkspaceResponseDto => view;

export const toPsychologyClinicTreatmentFollowUpReadinessResponseDto = (
  view: TenantPsychologyClinicTreatmentFollowUpReadiness,
): PsychologyClinicTreatmentFollowUpReadinessResponseDto => view;

export const toPsychologyClinicGrowthReminderBridgeResponseDto = (
  view: TenantPsychologyClinicGrowthReminderBridge,
): PsychologyClinicGrowthReminderBridgeResponseDto => view;

export const toPsychologyClinicBillingTaxBridgeResponseDto = (
  view: TenantPsychologyClinicBillingTaxBridge,
): PsychologyClinicBillingTaxBridgeResponseDto => view;

export const toPsychologyClinicPatientTimelineWorkspaceResponseDto = (
  view: TenantPsychologyClinicPatientTimelineWorkspace,
): PsychologyClinicPatientTimelineWorkspaceResponseDto => view;

export const toPsychologyClinicOperationsCloseoutResponseDto = (
  view: TenantPsychologyClinicOperationsCloseout,
): PsychologyClinicOperationsCloseoutResponseDto => view;

export const toPsychologyClinicRecordsHardeningWorkspaceResponseDto = (
  view: TenantPsychologyClinicRecordsHardeningWorkspace,
): PsychologyClinicRecordsHardeningWorkspaceResponseDto => view;

export const toPsychologyClinicClinicalEvidenceRegistryResponseDto = (
  view: TenantPsychologyClinicClinicalEvidenceRegistry,
): PsychologyClinicClinicalEvidenceRegistryResponseDto => view;

export const toPsychologyClinicSessionNoteReviewLoopResponseDto = (
  view: TenantPsychologyClinicSessionNoteReviewLoop,
): PsychologyClinicSessionNoteReviewLoopResponseDto => view;

export const toPsychologyClinicRiskSafetyReviewWorkspaceResponseDto = (
  view: TenantPsychologyClinicRiskSafetyReviewWorkspace,
): PsychologyClinicRiskSafetyReviewWorkspaceResponseDto => view;

export const toPsychologyClinicPrivacyConsentControlCenterResponseDto = (
  view: TenantPsychologyClinicPrivacyConsentControlCenter,
): PsychologyClinicPrivacyConsentControlCenterResponseDto => view;

export const toPsychologyClinicRecordsCloseoutV3ResponseDto = (
  view: TenantPsychologyClinicRecordsCloseoutV3,
): PsychologyClinicRecordsCloseoutV3ResponseDto => view;

export const toPsychologyClinicEhrDiscoveryWorkspaceResponseDto = (
  view: TenantPsychologyClinicEhrDiscoveryWorkspace,
): PsychologyClinicEhrDiscoveryWorkspaceResponseDto => view;

export const toPsychologyClinicFormalRecordSignatureReadinessResponseDto = (
  view: TenantPsychologyClinicFormalRecordSignatureReadiness,
): PsychologyClinicFormalRecordSignatureReadinessResponseDto => view;

export const toPsychologyClinicOutcomesReviewWorkspaceResponseDto = (
  view: TenantPsychologyClinicOutcomesReviewWorkspace,
): PsychologyClinicOutcomesReviewWorkspaceResponseDto => view;

export const toPsychologyClinicAssessmentScaleRegistryResponseDto = (
  view: TenantPsychologyClinicAssessmentScaleRegistry,
): PsychologyClinicAssessmentScaleRegistryResponseDto => view;

export const toPsychologyClinicExternalDocumentHandoffContractsResponseDto = (
  view: TenantPsychologyClinicExternalDocumentHandoffContracts,
): PsychologyClinicExternalDocumentHandoffContractsResponseDto => view;

export const toPsychologyClinicCloseoutV4ResponseDto = (
  view: TenantPsychologyClinicCloseoutV4,
): PsychologyClinicCloseoutV4ResponseDto => view;
