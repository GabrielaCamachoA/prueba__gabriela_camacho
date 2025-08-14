//load transactions to the database
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { pool } from '../connection_db.js';

export async function loadTransaction() {
    const routeArchive = path.resolve('server/data/transaction.csv');
    const transaction = [];
    return new Promise((resolve, reject) => {
        fs.createReadStream(routeArchive).pipe(csv({ separator: ";" }))
        .on("data", (rows) =>{
            transaction.push([
                rows.id_transaction,
                rows.transaction_amount,
                rows.date_hour_transaction,
                rows.id_status,
                rows.id_type,
                rows.id_clients,
                rows.id_platform,
                rows.id_invoice
            ]);
        })
        .on("end", async () => {
            try {
                const sql= 'INSERT INTO transactions (id_transaction,transaction_amount,date_hour_transaction,id_status,id_type,id_clients,id_platform,id_invoice) VALUES ?';
                const [result] = await pool.query(sql, [transaction]);
                console.log(`They inserted ${result.affectedRows} transactions`);
                resolve();
            } catch (error) {
                console.log("Error loading transactions", error);
                reject(error);
            }
        })
        .on("error", (err) =>{
            console.error("Error reading file", err.message);
            reject(err);
        });
    });
}