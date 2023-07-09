import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Button, TextInput, StyleSheet, Modal } from 'react-native';
import { BASE_URL } from '../config';
import FormularioTrabajador from '../components/forms/FormularioTrabajador';

function TrabajadorScreen({ navigation, route }) {

  const url = BASE_URL;

  const [trabajadores, setTrabajadores] = useState([]);

  //Para el Modal
  const [modalVisible, setModalVisible] = useState(false);
  const [trabajadorSeleccionado, setTrabajadorSeleccionado] = useState(null);

  useEffect(() => {
    obtenerTrabajadores();
  }, []);

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
      // Eliminar el token de acceso almacenado
      localStorage.removeItem('accessToken');
  
      // Redirigir al usuario a la pantalla de inicio de sesión
      navigation.navigate('Login');
    } catch (error) {
      // Manejar el error en caso de que ocurra
      console.log('Error al eliminar el token:', error);
    }
  };
  

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Proyecto React Native y Express {trabajadores.length}</Text>
      <View style={{ flexDirection: 'row', marginTop: 20 }}>
        <Button
          onPress={() => navigation.navigate('Perfil')}
          title="Ver mi perfil"
          color="#841584"
        />
        <Button
          onPress={() => navigation.navigate('Horario')}
          title="Ver horarios"
          color="#841584"
        />
        <Button
          onPress={() => navigation.navigate('AgregarTrabajador')}
          title="Agregar Trabajador"
          color="#841584"
        />
        <Button
          title="Cerrar Sesión"
          onPress={handleLogout}
          style={styles.logoutButton}
        />
      </View>
  
      <View style={{ flex: 1, marginLeft: 10 }}>
        {trabajadores.map((trabajador) => (
          <View style={styles.card} key={trabajador.ent_id}>
            <Text>Codigo: {trabajador.usu_codigo}</Text>
            <Text>Nombre: {trabajador.ent_nombre}</Text>
            <Text>Documento: {trabajador.ent_nrodocumento}</Text>
            <Text>Sexo: {trabajador.ent_sexo}</Text>
            <Text>Celular: {trabajador.ent_nrocelular}</Text>
            <Text>Correo: {trabajador.ent_correo}</Text>
            <Text>Rol: {trabajador.ent_rol}</Text>
            <Text>Area: {trabajador.are_id}</Text>
            <Text>Condicion: {trabajador.ent_activo}</Text>
            <TouchableOpacity onPress={() => abrirModal(trabajador)}>
              <Text>Actualizar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => eliminarTrabajador(trabajador.ent_id)}>
              <Text>Eliminar</Text>
            </TouchableOpacity>
          </View>
        ))}
        <Modal
          visible={modalVisible}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          
          <FormularioTrabajador
            trabajadorSeleccionado={trabajadorSeleccionado}
            actualizarTrabajador={actualizarTrabajador}
            cerrarModal={() => setModalVisible(false)}
          />
        </Modal>
      </View>
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

export default TrabajadorScreen;
