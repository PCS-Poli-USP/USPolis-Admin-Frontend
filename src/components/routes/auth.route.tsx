import { withAuthenticator } from '@aws-amplify/ui-react';
import { Auth } from 'aws-amplify';
import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

function AuthRoute() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then(() => setIsAuthenticated(true))
      .catch(() => {
        if (isAuthenticated) setIsAuthenticated(false);
      });
  }, [isAuthenticated]);

  // return isAuthenticated ? <Outlet /> : <Navigate to='/index' />;
  return <Outlet />;
}

export default withAuthenticator(AuthRoute, {
  hideSignUp: true,
});
