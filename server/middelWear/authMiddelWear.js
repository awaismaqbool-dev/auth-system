import jwt from "jsonwebtoken";


const authMiddelwear= async (req,res,next)=>{

    const {token} =req.cookies;
if (!token) {
    return res.status(401).json({ 
        success: false, 
        message: "Session expired. Please log in again." 
      }); 
}
try {
    const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = tokenDecoded.id;
    next();
  } catch (error) {
    return res.status(401).json({  // Added return aur status code
      success: false,
      message: "Token invalid or expired. Please log in again."
    });
  }
};
export default authMiddelwear;



