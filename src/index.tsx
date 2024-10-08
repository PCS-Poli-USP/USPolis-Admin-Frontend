import { ChakraProvider } from '@chakra-ui/react';
import Allocation from 'pages/allocation/allocation';
import Classes from 'pages/classes/';
import Classrooms from 'pages/classrooms/classrooms';
import InstitutionalEvents from 'pages/institutionalEvents';
import ReactDOM from 'react-dom/client';
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { chakraTheme, muiTheme } from 'utils/chakra.theme';
import { ThemeProvider } from '@mui/material';
import 'moment/locale/pt-br';
import { Amplify } from 'aws-amplify';
import awsConfig from 'aws-config';
import AuthRoute from 'components/routes/auth.route';
import AppContextProvider from 'context/AppContext';
import Buildings from 'pages/buildings/buildings';
import Users from 'pages/users/users';
import ConflictsPage from 'pages/conflicts/conflicts';
import Subjects from 'pages/subjects/subjects';
import Calendars from 'pages/calendars/';
import Reservations from 'pages/reservations';
import EmptyPage from 'components/common/EmptyPage';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { LoginPage } from 'pages/login';
import PrivateRoute from 'components/routes/private.route';

Amplify.configure(awsConfig);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  // <React.StrictMode>
  <ThemeProvider theme={muiTheme}>
    <ChakraProvider theme={chakraTheme}>
      <GoogleOAuthProvider clientId='903358108153-kj9u7e4liu19cm73lr6hlhi876smdscj.apps.googleusercontent.com'>
        <AppContextProvider>
          <LocalizationProvider
            dateAdapter={AdapterMoment}
            adapterLocale='pt-br'
          >
            <Router>
              <Routes>
                <Route path='/' element={<Navigate to='/index' />} />
                <Route path='/index' element={<App />} />
                <Route path='/login' element={<LoginPage />} />
                {/* Private Routes */}
                <Route path='/' element={<EmptyPage />}>
                  <Route
                    path='users'
                    element={<PrivateRoute element={<Users />} />}
                  />
                  <Route
                    path='buildings'
                    element={<PrivateRoute element={<Buildings />} />}
                  />
                  <Route
                    path='subjects'
                    element={<PrivateRoute element={<Subjects />} />}
                  />
                  <Route
                    path='calendars'
                    element={<PrivateRoute element={<Calendars />} />}
                  />
                  <Route
                    path='classrooms'
                    element={<PrivateRoute element={<Classrooms />} />}
                  />
                  <Route
                    path='classes'
                    element={<PrivateRoute element={<Classes />} />}
                  />
                  <Route
                    path='allocation'
                    element={<PrivateRoute element={<Allocation />} />}
                  />
                  <Route
                    path='reservations'
                    element={<PrivateRoute element={<Reservations />} />}
                  />
                  <Route
                    path='conflicts'
                    element={<PrivateRoute element={<ConflictsPage />} />}
                  />
                  <Route
                    path='institutional-events'
                    element={<InstitutionalEvents />}
                  />
                </Route>
              </Routes>
            </Router>
          </LocalizationProvider>
        </AppContextProvider>
      </GoogleOAuthProvider>
    </ChakraProvider>
  </ThemeProvider>,
  // {/* </React.StrictMode>, */}
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
