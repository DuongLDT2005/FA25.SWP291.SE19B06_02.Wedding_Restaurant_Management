class UserList {
    constructor() {
        this.users = [];
    }

    addUser(user) {
        this.users.push(user);
    }

    getUsers() {
        return this.users;
    }

    getOwners() {
        // filter by role
        return this.users.filter(user => user.role === 1);
        // return this.users.filter(user => user instanceof Owner);
    }

    getCustomers() {
        return this.users.filter(user => user.role === 0);
        // return this.users.filter(user => user instanceof Customer);
    }

    getAdmins() {
        return this.users.filter(user => user.role === 2);
    }

    findUserById(id) {
        return this.users.find(user => user.userID === id);
    }

    removeUser(id) {
        this.users = this.users.filter(user => user.userID !== id);
    }
}

export default UserList;