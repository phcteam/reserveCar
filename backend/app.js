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


app.group(`/${apiName}/`, (router) => {
    router.get("/", (req, res) => {
        res.json({ message: `RESTful API version ${version} For Test` });
    });

    // Route สำหรับการ login และ register
    router.use("/auth", require("./src/routes/auth/auth.route"));

    router.use("/", authenticateToken, require("./src/routes/department.route"));

});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
