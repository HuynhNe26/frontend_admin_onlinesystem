import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Error404 from "./components/error_404/error_404";
import Layout from "./components/layout";

import Logout from "./pages/logout_admin/Logout";
import Home from "./pages/home/home";
import Login from "./pages/login_admin/Login";

import ManageAdmin from "./pages/CRUD_admin/manage_admin";
import CreateAdmin from "./pages/CRUD_admin/create_admin";
import ManageUser from "./pages/manage_user/manage_user";

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

        <Route path="/admin/manage-admin" element={<ManageAdmin />} />
        <Route path="/admin/create-admin" element={<CreateAdmin />} />
        <Route path="/admin/manage-users" element={<ManageUser />} />
      </Route>

      <Route path="*" element={<Error404 />} />
    </Routes>
  );
}
