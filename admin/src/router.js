import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Error404 from "./components/error_404/error_404";
import Layout from "./components/layout";
import Home from "./pages/home/home";
import Login from "./pages/login_admin/Login";
import ManageAdmin from "./pages/admin/manage_admin"
import CreateAdmin from "./pages/admin/create_admin"

import { useAuth } from "./context/AuthContext";

export default function Router() {
  const { token, user } = useAuth();

  if (!token || !user) {
    return (
      <Routes>
        <Route path="/admin/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/admin/login" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/admin/home" replace />} />
        <Route path="/admin/home" element={<Home />} />
        <Route path="/admin/create_admin" element={<CreateAdmin />}/>
        <Route path="/admin/manage_admin" element={<ManageAdmin />}/>
      </Route>

      <Route path="/admin/login" element={<Navigate to="/admin/home" replace />} />

      <Route path="*" element={<Error404 />} />
    </Routes>
  );
}