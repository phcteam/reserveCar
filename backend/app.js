require("dotenv").config();
require("express-group-routes");
const express = require('express');
const cors = require('cors');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const server = http.createServer(app);


app.use(cors());
app.use(express.json());

const apiName = process.env.API_NAME || "reserveCar";
const version = "2.0.0";
const authenticateToken = require('./src/middleware/authenticateToken.middleware');

app.group(`/api/${apiName}/`, (router) => {
    router.get("/", (req, res) => {
        res.json({ message: `RESTful API version ${version} For ${apiName}` });
    });

    router.use("/auth", require("./src/routes/auth/auth.route"));

    // Checking Token 
    router.get("/verify-token", authenticateToken, (req, res) => {
        res.json({ message: "Token is valid", user: req.user });
    });

    router.use("/", authenticateToken, require("./src/routes/bookings.route"));
    router.use("/", authenticateToken, require("./src/routes/departments.route"));
    router.use("/", authenticateToken, require("./src/routes/drivers.route"));
    router.use("/", authenticateToken, require("./src/routes/feedbacks.route"));
    router.use("/", authenticateToken, require("./src/routes/notifications.route"));
    router.use("/", authenticateToken, require("./src/routes/vehicles.route"));
    router.use("/", authenticateToken, require("./src/routes/users.route"));

});

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true,
    },
});

io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('sendMessage', (message) => {
        console.log('Message received:', message); // แสดงข้อความใน console ของเซิร์ฟเวอร์

        // ส่งข้อความกลับไปยัง client หรือกระจายไปยัง client อื่น ๆ ตามต้องการ
        socket.emit('message', `Server received: ${message}`);
    });
});


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


