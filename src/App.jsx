import React, { Suspense } from 'react';
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NewsProvider } from './contexts/NewsContext';

// Import routes
import { publicRoutes, protectedRoutes } from '@/routes/route.jsx';

// Import layouts
import NonAuthLayout from '@components/NonAuthLayout';
import VerticalLayout from '@layouts/VerticalLayout';

// Import PrimeReact styles
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

// Import Skote styles
import './assets/scss/theme.scss';
import './layouts/styles.scss';

const LoadingSpinner = () => (
    <div className="auth-page-wrapper pt-5">
        <div className="auth-page-content">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-8 col-lg-6 col-xl-5">
                        <div className="text-center">
                            <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem' }}></i>
                            <h4 className="mt-4">Loading...</h4>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const App = () => {
    return (
        <Router>
            <AuthProvider>
                <NewsProvider>
                    <Suspense fallback={<LoadingSpinner />}>
                        <Routes>
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
                            {protectedRoutes.map((route, idx) => (
                                <Route
                                    key={idx}
                                    path={route.path}
                                    element={
                                        <VerticalLayout>
                                            {route.element}
                                        </VerticalLayout>
                                    }
                                />
                            ))}
                        </Routes>
                    </Suspense>
                </NewsProvider>
            </AuthProvider>
        </Router>
    );
};

export default App;
