/*
  Warnings:

  - Added the required column `perfilId` to the `Usuario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipoVehiculoId` to the `Vehiculo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `usuario` ADD COLUMN `perfilId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `vehiculo` ADD COLUMN `tipoVehiculoId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `Perfil` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TipoVehiculo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Arriendo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fechaInicio` DATETIME(3) NOT NULL,
    `fechaFin` DATETIME(3) NOT NULL,
    `usuarioEmail` VARCHAR(191) NOT NULL,
    `vehiculoId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Usuario` ADD CONSTRAINT `Usuario_perfilId_fkey` FOREIGN KEY (`perfilId`) REFERENCES `Perfil`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Vehiculo` ADD CONSTRAINT `Vehiculo_tipoVehiculoId_fkey` FOREIGN KEY (`tipoVehiculoId`) REFERENCES `TipoVehiculo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Arriendo` ADD CONSTRAINT `Arriendo_usuarioEmail_fkey` FOREIGN KEY (`usuarioEmail`) REFERENCES `Usuario`(`email`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Arriendo` ADD CONSTRAINT `Arriendo_vehiculoId_fkey` FOREIGN KEY (`vehiculoId`) REFERENCES `Vehiculo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
