import React, {useContext, useState} from "react";
import { Text, TextInput, View, Button, TouchableOpacity, StyleSheet, Alert, Image  } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import { BASE_URL } from "../config";

const LoginScreen = ({navigation}) => {
    const [codigo, setCodigo] = useState(null);
    const [clave, setClave] = useState(null);
    const [error, setError] = useState("");
    //const val = useContext(AuthContext)
    const [buttonColor, setButtonColor] = useState('#43509F');

    const login = async () => {
        try {
          const response = await axios.post(`${BASE_URL}/usuarios/login`, {
            codigo,
            clave,
          });
    
          const { accessToken, usu_codigo, ent_rol, requiresPasswordUpdate  } = response.data;

          if (requiresPasswordUpdate) {
            // Mostrar una alerta o mensaje al usuario para que actualice su contraseña
            alert('Por favor, actualiza tu contraseña');

            console.log('codigo para actualizar ===>' + usu_codigo);
      
            // Redirigir al usuario a la pantalla de actualización de contraseña
            navigation.navigate('ActualizarPassword', { usuCodigo: usu_codigo });
          } else {
            // Guardar el token de acceso en localStorage
            console.log('codigo para perfil ===>' + usu_codigo);
            //localStorage.setItem('accessToken', accessToken);

            await AsyncStorage.setItem('accessToken', accessToken);
      
            // Redirigir a la siguiente pantalla después del inicio de sesión
            console.log("====>", response.data);
            //navigation.navigate('Perfil', { usuCodigo: usu_codigo });
            // Determinar el tipo de usuario (administrador o trabajador) y redirigir a la pantalla correspondiente
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

      const handleButtonPress = () => {
        setButtonColor("#280B46");
        login();
      };

      return (
        <View style={styles.container}>
          <Image source={require('../../assets/logo.png')} style={styles.logo}/>
          <View style={styles.wrapper}> 
            <Text style={styles.title}>LOGIN</Text>
            
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
    
    <TouchableOpacity
          style={[styles.button, { backgroundColor: buttonColor }]}
          onPress={handleButtonPress}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
    
            <View style={{ flexDirection: 'row', marginTop: 20 }}>
              <Text>¿No tienes una cuenta? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.link}>Registrarse</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  wrapper: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    marginBottom: 10,
    padding: 10,
  },
  link: {
    color: 'blue',
  },
  logo: {
    width: '100%',
    height: 200,
    aspectRatio: 1,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#43509F",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default LoginScreen;