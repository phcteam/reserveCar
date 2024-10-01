import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "./Headers/Header";

function Layout({ children }) {
  const BaseUrl = import.meta.env.VITE_API_URL;

  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true); // สำหรับแสดงสถานะการโหลด
  const [isTokenValid, setIsTokenValid] = useState(false); // สถานะว่าถูกต้องหรือไม่

  const isAuthPage = ["/login", "/register"].includes(location.pathname); // ตรวจสอบว่ากำลังอยู่ที่หน้า login หรือ register หรือไม่

  useEffect(() => {
    const token = localStorage.getItem("token");

    // ถ้าไม่มี token และไม่ได้อยู่ที่หน้า login หรือ register ให้เปลี่ยนเส้นทางไปที่หน้า login
    if (!token && !isAuthPage) {
      navigate("/login", { replace: true });
      return;
    }

    // ตรวจสอบ token กับ Backend
    const verifyToken = async () => {
      try {
        const response = await fetch(`${BaseUrl}/verify-token`, {
          method: "GET", // เปลี่ยนเป็น GET
          headers: {
            Authorization: `Bearer ${token}`, // ส่ง token ไปตรวจสอบใน Authorization header
          },
        });

        if (response.ok) {
          setIsTokenValid(true); // ถ้า token ถูกต้อง
        } else {
          throw new Error("Token ไม่ถูกต้อง");
        }
      } catch (error) {
        console.error("Error verifying token:", error);
        localStorage.removeItem("token"); // ลบ token ออกเมื่อไม่ถูกต้อง
        navigate("/login", { replace: true }); // นำไปยังหน้า login
      } finally {
        setIsLoading(false); // โหลดข้อมูลเสร็จ
      }
    };

    if (token) {
      verifyToken(); // เรียกใช้ฟังก์ชันตรวจสอบ token
    } else {
      setIsLoading(false); // ถ้าไม่มี token ก็ไม่ต้องตรวจสอบ
    }
  }, [isAuthPage, navigate]);

  if (isLoading) {
    return <div>Loading...</div>; // แสดงหน้ากำลังโหลดระหว่างตรวจสอบ token
  }

  return (
    <>
      {!isAuthPage && isTokenValid && <Header />}{" "}
      {/* แสดง Header ถ้า token ถูกต้อง */}
      <main className="container mt-2">{children}</main>
    </>
  );
}

export default Layout;
