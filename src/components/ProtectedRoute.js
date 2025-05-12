import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children }) {
    const { username } = useAuth();
    const location = useLocation(); // Get the current location

    if (!username) {
        // If not logged in, redirect to login page
        return <Navigate to="/login" replace state={{ from: location.pathname }} />;
    }

    return children; // If logged in, render the children components
}

export default ProtectedRoute;