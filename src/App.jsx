import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// Import routes
import { publicRoutes, protectedRoutes } from './routes/route';
import Authmiddleware from './routes/route';

// Import layouts
import NonAuthLayout from './layouts/NonAuthLayout';
import VerticalLayout from './layouts/VerticalLayout';

// Import context provider
import { AuthProvider } from './hooks/useAuth';

// Import PrimeReact styles
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

// Import Skote styles
import './assets/scss/theme.scss';
import './layouts/styles.scss';

const App = () => {
  return (
    <AuthProvider>
      <Suspense fallback={
        <div className="auth-page-wrapper pt-5">
          <div className="auth-page-content">
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6 col-xl-5 text-center">
                  <i className="pi pi-spin pi-spinner" style={{ fontSize: '3rem' }}></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      }>
        <Routes>
          {/* Public Routes */}
          {publicRoutes.map((route, idx) => (
            <Route
              key={idx}
              path={route.path}
              element={
                <NonAuthLayout>
                  <route.component />
                </NonAuthLayout>
              }
            />
          ))}

          {/* Protected Routes */}
          {protectedRoutes.map((route, idx) => (
            <Route
              key={idx}
              path={route.path}
              element={
                <Authmiddleware>
                  <VerticalLayout>
                    <route.component />
                  </VerticalLayout>
                </Authmiddleware>
              }
            />
          ))}
        </Routes>
      </Suspense>
    </AuthProvider>
  );
};

export default App;
