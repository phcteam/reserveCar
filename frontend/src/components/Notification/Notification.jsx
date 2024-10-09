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
  const [showToast, setShowToast] = useState(false); // state สำหรับแสดง/ซ่อน Toast
  const [newBooking, setNewBooking] = useState(null); // เก็บข้อมูลการจองใหม่

  useEffect(() => {
    // ดึงข้อมูลการจองล่าสุด
    fetch(`${BaseUrl}/bookings?user_id=${userId}&limit=4&order=DESC`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setBookings(data))
      .catch((error) => {
        console.error("Error fetching bookings:", error);
      });

    // ฟังการแจ้งเตือนใหม่จาก socket.io
    socket.on("newBooking", (data) => {
      if (data) {
        setNotifications((prevNotifications) => [...prevNotifications, data]);
        setNewBooking(data); // เก็บข้อมูลการจองใหม่
        setShowToast(true); // แสดง Toast เมื่อมีการจองใหม่

        // ซ่อน Toast หลังจาก 5 วินาที
        setTimeout(() => {
          setShowToast(false);
        }, 5000);
      }
    });

    return () => {
      socket.off("newBooking");
    };
  }, [userId, token]);

  return (
    <div>
      <div
        className={`toast position-fixed bottom-75 end-0 p-3 ${
          showToast ? "show" : "hide"
        }`}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        style={{ zIndex: 1055 }}
      >
        <div className="toast-header">
          <FontAwesomeIcon icon={faBell} size="2x" />
          <strong className="mr-auto mx-2">การจองใหม่</strong>
          <small className="text-muted">เมื่อสักครู่</small>
          <button
            type="button"
            className="btn-close ms-auto"
            aria-label="Close"
            onClick={() => setShowToast(false)}
          ></button>
        </div>
        <a
          href={`/reserveCar/view/${newBooking?.id}`}
          className="toast-body btn w-100"
        >
          หมายเลขที่จอง: {newBooking?.id}
        </a>
      </div>

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
          <p className="mx-2">การแจ้งเตือน ใหม่</p>

          {notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <div key={index} className="m-1">
                <a
                  href={`/reserveCar/view/${notification.id}`}
                  className="text-start btn btn-outline-secondary w-100 border-0"
                >
                  <div className="row">
                    <div className="col">
                      <p> หมายเลขที่จอง: {notification.id} </p>
                    </div>
                    <div className="col col-auto">
                      <span className="text-primary">●</span>
                    </div>
                  </div>
                </a>
              </div>
            ))
          ) : (
            <p className="card p-2 m-2 border-0">ไม่มีการแจ้งเตือน ใหม่</p>
          )}
          <hr />

          <p className="mx-2">ก่อนหน้านี้</p>

          {bookings.length > 0 ? (
            bookings.map((booking, index) => (
              <div key={index} className="m-1">
                <a
                  href={`/reserveCar/view/${booking.id}`}
                  className="text-start btn btn-outline-secondary w-100 border-0"
                >
                  <div className="row">
                    <div className="col">
                      <p>หมายเลขที่จอง: {booking.id}</p>
                    </div>
                    <div className="col col-auto">
                      <span className="text-primary">●</span>
                    </div>
                  </div>
                </a>
              </div>
            ))
          ) : (
            <p className="card p-2 m-2 border-0">ไม่มีการแจ้งเตือน </p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Notification;
