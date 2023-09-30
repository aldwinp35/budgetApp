import React from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import { Sidebar as ProSidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { FaChartPie, FaCoins, FaDollarSign, FaCog } from 'react-icons/fa';
import { IoWalletSharp } from 'react-icons/io5';

import useWindowWidth from '../util/useWindowWidth';
import './style.css';

function Sidebar({ isToggled, toggle }) {
  const [pathname, setPathname] = React.useState('');
  const width = useWindowWidth();
  const location = useLocation();

  // Determine which MenuItem is active
  React.useEffect(() => {
    setPathname(location.pathname);
  }, [location.pathname]);

  const menuStyle = {
    button: ({ level, active }) => {
      if (level === 0)
        return {
          backgroundColor: active ? '#444' : undefined,
          color: active ? '#eee' : '#ccc',
          '&:hover': {
            backgroundColor: '#444',
            color: '#eee',
          },
        };
    },
  };

  return (
    <ProSidebar
      id="sidebar"
      toggled={isToggled}
      onBackdropClick={() => toggle()}
      breakPoint="all"
      backgroundColor="#272727"
      width={width >= 576 ? '250px' : '200px'}
    >
      <div id="logo">
        <div id="text-link">
          <Link to="/">Budget App</Link>
        </div>
      </div>

      <hr />

      <Menu menuItemStyles={menuStyle}>
        <MenuItem
          icon={<FaCoins />}
          component={<Link to="/budget" />}
          active={pathname === '/budget'}
        >
          Budget
        </MenuItem>

        <MenuItem
          icon={<FaChartPie />}
          component={<Link to="/dashboard" />}
          active={pathname === '/dashboard'}
        >
          Dashboard
        </MenuItem>

        <MenuItem
          icon={<FaDollarSign />}
          component={<Link to="/income" />}
          active={pathname === '/income'}
        >
          Income
        </MenuItem>

        <MenuItem
          icon={<IoWalletSharp />}
          component={<Link to="/expenses" />}
          active={pathname === '/expenses'}
        >
          Expenses
        </MenuItem>

        <MenuItem
          icon={<FaCog />}
          component={<Link to="/setting" />}
          active={pathname === '/setting'}
        >
          Setting
        </MenuItem>
      </Menu>
    </ProSidebar>
  );
}

Sidebar.propTypes = {
  isToggled: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
};

export default Sidebar;
