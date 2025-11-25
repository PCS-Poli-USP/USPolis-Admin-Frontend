import { appContext } from '../../context/AppContext';
import { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthHttpService } from '../../services/auth/auth.service';
import LoadingRedirect from './loadingRedirect';
import RedirectError from './redirectError';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const AuthCallbackPage = () => {
  const authService = new AuthHttpService();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const query = useQuery();
  const { setAccessToken, setIsAuthenticated } = useContext(appContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (error) return;
    const code = query.get('code');
    redirect(code);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, error]);

  async function redirect(code: string | null): Promise<void> {
    if (code == null) {
      setError(
        'Não foi possível adquirir código de autenticação por parâmetros do redirect',
      );
      return;
    }
    if (!loading) {
      try {
        console.log('Aqui, cahamdno get tokesn./....');
        setLoading(true);
        const response = await authService.getTokens(code);
        const { access_token, refresh_token } = response.data;
        setAccessToken(access_token);
        setIsAuthenticated(true);
        localStorage.setItem('refresh_token', refresh_token);
        // await getSelfFromBackend(); // Not use like this, let useEffect in appContext fetch the user (axios interceptor isn`t fast enough to get the token)
        navigate('/allocation');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.log(error);
        setError(
          'Erro ao utilizar seu código de autenticação, tente logar novamente.',
        );
      } finally {
        setLoading(false);
      }
    }
  }

  return (
    <div>
      {error == null ? <LoadingRedirect /> : <RedirectError error={error} />}
    </div>
  );
};

export default AuthCallbackPage;
