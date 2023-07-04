import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { BASE_URL } from '../config';

function HorarioScreen() {

  const url = BASE_URL;
  
  const [horarios, setHorarios] = useState([]);

  useEffect(() => {
    obtenerHorarios();
  }, []);

  const obtenerHorarios = () => {
    fetch(`${url}/horarios`)
      .then((response) => response.json())
      .then((data) => {
        // Manejar la respuesta del servidor y actualizar el estado de los horarios
        setHorarios(data);
      })
      .catch((error) => console.log('Error al obtener los horarios:', error));
  };
  

  const crearHorario = () => {
    const nuevoHorario = {
      nombre: "Nombre del Horario",
      numero_identificacion: "12345678",
      habilidades: "Habilidades de Horario",
      certificaciones: "Certificación de Horario"
      // Agrega aquí los demás campos necesarios para crear un nuevo horario
    };
  
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(nuevoHorario)
    })
      .then((response) => response.json())
      .then((data) => {
        // Manejar la respuesta del servidor después de crear el horario
        console.log("Horario creado:", data);
        // Actualizar la lista de horarios para reflejar los cambios
        obtenerHorarios();
      })
      .catch((error) => console.log('Error al crear el horario:', error));
  };

  const actualizarHorario = (id) => {
    const horarioActualizado = {
      nombre: "Nuevo Nombre",
      numero_identificacion: "Nuevo Número de Identificación",
      habilidades: "Nuevo Habilidades de Horario",
      certificaciones: "Nuevo Certificación de Horario"
      // Agrega aquí los demás campos que desees actualizar
    };
  
    fetch(`${url}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(horarioActualizado)
    })
      .then((response) => response.json())
      .then((data) => {
        // Manejar la respuesta del servidor después de actualizar el horario
        console.log("Horario actualizado:", data);
        // Actualizar la lista de horarios para reflejar los cambios
        obtenerHorarios();
      })
      .catch((error) => console.log('Error al actualizar el horario:', error));
  };

  const eliminarHorario = (id) => {
    fetch(`${url}/${id}`, {
      method: 'DELETE'
    })
      .then((response) => {
        if (response.status === 200) {
          // Horario eliminado exitosamente
          console.log("Horario eliminado");
          // Actualizar la lista de horarios para reflejar los cambios
          obtenerHorarios();
        } else {
          // Manejar el caso en el que no se pueda eliminar el Horario
          console.log("Error al eliminar el Horario");
        }
      })
      .catch((error) => console.log('Error al eliminar el Horario:', error));
  };
  
  

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Proyecto React Native y Express {horarios.length}</Text>
      <TouchableOpacity onPress={crearHorario}>
        <Text>Agregar Horario</Text>
      </TouchableOpacity>
      <FlatList
        data={horarios}
        keyExtractor={(item) => item.hor_id.toString()}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 10 }}>
            <Text>Turno: {item.hor_turno}</Text>
            <Text>Hora de Inicio: {item.hor_horainicio}</Text>
            <Text>Hora de Salida: {item.hor_hora}</Text>
            <Text>Nro de Dias: {item.hor_nrodias}</Text>
            <TouchableOpacity onPress={() => actualizarHorarios(item.idhorarios)}>
              <Text>Actualizar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => eliminarHorario(item.idhorarios)}>
              <Text>Eliminar</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

export default HorarioScreen;
