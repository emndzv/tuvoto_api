const jwt = require("jsonwebtoken");

const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Token de autorización no proporcionado" });
  }

  const tokenWithoutBearer = token.split(" ")[1]; // Extraer solo el token sin el prefijo "Bearer"

  jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Token de autorización inválido" });
    }

    req.user = user; // Guardar la información del usuario en el objeto `req` para usarla en las rutas protegidas
    next();
  });
};

module.exports = authenticateJWT;