import React, {useContext, useState} from 'react';
import {
  Button,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import Axios from "axios";
import { BASE_URL } from '../config';
//import Spinner from 'react-native-loading-spinner-overlay';
//import {AuthContext} from '../context/AuthContext';

const RegisterScreen = ({navigation}) => {
  const [codigo, setCodigo] = useState(null);
  const [clave, setClave] = useState(null);

  //const val = useContext(AuthContext)

  //const {isLoading, register} = useContext(AuthContext);

  //const { register } = useContext(AuthContext);

  const register = async () => {
    try {
      const {data} = await Axios.post(`${BASE_URL}/usuarios/usuario`, {
        codigo: codigo,
        //correo: correo,
        clave: clave,
      });

      if (data.status === 'success') {
        alert('User Created Successfully');
        navigation.navigate('Login'); // Redirigir a la pantalla de inicio de sesión después del registro exitoso
      } else {
        alert('User Not Created');
      }

      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <TextInput
          style={styles.input}
          value={codigo}
          placeholder="Ingresa tu codigo"
          onChangeText={text => setCodigo(text)}
        />


        <TextInput
          style={styles.input}
          value={clave}
          placeholder="Enter clave"
          onChangeText={text => setClave(text)}
          secureTextEntry
        />

        <Button
          title="Register"
          onPress={() => {
            register(codigo, clave);
          }}
        />

        <View style={{flexDirection: 'row', marginTop: 20}}>
          <Text>Already have an accoutn? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.link}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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

export default RegisterScreen;