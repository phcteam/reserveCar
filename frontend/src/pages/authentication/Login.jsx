import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const BaseUrl = "http://localhost:3000/reserveCar/";
  const navigate = useNavigate();

  // ตรวจสอบ token เมื่อโหลดหน้า
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      window.location = "/";
    }
  }, [navigate]);

  // ฟังก์ชันจัดการการส่งฟอร์ม
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const jsonData = {
      username: data.get("username"),
      password: data.get("password"),
    };

    try {
      const response = await fetch(`${BaseUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jsonData),
      });

      const responseData = await response.json();

      if (responseData.status === "OK") {
        alert("เข้าสู่ระบบ สำเร็จ");
        localStorage.setItem("token", responseData.token);
        localStorage.setItem("id", responseData.id);
        localStorage.setItem("name", responseData.name);
        window.location = "/";
      } else {
        alert("Username หรือ Password ไม่ถูกต้อง");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("มีปัญหาในการเข้าสู่ระบบ กรุณาลองใหม่อีกครั้ง");
    }
  };

  return (
    <div className="m-5">
      <form onSubmit={handleSubmit} className="card-body">
        <h2>
          <strong>ลงชื่อเข้าใช้</strong>
        </h2>
        <div className="mb-3">
          <label>Username</label>
          <input
            type="text"
            className="form-control"
            name="username"
            required
          />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            name="password"
            required
          />
        </div>
        <div className="text-center">
          <button type="submit" className="btn btn-success w-100">
            Login
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
