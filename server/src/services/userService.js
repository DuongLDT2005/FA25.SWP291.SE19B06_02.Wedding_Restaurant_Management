import UserDAO from "../dao/userDao.js";
import { hashPassword } from "./AuthServices.js";
class UserService {
     static async signUpCustomer(userData) {
        if (!userData) {
            throw new Error('User data cannot be null');
        }
        if (userData.password) {
            userData.password = await hashPassword(userData.password);
        }
        
        const newCustomer = await UserDAO.createCustomer(userData);
        return newCustomer;
        }
    
    static async signUpOwner(userData) {
        if (!userData) {
            throw new Error('User data cannot be null');
        }
        if (userData.password) {
            userData.password = await hashPassword(userData.password);
        }
        const newOwner = await UserDAO.createOwner(userData);
        return newOwner;
    }
    static async updateUser(id,userData) {
        if (!userData || !id) {
            throw new Error('User data or User ID cannot be null');
        }
        const updatedUser = await UserDAO.updateUserInfo(id, userData);
        return updatedUser;
    }
    static async getAllUsers() {
        const users = await UserDAO.getAllUsers();
        return users;
    }
    static async deleteUser(userId) {
        if (!userId) {
            throw new Error('User ID cannot be null');
        }
        await UserDAO.deleteUser(userId);
    }

    static async getAllCustomers() {
        const customers = await UserDAO.getCustomers();
        return customers;
    }
    static async getAllOwners() {
        const owners = await UserDAO.getOwners();
        return owners;
    }
    static async getUserById(userId) {
        if (!userId) {
            throw new Error('User ID cannot be null');
        }
        const user = await UserDAO.getUserById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }

    static async updateUserStatus(userId, status) {
        if (!userId) {
            throw new Error('User ID cannot be null');
        }
        const updatedUser = await UserDAO.updateStatusUser(userId, status);
        return updatedUser;
    }
    
    
}
export default UserService;