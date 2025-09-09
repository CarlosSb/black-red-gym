/*
  Warnings:

  - Added the required column `codeId` to the `check_ins` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."ReferralStatus" AS ENUM ('PENDING', 'CONTACTED', 'CONVERTED', 'CANCELLED');

-- CreateTable
CREATE TABLE "public"."checkin_codes" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "validDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "checkin_codes_pkey" PRIMARY KEY ("id")
);

-- Create a default checkin code for existing records
INSERT INTO "public"."checkin_codes" ("id", "code", "validDate", "createdAt", "updatedAt")
VALUES ('default-checkin-code', 'DEFAULT20240908', CURRENT_DATE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- AlterTable
ALTER TABLE "public"."check_ins" ADD COLUMN     "codeId" TEXT NOT NULL DEFAULT 'default-checkin-code';

-- CreateTable
CREATE TABLE "public"."referrals" (
    "id" TEXT NOT NULL,
    "referrerName" TEXT NOT NULL,
    "referrerPhone" TEXT NOT NULL,
    "referredName" TEXT NOT NULL,
    "referredPhone" TEXT NOT NULL,
    "referredEmail" TEXT,
    "status" "public"."ReferralStatus" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "referrals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "checkin_codes_code_key" ON "public"."checkin_codes"("code");

-- AddForeignKey
ALTER TABLE "public"."check_ins" ADD CONSTRAINT "check_ins_codeId_fkey" FOREIGN KEY ("codeId") REFERENCES "public"."checkin_codes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
