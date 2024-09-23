import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";

import "./Login.css";

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
        localStorage.setItem("username", responseData.username);
        localStorage.setItem("role", responseData.role);

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
    // <div className="m-5">
    //   <div className="card">
    //     <form onSubmit={handleSubmit} className="card-body">
    //       <h2>
    //         <strong>ลงชื่อเข้าใช้</strong>
    //       </h2>
    //       <div className="mb-3">
    //         <label>Username</label>
    //         <input
    //           type="text"
    //           className="form-control"
    //           name="username"
    //           required
    //         />
    //       </div>
    //       <div className="mb-3">
    //         <label>Password</label>
    //         <input
    //           type="password"
    //           className="form-control"
    //           name="password"
    //           required
    //         />
    //       </div>
    //       <div className="text-center">
    //         <button type="submit" className="btn btn-success w-100">
    //           Login
    //         </button>
    //       </div>
    //     </form>
    //   </div>
    // </div>
    <>
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-xl-10">
            <div className="card rounded-3 text-black">
              <div className="row g-0">
                <div className="col-lg-6">
                  <div className="card-body p-md-5 mx-md-4">
                    <div className="text-center">
                      <img src={logo} style={{ width: "185px" }} alt="logo" />
                      <h4 className="mt-1 mb-5 pb-1">ระบบจองรถ AM</h4>
                    </div>

                    <form onSubmit={handleSubmit}>
                      <p>กรุณาเข้าสู่ระบบบัญชีของคุณ</p>

                      <div data-mdb-input-init className="form-outline mb-4">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Username"
                          name="username"
                        />
                        <label className="form-label">Username</label>
                      </div>

                      <div data-mdb-input-init className="form-outline mb-4">
                        <input
                          type="password"
                          className="form-control"
                          name="password"
                        />
                        <label className="form-label">Password</label>
                      </div>

                      <div className="text-center pt-1 mb-5 pb-1w ">
                        <button
                          data-mdb-button-init
                          data-mdb-ripple-init
                          className="btn gradient-custom-2 mb-3 w-75"
                          type="submit"
                          style={{ color: "#fff" }}
                        >
                          ลงชื่อเข้าใช้
                        </button>
                      </div>

                      {/* <div className="d-flex align-items-center justify-content-center pb-4">
                        <p className="mb-0 me-2">Do not have an account?</p>
                        <button
                          type="button"
                          data-mdb-button-init
                          data-mdb-ripple-init
                          className="btn btn-outline-danger"
                        >
                          Create new
                        </button>
                      </div> */}
                    </form>
                  </div>
                </div>
                <div className="col-lg-6 d-flex align-items-center gradient-custom-2">
                  <div className="text-white px-3 py-4 p-md-5 mx-md-4">
                    <h4 className="mb-4"> ระบบจองรถ (Reserve Car) AM</h4>
                    <p className="small mb-0">
                      ระบบจองรถ (Reserve Car)
                      คือเครื่องมือที่จะช่วยให้การจัดการคิวรถและพนักงานขับรถเป็นเรื่องง่ายดาย
                      ไม่ว่าจะเป็นการจองรถสำหรับธุรกิจ การเดินทางเพื่อการทำงาน
                      หรือการใช้งานในองค์กร
                      ระบบนี้ออกแบบมาเพื่อช่วยให้ทุกคนสามารถจองรถได้ง่ายๆ
                      ผ่านหน้าเว็บไซต์
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
