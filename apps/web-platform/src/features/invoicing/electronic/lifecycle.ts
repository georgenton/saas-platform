import type { InvoiceDetailResponse } from '../../../app/types';

export type LegalStatusMeta = {
  classSuffix: 'Danger' | 'Neutral' | 'Success' | 'Warning';
  icon: string;
  label: string;
  legal: string;
};

export type SriEvidenceValue = {
  copyable: boolean;
  value: string;
};

export function isInvoiceElectronicallyAuthorized(
  invoice: InvoiceDetailResponse,
): boolean {
  return invoice.electronicStatus === 'authorized';
}

export function getLegalStatusMeta(status: string | null): LegalStatusMeta {
  switch (status) {
    case 'submitted':
      return {
        classSuffix: 'Warning',
        icon: '↻',
        label: 'Enviado al SRI',
        legal:
          'El SRI recibió el comprobante y lo está procesando. Enviado no significa autorizado; la validez legal llega solo con la autorización.',
      };
    case 'authorized':
      return {
        classSuffix: 'Success',
        icon: '✓',
        label: 'Autorizado por el SRI',
        legal:
          'El comprobante es legalmente válido. Conserva la clave de acceso y el número de autorización para soporte, contabilidad y tributación.',
      };
    case 'rejected':
      return {
        classSuffix: 'Danger',
        icon: '!',
        label: 'Devuelto por el SRI',
        legal:
          'El SRI devolvió el comprobante con observaciones. No es válido hasta corregir la causa y autorizarlo.',
      };
    default:
      return {
        classSuffix: 'Neutral',
        icon: '→',
        label: 'Pendiente de envío',
        legal:
          'El comprobante aún no se ha enviado al SRI. No tiene validez electrónica todavía.',
      };
  }
}

export function getSriEvidenceValues({
  accessKey,
  authorizationNumber,
  isAuthorized,
}: {
  accessKey: string;
  authorizationNumber: string;
  isAuthorized: boolean;
}): {
  accessKey: SriEvidenceValue;
  authorizationNumber: SriEvidenceValue;
} {
  const cleanAccessKey = accessKey.trim();
  const cleanAuthorizationNumber = authorizationNumber.trim();

  return {
    accessKey: cleanAccessKey
      ? { copyable: true, value: cleanAccessKey }
      : { copyable: false, value: 'Disponible al enviar' },
    authorizationNumber:
      isAuthorized && cleanAuthorizationNumber
        ? { copyable: true, value: cleanAuthorizationNumber }
        : {
            copyable: false,
            value: isAuthorized
              ? 'Sin número registrado'
              : 'Disponible al autorizar',
          },
  };
}
