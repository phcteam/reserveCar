import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction"; // สำหรับการคลิก event

import "./bookingCalendar.css"; // ไฟล์ CSS ที่ปรับปรุง

const BookingModal = ({ booking, onClose }) => {
  if (!booking) return null;

  return (
    <div
      className="modal fade show"
      style={{ display: "block" }}
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">
              รายละเอียดการจอง
            </h5>
            <button
              type="button"
              className="close btn btn-close"
              onClick={onClose}
              aria-label="Close"
            >
              <span aria-hidden="true"></span>
            </button>
          </div>
          <div className="modal-body">
            <p>หมายเลขการจอง: {booking.id}</p>
            <p>ชื่อ: {booking.title}</p>
            <p>วันที่เริ่ม: {new Date(booking.start).toLocaleString()}</p>
            <p>วันที่สิ้นสุด: {new Date(booking.end).toLocaleString()}</p>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              ปิด
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

function BookingCalendar() {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const token = localStorage.getItem("token");
  const BaseUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch(`${BaseUrl}/bookings`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        const events = data.map((booking) => ({
          id: booking.id,
          title: `การจองหมายเลข ${booking.id}`,
          start: booking.start_time,
          end: booking.end_time,
        }));
        setBookings(events);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings();
  }, [BaseUrl, token]);

  const handleEventClick = (info) => {
    setSelectedBooking(info.event);
    setShowModal(true);
  };

  return (
    <div className="shadow-sm card card-body border-0 mb-2">
      <h1>ปฏิทินการจองรถ</h1>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth" // เริ่มต้นแสดงเป็นเดือน
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        events={bookings} // ข้อมูลการจองที่ถูกแปลงเป็น events
        eventClick={handleEventClick} // เมื่อคลิกที่การจอง
        locale="th" // เปลี่ยนภาษาเป็นภาษาไทย
        height="auto" // ปรับความสูงให้อัตโนมัติ
      />
      {showModal && (
        <BookingModal
          booking={selectedBooking}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

export default BookingCalendar;
