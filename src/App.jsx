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
  console.log('app');
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
            <div className="border rounded bg-light p-2 d-flex align-items-center justify-content-between">
              <h5 className="mb-1">Header</h5>
              {/* Toogle menu on mobile */}
              <button
                type="button"
                onClick={() => toggleSidebar()}
                className="btn btn-primary d-xl-none"
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
