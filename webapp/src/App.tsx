
import './App.css';

import { QueryClient,QueryClientProvider} from '@tanstack/react-query';
import { createBrowserRouter,Outlet,Navigate,RouterProvider } from 'react-router-dom';
import Navbar from './components/navbar/Navbar';
import { SessionProvider, useSession} from "@inrupt/solid-ui-react";



import Home from './pages/home/Home';
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import AddLandmark from './pages/addLandmark/AddLandmark';
import Profile from './pages/profile/Profile';
import Users from './pages/users/Users';


import LeftBar from './components/leftBar/LeftBar';
import Friends from './pages/friends/Friends';

function App(): JSX.Element {

  //With this we can control the login status for solid

  const queryClient = new QueryClient();
  const session = useSession();

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


  const ProtectedRoute = ({children}:any) => {
    // Descomentar cuando funcione el inicio de sesión
    //if (!session.session.info.isLoggedIn) {
    //  return <Navigate to="/login" />;
    //}
    console.log(session.session); // Mostrar la sesión para debuggear
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
          path: "/friends",
          element: <Friends />,
        },
        {

          path: "/addLandmark",
          element: <AddLandmark />,
        },
        {
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
      <RouterProvider router={router} />
    </div>
  );

  };


export default App;
