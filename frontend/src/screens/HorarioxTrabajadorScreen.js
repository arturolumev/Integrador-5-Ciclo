import React, { useEffect, useState } from 'react';
import { BASE_URL } from '../config';
import { Text, View, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { format } from 'date-fns';

function HorarioxTrabajadorScreen({ navigation, route }) {
    const url = BASE_URL;
    const [horariosxtrabajadores, setHorariosxTrabajadores] = useState([]);
    const trabajadorId = route.params?.trabajadorId;

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
        navigation.navigate('FormAgregarHorxTra', { trabajadorId, hxe_id });
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

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>HorarioxTrabajador{horariosxtrabajadores.length}</Text>
            <View style={{ flexDirection: 'row', marginTop: 20 }}>
                <Button
                    onPress={() => navigation.navigate('FormAgregarHorxTra', { trabajadorId })}
                    title="Agregar Horario al trabajador"
                    color="#841584"
                />
            </View>
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
                                <TouchableOpacity
                                    style={styles.actionButton}
                                    onPress={() => handleEditar(horarioxtrabajador.hxe_id)}
                                >
                                    <Text style={styles.actionButtonText}>Actualizar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.actionButton}
                                    onPress={() => handleEliminar(horarioxtrabajador.hxe_id)}
                                >
                                    <Text style={styles.actionButtonText}>Borrar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    );
                })}
            </View>
        </View>
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
});

export default HorarioxTrabajadorScreen;