import { Outlet, Navigate } from 'react-router-dom'
import { useAuthContext } from '../components/contextAPI/AuthContext';
export default function AuthenticatedRoutes(){
    const { logged } = useAuthContext(); 
    return (logged? <Outlet/> : <Navigate to="/login"/>)
}