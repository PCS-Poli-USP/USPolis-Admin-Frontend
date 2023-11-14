import { Auth } from 'aws-amplify';
import { User } from 'models/user.model';
import React, { createContext, useEffect, useState } from 'react';
import SelfService from 'services/self.service';

export interface AppContext {
  loading: boolean;
  setLoading: (value: boolean) => void;
  username: string;
  dbUser: User | null;
}

const DEFAULT_VALUE = {
  loading: false,
  setLoading: () => {},
  username: '',
  dbUser: null,
};

export const appContext = createContext<AppContext>(DEFAULT_VALUE);

export default function AppContextProvider({
  children,
}: React.PropsWithChildren<{}>) {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [dbUser, setDbUser] = useState<User | null>(null);

  const selfService = new SelfService();

  async function getSelf() {
    try {
      const self = await selfService.getSelf();
      setDbUser(self.data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    Auth.currentUserInfo().then((it) => setUsername(it?.username));
    getSelf();
  }, []);

  return (
    <appContext.Provider value={{ loading, setLoading, username, dbUser }}>
      {children}
    </appContext.Provider>
  );
}
