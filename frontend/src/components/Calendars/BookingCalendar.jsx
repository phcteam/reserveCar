// import { useState, useEffect } from "react";
// import FullCalendar from "@fullcalendar/react";
// import dayGridPlugin from "@fullcalendar/daygrid";
// import timeGridPlugin from "@fullcalendar/timegrid";
// import interactionPlugin from "@fullcalendar/interaction";

// import "./BookingCalendar.css";

// import BookingModal from "./BookingModal";

// function BookingCalendar() {
//   const [bookings, setBookings] = useState([]);
//   const [selectedBooking, setSelectedBooking] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const token = localStorage.getItem("token");
//   const BaseUrl = import.meta.env.VITE_API_URL;

//   useEffect(() => {
//     const fetchBookings = async () => {
//       try {
//         const response = await fetch(`${BaseUrl}/bookings`, {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         const data = await response.json();
//         const events = data.map((booking) => ({
//           id: booking.id,
//           title: `Booking ${booking.id}`,
//           start: booking.start_time,
//           end: booking.end_time,
//           latitude: booking.latitude,
//           longitude: booking.longitude,
//         }));
//         setBookings(events);
//       } catch (error) {
//         console.error("Error fetching bookings:", error);
//       }
//     };

//     fetchBookings();
//   }, [BaseUrl, token]);

//   const handleEventClick = (info) => {
//     const bookingDetails = {
//       id: info.event.id,
//       title: info.event.title,
//       start: info.event.start,
//       end: info.event.end,
//       latitude: info.event.extendedProps.latitude,
//       longitude: info.event.extendedProps.longitude,
//     };
//     setSelectedBooking(bookingDetails); // ส่ง bookingDetails แทน info.event
//     setShowModal(true);
//   };

//   return (
//     <div className="shadow-sm card card-body border-0 mb-2">
//       <h1>ปฏิทินการจองรถ</h1>
//       <hr />
//       <FullCalendar
//         plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
//         initialView="dayGridMonth" // เริ่มต้นแสดงเป็นเดือน
//         headerToolbar={{
//           left: "prev,next today",
//           center: "title",
//           right: "dayGridMonth,timeGridWeek,timeGridDay",
//         }}
//         events={bookings} // ข้อมูลการจองที่ถูกแปลงเป็น events
//         eventClick={handleEventClick} // เมื่อคลิกที่การจอง
//         locale="th" // เปลี่ยนภาษาเป็นภาษาไทย
//         height="auto" // ปรับความสูงให้อัตโนมัติ
//         dayMaxEventRows={3} // จำกัดจำนวน event ที่แสดงในแต่ละวัน
//         moreLinkText="ดูเพิ่มเติม" // กำหนดข้อความของปุ่ม 'See more'
//       />
//       {showModal && (
//         <BookingModal
//           booking={selectedBooking}
//           onClose={() => setShowModal(false)}
//         />
//       )}
//     </div>
//   );
// }

// export default BookingCalendar;



import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction"; // สำหรับการคลิก event
import listPlugin from "@fullcalendar/list"; // นำเข้า list plugin
import "./BookingCalendar.css";
import BookingModal from "./BookingModal";

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
          title: `Booking ${booking.id}`,
          start: booking.start_time,
          end: booking.end_time,
          latitude: booking.latitude,
          longitude: booking.longitude,
        }));
        setBookings(events);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings();
  }, [BaseUrl, token]);

  const handleEventClick = (info) => {
    const bookingDetails = {
      id: info.event.id,
      title: info.event.title,
      start: info.event.start,
      end: info.event.end,
      latitude: info.event.extendedProps.latitude,
      longitude: info.event.extendedProps.longitude,
    };
    setSelectedBooking(bookingDetails); // ส่ง bookingDetails แทน info.event
    setShowModal(true);
  };

  return (
    <div className="shadow-sm card card-body border-0 mb-2">
      <h1>ปฏิทินการจองรถ</h1>
      <hr />
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]} // เพิ่ม listPlugin
        initialView="dayGridMonth" // เริ่มต้นแสดงเป็นเดือน
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek", // เพิ่ม listWeek เพื่อแสดงกำหนดการ
        }}
        events={bookings} // ข้อมูลการจองที่ถูกแปลงเป็น events
        eventClick={handleEventClick} // เมื่อคลิกที่การจอง
        locale="th" // เปลี่ยนภาษาเป็นภาษาไทย
        height="auto" // ปรับความสูงให้อัตโนมัติ
        dayMaxEventRows={3} // จำกัดจำนวน event ที่แสดงในแต่ละวัน
        moreLinkText="ดูเพิ่มเติม" // กำหนดข้อความของปุ่ม 'See more'
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
