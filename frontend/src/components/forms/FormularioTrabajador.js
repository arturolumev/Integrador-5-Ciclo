import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Picker } from 'react-native';

function FormularioTrabajador({
  trabajadorSeleccionado,
  actualizarTrabajador,
  cerrarModal,
  agregarTrabajador,
  areas }) {
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
  const [areaSeleccionada, setAreaSeleccionada] = useState(null);
  // Agregar el cambio de área al handleChange
  const handleChangeArea = value => {
    setAreaSeleccionada(value);
    handleChange('area_id', value);
  };
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
      <Picker
        style={styles.input}
        selectedValue={formulario.sexo}
        onValueChange={value => handleChange('sexo', value)}
      >
        <Picker.Item label="Femenino" value="F" />
        <Picker.Item label="Masculino" value="M" />
      </Picker>
      <Text>Celular</Text>
      <TextInput
        style={styles.input}
        placeholder="Celular"
        value={formulario.celular}
        onChangeText={texto => handleChange('celular', texto)}
      />
      <Text>Rol</Text>
      <Picker
        style={styles.input}
        selectedValue={formulario.rol}
        onValueChange={value => handleChange('rol', value)}
      >
        <Picker.Item label="Trabajador" value="TRA" />
        <Picker.Item label="Administrador" value="ADM" />
      </Picker>
      <Text>Correo</Text>
      <TextInput
        style={styles.input}
        placeholder="Correo"
        value={formulario.correo}
        onChangeText={texto => handleChange('correo', texto)}
      />
      <Text>Area</Text>
      {areas ? (<Picker
        style={styles.input}
        selectedValue={areaSeleccionada}
        onValueChange={handleChangeArea}
      >
        <Picker.Item label="Seleccione un área" value={null} /> {/* Opción por defecto */}
        {areas && areas.map(area => (
          <Picker.Item key={area.are_id} label={area.are_nombre} value={area.are_id.toString()} />
        ))}
      </Picker>
      ) : (
        <Text>Cargando áreas...</Text>
      )}

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
