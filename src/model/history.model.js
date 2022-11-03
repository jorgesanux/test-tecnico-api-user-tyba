import { DataTypes, Model, Sequelize } from "sequelize";

import sequelize from "../db/database.js";

class History extends Model { }

History.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.literal("uuid_generate_v4()"),
        primaryKey: true
    },
    endpoint: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    method: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    hostname: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    ip: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(80),
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    sequelize,
    timestamps: false,
    tableName: "history",
    modelName: "history"
});

export default History;