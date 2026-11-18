import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute({ requiredRole }) {
    const storedUser = localStorage.getItem("currentUser");

    if (!storedUser) {
        return <Navigate to="/login" replace />;
    }

    const currentUser = JSON.parse(storedUser);

    if (requiredRole && currentUser.role !== requiredRole) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
}

export default ProtectedRoute;