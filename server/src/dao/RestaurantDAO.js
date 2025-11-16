import { Op } from "sequelize";
import db from "../config/db.js";
import { toDTO, toDTOs } from "../utils/convert/dto.js";
import MenuDAO from "./MenuDAO.js";
import DishDAO from "./DishDAO.js";
import PromotionDAO from "./PromotionDAO.js";
import ServiceDAO from "./ServiceDAO.js";
import HallDAO from "./HallDAO.js";
import AmenityDAO from "./AmenityDAO.js";
import EventTypeDAO from "./EventTypeDAO.js";
import HallImageDAO from "./HallImageDAO.js";

const {
  sequelize,
  restaurant,
  address,
  hall,
  booking,
  restaurantimage,
  restauranteventtype,
  eventtype,
  restaurantpartner,
  user,
} = db;

class RestaurantDAO {
  static async getAll() {
    const rows = await restaurant.findAll({
      attributes: [
        "restaurantID",
        "restaurantPartnerID",
        "name",
        "description",
        "hallCount",
        "addressID",
        "thumbnailURL",
        "status",
        "phone",
      ],
      include: [{ model: address, as: "address", attributes: ["fullAddress"] }],
      order: [["restaurantID", "ASC"]],
    });
    const dtos = toDTOs(rows);
    return dtos.map((r) => ({
      restaurantID: r.restaurantID,
      restaurantPartnerID: r.restaurantPartnerID,
      name: r.name,
      description: r.description,
      hallCount: r.hallCount,
      addressID: r.addressID,
      phone: r.phone || null,
      thumbnailURL: r.thumbnailURL,
      status: r.status,
      address: r.address?.fullAddress || null,
    }));
  }

  static async getAvailable() {
    const rows = await restaurant.findAll({
      where: { status: true },
      attributes: [
        "restaurantID",
        "restaurantPartnerID",
        "name",
        "description",
        "hallCount",
        "addressID",
        "thumbnailURL",
        "status",
        "phone",
      ],
      include: [{ model: address, as: "address", attributes: ["fullAddress"] }],
    });
    const dtos = toDTOs(rows);
    return dtos.map((r) => ({
      restaurantID: r.restaurantID,
      restaurantPartnerID: r.restaurantPartnerID,
      name: r.name,
      description: r.description,
      hallCount: r.hallCount,
      addressID: r.addressID,
      phone: r.phone || null,
      thumbnailURL: r.thumbnailURL,
      status: r.status,
      address: r.address?.fullAddress || null,
    }));
  }

  static async getAllByPartnerID(restaurantPartnerID) {
    const rows = await restaurant.findAll({
      where: { restaurantPartnerID },
      attributes: [
        "restaurantID",
        "restaurantPartnerID",
        "name",
        "description",
        "hallCount",
        "addressID",
        "thumbnailURL",
        "status",
        "phone",
      ],
      include: [{ model: address, as: "address", attributes: ["fullAddress"] }],
    });
    const dtos = toDTOs(rows);
    return dtos.map((r) => ({
      restaurantID: r.restaurantID,
      restaurantPartnerID: r.restaurantPartnerID,
      name: r.name,
      description: r.description,
      hallCount: r.hallCount,
      addressID: r.addressID,
      phone: r.phone || null,
      thumbnailURL: r.thumbnailURL,
      status: r.status,
      address: r.address?.fullAddress || null,
    }));
  }

  static async getByID(restaurantID) {
    const r = await restaurant.findByPk(restaurantID, {
      attributes: [
        "restaurantID",
        "restaurantPartnerID",
        "name",
        "description",
        "hallCount",
        "addressID",
        "thumbnailURL",
        "status",
        "phone",
      ],
      include: [
        {
          model: address,
          as: "address",
          attributes: ["number", "street", "ward", "fullAddress"],
        },
        {
          model: restaurantimage,
          as: "restaurantimages",
          attributes: ["imageID", "imageURL"],
        },
      ],
    });
    if (!r) return null;
    const dto = toDTO(r);
    // fetch related collections (menus, dishes, promotions, services, halls, amenities, eventTypes)
    const [menus, dishes, promotions, services, halls, amenities, eventTypes] =
      await Promise.all([
        MenuDAO.getByRestaurantID(restaurantID).catch(() => []),
        DishDAO.getByRestaurantID(restaurantID).catch(() => []),
        PromotionDAO.getPromotionsByRestaurantID(restaurantID).catch(() => []),
        ServiceDAO.getByRestaurantID(restaurantID).catch(() => []),
        HallDAO.getHallsByRestaurantId(restaurantID).catch(() => []),
        AmenityDAO.getAmenitiesByRestaurantID(restaurantID).catch(() => []),
        EventTypeDAO.getAllByRestaurantID(restaurantID).catch(() => []),
      ]);

    // attach images per hall
    const hallsWithImages = await Promise.all(
      (halls || []).map(async (h) => {
        const images = await HallImageDAO.getByHallId(h.hallID).catch(() => []);
        return { ...h, images };
      })
    );

    return {
      restaurantID: dto.restaurantID,
      restaurantPartnerID: dto.restaurantPartnerID,
      name: dto.name,
      description: dto.description,
      hallCount: dto.hallCount,
      addressID: dto.addressID,
      phone: dto.phone || null,
      thumbnailURL: dto.thumbnailURL,
      status: dto.status,
      address: dto.address
        ? {
            number: dto.address.number || null,
            street: dto.address.street || null,
            ward: dto.address.ward || null,
            fullAddress: dto.address.fullAddress || null,
          }
        : null,
      images: (dto.restaurantimages || []).map((img) => ({
        imageID: img.imageID,
        imageURL: img.imageURL,
      })),
      menus,
      dishes,
      promotions,
      services,
      halls: hallsWithImages,
      amenities,
      eventTypes,
    };
  }

