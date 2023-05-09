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
const key = fs.readFileSync(path.join(__dirname, '..', '\\\apiCandidatos\\sslDesarrollo', 'key.pem'));
const cert = fs.readFileSync(path.join(__dirname, '..', '\\\apiCandidatos\\sslDesarrollo', 'cert.pem'));

const credentials = { key: key, cert: cert, passphrase: '123456' };

const httpsServer = https.createServer(credentials, app);


// Inicia el servidor HTTPS en el puerto 3000
httpsServer.listen(3000, () => {
  console.log("Servidor HTTPS iniciado en el puerto 3000");
});
// Inicia el servidor
// const port = process.env.PORT || 3000;
// app.listen(port, () => {
//   console.log(`Servidor iniciado en el puerto ${port}`);
// });