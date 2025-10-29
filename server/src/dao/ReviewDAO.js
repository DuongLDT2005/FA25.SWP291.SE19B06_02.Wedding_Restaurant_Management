import db from "../config/db";
import { Op } from 'sequelize';
const { review, sequelize } = db;
import { toDTO, toDTOs } from '../utils/dto.js';

class ReviewDAO {
    /**
     * Create a review. Enforces unique (bookingID, customerID) via DB constraint.
     * reviewData: { bookingID, customerID, rating, comment }
     */
    static async createReview(reviewData) {
        const { bookingID, customerID, rating = null, comment = null } = reviewData;
        // Use a transaction to ensure atomicity and to allow callers to extend later
        const r = await sequelize.transaction(async (t) => {
            const created = await review.create({ bookingID, customerID, rating, comment }, { transaction: t });
            return created;
        });
        return toDTO(r);
    }

    static async getByID(reviewID) {
        const r = await review.findByPk(reviewID);
        return toDTO(r);
    }

    static async getByBookingID(bookingID) {
        const rows = await review.findAll({ where: { bookingID }, order: [['createdAt', 'DESC']] });
        return toDTOs(rows);
    }

    static async getByCustomerID(customerID) {
        const rows = await review.findAll({ where: { customerID }, order: [['createdAt', 'DESC']] });
        return toDTOs(rows);
    }

    static async getByBookingAndCustomer(bookingID, customerID) {
        const r = await review.findOne({ where: { bookingID, customerID } });
        return toDTO(r);
    }

    /**
     * Generic list with optional filters: { bookingID, customerID, minRating, maxRating, limit, offset }
     */
    static async list({ bookingID, customerID, minRating, maxRating, limit, offset } = {}) {
        const where = {};
        if (bookingID !== undefined && bookingID !== null) where.bookingID = bookingID;
        if (customerID !== undefined && customerID !== null) where.customerID = customerID;
        if (minRating !== undefined && minRating !== null) where.rating = { ...(where.rating || {}), [Op.gte]: minRating };
        if (maxRating !== undefined && maxRating !== null) where.rating = { ...(where.rating || {}), [Op.lte]: maxRating };

        const rows = await review.findAll({ where, order: [['createdAt', 'DESC']], ...(limit ? { limit } : {}), ...(offset ? { offset } : {}) });
        return toDTOs(rows);
    }

    static async updateReview(reviewID, patch) {
        const [count] = await review.update(patch, { where: { reviewID } });
        return count > 0;
    }

    static async deleteReview(reviewID) {
        const count = await review.destroy({ where: { reviewID } });
        return count > 0;
    }

    static async count({ bookingID, customerID } = {}) {
        const where = {};
        if (bookingID !== undefined && bookingID !== null) where.bookingID = bookingID;
        if (customerID !== undefined && customerID !== null) where.customerID = customerID;
        return await review.count({ where });
    }
}

export default ReviewDAO;