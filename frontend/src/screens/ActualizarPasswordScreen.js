import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet } from "react-native";
import axios from "axios";
import { BASE_URL } from "../config";

const ActualizarPasswordScreen = ({ navigation, route }) => {
  const [newPassword, setNewPassword] = useState("");

  const handlePasswordUpdate = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/usuarios/actualizar-password`, {
        newPassword: newPassword,
        usuCodigo: route.params.usuCodigo,
      });

      //console.log('codigo===>' + usuCodigo);

      // Actualización de contraseña exitosa, redirigir al usuario a la pantalla de inicio de sesión
      navigation.navigate('Login');
    } catch (error) {
      console.log("Error al actualizar la contraseña:", error);
      // Manejar el error en caso de que ocurra
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={newPassword}
        onChangeText={text => setNewPassword(text)}
        placeholder="Ingrese la nueva contraseña"
        secureTextEntry
      />
      <Button title="Actualizar contraseña" onPress={handlePasswordUpdate} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#bbb",
    borderRadius: 5,
    paddingHorizontal: 14,
  },
});

export default ActualizarPasswordScreen;
