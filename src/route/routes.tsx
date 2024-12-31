import { RouteObject } from 'react-router-dom';
import Home from '../page/home/Home';
import Login from '../page/login/Login';

export const publicRoutes: RouteObject[] = [
    {
        path: '/',
        element: <Home />,
    },
    {
        path: 'login',
        element: <Login />,
    },
];
