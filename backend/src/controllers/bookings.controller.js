"use strict";

const db = require("../models/index.model");
const Database = db.bookings;
const Op = db.Sequelize.Op;
const func = db.Sequelize;

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
    if (start_time) conditions.start_time = { [Op.like]: `%${start_time}%` };
    if (end_time) conditions.end_time = { [Op.like]: `%${end_time}%` };
    if (prossengers) conditions.prossengers = { [Op.like]: `%${prossengers}%` };
    if (status) conditions.status = { [Op.like]: `%${status}%` };

    var lim = limit ? limit : 10;
    var offs = page ? (page - 1) * lim : 0;

    await Database.findAll({
      where: conditions,
      limit: parseInt(lim, 10),
      offset: parseInt(offs, 0),
      order: [["id", "ASC"]],

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

    await Database.findByPk(id)
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

  create: async function (req, res) {
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

    await Database.create(tmpData)
      .then((data) => {
        res.status(200);
        res.send({ status: "created" });
      })
      .catch((err) => {
        res.status(500);
        res.send({
          message:
            err.message || "Some error occurred while creating the bookings.",
        });
      });
  },

  update: async function (req, res) {
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
      .then((data) => {
        res.status(200);
        res.send({ status: "updated" });
      })
      .catch((err) => {
        res.status(500);
        res.send({
          message:
            err.message || "Some error occurred while retrieving bookings.",
        });
      });
  },

  delete: async function (req, res) {
    console.log("Delete " + req.params.id);
    const id = req.params.id;

    await Database.destroy({
      where: { id: id },
    })
      .then(() => {
        res.status(200);
        res.send({ status: "deleted" });
      })
      .catch((err) => {
        res.status(500);
        res.send({
          message:
            err.message || "Some error occurred while deleting the bookings.",
        });
      });
  },
};
