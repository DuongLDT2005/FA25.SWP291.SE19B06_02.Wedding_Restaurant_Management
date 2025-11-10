import express from "express";
import dotenv from "dotenv";
import db from "../config/db.js";
dotenv.config();

const router = express.Router();
const { sequelize } = db;

// 🧠 Gọi Gemini phân tích + fallback
async function analyzeUserRequest(message) {
  let result = {};

  try {
    const prompt = `
Bạn là công cụ phân tích câu hỏi người dùng về việc tìm nhà hàng tổ chức tiệc tại thành phố Đà Nẵng.
Hãy đọc câu sau và trích xuất thành JSON hợp lệ duy nhất (KHÔNG GIẢI THÍCH, KHÔNG XUỐNG DÒNG NGOÀI JSON).

Định dạng JSON:
{
  "eventType": "Tên loại tiệc (vd: Tiệc cưới, Tiệc sinh nhật, Tiệc công ty, ...)",
  "keywords": ["sang trọng", "lãng mạn", "view đẹp", "gia đình", ...],
  "district": "Tên quận ở Đà Nẵng (vd: Hải Châu, Sơn Trà, Cẩm Lệ, Thanh Khê, Liên Chiểu, Ngũ Hành Sơn)"
}

Ví dụ:
Người dùng: "Tôi muốn nhà hàng tổ chức tiệc cưới sang trọng ở Hải Châu"
Phản hồi: {"eventType":"Tiệc cưới","keywords":["sang trọng"],"district":"Hải Châu"}

Người dùng: "${message}"
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.2, topP: 1 },
        }),
      }
    );

    const data = await response.json();
    const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "";

    // Thử parse JSON chặt chẽ hơn
    const match = raw.match(/{[\s\S]*}/);
    if (match) {
      try {
        result = JSON.parse(match[0]);
      } catch (e) {
        console.warn("⚠️ JSON parse fail, fallback regex.");
      }
    }
  } catch (err) {
    console.error("❌ Lỗi gọi Gemini:", err);
  }

  // 🧩 Fallback nhận diện tiếng Việt nếu Gemini fail
  if (!result || Object.keys(result).length === 0) {
    const msg = message.toLowerCase();
    const districts = [
      "hải châu",
      "sơn trà",
      "thanh khê",
      "liên chiểu",
      "cẩm lệ",
      "ngũ hành sơn",
    ];
    const events = [
      "cưới",
      "sinh nhật",
      "công ty",
      "tất niên",
      "liên hoan",
      "kỷ niệm",
    ];
    const keywords = [
      "sang trọng",
      "lãng mạn",
      "view đẹp",
      "gia đình",
      "ấm cúng",
      "cao cấp",
    ];

    const district = districts.find((d) => msg.includes(d)) || "";
    const event = events.find((e) => msg.includes(e)) || "";
    const matchedKeywords = keywords.filter((k) => msg.includes(k));

    result = {
      eventType: event ? `Tiệc ${event}` : "",
      keywords: matchedKeywords,
      district: district
        ? district
            .split(" ")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ")
        : "",
    };
  }

  return result;
}

// ⚙️ Route chính
router.post("/suggest", async (req, res) => {
  const { message } = req.body;

  try {
    const filters = await analyzeUserRequest(message);
    console.log("🎯 Gemini hiểu:", filters);

    const { eventType, keywords = [], district = "" } = filters;
    const cleanDistrict = district.trim().toLowerCase();

    let query = `
      SELECT 
        r.restaurantID,
        r.name,
        r.description,
        r.avgRating,
        r.totalReviews,
        r.thumbnailURL,
        a.fullAddress,
        a.ward
      FROM Restaurant r
      JOIN Address a ON r.addressID = a.addressID
      WHERE r.status = 1
    `;

    if (eventType) {
      const [eventTypes] = await sequelize.query(
        `SELECT eventTypeID FROM EventType WHERE name LIKE :name AND status = 1 LIMIT 1`,
        { replacements: { name: `%${eventType}%` } }
      );
      if (eventTypes.length > 0) {
        query += ` AND r.restaurantID IN (
          SELECT restaurantID FROM RestaurantEventType WHERE eventTypeID = ${eventTypes[0].eventTypeID}
        )`;
      }
    }

    if (keywords.length) {
      const kw = keywords
        .map(
          (k) =>
            `(r.name LIKE '%${k}%' OR r.description LIKE '%${k}%' OR a.fullAddress LIKE '%${k}%')`
        )
        .join(" OR ");
      query += ` AND (${kw})`;
    }

    query += " ORDER BY r.avgRating DESC LIMIT 15";

    const [rawResults] = await sequelize.query(query);
    console.log("📜 Query:", query);
    console.log("📦 Raw results:", rawResults.length);

    // ✅ Lọc quận chuẩn xác trong NodeJS
    let restaurants = rawResults;
    if (cleanDistrict) {
      restaurants = rawResults.filter((r) => {
        const ward = (r.ward || "").toLowerCase();
        const addr = (r.fullAddress || "").toLowerCase();
        return (
          ward.includes(cleanDistrict) ||
          addr.split(",").some((p) => p.trim() === cleanDistrict)
        );
      });
    }

    if (!restaurants.length) {
      return res.json({
        reply:
          "Hiện tôi chưa tìm thấy nhà hàng phù hợp. Bạn có thể nói rõ hơn quận, loại tiệc hoặc phong cách mong muốn không?",
      });
    }

    const listText = restaurants
      .slice(0, 5)
      .map(
        (r, i) =>
          `🏠 ${i + 1}. **${r.name}** (${r.avgRating ?? "N/A"}⭐ – ${
            r.totalReviews ?? 0
          } đánh giá)\n📍 ${r.fullAddress}\n💬 ${r.description}`
      )
      .join("\n\n");

    res.json({
      reply: `Dưới đây là một số nhà hàng phù hợp ở Đà Nẵng:\n\n${listText}`,
      data: restaurants.slice(0, 5),
    });
  } catch (error) {
    console.error("❌ Lỗi /api/ai/suggest:", error);
    res.status(500).json({
      reply: "Có lỗi xảy ra khi xử lý yêu cầu tìm nhà hàng.",
    });
  }
});

export default router;