  static async getSummaryByID(restaurantID) {
    // Return a lighter-weight representation suitable for listing or small detail views
    const r = await restaurant.findByPk(restaurantID, {
      attributes: [
        "restaurantID",
        "restaurantPartnerID",
        "name",
        "description",
        "hallCount",
        "addressID",
        "thumbnailURL",
        "status",
      ],
      include: [{ model: address, as: "address", attributes: ["fullAddress"] }],
    });
    if (!r) return null;
    const dto = toDTO(r);
    return {
      restaurantID: dto.restaurantID,
      name: dto.name,
      description: dto.description,
      hallCount: dto.hallCount,
      phone: dto.phone || null,
      thumbnailURL: dto.thumbnailURL,
      status: dto.status,
      address: dto.address?.fullAddress || null,
    };
  }
  /* 
constructor({
    restaurantID,
    restaurantPartnerID,
    name,
    description,
    hallCount,
    addressID,
    thumbnailURL,
    status,
  }) {*/
  static async createRestaurant({
    restaurantPartnerID,
    name,
    description,
    address: addr,
    thumbnailURL,
    status,
    phone,
  }) {
    return await sequelize.transaction(async (t) => {
      const a = await address.create(
        {
          number: addr.number,
          street: addr.street,
          ward: addr.ward,
          // fullAddress could be generated by a trigger; leave null if DB handles it
        },
        { transaction: t }
      );

      const r = await restaurant.create(
        {
          restaurantPartnerID,
          name,
          description,
          addressID: a.addressID,
          phone,
          thumbnailURL,
          status: status ?? true,
        },
        { transaction: t }
      );

      return {
        restaurantID: r.restaurantID,
        restaurantPartnerID: r.restaurantPartnerID,
        name: r.name,
        description: r.description,
        hallCount: r.hallCount ?? 0,
        addressID: r.addressID,
        phone: r.phone || null,
        thumbnailURL: r.thumbnailURL,
        status: r.status,
      };
    });
  }

  static async updateRestaurant(
    restaurantID,
    {
      restaurantPartnerID,
      name,
      description,
      address: addr,
      thumbnailURL,
      phone,
    }
  ) {
    return await sequelize.transaction(async (t) => {
      const r = await restaurant.findByPk(restaurantID, { transaction: t });
      if (!r) throw new Error("Restaurant not found");

      if (addr) {
        await address.update(
          {
            number: addr.number,
            street: addr.street,
            ward: addr.ward,
          },
          { where: { addressID: r.addressID }, transaction: t }
        );
      }

      await r.update(
        {
          restaurantPartnerID,
          name,
          description,
          phone,
          thumbnailURL,
        },
        { transaction: t }
      );

      return await this.getByID(restaurantID);
    });
  }

  static async toggleRestaurantStatus(restaurantID) {
    const r = await restaurant.findByPk(restaurantID, {
      attributes: ["status"],
    });
    if (!r) return false;
    await r.update({ status: !r.status });
    return true;
  }

