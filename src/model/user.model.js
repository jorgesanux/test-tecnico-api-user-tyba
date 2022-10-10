import { DataTypes, Model, Sequelize } from "sequelize";
import bcrypt from "bcrypt";

import sequelize from "../db/database.js";

class User extends Model {}

User.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.literal("uuid_generate_v4()"),
        primaryKey: true
    },
    first_name: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    last_name: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(80),
        unique: true,
        allowNull: false
    },
    password: {
        type: DataTypes.TEXT,
        allowNull: false
    }
},{
    sequelize,
    timestamps: false,
    tableName: "users",
    modelName: "users",
    hooks: {
        beforeCreate: async function(user){
            if(user.password){
                const salt = await bcrypt.genSalt(10, "a");
                user.password = await bcrypt.hash(user.password, salt);
            }
        }
    }
});

User.prototype.validPassword = async function(password) {
    return bcrypt.compare(password, this.password);
}

export default User;