import React from "react";
import navbarMenu from "./navbarMenu";
import { Link } from "react-router-dom";

function Header() {
  const role = localStorage.getItem("role");

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <h4 className="navbar-brand">
            <Link to="/" style={{ textDecoration: "none", color: "black" }}>
              Reserve Car
            </Link>
          </h4>
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
          
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {navbarMenu.map((menu, index) => (
                <React.Fragment key={index}>
                  {Object.entries(menu).map(
                    ([menuName, menuData], menuIndex) => (
                      <li key={menuIndex} className="nav-item dropdown">
                        <a
                          className="nav-link dropdown-toggle"
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
                              {item.role.includes(role) && <li>{item.name}</li>}
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
        </div>
      </nav>
    </>
  );
}

export default Header;
