import "./App.css";
import * as React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./routes/root";
import ErrorPage from "./pages/error-page.tsx";
import Login from "./pages/login.tsx";
import Users from "./pages/Users.tsx";
import CarList from "./pages/CarList.tsx";
import CarRent from "./pages/CarRent.tsx";

export const AuthContext = React.createContext(null);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "users",
        element: <Users />,
      },
      {
        path: "car-list",
        element: <CarList />,
      },
      {
        path: "car-rent",
        element: <CarRent />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

function App() {
  const [isLogged, setIsLogged] = React.useState(false);

  return (
    <AuthContext.Provider value={{ isLogged, setIsLogged }}>
      <RouterProvider router={router} />
    </AuthContext.Provider>
  );
}

export default App;
