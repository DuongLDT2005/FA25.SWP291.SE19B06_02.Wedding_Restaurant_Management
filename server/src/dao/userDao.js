import db from '../config/db.js';
import User from '../models/User.js';
import UserList from '../models/UserList.js';
import RestaurantPartner from '../models/RestaurantPartner.js';
import Customer from '../models/Customer.js';
import { userRole, userStatus } from '../models/User.js';
import { negoStatus } from '../models/RestaurantPartner.js';
import { coupleRole } from '../models/Customer.js';

function bitToNumber(bitValue) {
    // Convert BIT buffer to number
    return Buffer.isBuffer(bitValue) ? bitValue[0] : bitValue;
}

class UserDAO {
    static async getAllUsers() {
        const [rows] = await db.query(`
            SELECT u.userID, u.fullName, u.email, u.phone, u.password, u.role, u.status, u.createdAt,
                   o.licenseUrl, o.status AS ownerStatus, o.commissionRate,
                   c.partnerName, c.weddingRole
            FROM User u
            LEFT JOIN RestaurantPartner o ON u.userID = o.restaurantPartnerID
            LEFT JOIN Customer c ON u.userID = c.customerID
        `);
        const userList = new UserList();
        rows.forEach(row => {
            let user;
            const status = bitToNumber(row.status);
            if (row.role === userRole.owner) {
                user = new RestaurantPartner(
                    row.userID,
                    row.email,
                    row.fullName,
                    row.phone,
                    row.password,
                    row.role,
                    status,
                    row.createdAt,
                    row.licenseUrl,
                    bitToNumber(row.ownerStatus),
                    row.commissionRate
                );
            } else if (row.role === userRole.customer) {
                user = new Customer(
                    row.userID,
                    row.email,
                    row.fullName,
                    row.phone,
                    row.password,
                    row.role,
                    status,
                    row.createdAt,
                    row.partnerName,
                    row.weddingRole
                );
            } else {
                user = new User(
                    row.userID,
                    row.email,
                    row.fullName,
                    row.phone,
                    row.password,
                    row.role,
                    status,
                    row.createdAt
                );
            }
            userList.addUser(user);
        });
        return userList;
    }

    static async getUserById(id) {
        const [rows] = await db.query(`
            SELECT u.userID, u.fullName, u.email, u.phone, u.password, u.role, u.status, u.createdAt,
                   o.licenseUrl, o.status AS ownerStatus, o.commissionRate,
                   c.partnerName, c.weddingRole
            FROM User u
            LEFT JOIN RestaurantPartner o ON u.userID = o.restaurantPartnerID
            LEFT JOIN Customer c ON u.userID = c.customerID
            WHERE u.userID = ?
        `, [id]);
        if (rows.length === 0) return null;
        const row = rows[0];
        const status = bitToNumber(row.status);
        if (row.role === userRole.owner) {
            return new RestaurantPartner(
                row.userID,
                row.email,
                row.fullName,
                row.phone,
                row.password,
                row.role,
                status,
                row.createdAt,
                row.licenseUrl,
                bitToNumber(row.ownerStatus),
                row.commissionRate
            );
        } else if (row.role === userRole.customer) {
            return new Customer(
                row.userID,
                row.email,
                row.fullName,
                row.phone,
                row.password,
                row.role,
                status,
                row.createdAt,
                row.partnerName,
                row.weddingRole
            );
        } else {
            return new User(
                row.userID,
                row.email,
                row.fullName,
                row.phone,
                row.password,
                row.role,
                status,
                row.createdAt
            );
        }
    }

    static async createOwner(data) {
        const { email, fullName, phone, password, licenseUrl } = data;
        // create user with role owner (1)
        const [result] = await db.query(
            'INSERT INTO User (email, fullName, phone, password, role, status) VALUES (?, ?, ?, ?, ?, ?)',
            [email, fullName, phone, password, userRole.owner, Buffer.from([userStatus.active])]
        );
        const userID = result.insertId;
        // create restaurant partner
        await db.query(
            'INSERT INTO RestaurantPartner (restaurantPartnerID, licenseUrl, status, commissionRate) VALUES (?, ?, ?, ?)',
            [userID, licenseUrl || '', Buffer.from([negoStatus.pending]), null]
        );
        return new RestaurantPartner(userID, email, fullName, phone, password, userRole.owner, userStatus.active, new Date(), licenseUrl, negoStatus.pending, null);
    }

    static async createCustomer(data) {
        const { email, fullName, phone, password, partnerName, weddingRole } = data;
        // create user with role customer (0)
        const [result] = await db.query(
            'INSERT INTO User (email, fullName, phone, password, role, status) VALUES (?, ?, ?, ?, ?, ?)',
            [email, fullName, phone, password, userRole.customer, Buffer.from([userStatus.active])]
        );
        const userID = result.insertId;
        // create customer
        await db.query(
            'INSERT INTO Customer (customerID, partnerName, weddingRole) VALUES (?, ?, ?)',
            [userID, partnerName || '', weddingRole || 0]
        );
        return new Customer(userID, email, fullName, phone, password, userRole.customer, userStatus.active, new Date(), partnerName, weddingRole);
    }

