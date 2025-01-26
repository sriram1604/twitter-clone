import User from '../models/userModel.js'
import bcrypt from 'bcryptjs';
import generateToken from '../utils/generateToken.js';
export const signup = async (req , res)=>{
    try{
        const {username,email,fullName,password} = req.body;
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if(!emailRegex.test(email)){
            return res.status(400).json({error : "Invalid email format"})
        }
        const existingEmail = await User.findOne({email})
        const existingUsername = await User.findOne({username})

        if(existingEmail || existingUsername){
            return res.status(400).json({error : "User Already Exists..."})
        }
        if(password.length < 6){
            return res.status(400).json({error : "Minimum 6 characters required..."})
        }
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password,salt);
        const newUser = new User({
            username,
            fullName,
            email,
            password : hashPassword
        })
        if(newUser){
            generateToken(newUser._id , res)
            await newUser.save();
            res.status(200).json({
                _id : newUser._id,
                username : newUser.username,
                fullName : newUser.fullName,
                email : newUser.email,
                followers : newUser.followers,
                following : newUser.following,
                profileImg : newUser.profileImg,
                coverImg : newUser.coverImg,
                bio : newUser.bio,
                link : newUser.link
            });
        }else{
            res.status(400).json({error : "Invalid User data"});
        }
    }catch(err){
        console.log(`sign-in connection error : ${err}`);
        res.status(500).json({error : "Internal server error"})
    }
}
export const login = async(req,res)=>{
    try {
        const {username , password} = req.body;
        const user = await User.findOne({username})
        const isPasswordCorrect = await bcrypt.compare(password,user.password || "");
        if(!user || !isPasswordCorrect){
            return res.status(400).json({ error : "Invalid Username or Password"})
        }
        if(!user){
            return res.status(400).json({ error : "Invalid Username or Password"})
        }
        generateToken(user._id , res);
        res.status(200).json({
            _id : user._id,
            username : user.username,
            fullName : user.fullName,
            email : user.email,
            followers : user.followers,
            following : user.following,
            profileImg : user.profileImg,
            coverImg : user.coverImg,
            bio : user.bio,
            link : user.link
        })

    } catch (error) {
        console.log(`Error in login : ${error}`);
        res.status(500).json({error : "Internal Server Error"})
    }
}
export const logout = (req,res)=>{
    try {
        res.cookie("jwt", "" , { maxAge : 0})
        res.status(200).json({message : "Logout successfully"})
    } catch (error) {
        console.log(`Error in logout : ${error}`);
        res.status(500).json({error : "Internal Server Error"})
    }
}
export const getMe = async (req,res) => {
    try {
        const user = await User.findOne({_id : req.user._id}).select("-password");
        res.status(200).json(user);
    } catch (error) {
        console.log(`Error in logout : ${error}`);
        res.status(500).json({error : "Internal Server Error"})
    }
}