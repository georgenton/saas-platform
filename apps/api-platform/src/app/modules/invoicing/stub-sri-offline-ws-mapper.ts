interface ReceptionMapperInput {
  accessKey: string;
  invoiceId: string;
  signedXml: string;
  submissionSettings: {
    environment: 'test' | 'production';
    receptionUrl?: string | null;
  };
}

interface AuthorizationMapperInput {
  accessKey: string;
  invoiceId: string;
  submissionReference: string;
  submissionSettings: {
    environment: 'test' | 'production';
    authorizationUrl?: string | null;
  };
}

export interface SriOfflineReceptionEnvelope {
  endpoint: string;
  soapAction: 'validarComprobante';
  accessKey: string;
  xmlPayload: string;
  xml: string;
}

export interface SriOfflineAuthorizationEnvelope {
  endpoint: string;
  soapAction: 'autorizacionComprobante';
  accessKey: string;
  submissionReference: string;
  xml: string;
}

export interface SriOfflineReceptionResponse {
  state: 'RECIBIDA' | 'DEVUELTA';
  submittedAt: Date;
  submissionReference: string;
  message: string;
}

export interface SriOfflineAuthorizationResponse {
  state: 'AUTORIZADO' | 'NO AUTORIZADO';
  authorizationNumber: string | null;
  authorizedAt: Date | null;
  message: string;
}

export function buildSriOfflineReceptionEnvelope(
  input: ReceptionMapperInput,
): SriOfflineReceptionEnvelope {
  const endpoint =
    input.submissionSettings.receptionUrl ??
    'https://celcer.sri.gob.ec/comprobantes-electronicos-ws/RecepcionComprobantesOffline';

  return {
    endpoint,
    soapAction: 'validarComprobante',
    accessKey: input.accessKey,
    xmlPayload: toBase64(input.signedXml),
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ec="http://ec.gob.sri.ws.recepcion">
  <soapenv:Header/>
  <soapenv:Body>
    <ec:validarComprobante>
      <xml>${escapeXml(toBase64(input.signedXml))}</xml>
    </ec:validarComprobante>
  </soapenv:Body>
</soapenv:Envelope>`,
  };
}

export function buildSriOfflineAuthorizationEnvelope(
  input: AuthorizationMapperInput,
): SriOfflineAuthorizationEnvelope {
  const endpoint =
    input.submissionSettings.authorizationUrl ??
    'https://celcer.sri.gob.ec/comprobantes-electronicos-ws/AutorizacionComprobantesOffline';

  return {
    endpoint,
    soapAction: 'autorizacionComprobante',
    accessKey: input.accessKey,
    submissionReference: input.submissionReference,
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ec="http://ec.gob.sri.ws.autorizacion">
  <soapenv:Header/>
  <soapenv:Body>
    <ec:autorizacionComprobante>
      <claveAccesoComprobante>${escapeXml(input.accessKey)}</claveAccesoComprobante>
    </ec:autorizacionComprobante>
  </soapenv:Body>
</soapenv:Envelope>`,
  };
}

export function simulateSriOfflineReceptionResponse(
  input: ReceptionMapperInput,
  envelope: SriOfflineReceptionEnvelope,
): SriOfflineReceptionResponse {
  const submittedAt = new Date();
  const environmentLabel =
    input.submissionSettings.environment === 'production'
      ? 'PRODUCCION'
      : 'PRUEBAS';

  const submissionReference = buildSubmissionReference(
    input.invoiceId,
    input.accessKey,
    submittedAt,
  );
  const technicalValidation = validateSignedXml(input);

  if (!technicalValidation.ok) {
    const rejectionReason =
      'message' in technicalValidation
        ? technicalValidation.message
        : 'La recepcion del comprobante fue devuelta por una validacion tecnica no identificada.';

    return {
      state: 'DEVUELTA',
      submittedAt,
      submissionReference,
      message: [
        `SRI recepcion offline (${environmentLabel}): DEVUELTA.`,
        rejectionReason,
        `SOAP action=${envelope.soapAction}.`,
        `Endpoint=${envelope.endpoint}.`,
      ].join(' '),
    };
  }

  return {
    state: 'RECIBIDA',
    submittedAt,
    submissionReference,
    message: [
      `SRI recepcion offline (${environmentLabel}): RECIBIDA.`,
      `SOAP action=${envelope.soapAction}.`,
      `Endpoint=${envelope.endpoint}.`,
      `Referencia tecnica=${submissionReference}.`,
    ].join(' '),
  };
}

