/*
  Warnings:

  - Added the required column `brr` to the `Temp` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mrr` to the `Temp` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Temp" ADD COLUMN     "brr" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "mrr" INTEGER NOT NULL;
