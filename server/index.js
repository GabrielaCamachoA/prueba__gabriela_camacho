import express from "express"; // allows you to manage routes and requests (endpoints). app is created
import { pool } from "./connection_db.js";
import cors from "cors";

const app = express();
app.use(cors()); // This allows the backend application to be consumed by a frontend application.
app.use(express.json()); // The information will be in JSON format.

  //req: info goes in     res:info comes out


// CRUD for clients
// GET
app.get("/clients", async (req, res) => {
  try {
    const query = `
    SELECT id_clients,fullname,user_identification,direction,email,telephone
    FROM clients;`;

    const [rows] = await pool.query(query);
    return res.json(rows);
  } catch (error) {
    res.status(500).json({
      status: "error ",
      endpint: req.originalUrl,
      method: req.method,
      message: error.message,
    });
  }
});

//get by id
app.get("/clients/:id_clients", async (req, res) => {
  try {
    const { id_clients } = req.params; // entered as a parameter
    const query = `
    SELECT * FROM clients WHERE id_clients = ?;`;

    const [rows] = await pool.query(query, id_clients);
    return res.json(rows[0]);
  } catch (error) {
    res.status(500).json({
      status: "error ",
      endpint: req.originalUrl,
      method: req.method,
      message: error.message,
    });
  }
});

//POST
app.post("/clients", async (req, res) => {
  try {
    const { fullname, user_identification, direction, email, telephone } =
      req.body; // info will go here

    const query = `INSERT INTO clients(fullname, user_identification,direction,email,telephone) 
    VALUES (?,?,?,?,?)`;
    const values = [
      // array with the values of the body
      fullname,
      user_identification,
      direction,
      email,
      telephone,
    ];
    const [result] = await pool.query(query, values);
    res.status(201).json({
      mensaje: "Logged in successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "error ",
      endpint: req.originalUrl,
      method: req.method,
      message: error.message,
    });
  }
});

// PUT
app.put("/clients/:id_clients", async (req, res) => {
  try {
    const { id_clients } = req.params; // entrara como parametro
    const { fullname, user_identification, direction, email, telephone } =
      req.body; // acá entrara la info

    const query = `UPDATE clients SET
    fullname = ?,
    user_identification = ?,
    direction = ?,
    email = ?,
    telephone= ?
    WHERE id_clients = ?
    `;
    const values = [
      // array con los valores del cuerpo
      fullname,
      user_identification,
      direction,
      email,
      telephone,
      id_clients,
    ];
    const [result] = await pool.query(query, values);
    if (result.affectedRows != 0) {
      return res.json({ mensaje: "Update client" });
    }
  } catch (error) {
    res.status(500).json({
      status: "error ",
      endpint: req.originalUrl,
      method: req.method,
      message: error.message,
    });
  }
});
//DELETE
app.delete("/clients/:id_clients", async (req, res) => {
  try {
    const { id_clients } = req.params; // entrara como parametro

    const query = `DELETE FROM clients WHERE id_clients = ?`;

    const [result] = await pool.query(query, [id_clients]);
    if (result.affectedRows > 0) {
      return res.json({ mensaje: "Delete cliente" });
    } else {
      return res.status(404).json({ mensaje: "Client not found" });
    }
  } catch (error) {
    res.status(500).json({
      status: "error ",
      endpint: req.originalUrl,
      method: req.method,
      message: error.message,
    });
  }
});

// advanced queries
// total payment of clients
app.get("/clients/total-payment", async (req, res) => {
  try {
    const [rows] = await pool.query(`
          SELECT 
          c.fullname,
          SUM(i.amount_paid) AS total_paid
          FROM clients c
          JOIN transaction t ON c.id_clients = t.id_clients
          JOIN invoice i ON t.id_invoice = i.id_invoice
          GROUP BY c.id_clients, c.fullname;  
        `);

    res.json(rows);
  } catch (error) {
    res.status(500).json({
      status: "error",
      endpoint: req.originalUrl,
      method: req.method,
      message: error.message,
    });
  }
});
app.listen(3000, () => {
  console.log("El servidor inicio y esta corriendo en http://localhost:3000");
});
