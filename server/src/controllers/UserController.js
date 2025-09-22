import UserDAO from "../dao/userDao.js";

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

    static async createUser(req, res) {
        try {
            if (!req.body) {
                return res.status(400).json({ error: 'Request body cannot be null' });
            }
            const newUser = await UserDAO.createUser(req.body);
            res.status(201).json(newUser);
        } catch (error) {
            console.error('Error creating user:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async updateUser(req, res) {
        try {
            const updatedUser = await UserDAO.updateUser(req.params.id, req.body);
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