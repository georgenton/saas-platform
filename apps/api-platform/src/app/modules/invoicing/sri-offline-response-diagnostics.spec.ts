import {
  parseSriOfflineResponseDiagnostics,
  summarizeSriOfflineResponseDiagnostics,
} from './sri-offline-response-diagnostics';

describe('Sri offline response diagnostics', () => {
  it('parses nested sri rejection messages into structured diagnostics', () => {
    const payload = `
      <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
        <soap:Body>
          <ns2:validarComprobanteResponse xmlns:ns2="http://ec.gob.sri.ws.recepcion">
            <RespuestaRecepcionComprobante>
              <estado>DEVUELTA</estado>
              <comprobantes>
                <comprobante>
                  <claveAcceso>120520260117900123450010010020000000011234567815</claveAcceso>
                  <mensajes>
                    <mensaje>
                      <identificador>35</identificador>
                      <mensaje>ARCHIVO NO CUMPLE ESTRUCTURA XML</mensaje>
                      <informacionAdicional>No existe un contribuyente registrado con el RUC 1790012345001</informacionAdicional>
                    </mensaje>
                  </mensajes>
                </comprobante>
              </comprobantes>
            </RespuestaRecepcionComprobante>
          </ns2:validarComprobanteResponse>
        </soap:Body>
      </soap:Envelope>
    `;

    const diagnostics = parseSriOfflineResponseDiagnostics(payload);

    expect(diagnostics).toEqual({
      state: 'DEVUELTA',
      authorizationNumber: null,
      authorizationDate: null,
      accessKey: '120520260117900123450010010020000000011234567815',
      summary:
        '35 - ARCHIVO NO CUMPLE ESTRUCTURA XML · No existe un contribuyente registrado con el RUC 1790012345001',
      messages: [
        {
          identifier: '35',
          message: 'ARCHIVO NO CUMPLE ESTRUCTURA XML',
          additionalInfo: [
            'No existe un contribuyente registrado con el RUC 1790012345001',
          ],
        },
      ],
    });
  });

  it('returns null for non-xml payloads', () => {
    expect(
      parseSriOfflineResponseDiagnostics('{"state":"submitted"}'),
    ).toBeNull();
  });

  it('summarizes state when the payload has no detailed messages', () => {
    expect(
      summarizeSriOfflineResponseDiagnostics({
        state: 'AUTORIZADO',
        messages: [],
      }),
    ).toBe('Estado SRI: AUTORIZADO');
  });
});
