import useSelfService from '../hooks/API/services/useSelfService';
import { UserResponse } from '../models/http/responses/user.response.models';
import React, { createContext, useEffect, useState } from 'react';
import { AuthHttpService } from '../services/auth/auth.service';

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
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
}: React.PropsWithChildren<{}>) {
  const [loading, setLoading] = useState(false);
  const [loggedUser, setLoggedUser] = useState<UserResponse | null>(null);
  const [accessToken, setAccessToken] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [persist, setPersist] = useState<boolean>(true);

  const selfService = useSelfService();
  const authHttpService = new AuthHttpService();

  async function getSelfFromBackend() {
    try {
      setLoading(true);
      const self = await selfService.getSelf();
      setLoggedUser({
        ...self.data,
        buildings: !!self.data.buildings
          ? self.data.buildings.sort((a, b) => a.name.localeCompare(b.name))
          : [],
      });
      setIsAuthenticated(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      console.error('Error getting self from backend:', e);
      console.log(e);

      if (e.message == 'Network Error') {
        console.log('Server error, logging out... (from getSelf)');
        logout();
      }

      if (e.response.status === 403) {
        throw new Error('User with this email not registered');
      }
      if (e.response.status === 401 && e.response.detail === 'Token expired') {
        console.log('Token expired, logging out... (from getSelf)');
        logout();
      }
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    console.log('Logging out...');
    try {
      await authHttpService.logout();
      console.log('Logout user session on backend!');
    } catch (e) {
      console.error(e);
    }

    localStorage.removeItem('refresh_token');
    setLoggedUser(null);
    setAccessToken('');
    setIsAuthenticated(false);
    setLoading(false);
    setIsAuthenticated(false);
  }

  useEffect(() => {
    if (accessToken && !loggedUser && !loading) {
      getSelfFromBackend();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, loggedUser, loading]);

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
