//load clients into the database
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { pool } from '../connection_db.js';

export async function loadClients() {
    const routeArchive = path.resolve('server/data/clients.csv');
    const clients = [];
    return new Promise((resolve, reject) => {
        fs.createReadStream(routeArchive).pipe(csv({ separator: ";" }))
        .on("data", (rows) =>{
            clients.push([
                rows.id_clients,
                rows.fullname.trim(),
                rows.user_identification,
                rows.direction,
                rows.telephone,
                rows.email
            ]);
        })
        .on("end", async () => {
            try {
                const sql= 'INSERT INTO clients(id_clients,fullname,user_identification,direction,telephone,email) VALUES ?';
                const [result] = await pool.query(sql, [clients]);
                console.log(`They inserted ${result.affectedRows} clients`);
                resolve();
            } catch (error) {
                console.log("Error loading clients", error);
                reject(error);
            }
        })
        .on("error", (err) =>{
            console.error("Error reading file", err.message);
            reject(err);
        });
    });
}