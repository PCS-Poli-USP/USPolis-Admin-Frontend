import { ChakraProvider } from '@chakra-ui/react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { chakraTheme, muiTheme } from './utils/theme';
import { ThemeProvider } from '@mui/material';
import 'moment/locale/pt-br';
import AppContextProvider from './context/AppContext';
import EmptyPage from './components/common/EmptyPage';
import Solicitations from './pages/solicitations/solicitations';
import MySolicitations from './pages/mySolicitations/mySolicitations';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Page404 from './pages/page404';
import AuthPage from './pages/auth';
import RestrictedRoute from './routes/restricted.route';
import React from 'react';
// Providers, Contexts
import FeatureGuideProvider from './context/FeatureGuideContext';

// Routes
import AdminRoute from './routes/admin.route';
import AxiosInterceptorRoute from './routes/axiosInterceptor.route';
import PersistLogin from './routes/persistLogin.route';
import PrivateRoute from './routes/private.route';

// Pages
import Allocation from './pages/allocation/allocation';
import AuthCallbackPage from './pages/auth/auth-callback';
import Buildings from './pages/buildings/buildings';
import Calendars from './pages/calendars/';
import Classes from './pages/classes/';
import Classrooms from './pages/classrooms/classrooms';
import ClassroomCalendarPrintPage from './pages/print';
import ConflictsPage from './pages/conflicts/conflicts';
import FindClasses from './pages/findClasses';
import Groups from './pages/groups/groups';
import Home from './pages/home';
import InstitutionalEvents from './pages/institutionalEvents';
import LoadingPage from './components/common/LoadingPage';
import LoadingRedirect from './pages/auth/loadingRedirect';
import Profile from './pages/profile/profile';
import RedirectError from './pages/auth/redirectError';
import Reservations from './pages/reservations';
import Subjects from './pages/subjects/subjects';
import Users from './pages/users/users';

const clientId = import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={muiTheme}>
      <ChakraProvider theme={chakraTheme}>
        <GoogleOAuthProvider clientId={clientId!}>
          <AppContextProvider>
            <LocalizationProvider
              dateAdapter={AdapterMoment}
              adapterLocale='pt-br'
            >
              <FeatureGuideProvider>
                <BrowserRouter>
                  <Routes>
                    <Route path='/auth' element={<AuthPage />} />
                    <Route
                      path='auth-callback'
                      element={<AuthCallbackPage />}
                    />
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
                          <Route
                            path='find-classes'
                            element={<FindClasses />}
                          />

                          {/* Private routes */}
                          <Route element={<PrivateRoute />}>
                            <Route path='profile' element={<Profile />} />
                            <Route
                              path='my-solicitations'
                              element={<MySolicitations />}
                            />

                            {/* Restricted routes */}
                            <Route element={<RestrictedRoute />}>
                              <Route path='subjects' element={<Subjects />} />
                              <Route path='calendars' element={<Calendars />} />
                              <Route
                                path='classrooms'
                                element={<Classrooms />}
                              />
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
                </BrowserRouter>
              </FeatureGuideProvider>
            </LocalizationProvider>
          </AppContextProvider>
        </GoogleOAuthProvider>
      </ChakraProvider>
    </ThemeProvider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
