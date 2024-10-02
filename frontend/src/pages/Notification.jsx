import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const Notification = () => {
  const BaseWebSocket = import.meta.env.VITE_API_WEB_SOCKET;
  const token = localStorage.getItem("token");

  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [inputMessage, setInputMessage] = useState("");

  useEffect(() => {
    // สร้างการเชื่อมต่อกับ Socket.IO server
    const newSocket = io(`${BaseWebSocket}`);

    // รับข้อความจากเซิร์ฟเวอร์
    newSocket.on("message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // รับข้อมูลใหม่เมื่อมีการบันทึกในฐานข้อมูล
    newSocket.on("newData", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    setSocket(newSocket);

    // Cleanup เมื่อ component ถูก unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (socket && inputMessage) {
      socket.emit("sendMessage", inputMessage);
      setInputMessage("");
    }
  };

  return (
    <div>
      <h2>Live Notifications</h2>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>
      <input
        type="text"
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        placeholder="Type your message here"
      />
      <button onClick={sendMessage}>Send Message</button>
    </div>
  );
};

export default Notification;
