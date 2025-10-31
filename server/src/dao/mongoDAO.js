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
    if (!client) {
        throw new Error("MongoDB client is not initialized. Missing MONGO_URI/MONGODB_URI in environment.");
    }
    return client.db(dbName).collection(collectionName);
}

export function deleteOtpByEmail(email) {
    const otps = getCollection("otps");
    return otps.deleteOne({ email });
}
// take otp from collection otps
export async function getOtpByEmail(email) {
    const otps = getCollection("otps");
    return await otps.findOne({ email });
}

// Kiểm tra OTP, xóa nếu hết hạn hoặc sau khi xác thực

export async function insertOtp(email, otp) {
    const otps = getCollection("otps");
    const expiresAt = new Date(Date.now() + 120 * 1000); // 2 phút
    await otps.insertOne({ email, otp, expiresAt });
}
console.log("thuc hien file mongoDAO.js");
// await client.connect();
// await ensureOtpTTLIndex(); //using when start server first time
export async function insertDeposit(bookingID) {
    const deposits = getCollection("depositBooking");
    const createdAt = new Date();
    await deposits.insertOne({ bookingID, createdAt });
}

export async function findBooking(bookingID) {
    const bookings = getCollection("depositBooking");
    return await bookings.findOne({ bookingID: bookingID });
}