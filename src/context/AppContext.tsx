import { Auth } from 'aws-amplify';
import React, { createContext, useEffect, useState } from 'react';

export interface AppContext {
  loading: boolean;
  setLoading: (value: boolean) => void;
  username: string;
}

const DEFAULT_VALUE = { loading: false, setLoading: () => {}, username: '' };

export const appContext = createContext<AppContext>(DEFAULT_VALUE);

export default function AppContextProvider({ children }: React.PropsWithChildren<{}>) {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    Auth.currentUserInfo().then((it) => setUsername(it?.username));
  }, []);

  return <appContext.Provider value={{ loading, setLoading, username }}>{children}</appContext.Provider>;
}
