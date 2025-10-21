import { useEffect } from "react";
import Home from "./components/Home";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Signup from "./components/Signup";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { axiosInstance } from "./utils/axiosInstance";
import { API_PATHS } from "./utils/apiPaths";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser, setAuthUser } from "./redux/slices/authSlice";
import ProtectedRoute from "./components/ProtectedRoute";
import EditProfile from "./components/EditProfile";
import ChatPage from "./components/ChatPage";
import { SocketProvider } from "./socket";

function App() {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);

  const router = createBrowserRouter([
    {
      path: "/login",
      element: (
        <ProtectedRoute user={!user} redirect="/"> 
        {/* if user prop passed is true then show children , if not then redirect to specified url */}
          <Login />
        </ProtectedRoute>
      ),
    },
    {
      path: "/signup",
      element: (
        <ProtectedRoute user={!user} redirect="/">
          <Signup />
        </ProtectedRoute>
      ),
    },
    {
      path: "/",
      element: (
        <SocketProvider>
          <ProtectedRoute user={user}>
            <Outlet />
          </ProtectedRoute>
        </SocketProvider>
      ),
      children: [
        {
          index:true,
          element: <Home />,
        },
        {
          path: "/profile/:id",
          element: <Profile />,
        },
        {
          path: "/account/edit",
          element: <EditProfile />,
        },
        {
          path: "/chat",
          element: <ChatPage />,
        },
      ],
    },
  ]);
  useEffect(() => {
    async function getUser() {
      try {
        const { data } = await axiosInstance.get(API_PATHS.AUTH.PROFILE);

        dispatch(setAuthUser(data?.user));
      } catch (error) {
        dispatch(logoutUser());
        console.error(error);
      }
    }
    getUser();
  }, [dispatch]);
  if (loading) return <div>Loading...</div>;

  return <RouterProvider router={router} />;
}

export default App;
