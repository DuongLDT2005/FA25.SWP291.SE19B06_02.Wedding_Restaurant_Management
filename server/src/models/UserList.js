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

    findUserById(id) {
        return this.users.find(user => user.id === id);
    }

    removeUser(id) {
        this.users = this.users.filter(user => user.id !== id);
    }
}
export default UserList;