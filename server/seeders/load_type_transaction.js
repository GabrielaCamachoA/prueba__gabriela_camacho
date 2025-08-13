//load type of transaction to the database
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { pool } from '../connection_db.js';

export async function loadType() {
    const routeArchive = path.resolve('server/data/type_transaction.csv');
    const type = [];
    return new Promise((resolve, reject) => {
        fs.createReadStream(routeArchive).pipe(csv({ separator: ";" }))
        .on("data", (rows) =>{
            type.push([
                rows.id_type,
                rows.type_t.trim()
            ]);
        })
        .on("end", async () => {
            try {
                const sql= 'INSERT INTO type_transaction(id_type,type_t) VALUES ?';
                const [result] = await pool.query(sql, [type]);
                console.log(`They inserted ${result.affectedRows} type of transaction`);
                resolve();
            } catch (error) {
                console.log("Error loading types", error);
                reject(error);
            }
        })
        .on("error", (err) =>{
            console.error("Error reading file", err.message);
            reject(err);
        });
    });
}