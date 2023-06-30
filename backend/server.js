const express = require('express');
const mysql = require('mysql');

//Necesario para autenticar al usuario
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//Middleware CORS
const cors = require('cors');

const app = express();

const PORT = 8000; // Puedes cambiar el puerto si lo deseas

// Configuración de la conexión a MySQL
const connection = mysql.createConnection({
  host: 'localhost', // Cambia esto según la configuración de tu base de datos
  user: 'root',
  password: '12345678',
  database: '5_ciclo_integrador'
});

connection.connect((error) => {
  if (error) {
    console.error('Error al conectar a la base de datos:', error);
  } else {
    console.log('Conexión exitosa a la base de datos MySQL');
  }
});

app.listen(PORT, () => {
  console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Agregar el middleware CORS
app.use(cors());

//LOGIN

// Ruta GET para obtener todos los usuarios
app.get('/api/usuarios', (req, res) => {
  const query = 'SELECT * FROM usuarios';

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error al obtener los usuarios:', error);
      res.status(500).json({ error: 'Ocurrió un error al obtener los usuarios' });
    } else {
      res.json(results);
    }
  });
});

// Endpoint de autenticación
app.post("/api/usuarios/login", (req, res) => {
  const { correo, password } = req.body;

  // Verificar las credenciales del usuario en la base de datos
  const query = "SELECT * FROM usuarios WHERE correo = ? AND password = ?";
  connection.query(query, [correo, password], (error, results) => {
    if (error) {
      console.error("Error al verificar las credenciales:", error);
      res.status(500).json({ error: "Ocurrió un error al verificar las credenciales" });
    } else if (results.length > 0) {
      // Las credenciales son válidas, generamos un token de acceso
      const accessToken = jwt.sign({ correo }, "secretKey");

      // Enviar el token de acceso como respuesta
      res.json({ accessToken });
    } else {
      // Las credenciales no son válidas, enviamos una respuesta con código de estado 401 Unauthorized
      res.status(401).json({ error: "Credenciales inválidas" });
    }
  });
});

// Ruta POST para registrar un nuevo usuario
app.post('/api/usuarios', (req, res) => {
  const { nombre, correo, password } = req.body;

  // Verificar si el usuario ya existe en la base de datos
  const checkUserQuery = 'SELECT * FROM usuarios WHERE correo = ?';
  connection.query(checkUserQuery, [correo], (error, results) => {
    if (error) {
      console.error('Error al verificar el usuario:', error);
      res.status(500).json({ error: 'Ocurrió un error al verificar el usuario' });
    } else if (results.length > 0) {
      res.status(400).json({ error: 'El usuario ya existe' });
    } else {
      // Insertar el nuevo usuario en la base de datos
      const insertUserQuery = 'INSERT INTO usuarios (nombre, correo, password) VALUES (?, ?, ?)';
      const values = [nombre, correo, password];

      connection.query(insertUserQuery, values, (error, result) => {
        if (error) {
          console.error('Error al registrar un usuario:', error);
          res.status(500).json({ error: 'Ocurrió un error al registrar un usuario' });
        } else {
          res.json({ message: 'Usuario registrado exitosamente' });
        }
      });
    }
  });
});

//TRABAJADORES
// Ruta GET para obtener datos desde la base de datos
app.get('/api/trabajadores', (req, res) => {
  const query = 'SELECT * FROM trabajadores';

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error al ejecutar la consulta:', error);
      res.status(500).json({ error: 'Ocurrió un error al obtener los datos' });
    } else {
      res.json(results);
    }
  });
});

// Ruta POST para crear un nuevo trabajador
app.post('/api/trabajadores', (req, res) => {
  const { nombre, numero_identificacion, habilidades, certificaciones } = req.body;

  const query = 'INSERT INTO trabajadores (nombre, numero_identificacion, habilidades, certificaciones) VALUES (?, ?, ?, ?)';
  const values = [nombre, numero_identificacion, habilidades, certificaciones];

  connection.query(query, values, (error, result) => {
    if (error) {
      console.error('Error al crear un trabajador:', error);
      res.status(500).json({ error: 'Ocurrió un error al crear un trabajador' });
    } else {
      res.json({ message: 'Trabajador creado exitosamente' });
    }
  });
});

// Ruta PUT para actualizar un trabajador existente
app.put('/api/trabajadores/:id', (req, res) => {
  const idtrabajadores = req.params.id;
  const { nombre, numero_identificacion, habilidades, certificaciones } = req.body;

  const query = 'UPDATE trabajadores SET nombre = ?, numero_identificacion = ?, habilidades = ?, certificaciones = ? WHERE idtrabajadores = ?';
  const values = [nombre, numero_identificacion, habilidades, certificaciones, idtrabajadores];

  connection.query(query, values, (error, result) => {
    if (error) {
      console.error('Error al actualizar el trabajador:', error);
      res.status(500).json({ error: 'Ocurrió un error al actualizar el trabajador' });
    } else {
      res.json({ message: 'Trabajador actualizado exitosamente' });
    }
  });
});

// Ruta DELETE para eliminar un trabajador existente
app.delete('/api/trabajadores/:id', (req, res) => {
  const idtrabajadores = req.params.id;

  const query = 'DELETE FROM trabajadores WHERE idtrabajadores = ?';
  const values = [idtrabajadores];

  connection.query(query, values, (error, result) => {
    if (error) {
      console.error('Error al eliminar el trabajador:', error);
      res.status(500).json({ error: 'Ocurrió un error al eliminar el trabajador' });
    } else {
      res.json({ message: 'Trabajador eliminado exitosamente' });
    }
  });
});
