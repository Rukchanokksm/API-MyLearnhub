/*
  Warnings:

  - Added the required column `comment` to the `Content` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rating` to the `Content` table without a default value. This is not possible if the table is not empty.
  - Added the required column `videoUrl` to the `Content` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Content" ADD COLUMN     "comment" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "rating" INTEGER NOT NULL,
ADD COLUMN     "videoUrl" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "registedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
