import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTicket, faTruckFast } from "@fortawesome/free-solid-svg-icons"; // นำเข้าไอคอนรถ
import Booking from "../components/Bookings/Booking";
import BookingCalendar from "../components/Calendars/BookingCalendar";

function Main() {
  const userId = localStorage.getItem("id");
  const token = localStorage.getItem("token");

  return (
    <div>
      <h3>ยินดีต้อนรับเข้าสู่ ระบบจองรถ AM</h3>

      <div className="card card-body mb-2 border-0 shadow-sm ">
        <h4>ประชาสัมพันธ์</h4>
        ระบบจองรถ (Reserve Car)
        คือเครื่องมือที่จะช่วยให้การจัดการคิวรถและพนักงานขับรถเป็นเรื่องง่ายดาย
        ไม่ว่าจะเป็นการจองรถสำหรับธุรกิจ การเดินทางเพื่อการทำงาน
        หรือการใช้งานในองค์กร
        ระบบนี้ออกแบบมาเพื่อช่วยให้ทุกคนสามารถจองรถได้ง่ายๆ ผ่านหน้าเว็บไซต์
      </div>

      <div className="row">
        <div className="col-md-3 mb-2">
          <a
            href="/reserveCar"
            className="btn btn-secondary card d-flex flex-column align-items-center justify-content-center border-0 shadow-sm "
            style={{ height: "200px" }}
          >
            <FontAwesomeIcon icon={faTicket} size="3x" className="mb-2" />
            <h4>จองรถ</h4>
          </a>
        </div>

        <div className="col-md-3 mb-2">
          <a
            className="btn btn-secondary card d-flex align-items-center justify-content-center border-0 shadow-sm "
            style={{ height: "200px" }}
          >
            <FontAwesomeIcon icon={faTruckFast} size="3x" className="mb-2" />

            <h4>เดินทาง</h4>
          </a>
        </div>
      </div>

      <BookingCalendar />
      <Booking userId={userId} token={token} />
    </div>
  );
}

export default Main;
