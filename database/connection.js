const { Sequelize } = require("sequelize");
import { mysql2 } from "mysql2";

try {
    const sequelize = new Sequelize("sql6687437", "sql6687437", "pBEVatBtnq", {
      host: "sql6.freesqldatabase.com",
      dialect: "mysql",
      dialectModule: mysql2, // Needed to fix sequelize issues with WebPack

    });
    await sequelize.authenticate();
    return sequelize;
    console.log("Database connected.");
  } catch (error) {
    console.error(error);
  }
  module.exports = sequelize;