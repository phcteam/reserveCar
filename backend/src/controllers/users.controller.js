"use strict";

const db = require("../models/index.model");
const Database = db.users;
const Op = db.Sequelize.Op;
const func = db.Sequelize;
const bcrypt = require('bcryptjs');

module.exports = {
    findall: async function (req, res) {
        const name = req.query.name;
        const username = req.query.username;
        const email = req.query.email;
        const role = req.query.role;
        const phone = req.query.phone;
        const status = req.query.status;

        const limit = req.query.limit;
        const page = req.query.page;

        var conditions = {};
        if (name) conditions.name = { [Op.like]: `%${name}%` };
        if (username) conditions.username = { [Op.like]: `%${username}%` };
        if (email) conditions.email = { [Op.like]: `%${email}%` };
        if (role) conditions.role = { [Op.like]: `%${role}%` };
        if (phone) conditions.phone = { [Op.like]: `%${phone}%` };
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
                        err.message || "Some error occurred while retrieving Users.",
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
                        err.message || "Some error occurred while retrieving the Users.",
                });
            });
    },

    create: async function (req, res) {
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        var tmpData = {
            name: req.body.booking_id,
            username: req.body.user_id,
            email: req.body.admin_id,
            password: hashedPassword,
            role: req.body.message,
            phone: req.body.sent_time,
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
                        err.message || "Some error occurred while creating the Users.",
                });
            });
    },

    update: async function (req, res) {
        console.log("Todo " + req.params.id + " updated");
        const id = req.params.id;
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        var tmpData = {
            name: req.body.booking_id,
            username: req.body.user_id,
            email: req.body.admin_id,
            password: hashedPassword,
            role: req.body.message,
            phone: req.body.sent_time,
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
                        err.message || "Some error occurred while retrieving Users.",
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
                        err.message || "Some error occurred while deleting the Users.",
                });
            });
    },

};
