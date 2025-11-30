import { Navigate, Route, Routes } from 'react-router-dom';

import 'moment/locale/pt-br';
import EmptyPage from './components/common/EmptyPage';
import Solicitations from './pages/solicitations/solicitations';
import MySolicitations from './pages/mySolicitations/mySolicitations';
import RestrictedRoute from './routes/restricted.route';

// Routes
import AdminRoute from './routes/admin.route';
import AxiosInterceptorRoute from './routes/axiosInterceptor.route';
import PersistLogin from './routes/persistLogin.route';
import PrivateRoute from './routes/private.route';

// Pages
import Page404 from './pages/page404';
import AuthPage from './pages/auth';
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
import Profile from './pages/profile/profile';
import Reservations from './pages/reservations';
import Subjects from './pages/subjects/subjects';
import Users from './pages/users/users';
import FindExams from './pages/findExams';
import Reports from './pages/reports';
import Feedbacks from './pages/feedbacks';
import ReportsPage from './pages/occupationReports/reports';
import ExternalDocsRedirect from './routes/externalDocsRedirect';

function AppRoutes() {
  return (
    <Routes>
      <Route path='/auth' element={<AuthPage />} />
      <Route path='auth-callback' element={<AuthCallbackPage />} />
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
            {/* Docs */}
            <Route path='/docs/*' element={<ExternalDocsRedirect />} />

            {/* Not found */}
            <Route path='*' element={<Page404 />} />

            {/* Public routes */}
            <Route path='allocation' element={<Allocation />} />
            <Route path='find-classes' element={<FindClasses />} />
            <Route path='find-exams' element={<FindExams />} />

            {/* Private routes */}
            <Route element={<PrivateRoute />}>
              <Route path='profile' element={<Profile />} />
              <Route path='my-solicitations' element={<MySolicitations />} />

              {/* Restricted routes */}
              <Route element={<RestrictedRoute />}>
                <Route path='subjects' element={<Subjects />} />
                <Route path='calendars' element={<Calendars />} />
                <Route path='classrooms' element={<Classrooms />} />
                <Route path='classes' element={<Classes />} />
                <Route path='reservations' element={<Reservations />} />
                <Route path='conflicts' element={<ConflictsPage />} />
                <Route path='solicitations' element={<Solicitations />} />
                <Route path='reports' element={<ReportsPage />} />
              </Route>

              {/* Admin routes */}
              <Route path='' element={<AdminRoute />}>
                <Route path='users' element={<Users />} />
                <Route path='groups' element={<Groups />} />
                <Route path='buildings' element={<Buildings />} />
                <Route path='bug-reports' element={<Reports />} />
                <Route path='feedbacks' element={<Feedbacks />} />
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
  );
}

export default AppRoutes;
