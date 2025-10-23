class Restaurant {
  constructor({
    restaurantID,
    restaurantPartnerID,
    name,
    description,
    hallCount = 0,
    addressID,
    thumbnailURL,
    avgRating = 0.0,
    totalReviews = 0,
    status = 1,
  }) {
    this.restaurantID = restaurantID;
    this.restaurantPartnerID = restaurantPartnerID;
    this.name = name;
    this.description = description;
    this.hallCount = hallCount;
    this.addressID = addressID;
    this.thumbnailURL = thumbnailURL;
    this.avgRating = avgRating;
    this.totalReviews = totalReviews;
    this.status = status;
  }
}

export default Restaurant;
