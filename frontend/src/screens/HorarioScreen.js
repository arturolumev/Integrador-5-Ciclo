import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, Button, TextInput, StyleSheet, Modal, ScrollView } from 'react-native';
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
      AsyncStorage.removeItem('accessToken');

      // Redirigir al usuario a la pantalla de inicio de sesión
      navigation.navigate('Login');
    } catch (error) {
      // Manejar el error en caso de que ocurra
      console.log('Error al eliminar el token:', error);
    }
  };


  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#EEEEEE' }}>
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <Image source={require('../../assets/logoimagen.png')} style={styles.toggleImage} />
          <Text style={styles.title}>MineManage</Text>
        </View>
        <View style={styles.leftContainer}>

          <TouchableOpacity
            onPress={() => navigation.navigate('Trabajador', { usuCodigo: route.params.usuCodigo, rol: route.params.rol })}
            style={styles.barButton}
          >
            <Text style={styles.buttonText}>Ver trabajadores</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('AgregarHorario', { usuCodigo: route.params.usuCodigo, rol: route.params.rol })}
            style={styles.barButton}
          >
            <Text style={styles.buttonText}>Agregar horario</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleLogout}
            style={styles.barButton}
          >
            <Text style={styles.buttonText}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.contenedorBody}>
        <View style={styles.cardContainer}>
          {horarios.map((horario) => (
            <View style={styles.card} key={horario.hor_id}>
              <View style={styles.cardinfo}>
                <Text>Turno de Horario: {horario.hor_turno === 'DIA' ? 'Día' : 'Noche'}</Text>
                <Text>Hora de Inicio: {horario.hor_horainicio}</Text>
                <Text>Hora de Fin: {horario.hor_hora}</Text>
                <Text>Número de Días: {horario.hor_nrodias}</Text>
              </View>
              <View style={styles.cardbotones}>
                <TouchableOpacity onPress={() => abrirModal(horario)} style={styles.cardbotonActualizar}>
                  <Text>Actualizar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => eliminarHorario(horario.hor_id)} style={styles.cardbotonEliminar}>
                  <Text>Eliminar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
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
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleBarButtonContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
  },
  toggleBarButton: {
    marginBottom: 10,
  },
  toggleImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    top: 0,
    left: 0,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: 10,
    paddingBottom: 5,
    backgroundColor: 'white',
    marginBottom: 5,
    width: '100%'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  contenedorBody: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 10,
    marginTop: 10,
  },
  card: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardinfo: {
    flex: 1,
    paddingRight: 10,
  },
  cardbotones: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
    margin: 5,
  },
  barButton: {
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: 'transparent',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#841584',
    margin: 3,
  },
  buttonText: {
    color: '#841584',
  },
  cardbotonActualizar: {
    backgroundColor: '#0080F7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    margin: 3
  },
  cardbotonEliminar: {
    backgroundColor: '#DF383E',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    margin: 3
  },
  cardbotonHorario: {
    backgroundColor: '#F7B800',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    margin: 3
  },
});

export default HorarioScreen;