
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from './Landing'
import Gallery from './Gallery'


// route to Landing or Gallery
const routes = [
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/gallery",
    element: <Gallery />,
  },
  {
    path: "*",
    element: <Navigate to="/"/>,
  },
]

export default function App() {

  return (
    <BrowserRouter>
      <Routes>
        {routes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Routes>
    </BrowserRouter>
  );

}
