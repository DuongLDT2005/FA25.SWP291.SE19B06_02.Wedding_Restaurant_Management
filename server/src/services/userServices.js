import UserDAO from "../dao/userDao.js";
import db from "../config/db.js";

const { user, restaurantpartner } = db;

class UserService {
  // --------------------
  // USER CRUD
  // --------------------
  static async createOwner(ownerData) {
    return await UserDAO.createOwner(ownerData);
  }

  static async createCustomer(customerData) {
    return await UserDAO.createCustomer(customerData);
  }

  static async updateUser(id, userData) {
    if (!userData || !id) throw new Error("User data or ID missing");
    return await UserDAO.updateUserInfo(id, userData);
  }

  static async getAllUsers() {
    return await UserDAO.getAllUsers();
  }

  static async deleteUser(userId) {
    if (!userId) throw new Error("User ID cannot be null");
    return await UserDAO.deleteUser(userId);
  }

  static async getAllCustomers() {
    return await UserDAO.getCustomers();
  }

  static async getAllOwners() {
    return await UserDAO.getOwners();
  }

  static async getUserById(userId) {
    if (!userId) throw new Error("User ID cannot be null");
    return await UserDAO.getUserById(userId);
  }

  static async updateUserStatus(userId, status) {
    if (!userId) throw new Error("User ID cannot be null");
    return await UserDAO.updateStatusUser(userId, status);
  }

  // --------------------
  // PARTNER / OWNER LICENSE LOGIC
  // --------------------

  /** 🟡 Đối tác đang chờ phê duyệt */
  static async getPendingPartners() {
    return await user.findAll({
      where: { role: 1 },
      include: [
        {
          model: restaurantpartner,
          as: "partner", // <-- alias đúng
          where: { status: 1 }, // 1 = pending
          required: true,
        },
      ],
    });
  }

  /** 🟢 Đối tác đã phê duyệt */
  static async getApprovedPartners() {
    return await user.findAll({
      where: { role: 1 },
      include: [
        {
          model: restaurantpartner,
          as: "partner",
          where: { status: 3 }, // approved
          required: true,
        },
      ],
    });
  }

  /** ✔ Approve */
  static async approvePartner(userID) {
    return await restaurantpartner.update(
      { status: 3 },
      { where: { restaurantPartnerID: userID } }
    );
  }

  /** ❌ Reject */
  static async rejectPartner(userID) {
    return await restaurantpartner.update(
      { status: 4 }, // rejected
      { where: { restaurantPartnerID: userID } }
    );
  }
}

export default UserService;
