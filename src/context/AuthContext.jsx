/* eslint-disable react/prop-types */
import React from 'react';
import tokenService from '../api/tokenService';

const AuthContext = React.createContext();
const useAuthContext = () => React.useContext(AuthContext);

function AuthProvider({ children }) {
  const [isValid, setIsValid] = React.useState(tokenService.validateToken());
  const value = React.useMemo(() => ({ isValid, setIsValid }));
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { useAuthContext, AuthProvider };
