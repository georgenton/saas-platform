import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { createServer } from 'node:http';
import {
  getArg,
  loadDotEnv,
  printLine,
  printSection,
} from '../smoke/ec-sandbox-smoke-lib.mjs';

function ensureParentDir(filePath) {
  mkdirSync(dirname(filePath), { recursive: true });
}

async function readJsonBody(request) {
  const chunks = [];

  for await (const chunk of request) {
    chunks.push(chunk);
  }

  const rawBody = Buffer.concat(chunks).toString('utf8');

  if (!rawBody.trim()) {
    return null;
  }

  return JSON.parse(rawBody);
}

async function main() {
  loadDotEnv();

  const host = getArg('host', '127.0.0.1');
  const port = Number.parseInt(getArg('port', '4011'), 10);
  const outputFile = getArg(
    'output-file',
    'tmp/observability/whatsapp-operational-monitor-events.json',
  );

  if (!Number.isFinite(port) || port <= 0) {
    throw new Error('port debe ser un entero positivo.');
  }

  const events = [];
  const outputPath = resolve(process.cwd(), outputFile);

  const persistEvents = () => {
    ensureParentDir(outputPath);
    writeFileSync(outputPath, JSON.stringify(events, null, 2));
  };

  const server = createServer(async (request, response) => {
    if (!request.url) {
      response.writeHead(400).end();
      return;
    }

    if (request.method === 'GET' && request.url === '/health') {
      response.writeHead(200, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify({ ok: true }));
      return;
    }

    if (request.method === 'GET' && request.url === '/events') {
      response.writeHead(200, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify({ count: events.length, events }));
      return;
    }

    if (request.method === 'POST' && request.url === '/ingest') {
      try {
        const body = await readJsonBody(request);
        events.push({
          receivedAt: new Date().toISOString(),
          headers: request.headers,
          body,
        });
        persistEvents();
        response.writeHead(202, { 'Content-Type': 'application/json' });
        response.end(
          JSON.stringify({
            accepted: true,
            count: events.length,
          }),
        );
        return;
      } catch (error) {
        response.writeHead(400, { 'Content-Type': 'application/json' });
        response.end(
          JSON.stringify({
            accepted: false,
            error: error instanceof Error ? error.message : String(error),
          }),
        );
        return;
      }
    }

    response.writeHead(404, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({ error: 'Not found' }));
  });

  await new Promise((resolvePromise) => {
    server.listen(port, host, resolvePromise);
  });

  printSection('WhatsApp Operational Monitor Collector');
  printLine('url', `http://${host}:${port}`);
  printLine('health', `http://${host}:${port}/health`);
  printLine('ingest', `http://${host}:${port}/ingest`);
  printLine('events', `http://${host}:${port}/events`);
  printLine('outputFile', outputPath);
}

main().catch((error) => {
  process.stderr.write(
    `${error instanceof Error ? error.message : String(error)}\n`,
  );
  process.exit(1);
});
