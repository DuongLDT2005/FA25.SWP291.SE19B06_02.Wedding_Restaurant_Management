import db from "../config/db.js";
import BookingStatus, { checkedStatus } from "../models/enums/BookingStatus.js";
import { toDTO, toDTOs } from "../utils/dto.js";

// Models from Sequelize
const {
  sequelize,
  booking: BookingModel,
  bookingdish: BookingDishModel,
  bookingservice: BookingServiceModel,
  bookingpromotion: BookingPromotionModel,
  hall: HallModel,
  restaurant: RestaurantModel,
  restaurantpartner: RestaurantPartnerModel,
  menu: MenuModel,
  dish: DishModel,
  service: ServiceModel,
  promotion: PromotionModel,
  customer: CustomerModel,
  eventtype: EventTypeModel,
  // contract: ContractModel,
} = db;

class BookingDAO {
  // Create a booking and optionally attach dishes, services, promotions using junction tables
  static async createBooking(
    bookingData,
    { dishIDs = [], services = [], promotionIDs = [] } = {}
  ) {
    return await sequelize.transaction(async (t) => {
      const newBooking = await BookingModel.create(bookingData, {
        transaction: t,
      });

      // Attach dishes (bookingdish)
      if (Array.isArray(dishIDs) && dishIDs.length > 0) {
        const rows = dishIDs.map((dishID) => ({
          bookingID: newBooking.bookingID,
          dishID,
        }));
        await BookingDishModel.bulkCreate(rows, {
          ignoreDuplicates: true,
          transaction: t,
        });
      }

      // Attach services (bookingservice): expect array of { serviceID, quantity, appliedPrice }
      if (Array.isArray(services) && services.length > 0) {
        const rows = services.map((s) => ({
          bookingID: newBooking.bookingID,
          serviceID: s.serviceID,
          quantity: s.quantity ?? 1,
          appliedPrice: s.appliedPrice,
        }));
        await BookingServiceModel.bulkCreate(rows, {
          ignoreDuplicates: true,
          transaction: t,
        });
      }

      // Attach promotions (bookingpromotion)
      if (Array.isArray(promotionIDs) && promotionIDs.length > 0) {
        const rows = promotionIDs.map((promotionID) => ({
          bookingID: newBooking.bookingID,
          promotionID,
        }));
        await BookingPromotionModel.bulkCreate(rows, {
          ignoreDuplicates: true,
          transaction: t,
        });
      }

      return toDTO(newBooking);
    });
  }

  // Get bookings for a customer with optional filters
  static async getBookingsByCustomer({
    customerID,
    status = null,
    isChecked = null,
  }) {
    const where = { customerID };
    if (status !== null && typeof status !== "undefined") where.status = status;
    if (isChecked !== null && typeof isChecked !== "undefined")
      where.isChecked = !!isChecked;

    const rows = await BookingModel.findAll({
      where,
      order: [["createdAt", "DESC"]],
    });
    return toDTOs(rows);
  }

  // Get the Restaurant Partner owning the hall where this booking is placed
  static async getRestaurantPartnerByHallID(hallID) {
    // hall -> restaurant -> restaurantPartner
    const hall = await HallModel.findByPk(hallID, {
      include: [
        {
          model: RestaurantModel,
          as: "restaurant",
          include: [{ model: RestaurantPartnerModel, as: "restaurantPartner" }],
        },
      ],
    });
    if (!hall) return null;
    const partner = hall.restaurant?.restaurantPartner;
    return toDTO(partner);
  }

  // Back-compat: original code expected a list; return [partner] or []
  static async getRestaurantPartnersByHallID(hallID) {
    const p = await this.getRestaurantPartnerByHallID(hallID);
    return p ? [p] : [];
  }

  static async updateBookingStatus(bookingID, newStatus, { isChecked } = {}) {
    const updates = { status: newStatus };
    if (typeof isChecked !== "undefined") updates.isChecked = !!isChecked;
    const [affected] = await BookingModel.update(updates, {
      where: { bookingID },
    });
    return affected > 0;
  }

  // Retrieve full booking details with junction data
  static async getBookingDetails(bookingID) {
    const row = await BookingModel.findByPk(bookingID, {
      include: [
        { model: CustomerModel, as: "customer" },
        { model: EventTypeModel, as: "eventType" },
        { model: HallModel, as: "hall" },
        { model: MenuModel, as: "menu" },
        {
          model: BookingDishModel,
          as: "bookingdishes",
          include: [{ model: DishModel, as: "dish" }],
        },
        {
          model: BookingServiceModel,
          as: "bookingservices",
          include: [{ model: ServiceModel, as: "service" }],
        },
        {
          model: BookingPromotionModel,
          as: "bookingpromotions",
          include: [{ model: PromotionModel, as: "promotion" }],
        },
      ],
    });
    return toDTO(row);
  }

  // Replace dishes for a booking
  static async setBookingDishes(bookingID, dishIDs = []) {
    return await sequelize.transaction(async (t) => {
      await BookingDishModel.destroy({ where: { bookingID }, transaction: t });
      if (dishIDs.length > 0) {
        const rows = dishIDs.map((dishID) => ({ bookingID, dishID }));
        await BookingDishModel.bulkCreate(rows, { transaction: t });
      }
      return true;
    });
  }

  // Replace services for a booking
  static async setBookingServices(bookingID, services = []) {
    return await sequelize.transaction(async (t) => {
      await BookingServiceModel.destroy({
        where: { bookingID },
        transaction: t,
      });
      if (services.length > 0) {
        const rows = services.map((s) => ({
          bookingID,
          serviceID: s.serviceID,
          quantity: s.quantity ?? 1,
          appliedPrice: s.appliedPrice,
        }));
        await BookingServiceModel.bulkCreate(rows, { transaction: t });
      }
      return true;
    });
  }

  // Replace promotions for a booking
  static async setBookingPromotions(bookingID, promotionIDs = []) {
    return await sequelize.transaction(async (t) => {
      await BookingPromotionModel.destroy({
        where: { bookingID },
        transaction: t,
      });
      if (promotionIDs.length > 0) {
        const rows = promotionIDs.map((promotionID) => ({
          bookingID,
          promotionID,
        }));
        await BookingPromotionModel.bulkCreate(rows, { transaction: t });
      }
      return true;
    });
  }

  static async deleteBooking(bookingID) {
    return await sequelize.transaction(async (t) => {
      await BookingDishModel.destroy({ where: { bookingID }, transaction: t });
      await BookingServiceModel.destroy({
        where: { bookingID },
        transaction: t,
      });
      await BookingPromotionModel.destroy({
        where: { bookingID },
        transaction: t,
      });
      const affected = await BookingModel.destroy({
        where: { bookingID },
        transaction: t,
      });
      return affected > 0;
    });
  }
}

export default BookingDAO;
