import db from "../config/db";
import { Op } from 'sequelize';
import { toDTO, toDTOs } from '../utils/convert/dto.js';
const { promotion, sequelize, restaurantpromotion, promotionservice, service } = db;

class PromotionDAO {
    static async getAll() {
        const rows = await promotion.findAll({
            attributes: ['promotionID', 'title', 'description', 'discountPercentage', 'startDate', 'endDate']
        });
        return toDTOs(rows);
    }
    static async getByID(promotionID) {
        const r = await promotion.findByPk(promotionID, {
            attributes: ['promotionID', 'title', 'description', 'discountPercentage', 'startDate', 'endDate']
        });
        return toDTO(r);
    }
    static async getPromotionsByRestaurantID(restaurantID) {
        // First, find all promotionIDs linked to the given restaurantID
        const promotionLinks = await restaurantpromotion.findAll({
            where: { restaurantID },
            attributes: ['promotionID']
        });
        const promotionIDs = promotionLinks.map(link => link.promotionID);
        if (promotionIDs.length === 0) {
            return [];
        }
        // Now, fetch all promotions with these promotionIDs
        const rows = await promotion.findAll({
            where: {
                promotionID: {
                    [Op.in]: promotionIDs
                }
            },
            attributes: ['promotionID', 'title', 'description', 'discountPercentage', 'startDate', 'endDate']
        });
        return toDTOs(rows);
    }
    static async getServicesByPromotionID(promotionID) {
        // First, find all serviceIDs linked to the given promotionID
        const serviceLinks = await promotionservice.findAll({
            where: { promotionID },
            attributes: ['serviceID']
        });
        const serviceIDs = serviceLinks.map(link => link.serviceID);
        if (serviceIDs.length === 0) {
            return [];
        }
        // Now, fetch all services with these serviceIDs
        const rows = await service.findAll({
            where: {
                serviceID: {
                    [Op.in]: serviceIDs
                }
            },
            attributes: ['serviceID', 'name', 'description', 'price']
        });
        return toDTOs(rows);
    }
    static async addPromotion(title, description, discountPercentage, startDate, endDate, restaurantID, discountType = null, serviceIDs = []) {
        const t = await sequelize.transaction();
        try {
            const p = await promotion.create(
                { title, description, discountPercentage, startDate, endDate, discountType },
                { transaction: t }
            );

            // always link promotion to the creating restaurant (if provided)
            if (restaurantID) {
                await restaurantpromotion.create(
                    { promotionID: p.promotionID, restaurantID },
                    { transaction: t }
                );
            }

            // if discountType is "Free", link the promotion to the provided services
            if (discountType === 'Free' && Array.isArray(serviceIDs) && serviceIDs.length > 0) {
                const links = serviceIDs.map(serviceID => ({ promotionID: p.promotionID, serviceID }));
                await promotionservice.bulkCreate(links, { transaction: t });
            }

            await t.commit();

            return {
                promotionID: p.promotionID,
                title: p.title,
                description: p.description,
                discountPercentage: p.discountPercentage,
                discountType: p.discountType ?? discountType,
                startDate: p.startDate,
                endDate: p.endDate
            };
        } catch (err) {
            await t.rollback();
            throw err;
        }
    }
    static async updatePromotion(promotionID, promotionData) {
        const [count] = await promotion.update(promotionData, { where: { promotionID } });
        return count > 0;
    }
    static async updateStatus(promotionID, statusData) {
        const [count] = await promotion.update(statusData, { where: { promotionID } });
        return count > 0;
    }
    static async deletePromotion(promotionID) {
        const count = await promotion.destroy({ where: { promotionID } });
        return count > 0;
    }
}

export default PromotionDAO;
