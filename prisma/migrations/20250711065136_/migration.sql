-- AlterTable
ALTER TABLE "files" ALTER COLUMN "folder_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "folders" ALTER COLUMN "folder_id" DROP NOT NULL;
