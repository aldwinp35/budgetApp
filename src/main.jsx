/* eslint-disable comma-dangle */
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import App from './App';
import ErrorPage from './error-page';
import Income from './components/income/Income';
import Login from './components/auth/Login';
import Dashboard from './components/Dashboard';
import Budget from './components/budget/Budget';
import Expenses from './components/expenses/Expenses';
import Setting from './components/Setting';
import { AuthProvider } from './context/AuthContext';
import './assets/scss/styles.scss';
import './index.css';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'income',
        element: <Income />,
      },
      {
        path: '/budget',
        element: <Budget />,
      },
      {
        path: 'expenses',
        element: <Expenses />,
      },
      {
        path: 'setting',
        element: <Setting />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
