import React, { useEffect, useState } from "react";
import { Text, View, Button, StyleSheet } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from "../config";

const PerfilScreen = ({ navigation, route }) => {
  const [perfil, setPerfil] = useState(null);
  const [botonTexto, setBotonTexto] = useState('');

  const [rolPerfil, setRolPerfil] = useState('');

  useEffect(() => {
    obtenerPerfil();
  }, []);

  const obtenerPerfil = async () => {
    try {
      // Obtener el token almacenado con localStorage (para vista web)
      //const token = localStorage.getItem("accessToken");
      // Obtener el token almacenado con AsyncStorage (para vista movil)
      const token = await AsyncStorage.getItem('accessToken');
      const usuCodigo = route.params.usuCodigo;
      const rol = route.params.rol;

      console.log('codigo===>' + usuCodigo);

      const response = await fetch(`${BASE_URL}/usuarios/${usuCodigo}/perfil`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPerfil(data);
        console.log('rol ===>' + rol);

        // Determinar el texto del botón según el rol del usuario
        if (rol === 'ADM') {
          setBotonTexto('Ver Trabajadores');
          setRolPerfil('Administrador');
        } else if (rol === 'TRA') {
          setBotonTexto('Ver mi Entidad');
          setRolPerfil('Trabajador');
        }

      } else {
        console.log("Error al obtener el perfil del usuario");
      }
    } catch (error) {
      console.log("ERROR ====>", error);
      // Manejar el error de manera adecuada
    }
  };

  return (
    <View style={styles.container}>
      <Button onPress={() => navigation.navigate("Trabajador", { usuCodigo: route.params.usuCodigo, rol: route.params.rol })} title={botonTexto} color="#841584" />
      <Text style={styles.title}>Perfil de Usuario</Text>
      {perfil && (
        <View>
          <Text style={styles.label}>Código:</Text>
          <Text>{perfil.usu_codigo}</Text>
          {/* Agrega aquí los campos adicionales que deseas mostrar en el perfil */}
        </View>
      )}
      <Text style={styles.label}>Rol:</Text>
      <Text>{rolPerfil}</Text>
    </View>
  );
};

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 6,
  },
});

export default PerfilScreen;