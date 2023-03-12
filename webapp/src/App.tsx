
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
import Profile from './pages/profile/Profile';
import { makeRequest } from './axios';


function App(): JSX.Element {

  //With this we can control the login status for solid
  const { session } = useSession();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const queryClient =   new QueryClient();

  function Layout (): JSX.Element{
    return (
    <QueryClientProvider client={queryClient} >
      <Navbar />
      <Outlet />
    </QueryClientProvider>
  );
  };

  const ProtectedRoute = ({children}:any) => {
    if (session.info.isLoggedIn) {
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
          path: "/profile/:id",
          element: <Profile />,
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
