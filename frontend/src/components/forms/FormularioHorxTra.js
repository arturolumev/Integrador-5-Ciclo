import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Button } from 'react-native';
import { BASE_URL } from '../../config';

function FormularioHorxTra({ navigation, route }) {
  const url = BASE_URL;
  const [horario, setHorario] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const hxeId = route.params?.hxe_id;

  const handleSubmit = () => {
    const data = {
      id: hxeId,
      hor_id: horario,
      hxe_fecinicio: fechaInicio,
      hxe_fecfin: fechaFin,
    };

    fetch(`${url}/horariosxentidad/${hxeId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Horario actualizado con éxito');
        // Realizar las acciones necesarias después de la actualización
      })
      .catch((error) => {
        console.log('Error al actualizar el horario:', error);
      });
  };

  useEffect(() => {
    if (hxeId) {
      setIsEditing(true);
    }
  }, [hxeId]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Horario:</Text>
      <TextInput
        style={styles.input}
        value={horario}
        onChangeText={(text) => setHorario(text)}
      />

      <Text style={styles.label}>Fecha de inicio:</Text>
      <TextInput
        style={styles.input}
        value={fechaInicio}
        onChangeText={(text) => setFechaInicio(text)}
      />

      <Text style={styles.label}>Fecha de fin:</Text>
      <TextInput
        style={styles.input}
        value={fechaFin}
        onChangeText={(text) => setFechaFin(text)}
      />

      <Button
        title={isEditing ? 'Actualizar Horario' : 'Agregar Horario'}
        onPress={handleSubmit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
});

export default FormularioHorxTra;
