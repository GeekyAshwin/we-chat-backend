const { Sequelize } = require("sequelize");

try {
    const sequelize = new Sequelize("chatapp", "root", "root", {
      host: "localhost",
      dialect: "mysql",
    });
    sequelize.authenticate();
    return sequelize;
    console.log("Database connected.");
  } catch (error) {
    console.error(error);
  }
  module.exports = sequelize;