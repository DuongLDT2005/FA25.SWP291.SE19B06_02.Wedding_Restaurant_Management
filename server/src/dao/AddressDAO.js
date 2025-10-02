import db from "../config/db.js";

class AddressDAO{
    static async getByID(addressID){
        const [rows] = await db.query(
            `SELECT * FROM Address WHERE addressID = ?`,
            [addressID]
        );
        return rows.length > 0 ? rows[0] : null;
    }
}

export default AddressDAO;