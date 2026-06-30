-- CreateTable
CREATE TABLE `Usuario` (
    `email` VARCHAR(10) NOT NULL,
    `password` VARCHAR(200) NOT NULL,
    `nombreCompleto` VARCHAR(100) NOT NULL,
    `activo` BOOLEAN NOT NULL,
    `rol` VARCHAR(20) NOT NULL,

    PRIMARY KEY (`email`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
