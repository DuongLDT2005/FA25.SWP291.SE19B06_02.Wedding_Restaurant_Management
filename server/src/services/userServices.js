import UserDAO from "../dao/userDao.js";

class UserService {
    static async createOwner(ownerData) {
        const newOwner =  await UserDAO.createOwner(ownerData);
        return newOwner;
    }
    static async createCustomer(customerData) {
        const newCustomer = await UserDAO.createCustomer(customerData);
        return newCustomer;
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