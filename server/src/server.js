import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import db from "./config/db.js";
const { sequelize } = db;
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("MySQL Connected...");
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Database connection failed:", err.message);
    process.exit(1);
  }
}
app.get('/', (req, res) => {
  res.send('API is running');
});
startServer();
