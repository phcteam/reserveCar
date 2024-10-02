import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3007'); // เปลี่ยน URL ตามที่เซิร์ฟเวอร์ของคุณตั้งอยู่

const Notification = () => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        // เชื่อมต่อกับ event ใหม่
        socket.on('newBooking', (data) => {
            console.log('New booking received:', data);
            if (data) {
                setNotifications((prevNotifications) => [...prevNotifications, data]);
            } else {
                console.warn("Received null or undefined data:", data);
            }
        });

        // Cleanup socket connection on unmount
        return () => {
            socket.off('newBooking');
        };
    }, []);

    return (
        <div>
            <h2>Notifications</h2>
            {notifications.length > 0 ? (
                <ul>
                    {notifications.map((notification, index) => (
                        <li key={index}>
                            <strong>Booking ID:</strong> {notification.id} <br />
                            <strong>Customer Name:</strong> {notification.customerName} <br />
                            <strong>Booking Time:</strong> {notification.bookingTime} <br />
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No notifications available</p>
            )}
        </div>
    );
};

export default Notification;
