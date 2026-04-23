CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PlatformModule" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isCore" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlatformModule_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Product_key_key" ON "Product"("key");
CREATE UNIQUE INDEX "PlatformModule_productId_key_key" ON "PlatformModule"("productId", "key");

ALTER TABLE "PlatformModule"
ADD CONSTRAINT "PlatformModule_productId_fkey"
FOREIGN KEY ("productId") REFERENCES "Product"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

INSERT INTO "Product" ("id", "key", "name", "description", "isActive", "createdAt", "updatedAt")
VALUES
  ('product_invoicing', 'invoicing', 'Invoicing', 'Facturacion, clientes, catalogo y reportes.', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('product_psychology', 'psychology', 'Psychology', 'Gestion de profesionales, pacientes y sesiones.', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('product_learning', 'learning', 'Learning', 'Cursos, progreso, quizzes y certificados.', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('product_ecommerce', 'ecommerce', 'Ecommerce', 'Catalogo, inventario, ordenes y checkout.', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("key") DO UPDATE
SET
  "name" = EXCLUDED."name",
  "description" = EXCLUDED."description",
  "isActive" = EXCLUDED."isActive",
  "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "PlatformModule" ("id", "productId", "key", "name", "description", "isCore", "isActive", "createdAt", "updatedAt")
VALUES
  ('module_invoicing_customers', 'product_invoicing', 'customers', 'Customers', 'Gestion de clientes.', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('module_invoicing_catalog', 'product_invoicing', 'catalog', 'Catalog', 'Catalogo de productos y servicios.', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('module_invoicing_invoices', 'product_invoicing', 'invoices', 'Invoices', 'Emision de facturas.', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('module_invoicing_taxes', 'product_invoicing', 'taxes', 'Taxes', 'Reglas y configuracion de impuestos.', false, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('module_invoicing_reports', 'product_invoicing', 'reports', 'Reports', 'Reportes operativos del producto.', false, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('module_invoicing_documents', 'product_invoicing', 'documents', 'Documents', 'Documentos generados y adjuntos.', false, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('module_invoicing_notifications', 'product_invoicing', 'notifications', 'Notifications', 'Notificaciones del ciclo de facturacion.', false, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  ('module_psychology_professionals', 'product_psychology', 'professionals', 'Professionals', 'Gestion de profesionales.', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('module_psychology_patients', 'product_psychology', 'patients', 'Patients', 'Gestion de pacientes.', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('module_psychology_appointments', 'product_psychology', 'appointments', 'Appointments', 'Agenda de citas.', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('module_psychology_session_notes', 'product_psychology', 'session-notes', 'Session Notes', 'Notas y registros clinicos.', false, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('module_psychology_treatment_plans', 'product_psychology', 'treatment-plans', 'Treatment Plans', 'Planes de tratamiento.', false, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('module_psychology_teleconsultation', 'product_psychology', 'teleconsultation', 'Teleconsultation', 'Sesiones remotas y teleconsulta.', false, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('module_psychology_reminders', 'product_psychology', 'reminders', 'Reminders', 'Recordatorios automaticos.', false, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  ('module_learning_courses', 'product_learning', 'courses', 'Courses', 'Gestion de cursos.', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('module_learning_lessons', 'product_learning', 'lessons', 'Lessons', 'Lecciones y contenidos.', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('module_learning_quizzes', 'product_learning', 'quizzes', 'Quizzes', 'Evaluaciones y quizzes.', false, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('module_learning_certificates', 'product_learning', 'certificates', 'Certificates', 'Certificados y acreditaciones.', false, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('module_learning_books', 'product_learning', 'books', 'Books', 'Biblioteca y recursos.', false, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('module_learning_progress', 'product_learning', 'progress', 'Progress', 'Seguimiento de progreso.', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('module_learning_recommendations', 'product_learning', 'recommendations', 'Recommendations', 'Recomendaciones inteligentes.', false, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  ('module_ecommerce_catalog', 'product_ecommerce', 'catalog', 'Catalog', 'Catalogo comercial.', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('module_ecommerce_products', 'product_ecommerce', 'products', 'Products', 'Gestion de productos.', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('module_ecommerce_variants', 'product_ecommerce', 'variants', 'Variants', 'Variantes y opciones.', false, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('module_ecommerce_inventory', 'product_ecommerce', 'inventory', 'Inventory', 'Inventario y stock.', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('module_ecommerce_orders', 'product_ecommerce', 'orders', 'Orders', 'Gestion de ordenes.', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('module_ecommerce_promotions', 'product_ecommerce', 'promotions', 'Promotions', 'Promociones y descuentos.', false, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('module_ecommerce_checkout', 'product_ecommerce', 'checkout', 'Checkout', 'Checkout y cierre de venta.', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("productId", "key") DO UPDATE
SET
  "name" = EXCLUDED."name",
  "description" = EXCLUDED."description",
  "isCore" = EXCLUDED."isCore",
  "isActive" = EXCLUDED."isActive",
  "updatedAt" = CURRENT_TIMESTAMP;
