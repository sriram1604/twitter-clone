import express from 'express';
import dotenv from 'dotenv';
import authRoute from './routes/authRoute.js';
import connectDB from './db/connectionDB.js';
import cookieParser from 'cookie-parser';
import userRoute from "./routes/userRoute.js";
import postRoute from "./routes/postRoute.js";
import notificationRoute from './routes/notificationRoute.js';
import cloudinary from 'cloudinary';
import cors from 'cors';
import path from 'path'
dotenv.config()

const app = express();
const port = process.env.PORT;
const __dirname = path.resolve();
app.use(express.json({
    limit : "10mb"
}))
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET_KEY
})
app.use(cors({
    origin : "http://localhost:3000",
    credentials : true
}))

app.use("/api/auth", authRoute);
app.use("/api/users" , userRoute);
app.use("/api/posts",postRoute);
app.use("/api/notifications", notificationRoute);

if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname,"/frontend/build")))
    app.use("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,"frontend","build","index.html"))
    })
}


app.listen(port, ()=>{
    console.log(`server is running in ${port}`);
    connectDB();
})