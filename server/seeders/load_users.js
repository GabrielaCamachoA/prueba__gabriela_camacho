//cargara los usuarios a la base de datos
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { pool } from '../connection_db.js';

export async function onloadUsers() {
    const rutaArchivo = path.resolve('server/data/users.csv');
    const users = [];
    return new Promise((resolve, reject) => {
        fs.createReadStream(rutaArchivo).pipe(csv({ separator: ";" }))
        .on("data", (rows) =>{
            users.push([
                rows.username,
                rows.user_identification,
                rows.email,
                rows.telephone
            ]);
        })
        .on("end", async () => {
            try {
                const sql= 'INSERT INTO users(username,user_identification,email,telephone) VALUES ?';
                const [result] = await pool.query(sql, [users]);
                console.log(`Se insertaron ${result.affectedRows} usuarios`);
                resolve();
            } catch (error) {
                console.log("Error", error);
                reject(error);
            }
        })
        .on("error", (err) =>{
            console.error("Error al leer el archivo", err.message);
            reject(err);
        });
    });
}