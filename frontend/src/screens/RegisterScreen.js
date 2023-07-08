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
  const [nombre, setNombre] = useState(null);
  const [nro_documento, setNroDocumento] = useState(null);
  const [sexo, setSexo] = useState(null);
  const [nro_celular, setNro_celular] = useState(null);
  const [correo, setCorreo] = useState(null);
  const [rol, setRol] = useState(null);
  const [area_id, setArea_id] = useState(null);

  //const val = useContext(AuthContext)

  //const {isLoading, register} = useContext(AuthContext);

  //const { register } = useContext(AuthContext);

  const register = async () => {
    try {
      const {data} = await Axios.post(`${BASE_URL}/usuarios`, {
        codigo: codigo,
        clave: clave, 

        // Nuevos datos para registrar entidades
        nombre: nombre, 
        nro_documento: nro_documento, 
        sexo: sexo, 
        nro_celular: nro_celular,  
        correo: correo,  
        rol: rol,  
        area_id: area_id,   
        activo: true
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
      //console.log(data);
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
          placeholder="Ingresa tu clave"
          onChangeText={text => setClave(text)}
          secureTextEntry
        />

        <TextInput
          style={styles.input}
          value={nombre}
          placeholder="Ingresa tu nombre"
          onChangeText={text => setNombre(text)}
        />

        <TextInput
          style={styles.input}
          value={nro_documento}
          placeholder="Ingresa tu identificacion"
          onChangeText={text => setNroDocumento(text)}
        />

        <TextInput
          style={styles.input}
          value={sexo}
          placeholder="Ingresa tu sexo"
          onChangeText={text => setSexo(text)}
        />

        <TextInput
          style={styles.input}
          value={nro_celular}
          placeholder="Ingresa tu numero de celular"
          onChangeText={text => setNro_celular(text)}
        />

        <TextInput
          style={styles.input}
          value={correo}
          placeholder="Ingresa tu correo"
          onChangeText={text => setCorreo(text)}
        />

        <TextInput
          style={styles.input}
          value={rol}
          placeholder="Ingresa tu rol"
          onChangeText={text => setRol(text)}
        />

        <TextInput
          style={styles.input}
          value={area_id}
          placeholder="Ingresa tu ID de area"
          onChangeText={text => setArea_id(text)}
        />

        <Button
          title="Register"
          onPress={() => {
            register(codigo, clave, nombre, nro_documento, sexo, nro_celular, correo, rol, area_id);
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