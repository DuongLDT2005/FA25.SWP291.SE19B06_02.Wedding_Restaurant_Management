class User{
    constructor(userID, email, fullName, phone, password, role, status) {
        this.userID = userID;
        this.email = email;
        this.fullName = fullName;
        this.phone = phone;
        this.password = password;
        this.role = role; // -- 0: CUSTOMER, 1: OWNER, 2: ADMIN
        this.status = status; //0: INACTIVE, 1: ACTIVE
    }
}
export default User;