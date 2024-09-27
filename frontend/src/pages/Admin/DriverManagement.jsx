import { useState, useEffect } from "react";

function DriverManagement() {
  const BaseUrl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const [driverList, setDriverList] = useState([]);
  const [newDriver, setNewDriver] = useState({
    name: "",
    licenseNumber: "",
    desc: "",
    rating: "",
    status: "active", // หรือค่าเริ่มต้นอื่นๆ ที่คุณต้องการ
  });
  const [editingDriver, setEditingDriver] = useState(null);
  const [filters, setFilters] = useState({
    name: "",
    licenseNumber: "",
    desc: "",
    rating: "",
    status: "",
    limit: 10,
    page: 1,
  });

  useEffect(() => {
    if (token && role === "admin") {
      fetchDrivers();
    }
  }, [BaseUrl, token, role, filters]);

  const fetchDrivers = () => {
    const queryParams = new URLSearchParams(filters).toString();
    fetch(`${BaseUrl}/drivers?${queryParams}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setDriverList(data);
      })
      .catch((error) => {
        console.error("Error fetching drivers:", error);
      });
  };

  const handleDelete = (id) => {
    if (window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลนี้?")) {
      fetch(`${BaseUrl}/drivers/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(() => {
          setDriverList(driverList.filter((driver) => driver.id !== id));
        })
        .catch((error) => console.error("Error deleting driver:", error));
    }
  };

  const handleAddDriver = () => {
    fetch(`${BaseUrl}/drivers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newDriver),
    })
      .then((response) => response.json())
      .then(() => {
        fetchDrivers();
        setNewDriver({
          name: "",
          licenseNumber: "",
          desc: "",
          rating: "",
          status: "active",
        });
      })
      .catch((error) => console.error("Error adding driver:", error));
  };

  const handleEditDriver = (id) => {
    const driver = driverList.find((d) => d.id === id);
    setEditingDriver(driver);
  };

  const handleUpdateDriver = () => {
    fetch(`${BaseUrl}/drivers/${editingDriver.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(editingDriver),
    })
      .then(() => {
        fetchDrivers();
        setEditingDriver(null);
      })
      .catch((error) => console.error("Error updating driver:", error));
  };

  if (role === "admin") {
    return (
      <div>
        <h3>จัดการบัญชีคนขับรถ</h3>

        <button
          type="button"
          className="btn btn-outline-primary"
          data-bs-toggle="modal"
          data-bs-target="#AddNewDriverModal"
        >
          เพิ่มผู้ใช้งาน
        </button>

        <div className="modal fade" id="AddNewDriverModal" tabIndex="-1">
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
                  value={newDriver.name}
                  className="form-control mb-2"
                  onChange={(e) =>
                    setNewDriver({ ...newDriver, name: e.target.value })
                  }
                />
                <label htmlFor="licenseNumber">หมายเลขใบอนุญาต</label>
                <input
                  type="text"
                  placeholder="หมายเลขใบอนุญาต"
                  value={newDriver.licenseNumber}
                  className="form-control mb-2"
                  onChange={(e) =>
                    setNewDriver({
                      ...newDriver,
                      licenseNumber: e.target.value,
                    })
                  }
                />
                <label htmlFor="desc">คำอธิบาย</label>
                <input
                  type="text"
                  placeholder="คำอธิบาย"
                  value={newDriver.desc}
                  className="form-control mb-2"
                  onChange={(e) =>
                    setNewDriver({ ...newDriver, desc: e.target.value })
                  }
                />
                <label htmlFor="rating">คะแนน</label>
                <input
                  type="text"
                  placeholder="คะแนน"
                  value={newDriver.rating}
                  className="form-control mb-2"
                  onChange={(e) =>
                    setNewDriver({ ...newDriver, rating: e.target.value })
                  }
                />
                <label htmlFor="status">สถานะ</label>
                <select
                  value={newDriver.status}
                  className="form-select mb-2"
                  onChange={(e) =>
                    setNewDriver({ ...newDriver, status: e.target.value })
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
                  onClick={handleAddDriver}
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
              <th>หมายเลขใบอนุญาต</th>
              <th>คำอธิบาย</th>
              <th>คะแนน</th>
              <th>สถานะ</th>
              <th className="text-center">การจัดการ</th>
            </tr>
          </thead>
          <tbody>
            {driverList.map((driver, index) => (
              <tr key={driver.id}>
                <td>{index + 1}</td>
                <td>{driver.name}</td>
                <td>{driver.licenseNumber}</td>
                <td>{driver.desc}</td>
                <td>{driver.rating}</td>
                <td>{driver.status}</td>
                <td className="text-center">
                  <button
                    onClick={() => handleEditDriver(driver.id)}
                    className="btn btn-warning mx-2"
                    data-bs-toggle="modal"
                    data-bs-target="#EditDriverModal"
                  >
                    แก้ไข
                  </button>
                  <button
                    onClick={() => handleDelete(driver.id)}
                    className="btn btn-danger"
                  >
                    ลบ
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {editingDriver && (
          <div
            className="modal fade show"
            style={{ display: "block" }}
            id="EditDriverModal"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">แก้ไขผู้ใช้งาน</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setEditingDriver(null)}
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <label htmlFor="name">ชื่อ</label>
                  <input
                    type="text"
                    className="form-control mb-2"
                    value={editingDriver.name}
                    onChange={(e) =>
                      setEditingDriver({
                        ...editingDriver,
                        name: e.target.value,
                      })
                    }
                  />
                  <label htmlFor="licenseNumber">หมายเลขใบอนุญาต</label>
                  <input
                    type="text"
                    className="form-control mb-2"
                    value={editingDriver.licenseNumber}
                    onChange={(e) =>
                      setEditingDriver({
                        ...editingDriver,
                        licenseNumber: e.target.value,
                      })
                    }
                  />
                  <label htmlFor="desc">คำอธิบาย</label>
                  <input
                    type="text"
                    className="form-control mb-2"
                    value={editingDriver.desc}
                    onChange={(e) =>
                      setEditingDriver({
                        ...editingDriver,
                        desc: e.target.value,
                      })
                    }
                  />
                  <label htmlFor="rating">คะแนน</label>
                  <input
                    type="text"
                    className="form-control mb-2"
                    value={editingDriver.rating}
                    onChange={(e) =>
                      setEditingDriver({
                        ...editingDriver,
                        rating: e.target.value,
                      })
                    }
                  />
                  <label htmlFor="status">สถานะ</label>
                  <select
                    className="form-select mb-2"
                    value={editingDriver.status}
                    onChange={(e) =>
                      setEditingDriver({
                        ...editingDriver,
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
                    onClick={() => setEditingDriver(null)}
                  >
                    ปิด
                  </button>
                  <button
                    onClick={handleUpdateDriver}
                    className="btn btn-outline-primary"
                  >
                    อัปเดต
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  } else {
    return <h3>คุณไม่มีสิทธิ์เข้าถึงหน้านี้</h3>;
  }
}

export default DriverManagement;
