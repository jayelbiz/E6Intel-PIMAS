import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { Menu } from 'primereact/menu';
import { useTheme } from '../../contexts/ThemeContext';

const navItems = [
  { to: '/map', label: 'Map', icon: 'pi pi-map' },
  { to: '/news', label: 'News Analysis', icon: 'pi pi-file' },
  { to: '/alerts', label: 'Alerts', icon: 'pi pi-bell' },
  { to: '/settings', label: 'Settings', icon: 'pi pi-cog' }
];

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const menuRef = React.useRef<Menu>(null);
  const userMenuItems = [
    {
      label: 'Profile',
      icon: 'pi pi-user',
      command: () => {/* handle profile click */}
    },
    {
      label: theme === 'dark' ? 'Light Mode' : 'Dark Mode',
      icon: theme === 'dark' ? 'pi pi-sun' : 'pi pi-moon',
      command: toggleTheme
    },
    {
      separator: true
    },
    {
      label: 'Sign Out',
      icon: 'pi pi-sign-out',
      command: () => {/* handle sign out */}
    }
  ];

  return (
    <nav className="fixed top-0 w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 z-50">
      <div className="h-16 px-4 flex items-center justify-between">
        {/* Logo & Brand */}
        <div className="flex items-center gap-8">
          <NavLink to="/" className="flex items-center gap-2">
            <i className="pi pi-shield text-xl text-primary" />
            <span className="text-xl font-semibold text-gray-900 dark:text-white">ProphecyWatch</span>
          </NavLink>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `
                  px-3 py-2 rounded-md text-sm font-medium
                  ${isActive 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }
                `}
              >
                <i className={`${item.icon} mr-2`} />
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
        
        {/* User Section */}
        <div className="flex items-center gap-2">
          <Button
            type="button"
            icon="pi pi-search"
            rounded
            text
            severity="secondary"
            className="hidden md:inline-flex"
          />
          <Button
            type="button"
            icon={theme === 'dark' ? 'pi pi-sun' : 'pi pi-moon'}
            onClick={toggleTheme}
            rounded
            text
            severity="secondary"
            className="hidden md:inline-flex"
          />
          <Menu model={userMenuItems} popup ref={menuRef} />
          <Button
            type="button"
            severity="secondary"
            text
            onClick={(e) => menuRef.current?.toggle(e)}
            className="p-0"
          >
            <Avatar 
              image="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              shape="circle"
              size="normal"
            />
          </Button>
        </div>
      </div>
    </nav>
  );
}