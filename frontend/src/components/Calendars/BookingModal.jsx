import React from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "300px",
};

function BookingModal({ booking, onClose }) {
  const BaseUrl = import.meta.env.VITE_API_URL;
  const GoogleMapToken = import.meta.env.VITE_GOOGLE_MAP_TOKEN;

  console.log(booking.longitude);

  if (!booking) return null;

  const center = {
    lat: parseFloat(booking.latitude), // แปลงค่าเป็น number
    lng: parseFloat(booking.longitude), // แปลงค่าเป็น number
  };

  console.log(center);

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
              aria-label="Close btn btn-close"
            ></button>
          </div>
          <div className="modal-body">
            <LoadScript googleMapsApiKey={GoogleMapToken}>
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={10}
              >
                <Marker position={center} />
              </GoogleMap>
            </LoadScript>
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
}

export default BookingModal;
