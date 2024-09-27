import { useState, useEffect } from "react";

function UsersManagement() {
  const BaseUrl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "User" });
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    if (token && role === "admin") {
      fetch(`${BaseUrl}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setUsers(data);
        })
        .catch((error) => {
          console.error("Error fetching users:", error);
        });
    }
  }, [BaseUrl, token, role]);

  const handleDelete = (id) => {
    fetch(`${BaseUrl}/users/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(() => {
        const updatedUsers = users.filter((user) => user.id !== id);
        setUsers(updatedUsers);
      })
      .catch((error) => console.error("Error deleting user:", error));
  };

  const handleAddUser = () => {
    fetch(`${BaseUrl}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newUser),
    })
      .then((response) => response.json())
      .then((user) => {
        setUsers([...users, user]);
        setNewUser({ name: "", email: "", role: "User" });
      })
      .catch((error) => console.error("Error adding user:", error));
  };

  const handleEditUser = (id) => {
    const user = users.find((u) => u.id === id);
    setEditingUser(user);
  };

  const handleUpdateUser = () => {
    fetch(`${BaseUrl}users/${editingUser.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(editingUser),
    })
      .then((response) => response.json())
      .then((updatedUser) => {
        const updatedUsers = users.map((user) =>
          user.id === updatedUser.id ? updatedUser : user
        );
        setUsers(updatedUsers);
        setEditingUser(null);
      })
      .catch((error) => console.error("Error updating user:", error));
  };

  if (role == "admin") {
    return (
      <div>
        <h3>จัดการบัญชีผู้ใช้งาน</h3>

        <button
          type="button"
          className="btn btn-outline-primary"
          data-bs-toggle="modal"
          data-bs-target="#AddNewUserModal"
        >
          เพิ่มผู้ใช้งาน
        </button>

        <div className="modal fade" id="AddNewUserModal">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  เพิ่มผู้ใช้งาน
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <label htmlFor="name">ชื่อ</label>
                <input
                  type="text"
                  placeholder="ชื่อ"
                  value={newUser.name}
                  className="form-control mb-2"
                  onChange={(e) =>
                    setNewUser({ ...newUser, name: e.target.value })
                  }
                />
                <label htmlFor="username">Username</label>

                <input
                  type="text"
                  placeholder="Username"
                  value={newUser.username}
                  className="form-control mb-2"
                  onChange={(e) =>
                    setNewUser({ ...newUser, username: e.target.value })
                  }
                />
                <label htmlFor="email">E-Mail</label>

                <input
                  type="email"
                  placeholder="อีเมล"
                  value={newUser.email}
                  className="form-control mb-2"
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                />

                <label htmlFor="role">Role</label>
                <select
                  value={newUser.role}
                  className="form-select mb-2"
                  onChange={(e) =>
                    setNewUser({ ...newUser, role: e.target.value })
                  }
                >
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  ปิด
                </button>
                <button
                  onClick={handleAddUser}
                  className="btn btn-outline-primary"
                >
                  เพิ่มผู้ใช้งาน
                </button>
              </div>
            </div>
          </div>
        </div>

        <table className="table table-bordered" style={{ marginTop: "20px" }}>
          <thead>
            <tr>
              <th>ลำดับ</th>
              <th>ชื่อ</th>
              <th>อีเมล</th>
              <th>สิทธิ์การใช้งาน</th>
              <th className="text-center">การจัดการ</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td className="text-center">
                  <button
                    onClick={() => handleEditUser(user.id)}
                    className="btn btn-warning mx-2"
                  >
                    แก้ไข
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="btn btn-danger"
                  >
                    ลบ
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {editingUser && (
          <div className="modal">
            <h4>แก้ไขผู้ใช้งาน</h4>
            <input
              type="text"
              value={editingUser.name}
              onChange={(e) =>
                setEditingUser({ ...editingUser, name: e.target.value })
              }
            />
            <input
              type="email"
              value={editingUser.email}
              onChange={(e) =>
                setEditingUser({ ...editingUser, email: e.target.value })
              }
            />
            <select
              value={editingUser.role}
              onChange={(e) =>
                setEditingUser({ ...editingUser, role: e.target.value })
              }
            >
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </select>

            <button onClick={handleUpdateUser} className="btn btn-primary">
              บันทึก
            </button>

            <button
              onClick={() => setEditingUser(null)}
              className="btn btn-secondary"
            >
              ยกเลิก
            </button>
          </div>
        )}
      </div>
    );
  } else {
    return (
      <div>
        <div className="alert alert-danger">คุณไม่ใช่ Admin </div>
      </div>
    );
  }
}

export default UsersManagement;
