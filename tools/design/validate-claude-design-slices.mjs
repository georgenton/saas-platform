#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const designRoot = path.join(root, 'docs/design/claude-design');

const expectedSlices = [
  '00-platform-shell',
  '01-product-command-center',
  '02-invoicing-workspace',
  '03-invoicing-sri-progressive-disclosure',
  '04-access-login-gateway',
  '05-invoicing-settings-sri',
  '06-invoicing-customer-draft-flow',
  '07-invoicing-items-flow',
  '08-invoicing-document-review',
  '09-invoicing-sri-submission-lifecycle',
  '10-invoicing-payment-email-delivery-closeout',
  '11-invoicing-operational-polish-qa',
];

const commonDocs = ['README.md', 'notes.md', 'integration-plan.md'];
const failures = [];

function requireFile(filePath, label) {
  if (!existsSync(filePath) || !statSync(filePath).isFile()) {
    failures.push(`Missing ${label}: ${path.relative(root, filePath)}`);
    return '';
  }

  return readFileSync(filePath, 'utf8');
}

function requireDir(dirPath, label) {
  if (!existsSync(dirPath) || !statSync(dirPath).isDirectory()) {
    failures.push(`Missing ${label}: ${path.relative(root, dirPath)}`);
    return [];
  }

  return readdirSync(dirPath);
}

for (const slice of expectedSlices) {
  const sliceDir = path.join(designRoot, slice);
  requireDir(sliceDir, `${slice} directory`);

  const index = requireFile(path.join(sliceDir, 'index.html'), `${slice} index`);
  if (index) {
    if (!index.includes('window.__CLAUDE_VIEWER_ERRORS')) {
      failures.push(`${slice}: index.html must expose window.__CLAUDE_VIEWER_ERRORS for browser validation`);
    }

    if (!index.includes('data-plugins="transform-react-jsx"')) {
      failures.push(`${slice}: JSX scripts must pin transform-react-jsx for static viewer execution`);
    }

    const stylesheetMatches = index.matchAll(/<link[^>]+rel=["']stylesheet["'][^>]+href=["']([^"']+)["']/g);
    for (const match of stylesheetMatches) {
      const href = match[1];
      if (/^https?:\/\//.test(href)) {
        continue;
      }

      const resolved = path.resolve(sliceDir, href);
      if (!existsSync(resolved)) {
        failures.push(`${slice}: stylesheet does not resolve: ${href}`);
      }
    }
  }

  const requiredDocs = slice === '00-platform-shell' ? commonDocs : [...commonDocs, 'components.md'];
  for (const doc of requiredDocs) {
    requireFile(path.join(sliceDir, doc), `${slice} ${doc}`);
  }

  const sourceDirName = slice === '00-platform-shell' ? 'source' : 'src';
  const sourceEntries = requireDir(path.join(sliceDir, sourceDirName), `${slice} ${sourceDirName}`);
  if (!sourceEntries.some((entry) => entry.endsWith('.jsx'))) {
    failures.push(`${slice}: ${sourceDirName}/ must include JSX source files`);
  }

  const mockEntries = requireDir(path.join(sliceDir, 'mock-data'), `${slice} mock-data`);
  if (!mockEntries.some((entry) => entry.endsWith('.json'))) {
    failures.push(`${slice}: mock-data/ must include JSON fixtures`);
  }
}

if (failures.length > 0) {
  console.error('Claude Design slice validation failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`Claude Design slice validation passed for ${expectedSlices.length} slices.`);
