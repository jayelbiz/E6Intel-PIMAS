import React from "react";
import { Container } from "reactstrap";

const Dashboard = () => {
  document.title = "Dashboard | E6Intel PIMAS";

  return (
    <div className="page-content">
      <Container fluid>
        {/* Page title */}
        <div className="page-title-box">
          <h4 className="mb-0">Dashboard</h4>
        </div>

        {/* Content */}
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Welcome to E6Intel PIMAS</h4>
                <p className="card-text">
                  Your intelligence analysis platform is ready. Navigate using the menu on the left.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Dashboard;
