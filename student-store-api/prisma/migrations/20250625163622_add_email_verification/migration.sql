-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "verify_token" TEXT,
ALTER COLUMN "customer_email" DROP DEFAULT;
