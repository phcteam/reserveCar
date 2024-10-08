"use strict";

const db = require("../models/index.model");
const Database = db.notifications;
const Op = db.Sequelize.Op;
const func = db.Sequelize;

module.exports = {
  findall: async function (req, res) {
    const booking_id = req.query.booking_id;
    const user_id = req.query.user_id;
    const admin_id = req.query.admin_id;
    const message = req.query.message;
    const sent_time = req.query.sent_time;
    const status = req.query.status;

    const limit = req.query.limit;
    const page = req.query.page;

    var conditions = {};
    if (booking_id) conditions.booking_id = { [Op.like]: `%${booking_id}%` };
    if (user_id) conditions.user_id = { [Op.like]: `%${user_id}%` };
    if (admin_id) conditions.admin_id = { [Op.like]: `%${admin_id}%` };
    if (message) conditions.message = { [Op.like]: `%${message}%` };
    if (sent_time) conditions.sent_time = { [Op.like]: `%${sent_time}%` };
    if (status) conditions.status = { [Op.like]: `%${status}%` };

    var lim = limit ? limit : 10;
    var offs = page ? (page - 1) * lim : 0;
    const order = req.query.order ? req.query.order.toUpperCase() : "DESC"; 

    await Database.findAll({
      where: conditions,
      limit: parseInt(lim, 10),
      offset: parseInt(offs, 0),
      order: [["id", order]],

    })
      .then((data) => {
        res.status(200);
        res.send(data);
      })
      .catch((err) => {
        res.status(500);
        res.send({
          message:
            err.message || "Some error occurred while retrieving notifications.",
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
            err.message || "Some error occurred while retrieving the notifications.",
        });
      });
  },

  create: async function (req, res) {
    var tmpData = {
      booking_id: req.body.booking_id,
      user_id: req.body.user_id,
      admin_id: req.body.admin_id,
      message: req.body.message,
      sent_time: req.body.sent_time,
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
            err.message || "Some error occurred while creating the notifications.",
        });
      });
  },
  
  update: async function (req, res) {
    console.log("Todo " + req.params.id + " updated");
    const id = req.params.id;
    var tmpData = {
      booking_id: req.body.booking_id,
      user_id: req.body.user_id,
      admin_id: req.body.admin_id,
      message: req.body.message,
      sent_time: req.body.sent_time,
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
            err.message || "Some error occurred while retrieving notifications.",
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
            err.message || "Some error occurred while deleting the notifications.",
        });
      });
  },

};
