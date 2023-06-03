/* eslint-disable no-console */
import React from 'react';
import { Outlet } from 'react-router-dom';
import { IoMenu } from 'react-icons/io5';
import { useProSidebar } from 'react-pro-sidebar';
import { useAuthContext } from './context/AuthContext';
import Login from './components/auth/Login';
import Sidebar from './components/sidebar/MySidebar';
import './assets/lib/axios';
import './App.css';

function App() {
  const { toggleSidebar } = useProSidebar();
  const token = useAuthContext();

  if (!token.isValid) {
    window.history.replaceState(null, '', '/login');
    return <Login />;
  }

  return (
    <div id="app">
      <Sidebar />
      <div className="container">
        <div id="header" className="row my-3">
          <div className="col-12">
            <div className="d-flex align-items-center justify-content-end">
              {/* Toogle menu on mobile */}
              <button
                type="button"
                onClick={() => toggleSidebar()}
                className="btn btn-primary d-xl-none d-flex"
              >
                <IoMenu className="fs-5" />
              </button>
            </div>
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  );
}

export default App;
