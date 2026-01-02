import express from "express";
import { register, login, logOut, sendVerifyOtp, verifyEmail,sendRestOtp,changePassword,verifyotpForget} from "../controllers/authController.js";
import authMiddelwear from "../middelWear/authMiddelWear.js";

const authRouters = express.Router();

authRouters.post("/register", register);
authRouters.post("/login", login);
authRouters.post("/logout", logOut);
authRouters.post("/send-otp", authMiddelwear,sendVerifyOtp);
authRouters.post("/verify-email", authMiddelwear,verifyEmail);
authRouters.post("/forget-pasword", sendRestOtp);
authRouters.post("/verify-otp",verifyotpForget);
authRouters.post("/change-Password", changePassword);
export default authRouters;

// authRouters.post("/resend-otp", authMiddelwear,resendOtp);
// authRouters.post("/verify-Email-new-Otp", authMiddelwear,verifyEmail_newOtp);
//resendOtp,verifyEmail_newOtp,