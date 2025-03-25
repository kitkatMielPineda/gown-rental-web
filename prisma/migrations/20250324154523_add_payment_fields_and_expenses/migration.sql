-- CreateEnum
CREATE TYPE "PaymentMode" AS ENUM ('GCASH', 'Maya', 'GoTyme', 'BPI', 'BDO', 'UnionBank', 'Metrobank', 'Cash');

-- AlterTable
ALTER TABLE "Rental" ADD COLUMN     "downPaymentMode" "PaymentMode",
ADD COLUMN     "finalPayment" DECIMAL(65,30),
ADD COLUMN     "finalPaymentMode" "PaymentMode";

-- CreateTable
CREATE TABLE "Expense" (
    "id" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Expense_pkey" PRIMARY KEY ("id")
);
