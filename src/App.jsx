/* eslint-disable no-console */
import React, { useState } from 'react';
import { Button } from 'reactstrap';
import { Outlet, useLocation } from 'react-router-dom';
import { IoMenu } from 'react-icons/io5';

import { useAuthContext } from './context/AuthContext';
import Login from './components/auth/Login';
import Sidebar from './components/sidebar/Sidebar';
import { Alert } from './components/util/Alert';
import Tooltip from './components/util/Tooltip';
import './assets/lib/axios';

function App() {
  // Get authentication token
  const token = useAuthContext();
  const { pathname } = useLocation();

  // Sidebar toggle status
  const [isToggled, setIsToggled] = useState(false);
  const toggleSidebar = () => setIsToggled(!isToggled);
  const page =
    pathname.slice(1).charAt(0).toLocaleUpperCase() + pathname.slice(2);

  // Show login page
  if (!token.isValid) {
    window.history.replaceState(null, '', '/login');
    return <Login />;
  }

  return (
    <div id="app">
      <Sidebar isToggled={isToggled} toggle={toggleSidebar} />
      <div className="d-flex flex-column w-100">
        <div className="container my-3">
          <div className="row">
            <div className="col-12">
              <div className="d-flex align-items-center">
                <Tooltip text="Toggle menu" placement="bottom">
                  <Button
                    color="light"
                    size="sm"
                    onClick={toggleSidebar}
                    className="d-flex me-2"
                  >
                    <IoMenu className="fs-5" />
                  </Button>
                </Tooltip>
                <h1 className="fs-5 fw-semibold">{page}</h1>
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          <Alert />
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default App;
