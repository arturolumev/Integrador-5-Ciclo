import React, {useContext, useState} from "react";
import { Text, TextInput, View, Button, TouchableOpacity, StyleSheet, Alert } from "react-native";
import axios from "axios";
import { BASE_URL } from "../config";

const LoginScreen = ({navigation}) => {
    const [codigo, setCodigo] = useState(null);
    const [clave, setClave] = useState(null);
    const [error, setError] = useState("");
    //const val = useContext(AuthContext)

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
            localStorage.setItem('accessToken', accessToken);
      
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

    return (
        <View style={styles.container}>
            <View style={styles.wrapper}>
                <TextInput 
                style={styles.input} 
                value={codigo}
                placeholder="Ingresa tu codigo"
                onChangeText={text => setCodigo(text)} />

                <TextInput style={styles.input} 
                value={clave}
                placeholder="Enter clave"
                onChangeText={text => setClave(text)}
                secureTextEntry />

                <Button 
                title="Login" 
                onPress={() => {
                    login();
                  }}/>

                <View style={{flexDirection: 'row', marginTop: 20}}>
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
        justifyContent: "center",
        alignItems: "center",
    },
    wrapper: {
        width: '80%',
    },
    input: {
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#bbb',
        borderRadius: 5,
        paddingHorizontal: 14,
    },
    link: {
        color: 'blue',
    },
});

export default LoginScreen;

