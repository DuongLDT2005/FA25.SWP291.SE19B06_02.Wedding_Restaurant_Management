import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { getCollection } from "../dao/mongoDAO.js";

//Nếu sài dotenv.config(); thì nó sẽ không truy cập vào được .env dẫn đếN không truy cập được jwt secret
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../../.env") });


const JWT_SECRET = process.env.JWT_SECRET;

console.log("JWT_Secret", JWT_SECRET);

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
      const decoded = jwt.verify(token, JWT_SECRET);
      // Chuẩn hoá: luôn đảm bảo có userId, fallback sang sub nếu token dùng claim này
      req.user = { ...decoded, userId: decoded.userId ?? decoded.sub };
            next();
        } catch (err) {
            return res.status(401).json({ error: "Invalid token" });
        }
    } else {
        res.status(401).json({ error: "No token provided" });
    }
}


export async function authMiddleware(req, res, next) {
  try {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    if (!token) return res.status(401).json({ success: false, message: 'No token' });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // Chuẩn hoá dữ liệu gắn vào req.user (tránh bị override bởi spread)
    req.user = { ...payload, userId: payload.userId ?? payload.sub };
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid/expired token' });
  }
}