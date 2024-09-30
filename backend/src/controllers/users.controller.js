"use strict";

const db = require("../models/index.model");
const Database = db.users;
const Op = db.Sequelize.Op;
const bcrypt = require('bcryptjs');


Database.belongsTo(db.depaertments, { foreignKey: 'department_id' });

module.exports = {
    findall: async function (req, res) {
        const { name, username, email, role, phone, department_id, status, limit, page } = req.query;

        const conditions = {};
        if (name) conditions.name = { [Op.like]: `%${name}%` };
        if (username) conditions.username = { [Op.like]: `%${username}%` };
        if (email) conditions.email = { [Op.like]: `%${email}%` };
        if (role) conditions.role = { [Op.like]: `%${role}%` };
        if (phone) conditions.phone = { [Op.like]: `%${phone}%` };
        if (department_id) conditions.department_id = { [Op.like]: department_id };

        if (status) conditions.status = { [Op.like]: `%${status}%` };

        const lim = limit ? parseInt(limit, 10) : 10;
        const offs = page ? (page - 1) * lim : 0;

        try {
            const data = await Database.findAll({
                where: conditions,
                limit: lim,
                offset: offs,
                order: [["id", "ASC"]],
                include: [
                    {
                        model: db.depaertments,
                    },
                ]

            });
            res.status(200).send(data);
        } catch (err) {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving Users.",
            });
        }
    },

    findone: async function (req, res,) {
        const id = req.params.id;
        try {
            const data = await Database.findByPk(id, {
                include: [
                    {
                        model: db.depaertments,
                    },

                ],
            });
            res.status(200).send(data);
        } catch (err) {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving the User.",
            });
        }
    },

    create: async function (req, res) {
        try {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            const tmpData = {
                name: req.body.name,
                username: req.body.username,
                email: req.body.email,
                password: hashedPassword,
                role: req.body.role,
                phone: req.body.phone,
                status: req.body.status,
            };

            await Database.create(tmpData);
            res.status(200).send({ status: "created" });
        } catch (err) {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the User.",
            });
        }
    },

    update: async function (req, res) {
        const id = req.params.id;

        try {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            const tmpData = {
                name: req.body.name,
                username: req.body.username,
                email: req.body.email,
                password: hashedPassword,
                role: req.body.role,
                phone: req.body.phone,
                status: req.body.status,
            };

            await Database.update(tmpData, {
                where: { id: id },
            });

            res.status(200).send({ status: "updated" });
        } catch (err) {
            res.status(500).send({
                message: err.message || "Some error occurred while updating the User.",
            });
        }
    },

    delete: async function (req, res) {
        const id = req.params.id;

        try {
            await Database.destroy({
                where: { id: id },
            });
            res.status(200).send({ status: "deleted" });
        } catch (err) {
            res.status(500).send({
                message: err.message || "Some error occurred while deleting the User.",
            });
        }
    },


    verifyPassword: async function (req, res) {
        try {
            const id = req.params.id;
            const { currentPassword } = req.body; // รับรหัสผ่านปัจจุบันจาก request body

            // ดึงข้อมูลผู้ใช้จากฐานข้อมูลโดยใช้ ID
            const user = await Database.findByPk(id);
            if (!user) {
                return res.status(404).json({ message: "ไม่พบผู้ใช้" });
            }

            // ตรวจสอบรหัสผ่านปัจจุบันกับรหัสผ่านที่เข้ารหัสในฐานข้อมูล
            const passwordMatch = await bcrypt.compare(currentPassword, user.password);
            if (!passwordMatch) {
                return res.status(401).json({ message: "รหัสผ่านปัจจุบันไม่ถูกต้อง" });
            }

            // หากรหัสผ่านถูกต้อง
            return res.status(200).json({ message: "รหัสผ่านถูกต้อง" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "เกิดข้อผิดพลาดในการตรวจสอบรหัสผ่าน" });
        }
    }
};
