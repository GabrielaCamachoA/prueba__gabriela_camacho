//cargara los prestamos a la base de datos
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { pool } from '../connection_db.js';

export async function onloadLoans() {
    const rutaArchivo = path.resolve('server/data/loans.csv');
    const loans = [];
    return new Promise((resolve, reject) => {
        fs.createReadStream(rutaArchivo).pipe(csv({ separator: ";" }))
        .on("data", (rows) =>{
            loans.push([
                rows.id_loans,
                rows.id_user,
                rows.isbn,
                rows.loan_date,
                rows.return_date,
                rows.status
            ]);
        })
        .on("end", async () => {
            try {
                const sql= 'INSERT INTO loans(id_loans,id_user,isbn,loan_date,return_date,status) VALUES ?';
                const [result] = await pool.query(sql, [loans]);
                console.log(`Se insertaron ${result.affectedRows} prestamos`);
                resolve();
            } catch (error) {
                console.log("Error en caragr los prestamos", error);
                reject(error);
            }
        })
        .on("error", (err) =>{
            console.error("Error al leer el archivo", err.message);
            reject(err);
        });
    });
}