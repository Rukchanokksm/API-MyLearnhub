/*
  Warnings:

  - Added the required column `creatorUrl` to the `Content` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Content" ADD COLUMN     "creatorUrl" TEXT NOT NULL;
