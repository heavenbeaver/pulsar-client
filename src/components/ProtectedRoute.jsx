import { useContext } from "react";
import { Navigate } from "react-router-dom";
// import { AuthContext } from "../context/AuthProvider";
import { AppContext } from "../App";

const ProtectedRoute = ({ children, requiredRole = 'user' }) => {
    const { user, authLoading } = useContext(AppContext);

    if (!authLoading) {
        if (!user) {
            return <Navigate to='/login' replace />
        }

        if (requiredRole === 'admin' && !user?.isAdmin && authLoading) {
            return <Navigate to='/403' replace />
        }

        return children;
    }
};

export default ProtectedRoute;