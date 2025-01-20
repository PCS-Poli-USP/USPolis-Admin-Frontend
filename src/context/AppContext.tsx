import { Auth, Hub } from 'aws-amplify';
import { User } from 'models/common/user.common.model';
import React, { createContext, useEffect, useState } from 'react';
import SelfService from 'services/api/self.service';

interface AppContext {
  loading: boolean;
  setLoading: (value: boolean) => void;
  username: string;
  loggedUser: User | null;
  logout: () => void;
}

const DEFAULT_VALUE = {
  loading: false,
  setLoading: () => {},
  username: '',
  loggedUser: null,
  logout: async () => {},
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
      await Auth.currentUserInfo();
      const self = await selfService.getSelf();
      setLoggedUser(self.data);
      console.log('Usuário logado:');
      console.log(self.data);
      localStorage.setItem('user', JSON.stringify(self.data));
    } catch (error) {
      console.error(error);
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
    Auth.signOut();
    localStorage.removeItem('user');
  }

  useEffect(() => {
    if (accessToken && !loggedUser) {
      getSelfFromBackend();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, loggedUser]);

  return (
    <appContext.Provider
      value={{ loading, setLoading, username, loggedUser, logout }}
    >
      {children}
    </appContext.Provider>
  );
}
