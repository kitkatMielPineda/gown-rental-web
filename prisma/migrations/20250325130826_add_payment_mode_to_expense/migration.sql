/*
  Warnings:

  - Added the required column `paymentMode` to the `Expense` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Expense" ADD COLUMN     "paymentMode" "PaymentMode" NOT NULL;
