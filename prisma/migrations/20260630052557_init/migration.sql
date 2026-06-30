-- AlterTable
ALTER TABLE `arriendo` ADD COLUMN `fechaEntrega` DATETIME(3) NULL,
    ADD COLUMN `fechaRecepcion` DATETIME(3) NULL,
    ADD COLUMN `fotosEntrega` TEXT NULL,
    ADD COLUMN `fotosRecepcion` TEXT NULL;
