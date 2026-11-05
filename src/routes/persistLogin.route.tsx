import { Outlet } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { appContext } from '../context/AppContext';
import LoadingPage from '../components/common/LoadingPage';

const OVERRIDE = import.meta.env.VITE_OVERRIDE_PERSIST_LOGIN;

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const context = useContext(appContext);

  useEffect(() => {
    if (OVERRIDE === 'true') {
      setIsLoading(false);
      return;
    }

    // The httponly session cookie is sent automatically on this
    // same-origin request (axiosPrivate has withCredentials: true) even
    // with no Authorization header, so this is a real check against the
    // backend - not just "is there a token already in this tab's memory" -
    // and works correctly in a brand-new tab/window that never ran the
    // OAuth flow itself but shares the browser's session cookie.
    const verifySession = async () => {
      try {
        await context.getSelfFromBackend();
      } catch (error) {
        console.error('Error verifying session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (context.persist && !context.isAuthenticated) {
      verifySession();
    } else {
      setIsLoading(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context.persist, context.isAuthenticated]);

  return (
    <>
      {!context.persist ? <Outlet /> : isLoading ? <LoadingPage /> : <Outlet />}
    </>
  );
};

export default PersistLogin;
