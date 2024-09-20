module.exports = function (sequelize, Sequelize) {
    const { DataTypes } = require("sequelize");
    const Notifications = sequelize.define(
        "notifications",
        {
            booking_id: {
                type: DataTypes.INTEGER,
            },
            user_id: {
                type: DataTypes.INTEGER,
            },
            admin_id: {
                type: DataTypes.INTEGER,
            },
            message: {
                type: DataTypes.STRING,
            },
            sent_time: {
                type: DataTypes.TIME,
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
    Notifications.sync();

    return Notifications;
};
