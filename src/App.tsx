import React, {useEffect} from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from './Landing'
import Gallery from './Gallery'
import {InitSessionTracking} from './utils/utils'



interface RouteConfig {
    path: string;
    element: React.ReactElement;
}

// route to Landing or Gallery
const routes: RouteConfig[] = [
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

export default function App(): React.ReactElement {

    useEffect(() => {
        return InitSessionTracking()
    }, [])

    return (
        <BrowserRouter>
        <Routes>
            {routes.map((route: RouteConfig) => (
            <Route key={route.path} path={route.path} element={route.element} />
            ))}
        </Routes>
        </BrowserRouter>
    );

}