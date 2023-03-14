
import  {getUsers} from './api/api';
import './App.css';
import Map from './components/map/Map';
import { QueryClient,QueryClientProvider} from '@tanstack/react-query';
import { createBrowserRouter,Outlet,Navigate,RouterProvider } from 'react-router-dom';
import Navbar from './components/navbar/Navbar';
import { SessionProvider, useSession } from "@inrupt/solid-ui-react";
import { useState} from "react";


import Home from './pages/home/Home';
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import AddLandmark from './pages/addLandmark/AddLandmark';
import Profile from './pages/profile/Profile';
import Users from './pages/users/Users';
import { makeRequest } from './axios';

import LeftBar from './components/leftBar/LeftBar';
import Friends from './pages/friends/Friends';

function App(): JSX.Element {

  //With this we can control the login status for solid

  const queryClient =   new QueryClient();

  function Layout (): JSX.Element{
    return (
    <QueryClientProvider client={queryClient} >
      <div style = {{backgroundImage:'url(/brussels1.png)'}}>
      <div style={{backgroundColor:"rgba(71, 64, 64, 0.678)"}}>
      <Navbar />
      <div style={{ display: "flex" }}>
            <LeftBar />
            <div style={{ flex: 6}}>
              <Outlet />
            </div>

          </div>
        </div>
        </div>
    </QueryClientProvider>
  );
  };

  const getCookieValue = (name : String) => (
    document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || ''
  )

  const ProtectedRoute = ({children}:any) => {
    console.log(getCookieValue("session"))
    if (getCookieValue("session") === undefined) {
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
        {
          path: "/profile",
          element: <Profile />,
        },
        {
          path: "/profile",
          element: <Friends />,
        },
        {

          path: "/addLandmark",
          element: <AddLandmark />,
        },

          path: "/users/:text",
          element: <Users />,
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
      <SessionProvider sessionId="LoMap">
      <RouterProvider router={router} />
      </SessionProvider>
    </div>
  );

  };


export default App;
