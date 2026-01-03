import userModel from "../userModel/userModel.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import transporter from "../config/nodeMailer.js";

// REGISTER
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.json({
      success: false,
      message: "Missing Details",
    });
  }
  try {
    const existEmail = await userModel.findOne({ email });
    if (existEmail) {
      return res.json({ success: false, message: "User Already Exist" });
    }
    const hashedPassword = await bcryptjs.hash(password, 13);
    const user = new userModel({ name, email, password: hashedPassword, isAccountVerified:false });
    await user.save();

    //jwt token code
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true,
            secure: process.env.NODE_ENV === "production",
      sameSite:process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    //nodemailer

    const mailInfo = {
      from: process.env.SENDER_EMAIL, // sender address
      to: email, // list of receivers
      subject: "Email Confirmation", // Subject line
      text: `Welcome to Awais Maqbool website. Your account has been created with email id:${email}  `, // plain text body
      //   html: "<b>Hello world?</b>", // html body
    };
    const info = await transporter.sendMail(mailInfo);
    console.log("Message ID:", info.messageId);
    console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
    //
    return res.json({
      success: true,
      message: "Registered Successfully and Mail Sent",
      mailId: info.messageId,
      isAccountVerified: user.isAccountVerified,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//login funtion
export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({
      success: false,
      message: "Missing Details",
    });
  }

  try {
    const existEmail = await userModel.findOne({ email });
    if (!existEmail) {
      return res.json({ success: false, message: "User not found" });
    }

    const isMatch = await bcryptjs.compare(password, existEmail.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Incorrect password" });
    }
    const token = jwt.sign({ id: existEmail._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true,
            secure: process.env.NODE_ENV === "production",
      sameSite:process.env.NODE_ENV === "production" ? "none" : "strict",
      //sameSite:"lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.json({ success: true, message: "Login Successful", userData: {
    id: existEmail._id,           // ✅ existEmail use karo
    name: existEmail.name,
    email: existEmail.email,
    isAccountVerified: existEmail.isAccountVerified  
  }
     });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// LOGOUT
export const logOut = async (req, res) => {
  try {
    res.clearCookie("token",{
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite:process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    return res.json({ success: true, message: "Logged Out Successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//send Verify Otp funtion
export const sendVerifyOtp = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (user.isAccountVerified) {
      return res.json({ success: false, message: "User Already verified" });
    }
    user.verifyotp = String(Math.floor(1000 + Math.random() * 9000));
    user.verifyotpExpireAt = Date.now() + 2 * 60 * 60 * 1000;
    await user.save();
    //nodemailer
    const mailInfo = {
      from: process.env.SENDER_EMAIL, // sender address
      to: user.email, // list of receivers
      subject: "Email Verfication", // Subject line
      text: `For Verification your OPT is :  ${user.verifyotp}  
      please put OPT in verfiy your account `, // plain text body
    };
    const info = await transporter.sendMail(mailInfo);
    console.log("Message ID:", info.messageId);
    console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
    res.json({ success: true, message: "OTP sent successfully" });
    //
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// verify account
export const verifyEmail = async (req, res) => {
  const userId = req.userId;
  const { otp } = req.body;
  if (!userId || !otp) {
    return res.json({ success: false, message: "Missing Deatails" });
  }
  try {
    const user = await userModel.findById(userId);
    if (user.isAccountVerified) {
      return res.json({
        success: false,
        message: "Your Acount is already varified",
      });
    }
    if (!user) {
      return res.json({
        success: false,
        message: "user not found please login again",
      });
    }
    if (otp === "" || otp !== user.verifyotp || user.verifyotp === "") {
      return res.json({
        success: false,
        message: "wrong OTP please put correct otp ",
      });
    }
    if (user.verifyotpExpireAt < Date.now()) {
      return res.json({
        success: false,
        message: "OTP has time out. Resend again",
      });
    }
    user.isAccountVerified = true;
    user.verifyotp = "";
    user.verifyotpExpireAt = 0;
    await user.save();
    return res.json({ success: true, message: "Your Acount is varified" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// forget pasword otp
export const sendRestOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.json({
      success: false,
      message: "Missing Details",
    });
  }
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    user.verifyotp = String(Math.floor(1000 + Math.random() * 9000));
    user.verifyotpExpireAt = Date.now() + 15 * 60 * 1000;
    await user.save();
    //nodemailer
    const mailInfo = {
      from: process.env.SENDER_EMAIL, // sender address
      to: user.email, // list of receivers
      subject: "Password Reset OTP", // Subject line
      text: `your OPT is: ${user.verifyotp} 
      for you reseting you password please put OPT and retype your password `, // plain text body
    };
    const info = await transporter.sendMail(mailInfo);

    console.log("Message ID:", info.messageId);
    console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
    res.json({ success: true, message: "OTP sent to your email" });
    //
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// verify otp for forgetpassword
export const verifyotpForget = async (req, res) => {
  const {otp, email} = req.body;
  if (!otp||!email) {
    return res.json({ success: false, message: "OTP not valid or Email not Valid" });
  }
  try {

    // const userId = req.userId;
    const user = await userModel.findOne({email});
        if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    if (otp === "" || otp !== user.verifyotp || user.verifyotp === "") {
      return res.json({
        success: false,
        message: "wrong OTP please put correct otp ",
      });
    }
    if (user.verifyotpExpireAt < Date.now()) {
      return res.json({
        success: false,
        message: "OTP has time out. Resend again",
      });
    }
    user.verifyotp = "";
    user.verifyotpExpireAt = 0;
    await user.save();
    return res.json({ success: true, message: "OTP matched" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// chnage password
export const changePassword = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({
      success: false,
      message: "Missing Details",
    });
  }
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "user not found" });
    }
    const hashedPassword = await bcryptjs.hash(password, 13);
    user.password = hashedPassword;
    await user.save();
    res.clearCookie("token", {
      httponly: true,
      secure: process.env.NODE_ENV === "production",
      samesite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    return res.json({
      success: true,
      message: "password has been chnaged successfully",
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};







