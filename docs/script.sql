DROP DATABASE IF EXISTS pd_gabriela_camacho_macondo;
CREATE DATABASE pd_gabriela_camacho_macondo;
USE pd_gabriela_camacho_macondo;

CREATE TABLE `pd_gabriela_camacho_macondo`.`clients` (
  `id_clients` INT NOT NULL AUTO_INCREMENT,
  `fullname` VARCHAR(45) NOT NULL,
  `user_identification` VARCHAR(45) NOT NULL,
  `direction` VARCHAR(250) NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `telephone` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id_clients`));

CREATE TABLE `pd_gabriela_camacho_macondo`.`invoice` (
  `id_invoice` INT NOT NULL AUTO_INCREMENT,
  `invoice_number` VARCHAR(50) NOT NULL,
  `invoicing_period` DATE NOT NULL,
  `amount_invoiced` DECIMAL(15,2) NOT NULL,
  `amount_paid` DECIMAL(15,2) NOT NULL,
  PRIMARY KEY (`id_invoice`));

  CREATE TABLE `pd_gabriela_camacho_macondo`.`status_transaction` (
  `id_status` INT NOT NULL AUTO_INCREMENT,
  `status_t` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id_status`));

CREATE TABLE `pd_gabriela_camacho_macondo`.`type_transaction` (
  `id_type` INT NOT NULL AUTO_INCREMENT,
  `type_t` VARCHAR(80) NOT NULL,
  PRIMARY KEY (`id_type`));

CREATE TABLE `pd_gabriela_camacho_macondo`.`platform` (
  `id_platform` INT NOT NULL AUTO_INCREMENT,
  `name_platform` VARCHAR(80) NOT NULL,
  PRIMARY KEY (`id_platform`));

CREATE TABLE `pd_gabriela_camacho_macondo`.`transactions` (
  `id_transaction` VARCHAR(40) NOT NULL,
  `transaction_amount` DECIMAL(15,2) NOT NULL,
  `date_hour_transaction` DATETIME NOT NULL,
  `id_status` INT NOT NULL,
  `id_type` INT NOT NULL,
  `id_clients` INT NOT NULL,
  `id_platform` INT NOT NULL,
  `id_invoice` INT NOT NULL,
  PRIMARY KEY (`id_transaction`),
  CONSTRAINT `id_invoice`
    FOREIGN KEY (`id_invoice`)
    REFERENCES `pd_gabriela_camacho_macondo`.`invoice` (`id_invoice`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `id_platform`
    FOREIGN KEY (`id_platform`)
    REFERENCES `pd_gabriela_camacho_macondo`.`platform` (`id_platform`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `id_clients`
    FOREIGN KEY (`id_clients`)
    REFERENCES `pd_gabriela_camacho_macondo`.`clients` (`id_clients`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `id_type`
    FOREIGN KEY (`id_type`)
    REFERENCES `pd_gabriela_camacho_macondo`.`type_transaction` (`id_type`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `id_status`
    FOREIGN KEY (`id_status`)
    REFERENCES `pd_gabriela_camacho_macondo`.`status_transaction` (`id_status`)
    ON DELETE CASCADE
    ON UPDATE CASCADE);