import { appContext } from 'context/AppContext';
import { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthHttpService } from 'services/auth/auth.service';
import LoadingRedirect from './loadingRedirect';
import RedirectError from './redirectError';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const AuthCallbackPage = () => {
  const authService = new AuthHttpService();
  const [error, setError] = useState<string | null>(null);
  const query = useQuery();
  const { getSelfFromBackend, setAccessToken, setIsAuthenticated } = useContext(appContext);
  const navigate = useNavigate();

  useEffect(() => {
    const code = query.get('code');
    redirect(code);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  async function redirect(code: string | null): Promise<void> {
    if (code == null) {
      setError(
        'Não foi possível adquirir código de autenticação por parâmetros do redirect',
      );
      return;
    }
    console.log('Redirecting with code:', code);
    const response = await authService.getTokens(code);
    const { access_token, refresh_token } = response.data;
    console.log('Access token:', access_token);
    setAccessToken(access_token);
    setIsAuthenticated(true);
    localStorage.setItem('refresh_token', refresh_token);
    // await getSelfFromBackend(); // Not use like this, let useEffect in appContext fetch the user (axios interceptor isn`t fast enough to get the token)
    navigate('/allocation');
  }

  return (
    <div>
      {error == null ? <LoadingRedirect /> : <RedirectError error={error} />}
    </div>
  );
};

export { AuthCallbackPage };
