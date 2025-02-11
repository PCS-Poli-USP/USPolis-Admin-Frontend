import useSelfService from 'hooks/API/services/useSelfService';
import { UserResponse } from 'models/http/responses/user.response.models';
import React, { createContext, useEffect, useState } from 'react';

interface AppContext {
  loading: boolean;
  setLoading: (value: boolean) => void;
  loggedUser: UserResponse | null;
  logout: () => Promise<void>;
  accessToken: string;
  setAccessToken: (value: string) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  getSelfFromBackend: () => Promise<void>;
  persist: boolean;
  setPersist: (value: boolean) => void;
}

const DEFAULT_VALUE = {
  loading: false,
  setLoading: () => {},
  loggedUser: null,
  accessToken: '',
  setAccessToken: () => {},
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  logout: async () => {},
  getSelfFromBackend: async () => {},
  persist: false,
  setPersist: () => {},
};

export const appContext = createContext<AppContext>(DEFAULT_VALUE);

export default function AppContextProvider({
  children,
}: React.PropsWithChildren<{}>) {
  const [loading, setLoading] = useState(false);
  const [loadingUser, setLoadingUser] = useState(false);
  const [loggedUser, setLoggedUser] = useState<UserResponse | null>(null);
  const [accessToken, setAccessToken] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [persist, setPersist] = useState<boolean>(true);

  const selfService = useSelfService();

  async function getSelfFromBackend() {
    try {
      setLoadingUser(true);
      const self = await selfService.getSelf();
      setLoggedUser(self.data);
      setIsAuthenticated(true);
    } catch (e: any) {
      if (e.response.status === 403) {
        throw new Error('User with this email not registered');
      }
      if (e.response.status === 401 && e.response.detail === 'Token expired') {
        console.log('Token expired, logging out... (from getSelf)');
        logout();
      }
    } finally {
      setLoadingUser(false);
    }
  }

  async function logout() {
    console.log('Logging out...');
    localStorage.removeItem('refresh_token');
    setLoggedUser(null);
    setAccessToken('');
    setIsAuthenticated(false);
    setLoading(false);
    setIsAuthenticated(false);
  }

  useEffect(() => {
    if (accessToken && !loggedUser && !loadingUser) {
      getSelfFromBackend();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, loggedUser, loadingUser]);

  return (
    <appContext.Provider
      value={{
        loading,
        setLoading,
        loggedUser,
        accessToken,
        setAccessToken,
        isAuthenticated,
        setIsAuthenticated,
        logout,
        getSelfFromBackend,
        persist,
        setPersist,
      }}
    >
      {children}
    </appContext.Provider>
  );
}
