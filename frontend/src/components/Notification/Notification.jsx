import { useState, useEffect } from "react";

function Notification() {
  const [hasNewBooking, setHasNewBooking] = useState(false);

  useEffect(() => {
    // ฟังก์ชันสำหรับตรวจสอบ booking ใหม่ (เช่น fetch จาก API)
    const checkForNewBookings = async () => {
      const response = await fetch("/api/bookings");
      const data = await response.json();
      setHasNewBooking(data.length > 0);
    };

    // เช็ค booking ทุกๆ 5 วินาที (ปรับเวลาได้)
    const interval = setInterval(checkForNewBookings, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="notification"
      style={{ display: hasNewBooking ? "block" : "none" }}
    >
      มีการ booking ใหม่!
      <button onClick={() => setHasNewBooking(false)}>ปิด</button>
    </div>
  );
}

export default Notification;
