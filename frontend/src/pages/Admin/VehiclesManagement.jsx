import { useState, useEffect } from "react";

function VehiclesManagement() {
  const BaseUrl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const [vehicles, setVehicles] = useState([]);
  const [newVehicle, setNewVehicle] = useState({
    vehicleName: "",
    plateNumber: "",
    status: "Available",
  });
  const [editingVehicle, setEditingVehicle] = useState(null);

  useEffect(() => {
    if (token && role === "admin") {
      fetch(`${BaseUrl}/vehicles`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setVehicles(data);
        })
        .catch((error) => {
          console.error("Error fetching vehicles:", error);
        });
    }
  }, [BaseUrl, token, role]);

  const handleDelete = (id) => {
    fetch(`${BaseUrl}/vehicles/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(() => {
        const updatedVehicles = vehicles.filter((vehicle) => vehicle.id !== id);
        setVehicles(updatedVehicles);
      })
      .catch((error) => console.error("Error deleting vehicle:", error));
  };

  const handleAddVehicle = () => {
    fetch(`${BaseUrl}/vehicles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newVehicle),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data.status === "created") {
          fetch(`${BaseUrl}/vehicles`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
            .then((response) => response.json())
            .then((vehiclesData) => {
              setVehicles(vehiclesData);
              setNewVehicle({
                vehicleName: "",
                plateNumber: "",
                status: "Active",
              });
            })
            .catch((error) => console.error("Error fetching vehicles:", error));
        }
      })
      .catch((error) => console.error("Error adding vehicle:", error));
  };

  const handleEditVehicle = (id) => {
    const vehicle = vehicles.find((v) => v.id === id);
    setEditingVehicle(vehicle);
  };

  const handleUpdateVehicle = () => {
    fetch(`${BaseUrl}/vehicles/${editingVehicle.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(editingVehicle),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.status === 204 ? null : response.json();
      })
      .then((updatedVehicle) => {
        if (updatedVehicle && updatedVehicle.id) {
          const updatedVehicles = vehicles.map((vehicle) =>
            vehicle.id === updatedVehicle.id ? updatedVehicle : vehicle
          );
          setVehicles(updatedVehicles);
        } else {
          console.warn(
            "No updated vehicle data returned, consider refetching the vehicle list."
          );
          fetchVehicles();
        }
        setEditingVehicle(null);
      })
      .catch((error) => console.error("Error updating vehicle:", error));
  };

  const fetchVehicles = () => {
    fetch(`${BaseUrl}/vehicles`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setVehicles(data))
      .catch((error) => console.error("Error fetching vehicles:", error));
  };

  if (role === "admin") {
    return (
      <div>
        <h3>จัดการยานพาหนะ</h3>

        <button
          type="button"
          className="btn btn-outline-primary"
          data-bs-toggle="modal"
          data-bs-target="#AddNewVehicleModal"
        >
          เพิ่มยานพาหนะ
        </button>

        <div className="modal fade" id="AddNewVehicleModal">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">เพิ่มยานพาหนะ</h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <label htmlFor="vehicleName">ชื่อยานพาหนะ</label>
                <input
                  type="text"
                  placeholder="ชื่อยานพาหนะ"
                  value={newVehicle.vehicleName}
                  className="form-control mb-2"
                  onChange={(e) =>
                    setNewVehicle({
                      ...newVehicle,
                      vehicleName: e.target.value,
                    })
                  }
                />
                <label htmlFor="plateNumber">หมายเลขทะเบียน</label>
                <input
                  type="text"
                  placeholder="หมายเลขทะเบียน"
                  value={newVehicle.plateNumber}
                  className="form-control mb-2"
                  onChange={(e) =>
                    setNewVehicle({
                      ...newVehicle,
                      plateNumber: e.target.value,
                    })
                  }
                />
                <label htmlFor="status">สถานะ</label>
                <select
                  value={newVehicle.status}
                  className="form-select mb-2"
                  onChange={(e) =>
                    setNewVehicle({ ...newVehicle, status: e.target.value })
                  }
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
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
                  onClick={handleAddVehicle}
                  className="btn btn-outline-primary"
                >
                  เพิ่มยานพาหนะ
                </button>
              </div>
            </div>
          </div>
        </div>

        <table className="table table-bordered" style={{ marginTop: "20px" }}>
          <thead>
            <tr>
              <th>ลำดับ</th>
              <th>ชื่อยานพาหนะ</th>
              <th>หมายเลขทะเบียน</th>
              <th>สถานะ</th>
              <th className="text-center">การจัดการ</th>
            </tr>
          </thead>

          <tbody>
            {vehicles.map((vehicle, index) => (
              <tr key={vehicle.id || index}>
                <td>{index + 1}</td>
                <td>{vehicle.vehicleName}</td>
                <td>{vehicle.plateNumber}</td>
                <td>{vehicle.status}</td>
                <td className="text-center">
                  <button
                    onClick={() => handleEditVehicle(vehicle.id)}
                    className="btn btn-warning mx-2"
                  >
                    แก้ไข
                  </button>
                  <button
                    onClick={() => {
                      if (
                        window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลนี้?")
                      ) {
                        handleDelete(vehicle.id);
                      }
                    }}
                    className="btn btn-danger"
                  >
                    ลบ
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {editingVehicle && (
          <div
            className="modal fade show"
            style={{ display: "block" }}
            id="EditVehicleModal"
            tabIndex="-1"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">แก้ไขยานพาหนะ</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setEditingVehicle(null)}
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <label htmlFor="vehicleName">ชื่อยานพาหนะ</label>
                  <input
                    type="text"
                    className="form-control mb-2"
                    value={editingVehicle.vehicleName}
                    onChange={(e) =>
                      setEditingVehicle({
                        ...editingVehicle,
                        vehicleName: e.target.value,
                      })
                    }
                  />
                  <label htmlFor="plateNumber">หมายเลขทะเบียน</label>
                  <input
                    type="text"
                    className="form-control mb-2"
                    value={editingVehicle.plateNumber}
                    onChange={(e) =>
                      setEditingVehicle({
                        ...editingVehicle,
                        plateNumber: e.target.value,
                      })
                    }
                  />
                  <label htmlFor="status">สถานะ</label>
                  <select
                    className="form-select mb-2"
                    value={editingVehicle.status}
                    onChange={(e) =>
                      setEditingVehicle({
                        ...editingVehicle,
                        status: e.target.value,
                      })
                    }
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setEditingVehicle(null)}
                  >
                    ปิด
                  </button>
                  <button
                    onClick={handleUpdateVehicle}
                    className="btn btn-outline-primary"
                  >
                    บันทึกการเปลี่ยนแปลง
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return <h2>Unauthorized</h2>;
}

export default VehiclesManagement;
