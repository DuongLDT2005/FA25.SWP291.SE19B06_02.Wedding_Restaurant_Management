import User from "./User.js";

class Owner extends User {
    constructor(userID, email, fullName, phone, password, role, status, createdAt, licenseUrl, negotiationStatus, commissionRate) {
        super(userID, email, fullName, phone, password, role, status, createdAt);
        this.licenseUrl = licenseUrl; // url image license
        this.negotiationStatus = negotiationStatus; //  0: pending, 1: rejected, 2: negotiating, 3: active, 4: inactive
        this.commissionRate = commissionRate; // commission rate for admin
    }
}
export const negoStatus = {
    pending:0,
    rejected:1,
    negotiating:2,
    active:3,
    inactive:4
} 
export default Owner;