import React from "react";
import { Navigate, Outlet } from "react-router-dom";

// Usage: <ProtectedRoute><YourComponent /></ProtectedRoute>
// Or with Outlet: <Route element={<ProtectedRoute />}>

export default function ProtectedRoute() {
  const isAuthenticated = !!sessionStorage.getItem("token");
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
