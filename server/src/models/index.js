// models/index.js
import sequelize from "../config/db.js";
import User from "./User.js";
import Customer from "./Customer.js";
import Restaurant from "./Restaurant.js";
import RestaurantImage from "./RestaurantImage.js";
import Hall from "./Hall.js";
import HallImage from "./HallImage.js";

Restaurant.hasMany(Hall, { foreignKey: "restaurantID" });
Hall.belongsTo(Restaurant, { foreignKey: "restaurantID" });

Restaurant.hasMany(RestaurantImage, { foreignKey: "restaurantID" });
RestaurantImage.belongsTo(Restaurant, { foreignKey: "restaurantID" });

// Xuất toàn bộ
export {
  sequelize,
  User,
  Customer,
  Restaurant,
  RestaurantImage,
  Hall,
  HallImage,
};
