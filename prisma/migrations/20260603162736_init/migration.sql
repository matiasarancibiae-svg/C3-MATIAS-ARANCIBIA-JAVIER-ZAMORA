/*
  Warnings:

  - You are about to alter the column `password` on the `Usuario` table. The data in that column could be lost. The data in that column will be cast from `VarChar(200)` to `VarChar(60)`.

*/
-- AlterTable
ALTER TABLE `Usuario` MODIFY `password` VARCHAR(60) NOT NULL;
