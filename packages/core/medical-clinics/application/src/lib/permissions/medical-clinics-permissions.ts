export const MEDICAL_CLINICS_PERMISSION_CATALOG = {
  read: 'medical-clinics.read',
  manage: 'medical-clinics.manage',
} as const;

export const MEDICAL_CLINICS_PERMISSIONS = {
  READ: MEDICAL_CLINICS_PERMISSION_CATALOG.read,
  MANAGE: MEDICAL_CLINICS_PERMISSION_CATALOG.manage,
} as const;
