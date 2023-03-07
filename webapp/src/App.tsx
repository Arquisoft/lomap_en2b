import React, { useState, useEffect, Props } from 'react';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Container from '@mui/material/Container';
import EmailForm from './components/EmailForm';
import Welcome from './components/Welcome';
import UserList from './components/UserList';
import  {getUsers} from './api/api';
import {User} from './shared/shareddtypes';
import './App.css';
import Map from './components/map/Map';
import { QueryClient,QueryClientProvider} from '@tanstack/react-query';
import { createBrowserRouter,Outlet,Navigate,RouterProvider } from 'react-router-dom';
import Navbar from './components/navbar/Navbar';

import { useContext } from 'react';
import Home from './pages/home/Home';
import Login from './pages/login/Login';
import Register from './pages/register/Register';

function App(): JSX.Element {

  const  currentUser  = true;

  const queryClient = new QueryClient();

  function Layout (): JSX.Element{
    return (
    <QueryClientProvider client={queryClient}>
      <Navbar />
      <Outlet/>
    </QueryClientProvider>
  );
    };

  const ProtectedRoute = ({children}:any) => {
    if (!currentUser) {
      return <Navigate to="/login" />;
    }

    return children;
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: "/",
          element: <Home />,
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
  ]);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );

  };


export default App;
