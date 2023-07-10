import React, { useEffect, useState } from "react";
import { Text, View, Button, StyleSheet, Image } from "react-native";
import { BASE_URL } from "../config";

const PerfilScreen = ({ navigation, route }) => {
  const [perfil, setPerfil] = useState(null);
  const [botonTexto, setBotonTexto] = useState('');

  useEffect(() => {
    obtenerPerfil();
  }, []);

  const obtenerPerfil = async () => {
    try {
      const token = localStorage.getItem("accessToken");
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
        } else if (rol === 'TRA') {
          setBotonTexto('Ver mi Entidad');
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
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <Image source={require('../../assets/logoimagen.png')} style={styles.logo} />
          <Text style={styles.title}>Perfil de Usuario</Text>
        </View>
      </View>
      {perfil && (
        <View style={styles.content}>
          <Text>Código: {perfil.usu_codigo}</Text>
          {/* Agrega aquí los campos adicionales que deseas mostrar en el perfil */}
        </View>
      )}
      <View style={styles.footer}>
        <Button
          onPress={() => navigation.navigate("Trabajador", { usuCodigo: route.params.usuCodigo, rol: route.params.rol })}
          title={botonTexto}
          color="#43509F"
        />
      </View>
    </View>

  );
};

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginTop: 10,
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
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 50,
  },
});



export default PerfilScreen;