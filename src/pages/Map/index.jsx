import React from "react";
import { Container } from "reactstrap";

const Map = () => {
  document.title = "Map | E6Intel PIMAS";

  return (
    <div className="page-content">
      <Container fluid>
        {/* Page title */}
        <div className="page-title-box">
          <h4 className="mb-0">Interactive Map</h4>
        </div>

        {/* Content */}
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Global Intelligence Map</h4>
                <p className="card-text">
                  Interactive map displaying global intelligence data and events.
                </p>
                <div id="map-container" style={{ height: "600px", width: "100%" }}>
                  {/* Map will be initialized here */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Map;
