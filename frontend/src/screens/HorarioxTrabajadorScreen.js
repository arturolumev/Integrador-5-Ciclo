import React, { useEffect, useState } from 'react';
import { BASE_URL } from '../config';
import { Text, View, StyleSheet } from 'react-native';
import { format } from 'date-fns';

function HorarioxTrabajadorScreen({ navigation, route }) {
    const url = BASE_URL;
    const [horariosxtrabajadores, setHorariosxTrabajadores] = useState([]);
    const trabajadorId = route.params?.trabajadorId; // Obtener el ID del trabajador de los parámetros de la ruta
    const [horarios, setHorarios] = useState([]);

    useEffect(() => {
        obtenerHorarios();
        const obtenerHorarioxTrabajadores = () => {
            fetch(`${url}/horariosxentidad/${trabajadorId}`)
                .then((response) => response.json())
                .then((data) => {
                    setHorariosxTrabajadores(data);
                })
                .catch((error) => console.log('Error al obtener los horarios:', error));
        };

        obtenerHorarioxTrabajadores();
    }, [trabajadorId]);

    const obtenerHorarios = () => {
        fetch(`${url}/horarios`)
          .then((response) => response.json())
          .then((data) => {
            const horariosData = data.rows || []; // Extraer el array de áreas de data.rows
            setHorarios(horariosData);
          })
          .catch((error) => console.log('Error al obtener las áreas:', error));
      };
    console.log('horariosxtrabajadores', horariosxtrabajadores);
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>HorarioxTrabajador{horariosxtrabajadores.length}</Text>
            <View style={{ flexDirection: 'row', marginTop: 20 }}>
                {route.params.rol === 'ADM' && (
                    <>
                        <Button
                            onPress={() => navigation.navigate('FormAgregarHorxTra', {usuCodigo: route.params.usuCodigo, rol: route.params.rol, horarios: horarios })}
                            title="Agregar Horario al trabajador "
                            color="#841584"
                        />
                    </>
                )}
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
    },
    cell: {
        flex: 1,
    },
});

export default HorarioxTrabajadorScreen;
