import User from "./User.js";

class RestaurantPartner extends User {
  constructor({
    userID,
    email,
    fullName,
    phone,
    password,
    role,
    status,
    createdAt,
    licenseUrl,
    commissionRate,
  }) {
    super({ userID, email, fullName, phone, password, role, status, createdAt });
    this.licenseUrl = licenseUrl; // Giấy phép kinh doanh
    this.commissionRate = commissionRate; // Hoa hồng (0 - 1)
  }
}

export const partnerStatus = {
  pending: 0,
  rejected: 1,
  negotiating: 2,
  active: 3,
  inactive: 4,
};

export default RestaurantPartner;
