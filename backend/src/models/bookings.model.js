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
            start_location: {
                type: DataTypes.STRING,
            },
            end_location: {
                type: DataTypes.STRING,
            },
            start_time: {
                type: DataTypes.TIME,
            },
            end_time: {
                type: DataTypes.TIME,
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
