import User from "./User.js";

class Customer extends User {
    constructor(userID, email, fullName, phone, password, role, status, createdAt, partnerName, weddingRole) {
        super(userID, email, fullName, phone, password, role, status, createdAt);
        this.partnerName = partnerName; // Tên người phối ngẫu
        this.weddingRole = weddingRole; // 0 - bride, 1 - groom, 2 - other
    }
}
export const coupleRole = {
    bride:0,
    groom:1,
    other:2
}
export default Customer;