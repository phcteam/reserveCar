module.exports = function (sequelize, Sequelize) {
    const { DataTypes } = require("sequelize");
    const Drivers = sequelize.define(
        "drivers",
        {
            name: {
                type: DataTypes.STRING,
            },
            licenseNumber: {
                type: DataTypes.STRING,
            },
            desc: {
                type: DataTypes.STRING,
            },
            rating: {
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
    Drivers.sync();

    return Drivers;
};
