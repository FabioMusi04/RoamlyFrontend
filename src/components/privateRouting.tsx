import { Navigate } from 'react-router-dom';
import React, { ReactNode } from 'react';

import { IUser } from '../utils/interfaces.ts';
import { useAuth } from './authProvider.tsx';

interface PrivateRouteProps {
    roles?: string[];
    children: ReactNode;
}

const isAuthenticated = (user: IUser | null, token: string | null, roles?: string[]): boolean => {
    const tokenExists: boolean = token !== null;
    const userExists: boolean = user !== null;
    const roleIsValid: boolean = roles ? roles.includes(user?.role || '') : true;

    const isTokenExpired = token ? new Date(JSON.parse(atob(token.split('.')[1])).exp * 1000) < new Date() : true;

    return tokenExists && userExists && roleIsValid && !isTokenExpired;
};

const PrivateRoute: React.FC<PrivateRouteProps> = ({ roles, children }) => {
    const { user, token } = useAuth();

    return isAuthenticated(user, token, roles) ? children : <Navigate to="/login" />;
};

export default PrivateRoute;