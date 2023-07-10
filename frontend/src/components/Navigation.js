import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import TrabajadorScreen from "../screens/TrabajadorScreen";
import HorarioScreen from "../screens/HorarioScreen";

import AgregarTrabajadorScreen from "../screens/AgregarTrabajadorScreen";
import AgregarHorarioScreen from "../screens/AgregarHorarioScreen";

import PerfilScreen from "../screens/PerfilScreen";

import ActualizarPasswordScreen from "../screens/ActualizarPasswordScreen"
import HorarioxTrabajadorScreen from "../screens/HorarioxTrabajadorScreen";
import FormularioHorxTra from "./forms/FormularioHorxTra";

const Stack = createNativeStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ActualizarPassword"
          component={ActualizarPasswordScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Perfil"
          component={PerfilScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Trabajador"
          component={TrabajadorScreen}
          options={{ headerShown: false }} />
        <Stack.Screen
          name="AgregarTrabajador"
          component={AgregarTrabajadorScreen} />
        <Stack.Screen
          name="Horario"
          component={HorarioScreen}
          options={{ headerShown: false }} />
        <Stack.Screen
          name="AgregarHorario"
          component={AgregarHorarioScreen}
          options={{ headerShown: false }} />
        <Stack.Screen
          name="AgregarHorarioxTrabajador"
          component={HorarioxTrabajadorScreen}
          options={{ headerShown: false }} />
          <Stack.Screen
          name="FormAgregarHorxTra"
          component={FormularioHorxTra}
          options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
