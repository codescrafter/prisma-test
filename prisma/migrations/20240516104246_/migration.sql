/*
  Warnings:

  - Added the required column `level` to the `user_skill` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user_skill" ADD COLUMN     "level" INTEGER NOT NULL;
