import React from 'react';
import { useLocation } from 'react-router-dom';
import SideMenu from './SideMenu';
import '../style/layout.css';

const Layout = ({ children }) => {
  const location = useLocation();

  const hideSideMenu = location.pathname === '/' || location.pathname === '/register';

  return (
    <div className="layout">
      {!hideSideMenu && <SideMenu />}
      <div className={hideSideMenu ? 'full-content' : 'content'}>
        {children}
      </div>
    </div>
  );
};

export default Layout;
