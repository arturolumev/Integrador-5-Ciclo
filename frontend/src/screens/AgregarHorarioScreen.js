import React from 'react'
import { BASE_URL } from '../config'
import { Button } from 'react-native'
import FormularioHorario from '../components/forms/FormularioHorario';

function AgregarHorarioScreen({ navigation, route }) {
  const url = BASE_URL;

  const crearHorario = (nuevoHorario) => {
    fetch(`${url}/horarios`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(nuevoHorario)
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Horario creado:", data);
        navigation.navigate('Horario', { refresh: true, usuCodigo: route.params.usuCodigo, rol: route.params.rol });
      })
      .catch((error) => console.log('Error al crear el horario:', error));
  };

  return (
    <FormularioHorario agregarHorario={crearHorario} />
  );
}

export default AgregarHorarioScreen;
