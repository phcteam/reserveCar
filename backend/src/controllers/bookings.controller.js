// "use strict";

// const db = require("../models/index.model");
// const Database = db.bookings;
// const Op = db.Sequelize.Op;
// const func = db.Sequelize;

// Database.belongsTo(db.drivers, { foreignKey: 'driver_id' });
// Database.belongsTo(db.users, { foreignKey: 'user_id' });
// Database.belongsTo(db.vehicles, { foreignKey: 'vehicle_id' });

// module.exports = {
//   findall: async function (req, res) {
//     const driver_id = req.query.driver_id;
//     const vehicle_id = req.query.vehicle_id;
//     const user_id = req.query.user_id;
//     const latitude = req.query.latitude;
//     const longitude = req.query.longitude;
//     const location = req.query.location;
//     const start_time = req.query.start_time;
//     const end_time = req.query.end_time;
//     const prossengers = req.query.prossengers;
//     const status = req.query.status;

//     const limit = req.query.limit;
//     const page = req.query.page;

//     var conditions = {};

//     if (driver_id) conditions.driver_id = { [Op.like]: `%${driver_id}%` };
//     if (vehicle_id) conditions.vehicle_id = { [Op.like]: `%${vehicle_id}%` };
//     if (user_id) conditions.user_id = { [Op.like]: `%${user_id}%` };
//     if (latitude) conditions.latitude = { [Op.like]: `%${latitude}%` };
//     if (longitude) conditions.longitude = { [Op.like]: `%${longitude}%` };
//     if (location) conditions.location = { [Op.like]: `%${location}%` };

//     if (start_time) {
//       conditions.start_time = { [Op.gte]: new Date(start_time) };
//     }

//     if (end_time) conditions.end_time = { [Op.like]: `%${end_time}%` };
//     if (prossengers) conditions.prossengers = { [Op.like]: `%${prossengers}%` };
//     if (status) conditions.status = { [Op.like]: `%${status}%` };

//     var lim = limit ? limit : 10;
//     var offs = page ? (page - 1) * lim : 0;

//     await Database.findAll({
//       where: conditions,
//       limit: parseInt(lim, 10),
//       offset: parseInt(offs, 0),
//       order: [["id", "ASC"]],
//       include: [
//         {
//           model: db.drivers,
//         },
//         {
//           model: db.users
//         },
//         {
//           model: db.vehicles
//         }
//       ],

//     })
//       .then((data) => {
//         res.status(200);
//         res.send(data);
//       })
//       .catch((err) => {
//         res.status(500);
//         res.send({
//           message:
//             err.message || "Some error occurred while retrieving bookings.",
//         });
//       });
//   },


//   findone: async function (req, res) {
//     const id = req.params.id;
//     await Database.findByPk(id, {
//       include: [
//         {
//           model: db.drivers,
//         },
//         {
//           model: db.users
//         },
//         {
//           model: db.vehicles
//         }
//       ],
//     })

//       .then((data) => {
//         res.status(200);
//         res.send(data);
//       })
//       .catch((err) => {
//         res.status(500);
//         res.send({
//           message:
//             err.message || "Some error occurred while retrieving the bookings.",
//         });
//       });
//   },

//   create: async function (req, res) {
//     var tmpData = {
//       driver_id: req.body.driver_id,
//       vehicle_id: req.body.vehicle_id,
//       user_id: req.body.user_id,
//       latitude: req.body.latitude,
//       longitude: req.body.longitude,
//       location: req.body.location,
//       start_time: req.body.start_time,
//       end_time: req.body.end_time,
//       prossengers: req.body.prossengers,
//       status: req.body.status,
//     };

//     await Database.create(tmpData)
//       .then((data) => {
//         res.status(200);
//         res.send({ status: "created" });
//       })
//       .catch((err) => {
//         res.status(500);
//         res.send({
//           message:
//             err.message || "Some error occurred while creating the bookings.",
//         });
//       });
//   },

//   update: async function (req, res) {
//     console.log("Todo " + req.params.id + " updated");
//     const id = req.params.id;
//     var tmpData = {
//       driver_id: req.body.driver_id,
//       vehicle_id: req.body.vehicle_id,
//       user_id: req.body.user_id,
//       latitude: req.body.latitude,
//       longitude: req.body.longitude,
//       location: req.body.location,
//       start_time: req.body.start_time,
//       end_time: req.body.end_time,
//       prossengers: req.body.prossengers,
//       status: req.body.status,
//     };

