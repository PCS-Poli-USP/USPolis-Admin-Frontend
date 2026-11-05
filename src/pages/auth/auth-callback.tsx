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
  const [code] = useState<string | null>(query.get('code'));
  const { getSelfFromBackend } = useContext(appContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (error || code == null) return;
    redirect(code);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, error]);

  async function redirect(code: string | null): Promise<void> {
    if (code == null) {
      setError(
        'Não foi possível adquirir código de autenticação por parâmetros do redirect',
      );
      return;
    }
    if (!loading) {
      try {
        setLoading(true);
        // Sets the httpOnly session cookie; the Google tokens in the body
        // are deliberately not kept anywhere.
        await authService.getTokens(code);
        // The cookie now authenticates every request (withCredentials).
        await getSelfFromBackend();
        navigate('/public/allocations');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.log(error);
        if (error.response == null) {
          setError(
            error.message && error.message !== 'Network Error'
              ? error.message
              : 'Erro de rede, tente novamente mais tarde.',
          );
          return;
        }
        const detail =
          error.response.data.detail || error.message || 'Erro desconhecido';
        if (typeof detail === 'string') {
          setError(detail);
          return;
        }
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
