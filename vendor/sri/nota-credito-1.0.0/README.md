## Nota de credito SRI 1.0.0

Este directorio queda reservado para el bundle oficial del SRI de `Nota de Credito`.

Layout esperado por el repo:

- `vendor/sri/nota-credito-1.0.0/XML y XSD Nota de Credito/notaCredito_V1.0.0.xsd`
- `vendor/sri/nota-credito-1.0.0/XML y XSD Nota de Credito/xmldsig-core-schema.xsd`
- opcional: `vendor/sri/nota-credito-1.0.0/XML y XSD Nota de Credito/notaCredito_V1.0.0.xml`

Instalacion recomendada desde un ZIP oficial descargado manualmente:

```sh
pnpm install:sri:schema-bundle -- --document-code 04 --zip /ruta/XML-y-XSD-Nota-de-Credito.zip
```

Despues de instalar el bundle, el validador XSD del repo ya podra detectar soporte local para `04`.
