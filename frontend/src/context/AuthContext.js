import React, { createContext, useState } from "react";
import { BASE_URL } from "../config";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);
    
    const register = (nombre, correo, password) => {
        axios
            .post(`${BASE_URL}/usuarios`, {
            nombre, correo, password
            })
            .then((res) => {
            let userInfo = res.data;
            console.log(userInfo);
            })
            .catch((e) => {
            console.log(`Register error: ${e}`);
            });
    };
  
  return (
    <AuthContext.Provider value="hola">
      {children}
    </AuthContext.Provider>
  );
};
