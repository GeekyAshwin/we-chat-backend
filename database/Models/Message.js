import { DataTypes, Model, Sequelize } from "sequelize";
import { User } from "./User.js";

export class Message extends Model {}

// Create sequelize connection

const sequelize = new Sequelize("chatapp", "root", "root", {
  host: "localhost",
  dialect: "mysql",
});
sequelize.authenticate();

Message.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    sender_id: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id'
        }
    },
    receiver_id: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id'
        }
    },
    message: {
        type: DataTypes.TEXT
    }
  },
  {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: "Message", // We need to choose the model name
  }
);

// the defined model is the class itself
console.log(sequelize.models); // true
await Message.sync();
console.log("The table for the Message model was just (re)created!");