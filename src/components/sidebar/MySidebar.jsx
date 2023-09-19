import React from 'react';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { Link, useLocation } from 'react-router-dom';
import {
  // FaBars,
  FaChartPie,
  FaCoins,
  FaDollarSign,
  FaCog,
} from 'react-icons/fa';
import { IoWalletSharp, IoArrowForward, IoArrowBack } from 'react-icons/io5';
import PropTypes from 'prop-types';
import useWindowWidth from '../util/useWindowWidth';
import Tooltip from '../util/Tooltip';
import './MySidebar.css';

// Save and get collapse status from localStorage
const getLocalStorageCollapse = () =>
  JSON.parse(localStorage.getItem('collapsed'));
const setLocalStorageCollapse = (value) => {
  localStorage.setItem('collapsed', value);
};

function MySidebar({ toggled, setToggle }) {
  const collapseStatus = getLocalStorageCollapse();
  const [collapsed, setCollapse] = React.useState(collapseStatus || false);
  const [pathname, setPathname] = React.useState(false);

  const width = useWindowWidth();
  const location = useLocation();

  // Determine which MenuItem is active when pathname change
  React.useEffect(() => {
    setPathname(location.pathname);
  }, [location.pathname]);

  // Change collapse status
  const collapseSidebar = React.useCallback(() => {
    setCollapse(!collapsed);
    setLocalStorageCollapse(!collapsed);
  }, [collapsed]);

  const menuStyle = {
    button: ({ level, active }) => {
      // only apply styles on first level elements of the tree
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

  const desktopWidth = collapsed ? '85px' : '290px';
  const mobileWidth = 'fit-content';

  return (
    <div
      style={{
        width: width >= 576 ? desktopWidth : mobileWidth,
        transition: 'width,left,right,300ms',
      }}
    >
      <Sidebar
        id="sidebar"
        toggled={toggled}
        onBackdropClick={() => setToggle(false)}
        collapsed={collapsed}
        breakPoint="xl"
        backgroundColor="#272727"
        width={width >= 576 ? '250px' : '200px'}
      >
        {/* Logo */}
        <div
          id="logo"
          className="d-flex align-items-center justify-content-between"
        >
          {/* Logo text */}
          <div id="text-link">
            <Link to="/">{collapsed ? 'BA' : 'Budget App'}</Link>
          </div>

          {/* Menu button */}
          {/* {!collapsed && (
          <Tooltip text="Shrink menu" placement="right">
            <div
              onClick={collapseSidebar}
              className="d-none d-xl-block px-2 pb-1"
              role="button"
            >
              <FaBars />
            </div>
          </Tooltip>
        )} */}
        </div>

        <hr />

        {/* Menu */}
        <Menu menuItemStyles={menuStyle}>
          <Tooltip text={collapsed ? 'Budget' : ''}>
            <MenuItem
              icon={<FaCoins />}
              component={<Link to="/budget" />}
              active={pathname === '/budget'}
            >
              Budget
            </MenuItem>
          </Tooltip>
          <Tooltip text={collapsed ? 'Dashboard' : ''}>
            <MenuItem
              icon={<FaChartPie />}
              component={<Link to="/dashboard" />}
              active={pathname === '/dashboard'}
            >
              Dashboard
            </MenuItem>
          </Tooltip>
          <Tooltip text={collapsed ? 'Income' : ''}>
            <MenuItem
              icon={<FaDollarSign />}
              component={<Link to="/income" />}
              active={pathname === '/income'}
            >
              Income
            </MenuItem>
          </Tooltip>
          <Tooltip text={collapsed ? 'Expenses' : ''}>
            <MenuItem
              icon={<IoWalletSharp />}
              component={<Link to="/expenses" />}
              active={pathname === '/expenses'}
            >
              Expenses
            </MenuItem>
          </Tooltip>
          <Tooltip text={collapsed ? 'Setting' : ''}>
            <MenuItem
              icon={<FaCog />}
              component={<Link to="/setting" />}
              active={pathname === '/setting'}
            >
              Setting
            </MenuItem>
          </Tooltip>
        </Menu>

        <hr />

        {/* Expand button when sidebar is collapsed */}

        <Menu menuItemStyles={menuStyle}>
          {collapsed ? (
            <Tooltip text="Expand menu">
              <MenuItem className="text-center" onClick={collapseSidebar}>
                <IoArrowForward className="fs-5" />
              </MenuItem>
            </Tooltip>
          ) : (
            <Tooltip text="Shrink menu">
              <MenuItem className="text-center" onClick={collapseSidebar}>
                <IoArrowBack className="fs-5" />
              </MenuItem>
            </Tooltip>
          )}
        </Menu>
      </Sidebar>
    </div>
  );
}

MySidebar.propTypes = {
  toggled: PropTypes.bool.isRequired,
  setToggle: PropTypes.func.isRequired,
};

export default MySidebar;
