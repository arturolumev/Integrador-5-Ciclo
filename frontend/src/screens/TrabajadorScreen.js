import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Button } from 'react-native';
import { BASE_URL } from '../config';

function TrabajadorScreen() {

  const url = BASE_URL;
  
  const [trabajadores, setTrabajadores] = useState([]);

  useEffect(() => {
    obtenerTrabajadores();
  }, []);

  const obtenerTrabajadores = () => {
    fetch(`${url}/trabajadores`)
      .then((response) => response.json())
      .then((data) => {
        // Manejar la respuesta del servidor y actualizar el estado de los trabajadores
        setTrabajadores(data);
      })
      .catch((error) => console.log('Error al obtener los trabajadores:', error));
  };
  

  const crearTrabajador = () => {
    const nuevoTrabajador = {
      nombre: "Nombre del Trabajador",
      numero_identificacion: "12345678",
      habilidades: "Habilidades de Trabajador",
      certificaciones: "Certificación de Trabajador"
      // Agrega aquí los demás campos necesarios para crear un nuevo trabajador
    };
  
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(nuevoTrabajador)
    })
      .then((response) => response.json())
      .then((data) => {
        // Manejar la respuesta del servidor después de crear el trabajador
        console.log("Trabajador creado:", data);
        // Actualizar la lista de trabajadores para reflejar los cambios
        obtenerTrabajadores();
      })
      .catch((error) => console.log('Error al crear el trabajador:', error));
  };

  const actualizarTrabajador = (id) => {
    const trabajadorActualizado = {
      nombre: "Nuevo Nombre",
      numero_identificacion: "Nuevo Número de Identificación",
      habilidades: "Nuevo Habilidades de Trabajador",
      certificaciones: "Nuevo Certificación de Trabajador"
      // Agrega aquí los demás campos que desees actualizar
    };
  
    fetch(`${url}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(trabajadorActualizado)
    })
      .then((response) => response.json())
      .then((data) => {
        // Manejar la respuesta del servidor después de actualizar el trabajador
        console.log("Trabajador actualizado:", data);
        // Actualizar la lista de trabajadores para reflejar los cambios
        obtenerTrabajadores();
      })
      .catch((error) => console.log('Error al actualizar el trabajador:', error));
  };

  const eliminarTrabajador = (id) => {
    fetch(`${url}/${id}`, {
      method: 'DELETE'
    })
      .then((response) => {
        if (response.status === 200) {
          // Trabajador eliminado exitosamente
          console.log("Trabajador eliminado");
          // Actualizar la lista de trabajadores para reflejar los cambios
          obtenerTrabajadores();
        } else {
          // Manejar el caso en el que no se pueda eliminar el trabajador
          console.log("Error al eliminar el trabajador");
        }
      })
      .catch((error) => console.log('Error al eliminar el trabajador:', error));
  };
  
  

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Proyecto React Native y Express {trabajadores.length}</Text>
      <View style={{flexDirection: 'row', marginTop: 20}}>
        <Button
          onPress={() => navigation.navigate('Horario')}
          title="Ver horarios"
          color="#841584"
        />
      </View>
      <TouchableOpacity onPress={crearTrabajador}>
        <Text>Agregar Trabajador</Text>
      </TouchableOpacity>
      <FlatList
        data={trabajadores}
        keyExtractor={(item) => item.ent_id.toString()}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 10 }}>
            <Text>Codigo: {item.usu_codigo}</Text>
            <Text>Nombre: {item.ent_nombre}</Text>
            <Text>Documento: {item.ent_nrodocumento}</Text>
            <Text>Sexo: {item.ent_sexo}</Text>
            <Text>Celular: {item.ent_nrocelular}</Text>
            <Text>Correo: {item.ent_correo}</Text>
            <Text>Rol: {item.ent_rol}</Text>
            <Text>Area: {item.are_id}</Text>
            <TouchableOpacity onPress={() => actualizarTrabajador(item.idtrabajadores)}>
              <Text>Actualizar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => eliminarTrabajador(item.idtrabajadores)}>
              <Text>Eliminar</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

export default TrabajadorScreen;
