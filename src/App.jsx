import PropTypes from "prop-types";
import React from "react";
import { Routes, Route } from "react-router-dom";
import { connect } from "react-redux";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";

// Import Routes
import { authProtectedRoutes, publicRoutes } from "./routes/index";
import Authmiddleware from "./routes/route";

// Components
import GlobalNavbar from "./components/GlobalNavbar";
import NonAuthLayout from "./components/NonAuthLayout";

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
    <React.Fragment>
      {isAuthenticated && <GlobalNavbar />}
      <div className="pt-0">
        <Routes>
          {publicRoutes.map((route, idx) => (
            <Route
              path={route.path}
              element={<NonAuthLayout>{route.component}</NonAuthLayout>}
              key={idx}
              exact={true}
            />
          ))}

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
        </Routes>
      </div>
    </React.Fragment>
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
