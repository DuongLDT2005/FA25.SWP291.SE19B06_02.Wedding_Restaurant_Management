import db from '../config/db.js';
import User from '../models/User.js';
import UserList from '../models/UserList.js';
import Owner from '../models/Owner.js';
import Customer from '../models/Customer.js';
import {userRole, userStatus}  from '../models/User.js';
import { negoStatus } from '../models/Owner.js';
import { coupleRole } from '../models/Customer.js';


class UserDAO {
    
    static async getAllUsers() {
    const [rows] = await db.query(`
        SELECT u.userID, u.fullName, u.email, u.phone, u.password, u.role, u.status, u.createdAt,
               o.licenseUrl, o.status, o.commissionRate,
               c.partnerName, c.weddingRole
        FROM User u
        LEFT JOIN Owner o ON u.userID = o.ownerID
        LEFT JOIN Customer c ON u.userID = c.customerID
    `);
    const userList = new UserList();
    rows.forEach(row => {
        let user;
        if (row.role === userRole.owner) {
            user = new Owner(
                row.userID,
                row.email,
                row.fullName,
                row.phone,
                row.password,
                row.role,
                row.status,
                row.createdAt,
                row.licenseUrl,
                row.negotiationStatus,
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
                row.status,
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
                row.status,
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
               o.licenseUrl, o.status, o.commissionRate,
               c.partnerName, c.weddingRole
        FROM User u
        LEFT JOIN Owner o ON u.userID = o.ownerID
        LEFT JOIN Customer c ON u.userID = c.customerID
        WHERE u.userID = ?
    `, [id]);
    if (rows.length === 0) return null;
    const row = rows[0];
    if (row.role === userRole.owner) {
        return new Owner(
            row.userID,
            row.email,
            row.fullName,
            row.phone,
            row.password,
            row.role,
            row.status,
            row.createdAt,
            row.licenseUrl,
            row.negotiationStatus,
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
            row.status,
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
            row.status,
            row.createdAt
        );
    }
}
    static async createOwner(data) {
        const { email, fullName, phone, password, licenseUrl} = data;
        // create user with role owner (1)
        const [result] = await db.query(
            'INSERT INTO User (email, fullName, phone, password, role, status) VALUES (?, ?, ?, ?, ?, ?)',
            [email, fullName, phone, password, userRole.owner, userStatus.inactive]
        );
        const userID = result.insertId;
        // create owner
        await db.query(
            'INSERT INTO Owner (ownerID, licenseUrl, status, commissionRate) VALUES (?, ?, ?, ?)',
            [userID, licenseUrl || '',  negoStatus.inactive,  null]
        );
        return new Owner(userID, email, fullName, phone, password, userRole.owner, userStatus.inactive, new Date(), licenseUrl, negoStatus.inactive, null);
    }
    static async createCustomer(data) {
        const { email, fullName, phone, password, partnerName, weddingRole } = data;
        // create user with role customer (0)
        const [result] = await db.query(
            'INSERT INTO User (email, fullName, phone, password, role, status) VALUES (?, ?, ?, ?, ?, ?)',
            [email, fullName, phone, password, userRole.customer, userStatus.active]
        );
        const userID = result.insertId;
        // create customer
        await db.query(
            'INSERT INTO Customer (customerID, partnerName, weddingRole) VALUES (?, ?, ?)',
            [userID, partnerName || '', weddingRole || 0]
        );
        return new Customer(userID, email, fullName, phone, password, userRole.customer, userStatus.active, new Date(), partnerName, weddingRole);
    }
    static async updateUser(id, user) {
        const { email, fullName, phone, password, role, status, licenseUrl, negotiationStatus, commissionRate, partnerName, weddingRole } = user;

        // Update User table
        await db.query(
            'UPDATE User SET email = ?, fullName = ?, phone = ?, password = ?, role = ?, status = ? WHERE userID = ?',
            [email, fullName, phone, password, role, status, id]
        );

        // Update Owner table if the user is an owner
        if (role === userRole.owner) {
            await db.query(
                'UPDATE Owner SET licenseUrl = ?, status = ?, commissionRate = ? WHERE ownerID = ?',
                [licenseUrl || '', negotiationStatus || 0, commissionRate || 0, id]
            );
            return new Owner(id, email, fullName, phone, password, role, status, licenseUrl, negotiationStatus, commissionRate);
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
        // Delete from Owner table if the user is an owner
        await db.query('DELETE FROM Owner WHERE ownerID = ?', [id]);

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
                    userRow.status,
                    userRow.createdAt,
                    customerRow.partnerName,
                    customerRow.weddingRole
                );
            }
        } else if (role === userRole.owner) {
            const [ownerRows] = await db.query('SELECT * FROM Owner WHERE ownerID = ?', [userID]);
            if (ownerRows.length > 0) {
                const ownerRow = ownerRows[0];
                return new Owner(
                    userID,
                    userRow.email,
                    userRow.fullName,
                    userRow.phone,
                    userRow.password,
                    userRow.role,
                    userRow.status,
                    userRow.createdAt,
                    ownerRow.licenseUrl,
                    ownerRow.status,
                    ownerRow.commissionRate
                );
            }
        }

        return null;
    }
}

export default UserDAO;
