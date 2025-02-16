import React, { useState } from "react";
import { Container } from "reactstrap";
import { Card } from 'primereact/card';
import { TabView, TabPanel } from 'primereact/tabview';
import { InputSwitch } from 'primereact/inputswitch';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';

const Settings = () => {
  document.title = "Settings | E6Intel PIMAS";

  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: false,
      alerts: true
    },
    display: {
      theme: 'light',
      mapStyle: 'satellite',
      refreshInterval: 5
    },
    filters: {
      defaultRadius: 50,
      categories: ['all']
    }
  });

  const themes = [
    { label: 'Light', value: 'light' },
    { label: 'Dark', value: 'dark' }
  ];

  const mapStyles = [
    { label: 'Satellite', value: 'satellite' },
    { label: 'Street', value: 'street' },
    { label: 'Terrain', value: 'terrain' }
  ];

  const handleSettingChange = (section, key, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  return (
    <div className="page-content">
      <Container fluid>
        {/* Page title */}
        <div className="page-title-box">
          <h4 className="mb-0">Settings</h4>
        </div>

        {/* Content */}
        <div className="row">
          <div className="col-12">
            <Card>
              <TabView>
                {/* Notifications */}
                <TabPanel header="Notifications">
                  <div className="p-3">
                    <h5 className="mb-4">Notification Settings</h5>
                    
                    <div className="mb-3 d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="mb-1">Email Notifications</h6>
                        <p className="text-muted mb-0">Receive updates via email</p>
                      </div>
                      <InputSwitch 
                        checked={settings.notifications.email}
                        onChange={(e) => handleSettingChange('notifications', 'email', e.value)}
                      />
                    </div>

                    <div className="mb-3 d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="mb-1">Push Notifications</h6>
                        <p className="text-muted mb-0">Browser push notifications</p>
                      </div>
                      <InputSwitch 
                        checked={settings.notifications.push}
                        onChange={(e) => handleSettingChange('notifications', 'push', e.value)}
                      />
                    </div>

                    <div className="mb-3 d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="mb-1">Real-time Alerts</h6>
                        <p className="text-muted mb-0">Instant alerts for critical events</p>
                      </div>
                      <InputSwitch 
                        checked={settings.notifications.alerts}
                        onChange={(e) => handleSettingChange('notifications', 'alerts', e.value)}
                      />
                    </div>
                  </div>
                </TabPanel>

                {/* Display */}
                <TabPanel header="Display">
                  <div className="p-3">
                    <h5 className="mb-4">Display Settings</h5>

                    <div className="mb-3">
                      <h6 className="mb-2">Theme</h6>
                      <Dropdown
                        value={settings.display.theme}
                        options={themes}
                        onChange={(e) => handleSettingChange('display', 'theme', e.value)}
                        className="w-100"
                      />
                    </div>

                    <div className="mb-3">
                      <h6 className="mb-2">Map Style</h6>
                      <Dropdown
                        value={settings.display.mapStyle}
                        options={mapStyles}
                        onChange={(e) => handleSettingChange('display', 'mapStyle', e.value)}
                        className="w-100"
                      />
                    </div>

                    <div className="mb-3">
                      <h6 className="mb-2">Auto-refresh Interval (minutes)</h6>
                      <InputNumber
                        value={settings.display.refreshInterval}
                        onValueChange={(e) => handleSettingChange('display', 'refreshInterval', e.value)}
                        min={1}
                        max={60}
                      />
                    </div>
                  </div>
                </TabPanel>

                {/* Filters */}
                <TabPanel header="Filters">
                  <div className="p-3">
                    <h5 className="mb-4">Filter Settings</h5>

                    <div className="mb-3">
                      <h6 className="mb-2">Default Search Radius (miles)</h6>
                      <InputNumber
                        value={settings.filters.defaultRadius}
                        onValueChange={(e) => handleSettingChange('filters', 'defaultRadius', e.value)}
                        min={1}
                        max={1000}
                      />
                    </div>

                    <div className="mb-3">
                      <h6 className="mb-2">Default Categories</h6>
                      <ul className="list-group">
                        <li className="list-group-item">
                          <InputSwitch checked={true} disabled />
                          <span className="ms-2">Geopolitical</span>
                        </li>
                        <li className="list-group-item">
                          <InputSwitch checked={true} disabled />
                          <span className="ms-2">Security Alerts</span>
                        </li>
                        <li className="list-group-item">
                          <InputSwitch checked={true} disabled />
                          <span className="ms-2">Natural Disasters</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </TabPanel>
              </TabView>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Settings;
