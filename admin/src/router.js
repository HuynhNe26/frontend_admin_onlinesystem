import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Error404 from "./components/error_404/error_404";
import Layout from "./components/layout";
import Home from "./pages/home/home";
import Login from "./pages/login_admin/Login";
import ManageAdmin from "./pages/admin/manage_admin"
import CreateAdmin from "./pages/admin/create_admin"
import AdminDetail from "./pages/admin/admin_detail";
import AdminInfo from "./pages/admin/admin_info";
import ManageUsers from "./pages/users/manage_user";
import StatisticUser from "./pages/statistic/statistic_users";
import CreateExam from "./pages/exam/create_exam";
import ManageExams from "./pages/exam/manage_exam";
import ManageDepartment from "./pages/department/manage_department";
import CreateDepartment from "./pages/department/create_department";
import UpdateDepartment from "./pages/department/update_department";
import DeleteDepartment from "./pages/department/delete_department";
import { useAuth } from "./context/AuthContext";

export default function Router() {
  const { token, user } = useAuth();

  return (
    <Routes>
      {!token || !user ? (
        <>
          <Route path="/admin/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/admin/login" replace />} />
        </>
      ) : (
        <>
          <Route element={<Layout />}>
            <Route path="/" element={<Navigate to="/admin/home" replace />} />
            <Route path="/admin/home" element={<Home />} />
            <Route path="/admin/create_admin" element={<CreateAdmin />} />
            <Route path="/admin/manage_admin" element={<ManageAdmin />} />
            <Route path="/admin/manage_admin/:id" element={<AdminDetail />} />
            <Route path="/admin/:id" element={<AdminInfo />} />
            <Route path="/admin/manage_users" element={<ManageUsers />} />
            <Route path="/statistic/user" element={<StatisticUser />} />
            <Route path="/exams/creat" element={<CreateExam />} />
            <Route path="/exams/manage" element={<ManageExams />} />

            {/* Department CRUD routes */}
            <Route path="/departments/manage" element={<ManageDepartment />} />
            <Route path="/departments/create" element={<CreateDepartment />} />
            <Route path="/departments/update/:id" element={<UpdateDepartment />} />
            <Route path="/departments/delete/:id" element={<DeleteDepartment/>}/>
            <Route path="/admin/login" element={<Login />} />
            <Route path="*" element={<Error404 />} />
          </Route>
        </>
      )}
    </Routes>
  );
}
