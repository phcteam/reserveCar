require("dotenv").config();
require("express-group-routes");
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const apiName = process.env.API_NAME || "reserveCar";
const version = "1.0.0";
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
