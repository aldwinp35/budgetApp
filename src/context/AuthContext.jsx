/* eslint-disable react/prop-types */
import React, { useState, useMemo, useContext, createContext } from 'react';
import { tokenService } from '../api';

// Create and use context
const AuthContext = createContext();
const useAuthContext = () => useContext(AuthContext);

function AuthProvider({ children }) {
  // Validate token, if we have one or return false
  const [isValid, setIsValid] = useState(tokenService.validateToken());

  // Add value to the context
  const value = useMemo(() => ({ isValid, setIsValid }), [isValid]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { useAuthContext, AuthProvider };
