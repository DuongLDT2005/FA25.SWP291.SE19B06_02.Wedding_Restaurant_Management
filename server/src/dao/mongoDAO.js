// Hàm test: insert OTP và kiểm tra TTL index
import { client } from "../config/db.js";

// Tạo TTL index cho collection otps, tự động xóa OTP sau 15 phút
export async function ensureOtpTTLIndex() {
    const otps = getCollection("otps");
    console.log("thuc hien function");
    // expireAfterSeconds: 60 giây
    // await otps.dropIndex("expiresAt_1");
    await otps.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 120 });
}


export function getCollection(collectionName, dbName = "userRestaurantsDB") {
    return client.db(dbName).collection(collectionName);
}

// take otp from collection otps
export async function getOtpByEmail(email) {
    const otps = getCollection("otps");
    return await otps.findOne({ email });
}

// Kiểm tra OTP, xóa nếu hết hạn hoặc sau khi xác thực
export async function verifyAndDeleteOtp(email, otp) {
    const otps = getCollection("otps");
    const record = await otps.findOne({ email, otp });
    if (!record) return { valid: false, reason: "OTP không tồn tại" };

    const now = new Date();
    if (record.expiresAt < now) {
        await otps.deleteOne({ _id: record._id }); // Xóa OTP hết hạn
        return { valid: false, reason: "OTP đã hết hạn" };
    }

    await otps.deleteOne({ _id: record._id }); // Xóa OTP sau khi xác thực thành công
    return { valid: true };
}

export async function insertOtp(email, otp) {
    const otps = getCollection("otps");
    const expiresAt = new Date(Date.now() + 120 * 1000); // 2 phút
    await otps.insertOne({ email, otp, expiresAt });
}
console.log("thuc hien file mongoDAO.js");
// await client.connect();
// await ensureOtpTTLIndex(); //using when start server first time
