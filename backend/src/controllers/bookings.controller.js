"use strict";

const db = require("../models/index.model");
const Database = db.bookings;
const Notification = db.notifications;

const Op = db.Sequelize.Op;
const func = db.Sequelize;

const notifyNewBooking = (io, data) => {
  if (io) {
    io.emit('newData', data);
  }
};

Database.belongsTo(db.drivers, { foreignKey: 'driver_id' });
Database.belongsTo(db.users, { foreignKey: 'user_id' });
Database.belongsTo(db.vehicles, { foreignKey: 'vehicle_id' });

module.exports = {
  findall: async function (req, res) {
    const driver_id = req.query.driver_id;
    const vehicle_id = req.query.vehicle_id;
    const user_id = req.query.user_id;
    const latitude = req.query.latitude;
    const longitude = req.query.longitude;
    const location = req.query.location;
    const start_time = req.query.start_time;
    const end_time = req.query.end_time;
    const prossengers = req.query.prossengers;
    const status = req.query.status;

    const limit = req.query.limit;
    const page = req.query.page;

    var conditions = {};

    if (driver_id) conditions.driver_id = { [Op.like]: `%${driver_id}%` };
    if (vehicle_id) conditions.vehicle_id = { [Op.like]: `%${vehicle_id}%` };
    if (user_id) conditions.user_id = { [Op.like]: `%${user_id}%` };
    if (latitude) conditions.latitude = { [Op.like]: `%${latitude}%` };
    if (longitude) conditions.longitude = { [Op.like]: `%${longitude}%` };
    if (location) conditions.location = { [Op.like]: `%${location}%` };

    if (start_time) {
      conditions.start_time = { [Op.gte]: new Date(start_time) };
    }

    if (end_time) conditions.end_time = { [Op.like]: `%${end_time}%` };
    if (prossengers) conditions.prossengers = { [Op.like]: `%${prossengers}%` };
    if (status) conditions.status = { [Op.like]: `%${status}%` };

    var lim = limit ? limit : 10;
    var offs = page ? (page - 1) * lim : 0;
    
    const order = req.query.order ? req.query.order.toUpperCase() : "DESC"; 

    await Database.findAll({
      where: conditions,
      limit: parseInt(lim, 10),
      offset: parseInt(offs, 0),
      order: [["id", order]],
      include: [
        {
          model: db.drivers,
        },
        {
          model: db.users
        },
        {
          model: db.vehicles
        }
      ],

    })
      .then((data) => {
        res.status(200);
        res.send(data);
      })
      .catch((err) => {
        res.status(500);
        res.send({
          message:
            err.message || "Some error occurred while retrieving bookings.",
        });
      });
  },


  findone: async function (req, res) {
    const id = req.params.id;
    await Database.findByPk(id, {
      include: [
        {
          model: db.drivers,
        },
        {
          model: db.users
        },
        {
          model: db.vehicles
        }
      ],
    })

      .then((data) => {
        res.status(200);
        res.send(data);
      })
      .catch((err) => {
        res.status(500);
        res.send({
          message:
            err.message || "Some error occurred while retrieving the bookings.",
        });
      });
  },

  create: async function (req, res, io) {
    var tmpData = {
      driver_id: req.body.driver_id,
      vehicle_id: req.body.vehicle_id,
      user_id: req.body.user_id,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      location: req.body.location,
      start_time: req.body.start_time,
      end_time: req.body.end_time,
      prossengers: req.body.prossengers,
      status: req.body.status,
    };

    // const notificationData = {
    //   user_id: req.body.user_id,  // ใครได้รับการแจ้งเตือน
    //   message: `Booking created by user ${req.body.user_id}`,
    //   booking_id: bookingData.id, // อ้างอิง ID การจอง
    //   status: 'unread',  // สถานะการแจ้งเตือน (ยังไม่อ่าน)
    // };

    // await Notification.create(notificationData);

    try {
      const data = await Database.create(tmpData); // สร้างข้อมูลการจอง
      notifyNewBooking(io, data); // ส่งข้อมูล booking ใหม่ไปยัง Socket.IO
      res.send({ status: "created" });
      return data; // คืนค่าข้อมูลการจอง
    } catch (err) {
      throw new Error(err.message || "Some error occurred while creating the bookings."); // ส่งข้อผิดพลาดกลับ
    }
  },

  update: async function (req, res, io) { // เพิ่ม io เป็นพารามิเตอร์
    console.log("Todo " + req.params.id + " updated");
    const id = req.params.id;
    var tmpData = {
      driver_id: req.body.driver_id,
      vehicle_id: req.body.vehicle_id,
      user_id: req.body.user_id,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      location: req.body.location,
      start_time: req.body.start_time,
      end_time: req.body.end_time,
      prossengers: req.body.prossengers,
      status: req.body.status,
    };

    await Database.update(tmpData, {
      where: { id: id },
    })
      .then(() => {
        notifyNewBooking(io, tmpData); // ส่งข้อมูลใหม่ที่ถูกอัปเดต
        res.status(200).send({ status: "updated" });
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "Some error occurred while updating bookings.",
        });
      });
  },

  delete: async function (req, res, io) { // เพิ่ม io เป็นพารามิเตอร์
    console.log("Delete " + req.params.id);
    const id = req.params.id;

    await Database.destroy({
      where: { id: id },
    })
      .then(() => {
        notifyNewBooking(io, { id, status: "deleted" }); // ส่ง ID ของ booking ที่ถูกลบ
        res.status(200).send({ status: "deleted" });
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "Some error occurred while deleting the bookings.",
        });
      });
  },

};

