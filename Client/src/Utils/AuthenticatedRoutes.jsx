import { Outlet, Navigate } from 'react-router-dom';
import { useAuthContext } from '../components/contextAPI/AuthContext';

export default function AuthenticatedRoutes() {
    const { logged, profileCompleted } = useAuthContext();
    return logged ? (
        profileCompleted ? (
            <Outlet />
        ) : (
            <Navigate to="/ProfileComplete" />
        )
    ) : (
        <Navigate to="/login" />
    );
}
