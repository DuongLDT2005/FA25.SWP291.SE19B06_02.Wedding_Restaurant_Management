// // need to store otp and expiration in the user document
// import mongosh from "mongoose";
// const { Schema } = mongoose;
// const userSchema = new Schema({
//   userId: { type: String, required: true, unique: true },
//   otp: { type: String },
//   otpExpiration: { type: Date },
// });

// const Otp = mongosh.model("Otp", userSchema);
// export default Otp;