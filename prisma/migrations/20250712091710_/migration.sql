/*
  Warnings:

  - Added the required column `URL` to the `files` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "files" ADD COLUMN     "URL" VARCHAR(255) NOT NULL;
