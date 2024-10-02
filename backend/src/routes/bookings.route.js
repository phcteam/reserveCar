"use strict";

const urlname = "bookings";
const Controller = require("../controllers/bookings.controller");
var router = require("express").Router();

let io;

function setSocketIO(socketIO) {
    io = socketIO; // เก็บ instance ของ Socket.IO
}

function notifyNewBooking(bookingData) {
    if (io) {
        io.emit('newBooking', bookingData); // ส่งการแจ้งเตือนแบบเรียลไทม์ไปยังทุกไคลเอนต์
    }
}

console.log(notifyNewBooking);


router.get(`/${urlname}/`, Controller.findall);
router.get(`/${urlname}/:id`, Controller.findone);

// ====================== CRUD ======================
router.post(`/${urlname}/`, async (req, res) => {
    try {
        const data = await Controller.create(req, res, io);
        notifyNewBooking(data);
    
    } catch (error) {
        console.error("Error creating booking:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.put(`/${urlname}/:id`, async (req, res) => {
    try {
        const data = await Controller.update(req, res);
        if (data) {
            notifyNewBooking(data);
            res.status(200).json(data);
        } else {
            res.status(404).json({ error: "Booking not found" });
        }
    } catch (error) {
        console.error("Error updating booking:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.delete(`/${urlname}/:id`, async (req, res) => {
    try {
        const data = await Controller.delete(req, res);
        if (data) {
            notifyNewBooking({ id: req.params.id, status: "deleted" });
            res.status(200).json(data);
        } else {
            res.status(404).json({ error: "Booking not found" });
        }
    } catch (error) {
        console.error("Error deleting booking:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = {
    router,
    setSocketIO,
};