    static async updateStatusUser(id, status) {
        // Only allow 0 or 1 for BIT(1)
        const validStatus = status === 1 ? 1 : 0;
        const [result] = await db.query(
            'UPDATE User SET status = ? WHERE userID = ?',
            [Buffer.from([validStatus]), id]
        );
        if (result.affectedRows === 0) {
            throw new Error('User not found or status not updated');
        }
        return result.affectedRows > 0;
    }

    static async updateUserInfo(id, user) {
        const { email, fullName, phone, password, role, status, licenseUrl, negotiationStatus, commissionRate, partnerName, weddingRole } = user;

        // Fetch the existing user data
        const [existingUserRows] = await db.query('SELECT * FROM User WHERE userID = ?', [id]);
        if (existingUserRows.length === 0) {
            throw new Error('User not found');
        }
        const existingUser = existingUserRows[0];

        // Use existing values if new values are not provided
        const updatedEmail = email || existingUser.email;
        const updatedFullName = fullName || existingUser.fullName;
        const updatedPhone = phone || existingUser.phone;
        const updatedPassword = password || existingUser.password;
        const updatedRole = role || existingUser.role;
        const updatedStatus = typeof status !== 'undefined' ? Buffer.from([status === 1 ? 1 : 0]) : existingUser.status;

        // Update User table
        await db.query(
            'UPDATE User SET email = ?, fullName = ?, phone = ?, password = ?, role = ?, status = ? WHERE userID = ?',
            [updatedEmail, updatedFullName, updatedPhone, updatedPassword, updatedRole, updatedStatus, id]
        );

        // Update Owner table if the user is an owner
        if (role === userRole.owner) {
            await db.query(
                'UPDATE RestaurantPartner SET licenseUrl = ?, status = ?, commissionRate = ? WHERE restaurantPartnerID = ?',
                [licenseUrl || '', typeof negotiationStatus !== 'undefined' ? Buffer.from([negotiationStatus]) : 0, commissionRate || 0, id]
            );
            return new RestaurantPartner(id, email, fullName, phone, password, role, status, licenseUrl, negotiationStatus, commissionRate);
        }

        // Update Customer table if the user is a customer
        if (role === userRole.customer) {
            await db.query(
                'UPDATE Customer SET partnerName = ?, weddingRole = ? WHERE customerID = ?',
                [partnerName || '', weddingRole || 0, id]
            );
            return new Customer(id, email, fullName, phone, password, role, status, partnerName, weddingRole);
        }

        // Return updated User object for other roles
        return new User(id, email, fullName, phone, password, role, status);
    }

    static async deleteUser(id) {
        // Delete from RestaurantPartner table if the user is a restaurant partner
        await db.query('DELETE FROM RestaurantPartner WHERE restaurantPartnerID = ?', [id]);

        // Delete from Customer table if the user is a customer
        await db.query('DELETE FROM Customer WHERE customerID = ?', [id]);

        // Finally, delete from User table
        const [result] = await db.query('DELETE FROM User WHERE userID = ?', [id]);
        return result.affectedRows > 0;
    }

    static async findByEmail(email) {
        const [users] = await db.query('SELECT * FROM User WHERE email = ?', [email]);
        if (users.length === 0) return null;

        const userRow = users[0];
        const { userID, role } = userRow;
        const status = bitToNumber(userRow.status);

        if (role === userRole.customer) {
            const [customerRows] = await db.query('SELECT * FROM Customer WHERE customerID = ?', [userID]);
            if (customerRows.length > 0) {
                const customerRow = customerRows[0];
                return new Customer(
                    userID,
                    userRow.email,
                    userRow.fullName,
                    userRow.phone,
                    userRow.password,
                    userRow.role,
                    status,
                    userRow.createdAt,
                    customerRow.partnerName,
                    customerRow.weddingRole
                );
            }
        } else if (role === userRole.owner) {
            const [ownerRows] = await db.query('SELECT * FROM RestaurantPartner WHERE restaurantPartnerID = ?', [userID]);
            if (ownerRows.length > 0) {
                const ownerRow = ownerRows[0];
                return new RestaurantPartner(
                    userID,
                    userRow.email,
                    userRow.fullName,
                    userRow.phone,
                    userRow.password,
                    userRow.role,
                    status,
                    userRow.createdAt,
                    ownerRow.licenseUrl,
                    bitToNumber(ownerRow.status),
                    ownerRow.commissionRate
                );
            }
        }

        return null;
    }
}

export default UserDAO;