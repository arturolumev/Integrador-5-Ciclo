import React, { useContext, useState } from "react";
import { Text, TextInput, View, Button, TouchableOpacity, StyleSheet, Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import { BASE_URL } from "../config";

const LoginScreen = ({ navigation }) => {
  const [codigo, setCodigo] = useState("");
  const [clave, setClave] = useState("");
  const [error, setError] = useState("");

  const login = async () => {
    if (!codigo || !clave) {
      setError("Por favor ingresa tu código y clave");
      return;
    }

    if (clave.length < 4) {
      setError("La clave debe tener al menos 4 caracteres");
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/usuarios/login`, {
        codigo,
        clave,
      });

      const { accessToken, usu_codigo, ent_rol, requiresPasswordUpdate } = response.data;

      if (requiresPasswordUpdate) {
        alert('Por favor, actualiza tu contraseña');
        navigation.navigate('ActualizarPassword', { usuCodigo: usu_codigo });
      } else {
        
        // Guardar el token de acceso en localStorage
        console.log('codigo para perfil ===>' + usu_codigo);
        //localStorage.setItem('accessToken', accessToken);
        
        // Guardar el token en AsyncStorage
        await AsyncStorage.setItem('accessToken', accessToken);

        if (ent_rol === 'ADM') {
          navigation.navigate('Perfil', { usuCodigo: usu_codigo, rol: ent_rol });
        } else if (ent_rol === 'TRA') {
          navigation.navigate('Perfil', { usuCodigo: usu_codigo, rol: ent_rol });
        }
      }
    } catch (error) {
      console.log("ERROR ====>", error);
      setError("Credenciales inválidas");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <TextInput
          style={styles.input}
          value={codigo}
          placeholder="Ingresa tu código"
          onChangeText={text => setCodigo(text)}
        />

        <TextInput
          style={styles.input}
          value={clave}
          placeholder="Ingresa tu clave"
          onChangeText={text => setClave(text)}
          secureTextEntry
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <Button
          title="Login"
          onPress={() => {
            login();
          }}
        />

        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>¿No tienes una cuenta?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.registerLink}>Registrarse</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  wrapper: {
    width: '80%',
    padding: 20,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  input: {
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 14,
    fontSize: 16,
    backgroundColor: "#ffffff",
  },
  errorText: {
    color: 'red',
    marginBottom: 12,
    fontSize: 16,
    textAlign: "center",
  },
  registerContainer: {
    flexDirection: 'row',
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  registerText: {
    fontSize: 16,
    marginRight: 5,
  },
  registerLink: {
    color: 'blue',
    fontSize: 16,
  },
});

export default LoginScreen;
