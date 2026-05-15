export function validateSriOfflineSignedXmlShape(xml: string): string[] {
  const issues: string[] = [];
  const rootMatch = xml.match(
    /<(factura|notaCredito|notaDebito|guiaRemision|comprobanteRetencion)\b[^>]*\bid="comprobante"[^>]*>/,
  );
  const signatureMatch = xml.match(/<ds:Signature\b[\s\S]*?<\/ds:Signature>/);
  const signedInfoMatch = xml.match(/<ds:SignedInfo\b[\s\S]*?<\/ds:SignedInfo>/);
  const keyInfoMatch = xml.match(/<ds:KeyInfo\b[^>]*\bId="([^"]+)"[^>]*>/);
  const signedPropertiesMatch = xml.match(
    /<etsi:SignedProperties\b[^>]*\bId="([^"]+)"[\s\S]*?<\/etsi:SignedProperties>/,
  );

  if (!rootMatch) {
    issues.push(
      'El XML firmado debe declarar una raiz de comprobante SRI con id="comprobante".',
    );
  }

  if (!signatureMatch?.[0]) {
    issues.push('El XML firmado debe incluir un bloque ds:Signature.');
    return issues;
  }

  if (!signedInfoMatch?.[0]) {
    issues.push('El bloque ds:Signature debe incluir ds:SignedInfo.');
    return issues;
  }

  if (!/CanonicalizationMethod[^>]*Algorithm="http:\/\/www\.w3\.org\/TR\/2001\/REC-xml-c14n-20010315"/.test(signedInfoMatch[0])) {
    issues.push(
      'SignedInfo debe usar canonicalizacion http://www.w3.org/TR/2001/REC-xml-c14n-20010315.',
    );
  }

  if (!/SignatureMethod[^>]*Algorithm="http:\/\/www\.w3\.org\/2000\/09\/xmldsig#rsa-sha1"/.test(signedInfoMatch[0])) {
    issues.push(
      'SignedInfo debe usar SignatureMethod rsa-sha1 para el carril offline actual.',
    );
  }

  const references = Array.from(
    signedInfoMatch[0].matchAll(/<ds:Reference\b([^>]*)>([\s\S]*?)<\/ds:Reference>/g),
  );

  if (references.length !== 3) {
    issues.push(
      'SignedInfo debe contener exactamente 3 referencias: SignedProperties, KeyInfo y comprobante.',
    );
  } else {
    const [signedPropertiesReference, keyInfoReference, documentReference] =
      references;
    const signedPropertiesAttrs = signedPropertiesReference?.[1] ?? '';
    const keyInfoAttrs = keyInfoReference?.[1] ?? '';
    const documentAttrs = documentReference?.[1] ?? '';
    const signedPropertiesBody = signedPropertiesReference?.[2] ?? '';
    const keyInfoBody = keyInfoReference?.[2] ?? '';
    const documentBody = documentReference?.[2] ?? '';
    const signedPropertiesUri = extractAttribute(
      signedPropertiesAttrs,
      'URI',
    );
    const keyInfoUri = extractAttribute(keyInfoAttrs, 'URI');
    const documentUri = extractAttribute(documentAttrs, 'URI');
    const documentReferenceId = extractAttribute(documentAttrs, 'Id');

    if (
      extractAttribute(signedPropertiesAttrs, 'Type') !==
      'http://uri.etsi.org/01903#SignedProperties'
    ) {
      issues.push(
        'La primera referencia de SignedInfo debe declarar Type SignedProperties.',
      );
    }

    if (!signedPropertiesUri?.startsWith('#')) {
      issues.push(
        'La primera referencia de SignedInfo debe apuntar por URI a SignedProperties.',
      );
    }

    if (!keyInfoUri?.startsWith('#')) {
      issues.push(
        'La segunda referencia de SignedInfo debe apuntar por URI a KeyInfo.',
      );
    }

    if (documentUri !== '#comprobante') {
      issues.push(
        'La tercera referencia de SignedInfo debe apuntar al comprobante con URI="#comprobante".',
      );
    }

    if (
      !/Transform[^>]*Algorithm="http:\/\/www\.w3\.org\/2000\/09\/xmldsig#enveloped-signature"/.test(
        documentBody,
      )
    ) {
      issues.push(
        'La referencia del comprobante debe incluir el transform enveloped-signature.',
      );
    }

    const referencesToCheck = [
      { label: 'SignedProperties', body: signedPropertiesBody },
      { label: 'KeyInfo', body: keyInfoBody },
      { label: 'comprobante', body: documentBody },
    ];

    for (const reference of referencesToCheck) {
      if (
        !/DigestMethod[^>]*Algorithm="http:\/\/www\.w3\.org\/2000\/09\/xmldsig#sha1"/.test(
          reference.body,
        )
      ) {
        issues.push(
          `La referencia ${reference.label} debe declarar DigestMethod sha1.`,
        );
      }

      if (!/<ds:DigestValue>[\s\S]*?<\/ds:DigestValue>/.test(reference.body)) {
        issues.push(
          `La referencia ${reference.label} debe incluir un DigestValue.`,
        );
      }
    }

    if (!keyInfoMatch?.[1]) {
      issues.push('El bloque ds:KeyInfo debe declarar un atributo Id.');
    } else if (keyInfoUri !== `#${keyInfoMatch[1]}`) {
      issues.push(
        'La referencia de KeyInfo debe apuntar exactamente al Id declarado por ds:KeyInfo.',
      );
    }

    if (!signedPropertiesMatch?.[1]) {
      issues.push(
        'El bloque etsi:SignedProperties debe declarar un atributo Id.',
      );
    } else if (signedPropertiesUri !== `#${signedPropertiesMatch[1]}`) {
      issues.push(
        'La referencia de SignedProperties debe apuntar exactamente al Id declarado por etsi:SignedProperties.',
      );
    }

    if (!documentReferenceId) {
      issues.push(
        'La referencia del comprobante debe declarar un Id para DataObjectFormat.',
      );
    } else {
      const objectReferenceMatch = xml.match(
        /<etsi:DataObjectFormat\b[^>]*\bObjectReference="([^"]+)"/,
      );

      if (objectReferenceMatch?.[1] !== `#${documentReferenceId}`) {
        issues.push(
          'DataObjectFormat debe apuntar al Id de la referencia del comprobante.',
        );
      }
    }
  }

  const targetMatch = xml.match(
    /<etsi:QualifyingProperties\b[^>]*\bTarget="#([^"]+)"/,
  );
  const signatureIdMatch = xml.match(/<ds:Signature\b[^>]*\bId="([^"]+)"/);

  if (!signatureIdMatch?.[1]) {
    issues.push('El bloque ds:Signature debe declarar un atributo Id.');
  } else if (targetMatch?.[1] !== signatureIdMatch[1]) {
    issues.push(
      'QualifyingProperties debe apuntar al Id declarado por ds:Signature.',
    );
  }

  if (!/<ds:X509SubjectName>[\s\S]*?<\/ds:X509SubjectName>/.test(xml)) {
    issues.push('KeyInfo debe incluir X509SubjectName.');
  }

  if (!/<ds:X509IssuerName>[\s\S]*?<\/ds:X509IssuerName>/.test(xml)) {
    issues.push('KeyInfo debe incluir X509IssuerName.');
  }

  const serialMatch = xml.match(
    /<ds:X509SerialNumber>([\s\S]*?)<\/ds:X509SerialNumber>/,
  );

  if (!serialMatch?.[1]?.trim()) {
    issues.push('KeyInfo debe incluir X509SerialNumber.');
  } else if (!/^[0-9]+$/.test(serialMatch[1].trim())) {
    issues.push('X509SerialNumber debe serializarse como entero decimal.');
  }

  if (!/<ds:X509Certificate>[\s\S]*?<\/ds:X509Certificate>/.test(xml)) {
    issues.push('KeyInfo debe incluir X509Certificate.');
  }

  if (!/<etsi:SigningTime>[\s\S]*?<\/etsi:SigningTime>/.test(xml)) {
    issues.push('SignedProperties debe incluir SigningTime.');
  }

  if (!/<etsi:SigningCertificate>[\s\S]*?<\/etsi:SigningCertificate>/.test(xml)) {
    issues.push('SignedProperties debe incluir SigningCertificate.');
  }

  if (!/<etsi:SignaturePolicyImplied\s*\/>/.test(xml)) {
    issues.push(
      'SignedProperties debe incluir SignaturePolicyImplied en este carril offline.',
    );
  }

  if (!/<etsi:DataObjectFormat\b[\s\S]*?<\/etsi:DataObjectFormat>/.test(xml)) {
    issues.push('SignedProperties debe incluir DataObjectFormat.');
  }

  return issues;
}

function extractAttribute(attributes: string, name: string): string | null {
  const match = attributes.match(new RegExp(`\\b${name}="([^"]+)"`));

  return match?.[1] ?? null;
}
