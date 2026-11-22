import useSelfService from '../hooks/API/services/useSelfService';
import { UserResponse } from '../models/http/responses/user.response.models';
import { UserAccessResponse } from '../models/http/responses/access.response.models';
import React, { createContext, useEffect, useState } from 'react';
import { AuthHttpService } from '../services/auth/auth.service';
import { useMediaQuery } from '@chakra-ui/react';
import { identifyClarityUser } from '../services/analytics/clarity';

interface AppContext {
  loading: boolean;
  setLoading: (value: boolean) => void;
  loggedUser: UserResponse | null;
  /** What the logged user can see and do (GET /users/my-access). Read it
   * through src/utils/access/access.ts. */
  access: UserAccessResponse | null;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  getSelfFromBackend: () => Promise<void>;
  persist: boolean;
  setPersist: (value: boolean) => void;
  isMobile: boolean;
  backendUnavailable: boolean;
  setBackendUnavailable: (value: boolean) => void;
}

const DEFAULT_VALUE = {
  loading: false,
  setLoading: () => {},
  loggedUser: null,
  access: null,
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  logout: async () => {},
  getSelfFromBackend: async () => {},
  persist: false,
  setPersist: () => {},
  isMobile: false,
  backendUnavailable: false,
  setBackendUnavailable: () => {},
};

export const appContext = createContext<AppContext>(DEFAULT_VALUE);

export default function AppContextProvider({
  children,
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
}: React.PropsWithChildren<{}>) {
  const [isMobile] = useMediaQuery('(max-width: 800px)');
  const [loading, setLoading] = useState(false);
  const [loggedUser, setLoggedUser] = useState<UserResponse | null>(null);
  const [access, setAccess] = useState<UserAccessResponse | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [persist, setPersist] = useState<boolean>(true);
  const [backendUnavailable, setBackendUnavailable] = useState<boolean>(false);

  const selfService = useSelfService();
  const authHttpService = new AuthHttpService();

  async function getSelfFromBackend() {
    try {
      setLoading(true);
      const [self, myAccess] = await Promise.all([
        selfService.getSelf(),
        selfService.getMyAccess(),
      ]);
      setAccess(myAccess.data);
      setLoggedUser({
        ...self.data,
        buildings: self.data.buildings
          ? self.data.buildings.sort((a, b) => a.name.localeCompare(b.name))
          : [],
      });
      setIsAuthenticated(true);
      identifyClarityUser(self.data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      console.error('Error getting self from backend:', e);
      console.log(e);

      if (e.message == 'Network Error') {
        console.log('Server error, logging out... (from getSelf)');
        logout();
      }

      if (e.response?.status === 403) {
        throw new Error('User with this email not registered');
      }
      // 401: no valid session cookie - simply not logged in.
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

    setLoggedUser(null);
    setAccess(null);
    setIsAuthenticated(false);
    setLoading(false);
  }

  // Authentication is the httpOnly `session` cookie alone. Older versions
  // kept the Google refresh token in localStorage (readable by any XSS):
  // drop whatever is left of it.
  useEffect(() => {
    try {
      localStorage.removeItem('refresh_token');
    } catch {
      // storage unavailable (private mode, blocked site data): nothing to clean
    }
  }, []);

  return (
    <appContext.Provider
      value={{
        loading,
        setLoading,
        loggedUser,
        access,
        isAuthenticated,
        setIsAuthenticated,
        logout,
        getSelfFromBackend,
        persist,
        setPersist,
        isMobile,
        backendUnavailable,
        setBackendUnavailable,
      }}
    >
      {children}
    </appContext.Provider>
  );
}
