//load invoices to the database
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { pool } from '../connection_db.js';

export async function loadInvoice() {
    const routeArchive = path.resolve('server/data/invoice.csv');
    const invoice = [];
    return new Promise((resolve, reject) => {
        fs.createReadStream(routeArchive).pipe(csv({ separator: ";" }))
        .on("data", (rows) =>{
            invoice.push([
                rows.id_invoice,
                rows.invoice_number,
                rows.invoicing_period,
                rows.amount_invoiced,
                rows.amount_paid
            ]);
        })
        .on("end", async () => {
            try {
                const sql= 'INSERT INTO invoice(id_invoice,invoice_number,invoicing_period,amount_invoiced,amount_paid) VALUES ?';
                const [result] = await pool.query(sql, [invoice]);
                console.log(`They inserted ${result.affectedRows} invoice`);
                resolve();
            } catch (error) {
                console.log("Error loading invoice", error);
                reject(error);
            }
        })
        .on("error", (err) =>{
            console.error("Error reading file", err.message);
            reject(err);
        });
    });
}