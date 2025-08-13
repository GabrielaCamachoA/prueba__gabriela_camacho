CREATE DATABASE pd_gabriela_camacho_macondo;
USE pd_gabriela_camacho_macondo;
CREATE TABLE clients (
  id_clients INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  fullname VARCHAR (110) NOT NULL,
  user_identification VARCHAR (50) NOT NULL UNIQUE,
  direction VARCHAR(80) NOT NULL,
  email VARCHAR (110) DEFAULT NULL UNIQUE,
  telephone VARCHAR (30) DEFAULT NULL UNIQUE
);
CREATE TABLE invoice (
  id_invoice INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  invoice_number VARCHAR (80) NOT NULL,
  invoicing_period  DATE  NOT NULL,
  amount_invoiced DECIMAL(15,2)  NOT NULL,
  amount_paid; DECIMAL(15,2) NOT NULL
);
CREATE TABLE status_transaction (
  id_status INT DEFAULT NULL AUTO_INCREMENT PRIMARY KEY,
  status_t VARCHAR(20) NOT NULL
);
CREATE TABLE type_transaction (
  id_type INT DEFAULT NULL AUTO_INCREMENT PRIMARY KEY,
  type_t VARCHAR(80) NOT NULL
);
CREATE TABLE platform (
  id_platform INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name_platform VARCHAR(80)  NOT NULL
);
CREATE TABLE transactions (
  id_transaction VARCHAR(20) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  transaction_amount DECIMAL(15,2) NOT NULL,
  date_hour_transaction DATETIME NOT NULL,
  id_status INT DEFAULT NULL,
  id_type INT DEFAULT NULL,
  id_clients INT NOT NULL,
  id_platform INT NOT NULL,
  id_invoice INT NOT NULL,
  FOREIGN KEY (id_status) REFERENCES status_transaction(id_status) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (id_type) REFERENCES type_transaction(id_type) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (id_clients) REFERENCES clients(id_clients) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (id_platform) REFERENCES platform(id_platform) ON DELETE RESTRICT ON UPDATE CASCADE,
  FOREIGN KEY (id_invoice) REFERENCES invoice(id_invoice) ON DELETE RESTRICT ON UPDATE CASCADE
);