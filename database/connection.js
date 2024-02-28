const { Sequelize } = require("sequelize");

try {
    const sequelize = new Sequelize("defaultdb", "avnadmin", "AVNS_9EcZcYrNiStvLfLIziA", {
      host: "mysql-38d2c1c-techmindashwin78-b51f.a.aivencloud.com",
      dialect: "mysql",
    });
    await sequelize.authenticate();
    return sequelize;
    console.log("Database connected.");
  } catch (error) {
    console.error(error);
  }
  module.exports = sequelize;