//load status of transaction to the database
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { pool } from '../connection_db.js';

export async function loadStatus() {
    const routeArchive = path.resolve('server/data/status_transaction.csv');
    const status = [];
    return new Promise((resolve, reject) => {
        fs.createReadStream(routeArchive).pipe(csv({ separator: ";" }))
        .on("data", (rows) =>{
            status.push([
                rows.id_status,
                rows.status_t.trim()
            ]);
        })
        .on("end", async () => {
            try {
                const sql= 'INSERT INTO status_transaction(id_status,status_t) VALUES ?';
                const [result] = await pool.query(sql, [status]);
                console.log(`They inserted ${result.affectedRows} platform`);
                resolve();
            } catch (error) {
                console.log("Error loading platform", error);
                reject(error);
            }
        })
        .on("error", (err) =>{
            console.error("Error reading file", err.message);
            reject(err);
        });
    });
}