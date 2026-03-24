import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AppContext } from "../App";

const ProtectedRoute = ({children, requiredRole = 'user'}) => {
    const { user } = useContext(AppContext);

    if (!user) {
        return <Navigate to='/login' replace />
    }

    if (requiredRole === 'admin' && !user.isAdmin) {
        return <Navigate to='/403' replace />
    }

    return children;
};

export default ProtectedRoute;