import "./App.css";

import { Route, Routes, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Main from "./pages/Main";
import Login from "./pages/authentication/Login";
import Register from "./pages/authentication/Register";
import ReserveCar from "./pages/ReserveCar";
import DriverManagement from "./pages/Admin/DriverManagement";
import VehiclesManagement from "./pages/Admin/VehiclesManagement";
import AdminUserManagement from "./pages/Admin/AdminUserManagement";
import UsersManagement from "./pages/UsersManagement";
import ReserveCarView from "./pages/ReserveCars/ReserveCarView";

function App() {
  const token = localStorage.getItem("token");

  return (
    <Layout>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/" element={token ? <Main /> : <Navigate to="/login" />} />

        <Route
          path="/usersManagement"
          element={token ? <UsersManagement /> : <Navigate to="/login" />}
        />

        <Route
          path="/admin/usersManagement"
          element={token ? <AdminUserManagement /> : <Navigate to="/login" />}
        />

        <Route
          path="/admin/driverManagement"
          element={token ? <DriverManagement /> : <Navigate to="/login" />}
        />

        <Route
          path="/admin/vehiclesManagement"
          element={token ? <VehiclesManagement /> : <Navigate to="/login" />}
        />

        <Route
          path="/reserveCar"
          element={token ? <ReserveCar /> : <Navigate to="/login" />}
        />

        <Route
          path="/reserveCar/view/:bookingId"
          element={token ? <ReserveCarView /> : <Navigate to="/login" />}
        />
      </Routes>
    </Layout>
  );
}

export default App;
