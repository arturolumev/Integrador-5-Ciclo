import React, { useEffect, useState } from "react";
import { Text, View, Button, StyleSheet } from "react-native";
import { BASE_URL } from "../config";

const PerfilScreen = ({ navigation, route }) => {
  const [perfil, setPerfil] = useState(null);

  useEffect(() => {
    obtenerPerfil();
  }, []);

  const obtenerPerfil = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const usuCodigo = route.params.usuCodigo;

      const response = await fetch(`${BASE_URL}/usuarios/${usuCodigo}/perfil`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPerfil(data);
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
      <Button onPress={() => navigation.navigate("Trabajador")} title="Ver Trabajadores" color="#841584" />
      <Text>Perfil de Usuario</Text>
      {perfil && (
        <View>
          <Text>Código: {perfil.usu_codigo}</Text>
          {/* Agrega aquí los campos adicionales que deseas mostrar en el perfil */}
        </View>
      )}
    </View>
  );
};

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default PerfilScreen;