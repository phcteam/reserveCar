import { useEffect, useState } from "react";
import FormatDateTime from "../FormatDateTime";
import GetRemainingTime from "../GetRemainingTime";

function Booking({ userId, token }) {
  const BaseUrl = import.meta.env.VITE_API_URL;
  const [bookings, setBookings] = useState([]);

  var currentTime = FormatDateTime(new Date());

  useEffect(() => {
    if (userId && token) {
      fetch(`${BaseUrl}/bookings?user_id=${userId}&start_time=${currentTime}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setBookings(data);
        })
        .catch((error) => {
          console.error("Error fetching bookings:", error);
        });
    }
  }, [BaseUrl, userId, token, currentTime]);

  return (
    <div className="card card-body mb-2 border-0 shadow-sm">
      <h4>รายการการจอง</h4>
      {bookings.length > 0 ? (
        <div>
          {bookings.map((booking) => (
            <div className="card card-body mb-2" key={booking.id}>
              หมายเลขที่จอง: {booking.id} <br />
              ทะเบียนรถ: {booking.vehicle_id} <br />
              เวลาเดินทาง: {FormatDateTime(new Date(booking.start_time))}
              <hr />
              <GetRemainingTime startTime={booking.start_time} />
              <button className="btn btn-outline-primary">พร้อมเดินทาง</button>
            </div>
          ))}
        </div>
      ) : (
        <p>ไม่มีการจองในขณะนี้</p>
      )}
    </div>
  );
}

export default Booking;
