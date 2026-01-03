import express from "express";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import dbConnection from "./config/mongodb.js";
import authRouters from "./routers/authRouters.js";
import userModel from "./userModel/userModel.js";
import userRouter from "./routers/userRouter.js";
import { fileURLToPath } from "url";
import authMiddelwear from "./middelWear/authMiddelWear.js";
dotenv.config();

const app = express();
const port = process.env.PORT || 4000;
//db connection
dbConnection();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ 
  origin: "http://localhost:3000",
  credentials: true }));

//api endpoints
app.get("/", (req, res) => {
  res.send("Hello World!");
});
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);


// frontend static files
app.use(express.static(path.join(__dirname, "../client")));

app.get("/dashBoard", authMiddelwear, (req, res) => {
  res.sendFile(path.join(__dirname, "../client/pages/dashBoard.html"));
});

app.use("/authSystem", authRouters);
app.use("/user-dashBoard", userRouter);
app.listen(port, () => {
  console.log(`server start on ${port}`);
});
