import { ReactNode, createContext, useEffect, useState } from 'react';

interface SessionProviderProps {
  children: ReactNode;
}
interface SessionContextType {
  isLoggedIn: boolean;
  userContext: string;
  setNewUserContext: (data: string) => void;
  passwordContext: string;
  setNewUserPassword: (data: string) => void;
  rolContext: string;
  setNewUserRol: (data: string) => void;
  login: () => void;
  logout: () => void;
}

export const SessionContext = createContext<SessionContextType>({
  isLoggedIn: false,
  userContext: '',
  setNewUserContext: (data:string) => {},
  passwordContext: '',
  setNewUserPassword: (data:string) => {},
  rolContext: '',
  setNewUserRol: (data:string) => {},
  login: () => {},
  logout: () => {},
});

export const SessionProvider = ({ children }: SessionProviderProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userContext, setUserContext] = useState('');
  const [passwordContext, setPasswordContext] = useState('');
  const [rolContext, setRolContext] = useState('');

  const login = () => {
    setIsLoggedIn(true);
  };
  const logout = () => {
    setIsLoggedIn(false);
  };
  const setNewUserContext = (data: string) => {
    setUserContext(data);
  };
  const setNewUserPassword = (data: string) => {
    setPasswordContext(data);
  };

  const setNewUserRol = (data: string) => {
    setRolContext(data);
  };

  const value: SessionContextType = {
    isLoggedIn,
    userContext,
    setNewUserContext,
    passwordContext,
    setNewUserPassword,
    rolContext,
    setNewUserRol,
    login,
    logout,
  };
  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
};
