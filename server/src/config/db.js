import mysql from "mysql2/promise";
// import mongodb from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,       // localhost
  port: process.env.DB_PORT,       // 3306
  user: process.env.DB_USER,       // root
  password: process.env.DB_PASSWORD, // mật khẩu MySQL
  database: process.env.DB_NAME,   // WeddingRestaurantManagement
});


// Test kết nối
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log("MySQL connected successfully!");
    connection.release();
  } catch (err) {
    console.error("MySQL connection failed:", err.message);
  }
})();

export default pool;

// // connect to MongoDB
// const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/WeddingRestaurantManagement";
// mongoose.connect(mongoURI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });