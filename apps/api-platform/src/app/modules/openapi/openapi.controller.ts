import { Controller, Get, Header } from '@nestjs/common';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

let cachedOpenApiDocument: Record<string, unknown> | null = null;

function loadOpenApiDocument(): Record<string, unknown> {
  if (!cachedOpenApiDocument) {
    cachedOpenApiDocument = JSON.parse(
      readFileSync(join(process.cwd(), 'docs/api/openapi.json'), 'utf8'),
    ) as Record<string, unknown>;
  }

  return cachedOpenApiDocument;
}

@Controller()
export class OpenApiController {
  @Get('openapi.json')
  getOpenApiDocument(): Record<string, unknown> {
    return loadOpenApiDocument();
  }

  @Get('docs')
  @Header('content-type', 'text/html; charset=utf-8')
  getDocsPage(): string {
    return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>SaaS Platform API Contract</title>
    <style>
      body { font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; margin: 0; color: #172026; background: #f7f9fb; }
      main { max-width: 960px; margin: 0 auto; padding: 48px 24px; }
      h1 { font-size: 32px; margin: 0 0 12px; }
      p { line-height: 1.6; }
      a { color: #0f62fe; }
      code { background: #eef2f6; padding: 2px 6px; border-radius: 4px; }
      .panel { background: white; border: 1px solid #dfe7ef; border-radius: 8px; padding: 20px; margin-top: 24px; }
      .grid { display: grid; gap: 12px; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); }
      .metric { background: #f7f9fb; border: 1px solid #e5edf5; border-radius: 6px; padding: 14px; }
      .metric span { display: block; color: #607080; font-size: 13px; }
      .metric strong { display: block; margin-top: 4px; font-size: 20px; }
    </style>
  </head>
  <body>
    <main>
      <h1>SaaS Platform API Contract</h1>
      <p>This local contract is generated from Nest controllers for backend QA and Claude Design frontend handoff.</p>
      <div class="panel">
        <div class="grid">
          <div class="metric"><span>OpenAPI</span><strong>3.1.0</strong></div>
          <div class="metric"><span>Contract</span><strong>freeze foundation</strong></div>
          <div class="metric"><span>Audience</span><strong>Claude Design</strong></div>
        </div>
        <p>Download the machine-readable contract at <a href="/api/openapi.json"><code>/api/openapi.json</code></a>.</p>
        <p>Read the screen-by-screen handoff in <code>docs/frontend-handoff</code> before designing product screens.</p>
      </div>
    </main>
  </body>
</html>`;
  }
}
