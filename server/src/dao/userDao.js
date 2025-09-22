import db from '../config/db.js';
import User from '../models/User.js';
import UserList from '../models/UserList.js';
import Owner from '../models/Owner.js';
import Customer from '../models/Customer.js';
class UserDAO {
    static async getAllUsers() {
    const [rows] = await db.query(`
        SELECT u.userID, u.fullName, u.email, u.phone, u.password, u.role, u.status,
               o.licenseUrl, o.status, o.commissionRate,
               c.partnerName, c.weddingRole
        FROM User u
        LEFT JOIN Owner o ON u.userID = o.ownerID
        LEFT JOIN Customer c ON u.userID = c.customerID
    `);
    const userList = new UserList();
    rows.forEach(row => {
        let user;
        if (row.role === 1) {
            user = new Owner(
                row.userID,
                row.email,
                row.fullName,
                row.phone,
                row.password,
                row.role,
                row.status,
                row.licenseUrl,
                row.negotiationStatus,
                row.commissionRate
            );
        } else if (row.role === 0) {
            user = new Customer(
                row.userID,
                row.email,
                row.fullName,
                row.phone,
                row.password,
                row.role,
                row.status,
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
                row.status
            );
        }
        userList.addUser(user);
    });
    return userList;
}
    static async getUserById(id) {
    const [rows] = await db.query(`
        SELECT u.userID, u.fullName, u.email, u.phone, u.password, u.role, u.status,
               o.licenseUrl, o.status, o.commissionRate,
               c.partnerName, c.weddingRole
        FROM User u
        LEFT JOIN Owner o ON u.userID = o.ownerID
        LEFT JOIN Customer c ON u.userID = c.customerID
        WHERE u.userID = ?
    `, [id]);
    if (rows.length === 0) return null;
    const row = rows[0];
    if (row.role === 1) {
        return new Owner(
            row.userID,
            row.email,
            row.fullName,
            row.phone,
            row.password,
            row.role,
            row.status,
            row.licenseUrl,
            row.negotiationStatus,
            row.commissionRate
        );
    } else if (row.role === 0) {
        return new Customer(
            row.userID,
            row.email,
            row.fullName,
            row.phone,
            row.password,
            row.role,
            row.status,
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
            row.status
        );
    }
}
    static async createUser(user) {
    const { email, fullName, phone, password, role, status, licenseUrl, negotiationStatus, commissionRate, partnerName, weddingRole } = user;

    // User
    const [result] = await db.query(
        'INSERT INTO User (email, fullName, phone, password, role, status) VALUES (?, ?, ?, ?, ?, ?)',
        [email, fullName, phone, password, role, status]
    );
    const userID = result.insertId;

    //Owner
    if (role === 1) {
        await db.query(
            'INSERT INTO Owner (ownerID, licenseUrl, status, commissionRate) VALUES (?, ?, ?, ?)',
            [userID, licenseUrl || '', negotiationStatus || 0, commissionRate || 0]
        );
        return new Owner(userID, email, fullName, phone, password, role, status, licenseUrl, negotiationStatus, commissionRate);
    }

    //Customer
    if (role === 0) {
        await db.query(
            'INSERT INTO Customer (customerID, partnerName, weddingRole) VALUES (?, ?, ?)',
            [userID, partnerName || '', weddingRole || 0]
        );
        return new Customer(userID, email, fullName, phone, password, role, status, partnerName, weddingRole);
    }

    // user default
    return new User(userID, email, fullName, phone, password, role, status);
}
    static async updateUser(id, user) {
        const { email, fullName, phone, password, role, status } = user;
        await db.query(
            'UPDATE User SET email = ?, fullName = ?, phone = ?, password = ?, role = ?, status = ? WHERE userID = ?',
            [email, fullName, phone, password, role, status, id]
        );
        return new User(id, email, fullName, phone, password, role, status);
    }
    static async deleteUser(id) {
        const [result] = await db.query('DELETE FROM User WHERE userID = ?', [id]);
        return result.affectedRows > 0;
    }
}

export default UserDAO;
