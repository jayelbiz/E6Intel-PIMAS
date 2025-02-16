import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Badge } from "primereact/badge";
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";
import { Menu } from "primereact/menu";
import { useRef } from "react";
import logo from "../../assets/images/logo.svg";
import "./styles.scss";

const GlobalNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const { unreadAlerts = 0 } = useSelector((state) => state.alerts || {});

  const userMenuItems = [
    {
      label: "Profile",
      icon: "pi pi-user",
      command: () => {
        // Handle profile click
      }
    },
    {
      label: "Settings",
      icon: "pi pi-cog",
      command: () => {
        // Handle settings click
      }
    },
    { separator: true },
    {
      label: "Logout",
      icon: "pi pi-power-off",
      command: () => {
        // Handle logout
      }
    }
  ];

  const start = (
    <Link to="/" className="flex align-items-center no-underline">
      <img src={logo} alt="Logo" height="32" className="mr-2" />
      <span className="text-xl font-bold hidden md:inline text-900">E6Intel PIMAS</span>
    </Link>
  );

  const end = (
    <div className="flex align-items-center gap-3">
      <Link to="/alerts" className="p-link">
        <i className="pi pi-bell p-overlay-badge text-xl">
          {unreadAlerts > 0 && (
            <Badge value={unreadAlerts} severity="danger" />
          )}
        </i>
      </Link>
      <Link to="/news" className="px-3 nav-link">
        <i className="bx bx-news me-2"></i>
        <span>News</span>
      </Link>
      <Button
        icon="pi pi-user"
        rounded
        text
        severity="secondary"
        onClick={(e) => menuRef.current.toggle(e)}
        aria-controls="user-menu"
        aria-haspopup
      />
      <Menu
        model={userMenuItems}
        popup
        ref={menuRef}
        id="user-menu"
        className="w-15rem"
      />
    </div>
  );

  const items = [
    {
      label: "Home",
      icon: "pi pi-home",
      className: location.pathname === "/" ? "active" : "",
      command: () => {
        window.location.href = "/";
      }
    },
    {
      label: "Map",
      icon: "pi pi-map",
      className: location.pathname === "/map" ? "active" : "",
      command: () => {
        window.location.href = "/map";
      }
    }
  ];

  return (
    <div className="sticky top-0 z-5 shadow-2">
      <Menubar
        model={items}
        start={start}
        end={end}
        className="border-none surface-card"
        pt={{
          root: { className: 'p-3' },
          button: { className: 'p-2' },
          menu: { className: 'p-0' }
        }}
      />
    </div>
  );
};

export default GlobalNavbar;
