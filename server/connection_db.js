import mysql from "mysql2/promise";
import dotenv  from "dotenv";
dotenv.config(); // cargar variables de .env

export const pool = mysql.createPool({
  host: process.env.BD_HOST,
  user: process.env.BD_USER,
  password: process.env.BD_PWD,
  database: process.env.BD_NAME,
  port: process.env.BD_PORT,
  connectionLimit:10, //maximum number of active connections at the same time
  waitForConnections: true, // If the limit is reached, new requests wait their turn.
  queueLimit: 0 // maximum number of requests waiting (0= no limit)
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
test_connection()