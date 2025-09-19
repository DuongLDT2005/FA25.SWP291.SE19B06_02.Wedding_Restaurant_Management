class Restaurant {
  constructor({
    restaurantID,
    ownerID,
    name,
    description,
    hallCount,
    addressID,
    thumbnailURL,
    status,
  }) {
    this.restaurantID = restaurantID;
    this.ownerID = ownerID;
    this.name = name;
    this.description = description;
    this.hallCount = hallCount;
    this.addressID = addressID;
    this.thumbnailURL = thumbnailURL;
    this.status = status;
  }
}

export default Restaurant;