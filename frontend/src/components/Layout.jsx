import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "./Headers/Header";

function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  const isLogIn = location.pathname === "/login";
  const isRegister = location.pathname === "/register"; // ตรวจสอบว่ากำลังอยู่ที่หน้า register หรือไม่

  useEffect(() => {
    const token = localStorage.getItem("token");

    // ถ้าไม่มี token และไม่ได้อยู่ที่หน้า login หรือ register ให้เปลี่ยนเส้นทางไปที่หน้า login
    if (!token && !isLogIn && !isRegister) {
      navigate("/login", { replace: true }); // ใช้ replace เพื่อป้องกันปัญหาการย้อนกลับ
    }
  }, [isLogIn, isRegister, navigate]);

  return (
    <>
      {!isLogIn && !isRegister && <Header />}{" "}
      {/* แสดง Header ถ้าไม่อยู่ที่หน้า login หรือ register */}
      <main className="container mt-2">{children}</main>
    </>
  );
}

export default Layout;
