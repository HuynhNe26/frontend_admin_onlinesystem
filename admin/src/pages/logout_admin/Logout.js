import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminAPI from "../../API/AdminAPI";

export default function Logout() {
  const nav = useNavigate();

  useEffect(() => {
  AdminAPI.logout().finally(() => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    nav("/admin/login");
  });
}, []);


  return null;
}
