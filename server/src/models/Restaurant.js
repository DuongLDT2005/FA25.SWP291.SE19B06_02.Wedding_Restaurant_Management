class Restaurant {
  constructor({
    restaurantID,
    restaurantPartnerID,
    name,
    description,
    hallCount,
    addressID,
    thumbnailURL,
    status,
  }) {
    this.restaurantID = restaurantID;
    this.restaurantPartnerID = restaurantPartnerID;
    this.name = name;
    this.description = description;
    this.hallCount = hallCount;
    this.addressID = addressID;
    this.thumbnailURL = thumbnailURL;
    this.status = status;
  }
}

export default Restaurant;