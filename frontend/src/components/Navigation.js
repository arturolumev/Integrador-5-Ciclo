import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import TrabajadorScreen from "../screens/TrabajadorScreen";
import HorarioScreen from "../screens/HorarioScreen";

import AgregarTrabajadorScreen from "../screens/AgregarTrabajadorScreen";
import ActualizarTrabajadorScreen from "../screens/ActualizarTrabajadorScreen";

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
        <Stack.Screen name="Horario" component={HorarioScreen} />
        <Stack.Screen name="Trabajador" component={TrabajadorScreen} />
        <Stack.Screen name="AgregarTrabajador" component={AgregarTrabajadorScreen} />
        <Stack.Screen name="ActualizarTrabajador" component={ActualizarTrabajadorScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
