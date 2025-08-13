import express from "express"; // permite manejar rutas y petciones (endpoints). se crea app
import { pool } from "./connection_db.js";
import cors from 'cors';


const app = express();
app.use(cors()) // esto permite que la aplicacion backend pueda ser consumida por una aplicacion frontend
app.use(express.json()); // la informacion vendra en formato json

app.get("/", async (req, res) => {
  // req: entra la info. res:sale la info
  res.send("server online");
});

// CRUD PRESTAMOS
// GET
app.get("/loans", async (req, res) => {
  try {
    const query = `
    SELECT loans.id_loans AS loans, 
    users.username, book.isbn, book.title AS book,
    book.author
    FROM loans
    JOIN users ON users.id_user = loans.id_user
    JOIN book ON book.isbn = loans.isbn;`;

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

//busqueda por id
app.get("/loans/:id_loans", async (req, res) => {
  try {
    const { id_loans } = req.params; // entrara como parametro
    const query = `
    SELECT loans.id_loans AS loans, 
    users.username, book.isbn, book.title AS book,
    book.author
    FROM loans
    JOIN users ON users.id_user = loans.id_user
    JOIN book ON book.isbn = loans.isbn WHERE id_loans = ?;`;

    const [rows] = await pool.query(query, id_loans);
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
app.post("/loans", async (req, res) => {
  try {
    const { id_user, isbn, loan_date, return_date, status } = req.body; // acá entrara la info

    const query = `INSERT INTO loans(id_user,isbn,loan_date,return_date,status) 
    VALUES (?,?,?,?,?)`;
    const values = [
      // array con los valores del cuerpo
      id_user,
      isbn,
      loan_date,
      return_date,
      status,
    ];
    const [result] = await pool.query(query, values);
    res.status(201).json({
      mensaje: "Ingresado correctamente",
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
app.put("/loans/:id_loans", async (req, res) => {
  try {
    const { id_loans } = req.params; // entrara como parametro
    const { id_user, 
        isbn, 
        loan_date, 
        return_date, 
        status } = req.body; // acá entrara la info

    const query = `UPDATE loans SET
    id_user = ?,
    isbn = ?,
    loan_date = ?,
    return_date = ?,
    status= ?
    WHERE id_loans = ?
    `;
    const values = [
      // array con los valores del cuerpo
      id_user,
      isbn,
      loan_date,
      return_date,
      status,
      id_loans
    ];
    const [result] = await pool.query(query, values);
    if (result.affectedRows != 0) {
     return res.json({mensaje:"prestamo actualizado"})
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
app.delete("/loans/:id_loans", async (req,res) => {
    try {
    const { id_loans } = req.params // entrara como parametro
    
    const query = `DELETE FROM loans WHERE id_loans = ?`
    
    const [result] = await pool.query(query, [id_loans]);
     if (result.affectedRows > 0) {
      return res.json({ mensaje: "Préstamo eliminado" });
    } else {
      return res.status(404).json({ mensaje: "Préstamo no encontrado" });
    }
  } catch (error) {
    res.status(500).json({
      status: "error ",
      endpint: req.originalUrl,
      method: req.method,
      message: error.message,
    });
  }
})

// enpoints con consultas especificas
// 1. Ver todos los préstamos de un usuario
app.get('/prestamos/usuario/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query(`
            SELECT 
                p.id_prestamo,
                p.fecha_prestamo,
                p.fecha_devolucion,
                p.estado,
                l.isbn,
                l.titulo AS libro
            FROM prestamos p
            LEFT JOIN libros l ON p.isbn = l.isbn
            WHERE p.id_usuario = ?
        `, [id]);

        res.json(rows);
    } catch (error) {
        res.status(500).json({
            status: 'error',
            endpoint: req.originalUrl,
            method: req.method,
            message: error.message
        });
    }
});

// 2. Listar los 5 libros más prestados
app.get('/libros/mas-prestados', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                l.isbn,
                l.titulo,
                COUNT(p.id_prestamo) AS total_prestamos
            FROM prestamos p
            LEFT JOIN libros l ON p.isbn = l.isbn
            GROUP BY l.isbn, l.titulo
            ORDER BY total_prestamos DESC
            LIMIT 5
        `);

        res.json(rows);
    } catch (error) {
        res.status(500).json({
            status: 'error',
            endpoint: req.originalUrl,
            method: req.method,
            message: error.message
        });
    }
});

// 3. Listar usuarios con préstamos en estado "retrasado"
app.get('/usuarios/con-retrasos', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT DISTINCT
                u.id_usuario,
                u.nombre_completo
            FROM prestamos p
            LEFT JOIN usuarios u ON p.id_usuario = u.id_usuario
            WHERE p.estado = 'retrasado'
        `);

        res.json(rows);
    } catch (error) {
        res.status(500).json({
            status: 'error',
            endpoint: req.originalUrl,
            method: req.method,
            message: error.message
        });
    }
});

// 4. Listar préstamos activos
app.get('/prestamos/activos', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                p.id_prestamo,
                p.fecha_prestamo,
                p.fecha_devolucion,
                p.estado,
                u.nombre_completo AS usuario,
                l.titulo AS libro
            FROM prestamos p
            LEFT JOIN usuarios u ON p.id_usuario = u.id_usuario
            LEFT JOIN libros l ON p.isbn = l.isbn
            WHERE p.estado = 'activo'
        `);

        res.json(rows);
    } catch (error) {
        res.status(500).json({
            status: 'error',
            endpoint: req.originalUrl,
            method: req.method,
            message: error.message
        });
    }
});

// 5. Historial de un libro por su ISBN
app.get('/prestamos/historial/:isbn', async (req, res) => {
    try {
        const { isbn } = req.params;
        const [rows] = await pool.query(`
            SELECT 
                p.id_prestamo,
                p.fecha_prestamo,
                p.fecha_devolucion,
                p.estado,
                u.nombre_completo AS usuario
            FROM prestamos p
            LEFT JOIN usuarios u ON p.id_usuario = u.id_usuario
            WHERE p.isbn = ?
            ORDER BY p.fecha_prestamo DESC
        `, [isbn]);

        res.json(rows);
    } catch (error) {
        res.status(500).json({
            status: 'error',
            endpoint: req.originalUrl,
            method: req.method,
            message: error.message
        });
    }
});

app.listen(3000, () => {
  console.log("El servidor inicio y esta corriendo en http://localhost:3000");
});