//     await Database.update(tmpData, {
//       where: { id: id },
//     })
//       .then((data) => {
//         res.status(200);
//         res.send({ status: "updated" });
//       })
//       .catch((err) => {
//         res.status(500);
//         res.send({
//           message:
//             err.message || "Some error occurred while retrieving bookings.",
//         });
//       });
//   },

//   delete: async function (req, res) {
//     console.log("Delete " + req.params.id);
//     const id = req.params.id;

//     await Database.destroy({
//       where: { id: id },
//     })
//       .then(() => {
//         res.status(200);
//         res.send({ status: "deleted" });
//       })
//       .catch((err) => {
//         res.status(500);
//         res.send({
//           message:
//             err.message || "Some error occurred while deleting the bookings.",
//         });
//       });
//   },
// };


"use strict";

const db = require("../models/index.model");
const Database = db.bookings;
const Op = db.Sequelize.Op;
const { Server } = require('socket.io');

let io; // ตัวแปรสำหรับ Socket.IO

// สร้างความสัมพันธ์กับ models อื่น ๆ
Database.belongsTo(db.drivers, { foreignKey: 'driver_id' });
Database.belongsTo(db.users, { foreignKey: 'user_id' });
Database.belongsTo(db.vehicles, { foreignKey: 'vehicle_id' });

// ฟังก์ชันสำหรับตั้งค่า Socket.IO
module.exports.setSocketIO = (server) => {
  io = new Server(server, {
    cors: {
      origin: ["http://localhost:3000", "http://localhost:5173"],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
  });
};

module.exports = {
  findall: async function (req, res) {
    const { driver_id, vehicle_id, user_id, latitude, longitude, location, start_time, end_time, prossengers, status, limit, page } = req.query;

    const conditions = {};

    if (driver_id) conditions.driver_id = { [Op.like]: `%${driver_id}%` };
    if (vehicle_id) conditions.vehicle_id = { [Op.like]: `%${vehicle_id}%` };
    if (user_id) conditions.user_id = { [Op.like]: `%${user_id}%` };
    if (latitude) conditions.latitude = { [Op.like]: `%${latitude}%` };
    if (longitude) conditions.longitude = { [Op.like]: `%${longitude}%` };
    if (location) conditions.location = { [Op.like]: `%${location}%` };
    if (start_time) conditions.start_time = { [Op.gte]: new Date(start_time) };
    if (end_time) conditions.end_time = { [Op.like]: `%${end_time}%` };
    if (prossengers) conditions.prossengers = { [Op.like]: `%${prossengers}%` };
    if (status) conditions.status = { [Op.like]: `%${status}%` };

    const lim = limit ? limit : 10;
    const offs = page ? (page - 1) * lim : 0;

    try {
      const data = await Database.findAll({
        where: conditions,
        limit: parseInt(lim, 10),
        offset: parseInt(offs, 0),
        order: [["id", "ASC"]],
        include: [
          { model: db.drivers },
          { model: db.users },
          { model: db.vehicles }
        ],
      });
      res.status(200).send(data);
    } catch (err) {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving bookings.",
      });
    }
  },

  findone: async function (req, res) {
    const id = req.params.id;
    try {
      const data = await Database.findByPk(id, {
        include: [
          { model: db.drivers },
          { model: db.users },
          { model: db.vehicles }
        ],
      });
      res.status(200).send(data);
    } catch (err) {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving the bookings.",
      });
    }
  },

  create: async function (req, res) {
    const tmpData = {
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

    try {
      const data = await Database.create(tmpData);
      io.emit("newData", data); // Emit ข้อมูลที่สร้างไปยัง client
      res.status(200).send({ status: "created" });
    } catch (err) {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the bookings.",
      });
    }
  },

  update: async function (req, res) {
    const id = req.params.id;
    const tmpData = {
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

    try {
      await Database.update(tmpData, { where: { id: id } });
      io.emit("newData", { id, ...tmpData }); // Emit ข้อมูลที่อัปเดตไปยัง client
      res.status(200).send({ status: "updated" });
    } catch (err) {
      res.status(500).send({
        message: err.message || "Some error occurred while updating bookings.",
      });
    }
  },

  delete: async function (req, res) {
    const id = req.params.id;

    try {
      await Database.destroy({ where: { id: id } });
      res.status(200).send({ status: "deleted" });
    } catch (err) {
      res.status(500).send({
        message: err.message || "Some error occurred while deleting the bookings.",
      });
    }
  },
};
