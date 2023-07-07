import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, TextInput } from 'react-native';
import { BASE_URL } from '../config';

function HorarioScreen() {

  const url = BASE_URL;

  const [horarios, setHorarios] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [turno, setTurno] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFin, setHoraFin] = useState('');
  const [nroDias, setNroDias] = useState('');
  const [selectedHorario, setSelectedHorario] = useState(null);


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
      turno: turno,
      horaInicio: horaInicio,
      horaFin: horaFin,
      nroDias: parseInt(nroDias)
      // Agrega aquí los demás campos necesarios para crear un nuevo horario
    };

    fetch(`${url}/horarios`, {
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
    if (selectedHorario) {
      const horarioActualizado = {
        turno: turno,
        horaInicio: horaInicio,
        horaFin: horaFin,
        nroDias: parseInt(nroDias)
      };

      fetch(`${url}/horarios/${selectedHorario.hor_id}`, {
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
          // Cerrar el modal
          setModalVisible(false);
        })
        .catch((error) => console.log('Error al actualizar el horario:', error));
    }
    };

  const eliminarHorario = (id) => {
    fetch(`${url}/horarios/${id}`, {
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

  const handleModalVisibility = (visible, horario) => {
    if (visible) {
      setSelectedHorario(horario);
      setTurno(horario.hor_turno);
      setHoraInicio(horario.hor_horainicio);
      setHoraFin(horario.hor_hora);
      setNroDias(horario.hor_nrodias.toString());
    } else {
      setSelectedHorario(null);
      setTurno('');
      setHoraInicio('');
      setHoraFin('');
      setNroDias('');
    }
    setModalVisible(visible);
  };




  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Proyecto React Native y Express {horarios.length}</Text>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
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
            <TouchableOpacity onPress={() => handleModalVisibility(true, item)}>
              <Text>Actualizar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => eliminarHorario(item.hor_id)}>
              <Text>Eliminar</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <Modal visible={modalVisible} animationType="slide">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Agregar Horario</Text>
          <View style={{ marginBottom: 10 }}>
            <Text>Turno:</Text>
            <TextInput
              style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
              value={turno}
              onChangeText={(text) => setTurno(text)}
            />
          </View>
          <View style={{ marginBottom: 10 }}>
            <Text>Hora de Inicio:</Text>
            <TextInput
              style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
              value={horaInicio}
              onChangeText={(text) => setHoraInicio(text)}
            />
          </View>
          <View style={{ marginBottom: 10 }}>
            <Text>Hora de Fin:</Text>
            <TextInput
              style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
              value={horaFin}
              onChangeText={(text) => setHoraFin(text)}
            />
          </View>
          <View style={{ marginBottom: 10 }}>
            <Text>Nro de Dias:</Text>
            <TextInput
              style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
              value={nroDias}
              onChangeText={(text) => setNroDias(text)}
              keyboardType="numeric"
            />
          </View>
          <TouchableOpacity onPress={selectedHorario ? actualizarHorario : crearHorario}>
            <Text>{selectedHorario ? 'Actualizar' : 'Agregar'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setModalVisible(false)}>
            <Text>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

export default HorarioScreen;