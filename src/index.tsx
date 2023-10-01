import { ChakraProvider } from '@chakra-ui/react';
import Allocation from 'pages/allocation';
import Classes from 'pages/classes';
import Classrooms from 'pages/classrooms';
import Events from 'pages/events';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { Amplify } from 'aws-amplify';
import awsConfig from 'aws-config';
import AuthRoute from 'components/routes/auth.route';
import AppContextProvider from 'context/AppContext';
import theme from 'utils/chakra.theme';

Amplify.configure(awsConfig);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <AppContextProvider>
        <Router>
          <Routes>
            {/* <Route path='/' element={<Navigate to='/index' />} /> */}
            {/* <Route path='/index' element={<App />} /> */}
            {/* Private Routes */}
            <Route path='classrooms' element={<Classrooms />} />
            <Route path='classes' element={<Classes />} />
            <Route path='allocation' element={<Allocation />} />
            <Route path='events' element={<Events />} />
          </Routes>
        </Router>
      </AppContextProvider>
    </ChakraProvider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
