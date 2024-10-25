import './App.css'
import * as React from "react";
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import Root from "./routes/root";
import ErrorPage from './pages/error-page.tsx';
import Contact from './pages/contact.tsx';
import Login from './pages/login.tsx';

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "contacts/:contactId",
                element: <Contact />,
            },
        ],
    },
    {
        path: "/login",
        element: <Login />,

    },
]);

function App() {

  return (
    <>
        <RouterProvider router={router} />
    </>
  )
}

export default App
