/*
  Warnings:

  - Added the required column `descripcion` to the `Vehiculo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `vehiculo` ADD COLUMN `descripcion` VARCHAR(100) NOT NULL;
