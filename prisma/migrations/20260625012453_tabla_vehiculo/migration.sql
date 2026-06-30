-- CreateTable
CREATE TABLE `Vehiculo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `modelo` VARCHAR(20) NOT NULL,
    `precio` INTEGER NOT NULL,
    `estado` VARCHAR(191) NOT NULL DEFAULT 'disponible',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
