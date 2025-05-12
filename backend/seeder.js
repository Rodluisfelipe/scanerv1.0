const dotenv = require('dotenv');
const User = require('./models/User');
const connectDB = require('./config/db');

// Cargar variables de entorno
dotenv.config();

// Conectar a la base de datos
connectDB();

// Crear usuario por defecto
const createDefaultUser = async () => {
  try {
    // Comprobar si ya existe el usuario por defecto
    const userExists = await User.findOne({ username: 'admin' });

    if (userExists) {
      console.log('El usuario por defecto ya existe');
      process.exit();
    }

    // Crear usuario por defecto
    await User.create({
      username: 'admin',
      email: 'tecnophone@technophone.co',
      password: 'admin123'
    });

    console.log('Usuario por defecto creado exitosamente');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Ejecutar script
createDefaultUser(); 