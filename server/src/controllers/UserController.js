import UserDAO from "../dao/userDao.js";
import { hashPassword } from "../services/userService.js";

class UserController {
    static async getAllUsers(req, res) {
        try {
            const userList = await UserDAO.getAllUsers();
            res.json(userList.getUsers());
        } catch (error) {
            console.error('Error fetching users:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async getOwners(req, res) {
        try {
            const userList = await UserDAO.getAllUsers();
            res.json(userList.getOwners());
        } catch (error) {
            console.error('Error fetching owners:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async getCustomers(req, res) {
        try {
            const userList = await UserDAO.getAllUsers();
            res.json(userList.getCustomers());
        } catch (error) {
            console.error('Error fetching customers:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async getUserById(req, res) {
        try {
            const user = await UserDAO.getUserById(req.params.id);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json(user);
        } catch (error) {
            console.error('Error fetching user by ID:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async createOwner(req, res) {
        try {
            const ownerData = req.body;
            if (!ownerData) {
                return res.status(400).json({ error: 'Request body cannot be null' });
            }
            ownerData.role = 'owner'; // Set role to 'owner'
            if (ownerData.password) {
                ownerData.password = await hashPassword(ownerData.password);
            }
            const newOwner = await UserDAO.createOwner(ownerData);
            res.status(201).json(newOwner);
        } catch (error) {
            console.error('Error creating owner:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async createCustomer(req, res) {
        try {
            const customerData = req.body;
            if (!customerData) {
                return res.status(400).json({ error: 'Request body cannot be null' });
            }
            customerData.role = 'customer'; // Set role to 'customer'
            if (customerData.password) {
                customerData.password = await hashPassword(customerData.password);
            }
            const newCustomer = await UserDAO.createCustomer(customerData);
            res.status(201).json(newCustomer);
        } catch (error) {
            console.error('Error creating customer:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async updateUser(req, res) {
        try {
            const userData = req.body;
            if (userData.password) {
                userData.password = await hashPassword(userData.password);
            }
            const updatedUser = await UserDAO.updateUser(req.params.id, userData);
            res.json(updatedUser);
        } catch (error) {
            console.error('Error updating user:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async deleteUser(req, res) {
        try {
            const success = await UserDAO.deleteUser(req.params.id);
            if (!success) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json({ success: true });
        } catch (error) {
            console.error('Error deleting user:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}

export default UserController;