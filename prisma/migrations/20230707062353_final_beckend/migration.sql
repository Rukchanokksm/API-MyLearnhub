/*
  Warnings:

  - Added the required column `creatorName` to the `Content` table without a default value. This is not possible if the table is not empty.
  - Added the required column `thumbnailUrl` to the `Content` table without a default value. This is not possible if the table is not empty.
  - Added the required column `videoTitle` to the `Content` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Content" DROP CONSTRAINT "Content_ownerId_fkey";

-- AlterTable
ALTER TABLE "Content" ADD COLUMN     "creatorName" TEXT NOT NULL,
ADD COLUMN     "thumbnailUrl" TEXT NOT NULL,
ADD COLUMN     "videoTitle" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Content" ADD CONSTRAINT "Content_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
