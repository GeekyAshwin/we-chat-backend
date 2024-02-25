import { DataTypes, Model, Sequelize } from "sequelize";

export class User extends Model {}

// Create sequelize connection

const sequelize = new Sequelize("chatapp", "root", "root", {
  host: "localhost",
  dialect: "mysql",
});
sequelize.authenticate();

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
    profile_image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    google_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: "User", // We need to choose the model name
  }
);

// the defined model is the class itself
console.log(sequelize.models); // true
await User.sync({ force: true });
console.log("The table for the User model was just (re)created!");