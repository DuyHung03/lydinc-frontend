import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

interface ProtectedRouteProps {
    element: React.ReactElement;
    allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element, allowedRoles }) => {
    const { isAuthenticated, user } = useAuthStore();
    const location = useLocation();

    // useFetchResetPwUrl(); // This will automatically redirect if needed

    if (
        !isAuthenticated ||
        user?.roles.length === 0 ||
        !user?.roles.some((r) => allowedRoles.includes(r))
    ) {
        return <Navigate to='/not-allowed' replace state={{ prevUrl: location.pathname }} />;
    }

    return element;
};

export default ProtectedRoute;
