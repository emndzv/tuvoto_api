const bcrypt = require('bcrypt');

const saltRounds = 10;
const plainTextPassword = 'soyunusuario'; // Reemplaza esto con la password real del estudiante

bcrypt.hash(plainTextPassword, saltRounds, (err, hashedStudentPassword) => {
  if (err) {
    console.error('Error al hashear la password:', err);
    return;
  }

  console.log('password hasheada:', hashedStudentPassword);

  // Utiliza el hashedStudentPassword en la consulta SQL de inserción o donde sea necesario
});