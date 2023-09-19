/* eslint-disable no-console */
import React, { useState } from 'react';
// import { Util } from 'reactstrap';
import { Button } from 'reactstrap';
import { Outlet, useLocation } from 'react-router-dom';
import { IoMenu } from 'react-icons/io5';

import { useAuthContext } from './context/AuthContext';
import Login from './components/auth/Login';
import Sidebar from './components/sidebar/MySidebar';
import { Alert } from './components/util/Alert';
// import useWindowWidth from './components/util/useWindowWidth';
import './assets/lib/axios';
import './App.css';

function App() {
  // Get authentication token
  const token = useAuthContext();
  const { pathname } = useLocation();
  // const screenWidth = useWindowWidth();

  // Sidebar toggle status
  const [toggled, setToggle] = useState(false);
  const page =
    pathname.slice(1).charAt(0).toLocaleUpperCase() + pathname.slice(2);

  // Render small buttons and input on phone and tablets
  // React.useEffect(() => {
  //   Util.setGlobalCssModule({
  //     btn: screenWidth <= 768 ? 'btn btn-sm' : 'btn',
  //     'form-control':
  //       screenWidth <= 768 ? 'form-control form-control-sm' : 'form-control',
  //     'form-select':
  //       screenWidth <= 768 ? 'form-select form-select-sm' : 'form-select',
  //   });
  // }, [screenWidth]);

  if (!token.isValid) {
    // Redirect to login
    window.history.replaceState(null, '', '/login');
    return <Login />;
  }

  return (
    <div id="app">
      <Sidebar toggled={toggled} setToggle={setToggle} />

      <div className="d-flex flex-column w-100">
        <div className="container my-3">
          <div className="row">
            <div className="col-12">
              <div className="d-flex justify-content-between align-items-center">
                <h1 className="fs-5 fw-semibold">{page}</h1>
                <Button
                  outline
                  onClick={() => setToggle(!toggled)}
                  className="d-xl-none d-flex"
                >
                  <IoMenu className="fs-5" />
                </Button>
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
