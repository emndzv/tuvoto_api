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
const query = "select a.id_rol, a.id_group , g.name as \"group_name\", a.name as \"candadite_name\", a.lastname as \"candidate_lastname\", a.date_birth as \"candidate_date_birth\", a.status  as \"candidate_status\", a.picture  as \"candidate_picture\", a.date_add as \"candidate_add\", a.date_update  as \"candidate_update\", g.name  as \"grouping_name\", g.acronimo  as \"grouping_acronimo\", g.logo  as \"grouping_acronimo\", g.affiliates as \"grouping_affiliates\", g.ideology  as \"grouping_ideology\", g.date_record  as \"grouping_date_record\", g.status  as \"grouping_status\", g.date_update  as \"grouping_date_update\", l.name as \"candidate_location\", ls.name as \"candidate_place_birth\" from candidates a inner join groupings g on a.id_group =g.id_group  inner join locations l on l.id_location =a.id_location  inner join locations ls on l.id_location =a.place_birth";

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
router.get("/candidatos/:candidate_id", authenticateJWT, async (req, res) => {
  try {
    const candidate_id = req.params.candidate_id;
 const query = "SELECT a.id_rol, a.id_group, g.name AS \"group_name\", a.name AS \"candadite_name\"," +
      " a.lastname AS \"candidate_lastname\", a.date_birth AS \"candidate_date_birth\"," +
      " a.status AS \"candidate_status\", a.picture AS \"candidate_picture\", a.date_add AS \"candidate_add\"," +
      " a.date_update AS \"candidate_update\", g.name AS \"grouping_name\", g.acronimo AS \"grouping_acronimo\"," +
      " g.logo AS \"grouping_acronimo\", g.affiliates AS \"grouping_affiliates\"," +
      " g.ideology AS \"grouping_ideology\", g.date_record AS \"grouping_date_record\"," +
      " g.status AS \"grouping_status\", g.date_update AS \"grouping_date_update\"," +
      " l.name AS \"candidate_location\", ls.name AS \"candidate_place_birth\"" +
      " FROM candidates a" +
      " INNER JOIN groupings g ON a.id_group = g.id_group" +
      " INNER JOIN locations l ON l.id_location = a.id_location" +
      " INNER JOIN locations ls ON l.id_location = a.place_birth" +
      ` WHERE a.id_candidate = ${candidate_id}`;
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
