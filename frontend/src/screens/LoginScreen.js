import React, {useContext, useState} from "react";
import { Text, TextInput, View, Button, TouchableOpacity, StyleSheet } from "react-native";
import axios from "axios";
import { BASE_URL } from "../config";
//import { AuthContext } from "../context/AuthContext";

const LoginScreen = ({navigation}) => {
    const [correo, setCorreo] = useState(null);
    const [password, setPassword] = useState(null);
    const [error, setError] = useState("");
    //const val = useContext(AuthContext)

    const login = async () => {
        try {
          const response = await axios.post(`${BASE_URL}/usuarios/login`, {
            correo,
            password,
          });
    
          const { accessToken } = response.data;
    
          // Guardar el token de acceso en AsyncStorage, Redux u otra forma de gestión de estado
    
          // Redirigir a la siguiente pantalla después del inicio de sesión
          console.log("====>", response.data);
          navigation.navigate('Home');
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
                value={correo}
                placeholder="Ingresa tu correo"
                onChangeText={text => setCorreo(text)} />

                <TextInput style={styles.input} 
                value={password}
                placeholder="Enter password"
                onChangeText={text => setPassword(text)}
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
