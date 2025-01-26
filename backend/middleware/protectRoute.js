import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
const protectRoute = async (req , res , next) => {
    try {
        const token = req.cookies.jwt;
        if(!token){
            return res.status(400).json({error : "Unauthorized : No token provided"})
        }

        const decoded = jwt.verify(token , process.env.JWT_SECRET)
        if(!decoded){
            return res.status(400).json({error : "Unauthorized : Invalid token"})
        }
        const user = await User.findOne({_id : decoded.userId}).select("-password");
        if(!user){
            return res.status(400).json({error : "Unauthorized : User not found"}) 
        }
        req.user = user;
        next();
    } catch (error) {
        console.log(`Error is protection route middleware : ${error}`);
        res.status(500).json({error : "Internal server Error"})
    }
}
export default protectRoute;