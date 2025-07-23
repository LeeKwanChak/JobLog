import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getToken } from '../utils/auth';

const ProtectedRoute: React.FC = () =>{
    const isAuthenticated = !!getToken();
    if(!isAuthenticated){
        return <Navigate to= "/auth" replace />
    }
    return <Outlet/>
};

export default ProtectedRoute;