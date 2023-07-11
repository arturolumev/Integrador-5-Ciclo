import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, FlatList, Button, TouchableOpacity, TextInput, StyleSheet, Modal, Image, Switch } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../config';
import FormularioTrabajador from '../components/forms/FormularioTrabajador';

function TrabajadorScreen({ navigation, route }) {

  const url = BASE_URL;

  const [trabajadores, setTrabajadores] = useState([]);

  //Para el Modal
  const [modalVisible, setModalVisible] = useState(false);
  const [trabajadorSeleccionado, setTrabajadorSeleccionado] = useState(null);
  const [areas, setAreas] = useState([]);
  const [imagePressed, setImagePressed] = useState(false);

  useEffect(() => {
    obtenerTrabajadores();
    obtenerAreas();
  }, []);


  const obtenerAreas = () => {
    fetch(`${url}/areas`)
      .then((response) => response.json())
      .then((data) => {
        const areasData = data.rows || []; // Extraer el array de áreas de data.rows
        setAreas(areasData);
      })
      .catch((error) => console.log('Error al obtener las áreas:', error));
  };


  console.log('Areas:', areas);

  const obtenerTrabajadores = () => {
    fetch(`${url}/trabajadores`)
      .then((response) => {
        console.log(response); // Verificar la respuesta del servidor
        return response.json();
      })
      .then((data) => {
        // Obtener los trabajadores del campo "rows" de la respuesta
        const trabajadoresData = data.rows;

        // Asignar los trabajadores al estado
        setTrabajadores(trabajadoresData);
        console.log(data); // Verificar los datos recibidos
      })
      .catch((error) => console.log('Error al obtener los trabajadores:', error));
  };

  useEffect(() => {
    // Si el parámetro "refresh" es true, volvemos a obtener los trabajadores
    if (route.params && route.params.refresh) {
      obtenerTrabajadores();
    }
  }, [route.params]);


  const abrirModal = (trabajador) => {
    setModalVisible(true);
    setTrabajadorSeleccionado({ ...trabajador });
  };



  const actualizarTrabajador = (id, trabajadorActualizado) => {
    fetch(`${url}/trabajadores/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(trabajadorActualizado)
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Trabajador actualizado:", data);
        obtenerTrabajadores();
        setModalVisible(false);
      })
      .catch((error) => console.log('Error al actualizar el trabajador:', error));
  };


  const eliminarTrabajador = (id) => {
    fetch(`${url}/trabajadores/${id}`, {
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
          console.log("Error al eliminar el trabajador", response);
        }
      })
      .catch((error) => console.log('Error al eliminar el trabajador:', error));
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

  const toggleImage = () => {
    setImagePressed(!imagePressed);
  };


  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#EEEEEE' }}>
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={toggleImage}>
            <Image source={require('../../assets/logoimagen.png')} style={styles.toggleImage} />
          </TouchableOpacity>
          <Text style={styles.title}>MineManage</Text>
        </View>
        <View style={styles.leftContainer}>
          {imagePressed && route.params.rol === 'ADM' && (
            <View  style={styles.leftContainer}>
              <TouchableOpacity style={styles.barButton} onPress={() => navigation.navigate('Horario', { usuCodigo: route.params.usuCodigo, rol: route.params.rol })}>
                <Text style={styles.buttonText}>Ver horarios</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.barButton}onPress={() => navigation.navigate('AgregarTrabajador', { areas: areas, usuCodigo: route.params.usuCodigo, rol: route.params.rol })}>
                <Text style={styles.buttonText}>Agregar Trabajador</Text>
              </TouchableOpacity>
            </View>
          )}
          <TouchableOpacity
            onPress={() => navigation.navigate('Perfil', { usuCodigo: route.params.usuCodigo, rol: route.params.rol })}
            style={styles.barButton}
          >
            <Text style={styles.buttonText}>Ver mi perfil</Text>
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
        {trabajadores.map((trabajador) => {
          console.log("ROL ====> ", route.params.rol);
          if (route.params && route.params.rol === 'ADM') {
            // Mostrar todos los trabajadores si el rol es "Administrador"
            return (
              <View style={styles.card} key={trabajador.ent_id}>
                <View style={styles.cardinfo}>
                  <Text>Codigo: {trabajador.usu_codigo}</Text>
                  <Text>Nombre: {trabajador.ent_nombre}</Text>
                  <Text>Documento: {trabajador.ent_nrodocumento}</Text>
                  <Text>Sexo: {trabajador.ent_sexo === 'F' ? 'Femenino' : 'Masculino'}</Text>
                  <Text>Celular: {trabajador.ent_nrocelular}</Text>
                  <Text>Correo: {trabajador.ent_correo}</Text>
                  <Text>Rol: {trabajador.ent_rol === 'TRA' ? 'Trabajador' : (trabajador.ent_rol === 'ADM' ? 'Admin' : 'Otro tipo')}</Text>
                  <Text>Area: {trabajador.are_id === '1' ? 'Contabilidad' : (trabajador.are_id === '2' ? 'Recursos Humanos' : 'Gerencia')}</Text>
                  <Text>Usuario activo: <Switch
                    disabled={true}
                    value={trabajador.ent_activo}
                  /></Text>
                </View>
                <View style={styles.cardbotones}>
                  <TouchableOpacity onPress={() => abrirModal(trabajador)} style={styles.cardbotonActualizar}>
                    <Text>Actualizar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => eliminarTrabajador(trabajador.ent_id)} style={styles.cardbotonEliminar}>
                    <Text>Eliminar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => navigation.navigate('AgregarHorarioxTrabajador', { trabajadorId: trabajador.ent_id, rol: route.params.rol })} style={styles.cardbotonHorario}>
                    <Text>Ver Horario</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          } else if (route.params && route.params.rol === 'TRA' && trabajador.usu_codigo === route.params.usuCodigo) {
            // Mostrar solo el trabajador actual si el rol es "Trabajador"
            return (
              <View style={styles.card} key={trabajador.ent_id}>
                <View style={styles.cardinfo}>
                  <Text>Codigo: {trabajador.usu_codigo}</Text>
                  <Text>Nombre: {trabajador.ent_nombre}</Text>
                  <Text>Documento: {trabajador.ent_nrodocumento}</Text>
                  <Text>Sexo: {trabajador.ent_sexo === 'F' ? 'Femenino' : 'Masculino'}</Text>
                  <Text>Celular: {trabajador.ent_nrocelular}</Text>
                  <Text>Correo: {trabajador.ent_correo}</Text>
                  <Text>Rol: {trabajador.ent_rol === 'TRA' ? 'Trabajador' : (trabajador.ent_rol === 'ADM' ? 'Admin' : 'Otro tipo')}</Text>
                  <Text>Area: {trabajador.are_id === '1' ? 'Contabilidad' : (trabajador.are_id === '2' ? 'Recursos Humanos' : 'Gerencia')}</Text>
                  <Text>Usuario activo: <Switch
                    disabled={true}
                    value={trabajador.ent_activo}
                  /></Text>
                  <TouchableOpacity onPress={() => navigation.navigate('AgregarHorarioxTrabajador', { trabajadorId: trabajador.ent_id, rol: route.params.rol })} style={styles.cardbotonHorario}>
                    <Text>Ver Horario</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          } else {
            return null; // No mostrar el trabajador si no cumple ninguna de las condiciones anteriores
          }
        })}

        <Modal
          visible={modalVisible}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >

          <FormularioTrabajador
            trabajadorSeleccionado={trabajadorSeleccionado}
            actualizarTrabajador={actualizarTrabajador}
            cerrarModal={() => setModalVisible(false)}
            areas={areas}
          />
        </Modal>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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

export default TrabajadorScreen;