export function simulateSriOfflineAuthorizationResponse(
  input: AuthorizationMapperInput,
  envelope: SriOfflineAuthorizationEnvelope,
): SriOfflineAuthorizationResponse {
  const environmentLabel =
    input.submissionSettings.environment === 'production'
      ? 'PRODUCCION'
      : 'PRUEBAS';
  const expectedReferencePrefix = buildSubmissionReferencePrefix(
    input.invoiceId,
    input.accessKey,
  );

  if (
    input.accessKey.length !== 49 ||
    !input.submissionReference.startsWith(expectedReferencePrefix)
  ) {
    return {
      state: 'NO AUTORIZADO',
      authorizationNumber: null,
      authorizedAt: null,
      message: [
        `SRI autorizacion offline (${environmentLabel}): NO AUTORIZADO.`,
        `No coincide la referencia tecnica del envio con la clave de acceso consultada.`,
        `SOAP action=${envelope.soapAction}.`,
        `Endpoint=${envelope.endpoint}.`,
      ].join(' '),
    };
  }

  const authorizedAt = new Date();

  return {
    state: 'AUTORIZADO',
    authorizationNumber: input.accessKey,
    authorizedAt,
    message: [
      `SRI autorizacion offline (${environmentLabel}): AUTORIZADO.`,
      `SOAP action=${envelope.soapAction}.`,
      `Endpoint=${envelope.endpoint}.`,
      `Autorizacion=${input.accessKey}.`,
    ].join(' '),
  };
}

function buildSubmissionReference(
  invoiceId: string,
  accessKey: string,
  submittedAt: Date,
): string {
  return `${buildSubmissionReferencePrefix(invoiceId, accessKey)}-${submittedAt.getTime()}`;
}

function buildSubmissionReferencePrefix(
  invoiceId: string,
  accessKey: string,
): string {
  return `SRI-REC-${invoiceId}-${accessKey.slice(-8)}`;
}

function validateSignedXml(
  input: ReceptionMapperInput,
): { ok: true } | { ok: false; message: string } {
  if (input.accessKey.length !== 49) {
    return {
      ok: false,
      message: 'La clave de acceso no tiene la longitud esperada de 49 digitos.',
    };
  }

  if (!input.signedXml.includes('<factura')) {
    return {
      ok: false,
      message: 'El XML firmado no contiene la raiz esperada de factura.',
    };
  }

  if (!input.signedXml.includes(input.accessKey)) {
    return {
      ok: false,
      message: 'El XML firmado no incluye la clave de acceso declarada para el comprobante.',
    };
  }

  return { ok: true };
}

export function buildSriOfflineReceptionResponseXml(
  response: SriOfflineReceptionResponse,
): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<RespuestaRecepcionComprobante>
  <estado>${escapeXml(response.state)}</estado>
  <comprobantes>
    <comprobante>
      <claveAcceso>${escapeXml(response.submissionReference)}</claveAcceso>
      <mensajes>
        <mensaje>
          <mensaje>${escapeXml(response.message)}</mensaje>
        </mensaje>
      </mensajes>
    </comprobante>
  </comprobantes>
</RespuestaRecepcionComprobante>`;
}

export function buildSriOfflineAuthorizationResponseXml(
  response: SriOfflineAuthorizationResponse,
): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<RespuestaAutorizacionComprobante>
  <numeroComprobantes>1</numeroComprobantes>
  <autorizaciones>
    <autorizacion>
      <estado>${escapeXml(response.state)}</estado>
      ${
        response.authorizationNumber
          ? `<numeroAutorizacion>${escapeXml(response.authorizationNumber)}</numeroAutorizacion>`
          : ''
      }
      ${
        response.authorizedAt
          ? `<fechaAutorizacion>${escapeXml(response.authorizedAt.toISOString())}</fechaAutorizacion>`
          : ''
      }
      <mensajes>
        <mensaje>
          <mensaje>${escapeXml(response.message)}</mensaje>
        </mensaje>
      </mensajes>
    </autorizacion>
  </autorizaciones>
</RespuestaAutorizacionComprobante>`;
}

function toBase64(value: string): string {
  return Buffer.from(value, 'utf8').toString('base64');
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
