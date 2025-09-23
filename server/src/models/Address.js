class Address {
  constructor({ addressID, number, street, ward, fullAddress }) {
    this.addressID = addressID;
    this.number = number;
    this.street = street;
    this.ward = ward;
    this.fullAddress = fullAddress; // tự động sinh trong DB
  }
}

export default Address;
