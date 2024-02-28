import { DataTypes, Model, Sequelize } from "sequelize";
import { User } from "../Models/User.js";

// Create sequelize connection

const sequelize = new Sequelize("chatapp", "root", "root", {
  host: "localhost",
  dialect: "mysql",
});
sequelize.authenticate();

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