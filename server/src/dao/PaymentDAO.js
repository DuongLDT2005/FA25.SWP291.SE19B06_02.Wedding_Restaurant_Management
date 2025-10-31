import db from "../config/db";
import { Op } from 'sequelize';
import paymentStatus from "../utils/paymentStatus.js";
import { toDTO, toDTOs } from '../utils/convert/dto.js';
const { payment: PaymentModel, sequelize } = db;

class PaymentDAO {
    // Return plain objects for easier handling in services/controllers
    static async getByBookingID(bookingID) {
        const rows = await PaymentModel.findAll({
            where: { bookingID },
            order: [['paymentID', 'ASC']]
        });
    return toDTOs(rows);
    }

    static async getByRestaurantID(restaurantID) {
        const rows = await PaymentModel.findAll({ where: { restaurantID }, order: [['paymentDate', 'DESC']] });
    return toDTOs(rows);
    }

    static async getByTransactionRef(transactionRef) {
        const row = await PaymentModel.findOne({ where: { transactionRef } });
    return toDTO(row);
    }

    // Create a payment record. data may contain many optional fields matching the schema.
    static async createPayment(data) {
        const {
            bookingID,
            restaurantID,
            amount,
            type = 0,
            paymentMethod = 0,
            status = paymentStatus.PENDING ?? 0,
            transactionRef = null,
            paymentDate = null,
            released = false,
            refundedAmount = 0,
            refundReason = null,
            refundDate = null,
            refundTransactionRef = null,
            providerResponse = null,
        } = data;

        if (typeof amount === 'undefined' || Number(amount) < 0) {
            throw new Error('Invalid amount for payment');
        }

        const created = await PaymentModel.create({
            bookingID,
            restaurantID,
            amount,
            type,
            paymentMethod,
            status,
            transactionRef,
            paymentDate,
            released: released ? 1 : 0,
            refundedAmount: refundedAmount ?? 0,
            refundReason,
            refundDate,
            refundTransactionRef,
            providerResponse
        });

    return toDTO(created);
    }

    static async updatePaymentStatus(paymentID, newStatus) {
        const [updatedRows] = await PaymentModel.update(
            { status: newStatus },
            { where: { paymentID } }
        );
        return updatedRows > 0;
    }

    // Mark payment as released (bit) and optionally attach provider response
    static async markReleased(paymentID, { released = true, providerResponse = null } = {}) {
        const [updatedRows] = await PaymentModel.update(
            { released: released ? 1 : 0, providerResponse },
            { where: { paymentID } }
        );
        return updatedRows > 0;
    }

    // Refund handling: supports partial refunds by accumulating refundedAmount
    static async refundPayment(paymentID, { amount = 0, refundTransactionRef = null, refundReason = null } = {}) {
        return await sequelize.transaction(async (t) => {
            const pay = await PaymentModel.findByPk(paymentID, { transaction: t, lock: t.LOCK.UPDATE });
            if (!pay) throw new Error('Payment not found');

            const original = Number(pay.amount ?? 0);
            const alreadyRefunded = Number(pay.refundedAmount ?? 0);
            const toRefund = Number(amount);
            if (toRefund <= 0) throw new Error('Refund amount must be greater than zero');
            if (alreadyRefunded + toRefund > original) throw new Error('Refund amount exceeds original payment');

            const newRefunded = alreadyRefunded + toRefund;
            const updates = {
                refundedAmount: newRefunded,
                refundDate: new Date(),
                refundTransactionRef,
                refundReason,
                status: newRefunded >= original ? paymentStatus.REFUNDED ?? 4 : paymentStatus.PROCESSING ?? 1
            };

            await pay.update(updates, { transaction: t });
            return toDTO(pay);
        });
    }

    static async getPaymentsByStatus(statusList) {
        const rows = await PaymentModel.findAll({
            where: {
                status: {
                    [Op.in]: statusList
                }
            },
        });
    return toDTOs(rows);
    }
}

export default PaymentDAO;