import { createBrowserRouter, RouteObject, RouterProvider } from 'react-router-dom';
import { adminRoutes, lecturerRoutes, publicRoutes, studentRoutes } from './routes';

const routes: RouteObject[] = [
    ...publicRoutes,
    ...lecturerRoutes,
    ...studentRoutes,
    ...adminRoutes,
];

const router = createBrowserRouter(routes);

export default function Router() {
    return <RouterProvider router={router} />;
}
