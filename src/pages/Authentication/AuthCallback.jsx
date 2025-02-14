import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { ProgressSpinner } from 'primereact/progressspinner';

// Custom hooks
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../services/toast";

// Images
import logo from "../../assets/images/logo.svg";

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [error, setError] = useState(null);
  const { ToastComponent, showError } = useToast();

  const handleAuthError = useCallback((errorType, errorDesc) => {
    if (errorType) {
      const decodedError = decodeURIComponent(errorDesc || "");
      setError({
        type: errorType,
        description: decodedError
      });
      showError("Authentication Error", decodedError);
    } else if (user) {
      navigate("/dashboard");
    }
  }, [navigate, user, showError]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const errorType = params.get("error");
    const errorDesc = params.get("error_description");
    handleAuthError(errorType, errorDesc);
  }, [location, handleAuthError]);

  const handleRetry = () => {
    navigate("/login");
  };

  return (
    <div className="auth-page-wrapper min-h-screen flex align-items-center justify-content-center">
      <div className="auth-page-content w-full">
        <div className="container">
          <div className="flex justify-content-center">
            <div className="col-12 md:col-8 lg:col-6 xl:col-5">
              <Card className="shadow-4">
                <div className="text-center mb-5">
                  <div className="mb-4">
                    <img src={logo} alt="Logo" height={50} className="mx-auto" />
                  </div>
                  {error ? (
                    <>
                      <i className="pi pi-exclamation-circle text-6xl text-danger mb-4" />
                      <h5 className="text-primary text-2xl font-medium mb-2">Authentication Error</h5>
                      <Message 
                        severity="error" 
                        text={error.description || "An error occurred during authentication"}
                        className="w-full mb-4"
                      />
                      <Button
                        label="Return to Login"
                        icon="pi pi-arrow-left"
                        onClick={handleRetry}
                        className="p-button-primary"
                      />
                    </>
                  ) : (
                    <>
                      <ProgressSpinner 
                        style={{ width: '50px', height: '50px' }} 
                        strokeWidth="4"
                        fill="var(--surface-ground)"
                        animationDuration=".5s"
                      />
                      <h5 className="text-primary text-2xl font-medium mt-4 mb-2">Processing Authentication</h5>
                      <p className="text-600 mb-0">Please wait while we complete your sign-in.</p>
                    </>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <ToastComponent />
    </div>
  );
};

export default AuthCallback;
