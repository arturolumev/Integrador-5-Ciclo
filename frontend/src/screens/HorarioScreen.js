import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Button, TextInput, StyleSheet, Modal, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../config';
import FormularioHorario from '../components/forms/FormularioHorario';

function HorarioScreen({ navigation, route }) {

  const url = BASE_URL;

  const [horarios, setHorarios] = useState([]);

  //Para el Modal
  const [modalVisible, setModalVisible] = useState(false);
  const [horarioSeleccionado, setHorarioSeleccionado] = useState(null);

  useEffect(() => {
    obtenerHorarios();
  }, []);

  const obtenerHorarios = () => {
    fetch(`${url}/horarios`)
      .then((response) => {
        console.log(response); // Verificar la respuesta del servidor
        return response.json();
      })
      .then((data) => {

      // Asignar los trabajadores al estado
      setHorarios(data);
        console.log(data); // Verificar los datos recibidos
      })
      .catch((error) => console.log('Error al obtener los horarios:', error));
  };

  useEffect(() => {
    // Si el parámetro "refresh" es true, volvemos a obtener los trabajadores
    if (route.params && route.params.refresh) {
      obtenerHorarios();
    }
  }, [route.params]);

  const abrirModal = (horario) => {
    setModalVisible(true);
    setHorarioSeleccionado({ ...horario });
  };
  
  

  const actualizarHorario = (id, horarioActualizado) => {
    fetch(`${url}/horarios/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(horarioActualizado)
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Horario actualizado:", data);
        obtenerHorarios();
        setModalVisible(false);
      })
      .catch((error) => console.log('Error al actualizar el horario:', error));
  };
  

  const eliminarHorario = (id) => {
    fetch(`${url}/horarios/${id}`, {
      method: 'DELETE'
    })
      .then((response) => {
        if (response.status === 200) {
          // Trabajador eliminado exitosamente
          console.log("Horario eliminado");
          // Actualizar la lista de trabajadores para reflejar los cambios
          obtenerHorarios();
        } else {
          // Manejar el caso en el que no se pueda eliminar el trabajador
          console.log("Error al eliminar el horario", response);
        }
      })
      .catch((error) => console.log('Error al eliminar el horario:', error));
  };

  const handleLogout = () => {
    try {
      // Eliminar el token de acceso almacenado (para vista web)
      //localStorage.removeItem('accessToken');

      // Eliminar el token almacenado (para vista movil)
      AsyncStorage.removeItem('token');
  
      // Redirigir al usuario a la pantalla de inicio de sesión
      navigation.navigate('Login');
    } catch (error) {
      // Manejar el error en caso de que ocurra
      console.log('Error al eliminar el token:', error);
    }
  };
  

  return (
    <ScrollView style={styles.container}>
      <Text>Proyecto React Native y Express</Text>
      <View style={styles.buttonContainer}>
        <Button
          onPress={() => navigation.navigate('Trabajador', { usuCodigo: route.params.usuCodigo, rol: route.params.rol })}
          title="Ver trabajadores"
          color="#841584"
        />
        <Button
          onPress={() => navigation.navigate('AgregarHorario', { usuCodigo: route.params.usuCodigo, rol: route.params.rol })}
          title="Agregar Horario"
          color="#841584"
        />
        <Button
          title="Cerrar Sesión"
          onPress={handleLogout}
          style={styles.logoutButton}
        />
      </View>

      <View style={styles.cardContainer}>
        {horarios.map((horario) => (
          <View style={styles.card} key={horario.hor_id}>
            <Text>Turno de Horario: {horario.hor_turno}</Text>
            <Text>Hora de Inicio: {horario.hor_horainicio}</Text>
            <Text>Hora de Fin: {horario.hor_hora}</Text>
            <Text>Número de Días: {horario.hor_nrodias}</Text>
            <TouchableOpacity onPress={() => abrirModal(horario)}>
              <Text>Actualizar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => eliminarHorario(horario.hor_id)}>
              <Text>Eliminar</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <FormularioHorario
          horarioSeleccionado={horarioSeleccionado}
          actualizarHorario={actualizarHorario}
          cerrarModal={() => setModalVisible(false)}
        />
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  card: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
  },
  logoutButton: {
    marginTop: 10,
    backgroundColor: 'red',
  },
});

export default HorarioScreen;
