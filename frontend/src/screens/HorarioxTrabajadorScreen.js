import React, { useEffect, useState } from 'react';
import { BASE_URL } from '../config';
import { Image, Text, View, StyleSheet, Button, ScrollView, TouchableOpacity } from 'react-native';
import { format } from 'date-fns';

function HorarioxTrabajadorScreen({ navigation, route }) {
    const url = BASE_URL;
    const [horariosxtrabajadores, setHorariosxTrabajadores] = useState([]);
    const trabajadorId = route.params?.trabajadorId;

    const [horarioSeleccionado, setHorarioSeleccionado] = useState(null);

    useEffect(() => {
        obtenerHorariosxTrabajadores();
    }, [trabajadorId]);

    const obtenerHorariosxTrabajadores = () => {
        fetch(`${url}/horariosxentidad/${trabajadorId}`)
            .then((response) => response.json())
            .then((data) => {
                setHorariosxTrabajadores(data);
            })
            .catch((error) => console.log('Error al obtener los horarios:', error));
    };

    const handleEditar = (hxe_id) => {
        const horario = horariosxtrabajadores.find((horario) => horario.hxe_id === hxe_id);
        setHorarioSeleccionado(horario);
        navigation.navigate('FormAgregarHorxTra', {
            trabajadorId,
            hxe_id,
            usuCodigo: route.params.usuCodigo,
            rol: route.params.rol,
            horario: horario,
        });
    };
      

    const handleEliminar = (hxe_id) => {
        fetch(`${url}/horariosxentidad/${hxe_id}`, {
            method: 'DELETE',
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('Horario por entidad eliminado exitosamente');
                obtenerHorariosxTrabajadores();
            })
            .catch((error) => {
                console.log('Error al eliminar el horario por entidad:', error);
            });
    };

    useEffect(() => {
        // Si el parámetro "refresh" es true, volvemos a obtener los trabajadores
        if (route.params && route.params.refresh) {
            obtenerHorariosxTrabajadores();
        }
    }, [route.params]);

  console.log('horariosxtrabajadores', horariosxtrabajadores);

  return (

    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#EEEEEE' }}>

        <View style={styles.headerContainer}>
            <View style={styles.header}>
                    <Image source={require('../../assets/logoimagen.png')} style={styles.toggleImage} />
              
                <Text style={styles.title}>MineManage</Text>
            </View>
            <View style={styles.leftContainer}>
                <View style={styles.leftContainer}>
                    {route.params.rol === 'ADM' && (
                            <TouchableOpacity style={styles.barButton} onPress={() => navigation.navigate('FormAgregarHorxTra', { trabajadorId, usuCodigo: route.params.usuCodigo, rol: route.params.rola })}>
                                <Text style={styles.buttonText}>Agregar</Text>
                            </TouchableOpacity>
                        )}
                    <TouchableOpacity style={styles.barButton}onPress={() => navigation.navigate('Trabajador', { trabajadorId, usuCodigo: route.params.usuCodigo, rol: route.params.rol })}>
                        <Text style={styles.buttonText}>Regresar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
        <View style={styles.contenedorBody}>
        {horariosxtrabajadores.length === 0 ? (
                    <Text>No hay horarios disponibles</Text>
                ) : (
                    <View>
                        
            <View style={{ flex: 1, marginLeft: 10 }}>
                <View style={styles.header}>
                    <Text style={styles.columnHeader}>#</Text>
                    <Text style={styles.columnHeader}>Turno</Text>
                    <Text style={styles.columnHeader}>Hora de entrada</Text>
                    <Text style={styles.columnHeader}>Hora de salida</Text>
                    <Text style={styles.columnHeader}>Fecha de Inicio</Text>
                    <Text style={styles.columnHeader}>Fecha de Fin</Text>
                    <Text style={styles.columnHeader}>Nro de días</Text>
                    <Text style={styles.columnHeader}>Acciones</Text>
                </View>
                {horariosxtrabajadores.map((horarioxtrabajador, index) => {
                    const horaInicio = new Date();
                    const horaFin = new Date();

                    const [horaInicioStr, minInicioStr, segInicioStr] = horarioxtrabajador.hor_horainicio.split(':');
                    const [horaFinStr, minFinStr, segFinStr] = horarioxtrabajador.hor_hora.split(':');

                    horaInicio.setHours(horaInicioStr, minInicioStr, segInicioStr);
                    horaFin.setHours(horaFinStr, minFinStr, segFinStr);

                    return (
                        <View style={styles.row} key={horarioxtrabajador.hxe_id}>
                            <Text style={styles.cell}>{index + 1}</Text>
                            <Text style={styles.cell}>{horarioxtrabajador.hor_turno}</Text>
                            <Text style={styles.cell}>{format(horaInicio, 'HH:mm')}</Text>
                            <Text style={styles.cell}>{format(horaFin, 'HH:mm')}</Text>
                            <Text style={styles.cell}>
                                {format(new Date(horarioxtrabajador.hxe_fecinicio), 'dd/MM/yyyy')}
                            </Text>
                            <Text style={styles.cell}>
                                {format(new Date(horarioxtrabajador.hxe_fecfin), 'dd/MM/yyyy')}
                            </Text>
                            <Text style={styles.cell}>{horarioxtrabajador.hor_nrodias}</Text>
                            <View style={styles.actions}>
                                
                                {route.params.rol === 'ADM' && (
                                    <TouchableOpacity
                                    onPress={() => handleEditar(horarioxtrabajador.hxe_id)}
                                    style={styles.cardbotonActualizar}
                                >
                                    <Text style={styles.actionButtonText}>Actualizar</Text>
                                </TouchableOpacity>
                                )}
                                {route.params.rol === 'ADM' && (
                                    <TouchableOpacity style={styles.cardbotonEliminar} onPress={() => handleEliminar(horarioxtrabajador.hxe_id)}>
                                        <Text style={styles.actionButtonText}>Eliminar</Text>
                                    </TouchableOpacity> 
                                )}
                            </View>
                        </View>
                    );
                })}
            </View>
                    </View>
                )}
            
        </View>
    </ScrollView>
);
}

const styles = StyleSheet.create({
header: {
    flexDirection: 'row',
    backgroundColor: 'lightgray',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    elevation: 3,
},
columnHeader: {
    flex: 1,
    fontWeight: 'bold',
},
row: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    elevation: 3,
    alignItems: 'center',
},
cell: {
    flex: 1,
},
actions: {
    flexDirection: 'row',
},
actionButton: {
    marginLeft: 10,
    backgroundColor: 'lightblue',
    padding: 5,
    borderRadius: 5,
},
actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
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

export default HorarioxTrabajadorScreen;