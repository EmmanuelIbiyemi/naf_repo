import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";

const App = lazy(() => import("./App"));
const Login = lazy(() => import("./Pages/login/Login"));

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [],
  },
  {
    path: "/login",
    element: <Login />,
  },
]);
