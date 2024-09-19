"use strict";

const db = require("../models/index.model");
const Departments = db.depaertments;
const Op = db.Sequelize.Op;
const func = db.Sequelize;

// Branches.hasMany(db.machines, { foreignKey: 'branch_id' });

module.exports = {
  findall: async function (req, res) {
    const name = req.query.name;
    const desc = req.query.desc;
    const status = req.query.status;

    const limit = req.query.limit;
    const page = req.query.page;

    var conditions = {};
    if (name) conditions.name = { [Op.like]: `%${name}%` };
    if (desc) conditions.desc = { [Op.like]: `%${desc}%` };
    if (status) conditions.status = status;

    var lim = limit ? limit : 10;
    var offs = page ? (page - 1) * lim : 0;

    await Departments.findAll({
      where: conditions,
      limit: parseInt(lim, 10),
      offset: parseInt(offs, 0),
      order: [["id", "DESC"]],
      // include: [{
      //   model: db.machines,
      // }]
    })
      .then((data) => {
        res.status(200);
        res.send(data);
      })
      .catch((err) => {
        res.status(500);
        res.send({
          message:
            err.message || "Some error occurred while retrieving branches.",
        });
      });
  },


  findone: async function (req, res) {
    const id = req.params.id;

    await Departments.findByPk(id)
      .then((data) => {
        res.status(200);
        res.send(data);
      })
      .catch((err) => {
        res.status(500);
        res.send({
          message:
            err.message || "Some error occurred while retrieving the department.",
        });
      });
  },

  create: async function (req, res) {
    var tmpData = {
      name: req.body.name,
      desc: req.body.desc,
      status: req.body.status,
    };

    await Departments.create(tmpData)
      .then((data) => {
        res.status(200);
        res.send({ status: "created" });
      })
      .catch((err) => {
        res.status(500);
        res.send({
          message:
            err.message || "Some error occurred while creating the department.",
        });
      });
  },

  delete: async function (req, res) {
    console.log("Delete " + req.params.id);
    const id = req.params.id;

    await Branches.destroy({
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
            err.message || "Some error occurred while deleting the department.",
        });
      });
  },

  update: async function (req, res) {
    console.log("Todo " + req.params.id + " updated");
    const id = req.params.id;
    var tmpData = {
      name: req.body.name,
      desc: req.body.desc,
      status: req.body.status,
    };

    await Departments.update(tmpData, {
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
            err.message || "Some error occurred while retrieving department.",
        });
      });
  },

};
