import type { InvoiceDetailResponse } from '../../app/types';

export type InvoicingCloseoutTone =
  | 'danger'
  | 'info'
  | 'neutral'
  | 'success'
  | 'warning';

export type InvoicingCloseoutStatus = {
  detail: string;
  label: string;
  tone: InvoicingCloseoutTone;
};

export type InvoicingPaymentCloseoutStatus = 'paid' | 'partial' | 'unpaid';

export type InvoicingDeliveryCloseoutStatus =
  | 'no_email'
  | 'ready'
  | 'sending';

export function deriveSriCloseoutStatus(
  invoice: InvoiceDetailResponse,
): InvoicingCloseoutStatus {
  if (invoice.electronicStatus === 'authorized') {
    return {
      detail: invoice.authorizationNumber
        ? `Autorizacion ${invoice.authorizationNumber}`
        : 'Confirmado por autorizacion electronica.',
      label: 'Autorizado',
      tone: 'success',
    };
  }

  if (
    invoice.electronicStatus === 'rejected' ||
    invoice.electronicStatus === 'returned'
  ) {
    return {
      detail:
        invoice.electronicStatusMessage ??
        'El SRI devolvio una observacion que debe corregirse.',
      label: 'Requiere correccion',
      tone: 'danger',
    };
  }

  if (invoice.electronicStatus === 'submitted') {
    return {
      detail: invoice.submissionReference
        ? `Referencia ${invoice.submissionReference}`
        : 'Enviado; aun no implica autorizacion.',
      label: 'Enviado al SRI',
      tone: 'info',
    };
  }

  if (invoice.electronicStatus === 'signed') {
    return {
      detail: 'XML firmado, pendiente de envio al SRI.',
      label: 'Firmado',
      tone: 'info',
    };
  }

  return {
    detail:
      invoice.status === 'draft'
        ? 'Borrador comercial; todavia no existe verdad electronica.'
        : 'Pendiente de preparar o enviar al SRI.',
    label: 'Pendiente SRI',
    tone: 'neutral',
  };
}

export function derivePaymentCloseoutStatus(
  invoice: InvoiceDetailResponse,
): InvoicingPaymentCloseoutStatus {
  if (invoice.settlement.isFullyPaid) {
    return 'paid';
  }

  if (invoice.settlement.paidInCents > 0) {
    return 'partial';
  }

  return 'unpaid';
}

export function derivePaymentCloseoutMeta(
  invoice: InvoiceDetailResponse,
): InvoicingCloseoutStatus {
  const status = derivePaymentCloseoutStatus(invoice);

  if (status === 'paid') {
    return {
      detail: 'Saldo cubierto segun pagos registrados.',
      label: 'Pagado',
      tone: 'success',
    };
  }

  if (status === 'partial') {
    return {
      detail: 'Hay pagos registrados, pero queda saldo pendiente.',
      label: 'Pago parcial',
      tone: 'info',
    };
  }

  return {
    detail: 'Aun no hay pagos registrados para esta factura.',
    label: 'Sin pago',
    tone: 'neutral',
  };
}

export function deriveDeliveryCloseoutStatus({
  isSending,
  recipientEmail,
}: {
  isSending: boolean;
  recipientEmail: string;
}): InvoicingDeliveryCloseoutStatus {
  if (isSending) {
    return 'sending';
  }

  if (!recipientEmail.trim()) {
    return 'no_email';
  }

  return 'ready';
}

export function deriveDeliveryCloseoutMeta(
  status: InvoicingDeliveryCloseoutStatus,
): InvoicingCloseoutStatus {
  if (status === 'sending') {
    return {
      detail: 'El email esta saliendo desde el backend.',
      label: 'Enviando',
      tone: 'info',
    };
  }

  if (status === 'no_email') {
    return {
      detail: 'Agrega un correo antes de compartir el comprobante.',
      label: 'Sin email',
      tone: 'warning',
    };
  }

  return {
    detail: 'Listo para compartir con el cliente.',
    label: 'Listo para enviar',
    tone: 'neutral',
  };
}

export function deriveCloseoutVerdict({
  deliveryStatus,
  invoice,
  paymentStatus,
}: {
  deliveryStatus: InvoicingDeliveryCloseoutStatus;
  invoice: InvoiceDetailResponse;
  paymentStatus: InvoicingPaymentCloseoutStatus;
}): InvoicingCloseoutStatus {
  if (invoice.status === 'draft') {
    return {
      detail:
        'Primero cierra el documento. Entrega y pago no reemplazan la emision ni la autorizacion.',
      label: 'Aun es borrador',
      tone: 'neutral',
    };
  }

  if (
    invoice.electronicStatus === 'rejected' ||
    invoice.electronicStatus === 'returned'
  ) {
    return {
      detail:
        invoice.electronicStatusMessage ??
        'Corrige la observacion del SRI antes de tratar este documento como final.',
      label: 'Atencion SRI',
      tone: 'danger',
    };
  }

  if (deliveryStatus === 'no_email') {
    return {
      detail:
        'El comprobante puede existir, pero aun falta el canal de entrega al cliente.',
      label: 'Completar entrega',
      tone: 'warning',
    };
  }

  if (paymentStatus !== 'paid') {
    return {
      detail:
        'La entrega y la autorizacion no significan que el dinero este conciliado.',
      label: 'Cerrar saldo',
      tone: 'info',
    };
  }

  return {
    detail:
      'El documento tiene saldo cubierto. Conserva evidencia para impuestos y contabilidad.',
    label: 'Cierre operativo',
    tone: 'success',
  };
}

export function deriveCloseoutNextStep({
  deliveryStatus,
  invoice,
  paymentStatus,
}: {
  deliveryStatus: InvoicingDeliveryCloseoutStatus;
  invoice: InvoiceDetailResponse;
  paymentStatus: InvoicingPaymentCloseoutStatus;
}): string {
  if (invoice.status === 'draft') {
    return 'Primero emite o completa el carril SRI; este cierre no convierte un borrador en documento legal.';
  }

  if (
    invoice.electronicStatus === 'rejected' ||
    invoice.electronicStatus === 'returned'
  ) {
    return 'Corrige la respuesta del SRI antes de registrar este comprobante como cerrado.';
  }

  if (deliveryStatus === 'no_email') {
    return 'Agrega el correo del cliente para poder enviar el comprobante sin salir del flujo.';
  }

  if (deliveryStatus === 'ready') {
    return 'Comparte el comprobante con el cliente; esto no cambia SRI ni registra pagos.';
  }

  if (paymentStatus !== 'paid') {
    return 'Registra el pago recibido sin prometer conciliacion bancaria ni asiento contable automatico.';
  }

  return 'Revisa la evidencia y prepara el handoff futuro hacia Tax Compliance y Accounting.';
}
