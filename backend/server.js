const express = require('express');
const app = express();
const PORT = 8000; // Puedes cambiar el puerto si lo deseas

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

app.get('/api/data', (req, res) => {
  res.json({ message: 'Datos desde el servidor Express' });
});

