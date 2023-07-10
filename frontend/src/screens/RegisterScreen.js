import React, { useContext, useState } from 'react';
import {
  Button,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Axios from 'axios';
import { BASE_URL } from '../config';

const RegisterScreen = ({ navigation }) => {
  const [codigo, setCodigo] = useState(null);
  const [clave, setClave] = useState(null);
  const [nombre, setNombre] = useState(null);
  const [nro_documento, setNroDocumento] = useState(null);
  const [sexo, setSexo] = useState(null);
  const [nro_celular, setNro_celular] = useState(null);
  const [correo, setCorreo] = useState(null);
  const [rol, setRol] = useState(null);
  const [area_id, setArea_id] = useState(null);

  const register = async () => {
    try {
      const { data } = await Axios.post(`${BASE_URL}/usuarios`, {
        codigo: codigo,
        clave: clave,
        nombre: nombre,
        nro_documento: nro_documento,
        sexo: sexo,
        nro_celular: nro_celular,
        correo: correo,
        rol: rol,
        area_id: area_id,
        activo: true,
      });

      if (data.status === 'success') {
        alert('User Created Successfully');
        navigation.navigate('Login');
      } else {
        alert('User Not Created');
      }

      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };

  const validateNumber = (text) => {
    const numberRegex = /^[0-9]+$/;
    return numberRegex.test(text);
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.wrapper}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.label}>Ingrese un código:</Text>
          <TextInput
            style={styles.input}
            value={codigo}
            placeholder="Ingresa tu código"
            onChangeText={(text) => setCodigo(text)}
          />

          <Text style={styles.label}>Ingrese una clave:</Text>
          <TextInput
            style={styles.input}
            value={clave}
            placeholder="Ingresa tu clave"
            onChangeText={text => setClave(text)}
            secureTextEntry
          />

          <Text style={styles.label}>Ingrese su nombre:</Text>
          <TextInput
            style={styles.input}
            value={nombre}
            placeholder="Ingresa tu nombre"
            onChangeText={text => setNombre(text)}
          />

          <Text style={styles.label}>Ingrese su número de identificación:</Text>
          <TextInput
            style={styles.input}
            value={nro_documento}
            placeholder="Ingresa tu identificación"
            onChangeText={text => {
              if (validateNumber(text)) {
                setNroDocumento(text);
              }
            }}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Seleccione su sexo:</Text>
          <Picker
            style={styles.input}
            selectedValue={sexo}
            onValueChange={itemValue => setSexo(itemValue)}
          >
            <Picker.Item label="Masculino" value="M" />
            <Picker.Item label="Femenino" value="F" />
          </Picker>

          <Text style={styles.label}>Ingrese su número de celular:</Text>
          <TextInput
            style={styles.input}
            value={nro_celular}
            placeholder="Ingresa tu número de celular"
            onChangeText={text => {
              if (validateNumber(text)) {
                setNro_celular(text);
              }
            }}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Ingrese su correo:</Text>
          <TextInput
            style={styles.input}
            value={correo}
            placeholder="Ingresa tu correo"
            onChangeText={text => setCorreo(text)}
          />

          <Text style={styles.label}>Seleccione su rol:</Text>
          <Picker
            style={styles.input}
            selectedValue={rol}
            onValueChange={itemValue => setRol(itemValue)}
          >
            <Picker.Item label="Trabajador" value="TRA" />
            <Picker.Item label="Administrador" value="ADM" />
          </Picker>

          <Text style={styles.label}>Ingrese su ID de Área:</Text>
          <TextInput
            style={styles.input}
            value={area_id}
            placeholder="Ingresa tu ID de área"
            onChangeText={text => setArea_id(text)}
          />

          <Button
            title="Register"
            onPress={() => {
              register();
            }}
          />

          <View style={styles.linkContainer}>
            <Text style={styles.linkText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.link}>Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  wrapper: {
    width: '80%',
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    shadowColor: '#000000',
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
    backgroundColor: '#ffffff',
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
  },
  linkContainer: {
    flexDirection: 'row',
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkText: {
    fontSize: 16,
  },
  link: {
    color: 'blue',
    fontSize: 16,
    marginLeft: 5,
  },
});

export default RegisterScreen;
