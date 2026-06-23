import React, {useEffect} from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from './Landing'
import Gallery from './Gallery'
import Gallery7LettersContent from './Gallery7LettersContent'
import MetricsTracker from "./MetricsTracker"



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
        path: "/7letters",
        element: <Gallery7LettersContent />,
    },
    {
        path: "*",
        element: <Navigate to="/"/>,
    },
]

export default function App(): React.ReactElement {
    return (
        <BrowserRouter>
        <Routes>
            {routes.map((route: RouteConfig) => (
            <Route key={route.path} path={route.path} element={route.element} />
            ))}
        </Routes>
        <MetricsTracker/>
        </BrowserRouter>
    );
}
