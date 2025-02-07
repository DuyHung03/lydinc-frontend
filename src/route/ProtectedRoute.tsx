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

    // if (isAuthenticated && user?.isAccountGranted == 1 && user.isPasswordFirstChanged == 0) {
    //     return <Navigate to='/change-password' replace state={{ prevUrl: location.pathname }} />;
    // }

    /**
     * If user is not authenticated or has no roles in the allowed roles array,
     * redirect to the login page with the previous URL stored in the state.
     * Otherwise, render the given element.
     */
    if (user?.isAccountGranted == 1 && user.isPasswordFirstChanged == 0) {
        return <Navigate to='/change-password' replace state={{ prevUrl: location.pathname }} />;
    }

    if (
        !isAuthenticated ||
        user?.roles.length === 0 ||
        !user?.roles.some((r) => allowedRoles.includes(r))
    ) {
        //return 403 page
        return <Navigate to='/not-allowed' replace state={{ prevUrl: location.pathname }} />;
    }

    return element;
};

export default ProtectedRoute;
