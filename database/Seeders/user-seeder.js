import { DataTypes, Model, Sequelize } from "sequelize";
import { User } from "../Models/User.js";
import mysql2 from "mysql2";

// Create sequelize connection
const {mysql2} = mysql2;

const sequelize = new Sequelize("sql6687437", "sql6687437", "pBEVatBtnq", {
  host: "sql6.freesqldatabase.com",
  dialect: "mysql",
  dialectModule: mysql2, // Needed to fix sequelize issues with WebPack

});
await sequelize.authenticate();

for (let index = 1; index < 10; index++) {
    let user = User.build({
        name: 'Test User' + index,
        email: 'testuser' + index + '@test.com',
        picture: '',
        createdAt: new Date(),
        updatedAt: new Date(),
    });
    user.save();    
}