  static async search({ location, capacity, date, minPrice, maxPrice, eventType, startTime, endTime }) {
    try {
      // ⚠️ Kiểm tra điều kiện rỗng TRƯỚC khi xử lý
      if (
        (!location || location.trim() === "") &&
        (!eventType || eventType.trim() === "") &&
        (!capacity || isNaN(Number(capacity))) &&
        (!date || date.trim() === "")
      ) {
        console.warn(
          "⚠️ Bỏ qua request rỗng hoặc thiếu capacity/date/location/eventType"
        );
        return [];
      }

      const numCapacity = capacity && !isNaN(Number(capacity)) ? Number(capacity) : null;
      const numMinPrice = minPrice && !isNaN(Number(minPrice)) ? Number(minPrice) : null;
      const numMaxPrice = maxPrice && !isNaN(Number(maxPrice)) ? Number(maxPrice) : null;

      // 1️⃣ Điều kiện lọc sảnh
      const hallCondition = { status: true };

      if (numCapacity && numCapacity > 0) {
        hallCondition.maxTable = { [Op.gte]: numCapacity };
      }

      if (numMinPrice && numMaxPrice && numMinPrice > 0 && numMaxPrice > 0) {
        hallCondition.price = { [Op.between]: [numMinPrice, numMaxPrice] };
      } else if (numMinPrice && numMinPrice > 0) {
        hallCondition.price = { [Op.gte]: numMinPrice };
      } else if (numMaxPrice && numMaxPrice > 0) {
        hallCondition.price = { [Op.lte]: numMaxPrice };
      }

      // 2️⃣ Exclude halls already booked (chỉ khi có date và time)
      if (date && startTime && endTime) {
        // Lấy danh sách sảnh đã được đặt
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

        if (bookedHallIDs.length > 0) {
          hallCondition.hallID = { [Op.notIn]: bookedHallIDs };
        }
      }

      console.log("🏛️ hallCondition:", hallCondition);

      // 3️⃣ Điều kiện địa chỉ
      const addressCondition = {};
      if (location) {
        const decodedLocation = decodeURIComponent(location).trim();
        
        // Tìm ward name từ slug bằng cách lấy tất cả wards và match
        const [allWards] = await sequelize.query(
          `SELECT DISTINCT ward FROM Address`
        );
        
        // Helper function để tạo slug từ ward name (giống WardDAO)
        const createSlug = (name) => {
          if (!name) return '';
          return name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/Đ/g, 'd')
            .replace(/[^a-z0-9\s-]/g, '')
            .trim()
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');
        };
        
        // Tìm ward có slug khớp
        const matchedWard = allWards.find(w => 
          createSlug(w.ward) === decodedLocation.toLowerCase()
        );
        
        const actualWardName = matchedWard ? matchedWard.ward : null;
        
        console.log('🔍 Location search:', { decodedLocation, actualWardName, allWardsCount: allWards.length });
        
        // Tìm kiếm chính xác theo ward (chỉ dùng exact match để tránh match sai)
        if (actualWardName) {
          // Chỉ dùng exact match cho ward để đảm bảo chính xác
          addressCondition.ward = actualWardName;
        } else {
          // Fallback: thử exact match với location gốc
          addressCondition.ward = decodedLocation;
        }
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
            attributes: ["fullAddress", "ward"],
            where:
              Object.keys(addressCondition).length > 0
                ? addressCondition
                : undefined,
            required: Object.keys(addressCondition).length > 0, // Chỉ required khi có filter location
          },
          {
            model: hall,
            as: "halls",
            required: true,
            where:
              Object.keys(hallCondition).length > 0
                ? hallCondition
                : undefined,
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
    const data = await restaurant.findAll({
      include: [
        { model: address, as: "address" },
        { model: hall, as: "halls" },
        { model: restaurantimage, as: "restaurantimages" },

        // restaurant → restaurantpartner
        {
          model: restaurantpartner,
          as: "partner",
          include: [
            // restaurantpartner → user
            {
              model: user,
              as: "owner",
              attributes: ["fullName", "email", "phone"],
            },
          ],
        },
      ],
    });

    return data.map((r) => ({
      ...r.get({ plain: true }),
      status: Number(r.status),
    }));
  }

  static async getByID(id) {
    const res = await restaurant.findByPk(id, {
      include: [
        { model: address, as: "address" },
        { model: hall, as: "halls" },
        { model: restaurantimage, as: "restaurantimages" },

        {
          model: restaurantpartner,
          as: "partner",
          include: [
            {
              model: user,
              as: "owner",
              attributes: ["fullName", "email", "phone"],
            },
          ],
        },
      ],
    });

    if (!res) return null;

    return {
      ...res.get({ plain: true }),
      status: Number(res.status),
    };
  }

  static async getByPartnerID(partnerID) {
    return await restaurant.findAll({
      where: { restaurantPartnerID: Number(partnerID) },
      include: [
        { model: address, as: "address" },
        { model: hall, as: "halls" },
        { model: restaurantimage, as: "restaurantimages" },
      ],
    });
  }
}

export default RestaurantDAO;
