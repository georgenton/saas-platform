import {
  TenantMedicalClinicAppointmentSchedulingWorkspace,
  TenantMedicalClinicBillingTaxBridge,
  TenantMedicalClinicGrowthReminderBridge,
  TenantMedicalClinicPatientIntakeWorkspace,
  TenantMedicalClinicProductAnchorView,
  TenantMedicalClinicProfileWorkspace,
} from '@saas-platform/medical-clinics-domain';

export type MedicalClinicProductAnchorResponseDto =
  TenantMedicalClinicProductAnchorView;
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

export const toMedicalClinicProductAnchorResponseDto = (
  view: TenantMedicalClinicProductAnchorView,
): MedicalClinicProductAnchorResponseDto => view;

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
