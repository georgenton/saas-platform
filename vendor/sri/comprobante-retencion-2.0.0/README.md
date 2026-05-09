## Comprobante de Retencion ECU

Este directorio queda reservado para el bundle oficial del SRI de `comprobante de retencion`.

Layout esperado:

- `vendor/sri/comprobante-retencion-2.0.0/XML y XSD Comprobante de Retencion/comprobanteRetencion_V2.0.0.xsd`
- `vendor/sri/comprobante-retencion-2.0.0/XML y XSD Comprobante de Retencion/comprobanteRetencion_V2.0.0.xml`
- `vendor/sri/comprobante-retencion-2.0.0/XML y XSD Comprobante de Retencion/xmldsig-core-schema.xsd`

Instalacion local:

```sh
pnpm install:sri:schema-bundle -- --document-code 07 --zip /ruta/XML-y-XSD-Comprobante-de-Retencion.zip
```

Validacion aislada:

```sh
pnpm validate:sri:xsd:withholding
```
