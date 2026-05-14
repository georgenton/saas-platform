Instala aqui el bundle oficial del SRI para `guia de remision (06)` cuando este disponible localmente.

Instalacion esperada desde la raiz del repo:

`pnpm install:sri:schema-bundle -- --document-code 06 --zip "$HOME/Downloads/XML y XSD Guia de Remision.zip"`

Validacion esperada despues de instalar:

`pnpm validate:sri:xsd:remission-guide`

Layout esperado:

- `vendor/sri/guia-remision-1.0.0/XML y XSD Guia de Remision/guiaRemision_V1.0.0.xsd`
- `vendor/sri/guia-remision-1.0.0/XML y XSD Guia de Remision/guiaRemision_V1.0.0.xml`
- `vendor/sri/guia-remision-1.0.0/XML y XSD Guia de Remision/xmldsig-core-schema.xsd`
