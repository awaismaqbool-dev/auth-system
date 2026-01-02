import express from "express";
import { userDashboard } from "../controllers/userController.js";
import authMiddelwear from "../middelWear/authMiddelWear.js";

const userRouter= express.Router();
 userRouter.get("/",authMiddelwear, userDashboard ) ;
 export default userRouter;
