module.exports = function (sequelize, Sequelize) {
    const { DataTypes } = require("sequelize");
    const Bookings = sequelize.define(
        "bookings",
        {
            driver_id: {
                type: DataTypes.INTEGER,
            },
            vehicle_id: {
                type: DataTypes.INTEGER,
            },
            user_id: {
                type: DataTypes.INTEGER,
            },
            latitude: {
                type: DataTypes.STRING,
            },
            longitude: {
                type: DataTypes.STRING,
            },
            start_time: {
                type: DataTypes.DATE,
            },
            end_time: {
                type: DataTypes.DATE,
            },
            prossengers: {
                type: DataTypes.INTEGER,
            },
            status: {
                type: DataTypes.STRING,
            },
        },
        {
            createdAt: "created_at",
            updatedAt: "updated_at",
        }
    );
    Bookings.sync();

    return Bookings;
};
