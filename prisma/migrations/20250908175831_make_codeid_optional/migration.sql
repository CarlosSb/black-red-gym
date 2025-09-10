-- DropForeignKey
ALTER TABLE "public"."check_ins" DROP CONSTRAINT "check_ins_codeId_fkey";

-- AlterTable
ALTER TABLE "public"."check_ins" ALTER COLUMN "codeId" DROP NOT NULL,
ALTER COLUMN "codeId" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "public"."check_ins" ADD CONSTRAINT "check_ins_codeId_fkey" FOREIGN KEY ("codeId") REFERENCES "public"."checkin_codes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
