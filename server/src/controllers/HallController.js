import HallServices from "../services/HallServices.js";
class HallController {
    static async createHall(req, res) {
        try {
            const hallData = req.body;
            if (!hallData) {
                return res.status(400).json({ error: 'Request body cannot be null' });
            }
            const newHall = await HallServices.createHall(hallData);
            res.status(201).json(newHall);
        } catch (error) {
            console.error('Error creating hall:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    static async getHallById(req, res) {
        try {
            const hall = await HallServices.getHallById(req.params.id);
            if (!hall) {
                return res.status(404).json({ error: 'Hall not found' });
            }
            res.json(hall);
        } catch (error) {
            console.error('Error fetching hall by ID:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    static async getHallsByRestaurantId(req, res) {
        try {
            const halls = await HallServices.getHallsByRestaurantId(req.params.restaurantId);
            res.json(halls);
        } catch (error) {
            console.error('Error fetching halls by restaurant ID:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    static async updateHall(req, res) {
        try {
            const hallData = req.body;
            const updatedHall = await HallServices.updateHall(req.params.id, hallData);
            res.json(updatedHall);
        } catch (error) {
            console.error('Error updating hall:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    static async deleteHall(req, res) {
        try {
            const success = await HallServices.deleteHall(req.params.id);
            if (!success) {
                return res.status(404).json({ error: 'Hall not found' });
            }
            res.json({ success: true });
        } catch (error) {
            console.error('Error deleting hall:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    static async updateHallStatus(req, res) {
        try {
            const { status } = req.body;
            const updatedHall = await HallServices.updateHallStatus(req.params.id, status);
            if (!updatedHall) {
                return res.status(404).json({ error: 'Hall not found' });
            }
            res.json(updatedHall);
        } catch (error) {
            console.error('Error updating hall status:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}
export default HallController;