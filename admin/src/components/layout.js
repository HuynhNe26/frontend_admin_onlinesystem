import { Outlet } from "react-router-dom";
import Navbar from "./navbar/navbar"

export default function Layout() {
  return (
    <div style={{display:'flex'}}>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
