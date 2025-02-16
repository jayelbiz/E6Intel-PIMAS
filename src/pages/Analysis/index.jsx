import React from "react";
import { Container } from "reactstrap";
import { Card } from 'primereact/card';
import { TabView, TabPanel } from 'primereact/tabview';

const Analysis = () => {
  document.title = "Analysis | E6Intel PIMAS";

  return (
    <div className="page-content">
      <Container fluid>
        {/* Page title */}
        <div className="page-title-box">
          <h4 className="mb-0">Intelligence Analysis</h4>
        </div>

        {/* Content */}
        <div className="row">
          <div className="col-12">
            <Card>
              <TabView>
                <TabPanel header="Legal & Constitutional">
                  <div className="p-3">
                    <h5>Legal & Constitutional Analysis</h5>
                    <p>Analysis of events from a legal and constitutional perspective.</p>
                  </div>
                </TabPanel>
                <TabPanel header="Spiritual Warfare">
                  <div className="p-3">
                    <h5>Spiritual Warfare Analysis</h5>
                    <p>Analysis of events through a spiritual warfare lens.</p>
                  </div>
                </TabPanel>
                <TabPanel header="Financial Networks">
                  <div className="p-3">
                    <h5>Financial Networks Analysis</h5>
                    <p>Analysis of financial connections and networks.</p>
                  </div>
                </TabPanel>
              </TabView>
            </Card>
          </div>
        </div>

        {/* Recent Analysis */}
        <div className="row mt-4">
          <div className="col-12">
            <Card title="Recent Analysis">
              <div className="table-responsive">
                <table className="table table-centered table-nowrap mb-0">
                  <thead>
                    <tr>
                      <th scope="col">Date</th>
                      <th scope="col">Title</th>
                      <th scope="col">Category</th>
                      <th scope="col">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>2025-02-16</td>
                      <td>Global Financial Patterns Analysis</td>
                      <td>Financial Networks</td>
                      <td><span className="badge bg-success">Complete</span></td>
                    </tr>
                    <tr>
                      <td>2025-02-15</td>
                      <td>Constitutional Implications Review</td>
                      <td>Legal & Constitutional</td>
                      <td><span className="badge bg-warning">In Progress</span></td>
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

export default Analysis;
