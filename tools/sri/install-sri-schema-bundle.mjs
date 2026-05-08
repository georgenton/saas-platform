import { execFile } from 'node:child_process';
import { cp, mkdir, mkdtemp, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const bundleRegistry = {
  '01': {
    label: 'Factura ECU',
    targetDir: resolve(
      process.cwd(),
      'vendor/sri/factura-2.1.0/XML y XSD Factura',
    ),
    requiredFiles: [
      {
        targetName: 'factura_V2.1.0.xsd',
        sourceNames: ['factura_V2.1.0.xsd'],
      },
      {
        targetName: 'xmldsig-core-schema.xsd',
        sourceNames: ['xmldsig-core-schema.xsd'],
      },
    ],
    optionalFiles: [
      {
        targetName: 'factura_V2.1.0.xml',
        sourceNames: ['factura_V2.1.0.xml'],
      },
    ],
  },
  '04': {
    label: 'Nota de credito ECU',
    targetDir: resolve(
      process.cwd(),
      'vendor/sri/nota-credito-1.0.0/XML y XSD Nota de Credito',
    ),
    requiredFiles: [
      {
        targetName: 'notaCredito_V1.0.0.xsd',
        sourceNames: ['notaCredito_V1.0.0.xsd', 'NotaCredito_V1.0.0.xsd'],
      },
      {
        targetName: 'xmldsig-core-schema.xsd',
        sourceNames: ['xmldsig-core-schema.xsd'],
        fallbackPath: resolve(
          process.cwd(),
          'vendor/sri/factura-2.1.0/XML y XSD Factura/xmldsig-core-schema.xsd',
        ),
      },
    ],
    optionalFiles: [
      {
        targetName: 'notaCredito_V1.0.0.xml',
        sourceNames: ['notaCredito_V1.0.0.xml', 'NotaCredito_V1.0.0.xml'],
      },
      {
        targetName: 'notaCredito_V1.1.0.xsd',
        sourceNames: ['notaCredito_V1.1.0.xsd', 'NotaCredito_V1.1.0.xsd'],
      },
      {
        targetName: 'notaCredito_V1.1.0.xml',
        sourceNames: ['notaCredito_V1.1.0.xml', 'NotaCredito_V1.1.0.xml'],
      },
    ],
  },
  '05': {
    label: 'Nota de debito ECU',
    targetDir: resolve(
      process.cwd(),
      'vendor/sri/nota-debito-1.0.0/XML y XSD Nota de Debito',
    ),
    requiredFiles: [
      {
        targetName: 'notaDebito_V1.0.0.xsd',
        sourceNames: ['notaDebito_V1.0.0.xsd', 'NotaDebito_V1.0.0.xsd'],
      },
      {
        targetName: 'xmldsig-core-schema.xsd',
        sourceNames: ['xmldsig-core-schema.xsd'],
        fallbackPath: resolve(
          process.cwd(),
          'vendor/sri/factura-2.1.0/XML y XSD Factura/xmldsig-core-schema.xsd',
        ),
      },
    ],
    optionalFiles: [
      {
        targetName: 'notaDebito_V1.0.0.xml',
        sourceNames: ['notaDebito_V1.0.0.xml', 'NotaDebito_V1.0.0.xml'],
      },
    ],
  },
};

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const bundle = bundleRegistry[args.documentCode];

  if (!bundle) {
    throw new Error(
      `Document code "${args.documentCode}" no tiene un instalador de bundle SRI registrado.`,
    );
  }

  const tempDir = await mkdtemp(join(tmpdir(), 'sri-schema-bundle-'));

  try {
    await unzipBundle(args.zip, tempDir);

    const extractedFiles = await walkFiles(tempDir);
    const fileIndex = new Map(
      extractedFiles.map((filePath) => [
        filePath.split('/').pop()?.toLowerCase(),
        filePath,
      ]),
    );

    const missingFiles = bundle.requiredFiles.filter(
      (fileDescriptor) => !resolveSourcePath(fileDescriptor, fileIndex),
    );

    if (missingFiles.length > 0) {
      throw new Error(
        `El ZIP no contiene los archivos requeridos para ${bundle.label}: ${missingFiles
          .map((fileDescriptor) => fileDescriptor.targetName)
          .join(', ')}.`,
      );
    }

    await mkdir(bundle.targetDir, { recursive: true });

    for (const fileDescriptor of [...bundle.requiredFiles, ...bundle.optionalFiles]) {
      const sourcePath = resolveSourcePath(fileDescriptor, fileIndex);

      if (!sourcePath) {
        continue;
      }

      await cp(sourcePath, join(bundle.targetDir, fileDescriptor.targetName));
    }

    process.stdout.write(
      [
        `Bundle instalado para ${bundle.label}.`,
        `Destino: ${bundle.targetDir}`,
        `Archivos requeridos: ${bundle.requiredFiles
          .map((fileDescriptor) => fileDescriptor.targetName)
          .join(', ')}`,
      ].join('\n') + '\n',
    );
  } finally {
    await rm(tempDir, { force: true, recursive: true });
  }
}

function resolveSourcePath(fileDescriptor, fileIndex) {
  for (const sourceName of fileDescriptor.sourceNames) {
    const sourcePath = fileIndex.get(sourceName.toLowerCase());

    if (sourcePath) {
      return sourcePath;
    }
  }

  return fileDescriptor.fallbackPath ?? null;
}

function parseArgs(argv) {
  let documentCode = null;
  let zip = null;

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];

    if (token === '--document-code') {
      documentCode = argv[index + 1] ?? null;
      index += 1;
      continue;
    }

    if (token === '--zip') {
      zip = argv[index + 1] ?? null;
      index += 1;
      continue;
    }
  }

  if (!documentCode || !zip) {
    throw new Error(
      'Uso: node tools/sri/install-sri-schema-bundle.mjs --document-code <01|04|05> --zip </ruta/al/zip>',
    );
  }

  return {
    documentCode,
    zip: resolve(process.cwd(), zip),
  };
}

async function unzipBundle(zipPath, outputDir) {
  const strategies = [
    ['ditto', ['-x', '-k', zipPath, outputDir]],
    ['bsdtar', ['-xf', zipPath, '-C', outputDir]],
    ['unzip', ['-o', zipPath, '-d', outputDir]],
  ];
  const failures = [];

  for (const [command, args] of strategies) {
    try {
      await execCommand(command, args);
      return;
    } catch (error) {
      failures.push(
        error instanceof Error
          ? `${command}: ${error.message}`
          : `${command}: fallo desconocido`,
      );
    }
  }

  throw new Error(
    `No se pudo descomprimir el ZIP SRI. Detalle: ${failures.join(' | ')}`,
  );
}

async function execCommand(command, args) {
  await new Promise((resolvePromise, rejectPromise) => {
    execFile(command, args, (error, stdout, stderr) => {
      if (!error) {
        resolvePromise();
        return;
      }

      rejectPromise(
        new Error(
          stderr?.trim() || stdout?.trim() || `No se pudo ejecutar ${command}.`,
        ),
      );
    });
  });
}

async function walkFiles(dirPath) {
  const entries = await readdir(dirPath, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const absolutePath = join(dirPath, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await walkFiles(absolutePath)));
      continue;
    }

    if (entry.isFile()) {
      files.push(absolutePath);
    }
  }

  return files;
}

main().catch((error) => {
  process.stderr.write(
    `${error instanceof Error ? error.message : 'No se pudo instalar el bundle SRI.'}\n`,
  );
  process.exitCode = 1;
});
