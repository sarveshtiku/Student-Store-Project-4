/*
  Warnings:

  - You are about to drop the column `customer` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "customer",
ADD COLUMN     "customer_email" TEXT NOT NULL DEFAULT '';
