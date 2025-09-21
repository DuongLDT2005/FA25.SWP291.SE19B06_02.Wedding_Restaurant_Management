import db from '../config/db.js';
import User from '../models/user.js';
import UserList from '../models/UserList.js';

class UserDAO {
    static async getAllUsers() {
        const [rows] = await db.query('SELECT userID, fullName, email FROM User'); // rows 
        const userList = new UserList();
        rows.forEach(row => {
            const user = new User(row.userID, row.email, row.fullName, row.phone, row.password, row.role, row.status);
            userList.addUser(user);
        });
        return userList;
    }
    static async getOwners() {
        const [rows] = await db.query('SELECT userID, fullName, email FROM User WHERE role = ?', ['owner']);
        const userList = new UserList();
        rows.forEach(row => {
            const user = new User(row.userID, row.email, row.fullName, row.phone, row.password, row.role, row.status);
            userList.addUser(user);
        });
        return userList;
    }
    static async getcustomers() {
        const [rows] = await db.query('SELECT userID, fullName, email FROM User WHERE role = ?', ['customer']);
        const userList = new UserList();
        rows.forEach(row => {
            const user = new User(row.userID, row.email, row.fullName, row.phone, row.password, row.role, row.status);
            userList.addUser(user);
        });
        return userList;
    }
    static async getUserById(id) {
        const [rows] = await db.query('SELECT userID, fullName, email FROM User WHERE userID = ?', [id]);
        if (rows.length === 0) return null;
        const row = rows[0];
        return new User(row.userID, row.email, row.fullName, row.phone, row.password, row.role, row.status);
    }
    static async createUser(user) {
        const { email, fullName, phone, password, role, status } = user;
        const [result] = await db.query(
            'INSERT INTO User (email, fullName, phone, password, role, status) VALUES (?, ?, ?, ?, ?, ?)',
            [email, fullName, phone, password, role, status]
        );
        return new User(result.insertId, email, fullName, phone, password, role, status);
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
