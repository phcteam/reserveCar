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
import UsersManagement from "./pages/usersManagement";

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
          element={
            token ? <UsersManagement /> : <Navigate to="/usersManagement" />
          }
        />

        {/* Admin */}
        <Route
          path="/admin/usersManagement"
          element={
            token ? <AdminUserManagement /> : <Navigate to="/usersManagement" />
          }
        />

        <Route
          path="/admin/driverManagement"
          element={
            token ? <DriverManagement /> : <Navigate to="/driverManagement" />
          }
        />

        <Route
          path="/admin/vehiclesManagement"
          element={
            token ? (
              <VehiclesManagement />
            ) : (
              <Navigate to="/vehiclesManagement" />
            )
          }
        />
        {/* <Route
          path="/admin/vehiclesQueueManagement"
          element={
            token ? (
              <VehiclesQueueManagement />
            ) : (
              <Navigate to="/vehiclesQueueManagement" />
            )
          }
        /> */}

        <Route
          path="/reserveCar"
          element={token ? <ReserveCar /> : <Navigate to="/reserveCar" />}
        />
      </Routes>
    </Layout>
  );
}

export default App;
