import React from "react";
import { Container } from "reactstrap";
import { Card } from 'primereact/card';
import { Avatar } from 'primereact/avatar';
import { useAuth } from '../../contexts/AuthContext';

const Profile = () => {
  document.title = "Profile | E6Intel PIMAS";
  const { user } = useAuth();

  return (
    <div className="page-content">
      <Container fluid>
        {/* Page title */}
        <div className="page-title-box">
          <h4 className="mb-0">User Profile</h4>
        </div>

        {/* Content */}
        <div className="row">
          {/* Profile Info */}
          <div className="col-xl-4">
            <Card>
              <div className="text-center">
                <Avatar 
                  image={user?.avatar_url || "/avatar-placeholder.png"}
                  size="xlarge"
                  shape="circle"
                  className="mb-4"
                />
                <h5>{user?.name || 'User'}</h5>
                <p className="text-muted">{user?.email}</p>
              </div>
              <hr />
              <div className="mt-4">
                <h6 className="text-muted">Role</h6>
                <p>Intelligence Analyst</p>
                
                <h6 className="text-muted mt-4">Joined</h6>
                <p>{new Date(user?.created_at).toLocaleDateString()}</p>
                
                <h6 className="text-muted mt-4">Location</h6>
                <p>United States</p>
              </div>
            </Card>
          </div>

          {/* Activity */}
          <div className="col-xl-8">
            <Card title="Recent Activity">
              <div className="table-responsive">
                <table className="table table-centered table-nowrap mb-0">
                  <thead>
                    <tr>
                      <th scope="col">Date</th>
                      <th scope="col">Activity</th>
                      <th scope="col">Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>2025-02-16</td>
                      <td>Analyzed intelligence report</td>
                      <td><span className="badge bg-primary">Analysis</span></td>
                    </tr>
                    <tr>
                      <td>2025-02-15</td>
                      <td>Updated map markers</td>
                      <td><span className="badge bg-info">Map</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Profile;
