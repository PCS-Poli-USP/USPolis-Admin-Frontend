import { appContext } from 'context/AppContext';
import { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthHttpService } from 'services/auth/auth.service';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const AuthCallbackPage = () => {
  const [error, setError] = useState<string | null>(null);
  const query = useQuery();
  const authService = new AuthHttpService();
  const { getSelfFromBackend } = useContext(appContext);
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
    const response = await authService.getTokens(code);
    const { access_token, refresh_token } = response.data;
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
    await getSelfFromBackend();
    navigate('/classes');
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
