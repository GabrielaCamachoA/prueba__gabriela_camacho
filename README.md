# Data Management System


## System Description
This project is a financial information management system for a client in the electric sector of Colombia.  
The client had problems managing disorganized data from Fintech platforms like Nequi and Daviplata.  

The system organizes, stores, and manages this information in a SQL database, supports CSV bulk loading, includes a CRUD API, and provides advanced queries for business needs.

## How to Run the Project

### 1. Clone the Repository
```bash
git clone <repository_url>
cd <project_folder>

```
### 2. Install dependices
```bash
npm i

```
### 3. Open DataBase
Run the script in script.sql to create all tables:
```bash
docs/script.sql

```
### 4. Bulk Load Data from CSV
1. Convert the provided Excel file to .csv.
2. Place the .csv file in the data/ folder.
3. Run the bulk load script:
```bash
node server/seeders/run_seeders.js

```
## Advanced Queries
1. Total Paid per Client
Returns the sum of all payments made by each client:
``` sql
SELECT 
    c.fullname,
    SUM(i.amount_paid) AS total_paid
FROM clients c
JOIN transaction t ON c.id_clients = t.id_clients
JOIN invoice i ON t.id_invoice = i.id_invoice
GROUP BY c.id_clients, c.fullname;
```
## Technologies Used
- Node.js – Backend server
- Express.js – API framework
- Bootstrap – Frontend styling
- MySQL – Relational database
- Postman – API testing
- Draw.io – Database model design

## Normalization Process
The database was designed using First (1NF), Second (2NF), and Third (3NF) normal forms:
- 1NF – Removed repeating groups, each cell contains atomic values.
- 2NF – Removed partial dependencies, separating data into related tables.
- 3NF – Removed transitive dependencies, keeping only relevant attributes in each table.

This ensures data consistency, avoids duplication, and improves query performance.
This process creates six tables: clients, invoices, platform, transaction status, transaction type, and transactions.

## Relational Model
![relational model](/docs/relational-model.png)

## Developer Info
- Name: Gabriela Camacho
- Clan: Macondo
- Email. gabrielacacosta31@gmail.com
