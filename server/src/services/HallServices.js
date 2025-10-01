import HallDAO from "../dao/HallDAO.js";
import HallImageDAO from "../dao/HallImageDao.js";
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
    static async addHallImage(hallID, imageURL) {
        if (!hallID || !imageURL) {
            throw new Error('Hall ID or Image URL cannot be null');
        }
        const newImage = await HallImageDAO.createHallImage(hallID, imageURL);
        return newImage;
    }
    static async getHallImages(hallID) {
        if (!hallID) {
            throw new Error('Hall ID cannot be null');
        }
        const images = await HallImageDAO.getByHallId(hallID);
        return images;
    }
    static async deleteHallImage(imageID) {
        if (!imageID) {
            throw new Error('Image ID cannot be null');
        }
        const success = await HallImageDAO.deleteHallImage(imageID);
        return success;
    }
    
}

export default HallServices;