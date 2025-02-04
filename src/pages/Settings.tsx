import React from 'react';
import { User, Mail, Lock, Bell, MapPin, Shield, Moon, Sun, LogOut } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export function SettingsPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Manage your account preferences and settings
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <User className="h-5 w-5 mr-2" />
            Profile Information
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <input
                type="text"
                defaultValue="John Doe"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                defaultValue="john@example.com"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Time Zone</label>
              <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900">
                <option>UTC-05:00 Eastern Time</option>
                <option>UTC+00:00 GMT</option>
                <option>UTC+02:00 Israel Time</option>
              </select>
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Security
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Current Password</label>
              <input
                type="password"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">New Password</label>
              <input
                type="password"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Confirm New Password</label>
              <input
                type="password"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900"
              />
            </div>
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
              Update Password
            </button>
          </div>
        </div>

        {/* Preferences Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-6">Preferences</h2>
          <div className="space-y-6">
            {/* Theme Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {theme === 'dark' ? (
                  <Moon className="h-5 w-5 text-gray-500" />
                ) : (
                  <Sun className="h-5 w-5 text-gray-500" />
                )}
                <span>Theme</span>
              </div>
              <button
                onClick={toggleTheme}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </button>
            </div>

            {/* Email Preferences */}
            <div>
              <h3 className="text-lg font-medium mb-4">Email Notifications</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="emailAlerts"
                    defaultChecked
                    className="rounded border-gray-300 dark:border-gray-700 text-primary focus:ring-primary"
                  />
                  <label htmlFor="emailAlerts" className="ml-2">
                    Critical Event Alerts
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="emailDigest"
                    defaultChecked
                    className="rounded border-gray-300 dark:border-gray-700 text-primary focus:ring-primary"
                  />
                  <label htmlFor="emailDigest" className="ml-2">
                    Daily Event Digest
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="emailNews"
                    defaultChecked
                    className="rounded border-gray-300 dark:border-gray-700 text-primary focus:ring-primary"
                  />
                  <label htmlFor="emailNews" className="ml-2">
                    News Analysis Updates
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border-l-4 border-red-500">
          <h2 className="text-xl font-semibold mb-4 text-red-600">Danger Zone</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
            Delete Account
          </button>
        </div>

        {/* Save Changes */}
        <div className="flex justify-end space-x-4">
          <button className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
            Cancel
          </button>
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}