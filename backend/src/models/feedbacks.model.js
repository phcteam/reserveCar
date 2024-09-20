module.exports = function (sequelize, Sequelize) {
    const { DataTypes, INTEGER } = require("sequelize");
    const Feedbacks = sequelize.define(
        "feed_backs",
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
            driver_id: {
                type: DataTypes.INTEGER,
            },
            rating: {
                type: DataTypes.STRING,
            },
            comment: {
                type: DataTypes.STRING,
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
    Feedbacks.sync();

    return Feedbacks;
};
