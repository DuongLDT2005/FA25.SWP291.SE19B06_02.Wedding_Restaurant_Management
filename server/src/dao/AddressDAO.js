import db from "../config/db.js";
const { address } = db;
class AddressDAO{
    static async getByID(addressID){
        return await address.findByPk(addressID);
    }
    static async getAllAddress(addressData){
        return await address.findAll();
    }
}

export default AddressDAO;