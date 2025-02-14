import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Message } from "primereact/message";

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [error, setError] = useState(null);

  useEffect(() => {
    // Parse error from URL parameters
    const params = new URLSearchParams(location.search);
    const errorType = params.get("error");
    const errorDesc = params.get("error_description");

    if (errorType) {
      setError({
        type: errorType,
        description: decodeURIComponent(errorDesc || "")
      });
    } else if (user) {
      // If no error and user is authenticated, redirect to dashboard
      navigate("/dashboard");
    }
  }, [user, navigate, location]);

  const handleRetry = () => {
    navigate("/login");
  };

  if (error) {
    return (
      <Card className="overflow-hidden">
        <div className="p-4 text-center">
          <i className="pi pi-exclamation-circle text-danger" style={{ fontSize: '3rem' }}></i>
          <h5 className="mt-4 mb-2">Authentication Error</h5>
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
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="p-4 text-center">
        <i className="pi pi-spin pi-spinner" style={{ fontSize: '3rem' }}></i>
        <h5 className="mt-4">Processing Authentication...</h5>
        <p className="text-muted">Please wait while we complete your sign-in.</p>
      </div>
    </Card>
  );
};

export default AuthCallback;
