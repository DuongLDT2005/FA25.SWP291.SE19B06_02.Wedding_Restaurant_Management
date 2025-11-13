import UserDAO from "../dao/userDao.js";

class UserService {
  static async createOwner(ownerData) {
    const newOwner = await UserDAO.createOwner(ownerData);
    return newOwner;
  }

  static async createCustomer(customerData) {
    const newCustomer = await UserDAO.createCustomer(customerData);
    return newCustomer;
  }

  static async updateUser(id, userData) {
    if (!userData || !id) {
      throw new Error("User data or User ID cannot be null");
    }
    const updatedUser = await UserDAO.updateUserInfo(id, userData);
    return updatedUser;
  }

  static async getAllUsers() {
    const users = await UserDAO.getAllUsers();
    return users;
  }

  static async deleteUser(userId) {
    if (!userId) {
      throw new Error("User ID cannot be null");
    }
    await UserDAO.deleteUser(userId);
  }

  static async getAllCustomers() {
    const customers = await UserDAO.getCustomers();
    return customers;
  }

  static async getAllOwners() {
    const owners = await UserDAO.getOwners();
    return owners;
  }

  static async getUserById(userId) {
    if (!userId) {
      throw new Error("User ID cannot be null");
    }
    const user = await UserDAO.getUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  static async updateUserStatus(userId, status) {
    if (!userId) {
      throw new Error("User ID cannot be null");
    }
    const updatedUser = await UserDAO.updateStatusUser(userId, status);
    return updatedUser;
  }
  static async getPendingPartners() {
    return await user.findAll({
      where: { role: 1 },
      include: [
        {
          model: restaurantpartner,
          as: "restaurantpartner",
          where: { status: 3 }, // 3 = pending
        },
      ],
    });
  }

  static async getApprovedPartners() {
    return UserDAO.getApprovedPartners();
  }

  static async approvePartner(partnerID) {
    return await restaurantpartner.update(
      { status: 1 }, // approved
      { where: { restaurantPartnerID: partnerID } }
    );
  }

  static async rejectPartner(partnerID) {
    return await restaurantpartner.update(
      { status: 4 }, // rejected
      { where: { restaurantPartnerID: partnerID } }
    );
  }
}
export default UserService;
