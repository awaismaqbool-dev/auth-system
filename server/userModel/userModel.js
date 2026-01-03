import mongoose from "mongoose";

const userSachema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  verifyotp: { type: String, default: "" },
  verifyotpExpireAt: { type: Number, default: 0 },
  isAccountVerified: { type: Boolean, default: false },
});
const userModel = mongoose.model("user", userSachema);

export default userModel;
