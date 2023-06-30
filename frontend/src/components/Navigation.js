import React from "react";
import { Text, View } from "react-native";

import { NavigationContainer, StackRouter } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from "../screens/HomeScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";

const Stack = createNativeStackNavigator();

const Navigation = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen 
                name="Login" 
                component={LoginScreen} 
                options={{headerShown: false}}/>
                <Stack.Screen 
                name="Register" 
                component={RegisterScreen}
                options={{headerShown: false}}/>
                <Stack.Screen 
                name="Home" 
                component={HomeScreen}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default Navigation;
