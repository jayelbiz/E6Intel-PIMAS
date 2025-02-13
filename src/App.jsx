import PropTypes from "prop-types";
import React, { useMemo } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { connect } from "react-redux";
import { createSelector } from "reselect";

// Import Routes
import { authProtectedRoutes, publicRoutes } from "./routes/index";
import Authmiddleware from "./routes/route";
import { authRoutes, PrivateRoute } from './routes/AuthRoutes';

// Components
import GlobalNavbar from "./components/GlobalNavbar";
import NonAuthLayout from "./components/NonAuthLayout";
import { AuthProvider } from "./hooks/useAuth";
import Layout from './components/Layout/Layout';

// Pages
import Dashboard from './pages/Dashboard';

// PrimeReact imports
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";

// Import scss
import "./assets/scss/theme.scss";

import fakeBackend from "./helpers/AuthType/fakeBackend"
// Activating fake backend
fakeBackend();

// Create memoized selector
const selectAuth = createSelector(
  state => state.auth,
  auth => auth || {}
);

const App = () => {
  const { isAuthenticated } = useSelector(selectAuth);

  return (
    <AuthProvider>
      <React.Fragment>
        {isAuthenticated && <GlobalNavbar />}
        <div className="pt-0">
          <Routes>
            {/* Auth Routes */}
            {authRoutes.map((route, idx) => (
              <Route key={idx} path={route.path} element={route.element} />
            ))}

            {/* Public Routes */}
            {publicRoutes.map((route, idx) => (
              <Route
                key={idx}
                path={route.path}
                element={
                  <NonAuthLayout>
                    {route.element}
                  </NonAuthLayout>
                }
              />
            ))}

            {/* Protected Routes */}
            {authProtectedRoutes.map((route, idx) => (
              <Route
                key={idx}
                path={route.path}
                element={
                  <Authmiddleware>
                    <Layout>{route.component}</Layout>
                  </Authmiddleware>
                }
              />
            ))}

            {/* Default Route */}
            <Route
              path="/"
              element={
                isAuthenticated ? (
                  <Navigate to="/dashboard" />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            {/* Dashboard Route */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </React.Fragment>
    </AuthProvider>
  );
};

App.propTypes = {
  layout: PropTypes.any,
};

// No need for mapStateToProps since we're using useSelector
export default App;
