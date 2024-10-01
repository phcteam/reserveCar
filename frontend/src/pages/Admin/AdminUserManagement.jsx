import { useState, useEffect } from "react";

function AdminUserManagement() {
  const BaseUrl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const [userList, setUserList] = useState([]);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    phone: "",
    role: "user", // หรือค่าเริ่มต้นอื่นๆ ที่คุณต้องการ
    status: "active",
  });
  const [editingUser, setEditingUser] = useState(null);
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    status: "",
    limit: 10,
    page: 1,
  });

  useEffect(() => {
    if (token && role === "admin") {
      fetchUsers();
    }
  }, [BaseUrl, token, role, filters]);

  const fetchUsers = () => {
    const queryParams = new URLSearchParams(filters).toString();
    fetch(`${BaseUrl}/users?${queryParams}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setUserList(data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  };

  const handleDelete = (id) => {
    if (window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้งานนี้?")) {
      fetch(`${BaseUrl}/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(() => {
          setUserList(userList.filter((user) => user.id !== id));
        })
        .catch((error) => console.error("Error deleting user:", error));
    }
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
      .then(() => {
        fetchUsers();
        setNewUser({
          name: "",
          email: "",
          phone: "",
          role: "user",
          status: "active",
        });
      })
      .catch((error) => console.error("Error adding user:", error));
  };

  const handleEditUser = (id) => {
    const user = userList.find((u) => u.id === id);
    setEditingUser(user);
  };

  const handleUpdateUser = () => {
    fetch(`${BaseUrl}/users/${editingUser.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(editingUser),
    })
      .then(() => {
        fetchUsers();
        setEditingUser(null);
      })
      .catch((error) => console.error("Error updating user:", error));
  };

  if (role === "admin") {
    return (
      <div>
        <h3>จัดการผู้ใช้งาน</h3>

        <button
          type="button"
          className="btn btn-outline-primary"
          data-bs-toggle="modal"
          data-bs-target="#AddNewUserModal"
        >
          เพิ่มผู้ใช้งาน
        </button>

        <div className="modal fade" id="AddNewUserModal" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">เพิ่มผู้ใช้งาน</h5>
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
                <label htmlFor="email">อีเมล</label>
                <input
                  type="email"
                  placeholder="อีเมล"
                  value={newUser.email}
                  className="form-control mb-2"
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                />
                <label htmlFor="phone">เบอร์โทรศัพท์</label>
                <input
                  type="text"
                  placeholder="เบอร์โทรศัพท์"
                  value={newUser.phone}
                  className="form-control mb-2"
                  onChange={(e) =>
                    setNewUser({ ...newUser, phone: e.target.value })
                  }
                />
                <label htmlFor="role">บทบาท</label>
                <select
                  value={newUser.role}
                  className="form-select mb-2"
                  onChange={(e) =>
                    setNewUser({ ...newUser, role: e.target.value })
                  }
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
                <label htmlFor="status">สถานะ</label>
                <select
                  value={newUser.status}
                  className="form-select mb-2"
                  onChange={(e) =>
                    setNewUser({ ...newUser, status: e.target.value })
                  }
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
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
              <th>เบอร์โทรศัพท์</th>
              <th>บทบาท</th>
              <th>สถานะ</th>
              <th className="text-center">การจัดการ</th>
            </tr>
          </thead>
          <tbody>
            {userList.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.role}</td>
                <td>{user.status}</td>
                <td className="text-center">
                  <button
                    onClick={() => handleEditUser(user.id)}
                    className="btn btn-warning mx-2"
                    data-bs-toggle="modal"
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
          <div className="modal fade show" style={{ display: "block" }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">แก้ไขผู้ใช้งาน</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setEditingUser(null)}
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <label htmlFor="name">ชื่อ</label>
                  <input
                    type="text"
                    className="form-control mb-2"
                    value={editingUser.name}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        name: e.target.value,
                      })
                    }
                  />
                  <label htmlFor="email">อีเมล</label>
                  <input
                    type="email"
                    className="form-control mb-2"
                    value={editingUser.email}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        email: e.target.value,
                      })
                    }
                  />
                  <label htmlFor="phone">เบอร์โทรศัพท์</label>
                  <input
                    type="text"
                    className="form-control mb-2"
                    value={editingUser.phone}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        phone: e.target.value,
                      })
                    }
                  />
                  <label htmlFor="role">บทบาท</label>
                  <select
                    className="form-select mb-2"
                    value={editingUser.role}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        role: e.target.value,
                      })
                    }
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                  <label htmlFor="status">สถานะ</label>
                  <select
                    className="form-select mb-2"
                    value={editingUser.status}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        status: e.target.value,
                      })
                    }
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setEditingUser(null)}
                  >
                    ปิด
                  </button>
                  <button
                    onClick={handleUpdateUser}
                    className="btn btn-outline-primary"
                  >
                    อัปเดตผู้ใช้งาน
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null; // หรือสามารถแสดงอะไรได้เมื่อไม่ใช่ผู้ดูแลระบบ
}

export default AdminUserManagement;
