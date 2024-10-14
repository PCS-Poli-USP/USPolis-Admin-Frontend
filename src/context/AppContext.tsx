import { User } from 'models/common/user.common.model';
import React, { createContext, useEffect, useState } from 'react';
import SelfService from 'services/api/self.service';

interface AppContext {
  loading: boolean;
  setLoading: (value: boolean) => void;
  username: string;
  loggedUser: User | null;
  logout: () => void;
  getSelfFromBackend: () => void;
}

const DEFAULT_VALUE = {
  loading: false,
  setLoading: () => {},
  username: '',
  loggedUser: null,
  logout: async () => {},
  getSelfFromBackend: async () => {},
};

export const appContext = createContext<AppContext>(DEFAULT_VALUE);

export default function AppContextProvider({
  children,
}: React.PropsWithChildren<{}>) {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [loggedUser, setLoggedUser] = useState<User | null>(null);

  const selfService = new SelfService();

  async function getSelfFromBackend() {
    try {
      const self = await selfService.getSelf();
      setLoggedUser(self.data);
      localStorage.setItem('user', JSON.stringify(self.data));
    } catch (e: any) {
      if(e.response.status === 403) {
        throw new Error("User with this email not registered")
      }
    }
  }

  async function getSelf() {
    const userFromStorage = localStorage.getItem('user');
    if (!userFromStorage) {
      await getSelfFromBackend();
    } else {
      const parsedUser: User = JSON.parse(userFromStorage) as User;
      setLoggedUser(parsedUser);
      console.log('Usuário logado (storage):');
      console.log(parsedUser);
    }
  }

  async function logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = '/login';
  }

  useEffect(() => {
    getSelf();
  }, []);

  return (
    <appContext.Provider
      value={{
        loading,
        setLoading,
        username,
        loggedUser,
        logout,
        getSelfFromBackend,
      }}
    >
      {children}
    </appContext.Provider>
  );
}
