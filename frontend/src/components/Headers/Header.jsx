import React from "react";
import navbarMenu from "./navbarMenu";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import Notification from "../Notification/Notification";

function Header() {
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.clear();
    window.location = "/login";
  };

  return (
    <>
      <nav
        className="navbar navbar-expand-lg"
        style={{
          backgroundColor: "#eb8799eb",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div className="container-fluid">
          <h4 className="navbar-brand mt-2">
            <Link to="/" style={{ textDecoration: "none", color: "#ffffff" }}>
              <img
                src={logo}
                alt="ระบบจองรถ AM"
                style={{ height: "50px", marginRight: "10px" }}
              />
              ระบบจองรถ AM
            </Link>
          </h4>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {navbarMenu.map((menu, index) => (
                <React.Fragment key={index}>
                  {Object.entries(menu).map(
                    ([menuName, menuData], menuIndex) =>
                      menuData.firstRole.includes(role) && (
                        <li key={menuIndex} className="nav-item dropdown">
                          <a
                            className="nav-link dropdown-toggle"
                            style={{ color: "#ffff" }}
                            href="#"
                            id={`navbarDropdown${index}${menuIndex}`}
                            role="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            {menuName}
                          </a>
                          <ul
                            className="dropdown-menu"
                            aria-labelledby={`navbarDropdown${index}${menuIndex}`}
                          >
                            {menuData.subMenu.map((item, subIndex) => (
                              <React.Fragment key={subIndex}>
                                {item.role.includes(role) && (
                                  <li>
                                    {item.action === "logout" ? (
                                      <button
                                        className="dropdown-item"
                                        onClick={handleLogout}
                                      >
                                        {item.name}
                                      </button>
                                    ) : (
                                      <Link
                                        to={item.link}
                                        className="dropdown-item"
                                      >
                                        {item.name}
                                      </Link>
                                    )}
                                  </li>
                                )}
                                {item.hr && <hr />}
                              </React.Fragment>
                            ))}
                          </ul>
                        </li>
                      )
                  )}
                </React.Fragment>
              ))}
            </ul>
          </div>

          <div className="ms-auto">
            <Notification />
          </div>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>
      </nav>
    </>
  );
}

export default Header;
