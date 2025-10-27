import db from "../config/db.js";

// Model key from init-models is lowercase: restaurantimage
const { restaurantimage } = db;

class RestaurantImageDAO{
    static async getByRestaurantID(restaurantID){
        return await restaurantimage.findAll({ where: { restaurantID }, attributes: ['imageID','restaurantID','imageURL'] });
    }

    static async getByID(imageID){
        return await restaurantimage.findByPk(imageID, { attributes: ['imageID','restaurantID','imageURL'] });
    }
    static async addImage(restaurantID, imageURL){
        const img = await restaurantimage.create({ restaurantID, imageURL });
        // Return a plain shape like before
        return { imageID: img.imageID, restaurantID: img.restaurantID, imageURL: img.imageURL };
    }
    
    static async deleteImage(imageID){
        const count = await restaurantimage.destroy({ where: { imageID } });
        return count > 0;
    }
}

export default RestaurantImageDAO;