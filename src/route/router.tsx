import { createBrowserRouter, RouteObject, RouterProvider } from 'react-router-dom';
import { publicRoutes } from './routes';

const routes: RouteObject[] = [...publicRoutes];

const router = createBrowserRouter(routes);

export default function Router() {
    return <RouterProvider router={router} />;
}
