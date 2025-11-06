import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { getCollection } from "../dao/mongoDAO.js";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

export async function authenticateJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        // Kiểm tra token trong blacklist
        const blacklist = getCollection("blacklist");
        const blacklisted = await blacklist.findOne({ token });
        if (blacklisted) {
            return res.status(401).json({ error: "Token is blacklisted" });
        }
        try {
            const decoded = await jwt.verify(token, JWT_SECRET);
            req.user = decoded;
            next();
        } catch (err) {
            return res.status(401).json({ error: "Invalid token" });
        }
    } else {
        res.status(401).json({ error: "No token provided" });
    }
}