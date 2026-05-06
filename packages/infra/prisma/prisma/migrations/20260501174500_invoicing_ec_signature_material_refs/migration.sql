ALTER TABLE "ElectronicSignatureSettings"
ADD COLUMN     "storageMode" TEXT NOT NULL DEFAULT 'stub_inline',
ADD COLUMN     "pkcs12SecretRef" TEXT,
ADD COLUMN     "privateKeyPasswordSecretRef" TEXT,
ADD COLUMN     "subjectName" TEXT;
