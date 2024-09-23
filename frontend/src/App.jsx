import "./App.css";

import { Route, Routes, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Main from "./pages/Main";
import Login from "./pages/authentication/Login";
import UsersManagement from "./pages/UsersManagement";

function App() {
  const token = localStorage.getItem("token");

  return (
    <Layout>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={token ? <Main /> : <Navigate to="/login" />} />

        <Route
          path="/usersManagement"
          element={
            token ? <UsersManagement /> : <Navigate to="/usersManagement" />
          }
        />
      </Routes>
    </Layout>
  );
}

export default App;
