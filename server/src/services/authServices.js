import bcrypt from "bcryptjs";
import UserDAO from "../dao/userDao.js";

export async function loginWithEmail(email, password) {
  const user = await UserDAO.findByEmail(email);
  if (!user) {
    throw new Error("User not found");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid password");
  }
  return user;
}

