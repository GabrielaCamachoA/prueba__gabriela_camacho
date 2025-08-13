//cargara los libros a la base de datos
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { pool } from '../connection_db.js';

export async function onloadBook() {
    const rutaArchivo = path.resolve('server/data/book.csv');
    const book = [];
    return new Promise((resolve, reject) => {
        fs.createReadStream(rutaArchivo).pipe(csv({ separator: ";" }))
        .on("data", (rows) =>{
            book.push([
                rows.title.trim(),
                rows.isbn,
                rows.publication_year,
                rows.author
            ]);
        })
        .on("end", async () => {
            try {
                const sql= 'INSERT INTO book(title,isbn,publication_year,author) VALUES ?';
                const [result] = await pool.query(sql, [book]);
                console.log(`Se insertaron ${result.affectedRows} libros`);
                resolve();
            } catch (error) {
                console.log("Error en caragr los libros", error);
                reject(error);
            }
        })
        .on("error", (err) =>{
            console.error("Error al leer el archivo", err.message);
            reject(err);
        });
    });
}