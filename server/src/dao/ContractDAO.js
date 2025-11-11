import db from "../config/db.js";
import { Op } from 'sequelize';
import { toDTO, toDTOs } from '../utils/convert/dto.js';
const { sequelize, contract } = db;
//   status TINYINT UNSIGNED NOT NULL DEFAULT 0,
//     -- 0: PENDING           (vừa generate)
//     -- 1: PARTNER_UPLOADED  (partner đã upload bản ký)
//     -- 2: CUSTOMER_UPLOADED (customer đã upload bản ký → hoàn tất)
//     -- 3: CANCELLED         (hủy)
//     -- 4: SUPERSEDED        (bị thay thế)
const status ={
    PENDING: 0,
    PARTNER_UPLOADED: 1,
    CUSTOMER_UPLOADED: 2,
    CANCELLED: 3,
    SUPERSEDED: 4,
}

class ContractDAO {
    static async getByRestaurantID(restaurantID) {
        const rows = await contract.findAll({
            where: { restaurantID },
            attributes: ['contractID', 'bookingID', 'contractURL', 'signedDate', 'status']
        });
        return toDTOs(rows);
    }
    static async getByID(contractID) {
        const r = await contract.findByPk(contractID, {
            attributes: ['contractID', 'bookingID', 'contractURL', 'signedDate', 'status']
        });
        return toDTO(r);
    }
    static async addContract(bookingID, restaurantID, contractURL, signedDate, status) {
        const c = await contract.create({ bookingID, restaurantID, contractURL, signedDate, status });
        return toDTO(c);
    }
    static async updateContract(contractID, contractData) {
        const [count] = await contract.update(contractData, { where: { contractID } });
        return count > 0;
    }
    static async deleteContract(contractID) {
        const count = await contract.destroy({ where: { contractID } });
        return count > 0;
    }
}
export default ContractDAO;
export const ContractStatus = status;