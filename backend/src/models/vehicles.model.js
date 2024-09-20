module.exports = function (sequelize, Sequelize) {
    const { DataTypes } = require("sequelize");
    const Vehicles = sequelize.define(
        "vehicles",
        {
            model: {
                type: DataTypes.STRING,
            },
            licenseNumber: {
                type: DataTypes.STRING,
            },
            capacity: {
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
    Vehicles.sync();

    return Vehicles;
};
