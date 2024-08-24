import React, { createContext, useContext, useState } from 'react';


const AuthContext = createContext();


export function AuthProvider({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isSuperAdmin,setIsSuperAdmin] = useState(false);
    const login = () => {
        setIsLoggedIn(true);
    };

    const logout = () => {
        setIsLoggedIn(false);
        localStorage.removeItem('token');
        
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout,isSuperAdmin,setIsSuperAdmin }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
