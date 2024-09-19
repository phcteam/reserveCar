const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// เรียกใช้ model users
const db = require('../../models/index.model');
const Users = db.users;

// Register user
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    const userExist = await Users.findOne({ where: { username } });
    if (userExist) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await Users.create({ username, password: hashedPassword });
    res.json({ message: 'User registered successfully' });
});

// Login user
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // ตรวจสอบว่าผู้ใช้มีอยู่ในฐานข้อมูลหรือไม่
    const user = await Users.findOne({ where: { username } });
    if (!user) return res.status(400).json({ message: 'User not found' });

    // ตรวจสอบรหัสผ่าน
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ message: 'Invalid password' });

    // สร้าง JWT token
    const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
});

module.exports = router;
