import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";

import "./Login.css";

function Register() {
  const BaseUrl = import.meta.env.VITE_API_URL;

  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      window.location = "/";
    }
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== rePassword) {
      setPasswordError("รหัสผ่านไม่ตรงกัน");
      return;
    }

    const jsonData = {
      username: username,
      password: password,
      name: name,
      phone: phone,
      email: email,
      status: "Active",
      role: "user",
    };

    try {
      const response = await fetch(`${BaseUrl}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jsonData),
      });

      const responseData = await response.json();

      if (responseData.status === "User registered successfully") {
        alert("ลงทะเบียนสำเร็จ");
        window.location = "/login"; // เปลี่ยนไปหน้าเข้าสู่ระบบ
      } else {
        alert("เกิดข้อผิดพลาด: " + responseData.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("มีปัญหาในการลงทะเบียน กรุณาลองใหม่อีกครั้ง");
    }
  };

  return (
    <>
      <div className="container py-5 h-100">
        <form onSubmit={handleSubmit}>
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-xl-10">
              <div className="card rounded-3 text-black">
                <div className="row g-0">
                  <div className="col-lg-6">
                    <div className="card-body p-md-5 mx-md-4">
                      <div className="text-center">
                        <img src={logo} style={{ width: "180px" }} alt="logo" />
                        <h4 className="mb-5 pb-1">ระบบจองรถ AM</h4>
                      </div>

                      <h5 className="pb-1">สร้างบัญชีใหม่</h5>

                      <div data-mdb-input-init className="form-outline mb-4">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Username"
                          name="username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          required
                        />
                        <label className="form-label">Username</label>
                      </div>

                      <div data-mdb-input-init className="form-outline mb-4">
                        <input
                          type="password"
                          className="form-control"
                          name="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                        <label className="form-label">Password</label>
                      </div>

                      <div data-mdb-input-init className="form-outline mb-4">
                        <input
                          type="password"
                          className="form-control"
                          name="rePassword"
                          value={rePassword}
                          onChange={(e) => setRePassword(e.target.value)}
                          required
                        />
                        <label className="form-label">Re-Password</label>
                      </div>
                      {passwordError && (
                        <div className="text-danger mb-4">{passwordError}</div>
                      )}
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="card-body p-md-5 mx-md-4 mt-4">
                      <div className="text-center">
                        <h4 className="mt-1 mb-5 pb-1">ข้อมูลส่วนตัว</h4>
                      </div>

                      <div data-mdb-input-init className="form-outline mb-4">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="ชื่อ - นามสกุล"
                          name="fullName"
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                        <label className="form-label">ชื่อ - นามสกุล</label>
                      </div>

                      <div data-mdb-input-init className="form-outline mb-4">
                        <input
                          type="email"
                          className="form-control"
                          placeholder="E-mail"
                          name="email"
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                        <label className="form-label">E-mail</label>
                      </div>
                      <div data-mdb-input-init className="form-outline mb-4">
                        <input
                          type="tel"
                          className="form-control"
                          placeholder="ใส่เบอร์มือถือ"
                          name="phone"
                          pattern="0[0-9]{9}"
                          onChange={(e) => setPhone(e.target.value)}
                          required
                        />

                        <label className="form-label">เบอร์โทรศัพท์</label>
                      </div>

                      <hr />

                      <div className="text-center pt-1 mb-5 pb-1">
                        <button
                          data-mdb-button-init
                          data-mdb-ripple-init
                          className="btn gradient-custom-2 mb-3 w-75"
                          type="submit"
                          style={{ color: "#fff" }}
                        >
                          ลงทะเบียน
                        </button>
                      </div>

                      <div className="d-flex align-items-center justify-content-center pb-4">
                        <p className="mb-0 me-2">กรณีมีบัญชีแล้ว</p>
                        <a
                          href="/login"
                          type="button"
                          data-mdb-button-init
                          data-mdb-ripple-init
                          className="btn btn-outline-danger"
                        >
                          เข้าสู่ระบบ
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default Register;
