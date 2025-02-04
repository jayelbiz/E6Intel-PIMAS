import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Checkbox } from 'primereact/checkbox';

interface NavItem {
  icon: string;
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { icon: 'pi pi-map', label: 'Map', href: '/map' },
  { icon: 'pi pi-file', label: 'News Analysis', href: '/news' },
  { icon: 'pi pi-bell', label: 'Alerts', href: '/alerts' },
  { icon: 'pi pi-cog', label: 'Settings', href: '/settings' },
];

const timeRanges = [
  { label: 'Last 24 Hours', value: '24h' },
  { label: 'Last 7 Days', value: '7d' },
  { label: 'Last 30 Days', value: '30d' },
  { label: 'Custom Range', value: 'custom' }
];

export function Sidebar() {
  const [selectedTimeRange, setSelectedTimeRange] = React.useState('24h');
  const [filters, setFilters] = React.useState({
    prophecy: true,
    disaster: true,
    miracle: true,
    endTimes: true
  });

  return (
    <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 p-4">
      <div className="flex flex-col h-full">
        {/* Filters Section */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3 flex items-center">
            <i className="pi pi-filter mr-2" />
            Filters
          </h3>
          <div className="space-y-2">
            {Object.entries(filters).map(([key, value]) => (
              <div key={key} className="flex items-center">
                <Checkbox
                  inputId={key}
                  checked={value}
                  onChange={e => setFilters(prev => ({ ...prev, [key]: e.checked }))}
                />
                <label htmlFor={key} className="ml-2 text-sm">
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Time Range Section */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3 flex items-center">
            <i className="pi pi-calendar mr-2" />
            Time Range
          </h3>
          <Dropdown
            value={selectedTimeRange}
            onChange={e => setSelectedTimeRange(e.value)}
            options={timeRanges}
            className="w-full"
          />
        </div>

        {/* Navigation */}
        <div className="flex-1">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) => `
                flex items-center px-3 py-2 rounded-md text-sm font-medium mb-1
                ${isActive 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                }
              `}
            >
              <i className={`${item.icon} mr-3`} />
              {item.label}
            </NavLink>
          ))}
        </div>

        {/* User Section */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
          <Button
            label="Sign Out"
            icon="pi pi-sign-out"
            text
            severity="danger"
            className="w-full justify-start"
          />
        </div>
      </div>
    </div>
  );
}