export interface SriOfflineDiagnosticMessage {
  identifier: string | null;
  message: string;
  additionalInfo: string[];
}

export interface SriOfflineResponseDiagnostics {
  state: string | null;
  authorizationNumber: string | null;
  authorizationDate: string | null;
  accessKey: string | null;
  messages: SriOfflineDiagnosticMessage[];
  summary: string | null;
}

export function parseSriOfflineResponseDiagnostics(
  payload: string | null | undefined,
): SriOfflineResponseDiagnostics | null {
  if (!payload || !payload.includes('<')) {
    return null;
  }

  const state = extractFirstTagValue(payload, 'estado');
  const authorizationNumber = extractFirstTagValue(
    payload,
    'numeroAutorizacion',
  );
  const authorizationDate = extractFirstTagValue(payload, 'fechaAutorizacion');
  const accessKey =
    extractFirstTagValue(payload, 'claveAccesoConsultada') ??
    extractFirstTagValue(payload, 'claveAcceso');
  const messages = extractOuterTagBlocks(payload, 'mensaje')
    .map((block) => parseSriDiagnosticMessageBlock(block))
    .filter((item): item is SriOfflineDiagnosticMessage => item !== null);

  if (
    !state &&
    !authorizationNumber &&
    !authorizationDate &&
    !accessKey &&
    messages.length === 0
  ) {
    return null;
  }

  return {
    state,
    authorizationNumber,
    authorizationDate,
    accessKey,
    messages,
    summary: summarizeSriOfflineResponseDiagnostics({
      state,
      messages,
    }),
  };
}

export function summarizeSriOfflineResponseDiagnostics(
  diagnostics: Pick<SriOfflineResponseDiagnostics, 'messages' | 'state'>,
): string | null {
  const firstMessage = diagnostics.messages[0];

  if (firstMessage) {
    const prefix = firstMessage.identifier
      ? `${firstMessage.identifier} - `
      : '';
    const additionalInfo = firstMessage.additionalInfo[0]
      ? ` · ${firstMessage.additionalInfo[0]}`
      : '';

    return `${prefix}${firstMessage.message}${additionalInfo}`;
  }

  return diagnostics.state ? `Estado SRI: ${diagnostics.state}` : null;
}

function parseSriDiagnosticMessageBlock(
  block: string,
): SriOfflineDiagnosticMessage | null {
  const innerContent = stripOuterTag(block, 'mensaje');
  const identifier = extractFirstTagValue(innerContent, 'identificador');
  const nestedMessages = extractAllTagValues(innerContent, 'mensaje');
  const message = nestedMessages.at(-1) ?? null;
  const additionalInfo = extractAllTagValues(innerContent, 'informacionAdicional');

  if (!identifier && !message && additionalInfo.length === 0) {
    return null;
  }

  return {
    identifier,
    message: message ?? 'Mensaje SRI sin detalle textual.',
    additionalInfo,
  };
}

function extractFirstTagValue(
  payload: string,
  tagName: string,
): string | null {
  return extractAllTagValues(payload, tagName)[0] ?? null;
}

function extractAllTagValues(payload: string, tagName: string): string[] {
  const pattern = new RegExp(
    `<(?:[\\w-]+:)?${escapeRegExp(tagName)}>([\\s\\S]*?)<\\/(?:[\\w-]+:)?${escapeRegExp(
      tagName,
    )}>`,
    'gi',
  );
  const values: string[] = [];

  for (const match of payload.matchAll(pattern)) {
    const value = match[1]?.trim();

    if (value) {
      values.push(value);
    }
  }

  return values;
}

function extractOuterTagBlocks(payload: string, tagName: string): string[] {
  const tagPattern = new RegExp(
    `<\\/?(?:[\\w-]+:)?${escapeRegExp(tagName)}(?:\\s[^>]*)?>`,
    'gi',
  );
  const blocks: string[] = [];
  let depth = 0;
  let blockStart = -1;
  let match: RegExpExecArray | null;

  while ((match = tagPattern.exec(payload)) !== null) {
    const token = match[0];
    const isClosing = /^<\//.test(token);

    if (!isClosing) {
      if (depth === 0) {
        blockStart = match.index;
      }

      depth += 1;
      continue;
    }

    if (depth === 0) {
      continue;
    }

    depth -= 1;

    if (depth === 0 && blockStart >= 0) {
      blocks.push(payload.slice(blockStart, tagPattern.lastIndex));
      blockStart = -1;
    }
  }

  return blocks;
}

function stripOuterTag(block: string, tagName: string): string {
  const openPattern = new RegExp(
    `^<(?:[\\w-]+:)?${escapeRegExp(tagName)}(?:\\s[^>]*)?>`,
    'i',
  );
  const closePattern = new RegExp(
    `<\\/(?:[\\w-]+:)?${escapeRegExp(tagName)}>$`,
    'i',
  );

  return block.replace(openPattern, '').replace(closePattern, '').trim();
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
