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
import reportWebVitals from './reportWebVitals';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { chakraTheme, muiTheme } from 'utils/theme';
import { ThemeProvider } from '@mui/material';
import 'moment/locale/pt-br';
import { Amplify } from 'aws-amplify';
import awsConfig from 'aws-config';
import AppContextProvider from 'context/AppContext';
import Buildings from 'pages/buildings/buildings';
import Users from 'pages/users/users';
import ConflictsPage from 'pages/conflicts/conflicts';
import Subjects from 'pages/subjects/subjects';
import Calendars from 'pages/calendars/';
import Reservations from 'pages/reservations';
import EmptyPage from 'components/common/EmptyPage';
import Solicitations from 'pages/solicitations/solicitations';
import MySolicitations from 'pages/mySolicitations/mySolicitations';
import { GoogleOAuthProvider } from '@react-oauth/google';
import PrivateRoute from 'components/routes/private.route';
import AdminRoute from 'components/routes/admin.route';
import Page404 from 'pages/page404';
import { AuthPage } from 'pages/auth';
import RestrictedRoute from 'components/routes/restricted.route';
import { AuthCallbackPage } from 'pages/auth/auth-callback';
import Home from 'pages/home';
import FindClasses from 'pages/findClasses';
import LoadingRedirect from 'pages/auth/loadingRedirect';
import RedirectError from 'pages/auth/redirectError';
import PersistLogin from 'components/routes/persistLogin.route';
import AxiosInterceptorRoute from 'components/routes/axiosInterceptor.route';
import LoadingPage from 'components/common/LoadingPage';
import ClassroomCalendarPrintPage from 'pages/print';
import FeatureGuideProvider from 'context/FeatureGuideContext';
import { Groups } from 'pages/groups/groups';

Amplify.configure(awsConfig);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  // <React.StrictMode>
  <ThemeProvider theme={muiTheme}>
    <ChakraProvider theme={chakraTheme}>
      <GoogleOAuthProvider
        clientId={process.env.REACT_APP_GOOGLE_AUTH_CLIENT_ID!}
      >
        <AppContextProvider>
          <LocalizationProvider
            dateAdapter={AdapterMoment}
            adapterLocale='pt-br'
          >
            <FeatureGuideProvider>
              <Router>
                <Routes>
                  <Route path='/auth' element={<AuthPage />} />
                  <Route path='auth-callback' element={<AuthCallbackPage />} />
                  <Route
                    path='/test-auth-callback'
                    element={<LoadingRedirect />}
                  />
                  <Route
                    path='/test-auth-callback-error'
                    element={<RedirectError error='Mock error bro' />}
                  />
                  <Route path='/loading-page' element={<LoadingPage />} />
                  <Route element={<AxiosInterceptorRoute />}>
                    <Route element={<PersistLogin />}>
                      <Route
                        path='/print/classroom-calendar'
                        element={<ClassroomCalendarPrintPage />}
                      />
                      <Route path='/' element={<Navigate to='/index' />} />
                      <Route path='/index' element={<Home />} />
                      <Route path='/' element={<EmptyPage />}>
                        {/* Not found */}
                        <Route path='*' element={<Page404 />} />

                        {/* Public routes */}
                        <Route path='allocation' element={<Allocation />} />
                        <Route path='find-classes' element={<FindClasses />} />

                        {/* Private routes */}
                        <Route element={<PrivateRoute />}>
                          <Route
                            path='my-solicitations'
                            element={<MySolicitations />}
                          />

                          {/* Restricted routes */}
                          <Route element={<RestrictedRoute />}>
                            <Route path='subjects' element={<Subjects />} />
                            <Route path='calendars' element={<Calendars />} />
                            <Route path='classrooms' element={<Classrooms />} />
                            <Route path='classes' element={<Classes />} />
                            <Route
                              path='reservations'
                              element={<Reservations />}
                            />
                            <Route
                              path='conflicts'
                              element={<ConflictsPage />}
                            />
                            <Route
                              path='solicitations'
                              element={<Solicitations />}
                            />
                          </Route>

                          {/* Admin routes */}
                          <Route path='' element={<AdminRoute />}>
                            <Route path='users' element={<Users />} />
                            <Route path='groups' element={<Groups />} />
                            <Route path='buildings' element={<Buildings />} />
                            <Route
                              path='institutional-events'
                              element={<InstitutionalEvents />}
                            />
                          </Route>
                        </Route>
                      </Route>
                    </Route>
                  </Route>
                </Routes>
              </Router>
            </FeatureGuideProvider>
          </LocalizationProvider>
        </AppContextProvider>
      </GoogleOAuthProvider>
    </ChakraProvider>
  </ThemeProvider>,
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
