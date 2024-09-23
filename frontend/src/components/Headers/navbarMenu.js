// import React from "react";
// import { Link } from "react-router-dom";


const name = localStorage.getItem("name");

const navbarMenu = [
  {
    Admin: {
      subMenu: [
        {
          name: "จัดการผู้ใช้งาน",
          link: "/admin/usersManagement",
          hr: false,
          role: ["admin"]
        },
        {
          name: "จัดการพนักงานขับรถ",
          link: "/admin/driverManagement",
          hr: false,
          role: ["admin"]
        },
        {
          name: "จัดการรถ",
          link: "/admin/vehiclesManagement",
          hr: false,
          role: ["admin"]
        },
        {
          name: "จัดการคิวรถ",
          link: "/admin/vehiclesQueue",
          hr: true,
          role: ["admin"]
        },
        {
          name: "รายงาน",
          link: "/admin/reports",
          hr: false,
          role: ["admin"]
        },
      ],
      firstRole: ["admin"]
    },
    [name]: {  // ใช้ค่า name จาก localStorage เพื่อสร้างชื่อเมนู
      subMenu: [
        {
          name: "จัดการผู้ใช้งาน",
          link: "/usersManagement",
          hr: true,
          role: ["admin", "user"]
        },
        {
          name: "ออกจากระบบ",
          hr: false,
          role: ["admin", "user"],
          action: "logout"
        },
      ],
      firstRole: ["admin", "user"]
    },
  }
];

export default navbarMenu;
