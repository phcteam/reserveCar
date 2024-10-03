import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";

const webSocketURL = import.meta.env.VITE_API_WEB_SOCKET;
const socket = io(`${webSocketURL}`);
const Notification = () => {
  const [notifications, setNotifications] = useState([]);

  // ฟังก์ชันสำหรับจัดเก็บการแจ้งเตือนใน localStorage
  const saveNotificationsToLocalStorage = (notifications) => {
    localStorage.setItem("notifications", JSON.stringify(notifications));
  };

  // ฟังก์ชันสำหรับโหลดการแจ้งเตือนจาก localStorage
  const loadNotificationsFromLocalStorage = () => {
    const storedNotifications = localStorage.getItem("notifications");
    return storedNotifications ? JSON.parse(storedNotifications) : [];
  };

  // ฟังก์ชันสำหรับตั้งเวลาให้ลบการแจ้งเตือนออกหลังจาก 3 นาที
  const scheduleNotificationRemoval = () => {
    setTimeout(() => {
      localStorage.removeItem("notifications");
      setNotifications([]);
    }, 180000); // 180,000 milliseconds = 3 นาที
  };

  useEffect(() => {
    // โหลดการแจ้งเตือนจาก localStorage เมื่อเริ่มต้น
    const storedNotifications = loadNotificationsFromLocalStorage();
    setNotifications(storedNotifications);

    // รับการแจ้งเตือนใหม่ผ่าน socket
    socket.on("newBooking", (data) => {
      console.log("New booking received:", data);
      if (data) {
        setNotifications((prevNotifications) => {
          const updatedNotifications = [...prevNotifications, data];
          saveNotificationsToLocalStorage(updatedNotifications); // บันทึกใน localStorage
          return updatedNotifications;
        });
      } else {
        console.warn("Received null or undefined data:", data);
      }
    });

    // ตั้งเวลาลบการแจ้งเตือนหลังจาก 3 นาที
    scheduleNotificationRemoval();

    // Cleanup socket connection on unmount
    return () => {
      socket.off("newBooking");
    };
  }, []);

  return (
    <div className="dropdown">
      <a
        className="btn rounded-circle position-relative"
        href="#"
        role="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <FontAwesomeIcon icon={faBell} size="2x" />
        <span
          className="position-absolute start-75 translate-middle badge rounded-pill bg-danger"
          style={({ fontSize: "7px" }, { top: "5px" })}
        >
          {notifications.length}
          <span className="visually-hidden">unread messages</span>
        </span>
      </a>

      <ul className="dropdown-menu dropdown-menu-end">
        <p className="mx-2">การแจ้งเตือน</p>
        <li className="card mx-1">
          <a className="dropdown-item" href="#">
            {notifications.length > 0 ? (
              <ul>
                {notifications.map((notification, index) => (
                  <li key={index}>
                    <strong>Booking ID:</strong> {notification.id} <br />
                    <strong>Customer Name:</strong> {notification.customerName}{" "}
                    <br />
                    <strong>Booking Time:</strong> {notification.bookingTime}{" "}
                    <br />
                  </li>
                ))}
              </ul>
            ) : (
              <p>No notifications available</p>
            )}
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Notification;
