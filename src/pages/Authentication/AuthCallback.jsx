import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Card, Row, Col, Container } from "reactstrap";
import { ProgressSpinner } from "primereact/progressspinner";

const AuthCallback = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // If user is authenticated, redirect to dashboard
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <React.Fragment>
      <div className="account-pages my-5 pt-sm-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card className="overflow-hidden">
                <div className="p-4 text-center">
                  <h5 className="mb-4">Processing Authentication...</h5>
                  <ProgressSpinner 
                    style={{ width: '50px', height: '50px' }} 
                    strokeWidth="4" 
                    fill="var(--surface-ground)" 
                    animationDuration=".5s" 
                  />
                </div>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default AuthCallback;
