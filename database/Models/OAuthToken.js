import { DataTypes, Model, Sequelize } from "sequelize";
import { User } from "./User.js";
import { mysql2 } from "mysql2";

export class OAuthToken extends Model {}

// Create sequelize connection

const sequelize = new Sequelize("sql6687437", "sql6687437", "pBEVatBtnq", {
  host: "sql6.freesqldatabase.com",
  dialect: "mysql",
  dialectModule: mysql2, // Needed to fix sequelize issues with WebPack

});
await sequelize.authenticate();

OAuthToken.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: User,
            key: 'id',
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    token: {
        type: DataTypes.TEXT,
    }
  },
  {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: "OAuthToken", // We need to choose the model name
  }
);

// the defined model is the class itself
console.log(sequelize.models); // true
await OAuthToken.sync();
console.log("The table for the OAuthToken model was just (re)created!");