import { Op } from "sequelize";
import db from "../config/db.js";

const {
  restaurant,
  address,
  hall,
  booking,
  restaurantimage,
  restauranteventtype,
  eventtype,
} = db;

class RestaurantDAO {
  /**
   * 🔍 Tìm kiếm nhà hàng theo vị trí, loại sự kiện, ngày, giờ, số bàn, giá, ...
   */
  static async search({
    location,
    eventType,
    capacity,
    date,
    startTime,
    endTime,
    minPrice,
    maxPrice,
  }) {
    try {
      console.log("🔍 Search filters received:", {
        location,
        eventType,
        capacity,
        date,
        startTime,
        endTime,
        minPrice,
        maxPrice,
      });

      // Ép kiểu an toàn
      const numCapacity = capacity ? Number(capacity) : null;
      const numMinPrice = minPrice ? Number(minPrice) : null;
      const numMaxPrice = maxPrice ? Number(maxPrice) : null;

      // 1️⃣ Lấy danh sách sảnh đã được đặt trong khung thời gian này
      const bookedHalls = await booking.findAll({
        where: {
          eventDate: date,
          status: { [Op.notIn]: [2, 6, 7] }, // loại bỏ booking bị hủy, hoàn tất, ...
          [Op.or]: [
            {
              [Op.and]: [
                { startTime: { [Op.lte]: startTime } },
                { endTime: { [Op.gt]: startTime } },
              ],
            },
            {
              [Op.and]: [
                { startTime: { [Op.lt]: endTime } },
                { endTime: { [Op.gte]: endTime } },
              ],
            },
          ],
        },
        attributes: ["hallID"],
      });

      const bookedHallIDs = bookedHalls.map((b) => b.hallID);
      console.log("🚫 Booked hall IDs:", bookedHallIDs);

      // 2️⃣ Thiết lập điều kiện lọc sảnh
      const hallCondition = {};

      // ép kiểu an toàn
      const cap = capacity ? Number(capacity) : null;
      const min = minPrice ? Number(minPrice) : null;
      const max = maxPrice ? Number(maxPrice) : null;

      if (!isNaN(cap) && cap > 0) {
        hallCondition.maxTable = { [Op.gte]: cap };
      }

      if (bookedHallIDs.length > 0) {
        hallCondition.hallID = { [Op.notIn]: bookedHallIDs };
      }

      // lọc giá
      if (!isNaN(min) && !isNaN(max) && min > 0 && max > 0) {
        hallCondition.price = { [Op.between]: [min, max] };
      } else if (!isNaN(min) && min > 0) {
        hallCondition.price = { [Op.gte]: min };
      } else if (!isNaN(max) && max > 0) {
        hallCondition.price = { [Op.lte]: max };
      }

      console.log("🏛️ hallCondition:", hallCondition);

      // 3️⃣ Điều kiện địa chỉ
      const addressCondition = {};
      if (location) {
        addressCondition.fullAddress = {
          [Op.like]: `%${decodeURIComponent(location)}%`,
        };
      }

      // 4️⃣ Include loại sự kiện
      const includeEventType = {
        model: restauranteventtype,
        as: "restauranteventtypes",
        include: [
          {
            model: eventtype,
            as: "eventType",
            attributes: ["name"],
            ...(eventType
              ? {
                  where: {
                    name: {
                      [Op.like]: `%${decodeURIComponent(eventType)}%`,
                    },
                  },
                }
              : {}),
          },
        ],
        required: !!eventType, // chỉ join bắt buộc khi có filter eventType
      };

      // 5️⃣ Truy vấn chính
      const restaurants = await restaurant.findAll({
        where: { status: 1 },
        include: [
          {
            model: address,
            as: "address",
            attributes: ["fullAddress"],
            where:
              Object.keys(addressCondition).length > 0
                ? addressCondition
                : undefined,
          },
          {
            model: hall,
            as: "halls",
            required: true,
            where: hallCondition,
          },
          includeEventType,
          {
            model: restaurantimage,
            as: "restaurantimages",
            attributes: ["imageURL"],
          },
        ],
        subQuery: false, // ✅ thêm dòng này
      });

      console.log(`✅ Found ${restaurants.length} restaurant(s)`);

      // Nếu không có kết quả, log rõ lý do
      if (restaurants.length === 0) {
        console.log("⚠️ No restaurant matched your criteria.");
      }

      return restaurants;
    } catch (error) {
      console.error("❌ Error in RestaurantDAO.search:", error);
      throw error;
    }
  }

  // ------------------ Các hàm phụ trợ khác ------------------

  static async getAll() {
    return await restaurant.findAll({
      include: [
        { model: address, as: "address" },
        { model: hall, as: "halls" },
        { model: restaurantimage, as: "restaurantimages" },
      ],
    });
  }

  static async getByID(id) {
    return await restaurant.findByPk(id, {
      include: [
        { model: address, as: "address" },
        { model: hall, as: "halls" },
        { model: restaurantimage, as: "restaurantimages" },
        {
          model: restauranteventtype,
          as: "restauranteventtypes",
          include: [{ model: eventtype, as: "eventType" }],
        },
      ],
    });
  }

  static async getByPartnerID(partnerID) {
    return await restaurant.findAll({
      where: { restaurantPartnerID: partnerID },
      include: [
        { model: address, as: "address" },
        { model: hall, as: "halls" },
        { model: restaurantimage, as: "restaurantimages" },
      ],
    });
  }
}

export default RestaurantDAO;
