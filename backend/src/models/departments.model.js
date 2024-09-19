module.exports = function (sequelize, Sequelize) {
    const { DataTypes } = require("sequelize");
    const Departments = sequelize.define(
        "departments",
        {
            name: {
                type: DataTypes.STRING,
            },
            desc: {
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
    Departments.sync();

    return Departments;
};
