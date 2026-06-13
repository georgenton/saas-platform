import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const modulesDir = join(repoRoot, 'apps/api-platform/src/app/modules');
const docsDir = join(repoRoot, 'docs/api');
const openApiJsonPath = join(docsDir, 'openapi.json');

const PRODUCT_TAGS = [
  { name: 'Auth', description: 'Authentication, current user and invitation entry points.' },
  { name: 'Tenancy', description: 'Tenant access, memberships, products, feature flags and invitations.' },
  { name: 'Catalog', description: 'Platform product and module catalog.' },
  { name: 'Commercial', description: 'Plans, subscriptions, entitlements and product access.' },
  { name: 'Parties', description: 'Shared fiscal/customer/supplier directory contracts.' },
  { name: 'Invoicing', description: 'Invoices, customers, payments and Ecuador electronic invoicing surfaces.' },
  { name: 'Ecommerce', description: 'Store setup, product authoring, launch, order and post-sale workflows.' },
  { name: 'Growth', description: 'Conversations, WhatsApp operations, leads, opportunities and operational cases.' },
  { name: 'Tax Compliance EC', description: 'Ecuador tax compliance, SRI evidence, declaration and accountant-boundary flows.' },
  { name: 'Accounting', description: 'Accounting foundation, advanced accounting and Full Accounting closeout contracts.' },
  { name: 'AI', description: 'AI agent catalog, prompts, memory, suggestions, approvals and guarded execution.' },
  { name: 'Medical Clinics', description: 'Medical clinic activation, appointments, clinical records and closeout workflows.' },
  { name: 'Psychology Clinics', description: 'Psychology clinic activation, sessions, clinical records and closeout workflows.' },
  { name: 'Identity', description: 'Identity user management endpoints.' },
  { name: 'Platform', description: 'Root and platform-level utility endpoints.' },
];

const METHOD_MAP = {
  Get: 'get',
  Post: 'post',
  Patch: 'patch',
  Delete: 'delete',
  Put: 'put',
};

function routeFiles() {
  const output = execFileSync(
    'find',
    [modulesDir, '-name', '*controller.ts', '-print'],
    { encoding: 'utf8' },
  );
  return output
    .split('\n')
    .map((entry) => entry.trim())
    .filter(Boolean)
    .sort();
}

function firstStringLiteral(value) {
  const match = value.match(/['"`]([^'"`]*)['"`]/);
  return match?.[1] ?? '';
}

function controllerBase(source) {
  const match = source.match(/@Controller\(([\s\S]*?)\)/);
  return firstStringLiteral(match?.[1] ?? '');
}

function tagForFile(filePath, basePath) {
  const normalized = `${relative(modulesDir, filePath)} ${basePath}`.toLowerCase();

  if (normalized.includes('accounting')) return 'Accounting';
  if (normalized.includes('tax-compliance')) return 'Tax Compliance EC';
  if (normalized.includes('ecommerce')) return 'Ecommerce';
  if (normalized.includes('invoicing')) return 'Invoicing';
  if (normalized.includes('growth')) return 'Growth';
  if (normalized.includes('ai')) return 'AI';
  if (normalized.includes('medical-clinics')) return 'Medical Clinics';
  if (normalized.includes('psychology-clinics')) return 'Psychology Clinics';
  if (normalized.includes('parties')) return 'Parties';
  if (normalized.includes('commercial')) return 'Commercial';
  if (normalized.includes('catalog')) return 'Catalog';
  if (normalized.includes('feature-flags') || normalized.includes('tenancy')) return 'Tenancy';
  if (normalized.includes('auth')) return 'Auth';
  if (normalized.includes('identity')) return 'Identity';

  return 'Platform';
}

function normalizeOpenApiPath(path) {
  return `/${path}`
    .replace(/\/+/g, '/')
    .replace(/\/:([A-Za-z0-9_]+)/g, '/{$1}')
    .replace(/\/$/, '') || '/';
}

function operationId(method, path, handlerName) {
  const pathKey = path
    .replace(/[{}]/g, '')
    .split('/')
    .filter(Boolean)
    .map((part) => part.replace(/[^A-Za-z0-9]+(.)/g, (_, char) => char.toUpperCase()))
    .join('_');
  return `${method}_${pathKey || 'root'}_${handlerName}`;
}

function pathParameters(path) {
  const params = [...path.matchAll(/{([^}]+)}/g)].map((match) => match[1]);
  return params.map((name) => ({
    name,
    in: 'path',
    required: true,
    schema: { type: 'string' },
  }));
}

function routesFromSource(filePath) {
  const source = readFileSync(filePath, 'utf8');
  const basePath = controllerBase(source);
  const tag = tagForFile(filePath, basePath);
  const relativeFile = relative(repoRoot, filePath);
  const routes = [];
  const routePattern =
    /@(Get|Post|Patch|Delete|Put)\(([\s\S]*?)\)\s*(?:\n\s*@[A-Za-z][\s\S]*?\))*\s*\n\s*(?:async\s+)?([A-Za-z0-9_]+)\s*\(/g;

  for (const match of source.matchAll(routePattern)) {
    const decorator = match[1];
    const routePath = firstStringLiteral(match[2]);
    const handlerName = match[3];
    const method = METHOD_MAP[decorator];
    const fullPath = normalizeOpenApiPath(`/api/${basePath}/${routePath}`);

    routes.push({
      file: relativeFile,
      tag,
      method,
      path: fullPath,
      handlerName,
    });
  }

  return routes;
}

function buildDocument(routes) {
  const paths = {};

  for (const route of routes) {
    paths[route.path] ??= {};
    paths[route.path][route.method] = {
      tags: [route.tag],
      operationId: operationId(route.method, route.path, route.handlerName),
      summary: route.handlerName,
      description: `Generated from ${route.file}. Refine DTO schemas in future contract-hardening passes.`,
      ...(pathParameters(route.path).length
        ? { parameters: pathParameters(route.path) }
        : {}),
      security: [{ bearerAuth: [] }],
      responses: {
        '200': {
          description: 'Successful response. Schema intentionally generic in the foundation pass.',
          content: {
            'application/json': {
              schema: { type: 'object', additionalProperties: true },
            },
          },
        },
        '401': { description: 'Unauthorized.' },
        '403': { description: 'Forbidden.' },
        '404': { description: 'Not found.' },
      },
    };
  }

  return {
    openapi: '3.1.0',
    info: {
      title: 'SaaS Platform API',
      version: '0.1.0-contract-freeze',
      description:
        'Generated contract foundation for local QA and Claude Design frontend handoff. This pass enumerates routes and product tags before detailed DTO schema hardening.',
    },
    servers: [
      { url: 'http://127.0.0.1:3000/api', description: 'Local API' },
    ],
    tags: PRODUCT_TAGS,
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    paths,
    'x-frontend-handoff': {
      freezeScope:
        'Core, tenancy, invoicing, ecommerce, growth, AI, tax compliance, clinics and Full Accounting through completion closeout 1.8.',
      consumer: 'Claude Design',
      nextStep:
        'Use docs/frontend-handoff packs to design screens product by product against this contract.',
      generatedRouteCount: routes.length,
    },
  };
}

const routes = routeFiles().flatMap(routesFromSource);
const document = buildDocument(routes);

mkdirSync(docsDir, { recursive: true });

writeFileSync(openApiJsonPath, `${JSON.stringify(document, null, 2)}\n`);

console.log(`Generated ${routes.length} routes.`);
console.log(relative(repoRoot, openApiJsonPath));
