class User{
    constructor(userID, email, fullName, phone, password, role, status, createdAt = null) {
        this.userID = userID;
        this.email = email;
        this.fullName = fullName;
        this.phone = phone;
        this.password = password;
        this.role = role; // -- 0: CUSTOMER, 1: OWNER, 2: ADMIN
        this.status = status; //0: INACTIVE, 1: ACTIVE
        this.createdAt = createdAt;
    }
}
export const userRole = {
        customer:0,
        owner:1,
        admin:2
}
export const userStatus = {
    inactive:0,
    active:1
}
export default User;