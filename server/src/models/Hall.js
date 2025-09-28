class Hall {
    constructor(hallID, restaurantID, name, description, capacity, area, price, status) {
        this.hallID = hallID;
        this.restaurantID = restaurantID;
        this.name = name;
        this.description = description;
        this.capacity = capacity;
        this.area = area;
        this.price = price;
        this.status = status;
    }
}

export const hallStatus = {
    inactive: 0,
    active: 1
}

export default Hall;