const crypto = require('crypto');

function generateJwtSecret() {
  return crypto.randomBytes(32).toString('hex');
}

const jwtSecret = generateJwtSecret();
console.log('JWT Secret:', jwtSecret);