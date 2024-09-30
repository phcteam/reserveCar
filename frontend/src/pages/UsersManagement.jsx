// import { useEffect, useState } from "react";

// function UsersManagement() {
//   const BaseUrl = import.meta.env.VITE_API_URL;
//   const token = localStorage.getItem("token");
//   const role = localStorage.getItem("role");
//   const id = localStorage.getItem("id");

//   const [user, setUser] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//   });
//   const [error, setError] = useState(null); // สำหรับเก็บ error
//   const [loading, setLoading] = useState(true); // state สำหรับโหลดข้อมูล
//   const [isSubmitting, setIsSubmitting] = useState(false); // state สำหรับส่งข้อมูล
//   const [passwordError, setPasswordError] = useState(""); // เพิ่มตัวแปรสำหรับเก็บข้อผิดพลาดรหัสผ่าน

//   useEffect(() => {
//     if (!token || !id) {
//       setError("Token หรือ ID ไม่ถูกต้อง");
//       setLoading(false);
//       return;
//     }

//     const fetchUser = async () => {
//       try {
//         const response = await fetch(`${BaseUrl}/users/${id}`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (!response.ok) {
//           throw new Error("Error fetching user data");
//         }

//         const data = await response.json();
//         setUser({
//           name: data.name,
//           email: data.email,
//           password: "",
//           confirmPassword: "",
//         });
//       } catch (error) {
//         console.error("Error fetching user:", error);
//         setError(error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUser();
//   }, [BaseUrl, token, id]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setUser((prevUser) => ({
//       ...prevUser,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     setPasswordError("");

//     if (user.password && user.password !== user.confirmPassword) {
//       setPasswordError("รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน");
//       setIsSubmitting(false);
//       return;
//     }

//     try {
//       const response = await fetch(`${BaseUrl}/users/${id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           name: user.name,
//           email: user.email,
//           password: user.password || undefined, // ถ้าไม่เปลี่ยนรหัสผ่านจะไม่ส่ง
//         }),
//       });

//       if (!response.ok) {
//         throw new Error("Error updating user data");
//       }

//       setUser({
//         ...user,
//         password: "",
//         confirmPassword: "",
//       });
//       alert("อัปเดตข้อมูลสำเร็จ");
//     } catch (error) {
//       setError(error.message);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>Error: {error}</div>;
//   }

//   return (
//     <div>
//       <h3>จัดการบัญชีผู้ใช้งาน</h3>
//       {user ? (
//         <div>
//           <form onSubmit={handleSubmit}>
//             <label htmlFor="name">ชื่อผู้ใช้</label>
//             <input
//               type="text"
//               name="name"
//               id="name"
//               value={user.name}
//               onChange={handleChange}
//               className="form-control"
//               required
//             />

//             <label htmlFor="email">อีเมล</label>
//             <input
//               type="email"
//               name="email"
//               id="email"
//               value={user.email}
//               onChange={handleChange}
//               className="form-control"
//               required
//             />

//             <label htmlFor="password">เปลี่ยนรหัสผ่าน</label>
//             <input
//               type="password"
//               name="password"
//               id="password"
//               value={user.password}
//               onChange={handleChange}
//               className="form-control"
//             />

//             <label htmlFor="confirmPassword">ยืนยันรหัสผ่าน </label>
//             <input
//               type="password"
//               name="confirmPassword"
//               id="confirmPassword"
//               value={user.confirmPassword}
//               onChange={handleChange}
//               className="form-control"
//             />
//             {passwordError && (
//               <div className="text-danger mb-4">{passwordError}</div>
//             )}

//             <p>บทบาท: {role}</p>
//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className="btn btn-success"
//             >
//               {isSubmitting ? "Updating..." : "Update"}
//             </button>
//           </form>
//         </div>
//       ) : (
//         <div>ไม่พบข้อมูลผู้ใช้</div>
//       )}
//     </div>
//   );
// }

// export default UsersManagement;

import { useEffect, useState } from "react";

