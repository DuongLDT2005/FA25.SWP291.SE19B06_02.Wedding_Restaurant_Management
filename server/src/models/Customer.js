import User from "./User.js";

class Customer extends User {
    constructor(userID, email, fullName, phone, password, role, status, partnerName, weddingRole) {
        super(userID, email, fullName, phone, password, role, status);
        this.partnerName = partnerName; // Tên người phối ngẫu
        this.weddingRole = weddingRole; // 0 - Cô dâu, 1 - Chú rể, 2 - Khác
    }
}

export default Customer;