import { appContext } from 'context/AppContext';
import { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthHttpService } from 'services/auth/auth.service';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const AuthCallbackPage = () => {
  const authService = new AuthHttpService();
  const [error, setError] = useState<string | null>(null);
  const query = useQuery();
  const { getSelfFromBackend, setAccessToken } = useContext(appContext);
  const navigate = useNavigate();

  useEffect(() => {
    const code = query.get('code');
    redirect(code);
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
    setAccessToken(access_token);
    localStorage.setItem('refresh_token', refresh_token);
    await getSelfFromBackend();
    navigate('/allocation');
  }

  return (
    <div>
      {error == null ? (
        <p>Login efetuado com sucesso, aguarde redirecionamento....</p>
      ) : (
        <>
          <h1>Um erro aconteceu:</h1>
          <p>{error}</p>
        </>
      )}
    </div>
  );
};

export { AuthCallbackPage };