function UsersManagement() {
  const BaseUrl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const id = localStorage.getItem("id");

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    currentPassword: "", // เพิ่มฟิลด์สำหรับรหัสผ่านปัจจุบัน
  });
  const [error, setError] = useState(null); // สำหรับเก็บ error
  const [loading, setLoading] = useState(true); // state สำหรับโหลดข้อมูล
  const [isSubmitting, setIsSubmitting] = useState(false); // state สำหรับส่งข้อมูล
  const [passwordError, setPasswordError] = useState(""); // เพิ่มตัวแปรสำหรับเก็บข้อผิดพลาดรหัสผ่าน

  useEffect(() => {
    if (!token || !id) {
      setError("Token หรือ ID ไม่ถูกต้อง");
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await fetch(`${BaseUrl}/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Error fetching user data");
        }

        const data = await response.json();
        setUser({
          name: data.name,
          email: data.email,
          password: "",
          confirmPassword: "",
          currentPassword: "",
        });
      } catch (error) {
        console.error("Error fetching user:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [BaseUrl, token, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setPasswordError("");

    // ตรวจสอบว่ารหัสผ่านปัจจุบันถูกกรอกหรือไม่
    if (!user.currentPassword) {
      setPasswordError("กรุณากรอกรหัสผ่านปัจจุบัน");
      setIsSubmitting(false);
      return;
    }

    // ตรวจสอบรหัสผ่านใหม่กับการยืนยันรหัสผ่าน
    if (user.password && user.password !== user.confirmPassword) {
      setPasswordError("รหัสผ่านใหม่และการยืนยันรหัสผ่านไม่ตรงกัน");
      setIsSubmitting(false);
      return;
    }

    try {
      // ตรวจสอบรหัสผ่านปัจจุบันก่อน
      const verifyResponse = await fetch(`${BaseUrl}/users/verify-password/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword: user.currentPassword }),
      });

      if (!verifyResponse.ok) {
        throw new Error("รหัสผ่านปัจจุบันไม่ถูกต้อง");
      }

      // หากรหัสผ่านถูกต้อง ให้ทำการอัปเดตข้อมูลผู้ใช้
      const updateResponse = await fetch(`${BaseUrl}/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: user.name,
          email: user.email,
          password: user.password || undefined, // ถ้าไม่เปลี่ยนรหัสผ่านจะไม่ส่ง
        }),
      });

      if (!updateResponse.ok) {
        throw new Error("Error updating user data");
      }

      setUser({
        ...user,
        password: "",
        confirmPassword: "",
        currentPassword: "", // ล้างข้อมูลรหัสผ่านปัจจุบัน
      });
      alert("อัปเดตข้อมูลสำเร็จ");
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h3>จัดการบัญชีผู้ใช้งาน</h3>
      {user ? (
        <div>
          <form onSubmit={handleSubmit}>
            <label htmlFor="name">ชื่อผู้ใช้</label>
            <input
              type="text"
              name="name"
              id="name"
              value={user.name}
              onChange={handleChange}
              className="form-control"
              required
            />

            <label htmlFor="email">อีเมล</label>
            <input
              type="email"
              name="email"
              id="email"
              value={user.email}
              onChange={handleChange}
              className="form-control"
              required
            />

            <label htmlFor="currentPassword">รหัสผ่านปัจจุบัน</label>
            <input
              type="password"
              name="currentPassword"
              id="currentPassword"
              value={user.currentPassword}
              onChange={handleChange}
              className="form-control"
              required
            />

            <label htmlFor="password">เปลี่ยนรหัสผ่าน (ถ้าต้องการ)</label>
            <input
              type="password"
              name="password"
              id="password"
              value={user.password}
              onChange={handleChange}
              className="form-control"
            />

            <label htmlFor="confirmPassword">ยืนยันรหัสผ่านใหม่ </label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              value={user.confirmPassword}
              onChange={handleChange}
              className="form-control"
            />
            {passwordError && (
              <div className="text-danger mb-4">{passwordError}</div>
            )}

            <p>บทบาท: {role}</p>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-success"
            >
              {isSubmitting ? "Updating..." : "Update"}
            </button>
          </form>
        </div>
      ) : (
        <div>ไม่พบข้อมูลผู้ใช้</div>
      )}
    </div>
  );
}

export default UsersManagement;
