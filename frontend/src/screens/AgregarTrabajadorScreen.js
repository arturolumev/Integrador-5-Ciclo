import React from 'react'
import { BASE_URL } from '../config'
import FormularioTrabajador from '../components/forms/FormularioTrabajador'
import { Button } from 'react-native'

function AgregarTrabajadorScreen({ navigation, route }) {
  const url = BASE_URL;
  //console.log("ROL en agregar trabajador ===> ", route.params.rol);
  const areas = route.params.areas;

  const crearTrabajador = (nuevoTrabajador) => {
    fetch(`${url}/trabajadores`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(nuevoTrabajador)
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Trabajador creado:", data);
        navigation.navigate('Trabajador', { refresh: true, usuCodigo: route.params.usuCodigo, rol: route.params.rol });
      })
      .catch((error) => console.log('Error al crear el trabajador:', error));
  };

  return (
    <FormularioTrabajador
      agregarTrabajador={crearTrabajador}
      areas={areas} // Pasa las áreas aquí
    />
  );
}

export default AgregarTrabajadorScreen;
