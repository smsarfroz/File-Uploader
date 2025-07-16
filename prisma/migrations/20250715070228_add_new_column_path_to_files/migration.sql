/*
  Warnings:

  - Added the required column `path` to the `files` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "files" ADD COLUMN     "path" VARCHAR(255) NOT NULL;
