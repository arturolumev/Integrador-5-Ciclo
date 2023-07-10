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
  const [areas, setAreas] = useState([]);

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
        {route.params.rol === 'ADM' && (
          <>
            <Button
              onPress={() => navigation.navigate('Horario', { usuCodigo: route.params.usuCodigo, rol: route.params.rol })}
              title="Ver horarios"
              color="#841584"
            />
            <Button
              onPress={() => navigation.navigate('AgregarTrabajador', { areas: areas }, { usuCodigo: route.params.usuCodigo, rol: route.params.rol })}
              title="Agregar Trabajador"
              color="#841584"
            />
          </>
        )}
        <Button
          onPress={() => navigation.navigate('Perfil', { usuCodigo: route.params.usuCodigo, rol: route.params.rol })}
          title="Ver mi perfil"
          color="#841584"
        />
        <Button
          title="Cerrar Sesión"
          onPress={handleLogout}
          style={styles.logoutButton}
        />
      </View>

      <View style={{ flex: 1, marginLeft: 10 }}>
        {trabajadores.map((trabajador) => {
          console.log("ROL ====> ", route.params.rol);
          if (route.params && route.params.rol === 'ADM') {
            // Mostrar todos los trabajadores si el rol es "Administrador"
            return (
              <View style={styles.card} key={trabajador.ent_id}>
                <Text>ADM</Text>
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
                <TouchableOpacity onPress={() => navigation.navigate('AgregarHorarioxTrabajador', { trabajadorId: trabajador.ent_id, rol: route.params.rol })}>
                  <Text>Ver Horario</Text>
                </TouchableOpacity>
              </View>
            );
          } else if (route.params && route.params.rol === 'TRA' && trabajador.usu_codigo === route.params.usuCodigo) {
            // Mostrar solo el trabajador actual si el rol es "Trabajador"
            return (
              <View style={styles.card} key={trabajador.ent_id}>
                <Text>TRA</Text>
                <Text>Codigo: {trabajador.usu_codigo}</Text>
                <Text>Nombre: {trabajador.ent_nombre}</Text>
                <Text>Documento: {trabajador.ent_nrodocumento}</Text>
                <Text>Sexo: {trabajador.ent_sexo}</Text>
                <Text>Celular: {trabajador.ent_nrocelular}</Text>
                <Text>Correo: {trabajador.ent_correo}</Text>
                <Text>Rol: {trabajador.ent_rol}</Text>
                <Text>Area: {trabajador.are_id}</Text>
                <Text>Condicion: {trabajador.ent_activo}</Text>
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
