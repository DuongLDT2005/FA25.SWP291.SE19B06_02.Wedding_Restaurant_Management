import HallDAO from "../dao/HallDAO";

class HallServices {
    static async createHall(hallData) {
        if (!hallData) {
            throw new Error('Hall data cannot be null');
        }
        const newHall = await HallDAO.createHall(hallData);
        return newHall;
    }
    static async getHallById(hallID) {
        if (!hallID) {
            throw new Error('Hall ID cannot be null');
        }
        const hall = await HallDAO.getHallById(hallID);
        if (!hall) {
            throw new Error('Hall not found');
        }
        return hall;
    }
    static async getHallsByRestaurantId(restaurantID) {
        if (!restaurantID) {
            throw new Error('Restaurant ID cannot be null');
        }
        const halls = await HallDAO.getHallsByRestaurantId(restaurantID);
        return halls;
    }
    static async updateHall(hallID, hallData) {
        if (!hallData || !hallID) {
            throw new Error('Hall data or Hall ID cannot be null');
        }
        const updatedHall = await HallDAO.updateHall(hallID, hallData);
        return updatedHall;
    }
    static async deleteHall(hallID) {
        if (!hallID) {
            throw new Error('Hall ID cannot be null');
        }
        const success = await HallDAO.deleteHall(hallID);
        return success;
    }
    static async updateHallStatus(hallID, status) {
        if (!hallID) {
            throw new Error('Hall ID cannot be null');
        }
        const updatedHall = await HallDAO.updateHallStatus(hallID, status);
        return updatedHall;
    }
}

export default HallServices;