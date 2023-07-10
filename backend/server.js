const express = require('express');
const { Pool } = require('pg');

//Necesario para autenticar al usuario
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//Middleware CORS
const cors = require('cors');

const app = express();

const PORT = 8000; // Puedes cambiar el puerto si lo deseas

// Configuración de la conexión a postgres
const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  password: 'postgres',
  database: 'prueba3',
  port: 5432
});


pool.connect((error, client) => {
  if (error) {
    console.error('Error al conectar a la base de datos:', error);
  } else {
    console.log('Conexión exitosa a la base de datos PostgreSQL');

    // Consulta de prueba
    const query = 'SELECT * FROM usuarios_usu LIMIT 1';
    pool.query(query, (error, result) => {
      if (error) {
        console.error('Error al ejecutar la consulta:', error);
      } else {
        console.log('Resultado de la consulta:', result.rows);
      }
    });
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


// Ruta GET para obtener todos los usuarios
app.get('/api/usuarios', (req, res) => {
  const query = 'SELECT * FROM usuarios_usu';

  pool.query(query, (error, results) => {
    if (error) {
      console.error('Error al obtener los usuarios:', error);
      res.status(500).json({ error: 'Ocurrió un error al obtener los usuarios' });
    } else {
      res.json(results);
    }
  });
});

app.get('/api/usuarios/:usuCodigo/perfil', (req, res) => {
  const usuCodigo = req.params.usuCodigo;
  const query = 'SELECT * FROM usuarios_usu WHERE usu_codigo = $1';

  pool.query(query, [usuCodigo], (error, results) => {
    if (error) {
      console.error('Error al obtener el perfil del usuario:', error);
      res.status(500).json({ error: 'Ocurrió un error al obtener el perfil del usuario' });
    } else if (results.rows.length === 0) {
      res.status(404).json({ error: 'Usuario no encontrado' });
    } else {
      const perfilUsuario = results.rows[0];
      res.json(perfilUsuario);
    }
  });
});



// Ruta POST para ingresar
app.post('/api/usuarios/login', (req, res) => {
  const { codigo, clave } = req.body;

  console.log("Valor de codigo:", codigo);
  console.log("Valor de clave:", clave);

  // Verificar las credenciales del usuario en la base de datos
  const query = "SELECT usu.usu_codigo, usu.usu_clave = md5('0000') AS clave_inicial, ent.ent_rol FROM usuarios_usu usu INNER JOIN entidades_ent ent ON usu.usu_codigo = ent.usu_codigo WHERE usu.usu_codigo LIKE $1 AND usu.usu_clave LIKE md5($2) ";
  pool.query(query, [codigo, clave], (error, results) => {
    if (error) {
      console.error("Error al verificar las credenciales:", error);
      res.status(500).json({ error: "Ocurrió un error al verificar las credenciales" });
    } else if (results.rows.length > 0) {
      const { usu_codigo, clave_inicial, ent_rol } = results.rows[0];

      if (clave_inicial) {
        // Mostrar una alerta o mensaje para solicitar al usuario que actualice su contraseña
        res.json({ requiresPasswordUpdate: true, usu_codigo });
      } else {
        // Las credenciales son válidas, generamos un token de acceso
        const accessToken = jwt.sign({ codigo }, "secretKey");

        // Obtener los campos seleccionados de los resultados

        // Enviar los campos seleccionados como respuesta
        res.json({ usu_codigo, clave_inicial, ent_rol, accessToken });
        console.log(usu_codigo, clave_inicial, ent_rol);
        // Enviar el token de acceso como respuesta
      }
    } else {
      // Las credenciales no son válidas, enviamos una respuesta con código de estado 401 Unauthorized
      res.status(401).json({ error: "Credenciales inválidas" });
    }
  });
});


// Ruta POST para actualizar la contraseña de un usuario
app.post("/api/usuarios/actualizar-password", (req, res) => {
  const { newPassword, usuCodigo } = req.body;

  console.log("ACT -====>>>>", newPassword, usuCodigo);


  // Actualizar la contraseña en la base de datos
  const query = "UPDATE usuarios_usu SET usu_clave = md5($1) WHERE usu_codigo = $2";
  const values = [newPassword, usuCodigo];

  pool.query(query, values, (error, result) => {
    if (error) {
      console.error("Error al actualizar la contraseña:", error);
      res.status(500).json({ error: "Ocurrió un error al actualizar la contraseña" });
    } else {
      // Actualización de contraseña exitosa, enviar una respuesta exitosa
      res.json({ message: "Contraseña actualizada exitosamente" });
    }
  });
});

/*
// Ruta POST para registrar un nuevo usuario
app.post('/api/usuarios', (req, res) => {
  //si proporciona toda la informacion falta sacar los datos 
  const {codigo, clave } = req.body;

  // Verificar si el usuario ya existe en la base de datos
  const checkUserQuery = 'SELECT * FROM usuarios_usu WHERE usu_codigo LIKE $1';
  pool.query(checkUserQuery, [codigo], (error, results) => {
    if (error) {
      console.error('Error al verificar el usuario:', error);
      res.status(500).json({ error: 'Ocurrió un error al verificar el usuario' });
    } else if (results.rows.length > 0) {
      res.status(400).json({ error: 'El usuario ya existe' });
    } else {
      // Insertar el nuevo usuario en la base de datos
      const insertUserQuery = 'INSERT INTO usuarios_usu (usu_codigo, usu_clave) VALUES ($1, md5($2))';
      const values = [codigo, clave];

      pool.query(insertUserQuery, values, (error, result) => {
        if (error) {
          console.error('Error al registrar un usuario:', error);
          res.status(500).json({ error: 'Ocurrió un error al registrar un usuario' });
        } else {
          res.json({ message: 'Usuario registrado exitosamente' });
          // Si se proporciona toda la informacion 
         // Insertar el nuevo usuario en entidades
          const insertUserQuery = 'INSERT INTO entidades_ent (usu_codigo, ent_nombre, ent_nrodocumento , ent_sexo, ent_nrocelular, ent_rol, are_id, ent_activo) VALUES ($1, $2,$3, $4,$5, $6, $7)';
          const values = [codigo, nombre, nro_documento, sexo, rol, area_id, activo];

          pool.query(insertUserQuery, values, (error, result) => {
            if (error) {
              console.error('Error al registrar un usuario:', error);
              res.status(500).json({ error: 'Ocurrió un error al registrar un usuario' });
            } else {
              res.json({ message: 'Usuario registrado exitosamente' });
            }
          });
        }
      });
    }
  });
});
*/

// Ruta POST para registrar un nuevo usuario
app.post('/api/usuarios', (req, res) => {
  const { codigo, clave, nombre, nro_documento, sexo, nro_celular, correo, rol, area_id, activo } = req.body;

  const checkUserQuery = 'SELECT * FROM usuarios_usu WHERE usu_codigo = $1';
  pool.query(checkUserQuery, [codigo], (error, results) => {
    if (error) {
      console.error('Error al verificar el usuario:', error);
      res.status(500).json({ error: 'Ocurrió un error al verificar el usuario' });
    } else if (results.rows.length > 0) {
      res.status(400).json({ error: 'El usuario ya existe' });
    } else {
      const insertUserQuery = 'INSERT INTO usuarios_usu (usu_codigo, usu_clave) VALUES ($1, md5($2))';
      const userValues = [codigo, clave];

      pool.query(insertUserQuery, userValues, (error, result) => {
        if (error) {
          console.error('Error al registrar un usuario:', error);
          res.status(500).json({ error: 'Ocurrió un error al registrar un usuario' });
        } else {
          const insertEntityQuery = 'INSERT INTO entidades_ent (usu_codigo, ent_nombre, ent_nrodocumento, ent_sexo, ent_nrocelular, ent_correo, ent_rol, are_id, ent_activo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)';
          const entityValues = [codigo, nombre, nro_documento, sexo, nro_celular, correo, rol, area_id, activo];

          pool.query(insertEntityQuery, entityValues, (error, result) => {
            if (error) {
              console.error('Error al registrar un usuario:', error);
              res.status(500).json({ error: 'Ocurrió un error al registrar un usuario' });
            } else {
              res.json({ message: 'Usuario registrado exitosamente' });
            }
          });
        }
      });
    }
  });
});


// Ruta PUT para actualizar un usuario existente
app.put('/api/usuario/:id', (req, res) => {
  const codigoUsuario = req.params.id;
  const {clave} = req.body;

  const query = 'UPDATE usuarios_usu SET usu_clave = md5($1) WHERE usu_codigo = $2';
  const values = [clave , codigoUsuario ];

  pool.query(query, values, (error, result) => {
    if (error) {
      console.error('Error al actualizar actualizar un usuario existente:', error);
      res.status(500).json({ error: 'Ocurrió un error al actualizar actualizar un usuario existente' });
    } else {
      res.json({ message: 'Usuario actualizado exitosamente' });
    }
  });
});


// TRABAJADORES
// Ruta GET para obtener datos desde la base de datos
app.get('/api/trabajadores', (req, res) => {
  const query = 'SELECT * FROM entidades_ent WHERE ent_rol LIKE $1';
  const values = ['TRA'];
  pool.query(query, values, (error, results) => {
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
  const { codigo, nombre, numero_identificacion, sexo, celular, rol, correo, area_id, activo } = req.body;

  // Iniciar una transacción
  pool.query('BEGIN', (error) => {
    if (error) {
      console.error('Error al iniciar la transacción:', error);
      return res.status(500).json({ error: 'Ocurrió un error al crear un trabajador' });
    }

    // Insertar un nuevo usuario
    const queryInsertUsuario = 'INSERT INTO public.usuarios_usu (usu_codigo) VALUES ($1)';
    const valuesUsuario = [codigo];

    pool.query(queryInsertUsuario, valuesUsuario, (errorUsuario, resultsUsuario) => {
      if (errorUsuario) {
        console.error('Error al crear un usuario:', errorUsuario);
        pool.query('ROLLBACK', (rollbackError) => {
          if (rollbackError) {
            console.error('Error al realizar el rollback:', rollbackError);
          }
          return res.status(500).json({ error: 'Ocurrió un error al crear un usuario' });
        });
      } else {
        // Insertar un nuevo trabajador
        const queryInsertTrabajador = 'INSERT INTO public.entidades_ent (usu_codigo, ent_nombre, ent_nrodocumento, ent_sexo, ent_nrocelular, ent_correo, ent_rol, are_id, ent_activo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)';
        const valuesTrabajador = [codigo, nombre, numero_identificacion, sexo, celular, correo, rol , area_id, activo];

        pool.query(queryInsertTrabajador, valuesTrabajador, (errorTrabajador, resultsTrabajador) => {
          if (errorTrabajador) {
            console.error('Error al crear un trabajador:', errorTrabajador);
            pool.query('ROLLBACK', (rollbackError) => {
              if (rollbackError) {
                console.error('Error al realizar el rollback:', rollbackError);
              }
              return res.status(500).json({ error: 'Ocurrió un error al crear un trabajador' });
            });
          } else {
            // Commit de la transacción
            pool.query('COMMIT', (commitError) => {
              if (commitError) {
                console.error('Error al realizar el commit:', commitError);
                return res.status(500).json({ error: 'Ocurrió un error al crear un trabajador' });
              }
              res.json({ message: 'Trabajador creado exitosamente' });
            });
          }
        });
      }
    });
  });
});



// Ruta PUT para actualizar un trabajador existente
app.put('/api/trabajadores/:id', (req, res) => {
  const trabajadorId = req.params.id;
  const { nombre, numero_identificacion, sexo, celular, correo, rol , area_id, activo} = req.body;

  const query = 'UPDATE entidades_ent SET ent_nombre = $1 , ent_nrodocumento = $2, ent_sexo = $3, ent_nrocelular = $4, ent_correo = $5, ent_rol = $6, are_id = $7, ent_activo = $8 WHERE ent_id = $9';
  const values = [nombre, numero_identificacion, sexo, celular, correo, rol , area_id, activo, trabajadorId];

  pool.query(query, values, (error, result) => {
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
  const trabajadorId = req.params.id;

  const query = 'DELETE FROM entidades_ent WHERE ent_id = $1';
  const values = [trabajadorId];

  pool.query(query, values, (error, result) => {
    if (error) {
      console.error('Error al eliminar el trabajador:', error);
      res.status(500).json({ error: 'Ocurrió un error al eliminar el trabajador', error });
    } else {
      res.json({ message: 'Trabajador eliminado exitosamente' });
    }
  });
});

// Ruta GET para obtener todos los horarios
app.get('/api/horarios', (req, res) => {
  const query = 'SELECT * FROM horarios_hor';

  pool.query(query, (error, results) => {
    if (error) {
      console.error('Error al obtener los horarios:', error);
      res.status(500).json({ error: 'Ocurrió un error al obtener los horarios' });
    } else {
      res.json(results.rows);
    }
  });
});

// Ruta GET para obtener un horario por su ID
app.get('/api/horarios/:id', (req, res) => {
  const horarioId = req.params.id;
  const query = 'SELECT * FROM horarios_hor WHERE hor_id = $1';
  const values = [horarioId];

  pool.query(query, values, (error, results) => {
    if (error) {
      console.error('Error al obtener el horario:', error);
      res.status(500).json({ error: 'Ocurrió un error al obtener el horario' });
    } else if (results.rows.length === 0) {
      res.status(404).json({ error: 'Horario no encontrado' });
    } else {
      res.json(results.rows);//aqui
    }
  });
});

// Ruta POST para crear un nuevo horario
app.post('/api/horarios', (req, res) => {
  const { turno, horaInicio, horaFin, nroDias } = req.body;
  const query = 'INSERT INTO horarios_hor (hor_turno, hor_horainicio, hor_hora, hor_nrodias) VALUES ($1, $2, $3, $4)';
  const values = [turno, horaInicio, horaFin, nroDias];

  pool.query(query, values, (error) => {
    if (error) {
      console.error('Error al crear el horario:', error);
      res.status(500).json({ error: 'Ocurrió un error al crear el horario' });
    } else {
      res.json({ message: 'Horario creado exitosamente' });
    }
  });
});

// Ruta PUT para actualizar un horario existente
app.put('/api/horarios/:id', (req, res) => {
  const horarioId = req.params.id;
  const { turno, horaInicio, horaFin, nroDias } = req.body;
  const query = 'UPDATE horarios_hor SET hor_turno = $1, hor_horainicio = $2, hor_hora = $3, hor_nrodias = $4 WHERE hor_id = $5';
  const values = [turno, horaInicio, horaFin, nroDias, horarioId];

  pool.query(query, values, (error, result) => {
    if (error) {
      console.error('Error al actualizar el horario:', error);
      res.status(500).json({ error: 'Ocurrió un error al actualizar el horario' });
    } else if (result.rowCount === 0) {
      res.status(404).json({ error: 'Horario no encontrado' });
    } else {
      res.json({ message: 'Horario actualizado exitosamente' });
    }
  });
});

// Ruta DELETE para eliminar un horario
app.delete('/api/horarios/:id', (req, res) => {
  const horarioId = req.params.id;
  console.log(horarioId);
  const query = 'DELETE FROM horarios_hor WHERE hor_id = $1';
  const values = [horarioId];

  pool.query(query, values, (error, result) => {
    if (error) {
      console.error('Error al eliminar el horario:', error);
      res.status(500).json({ error: 'Ocurrió un error al eliminar el horario' });
    } else if (result.rowCount === 0) {
      res.status(404).json({ error: 'Horario no encontrado' });
    } else {
      res.json({ message: 'Horario eliminado exitosamente' });
    }
  });
});

//HORARIOS POR TRABAJADOR
//Ruta GET
app.get('/api/horariosxentidad', (req, res) => {
  const query = 'SELECT * FROM public.horarioxentidad_hxe';

  pool.query(query, (error, results) => {
    if (error) {
      console.error('Error al obtener los registros:', error);
      res.status(500).json({ error: 'Ocurrió un error al obtener los registros' });
    } else {
      res.json(results.rows);
    }
  });
});

// GET horario por ID del trabajador
app.get('/api/horariosxentidad/:id', (req, res) => {
  const ent_id = req.params.id;

  const query = 'SELECT hxe.hxe_id, hxe.ent_id, hxe.hor_id, hxe.hxe_fecinicio, hxe.hxe_fecfin, hor.hor_turno, hor.hor_horainicio, hor.hor_hora, hor.hor_nrodias FROM public.horarioxentidad_hxe hxe INNER JOIN public.horarios_hor hor ON hxe.hor_id = hor.hor_id WHERE ent_id = $1';
  const values = [ent_id];

  pool.query(query, values, (error, results) => {
    if (error) {
      console.error('Error al obtener el registro:', error);
      res.status(500).json({ error: 'Ocurrió un error al obtener el registro' });
    } else {
      if (results.rows.length > 0) {
        res.json(results.rows); // Enviar todos los registros encontrados
      } else {
        res.status(404).json({ error: 'No se encontró ningún registro con el ID proporcionado' });
      }
    }
  });
});


// Ruta POST para crear un horario por trabajador
app.post('/api/horariosxentidad/:trabajadorId', (req, res) => {
  const trabajadorId = req.params.trabajadorId;
  const {hor_id, hxe_fecinicio, hxe_fecfin } = req.body;

  const query = 'INSERT INTO public.horarioxentidad_hxe (hor_id, ent_id, hxe_fecinicio, hxe_fecfin) VALUES ($1, $2, $3, $4)';
  const values = [hor_id, trabajadorId, hxe_fecinicio, hxe_fecfin];

  pool.query(query, values, (error, result) => {
    if (error) {
      console.error('Error al crear un registro:', error);
      res.status(500).json({ error: 'Ocurrió un error al crear un registro' });
    } else {
      res.json({ message: 'Registro creado exitosamente' });
    }
  });
});

//Ruta PUT para actualizar un horario por trabajador
// Ruta PUT para actualizar un horario por trabajador
app.put('/api/horariosxentidad/:id', (req, res) => {
  const hxe_id = req.params.id;
  const { hor_id, hxe_fecinicio, hxe_fecfin } = req.body;

  const query = 'UPDATE public.horarioxentidad_hxe SET hor_id = $1, hxe_fecinicio = $2, hxe_fecfin = $3 WHERE hxe_id = $4';
  const values = [hor_id, hxe_fecinicio, hxe_fecfin, hxe_id];

  pool.query(query, values, (error, result) => {
    if (error) {
      console.error('Error al actualizar el registro:', error);
      res.status(500).json({ error: 'Ocurrió un error al actualizar el registro' });
    } else {
      res.json({ message: 'Registro actualizado exitosamente' });
      console.log(values);
    }
  });
});


// Ruta DELETE para eliminar un horario por entidad
app.delete('/api/horariosxentidad/:hxe_id', (req, res) => {
  const hxe_id = req.params.hxe_id;

  const query = 'DELETE FROM public.horarioxentidad_hxe WHERE hxe_id = $1';
  const values = [hxe_id];

  pool.query(query, values, (error, result) => {
    if (error) {
      console.error('Error al eliminar el horario por entidad:', error);
      res.status(500).json({ error: 'Ocurrió un error al eliminar el horario por entidad' });
    } else {
      res.json({ message: 'Horario por entidad eliminado exitosamente' });
    }
  });
});

// Ruta GET para obtener todos las areas
app.get('/api/areas', (req, res) => {
  const query = 'SELECT * FROM areas_are';

  pool.query(query, (error, results) => {
    if (error) {
      console.error('Error al obtener las areas:', error);
      res.status(500).json({ error: 'Ocurrió un error al obtener las areas' });
    } else {
      res.json(results);
    }
  });
});







