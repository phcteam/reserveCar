import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";

const webSocketURL = import.meta.env.VITE_API_WEB_SOCKET;
const BaseUrl = import.meta.env.VITE_API_URL;
const userId = localStorage.getItem("id");
const token = localStorage.getItem("token");
const socket = io(`${webSocketURL}`);

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [bookings, setBookings] = useState([]);

  const saveNotificationsToLocalStorage = (notifications) => {
    localStorage.setItem("notifications", JSON.stringify(notifications));
  };

  const loadNotificationsFromLocalStorage = () => {
    const storedNotifications = localStorage.getItem("notifications");
    return storedNotifications ? JSON.parse(storedNotifications) : [];
  };

  useEffect(() => {
    const currentTime = new Date().toISOString();

    fetch(`${BaseUrl}/bookings?user_id=${userId}&start_time=${currentTime}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setBookings(data))
      .catch((error) => {
        console.error("Error fetching bookings:", error);
        // Optionally update UI state to reflect the error
      });

    const storedNotifications = loadNotificationsFromLocalStorage();
    setNotifications(storedNotifications);

    socket.on("newBooking", (data) => {
      if (data) {
        setNotifications((prevNotifications) => {
          const updatedNotifications = [...prevNotifications, data];
          saveNotificationsToLocalStorage(updatedNotifications);
          return updatedNotifications;
        });
      }
    });

    return () => {
      socket.off("newBooking");
    };
  }, [userId, token]);

  return (
    <div className="dropdown">
      <a
        className="btn rounded-circle position-relative"
        href="#"
        role="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        style={{ border: "none" }}
      >
        <FontAwesomeIcon icon={faBell} size="2x" />
        <span
          className="position-absolute start-75 translate-middle badge rounded-pill bg-danger"
          style={{ fontSize: "10px", top: "6px" }}
        >
          {notifications.length}
          <span className="visually-hidden">unread messages</span>
        </span>
      </a>

      <ul
        className="dropdown-menu dropdown-menu-end"
        style={{
          width: "300px",
          backgroundColor: "#eeeeee",
          border: "none",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <p className="mx-2">การแจ้งเตือน</p>

        {notifications.length > 0 ? (
          notifications.map((notification, index) => (
            <div key={index} href="#">
              <li className="card p-2 m-2 text-start">
                <div className="row">
                  <div className="col">
                    <p> หมายเลขที่จอง: {notification.id} </p>
                  </div>
                  <div className="col col-auto">
                    <a href="#">ดู</a>
                  </div>
                </div>
              </li>
            </div>
          ))
        ) : (
          <p className="card p-2 m-2">ไม่มีการแจ้งเตือน ใหม่</p>
        )}
      </ul>
    </div>
  );
};

export default Notification;
