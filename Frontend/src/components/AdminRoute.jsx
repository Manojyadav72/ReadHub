import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

export default function AdminRoute({ children }) {
    const { authUser } = useAuth();

    if (!authUser) {
        return <Navigate to="/login" replace />;
    }

    if (authUser.user?.role !== "admin") {
        return <Navigate to="/" replace />;
    }

    return children;
}
