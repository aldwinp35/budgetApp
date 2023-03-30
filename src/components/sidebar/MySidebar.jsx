import { Sidebar, Menu, useProSidebar, MenuItem as MenuItemPro } from "react-pro-sidebar";
import MenuItem from "./MyMenuItem";
import Tooltip from "../Tooltip";
import { Link } from "react-router-dom";
import { FaBars, FaChartPie, FaCoins, FaDollarSign, FaCog } from "react-icons/fa";
import { IoWalletSharp, IoArrowForward } from "react-icons/io5";
import "./MySidebar.css";

const MySidebar = () => {
  const { collapsed, collapseSidebar } = useProSidebar();

  const myMenuItemStyles = (active) => ({
    ".menu-anchor": {
      backgroundColor: active ? "#444" : "initial",
      color: active ? "#eee" : "#ccc",
      borderRadius: "5px",
      padding: "0 10px",
    },
    ".menu-anchor:hover": {
      backgroundColor: "#444",
      color: "#eee",
    },
  });

  const getSidebarCollapse = () => {
    return JSON.parse(localStorage.getItem("collapsed")) || collapsed;
  };

  const setSidebarCollapse = (value) => {
    collapseSidebar(value);
    localStorage.setItem("collapsed", value);
  };

  return (
    <Sidebar id="sidebar" breakPoint="xl" backgroundColor="#272727" defaultCollapsed={getSidebarCollapse()} width={window.innerWidth >= 576 ? "250px" : "200px"}>
      <div id="logo">
        <h4 className="mb-0">
          <Link to="/">{getSidebarCollapse() ? "BA" : "BudgetApp"}</Link>
        </h4>
        {!getSidebarCollapse() ? (
          <Tooltip text="Shrink menu" placement="bottom">
            <button onClick={() => setSidebarCollapse(true)} className="d-none d-xl-block btn btn-logo">
              <FaBars />
            </button>
          </Tooltip>
        ) : null}
      </div>
      <hr />
      <Menu renderMenuItemStyles={({ active }) => myMenuItemStyles(active)}>
        <MenuItem icon={<FaCoins />} text="Budget" to="/budget" />
        <MenuItem icon={<FaChartPie />} text="Dashboard" to="/dashboard" />
        <MenuItem icon={<FaDollarSign />} text="Income" to="/income" />
        <MenuItem icon={<IoWalletSharp />} text="Expenses" to="/expenses" />
        <MenuItem icon={<FaCog />} text="Setting" to="/setting" />

        <hr />

        {/* Desktop: expand menu when collapsed */}
        {getSidebarCollapse() ? (
          <Tooltip text="Expand menu">
            <MenuItemPro onClick={() => setSidebarCollapse(false)} icon={<IoArrowForward className="fs-5" />} className="d-none d-xl-block"></MenuItemPro>
          </Tooltip>
        ) : null}
      </Menu>
    </Sidebar>
  );
};

export default MySidebar;
