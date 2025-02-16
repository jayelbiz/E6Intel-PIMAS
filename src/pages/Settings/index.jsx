import React, { useState } from "react";
import { Card } from 'primereact/card';
import { TabView, TabPanel } from 'primereact/tabview';
import { InputSwitch } from 'primereact/inputswitch';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';

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

  const saveSettings = () => {
    // TODO: Implement settings save logic
    console.log('Saving settings:', settings);
  };

  return (
    <div className="p-4">
      <Card className="mb-4">
        <h2 className="text-xl font-bold mb-4">Settings</h2>
        <TabView>
          <TabPanel header="Notifications">
            <div className="p-fluid">
              <div className="flex align-items-center justify-content-between mb-4">
                <label htmlFor="email-notifications" className="font-medium">
                  Email Notifications
                </label>
                <InputSwitch
                  id="email-notifications"
                  checked={settings.notifications.email}
                  onChange={(e) => handleSettingChange('notifications', 'email', e.value)}
                />
              </div>
              <Divider />
              <div className="flex align-items-center justify-content-between mb-4">
                <label htmlFor="push-notifications" className="font-medium">
                  Push Notifications
                </label>
                <InputSwitch
                  id="push-notifications"
                  checked={settings.notifications.push}
                  onChange={(e) => handleSettingChange('notifications', 'push', e.value)}
                />
              </div>
              <Divider />
              <div className="flex align-items-center justify-content-between mb-4">
                <label htmlFor="alert-notifications" className="font-medium">
                  Alert Notifications
                </label>
                <InputSwitch
                  id="alert-notifications"
                  checked={settings.notifications.alerts}
                  onChange={(e) => handleSettingChange('notifications', 'alerts', e.value)}
                />
              </div>
            </div>
          </TabPanel>

          <TabPanel header="Display">
            <div className="p-fluid">
              <div className="flex align-items-center justify-content-between mb-4">
                <label htmlFor="theme" className="font-medium">Theme</label>
                <Dropdown
                  id="theme"
                  value={settings.display.theme}
                  options={themes}
                  onChange={(e) => handleSettingChange('display', 'theme', e.value)}
                  className="w-12rem"
                />
              </div>
              <Divider />
              <div className="flex align-items-center justify-content-between mb-4">
                <label htmlFor="map-style" className="font-medium">Map Style</label>
                <Dropdown
                  id="map-style"
                  value={settings.display.mapStyle}
                  options={mapStyles}
                  onChange={(e) => handleSettingChange('display', 'mapStyle', e.value)}
                  className="w-12rem"
                />
              </div>
              <Divider />
              <div className="flex align-items-center justify-content-between mb-4">
                <label htmlFor="refresh-interval" className="font-medium">
                  Refresh Interval (minutes)
                </label>
                <InputNumber
                  id="refresh-interval"
                  value={settings.display.refreshInterval}
                  onValueChange={(e) => handleSettingChange('display', 'refreshInterval', e.value)}
                  min={1}
                  max={60}
                  className="w-12rem"
                />
              </div>
            </div>
          </TabPanel>

          <TabPanel header="Filters">
            <div className="p-fluid">
              <div className="flex align-items-center justify-content-between mb-4">
                <label htmlFor="default-radius" className="font-medium">
                  Default Search Radius (miles)
                </label>
                <InputNumber
                  id="default-radius"
                  value={settings.filters.defaultRadius}
                  onValueChange={(e) => handleSettingChange('filters', 'defaultRadius', e.value)}
                  min={1}
                  max={500}
                  className="w-12rem"
                />
              </div>
            </div>
          </TabPanel>
        </TabView>

        <div className="flex justify-content-end mt-4">
          <Button
            label="Save Settings"
            icon="pi pi-save"
            onClick={saveSettings}
          />
        </div>
      </Card>
    </div>
  );
};

export default Settings;
