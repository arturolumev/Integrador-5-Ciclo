import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button } from 'react-native';

function FormularioTrabajador({ trabajadorSeleccionado, actualizarTrabajador, cerrarModal, agregarTrabajador }) {
  const [formulario, setFormulario] = useState({
    codigo: '',
    nombre: '',
    numero_identificacion: '',
    sexo: '',
    celular: '',
    rol: '',
    correo: '',
    area_id: ''
  });

  useEffect(() => {
    if (trabajadorSeleccionado) {
      setFormulario({
        codigo: trabajadorSeleccionado.usu_codigo,
        nombre: trabajadorSeleccionado.ent_nombre,
        numero_identificacion: trabajadorSeleccionado.ent_nrodocumento,
        sexo: trabajadorSeleccionado.ent_sexo,
        celular: trabajadorSeleccionado.ent_nrocelular,
        rol: trabajadorSeleccionado.ent_rol,
        correo: trabajadorSeleccionado.ent_correo,
        area_id: trabajadorSeleccionado.are_id
      });
    }
  }, [trabajadorSeleccionado]);

  const crearTrabajador = () => {
    agregarTrabajador(formulario);
  };

  const actualizarDatos = () => {
    actualizarTrabajador(trabajadorSeleccionado.ent_id, formulario);
    cerrarModal();
  };

  const handleChange = (name, value) => {
    setFormulario(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  return (
    <View>
      <Text>{trabajadorSeleccionado ? 'Actualizar Trabajador' : 'Agregar Trabajador'}</Text>
      <Text>Codigo</Text>
      <TextInput
        style={styles.input}
        placeholder="Codigo"
        value={formulario.codigo}
        onChangeText={texto => handleChange('codigo', texto)}
      />
      <Text>Nombre</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={formulario.nombre}
        onChangeText={texto => handleChange('nombre', texto)}
      />
      <Text>Numero de Identificacion</Text>
      <TextInput
        style={styles.input}
        placeholder="Numero de Identificacion"
        value={formulario.numero_identificacion}
        onChangeText={texto => handleChange('numero_identificacion', texto)}
      />
      <Text>Sexo</Text>
      <TextInput
        style={styles.input}
        placeholder="Sexo"
        value={formulario.sexo}
        onChangeText={texto => handleChange('sexo', texto)}
      />
      <Text>Celular</Text>
      <TextInput
        style={styles.input}
        placeholder="Celular"
        value={formulario.celular}
        onChangeText={texto => handleChange('celular', texto)}
      />
      <Text>Rol</Text>
      <TextInput
        style={styles.input}
        placeholder="Rol"
        value={formulario.rol}
        onChangeText={texto => handleChange('rol', texto)}
      />
      <Text>Correo</Text>
      <TextInput
        style={styles.input}
        placeholder="Correo"
        value={formulario.correo}
        onChangeText={texto => handleChange('correo', texto)}
      />
      <Text>ID del Area</Text>
      <TextInput
        style={styles.input}
        placeholder="ID del Area"
        value={formulario.area_id}
        onChangeText={texto => handleChange('area_id', texto)}
      />
      {trabajadorSeleccionado ? (
        <Button title="Actualizar" onPress={actualizarDatos} />
      ) : (
        <Button title="Agregar" onPress={crearTrabajador} />
      )}
      <Button title="Cerrar" onPress={cerrarModal} />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});

export default FormularioTrabajador;
