import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button } from 'react-native';
import { BASE_URL } from '../../config';
import { format } from 'date-fns';

function FormularioHorxTra({ navigation, route }) {
  const url = BASE_URL;

  const [horario, setHorario] = useState(route.params.horario ? route.params.horario.hor_id : '');
  const [fechaInicio, setFechaInicio] = useState(route.params.horario ? route.params.horario.hxe_fecinicio : '');
  const [fechaFin, setFechaFin] = useState(route.params.horario ? route.params.horario.hxe_fecfin : '');

  const [isEditing, setIsEditing] = useState(false);
  const [trabajadorId, setTrabajadorId] = useState('');

  const hxeId = route.params?.hxe_id;

  console.log('TRABAJADDR ID=====>>> ', route.params.trabajadorId);
  console.log('HXE ID =====>>>>', route.params.hxe_id);

  const handleSubmit = () => {
    const data = {
      hor_id: horario,
      hxe_fecinicio: fechaInicio,
      hxe_fecfin: fechaFin,
    };

    fetch(`${url}/horariosxentidad/${trabajadorId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Horario agregado exitosamente');
        // Realizar las acciones necesarias después de la inserción
        navigation.navigate('AgregarHorarioxTrabajador', {
            refresh: true,
            trabajadorId: route.params.trabajadorId,
            usuCodigo: route.params.usuCodigo,
            rol: route.params.rol,
          })
      })
      .catch((error) => {
        console.log('Error al agregar el horario:', error);
      });
  };

  const handleEdit = () => {
    const data = {
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
        navigation.navigate('AgregarHorarioxTrabajador', {
            refresh: true,
            trabajadorId: route.params.trabajadorId,
            usuCodigo: route.params.usuCodigo,
            rol: route.params.rol,
          })
      })
      .catch((error) => {
        console.log('Error al actualizar el horario:', error);
      });
  };

  useEffect(() => {
    if (route.params && route.params.trabajadorId) {
      setTrabajadorId(route.params.trabajadorId);
    }
    if (hxeId) {
      setIsEditing(true);
    }
  }, [hxeId, route.params]);

  return (
    <View>
      <Text>Turno de Horario</Text>
      <TextInput
        style={styles.input}
        value={horario}
        onChangeText={(text) => setHorario(text)}
      />
      <Text>Fecha de Inicio</Text>
      <TextInput
        style={styles.input}
        value={fechaInicio}
        onChangeText={(text) => setFechaInicio(text)}
      />
      <Text>Fecha de Fin</Text>
      <TextInput
        style={styles.input}
        value={fechaFin}
        onChangeText={(text) => setFechaFin(text)}
      />

      <Button
        title={isEditing ? 'Actualizar Horario' : 'Agregar Horario'}
        onPress={isEditing ? handleEdit : handleSubmit}
      />
      <Button
        onPress={() =>
            navigation.navigate('AgregarHorarioxTrabajador', {
                refresh: true,
                trabajadorId: route.params.trabajadorId,
                usuCodigo: route.params.usuCodigo,
                rol: route.params.rol,
            })
          }          
        title="Regresar"
        color="#841584"
      />
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
