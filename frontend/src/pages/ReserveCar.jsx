import { useState, useRef } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  Autocomplete,
} from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: 18.675699,
  lng: 99.051561,
};

const userId = localStorage.getItem("id");

const BaseUrl = import.meta.env.VITE_API_URL;
const GoogleMapToken = import.meta.env.VITE_GOOGLE_MAP_TOKEN;

function ReserveCar() {
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [map, setMap] = useState(null);
  const autocompleteRef = useRef(null);
  const [driverId, setDriverId] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [status, setStatus] = useState("pending");

  const handleMapClick = (event) => {
    setSelectedPosition({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    });
  };

  const handlePlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();
    if (place && place.geometry) {
      const { lat, lng } = place.geometry.location;
      setSelectedPosition({
        lat: lat(),
        lng: lng(),
      });
      map.panTo({ lat: lat(), lng: lng() });
    } else {
      alert("โปรดเลือกสถานที่จากรายการ");
    }
  };

  const handleSave = async (event) => {
    event.preventDefault();
    if (selectedPosition) {
      const response = await fetch(`${BaseUrl}/booking`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          latitude: selectedPosition.lat,
          longitude: selectedPosition.lng,
          driver_id: driverId,
          vehicle_id: vehicleId,
          user_id: userId,
          start_time: startTime,
          end_time: endTime,
          prossengers: passengers,
          status: status,
        }),
      });

      const data = await response.json();
      console.log("Response:", data);
      alert("บันทึกสถานที่สำเร็จแล้ว!");
    } else {
      alert("โปรดเลือกสถานที่!");
    }
  };

  return (
    <div>
      <LoadScript googleMapsApiKey={GoogleMapToken} libraries={["places"]}>
        <Autocomplete
          onLoad={(auto) => (autocompleteRef.current = auto)}
          onPlaceChanged={handlePlaceChanged}
        >
          <input
            type="text"
            placeholder="ค้นหาสถานที่..."
            className="form-control"
            style={{
              width: "300px",
              height: "40px",
              marginBottom: "10px",
              padding: "10px",
            }}
          />
        </Autocomplete>

        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={10}
          onClick={handleMapClick}
          onLoad={(map) => setMap(map)}
        >
          {selectedPosition && <Marker position={selectedPosition} />}
        </GoogleMap>
      </LoadScript>
      <form onSubmit={handleSave}>
        <div className="row mb-2 mt-2">
          <div className="col">
            <label htmlFor="driver_id">คนขับรถ:</label>
            <select
              id="driver_id"
              value={driverId}
              onChange={(e) => setDriverId(e.target.value)}
              required
              className="form-select"
            >
              <option value="">เลือกคนขับ</option>
              {/* เพิ่มตัวเลือกคนขับที่นี่ */}
            </select>
          </div>
          <div className="col">
            <label htmlFor="vehicle_id">เลือกรถ:</label>
            <select
              id="vehicle_id"
              value={vehicleId}
              onChange={(e) => setVehicleId(e.target.value)}
              required
              className="form-select"
            >
              <option value="">เลือกรถ</option>
              {/* เพิ่มตัวเลือกรถที่นี่ */}
            </select>
          </div>
        </div>

        <div className="row mb-2">
          <div className="col">
            <label htmlFor="start_time">เริ่ม:</label>
            <input
              type="datetime-local"
              id="start_time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="form-select"
              required
            />
          </div>
          <div className="col">
            <label htmlFor="end_time">สิ้นสุด:</label>
            <input
              type="datetime-local"
              id="end_time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="form-select"
              required
            />
          </div>
        </div>

        <label htmlFor="passengers">ผู้โดยสาร:</label>
        <input
          type="number"
          id="passengers"
          value={passengers}
          min="1"
          onChange={(e) => setPassengers(e.target.value)}
          required
          className="form-control mb-2"
        />

        <label htmlFor="status">สถานะ:</label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          required
          className="form-select mb-2"
        >
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <button type="submit" className="btn btn-primary mt-2">
          บันทึกสถานที่
        </button>
      </form>
    </div>
  );
}

export default ReserveCar;
