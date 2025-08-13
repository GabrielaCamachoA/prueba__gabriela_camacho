//load platforms to the database
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { pool } from '../connection_db.js';

export async function loadPlatform() {
    const routeArchive = path.resolve('server/data/platform.csv');
    const platform = [];
    return new Promise((resolve, reject) => {
        fs.createReadStream(routeArchive).pipe(csv({ separator: ";" }))
        .on("data", (rows) =>{
            platform.push([
                rows.id_platform,
                rows.name_platform.trim()
            ]);
        })
        .on("end", async () => {
            try {
                const sql= 'INSERT INTO platform(id_platform,name_platform) VALUES ?';
                const [result] = await pool.query(sql, [platform]);
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