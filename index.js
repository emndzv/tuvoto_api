const express = require("express");
const app = express();
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const https = require("https");
const fs = require("fs");
const path = require('path');
require("dotenv").config();

// Configuración de CORS
app.use(cors());

// Middleware para analizar el cuerpo de las solicitudes
app.use(express.json());


// Importar las rutas
const adminRoutes = require('./routes/admin');


// Rutas de la API
app.use('/tuvoto', adminRoutes);

// Lee los archivos del certificado y la clave privada
const key = fs.readFileSync('/tuvoto_pro/tuvoto_api/sslDesarrollo/key.pem');
const cert = fs.readFileSync('/tuvoto_pro/tuvoto_api/sslDesarrollo/cert.pem');

const credentials = { key: key, cert: cert, passphrase: '123456' };

const httpsServer = https.createServer(credentials, app);
httpsServer.listen('443','172.26.0.101');
// Inicia el servidor
// const port = process.env.PORT || 3000;
// app.listen(port, () => {
//   console.log(`Servidor iniciado en el puerto ${port}`);
// });
