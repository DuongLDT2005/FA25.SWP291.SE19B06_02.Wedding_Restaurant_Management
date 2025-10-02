import UserService from "../services/UserService.js";
class UserController {
    static async getAllUsers(req, res) {
        try {
            const userList = await UserService.getAllUsers();
            res.json(userList);
        } catch (error) {
            console.error('Error fetching users:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async getOwners(req, res) {
        try {
            const userList = await UserService.getAllOwners();
            res.json(userList);
        } catch (error) {
            console.error('Error fetching owners:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async getCustomers(req, res) {
        try {
            const userList = await UserService.getAllCustomers();
            res.json(userList);
        } catch (error) {
            console.error('Error fetching customers:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async getUserById(req, res) {
        try {
            const user = await UserService.getUserById(req.params.id);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json(user);
        } catch (error) {
            console.error('Error fetching user by ID:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async updateUser(req, res) {
        try {
            const userData = req.body;
            const updatedUser = await UserService.updateUser(req.params.id, userData);
            res.json(updatedUser);
        } catch (error) {
            console.error('Error updating user:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async deleteUser(req, res) {
        try {
            const success = await UserService.deleteUser(req.params.id);
            if (!success) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json({ success: true });
        } catch (error) {
            console.error('Error deleting user:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    static async updateUserStatus(req, res) {
    try {
        const { status } = req.body;
        const userId = req.params.id; // Get user ID from URL params
        if (!status) {
            return res.status(400).json({ error: 'Status is required' });
        }
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }
        const updatedUser = await UserService.updateUserStatus(userId, status);
        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating user status:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
    }
}

export default UserController;