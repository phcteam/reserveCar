"use strict";

const db = require("../models/index.model");
const Database = db.vehicles;
const Op = db.Sequelize.Op;
const func = db.Sequelize;

module.exports = {
  findall: async function (req, res) {
    const vehicleName = req.query.vehicleName;
    const plateNumber = req.query.plateNumber;
    const capacity = req.query.capacity;
    const status = req.query.status;

    const limit = req.query.limit;
    const page = req.query.page;

    var conditions = {};
    if (vehicleName) conditions.vehicleName = { [Op.like]: `%${vehicleName}%` };
    if (plateNumber) conditions.plateNumber = { [Op.like]: `%${plateNumber}%` };
    if (capacity) conditions.capacity = { [Op.like]: `%${capacity}%` };
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
            err.message || "Some error occurred while retrieving vehicles.",
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
            err.message || "Some error occurred while retrieving the vehicles.",
        });
      });
  },

  create: async function (req, res) {
    var tmpData = {
      vehicleName: req.body.vehicleName,
      plateNumber: req.body.plateNumber,
      capacity: req.body.capacity,
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
            err.message || "Some error occurred while creating the vehicles.",
        });
      });
  },

  update: async function (req, res) {
    console.log("Todo " + req.params.id + " updated");
    const id = req.params.id;
    var tmpData = {
      vehicleName: req.body.vehicleName,
      plateNumber: req.body.plateNumber,
      capacity: req.body.capacity,
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
            err.message || "Some error occurred while retrieving vehicles.",
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
            err.message || "Some error occurred while deleting the vehicles.",
        });
      });
  },
};
