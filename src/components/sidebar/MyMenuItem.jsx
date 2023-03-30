import { useState } from 'react';
import { MenuItem, useProSidebar } from 'react-pro-sidebar';
import { NavLink } from 'react-router-dom';
import Tooltip from '../Tooltip';

function MyMenuItem({ icon, text, to }) {
  const [active, setActive] = useState(false);
  const { toggleSidebar, collapsed } = useProSidebar();

  return (
    <Tooltip text={collapsed ? text : ''}>
      <MenuItem
        onClick={() => toggleSidebar(false)}
        active={active}
        icon={icon}
        routerLink={
          <NavLink
            to={to}
            className={({ isActive }) =>
              setTimeout(() => {
                setActive(isActive);
              }, 0)
            }
          />
        }
      >
        {text}
      </MenuItem>
    </Tooltip>
  );
}

export default MyMenuItem;
