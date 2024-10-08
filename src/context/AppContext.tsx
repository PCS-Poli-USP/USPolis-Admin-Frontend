import { Auth, Hub } from 'aws-amplify';
import { User } from 'models/common/user.common.model';
import React, { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  getSelfFromBackend: async () => {}
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
    localStorage.removeItem('user');
    localStorage.removeItem("token");
    window.location.href = '/login';
  }

  useEffect(() => {
    Auth.currentUserInfo().then((it) => setUsername(it?.username));
    getSelf();
  }, []);

  useEffect(() => {
    Hub.listen('auth', (data) => {
      getSelf();
      console.log(
        'A new auth event has happened: ',
        data.payload.data.username + ' has ' + data.payload.event,
      );
    });
  }, []);

  return (
    <appContext.Provider
      value={{ loading, setLoading, username, loggedUser, logout, getSelfFromBackend }}
    >
      {children}
    </appContext.Provider>
  );
}
