-- AlterTable
ALTER TABLE "public"."academy_settings" ADD COLUMN     "features" JSONB,
ADD COLUMN     "heroImage" TEXT,
ADD COLUMN     "heroSubtitle" TEXT,
ADD COLUMN     "heroTitle" TEXT;
