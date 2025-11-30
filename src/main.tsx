import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { chakraTheme, muiTheme } from './utils/theme';
import { ThemeProvider } from '@mui/material/styles';

import 'moment/locale/pt-br';
import AppContextProvider from './context/AppContext';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Providers, Contexts
import FeatureGuideProvider from './context/FeatureGuideContext';
import MenuContextProvider from './context/MenuContext';

import AppRoutes from './AppRoutes';
import { BrowserRouter } from 'react-router-dom';

const clientId = import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ThemeProvider theme={muiTheme} defaultMode='light'>
    <ChakraProvider theme={chakraTheme}>
      <ColorModeScript initialColorMode={chakraTheme.config.initialColorMode} />
      <GoogleOAuthProvider clientId={clientId!}>
        <AppContextProvider>
          <MenuContextProvider>
            <LocalizationProvider
              dateAdapter={AdapterMoment}
              adapterLocale='pt-br'
            >
              <FeatureGuideProvider>
                <BrowserRouter>
                  <AppRoutes />
                </BrowserRouter>
              </FeatureGuideProvider>
            </LocalizationProvider>
          </MenuContextProvider>
        </AppContextProvider>
      </GoogleOAuthProvider>
    </ChakraProvider>
  </ThemeProvider>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
