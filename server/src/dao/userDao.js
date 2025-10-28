import db from '../config/db.js';
import { userRole, userStatus, negoStatus, coupleRole } from '../enums/UserStatus.js';
import { bitToNumber } from '../utils/bitUtils.js';

// db (from config/db.js) exports: { sequelize, user, restaurantpartner, customer, ... }
const { sequelize, user: UserModel, restaurantpartner: RestaurantPartnerModel, customer: CustomerModel } = db;

class UserDAO {
    static async getAllUsers() {
        const users = await UserModel.findAll({
            include: [
                { model: RestaurantPartnerModel, as: 'restaurantpartner' },
                { model: CustomerModel, as: 'customer' }
            ]
        });

        return users.map(u => u.get({ plain: true }));
    }

    static async getUserById(id) {
        const user = await UserModel.findByPk(id, {
            include: [
                { model: RestaurantPartnerModel, as: 'restaurantpartner' },
                { model: CustomerModel, as: 'customer' }
            ]
        });
        return user ? user.get({ plain: true }) : null;
    }

    static async createOwner(data) {
        return await sequelize.transaction(async (t) => {
            const { email, fullName, phone, password, licenseUrl } = data;
            const createdUser = await UserModel.create({
                email,
                fullName,
                phone,
                password,
                role: userRole.owner,
                status: userStatus.active === 1
            }, { transaction: t });

            await RestaurantPartnerModel.create({
                restaurantPartnerID: createdUser.userID,
                licenseUrl: licenseUrl || '',
                status: negoStatus.pending,
                commissionRate: null
            }, { transaction: t });

            return this.getUserById(createdUser.userID);
        });
    }

    static async createCustomer(data) {
        return await sequelize.transaction(async (t) => {
            const { email, fullName, phone, password, partnerName, weddingRole } = data;
            const createdUser = await UserModel.create({
                email,
                fullName,
                phone,
                password,
                role: userRole.customer,
                status: userStatus.active === 1
            }, { transaction: t });

            await CustomerModel.create({
                customerID: createdUser.userID,
                partnerName: partnerName || '',
                weddingRole: weddingRole || coupleRole.other
            }, { transaction: t });

            return this.getUserById(createdUser.userID);
        });
    }

    static async updateStatusUser(id, status) {
        const valid = status === 1;
        const [affected] = await UserModel.update({ status: valid }, { where: { userID: id } });
        if (affected === 0) throw new Error('User not found or status not updated');
        return affected > 0;
    }

    static async updateUserInfo(id, updates) {
        // updates may contain user fields and owner/customer specific fields
        const user = await UserModel.findByPk(id);
        if (!user) throw new Error('User not found');

        const { fullName, phone, password, role, status, licenseUrl, negotiationStatus, commissionRate, partnerName, weddingRole } = updates;

        await user.update({
            fullName: fullName ?? user.fullName,
            phone: phone ?? user.phone,
            password: password ?? user.password,
            role: role ?? user.role,
            status: typeof status !== 'undefined' ? (status === 1) : user.status
        });

        if ((role ?? user.role) === userRole.owner) {
            // upsert restaurant partner
            const rp = await RestaurantPartnerModel.findByPk(id);
            if (rp) {
                await rp.update({
                    licenseUrl: licenseUrl ?? rp.licenseUrl,
                    status: typeof negotiationStatus !== 'undefined' ? negotiationStatus : rp.status,
                    commissionRate: typeof commissionRate !== 'undefined' ? commissionRate : rp.commissionRate
                });
            } else {
                await RestaurantPartnerModel.create({
                    restaurantPartnerID: id,
                    licenseUrl: licenseUrl || '',
                    status: negotiationStatus ?? negoStatus.pending,
                    commissionRate: commissionRate || null
                });
            }
        }

        if ((role ?? user.role) === userRole.customer) {
            const cu = await CustomerModel.findByPk(id);
            if (cu) {
                await cu.update({ partnerName: partnerName ?? cu.partnerName, weddingRole: weddingRole ?? cu.weddingRole });
            } else {
                await CustomerModel.create({ customerID: id, partnerName: partnerName || '', weddingRole: weddingRole || coupleRole.other });
            }
        }

        return this.getUserById(id);
    }

    static async deleteUser(id) {
        await RestaurantPartnerModel.destroy({ where: { restaurantPartnerID: id } });
        await CustomerModel.destroy({ where: { customerID: id } });
        const affected = await UserModel.destroy({ where: { userID: id } });
        return affected > 0;
    }

    static async findByEmail(email) {
        const user = await UserModel.findOne({
            where: { email },
            include: [
                { model: CustomerModel, as: 'customer' },
                { model: RestaurantPartnerModel, as: 'restaurantpartner' }
            ]
        });
        return user ? user.get({ plain: true }) : null;
    }
    static async getCustomers() {
        const customers = await UserModel.findAll({
            where: { role: userRole.customer },
            include: [{ model: CustomerModel, as: 'customer' }]
        });
        return customers.map(c => c.get({ plain: true }));
    }
    static async getOwners() {
        const owners = await UserModel.findAll({
            where: { role: userRole.owner },
            include: [{ model: RestaurantPartnerModel, as: 'restaurantpartner' }]
        });
        return owners.map(o => o.get({ plain: true }));
    }
}

export default UserDAO;