
import  {getUsers} from './api/api';
import './App.css';
import Map from './components/map/Map';
import { QueryClient,QueryClientProvider} from '@tanstack/react-query';
import { createBrowserRouter,Outlet,Navigate,RouterProvider } from 'react-router-dom';
import Navbar from './components/navbar/Navbar';


import Home from './pages/home/Home';
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import Profile from './pages/profile/Profile';
import LeftBar from './components/leftBar/LeftBar';

function App(): JSX.Element {

  const  currentUser  = true;

  const queryClient =   new QueryClient();

  function Layout (): JSX.Element{
    return (
    <QueryClientProvider client={queryClient} >
      <div style = {{backgroundImage:'url(/brussels1.png)',backgroundColor: 'rgba(71, 64, 64, 0.678)'}}>
      <Navbar />
      <div style={{ display: "flex" }}>
            <LeftBar />
            <div style={{ flex: 6}}>
              <Outlet />
            </div>

          </div>
        </div>
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
      <RouterProvider router={router} />
    </div>
  );

  };


export default App;
