import { Outlet } from "react-router-dom";
import Navbar from "./navbar/navbar";

export default function Layout() {
  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <Navbar />

      <main
        style={{
          flex: 1,
          padding: "20px",
          overflowY: "auto",
          height: "100vh"
        }}
      >
        <Outlet />
      </main>
    </div>
  );
}