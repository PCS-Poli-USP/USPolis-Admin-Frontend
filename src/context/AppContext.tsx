import { UserResponse } from 'models/http/responses/user.response.models';
import React, { createContext, useEffect, useState } from 'react';
import SelfService from 'services/api/self.service';

interface AppContext {
  loading: boolean;
  setLoading: (value: boolean) => void;
  loggedUser: UserResponse | null;
  logout: () => Promise<void>;
  getSelfFromBackend: () => Promise<void>;
}

const DEFAULT_VALUE = {
  loading: false,
  setLoading: () => {},
  loggedUser: null,
  logout: async () => {},
  getSelfFromBackend: async () => {},
};

export const appContext = createContext<AppContext>(DEFAULT_VALUE);

export default function AppContextProvider({
  children,
}: React.PropsWithChildren<{}>) {
  const [loading, setLoading] = useState(false);
  const [loggedUser, setLoggedUser] = useState<UserResponse | null>(null);

  const selfService = new SelfService();

  async function getSelfFromBackend() {
    try {
      const self = await selfService.getSelf();
      setLoggedUser(self.data);
      // localStorage.setItem('user', JSON.stringify(self.data));
    } catch (e: any) {
      if (e.response.status === 403) {
        throw new Error('User with this email not registered');
      }
      if (e.response.status === 401 && e.response.detail === 'Token expired') {
        logout();
      }
    }
  }

  async function logout() {
    localStorage.removeItem('access_token');
    setLoggedUser(null);
    setLoading(false);
  }

  useEffect(() => {
    getSelfFromBackend();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <appContext.Provider
      value={{
        loading,
        setLoading,
        loggedUser,
        logout,
        getSelfFromBackend,
      }}
    >
      {children}
    </appContext.Provider>
  );
}
