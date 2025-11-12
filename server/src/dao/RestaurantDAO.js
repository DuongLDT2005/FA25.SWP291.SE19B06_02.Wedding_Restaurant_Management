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

      // ⚠️ Nếu tất cả điều kiện đều rỗng thì bỏ qua
      if (
        (!location || location.trim() === "") &&
        (!eventType || eventType.trim() === "") &&
        (!capacity || isNaN(Number(capacity))) &&
        (!date || date.trim() === "")
      ) {
        console.warn("⚠️ Bỏ qua request rỗng hoặc thiếu capacity/date/location/eventType");
        return [];
      }

      const numCapacity =
        capacity && !isNaN(Number(capacity)) ? Number(capacity) : null;
      const numMinPrice =
        minPrice && !isNaN(Number(minPrice)) ? Number(minPrice) : null;
      const numMaxPrice =
        maxPrice && !isNaN(Number(maxPrice)) ? Number(maxPrice) : null;

      // 1️⃣ Lấy danh sách sảnh đã được đặt
      const bookedHalls = await booking.findAll({
        where: {
          eventDate: date,
          status: { [Op.notIn]: [2, 6, 7] },
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

      // 2️⃣ Điều kiện lọc sảnh
      const hallCondition = {};

      if (numCapacity && numCapacity > 0) {
        hallCondition.maxTable = { [Op.gte]: numCapacity };
      }

      if (bookedHallIDs.length > 0) {
        hallCondition.hallID = { [Op.notIn]: bookedHallIDs };
      }

      if (numMinPrice && numMaxPrice && numMinPrice > 0 && numMaxPrice > 0) {
        hallCondition.price = { [Op.between]: [numMinPrice, numMaxPrice] };
      } else if (numMinPrice && numMinPrice > 0) {
        hallCondition.price = { [Op.gte]: numMinPrice };
      } else if (numMaxPrice && numMaxPrice > 0) {
        hallCondition.price = { [Op.lte]: numMaxPrice };
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
        required: !!eventType,
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
            where:
              Object.keys(hallCondition).length > 0 ? hallCondition : undefined,
          },
          includeEventType,
          {
            model: restaurantimage,
            as: "restaurantimages",
            attributes: ["imageURL"],
          },
        ],
        subQuery: false,
      });

      console.log(
        `✅ Found ${restaurants.length} restaurant(s) before JS filter`
      );

      // 6️⃣ Lọc JS theo capacity
      const filteredRestaurants =
        numCapacity && numCapacity > 0
          ? restaurants.filter((r) =>
              r.halls?.some((h) => Number(h.maxTable) >= numCapacity)
            )
          : restaurants;

      console.log(
        `✅ After JS-level filter: ${filteredRestaurants.length} restaurant(s)`
      );

      return filteredRestaurants;
    } catch (error) {
      console.error("❌ Error in RestaurantDAO.search:", error);
      throw error;
    }
  }

  // ------------------ Các hàm phụ trợ ------------------
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
