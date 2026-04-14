-- AlterTable
ALTER TABLE "Membership" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Tenant" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "authProvider" DROP DEFAULT,
ALTER COLUMN "updatedAt" DROP DEFAULT;
