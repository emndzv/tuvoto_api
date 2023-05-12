const express = require('express');
const app = express();
const router = express.Router();
const authenticateJWT = require('../middleware/authenticateJWT');
const pool = require('../db/dbAdmin');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Ruta de inicio de sesión para administradores
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const query = "select * from users where email =  $1 and id_rol = 2";
    const result = await pool.query(query, [email]);

    if (result.rowCount === 0) {
      return res.status(401).json({ error: "Credenciales no válidas" });
    }

    const user = result.rows[0];
    console.log(user);
    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return res.status(401).json({ error: "Credenciales no válidas" });
    }

    // Generar el token JWT
    const payload = {
      id: user.id_user,
      rol: user.id_rol
    };

    const options = {
      expiresIn: "1h",
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, options);

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Rutas protegidas que requieren autenticación

// Ejemplo de ruta protegida para administradores
router.get("/perfil", authenticateJWT, async (req, res) => {
  try {
    console.log(req.user.id)
    const userId = req.user.id;

    const query = "select * from users where id_user = $1 and id_rol = 2";
    const result = await pool.query(query, [userId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Administrador no encontrado" });
    }

    const user = result.rows[0];
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});


// Ejemplo de ruta protegida para administradores
router.get("/partidos", authenticateJWT, async (req, res) => {
  try {
    const query = "select * from groupings";
    const result = await pool.query(query);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Administrador no encontrado" });
    }

    const user = result.rows;
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});


// Ejemplo de ruta protegida para administradores
router.get("/candidatos", authenticateJWT, async (req, res) => {
  try {
    const query = "select * from candidates a inner join groupings g on a.id_group=g.id_group inner join locations l on l.id_location =a.id_location ";
    const result = await pool.query(query);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Administrador no encontrado" });
    }

    const user = result.rows;
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});


module.exports = router;
