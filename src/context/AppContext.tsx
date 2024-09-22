import { Auth, Hub } from 'aws-amplify';
import { UserResponse } from 'models/http/responses/user.response.models';
import React, { createContext, useEffect, useState } from 'react';
import SelfService from 'services/api/self.service';

interface AppContext {
  loading: boolean;
  setLoading: (value: boolean) => void;
  username: string;
  loggedUser: UserResponse | null;
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
  const [loggedUser, setLoggedUser] = useState<UserResponse | null>(null);

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
      const parsedUser: UserResponse = JSON.parse(
        userFromStorage,
      ) as UserResponse;
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
    Auth.currentUserInfo().then((it) => setUsername(it?.username));
    getSelf();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    Hub.listen('auth', (data) => {
      getSelf();
      console.log(
        'A new auth event has happened: ',
        data.payload.data.username + ' has ' + data.payload.event,
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <appContext.Provider
      value={{ loading, setLoading, username, loggedUser, logout }}
    >
      {children}
    </appContext.Provider>
  );
}
