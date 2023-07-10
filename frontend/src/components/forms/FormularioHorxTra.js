import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button } from 'react-native';

function FormularioHorxTra({ horarioSeleccionado, actualizarHorario, cerrarModal, agregarHorario }) {
  const [formulario, setFormulario] = useState({
    hor_id: '', 
    hxe_fecinicio: '', 
    hxe_fecfin: '', 
    hor_horainicio: '',
    hor_hora: '',
    hor_nrodias: '',
  });

  useEffect(() => {
    if (horarioSeleccionado) {
      setFormulario({
        turno: horarioSeleccionado.hor_id,
        fechaInicio: horarioSeleccionado.hxe_fecinicio,
        fechaFin: horarioSeleccionado.hxe_fecfin,
        horaInicio: horarioSeleccionado.hor_horainicio,
        horaFin: horarioSeleccionado.hor_hora,
        nroDias: horarioSeleccionado.hor_nrodias,
      });
    }
  }, [horarioSeleccionado]);

  const crearHorario = () => {
    agregarHorario(formulario);
  };

  const actualizarDatos = () => {
    actualizarHorario(horarioSeleccionado.hxe_id, formulario);
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
      <Text>{horarioSeleccionado ? 'Actualizar Horario' : 'Agregar Horario'}</Text>
      <Text>Turno de Horario</Text>
      <TextInput
        style={styles.input}
        placeholder="Turno de Horario"
        value={formulario.turno}
        onChangeText={texto => handleChange('turno', texto)}
      />
      <Text>Hora de Inicio</Text>
      <TextInput
        style={styles.input}
        placeholder="Hora de inicio"
        value={formulario.horaInicio}
        onChangeText={texto => handleChange('horaInicio', texto)}
      />
      <Text>Hora de Fin</Text>
      <TextInput
        style={styles.input}
        placeholder="Hora de fin"
        value={formulario.horaFin}
        onChangeText={texto => handleChange('horaFin', texto)}
      />
      <Text>Numero de Dias</Text>
      <TextInput
        style={styles.input}
        placeholder="Numero de dias"
        value={formulario.nroDias}
        onChangeText={texto => handleChange('nroDias', texto)}
      />
      {horarioSeleccionado ? (
        <Button title="Actualizar" onPress={actualizarDatos} />
      ) : (
        <Button title="Agregar" onPress={crearHorario} />
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

export default FormularioHorxTra;