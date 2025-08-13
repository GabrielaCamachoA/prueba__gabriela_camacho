import mysql from "mysql2/promise";
import dotenv  from "dotenv";
dotenv.config(); // cargar variables de .env

export const pool = mysql.createPool({
  host: process.env.BD_HOST,
  user: process.env.BD_USER,
  password: process.env.BD_PWD,
  database: process.env.BD_NAME,
  port: process.env.BD_PORT,
  connectionLimit:10, //máximo numero de conexiones activas al mismo tiempo
  waitForConnections: true, // si se alcanza el limite, las nuevas peticiones esperan su turno
  queueLimit: 0 // numero maximo de peticiones en espera (0= sin limites)
});

async function test_connection() {
    try {
       const connection = await pool.getConnection();
       console.log("Conexion exitosa");
       connection.release();
        
    } catch (error) {
       console.log("Error en la conexion", error);
        
    }
}
