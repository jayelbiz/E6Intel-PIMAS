import PropTypes from "prop-types";
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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

const App = () => {
  const { isAuthenticated } = useSelector((state) => state.auth || {});

  return (
    <AuthProvider>
      <Router>
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
                  path={route.path}
                  element={<NonAuthLayout>{route.component}</NonAuthLayout>}
                  key={idx}
                  exact={true}
                />
              ))}

              {/* Protected Routes */}
              {authProtectedRoutes.map((route, idx) => (
                <Route
                  path={route.path}
                  element={
                    <Authmiddleware>
                      <div className="page-content">
                        {route.component}
                      </div>
                    </Authmiddleware>
                  }
                  key={idx}
                  exact={true}
                />
              ))}
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

              {/* Default redirect */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </React.Fragment>
      </Router>
    </AuthProvider>
  );
};

App.propTypes = {
  layout: PropTypes.any,
};

const mapStateToProps = (state) => {
  return {
    layout: state.Layout,
  };
};

export default connect(mapStateToProps, null)(App);
