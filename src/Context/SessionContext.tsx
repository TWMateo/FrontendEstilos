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
  login: (data: boolean) => void;
  logout: () => void;
  sessionToken: string;
  setNewSessionToken: (data: string) => void;
  usuCedula: string;
  setNewUsuCedula: (data: string) => void;
  usuId: number | undefined;
  setNewUsuId: (data: number | undefined) => void;
  curId: number | undefined;
  setNewCurId: (data: number | undefined) => void;
}

export const SessionContext = createContext<SessionContextType>({
  isLoggedIn: false,
  userContext: '',
  setNewUserContext: (data: string) => {},
  passwordContext: '',
  setNewUserPassword: (data: string) => {},
  rolContext: '',
  setNewUserRol: (data: string) => {},
  login: () => {},
  logout: () => {},
  sessionToken: '',
  setNewSessionToken: (data: string) => {},
  usuCedula: '',
  setNewUsuCedula: (data: string) => {},
  usuId: undefined,
  setNewUsuId: (data: number | undefined) => {},
  curId: undefined,
  setNewCurId: (data: number | undefined) => {},
});

export const SessionProvider = ({ children }: SessionProviderProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userContext, setUserContext] = useState('');
  const [passwordContext, setPasswordContext] = useState('');
  const [rolContext, setRolContext] = useState('');
  const [sessionToken, setSessionToken] = useState('');
  const [usuCedula, setUsuCedula] = useState('');
  const [usuId, setUsuId] = useState<number | undefined>(undefined);
  const [curId, setCurId] = useState<number | undefined>(undefined);

  useEffect(() => {
    const storedIsLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const storedUserContext = localStorage.getItem('userContext') || '';
    const storedPasswordContext = localStorage.getItem('passwordContext') || '';
    const storedRolContext = localStorage.getItem('rolContext') || '';
    const storedSessionToken = localStorage.getItem('sessionToken') || '';
    const storedUsuCedula = localStorage.getItem('usuCedula') || '';
    const storedUsuId = localStorage.getItem('usuId');

    if (storedIsLoggedIn) {
      setIsLoggedIn(storedIsLoggedIn);
      setUserContext(storedUserContext);
      setPasswordContext(storedPasswordContext);
      setRolContext(storedRolContext);
      setSessionToken(storedSessionToken);
      setUsuCedula(storedUsuCedula);
      setUsuId(storedUsuId ? Number(storedUsuId) : undefined);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('isLoggedIn', String(isLoggedIn));
    localStorage.setItem('userContext', userContext);
    localStorage.setItem('passwordContext', passwordContext);
    localStorage.setItem('rolContext', rolContext);
    localStorage.setItem('sessionToken', sessionToken);
    localStorage.setItem('usuCedula', usuCedula);
    localStorage.setItem('usuId', String(usuId));
  }, [
    isLoggedIn,
    userContext,
    passwordContext,
    rolContext,
    sessionToken,
    usuCedula,
    usuId,
  ]);

  const setNewSessionToken = (data: string) => {
    setSessionToken(data);
  };

  const setNewCurId = (data: number | undefined) => {
    setCurId(data);
  };

  const setNewUsuCedula = (data: string) => {
    setUsuCedula(data);
  };

  const setNewUsuId = (data: number | undefined) => {
    setUsuId(data);
  };

  const login = (data: boolean) => {
    setIsLoggedIn(data);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserContext('');
    setPasswordContext('');
    setRolContext('');
    setSessionToken('');
    setUsuCedula('');
    setUsuId(undefined);
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
    sessionToken,
    setNewSessionToken,
    usuCedula,
    setNewUsuCedula,
    usuId,
    setNewUsuId,
    curId,
    setNewCurId,
  };
  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
};
