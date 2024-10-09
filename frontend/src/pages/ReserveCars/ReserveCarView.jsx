import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FormatDateTime from "../../components/FormatDateTime";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

function ReserveCarView() {
  const userId = localStorage.getItem("id");
  const token = localStorage.getItem("token");

  const BaseUrl = import.meta.env.VITE_API_URL;
  const GoogleMapToken = import.meta.env.VITE_GOOGLE_MAP_TOKEN;

  const { bookingId } = useParams(); // ดึง bookingId จาก URL
  const [booking, setBooking] = useState(null); // สร้าง state สำหรับเก็บข้อมูลการจอง
  const [loading, setLoading] = useState(true); // สำหรับแสดงสถานะโหลดข้อมูล

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await fetch(`${BaseUrl}/bookings/${bookingId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch booking");
        }

        const data = await response.json();
        setBooking(data); // ตั้งค่าข้อมูลการจองใน state
        setLoading(false); // ปิดการโหลด
      } catch (error) {
        console.error("Error fetching booking:", error);
        setLoading(false); // ปิดการโหลดแม้เกิดข้อผิดพลาด
      }
    };

    fetchBooking();
  }, [BaseUrl, bookingId, token]);

  if (loading) {
    return <div>Loading...</div>; // แสดงข้อความขณะโหลด
  }

  if (!booking) {
    return <div>ไม่พบข้อมูลการจอง</div>; // ถ้าไม่พบข้อมูลการจอง
  }

  const center = {
    lat: parseFloat(booking.latitude),
    lng: parseFloat(booking.longitude),
  };

  return (
    <div>
      <h1>รายละเอียดการจอง</h1>

      <LoadScript googleMapsApiKey={GoogleMapToken}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={14} // ปรับระดับการซูม
        >
          <Marker position={center} /> {/* แสดง marker ที่ตำแหน่งของการจอง */}
        </GoogleMap>
      </LoadScript>
      <table className="table table-bordered mt-2 bg-white">
        <tr>
          <th
            style={{ padding: "10px 15px" }}
            className="bg-light"
            height="40px"
          >
            หมายเลขที่จอง
          </th>
          <td style={{ padding: "10px 15px" }}>{booking.id}</td>
        </tr>
        <tr>
          <th
            style={{ padding: "10px 15px" }}
            className="bg-light"
            height="40px"
          >
            ชื่อผู้จอง
          </th>
          <td style={{ padding: "10px 15px" }}>{booking.user.name}</td>
        </tr>
        <tr>
          <th
            style={{ padding: "10px 15px" }}
            className="bg-light"
            height="40px"
          >
            วันที่จอง
          </th>
          <td style={{ padding: "10px 15px" }}>
            {FormatDateTime(new Date(booking.created_at))}
          </td>
        </tr>
        <tr>
          <th
            style={{ padding: "10px 15px" }}
            className="bg-light"
            height="40px"
          >
            สถานะการจอง
          </th>
          <td style={{ padding: "10px 15px" }}> {booking.status}</td>
        </tr>
        <tr>
          <th
            style={{ padding: "10px 15px" }}
            className="bg-light"
            height="40px"
          >
            เวลาออกเดินทาง
          </th>
          <td style={{ padding: "10px 15px" }}>
            {FormatDateTime(new Date(booking.start_time))}
          </td>
        </tr>
        <tr>
          <th
            style={{ padding: "10px 15px" }}
            className="bg-light"
            height="40px"
          >
            เวลาสิ้นสุดการเดินทาง
          </th>
          <td style={{ padding: "10px 15px" }}>
            {FormatDateTime(new Date(booking.end_time))}
          </td>
        </tr>
      </table>
    </div>
  );
}

export default ReserveCarView;
